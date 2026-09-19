import { create, fromJson, type JsonValue, toJson } from "@bufbuild/protobuf";
import { timestampFromMs } from "@bufbuild/protobuf/wkt";
import {
  type Client,
  Code,
  ConnectError,
  createClient,
  type Interceptor,
  type Transport,
} from "@connectrpc/connect";
import { AgentService } from "../contracts/tank/agent/v1/agent_pb.js";
import { AuthService, PrincipalKind } from "../contracts/tank/auth/v1/auth_pb.js";
import type { BlockAction } from "../contracts/tank/blocks/v1/blocks_pb.js";
import {
  type Channel,
  ChannelService,
  ChannelType,
  type TreadGoal,
  TreadGoalSchema,
} from "../contracts/tank/channel/v1/channel_pb.js";
import { FilesService } from "../contracts/tank/files/v1/files_pb.js";
import {
  ChatService,
  type Message,
  MessageKind,
  MessageSchema,
  type PostMessageRequest,
  PostMessageRequestSchema,
} from "../contracts/tank/message/v1/message_pb.js";
import { PresenceService } from "../contracts/tank/presence/v1/presence_pb.js";
import {
  type GetBootstrapResponse,
  GetBootstrapResponseSchema,
  Role,
  WorkspaceService,
} from "../contracts/tank/workspace/v1/workspace_pb.js";
import { Backoff } from "./backoff.js";
import { Emitter } from "./emitter.js";
import { RealtimeClient, type RealtimeOptions, type WebSocketCtor } from "./realtime.js";
import { MemoryStorage, storageKeys, type TankStorage } from "./storage.js";
import { TankStore, unpackEnvelope } from "./store.js";
import { createTankTransport, type TankAuth } from "./transport.js";
import { cryptoRandomBytes, type RandomBytes, uuidv7 } from "./uuidv7.js";

export interface TankClientOptions {
  /** API origin, e.g. `https://api.tank.chat`. */
  baseUrl: string;
  /** Gateway origin, e.g. `wss://gw.tank.chat`. */
  wsUrl: string;
  auth: TankAuth;
  /** Persistence for cursors, the outbox and recent channel caches. Default: in-memory. */
  storage?: TankStorage;
  fetch?: typeof globalThis.fetch;
  WebSocket?: WebSocketCtor;
  interceptors?: Interceptor[];
  /** Replace the Connect transport entirely (tests, React Native, node). `baseUrl`/`auth`/`fetch` are then unused. */
  transport?: Transport;
  realtime?: Pick<
    RealtimeOptions,
    "heartbeatMs" | "gapBufferMs" | "backoff" | "capabilities" | "listenOnline" | "onlineSignal"
  >;
  /**
   * Random bytes for `client_msg_id` (UUIDv7). Default: `crypto.getRandomValues`.
   * Pass `(n) => Crypto.getRandomBytes(n)` from `expo-crypto` when the global is not polyfilled.
   */
  randomBytes?: RandomBytes;
  /** Messages kept per recently viewed channel in storage. Default 200. */
  cachedMessagesPerChannel?: number;
  /** Channels whose messages are cached. Default 20. */
  cachedChannels?: number;
  now?: () => number;
}

export interface SendMessageInput {
  channelId: string;
  text?: string;
  threadRootId?: string;
  richText?: PostMessageRequest["richText"];
  blocks?: PostMessageRequest["blocks"];
  fileIds?: string[];
  metadata?: PostMessageRequest["metadata"];
  alsoSendToChannel?: boolean;
  kind?: MessageKind;
}

export interface UpdateMessageInput {
  text?: string;
  richText?: PostMessageRequest["richText"];
  blocks?: PostMessageRequest["blocks"];
  metadata?: PostMessageRequest["metadata"];
}

export interface CreateChannelInput {
  workspaceId: string;
  name: string;
  /** Default `ChannelType.PUBLIC`. */
  type?: ChannelType;
  purpose?: string;
  memberIds?: string[];
}

export interface SetGoalInput {
  goal: string;
  assigneeIds?: string[];
  pipelineStatus?: string;
}

export type RoleName = "owner" | "admin" | "member" | "guest";

