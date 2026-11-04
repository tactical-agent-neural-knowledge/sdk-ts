import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { MARKS, planMark, stepMark } from "../blocks/marks.js";
import { planGlance, planMarkdown } from "../blocks/plan.js";
import { ACTION_REVEAL_KEY, REVEAL_COPIED, REVEAL_GONE } from "../blocks/reveal.js";
import { ButtonStyle, CheckState, GateKind, StepStatus } from "../contracts/tank/blocks/v1/blocks_pb.js";
import { typography } from "../design/tokens.js";
import { Mark } from "./Mark.js";
import { RichTextView } from "./RichTextView.js";
// Branch names, run ids and diagnostic codes are single unbroken tokens that
// are wider than a phone. Without this they push the card sideways and the
// message list scrolls horizontally.
const mono = {
    fontFamily: typography.fontCode,
    fontSize: "0.8125rem",
    overflowWrap: "anywhere",
    minWidth: 0,
};
/** Approver ids as names where the host can name them; an id nobody can name stays an id. */
function names(ids, ctx) {
    return ids.map((id) => ctx.resolveUser?.(id) || id).join(", ");
}
function tsMs(t) {
    return t ? Number(t.seconds) * 1000 + Math.floor(t.nanos / 1e6) : undefined;
}
/** Accent stripe for agent cards: purple = agent execution, cyan = AI/context, amber = needs a human. */
export function Card({ accent, children, label, icon, }) {
    return (_jsxs(Box, { "data-accent": accent, sx: {
            borderLeft: 3,
            borderColor: accent === "none" ? "divider" : `tank.${accent}`,
            bgcolor: "background.paper",
            border: 1,
            borderLeftWidth: 3,
            borderLeftColor: accent === "none" ? "divider" : `tank.${accent}`,
            borderRadius: 1,
            p: 1.5,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            // Nothing inside a card may widen it: a long token wraps instead.
            minWidth: 0,
            maxWidth: "100%",
            overflowWrap: "anywhere",
        }, children: [label ? (_jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.75 }, children: [icon, _jsx(Typography, { variant: "overline", sx: { color: accent === "none" ? "text.secondary" : `tank.${accent}`, lineHeight: 1.5 }, children: label })] })) : null, children] }));
}
// ------------------------------------------------------------------ simple blocks
export function HeaderBlock({ value }) {
    return (_jsx(Typography, { variant: "h6", component: "h3", sx: { m: 0 }, children: value.text }));
}
export function SectionBlock({ value, ctx }) {
    return (_jsxs(Stack, { direction: "row", spacing: 2, alignItems: "flex-start", children: [_jsxs(Box, { sx: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }, children: [_jsx(RichTextView, { richText: value.text, resolveUser: ctx.resolveUser, resolveChannel: ctx.resolveChannel }), value.fields.length > 0 ? (_jsx(Box, { component: "dl", sx: {
                            m: 0,
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                            gap: 1,
                        }, children: value.fields.map((f) => (_jsxs(Box, { children: [_jsx(Typography, { component: "dt", variant: "caption", color: "text.secondary", children: f.label }), _jsx(Typography, { component: "dd", variant: "body2", sx: { m: 0 }, children: f.value })] }, f.label))) })) : null] }), value.accessory ? _jsx(ActionButton, { button: value.accessory, ctx: ctx }) : null] }));
}
export function ContextBlock({ value, ctx }) {
    return (_jsx(Box, { sx: { color: "text.secondary", display: "flex", flexWrap: "wrap", gap: 1 }, children: value.elements.map((e, i) => (_jsx(RichTextView, { richText: e, variant: "caption", resolveUser: ctx.resolveUser, resolveChannel: ctx.resolveChannel }, i))) }));
}
export function DividerBlock() {
    return _jsx(Divider, {});
}
// ------------------------------------------------------------------ buttons
export function ActionButton({ button, ctx, size = "small", }) {
    const [confirming, setConfirming] = useState(false);
    if (button.actionId === ACTION_REVEAL_KEY)
        return _jsx(RevealKeyButton, { button: button, ctx: ctx, size: size });
    const color = button.style === ButtonStyle.DANGER
        ? "error"
        : button.style === ButtonStyle.PRIMARY
            ? "primary"
            : "inherit";
    const variant = button.style === ButtonStyle.UNSPECIFIED ? "outlined" : "contained";
    const fire = () => ctx.onAction?.({ blockId: ctx.blockId, actionId: button.actionId, value: button.value });
    if (button.url) {
        return (_jsx(Button, { size: size, variant: variant, color: color, href: button.url, target: "_blank", rel: "noopener noreferrer", "data-action-id": button.actionId, children: button.text }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(Button, { size: size, variant: variant, color: color, "data-action-id": button.actionId, onClick: () => (button.confirm ? setConfirming(true) : fire()), children: button.text }), button.confirm ? (_jsxs(Dialog, { open: confirming, onClose: () => setConfirming(false), children: [_jsx(DialogTitle, { children: button.confirm.title }), _jsx(DialogContent, { children: _jsx(DialogContentText, { children: button.confirm.text }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setConfirming(false), children: button.confirm.deny || "Cancel" }), _jsx(Button, { color: color === "inherit" ? "primary" : color, variant: "contained", onClick: () => {
                                    setConfirming(false);
                                    fire();
                                }, children: button.confirm.confirm || "Confirm" })] })] })) : null] }));
}
/**
 * Copies a key a run made, through the host: the key goes from the server to the clipboard and
 * is never posted as an action. A refusal (somebody else, a second press, expired) is one line.
 */
