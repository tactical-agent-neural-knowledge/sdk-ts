import type { GenEnum, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { RichText } from "../../richtext/v1/richtext_pb.js";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/blocks/v1/blocks.proto.
 */
export declare const file_tank_blocks_v1_blocks: GenFile;
/**
 * Rich "cards" rendered identically by web and mobile. Agents post these.
 *
 * @generated from message tank.blocks.v1.Blocks
 */
export type Blocks = Message<"tank.blocks.v1.Blocks"> & {
    /**
     * @generated from field: repeated tank.blocks.v1.Block blocks = 1;
     */
    blocks: Block[];
};
/**
 * Describes the message tank.blocks.v1.Blocks.
 * Use `create(BlocksSchema)` to create a new message.
 */
export declare const BlocksSchema: GenMessage<Blocks>;
/**
 * @generated from message tank.blocks.v1.Block
 */
export type Block = Message<"tank.blocks.v1.Block"> & {
    /**
     * @generated from field: string block_id = 1;
     */
    blockId: string;
    /**
     * @generated from oneof tank.blocks.v1.Block.kind
     */
    kind: {
        /**
         * @generated from field: tank.blocks.v1.Header header = 2;
         */
        value: Header;
        case: "header";
    } | {
        /**
         * @generated from field: tank.blocks.v1.Section section = 3;
         */
        value: Section;
        case: "section";
    } | {
        /**
         * @generated from field: tank.blocks.v1.Context context = 4;
         */
        value: Context;
        case: "context";
    } | {
        /**
         * @generated from field: tank.blocks.v1.Divider divider = 5;
         */
        value: Divider;
        case: "divider";
    } | {
        /**
         * @generated from field: tank.blocks.v1.Actions actions = 6;
         */
        value: Actions;
        case: "actions";
    } | {
        /**
         * @generated from field: tank.blocks.v1.PlanCard plan_card = 7;
         */
        value: PlanCard;
        case: "planCard";
    } | {
        /**
         * @generated from field: tank.blocks.v1.DiffPreview diff_preview = 8;
         */
        value: DiffPreview;
        case: "diffPreview";
    } | {
        /**
         * @generated from field: tank.blocks.v1.CiStatus ci_status = 9;
         */
        value: CiStatus;
        case: "ciStatus";
    } | {
        /**
         * @generated from field: tank.blocks.v1.ApprovalPrompt approval_prompt = 10;
         */
        value: ApprovalPrompt;
        case: "approvalPrompt";
    } | {
        /**
         * @generated from field: tank.blocks.v1.ToolLog tool_log = 11;
         */
        value: ToolLog;
        case: "toolLog";
    } | {
        /**
         * @generated from field: tank.blocks.v1.FilePreview file_preview = 12;
         */
        value: FilePreview;
        case: "filePreview";
    } | {
        /**
         * @generated from field: tank.blocks.v1.StatusCard status_card = 13;
         */
        value: StatusCard;
        case: "statusCard";
    } | {
        case: undefined;
        value?: undefined;
    };
};
/**
 * Describes the message tank.blocks.v1.Block.
 * Use `create(BlockSchema)` to create a new message.
 */
export declare const BlockSchema: GenMessage<Block>;
/**
 * @generated from message tank.blocks.v1.Header
 */
export type Header = Message<"tank.blocks.v1.Header"> & {
    /**
     * @generated from field: string text = 1;
     */
    text: string;
};
/**
 * Describes the message tank.blocks.v1.Header.
 * Use `create(HeaderSchema)` to create a new message.
 */
export declare const HeaderSchema: GenMessage<Header>;
/**
 * @generated from message tank.blocks.v1.Section
 */
export type Section = Message<"tank.blocks.v1.Section"> & {
    /**
     * @generated from field: tank.richtext.v1.RichText text = 1;
     */
    text?: RichText;
    /**
     * @generated from field: repeated tank.blocks.v1.Field fields = 2;
     */
    fields: Field[];
    /**
     * @generated from field: tank.blocks.v1.Button accessory = 3;
     */
    accessory?: Button;
};
/**
 * Describes the message tank.blocks.v1.Section.
 * Use `create(SectionSchema)` to create a new message.
 */
export declare const SectionSchema: GenMessage<Section>;
/**
 * @generated from message tank.blocks.v1.Field
 */
export type Field = Message<"tank.blocks.v1.Field"> & {
    /**
     * @generated from field: string label = 1;
     */
    label: string;
    /**
     * @generated from field: string value = 2;
     */
    value: string;
};
/**
 * Describes the message tank.blocks.v1.Field.
 * Use `create(FieldSchema)` to create a new message.
 */
export declare const FieldSchema: GenMessage<Field>;
/**
 * @generated from message tank.blocks.v1.Context
 */
export type Context = Message<"tank.blocks.v1.Context"> & {
    /**
     * @generated from field: repeated tank.richtext.v1.RichText elements = 1;
     */
    elements: RichText[];
};
/**
 * Describes the message tank.blocks.v1.Context.
 * Use `create(ContextSchema)` to create a new message.
 */
export declare const ContextSchema: GenMessage<Context>;
/**
 * @generated from message tank.blocks.v1.Divider
 */
export type Divider = Message<"tank.blocks.v1.Divider"> & {};
/**
 * Describes the message tank.blocks.v1.Divider.
 * Use `create(DividerSchema)` to create a new message.
 */
export declare const DividerSchema: GenMessage<Divider>;
/**
 * @generated from message tank.blocks.v1.Button
 */
export type Button = Message<"tank.blocks.v1.Button"> & {
    /**
     * @generated from field: string action_id = 1;
     */
    actionId: string;
    /**
     * @generated from field: string text = 2;
     */
    text: string;
    /**
     * @generated from field: string value = 3;
     */
    value: string;
    /**
     * @generated from field: tank.blocks.v1.ButtonStyle style = 4;
     */
    style: ButtonStyle;
    /**
     * link button when set
     *
     * @generated from field: string url = 5;
     */
    url: string;
    /**
     * @generated from field: tank.blocks.v1.Confirm confirm = 6;
     */
    confirm?: Confirm;
};
/**
 * Describes the message tank.blocks.v1.Button.
 * Use `create(ButtonSchema)` to create a new message.
 */
export declare const ButtonSchema: GenMessage<Button>;
/**
 * @generated from message tank.blocks.v1.Confirm
 */
export type Confirm = Message<"tank.blocks.v1.Confirm"> & {
    /**
     * @generated from field: string title = 1;
     */
    title: string;
    /**
     * @generated from field: string text = 2;
     */
    text: string;
    /**
     * @generated from field: string confirm = 3;
     */
    confirm: string;
    /**
     * @generated from field: string deny = 4;
     */
    deny: string;
};
/**
 * Describes the message tank.blocks.v1.Confirm.
 * Use `create(ConfirmSchema)` to create a new message.
 */
export declare const ConfirmSchema: GenMessage<Confirm>;
/**
 * @generated from message tank.blocks.v1.Actions
 */
export type Actions = Message<"tank.blocks.v1.Actions"> & {
    /**
     * @generated from field: repeated tank.blocks.v1.Button buttons = 1;
     */
    buttons: Button[];
};
/**
 * Describes the message tank.blocks.v1.Actions.
 * Use `create(ActionsSchema)` to create a new message.
 */
export declare const ActionsSchema: GenMessage<Actions>;
/**
 * @generated from message tank.blocks.v1.PlanStep
 */
export type PlanStep = Message<"tank.blocks.v1.PlanStep"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string title = 2;
     */
    title: string;
    /**
     * @generated from field: tank.blocks.v1.StepStatus status = 3;
     */
    status: StepStatus;
    /**
     * @generated from field: repeated string files = 4;
     */
    files: string[];
};
/**
 * Describes the message tank.blocks.v1.PlanStep.
 * Use `create(PlanStepSchema)` to create a new message.
 */
