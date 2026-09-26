import { create } from "@bufbuild/protobuf";
import { timestampFromMs } from "@bufbuild/protobuf/wkt";
import { Code, ConnectError, createRouterTransport } from "@connectrpc/connect";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import WebSocket from "ws";
import { AuthService, PrincipalSchema } from "../contracts/tank/auth/v1/auth_pb.js";
import { ChannelSchema, ChannelService, ChannelType } from "../contracts/tank/channel/v1/channel_pb.js";
import {
  ChatService,
  type MarkReadRequest,
  type Message,
  MessageKind,
  MessageSchema,
  type PostMessageRequest,
} from "../contracts/tank/message/v1/message_pb.js";
import {
  MemberSchema,
  Role,
  WorkspaceSchema,
  WorkspaceService,
} from "../contracts/tank/workspace/v1/workspace_pb.js";
import { FakeGateway, fakeMessage, resetSeq } from "../test/fake-gateway.js";
import { createTankClient, type TankClient } from "./client.js";
import type { WebSocketCtor } from "./realtime.js";
import { MemoryStorage, storageKeys } from "./storage.js";

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
  /** RPC names (camelCase) that throw PermissionDenied. */
  failRpcs: Set<string>;
  calls: Array<{ rpc: string; req: unknown }>;
  markReads: MarkReadRequest[];
}

