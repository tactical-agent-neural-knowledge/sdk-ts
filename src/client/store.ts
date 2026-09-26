import { create, createRegistry } from "@bufbuild/protobuf";
import { anyUnpack, type Timestamp, timestampFromMs } from "@bufbuild/protobuf/wkt";
import type { Run } from "../contracts/tank/agent/v1/agent_pb.js";
import type { Principal } from "../contracts/tank/auth/v1/auth_pb.js";
import type { Channel, ChannelReadState } from "../contracts/tank/channel/v1/channel_pb.js";
import { ChannelReadStateSchema } from "../contracts/tank/channel/v1/channel_pb.js";
import {
  type AgentRunUpdated,
  type AgentStatus,
  type AppCommand,
  type CardAction,
  type ChannelMembershipChanged,
  type ChannelUpdated,
  type Envelope,
  type FileDeleted,
  type FileReady,
  file_tank_events_v1_events,
  type MessageCreated,
  type MessageDeleted,
  type MessageEphemeral,
  type MessageUpdated,
  type NotificationCreated,
  type NotificationsRead,
  type PresenceChanged,
  type ReactionAdded,
  type ReactionRemoved,
  type ReadStateUpdated,
  type TopoMarkUpdated,
  type Typing,
} from "../contracts/tank/events/v1/events_pb.js";
import type { File } from "../contracts/tank/files/v1/files_pb.js";
import type { Message, Reaction } from "../contracts/tank/message/v1/message_pb.js";
import { type Notification, NotificationSchema } from "../contracts/tank/notification/v1/notification_pb.js";
import type { Presence } from "../contracts/tank/presence/v1/presence_pb.js";
import type { Entitlements, Member, Workspace } from "../contracts/tank/workspace/v1/workspace_pb.js";
import { uuidv7Time } from "./uuidv7.js";

export type ConnectionState = "idle" | "connecting" | "open" | "ready" | "reconnecting" | "closed";

export interface PendingMessage {
  clientMsgId: string;
  channelId: string;
  status: "sending" | "failed";
  attempts: number;
  error?: string;
  createdAt: number;
}

export interface ChannelPaging {
  loading: boolean;
  /** True once at least one page has been fetched for this channel in this session. */
  loaded: boolean;
  hasMoreBefore: boolean;
  hasMoreAfter: boolean;
  /** Oldest seq loaded; 0n when the beginning was reached. */
  oldestSeq: bigint;
}

export interface NotificationPaging {
  loading: boolean;
  /** True once the first page for this (workspace, mode) has landed. */
  loaded: boolean;
  hasMore: boolean;
  /** Opaque cursor for the next page ("" when there is none). */
  cursor: string;
}

export type NotificationMode = "unread" | "all";

export interface AgentStatusEntry {
  status: AgentStatus;
  /** ms since epoch after which the frame is stale and dropped by `agentStatus/expire`. */
  expiresAt: number;
}

export interface TankState {
  me: Principal | undefined;
  workspaces: Record<string, Workspace>;
  /** workspaceId → principalId → Member */
  members: Record<string, Record<string, Member>>;
  channels: Record<string, Channel>;
  /** workspaceId → channel ids (public/private first, then DMs; each group by name). */
  channelOrder: Record<string, string[]>;
  messages: Record<string, Message>;
  /** channelId → message ids ordered by channel_seq; optimistic (seq 0) ids trail by creation time. */
  messageIdsByChannel: Record<string, string[]>;
  /** thread root id → reply ids ordered by thread_seq; optimistic trail. */
  threadIds: Record<string, string[]>;
  channelPaging: Record<string, ChannelPaging>;
  readStates: Record<string, ChannelReadState>;
  /** thread root id → my last read thread_seq (from ReadStateUpdated events and markRead). */
  threadReadStates: Record<string, bigint>;
  presence: Record<string, Presence>;
  /** typing key (channelId or channelId/threadRootId) → userId → expiry (ms since epoch). */
  typing: Record<string, Record<string, number>>;
  /** keyed by thread root id when set, else channel id. Same frames as `agentStatusByThread`, kept for compatibility. */
  agentStatus: Record<string, AgentStatus>;
  /** Live `agent_status` frames keyed by thread root id (or channel id); each expires `AGENT_STATUS_TTL_MS` after arrival. */
  agentStatusByThread: Record<string, AgentStatusEntry>;
  /** client_msg_id → outbox status. */
  pending: Record<string, PendingMessage>;
  connection: ConnectionState;
  /** workspaceId → last applied gateway cursor (decimal string; bigint-safe for JSON). */
  cursors: Record<string, string>;
  /** notification id → Notification. */
  notifications: Record<string, Notification>;
  /** workspaceId → notification ids, newest first (every notification the store knows about). */
  notificationIds: Record<string, string[]>;
  /** workspaceId → unread total (`GetBootstrap.unread_notification_count` + live deltas), independent of paging. */
  unreadNotificationCount: Record<string, number>;
  /** What each workspace's plan allows, from `GetBootstrap`. A hint for the UI; the server still decides. */
  entitlements: Record<string, Entitlements>;
  /** `${workspaceId}:${mode}` → paging state for `loadNotifications`. */
  notificationPaging: Record<string, NotificationPaging>;
  /** run id → Run (from `AgentRunUpdated` events, `ListRuns` and `GetRun`). */
  runsById: Record<string, Run>;
  /** thread root id → the newest run in that thread (by started_at; a run's own update always wins). */
  runsByThread: Record<string, Run>;
  /** file id → File (from `FileReady` events and upload responses). */
  filesById: Record<string, File>;
}

export const TYPING_TTL_MS = 5_000;
/** How long an `agent_status` frame stays live without a newer one. */
export const AGENT_STATUS_TTL_MS = 30_000;

export function initialState(): TankState {
  return {
    me: undefined,
    workspaces: {},
    members: {},
    channels: {},
    channelOrder: {},
    messages: {},
    messageIdsByChannel: {},
    threadIds: {},
    channelPaging: {},
    readStates: {},
    threadReadStates: {},
    presence: {},
    typing: {},
    agentStatus: {},
    agentStatusByThread: {},
    pending: {},
    connection: "idle",
    cursors: {},
    notifications: {},
    notificationIds: {},
    unreadNotificationCount: {},
    entitlements: {},
    notificationPaging: {},
    runsById: {},
    runsByThread: {},
    filesById: {},
  };
}