export declare const PlanStepSchema: GenMessage<PlanStep>;
/**
 * @generated from message tank.blocks.v1.PlanCard
 */
export type PlanCard = Message<"tank.blocks.v1.PlanCard"> & {
    /**
     * @generated from field: string summary = 1;
     */
    summary: string;
    /**
     * @generated from field: repeated tank.blocks.v1.PlanStep steps = 2;
     */
    steps: PlanStep[];
    /**
     * @generated from field: repeated string risks = 3;
     */
    risks: string[];
    /**
     * @generated from field: repeated string questions = 4;
     */
    questions: string[];
    /**
     * @generated from field: repeated string approver_ids = 5;
     */
    approverIds: string[];
    /**
     * @generated from field: string plan_hash = 6;
     */
    planHash: string;
    /**
     * @generated from field: int32 version = 7;
     */
    version: number;
};
/**
 * Describes the message tank.blocks.v1.PlanCard.
 * Use `create(PlanCardSchema)` to create a new message.
 */
export declare const PlanCardSchema: GenMessage<PlanCard>;
/**
 * @generated from message tank.blocks.v1.DiffFile
 */
export type DiffFile = Message<"tank.blocks.v1.DiffFile"> & {
    /**
     * @generated from field: string path = 1;
     */
    path: string;
    /**
     * @generated from field: int32 additions = 2;
     */
    additions: number;
    /**
     * @generated from field: int32 deletions = 3;
     */
    deletions: number;
    /**
     * truncated unified diff
     *
     * @generated from field: string hunk_preview = 4;
     */
    hunkPreview: string;
};
/**
 * Describes the message tank.blocks.v1.DiffFile.
 * Use `create(DiffFileSchema)` to create a new message.
 */
