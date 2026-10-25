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
