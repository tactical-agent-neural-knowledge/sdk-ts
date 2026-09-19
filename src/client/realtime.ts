import { create, fromBinary, toBinary } from "@bufbuild/protobuf";
import type { AgentStatus, PresenceChanged, Typing } from "../contracts/tank/events/v1/events_pb.js";
import {
  ClientFrameSchema,
  ErrorCode,
  type Error as ErrorFrame,
  type Event,
  type Pong,
  type Ready,
  type Resumed,
  type ResyncRequired,
  ServerFrameSchema,
} from "../contracts/tank/realtime/v1/realtime_pb.js";
import { Backoff, type BackoffOptions } from "./backoff.js";
import { Emitter } from "./emitter.js";
import type { ConnectionState } from "./store.js";

/** The subset of the WHATWG WebSocket surface the client uses; `ws` implements it too. */
export interface WebSocketLike {
  binaryType: string;
  readyState: number;
  send(data: Uint8Array): void;
  close(code?: number, reason?: string): void;
  onopen: ((ev: unknown) => void) | null;
  onmessage: ((ev: { data: unknown }) => void) | null;
  onclose: ((ev: { code: number; reason: string }) => void) | null;
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
  close: { code: number; reason: string; willReconnect: boolean };
  /** A cursor advanced for a workspace (after the event was emitted). */
  cursor: { workspaceId: string; cursor: bigint };
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
  now?: () => number;
}

const CLOSE_GAP = 4000;
const CLOSE_STALE = 4001;
const CLOSE_RESYNC = 4002;
const CLOSE_UNAUTHENTICATED = 4003;
const CLOSE_STOP = 1000;

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
export class RealtimeClient {
  readonly events = new Emitter<RealtimeEvents>();
  private readonly opts: RealtimeOptions;
  private readonly Ws: WebSocketCtor;
  private readonly backoff: Backoff;
  private readonly now: () => number;

  private ws: WebSocketLike | undefined;
  private gen = 0;
  private stopped = true;
  private _state: ConnectionState = "idle";
  private session: RealtimeSession | undefined;
  private heartbeatMs: number;
  private heartbeatTimer: ReturnType<typeof setInterval> | undefined;
  private reconnectTimer: ReturnType<typeof setTimeout> | undefined;
  private gapTimer: ReturnType<typeof setTimeout> | undefined;
  private lastActivity = 0;
  private workspaceIds: string[];

  private readonly cursors = new Map<string, bigint>();
  private readonly buffered = new Map<string, Map<bigint, Event>>();

  private readonly subChannels = new Set<string>();
  private readonly subThreads = new Set<string>();
  private presenceUsers: string[] = [];
  private focused: string | undefined;
  private onlineHandler: (() => void) | undefined;

  constructor(opts: RealtimeOptions) {
    this.opts = opts;
    const Ws = opts.WebSocket ?? (globalThis as { WebSocket?: WebSocketCtor }).WebSocket;
    if (!Ws) throw new Error("RealtimeClient: no WebSocket implementation available; pass options.WebSocket");
    this.Ws = Ws;
    this.backoff = new Backoff(opts.backoff);
    this.now = opts.now ?? Date.now;
    this.heartbeatMs = opts.heartbeatMs ?? 25_000;
    this.workspaceIds = opts.workspaceIds ?? [];
    if (opts.session) this.session = opts.session;
    for (const [ws, c] of Object.entries(opts.cursors ?? {})) this.cursors.set(ws, BigInt(c));
  }

  get state(): ConnectionState {
    return this._state;
  }

  get currentSession(): RealtimeSession | undefined {
    return this.session;
  }

  getCursors(): Record<string, bigint> {
    return Object.fromEntries(this.cursors);
  }

  on<K extends keyof RealtimeEvents>(type: K, handler: (payload: RealtimeEvents[K]) => void): () => void {
    return this.events.on(type, handler);
  }

  setWorkspaceIds(ids: string[]): void {
    this.workspaceIds = ids.slice();
  }

  /** Load a persisted session and cursor map (call before start()). */
  restore(session: RealtimeSession | undefined, cursors: Record<string, bigint | string>): void {
    this.session = session;
    this.cursors.clear();
    for (const [ws, c] of Object.entries(cursors)) this.cursors.set(ws, BigInt(c));
  }

