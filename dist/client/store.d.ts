import type { Principal } from "../contracts/tank/auth/v1/auth_pb.js";
import type { Channel, ChannelReadState } from "../contracts/tank/channel/v1/channel_pb.js";
import { type AgentStatus, type AppCommand, type CardAction, type ChannelMembershipChanged, type ChannelUpdated, type Envelope, type MessageCreated, type MessageDeleted, type MessageUpdated, type NotificationCreated, type PresenceChanged, type ReactionAdded, type ReactionRemoved, type ReadStateUpdated, type Typing } from "../contracts/tank/events/v1/events_pb.js";
import type { Message } from "../contracts/tank/message/v1/message_pb.js";
import type { Presence } from "../contracts/tank/presence/v1/presence_pb.js";
import type { Member, Workspace } from "../contracts/tank/workspace/v1/workspace_pb.js";
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
    /** keyed by thread root id when set, else channel id. */
    agentStatus: Record<string, AgentStatus>;
    /** client_msg_id → outbox status. */
    pending: Record<string, PendingMessage>;
    connection: ConnectionState;
    /** workspaceId → last applied gateway cursor (decimal string; bigint-safe for JSON). */
    cursors: Record<string, string>;
}
export declare const TYPING_TTL_MS = 5000;
export declare function initialState(): TankState;
export type Action = {
    type: "bootstrap";
    workspace: Workspace;
    me: Member | undefined;
    channels: Channel[];
    readStates: ChannelReadState[];
    members: Member[];
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
    type: "typing";
    typing: Typing;
    now: number;
} | {
    type: "typing/expire";
    now: number;
} | {
    type: "agentStatus";
    status: AgentStatus;
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
export declare function typingKey(channelId: string, threadRootId?: string): string;
export declare function reduce(state: TankState, action: Action): TankState;
export type EventPayload = MessageCreated | MessageUpdated | MessageDeleted | ReactionAdded | ReactionRemoved | ReadStateUpdated | ChannelUpdated | ChannelMembershipChanged | CardAction | AppCommand | PresenceChanged | Typing | AgentStatus | NotificationCreated;
/** Decode an envelope's Any payload into one of the tank.events.v1 messages. */
export declare function unpackEnvelope(env: Envelope): EventPayload | undefined;
/** Reduce a gateway envelope into the store. Unknown payload types are ignored. */
export declare function envelopeToActions(env: Envelope, now: number): Action[];
export type { AgentStatus, Envelope, PresenceChanged, Typing };
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
    selectPresence: (userIds: readonly string[]) => Record<string, Presence>;
}