function record(rpc: string, req: unknown): void {
  api.calls.push({ rpc, req });
  if (api.failRpcs.has(rpc)) throw new ConnectError(`${rpc} denied`, Code.PermissionDenied);
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
      inviteMember: (req) => {
        record("inviteMember", req);
        return { inviteId: `inv-${req.email}-${req.role}` };
      },
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
      joinChannel: (req) => {
        record("joinChannel", req);
        return {
          channel: create(ChannelSchema, {
            id: req.channelId,
            workspaceId: "ws1",
            name: req.channelId,
            type: ChannelType.PUBLIC,
            memberIds: ["me", "u2"],
            memberCount: 2,
          }),
        };
      },
      leaveChannel: (req) => {
        record("leaveChannel", req);
        return {};
      },
      createChannel: (req) => {
        record("createChannel", req);
        return {
          channel: create(ChannelSchema, {
            id: `new-${req.name}`,
            workspaceId: req.workspaceId,
            name: req.name,
            type: req.type,
            purpose: req.purpose,
            memberIds: ["me", ...req.memberIds],
            memberCount: 1 + req.memberIds.length,
          }),
        };
      },
      setGoal: (req) => {
        record("setGoal", req);
        return {
          channel: create(ChannelSchema, {
            id: req.channelId,
            workspaceId: "ws1",
            name: "general",
            type: ChannelType.PUBLIC,
            lastSeq: 2n,
            goal: {
              goal: req.goal?.goal ?? "",
              assigneeIds: req.goal?.assigneeIds ?? [],
              updatedBy: "server",
            },
          }),
        };
      },
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
      markRead: (req) => {
        api.markReads.push(req);
        return {};
      },
      updateMessage: (req) => {
        record("updateMessage", req);
        const prev = api.messages.find((m) => m.id === req.messageId);
        if (!prev) throw new ConnectError("no such message", Code.NotFound);
        return {
          message: create(MessageSchema, {
            ...prev,
            text: `${req.text} (server)`,
            editedAt: timestampFromMs(Date.now()),
          }),
        };
      },
      deleteMessage: (req) => {
        record("deleteMessage", req);
        return {};
      },
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
  api = {
    posts: [],
    failNext: undefined,
    echoFirst: false,
    messages: [],
    failRpcs: new Set(),
    calls: [],
    markReads: [],
  };
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

  it("remembers what was read across a restart, not just what bootstrap last said", async () => {
    // The bug: read progress lived only in the bootstrap snapshot, which is
    // written once per GetBootstrap and never updated afterwards. Everything read
    // after it was lost on the next launch, so the same messages came back unread
    // however many times they had been read.
    const storage = new MemoryStorage();
    const c1 = makeClient(storage);
    await c1.bootstrap("ws1"); // snapshot saved here, with the read cursor as it is now
    await c1.start();
    await until(() => c1.store.getState().connection === "ready");
    c1.viewChannel("general");
    for (let i = 0; i < 3; i++) gw.emit("ws1", gw.messageCreated(fakeMessage({ channelId: "general" })));
    await until(() => c1.store.selectUnreads("ws1").total === 3);

    // Read them. The server is told; the snapshot in storage is now out of date.
    const lastSeq = c1.store.getState().channels.general!.lastSeq;
    await c1.markRead("general", lastSeq);
    expect(c1.store.selectUnreads("ws1").total).toBe(0);
    await c1.stop();
    clients.splice(clients.indexOf(c1), 1);

    // Sign in again: storage only, exactly as a cold launch behaves before its
    // first GetBootstrap resolves.
    const c2 = makeClient(storage);
    await c2.start();
    expect(c2.store.getState().readStates.general?.lastReadSeq).toBe(lastSeq);
    expect(c2.store.selectUnreads("ws1").total).toBe(0);
  });

  it("never lets a saved read cursor move backwards", async () => {
    // The snapshot and the saved cursors are written at different times, so the
    // saved one is normally the newer. If it is ever behind — an older build, a
    // half-finished write — hydrating it must not un-read anything.
    const storage = new MemoryStorage();
    const c1 = makeClient(storage);
    await c1.bootstrap("ws1");
    await c1.stop();
    clients.splice(clients.indexOf(c1), 1);

    // A snapshot that says seq 5 was read...
    const snapshotRaw = (await storage.get(storageKeys.bootstrap("ws1")))!;
    const snapshot = JSON.parse(snapshotRaw) as { readStates?: unknown[] };
    snapshot.readStates = [{ channelId: "general", lastReadSeq: "5" }];
    await storage.put(storageKeys.bootstrap("ws1"), JSON.stringify(snapshot));
    // ...and a stale saved cursor that says nothing has been read.
    await storage.put(
      storageKeys.readStates,
      JSON.stringify({ channels: [{ channelId: "general", lastReadSeq: "0" }], threads: {} }),
    );

    const c2 = makeClient(storage);
    await c2.start();
    expect(c2.store.getState().readStates.general?.lastReadSeq).toBe(5n);
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
    expect(api.markReads.at(-1)).toMatchObject({
      channelId: "general",
      seq: 121n,
      threadRootId: "",
      threadSeq: 0n,
    });
  });

  it("thread reads send the root + thread seq (not the channel seq) and track threadReadStates", async () => {
    for (let i = 1; i <= 3; i++)
      api.messages.push(fakeMessage({ id: `h${i}`, channelId: "general", channelSeq: BigInt(i) }));
    api.messages[0] = fakeMessage({
      id: "h1",
      channelId: "general",
      channelSeq: 1n,
      authorId: "me",
      replyCount: 2,
    });
    for (let i = 1; i <= 2; i++)
      api.messages.push(
        fakeMessage({
          id: `r${i}`,
          channelId: "general",
          channelSeq: 0n,
          threadRootId: "h1",
          threadSeq: BigInt(i),
        }),
      );
    const c = makeClient();
    await c.bootstrap("ws1");
    await c.loadChannel("general");
    await c.loadThread("h1");
    expect(c.store.selectThreadUnread("h1")).toBe(2);
    expect(c.store.selectUnreads("ws1").threads).toBe(2);
    expect(c.store.selectUnreads("ws1").byThread).toEqual({ h1: 2 });

    // markRead with a thread root: thread fields only, channel seq stays 0.
    await c.markRead("general", undefined, "h1", 1n);
    expect(api.markReads.at(-1)).toMatchObject({
      channelId: "general",
      seq: 0n,
      threadRootId: "h1",
      threadSeq: 1n,
    });
    expect(c.store.getState().threadReadStates.h1).toBe(1n);
    expect(c.store.selectThreadUnread("h1")).toBe(1);
    expect(c.store.getState().readStates.general?.lastReadSeq ?? 0n).toBe(0n);

    // markThreadRead defaults to the newest reply and finds the channel from the root.
    await c.markThreadRead("h1");
    expect(api.markReads.at(-1)).toMatchObject({
      channelId: "general",
      seq: 0n,
      threadRootId: "h1",
      threadSeq: 2n,
    });
    expect(c.store.selectThreadUnread("h1")).toBe(0);
    expect(c.store.selectUnreads("ws1").threads).toBe(0);
    // Already read: no RPC.
    const n = api.markReads.length;
    await c.markThreadRead("h1");
    expect(api.markReads).toHaveLength(n);
    // An explicit channel seq alongside the thread read updates both, in one RPC.
    await c.markRead("general", 3n, "h1", 2n);
    expect(api.markReads.at(-1)).toMatchObject({
      channelId: "general",
      seq: 3n,
      threadRootId: "h1",
      threadSeq: 2n,
    });
    expect(c.store.getState().readStates.general?.lastReadSeq).toBe(3n);

    // A ReadStateUpdated event with thread fields (another device) advances the thread state only.
    await c.start();
    await until(() => c.store.getState().connection === "ready");
    api.messages.push(
      fakeMessage({ id: "r3", channelId: "general", channelSeq: 0n, threadRootId: "h1", threadSeq: 3n }),
    );
    gw.emit("ws1", gw.messageCreated(api.messages.at(-1)!));
    await until(() => c.store.selectThreadUnread("h1") === 1);
    gw.emit("ws1", gw.readStateUpdated("ws1", "me", "general", 0n, { rootId: "h1", seq: 3n }));
    await until(() => c.store.getState().threadReadStates.h1 === 3n);
    expect(c.store.selectThreadUnread("h1")).toBe(0);
    expect(c.store.getState().readStates.general?.lastReadSeq).toBe(3n); // unchanged by the thread event
    // Someone else's thread read state is ignored.
    gw.emit("ws1", gw.readStateUpdated("ws1", "u2", "general", 0n, { rootId: "h1", seq: 9n }));
    await sleep(40);
    expect(c.store.getState().threadReadStates.h1).toBe(3n);
  });

  it("updateMessage / deleteMessage / setGoal / leaveChannel / joinChannel are optimistic and roll back", async () => {
    api.messages.push(fakeMessage({ id: "h1", channelId: "general", channelSeq: 1n, text: "orig" }));
    api.messages.push(fakeMessage({ id: "h2", channelId: "general", channelSeq: 2n, text: "two" }));
    const c = makeClient();
    await c.bootstrap("ws1");
    await c.loadChannel("general");
    const st = () => c.store.getState();

    // updateMessage: optimistic body, then the server's version.
    const seen: string[] = [];
    c.store.subscribe(() => seen.push(st().messages.h1?.text ?? ""));
    const updated = await c.updateMessage("h1", { text: "edited" });
    expect(seen[0]).toBe("edited");
    expect(updated?.text).toBe("edited (server)");
    expect(st().messages.h1?.text).toBe("edited (server)");
    expect(api.calls.at(-1)).toMatchObject({
      rpc: "updateMessage",
      req: { messageId: "h1", text: "edited" },
    });
    // rollback
    api.failRpcs.add("updateMessage");
    seen.length = 0;
    await expect(c.updateMessage("h1", { text: "nope" })).rejects.toBeInstanceOf(ConnectError);
    expect(seen[0]).toBe("nope");
    expect(st().messages.h1?.text).toBe("edited (server)");

    // deleteMessage
    api.failRpcs.add("deleteMessage");
    await expect(c.deleteMessage("h2")).rejects.toBeInstanceOf(ConnectError);
    expect(c.store.selectChannelMessages("general").map((m) => m.id)).toEqual(["h1", "h2"]);
    api.failRpcs.delete("deleteMessage");
    const removedAtOnce = c.deleteMessage("h2");
    expect(st().messages.h2).toBeUndefined();
    await removedAtOnce;
    expect(c.store.selectChannelMessages("general").map((m) => m.id)).toEqual(["h1"]);

    // setGoal
    api.failRpcs.add("setGoal");
    await expect(c.setGoal("general", { goal: "Ship it" })).rejects.toBeInstanceOf(ConnectError);
    expect(st().channels.general?.goal).toBeUndefined();
    api.failRpcs.delete("setGoal");
    const p = c.setGoal("general", { goal: "Ship it", assigneeIds: ["me"] });
    expect(st().channels.general?.goal?.goal).toBe("Ship it");
    expect(st().channels.general?.goal?.updatedBy).toBe("me");
    const ch = await p;
    expect(ch?.goal?.updatedBy).toBe("server");
    expect(st().channels.general?.goal?.updatedBy).toBe("server");
    expect(st().channels.general?.lastSeq).toBe(2n);

    // leaveChannel: gone from the order immediately, back on error.
    api.failRpcs.add("leaveChannel");
    const leaving = c.leaveChannel("general");
    expect(c.store.selectChannels("ws1").map((x) => x.id)).toEqual([]);
    await expect(leaving).rejects.toBeInstanceOf(ConnectError);
    expect(c.store.selectChannels("ws1").map((x) => x.id)).toEqual(["general"]);
    expect(st().channels.general?.memberIds).toEqual([]);
    api.failRpcs.delete("leaveChannel");
    await c.leaveChannel("general");
    expect(c.store.selectChannels("ws1")).toEqual([]);

    // joinChannel: unknown channel → no optimistic row, server's channel lands.
    const joined = await c.joinChannel("random");
    expect(joined?.memberIds).toEqual(["me", "u2"]);
    expect(c.store.selectChannels("ws1").map((x) => x.id)).toEqual(["random"]);
    // known channel → optimistic membership, rolled back on error.
    c.store.dispatch({
      type: "channels/upsert",
      channels: [
        create(ChannelSchema, { id: "pub", workspaceId: "ws1", type: ChannelType.PUBLIC, name: "pub" }),
      ],
    });
    api.failRpcs.add("joinChannel");
    const joining = c.joinChannel("pub");
    expect(st().channels.pub?.memberIds).toEqual(["me"]);
    await expect(joining).rejects.toBeInstanceOf(ConnectError);
    expect(st().channels.pub?.memberIds).toEqual([]);
  });

  it("createChannel and invite call the services and return the server's result", async () => {
    const c = makeClient();
    await c.bootstrap("ws1");
    const ch = await c.createChannel({ workspaceId: "ws1", name: "ops", memberIds: ["u2"] });
    expect(ch.id).toBe("new-ops");
    expect(ch.type).toBe(ChannelType.PUBLIC);
    expect(c.store.selectChannels("ws1").map((x) => x.id)).toEqual(["general", "new-ops"]);
    const priv = await c.createChannel({ workspaceId: "ws1", name: "sec", type: ChannelType.PRIVATE });
    expect(priv.type).toBe(ChannelType.PRIVATE);

    expect(await c.invite("ws1", "ada@example.com", "admin")).toBe("inv-ada@example.com-2");
    expect(await c.invite("ws1", "bob@example.com", Role.GUEST)).toBe("inv-bob@example.com-4");
    expect(await c.invite("ws1", "cy@example.com")).toBe("inv-cy@example.com-3");
    api.failRpcs.add("inviteMember");
    await expect(c.invite("ws1", "x@example.com")).rejects.toBeInstanceOf(ConnectError);
  });

  it("uses the injected randomBytes for client_msg_ids", async () => {
    let calls = 0;
    const c = createTankClient({
      baseUrl: "http://unused",
      wsUrl: gw.url,
      auth: "cookie",
      transport: fakeTransport(),
      WebSocket: WebSocket as unknown as WebSocketCtor,
      realtime: { listenOnline: false },
      randomBytes: (n) => {
        calls += 1;
        return new Uint8Array(n).fill(0x42);
      },
    });
    clients.push(c);
    await c.bootstrap("ws1");
    const { clientMsgId } = await c.sendMessage({ channelId: "general", text: "rnd" });
    expect(calls).toBeGreaterThan(0);
    expect(clientMsgId.slice(-12)).toBe("424242424242");
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

describe("stale persisted timeline", () => {
  // A phone that was closed while the Tread moved on hydrates its cache, and paging "before" the
  // newest cached row asks for messages older than the gap — so the gap is never fetched and the
  // Tread stays frozen on old content, including cards the server has since deleted.
  it("replaces a cached tail that is behind the server on the first open", async () => {
    const storage = new MemoryStorage();
    const c1 = makeClient(storage);
    await c1.bootstrap("ws1");
    await c1.start();
    await until(() => c1.store.getState().connection === "ready");
    c1.viewChannel("general");
    for (let i = 0; i < 3; i++) gw.emit("ws1", gw.messageCreated(fakeMessage({ channelId: "general" })));
    await until(() => c1.store.selectChannelMessages("general").length === 3);
    await c1.stop();
    clients.splice(clients.indexOf(c1), 1);

    const row = (id: string, channelSeq: bigint, text: string, kind?: MessageKind) =>
      create(MessageSchema, {
        id,
        workspaceId: "ws1",
        channelId: "general",
        channelSeq,
        authorId: "someone",
        text,
        ...(kind === undefined ? {} : { kind }),
      });
    // m2 was deleted while the device was away, and a webhook posted well past the cached tail.
    api.messages = [
      row("m1", 1n, "one"),
      row("m3", 3n, "three"),
      row("hook", 9n, "webhook", MessageKind.BOT),
    ];

    const c2 = makeClient(storage);
    await c2.start();
    expect(c2.store.selectChannelMessages("general").map((m) => m.id)).toEqual(["m1", "m2", "m3"]);

    await c2.loadChannel("general");
    expect(c2.store.selectChannelMessages("general").map((m) => m.id)).toEqual(["m1", "m3", "hook"]);
  });
});