const ROLE_BY_NAME: Record<RoleName, Role> = {
  owner: Role.OWNER,
  admin: Role.ADMIN,
  member: Role.MEMBER,
  guest: Role.GUEST,
};

export interface LoadChannelOptions {
  /** `before` pages older than what is loaded (default); `after` pages newer (catch-up). */
  direction?: "before" | "after";
  limit?: number;
  kinds?: MessageKind[];
}

export interface TankClientEvents {
  /** The gateway asked for a full resync; bootstraps were re-run. */
  resync: undefined;
  /** An outbox entry finally failed (non-retryable or retries exhausted). */
  sendFailed: { clientMsgId: string; error: string };
}

interface OutboxEntry {
  request: PostMessageRequest;
  createdAt: number;
  attempts: number;
  inFlight?: boolean;
}

interface OutboxRecord {
  request: JsonValue;
  createdAt: number;
  attempts: number;
}

const RETRYABLE = new Set<Code>([
  Code.Unavailable,
  Code.DeadlineExceeded,
  Code.Aborted,
  Code.Internal,
  Code.Unknown,
]);
const MAX_SEND_ATTEMPTS = 6;

/**
 * Everything a TANK client app needs, wired together: typed Connect clients
 * for every service, the realtime gateway client, the normalized store, an
 * optimistic outbox, and persistence through `TankStorage`.
 */
export class TankClient {
  readonly transport: Transport;
  readonly auth: Client<typeof AuthService>;
  readonly workspaces: Client<typeof WorkspaceService>;
  readonly channels: Client<typeof ChannelService>;
  readonly chat: Client<typeof ChatService>;
  readonly presence: Client<typeof PresenceService>;
  readonly files: Client<typeof FilesService>;
  readonly agents: Client<typeof AgentService>;
  readonly realtime: RealtimeClient;
  readonly store: TankStore;
  readonly storage: TankStorage;
  readonly events = new Emitter<TankClientEvents>();

  private readonly opts: TankClientOptions;
  private readonly now: () => number;
  private readonly randomBytes: RandomBytes;
  private readonly outbox = new Map<string, OutboxEntry>();
  private readonly recentChannels: string[] = [];
  private started = false;
  private hydrated: Promise<void> | undefined;
  private typingSweep: ReturnType<typeof setInterval> | undefined;
  private persistTimer: ReturnType<typeof setTimeout> | undefined;
  private unsubscribers: Array<() => void> = [];
  private sendBackoff = new Backoff({ minMs: 500, maxMs: 15_000 });

  constructor(opts: TankClientOptions) {
    this.opts = opts;
    this.now = opts.now ?? Date.now;
    this.randomBytes = opts.randomBytes ?? cryptoRandomBytes;
    this.storage = opts.storage ?? new MemoryStorage();
    this.store = new TankStore();
    this.transport =
      opts.transport ??
      createTankTransport({
        baseUrl: opts.baseUrl,
        auth: opts.auth,
        ...(opts.fetch ? { fetch: opts.fetch } : {}),
        ...(opts.interceptors ? { interceptors: opts.interceptors } : {}),
      });
    this.auth = createClient(AuthService, this.transport);
    this.workspaces = createClient(WorkspaceService, this.transport);
    this.channels = createClient(ChannelService, this.transport);
    this.chat = createClient(ChatService, this.transport);
    this.presence = createClient(PresenceService, this.transport);
    this.files = createClient(FilesService, this.transport);
    this.agents = createClient(AgentService, this.transport);
    this.realtime = new RealtimeClient({
      wsUrl: opts.wsUrl,
      getGatewayToken: async () => (await this.auth.mintGatewayToken({})).token,
      ...(opts.WebSocket ? { WebSocket: opts.WebSocket } : {}),
      now: this.now,
      ...opts.realtime,
    });
    this.wireRealtime();
  }

  // ------------------------------------------------------------ lifecycle

  /** Hydrates from storage, opens the gateway socket and flushes the outbox. */
  async start(): Promise<void> {
    if (this.started) return;
    this.started = true;
    await this.hydrate();
    this.realtime.setWorkspaceIds(Object.keys(this.store.getState().workspaces));
    this.realtime.start();
    this.typingSweep = setInterval(
      () => this.store.dispatch({ type: "typing/expire", now: this.now() }),
      1_000,
    );
    this.unsubscribers.push(this.store.subscribe(() => this.schedulePersist()));
    void this.flushOutbox();
  }