export type Action =
  | {
      type: "bootstrap";
      workspace: Workspace;
      me: Member | undefined;
      channels: Channel[];
      readStates: ChannelReadState[];
      members: Member[];
      /** `GetBootstrap.unread_notification_count`; seeds `unreadNotificationCount[workspace.id]`. */
      unreadNotificationCount?: number;
      /** `GetBootstrap.entitlements`; absent on an older server, which the UI reads as "assume free". */
      entitlements?: Entitlements | undefined;
    }
  | { type: "workspaces/upsert"; workspaces: Workspace[] }
  | { type: "members/upsert"; workspaceId: string; members: Member[] }
  | { type: "channels/upsert"; channels: Channel[] }
  | { type: "channels/remove"; channelId: string }
  | { type: "messages/upsert"; messages: Message[] }
  /** Replace a channel's timeline with a freshly fetched page, dropping rows the server no longer
   *  returns. Unsent optimistic rows survive; the `messages` map keeps its entries so threads that
   *  still reference them are unaffected. */
  | { type: "messages/resetChannel"; channelId: string; messages: Message[] }
  | { type: "messages/created"; message: Message }
  | { type: "messages/updated"; message: Message }
  | { type: "messages/deleted"; messageId: string; channelId: string; threadRootId: string }
  | { type: "reactions/added"; messageId: string; userId: string; emoji: string }
  | { type: "reactions/removed"; messageId: string; userId: string; emoji: string }
  | { type: "readStates/upsert"; readStates: ChannelReadState[] }
  | {
      type: "readStates/updated";
      channelId: string;
      lastReadSeq: bigint;
      userId: string;
      /** When set, this is a thread read state: `lastReadThreadSeq` applies to `threadRootId`. */
      threadRootId?: string;
      lastReadThreadSeq?: bigint;
    }
  | { type: "membership/changed"; channelId: string; userId: string; joined: boolean }
  | { type: "presence/changed"; presence: Presence }
  | { type: "presence/upsert"; presences: Presence[] }
  | { type: "presence/remove"; userId: string }
  | { type: "typing"; typing: Typing; now: number }
  | { type: "typing/expire"; now: number }
  /** `now` defaults to `Date.now()`; an empty `status.status` clears the entry. */
  | { type: "agentStatus"; status: AgentStatus; now?: number }
  | { type: "agentStatus/expire"; now: number }
  | { type: "notifications/upsert"; workspaceId: string; notifications: Notification[]; unreadCount?: number }
  /** A `NotificationCreated` event: builds the row (user = me) and bumps the unread count when it is new. */
  | { type: "notifications/created"; workspaceId: string; event: NotificationCreated; occurredAt?: Timestamp }
  /** Flip rows to read (empty ids = every notification in the workspace) and drop the unread count accordingly. */
  | { type: "notifications/read"; workspaceId: string; notificationIds: string[]; readAt: Timestamp }
  /** Put rows back (rollback of an optimistic read) and reset the unread count. */
  | { type: "notifications/restore"; workspaceId: string; notifications: Notification[]; unreadCount: number }
  | { type: "unreadNotificationCount/set"; workspaceId: string; count: number }
  | { type: "entitlements/set"; workspaceId: string; entitlements: Entitlements }
  | {
      type: "notificationPaging/set";
      workspaceId: string;
      mode: NotificationMode;
      paging: Partial<NotificationPaging>;
    }
  | { type: "runs/upsert"; runs: Run[] }
  | { type: "files/upsert"; files: File[] }
  | { type: "files/deleted"; fileId: string; messageIds: string[] }
  | { type: "pending/add"; message: Message; now: number }
  | { type: "pending/failed"; clientMsgId: string; error: string }
  | { type: "pending/retry"; clientMsgId: string }
  | { type: "pending/resolve"; clientMsgId: string; message: Message }
  | { type: "pending/discard"; clientMsgId: string }
  | { type: "paging/set"; channelId: string; paging: Partial<ChannelPaging> }
  | { type: "connection"; state: ConnectionState }
  | { type: "cursor"; workspaceId: string; cursor: bigint }
  | { type: "cursors/reset" }
  | { type: "hydrate"; patch: Partial<TankState> };

// ---------------------------------------------------------------- helpers

function byId<T extends { id: string }>(items: T[]): Record<string, T> {
  const out: Record<string, T> = {};
  for (const it of items) out[it.id] = it;
  return out;
}

function createdMs(m: Message): number {
  if (m.createdAt) return Number(m.createdAt.seconds) * 1000 + Math.floor(m.createdAt.nanos / 1e6);
  if (m.clientMsgId) {
    try {
      return uuidv7Time(m.clientMsgId);
    } catch {
      return 0;
    }
  }
  return 0;
}

export function tsMs(t: Timestamp | undefined): number {
  return t ? Number(t.seconds) * 1000 + Math.floor(t.nanos / 1e6) : 0;
}

export function notificationPagingKey(workspaceId: string, mode: NotificationMode): string {
  return `${workspaceId}:${mode}`;
}

function isUnread(n: Notification | undefined): boolean {
  return n !== undefined && n.readAt === undefined;
}

/** Ids of a workspace's notifications newest first; ties keep insertion order. */
function orderNotifications(ids: Iterable<string>, byId: Record<string, Notification>): string[] {
  return Array.from(new Set(ids))
    .filter((id) => byId[id] !== undefined)
    .sort((a, b) => tsMs(byId[b]?.createdAt) - tsMs(byId[a]?.createdAt));
}

function upsertRuns(state: TankState, runs: readonly Run[]): TankState {
  if (runs.length === 0) return state;
  const runsById = { ...state.runsById };
  const runsByThread = { ...state.runsByThread };
  for (const run of runs) {
    runsById[run.id] = run;
    if (!run.threadRootId) continue;
    const cur = runsByThread[run.threadRootId];
    if (!cur || cur.id === run.id || tsMs(run.startedAt) >= tsMs(cur.startedAt))
      runsByThread[run.threadRootId] = run;
  }
  return { ...state, runsById, runsByThread };
}

/** Sort key: real messages by seq, optimistic ones after every real one by creation time. */
function orderKey(seq: bigint, m: Message): [number, number] {
  return seq > 0n ? [0, Number(seq)] : [1, createdMs(m)];
}

function compareKeys(a: [number, number], b: [number, number]): number {
  return a[0] - b[0] || a[1] - b[1];
}

/** Insert `id` into an ordered id list (or move it if already present). Returns a new array if changed. */
function insertOrdered(
  ids: readonly string[],
  id: string,
  messages: Record<string, Message>,
  seqOf: (m: Message) => bigint,
): string[] {
  const m = messages[id]!;
  const key = orderKey(seqOf(m), m);
  const without = ids.includes(id) ? ids.filter((x) => x !== id) : ids;
  let lo = 0;
  let hi = without.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const other = messages[without[mid]!];
    const ok = other ? orderKey(seqOf(other), other) : [0, 0];
    if (compareKeys(ok as [number, number], key) <= 0) lo = mid + 1;
    else hi = mid;
  }
  const out = without.slice();
  out.splice(lo, 0, id);
  return out;
}

