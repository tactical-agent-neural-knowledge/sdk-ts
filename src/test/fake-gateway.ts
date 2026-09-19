import { create, fromBinary, toBinary } from "@bufbuild/protobuf";
import { type Any, anyPack, timestampFromMs } from "@bufbuild/protobuf/wkt";
import { type WebSocket, WebSocketServer } from "ws";
import {
  type Envelope,
  EnvelopeSchema,
  MessageCreatedSchema,
  MessageDeletedSchema,
  MessageUpdatedSchema,
  ReactionAddedSchema,
  ReadStateUpdatedSchema,
} from "../contracts/tank/events/v1/events_pb.js";
import { type Message, MessageSchema } from "../contracts/tank/message/v1/message_pb.js";
import {
  type ClientFrame,
  ClientFrameSchema,
  type ServerFrame,
  ServerFrameSchema,
} from "../contracts/tank/realtime/v1/realtime_pb.js";

type ServerKind = NonNullable<Parameters<typeof create<typeof ServerFrameSchema>>[1]>["kind"];

export interface FakeConn {
  socket: WebSocket;
  received: ClientFrame[];
  ready: boolean;
  sessionId: string;
  channels: Set<string>;
  threads: Set<string>;
  presence: string[];
  focused: string;
  /** cursor per workspace the client has acknowledged (from Resume). */
  resumeCursors: Record<string, bigint>;
}

export interface FakeGatewayOptions {
  /** Tokens the gateway accepts on Hello. Default: any non-empty token. */
  acceptToken?: (token: string) => boolean;
  heartbeatIntervalMs?: number;
  /** If set, Resume with these session ids gets ResyncRequired. */
  rejectResumeFor?: Set<string>;
}

/**
 * In-process tank.realtime.v1 gateway for tests: speaks the binary frame
 * protocol over `ws`, keeps an event log per workspace so Resume can replay,
 * and records every client frame for assertions.
 */
export class FakeGateway {
  readonly wss: WebSocketServer;
  readonly conns: FakeConn[] = [];
  readonly log = new Map<string, Array<{ cursor: bigint; envelope: Envelope }>>();
  private cursors = new Map<string, bigint>();
  private sessions = new Map<string, { resumeToken: string }>();
  private nextSession = 1;
  private nextEnvelope = 1;
  readonly opts: FakeGatewayOptions;

  private constructor(wss: WebSocketServer, opts: FakeGatewayOptions) {
    this.wss = wss;
    this.opts = opts;
    wss.on("connection", (socket) => this.accept(socket));
  }

  static async start(opts: FakeGatewayOptions = {}): Promise<FakeGateway> {
    const wss = new WebSocketServer({ port: 0 });
    await new Promise<void>((resolve) => wss.once("listening", () => resolve()));
    return new FakeGateway(wss, opts);
  }

  get url(): string {
    const addr = this.wss.address();
    if (typeof addr === "string" || !addr) throw new Error("no address");
    return `ws://127.0.0.1:${addr.port}`;
  }

  async close(): Promise<void> {
    for (const c of this.conns) c.socket.terminate();
    await new Promise<void>((resolve) => this.wss.close(() => resolve()));
  }

  /** Waits until a connection satisfies `pred` (default: any ready connection). */
  waitFor(pred: (c: FakeConn) => boolean = (c) => c.ready, timeoutMs = 5000): Promise<FakeConn> {
    return new Promise((resolve, reject) => {
      const started = Date.now();
      const tick = () => {
        const hit = this.conns.find(pred);
        if (hit) return resolve(hit);
        if (Date.now() - started > timeoutMs) return reject(new Error("FakeGateway.waitFor timeout"));
        setTimeout(tick, 5);
      };
      tick();
    });
  }

  /** Current live connections (socket open). */
  get live(): FakeConn[] {
    return this.conns.filter((c) => c.socket.readyState === c.socket.OPEN);
  }

  /** Appends to the workspace log and pushes to every ready connection. Returns the cursor. */
  emit(workspaceId: string, envelope: Envelope, opts: { deliver?: boolean } = {}): bigint {
    const cursor = (this.cursors.get(workspaceId) ?? 0n) + 1n;
    this.cursors.set(workspaceId, cursor);
    const entries = this.log.get(workspaceId) ?? [];
    entries.push({ cursor, envelope });
    this.log.set(workspaceId, entries);
    if (opts.deliver !== false) {
      for (const c of this.live) if (c.ready) this.sendEvent(c, cursor, envelope);
    }
    return cursor;
  }

  sendEvent(conn: FakeConn, cursor: bigint, envelope: Envelope): void {
    this.send(conn, { case: "event", value: { cursor, envelope } });
  }

  send(conn: FakeConn, kind: ServerKind): void {
    if (conn.socket.readyState !== conn.socket.OPEN) return;
    const frame: ServerFrame = create(ServerFrameSchema, { kind });
    conn.socket.send(toBinary(ServerFrameSchema, frame));
  }

  closeAll(code = 1012, reason = "restart"): void {
    for (const c of this.live) c.socket.close(code, reason);
  }

  private accept(socket: WebSocket): void {
    const conn: FakeConn = {
      socket,
      received: [],
      ready: false,
      sessionId: "",
      channels: new Set(),
      threads: new Set(),
      presence: [],
      focused: "",
      resumeCursors: {},
    };
    this.conns.push(conn);
    socket.on("message", (data) => {
      const bytes = Array.isArray(data) ? Buffer.concat(data) : Buffer.from(data as ArrayBuffer);
      const frame = fromBinary(ClientFrameSchema, new Uint8Array(bytes));
      conn.received.push(frame);
      this.handle(conn, frame);
    });
  }

