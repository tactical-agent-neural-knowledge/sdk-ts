import type { PlanStep } from "../contracts/tank/blocks/v1/blocks_pb.js";
import { StepStatus } from "../contracts/tank/blocks/v1/blocks_pb.js";
/**
 * A plan card at a glance: an emoji per step and one for the whole plan (Robby, 2026-10-25:
 * "just emojis and a todo list ... tap the text to toggle to the detail"). One mapping for
 * the web and native renderers.
 */
export declare function stepEmoji(status: StepStatus): string;
/** The plan's own emoji and how far along it is: ✅ all done, ❌ a step failed, 🔄 under way, 📋 not started. */
export declare function planGlance(steps: readonly PlanStep[]): {
    emoji: string;
    done: number;
    total: number;
};