  async stop(): Promise<void> {
    if (!this.started) return;
    this.started = false;
    this.realtime.stop();
    if (this.typingSweep) clearInterval(this.typingSweep);
    this.typingSweep = undefined;
    for (const u of this.unsubscribers) u();
    this.unsubscribers = [];
    if (this.persistTimer) clearTimeout(this.persistTimer);
    this.persistTimer = undefined;
    await this.persistNow();
  }

  /** GetBootstrap for a workspace: workspace, me, channels, read states, capped members. */
  async bootstrap(workspaceId: string): Promise<GetBootstrapResponse> {
    const res = await this.workspaces.getBootstrap({ workspaceId });
    if (res.workspace) {
      this.store.dispatch({
        type: "bootstrap",
        workspace: res.workspace,
        me: res.me,
        channels: res.channels,
        readStates: res.readStates,
        members: res.members,
      });
      this.realtime.setWorkspaceIds(Object.keys(this.store.getState().workspaces));
      await this.storage.put(
        storageKeys.bootstrap(workspaceId),
        JSON.stringify(toJson(GetBootstrapResponseSchema, res)),
      );
    }
    return res;
  }

  // ------------------------------------------------------------ reads

  /** Pages messages into the store. Resolves to whether more exist in that direction. */
  async loadChannel(channelId: string, opts: LoadChannelOptions = {}): Promise<boolean> {
    const direction = opts.direction ?? "before";
    const limit = opts.limit ?? 50;
    const state = this.store.getState();
    const loaded = this.store.selectChannelMessages(channelId).filter((m) => m.channelSeq > 0n);
    const paging = state.channelPaging[channelId];
    if (paging?.loading)
      return direction === "before" ? (paging.hasMoreBefore ?? true) : (paging.hasMoreAfter ?? false);
    if (direction === "before" && paging && !paging.hasMoreBefore && loaded.length > 0) return false;

    const oldest = loaded[0]?.channelSeq ?? 0n;
    const newest = loaded[loaded.length - 1]?.channelSeq ?? 0n;
    this.store.dispatch({ type: "paging/set", channelId, paging: { loading: true } });
    try {
      const res = await this.chat.listMessages({
        channelId,
        beforeSeq: direction === "before" ? oldest : 0n,
        afterSeq: direction === "after" ? newest : 0n,
        limit,
        kinds: opts.kinds ?? [],
      });
      this.store.dispatch({ type: "messages/upsert", messages: res.messages });
      const seqs = res.messages.map((m) => m.channelSeq).filter((s) => s > 0n);
      const min = seqs.length ? seqs.reduce((a, b) => (a < b ? a : b)) : oldest;
      const patch =
        direction === "before"
          ? {
              loading: false,
              loaded: true,
              hasMoreBefore: res.hasMore,
              oldestSeq: oldest === 0n || min < oldest ? min : oldest,
            }
          : { loading: false, loaded: true, hasMoreAfter: res.hasMore };
      this.store.dispatch({ type: "paging/set", channelId, paging: patch });
      this.touchRecent(channelId);
      return res.hasMore;
    } catch (err) {
      this.store.dispatch({ type: "paging/set", channelId, paging: { loading: false } });
      throw err;
    }
  }

  /** Loads a thread's root and replies (paging with after_thread_seq). Resolves to whether more exist. */
  async loadThread(rootId: string, opts: { limit?: number } = {}): Promise<boolean> {
    const view = this.store.selectThread(rootId);
    const after = view.replies.length ? view.replies[view.replies.length - 1]!.threadSeq : 0n;
    const res = await this.chat.getThread({
      threadRootId: rootId,
      afterThreadSeq: after,
      limit: opts.limit ?? 100,
    });
    const messages = [...(res.root ? [res.root] : []), ...res.replies];
    this.store.dispatch({ type: "messages/upsert", messages });
    return res.hasMore;
  }