  /** Opens the socket and keeps it open until stop(). Idempotent. */
  start(): void {
    if (!this.stopped) return;
    this.stopped = false;
    const listen =
      this.opts.listenOnline ??
      typeof (globalThis as { addEventListener?: unknown }).addEventListener === "function";
    if (listen && !this.onlineHandler) {
      this.onlineHandler = () => this.retryNow();
      (globalThis as unknown as { addEventListener: (t: string, h: () => void) => void }).addEventListener(
        "online",
        this.onlineHandler,
      );
    }
    void this.connect();
  }

  /** Closes the socket for good; cursors and session stay readable for persistence. */
  stop(): void {
    this.stopped = true;
    this.gen++;
    this.clearTimers();
    if (this.onlineHandler) {
      (
        globalThis as unknown as { removeEventListener?: (t: string, h: () => void) => void }
      ).removeEventListener?.("online", this.onlineHandler);
      this.onlineHandler = undefined;
    }
    const ws = this.ws;
    this.ws = undefined;
    if (ws) {
      ws.onopen = ws.onmessage = ws.onclose = ws.onerror = null;
      try {
        ws.close(CLOSE_STOP, "stop");
      } catch {
        // already closed
      }
    }
    this.setState("closed");
  }

  /** Skip the pending backoff and reconnect now (the `online` event does this). */
  retryNow(): void {
    if (this.stopped || this.ws) return;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = undefined;
    this.backoff.reset();
    void this.connect();
  }

  // ------------------------------------------------------------ subscriptions

  subscribe(opts: { channelIds?: string[]; threadRootIds?: string[] }): void {
    const channelIds = (opts.channelIds ?? []).filter((c) => !this.subChannels.has(c));
    const threadRootIds = (opts.threadRootIds ?? []).filter((t) => !this.subThreads.has(t));
    for (const c of channelIds) this.subChannels.add(c);
    for (const t of threadRootIds) this.subThreads.add(t);
    if (channelIds.length === 0 && threadRootIds.length === 0) return;
    this.sendIfReady({ case: "subscribe", value: { channelIds, threadRootIds } });
  }

  unsubscribe(opts: { channelIds?: string[]; threadRootIds?: string[] }): void {
    const channelIds = (opts.channelIds ?? []).filter((c) => this.subChannels.delete(c));
    const threadRootIds = (opts.threadRootIds ?? []).filter((t) => this.subThreads.delete(t));
    if (channelIds.length === 0 && threadRootIds.length === 0) return;
    this.sendIfReady({ case: "unsubscribe", value: { channelIds, threadRootIds } });
  }

  /** Replaces the presence subscription set (max 500 ids). */
  presenceSubscribe(userIds: string[]): void {
    this.presenceUsers = Array.from(new Set(userIds)).slice(0, 500);
    this.sendIfReady({ case: "presenceSubscribe", value: { userIds: this.presenceUsers } });
  }

  typing(channelId: string, threadRootId = ""): void {
    this.sendIfReady({ case: "typing", value: { channelId, threadRootId } });
  }

  /** The channel the user is looking at; the server suppresses push for it. */
  focus(channelId: string): void {
    this.focused = channelId;
    this.sendIfReady({ case: "focus", value: { channelId } });
  }

  ping(): void {
    this.sendIfReady({ case: "ping", value: {} });
  }

  // ------------------------------------------------------------ connection

  private setState(s: ConnectionState): void {
    if (this._state === s) return;
    this._state = s;
    this.events.emit("state", s);
  }

