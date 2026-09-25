import { type Timestamp } from "@bufbuild/protobuf/wkt";
import type { Run } from "../contracts/tank/agent/v1/agent_pb.js";
import type { Principal } from "../contracts/tank/auth/v1/auth_pb.js";
import type { Channel, ChannelReadState } from "../contracts/tank/channel/v1/channel_pb.js";
import { type AgentRunUpdated, type AgentStatus, type AppCommand, type CardAction, type ChannelMembershipChanged, type ChannelUpdated, type Envelope, type FileReady, type MessageCreated, type MessageDeleted, type MessageEphemeral, type MessageUpdated, type NotificationCreated, type NotificationsRead, type PresenceChanged, type ReactionAdded, type ReactionRemoved, type ReadStateUpdated, type TopoMarkUpdated, type Typing } from "../contracts/tank/events/v1/events_pb.js";
import type { File } from "../contracts/tank/files/v1/files_pb.js";
import type { Message } from "../contracts/tank/message/v1/message_pb.js";
import { type Notification } from "../contracts/tank/notification/v1/notification_pb.js";
import type { Presence } from "../contracts/tank/presence/v1/presence_pb.js";
import type { Entitlements, Member, Workspace } from "../contracts/tank/workspace/v1/workspace_pb.js";
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
export declare const TYPING_TTL_MS = 5000;
/** How long an `agent_status` frame stays live without a newer one. */
export declare const AGENT_STATUS_TTL_MS = 30000;
export declare function initialState(): TankState;
export type Action = {
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
} | {
    type: "workspaces/upsert";
    workspaces: Workspace[];
} | {
    type: "members/upsert";
    workspaceId: string;
    members: Member[];
} | {
    type: "channels/upsert";
    channels: Channel[];
} | {
    type: "channels/remove";
    channelId: string;
} | {
    type: "messages/upsert";
    messages: Message[];
}
/** Replace a channel's timeline with a freshly fetched page, dropping rows the server no longer
 *  returns. Unsent optimistic rows survive; the `messages` map keeps its entries so threads that
 *  still reference them are unaffected. */
 | {
    type: "messages/resetChannel";
    channelId: string;
    messages: Message[];
} | {
    type: "messages/created";
    message: Message;
} | {
    type: "messages/updated";
    message: Message;
} | {
    type: "messages/deleted";
    messageId: string;
    channelId: string;
    threadRootId: string;
} | {
    type: "reactions/added";
    messageId: string;
    userId: string;
    emoji: string;
} | {
    type: "reactions/removed";
    messageId: string;
    userId: string;
    emoji: string;
} | {
    type: "readStates/upsert";
    readStates: ChannelReadState[];
} | {
    type: "readStates/updated";
    channelId: string;
    lastReadSeq: bigint;
    userId: string;
    /** When set, this is a thread read state: `lastReadThreadSeq` applies to `threadRootId`. */
    threadRootId?: string;
    lastReadThreadSeq?: bigint;
} | {
    type: "membership/changed";
    channelId: string;
    userId: string;
    joined: boolean;
} | {
    type: "presence/changed";
    presence: Presence;
} | {
    type: "presence/upsert";
    presences: Presence[];
} | {
    type: "presence/remove";
    userId: string;
} | {
    type: "typing";
    typing: Typing;
    now: number;
} | {
    type: "typing/expire";
    now: number;
}
/** `now` defaults to `Date.now()`; an empty `status.status` clears the entry. */
 | {
    type: "agentStatus";
    status: AgentStatus;
    now?: number;
} | {
    type: "agentStatus/expire";
    now: number;
} | {
    type: "notifications/upsert";
    workspaceId: string;
    notifications: Notification[];
    unreadCount?: number;
}
/** A `NotificationCreated` event: builds the row (user = me) and bumps the unread count when it is new. */
 | {
    type: "notifications/created";
    workspaceId: string;
    event: NotificationCreated;
    occurredAt?: Timestamp;
}
/** Flip rows to read (empty ids = every notification in the workspace) and drop the unread count accordingly. */
 | {
    type: "notifications/read";
    workspaceId: string;
    notificationIds: string[];
    readAt: Timestamp;
}
/** Put rows back (rollback of an optimistic read) and reset the unread count. */
 | {
    type: "notifications/restore";
    workspaceId: string;
    notifications: Notification[];
    unreadCount: number;
} | {
    type: "unreadNotificationCount/set";
    workspaceId: string;
    count: number;
} | {
    type: "entitlements/set";
    workspaceId: string;
    entitlements: Entitlements;
} | {
    type: "notificationPaging/set";
    workspaceId: string;
    mode: NotificationMode;
    paging: Partial<NotificationPaging>;
} | {
    type: "runs/upsert";
    runs: Run[];
} | {
    type: "files/upsert";
    files: File[];
} | {
    type: "pending/add";
    message: Message;
    now: number;
} | {
    type: "pending/failed";
    clientMsgId: string;
    error: string;
} | {
    type: "pending/retry";
    clientMsgId: string;
} | {
    type: "pending/resolve";
    clientMsgId: string;
    message: Message;
} | {
    type: "pending/discard";
    clientMsgId: string;
} | {
    type: "paging/set";
    channelId: string;
    paging: Partial<ChannelPaging>;
} | {
    type: "connection";
    state: ConnectionState;
} | {
    type: "cursor";
    workspaceId: string;
    cursor: bigint;
} | {
    type: "cursors/reset";
} | {
    type: "hydrate";
    patch: Partial<TankState>;
};
export declare function tsMs(t: Timestamp | undefined): number;
export declare function notificationPagingKey(workspaceId: string, mode: NotificationMode): string;
export declare function typingKey(channelId: string, threadRootId?: string): string;
export declare function reduce(state: TankState, action: Action): TankState;
/** Every `tank.events.v1` payload this SDK's vendored contracts know how to decode. */
export type KnownEventPayload = MessageCreated | MessageUpdated | MessageDeleted | ReactionAdded | ReactionRemoved | ReadStateUpdated | ChannelUpdated | ChannelMembershipChanged | CardAction | AppCommand | PresenceChanged | Typing | AgentStatus | FileReady | MessageEphemeral | NotificationsRead | AgentRunUpdated | NotificationCreated | TopoMarkUpdated;
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
export declare function unpackEnvelope(env: Envelope): EventPayload | undefined;
/** Reduce a gateway envelope into the store. Unknown payload types are ignored. */
export declare function envelopeToActions(env: Envelope, now: number): Action[];
export type { AgentRunUpdated, AgentStatus, Envelope, FileReady, MessageEphemeral, NotificationCreated, NotificationsRead, PresenceChanged, Typing, };
export type Listener = () => void;
export interface Unreads {
    /** Unread channel messages across the workspace (threads excluded). */
    total: number;
    mentions: number;
    byChannel: Record<string, {
        unread: number;
        mentions: number;
    }>;
    /** Unread thread replies across followed threads (see `TankStore.selectThreadUnread`). */
    threads: number;
    /** thread root id → unread replies; only threads with unread > 0. */
    byThread: Record<string, number>;
}
export interface ThreadView {
    root: Message | undefined;
    replies: Message[];
}
/**
 * Holds the state, notifies subscribers synchronously after each dispatch, and
 * memoizes derived views so `useSyncExternalStore` selectors return stable
 * references when nothing they depend on changed.
 */
