import { create } from "@bufbuild/protobuf";
import { timestampFromMs } from "@bufbuild/protobuf/wkt";
import { BlockSchema, BlocksSchema, ButtonStyle, CheckState, GateKind, StepStatus, } from "../contracts/tank/blocks/v1/blocks_pb.js";
import { richText } from "./richtext.js";
function block(kind, blockId = "") {
    return create(BlockSchema, { blockId, kind });
}
/** Wrap blocks into a `Blocks` message (what `Message.blocks` holds). */
export function blocks(...items) {
    return create(BlocksSchema, { blocks: items.flat() });
}
export function header(text, blockId) {
    return block({ case: "header", value: { $typeName: "tank.blocks.v1.Header", text } }, blockId);
}
export function field(label, value) {
    return { $typeName: "tank.blocks.v1.Field", label, value };
}
export function section(input) {
    const i = typeof input === "string" ? { text: input } : input;
    return block({
        case: "section",
        value: {
            $typeName: "tank.blocks.v1.Section",
            text: i.text === undefined ? undefined : richText(i.text),
            fields: (i.fields ?? []).map((f) => field(f.label, f.value)),
            accessory: i.accessory,
        },
    }, i.blockId);
}
export function context(elements, blockId) {
    const els = elements.map(richText);
    return block({ case: "context", value: { $typeName: "tank.blocks.v1.Context", elements: els } }, blockId);
}
export function divider(blockId) {
    return block({ case: "divider", value: { $typeName: "tank.blocks.v1.Divider" } }, blockId);
}
export function button(input) {
    const style = input.style === "primary"
        ? ButtonStyle.PRIMARY
        : input.style === "danger"
            ? ButtonStyle.DANGER
            : (input.style ?? ButtonStyle.UNSPECIFIED);
    const confirm = input.confirm
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
export function actions(buttons, blockId) {
    const bs = buttons.map((b) => ("$typeName" in b ? b : button(b)));
    return block({ case: "actions", value: { $typeName: "tank.blocks.v1.Actions", buttons: bs } }, blockId);
}
const STEP = {
    pending: StepStatus.PENDING,
    running: StepStatus.RUNNING,
    done: StepStatus.DONE,
    failed: StepStatus.FAILED,
    skipped: StepStatus.SKIPPED,
};
export function planStep(input) {
    const status = typeof input.status === "string"
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
export function planCard(input) {
    return block({
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
    }, input.blockId);
}
export function diffFile(input) {
    return {
        $typeName: "tank.blocks.v1.DiffFile",
        path: input.path,
        additions: input.additions ?? 0,
        deletions: input.deletions ?? 0,
        hunkPreview: input.hunkPreview ?? "",
    };
}
export function diffPreview(input) {
    const files = input.files.map((f) => ("$typeName" in f ? f : diffFile(f)));
    return block({
        case: "diffPreview",
        value: {
            $typeName: "tank.blocks.v1.DiffPreview",
            commitSha: input.commitSha,
            compareUrl: input.compareUrl ?? "",
            files,
            totalAdditions: files.reduce((n, f) => n + f.additions, 0),
            totalDeletions: files.reduce((n, f) => n + f.deletions, 0),
        },
    }, input.blockId);
}
const CHECK = {
    queued: CheckState.QUEUED,
    running: CheckState.RUNNING,
    success: CheckState.SUCCESS,
    failure: CheckState.FAILURE,
    cancelled: CheckState.CANCELLED,
};
export function check(input) {
    const state = typeof input.state === "string"
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
export function ciStatus(input) {
    return block({
        case: "ciStatus",
        value: {
            $typeName: "tank.blocks.v1.CiStatus",
            headSha: input.headSha,
            checks: input.checks.map((c) => ("$typeName" in c ? c : check(c))),
            prUrl: input.prUrl ?? "",
            prNumber: input.prNumber ?? 0,
        },
    }, input.blockId);
}
const GATE = {
    plan: GateKind.PLAN,
    scope_change: GateKind.SCOPE_CHANGE,
    merge: GateKind.MERGE,
    deploy: GateKind.DEPLOY,
    destructive_tool: GateKind.DESTRUCTIVE_TOOL,
    budget_increase: GateKind.BUDGET_INCREASE,
};
export function approvalPrompt(input) {
    const kind = typeof input.kind === "string"
        ? (GATE[input.kind] ?? GateKind.UNSPECIFIED)
        : (input.kind ?? GateKind.UNSPECIFIED);
    return block({
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
    }, input.blockId);
}
export function toolLogEntry(input) {
    return {
        $typeName: "tank.blocks.v1.ToolLogEntry",
        at: timestampFromMs(input.at),
        tool: input.tool,
        summary: input.summary,
        ok: input.ok ?? true,
    };
}
export function toolLog(input) {
    return block({
        case: "toolLog",
        value: {
            $typeName: "tank.blocks.v1.ToolLog",
            phase: input.phase,
            toolCalls: input.toolCalls ?? 0,
            filesEdited: input.filesEdited ?? 0,
            recent: (input.recent ?? []).map((e) => ("$typeName" in e ? e : toolLogEntry(e))),
            runPanelUrl: input.runPanelUrl ?? "",
        },
    }, input.blockId);
}
export function statusCard(input) {
    return block({
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
    }, input.blockId);
}
export function filePreview(input) {
    return block({
        case: "filePreview",
        value: {
            $typeName: "tank.blocks.v1.FilePreview",
            fileId: input.fileId,
            name: input.name,
            mime: input.mime ?? "",
            size: BigInt(input.size ?? 0),
            thumbnailUrl: input.thumbnailUrl ?? "",
        },
    }, input.blockId);
}