  private clearTimers(): void {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.gapTimer) clearTimeout(this.gapTimer);
    this.heartbeatTimer = this.reconnectTimer = this.gapTimer = undefined;
  }

  private async connect(): Promise<void> {
    if (this.stopped || this.ws) return;
    const gen = ++this.gen;
    this.setState(this.backoff.attempts > 0 ? "reconnecting" : "connecting");

    // Resume needs no token; a fresh Hello does. Mint before opening so the
    // socket never idles unauthenticated.
    let token: string | undefined;
    const resumable = this.session !== undefined;
    if (!resumable) {
      try {
        token = await this.opts.getGatewayToken();
      } catch {
        if (gen !== this.gen) return;
        this.scheduleReconnect();
        return;
      }
      if (gen !== this.gen || this.stopped) return;
    }

    let ws: WebSocketLike;
    try {
      ws = new this.Ws(`${this.opts.wsUrl.replace(/\/$/, "")}/v1`);
    } catch {
      this.scheduleReconnect();
      return;
    }
    ws.binaryType = "arraybuffer";
    this.ws = ws;
    this.lastActivity = this.now();

    ws.onopen = () => {
      if (gen !== this.gen) return;
      this.setState("open");
      if (resumable && this.session) {
        this.send({
          case: "resume",
          value: {
            sessionId: this.session.sessionId,
            resumeToken: this.session.resumeToken,
            cursors: Object.fromEntries(this.cursors),
          },
        });
      } else {
        this.send({
          case: "hello",
          value: {
            accessToken: token ?? "",
            workspaceIds: this.workspaceIds,
            capabilities: this.opts.capabilities ?? [],
          },
        });
      }
    };
    ws.onmessage = (ev) => {
      if (gen !== this.gen) return;
      this.lastActivity = this.now();
      void this.decode(ev.data).then((bytes) => {
        if (gen !== this.gen || !bytes) return;
        this.handleFrame(bytes);
      });
    };
    ws.onerror = () => {
      // The close event follows; nothing to do here.
    };
    ws.onclose = (ev) => {
      if (gen !== this.gen) return;
      this.ws = undefined;
      this.stopHeartbeat();
      this.events.emit("close", { code: ev.code, reason: ev.reason, willReconnect: !this.stopped });
      if (this.stopped) return;
      this.scheduleReconnect(ev.code === CLOSE_GAP || ev.code === CLOSE_RESYNC ? 0 : undefined);
    };
  }

  private scheduleReconnect(delayMs?: number): void {
    if (this.stopped || this.reconnectTimer) return;
    this.setState("reconnecting");
    const delay = delayMs ?? this.backoff.next();
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      void this.connect();
    }, delay);
  }

  /** Close the current socket so the reconnect path runs; `code` selects immediate vs. backoff. */
  private reopen(code: number, reason: string): void {
    const ws = this.ws;
    if (!ws) return;
    this.ws = undefined;
    this.gen++;
    this.stopHeartbeat();
    ws.onopen = ws.onmessage = ws.onclose = ws.onerror = null;
    try {
      ws.close(code, reason);
    } catch {
      // ignore
    }
    this.events.emit("close", { code, reason, willReconnect: !this.stopped });
    this.scheduleReconnect(code === CLOSE_GAP || code === CLOSE_RESYNC ? 0 : undefined);
  }

  private async decode(data: unknown): Promise<Uint8Array | undefined> {
    if (data instanceof Uint8Array) return data;
    if (data instanceof ArrayBuffer) return new Uint8Array(data);
    if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    if (typeof Blob !== "undefined" && data instanceof Blob) return new Uint8Array(await data.arrayBuffer());
    if (Array.isArray(data)) {
      // `ws` can deliver fragmented frames as an array of chunks.
      const chunks = data as Uint8Array[];
      const out = new Uint8Array(chunks.reduce((n, c) => n + c.byteLength, 0));
      let off = 0;
      for (const c of chunks) {
        out.set(c, off);
        off += c.byteLength;
      }
      return out;
    }
    return undefined;
  }

  private send(kind: NonNullable<Parameters<typeof create<typeof ClientFrameSchema>>[1]>["kind"]): boolean {
    const ws = this.ws;
    if (ws?.readyState !== 1) return false;
    ws.send(toBinary(ClientFrameSchema, create(ClientFrameSchema, { kind })));
    return true;
  }

  private sendIfReady(
    kind: NonNullable<Parameters<typeof create<typeof ClientFrameSchema>>[1]>["kind"],
  ): boolean {
    if (this._state !== "ready") return false;
    return this.send(kind);
  }

  private resendSubscriptions(): void {
    if (this.subChannels.size > 0 || this.subThreads.size > 0) {
      this.send({
        case: "subscribe",
        value: { channelIds: Array.from(this.subChannels), threadRootIds: Array.from(this.subThreads) },
      });
    }
    if (this.presenceUsers.length > 0) {
      this.send({ case: "presenceSubscribe", value: { userIds: this.presenceUsers } });
    }
    if (this.focused) this.send({ case: "focus", value: { channelId: this.focused } });
  }

  // ------------------------------------------------------------ heartbeat

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (!this.ws) return;
      if (this.now() - this.lastActivity > this.heartbeatMs * 2) {
        this.reopen(CLOSE_STALE, "heartbeat timeout");
        return;
      }
      this.send({ case: "ping", value: {} });
    }, this.heartbeatMs);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = undefined;
  }

  // ------------------------------------------------------------ frames

  private handleFrame(bytes: Uint8Array): void {
    let frame: ReturnType<typeof fromBinary<typeof ServerFrameSchema>>;
    try {
      frame = fromBinary(ServerFrameSchema, bytes);
    } catch {
      return; // a malformed frame is dropped, not fatal
    }
    const k = frame.kind;
    switch (k.case) {
      case "ready": {
        this.session = { sessionId: k.value.sessionId, resumeToken: k.value.resumeToken };
        if (k.value.heartbeatIntervalMs > 0) this.heartbeatMs = k.value.heartbeatIntervalMs;
        this.backoff.reset();
        this.setState("ready");
        this.events.emit("session", this.session);
        this.events.emit("ready", k.value);
        this.resendSubscriptions();
        this.startHeartbeat();
        return;
      }
      case "resumed": {
        this.backoff.reset();
        this.setState("ready");
        this.events.emit("resumed", k.value);
        this.resendSubscriptions();
        this.startHeartbeat();
        return;
      }
      case "resyncRequired": {
        // Our cursors are beyond what the server can replay: forget everything
        // and Hello again; the store re-bootstraps on the resync event.
        this.session = undefined;
        this.cursors.clear();
        this.clearGap();
        this.events.emit("session", undefined);
        this.events.emit("resync", k.value);
        this.reopen(CLOSE_RESYNC, "resync");
        return;
      }
      case "event":
        this.handleEvent(k.value);
        return;
      case "pong":
        this.events.emit("pong", k.value);
        return;
      case "error": {
        this.events.emit("error", k.value);
        if (k.value.code === ErrorCode.UNAUTHENTICATED) {
          this.session = undefined;
          this.events.emit("session", undefined);
          this.reopen(CLOSE_UNAUTHENTICATED, "unauthenticated");
        }
        return;
      }
      case "typing":
        this.events.emit("typing", k.value);
        return;
      case "presence":
        this.events.emit("presence", k.value);
        return;
      case "agentStatus":
        this.events.emit("agent_status", k.value);
        return;
      default:
        return;
    }
  }

  // ------------------------------------------------------------ ordering

  private handleEvent(ev: Event): void {
    const ws = ev.envelope?.workspaceId ?? "";
    const last = this.cursors.get(ws);
    if (last === undefined || ev.cursor === last + 1n) {
      this.apply(ws, ev);
      this.drain(ws);
      return;
    }
    if (ev.cursor <= last) return; // duplicate (replay overlap)
    // Skipped ahead: hold it and wait for the gap to fill.
    let buf = this.buffered.get(ws);
    if (!buf) {
      buf = new Map();
      this.buffered.set(ws, buf);
    }
    buf.set(ev.cursor, ev);
    if (!this.gapTimer) {
      this.gapTimer = setTimeout(() => {
        this.gapTimer = undefined;
        this.onGapTimeout();
      }, this.opts.gapBufferMs ?? 500);
    }
  }

  private apply(ws: string, ev: Event): void {
    this.cursors.set(ws, ev.cursor);
    this.events.emit("event", ev);
    this.events.emit("cursor", { workspaceId: ws, cursor: ev.cursor });
  }

  private drain(ws: string): void {
    const buf = this.buffered.get(ws);
    if (!buf) return;
    let next = this.cursors.get(ws)! + 1n;
    while (buf.has(next)) {
      const ev = buf.get(next)!;
      buf.delete(next);
      this.apply(ws, ev);
      next += 1n;
    }
    if (buf.size === 0) this.buffered.delete(ws);
    if (this.buffered.size === 0) this.clearGap();
  }

  private clearGap(): void {
    if (this.gapTimer) clearTimeout(this.gapTimer);
    this.gapTimer = undefined;
    this.buffered.clear();
  }

  private onGapTimeout(): void {
    if (this.buffered.size === 0) return;
    // Anything held is dropped: the Resume replays everything after our cursors.
    this.buffered.clear();
    if (this.session) this.reopen(CLOSE_GAP, "cursor gap");
    else this.reopen(CLOSE_STALE, "cursor gap without session");
  }
}