export declare class TankStore {
    private state;
    private listeners;
    private memo;
    constructor(state?: TankState);
    getState: () => TankState;
    subscribe: (listener: Listener) => (() => void);
    dispatch(action: Action): void;
    applyEnvelope(env: Envelope, now?: number): void;
    /** Cache keyed by name+args; recomputes only when `deps` change; keeps the old array when contents are identical. */
    private memoize;
    selectChannelMessages: (channelId: string) => Message[];
    selectThread: (rootId: string) => ThreadView;
    selectChannels: (workspaceId: string) => Channel[];
    /**
     * Unread replies in a thread: the root's reply_count (or the newest loaded
     * reply's thread_seq) minus my last read thread_seq. 0 when the root is unknown.
     */
    selectThreadUnread: (rootId: string) => number;
    /**
     * Channel unreads (total/mentions/byChannel) plus thread unreads counted
     * separately. Threads counted: every root with a known thread read state, and
     * every loaded root I authored or replied in (`followedThreads`).
     */
    selectUnreads: (workspaceId: string) => Unreads;
    selectTyping: (channelId: string, threadRootId?: string) => string[];
    /** A workspace's notifications newest first; `unreadOnly` keeps only rows without `read_at`. */
    selectNotifications: (workspaceId: string, unreadOnly?: boolean) => Notification[];
    /** Runs in a workspace, newest first (by started_at). */
    selectRuns: (workspaceId: string) => Run[];
    /** The live `agent_status` frame for a thread root id (or a channel id, for channel-level frames). */
    selectAgentStatus: (key: string) => AgentStatus | undefined;
    /** Every live `agent_status` frame in a channel (channel-level and per-thread). */
    selectAgentStatuses: (channelId: string) => AgentStatus[];
    /** The `File`s a message references that the store knows about (from uploads and `file.ready`). */
    selectMessageFiles: (messageId: string) => File[];
    selectPresence: (userIds: readonly string[]) => Record<string, Presence>;
}