export declare const DiffFileSchema: GenMessage<DiffFile>;
/**
 * @generated from message tank.blocks.v1.DiffPreview
 */
export type DiffPreview = Message<"tank.blocks.v1.DiffPreview"> & {
    /**
     * @generated from field: string commit_sha = 1;
     */
    commitSha: string;
    /**
     * @generated from field: string compare_url = 2;
     */
    compareUrl: string;
    /**
     * @generated from field: repeated tank.blocks.v1.DiffFile files = 3;
     */
    files: DiffFile[];
    /**
     * @generated from field: int32 total_additions = 4;
     */
    totalAdditions: number;
    /**
     * @generated from field: int32 total_deletions = 5;
     */
    totalDeletions: number;
};
/**
 * Describes the message tank.blocks.v1.DiffPreview.
 * Use `create(DiffPreviewSchema)` to create a new message.
 */
export declare const DiffPreviewSchema: GenMessage<DiffPreview>;
/**
 * @generated from message tank.blocks.v1.Check
 */
export type Check = Message<"tank.blocks.v1.Check"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: tank.blocks.v1.CheckState state = 2;
     */
    state: CheckState;
    /**
     * @generated from field: string url = 3;
     */
    url: string;
    /**
     * @generated from field: string failure_excerpt = 4;
     */
    failureExcerpt: string;
};
/**
 * Describes the message tank.blocks.v1.Check.
 * Use `create(CheckSchema)` to create a new message.
 */
export declare const CheckSchema: GenMessage<Check>;
/**
 * @generated from message tank.blocks.v1.CiStatus
 */
export type CiStatus = Message<"tank.blocks.v1.CiStatus"> & {
    /**
     * @generated from field: string head_sha = 1;
     */
    headSha: string;
    /**
     * @generated from field: repeated tank.blocks.v1.Check checks = 2;
     */
    checks: Check[];
    /**
     * @generated from field: string pr_url = 3;
     */
    prUrl: string;
    /**
     * @generated from field: int32 pr_number = 4;
     */
    prNumber: number;
};
/**
 * Describes the message tank.blocks.v1.CiStatus.
 * Use `create(CiStatusSchema)` to create a new message.
 */
export declare const CiStatusSchema: GenMessage<CiStatus>;
/**
 * @generated from message tank.blocks.v1.ApprovalPrompt
 */