  /** Subscribe to a channel's live events, mark it focused, and remember it for caching. */
  viewChannel(channelId: string): void {
    this.realtime.subscribe({ channelIds: [channelId] });
    this.realtime.focus(channelId);
    this.touchRecent(channelId);
  }

  viewThread(rootId: string): void {
    this.realtime.subscribe({ threadRootIds: [rootId] });
  }

  // ------------------------------------------------------------ writes

  /**
   * Optimistic send: the message shows up immediately under its client_msg_id,
   * is persisted to the outbox, posted (retried with backoff on transient
   * errors, resent after reconnect) and reconciled with the echoed event or
   * the RPC response, whichever comes first.
   */
  async sendMessage(input: SendMessageInput): Promise<{ clientMsgId: string }> {
    const clientMsgId = uuidv7(this.now(), this.randomBytes);
    const state = this.store.getState();
    const channel = state.channels[input.channelId];
    const request = create(PostMessageRequestSchema, {
      channelId: input.channelId,
      threadRootId: input.threadRootId ?? "",
      clientMsgId,
      text: input.text ?? "",
      richText: input.richText,
      blocks: input.blocks,
      fileIds: input.fileIds ?? [],
      kind: input.kind ?? MessageKind.MESSAGE,
      metadata: input.metadata,
      alsoSendToChannel: input.alsoSendToChannel ?? false,
    });
    const optimistic = create(MessageSchema, {
      id: clientMsgId,
      workspaceId: channel?.workspaceId ?? "",
      channelId: input.channelId,
      threadRootId: request.threadRootId,
      authorId: state.me?.id ?? "",
      authorKind: state.me?.kind ?? PrincipalKind.USER,
      kind: request.kind,
      clientMsgId,
      text: request.text,
      richText: request.richText,
      blocks: request.blocks,
      fileIds: request.fileIds,
      metadata: request.metadata,
      createdAt: timestampFromMs(this.now()),
    });
    const entry: OutboxEntry = { request, createdAt: this.now(), attempts: 0 };
    this.outbox.set(clientMsgId, entry);
    this.store.dispatch({ type: "pending/add", message: optimistic, now: this.now() });
    await this.persistOutboxEntry(clientMsgId, entry);
    void this.flushOne(clientMsgId);
    return { clientMsgId };
  }

  /** Re-attempt a failed outbox entry. */
  retryMessage(clientMsgId: string): void {
    if (!this.outbox.has(clientMsgId)) return;
    this.store.dispatch({ type: "pending/retry", clientMsgId });
    void this.flushOne(clientMsgId);
  }

  /** Drop a failed outbox entry and its optimistic row. */
  async discardMessage(clientMsgId: string): Promise<void> {
    this.outbox.delete(clientMsgId);
    this.store.dispatch({ type: "pending/discard", clientMsgId });
    await this.storage.delete(storageKeys.outbox(clientMsgId));
  }

  /**
   * Mark a channel read up to `seq` (default: the channel's newest). Optimistic.
   * With `threadRootId` set this marks the thread read up to `threadSeq` (default: the newest reply
   * known to the store) and sends only the thread fields; the channel's read seq is untouched unless
   * `seq` is passed explicitly.
   */
  async markRead(channelId: string, seq?: bigint, threadRootId = "", threadSeq?: bigint): Promise<void> {
    if (threadRootId) return this.markThreadRead(threadRootId, threadSeq, { channelId, seq });
    const state = this.store.getState();
    const target = seq ?? state.channels[channelId]?.lastSeq ?? 0n;
    const current = state.readStates[channelId]?.lastReadSeq ?? 0n;
    if (target <= current) return;
    this.store.dispatch({
      type: "readStates/updated",
      channelId,
      lastReadSeq: target,
      userId: state.me?.id ?? "",
    });
    await this.chat.markRead({ channelId, seq: target, threadRootId: "", threadSeq: 0n });
  }

