import { type ReactNode } from "react";
import type { TankClient } from "../client/client.js";
import type { ChannelPaging, ConnectionState, PendingMessage, TankState, TankStore, ThreadView, Unreads } from "../client/store.js";
import type { Channel } from "../contracts/tank/channel/v1/channel_pb.js";
import type { Message } from "../contracts/tank/message/v1/message_pb.js";
import type { Presence } from "../contracts/tank/presence/v1/presence_pb.js";
import type { Workspace } from "../contracts/tank/workspace/v1/workspace_pb.js";
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
export { TankStore } from "../client/store.js";
export type { ChannelPaging, ConnectionState, PendingMessage, TankState, ThreadView, Unreads };