export type ApprovalPrompt = Message<"tank.blocks.v1.ApprovalPrompt"> & {
    /**
     * @generated from field: string gate_id = 1;
     */
    gateId: string;
    /**
     * @generated from field: tank.blocks.v1.GateKind kind = 2;
     */
    kind: GateKind;
    /**
     * @generated from field: string subject = 3;
     */
    subject: string;
    /**
     * @generated from field: repeated string approver_ids = 4;
     */
    approverIds: string[];
    /**
     * @generated from field: int32 min_approvals = 5;
     */
    minApprovals: number;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 6;
     */
    expiresAt?: Timestamp;
    /**
     * @generated from field: bool decided = 7;
     */
    decided: boolean;
    /**
     * approved | rejected | expired
     *
     * @generated from field: string decision = 8;
     */
    decision: string;
};
/**
 * Describes the message tank.blocks.v1.ApprovalPrompt.
 * Use `create(ApprovalPromptSchema)` to create a new message.
 */
export declare const ApprovalPromptSchema: GenMessage<ApprovalPrompt>;
/**
 * @generated from message tank.blocks.v1.ToolLogEntry
 */
export type ToolLogEntry = Message<"tank.blocks.v1.ToolLogEntry"> & {
    /**
     * @generated from field: google.protobuf.Timestamp at = 1;
     */
    at?: Timestamp;
    /**
     * @generated from field: string tool = 2;
     */
    tool: string;
    /**
     * @generated from field: string summary = 3;
     */
    summary: string;
    /**
     * @generated from field: bool ok = 4;
     */
    ok: boolean;
};
/**
 * Describes the message tank.blocks.v1.ToolLogEntry.
 * Use `create(ToolLogEntrySchema)` to create a new message.
 */
export declare const ToolLogEntrySchema: GenMessage<ToolLogEntry>;
/**
 * @generated from message tank.blocks.v1.ToolLog
 */
export type ToolLog = Message<"tank.blocks.v1.ToolLog"> & {
    /**
     * @generated from field: string phase = 1;
     */
    phase: string;
    /**
     * @generated from field: int32 tool_calls = 2;
     */
    toolCalls: number;
    /**
     * @generated from field: int32 files_edited = 3;
     */
    filesEdited: number;
    /**
     * tail only; the run panel has everything
     *
     * @generated from field: repeated tank.blocks.v1.ToolLogEntry recent = 4;
     */
    recent: ToolLogEntry[];
    /**
     * @generated from field: string run_panel_url = 5;
     */
    runPanelUrl: string;
};
/**
 * Describes the message tank.blocks.v1.ToolLog.
 * Use `create(ToolLogSchema)` to create a new message.
 */
export declare const ToolLogSchema: GenMessage<ToolLog>;
/**
 * @generated from message tank.blocks.v1.FilePreview
 */
export type FilePreview = Message<"tank.blocks.v1.FilePreview"> & {
    /**
     * @generated from field: string file_id = 1;
     */
    fileId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string mime = 3;
     */
    mime: string;
    /**
     * @generated from field: int64 size = 4;
     */
    size: bigint;
    /**
     * @generated from field: string thumbnail_url = 5;
     */
    thumbnailUrl: string;
};
/**
 * Describes the message tank.blocks.v1.FilePreview.
 * Use `create(FilePreviewSchema)` to create a new message.
 */
export declare const FilePreviewSchema: GenMessage<FilePreview>;
/**
 * @generated from message tank.blocks.v1.StatusCard
 */
export type StatusCard = Message<"tank.blocks.v1.StatusCard"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
    /**
     * @generated from field: string state = 2;
     */
    state: string;
    /**
     * @generated from field: string detail = 3;
     */
    detail: string;
    /**
     * @generated from field: string branch = 4;
     */
    branch: string;
    /**
     * @generated from field: double cost_usd = 5;
     */
    costUsd: number;
    /**
     * @generated from field: google.protobuf.Timestamp started_at = 6;
     */
    startedAt?: Timestamp;
    /**
     * @generated from field: string run_panel_url = 7;
     */
    runPanelUrl: string;
};
/**
 * Describes the message tank.blocks.v1.StatusCard.
 * Use `create(StatusCardSchema)` to create a new message.
 */
export declare const StatusCardSchema: GenMessage<StatusCard>;
/**
 * Posted by a client when a user interacts with a block; delivered to the
 * owning app/agent as an event.
 *
 * @generated from message tank.blocks.v1.BlockAction
 */
