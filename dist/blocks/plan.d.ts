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
/** A Tread plan ledger item's status (tank.agent.v1.PlanItemStatus) as an emoji. */
export declare function planItemEmoji(status: number): string;
/**
 * Where a Tread's plan stands, for the bar under the goal (Robby, 2026-10-25: "a progress bar
 * based on the original plan, current plan if it changed, and what is complete"). Dropped
 * items are out of the plan and out of the count; firstTotal is the size it started at.
 */
export declare function planProgress(items: readonly {
    status: number;
}[], firstTotal?: number): {
    done: number;
    doing: number;
    needsPerson: number;
    total: number;
    dropped: number;
    firstTotal: number;
    changed: boolean;
    fraction: number;
};
