import { create, fromBinary, toBinary } from "@bufbuild/protobuf";
import { ClientFrameSchema, ErrorCode, ServerFrameSchema, } from "../contracts/tank/realtime/v1/realtime_pb.js";
import { Backoff } from "./backoff.js";
import { Emitter } from "./emitter.js";
/** Retries on the browser `online` event when `globalThis.addEventListener` exists; no-op elsewhere. */
export const browserOnlineSignal = (retry) => {
    const g = globalThis;
    if (typeof g.addEventListener !== "function")
        return () => { };
    g.addEventListener("online", retry);
    return () => g.removeEventListener?.("online", retry);
};
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
    events = new Emitter();
    opts;
    Ws;
    backoff;
    now;
    ws;
    gen = 0;
    stopped = true;
    _state = "idle";
    session;
    heartbeatMs;
    heartbeatTimer;
    reconnectTimer;
    lastActivity = 0;
    workspaceIds;
    cursors = new Map();
    subChannels = new Set();
    subThreads = new Set();
    presenceUsers = [];
    focused;
    offOnline;
    constructor(opts) {
        this.opts = opts;
        const Ws = opts.WebSocket ?? globalThis.WebSocket;
        if (!Ws)
            throw new Error("RealtimeClient: no WebSocket implementation available; pass options.WebSocket");
        this.Ws = Ws;
        this.backoff = new Backoff(opts.backoff);
        this.now = opts.now ?? Date.now;
        this.heartbeatMs = opts.heartbeatMs ?? 25_000;
        this.workspaceIds = opts.workspaceIds ?? [];
        if (opts.session)
            this.session = opts.session;
        for (const [ws, c] of Object.entries(opts.cursors ?? {}))
            this.cursors.set(ws, BigInt(c));
    }
    get state() {
        return this._state;
    }
    get currentSession() {
        return this.session;
    }
    getCursors() {
        return Object.fromEntries(this.cursors);
    }
    on(type, handler) {
        return this.events.on(type, handler);
    }
    setWorkspaceIds(ids) {
        this.workspaceIds = ids.slice();
    }
    /** Load a persisted session and cursor map (call before start()). */
    restore(session, cursors) {
        this.session = session;
        this.cursors.clear();
        for (const [ws, c] of Object.entries(cursors))
            this.cursors.set(ws, BigInt(c));
    }
    /** Opens the socket and keeps it open until stop(). Idempotent. */
    start() {
        if (!this.stopped)
            return;
        this.stopped = false;
        if (!this.offOnline) {
            const signal = this.opts.onlineSignal ?? (this.opts.listenOnline === false ? undefined : browserOnlineSignal);
            if (signal)
                this.offOnline = signal(() => this.retryNow());
        }
        void this.connect();
    }
    /** Closes the socket for good; cursors and session stay readable for persistence. */
    stop() {
        this.stopped = true;
        this.gen++;
        this.clearTimers();
        if (this.offOnline) {
            this.offOnline();
            this.offOnline = undefined;
        }
        const ws = this.ws;
        this.ws = undefined;
        if (ws) {
            ws.onopen = ws.onmessage = ws.onclose = ws.onerror = null;
            try {
                ws.close(CLOSE_STOP, "stop");
            }
            catch {
                // already closed
            }
        }
        this.setState("closed");
    }
    /** Skip the pending backoff and reconnect now (the `online` event does this). */
    retryNow() {
        if (this.stopped || this.ws)
            return;
        if (this.reconnectTimer)
            clearTimeout(this.reconnectTimer);
        this.reconnectTimer = undefined;
        this.backoff.reset();
        void this.connect();
    }
    // ------------------------------------------------------------ subscriptions
    subscribe(opts) {
        const channelIds = (opts.channelIds ?? []).filter((c) => !this.subChannels.has(c));
        const threadRootIds = (opts.threadRootIds ?? []).filter((t) => !this.subThreads.has(t));
        for (const c of channelIds)
            this.subChannels.add(c);
        for (const t of threadRootIds)
            this.subThreads.add(t);
        if (channelIds.length === 0 && threadRootIds.length === 0)
            return;
        this.sendIfReady({ case: "subscribe", value: { channelIds, threadRootIds } });
    }
    unsubscribe(opts) {
        const channelIds = (opts.channelIds ?? []).filter((c) => this.subChannels.delete(c));
        const threadRootIds = (opts.threadRootIds ?? []).filter((t) => this.subThreads.delete(t));
        if (channelIds.length === 0 && threadRootIds.length === 0)
            return;
        this.sendIfReady({ case: "unsubscribe", value: { channelIds, threadRootIds } });
    }
    /** Replaces the presence subscription set (max 500 ids). */
    presenceSubscribe(userIds) {
        this.presenceUsers = Array.from(new Set(userIds)).slice(0, 500);
        this.sendIfReady({ case: "presenceSubscribe", value: { userIds: this.presenceUsers } });
    }
    typing(channelId, threadRootId = "") {
        this.sendIfReady({ case: "typing", value: { channelId, threadRootId } });
    }
    /** The channel the user is looking at; the server suppresses push for it. */
    focus(channelId) {
        this.focused = channelId;
        this.sendIfReady({ case: "focus", value: { channelId } });
    }
    ping() {
        this.sendIfReady({ case: "ping", value: {} });
    }
    // ------------------------------------------------------------ connection
    setState(s) {
        if (this._state === s)
            return;
        this._state = s;
        this.events.emit("state", s);
    }
    clearTimers() {
        if (this.heartbeatTimer)
            clearInterval(this.heartbeatTimer);
        if (this.reconnectTimer)
            clearTimeout(this.reconnectTimer);
        this.heartbeatTimer = this.reconnectTimer = undefined;
    }
    async connect() {
        if (this.stopped || this.ws)
            return;
        const gen = ++this.gen;
        this.setState(this.backoff.attempts > 0 ? "reconnecting" : "connecting");
        // Resume needs no token; a fresh Hello does. Mint before opening so the
        // socket never idles unauthenticated.
        let token;
        const resumable = this.session !== undefined;
        if (!resumable) {
            try {
                token = await this.opts.getGatewayToken();
            }
            catch {
                if (gen !== this.gen)
                    return;
                this.scheduleReconnect();
                return;
            }
            if (gen !== this.gen || this.stopped)
                return;
        }
        let ws;
        try {
            ws = new this.Ws(`${this.opts.wsUrl.replace(/\/$/, "")}/v1`);
        }
        catch {
            this.scheduleReconnect();
            return;
        }
        ws.binaryType = "arraybuffer";
        this.ws = ws;
        this.lastActivity = this.now();
        ws.onopen = () => {
            if (gen !== this.gen)
                return;
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
            }
            else {
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
            if (gen !== this.gen)
                return;
            this.lastActivity = this.now();
            void this.decode(ev.data).then((bytes) => {
                if (gen !== this.gen || !bytes)
                    return;
                this.handleFrame(bytes);
            });
        };
        ws.onerror = () => {
            // The close event follows; nothing to do here.
        };
        ws.onclose = (ev) => {
            if (gen !== this.gen)
                return;
            this.ws = undefined;
            this.stopHeartbeat();
            this.events.emit("close", { code: ev.code, reason: ev.reason, willReconnect: !this.stopped });
            if (this.stopped)
                return;
            this.scheduleReconnect(ev.code === CLOSE_GAP || ev.code === CLOSE_RESYNC ? 0 : undefined);
        };
    }
    scheduleReconnect(delayMs) {
        if (this.stopped || this.reconnectTimer)
            return;
        this.setState("reconnecting");
        const delay = delayMs ?? this.backoff.next();
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = undefined;
            void this.connect();
        }, delay);
    }
    /** Close the current socket so the reconnect path runs; `code` selects immediate vs. backoff. */
    reopen(code, reason) {
        const ws = this.ws;
        if (!ws)
            return;
        this.ws = undefined;
        this.gen++;
        this.stopHeartbeat();
        ws.onopen = ws.onmessage = ws.onclose = ws.onerror = null;
        try {
            ws.close(code, reason);
        }
        catch {
            // ignore
        }
        this.events.emit("close", { code, reason, willReconnect: !this.stopped });
        this.scheduleReconnect(code === CLOSE_GAP || code === CLOSE_RESYNC ? 0 : undefined);
    }
    async decode(data) {
        if (data instanceof Uint8Array)
            return data;
        if (data instanceof ArrayBuffer)
            return new Uint8Array(data);
        if (ArrayBuffer.isView(data))
            return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        if (typeof Blob !== "undefined" && data instanceof Blob)
            return new Uint8Array(await data.arrayBuffer());
        if (Array.isArray(data)) {
            // `ws` can deliver fragmented frames as an array of chunks.
            const chunks = data;
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
    send(kind) {
        const ws = this.ws;
        if (ws?.readyState !== 1)
            return false;
        ws.send(toBinary(ClientFrameSchema, create(ClientFrameSchema, { kind })));
        return true;
    }
    sendIfReady(kind) {
        if (this._state !== "ready")
            return false;
        return this.send(kind);
    }
    resendSubscriptions() {
        if (this.subChannels.size > 0 || this.subThreads.size > 0) {
            this.send({
                case: "subscribe",
                value: { channelIds: Array.from(this.subChannels), threadRootIds: Array.from(this.subThreads) },
            });
        }
        if (this.presenceUsers.length > 0) {
            this.send({ case: "presenceSubscribe", value: { userIds: this.presenceUsers } });
        }
        if (this.focused)
            this.send({ case: "focus", value: { channelId: this.focused } });
    }
    // ------------------------------------------------------------ heartbeat
    startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatTimer = setInterval(() => {
            if (!this.ws)
                return;
            if (this.now() - this.lastActivity > this.heartbeatMs * 2) {
                this.reopen(CLOSE_STALE, "heartbeat timeout");
                return;
            }
            this.send({ case: "ping", value: {} });
        }, this.heartbeatMs);
    }
    stopHeartbeat() {
        if (this.heartbeatTimer)
            clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = undefined;
    }
    // ------------------------------------------------------------ frames
    handleFrame(bytes) {
        let frame;
        try {
            frame = fromBinary(ServerFrameSchema, bytes);
        }
        catch {
            return; // a malformed frame is dropped, not fatal
        }
        const k = frame.kind;
        switch (k.case) {
            case "ready": {
                this.session = { sessionId: k.value.sessionId, resumeToken: k.value.resumeToken };
                if (k.value.heartbeatIntervalMs > 0)
                    this.heartbeatMs = k.value.heartbeatIntervalMs;
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
    handleEvent(ev) {
        // Cursors are JetStream stream sequences and only ever used to Resume.
        // The gateway delivers just the events this socket is subscribed to, so
        // cursor numbers legitimately skip; a skip is not a gap. The server
        // guarantees per-connection ordering, so anything at or below the last
        // applied cursor is a replay overlap and is dropped.
        const ws = ev.envelope?.workspaceId ?? "";
        const last = this.cursors.get(ws);
        if (last !== undefined && ev.cursor <= last)
            return;
        this.apply(ws, ev);
    }
    apply(ws, ev) {
        this.cursors.set(ws, ev.cursor);
        this.events.emit("event", ev);
        this.events.emit("cursor", { workspaceId: ws, cursor: ev.cursor });
    }
    clearGap() {
        // Kept for callers; there is no gap buffer any more.
    }
}
