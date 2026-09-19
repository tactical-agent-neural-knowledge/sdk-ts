import { RunState } from "../contracts/tank/agent/v1/agent_pb.js";
/**
 * Colour family for an agent run's state, shared by web and mobile chips:
 * `running` Cybernetic Purple, `awaiting` Industrial Amber (a human is needed), `done` green,
 * `failed` red (failed / budget exhausted / timed out / approval expired), `cancelled` grey.
 */
export type RunTone = "running" | "awaiting" | "done" | "failed" | "cancelled";
export declare function runTone(state: RunState): RunTone;
/** True once a run can no longer change state. */
export declare function isTerminalRunState(state: RunState): boolean;
/** Human label for a run state ("awaiting plan approval", "watching CI", …). */
export declare function runStateLabel(state: RunState): string;
/** MUI palette key per tone (`secondary` = Cybernetic Purple, `warning` = Industrial Amber). */
export declare const RUN_TONE_MUI_COLOR: Record<RunTone, "secondary" | "warning" | "success" | "error" | "default">;
/** react-native-paper `MD3Colors` slot per tone (`secondary` = purple, `tertiary` = amber); `cancelled` uses the outline. */
export declare const RUN_TONE_PAPER_COLOR: Record<RunTone, "secondary" | "tertiary" | "success" | "error" | "outline">;
