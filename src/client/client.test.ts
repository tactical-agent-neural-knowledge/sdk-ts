import { create } from "@bufbuild/protobuf";
import { timestampFromMs } from "@bufbuild/protobuf/wkt";
import { Code, ConnectError, createRouterTransport } from "@connectrpc/connect";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import WebSocket from "ws";
import { AuthService, PrincipalSchema } from "../contracts/tank/auth/v1/auth_pb.js";
import { ChannelSchema, ChannelService, ChannelType } from "../contracts/tank/channel/v1/channel_pb.js";
import {
  ChatService,
  type Message,
  MessageSchema,
  type PostMessageRequest,
} from "../contracts/tank/message/v1/message_pb.js";
import {
  MemberSchema,
  WorkspaceSchema,
  WorkspaceService,
} from "../contracts/tank/workspace/v1/workspace_pb.js";
import { FakeGateway, fakeMessage, resetSeq } from "../test/fake-gateway.js";
import { createTankClient, type TankClient } from "./client.js";
import type { WebSocketCtor } from "./realtime.js";
import { MemoryStorage } from "./storage.js";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function until(pred: () => boolean, timeoutMs = 4000): Promise<void> {
  const t0 = Date.now();
  while (!pred()) {
    if (Date.now() - t0 > timeoutMs) throw new Error("until: timeout");
    await sleep(5);
  }
}

interface FakeApi {
  posts: PostMessageRequest[];
  failNext: { code: Code; times: number } | undefined;
  /** When true, PostMessage echoes the event through the gateway before responding. */
  echoFirst: boolean;
  messages: Message[];
}

let gw: FakeGateway;
let api: FakeApi;
let seq = 100;

function fakeTransport() {
  return createRouterTransport(({ service }) => {
    service(AuthService, {
      mintGatewayToken: () => ({ token: "tok", expiresAt: timestampFromMs(Date.now() + 60_000) }),
    });
    service(WorkspaceService, {
      getBootstrap: () => ({
        workspace: create(WorkspaceSchema, { id: "ws1", name: "TANK", slug: "tank" }),
        me: create(MemberSchema, {
          principal: create(PrincipalSchema, { id: "me", kind: 1, displayName: "Robby" }),
        }),
        channels: [
          create(ChannelSchema, {
            id: "general",
            workspaceId: "ws1",
            type: ChannelType.PUBLIC,
            name: "general",
            lastSeq: 2n,
          }),
        ],
        readStates: [],
        members: [],
      }),
    });
    service(ChannelService, {
      getChannel: (req) => ({
        channel: create(ChannelSchema, {
          id: req.channelId,
          workspaceId: "ws1",
          name: "renamed",
          type: ChannelType.PUBLIC,
        }),
      }),
    });
    service(ChatService, {
      postMessage: async (req) => {
        api.posts.push(req);
        if (api.failNext && api.failNext.times > 0) {
          api.failNext.times -= 1;
          throw new ConnectError("nope", api.failNext.code);
        }
        const message = create(MessageSchema, {
          id: `srv-${req.clientMsgId.slice(-4)}`,
          workspaceId: "ws1",
          channelId: req.channelId,
          channelSeq: BigInt(++seq),
          authorId: "me",
          clientMsgId: req.clientMsgId,
          text: req.text,
          createdAt: timestampFromMs(Date.now()),
        });
        if (api.echoFirst) {
          gw.emit("ws1", gw.messageCreated(message));
          await sleep(20);
        }
        return { message };
      },
      listMessages: (req) => {
        const all = api.messages
          .filter((m) => m.channelId === req.channelId)
          .sort((a, b) => Number(a.channelSeq - b.channelSeq));
        let page = all;
        if (req.beforeSeq > 0n) page = all.filter((m) => m.channelSeq < req.beforeSeq);
        if (req.afterSeq > 0n) page = all.filter((m) => m.channelSeq > req.afterSeq);
        const limit = req.limit || 50;
        const slice = req.afterSeq > 0n ? page.slice(0, limit) : page.slice(-limit);
        return { messages: slice, hasMore: slice.length < page.length };
      },
      getThread: (req) => ({
        root: api.messages.find((m) => m.id === req.threadRootId),
        replies: api.messages.filter((m) => m.threadRootId === req.threadRootId),
        hasMore: false,
      }),
      markRead: () => ({}),
    });
  });
}

