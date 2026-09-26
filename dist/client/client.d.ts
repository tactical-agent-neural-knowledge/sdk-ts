import { type Client, type Interceptor, type Transport } from "@connectrpc/connect";
import { AgentService, type Run } from "../contracts/tank/agent/v1/agent_pb.js";
import { AuthService } from "../contracts/tank/auth/v1/auth_pb.js";
import type { BlockAction } from "../contracts/tank/blocks/v1/blocks_pb.js";
import { type Channel, ChannelService, ChannelType, type TreadGoal } from "../contracts/tank/channel/v1/channel_pb.js";
import { type File, FilesService } from "../contracts/tank/files/v1/files_pb.js";
import { ChatService, type Message, MessageKind, type PostMessageRequest } from "../contracts/tank/message/v1/message_pb.js";
import { type Notification, NotificationService } from "../contracts/tank/notification/v1/notification_pb.js";
import { type Presence, PresenceService, type PresenceStatus } from "../contracts/tank/presence/v1/presence_pb.js";
import { type Mark, type MarkType, TopoService } from "../contracts/tank/topo/v1/topo_pb.js";
import { type GetBootstrapResponse, type Invite, type PendingInvite, Role, type Workspace, WorkspaceService } from "../contracts/tank/workspace/v1/workspace_pb.js";
import { Emitter } from "./emitter.js";
import { RealtimeClient, type RealtimeOptions, type WebSocketCtor } from "./realtime.js";
import { type TankStorage } from "./storage.js";
import { TankStore } from "./store.js";
import { type TankAuth } from "./transport.js";
import { type UploadInput, type XhrCtor } from "./upload.js";
import { type RandomBytes } from "./uuidv7.js";
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
    /** For `uploadFile` progress. Default: `globalThis.XMLHttpRequest` when present, else `fetch` (no byte progress). */
    XMLHttpRequest?: XhrCtor;
    interceptors?: Interceptor[];
    /** Replace the Connect transport entirely (tests, React Native, node). `baseUrl`/`auth`/`fetch` are then unused. */
    transport?: Transport;
    /**
     * Which of the device's signed-in accounts this client acts as. One device holds several — the
     * same person often belongs to workspaces under different email addresses — and each gets its own
     * client, its own store and its own socket, so unread counts stay live in all of them at once.
     * Give each one its own `storage` namespace or they will overwrite each other's cache.
     */
    actAsUserId?: string;
    realtime?: Pick<RealtimeOptions, "heartbeatMs" | "gapBufferMs" | "backoff" | "capabilities" | "listenOnline" | "onlineSignal">;
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
export interface LoadNotificationsInput {
    workspaceId: string;
    /** Only rows without `read_at`. Default false. */
    unreadOnly?: boolean;
    /** Opaque cursor from a previous page (`nextCursor`); omit for the first page. */
    cursor?: string;
    /** Default 30. */
    limit?: number;
}
export interface LoadNotificationsResult {
    notifications: Notification[];
    /** "" when there is no further page. */
    nextCursor: string;
    hasMore: boolean;
    /** Total unread in the workspace, independent of paging. */
    unreadCount: number;
}
export interface ListRunsInput {
    workspaceId?: string;
    channelId?: string;
    threadRootId?: string;
    cursor?: string;
    /** Default 50 (5 with a `threadRootId`). */
    limit?: number;
}
export interface SetStatusInput {
    workspaceId: string;
    status: PresenceStatus;
    customText?: string;
    customEmoji?: string;
    /** When the custom status clears: ms since epoch or a Date. */
    expiresAt?: number | Date;
}
export interface UploadFileOptions {
    workspaceId: string;
    channelId?: string;
    /** Bytes sent so far out of the total (called at least at 0 and at `total`). */
    onProgress?: (loaded: number, total: number) => void;
    signal?: AbortSignal;
}
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
    sendFailed: {
        clientMsgId: string;
        error: string;
    };
}
/**
 * Everything a TANK client app needs, wired together: typed Connect clients
 * for every service, the realtime gateway client, the normalized store, an
 * optimistic outbox, and persistence through `TankStorage`.
 */
