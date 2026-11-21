import { create } from "@bufbuild/protobuf";
import { anyPack } from "@bufbuild/protobuf/wkt";
import { Code, ConnectError, createRouterTransport } from "@connectrpc/connect";
import { describe, expect, it } from "vitest";
import WebSocket from "ws";
import { AgentService, RunSchema, RunState } from "../contracts/tank/agent/v1/agent_pb.js";
import {
  AgentStreamDelta_Kind,
  AgentStreamDeltaSchema,
  EnvelopeSchema,
  ThreadLiveStreamUpdatedSchema,
} from "../contracts/tank/events/v1/events_pb.js";
import {
  GetBootstrapResponseSchema,
  GetThreadLiveStreamResponseSchema,
  SetThreadLiveStreamResponseSchema,
  ThreadLiveStreamSchema,
  WorkspaceSchema,
  WorkspaceService,
} from "../contracts/tank/workspace/v1/workspace_pb.js";
import { createTankClient, type TankClient } from "./client.js";
import type { WebSocketCtor } from "./realtime.js";
import { MemoryStorage } from "./storage.js";
import { envelopeToActions } from "./store.js";

const CH = "c1";
const ROOT = "root1";

/** What the server holds: the settings it has stored, and what a tail answers. */
interface Server {
  /** Thread keys (channel:root) whose setting is on. */
  on: Set<string>;
  bootstrapRows: Array<{ channelId: string; threadRootId: string; enabled: boolean }>;
  /** Code the next SetThreadLiveStream fails with, when set. */
  failSet?: Code;
  /** Run ids GetRunStreamTail was asked for. */
  tailCalls: string[];
  /** For each tail call: whether the setting was on when the server answered it. */
  tailSawOn: boolean[];
  tail: { text: string; status: string; lastSeq: bigint };
}

function newServer(): Server {
  return {
    on: new Set(),
    bootstrapRows: [],
    tailCalls: [],
    tailSawOn: [],
    tail: { text: "", status: "", lastSeq: 0n },
  };
}

function fakeTransport(s: Server) {
  return createRouterTransport(({ service }) => {
    service(WorkspaceService, {
      getBootstrap: () =>
        create(GetBootstrapResponseSchema, {
          workspace: create(WorkspaceSchema, { id: "ws1", name: "Acme" }),
          threadLiveStreams: s.bootstrapRows.map((r) => create(ThreadLiveStreamSchema, r)),
        }),
      setThreadLiveStream: (req) => {
        if (s.failSet !== undefined) throw new ConnectError("denied", s.failSet);
        const key = `${req.channelId}:${req.threadRootId}`;
        if (req.enabled) s.on.add(key);
        else s.on.delete(key);
        return create(SetThreadLiveStreamResponseSchema, {
          setting: create(ThreadLiveStreamSchema, {
            channelId: req.channelId,
            threadRootId: req.threadRootId,
            enabled: req.enabled,
          }),
        });
      },
      getThreadLiveStream: (req) =>
        create(GetThreadLiveStreamResponseSchema, {
          setting: create(ThreadLiveStreamSchema, {
            channelId: req.channelId,
            threadRootId: req.threadRootId,
            enabled: s.on.has(`${req.channelId}:${req.threadRootId}`),
          }),
        }),
    });
    service(AgentService, {
      // The server answers empty while the person's setting is off.
      getRunStreamTail: (req) => {
        const on = s.on.size > 0;
        s.tailCalls.push(req.runId);
        s.tailSawOn.push(on);
        if (!on) return { text: "", status: "", lastSeq: 0n };
        return { ...s.tail };
      },
    });
  });
}

function makeClient(s: Server): TankClient {
  const c = createTankClient({
    baseUrl: "http://unused",
    wsUrl: "ws://unused",
    auth: "cookie",
    storage: new MemoryStorage(),
    transport: fakeTransport(s),
    WebSocket: WebSocket as unknown as WebSocketCtor,
    realtime: { heartbeatMs: 60_000, listenOnline: false },
  });
  return c;
}

function delta(
  channelId: string,
  threadRootId: string,
  seq: number,
  kind: AgentStreamDelta_Kind,
  text: string,
) {
  return create(AgentStreamDeltaSchema, {
    channelId,
    threadRootId,
    runId: "r1",
    seq: BigInt(seq),
    kind,
    text,
  });
}

/** A setting change made on another device, as the event stream delivers it. */
function settingEvent(channelId: string, threadRootId: string, enabled: boolean) {
  const env = create(EnvelopeSchema, {
    workspaceId: "ws1",
    type: "thread_live_stream.updated",
    payload: anyPack(
      ThreadLiveStreamUpdatedSchema,
      create(ThreadLiveStreamUpdatedSchema, {
        userId: "me",
        setting: create(ThreadLiveStreamSchema, { channelId, threadRootId, enabled }),
      }),
    ),
  });
  return envelopeToActions(env, 0);
}