function RevealKeyButton({ button, ctx, size, }) {
    const [busy, setBusy] = useState(false);
    const [copied, setCopied] = useState(false);
    const [gone, setGone] = useState(false);
    const press = async () => {
        setBusy(true);
        let ok = false;
        try {
            ok = copied ? false : ((await ctx.revealKey?.(button.value)) ?? false);
        }
        catch {
            ok = false;
        }
        setBusy(false);
        if (ok)
            setCopied(true);
        else
            setGone(true);
    };
    return (_jsxs(Stack, { spacing: 0.5, alignItems: "flex-start", children: [_jsx(Button, { size: size, variant: "contained", color: "primary", "data-action-id": button.actionId, disabled: busy, onClick: () => void press(), children: copied ? REVEAL_COPIED : button.text }), gone ? (_jsx(Typography, { variant: "caption", color: "text.secondary", role: "status", "data-testid": "reveal-gone", children: REVEAL_GONE })) : null] }));
}
export function ActionsBlock({ value, ctx }) {
    return (_jsx(Stack, { direction: "row", spacing: 1, flexWrap: "wrap", useFlexGap: true, children: value.buttons.map((b, i) => (_jsx(ActionButton, { button: b, ctx: ctx }, b.actionId || b.url || i))) }));
}
// ------------------------------------------------------------------ agent cards
const STEP_GLYPH = {
    [StepStatus.UNSPECIFIED]: { glyph: "○", color: "text.disabled", label: "pending" },
    [StepStatus.PENDING]: { glyph: "○", color: "text.disabled", label: "pending" },
    [StepStatus.RUNNING]: { glyph: "◐", color: "tank.agent", label: "running" },
    [StepStatus.DONE]: { glyph: "●", color: "success.main", label: "done" },
    [StepStatus.FAILED]: { glyph: "✕", color: "error.main", label: "failed" },
    [StepStatus.SKIPPED]: { glyph: "–", color: "text.disabled", label: "skipped" },
};
export function PlanCardBlock({ value, ctx }) {
    // At a glance by default: an emoji and a line per step. Tapping the text shows the whole
    // plan and tapping it again goes back; no button (Robby, 2026-10-25). A plan with no steps
    // has nothing to glance at and is shown whole.
    const [detail, setDetail] = useState(false);
    if (value.steps.length > 0 && !detail) {
        const g = planGlance(value.steps);
        return (_jsxs(Card, { accent: "agent", label: `${g.done}/${g.total}`, icon: _jsx(Mark, { kind: planMark(value.steps), size: 16 }), children: [_jsx(Box, { component: "ol", role: "button", tabIndex: 0, "aria-expanded": false, "aria-label": "Show the whole plan", "data-testid": "plan-glance", onClick: () => setDetail(true), onKeyDown: (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setDetail(true);
                        }
                    }, sx: {
                        m: 0,
                        p: 0,
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        cursor: "pointer",
                    }, children: value.steps.map((s, i) => (_jsxs(Box, { component: "li", "data-step-status": (STEP_GLYPH[s.status] ?? STEP_GLYPH[StepStatus.PENDING]).label, sx: { display: "flex", gap: 1, alignItems: "baseline" }, children: [_jsx(Box, { component: "span", sx: { width: "1.4em", flexShrink: 0, alignSelf: "flex-start", pt: 0.25 }, children: _jsx(Mark, { kind: stepMark(s.status), title: MARKS[stepMark(s.status)].label }) }), _jsx(Typography, { variant: "body2", component: "span", sx: { minWidth: 0 }, children: s.title })] }, s.id || i))) }), _jsx(PlanFileRow, { value: value, ctx: ctx })] }));
    }
    return (_jsx(PlanCardDetail, { value: value, ctx: ctx, onToggle: value.steps.length > 0 ? () => setDetail(false) : undefined }));
}
function PlanCardDetail({ value, ctx, onToggle, }) {
    const done = value.steps.filter((s) => s.status === StepStatus.DONE).length;
    // Selecting text to copy a file path must not fold the plan away.
    const toggle = onToggle
        ? () => {
            if (typeof window !== "undefined" && window.getSelection?.()?.toString())
                return;
            onToggle();
        }
        : undefined;
    return (_jsxs(Card, { accent: "agent", label: `Plan · v${value.version}${value.planHash ? ` · ${value.planHash}` : ""}`, children: [_jsxs(Box, { role: toggle ? "button" : undefined, tabIndex: toggle ? 0 : undefined, "aria-expanded": toggle ? true : undefined, "data-testid": "plan-detail", onClick: toggle, onKeyDown: toggle
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggle();
                        }
                    }
                    : undefined, sx: { display: "flex", flexDirection: "column", gap: 1.5, cursor: toggle ? "pointer" : undefined }, children: [_jsx(Typography, { variant: "body1", children: value.summary }), value.steps.length > 0 ? (_jsxs(Box, { children: [_jsx(LinearProgress, { variant: "determinate", color: "secondary", value: (done / value.steps.length) * 100, sx: { mb: 1, height: 4, borderRadius: 2 }, "aria-label": `${done} of ${value.steps.length} steps done` }), _jsx(Box, { component: "ol", sx: { m: 0, p: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 0.5 }, children: value.steps.map((s) => {
                                    const g = STEP_GLYPH[s.status] ?? STEP_GLYPH[StepStatus.PENDING];
                                    return (_jsxs(Box, { component: "li", "data-step-status": g.label, sx: { display: "flex", gap: 1, alignItems: "baseline" }, children: [_jsx(Box, { component: "span", "aria-label": g.label, sx: { color: g.color, width: "1em", textAlign: "center", ...mono }, children: g.glyph }), _jsxs(Box, { sx: { minWidth: 0 }, children: [_jsx(Typography, { variant: "body2", component: "span", children: s.title }), s.files.length > 0 ? (_jsx(Typography, { variant: "caption", component: "div", color: "text.secondary", sx: mono, children: s.files.join("  ") })) : null] })] }, s.id));
                                }) })] })) : null, value.risks.length > 0 ? (_jsx(BulletList, { title: "Risks", items: value.risks, color: "tank.warningText" })) : null, value.questions.length > 0 ? (_jsx(BulletList, { title: "Questions", items: value.questions, color: "tank.primaryText" })) : null, value.guardrails.length > 0 ? _jsx(GuardrailChecks, { checks: value.guardrails }) : null, value.approverIds.length > 0 ? (_jsxs(Typography, { variant: "caption", color: "text.secondary", children: ["Approvers: ", names(value.approverIds, ctx)] })) : null] }), _jsx(PlanFileRow, { value: value, ctx: ctx })] }));
}
/**
 * Download and Add to Atlas under a plan (Robby, 2026-11-02): the plan as a Markdown file,
 * written by `planMarkdown` so both apps save and add the same document.
 */
