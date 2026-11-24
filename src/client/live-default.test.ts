import { create } from "@bufbuild/protobuf";
import { describe, expect, it } from "vitest";
import { AgentStreamDelta_Kind, AgentStreamDeltaSchema } from "../contracts/tank/events/v1/events_pb.js";
import { ThreadLiveStreamSchema, WorkspaceSchema } from "../contracts/tank/workspace/v1/workspace_pb.js";
import { AGENT_STREAM_STEPS, TankStore } from "./store.js";

const delta = (seq: bigint, kind: AgentStreamDelta_Kind, text: string, root = "r1") =>
  create(AgentStreamDeltaSchema, { channelId: "c1", threadRootId: root, runId: "run1", seq, kind, text });
const status = (seq: bigint, text: string, root?: string) =>
  delta(seq, AgentStreamDelta_Kind.STATUS, text, root);

/** A store whose bootstrap said what an unset thread takes, and what the person set themselves. */
function store(defaultOn: boolean, rows: Array<{ threadRootId: string; enabled: boolean }> = []) {
  const s = new TankStore();
  s.dispatch({
    type: "bootstrap",
    workspace: create(WorkspaceSchema, { id: "ws1", slug: "tank", name: "TANK" }),
    me: undefined,
    channels: [],
    readStates: [],
    members: [],
    threadLiveStreamDefault: defaultOn,
    threadLiveStreams: rows.map((r) => create(ThreadLiveStreamSchema, { channelId: "c1", ...r })),
  });
  return s;
}

describe("live agent output is on by default", () => {
  it("is on in a thread the person never touched, when the server says so", () => {
    const s = store(true);
    expect(s.selectThreadLiveStream("c1", "r1")).toBe(true);
    s.dispatch({ type: "agentStream", delta: status(1n, "Reading the thread") });
    expect(s.getState().agentStream.r1?.status).toBe("Reading the thread");
  });

  it("stays off where the person turned it off, and nothing of that thread is kept", () => {
    const s = store(true, [{ threadRootId: "r1", enabled: false }]);
    expect(s.selectThreadLiveStream("c1", "r1")).toBe(false);
    expect(s.selectThreadLiveStream("c1", "r2")).toBe(true);
    s.dispatch({ type: "agentStream", delta: status(1n, "Reading the thread") });
    expect(s.getState().agentStream.r1).toBeUndefined();
    // Turning it off mid-run remembers the choice and drops what was showing.
    s.dispatch({ type: "agentStream", delta: status(1n, "Editing src/api.ts", "r2") });
    s.dispatch({ type: "threadLiveStream/set", channelId: "c1", threadRootId: "r2", enabled: false });
    expect(s.selectThreadLiveStream("c1", "r2")).toBe(false);
    expect(s.getState().agentStream.r2).toBeUndefined();
    s.dispatch({ type: "threadLiveStream/set", channelId: "c1", threadRootId: "r2", enabled: true });
    expect(s.selectThreadLiveStream("c1", "r2")).toBe(true);
  });

  it("is off in an unset thread against a server from before the default", () => {
    const s = store(false, [{ threadRootId: "r1", enabled: true }]);
    expect(s.selectThreadLiveStream("c1", "r1")).toBe(true);
    expect(s.selectThreadLiveStream("c1", "r2")).toBe(false);
    expect(new TankStore().selectThreadLiveStream("c1", "r1")).toBe(false);
  });
});

describe("the steps the agent has taken", () => {
  it("are kept in order, the newest last, never one twice in a row and never more than a few", () => {
    const s = store(true);
    const lines = ["Reading the thread", "Reading the thread", "Searching the code", "Reading src/api.ts"];
    for (const [i, l] of lines.entries())
      s.dispatch({ type: "agentStream", delta: status(BigInt(i + 1), l) });
    expect(s.getState().agentStream.r1?.steps).toEqual([
      "Reading the thread",
      "Searching the code",
      "Reading src/api.ts",
    ]);
    // Words between steps do not disturb them.
    s.dispatch({ type: "agentStream", delta: delta(5n, AgentStreamDelta_Kind.TEXT, "I found it. ") });
    expect(s.getState().agentStream.r1?.steps).toHaveLength(3);
    for (let i = 0; i < 10; i++)
      s.dispatch({ type: "agentStream", delta: status(BigInt(6 + i), `Editing file${i}.ts`) });
    const steps = s.getState().agentStream.r1?.steps ?? [];
    expect(steps).toHaveLength(AGENT_STREAM_STEPS);
    expect(steps[steps.length - 1]).toBe("Editing file9.ts");
    expect(s.getState().agentStream.r1?.status).toBe("Editing file9.ts");
  });

  it("end with the server's current line when the tail is fetched", () => {
    const s = store(true);
    s.dispatch({ type: "agentStream", delta: status(1n, "Reading the thread") });
    s.dispatch({
      type: "agentStream/tail",
      channelId: "c1",
      key: "r1",
      runId: "run1",
      text: "Looking now.",
      status: "Running the tests",
      lastSeq: 9n,
    });
    expect(s.getState().agentStream.r1?.steps).toEqual(["Reading the thread", "Running the tests"]);
  });
});