  /**
   * Mark a thread read up to `threadSeq` (default: the newest reply known to the store, or the root's
   * reply_count). Optimistic: `threadReadStates[rootId]` updates immediately. The channel id comes from
   * the root message (or `opts.channelId` when the root is not loaded).
   */
  async markThreadRead(
    threadRootId: string,
    threadSeq?: bigint,
    opts: { channelId?: string; seq?: bigint } = {},
  ): Promise<void> {
    const state = this.store.getState();
    const root = state.messages[threadRootId];
    const channelId = opts.channelId || root?.channelId || "";
    const replies = state.threadIds[threadRootId] ?? [];
    const last = replies.length ? state.messages[replies[replies.length - 1]!] : undefined;
    let target = threadSeq ?? last?.threadSeq ?? 0n;
    if (threadSeq === undefined && root && BigInt(root.replyCount) > target) target = BigInt(root.replyCount);
    const current = state.threadReadStates[threadRootId] ?? 0n;
    if (target <= current && opts.seq === undefined) return;
    if (opts.seq !== undefined && channelId && opts.seq > (state.readStates[channelId]?.lastReadSeq ?? 0n)) {
      this.store.dispatch({
        type: "readStates/updated",
        channelId,
        lastReadSeq: opts.seq,
        userId: state.me?.id ?? "",
      });
    }
    if (target > current) {
      this.store.dispatch({
        type: "readStates/updated",
        channelId,
        lastReadSeq: 0n,
        userId: state.me?.id ?? "",
        threadRootId,
        lastReadThreadSeq: target,
      });
    }
    await this.chat.markRead({ channelId, seq: opts.seq ?? 0n, threadRootId, threadSeq: target });
  }

  /** Edit a message. Optimistic: the store shows the new body immediately and rolls back on error. */
  async updateMessage(messageId: string, input: UpdateMessageInput): Promise<Message | undefined> {
    const prev = this.store.getState().messages[messageId];
    if (prev) {
      const optimistic = create(MessageSchema, {
        ...prev,
        text: input.text ?? prev.text,
        richText: input.richText ?? prev.richText,
        blocks: input.blocks ?? prev.blocks,
        metadata: input.metadata ?? prev.metadata,
        editedAt: timestampFromMs(this.now()),
      });
      this.store.dispatch({ type: "messages/updated", message: optimistic });
    }
    try {
      const res = await this.chat.updateMessage({
        messageId,
        text: input.text ?? prev?.text ?? "",
        richText: input.richText ?? prev?.richText,
        blocks: input.blocks ?? prev?.blocks,
        metadata: input.metadata ?? prev?.metadata,
        streamSeq: 0n,
      });
      if (res.message) this.store.dispatch({ type: "messages/updated", message: res.message });
      return res.message;
    } catch (err) {
      if (prev) this.store.dispatch({ type: "messages/updated", message: prev });
      throw err;
    }
  }

  /** Delete a message. Optimistic: removed from every index immediately, restored on error. */
  async deleteMessage(messageId: string): Promise<void> {
    const prev = this.store.getState().messages[messageId];
    if (prev) {
      this.store.dispatch({
        type: "messages/deleted",
        messageId,
        channelId: prev.channelId,
        threadRootId: prev.threadRootId,
      });
    }
    try {
      await this.chat.deleteMessage({ messageId });
    } catch (err) {
      if (prev) this.store.dispatch({ type: "messages/upsert", messages: [prev] });
      throw err;
    }
  }

  /**
   * Join a channel. Optimistic when the channel is already in the store (e.g. listed as an unjoined
   * public channel); the server's channel replaces it on success, the previous row comes back on error.
   */
  async joinChannel(channelId: string): Promise<Channel | undefined> {
    const state = this.store.getState();
    const prev = state.channels[channelId];
    const me = state.me?.id;
    if (prev && me) this.store.dispatch({ type: "membership/changed", channelId, userId: me, joined: true });
    try {
      const res = await this.channels.joinChannel({ channelId });
      if (res.channel) this.store.dispatch({ type: "channels/upsert", channels: [res.channel] });
      return res.channel ?? this.store.getState().channels[channelId];
    } catch (err) {
      if (prev) this.store.dispatch({ type: "channels/upsert", channels: [prev] });
      throw err;
    }
  }