const clients: TankClient[] = [];
function makeClient(storage = new MemoryStorage()): TankClient {
  const c = createTankClient({
    baseUrl: "http://unused",
    wsUrl: gw.url,
    auth: "cookie",
    storage,
    transport: fakeTransport(),
    WebSocket: WebSocket as unknown as WebSocketCtor,
    realtime: {
      heartbeatMs: 60_000,
      gapBufferMs: 60,
      backoff: { minMs: 10, maxMs: 40 },
      listenOnline: false,
    },
  });
  clients.push(c);
  return c;
}

beforeEach(async () => {
  resetSeq();
  seq = 100;
  gw = await FakeGateway.start();
  api = { posts: [], failNext: undefined, echoFirst: false, messages: [] };
});
afterEach(async () => {
  for (const c of clients.splice(0)) await c.stop();
  await gw.close();
});

describe("TankClient", () => {
  it("bootstraps, connects, and reconciles an optimistic send with the RPC response", async () => {
    const c = makeClient();
    await c.bootstrap("ws1");
    await c.start();
    await until(() => c.store.getState().connection === "ready");
    c.viewChannel("general");
    const { clientMsgId } = await c.sendMessage({ channelId: "general", text: "hello" });
    const optimistic = c.store.selectChannelMessages("general");
    expect(optimistic.map((m) => m.id)).toEqual([clientMsgId]);
    expect(c.store.getState().pending[clientMsgId]?.status).toBe("sending");
    await until(() => c.store.getState().pending[clientMsgId] === undefined);
    const list = c.store.selectChannelMessages("general");
    expect(list).toHaveLength(1);
    expect(list[0]?.id.startsWith("srv-")).toBe(true);
    expect(list[0]?.text).toBe("hello");
    // The gateway is subscribed + focused on the viewed channel.
    const conn = await gw.waitFor((x) => x.channels.has("general") && x.focused === "general");
    expect(conn.ready).toBe(true);
    // The outbox row was cleared from storage.
    expect(await c.storage.scan("outbox:")).toEqual([]);
  });

  it("reconciles when the echoed gateway event arrives before the RPC response", async () => {
    api.echoFirst = true;
    const c = makeClient();
    await c.bootstrap("ws1");
    await c.start();
    await until(() => c.store.getState().connection === "ready");
    const { clientMsgId } = await c.sendMessage({ channelId: "general", text: "echo" });
    await until(() => c.store.getState().pending[clientMsgId] === undefined);
    await sleep(60); // let the RPC response land too
    const list = c.store.selectChannelMessages("general");
    expect(list).toHaveLength(1);
    expect(list[0]?.clientMsgId).toBe(clientMsgId);
    expect(c.store.getState().messages[clientMsgId]).toBeUndefined();
    expect(c.store.getState().cursors.ws1).toBe("1");
  });

  it("retries transient failures with backoff and marks permanent ones failed", async () => {
    api.failNext = { code: Code.Unavailable, times: 2 };
    const c = makeClient();
    await c.bootstrap("ws1");
    await c.start();
    const { clientMsgId } = await c.sendMessage({ channelId: "general", text: "flaky" });
    await until(() => c.store.getState().pending[clientMsgId] === undefined, 8000);
    expect(api.posts).toHaveLength(3);
    expect(api.posts.every((p) => p.clientMsgId === clientMsgId)).toBe(true);

    api.failNext = { code: Code.PermissionDenied, times: 1 };
    const failed: string[] = [];
    c.events.on("sendFailed", (e) => failed.push(e.clientMsgId));
    const second = await c.sendMessage({ channelId: "general", text: "denied" });
    await until(() => c.store.getState().pending[second.clientMsgId]?.status === "failed");
    expect(failed).toEqual([second.clientMsgId]);
    // still visible, still in the persisted outbox, retryable
    expect(c.store.selectChannelMessages("general").some((m) => m.id === second.clientMsgId)).toBe(true);
    expect((await c.storage.scan("outbox:")).map(([k]) => k)).toEqual([`outbox:${second.clientMsgId}`]);
    c.retryMessage(second.clientMsgId);
    await until(() => c.store.getState().pending[second.clientMsgId] === undefined);
    expect(c.store.selectChannelMessages("general")).toHaveLength(2);
  });

  it("hydrates bootstrap, cursors, cached messages and the outbox from storage, then resumes", async () => {
    const storage = new MemoryStorage();
    const c1 = makeClient(storage);
    await c1.bootstrap("ws1");
    await c1.start();
    await until(() => c1.store.getState().connection === "ready");
    c1.viewChannel("general");
    for (let i = 0; i < 3; i++) gw.emit("ws1", gw.messageCreated(fakeMessage({ channelId: "general" })));
    await until(() => c1.store.selectChannelMessages("general").length === 3);
    // A send that never completes (API down) stays in the outbox.
    api.failNext = { code: Code.Unavailable, times: 100 };
    const { clientMsgId } = await c1.sendMessage({ channelId: "general", text: "offline" });
    await c1.stop();
    clients.splice(clients.indexOf(c1), 1);
    expect(await storage.get("session")).toContain("s1");
    expect(await storage.get("cursor:ws1")).toBe("3");
    expect(JSON.parse((await storage.get("channel:general:messages")) ?? "[]")).toHaveLength(3);

    api.failNext = undefined;
    const c2 = makeClient(storage);
    await c2.start(); // no bootstrap call: everything comes from storage
    const s = c2.store.getState();
    expect(s.workspaces.ws1?.name).toBe("TANK");
    expect(s.me?.id).toBe("me");
    expect(s.cursors.ws1).toBe("3");
    expect(c2.store.selectChannelMessages("general").map((m) => m.id)).toEqual([
      "m1",
      "m2",
      "m3",
      clientMsgId,
    ]);
    await until(() => c2.store.getState().connection === "ready");
    // resumed the old session with the persisted cursor, and flushed the outbox
    const conn = gw.conns[1]!;
    const resume = conn.received[0]?.kind;
    expect(resume?.case).toBe("resume");
    expect(resume?.case === "resume" && resume.value.cursors.ws1).toBe(3n);
    await until(() => c2.store.getState().pending[clientMsgId] === undefined);
    expect(c2.store.selectChannelMessages("general")).toHaveLength(4);
  });

  it("pages a channel backwards and forwards, loads threads, marks read", async () => {
    for (let i = 1; i <= 120; i++)
      api.messages.push(fakeMessage({ id: `h${i}`, channelId: "general", channelSeq: BigInt(i) }));
    api.messages.push(
      fakeMessage({ id: "reply", channelId: "general", channelSeq: 0n, threadRootId: "h5", threadSeq: 1n }),
    );
    const c = makeClient();
    await c.bootstrap("ws1");
    let more = await c.loadChannel("general");
    expect(more).toBe(true);
    expect(
      c.store
        .selectChannelMessages("general")
        .map((m) => m.id)
        .slice(0, 2),
    ).toEqual(["h71", "h72"]);
    more = await c.loadChannel("general", { limit: 100 });
    expect(more).toBe(false);
    expect(c.store.selectChannelMessages("general")).toHaveLength(120);
    expect(await c.loadChannel("general")).toBe(false); // nothing older, no RPC
    api.messages.push(fakeMessage({ id: "h121", channelId: "general", channelSeq: 121n }));
    expect(await c.loadChannel("general", { direction: "after" })).toBe(false);
    expect(c.store.selectChannelMessages("general")).toHaveLength(121);

    await c.loadThread("h5");
    expect(c.store.selectThread("h5").replies.map((m) => m.id)).toEqual(["reply"]);

    await c.markRead("general", 121n);
    expect(c.store.getState().readStates.general?.lastReadSeq).toBe(121n);
    expect(c.store.selectUnreads("ws1").total).toBe(0);
  });

  it("refetches a channel on ChannelUpdated and applies typing/presence frames", async () => {
    const c = makeClient();
    await c.bootstrap("ws1");
    await c.start();
    await until(() => c.store.getState().connection === "ready");
    const conn = gw.conns[0]!;
    const { create: mk } = await import("@bufbuild/protobuf");
    const { anyPack } = await import("@bufbuild/protobuf/wkt");
    const ev = await import("../contracts/tank/events/v1/events_pb.js");
    gw.emit(
      "ws1",
      gw.envelope(
        "ws1",
        "channel.updated",
        anyPack(ev.ChannelUpdatedSchema, mk(ev.ChannelUpdatedSchema, { channelId: "general" })),
      ),
    );
    await until(() => c.store.getState().channels.general?.name === "renamed");
    gw.send(conn, { case: "typing", value: { channelId: "general", userId: "u2", threadRootId: "" } });
    await until(() => c.store.selectTyping("general").length === 1);
    gw.send(conn, {
      case: "presence",
      value: { presence: { userId: "u2", status: 4, customStatusText: "", customStatusEmoji: "" } },
    });
    await until(() => c.store.getState().presence.u2?.status === 4);
    gw.send(conn, {
      case: "agentStatus",
      value: { channelId: "general", threadRootId: "root", runId: "r1", status: "running tests" },
    });
    await until(() => c.store.getState().agentStatus.root?.status === "running tests");
  });
});