export declare class TankClient {
    readonly transport: Transport;
    readonly auth: Client<typeof AuthService>;
    readonly workspaces: Client<typeof WorkspaceService>;
    readonly channels: Client<typeof ChannelService>;
    readonly chat: Client<typeof ChatService>;
    readonly presence: Client<typeof PresenceService>;
    readonly files: Client<typeof FilesService>;
    readonly agents: Client<typeof AgentService>;
    /** Same client as `agents`. */
    readonly agent: Client<typeof AgentService>;
    readonly notifications: Client<typeof NotificationService>;
    /** The map of a Tread: the marks that make up its Topo strip. */
    readonly topo: Client<typeof TopoService>;
    readonly realtime: RealtimeClient;
    readonly store: TankStore;
    readonly storage: TankStorage;
    readonly events: Emitter<TankClientEvents>;
    private readonly opts;
    private readonly now;
    private readonly randomBytes;
    private readonly outbox;
    private readonly recentChannels;
    private started;
    private hydrated;
    private typingSweep;
    private persistTimer;
    private unsubscribers;
    private sendBackoff;
    private downloadUrls;
    private markListeners;
    private downloadUrlInFlight;
    constructor(opts: TankClientOptions);
    /** Hydrates from storage, opens the gateway socket and flushes the outbox. */
    start(): Promise<void>;
    stop(): Promise<void>;
    /** GetBootstrap for a workspace: workspace, me, channels, read states, capped members. */
    bootstrap(workspaceId: string): Promise<GetBootstrapResponse>;
    /** Pages messages into the store. Resolves to whether more exist in that direction. */
    loadChannel(channelId: string, opts?: LoadChannelOptions): Promise<boolean>;
    /**
     * Fetches the newest page and makes it the channel's timeline, discarding cached rows the server no
     * longer returns (deleted messages, tombstoned agent cards). On failure the cache is left alone, so
     * an offline open still paints. Resolves to whether older messages exist.
     */
    private loadChannelTail;
    /** Loads a thread's root and replies (paging with after_thread_seq). Resolves to whether more exist. */
    loadThread(rootId: string, opts?: {
        limit?: number;
    }): Promise<boolean>;
    /** Subscribe to a channel's live events, mark it focused, and remember it for caching. */
    viewChannel(channelId: string): void;
    viewThread(rootId: string): void;
    /**
     * Optimistic send: the message shows up immediately under its client_msg_id,
     * is persisted to the outbox, posted (retried with backoff on transient
     * errors, resent after reconnect) and reconciled with the echoed event or
     * the RPC response, whichever comes first.
     */
    sendMessage(input: SendMessageInput): Promise<{
        clientMsgId: string;
    }>;
    /** Re-attempt a failed outbox entry. */
    retryMessage(clientMsgId: string): void;
    /** Drop a failed outbox entry and its optimistic row. */
    discardMessage(clientMsgId: string): Promise<void>;
    /**
     * Mark a channel read up to `seq` (default: the channel's newest). Optimistic.
     * With `threadRootId` set this marks the thread read up to `threadSeq` (default: the newest reply
     * known to the store) and sends only the thread fields; the channel's read seq is untouched unless
     * `seq` is passed explicitly.
     */
    markRead(channelId: string, seq?: bigint, threadRootId?: string, threadSeq?: bigint): Promise<void>;
    /**
     * Mark a thread read up to `threadSeq` (default: the newest reply known to the store, or the root's
     * reply_count). Optimistic: `threadReadStates[rootId]` updates immediately. The channel id comes from
     * the root message (or `opts.channelId` when the root is not loaded).
     */
    markThreadRead(threadRootId: string, threadSeq?: bigint, opts?: {
        channelId?: string;
        seq?: bigint;
    }): Promise<void>;
    /** Edit a message. Optimistic: the store shows the new body immediately and rolls back on error. */
    updateMessage(messageId: string, input: UpdateMessageInput): Promise<Message | undefined>;
    /** Delete a message. Optimistic: removed from every index immediately, restored on error. */
    deleteMessage(messageId: string): Promise<void>;
    /**
     * Join a channel. Optimistic when the channel is already in the store (e.g. listed as an unjoined
     * public channel); the server's channel replaces it on success, the previous row comes back on error.
     */
    joinChannel(channelId: string): Promise<Channel | undefined>;
    /** Leave a channel. Optimistic: the channel leaves the sidebar immediately, and returns on error. */
    leaveChannel(channelId: string): Promise<void>;
    /** Create a channel and put it in the store. Resolves to the server's channel. */
    createChannel(input: CreateChannelInput): Promise<Channel>;
    /** Set a Tread's goal. Optimistic: the channel shows the goal immediately, rolled back on error. */
    setGoal(channelId: string, goal: SetGoalInput | TreadGoal): Promise<Channel | undefined>;
    /** Invite someone to a workspace by email. Resolves to the invite id. */
    invite(workspaceId: string, email: string, role?: Role | RoleName): Promise<string>;
    /** Invites sent and not yet accepted. Shown beside members, so an invite is visible work. */
    listInvites(workspaceId: string): Promise<Invite[]>;
    /** Makes the emailed link stop working. Admins only, matching who may send one. */
    revokeInvite(workspaceId: string, inviteId: string): Promise<void>;
    /**
     * Invites waiting for the signed-in person, across every workspace.
     *
     * Signing up instead of opening the emailed link leaves you with no workspaces and a screen that
     * says "create one" — which is what the first two people invited to a real team both did, ending
     * up alone in workspaces of their own while their invites sat unopened.
     */
    myInvites(): Promise<PendingInvite[]>;
    /** Joins a workspace already expecting you. Matched on your own address, so it needs no token. */
    acceptInvite(workspaceId: string): Promise<Workspace | undefined>;
    addReaction(messageId: string, emoji: string): Promise<unknown>;
    removeReaction(messageId: string, emoji: string): Promise<unknown>;
    /** A user interacted with a block; delivered to the owning app/agent as an event. */
    postBlockAction(action: Pick<BlockAction, "messageId" | "blockId" | "actionId" | "value">): Promise<unknown>;
    /**
     * Page a workspace's notifications (newest first) into the store. Without `cursor` this is the first
     * page of the `unreadOnly ? "unread" : "all"` list; pass the previous `nextCursor` for the next one.
     * The response's `unread_count` reseeds `unreadNotificationCount[workspaceId]`.
     */
    loadNotifications(input: LoadNotificationsInput): Promise<LoadNotificationsResult>;
    /**
     * The marks for a channel's Topo strip, plus the channel's newest seq so the strip can scale its
     * axis without having paged the messages in.
     *
     * Deliberately not in the normalized store. Marks are derived from rows the server already has,
     * they are scoped to the caller, and a channel's strip is cheap to recompute — caching them would
     * mean inventing an invalidation rule for every event that can move a mention, a read horizon or
     * a deletion, which is strictly more work than asking again.
     */
    /**
     * Called when a stored mark is created, resolved or dismissed anywhere the caller is subscribed.
     * Returns its own unsubscribe, so a component can hand it straight to an effect.
     *
     * Stored marks only: a derived mark has no lifecycle to report, and recomputing one is cheaper
     * than keeping it in step.
     */
    onMarkUpdated(fn: (mark: Mark) => void): () => void;
    listMarks(channelId: string, types?: MarkType[]): Promise<{
        marks: Mark[];
        lastSeq: bigint;
    }>;
    /**
     * Mark notifications read (no ids = every unread one in the workspace). Optimistic: rows flip and the
     * badge drops immediately; the previous rows and count come back if the RPC fails.
     */
    markNotificationsRead(workspaceId: string, notificationIds?: string[]): Promise<void>;
    /** Page runs (newest first) into `runsById` / `runsByThread`. Resolves to the page and its next cursor. */
    listRuns(input?: ListRunsInput): Promise<{
        runs: Run[];
        nextCursor: string;
    }>;
    /** Fetch one run into the store. */
    getRun(runId: string): Promise<Run | undefined>;
    /**
     * Set my presence status (and optional custom status). Optimistic: `presence[me]` changes immediately
     * and is rolled back if the RPC fails; the server's presence replaces it on success.
     */
    setStatus(input: SetStatusInput): Promise<Presence | undefined>;
    /**
     * Upload a file: `CreateUpload` → PUT the bytes to the pre-signed URL (multipart parts when the server
     * returns `part_urls`) → `CompleteUpload`. Resolves to the `File`, which is also put in `filesById`.
     * `file` is a Blob/File on web and node, or `{ uri, name, mime, size }` on React Native.
     */
    uploadFile(file: UploadInput, opts: UploadFileOptions): Promise<File>;
    /** A pre-signed download URL for a file, memoized for 10 minutes (or the server's expiry, if sooner). */
    getDownloadUrl(fileId: string): Promise<string>;
    private flushOutbox;
    private flushOne;
    private persistOutboxEntry;
    private wireRealtime;
    private refreshChannel;
    private resync;
    private touchRecent;
    private schedulePersist;
    private persistNow;
    /**
     * Read progress, saved whenever it moves.
     *
     * Without this the only record of what had been read was the bootstrap
     * snapshot, which is written once per GetBootstrap and never updated. Anything
     * read afterwards was lost on the next launch, so the same messages came back
     * unread every time somebody signed in — no amount of reading them helped,
     * because reading was not what got saved.
     */
    private persistReadStates;
    private hydrate;
    private hydrateOnce;
}
export declare function createTankClient(opts: TankClientOptions): TankClient;