  /** Leave a channel. Optimistic: the channel leaves the sidebar immediately, and returns on error. */
  async leaveChannel(channelId: string): Promise<void> {
    const state = this.store.getState();
    const prev = state.channels[channelId];
    const me = state.me?.id;
    if (prev && me) this.store.dispatch({ type: "membership/changed", channelId, userId: me, joined: false });
    try {
      await this.channels.leaveChannel({ channelId });
    } catch (err) {
      if (prev) this.store.dispatch({ type: "channels/upsert", channels: [prev] });
      throw err;
    }
  }

  /** Create a channel and put it in the store. Resolves to the server's channel. */
  async createChannel(input: CreateChannelInput): Promise<Channel> {
    const res = await this.channels.createChannel({
      workspaceId: input.workspaceId,
      type: input.type ?? ChannelType.PUBLIC,
      name: input.name,
      purpose: input.purpose ?? "",
      memberIds: input.memberIds ?? [],
    });
    if (!res.channel) throw new Error("CreateChannel returned no channel");
    this.store.dispatch({ type: "channels/upsert", channels: [res.channel] });
    return res.channel;
  }

  /** Set a Tread's goal. Optimistic: the channel shows the goal immediately, rolled back on error. */
  async setGoal(channelId: string, goal: SetGoalInput | TreadGoal): Promise<Channel | undefined> {
    const state = this.store.getState();
    const prev = state.channels[channelId];
    const next = create(TreadGoalSchema, {
      goal: goal.goal,
      assigneeIds: goal.assigneeIds ?? [],
      pipelineStatus: goal.pipelineStatus ?? "",
      updatedAt: timestampFromMs(this.now()),
      updatedBy: state.me?.id ?? "",
    });
    if (prev) this.store.dispatch({ type: "channels/upsert", channels: [{ ...prev, goal: next }] });
    try {
      const res = await this.channels.setGoal({ channelId, goal: next });
      if (res.channel) this.store.dispatch({ type: "channels/upsert", channels: [res.channel] });
      return res.channel ?? this.store.getState().channels[channelId];
    } catch (err) {
      if (prev) this.store.dispatch({ type: "channels/upsert", channels: [prev] });
      throw err;
    }
  }

  /** Invite someone to a workspace by email. Resolves to the invite id. */
  async invite(workspaceId: string, email: string, role: Role | RoleName = "member"): Promise<string> {
    const res = await this.workspaces.inviteMember({
      workspaceId,
      email,
      role: typeof role === "string" ? ROLE_BY_NAME[role] : role,
    });
    return res.inviteId;
  }

  addReaction(messageId: string, emoji: string): Promise<unknown> {
    const me = this.store.getState().me;
    if (me) this.store.dispatch({ type: "reactions/added", messageId, userId: me.id, emoji });
    return this.chat.addReaction({ messageId, emoji });
  }

  removeReaction(messageId: string, emoji: string): Promise<unknown> {
    const me = this.store.getState().me;
    if (me) this.store.dispatch({ type: "reactions/removed", messageId, userId: me.id, emoji });
    return this.chat.removeReaction({ messageId, emoji });
  }

  /** A user interacted with a block; delivered to the owning app/agent as an event. */
  postBlockAction(
    action: Pick<BlockAction, "messageId" | "blockId" | "actionId" | "value">,
  ): Promise<unknown> {
    return this.chat.postBlockAction({
      action: { ...action, userId: this.store.getState().me?.id ?? "", at: timestampFromMs(this.now()) },
    });
  }

  // ------------------------------------------------------------ outbox

  private async flushOutbox(): Promise<void> {
    const ids = Array.from(this.outbox.entries())
      .filter(([, e]) => !e.inFlight)
      .sort(([, a], [, b]) => a.createdAt - b.createdAt)
      .map(([id]) => id);
    for (const id of ids) await this.flushOne(id);
  }