function inChannelTimeline(m: Message): boolean {
  return m.threadRootId === "" || m.channelSeq > 0n;
}

function channelSeq(m: Message): bigint {
  return m.channelSeq;
}
function threadSeq(m: Message): bigint {
  return m.threadSeq;
}

const TYPE_RANK: Record<number, number> = { 1: 0, 2: 0, 3: 1, 4: 1, 0: 2 };

function orderChannels(channels: Channel[]): string[] {
  return channels
    .filter((c) => !c.archivedAt)
    .sort((a, b) => {
      const r = (TYPE_RANK[a.type] ?? 2) - (TYPE_RANK[b.type] ?? 2);
      if (r !== 0) return r;
      return a.name.localeCompare(b.name);
    })
    .map((c) => c.id);
}

function upsertMessage(state: TankState, m: Message): TankState {
  const prev = state.messages[m.id];
  const messages = { ...state.messages, [m.id]: m };
  let messageIdsByChannel = state.messageIdsByChannel;
  let threadIds = state.threadIds;
  if (inChannelTimeline(m)) {
    const ids = state.messageIdsByChannel[m.channelId] ?? [];
    const next = insertOrdered(ids, m.id, messages, channelSeq);
    messageIdsByChannel = { ...messageIdsByChannel, [m.channelId]: next };
  } else if (prev && ids(messageIdsByChannel, m.channelId).includes(m.id)) {
    messageIdsByChannel = {
      ...messageIdsByChannel,
      [m.channelId]: messageIdsByChannel[m.channelId]!.filter((x) => x !== m.id),
    };
  }
  if (m.threadRootId !== "") {
    const list = state.threadIds[m.threadRootId] ?? [];
    threadIds = { ...threadIds, [m.threadRootId]: insertOrdered(list, m.id, messages, threadSeq) };
  }
  return { ...state, messages, messageIdsByChannel, threadIds };
}

function ids(map: Record<string, string[]>, key: string): string[] {
  return map[key] ?? [];
}

function removeMessage(
  state: TankState,
  messageId: string,
  channelId: string,
  threadRootId: string,
): TankState {
  const m = state.messages[messageId];
  const ch = channelId || m?.channelId || "";
  const root = threadRootId || m?.threadRootId || "";
  const messages = { ...state.messages };
  delete messages[messageId];
  const messageIdsByChannel = { ...state.messageIdsByChannel };
  if (ch && messageIdsByChannel[ch]?.includes(messageId)) {
    messageIdsByChannel[ch] = messageIdsByChannel[ch]!.filter((x) => x !== messageId);
  }
  const threadIds = { ...state.threadIds };
  if (root && threadIds[root]?.includes(messageId)) {
    threadIds[root] = threadIds[root]!.filter((x) => x !== messageId);
  }
  // A deleted root drops its thread index; replies stay addressable by id.
  if (threadIds[messageId]) delete threadIds[messageId];
  return { ...state, messages, messageIdsByChannel, threadIds };
}

function bumpChannelSeq(state: TankState, m: Message): TankState {
  const ch = state.channels[m.channelId];
  if (!ch || m.channelSeq <= ch.lastSeq) return state;
  const next: Channel = { ...ch, lastSeq: m.channelSeq, lastMessageAt: m.createdAt ?? ch.lastMessageAt };
  return countUnread({ ...state, channels: { ...state.channels, [ch.id]: next } }, m, +1);
}

/**
 * Keep the server's unread count current between bootstraps.
 *
 * Only for what the channel view shows — a thread reply is not new in the
 * channel, whoever wrote it — and only for other people's messages: the server
 * moves the author's own cursor when it stores the message. A reply that was
 * also sent to the channel cannot be told apart on the wire and is missed
 * here, which under-counts by one until the Tread is opened; the alternative
 * was over-counting every reply, which is the bug this replaces.
 */
function countUnread(state: TankState, m: Message, delta: 1 | -1): TankState {
  const rs = state.readStates[m.channelId];
  if (!rs || rs.unreadCount === undefined) return state;
  if (m.threadRootId !== "" || m.deletedAt) return state;
  if (state.me && m.authorId === state.me.id) return state;
  if (m.channelSeq <= rs.lastReadSeq) return state;
  const unreadCount = Math.max(0, rs.unreadCount + delta);
  if (unreadCount === rs.unreadCount) return state;
  return { ...state, readStates: { ...state.readStates, [m.channelId]: { ...rs, unreadCount } } };
}

function bumpReplyCount(state: TankState, m: Message): TankState {
  if (m.threadRootId === "" || m.threadSeq === 0n) return state;
  const root = state.messages[m.threadRootId];
  if (!root) return state;
  const replyCount = Math.max(root.replyCount, Number(m.threadSeq));
  const replyUserIds = root.replyUserIds.includes(m.authorId)
    ? root.replyUserIds
    : [...root.replyUserIds, m.authorId];
  if (
    replyCount === root.replyCount &&
    replyUserIds === root.replyUserIds &&
    root.lastReplyAt === m.createdAt
  ) {
    return state;
  }
  const next: Message = { ...root, replyCount, replyUserIds, lastReplyAt: m.createdAt ?? root.lastReplyAt };
  return { ...state, messages: { ...state.messages, [root.id]: next } };
}

function updateReaction(
  state: TankState,
  messageId: string,
  userId: string,
  emoji: string,
  add: boolean,
): TankState {
  const m = state.messages[messageId];
  if (!m) return state;
  const mine = state.me?.id === userId;
  const existing = m.reactions.find((r) => r.emoji === emoji);
  let reactions: Reaction[];
  if (add) {
    if (existing) {
      if (existing.userIds.includes(userId)) return state;
      reactions = m.reactions.map((r) =>
        r === existing
          ? { ...r, count: r.count + 1, userIds: [...r.userIds, userId], reacted: r.reacted || mine }
          : r,
      );
    } else {
      reactions = [
        ...m.reactions,
        {
          $typeName: "tank.message.v1.Reaction",
          emoji,
          count: 1,
          userIds: [userId],
          reacted: mine,
        } as Reaction,
      ];
    }
  } else {
    if (!existing?.userIds.includes(userId)) return state;
    reactions = m.reactions
      .map((r) =>
        r === existing
          ? {
              ...r,
              count: Math.max(0, r.count - 1),
              userIds: r.userIds.filter((u) => u !== userId),
              reacted: r.reacted && !mine,
            }
          : r,
      )
      .filter((r) => r.count > 0);
  }
  return { ...state, messages: { ...state.messages, [messageId]: { ...m, reactions } } };
}

