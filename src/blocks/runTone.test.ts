import { describe, expect, it } from "vitest";
import { RunState } from "../contracts/tank/agent/v1/agent_pb.js";
import {
  isTerminalRunState,
  RUN_TONE_MUI_COLOR,
  RUN_TONE_PAPER_COLOR,
  type RunTone,
  runStateLabel,
  runTone,
} from "./index.js";

describe("runTone", () => {
  it("maps every RunState to a tone: running purple, awaiting amber, done green, failed red, cancelled grey", () => {
    const expected: Record<RunTone, RunState[]> = {
      running: [
        RunState.REQUESTED,
        RunState.ADMITTED,
        RunState.PROVISIONING,
        RunState.PLANNING,
        RunState.IMPLEMENTING,
        RunState.PUSHED,
        RunState.CI_WATCHING,
        RunState.PR_OPEN,
        RunState.MERGED,
        RunState.VERIFYING_DEPLOY,
      ],
      awaiting: [RunState.AWAITING_PLAN_APPROVAL, RunState.AWAITING_MERGE_APPROVAL],
      done: [RunState.DONE],
      failed: [RunState.FAILED, RunState.BUDGET_EXHAUSTED, RunState.TIMED_OUT, RunState.APPROVAL_EXPIRED],
      cancelled: [RunState.CANCELLED, RunState.UNSPECIFIED],
    };
    const covered = new Set<RunState>();
    for (const [tone, states] of Object.entries(expected) as Array<[RunTone, RunState[]]>) {
      for (const s of states) {
        expect(runTone(s), RunState[s]).toBe(tone);
        covered.add(s);
      }
    }
    const all = Object.values(RunState).filter((v): v is RunState => typeof v === "number");
    expect(covered.size).toBe(all.length);
    expect(RUN_TONE_MUI_COLOR).toEqual({
      running: "secondary",
      awaiting: "warning",
      done: "success",
      failed: "error",
      cancelled: "default",
    });
    expect(RUN_TONE_PAPER_COLOR).toEqual({
      running: "secondary",
      awaiting: "tertiary",
      done: "success",
      failed: "error",
      cancelled: "outline",
    });
  });

  it("labels and terminal states", () => {
    expect(runStateLabel(RunState.AWAITING_PLAN_APPROVAL)).toBe("awaiting plan approval");
    expect(runStateLabel(RunState.CI_WATCHING)).toBe("watching CI");
    expect(runStateLabel(99 as RunState)).toBe("unknown");
    expect(isTerminalRunState(RunState.DONE)).toBe(true);
    expect(isTerminalRunState(RunState.TIMED_OUT)).toBe(true);
    expect(isTerminalRunState(RunState.CANCELLED)).toBe(true);
    expect(isTerminalRunState(RunState.PR_OPEN)).toBe(false);
    expect(isTerminalRunState(RunState.AWAITING_MERGE_APPROVAL)).toBe(false);
  });
});
