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
import { ButtonStyle, CheckState, GateKind, StepStatus } from "../contracts/tank/blocks/v1/blocks_pb.js";
import { typography } from "../design/tokens.js";
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
function tsMs(t) {
    return t ? Number(t.seconds) * 1000 + Math.floor(t.nanos / 1e6) : undefined;
}
/** Accent stripe for agent cards: purple = agent execution, cyan = AI/context, amber = needs a human. */
export function Card({ accent, children, label, }) {
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
        }, children: [label ? (_jsx(Typography, { variant: "overline", sx: { color: accent === "none" ? "text.secondary" : `tank.${accent}`, lineHeight: 1.5 }, children: label })) : null, children] }));
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
export function PlanCardBlock({ value }) {
    const done = value.steps.filter((s) => s.status === StepStatus.DONE).length;
    return (_jsxs(Card, { accent: "agent", label: `Plan · v${value.version}${value.planHash ? ` · ${value.planHash}` : ""}`, children: [_jsx(Typography, { variant: "body1", children: value.summary }), value.steps.length > 0 ? (_jsxs(Box, { children: [_jsx(LinearProgress, { variant: "determinate", color: "secondary", value: (done / value.steps.length) * 100, sx: { mb: 1, height: 4, borderRadius: 2 }, "aria-label": `${done} of ${value.steps.length} steps done` }), _jsx(Box, { component: "ol", sx: { m: 0, p: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 0.5 }, children: value.steps.map((s) => {
                            const g = STEP_GLYPH[s.status] ?? STEP_GLYPH[StepStatus.PENDING];
                            return (_jsxs(Box, { component: "li", "data-step-status": g.label, sx: { display: "flex", gap: 1, alignItems: "baseline" }, children: [_jsx(Box, { component: "span", "aria-label": g.label, sx: { color: g.color, width: "1em", textAlign: "center", ...mono }, children: g.glyph }), _jsxs(Box, { sx: { minWidth: 0 }, children: [_jsx(Typography, { variant: "body2", component: "span", children: s.title }), s.files.length > 0 ? (_jsx(Typography, { variant: "caption", component: "div", color: "text.secondary", sx: mono, children: s.files.join("  ") })) : null] })] }, s.id));
                        }) })] })) : null, value.risks.length > 0 ? (_jsx(BulletList, { title: "Risks", items: value.risks, color: "tank.warningText" })) : null, value.questions.length > 0 ? (_jsx(BulletList, { title: "Questions", items: value.questions, color: "tank.primaryText" })) : null, value.approverIds.length > 0 ? (_jsxs(Typography, { variant: "caption", color: "text.secondary", children: ["Approvers: ", value.approverIds.join(", ")] })) : null] }));
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
};
export function ApprovalPromptBlock({ value, ctx }) {
    const expires = tsMs(value.expiresAt);
    const fmt = ctx.formatTime ?? ((ms) => new Date(ms).toISOString());
    return (_jsxs(Card, { accent: "alert", label: GATE_LABEL[value.kind] ?? "approval", children: [_jsx(Typography, { variant: "body1", children: value.subject }), _jsxs(Typography, { variant: "caption", color: "text.secondary", children: [value.minApprovals, " approval", value.minApprovals === 1 ? "" : "s", " needed", value.approverIds.length ? ` from ${value.approverIds.join(", ")}` : "", expires !== undefined && !value.decided ? ` · expires ${fmt(expires)}` : ""] }), value.decided ? (_jsx(Chip, { size: "small", label: value.decision || "decided", color: value.decision === "approved" ? "success" : value.decision === "rejected" ? "error" : "default", sx: { alignSelf: "flex-start" } })) : (_jsxs(Stack, { direction: "row", spacing: 1, children: [_jsx(Button, { size: "small", variant: "contained", color: "primary", "data-action-id": "approve", onClick: () => ctx.onAction?.({ blockId: ctx.blockId, actionId: "approve", value: value.gateId }), children: "Approve" }), _jsx(Button, { size: "small", variant: "outlined", color: "error", "data-action-id": "reject", onClick: () => ctx.onAction?.({ blockId: ctx.blockId, actionId: "reject", value: value.gateId }), children: "Reject" })] }))] }));
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
