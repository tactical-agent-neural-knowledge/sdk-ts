import { type Block, type Blocks, type Button, ButtonStyle, type Check, CheckState, type DiffFile, type Field, GateKind, type PlanStep, StepStatus, type ToolLogEntry } from "../contracts/tank/blocks/v1/blocks_pb.js";
import { type RichTextInput } from "./richtext.js";
/** Wrap blocks into a `Blocks` message (what `Message.blocks` holds). */
export declare function blocks(...items: Array<Block | Block[]>): Blocks;
export declare function header(text: string, blockId?: string): Block;
export interface SectionInput {
    text?: RichTextInput;
    fields?: Array<Field | {
        label: string;
        value: string;
    }>;
    accessory?: Button;
    blockId?: string;
}
export declare function field(label: string, value: string): Field;
export declare function section(input: SectionInput | string): Block;
export declare function context(elements: RichTextInput[], blockId?: string): Block;
export declare function divider(blockId?: string): Block;
export interface ButtonInput {
    actionId?: string;
    text: string;
    value?: string;
    style?: "primary" | "danger" | ButtonStyle;
    url?: string;
    confirm?: {
        title: string;
        text: string;
        confirm?: string;
        deny?: string;
    };
}
export declare function button(input: ButtonInput): Button;
export declare function actions(buttons: Array<Button | ButtonInput>, blockId?: string): Block;
export interface PlanStepInput {
    id: string;
    title: string;
    status?: StepStatus | "pending" | "running" | "done" | "failed" | "skipped";
    files?: string[];
}
export declare function planStep(input: PlanStepInput): PlanStep;
export interface PlanCardInput {
    summary: string;
    steps?: Array<PlanStep | PlanStepInput>;
    risks?: string[];
    questions?: string[];
    approverIds?: string[];
    planHash?: string;
    version?: number;
    blockId?: string;
}
export declare function planCard(input: PlanCardInput): Block;
export interface DiffFileInput {
    path: string;
    additions?: number;
    deletions?: number;
    hunkPreview?: string;
}
export declare function diffFile(input: DiffFileInput): DiffFile;
export interface DiffPreviewInput {
    commitSha: string;
    compareUrl?: string;
    files: Array<DiffFile | DiffFileInput>;
    blockId?: string;
}
export declare function diffPreview(input: DiffPreviewInput): Block;
export interface CheckInput {
    name: string;
    state?: CheckState | "queued" | "running" | "success" | "failure" | "cancelled";
    url?: string;
    failureExcerpt?: string;
}
export declare function check(input: CheckInput): Check;
export interface CiStatusInput {
    headSha: string;
    checks: Array<Check | CheckInput>;
    prUrl?: string;
    prNumber?: number;
    blockId?: string;
}
export declare function ciStatus(input: CiStatusInput): Block;
export interface ApprovalPromptInput {
    gateId: string;
    kind?: GateKind | "plan" | "scope_change" | "merge" | "deploy" | "destructive_tool" | "budget_increase";
    subject: string;
    approverIds?: string[];
    minApprovals?: number;
    /** ms since epoch */
    expiresAt?: number;
    decided?: boolean;
    decision?: "approved" | "rejected" | "expired" | "";
    blockId?: string;
}
export declare function approvalPrompt(input: ApprovalPromptInput): Block;
export interface ToolLogEntryInput {
    /** ms since epoch */
    at: number;
    tool: string;
    summary: string;
    ok?: boolean;
}
export declare function toolLogEntry(input: ToolLogEntryInput): ToolLogEntry;
export interface ToolLogInput {
    phase: string;
    toolCalls?: number;
    filesEdited?: number;
    recent?: Array<ToolLogEntry | ToolLogEntryInput>;
    runPanelUrl?: string;
    blockId?: string;
}
export declare function toolLog(input: ToolLogInput): Block;
export interface StatusCardInput {
    runId: string;
    state: string;
    detail?: string;
    branch?: string;
    costUsd?: number;
    /** ms since epoch */
    startedAt?: number;
    runPanelUrl?: string;
    blockId?: string;
}
export declare function statusCard(input: StatusCardInput): Block;
export interface FilePreviewInput {
    fileId: string;
    name: string;
    mime?: string;
    size?: number | bigint;
    thumbnailUrl?: string;
    blockId?: string;
}
export declare function filePreview(input: FilePreviewInput): Block;
