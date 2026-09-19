import { create } from "@bufbuild/protobuf";
import { BlocksSchema } from "../contracts/tank/blocks/v1/blocks_pb.js";
/** Hard caps applied by `normalizeBlocks`; mirrors what the API enforces. */
export const LIMITS = {
    blocks: 50,
    headerText: 150,
    fields: 10,
    fieldLabel: 75,
    fieldValue: 2000,
    textElement: 3000,
    contextElements: 10,
    buttons: 10,
    buttonText: 75,
    buttonValue: 2000,
    url: 3000,
    planSummary: 3000,
    planSteps: 50,
    planStepTitle: 200,
    planStepFiles: 20,
    planList: 20,
    planListItem: 500,
    approverIds: 50,
    diffFiles: 100,
    diffPath: 500,
    hunkPreview: 4000,
    checks: 50,
    checkName: 100,
    failureExcerpt: 2000,
    approvalSubject: 500,
    toolLogRecent: 20,
    toolName: 100,
    toolSummary: 500,
    phase: 100,
    fileName: 255,
    statusDetail: 1000,
    statusState: 50,
    branch: 255,
    shortString: 200,
};
const ELLIPSIS = "…";
export function truncate(s, max) {
    if (s.length <= max)
        return s;
    return s.slice(0, Math.max(0, max - 1)) + ELLIPSIS;
}
function cap(arr, max) {
    return arr.length > max ? arr.slice(0, max) : arr;
}
function normalizeElement(e) {
    const k = e.kind;
    switch (k.case) {
        case "text":
            return {
                ...e,
                kind: { case: "text", value: { ...k.value, text: truncate(k.value.text, LIMITS.textElement) } },
            };
        case "link":
            return {
                ...e,
                kind: {
                    case: "link",
                    value: {
                        ...k.value,
                        url: truncate(k.value.url, LIMITS.url),
                        text: truncate(k.value.text, LIMITS.textElement),
                    },
                },
            };
        default:
            return e;
    }
}
export function normalizeRichText(r) {
    if (!r)
        return r;
    return {
        ...r,
        blocks: r.blocks.map((b) => {
            const k = b.kind;
            switch (k.case) {
                case "section":
                case "quote":
                    return {
                        ...b,
                        kind: { case: k.case, value: { ...k.value, elements: k.value.elements.map(normalizeElement) } },
                    };
                case "code":
                    return {
                        ...b,
                        kind: { case: "code", value: { ...k.value, text: truncate(k.value.text, LIMITS.hunkPreview) } },
                    };
                case "list":
                    return {
                        ...b,
                        kind: {
                            case: "list",
                            value: {
                                ...k.value,
                                items: cap(k.value.items, LIMITS.planList).map((it) => ({
                                    ...it,
                                    elements: it.elements.map(normalizeElement),
                                })),
                            },
                        },
                    };
                default:
                    return b;
            }
        }),
    };
}
function normalizeKind(kind) {
    switch (kind.case) {
        case "header":
            return { case: "header", value: { ...kind.value, text: truncate(kind.value.text, LIMITS.headerText) } };
        case "section":
            return {
                case: "section",
                value: {
                    ...kind.value,
                    text: normalizeRichText(kind.value.text),
                    fields: cap(kind.value.fields, LIMITS.fields).map((f) => ({
                        ...f,
                        label: truncate(f.label, LIMITS.fieldLabel),
                        value: truncate(f.value, LIMITS.fieldValue),
                    })),
                    accessory: kind.value.accessory ? normalizeButton(kind.value.accessory) : undefined,
                },
            };
        case "context":
            return {
                case: "context",
                value: {
                    ...kind.value,
                    elements: cap(kind.value.elements, LIMITS.contextElements).map((e) => normalizeRichText(e) ?? e),
                },
            };
        case "actions":
            return {
                case: "actions",
                value: { ...kind.value, buttons: cap(kind.value.buttons, LIMITS.buttons).map(normalizeButton) },
            };
        case "planCard":
            return {
                case: "planCard",
                value: {
                    ...kind.value,
                    summary: truncate(kind.value.summary, LIMITS.planSummary),
                    steps: cap(kind.value.steps, LIMITS.planSteps).map((s) => ({
                        ...s,
                        title: truncate(s.title, LIMITS.planStepTitle),
                        files: cap(s.files, LIMITS.planStepFiles).map((f) => truncate(f, LIMITS.diffPath)),
                    })),
                    risks: cap(kind.value.risks, LIMITS.planList).map((r) => truncate(r, LIMITS.planListItem)),
                    questions: cap(kind.value.questions, LIMITS.planList).map((q) => truncate(q, LIMITS.planListItem)),
                    approverIds: cap(kind.value.approverIds, LIMITS.approverIds),
                },
            };
        case "diffPreview":
            return {
                case: "diffPreview",
                value: {
                    ...kind.value,
                    compareUrl: truncate(kind.value.compareUrl, LIMITS.url),
                    files: cap(kind.value.files, LIMITS.diffFiles).map((f) => ({
                        ...f,
                        path: truncate(f.path, LIMITS.diffPath),
                        hunkPreview: truncate(f.hunkPreview, LIMITS.hunkPreview),
                    })),
                },
            };
        case "ciStatus":
            return {
                case: "ciStatus",
                value: {
                    ...kind.value,
                    prUrl: truncate(kind.value.prUrl, LIMITS.url),
                    checks: cap(kind.value.checks, LIMITS.checks).map((c) => ({
                        ...c,
                        name: truncate(c.name, LIMITS.checkName),
                        url: truncate(c.url, LIMITS.url),
                        failureExcerpt: truncate(c.failureExcerpt, LIMITS.failureExcerpt),
                    })),
                },
            };
        case "approvalPrompt":
            return {
                case: "approvalPrompt",
                value: {
                    ...kind.value,
                    subject: truncate(kind.value.subject, LIMITS.approvalSubject),
                    approverIds: cap(kind.value.approverIds, LIMITS.approverIds),
                    minApprovals: Math.max(1, kind.value.minApprovals),
                },
            };
        case "toolLog":
            return {
                case: "toolLog",
                value: {
                    ...kind.value,
                    phase: truncate(kind.value.phase, LIMITS.phase),
                    runPanelUrl: truncate(kind.value.runPanelUrl, LIMITS.url),
                    // keep the tail: the newest entries matter
                    recent: kind.value.recent.slice(-LIMITS.toolLogRecent).map((e) => ({
                        ...e,
                        tool: truncate(e.tool, LIMITS.toolName),
                        summary: truncate(e.summary, LIMITS.toolSummary),
                    })),
                },
            };
        case "filePreview":
            return {
                case: "filePreview",
                value: {
                    ...kind.value,
                    name: truncate(kind.value.name, LIMITS.fileName),
                    mime: truncate(kind.value.mime, LIMITS.shortString),
                    thumbnailUrl: truncate(kind.value.thumbnailUrl, LIMITS.url),
                },
            };
        case "statusCard":
            return {
                case: "statusCard",
                value: {
                    ...kind.value,
                    state: truncate(kind.value.state, LIMITS.statusState),
                    detail: truncate(kind.value.detail, LIMITS.statusDetail),
                    branch: truncate(kind.value.branch, LIMITS.branch),
                    runPanelUrl: truncate(kind.value.runPanelUrl, LIMITS.url),
                },
            };
        default:
            return kind;
    }
}
function normalizeButton(b) {
    return {
        ...b,
        text: truncate(b.text, LIMITS.buttonText),
        value: truncate(b.value, LIMITS.buttonValue),
        url: truncate(b.url, LIMITS.url),
        actionId: truncate(b.actionId, LIMITS.shortString),
    };
}
/**
 * Makes a block list safe to post and render: fills missing `block_id`s
 * (`b1`, `b2`, … by position; duplicates get a suffix), truncates long
 * strings (with an ellipsis), caps every repeated field, and drops blocks
 * without a kind. Idempotent: normalizing twice yields the same value.
 */