  private async flushOne(clientMsgId: string): Promise<void> {
    const entry = this.outbox.get(clientMsgId);
    if (!entry || entry.inFlight) return;
    entry.inFlight = true;
    entry.attempts += 1;
    try {
      const res = await this.chat.postMessage(entry.request);
      this.outbox.delete(clientMsgId);
      if (res.message) this.store.dispatch({ type: "pending/resolve", clientMsgId, message: res.message });
      await this.storage.delete(storageKeys.outbox(clientMsgId));
      this.sendBackoff.reset();
    } catch (err) {
      entry.inFlight = false;
      const code = err instanceof ConnectError ? err.code : Code.Unavailable;
      const message = err instanceof Error ? err.message : String(err);
      const retryable = RETRYABLE.has(code) && entry.attempts < MAX_SEND_ATTEMPTS;
      if (retryable) {
        await this.persistOutboxEntry(clientMsgId, entry);
        const delay = this.sendBackoff.next();
        setTimeout(() => void this.flushOne(clientMsgId), delay);
        return;
      }
      this.store.dispatch({ type: "pending/failed", clientMsgId, error: message });
      await this.persistOutboxEntry(clientMsgId, entry);
      this.events.emit("sendFailed", { clientMsgId, error: message });
    }
  }

  private persistOutboxEntry(clientMsgId: string, entry: OutboxEntry): Promise<void> {
    const rec: OutboxRecord = {
      request: toJson(PostMessageRequestSchema, entry.request),
      createdAt: entry.createdAt,
      attempts: entry.attempts,
    };
    return this.storage.put(storageKeys.outbox(clientMsgId), JSON.stringify(rec));
  }

  // ------------------------------------------------------------ realtime wiring

  private wireRealtime(): void {
    const rt = this.realtime;
    rt.on("state", (s) => {
      this.store.dispatch({ type: "connection", state: s });
      if (s === "ready") void this.flushOutbox();
    });
    rt.on("event", (ev) => {
      const env = ev.envelope;
      if (!env) return;
      this.store.applyEnvelope(env, this.now());
      const payload = unpackEnvelope(env);
      if (payload?.$typeName === "tank.events.v1.ChannelUpdated") void this.refreshChannel(payload.channelId);
    });
    rt.on("cursor", ({ workspaceId, cursor }) => {
      this.store.dispatch({ type: "cursor", workspaceId, cursor });
      void this.storage.put(storageKeys.cursor(workspaceId), cursor.toString());
    });
    rt.on("session", (session) => {
      if (session) void this.storage.put(storageKeys.session, JSON.stringify(session));
      else void this.storage.delete(storageKeys.session);
    });
    rt.on("typing", (t) => this.store.dispatch({ type: "typing", typing: t, now: this.now() }));
    rt.on("presence", (p) => {
      if (p.presence) this.store.dispatch({ type: "presence/changed", presence: p.presence });
    });
    rt.on("agent_status", (s) => this.store.dispatch({ type: "agentStatus", status: s }));
    rt.on("resync", () => void this.resync());
  }

  private async refreshChannel(channelId: string): Promise<void> {
    try {
      const res = await this.channels.getChannel({ channelId });
      if (res.channel) this.store.dispatch({ type: "channels/upsert", channels: [res.channel] });
      if (res.readState) this.store.dispatch({ type: "readStates/upsert", readStates: [res.readState] });
    } catch {
      // transient; the next ChannelUpdated or bootstrap repairs it
    }
  }

  private async resync(): Promise<void> {
    this.store.dispatch({ type: "cursors/reset" });
    for (const [k] of await this.storage.scan(storageKeys.cursorPrefix)) await this.storage.delete(k);
    const wsIds = Object.keys(this.store.getState().workspaces);
    await Promise.allSettled(wsIds.map((id) => this.bootstrap(id)));
    await Promise.allSettled(
      this.recentChannels
        .filter((id) => (this.store.getState().messageIdsByChannel[id]?.length ?? 0) > 0)
        .map((id) => this.loadChannel(id, { direction: "after", limit: 200 })),
    );
    this.events.emit("resync", undefined);
  }

  // ------------------------------------------------------------ persistence

  private touchRecent(channelId: string): void {
    const i = this.recentChannels.indexOf(channelId);
    if (i >= 0) this.recentChannels.splice(i, 1);
    this.recentChannels.unshift(channelId);
    const max = this.opts.cachedChannels ?? 20;
    while (this.recentChannels.length > max) {
      const dropped = this.recentChannels.pop()!;
      void this.storage.delete(storageKeys.channelMessages(dropped));
    }
    void this.storage.put(storageKeys.recentChannels, JSON.stringify(this.recentChannels));
    this.schedulePersist();
  }

