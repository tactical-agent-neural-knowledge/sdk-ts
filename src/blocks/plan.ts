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

/** A plan as a file: what Download saves and what Add to Atlas makes a page of. */
export interface PlanFile {
  /** "plan-move-billing-to-stripe.md" */
  name: string;
  /** The first heading, which Atlas takes as the page's title. */
  title: string;
  markdown: string;
}

/**
 * What a host offers on a plan card (Robby, 2026-11-02: a plan TANK makes can be downloaded
 * or added to Atlas). The card shows a button for each one given and nothing otherwise.
 */
export interface PlanFileActions {
  download?: (file: PlanFile) => void | Promise<void>;
  addToAtlas?: (file: PlanFile) => void | Promise<void>;
}

/** Plan fields the file is written from; a structural subset of tank.blocks.v1.PlanCard. */
export interface PlanSource {
  summary: string;
  steps: readonly { title: string; status: StepStatus; files: readonly string[] }[];
  risks: readonly string[];
  questions: readonly string[];
  approverIds: readonly string[];
  planHash: string;
  version: number;
  guardrails: readonly { text: string; state: string; quote: string }[];
}

const TITLE_MAX = 80;

/** The plan's name: its summary's first sentence, cut at a word near 80 characters. */
export function planTitle(plan: Pick<PlanSource, "summary">): string {
  const first = (plan.summary.trim().split(/\n|(?<=[.!?])\s/)[0] ?? "").trim().replace(/[.!?]$/, "");
  if (!first) return "Plan";
  if (first.length <= TITLE_MAX) return first;
  const cut = first.slice(0, TITLE_MAX);
  const space = cut.lastIndexOf(" ");
  return `${(space > 40 ? cut.slice(0, space) : cut).trimEnd()}…`;
}

/** "plan-move-billing-to-stripe.md": up to six words of the title. */
export function planFileName(title: string): string {
  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 6);
  if (words[0] !== "plan") words.unshift("plan");
  return `${words.join("-")}.md`;
}

const GUARDRAIL_WORD: Record<string, string> = {
  met: "met",
  violated: "conflict",
  unsure: "unsure",
  blocked: "blocked",
  not_applicable: "not applicable",
};

/**
 * The plan card as Markdown: the title as the first heading, the summary, the steps as a
 * checklist (done and skipped ticked) with their files under them, then risks, questions,
 * guardrails and approvers. Atlas's importer reads the checklist as to-dos.
 */
export function planMarkdown(
  plan: PlanSource,
  resolveUser?: ((id: string) => string | undefined) | undefined,
): PlanFile {
  const title = planTitle(plan);
  const out: string[] = [`# ${title}`, ""];
  const meta = [`Plan v${plan.version}`, plan.planHash].filter(Boolean).join(" · ");
  if (meta) out.push(`_${meta}_`, "");
  if (plan.summary.trim()) out.push(plan.summary.trim(), "");
  if (plan.steps.length > 0) {
    out.push("## Steps", "");
    for (const s of plan.steps) {
      const ticked = s.status === StepStatus.DONE || s.status === StepStatus.SKIPPED;
      const note =
        s.status === StepStatus.FAILED ? " (failed)" : s.status === StepStatus.SKIPPED ? " (skipped)" : "";
      out.push(`- [${ticked ? "x" : " "}] ${s.title}${note}`);
      for (const f of s.files) out.push(`  - \`${f}\``);
    }
    out.push("");
  }
  const list = (heading: string, items: readonly string[]) => {
    if (items.length === 0) return;
    out.push(`## ${heading}`, "");
    for (const i of items) out.push(`- ${i}`);
    out.push("");
  };
  list("Risks", plan.risks);
  list("Questions", plan.questions);
  list(
    "Guardrails",
    plan.guardrails.map((g) => {
      const word = GUARDRAIL_WORD[g.state] ?? g.state;
      const quote = g.quote && g.state !== "met" ? `: “${g.quote}”` : "";
      return `${g.text} (${word})${quote}`;
    }),
  );
  if (plan.approverIds.length > 0) {
    out.push(`Approvers: ${plan.approverIds.map((id) => resolveUser?.(id) || id).join(", ")}`, "");
  }
  return { name: planFileName(title), title, markdown: `${out.join("\n").trimEnd()}\n` };
}