export function normalizeBlocks(input) {
    const list = Array.isArray(input) ? input : input.blocks;
    const seen = new Set();
    const out = [];
    const capped = cap(list, LIMITS.blocks);
    for (let i = 0; i < capped.length; i++) {
        const b = capped[i];
        if (b.kind.case === undefined)
            continue;
        let blockId = b.blockId.trim() || `b${i + 1}`;
        if (seen.has(blockId)) {
            let n = 2;
            while (seen.has(`${blockId}_${n}`))
                n++;
            blockId = `${blockId}_${n}`;
        }
        seen.add(blockId);
        out.push({ ...b, blockId, kind: normalizeKind(b.kind) });
    }
    return create(BlocksSchema, { blocks: out });
}
/** Structural problems a normalize cannot fix. Empty means postable. */
export function validateBlocks(input) {
    const list = Array.isArray(input) ? input : input.blocks;
    const issues = [];
    const ids = new Map();
    if (list.length > LIMITS.blocks)
        issues.push({ path: "blocks", message: `more than ${LIMITS.blocks} blocks` });
    list.forEach((b, i) => {
        const p = `blocks[${i}]`;
        if (b.blockId) {
            const prev = ids.get(b.blockId);
            if (prev !== undefined)
                issues.push({ path: `${p}.block_id`, message: `duplicate of blocks[${prev}]` });
            ids.set(b.blockId, i);
        }
        const k = b.kind;
        switch (k.case) {
            case undefined:
                issues.push({ path: `${p}.kind`, message: "block has no kind" });
                break;
            case "header":
                if (!k.value.text.trim())
                    issues.push({ path: `${p}.header.text`, message: "empty" });
                break;
            case "section":
                if (!k.value.text && k.value.fields.length === 0)
                    issues.push({ path: `${p}.section`, message: "needs text or fields" });
                if (k.value.accessory)
                    checkButton(k.value.accessory, `${p}.section.accessory`, issues);
                break;
            case "context":
                if (k.value.elements.length === 0)
                    issues.push({ path: `${p}.context.elements`, message: "empty" });
                break;
            case "actions":
                if (k.value.buttons.length === 0)
                    issues.push({ path: `${p}.actions.buttons`, message: "empty" });
                k.value.buttons.forEach((btn, j) => {
                    checkButton(btn, `${p}.actions.buttons[${j}]`, issues);
                });
                break;
            case "planCard":
                if (!k.value.summary.trim())
                    issues.push({ path: `${p}.plan_card.summary`, message: "empty" });
                k.value.steps.forEach((s, j) => {
                    if (!s.id)
                        issues.push({ path: `${p}.plan_card.steps[${j}].id`, message: "empty" });
                });
                break;
            case "diffPreview":
                if (!k.value.commitSha)
                    issues.push({ path: `${p}.diff_preview.commit_sha`, message: "empty" });
                break;
            case "ciStatus":
                if (!k.value.headSha)
                    issues.push({ path: `${p}.ci_status.head_sha`, message: "empty" });
                break;
            case "approvalPrompt":
                if (!k.value.gateId)
                    issues.push({ path: `${p}.approval_prompt.gate_id`, message: "empty" });
                if (!k.value.subject.trim())
                    issues.push({ path: `${p}.approval_prompt.subject`, message: "empty" });
                break;
            case "toolLog":
                if (!k.value.phase.trim())
                    issues.push({ path: `${p}.tool_log.phase`, message: "empty" });
                break;
            case "filePreview":
                if (!k.value.fileId)
                    issues.push({ path: `${p}.file_preview.file_id`, message: "empty" });
                break;
            case "statusCard":
                if (!k.value.runId)
                    issues.push({ path: `${p}.status_card.run_id`, message: "empty" });
                break;
            default:
                break;
        }
    });
    return issues;
}
function checkButton(b, path, issues) {
    if (!b.text.trim())
        issues.push({ path: `${path}.text`, message: "empty" });
    if (!b.actionId && !b.url)
        issues.push({ path: `${path}.action_id`, message: "needs action_id or url" });
}
