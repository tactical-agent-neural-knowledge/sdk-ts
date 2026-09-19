import { type Block, type Blocks } from "../contracts/tank/blocks/v1/blocks_pb.js";
import type { RichText } from "../contracts/tank/richtext/v1/richtext_pb.js";
/** Hard caps applied by `normalizeBlocks`; mirrors what the API enforces. */
export declare const LIMITS: {
    readonly blocks: 50;
    readonly headerText: 150;
    readonly fields: 10;
    readonly fieldLabel: 75;
    readonly fieldValue: 2000;
    readonly textElement: 3000;
    readonly contextElements: 10;
    readonly buttons: 10;
    readonly buttonText: 75;
    readonly buttonValue: 2000;
    readonly url: 3000;
    readonly planSummary: 3000;
    readonly planSteps: 50;
    readonly planStepTitle: 200;
    readonly planStepFiles: 20;
    readonly planList: 20;
    readonly planListItem: 500;
    readonly approverIds: 50;
    readonly diffFiles: 100;
    readonly diffPath: 500;
    readonly hunkPreview: 4000;
    readonly checks: 50;
    readonly checkName: 100;
    readonly failureExcerpt: 2000;
    readonly approvalSubject: 500;
    readonly toolLogRecent: 20;
    readonly toolName: 100;
    readonly toolSummary: 500;
    readonly phase: 100;
    readonly fileName: 255;
    readonly statusDetail: 1000;
    readonly statusState: 50;
    readonly branch: 255;
    readonly shortString: 200;
};
export declare function truncate(s: string, max: number): string;
export declare function normalizeRichText(r: RichText | undefined): RichText | undefined;
/**
 * Makes a block list safe to post and render: fills missing `block_id`s
 * (`b1`, `b2`, … by position; duplicates get a suffix), truncates long
 * strings (with an ellipsis), caps every repeated field, and drops blocks
 * without a kind. Idempotent: normalizing twice yields the same value.
 */
export declare function normalizeBlocks(input: Blocks | Block[]): Blocks;
export interface BlockIssue {
    /** e.g. `blocks[2].actions.buttons[0].action_id` */
    path: string;
    message: string;
}
/** Structural problems a normalize cannot fix. Empty means postable. */
export declare function validateBlocks(input: Blocks | Block[]): BlockIssue[];