  private handle(conn: FakeConn, frame: ClientFrame): void {
    const k = frame.kind;
    switch (k.case) {
      case "hello": {
        const ok = this.opts.acceptToken
          ? this.opts.acceptToken(k.value.accessToken)
          : k.value.accessToken !== "";
        if (!ok) {
          this.send(conn, { case: "error", value: { code: 1, message: "bad token" } });
          conn.socket.close(4401, "unauthenticated");
          return;
        }
        conn.sessionId = `s${this.nextSession++}`;
        const resumeToken = `r-${conn.sessionId}`;
        this.sessions.set(conn.sessionId, { resumeToken });
        conn.ready = true;
        this.send(conn, {
          case: "ready",
          value: {
            sessionId: conn.sessionId,
            resumeToken,
            heartbeatIntervalMs: this.opts.heartbeatIntervalMs ?? 0,
            serverTime: timestampFromMs(Date.now()),
          },
        });
        return;
      }
      case "resume": {
        const sess = this.sessions.get(k.value.sessionId);
        if (
          !sess ||
          sess.resumeToken !== k.value.resumeToken ||
          this.opts.rejectResumeFor?.has(k.value.sessionId)
        ) {
          this.send(conn, { case: "resyncRequired", value: { reason: "unknown session" } });
          return;
        }
        conn.sessionId = k.value.sessionId;
        conn.resumeCursors = { ...k.value.cursors };
        let replayed = 0;
        for (const [ws, entries] of this.log) {
          const from = k.value.cursors[ws] ?? 0n;
          for (const e of entries) {
            if (e.cursor > from) {
              this.sendEvent(conn, e.cursor, e.envelope);
              replayed++;
            }
          }
        }
        conn.ready = true;
        this.send(conn, { case: "resumed", value: { replayed } });
        return;
      }
      case "subscribe":
        for (const c of k.value.channelIds) conn.channels.add(c);
        for (const t of k.value.threadRootIds) conn.threads.add(t);
        return;
      case "unsubscribe":
        for (const c of k.value.channelIds) conn.channels.delete(c);
        for (const t of k.value.threadRootIds) conn.threads.delete(t);
        return;
      case "presenceSubscribe":
        conn.presence = k.value.userIds;
        return;
      case "focus":
        conn.focused = k.value.channelId;
        return;
      case "ping":
        this.send(conn, { case: "pong", value: {} });
        return;
      default:
        return;
    }
  }

  // ---------------------------------------------------------------- envelope helpers

  envelope(workspaceId: string, type: string, payload: Any): Envelope {
    return create(EnvelopeSchema, {
      id: `e${this.nextEnvelope++}`,
      workspaceId,
      type,
      subject: `evt.${workspaceId}`,
      occurredAt: timestampFromMs(Date.now()),
      payload,
    });
  }

  messageCreated(m: Message): Envelope {
    return this.envelope(
      m.workspaceId,
      "message.created",
      anyPack(MessageCreatedSchema, create(MessageCreatedSchema, { message: m })),
    );
  }
  messageUpdated(m: Message): Envelope {
    return this.envelope(
      m.workspaceId,
      "message.updated",
      anyPack(MessageUpdatedSchema, create(MessageUpdatedSchema, { message: m })),
    );
  }
  messageDeleted(m: Message): Envelope {
    return this.envelope(
      m.workspaceId,
      "message.deleted",
      anyPack(
        MessageDeletedSchema,
        create(MessageDeletedSchema, {
          messageId: m.id,
          channelId: m.channelId,
          threadRootId: m.threadRootId,
        }),
      ),
    );
  }
  reactionAdded(workspaceId: string, messageId: string, userId: string, emoji: string): Envelope {
    return this.envelope(
      workspaceId,
      "reaction.added",
      anyPack(ReactionAddedSchema, create(ReactionAddedSchema, { messageId, userId, emoji })),
    );
  }
  readStateUpdated(
    workspaceId: string,
    userId: string,
    channelId: string,
    lastReadSeq: bigint,
    thread?: { rootId: string; seq: bigint },
  ): Envelope {
    return this.envelope(
      workspaceId,
      "read_state.updated",
      anyPack(
        ReadStateUpdatedSchema,
        create(ReadStateUpdatedSchema, {
          userId,
          channelId,
          lastReadSeq,
          threadRootId: thread?.rootId ?? "",
          lastReadThreadSeq: thread?.seq ?? 0n,
        }),
      ),
    );
  }
}

let seqCounter = 0;

/** A plausible server-side message. */
export type MessageOverrides = Omit<Partial<Message>, "$typeName" | "$unknown">;

export function fakeMessage(over: MessageOverrides & { channelId: string }): Message {
  seqCounter += 1;
  return create(MessageSchema, {
    id: over.id ?? `m${seqCounter}`,
    workspaceId: over.workspaceId ?? "ws1",
    channelSeq: BigInt(seqCounter),
    authorId: "u1",
    authorKind: 1,
    kind: 1,
    text: `message ${seqCounter}`,
    createdAt: timestampFromMs(Date.now()),
    ...over,
  });
}

export function resetSeq(): void {
  seqCounter = 0;
}