  private schedulePersist(): void {
    if (!this.started || this.persistTimer) return;
    this.persistTimer = setTimeout(() => {
      this.persistTimer = undefined;
      void this.persistNow();
    }, 500);
  }

  private async persistNow(): Promise<void> {
    const max = this.opts.cachedMessagesPerChannel ?? 200;
    for (const channelId of this.recentChannels) {
      const msgs = this.store.selectChannelMessages(channelId).filter((m) => m.channelSeq > 0n);
      if (msgs.length === 0) continue;
      const tail = msgs.slice(-max).map((m) => toJson(MessageSchema, m));
      await this.storage.put(storageKeys.channelMessages(channelId), JSON.stringify(tail));
    }
  }

  private hydrate(): Promise<void> {
    if (!this.hydrated) this.hydrated = this.hydrateOnce();
    return this.hydrated;
  }

  private async hydrateOnce(): Promise<void> {
    const s = this.storage;
    const [sessionRaw, recentRaw, cursorRows, bootstrapRows, outboxRows] = await Promise.all([
      s.get(storageKeys.session),
      s.get(storageKeys.recentChannels),
      s.scan(storageKeys.cursorPrefix),
      s.scan(storageKeys.bootstrapPrefix),
      s.scan(storageKeys.outboxPrefix),
    ]);

    const cursors: Record<string, string> = {};
    for (const [k, v] of cursorRows) cursors[k.slice(storageKeys.cursorPrefix.length)] = v;
    if (Object.keys(cursors).length) this.store.dispatch({ type: "hydrate", patch: { cursors } });

    for (const [, v] of bootstrapRows) {
      try {
        const res = fromJson(GetBootstrapResponseSchema, JSON.parse(v) as JsonValue);
        if (res.workspace) {
          this.store.dispatch({
            type: "bootstrap",
            workspace: res.workspace,
            me: res.me,
            channels: res.channels,
            readStates: res.readStates,
            members: res.members,
          });
        }
      } catch {
        // corrupt cache row: ignore, the next bootstrap overwrites it
      }
    }

    if (recentRaw) {
      try {
        const ids = JSON.parse(recentRaw) as string[];
        this.recentChannels.splice(0, this.recentChannels.length, ...ids);
      } catch {
        // ignore
      }
      const rows = await Promise.all(this.recentChannels.map((id) => s.get(storageKeys.channelMessages(id))));
      const messages: Message[] = [];
      for (const raw of rows) {
        if (!raw) continue;
        try {
          for (const j of JSON.parse(raw) as JsonValue[]) messages.push(fromJson(MessageSchema, j));
        } catch {
          // ignore
        }
      }
      if (messages.length) this.store.dispatch({ type: "messages/upsert", messages });
    }

    for (const [k, v] of outboxRows) {
      const clientMsgId = k.slice(storageKeys.outboxPrefix.length);
      try {
        const rec = JSON.parse(v) as OutboxRecord;
        const request = fromJson(PostMessageRequestSchema, rec.request);
        this.outbox.set(clientMsgId, { request, createdAt: rec.createdAt, attempts: rec.attempts });
        const state = this.store.getState();
        const optimistic = create(MessageSchema, {
          id: clientMsgId,
          workspaceId: state.channels[request.channelId]?.workspaceId ?? "",
          channelId: request.channelId,
          threadRootId: request.threadRootId,
          authorId: state.me?.id ?? "",
          authorKind: state.me?.kind ?? PrincipalKind.USER,
          kind: request.kind,
          clientMsgId,
          text: request.text,
          richText: request.richText,
          blocks: request.blocks,
          fileIds: request.fileIds,
          metadata: request.metadata,
          createdAt: timestampFromMs(rec.createdAt),
        });
        this.store.dispatch({ type: "pending/add", message: optimistic, now: rec.createdAt });
      } catch {
        await s.delete(k);
      }
    }

    // Hand persisted cursors/session to the realtime client before it connects.
    const session = sessionRaw
      ? (JSON.parse(sessionRaw) as { sessionId: string; resumeToken: string })
      : undefined;
    this.realtime.restore(session, cursors);
  }
}

export function createTankClient(opts: TankClientOptions): TankClient {
  return new TankClient(opts);
}
