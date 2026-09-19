import { afterEach, beforeEach, describe, expect, it } from "vitest";
import WebSocket from "ws";
import { FakeGateway, fakeMessage, resetSeq } from "../test/fake-gateway.js";
import type { WebSocketCtor } from "./realtime.js";
import { RealtimeClient, type RealtimeOptions } from "./realtime.js";

let gw: FakeGateway;
const clients: RealtimeClient[] = [];

function makeClient(over: Partial<RealtimeOptions> = {}): RealtimeClient {
  const c = new RealtimeClient({
    wsUrl: over.wsUrl ?? gw.url,
    getGatewayToken: async () => "tok",
    workspaceIds: ["ws1"],
    WebSocket: WebSocket as unknown as WebSocketCtor,
    heartbeatMs: 60_000,
    gapBufferMs: 60,
    backoff: { minMs: 10, maxMs: 40 },
    listenOnline: false,
    ...over,
  });
  clients.push(c);
  return c;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function until(pred: () => boolean, timeoutMs = 4000): Promise<void> {
  const t0 = Date.now();
  while (!pred()) {
    if (Date.now() - t0 > timeoutMs) throw new Error("until: timeout");
    await sleep(5);
  }
}

beforeEach(async () => {
  resetSeq();
  gw = await FakeGateway.start();
});
afterEach(async () => {
  for (const c of clients.splice(0)) c.stop();
  await gw.close();
});

describe("handshake", () => {
  it("sends Hello with the minted token and becomes ready; subscriptions are (re)sent", async () => {
    const c = makeClient();
    const states: string[] = [];
    c.on("state", (s) => states.push(s));
    c.subscribe({ channelIds: ["general"] }); // before ready: remembered
    c.start();
    const conn = await gw.waitFor();
    const hello = conn.received[0]?.kind;
    expect(hello?.case).toBe("hello");
    if (hello?.case === "hello") {
      expect(hello.value.accessToken).toBe("tok");
      expect(hello.value.workspaceIds).toEqual(["ws1"]);
    }
    await until(() => c.state === "ready");
    expect(states).toEqual(["connecting", "open", "ready"]);
    expect(c.currentSession?.sessionId).toBe("s1");
    await until(() => conn.channels.has("general"));
    c.presenceSubscribe(["u1", "u2", "u1"]);
    c.focus("general");
    c.typing("general", "root");
    await until(() => conn.focused === "general" && conn.presence.length === 2);
    const typing = conn.received.find((f) => f.kind.case === "typing");
    expect(typing?.kind.case === "typing" && typing.kind.value.threadRootId).toBe("root");
  });

  it("an unauthenticated error drops the session and reconnects with a fresh Hello", async () => {
    let n = 0;
    await gw.close();
    gw = await FakeGateway.start({ acceptToken: (t) => t === "good" });
    const c = makeClient({ getGatewayToken: async () => (++n === 1 ? "bad" : "good") });
    const errors: number[] = [];
    c.on("error", (e) => errors.push(e.code));
    c.start();
    await until(() => c.state === "ready");
    expect(errors).toEqual([1]);
    expect(n).toBe(2);
    expect(gw.conns).toHaveLength(2);
  });
});

describe("event ordering", () => {
  it("delivers events in cursor order per workspace, reorders within the gap window, drops duplicates", async () => {
    const c = makeClient();
    const seen: bigint[] = [];
    c.on("event", (e) => seen.push(e.cursor));
    c.start();
    const conn = await gw.waitFor();
    await until(() => c.state === "ready");
    const m = fakeMessage({ channelId: "general" });
    const e1 = gw.messageCreated(m);
    // cursor 1 in order, then 3 before 2 (out of order but within the buffer window), then a duplicate 2
    gw.sendEvent(conn, 1n, e1);
    gw.sendEvent(conn, 3n, e1);
    gw.sendEvent(conn, 2n, e1);
    gw.sendEvent(conn, 2n, e1);
    gw.sendEvent(conn, 4n, e1);
    await until(() => seen.length === 4);
    expect(seen).toEqual([1n, 2n, 3n, 4n]);
    expect(c.getCursors()).toEqual({ ws1: 4n });
    // another workspace has its own sequence
    const other = gw.messageCreated(fakeMessage({ channelId: "x", workspaceId: "ws2" }));
    gw.sendEvent(conn, 1n, other);
    await until(() => seen.length === 5);
    expect(c.getCursors()).toEqual({ ws1: 4n, ws2: 1n });
  });

  it("an unfilled gap triggers Resume with cursors and the server replays the missing range", async () => {
    const c = makeClient();
    const seen: bigint[] = [];
    let resumed = 0;
    c.on("event", (e) => seen.push(e.cursor));
    c.on("resumed", () => resumed++);
    c.start();
    const conn = await gw.waitFor();
    await until(() => c.state === "ready");
    // Server log: cursors 1..4. Only 1 and 4 get delivered live; 2 and 3 are "lost".
    const m = fakeMessage({ channelId: "general" });
    gw.emit("ws1", gw.messageCreated(m)); // 1 delivered
    gw.emit("ws1", gw.messageCreated(m), { deliver: false }); // 2 lost
    gw.emit("ws1", gw.messageCreated(m), { deliver: false }); // 3 lost
    gw.emit("ws1", gw.messageCreated(m)); // 4 delivered → buffered
    await until(() => resumed === 1 && seen.length === 4);
    expect(seen).toEqual([1n, 2n, 3n, 4n]);
    const resumeConn = gw.conns[1]!;
    const resume = resumeConn.received.find((f) => f.kind.case === "resume");
    expect(resume?.kind.case === "resume" && resume.kind.value.cursors.ws1).toBe(1n);
    expect(resume?.kind.case === "resume" && resume.kind.value.sessionId).toBe(conn.sessionId);
    expect(c.state).toBe("ready");
  });
});

describe("reconnect", () => {
  it("resumes after the server closes and replays what was missed; backoff resets", async () => {
    const c = makeClient();
    const seen: bigint[] = [];
    c.on("event", (e) => seen.push(e.cursor));
    c.start();
    await until(() => c.state === "ready");
    gw.emit("ws1", gw.messageCreated(fakeMessage({ channelId: "general" })));
    await until(() => seen.length === 1);
    gw.closeAll();
    await until(() => c.state === "reconnecting");
    // while disconnected, the server appends
    gw.emit("ws1", gw.messageCreated(fakeMessage({ channelId: "general" })));
    await until(() => c.state === "ready" && seen.length === 2);
    expect(seen).toEqual([1n, 2n]);
    expect(gw.conns[1]?.received[0]?.kind.case).toBe("resume");
  });

  it("ResyncRequired clears cursors + session and Hellos again; consumer is told to re-bootstrap", async () => {
    const c = makeClient();
    let resync = 0;
    let sessionCleared = 0;
    c.on("resync", () => resync++);
    c.on("session", (s) => {
      if (!s) sessionCleared++;
    });
    c.start();
    await until(() => c.state === "ready");
    gw.emit("ws1", gw.messageCreated(fakeMessage({ channelId: "general" })));
    await until(() => c.getCursors().ws1 === 1n);
    gw.opts.rejectResumeFor = new Set(["s1"]);
    gw.closeAll();
    await until(() => resync === 1);
    await until(() => c.state === "ready" && c.currentSession?.sessionId === "s2");
    expect(sessionCleared).toBe(1);
    expect(c.getCursors()).toEqual({});
    expect(gw.conns[2]?.received[0]?.kind.case).toBe("hello");
  });

  it("uses full-jitter backoff bounded by maxMs and retryNow() skips the wait", async () => {
    await gw.close();
    // Nothing listening: every connect attempt fails.
    const c = makeClient({
      wsUrl: "ws://127.0.0.1:1",
      backoff: { minMs: 1000, maxMs: 30_000, random: () => 1 },
    });
    const closes: number[] = [];
    c.on("close", () => closes.push(Date.now()));
    c.start();
    await until(() => closes.length === 1);
    await sleep(150);
    expect(closes).toHaveLength(1); // waiting ~1s of backoff
    c.retryNow();
    await until(() => closes.length === 2, 1000);
    gw = await FakeGateway.start();
  });

  it("heartbeat: pings on the server interval and reconnects when pongs stop", async () => {
    await gw.close();
    gw = await FakeGateway.start({ heartbeatIntervalMs: 40 });
    const c = makeClient();
    let pongs = 0;
    c.on("pong", () => pongs++);
    c.start();
    const conn = await gw.waitFor();
    await until(() => pongs >= 2);
    // Silence the server: stop answering and stop the socket from closing on its own.
    const original = conn.socket.send.bind(conn.socket);
    conn.socket.send = () => undefined;
    await until(() => gw.conns.length === 2, 2000);
    conn.socket.send = original;
    await until(() => c.state === "ready");
    expect(gw.conns[1]?.received[0]?.kind.case).toBe("resume");
  });

  it("stop() closes for good", async () => {
    const c = makeClient();
    c.start();
    await until(() => c.state === "ready");
    let willReconnect: boolean | undefined;
    c.on("close", (e) => {
      willReconnect = e.willReconnect;
    });
    c.stop();
    await until(() => gw.live.length === 0);
    expect(c.state).toBe("closed");
    expect(willReconnect).toBeUndefined(); // handlers detached before close; no reconnect scheduled
    await sleep(60);
    expect(gw.conns).toHaveLength(1);
  });
});