export function typingKey(channelId: string, threadRootId = ""): string {
  return threadRootId ? `${channelId}/${threadRootId}` : channelId;
}

// ---------------------------------------------------------------- reducer

export function reduce(state: TankState, action: Action): TankState {
  switch (action.type) {
    case "bootstrap": {
      const workspaces = { ...state.workspaces, [action.workspace.id]: action.workspace };
      const channels = { ...state.channels, ...byId(action.channels) };
      const all = Object.values(channels).filter((c) => c.workspaceId === action.workspace.id);
      const membersForWs = { ...(state.members[action.workspace.id] ?? {}) };
      for (const mbr of action.members) if (mbr.principal) membersForWs[mbr.principal.id] = mbr;
      if (action.me?.principal) membersForWs[action.me.principal.id] = action.me;
      const readStates = { ...state.readStates };
      for (const rs of action.readStates) readStates[rs.channelId] = rs;
      const unreadNotificationCount =
        action.unreadNotificationCount === undefined
          ? state.unreadNotificationCount
          : {
              ...state.unreadNotificationCount,
              [action.workspace.id]: Math.max(0, action.unreadNotificationCount),
            };
      const entitlements = action.entitlements
        ? { ...state.entitlements, [action.workspace.id]: action.entitlements }
        : state.entitlements;
      return {
        ...state,
        me: action.me?.principal ?? state.me,
        workspaces,
        channels,
        channelOrder: { ...state.channelOrder, [action.workspace.id]: orderChannels(all) },
        members: { ...state.members, [action.workspace.id]: membersForWs },
        readStates,
        unreadNotificationCount,
        entitlements,
      };
    }
    case "entitlements/set":
      return {
        ...state,
        entitlements: { ...state.entitlements, [action.workspaceId]: action.entitlements },
      };
    case "workspaces/upsert":
      return { ...state, workspaces: { ...state.workspaces, ...byId(action.workspaces) } };
    case "members/upsert": {
      const cur = { ...(state.members[action.workspaceId] ?? {}) };
      for (const mbr of action.members) if (mbr.principal) cur[mbr.principal.id] = mbr;
      return { ...state, members: { ...state.members, [action.workspaceId]: cur } };
    }
    case "channels/upsert": {
      if (action.channels.length === 0) return state;
      const channels = { ...state.channels, ...byId(action.channels) };
      const channelOrder = { ...state.channelOrder };
      for (const ws of new Set(action.channels.map((c) => c.workspaceId))) {
        channelOrder[ws] = orderChannels(Object.values(channels).filter((c) => c.workspaceId === ws));
      }
      return { ...state, channels, channelOrder };
    }
    case "channels/remove": {
      const ch = state.channels[action.channelId];
      if (!ch) return state;
      const channels = { ...state.channels };
      delete channels[action.channelId];
      const order = (state.channelOrder[ch.workspaceId] ?? []).filter((id) => id !== action.channelId);
      return { ...state, channels, channelOrder: { ...state.channelOrder, [ch.workspaceId]: order } };
    }
    case "messages/upsert": {
      let s = state;
      for (const m of action.messages) {
        if (m.deletedAt) {
          s = removeMessage(s, m.id, m.channelId, m.threadRootId);
          continue;
        }
        s = upsertMessage(s, m);
        s = bumpChannelSeq(s, m);
      }
      return s;
    }
    case "messages/resetChannel": {
      let s = state;
      for (const m of action.messages) {
        if (m.deletedAt) continue;
        s = upsertMessage(s, m);
        s = bumpChannelSeq(s, m);
      }
      const fresh = new Set(action.messages.map((m) => m.id));
      const prev = s.messageIdsByChannel[action.channelId] ?? [];
      const next = prev.filter((id) => {
        const m = s.messages[id];
        if (!m) return false;
        // Keep what the server just sent, plus anything still in flight from this device.
        return fresh.has(id) || m.channelSeq === 0n;
      });
      if (next.length === prev.length) return s;
      return { ...s, messageIdsByChannel: { ...s.messageIdsByChannel, [action.channelId]: next } };
    }
    case "messages/created": {
      const m = action.message;
      // Echo of one of ours: reconcile the optimistic row.
      if (m.clientMsgId && state.pending[m.clientMsgId]) {
        return reduce(state, { type: "pending/resolve", clientMsgId: m.clientMsgId, message: m });
      }
      let s = upsertMessage(state, m);
      s = bumpChannelSeq(s, m);
      s = bumpReplyCount(s, m);
      return s;
    }
    case "messages/updated": {
      const m = action.message;
      if (m.deletedAt) return removeMessage(state, m.id, m.channelId, m.threadRootId);
      return upsertMessage(state, m);
    }
    case "messages/deleted": {
      const gone = state.messages[action.messageId];
      const s = removeMessage(state, action.messageId, action.channelId, action.threadRootId);
      // Only when the row is still here to say whether it was unread; a delete
      // of something never loaded cannot move the count, and the next
      // bootstrap recounts anyway.
      return gone ? countUnread(s, gone, -1) : s;
    }
    case "reactions/added":
      return updateReaction(state, action.messageId, action.userId, action.emoji, true);
    case "reactions/removed":
      return updateReaction(state, action.messageId, action.userId, action.emoji, false);
    case "readStates/upsert": {
      const readStates = { ...state.readStates };
      for (const rs of action.readStates) readStates[rs.channelId] = rs;
      return { ...state, readStates };
    }
    case "readStates/updated": {
      if (state.me && action.userId && action.userId !== state.me.id) return state;
      if (action.threadRootId) {
        const seq = action.lastReadThreadSeq ?? 0n;
        const cur = state.threadReadStates[action.threadRootId] ?? 0n;
        if (seq <= cur) return state;
        return { ...state, threadReadStates: { ...state.threadReadStates, [action.threadRootId]: seq } };
      }
      const prev = state.readStates[action.channelId];
      const ch = state.channels[action.channelId];
      const next: ChannelReadState = create(ChannelReadStateSchema, {
        channelId: action.channelId,
        lastReadSeq: action.lastReadSeq,
        mentionCount: 0,
        muted: prev?.muted ?? false,
        starred: prev?.starred ?? false,
        // Read to the end is zero by definition. Read part-way is rare and the
        // exact remainder is not knowable here; keeping the last count is
        // wrong by at most what was just read, and the next bootstrap fixes it.
        ...(prev?.unreadCount !== undefined
          ? { unreadCount: ch && action.lastReadSeq >= ch.lastSeq ? 0 : prev.unreadCount }
          : {}),
      });
      if (prev && prev.lastReadSeq >= next.lastReadSeq && prev.mentionCount === 0) return state;
      return { ...state, readStates: { ...state.readStates, [action.channelId]: next } };
    }
    case "membership/changed": {
      const ch = state.channels[action.channelId];
      if (!ch) return state;
      const memberIds = action.joined
        ? ch.memberIds.includes(action.userId)
          ? ch.memberIds
          : [...ch.memberIds, action.userId]
        : ch.memberIds.filter((u) => u !== action.userId);
      const memberCount = Math.max(0, ch.memberCount + (action.joined ? 1 : -1));
      const next: Channel = { ...ch, memberIds, memberCount };
      let s: TankState = { ...state, channels: { ...state.channels, [ch.id]: next } };
      if (state.me && action.userId === state.me.id && !action.joined) {
        s = reduce(s, { type: "channels/remove", channelId: ch.id });
      }
      return s;
    }
    case "presence/changed":
      return { ...state, presence: { ...state.presence, [action.presence.userId]: action.presence } };
    case "presence/upsert": {
      const presence = { ...state.presence };
      for (const p of action.presences) presence[p.userId] = p;
      return { ...state, presence };
    }
    case "presence/remove": {
      if (!state.presence[action.userId]) return state;
      const presence = { ...state.presence };
      delete presence[action.userId];
      return { ...state, presence };
    }
    case "typing": {
      const key = typingKey(action.typing.channelId, action.typing.threadRootId);
      if (state.me && action.typing.userId === state.me.id) return state;
      const cur = { ...(state.typing[key] ?? {}), [action.typing.userId]: action.now + TYPING_TTL_MS };
      return { ...state, typing: { ...state.typing, [key]: cur } };
    }
    case "typing/expire": {
      let changed = false;
      const typing: TankState["typing"] = {};
      for (const [key, users] of Object.entries(state.typing)) {
        const live: Record<string, number> = {};
        for (const [u, exp] of Object.entries(users)) {
          if (exp > action.now) live[u] = exp;
          else changed = true;
        }
        if (Object.keys(live).length > 0) typing[key] = live;
        else changed = true;
      }
      return changed ? { ...state, typing } : state;
    }
    case "agentStatus": {
      const key = action.status.threadRootId || action.status.channelId;
      if (action.status.status === "") {
        if (!state.agentStatus[key] && !state.agentStatusByThread[key]) return state;
        const agentStatus = { ...state.agentStatus };
        const agentStatusByThread = { ...state.agentStatusByThread };
        delete agentStatus[key];
        delete agentStatusByThread[key];
        return { ...state, agentStatus, agentStatusByThread };
      }
      const now = action.now ?? Date.now();
      return {
        ...state,
        agentStatus: { ...state.agentStatus, [key]: action.status },
        agentStatusByThread: {
          ...state.agentStatusByThread,
          [key]: { status: action.status, expiresAt: now + AGENT_STATUS_TTL_MS },
        },
      };
    }
    case "agentStatus/expire": {
      let changed = false;
      const agentStatusByThread: TankState["agentStatusByThread"] = {};
      const agentStatus = { ...state.agentStatus };
      for (const [key, entry] of Object.entries(state.agentStatusByThread)) {
        if (entry.expiresAt > action.now) agentStatusByThread[key] = entry;
        else {
          changed = true;
          delete agentStatus[key];
        }
      }
      return changed ? { ...state, agentStatus, agentStatusByThread } : state;
    }
    case "notifications/upsert": {
      const ws = action.workspaceId;
      const notifications = { ...state.notifications };
      for (const n of action.notifications) notifications[n.id] = n;
      const ids = orderNotifications(
        [...(state.notificationIds[ws] ?? []), ...action.notifications.map((n) => n.id)],
        notifications,
      );
      const unreadNotificationCount =
        action.unreadCount === undefined
          ? state.unreadNotificationCount
          : { ...state.unreadNotificationCount, [ws]: Math.max(0, action.unreadCount) };
      return {
        ...state,
        notifications,
        notificationIds: { ...state.notificationIds, [ws]: ids },
        unreadNotificationCount,
      };
    }
    case "notifications/created": {
      const ev = action.event;
      if (state.notifications[ev.notificationId]) return state;
      const ws = action.workspaceId;
      const n = create(NotificationSchema, {
        id: ev.notificationId,
        workspaceId: ws,
        userId: state.me?.id ?? "",
        kind: ev.kind,
        messageId: ev.messageId,
        channelId: ev.channelId,
        actorId: ev.actorId,
        createdAt: action.occurredAt ?? timestampFromMs(Date.now()),
      });
      const notifications = { ...state.notifications, [n.id]: n };
      return {
        ...state,
        notifications,
        notificationIds: {
          ...state.notificationIds,
          [ws]: orderNotifications([n.id, ...(state.notificationIds[ws] ?? [])], notifications),
        },
        unreadNotificationCount: {
          ...state.unreadNotificationCount,
          [ws]: (state.unreadNotificationCount[ws] ?? 0) + 1,
        },
      };
    }
    case "notifications/read": {
      const ws = action.workspaceId;
      const notifications = { ...state.notifications };
      const all = action.notificationIds.length === 0;
      const targets = all ? (state.notificationIds[ws] ?? []) : action.notificationIds;
      let flipped = 0;
      for (const id of targets) {
        const n = notifications[id];
        if (n && isUnread(n)) {
          notifications[id] = { ...n, readAt: action.readAt };
          flipped++;
        }
      }
      // Ids we have not loaded still count against the badge; "all read" zeroes it.
      const unknown = all ? 0 : action.notificationIds.filter((id) => !state.notifications[id]).length;
      const count = all ? 0 : Math.max(0, (state.unreadNotificationCount[ws] ?? 0) - flipped - unknown);
      if (flipped === 0 && count === (state.unreadNotificationCount[ws] ?? 0)) return state;
      return {
        ...state,
        notifications,
        unreadNotificationCount: { ...state.unreadNotificationCount, [ws]: count },
      };
    }
    case "notifications/restore": {
      const notifications = { ...state.notifications };
      for (const n of action.notifications) notifications[n.id] = n;
      return {
        ...state,
        notifications,
        unreadNotificationCount: {
          ...state.unreadNotificationCount,
          [action.workspaceId]: Math.max(0, action.unreadCount),
        },
      };
    }
    case "unreadNotificationCount/set": {
      const count = Math.max(0, action.count);
      if (state.unreadNotificationCount[action.workspaceId] === count) return state;
      return {
        ...state,
        unreadNotificationCount: { ...state.unreadNotificationCount, [action.workspaceId]: count },
      };
    }
    case "notificationPaging/set": {
      const key = notificationPagingKey(action.workspaceId, action.mode);
      const prev = state.notificationPaging[key] ?? {
        loading: false,
        loaded: false,
        hasMore: false,
        cursor: "",
      };
      return {
        ...state,
        notificationPaging: { ...state.notificationPaging, [key]: { ...prev, ...action.paging } },
      };
    }
    case "runs/upsert":
      return upsertRuns(state, action.runs);
    case "files/upsert": {
      if (action.files.length === 0) return state;
      return { ...state, filesById: { ...state.filesById, ...byId(action.files) } };
    }
    case "files/deleted": {
      // The file is gone and so is its place in every message that carried
      // it. Both go together: a chip whose file no longer exists is the thing
      // this exists to prevent.
      const filesById = { ...state.filesById };
      delete filesById[action.fileId];
      const messages = { ...state.messages };
      for (const id of action.messageIds) {
        const msg = messages[id];
        if (!msg || !msg.fileIds.includes(action.fileId)) continue;
        messages[id] = {
          ...msg,
          fileIds: msg.fileIds.filter((f) => f !== action.fileId),
          files: msg.files.filter((f) => f.id !== action.fileId),
        };
      }
      return { ...state, filesById, messages };
    }
    case "pending/add": {
      const m = action.message;
      const pending: PendingMessage = {
        clientMsgId: m.clientMsgId,
        channelId: m.channelId,
        status: "sending",
        attempts: 0,
        createdAt: action.now,
      };
      const s = upsertMessage(state, m);
      return { ...s, pending: { ...s.pending, [m.clientMsgId]: pending } };
    }
    case "pending/failed": {
      const p = state.pending[action.clientMsgId];
      if (!p) return state;
      return {
        ...state,
        pending: { ...state.pending, [action.clientMsgId]: { ...p, status: "failed", error: action.error } },
      };
    }
    case "pending/retry": {
      const p = state.pending[action.clientMsgId];
      if (!p) return state;
      const next: PendingMessage = { ...p, status: "sending", attempts: p.attempts + 1 };
      delete next.error;
      return { ...state, pending: { ...state.pending, [action.clientMsgId]: next } };
    }
    case "pending/resolve": {
      const p = state.pending[action.clientMsgId];
      // Optimistic rows use the client_msg_id as their temporary id.
      let s = p ? removeMessage(state, action.clientMsgId, p.channelId, "") : state;
      if (p) {
        const pending = { ...s.pending };
        delete pending[action.clientMsgId];
        s = { ...s, pending };
      }
      s = upsertMessage(s, action.message);
      s = bumpChannelSeq(s, action.message);
      s = bumpReplyCount(s, action.message);
      return s;
    }
    case "pending/discard": {
      const p = state.pending[action.clientMsgId];
      if (!p) return state;
      const s = removeMessage(state, action.clientMsgId, p.channelId, "");
      const pending = { ...s.pending };
      delete pending[action.clientMsgId];
      return { ...s, pending };
    }
    case "paging/set": {
      const prev = state.channelPaging[action.channelId] ?? {
        loading: false,
        loaded: false,
        hasMoreBefore: true,
        hasMoreAfter: false,
        oldestSeq: 0n,
      };
      return {
        ...state,
        channelPaging: { ...state.channelPaging, [action.channelId]: { ...prev, ...action.paging } },
      };
    }
    case "connection":
      return state.connection === action.state ? state : { ...state, connection: action.state };
    case "cursor": {
      const cur = action.cursor.toString();
      if (state.cursors[action.workspaceId] === cur) return state;
      return { ...state, cursors: { ...state.cursors, [action.workspaceId]: cur } };
    }
    case "cursors/reset":
      return { ...state, cursors: {} };
    case "hydrate":
      return { ...state, ...action.patch };
    default:
      return state;
  }
}