function PlanFileRow({ value, ctx }) {
    const [adding, setAdding] = useState(false);
    const actions = ctx.planFile;
    if (!actions?.download && !actions?.addToAtlas)
        return null;
    const file = () => planMarkdown(value, ctx.resolveUser);
    return (_jsxs(Stack, { direction: "row", spacing: 1, sx: { flexWrap: "wrap", rowGap: 1 }, "data-testid": "plan-file", children: [actions.download ? (_jsx(Button, { size: "small", onClick: () => void actions.download?.(file()), "data-testid": "plan-download", children: "Download" })) : null, actions.addToAtlas ? (_jsx(Button, { size: "small", variant: "outlined", disabled: adding, onClick: async () => {
                    setAdding(true);
                    try {
                        await actions.addToAtlas?.(file());
                    }
                    finally {
                        setAdding(false);
                    }
                }, "data-testid": "plan-atlas", children: "Add to Atlas" })) : null] }));
}
/** How a guardrail's check reads on a card: the mark, the word, and the color it sits in. */
const GUARDRAIL_NA = { glyph: "–", label: "not applicable", color: "text.secondary" };
export const GUARDRAIL_STATE = {
    met: { glyph: "✓", label: "met", color: "tank.successText" },
    violated: { glyph: "✗", label: "conflict", color: "tank.errorText" },
    unsure: { glyph: "?", label: "unsure", color: "tank.warningText" },
    blocked: { glyph: "✗", label: "blocked", color: "tank.errorText" },
    not_applicable: GUARDRAIL_NA,
};
/** Whether a plan can be approved: not while a guardrail check is a conflict or a doubt. */
export function planConflicts(checks) {
    return checks.some((c) => c.state === "violated" || c.state === "unsure");
}
/**
 * The plan card's Guardrails section (phase 1): each guardrail the run carries, met or in
 * conflict with the quoted reason. A conflict is why the plan cannot be approved as it is.
 */
