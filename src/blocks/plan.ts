import type { PlanStep } from "../contracts/tank/blocks/v1/blocks_pb.js";
import { StepStatus } from "../contracts/tank/blocks/v1/blocks_pb.js";

/**
 * A plan card at a glance: an emoji per step and one for the whole plan (Robby, 2026-10-25:
 * "just emojis and a todo list ... tap the text to toggle to the detail"). One mapping for
 * the web and native renderers.
 */
export function stepEmoji(status: StepStatus): string {
  switch (status) {
    case StepStatus.RUNNING:
      return "🔄";
    case StepStatus.DONE:
      return "✅";
    case StepStatus.FAILED:
      return "❌";
    case StepStatus.SKIPPED:
      return "⏭️";
    default:
      return "⬜";
  }
}

/** The plan's own emoji and how far along it is: ✅ all done, ❌ a step failed, 🔄 under way, 📋 not started. */
export function planGlance(steps: readonly PlanStep[]): { emoji: string; done: number; total: number } {
  const done = steps.filter((s) => s.status === StepStatus.DONE || s.status === StepStatus.SKIPPED).length;
  let emoji = "📋";
  if (steps.length > 0 && done === steps.length) emoji = "✅";
  else if (steps.some((s) => s.status === StepStatus.FAILED)) emoji = "❌";
  else if (steps.some((s) => s.status === StepStatus.RUNNING || s.status === StepStatus.DONE)) emoji = "🔄";
  return { emoji, done, total: steps.length };
}

/** A Tread plan ledger item's status (tank.agent.v1.PlanItemStatus) as an emoji. */
export function planItemEmoji(status: number): string {
  switch (status) {
    case 2:
      return "🔄";
    case 3:
      return "✅";
    case 4:
      return "✋";
    case 5:
      return "⏭️";
    default:
      return "⬜";
  }
}

/**
 * Where a Tread's plan stands, for the bar under the goal (Robby, 2026-10-25: "a progress bar
 * based on the original plan, current plan if it changed, and what is complete"). Dropped
 * items are out of the plan and out of the count; firstTotal is the size it started at.
 */
export function planProgress(items: readonly { status: number }[], firstTotal = 0) {
  const live = items.filter((i) => i.status !== 5);
  const done = live.filter((i) => i.status === 3).length;
  const doing = live.filter((i) => i.status === 2).length;
  const needsPerson = live.filter((i) => i.status === 4).length;
  return {
    done,
    doing,
    needsPerson,
    total: live.length,
    dropped: items.length - live.length,
    firstTotal,
    changed: firstTotal > 0 && firstTotal !== live.length,
    fraction: live.length ? done / live.length : 0,
  };
}
