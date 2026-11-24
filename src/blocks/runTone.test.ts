import { describe, expect, it } from "vitest";
import { RunState } from "../contracts/tank/agent/v1/agent_pb.js";
import {
  isTerminalRunState,
  RUN_TONE_MUI_COLOR,
  RUN_TONE_PAPER_COLOR,
  type RunTone,
  runStateLabel,
  runStatusPhrase,
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
      awaiting: [
        RunState.AWAITING_PLAN_APPROVAL,
        RunState.AWAITING_ANSWER,
        RunState.AWAITING_MERGE_APPROVAL,
        RunState.BLOCKED,
      ],
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
    expect(runStateLabel(RunState.AWAITING_PLAN_APPROVAL)).toBe("plan ready");
    expect(runStateLabel(RunState.AWAITING_ANSWER)).toBe("waiting for you");
    expect(isTerminalRunState(RunState.AWAITING_ANSWER)).toBe(false);
    expect(runStateLabel(RunState.CI_WATCHING)).toBe("checking");
    expect(runStateLabel(RunState.VERIFYING_DEPLOY)).toBe("checking it live");
    expect(runStateLabel(RunState.PR_OPEN)).toBe("ready to check");
    // No state's raw name reaches a person.
    for (const v of Object.values(RunState)) {
      if (typeof v === "number")
        expect(runStateLabel(v)).not.toMatch(/implementing|verifying|deploy|awaiting|_/);
    }
    expect(runStateLabel(99 as RunState)).toBe("unknown");
    expect(isTerminalRunState(RunState.DONE)).toBe(true);
    expect(isTerminalRunState(RunState.TIMED_OUT)).toBe(true);
    expect(isTerminalRunState(RunState.CANCELLED)).toBe(true);
    expect(isTerminalRunState(RunState.PR_OPEN)).toBe(false);
    expect(isTerminalRunState(RunState.AWAITING_MERGE_APPROVAL)).toBe(false);
  });
});

describe("runStatusPhrase", () => {
  it("says what the run is doing in a person's words, for every state", () => {
    expect(runStatusPhrase(RunState.AWAITING_MERGE_APPROVAL)).toBe(
      "Ready to check. Waiting for your go to merge",
    );
    expect(runStatusPhrase(RunState.VERIFYING_DEPLOY)).toBe("Checking it live");
    expect(runStatusPhrase(RunState.MERGED)).toBe("Merged. Going live now");
    expect(runStatusPhrase(RunState.CI_WATCHING)).toBe("Watching the checks");
    expect(runStatusPhrase(RunState.FAILED)).toBe("Didn't finish");
    // A run held on its own question never reads as a plan waiting for a yes.
    expect(runStatusPhrase(RunState.AWAITING_ANSWER)).toBe("Waiting for an answer to the agent's question");
    expect(runStatusPhrase(RunState.AWAITING_ANSWER)).not.toBe(
      runStatusPhrase(RunState.AWAITING_PLAN_APPROVAL),
    );
    for (const v of Object.values(RunState)) {
      if (typeof v === "number") expect(runStatusPhrase(v)).not.toBe("");
    }
  });
});