function GuardrailChecks({ checks }) {
    const conflict = planConflicts(checks);
    return (_jsxs(Box, { "data-testid": "plan-guardrails", children: [_jsx(Typography, { variant: "subtitle2", sx: { color: conflict ? "tank.errorText" : "tank.successText" }, children: "Guardrails" }), _jsx(Box, { component: "ul", sx: { m: 0, p: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 0.25 }, children: checks.map((c) => {
                    const st = GUARDRAIL_STATE[c.state] ?? GUARDRAIL_NA;
                    return (_jsxs(Box, { component: "li", "data-guardrail-state": c.state, sx: { display: "flex", gap: 1, alignItems: "baseline" }, children: [_jsx(Box, { component: "span", "aria-label": st.label, sx: { color: st.color, width: "1em", textAlign: "center", ...mono }, children: st.glyph }), _jsxs(Box, { sx: { minWidth: 0 }, children: [_jsx(Typography, { variant: "body2", component: "span", children: c.text }), c.judged ? (_jsx(Typography, { variant: "caption", component: "span", color: "text.secondary", sx: { ml: 0.75 }, children: "watched" })) : null, c.quote && c.state !== "met" ? (_jsxs(Typography, { variant: "caption", component: "div", color: "text.secondary", sx: { fontStyle: "italic" }, children: ["\u201C", c.quote, "\u201D"] })) : null] })] }, c.guardrailId || c.text));
                }) }), conflict ? (_jsx(Typography, { variant: "caption", component: "div", color: "text.secondary", sx: { mt: 0.5 }, children: "This plan cannot be approved as it is: ask for a new plan, or change the guardrail." })) : null] }));
}
function BulletList({ title, items, color }) {
    return (_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle2", sx: { color }, children: title }), _jsx(Box, { component: "ul", sx: { m: 0, pl: 2.5 }, children: items.map((r) => (_jsx(Typography, { component: "li", variant: "body2", children: r }, r))) })] }));
}
export function DiffPreviewBlock({ value }) {
    return (_jsxs(Card, { accent: "agent", label: `Diff · ${value.commitSha.slice(0, 7)}`, children: [_jsxs(Stack, { direction: "row", spacing: 1, alignItems: "center", flexWrap: "wrap", useFlexGap: true, children: [_jsxs(Typography, { variant: "body2", sx: mono, children: [value.files.length, " file", value.files.length === 1 ? "" : "s"] }), _jsxs(Typography, { variant: "body2", sx: { ...mono, color: "success.main" }, children: ["+", value.totalAdditions] }), _jsxs(Typography, { variant: "body2", sx: { ...mono, color: "error.main" }, children: ["\u2212", value.totalDeletions] }), value.compareUrl ? (_jsx(Link, { href: value.compareUrl, target: "_blank", rel: "noopener noreferrer", variant: "body2", children: "compare" })) : null] }), _jsx(Box, { sx: { display: "flex", flexDirection: "column", gap: 1 }, children: value.files.map((f) => (_jsxs(Box, { "data-diff-file": f.path, children: [_jsxs(Stack, { direction: "row", spacing: 1, alignItems: "baseline", children: [_jsx(Typography, { variant: "body2", sx: { ...mono, flex: 1, minWidth: 0, overflowWrap: "anywhere" }, children: f.path }), _jsxs(Typography, { variant: "caption", sx: { ...mono, color: "success.main" }, children: ["+", f.additions] }), _jsxs(Typography, { variant: "caption", sx: { ...mono, color: "error.main" }, children: ["\u2212", f.deletions] })] }), f.hunkPreview ? (_jsx(Box, { component: "pre", sx: {
                                m: 0,
                                mt: 0.5,
                                p: 1,
                                borderRadius: 1,
                                bgcolor: "tank.panel",
                                overflowX: "auto",
                                ...mono,
                                lineHeight: 1.45,
                            }, children: f.hunkPreview.split("\n").map((line, i) => (_jsx(Box, { component: "span", sx: {
                                    display: "block",
                                    color: line.startsWith("+")
                                        ? "success.main"
                                        : line.startsWith("-")
                                            ? "error.main"
                                            : line.startsWith("@@")
                                                ? "tank.primaryText"
                                                : "inherit",
                                }, children: line }, i))) })) : null] }, f.path))) })] }));
}
const CHECK_CHIP = {
    [CheckState.UNSPECIFIED]: { label: "unknown", color: "default" },
    [CheckState.QUEUED]: { label: "queued", color: "default" },
    [CheckState.RUNNING]: { label: "running", color: "info" },
    [CheckState.SUCCESS]: { label: "success", color: "success" },
    [CheckState.FAILURE]: { label: "failure", color: "error" },
    [CheckState.CANCELLED]: { label: "cancelled", color: "warning" },
};
export function CiStatusBlock({ value }) {
    const failed = value.checks.some((c) => c.state === CheckState.FAILURE);
    const running = value.checks.some((c) => c.state === CheckState.RUNNING || c.state === CheckState.QUEUED);
    const accent = failed ? "alert" : running ? "ai" : "agent";
    const summary = failed ? "CI red" : running ? "CI running" : "CI green";
    return (_jsxs(Card, { accent: accent, label: `${summary} · ${value.headSha.slice(0, 7)}`, children: [value.prUrl ? (_jsxs(Link, { href: value.prUrl, target: "_blank", rel: "noopener noreferrer", variant: "body2", children: ["PR #", value.prNumber] })) : null, _jsx(Box, { sx: { display: "flex", flexDirection: "column", gap: 0.75 }, children: value.checks.map((c) => {
                    const chip = CHECK_CHIP[c.state] ?? CHECK_CHIP[CheckState.UNSPECIFIED];
                    return (_jsxs(Box, { "data-check": c.name, "data-check-state": chip.label, children: [_jsxs(Stack, { direction: "row", spacing: 1, alignItems: "center", children: [_jsx(Chip, { size: "small", label: chip.label, color: chip.color, variant: chip.color === "default" ? "outlined" : "filled" }), c.url ? (_jsx(Link, { href: c.url, target: "_blank", rel: "noopener noreferrer", variant: "body2", children: c.name })) : (_jsx(Typography, { variant: "body2", children: c.name }))] }), c.failureExcerpt ? (_jsx(Box, { component: "pre", sx: {
                                    m: 0,
                                    mt: 0.5,
                                    p: 1,
                                    borderRadius: 1,
                                    bgcolor: "tank.panel",
                                    overflowX: "auto",
                                    ...mono,
                                    color: "error.main",
                                }, children: c.failureExcerpt })) : null] }, c.name));
                }) })] }));
}
const GATE_LABEL = {
    [GateKind.UNSPECIFIED]: "approval",
    [GateKind.PLAN]: "plan approval",
    [GateKind.SCOPE_CHANGE]: "scope change",
    [GateKind.MERGE]: "merge approval",
    [GateKind.DEPLOY]: "deploy approval",
    [GateKind.DESTRUCTIVE_TOOL]: "destructive tool",
    [GateKind.BUDGET_INCREASE]: "budget increase",
    [GateKind.GUARDRAIL]: "guardrail",
};
/**
 * A guardrail gate (phase 1): the run stopped at a guardrail and asks. Nothing is allowed
 * once, so there is no Approve: change the guardrail (the client opens the page; action
 * guardrail.change carries the guardrail's id), resume once it has changed (gate.approve,
 * which the control plane refuses until then), or stop the run (gate.request_changes).
 */
function GuardrailPromptBlock({ value, ctx }) {
    const fire = (actionId) => ctx.onAction?.({
        blockId: ctx.blockId,
        actionId,
        value: actionId === "guardrail.change" ? value.guardrailId : value.gateId,
    });
    const platform = !value.guardrailId || value.guardrailId.startsWith("platform:");
    return (_jsxs(Card, { accent: "alert", label: "guardrail", children: [_jsx(Typography, { variant: "body1", "data-testid": "guardrail-text", children: value.guardrailText || value.subject }), value.blocker ? (_jsx(Typography, { variant: "body2", color: "text.secondary", "data-testid": "guardrail-blocker", children: value.blocker })) : null, value.decided ? (_jsx(Chip, { size: "small", label: value.decision === "approved"
                    ? "resumed"
                    : value.decision === "rejected"
                        ? "stopped"
                        : value.decision || "decided", color: value.decision === "approved" ? "success" : value.decision === "rejected" ? "error" : "default", sx: { alignSelf: "flex-start" } })) : (_jsxs(Stack, { direction: "row", spacing: 1, flexWrap: "wrap", useFlexGap: true, children: [!platform ? (_jsx(Button, { size: "small", variant: "contained", color: "primary", "data-action-id": "guardrail.change", onClick: () => fire("guardrail.change"), children: "Change the guardrail" })) : null, !platform ? (_jsx(Button, { size: "small", variant: "outlined", "data-action-id": "gate.approve", onClick: () => fire("gate.approve"), children: "Resume the run" })) : null, _jsx(Button, { size: "small", variant: "outlined", color: "error", "data-action-id": "gate.request_changes", onClick: () => fire("gate.request_changes"), children: "Stop the run" })] }))] }));
}
function isWebUrl(s) {
    return /^https?:\/\/\S+$/.test(s.trim());
}
export function ApprovalPromptBlock({ value, ctx }) {
    const expires = tsMs(value.expiresAt);
    const fmt = ctx.formatTime ?? ((ms) => new Date(ms).toISOString());
    if (value.kind === GateKind.GUARDRAIL)
        return _jsx(GuardrailPromptBlock, { value: value, ctx: ctx });
    return (_jsxs(Card, { accent: "alert", label: GATE_LABEL[value.kind] ?? "approval", children: [isWebUrl(value.subject) ? (_jsx(Link, { href: value.subject, target: "_blank", rel: "noopener noreferrer", variant: "body1", sx: { wordBreak: "break-all" }, "data-testid": "approval-subject-link", children: value.subject })) : (_jsx(Typography, { variant: "body1", children: value.subject })), value.detail ? (_jsx(Typography, { variant: "body2", color: "text.secondary", "data-testid": "approval-detail", children: value.detail })) : (_jsxs(Typography, { variant: "caption", color: "text.secondary", children: [value.minApprovals, " approval", value.minApprovals === 1 ? "" : "s", " needed", value.approverIds.length ? ` from ${names(value.approverIds, ctx)}` : "", expires !== undefined && !value.decided ? ` · expires ${fmt(expires)}` : ""] })), value.decided ? (_jsx(Chip, { size: "small", label: value.decision || "decided", color: value.decision === "approved" ? "success" : value.decision === "rejected" ? "error" : "default", sx: { alignSelf: "flex-start" } })) : (_jsxs(Stack, { direction: "row", spacing: 1, children: [_jsx(Button, { size: "small", variant: "contained", color: "primary", "data-action-id": "gate.approve", onClick: () => ctx.onAction?.({ blockId: ctx.blockId, actionId: "gate.approve", value: value.gateId }), children: value.approveLabel || "Approve" }), _jsx(Button, { size: "small", variant: "outlined", color: "error", "data-action-id": "gate.request_changes", onClick: () => ctx.onAction?.({ blockId: ctx.blockId, actionId: "gate.request_changes", value: value.gateId }), children: value.rejectLabel || "Reject" })] }))] }));
}
export function ToolLogBlock({ value, ctx }) {
    const fmt = ctx.formatTime ?? ((ms) => new Date(ms).toISOString().slice(11, 19));
    return (_jsxs(Card, { accent: "agent", label: `Agent · ${value.phase}`, children: [_jsxs(Typography, { variant: "caption", color: "text.secondary", children: [value.toolCalls, " tool call", value.toolCalls === 1 ? "" : "s", " \u00B7 ", value.filesEdited, " file", value.filesEdited === 1 ? "" : "s", " edited", value.runPanelUrl ? (_jsxs(_Fragment, { children: [" · ", _jsx(Link, { href: value.runPanelUrl, target: "_blank", rel: "noopener noreferrer", children: "run panel" })] })) : null] }), value.recent.length > 0 ? (_jsx(Box, { component: "ol", sx: { m: 0, p: 0, listStyle: "none", ...mono, display: "flex", flexDirection: "column", gap: 0.25 }, children: value.recent.map((e, i) => {
                    const at = tsMs(e.at);
                    return (_jsxs(Box, { component: "li", "data-ok": e.ok, sx: { display: "flex", gap: 1, color: e.ok ? "inherit" : "error.main" }, children: [_jsx(Box, { component: "span", sx: { color: "text.disabled" }, children: at !== undefined ? fmt(at) : "--:--:--" }), _jsx(Box, { component: "span", sx: { color: "tank.secondaryText", minWidth: "4em" }, children: e.tool }), _jsx(Box, { component: "span", sx: { overflowWrap: "anywhere" }, children: e.summary })] }, i));
                }) })) : null] }));
}
export function StatusCardBlock({ value, ctx }) {
    const started = tsMs(value.startedAt);
    const fmt = ctx.formatTime ?? ((ms) => new Date(ms).toISOString());
    const terminal = /^(done|merged|failed|cancelled|timed_out|budget_exhausted|approval_expired)$/.test(value.state);
    const bad = /^(failed|cancelled|timed_out|budget_exhausted|approval_expired)$/.test(value.state);
    return (_jsxs(Card, { accent: bad ? "alert" : "agent", label: `Run · ${value.runId}`, children: [_jsxs(Stack, { direction: "row", spacing: 1, alignItems: "center", flexWrap: "wrap", useFlexGap: true, children: [_jsx(Chip, { size: "small", label: value.state.replaceAll("_", " "), color: bad ? "error" : terminal ? "success" : "secondary" }), value.branch ? (_jsx(Typography, { variant: "body2", sx: mono, children: value.branch })) : null, value.costUsd > 0 ? (_jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["$", value.costUsd.toFixed(2)] })) : null] }), value.detail ? _jsx(Typography, { variant: "body2", children: value.detail }) : null, _jsxs(Typography, { variant: "caption", color: "text.secondary", children: [started !== undefined ? `started ${fmt(started)}` : "", value.runPanelUrl ? (_jsxs(_Fragment, { children: [started !== undefined ? " · " : "", _jsx(Link, { href: value.runPanelUrl, target: "_blank", rel: "noopener noreferrer", children: "run panel" })] })) : null] })] }));
}
function formatBytes(n) {
    const v = Number(n);
    if (v < 1024)
        return `${v} B`;
    if (v < 1024 * 1024)
        return `${(v / 1024).toFixed(1)} KB`;
    if (v < 1024 * 1024 * 1024)
        return `${(v / 1024 / 1024).toFixed(1)} MB`;
    return `${(v / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
export function FilePreviewBlock({ value }) {
    return (_jsx(Card, { accent: "none", children: _jsxs(Stack, { direction: "row", spacing: 1.5, alignItems: "center", children: [value.thumbnailUrl ? (_jsx(Box, { component: "img", src: value.thumbnailUrl, alt: "", sx: { width: 56, height: 56, objectFit: "cover", borderRadius: 1, bgcolor: "tank.panel" } })) : (_jsx(Box, { sx: {
                        width: 56,
                        height: 56,
                        borderRadius: 1,
                        bgcolor: "tank.panel",
                        display: "grid",
                        placeItems: "center",
                        ...mono,
                    }, "aria-hidden": true, children: value.mime.split("/")[1]?.slice(0, 4).toUpperCase() || "FILE" })), _jsxs(Box, { sx: { minWidth: 0 }, children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: 600, overflowWrap: "anywhere" }, "data-file-id": value.fileId, children: value.name }), _jsxs(Typography, { variant: "caption", color: "text.secondary", children: [value.mime || "file", " \u00B7 ", formatBytes(value.size)] })] })] }) }));
}