// ---------------------------------------------------------------- envelopes

const eventsRegistry = createRegistry(file_tank_events_v1_events);

/** Every `tank.events.v1` payload this SDK's vendored contracts know how to decode. */
export type KnownEventPayload =
  | MessageCreated
  | MessageUpdated
  | MessageDeleted
  | ReactionAdded
  | ReactionRemoved
  | ReadStateUpdated
  | ChannelUpdated
  | ChannelMembershipChanged
  | CardAction
  | AppCommand
  | PresenceChanged
  | Typing
  | AgentStatus
  | FileReady
  | FileDeleted
  | MessageEphemeral
  | NotificationsRead
  | AgentRunUpdated
  | NotificationCreated
  | TopoMarkUpdated;

/**
 * A payload whose type is not in the vendored contracts (a newer event than this SDK build). The
 * `$typeName` is the literal `"unknown"` so a `switch ($typeName)` still narrows every known case and
 * can be exhaustive; the raw Any is kept for logging or forward-compatible decoding.
 */
export interface UnknownEventPayload {
  $typeName: "unknown";
  /** The Any's type URL, e.g. `type.googleapis.com/tank.events.v1.PinChanged`. */
  typeUrl: string;
  value: Uint8Array;
}

export type EventPayload = KnownEventPayload | UnknownEventPayload;