export type BlockAction = Message<"tank.blocks.v1.BlockAction"> & {
    /**
     * @generated from field: string message_id = 1;
     */
    messageId: string;
    /**
     * @generated from field: string block_id = 2;
     */
    blockId: string;
    /**
     * @generated from field: string action_id = 3;
     */
    actionId: string;
    /**
     * @generated from field: string value = 4;
     */
    value: string;
    /**
     * @generated from field: string user_id = 5;
     */
    userId: string;
    /**
     * @generated from field: google.protobuf.Timestamp at = 6;
     */
    at?: Timestamp;
};
/**
 * Describes the message tank.blocks.v1.BlockAction.
 * Use `create(BlockActionSchema)` to create a new message.
 */
export declare const BlockActionSchema: GenMessage<BlockAction>;
/**
 * @generated from enum tank.blocks.v1.ButtonStyle
 */
export declare enum ButtonStyle {
    /**
     * @generated from enum value: BUTTON_STYLE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: BUTTON_STYLE_PRIMARY = 1;
     */
    PRIMARY = 1,
    /**
     * @generated from enum value: BUTTON_STYLE_DANGER = 2;
     */
    DANGER = 2
}
/**
 * Describes the enum tank.blocks.v1.ButtonStyle.
 */
export declare const ButtonStyleSchema: GenEnum<ButtonStyle>;
/**
 * @generated from enum tank.blocks.v1.StepStatus
 */
export declare enum StepStatus {
    /**
     * @generated from enum value: STEP_STATUS_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: STEP_STATUS_PENDING = 1;
     */
    PENDING = 1,
    /**
     * @generated from enum value: STEP_STATUS_RUNNING = 2;
     */
    RUNNING = 2,
    /**
     * @generated from enum value: STEP_STATUS_DONE = 3;
     */
    DONE = 3,
    /**
     * @generated from enum value: STEP_STATUS_FAILED = 4;
     */
    FAILED = 4,
    /**
     * @generated from enum value: STEP_STATUS_SKIPPED = 5;
     */
    SKIPPED = 5
}
/**
 * Describes the enum tank.blocks.v1.StepStatus.
 */
export declare const StepStatusSchema: GenEnum<StepStatus>;
/**
 * @generated from enum tank.blocks.v1.CheckState
 */
export declare enum CheckState {
    /**
     * @generated from enum value: CHECK_STATE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: CHECK_STATE_QUEUED = 1;
     */
    QUEUED = 1,
    /**
     * @generated from enum value: CHECK_STATE_RUNNING = 2;
     */
    RUNNING = 2,
    /**
     * @generated from enum value: CHECK_STATE_SUCCESS = 3;
     */
    SUCCESS = 3,
    /**
     * @generated from enum value: CHECK_STATE_FAILURE = 4;
     */
    FAILURE = 4,
    /**
     * @generated from enum value: CHECK_STATE_CANCELLED = 5;
     */
    CANCELLED = 5
}
/**
 * Describes the enum tank.blocks.v1.CheckState.
 */
export declare const CheckStateSchema: GenEnum<CheckState>;
/**
 * @generated from enum tank.blocks.v1.GateKind
 */
export declare enum GateKind {
    /**
     * @generated from enum value: GATE_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: GATE_KIND_PLAN = 1;
     */
    PLAN = 1,
    /**
     * @generated from enum value: GATE_KIND_SCOPE_CHANGE = 2;
     */
    SCOPE_CHANGE = 2,
    /**
     * @generated from enum value: GATE_KIND_MERGE = 3;
     */
    MERGE = 3,
    /**
     * @generated from enum value: GATE_KIND_DEPLOY = 4;
     */
    DEPLOY = 4,
    /**
     * @generated from enum value: GATE_KIND_DESTRUCTIVE_TOOL = 5;
     */
    DESTRUCTIVE_TOOL = 5,
    /**
     * @generated from enum value: GATE_KIND_BUDGET_INCREASE = 6;
     */
    BUDGET_INCREASE = 6
}
/**
 * Describes the enum tank.blocks.v1.GateKind.
 */
export declare const GateKindSchema: GenEnum<GateKind>;