describe("per-user per-thread live agent stream", () => {
  it("bootstrap seeds the set from threadLiveStreams", async () => {
    const s = newServer();
    s.bootstrapRows = [
      { channelId: CH, threadRootId: ROOT, enabled: true },
      { channelId: CH, threadRootId: "root2", enabled: false },
    ];
    const c = makeClient(s);
    await c.bootstrap("ws1");
    expect(c.store.selectThreadLiveStream(CH, ROOT)).toBe(true);
    expect(c.store.selectThreadLiveStream(CH, "root2")).toBe(false);
  });

  it("a setting changed on another device syncs in, and turning it off drops the partial text", () => {
    const c = makeClient(newServer());
    for (const a of settingEvent(CH, ROOT, true)) c.store.dispatch(a);
    expect(c.store.selectThreadLiveStream(CH, ROOT)).toBe(true);

    c.store.dispatch({ type: "agentStream", delta: delta(CH, ROOT, 1, AgentStreamDelta_Kind.TEXT, "hi") });
    expect(c.store.getState().agentStream[ROOT]?.text).toBe("hi");

    for (const a of settingEvent(CH, ROOT, false)) c.store.dispatch(a);
    expect(c.store.selectThreadLiveStream(CH, ROOT)).toBe(false);
    expect(c.store.getState().agentStream[ROOT]).toBeUndefined();
  });

  it("optimistic set shows at once and reverts when the server refuses", async () => {
    const s = newServer();
    const c = makeClient(s);
    await c.bootstrap("ws1");
    s.failSet = Code.Unavailable;

    const pending = c.setThreadLiveStream({
      workspaceId: "ws1",
      channelId: CH,
      threadRootId: ROOT,
      enabled: true,
    });
    expect(c.store.selectThreadLiveStream(CH, ROOT)).toBe(true);
    await expect(pending).rejects.toThrow();
    expect(c.store.selectThreadLiveStream(CH, ROOT)).toBe(false);
  });

  it("a successful set is stored and stays on", async () => {
    const s = newServer();
    const c = makeClient(s);
    await c.bootstrap("ws1");
    const stored = await c.setThreadLiveStream({
      workspaceId: "ws1",
      channelId: CH,
      threadRootId: ROOT,
      enabled: true,
    });
    expect(stored).toBe(true);
    expect(s.on.has(`${CH}:${ROOT}`)).toBe(true);
    expect(c.store.selectThreadLiveStream(CH, ROOT)).toBe(true);
  });

  it("the setting is per thread: other threads and other channels stay out", () => {
    const c = makeClient(newServer());
    c.store.dispatch({ type: "threadLiveStream/set", channelId: CH, threadRootId: ROOT, enabled: true });
    c.store.dispatch({
      type: "agentStream",
      delta: delta(CH, "root2", 1, AgentStreamDelta_Kind.TEXT, "other"),
    });
    c.store.dispatch({
      type: "agentStream",
      delta: delta("c2", ROOT, 1, AgentStreamDelta_Kind.TEXT, "elsewhere"),
    });
    expect(c.store.getState().agentStream).toEqual({});

    c.store.dispatch({ type: "agentStream", delta: delta(CH, ROOT, 1, AgentStreamDelta_Kind.TEXT, "mine") });
    expect(c.store.getState().agentStream[ROOT]?.text).toBe("mine");
    expect(c.store.getState().agentStream.root2).toBeUndefined();
  });

  it("with the setting off, deltas are dropped, and turning it off drops partial text", async () => {
    const s = newServer();
    const c = makeClient(s);
    await c.bootstrap("ws1");
    c.store.dispatch({
      type: "agentStream",
      delta: delta(CH, ROOT, 1, AgentStreamDelta_Kind.TEXT, "dropped"),
    });
    expect(c.store.getState().agentStream[ROOT]).toBeUndefined();

    await c.setThreadLiveStream({ workspaceId: "ws1", channelId: CH, threadRootId: ROOT, enabled: true });
    c.store.dispatch({ type: "agentStream", delta: delta(CH, ROOT, 1, AgentStreamDelta_Kind.TEXT, "hi") });
    expect(c.store.getState().agentStream[ROOT]?.text).toBe("hi");

    await c.setThreadLiveStream({ workspaceId: "ws1", channelId: CH, threadRootId: ROOT, enabled: false });
    expect(c.store.getState().agentStream[ROOT]).toBeUndefined();
    c.store.dispatch({ type: "agentStream", delta: delta(CH, ROOT, 2, AgentStreamDelta_Kind.TEXT, "later") });
    expect(c.store.getState().agentStream[ROOT]).toBeUndefined();
  });

  it("turning it on mid-run fetches the tail after the server has stored the setting", async () => {
    const s = newServer();
    s.tail = { text: "so far", status: "Reading the repo", lastSeq: 4n };
    const c = makeClient(s);
    await c.bootstrap("ws1");
    c.store.dispatch({
      type: "runs/upsert",
      runs: [create(RunSchema, { id: "r1", channelId: CH, threadRootId: ROOT, state: RunState.PLANNING })],
    });

    await c.setThreadLiveStream({ workspaceId: "ws1", channelId: CH, threadRootId: ROOT, enabled: true });

    expect(s.tailCalls).toEqual(["r1"]);
    expect(s.tailSawOn).toEqual([true]);
    expect(c.store.getState().agentStream[ROOT]).toMatchObject({
      text: "so far",
      status: "Reading the repo",
      lastSeq: 4n,
    });
  });

  it("turning it on when no run is working there does not fetch a tail", async () => {
    const s = newServer();
    const c = makeClient(s);
    await c.bootstrap("ws1");
    c.store.dispatch({
      type: "runs/upsert",
      runs: [create(RunSchema, { id: "r1", channelId: CH, threadRootId: ROOT, state: RunState.DONE })],
    });
    await c.setThreadLiveStream({ workspaceId: "ws1", channelId: CH, threadRootId: ROOT, enabled: true });
    expect(s.tailCalls).toEqual([]);
  });
});