/** Decode an envelope's Any payload into one of the tank.events.v1 messages (or an `UnknownEventPayload`). */
export function unpackEnvelope(env: Envelope): EventPayload | undefined {
  if (!env.payload) return undefined;
  const known = anyUnpack(env.payload, eventsRegistry) as KnownEventPayload | undefined;
  if (known) return known;
  return { $typeName: "unknown", typeUrl: env.payload.typeUrl, value: env.payload.value };
}

/** Reduce a gateway envelope into the store. Unknown payload types are ignored. */
export function envelopeToActions(env: Envelope, now: number): Action[] {
  const payload = unpackEnvelope(env);
  if (!payload) return [];
  switch (payload.$typeName) {
    case "tank.events.v1.MessageCreated":
      return payload.message ? [{ type: "messages/created", message: payload.message }] : [];
    case "tank.events.v1.MessageUpdated":
      return payload.message ? [{ type: "messages/updated", message: payload.message }] : [];
    case "tank.events.v1.FileDeleted":
      return [{ type: "files/deleted", fileId: payload.fileId, messageIds: payload.messageIds }];
    case "tank.events.v1.MessageDeleted":
      return [
        {
          type: "messages/deleted",
          messageId: payload.messageId,
          channelId: payload.channelId,
          threadRootId: payload.threadRootId,
        },
      ];
    case "tank.events.v1.ReactionAdded":
      return [
        {
          type: "reactions/added",
          messageId: payload.messageId,
          userId: payload.userId,
          emoji: payload.emoji,
        },
      ];
    case "tank.events.v1.ReactionRemoved":
      return [
        {
          type: "reactions/removed",
          messageId: payload.messageId,
          userId: payload.userId,
          emoji: payload.emoji,
        },
      ];
    case "tank.events.v1.ReadStateUpdated":
      return [
        {
          type: "readStates/updated",
          channelId: payload.channelId,
          lastReadSeq: payload.lastReadSeq,
          userId: payload.userId,
          ...(payload.threadRootId
            ? { threadRootId: payload.threadRootId, lastReadThreadSeq: payload.lastReadThreadSeq }
            : {}),
        },
      ];
    case "tank.events.v1.ChannelMembershipChanged":
      return [
        {
          type: "membership/changed",
          channelId: payload.channelId,
          userId: payload.userId,
          joined: payload.joined,
        },
      ];
    case "tank.events.v1.PresenceChanged":
      return payload.presence ? [{ type: "presence/changed", presence: payload.presence }] : [];
    case "tank.events.v1.Typing":
      return [{ type: "typing", typing: payload, now }];
    case "tank.events.v1.AgentStatus":
      return [{ type: "agentStatus", status: payload, now }];
    case "tank.events.v1.AgentRunUpdated":
      return payload.run ? [{ type: "runs/upsert", runs: [payload.run] }] : [];
    case "tank.events.v1.FileReady":
      return payload.file ? [{ type: "files/upsert", files: [payload.file] }] : [];
    case "tank.events.v1.NotificationCreated":
      return [
        {
          type: "notifications/created",
          workspaceId: env.workspaceId,
          event: payload,
          ...(env.occurredAt ? { occurredAt: env.occurredAt } : {}),
        },
      ];
    case "tank.events.v1.NotificationsRead":
      return [
        {
          type: "notifications/read",
          workspaceId: env.workspaceId,
          notificationIds: payload.notificationIds,
          readAt: env.occurredAt ?? timestampFromMs(now),
        },
      ];
    // ChannelUpdated carries only an id: the client refetches (see TankClient).
    // CardAction / AppCommand are for apps; MessageEphemeral is surfaced by apps that want it.
    default:
      return [];
  }
}

