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
    steps: readonly {
        title: string;
        status: StepStatus;
        files: readonly string[];
    }[];
    risks: readonly string[];
    questions: readonly string[];
    approverIds: readonly string[];
    planHash: string;
    version: number;
    guardrails: readonly {
        text: string;
        state: string;
        quote: string;
    }[];
}
/** The plan's name: its summary's first sentence, cut at a word near 80 characters. */
export declare function planTitle(plan: Pick<PlanSource, "summary">): string;
/** "plan-move-billing-to-stripe.md": up to six words of the title. */
export declare function planFileName(title: string): string;
/**
 * The plan card as Markdown: the title as the first heading, the summary, the steps as a
 * checklist (done and skipped ticked) with their files under them, then risks, questions,
 * guardrails and approvers. Atlas's importer reads the checklist as to-dos.
 */
export declare function planMarkdown(plan: PlanSource, resolveUser?: ((id: string) => string | undefined) | undefined): PlanFile;
