import { type ReactNode } from "react";
import type { TankClient } from "../client/client.js";
import { type ChannelPaging, type ConnectionState, type NotificationPaging, type PendingMessage, type TankState, type TankStore, type ThreadView, type Unreads } from "../client/store.js";
import type { Run } from "../contracts/tank/agent/v1/agent_pb.js";
import type { Channel } from "../contracts/tank/channel/v1/channel_pb.js";
import type { AgentStatus } from "../contracts/tank/events/v1/events_pb.js";
import type { File } from "../contracts/tank/files/v1/files_pb.js";
import type { Message } from "../contracts/tank/message/v1/message_pb.js";
import type { Notification } from "../contracts/tank/notification/v1/notification_pb.js";
import type { Presence } from "../contracts/tank/presence/v1/presence_pb.js";
import type { Mark, WaitingDirection, WaitingOnItem } from "../contracts/tank/topo/v1/topo_pb.js";
import type { Entitlements, Workspace } from "../contracts/tank/workspace/v1/workspace_pb.js";
export interface TankProviderProps {
    client: TankClient;
    /** Call client.start() on mount and stop() on unmount. Default true. */
    autoStart?: boolean;
    children?: ReactNode;
}
export declare function TankProvider({ client, autoStart, children }: TankProviderProps): import("react").JSX.Element;
export declare function useTank(): TankClient;
/** Subscribe to a memoized slice of the store. `select` must return a stable reference for unchanged input. */
export declare function useTankSelector<T>(select: (store: TankStore) => T): T;
export declare function useConnectionState(): ConnectionState;
export declare function useWorkspace(id: string): Workspace | undefined;
export declare function useChannels(workspaceId: string): Channel[];
export declare function useChannel(id: string): Channel | undefined;
export interface TopoMarks {
    marks: Mark[];
    /** The channel's newest seq, which is the strip's axis length. */
    lastSeq: bigint;
    loading: boolean;
}
/**
 * The marks for a channel's Topo strip.
 *
 * Refetches when the channel's `lastSeq` moves, which is the one signal that can add, move or
 * retire a derived mark — a new message, a new mention, or the read horizon advancing. Marks are
 * not in the normalized store, so this owns the small amount of state a strip needs. A stale
 * response from a channel the user has already left is dropped rather than rendered.
 */
export declare function useTopoMarks(channelId: string): TopoMarks;
export interface WaitingOn {
    items: WaitingOnItem[];
    loading: boolean;
    /** Refetch. The queues are small and read rarely; a re-read beats an invalidation rule. */
    reload: () => void;
}
/**
 * One side of the waiting-on relationship: what is owed to you, or what you owe.
 *
 * Re-reads whenever a stored mark changes anywhere in the workspace. That is coarser than tracking
 * which mark moved, and deliberately so — the queues hold a handful of rows, and a wrong
 * invalidation rule here shows somebody an obligation they have already discharged.
 */
export declare function useWaitingOn(workspaceId: string, direction: WaitingDirection): WaitingOn;
export interface UseMessagesResult {
    messages: Message[];
    /** A page is being fetched (including the first one). */
    loading: boolean;
    /** Whether older messages exist. `false` until the first page has loaded. */
    hasMoreBefore: boolean;
    /** Page older messages in. */
    loadOlder: () => Promise<boolean>;
}
export interface UseMessagesOptions {
    /** Subscribe + focus the channel on the gateway and load the first page. Default true. */
    view?: boolean;
    pageSize?: number;
}
/** Messages for a channel in channel_seq order (optimistic sends trail), with paging. */
export declare function useMessages(channelId: string, opts?: UseMessagesOptions): UseMessagesResult;
/** A thread's root and replies; subscribes and loads on mount. */
export declare function useThread(rootId: string, opts?: {
    view?: boolean;
}): ThreadView;
/** Channel unreads for a workspace, with thread unreads counted separately in `threads` / `byThread`. */
export declare function useUnreads(workspaceId: string): Unreads;
/** Unread replies in one thread (root reply_count minus my last read thread_seq). */
export declare function useThreadUnread(rootId: string): number;
/** Presence for a set of users; keeps the gateway presence subscription in sync while mounted. */
export declare function usePresence(userIds: readonly string[]): Record<string, Presence>;
/** User ids currently typing in a channel (or thread), excluding me. */
export declare function useTyping(channelId: string, threadRootId?: string): string[];
export interface UseNotificationsOptions {
    /** Only unread rows. Default false. */
    unreadOnly?: boolean;
    /** Load the first page on mount when it has not been loaded yet. Default true. */
    load?: boolean;
    pageSize?: number;
}
export interface UseNotificationsResult {
    /** Newest first. */
    notifications: Notification[];
    loading: boolean;
    /** `false` until the first page has landed, then the server's paging flag. */
    hasMore: boolean;
    loadMore: () => Promise<unknown>;
    /** Mark rows read (no ids = every unread one in the workspace). Optimistic. */
    markRead: (notificationIds?: string[]) => Promise<void>;
}
/** A workspace's notifications (unread or all), loading the first page on mount. */
export declare function useNotifications(workspaceId: string, opts?: UseNotificationsOptions): UseNotificationsResult;
/** The workspace's unread notification badge (bootstrap count + live deltas). */
export declare function useUnreadNotificationCount(workspaceId: string): number;
/**
 * What this workspace's plan allows. Absent until bootstrap lands, and absent from an older server,
 * so a caller treats `undefined` as "assume free and let the server decide" rather than unlocking.
 */
export declare function useEntitlements(workspaceId: string): Entitlements | undefined;
/** One run by id; fetched with `GetRun` on mount when the store does not have it. */
export declare function useRun(runId: string, opts?: {
    load?: boolean;
}): Run | undefined;
/**
 * The newest run in a thread; seeds from `ListRuns` on mount when none is known. `agent.run.updated`
 * is fanned out on the thread subject, so keep `useThread(rootId)` mounted for live updates.
 */
export declare function useThreadRun(rootId: string, opts?: {
    load?: boolean;
}): Run | undefined;
/** Runs in a workspace, newest first (whatever `ListRuns` pages and events have put in the store). */
export declare function useRuns(workspaceId: string): Run[];
/** The whole thread root id → run map (stable reference); message lists index it per row. */
export declare function useRunsByThread(): Record<string, Run>;
/** The live `agent_status` frame for a thread root id (or channel id); `undefined` once it expires (30 s). */
export declare function useAgentStatus(threadRootIdOrChannelId: string): AgentStatus | undefined;
/** Every live `agent_status` frame in a channel (its threads included). */
export declare function useAgentStatuses(channelId: string): AgentStatus[];
/** A file the store knows about (from an upload or a `file.ready` event). */
export declare function useFile(fileId: string): File | undefined;
/** The known `File`s a message references, in `file_ids` order. */
export declare function useMessageFiles(messageId: string): File[];
export { TankStore } from "../client/store.js";
export type { ChannelPaging, ConnectionState, NotificationPaging, PendingMessage, TankState, ThreadView, Unreads, };
