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
    case RunState.AWAITING_MERGE_APPROVAL:
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

const RUN_STATE_LABEL: Record<RunState, string> = {
  [RunState.UNSPECIFIED]: "unknown",
  [RunState.REQUESTED]: "requested",
  [RunState.ADMITTED]: "admitted",
  [RunState.PROVISIONING]: "provisioning",
  [RunState.PLANNING]: "planning",
  [RunState.AWAITING_PLAN_APPROVAL]: "awaiting plan approval",
  [RunState.IMPLEMENTING]: "implementing",
  [RunState.PUSHED]: "pushed",
  [RunState.CI_WATCHING]: "watching CI",
  [RunState.PR_OPEN]: "PR open",
  [RunState.AWAITING_MERGE_APPROVAL]: "awaiting merge approval",
  [RunState.MERGED]: "merged",
  [RunState.VERIFYING_DEPLOY]: "verifying deploy",
  [RunState.DONE]: "done",
  [RunState.CANCELLED]: "cancelled",
  [RunState.FAILED]: "failed",
  [RunState.BUDGET_EXHAUSTED]: "budget exhausted",
  [RunState.TIMED_OUT]: "timed out",
  [RunState.APPROVAL_EXPIRED]: "approval expired",
};

/** Human label for a run state ("awaiting plan approval", "watching CI", …). */
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
  [RunState.PUSHED]: "Pushed, waiting for the checks",
  [RunState.CI_WATCHING]: "Watching the checks",
  [RunState.PR_OPEN]: "Pull request open",
  [RunState.AWAITING_MERGE_APPROVAL]: "Waiting for your go to merge",
  [RunState.MERGED]: "Merged, verifying the deploy",
  [RunState.VERIFYING_DEPLOY]: "Verifying the deploy",
  [RunState.DONE]: "Done",
  [RunState.CANCELLED]: "Stopped",
  [RunState.FAILED]: "Failed",
  [RunState.BUDGET_EXHAUSTED]: "Stopped: the budget is used up",
  [RunState.TIMED_OUT]: "Timed out",
  [RunState.APPROVAL_EXPIRED]: "The approval expired",
};

/**
 * What the run is doing, as a sentence for the strip above the composer: the state's
 * meaning in a person's words rather than its name ("Waiting for your go to merge").
 */
export function runStatusPhrase(state: RunState): string {
  return RUN_STATE_PHRASE[state] ?? "Starting up";
}
