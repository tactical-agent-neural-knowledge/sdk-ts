import { create, fromJson, toJson } from "@bufbuild/protobuf";
import { timestampFromMs } from "@bufbuild/protobuf/wkt";
import { Code, ConnectError, createClient, } from "@connectrpc/connect";
import { AgentService } from "../contracts/tank/agent/v1/agent_pb.js";
import { AuthService, PrincipalKind } from "../contracts/tank/auth/v1/auth_pb.js";
import { ChannelService, ChannelType, TreadGoalSchema, } from "../contracts/tank/channel/v1/channel_pb.js";
import { FilesService } from "../contracts/tank/files/v1/files_pb.js";
import { ChatService, MessageKind, MessageSchema, PostMessageRequestSchema, } from "../contracts/tank/message/v1/message_pb.js";
import { NotificationService } from "../contracts/tank/notification/v1/notification_pb.js";
import { PresenceSchema, PresenceService, } from "../contracts/tank/presence/v1/presence_pb.js";
import { GetBootstrapResponseSchema, Role, WorkspaceService, } from "../contracts/tank/workspace/v1/workspace_pb.js";
import { Backoff } from "./backoff.js";
import { Emitter } from "./emitter.js";
import { RealtimeClient } from "./realtime.js";
import { MemoryStorage, storageKeys } from "./storage.js";
import { TankStore, unpackEnvelope } from "./store.js";
import { createTankTransport } from "./transport.js";
import { inputMime, inputName, inputSize, putUpload, toBlob, } from "./upload.js";
import { cryptoRandomBytes, uuidv7 } from "./uuidv7.js";
const DOWNLOAD_URL_TTL_MS = 10 * 60_000;
const ROLE_BY_NAME = {
    owner: Role.OWNER,
    admin: Role.ADMIN,
    member: Role.MEMBER,
    guest: Role.GUEST,
};
const RETRYABLE = new Set([
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
    transport;
    auth;
    workspaces;
    channels;
    chat;
    presence;
    files;
    agents;
    /** Same client as `agents`. */
    agent;
    notifications;
    realtime;
    store;
    storage;
    events = new Emitter();
    opts;
    now;
    randomBytes;
    outbox = new Map();
    recentChannels = [];
    started = false;
    hydrated;
    typingSweep;
    persistTimer;
    unsubscribers = [];
    sendBackoff = new Backoff({ minMs: 500, maxMs: 15_000 });
    downloadUrls = new Map();
    downloadUrlInFlight = new Map();
    constructor(opts) {
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
        this.agent = this.agents;
        this.notifications = createClient(NotificationService, this.transport);
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
    async start() {
        if (this.started)
            return;
        this.started = true;
        await this.hydrate();
        this.realtime.setWorkspaceIds(Object.keys(this.store.getState().workspaces));
        this.realtime.start();
        this.typingSweep = setInterval(() => {
            const now = this.now();
            this.store.dispatch({ type: "typing/expire", now });
            this.store.dispatch({ type: "agentStatus/expire", now });
        }, 1_000);
        this.unsubscribers.push(this.store.subscribe(() => this.schedulePersist()));
        void this.flushOutbox();
    }
    async stop() {
        if (!this.started)
            return;
        this.started = false;
        this.realtime.stop();
        if (this.typingSweep)
            clearInterval(this.typingSweep);
        this.typingSweep = undefined;
        for (const u of this.unsubscribers)
            u();
        this.unsubscribers = [];
        if (this.persistTimer)
            clearTimeout(this.persistTimer);
        this.persistTimer = undefined;
        await this.persistNow();
    }
    /** GetBootstrap for a workspace: workspace, me, channels, read states, capped members. */
    async bootstrap(workspaceId) {
        const res = await this.workspaces.getBootstrap({ workspaceId });
        if (res.workspace) {
            this.store.dispatch({
                type: "bootstrap",
                workspace: res.workspace,
                me: res.me,
                channels: res.channels,
                readStates: res.readStates,
                members: res.members,
                unreadNotificationCount: res.unreadNotificationCount,
                entitlements: res.entitlements,
            });
            this.realtime.setWorkspaceIds(Object.keys(this.store.getState().workspaces));
            await this.storage.put(storageKeys.bootstrap(workspaceId), JSON.stringify(toJson(GetBootstrapResponseSchema, res)));
        }
        return res;
    }
    // ------------------------------------------------------------ reads
    /** Pages messages into the store. Resolves to whether more exist in that direction. */
    async loadChannel(channelId, opts = {}) {
        const direction = opts.direction ?? "before";
        const limit = opts.limit ?? 50;
        const state = this.store.getState();
        const loaded = this.store.selectChannelMessages(channelId).filter((m) => m.channelSeq > 0n);
        const paging = state.channelPaging[channelId];
        if (paging?.loading)
            return direction === "before" ? (paging.hasMoreBefore ?? true) : (paging.hasMoreAfter ?? false);
        if (direction === "before" && paging && !paging.hasMoreBefore && loaded.length > 0)
            return false;
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
            const patch = direction === "before"
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
        }
        catch (err) {
            this.store.dispatch({ type: "paging/set", channelId, paging: { loading: false } });
            throw err;
        }
    }
    /** Loads a thread's root and replies (paging with after_thread_seq). Resolves to whether more exist. */
    async loadThread(rootId, opts = {}) {
        const view = this.store.selectThread(rootId);
        const after = view.replies.length ? view.replies[view.replies.length - 1].threadSeq : 0n;
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
    viewChannel(channelId) {
        this.realtime.subscribe({ channelIds: [channelId] });
        this.realtime.focus(channelId);
        this.touchRecent(channelId);
    }
    viewThread(rootId) {
        this.realtime.subscribe({ threadRootIds: [rootId] });
    }
    // ------------------------------------------------------------ writes
    /**
     * Optimistic send: the message shows up immediately under its client_msg_id,
     * is persisted to the outbox, posted (retried with backoff on transient
     * errors, resent after reconnect) and reconciled with the echoed event or
     * the RPC response, whichever comes first.
     */
    async sendMessage(input) {
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
        const entry = { request, createdAt: this.now(), attempts: 0 };
        this.outbox.set(clientMsgId, entry);
        this.store.dispatch({ type: "pending/add", message: optimistic, now: this.now() });
        await this.persistOutboxEntry(clientMsgId, entry);
        void this.flushOne(clientMsgId);
        return { clientMsgId };
    }
    /** Re-attempt a failed outbox entry. */
    retryMessage(clientMsgId) {
        if (!this.outbox.has(clientMsgId))
            return;
        this.store.dispatch({ type: "pending/retry", clientMsgId });
        void this.flushOne(clientMsgId);
    }
    /** Drop a failed outbox entry and its optimistic row. */
    async discardMessage(clientMsgId) {
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
    async markRead(channelId, seq, threadRootId = "", threadSeq) {
        if (threadRootId)
            return this.markThreadRead(threadRootId, threadSeq, { channelId, seq });
        const state = this.store.getState();
        const target = seq ?? state.channels[channelId]?.lastSeq ?? 0n;
        const current = state.readStates[channelId]?.lastReadSeq ?? 0n;
        if (target <= current)
            return;
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
    async markThreadRead(threadRootId, threadSeq, opts = {}) {
        const state = this.store.getState();
        const root = state.messages[threadRootId];
        const channelId = opts.channelId || root?.channelId || "";
        const replies = state.threadIds[threadRootId] ?? [];
        const last = replies.length ? state.messages[replies[replies.length - 1]] : undefined;
        let target = threadSeq ?? last?.threadSeq ?? 0n;
        if (threadSeq === undefined && root && BigInt(root.replyCount) > target)
            target = BigInt(root.replyCount);
        const current = state.threadReadStates[threadRootId] ?? 0n;
        if (target <= current && opts.seq === undefined)
            return;
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
    async updateMessage(messageId, input) {
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
            if (res.message)
                this.store.dispatch({ type: "messages/updated", message: res.message });
            return res.message;
        }
        catch (err) {
            if (prev)
                this.store.dispatch({ type: "messages/updated", message: prev });
            throw err;
        }
    }
    /** Delete a message. Optimistic: removed from every index immediately, restored on error. */
    async deleteMessage(messageId) {
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
        }
        catch (err) {
            if (prev)
                this.store.dispatch({ type: "messages/upsert", messages: [prev] });
            throw err;
        }
    }
    /**
     * Join a channel. Optimistic when the channel is already in the store (e.g. listed as an unjoined
     * public channel); the server's channel replaces it on success, the previous row comes back on error.
     */
    async joinChannel(channelId) {
        const state = this.store.getState();
        const prev = state.channels[channelId];
        const me = state.me?.id;
        if (prev && me)
            this.store.dispatch({ type: "membership/changed", channelId, userId: me, joined: true });
        try {
            const res = await this.channels.joinChannel({ channelId });
            if (res.channel)
                this.store.dispatch({ type: "channels/upsert", channels: [res.channel] });
            return res.channel ?? this.store.getState().channels[channelId];
        }
        catch (err) {
            if (prev)
                this.store.dispatch({ type: "channels/upsert", channels: [prev] });
            throw err;
        }
    }
    /** Leave a channel. Optimistic: the channel leaves the sidebar immediately, and returns on error. */
    async leaveChannel(channelId) {
        const state = this.store.getState();
        const prev = state.channels[channelId];
        const me = state.me?.id;
        if (prev && me)
            this.store.dispatch({ type: "membership/changed", channelId, userId: me, joined: false });
        try {
            await this.channels.leaveChannel({ channelId });
        }
        catch (err) {
            if (prev)
                this.store.dispatch({ type: "channels/upsert", channels: [prev] });
            throw err;
        }
    }
    /** Create a channel and put it in the store. Resolves to the server's channel. */
    async createChannel(input) {
        const res = await this.channels.createChannel({
            workspaceId: input.workspaceId,
            type: input.type ?? ChannelType.PUBLIC,
            name: input.name,
            purpose: input.purpose ?? "",
            memberIds: input.memberIds ?? [],
        });
        if (!res.channel)
            throw new Error("CreateChannel returned no channel");
        this.store.dispatch({ type: "channels/upsert", channels: [res.channel] });
        return res.channel;
    }
    /** Set a Tread's goal. Optimistic: the channel shows the goal immediately, rolled back on error. */
    async setGoal(channelId, goal) {
        const state = this.store.getState();
        const prev = state.channels[channelId];
        const next = create(TreadGoalSchema, {
            goal: goal.goal,
            assigneeIds: goal.assigneeIds ?? [],
            pipelineStatus: goal.pipelineStatus ?? "",
            updatedAt: timestampFromMs(this.now()),
            updatedBy: state.me?.id ?? "",
        });
        if (prev)
            this.store.dispatch({ type: "channels/upsert", channels: [{ ...prev, goal: next }] });
        try {
            const res = await this.channels.setGoal({ channelId, goal: next });
            if (res.channel)
                this.store.dispatch({ type: "channels/upsert", channels: [res.channel] });
            return res.channel ?? this.store.getState().channels[channelId];
        }
        catch (err) {
            if (prev)
                this.store.dispatch({ type: "channels/upsert", channels: [prev] });
            throw err;
        }
    }
    /** Invite someone to a workspace by email. Resolves to the invite id. */
    async invite(workspaceId, email, role = "member") {
        const res = await this.workspaces.inviteMember({
            workspaceId,
            email,
            role: typeof role === "string" ? ROLE_BY_NAME[role] : role,
        });
        return res.inviteId;
    }
    /** Invites sent and not yet accepted. Shown beside members, so an invite is visible work. */
    async listInvites(workspaceId) {
        const res = await this.workspaces.listInvites({ workspaceId });
        return res.invites;
    }
    /** Makes the emailed link stop working. Admins only, matching who may send one. */
    async revokeInvite(workspaceId, inviteId) {
        await this.workspaces.revokeInvite({ workspaceId, inviteId });
    }
    addReaction(messageId, emoji) {
        const me = this.store.getState().me;
        if (me)
            this.store.dispatch({ type: "reactions/added", messageId, userId: me.id, emoji });
        return this.chat.addReaction({ messageId, emoji });
    }
    removeReaction(messageId, emoji) {
        const me = this.store.getState().me;
        if (me)
            this.store.dispatch({ type: "reactions/removed", messageId, userId: me.id, emoji });
        return this.chat.removeReaction({ messageId, emoji });
    }
    /** A user interacted with a block; delivered to the owning app/agent as an event. */
    postBlockAction(action) {
        return this.chat.postBlockAction({
            action: { ...action, userId: this.store.getState().me?.id ?? "", at: timestampFromMs(this.now()) },
        });
    }
    // ------------------------------------------------------------ notifications
    /**
     * Page a workspace's notifications (newest first) into the store. Without `cursor` this is the first
     * page of the `unreadOnly ? "unread" : "all"` list; pass the previous `nextCursor` for the next one.
     * The response's `unread_count` reseeds `unreadNotificationCount[workspaceId]`.
     */
    async loadNotifications(input) {
        const { workspaceId } = input;
        const mode = input.unreadOnly ? "unread" : "all";
        const cursor = input.cursor ?? "";
        this.store.dispatch({ type: "notificationPaging/set", workspaceId, mode, paging: { loading: true } });
        try {
            const res = await this.notifications.listNotifications({
                workspaceId,
                unreadOnly: mode === "unread",
                cursor,
                limit: input.limit ?? 30,
            });
            this.store.dispatch({
                type: "notifications/upsert",
                workspaceId,
                notifications: res.notifications,
                unreadCount: res.unreadCount,
            });
            this.store.dispatch({
                type: "notificationPaging/set",
                workspaceId,
                mode,
                paging: { loading: false, loaded: true, cursor: res.nextCursor, hasMore: res.nextCursor !== "" },
            });
            return {
                notifications: res.notifications,
                nextCursor: res.nextCursor,
                hasMore: res.nextCursor !== "",
                unreadCount: res.unreadCount,
            };
        }
        catch (err) {
            this.store.dispatch({ type: "notificationPaging/set", workspaceId, mode, paging: { loading: false } });
            throw err;
        }
    }
    /**
     * Mark notifications read (no ids = every unread one in the workspace). Optimistic: rows flip and the
     * badge drops immediately; the previous rows and count come back if the RPC fails.
     */
    async markNotificationsRead(workspaceId, notificationIds = []) {
        const state = this.store.getState();
        const targets = notificationIds.length ? notificationIds : (state.notificationIds[workspaceId] ?? []);
        const before = targets.map((id) => state.notifications[id]).filter((n) => !!n);
        const unreadBefore = state.unreadNotificationCount[workspaceId] ?? 0;
        this.store.dispatch({
            type: "notifications/read",
            workspaceId,
            notificationIds,
            readAt: timestampFromMs(this.now()),
        });
        try {
            await this.notifications.markNotificationsRead({ workspaceId, notificationIds });
        }
        catch (err) {
            this.store.dispatch({
                type: "notifications/restore",
                workspaceId,
                notifications: before,
                unreadCount: unreadBefore,
            });
            throw err;
        }
    }
    // ------------------------------------------------------------ agent runs
    /** Page runs (newest first) into `runsById` / `runsByThread`. Resolves to the page and its next cursor. */
    async listRuns(input = {}) {
        const res = await this.agents.listRuns({
            workspaceId: input.workspaceId ?? "",
            channelId: input.channelId ?? "",
            threadRootId: input.threadRootId ?? "",
            cursor: input.cursor ?? "",
            limit: input.limit ?? (input.threadRootId ? 5 : 50),
        });
        this.store.dispatch({ type: "runs/upsert", runs: res.runs });
        return { runs: res.runs, nextCursor: res.nextCursor };
    }
    /** Fetch one run into the store. */
    async getRun(runId) {
        const res = await this.agents.getRun({ runId });
        if (res.run)
            this.store.dispatch({ type: "runs/upsert", runs: [res.run] });
        return res.run;
    }
    // ------------------------------------------------------------ presence
    /**
     * Set my presence status (and optional custom status). Optimistic: `presence[me]` changes immediately
     * and is rolled back if the RPC fails; the server's presence replaces it on success.
     */
    async setStatus(input) {
        const state = this.store.getState();
        const me = state.me?.id ?? "";
        const prev = me ? state.presence[me] : undefined;
        const expiresMs = input.expiresAt === undefined
            ? undefined
            : typeof input.expiresAt === "number"
                ? input.expiresAt
                : input.expiresAt.getTime();
        const expiresAt = expiresMs === undefined ? undefined : timestampFromMs(expiresMs);
        if (me) {
            this.store.dispatch({
                type: "presence/changed",
                presence: create(PresenceSchema, {
                    ...(prev ?? {}),
                    userId: me,
                    status: input.status,
                    customStatusText: input.customText ?? "",
                    customStatusEmoji: input.customEmoji ?? "",
                    statusExpiresAt: expiresAt,
                    lastSeen: timestampFromMs(this.now()),
                }),
            });
        }
        try {
            const res = await this.presence.setStatus({
                workspaceId: input.workspaceId,
                status: input.status,
                customStatusText: input.customText ?? "",
                customStatusEmoji: input.customEmoji ?? "",
                expiresAt,
            });
            if (res.presence)
                this.store.dispatch({ type: "presence/changed", presence: res.presence });
            return res.presence ?? (me ? this.store.getState().presence[me] : undefined);
        }
        catch (err) {
            if (me) {
                if (prev)
                    this.store.dispatch({ type: "presence/changed", presence: prev });
                else
                    this.store.dispatch({ type: "presence/remove", userId: me });
            }
            throw err;
        }
    }
    // ------------------------------------------------------------ files
    /**
     * Upload a file: `CreateUpload` → PUT the bytes to the pre-signed URL (multipart parts when the server
     * returns `part_urls`) → `CompleteUpload`. Resolves to the `File`, which is also put in `filesById`.
     * `file` is a Blob/File on web and node, or `{ uri, name, mime, size }` on React Native.
     */
    async uploadFile(file, opts) {
        const size = inputSize(file);
        const contentType = inputMime(file);
        const created = await this.files.createUpload({
            workspaceId: opts.workspaceId,
            name: inputName(file),
            mime: contentType,
            size: BigInt(size),
            channelId: opts.channelId ?? "",
        });
        if (!created.file)
            throw new Error("CreateUpload returned no file");
        this.store.dispatch({ type: "files/upsert", files: [created.file] });
        const put = {
            XMLHttpRequest: this.opts.XMLHttpRequest,
            fetch: this.opts.fetch,
            signal: opts.signal,
        };
        const etags = [];
        if (created.partUrls.length > 0) {
            const blob = await toBlob(file, this.opts.fetch ?? globalThis.fetch);
            const partSize = Number(created.partSize) || Math.ceil(size / created.partUrls.length);
            const progress = new Array(created.partUrls.length).fill(0);
            for (let i = 0; i < created.partUrls.length; i++) {
                const part = blob.slice(i * partSize, Math.min(size, (i + 1) * partSize));
                const { etag } = await putUpload({
                    ...put,
                    url: created.partUrls[i],
                    body: part,
                    contentType,
                    onProgress: (loaded) => {
                        progress[i] = loaded;
                        opts.onProgress?.(progress.reduce((a, b) => a + b, 0), size);
                    },
                });
                etags.push(etag);
            }
        }
        else {
            await putUpload({
                ...put,
                url: created.uploadUrl,
                body: file,
                contentType,
                onProgress: opts.onProgress,
            });
        }
        const done = await this.files.completeUpload({
            fileId: created.file.id,
            uploadId: created.uploadId,
            etags,
        });
        const result = done.file ?? created.file;
        this.store.dispatch({ type: "files/upsert", files: [result] });
        return result;
    }
    /** A pre-signed download URL for a file, memoized for 10 minutes (or the server's expiry, if sooner). */
    getDownloadUrl(fileId) {
        const hit = this.downloadUrls.get(fileId);
        if (hit && hit.expiresAt > this.now())
            return Promise.resolve(hit.url);
        const inFlight = this.downloadUrlInFlight.get(fileId);
        if (inFlight)
            return inFlight;
        const p = (async () => {
            try {
                const res = await this.files.getDownloadUrl({ fileId });
                const now = this.now();
                const serverExpiry = res.expiresAt
                    ? Number(res.expiresAt.seconds) * 1000 + Math.floor(res.expiresAt.nanos / 1e6)
                    : Number.POSITIVE_INFINITY;
                this.downloadUrls.set(fileId, {
                    url: res.url,
                    expiresAt: Math.min(now + DOWNLOAD_URL_TTL_MS, serverExpiry),
                });
                return res.url;
            }
            finally {
                this.downloadUrlInFlight.delete(fileId);
            }
        })();
        this.downloadUrlInFlight.set(fileId, p);
        return p;
    }
    // ------------------------------------------------------------ outbox
    async flushOutbox() {
        const ids = Array.from(this.outbox.entries())
            .filter(([, e]) => !e.inFlight)
            .sort(([, a], [, b]) => a.createdAt - b.createdAt)
            .map(([id]) => id);
        for (const id of ids)
            await this.flushOne(id);
    }
    async flushOne(clientMsgId) {
        const entry = this.outbox.get(clientMsgId);
        if (!entry || entry.inFlight)
            return;
        entry.inFlight = true;
        entry.attempts += 1;
        try {
            const res = await this.chat.postMessage(entry.request);
            this.outbox.delete(clientMsgId);
            if (res.message)
                this.store.dispatch({ type: "pending/resolve", clientMsgId, message: res.message });
            await this.storage.delete(storageKeys.outbox(clientMsgId));
            this.sendBackoff.reset();
        }
        catch (err) {
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
    persistOutboxEntry(clientMsgId, entry) {
        const rec = {
            request: toJson(PostMessageRequestSchema, entry.request),
            createdAt: entry.createdAt,
            attempts: entry.attempts,
        };
        return this.storage.put(storageKeys.outbox(clientMsgId), JSON.stringify(rec));
    }
    // ------------------------------------------------------------ realtime wiring
    wireRealtime() {
        const rt = this.realtime;
        rt.on("state", (s) => {
            this.store.dispatch({ type: "connection", state: s });
            if (s === "ready")
                void this.flushOutbox();
        });
        rt.on("event", (ev) => {
            const env = ev.envelope;
            if (!env)
                return;
            this.store.applyEnvelope(env, this.now());
            const payload = unpackEnvelope(env);
            if (payload?.$typeName === "tank.events.v1.ChannelUpdated")
                void this.refreshChannel(payload.channelId);
        });
        rt.on("cursor", ({ workspaceId, cursor }) => {
            this.store.dispatch({ type: "cursor", workspaceId, cursor });
            void this.storage.put(storageKeys.cursor(workspaceId), cursor.toString());
        });
        rt.on("session", (session) => {
            if (session)
                void this.storage.put(storageKeys.session, JSON.stringify(session));
            else
                void this.storage.delete(storageKeys.session);
        });
        rt.on("typing", (t) => this.store.dispatch({ type: "typing", typing: t, now: this.now() }));
        rt.on("presence", (p) => {
            if (p.presence)
                this.store.dispatch({ type: "presence/changed", presence: p.presence });
        });
        rt.on("agent_status", (s) => this.store.dispatch({ type: "agentStatus", status: s, now: this.now() }));
        rt.on("resync", () => void this.resync());
    }
    async refreshChannel(channelId) {
        try {
            const res = await this.channels.getChannel({ channelId });
            if (res.channel)
                this.store.dispatch({ type: "channels/upsert", channels: [res.channel] });
            if (res.readState)
                this.store.dispatch({ type: "readStates/upsert", readStates: [res.readState] });
        }
        catch {
            // transient; the next ChannelUpdated or bootstrap repairs it
        }
    }
    async resync() {
        this.store.dispatch({ type: "cursors/reset" });
        for (const [k] of await this.storage.scan(storageKeys.cursorPrefix))
            await this.storage.delete(k);
        const wsIds = Object.keys(this.store.getState().workspaces);
        await Promise.allSettled(wsIds.map((id) => this.bootstrap(id)));
        await Promise.allSettled(this.recentChannels
            .filter((id) => (this.store.getState().messageIdsByChannel[id]?.length ?? 0) > 0)
            .map((id) => this.loadChannel(id, { direction: "after", limit: 200 })));
        this.events.emit("resync", undefined);
    }
    // ------------------------------------------------------------ persistence
    touchRecent(channelId) {
        const i = this.recentChannels.indexOf(channelId);
        if (i >= 0)
            this.recentChannels.splice(i, 1);
        this.recentChannels.unshift(channelId);
        const max = this.opts.cachedChannels ?? 20;
        while (this.recentChannels.length > max) {
            const dropped = this.recentChannels.pop();
            void this.storage.delete(storageKeys.channelMessages(dropped));
        }
        void this.storage.put(storageKeys.recentChannels, JSON.stringify(this.recentChannels));
        this.schedulePersist();
    }
    schedulePersist() {
        if (!this.started || this.persistTimer)
            return;
        this.persistTimer = setTimeout(() => {
            this.persistTimer = undefined;
            void this.persistNow();
        }, 500);
    }
    async persistNow() {
        const max = this.opts.cachedMessagesPerChannel ?? 200;
        for (const channelId of this.recentChannels) {
            const msgs = this.store.selectChannelMessages(channelId).filter((m) => m.channelSeq > 0n);
            if (msgs.length === 0)
                continue;
            const tail = msgs.slice(-max).map((m) => toJson(MessageSchema, m));
            await this.storage.put(storageKeys.channelMessages(channelId), JSON.stringify(tail));
        }
    }
    hydrate() {
        if (!this.hydrated)
            this.hydrated = this.hydrateOnce();
        return this.hydrated;
    }
    async hydrateOnce() {
        const s = this.storage;
        const [sessionRaw, recentRaw, cursorRows, bootstrapRows, outboxRows] = await Promise.all([
            s.get(storageKeys.session),
            s.get(storageKeys.recentChannels),
            s.scan(storageKeys.cursorPrefix),
            s.scan(storageKeys.bootstrapPrefix),
            s.scan(storageKeys.outboxPrefix),
        ]);
        const cursors = {};
        for (const [k, v] of cursorRows)
            cursors[k.slice(storageKeys.cursorPrefix.length)] = v;
        if (Object.keys(cursors).length)
            this.store.dispatch({ type: "hydrate", patch: { cursors } });
        for (const [, v] of bootstrapRows) {
            try {
                const res = fromJson(GetBootstrapResponseSchema, JSON.parse(v));
                if (res.workspace) {
                    this.store.dispatch({
                        type: "bootstrap",
                        workspace: res.workspace,
                        me: res.me,
                        channels: res.channels,
                        readStates: res.readStates,
                        members: res.members,
                        unreadNotificationCount: res.unreadNotificationCount,
                        entitlements: res.entitlements,
                    });
                }
            }
            catch {
                // corrupt cache row: ignore, the next bootstrap overwrites it
            }
        }
        if (recentRaw) {
            try {
                const ids = JSON.parse(recentRaw);
                this.recentChannels.splice(0, this.recentChannels.length, ...ids);
            }
            catch {
                // ignore
            }
            const rows = await Promise.all(this.recentChannels.map((id) => s.get(storageKeys.channelMessages(id))));
            const messages = [];
            for (const raw of rows) {
                if (!raw)
                    continue;
                try {
                    for (const j of JSON.parse(raw))
                        messages.push(fromJson(MessageSchema, j));
                }
                catch {
                    // ignore
                }
            }
            if (messages.length)
                this.store.dispatch({ type: "messages/upsert", messages });
        }
        for (const [k, v] of outboxRows) {
            const clientMsgId = k.slice(storageKeys.outboxPrefix.length);
            try {
                const rec = JSON.parse(v);
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
            }
            catch {
                await s.delete(k);
            }
        }
        // Hand persisted cursors/session to the realtime client before it connects.
        const session = sessionRaw
            ? JSON.parse(sessionRaw)
            : undefined;
        this.realtime.restore(session, cursors);
    }
}
export function createTankClient(opts) {
    return new TankClient(opts);
}
