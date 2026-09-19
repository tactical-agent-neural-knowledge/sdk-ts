import { create } from "@bufbuild/protobuf";
import { timestampFromMs } from "@bufbuild/protobuf/wkt";
import {
  type Block,
  BlockSchema,
  type Blocks,
  BlocksSchema,
  type Button,
  ButtonStyle,
  type Check,
  CheckState,
  type Confirm,
  type DiffFile,
  type Field,
  GateKind,
  type PlanStep,
  StepStatus,
  type ToolLogEntry,
} from "../contracts/tank/blocks/v1/blocks_pb.js";
import type { RichText } from "../contracts/tank/richtext/v1/richtext_pb.js";
import { type RichTextInput, richText } from "./richtext.js";

type Kind = Block["kind"];

function block(kind: Kind, blockId = ""): Block {
  return create(BlockSchema, { blockId, kind });
}

/** Wrap blocks into a `Blocks` message (what `Message.blocks` holds). */
export function blocks(...items: Array<Block | Block[]>): Blocks {
  return create(BlocksSchema, { blocks: items.flat() });
}

export function header(text: string, blockId?: string): Block {
  return block({ case: "header", value: { $typeName: "tank.blocks.v1.Header", text } }, blockId);
}

export interface SectionInput {
  text?: RichTextInput;
  fields?: Array<Field | { label: string; value: string }>;
  accessory?: Button;
  blockId?: string;
}

export function field(label: string, value: string): Field {
  return { $typeName: "tank.blocks.v1.Field", label, value };
}

export function section(input: SectionInput | string): Block {
  const i: SectionInput = typeof input === "string" ? { text: input } : input;
  return block(
    {
      case: "section",
      value: {
        $typeName: "tank.blocks.v1.Section",
        text: i.text === undefined ? undefined : richText(i.text),
        fields: (i.fields ?? []).map((f) => field(f.label, f.value)),
        accessory: i.accessory,
      },
    },
    i.blockId,
  );
}

export function context(elements: RichTextInput[], blockId?: string): Block {
  const els: RichText[] = elements.map(richText);
  return block({ case: "context", value: { $typeName: "tank.blocks.v1.Context", elements: els } }, blockId);
}

export function divider(blockId?: string): Block {
  return block({ case: "divider", value: { $typeName: "tank.blocks.v1.Divider" } }, blockId);
}

export interface ButtonInput {
  actionId?: string;
  text: string;
  value?: string;
  style?: "primary" | "danger" | ButtonStyle;
  url?: string;
  confirm?: { title: string; text: string; confirm?: string; deny?: string };
}

export function button(input: ButtonInput): Button {
  const style =
    input.style === "primary"
      ? ButtonStyle.PRIMARY
      : input.style === "danger"
        ? ButtonStyle.DANGER
        : (input.style ?? ButtonStyle.UNSPECIFIED);
  const confirm: Confirm | undefined = input.confirm
    ? {
        $typeName: "tank.blocks.v1.Confirm",
        title: input.confirm.title,
        text: input.confirm.text,
        confirm: input.confirm.confirm ?? "Confirm",
        deny: input.confirm.deny ?? "Cancel",
      }
    : undefined;
  return {
    $typeName: "tank.blocks.v1.Button",
    actionId: input.actionId ?? "",
    text: input.text,
    value: input.value ?? "",
    style,
    url: input.url ?? "",
    confirm,
  };
}

export function actions(buttons: Array<Button | ButtonInput>, blockId?: string): Block {
  const bs = buttons.map((b) => ("$typeName" in b ? b : button(b)));
  return block({ case: "actions", value: { $typeName: "tank.blocks.v1.Actions", buttons: bs } }, blockId);
}

export interface PlanStepInput {
  id: string;
  title: string;
  status?: StepStatus | "pending" | "running" | "done" | "failed" | "skipped";
  files?: string[];
}

const STEP: Record<string, StepStatus> = {
  pending: StepStatus.PENDING,
  running: StepStatus.RUNNING,
  done: StepStatus.DONE,
  failed: StepStatus.FAILED,
  skipped: StepStatus.SKIPPED,
};

export function planStep(input: PlanStepInput): PlanStep {
  const status =
    typeof input.status === "string"
      ? (STEP[input.status] ?? StepStatus.PENDING)
      : (input.status ?? StepStatus.PENDING);
  return {
    $typeName: "tank.blocks.v1.PlanStep",
    id: input.id,
    title: input.title,
    status,
    files: input.files ?? [],
  };
}

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

export function planCard(input: PlanCardInput): Block {
  return block(
    {
      case: "planCard",
      value: {
        $typeName: "tank.blocks.v1.PlanCard",
        summary: input.summary,
        steps: (input.steps ?? []).map((s) => ("$typeName" in s ? s : planStep(s))),
        risks: input.risks ?? [],
        questions: input.questions ?? [],
        approverIds: input.approverIds ?? [],
        planHash: input.planHash ?? "",
        version: input.version ?? 1,
      },
    },
    input.blockId,
  );
}

export interface DiffFileInput {
  path: string;
  additions?: number;
  deletions?: number;
  hunkPreview?: string;
}

export function diffFile(input: DiffFileInput): DiffFile {
  return {
    $typeName: "tank.blocks.v1.DiffFile",
    path: input.path,
    additions: input.additions ?? 0,
    deletions: input.deletions ?? 0,
    hunkPreview: input.hunkPreview ?? "",
  };
}

export interface DiffPreviewInput {
  commitSha: string;
  compareUrl?: string;
  files: Array<DiffFile | DiffFileInput>;
  blockId?: string;
}

