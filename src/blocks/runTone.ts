import { RunState } from "../contracts/tank/agent/v1/agent_pb.js";

/**
 * Colour family for an agent run's state, shared by web and mobile chips:
 * `running` Cybernetic Purple, `awaiting` Industrial Amber (a human is needed), `done` green,
 * `failed` red (failed / budget exhausted / timed out / approval expired), `cancelled` grey.
 */
export type RunTone = "running" | "awaiting" | "done" | "failed" | "cancelled";

export function runTone(state: RunState): RunTone {
  switch (state) {
    case RunState.AWAITING_PLAN_APPROVAL:
    case RunState.AWAITING_ANSWER:
    case RunState.AWAITING_MERGE_APPROVAL:
    case RunState.BLOCKED:
      return "awaiting";
    case RunState.DONE:
      return "done";
    case RunState.FAILED:
    case RunState.BUDGET_EXHAUSTED:
    case RunState.TIMED_OUT:
    case RunState.APPROVAL_EXPIRED:
      return "failed";
    case RunState.CANCELLED:
    case RunState.UNSPECIFIED:
      return "cancelled";
    default:
      return "running";
  }
}

/** True once a run can no longer change state. */
export function isTerminalRunState(state: RunState): boolean {
  const t = runTone(state);
  return t === "done" || t === "failed" || t === "cancelled";
}

// Plain words, the same as a task's stages and lines ("Ready to check", "Going live"),
// never a state's name: the strip read "implementing" and "verifying deploy" under
// "Merged. Checking it live now." (Robby, #overdrive, 2026-11-24).
const RUN_STATE_LABEL: Record<RunState, string> = {
  [RunState.UNSPECIFIED]: "starting",
  [RunState.REQUESTED]: "starting",
  [RunState.ADMITTED]: "starting",
  [RunState.PROVISIONING]: "starting",
  [RunState.PLANNING]: "planning",
  [RunState.AWAITING_PLAN_APPROVAL]: "plan ready",
  [RunState.IMPLEMENTING]: "working",
  [RunState.PUSHED]: "checking",
  [RunState.CI_WATCHING]: "checking",
  [RunState.PR_OPEN]: "ready to check",
  [RunState.AWAITING_MERGE_APPROVAL]: "ready to check",
  [RunState.MERGED]: "going live",
  [RunState.VERIFYING_DEPLOY]: "checking it live",
  [RunState.DONE]: "done",
  [RunState.CANCELLED]: "stopped",
  [RunState.FAILED]: "didn't finish",
  [RunState.BUDGET_EXHAUSTED]: "out of budget",
  [RunState.TIMED_OUT]: "out of time",
  [RunState.APPROVAL_EXPIRED]: "no yes in time",
  [RunState.BLOCKED]: "at a guardrail",
  [RunState.AWAITING_ANSWER]: "waiting for you",
};

/** Plain label for a run state ("ready to check", "checking it live", …). */
export function runStateLabel(state: RunState): string {
  return RUN_STATE_LABEL[state] ?? "unknown";
}

/** MUI palette key per tone (`secondary` = Cybernetic Purple, `warning` = Industrial Amber). */
export const RUN_TONE_MUI_COLOR: Record<RunTone, "secondary" | "warning" | "success" | "error" | "default"> =
  {
    running: "secondary",
    awaiting: "warning",
    done: "success",
    failed: "error",
    cancelled: "default",
  };

/** react-native-paper `MD3Colors` slot per tone (`secondary` = purple, `tertiary` = amber); `cancelled` uses the outline. */
export const RUN_TONE_PAPER_COLOR: Record<
  RunTone,
  "secondary" | "tertiary" | "success" | "error" | "outline"
> = {
  running: "secondary",
  awaiting: "tertiary",
  done: "success",
  failed: "error",
  cancelled: "outline",
};

const RUN_STATE_PHRASE: Record<RunState, string> = {
  [RunState.UNSPECIFIED]: "Starting up",
  [RunState.REQUESTED]: "Starting up",
  [RunState.ADMITTED]: "Starting up",
  [RunState.PROVISIONING]: "Starting up",
  [RunState.PLANNING]: "Reading the code and writing a plan",
  [RunState.AWAITING_PLAN_APPROVAL]: "Waiting for your go on the plan",
  [RunState.IMPLEMENTING]: "Working on it",
  [RunState.PUSHED]: "Waiting for the checks",
  [RunState.CI_WATCHING]: "Watching the checks",
  [RunState.PR_OPEN]: "Ready to check",
  [RunState.AWAITING_MERGE_APPROVAL]: "Ready to check. Waiting for your go to merge",
  [RunState.MERGED]: "Merged. Going live now",
  [RunState.VERIFYING_DEPLOY]: "Checking it live",
  [RunState.DONE]: "Done",
  [RunState.CANCELLED]: "Stopped",
  [RunState.FAILED]: "Didn't finish",
  [RunState.BUDGET_EXHAUSTED]: "Stopped: the budget is used up",
  [RunState.TIMED_OUT]: "Timed out",
  [RunState.APPROVAL_EXPIRED]: "The approval expired",
  [RunState.BLOCKED]: "Stopped at a guardrail, waiting for a person",
  // Not "your go on the plan": the agent asked a question in the thread and no plan is
  // waiting. Until the control plane reported this state, such a run arrived as
  // AWAITING_PLAN_APPROVAL and the strip said the plan was waiting under the question card.
  [RunState.AWAITING_ANSWER]: "Waiting for an answer to the agent's question",
};

/**
 * What the run is doing, as a sentence for the strip above the composer: the state's
 * meaning in a person's words rather than its name ("Waiting for your go to merge").
 */
export function runStatusPhrase(state: RunState): string {
  return RUN_STATE_PHRASE[state] ?? "Starting up";
}
