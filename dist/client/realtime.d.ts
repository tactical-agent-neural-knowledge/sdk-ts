import type { AgentStatus, PresenceChanged, Typing } from "../contracts/tank/events/v1/events_pb.js";
import { type Error as ErrorFrame, type Event, type Pong, type Ready, type Resumed, type ResyncRequired } from "../contracts/tank/realtime/v1/realtime_pb.js";
import { type BackoffOptions } from "./backoff.js";
import { Emitter } from "./emitter.js";
import type { ConnectionState } from "./store.js";
/** The subset of the WHATWG WebSocket surface the client uses; `ws` implements it too. */
export interface WebSocketLike {
    binaryType: string;
    readyState: number;
    send(data: Uint8Array): void;
    close(code?: number, reason?: string): void;
    onopen: ((ev: unknown) => void) | null;
    onmessage: ((ev: {
        data: unknown;
    }) => void) | null;
    onclose: ((ev: {
        code: number;
        reason: string;
    }) => void) | null;
    onerror: ((ev: unknown) => void) | null;
}
export type WebSocketCtor = new (url: string) => WebSocketLike;
export interface RealtimeSession {
    sessionId: string;
    resumeToken: string;
}
export interface RealtimeEvents {
    state: ConnectionState;
    ready: Ready;
    resumed: Resumed;
    /** Server could not replay from our cursors; the store must re-bootstrap. Cursors were cleared. */
    resync: ResyncRequired;
    /** An in-order durable event. `cursor` has already been recorded. */
    event: Event;
    typing: Typing;
    presence: PresenceChanged;
    agent_status: AgentStatus;
    pong: Pong;
    error: ErrorFrame;
    /** Socket closed (any reason). `willReconnect` is false after stop(). */
    close: {
        code: number;
        reason: string;
        willReconnect: boolean;
    };
    /** A cursor advanced for a workspace (after the event was emitted). */
    cursor: {
        workspaceId: string;
        cursor: bigint;
    };
    /** The session changed (Ready) or was cleared (resync / unauthenticated). */
    session: RealtimeSession | undefined;
}
export interface RealtimeOptions {
    /** Gateway origin, e.g. `wss://gw.tank.chat`. The client connects to `${wsUrl}/v1`. */
    wsUrl: string;
    /** Mints a short-lived gateway bearer (AuthService.MintGatewayToken). Called before every Hello. */
    getGatewayToken: () => Promise<string>;
    workspaceIds?: string[];
    capabilities?: string[];
    /** WebSocket implementation; defaults to `globalThis.WebSocket`. */
    WebSocket?: WebSocketCtor;
    /** Client heartbeat interval; the server's Ready.heartbeat_interval_ms overrides it when > 0. Default 25s. */
    heartbeatMs?: number;
    /** How long an out-of-order event may wait for its predecessor before we Resume. Default 500ms. */
    gapBufferMs?: number;
    backoff?: BackoffOptions;
    /** Cursors persisted from a previous session, per workspace. */
    cursors?: Record<string, bigint | string>;
    session?: RealtimeSession;
    /** Listen for the browser `online` event to retry immediately. Default: when `globalThis.addEventListener` exists. */
    listenOnline?: boolean;
    /**
     * Injectable "we are back online" signal: called with `retry` on start(); must return an unsubscribe
     * function. Default: `globalThis.addEventListener("online", retry)` when available, otherwise a no-op.
     * React Native: wire `@react-native-community/netinfo` here.
     */
    onlineSignal?: OnlineSignal;
    now?: () => number;
}
export type OnlineSignal = (retry: () => void) => () => void;
/** Retries on the browser `online` event when `globalThis.addEventListener` exists; no-op elsewhere. */
export declare const browserOnlineSignal: OnlineSignal;
/**
 * Binary tank.realtime.v1 client over one WebSocket.
 *
 * - Hello with a freshly minted gateway token, or Resume with the persisted
 *   session + per-workspace cursors.
 * - Heartbeat Ping every 25s (or the server's interval); two missed beats
 *   close the socket.
 * - Reconnect with full-jitter backoff 250ms → 30s, retried immediately on the
 *   browser `online` event.
 * - Strict per-workspace cursor ordering: an event that skips ahead is held
 *   for `gapBufferMs`; if the gap is not filled the client Resumes (close +
 *   reconnect with cursors) so the server replays the missing range.
 * - Subscriptions (channels, threads, presence set, focus) are remembered and
 *   re-sent after every Ready/Resumed.
 */
export declare class RealtimeClient {
    readonly events: Emitter<RealtimeEvents>;
    private readonly opts;
    private readonly Ws;
    private readonly backoff;
    private readonly now;
    private ws;
    private gen;
    private stopped;
    private _state;
    private session;
    private heartbeatMs;
    private heartbeatTimer;
    private reconnectTimer;
    private gapTimer;
    private lastActivity;
    private workspaceIds;
    private readonly cursors;
    private readonly buffered;
    private readonly subChannels;
    private readonly subThreads;
    private presenceUsers;
    private focused;
    private offOnline;
    constructor(opts: RealtimeOptions);
    get state(): ConnectionState;
    get currentSession(): RealtimeSession | undefined;
    getCursors(): Record<string, bigint>;
    on<K extends keyof RealtimeEvents>(type: K, handler: (payload: RealtimeEvents[K]) => void): () => void;
    setWorkspaceIds(ids: string[]): void;
    /** Load a persisted session and cursor map (call before start()). */
    restore(session: RealtimeSession | undefined, cursors: Record<string, bigint | string>): void;
    /** Opens the socket and keeps it open until stop(). Idempotent. */
    start(): void;
    /** Closes the socket for good; cursors and session stay readable for persistence. */
    stop(): void;
    /** Skip the pending backoff and reconnect now (the `online` event does this). */
    retryNow(): void;
    subscribe(opts: {
        channelIds?: string[];
        threadRootIds?: string[];
    }): void;
    unsubscribe(opts: {
        channelIds?: string[];
        threadRootIds?: string[];
    }): void;
    /** Replaces the presence subscription set (max 500 ids). */
    presenceSubscribe(userIds: string[]): void;
    typing(channelId: string, threadRootId?: string): void;
    /** The channel the user is looking at; the server suppresses push for it. */
    focus(channelId: string): void;
    ping(): void;
    private setState;
    private clearTimers;
    private connect;
    private scheduleReconnect;
    /** Close the current socket so the reconnect path runs; `code` selects immediate vs. backoff. */
    private reopen;
    private decode;
    private send;
    private sendIfReady;
    private resendSubscriptions;
    private startHeartbeat;
    private stopHeartbeat;
    private handleFrame;
    private handleEvent;
    private apply;
    private drain;
    private clearGap;
    private onGapTimeout;
}