export function diffPreview(input: DiffPreviewInput): Block {
  const files = input.files.map((f) => ("$typeName" in f ? f : diffFile(f)));
  return block(
    {
      case: "diffPreview",
      value: {
        $typeName: "tank.blocks.v1.DiffPreview",
        commitSha: input.commitSha,
        compareUrl: input.compareUrl ?? "",
        files,
        totalAdditions: files.reduce((n, f) => n + f.additions, 0),
        totalDeletions: files.reduce((n, f) => n + f.deletions, 0),
      },
    },
    input.blockId,
  );
}

export interface CheckInput {
  name: string;
  state?: CheckState | "queued" | "running" | "success" | "failure" | "cancelled";
  url?: string;
  failureExcerpt?: string;
}

const CHECK: Record<string, CheckState> = {
  queued: CheckState.QUEUED,
  running: CheckState.RUNNING,
  success: CheckState.SUCCESS,
  failure: CheckState.FAILURE,
  cancelled: CheckState.CANCELLED,
};

export function check(input: CheckInput): Check {
  const state =
    typeof input.state === "string"
      ? (CHECK[input.state] ?? CheckState.QUEUED)
      : (input.state ?? CheckState.QUEUED);
  return {
    $typeName: "tank.blocks.v1.Check",
    name: input.name,
    state,
    url: input.url ?? "",
    failureExcerpt: input.failureExcerpt ?? "",
  };
}

export interface CiStatusInput {
  headSha: string;
  checks: Array<Check | CheckInput>;
  prUrl?: string;
  prNumber?: number;
  blockId?: string;
}

export function ciStatus(input: CiStatusInput): Block {
  return block(
    {
      case: "ciStatus",
      value: {
        $typeName: "tank.blocks.v1.CiStatus",
        headSha: input.headSha,
        checks: input.checks.map((c) => ("$typeName" in c ? c : check(c))),
        prUrl: input.prUrl ?? "",
        prNumber: input.prNumber ?? 0,
      },
    },
    input.blockId,
  );
}

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

const GATE: Record<string, GateKind> = {
  plan: GateKind.PLAN,
  scope_change: GateKind.SCOPE_CHANGE,
  merge: GateKind.MERGE,
  deploy: GateKind.DEPLOY,
  destructive_tool: GateKind.DESTRUCTIVE_TOOL,
  budget_increase: GateKind.BUDGET_INCREASE,
};

export function approvalPrompt(input: ApprovalPromptInput): Block {
  const kind =
    typeof input.kind === "string"
      ? (GATE[input.kind] ?? GateKind.UNSPECIFIED)
      : (input.kind ?? GateKind.UNSPECIFIED);
  return block(
    {
      case: "approvalPrompt",
      value: {
        $typeName: "tank.blocks.v1.ApprovalPrompt",
        gateId: input.gateId,
        kind,
        subject: input.subject,
        approverIds: input.approverIds ?? [],
        minApprovals: input.minApprovals ?? 1,
        expiresAt: input.expiresAt === undefined ? undefined : timestampFromMs(input.expiresAt),
        decided: input.decided ?? false,
        decision: input.decision ?? "",
      },
    },
    input.blockId,
  );
}

export interface ToolLogEntryInput {
  /** ms since epoch */
  at: number;
  tool: string;
  summary: string;
  ok?: boolean;
}

export function toolLogEntry(input: ToolLogEntryInput): ToolLogEntry {
  return {
    $typeName: "tank.blocks.v1.ToolLogEntry",
    at: timestampFromMs(input.at),
    tool: input.tool,
    summary: input.summary,
    ok: input.ok ?? true,
  };
}

export interface ToolLogInput {
  phase: string;
  toolCalls?: number;
  filesEdited?: number;
  recent?: Array<ToolLogEntry | ToolLogEntryInput>;
  runPanelUrl?: string;
  blockId?: string;
}

export function toolLog(input: ToolLogInput): Block {
  return block(
    {
      case: "toolLog",
      value: {
        $typeName: "tank.blocks.v1.ToolLog",
        phase: input.phase,
        toolCalls: input.toolCalls ?? 0,
        filesEdited: input.filesEdited ?? 0,
        recent: (input.recent ?? []).map((e) => ("$typeName" in e ? e : toolLogEntry(e))),
        runPanelUrl: input.runPanelUrl ?? "",
      },
    },
    input.blockId,
  );
}

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

export function statusCard(input: StatusCardInput): Block {
  return block(
    {
      case: "statusCard",
      value: {
        $typeName: "tank.blocks.v1.StatusCard",
        runId: input.runId,
        state: input.state,
        detail: input.detail ?? "",
        branch: input.branch ?? "",
        costUsd: input.costUsd ?? 0,
        startedAt: input.startedAt === undefined ? undefined : timestampFromMs(input.startedAt),
        runPanelUrl: input.runPanelUrl ?? "",
      },
    },
    input.blockId,
  );
}

export interface FilePreviewInput {
  fileId: string;
  name: string;
  mime?: string;
  size?: number | bigint;
  thumbnailUrl?: string;
  blockId?: string;
}

export function filePreview(input: FilePreviewInput): Block {
  return block(
    {
      case: "filePreview",
      value: {
        $typeName: "tank.blocks.v1.FilePreview",
        fileId: input.fileId,
        name: input.name,
        mime: input.mime ?? "",
        size: BigInt(input.size ?? 0),
        thumbnailUrl: input.thumbnailUrl ?? "",
      },
    },
    input.blockId,
  );
}