export type {
  AgentRunUpdated,
  AgentStatus,
  Envelope,
  FileReady,
  MessageEphemeral,
  NotificationCreated,
  NotificationsRead,
  PresenceChanged,
  Typing,
};

// ---------------------------------------------------------------- store

export type Listener = () => void;

export interface Unreads {
  /** Unread channel messages across the workspace (threads excluded). */
  total: number;
  mentions: number;
  byChannel: Record<string, { unread: number; mentions: number }>;
  /** Unread thread replies across followed threads (see `TankStore.selectThreadUnread`). */
  threads: number;
  /** thread root id → unread replies; only threads with unread > 0. */
  byThread: Record<string, number>;
}

export interface ThreadView {
  root: Message | undefined;
  replies: Message[];
}

function shallowEqualArrays<T>(a: readonly T[], b: readonly T[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

/**
 * Holds the state, notifies subscribers synchronously after each dispatch, and
 * memoizes derived views so `useSyncExternalStore` selectors return stable
 * references when nothing they depend on changed.
 */
export class TankStore {
  private state: TankState;
  private listeners = new Set<Listener>();
  private memo = new Map<string, { deps: unknown[]; value: unknown }>();

  constructor(state: TankState = initialState()) {
    this.state = state;
  }

  getState = (): TankState => this.state;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  dispatch(action: Action): void {
    const next = reduce(this.state, action);
    if (next === this.state) return;
    this.state = next;
    for (const l of Array.from(this.listeners)) l();
  }

  applyEnvelope(env: Envelope, now = Date.now()): void {
    for (const a of envelopeToActions(env, now)) this.dispatch(a);
  }

  /** Cache keyed by name+args; recomputes only when `deps` change; keeps the old array when contents are identical. */
  private memoize<T>(key: string, deps: unknown[], compute: () => T, equal?: (a: T, b: T) => boolean): T {
    const hit = this.memo.get(key);
    if (hit && hit.deps.length === deps.length && hit.deps.every((d, i) => d === deps[i]))
      return hit.value as T;
    const value = compute();
    if (hit && equal?.(hit.value as T, value)) {
      this.memo.set(key, { deps, value: hit.value });
      return hit.value as T;
    }
    this.memo.set(key, { deps, value });
    return value;
  }

  selectChannelMessages = (channelId: string): Message[] => {
    const s = this.state;
    const ids = s.messageIdsByChannel[channelId] ?? EMPTY_IDS;
    return this.memoize(
      `msgs:${channelId}`,
      [ids, s.messages],
      () => ids.map((id) => s.messages[id]).filter((m): m is Message => m !== undefined),
      shallowEqualArrays,
    );
  };

  selectThread = (rootId: string): ThreadView => {
    const s = this.state;
    const ids = s.threadIds[rootId] ?? EMPTY_IDS;
    const root = s.messages[rootId];
    return this.memoize(
      `thread:${rootId}`,
      [ids, s.messages],
      () => ({ root, replies: ids.map((id) => s.messages[id]).filter((m): m is Message => m !== undefined) }),
      (a, b) => a.root === b.root && shallowEqualArrays(a.replies, b.replies),
    );
  };

  selectChannels = (workspaceId: string): Channel[] => {
    const s = this.state;
    const order = s.channelOrder[workspaceId] ?? EMPTY_IDS;
    return this.memoize(
      `channels:${workspaceId}`,
      [order, s.channels],
      () => order.map((id) => s.channels[id]).filter((c): c is Channel => c !== undefined),
      shallowEqualArrays,
    );
  };

  /**
   * Unread replies in a thread: the root's reply_count (or the newest loaded
   * reply's thread_seq) minus my last read thread_seq. 0 when the root is unknown.
   */
  selectThreadUnread = (rootId: string): number => {
    const s = this.state;
    return threadUnread(s, rootId);
  };

  /**
   * Channel unreads (total/mentions/byChannel) plus thread unreads counted
   * separately. Threads counted: every root with a known thread read state, and
   * every loaded root I authored or replied in (`followedThreads`).
   */
  selectUnreads = (workspaceId: string): Unreads => {
    const s = this.state;
    const order = s.channelOrder[workspaceId] ?? EMPTY_IDS;
    return this.memoize(
      `unreads:${workspaceId}`,
      [order, s.channels, s.readStates, s.threadReadStates, s.messages, s.me],
      () => {
        const byChannel: Unreads["byChannel"] = {};
        let total = 0;
        let mentions = 0;
        for (const id of order) {
          const ch = s.channels[id];
          if (!ch) continue;
          const rs = s.readStates[id];
          // The server's count is over what the channel view shows; the
          // arithmetic counts every row that took a seq, hidden replies and
          // deleted messages included, and left Treads unread with nothing new
          // in them. Fall back only when an older server sent no count.
          const unread = rs?.muted
            ? 0
            : rs?.unreadCount !== undefined
              ? rs.unreadCount
              : Math.max(0, Number(ch.lastSeq - (rs?.lastReadSeq ?? 0n)));
          const m = rs?.mentionCount ?? 0;
          if (unread > 0 || m > 0) byChannel[id] = { unread, mentions: m };
          total += unread;
          mentions += m;
        }
        const byThread: Unreads["byThread"] = {};
        let threads = 0;
        for (const rootId of followedThreads(s, workspaceId)) {
          const n = threadUnread(s, rootId);
          if (n > 0) {
            byThread[rootId] = n;
            threads += n;
          }
        }
        return { total, mentions, byChannel, threads, byThread };
      },
      (a, b) =>
        a.total === b.total &&
        a.mentions === b.mentions &&
        a.threads === b.threads &&
        shallowEqualRecords(a.byThread, b.byThread) &&
        shallowEqualRecords(
          a.byChannel,
          b.byChannel,
          (x, y) => x.unread === y.unread && x.mentions === y.mentions,
        ),
    );
  };

  selectTyping = (channelId: string, threadRootId = ""): string[] => {
    const users = this.state.typing[typingKey(channelId, threadRootId)] ?? EMPTY_MAP;
    return this.memoize(
      `typing:${typingKey(channelId, threadRootId)}`,
      [users],
      () => Object.keys(users),
      shallowEqualArrays,
    );
  };

  /** A workspace's notifications newest first; `unreadOnly` keeps only rows without `read_at`. */
  selectNotifications = (workspaceId: string, unreadOnly = false): Notification[] => {
    const s = this.state;
    const ids = s.notificationIds[workspaceId] ?? EMPTY_IDS;
    return this.memoize(
      `notifications:${workspaceId}:${unreadOnly ? "unread" : "all"}`,
      [ids, s.notifications],
      () =>
        ids
          .map((id) => s.notifications[id])
          .filter((n): n is Notification => n !== undefined && (!unreadOnly || n.readAt === undefined)),
      shallowEqualArrays,
    );
  };

  /** Runs in a workspace, newest first (by started_at). */
  selectRuns = (workspaceId: string): Run[] => {
    const s = this.state;
    return this.memoize(
      `runs:${workspaceId}`,
      [s.runsById],
      () =>
        Object.values(s.runsById)
          .filter((r) => r.workspaceId === workspaceId)
          .sort((a, b) => tsMs(b.startedAt) - tsMs(a.startedAt)),
      shallowEqualArrays,
    );
  };

  /** The live `agent_status` frame for a thread root id (or a channel id, for channel-level frames). */
  selectAgentStatus = (key: string): AgentStatus | undefined => this.state.agentStatusByThread[key]?.status;

  /** Every live `agent_status` frame in a channel (channel-level and per-thread). */
  selectAgentStatuses = (channelId: string): AgentStatus[] => {
    const s = this.state;
    return this.memoize(
      `agentStatuses:${channelId}`,
      [s.agentStatusByThread],
      () =>
        Object.values(s.agentStatusByThread)
          .map((e) => e.status)
          .filter((f) => f.channelId === channelId),
      shallowEqualArrays,
    );
  };

  /** The `File`s a message references that the store knows about (from uploads and `file.ready`). */
  selectMessageFiles = (messageId: string): File[] => {
    const s = this.state;
    const ids = s.messages[messageId]?.fileIds ?? EMPTY_IDS;
    return this.memoize(
      `files:${messageId}`,
      [ids, s.filesById],
      () => ids.map((id) => s.filesById[id]).filter((f): f is File => f !== undefined),
      shallowEqualArrays,
    );
  };

  selectPresence = (userIds: readonly string[]): Record<string, Presence> => {
    const s = this.state;
    return this.memoize(
      `presence:${userIds.join(",")}`,
      [s.presence, userIds.join(",")],
      () => {
        const out: Record<string, Presence> = {};
        for (const id of userIds) {
          const p = s.presence[id];
          if (p) out[id] = p;
        }
        return out;
      },
      (a, b) => {
        const ak = Object.keys(a);
        const bk = Object.keys(b);
        return ak.length === bk.length && ak.every((k) => a[k] === b[k]);
      },
    );
  };
}

const EMPTY_IDS: string[] = [];
const EMPTY_MAP: Record<string, number> = {};

function shallowEqualRecords<T>(
  a: Record<string, T>,
  b: Record<string, T>,
  eq: (x: T, y: T) => boolean = (x, y) => x === y,
): boolean {
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  return ak.length === bk.length && ak.every((k) => k in b && eq(a[k]!, b[k]!));
}

function threadUnread(s: TankState, rootId: string): number {
  const root = s.messages[rootId];
  const replies = s.threadIds[rootId];
  let newest = root ? BigInt(root.replyCount) : 0n;
  if (replies?.length) {
    const last = s.messages[replies[replies.length - 1]!];
    if (last && last.threadSeq > newest) newest = last.threadSeq;
  }
  if (newest === 0n) return 0;
  return Math.max(0, Number(newest - (s.threadReadStates[rootId] ?? 0n)));
}

/** Roots with a known thread read state plus loaded roots I participate in, scoped to one workspace. */
function followedThreads(s: TankState, workspaceId: string): string[] {
  const out = new Set<string>();
  const me = s.me?.id;
  for (const rootId of Object.keys(s.threadReadStates)) {
    const root = s.messages[rootId];
    if (!root || root.workspaceId === workspaceId) out.add(rootId);
  }
  if (me) {
    for (const m of Object.values(s.messages)) {
      if (m.workspaceId !== workspaceId || m.replyCount === 0 || m.threadRootId !== "") continue;
      if (m.authorId === me || m.replyUserIds.includes(me)) out.add(m.id);
    }
  }
  return Array.from(out);
}
