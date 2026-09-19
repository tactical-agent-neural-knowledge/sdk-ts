import { RunState } from "../contracts/tank/agent/v1/agent_pb.js";
export function runTone(state) {
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
export function isTerminalRunState(state) {
    const t = runTone(state);
    return t === "done" || t === "failed" || t === "cancelled";
}
const RUN_STATE_LABEL = {
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
export function runStateLabel(state) {
    return RUN_STATE_LABEL[state] ?? "unknown";
}
/** MUI palette key per tone (`secondary` = Cybernetic Purple, `warning` = Industrial Amber). */
export const RUN_TONE_MUI_COLOR = {
    running: "secondary",
    awaiting: "warning",
    done: "success",
    failed: "error",
    cancelled: "default",
};
/** react-native-paper `MD3Colors` slot per tone (`secondary` = purple, `tertiary` = amber); `cancelled` uses the outline. */
export const RUN_TONE_PAPER_COLOR = {
    running: "secondary",
    awaiting: "tertiary",
    done: "success",
    failed: "error",
    cancelled: "outline",
};
