import { type Client, type Interceptor, type Transport } from "@connectrpc/connect";
import { AgentService } from "../contracts/tank/agent/v1/agent_pb.js";
import { AuthService } from "../contracts/tank/auth/v1/auth_pb.js";
import type { BlockAction } from "../contracts/tank/blocks/v1/blocks_pb.js";
import { type Channel, ChannelService, ChannelType, type TreadGoal } from "../contracts/tank/channel/v1/channel_pb.js";
import { FilesService } from "../contracts/tank/files/v1/files_pb.js";
import { ChatService, type Message, MessageKind, type PostMessageRequest } from "../contracts/tank/message/v1/message_pb.js";
import { PresenceService } from "../contracts/tank/presence/v1/presence_pb.js";
import { type GetBootstrapResponse, Role, WorkspaceService } from "../contracts/tank/workspace/v1/workspace_pb.js";
import { Emitter } from "./emitter.js";
import { RealtimeClient, type RealtimeOptions, type WebSocketCtor } from "./realtime.js";
import { type TankStorage } from "./storage.js";
import { TankStore } from "./store.js";
import { type TankAuth } from "./transport.js";
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
    interceptors?: Interceptor[];
    /** Replace the Connect transport entirely (tests, React Native, node). `baseUrl`/`auth`/`fetch` are then unused. */
    transport?: Transport;
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
    constructor(opts: TankClientOptions);
    /** Hydrates from storage, opens the gateway socket and flushes the outbox. */
    start(): Promise<void>;
    stop(): Promise<void>;
    /** GetBootstrap for a workspace: workspace, me, channels, read states, capped members. */
    bootstrap(workspaceId: string): Promise<GetBootstrapResponse>;
    /** Pages messages into the store. Resolves to whether more exist in that direction. */
    loadChannel(channelId: string, opts?: LoadChannelOptions): Promise<boolean>;
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
    addReaction(messageId: string, emoji: string): Promise<unknown>;
    removeReaction(messageId: string, emoji: string): Promise<unknown>;
    /** A user interacted with a block; delivered to the owning app/agent as an event. */
    postBlockAction(action: Pick<BlockAction, "messageId" | "blockId" | "actionId" | "value">): Promise<unknown>;
    private flushOutbox;
    private flushOne;
    private persistOutboxEntry;
    private wireRealtime;
    private refreshChannel;
    private resync;
    private touchRecent;
    private schedulePersist;
    private persistNow;
    private hydrate;
    private hydrateOnce;
}
export declare function createTankClient(opts: TankClientOptions): TankClient;
