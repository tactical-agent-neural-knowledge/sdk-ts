import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Alert, Image, Linking, Pressable, StyleSheet, View } from "react-native";
import { Button, Chip, Divider, ProgressBar, Text, useTheme } from "react-native-paper";
import { MARKS, planMark, stepMark } from "../blocks/marks.js";
import { planGlance, planMarkdown } from "../blocks/plan.js";
import { ACTION_REVEAL_KEY, REVEAL_COPIED, REVEAL_GONE } from "../blocks/reveal.js";
import { ButtonStyle, CheckState, GateKind, StepStatus } from "../contracts/tank/blocks/v1/blocks_pb.js";
import { shades } from "../design/tokens.js";
import { DEFAULT_CODE_FONT } from "./context.js";
import { Mark } from "./Mark.js";
import { RichTextViewNative } from "./RichTextViewNative.js";
/** Accent colours from the Paper theme: purple (secondary) = agent execution, cyan (primary) = AI/context, amber (tertiary) = needs a human. */
/** Approver ids as names where the host can name them; an id nobody can name stays an id. */
function names(ids, ctx) {
    return ids.map((id) => ctx.resolveUser?.(id) || id).join(", ");
}
export function accentColor(theme, accent) {
    switch (accent) {
        case "agent":
            return theme.colors.secondary;
        case "ai":
            return theme.colors.primary;
        case "alert":
            return theme.colors.tertiary;
        default:
            return theme.colors.outlineVariant;
    }
}
/** Semantic colours Paper's palette has no slot for. */
export function semanticColors(theme) {
    return {
        success: theme.dark ? shades.success.main : shades.success.onLight,
        error: theme.colors.error,
        muted: theme.colors.onSurfaceDisabled,
    };
}
/** Flat chip colours per tone (tinted background, readable foreground); `muted` renders outlined. */
export function chipColors(theme, tone) {
    const sem = semanticColors(theme);
    switch (tone) {
        case "agent":
            return {
                bg: `${theme.colors.secondary}33`,
                fg: theme.dark ? shades.purple.text : theme.colors.secondary,
                outlined: false,
            };
        case "ai":
            return { bg: `${theme.colors.primary}33`, fg: theme.colors.primary, outlined: false };
        case "alert":
            return { bg: `${theme.colors.tertiary}33`, fg: theme.colors.tertiary, outlined: false };
        case "success":
            return { bg: `${sem.success}33`, fg: sem.success, outlined: false };
        case "error":
            return { bg: `${sem.error}33`, fg: sem.error, outlined: false };
        default:
            return { bg: "transparent", fg: theme.colors.onSurfaceVariant, outlined: true };
    }
}
export function ToneChip({ tone, label, testID }) {
    const theme = useTheme();
    const c = chipColors(theme, tone);
    return (_jsx(Chip, { compact: true, mode: c.outlined ? "outlined" : "flat", style: [styles.chip, { backgroundColor: c.bg, borderColor: c.fg }], textStyle: [styles.chipText, { color: c.fg }], testID: testID, accessibilityLabel: label, children: label }));
}
function tsMs(t) {
    return t ? Number(t.seconds) * 1000 + Math.floor(t.nanos / 1e6) : undefined;
}
function LinkText({ url, children, ctx }) {
    const theme = useTheme();
    const open = ctx.openUrl ?? ((u) => void Linking.openURL(u));
    return (_jsx(Text, { variant: "bodyMedium", style: { color: theme.colors.primary, textDecorationLine: "underline" }, onPress: () => open(url), accessibilityRole: "link", testID: `link-${url}`, children: children }));
}
/** Accent stripe card: purple = agent execution, cyan = AI/context, amber = needs a human. */
export function Card({ accent, children, label, icon, }) {
    const theme = useTheme();
    const color = accentColor(theme, accent);
    return (_jsxs(View, { testID: `card-${accent}`, style: [
            styles.card,
            {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outlineVariant,
                borderLeftColor: color,
                borderRadius: theme.roundness * 2,
            },
        ], children: [label ? (_jsxs(View, { style: styles.labelRow, children: [icon, _jsx(Text, { variant: "labelSmall", style: {
                            color: accent === "none" ? theme.colors.onSurfaceVariant : color,
                            textTransform: "uppercase",
                        }, children: label })] })) : null, children] }));
}
// ------------------------------------------------------------------ simple blocks
export function HeaderBlock({ value }) {
    return (_jsx(Text, { variant: "titleMedium", accessibilityRole: "header", children: value.text }));
}
export function SectionBlock({ value, ctx }) {
    const theme = useTheme();
    return (_jsxs(View, { style: styles.row, children: [_jsxs(View, { style: styles.grow, children: [_jsx(RichTextViewNative, { richText: value.text, resolveUser: ctx.resolveUser, resolveChannel: ctx.resolveChannel, codeFontFamily: ctx.codeFontFamily, openUrl: ctx.openUrl }), value.fields.length > 0 ? (_jsx(View, { style: styles.fields, children: value.fields.map((f) => (_jsxs(View, { style: styles.field, children: [_jsx(Text, { variant: "labelSmall", style: { color: theme.colors.onSurfaceVariant }, children: f.label }), _jsx(Text, { variant: "bodyMedium", children: f.value })] }, f.label))) })) : null] }), value.accessory ? _jsx(ActionButton, { button: value.accessory, ctx: ctx }) : null] }));
}
export function ContextBlock({ value, ctx }) {
    return (_jsx(View, { style: styles.wrap, children: value.elements.map((e, i) => (_jsx(RichTextViewNative, { richText: e, variant: "bodySmall", resolveUser: ctx.resolveUser, resolveChannel: ctx.resolveChannel, codeFontFamily: ctx.codeFontFamily, openUrl: ctx.openUrl }, i))) }));
}
export function DividerBlock() {
    return _jsx(Divider, {});
}
// ------------------------------------------------------------------ buttons
export function ActionButton({ button, ctx }) {
    const theme = useTheme();
    if (button.actionId === ACTION_REVEAL_KEY)
        return _jsx(RevealKeyButton, { button: button, ctx: ctx });
    const danger = button.style === ButtonStyle.DANGER;
    const mode = button.style === ButtonStyle.UNSPECIFIED ? "outlined" : "contained";
    const color = danger ? { buttonColor: theme.colors.error, textColor: theme.colors.onError } : {};
    const fire = () => ctx.onAction?.({ blockId: ctx.blockId, actionId: button.actionId, value: button.value });
    const open = ctx.openUrl ?? ((u) => void Linking.openURL(u));
    const onPress = () => {
        if (button.url)
            return open(button.url);
        if (!button.confirm)
            return fire();
        Alert.alert(button.confirm.title, button.confirm.text, [
            { text: button.confirm.deny || "Cancel", style: "cancel" },
            { text: button.confirm.confirm || "Confirm", style: danger ? "destructive" : "default", onPress: fire },
        ]);
    };
    return (_jsx(Button, { compact: true, mode: mode, ...color, onPress: onPress, testID: `action-${button.actionId || button.url}`, accessibilityLabel: button.text, style: styles.button, children: button.text }));
}
/**
 * Copies a key a run made, through the host: the key goes from the server to the clipboard and
 * is never posted as an action. A refusal (somebody else, a second press, expired) is one line.
 */
function RevealKeyButton({ button, ctx }) {
    const theme = useTheme();
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
    return (_jsxs(View, { children: [_jsx(Button, { compact: true, mode: "contained", onPress: () => void press(), disabled: busy, testID: `action-${button.actionId}`, accessibilityLabel: copied ? REVEAL_COPIED : button.text, style: styles.button, children: copied ? REVEAL_COPIED : button.text }), gone ? (_jsx(Text, { variant: "bodySmall", style: { color: theme.colors.onSurfaceVariant }, testID: "reveal-gone", children: REVEAL_GONE })) : null] }));
}
export function ActionsBlock({ value, ctx }) {
    return (_jsx(View, { style: styles.wrap, children: value.buttons.map((b, i) => (_jsx(ActionButton, { button: b, ctx: ctx }, b.actionId || b.url || i))) }));
}
// ------------------------------------------------------------------ agent cards
const STEP_GLYPH = {
    [StepStatus.UNSPECIFIED]: { glyph: "○", label: "pending" },
    [StepStatus.PENDING]: { glyph: "○", label: "pending" },
    [StepStatus.RUNNING]: { glyph: "◐", label: "running" },
    [StepStatus.DONE]: { glyph: "●", label: "done" },
    [StepStatus.FAILED]: { glyph: "✕", label: "failed" },
    [StepStatus.SKIPPED]: { glyph: "–", label: "skipped" },
};
function stepColor(theme, status) {
    const sem = semanticColors(theme);
    switch (status) {
        case StepStatus.RUNNING:
            return theme.colors.secondary;
        case StepStatus.DONE:
            return sem.success;
        case StepStatus.FAILED:
            return sem.error;
        default:
            return sem.muted;
    }
}
export function PlanCardBlock({ value, ctx }) {
    // At a glance by default: an emoji and a line per step. Tapping the text shows the whole
    // plan and tapping it again goes back; no button (Robby, 2026-10-25). A plan with no steps
    // has nothing to glance at and is shown whole.
    const [detail, setDetail] = useState(false);
    if (value.steps.length > 0 && !detail) {
        const g = planGlance(value.steps);
        return (_jsxs(Card, { accent: "agent", label: `${g.done}/${g.total}`, icon: _jsx(Mark, { kind: planMark(value.steps), size: 16 }), children: [_jsx(Pressable, { onPress: () => setDetail(true), accessibilityRole: "button", accessibilityLabel: "Show the whole plan", accessibilityState: { expanded: false }, testID: "plan-glance", style: styles.stack, children: value.steps.map((s, i) => (_jsxs(View, { style: styles.step, testID: `step-${(STEP_GLYPH[s.status] ?? STEP_GLYPH[StepStatus.PENDING]).label}`, children: [_jsx(View, { style: styles.mark, children: _jsx(Mark, { kind: stepMark(s.status), title: MARKS[stepMark(s.status)].label }) }), _jsx(Text, { variant: "bodyMedium", style: styles.grow, children: s.title })] }, s.id || i))) }), _jsx(PlanFileRow, { value: value, ctx: ctx })] }));
    }
    return (_jsx(PlanCardDetail, { value: value, ctx: ctx, onToggle: value.steps.length > 0 ? () => setDetail(false) : undefined }));
}
function PlanCardDetail({ value, ctx, onToggle, }) {
    const theme = useTheme();
    const codeFont = ctx.codeFontFamily ?? DEFAULT_CODE_FONT;
    const done = value.steps.filter((s) => s.status === StepStatus.DONE).length;
    return (_jsxs(Card, { accent: "agent", label: `Plan · v${value.version}${value.planHash ? ` · ${value.planHash}` : ""}`, children: [_jsxs(Pressable, { onPress: onToggle, disabled: !onToggle, accessibilityRole: onToggle ? "button" : undefined, accessibilityState: onToggle ? { expanded: true } : undefined, testID: "plan-detail", style: styles.stack, children: [_jsx(Text, { variant: "bodyLarge", children: value.summary }), value.steps.length > 0 ? (_jsxs(View, { style: styles.stack, children: [_jsx(ProgressBar, { progress: done / value.steps.length, color: theme.colors.secondary, style: styles.progress, accessibilityLabel: `${done} of ${value.steps.length} steps done` }), value.steps.map((s) => {
                                const g = STEP_GLYPH[s.status] ?? STEP_GLYPH[StepStatus.PENDING];
                                return (_jsxs(View, { style: styles.step, testID: `step-${g.label}`, children: [_jsx(Text, { style: { color: stepColor(theme, s.status), fontFamily: codeFont, width: 16 }, children: g.glyph }), _jsxs(View, { style: styles.grow, children: [_jsx(Text, { variant: "bodyMedium", children: s.title }), s.files.length > 0 ? (_jsx(Text, { variant: "bodySmall", style: { color: theme.colors.onSurfaceVariant, fontFamily: codeFont }, children: s.files.join("  ") })) : null] })] }, s.id));
                            })] })) : null, value.risks.length > 0 ? (_jsx(BulletList, { title: "Risks", items: value.risks, color: theme.colors.tertiary })) : null, value.questions.length > 0 ? (_jsx(BulletList, { title: "Questions", items: value.questions, color: theme.colors.primary })) : null, value.guardrails.length > 0 ? _jsx(GuardrailChecks, { checks: value.guardrails, ctx: ctx }) : null, value.approverIds.length > 0 ? (_jsxs(Text, { variant: "bodySmall", style: { color: theme.colors.onSurfaceVariant }, children: ["Approvers: ", names(value.approverIds, ctx)] })) : null] }), _jsx(PlanFileRow, { value: value, ctx: ctx })] }));
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
    return (_jsxs(View, { style: styles.wrap, testID: "plan-file", children: [actions.download ? (_jsx(Button, { compact: true, icon: "download-outline", onPress: () => void actions.download?.(file()), testID: "plan-download", children: "Download" })) : null, actions.addToAtlas ? (_jsx(Button, { compact: true, mode: "outlined", icon: "book-open-page-variant-outline", disabled: adding, loading: adding, onPress: async () => {
                    setAdding(true);
                    try {
                        await actions.addToAtlas?.(file());
                    }
                    finally {
                        setAdding(false);
                    }
                }, testID: "plan-atlas", children: "Add to Atlas" })) : null] }));
}
const GUARDRAIL_NA = { glyph: "–", label: "not applicable" };
const GUARDRAIL_GLYPH = {
    met: { glyph: "✓", label: "met" },
    violated: { glyph: "✗", label: "conflict" },
    unsure: { glyph: "?", label: "unsure" },
    blocked: { glyph: "✗", label: "blocked" },
    not_applicable: GUARDRAIL_NA,
};
/** Whether a plan can be approved: not while a guardrail check is a conflict or a doubt. */
export function planConflicts(checks) {
    return checks.some((c) => c.state === "violated" || c.state === "unsure");
}
/** The plan card's Guardrails section: each guardrail met or in conflict, with the quoted reason. */
function GuardrailChecks({ checks, ctx }) {
    const theme = useTheme();
    const sem = semanticColors(theme);
    const codeFont = ctx.codeFontFamily ?? DEFAULT_CODE_FONT;
    const conflict = planConflicts(checks);
    const colorOf = (state) => state === "met"
        ? sem.success
        : state === "unsure"
            ? theme.colors.tertiary
            : state === "not_applicable"
                ? theme.colors.onSurfaceVariant
                : sem.error;
    return (_jsxs(View, { testID: "plan-guardrails", children: [_jsx(Text, { variant: "labelLarge", style: { color: conflict ? sem.error : sem.success }, children: "Guardrails" }), checks.map((c) => {
                const g = GUARDRAIL_GLYPH[c.state] ?? GUARDRAIL_NA;
                return (_jsxs(View, { style: styles.step, testID: `guardrail-${c.state}`, children: [_jsx(Text, { style: { color: colorOf(c.state), fontFamily: codeFont, width: 16 }, accessibilityLabel: g.label, children: g.glyph }), _jsxs(View, { style: styles.grow, children: [_jsxs(Text, { variant: "bodyMedium", children: [c.text, c.judged ? (_jsx(Text, { variant: "bodySmall", style: { color: theme.colors.onSurfaceVariant }, children: "  watched" })) : null] }), c.quote && c.state !== "met" ? (_jsxs(Text, { variant: "bodySmall", style: { color: theme.colors.onSurfaceVariant, fontStyle: "italic" }, children: ["\u201C", c.quote, "\u201D"] })) : null] })] }, c.guardrailId || c.text));
            }), conflict ? (_jsx(Text, { variant: "bodySmall", style: { color: theme.colors.onSurfaceVariant }, children: "This plan cannot be approved as it is: ask for a new plan, or change the guardrail." })) : null] }));
}
function BulletList({ title, items, color }) {
    return (_jsxs(View, { children: [_jsx(Text, { variant: "labelLarge", style: { color }, children: title }), items.map((r) => (_jsxs(Text, { variant: "bodyMedium", children: ["\u2022 ", r] }, r)))] }));
}
export function DiffPreviewBlock({ value, ctx }) {
    const theme = useTheme();
    const sem = semanticColors(theme);
    const mono = { fontFamily: ctx.codeFontFamily ?? DEFAULT_CODE_FONT };
    return (_jsxs(Card, { accent: "agent", label: `Diff · ${value.commitSha.slice(0, 7)}`, children: [_jsxs(View, { style: styles.wrap, children: [_jsxs(Text, { variant: "bodyMedium", style: mono, children: [value.files.length, " file", value.files.length === 1 ? "" : "s"] }), _jsxs(Text, { variant: "bodyMedium", style: [mono, { color: sem.success }], children: ["+", value.totalAdditions] }), _jsxs(Text, { variant: "bodyMedium", style: [mono, { color: sem.error }], children: ["\u2212", value.totalDeletions] }), value.compareUrl ? (_jsx(LinkText, { url: value.compareUrl, ctx: ctx, children: "compare" })) : null] }), value.files.map((f) => (_jsxs(View, { testID: `diff-${f.path}`, children: [_jsxs(View, { style: styles.wrap, children: [_jsx(Text, { variant: "bodyMedium", style: [mono, styles.grow], children: f.path }), _jsxs(Text, { variant: "bodySmall", style: [mono, { color: sem.success }], children: ["+", f.additions] }), _jsxs(Text, { variant: "bodySmall", style: [mono, { color: sem.error }], children: ["\u2212", f.deletions] })] }), f.hunkPreview ? (_jsx(View, { style: [styles.pre, { backgroundColor: theme.colors.surfaceVariant }], children: f.hunkPreview.split("\n").map((line, i) => (_jsx(Text, { variant: "bodySmall", style: [
                                mono,
                                {
                                    color: line.startsWith("+")
                                        ? sem.success
                                        : line.startsWith("-")
                                            ? sem.error
                                            : line.startsWith("@@")
                                                ? theme.colors.primary
                                                : theme.colors.onSurface,
                                },
                            ], children: line }, i))) })) : null] }, f.path)))] }));
}
const CHECK_CHIP = {
    [CheckState.UNSPECIFIED]: { label: "unknown", tone: "muted" },
    [CheckState.QUEUED]: { label: "queued", tone: "muted" },
    [CheckState.RUNNING]: { label: "running", tone: "ai" },
    [CheckState.SUCCESS]: { label: "success", tone: "success" },
    [CheckState.FAILURE]: { label: "failure", tone: "error" },
    [CheckState.CANCELLED]: { label: "cancelled", tone: "alert" },
};
export function CiStatusBlock({ value, ctx }) {
    const theme = useTheme();
    const failed = value.checks.some((c) => c.state === CheckState.FAILURE);
    const running = value.checks.some((c) => c.state === CheckState.RUNNING || c.state === CheckState.QUEUED);
    const accent = failed ? "alert" : running ? "ai" : "agent";
    const summary = failed ? "CI red" : running ? "CI running" : "CI green";
    const mono = { fontFamily: ctx.codeFontFamily ?? DEFAULT_CODE_FONT };
    return (_jsxs(Card, { accent: accent, label: `${summary} · ${value.headSha.slice(0, 7)}`, children: [value.prUrl ? (_jsxs(LinkText, { url: value.prUrl, ctx: ctx, children: ["PR #", value.prNumber] })) : null, value.checks.map((c) => {
                const chip = CHECK_CHIP[c.state] ?? CHECK_CHIP[CheckState.UNSPECIFIED];
                return (_jsxs(View, { testID: `check-${chip.label}`, children: [_jsxs(View, { style: styles.row, children: [_jsx(ToneChip, { tone: chip.tone, label: chip.label }), c.url ? (_jsx(LinkText, { url: c.url, ctx: ctx, children: c.name })) : (_jsx(Text, { variant: "bodyMedium", children: c.name }))] }), c.failureExcerpt ? (_jsx(View, { style: [styles.pre, { backgroundColor: theme.colors.surfaceVariant }], children: _jsx(Text, { variant: "bodySmall", style: [mono, { color: theme.colors.error }], children: c.failureExcerpt }) })) : null] }, c.name));
            })] }));
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
 * once, so there is no Approve: change the guardrail (guardrail.change carries its id and
 * the app opens the page), resume once it has changed (gate.approve, refused by the
 * control plane until then), or stop the run (gate.request_changes).
 */
function GuardrailPromptBlock({ value, ctx }) {
    const theme = useTheme();
    const fire = (actionId) => ctx.onAction?.({
        blockId: ctx.blockId,
        actionId,
        value: actionId === "guardrail.change" ? value.guardrailId : value.gateId,
    });
    const platform = !value.guardrailId || value.guardrailId.startsWith("platform:");
    return (_jsxs(Card, { accent: "alert", label: "guardrail", children: [_jsx(Text, { variant: "bodyLarge", testID: "guardrail-text", children: value.guardrailText || value.subject }), value.blocker ? (_jsx(Text, { variant: "bodyMedium", style: { color: theme.colors.onSurfaceVariant }, testID: "guardrail-blocker", children: value.blocker })) : null, value.decided ? (_jsx(ToneChip, { tone: value.decision === "approved" ? "success" : value.decision === "rejected" ? "error" : "muted", label: value.decision === "approved"
                    ? "resumed"
                    : value.decision === "rejected"
                        ? "stopped"
                        : value.decision || "decided", testID: "approval-decision" })) : (_jsxs(View, { style: styles.wrap, children: [!platform ? (_jsx(Button, { compact: true, mode: "contained", onPress: () => fire("guardrail.change"), testID: "action-change-guardrail", style: styles.button, children: "Change the guardrail" })) : null, !platform ? (_jsx(Button, { compact: true, mode: "outlined", onPress: () => fire("gate.approve"), testID: "action-resume", style: styles.button, children: "Resume the run" })) : null, _jsx(Button, { compact: true, mode: "outlined", textColor: theme.colors.error, onPress: () => fire("gate.request_changes"), testID: "action-stop", style: styles.button, children: "Stop the run" })] }))] }));
}
function isWebUrl(s) {
    return /^https?:\/\/\S+$/.test(s.trim());
}
export function ApprovalPromptBlock({ value, ctx }) {
    const theme = useTheme();
    const expires = tsMs(value.expiresAt);
    const fmt = ctx.formatTime ?? ((ms) => new Date(ms).toISOString());
    if (value.kind === GateKind.GUARDRAIL)
        return _jsx(GuardrailPromptBlock, { value: value, ctx: ctx });
    // The ids the control plane answers to (agent-control/internal/cards: gate.approve,
    // gate.request_changes). These sent "approve" / "reject" until 2026-10-15 and were
    // ignored, which is why every approval card carried a second pair of buttons.
    const fire = (actionId) => ctx.onAction?.({ blockId: ctx.blockId, actionId, value: value.gateId });
    return (_jsxs(Card, { accent: "alert", label: GATE_LABEL[value.kind] ?? "approval", children: [isWebUrl(value.subject) ? (_jsx(LinkText, { url: value.subject.trim(), ctx: ctx, children: value.subject })) : (_jsx(Text, { variant: "bodyLarge", children: value.subject })), value.detail ? (_jsx(Text, { variant: "bodyMedium", style: { color: theme.colors.onSurfaceVariant }, testID: "approval-detail", children: value.detail })) : (_jsxs(Text, { variant: "bodySmall", style: { color: theme.colors.onSurfaceVariant }, children: [value.minApprovals, " approval", value.minApprovals === 1 ? "" : "s", " needed", value.approverIds.length ? ` from ${names(value.approverIds, ctx)}` : "", expires !== undefined && !value.decided ? ` · expires ${fmt(expires)}` : ""] })), value.decided ? (_jsx(ToneChip, { tone: value.decision === "approved" ? "success" : value.decision === "rejected" ? "error" : "muted", label: value.decision || "decided", testID: "approval-decision" })) : (_jsxs(View, { style: styles.wrap, children: [_jsx(Button, { compact: true, mode: "contained", onPress: () => fire("gate.approve"), testID: "action-approve", style: styles.button, children: value.approveLabel || "Approve" }), _jsx(Button, { compact: true, mode: "outlined", textColor: theme.colors.error, onPress: () => fire("gate.request_changes"), testID: "action-reject", style: styles.button, children: value.rejectLabel || "Reject" })] }))] }));
}
export function ToolLogBlock({ value, ctx }) {
    const theme = useTheme();
    const sem = semanticColors(theme);
    const fmt = ctx.formatTime ?? ((ms) => new Date(ms).toISOString().slice(11, 19));
    const mono = { fontFamily: ctx.codeFontFamily ?? DEFAULT_CODE_FONT };
    return (_jsxs(Card, { accent: "agent", label: `Agent · ${value.phase}`, children: [_jsxs(Text, { variant: "bodySmall", style: { color: theme.colors.onSurfaceVariant }, children: [value.toolCalls, " tool call", value.toolCalls === 1 ? "" : "s", " \u00B7 ", value.filesEdited, " file", value.filesEdited === 1 ? "" : "s", " edited"] }), value.runPanelUrl ? (_jsx(LinkText, { url: value.runPanelUrl, ctx: ctx, children: "run panel" })) : null, value.recent.map((e, i) => {
                const at = tsMs(e.at);
                const color = e.ok ? theme.colors.onSurface : sem.error;
                return (_jsxs(View, { style: styles.row, testID: `tool-${e.ok ? "ok" : "failed"}`, children: [_jsx(Text, { variant: "bodySmall", style: [mono, { color: sem.muted }], children: at !== undefined ? fmt(at) : "--:--:--" }), _jsx(Text, { variant: "bodySmall", style: [mono, { color: theme.dark ? shades.purple.text : theme.colors.secondary }], children: e.tool }), _jsx(Text, { variant: "bodySmall", style: [mono, styles.grow, { color }], children: e.summary })] }, i));
            })] }));
}
export function StatusCardBlock({ value, ctx }) {
    const theme = useTheme();
    const started = tsMs(value.startedAt);
    const fmt = ctx.formatTime ?? ((ms) => new Date(ms).toISOString());
    const terminal = /^(done|merged|failed|cancelled|timed_out|budget_exhausted|approval_expired)$/.test(value.state);
    const bad = /^(failed|cancelled|timed_out|budget_exhausted|approval_expired)$/.test(value.state);
    const mono = { fontFamily: ctx.codeFontFamily ?? DEFAULT_CODE_FONT };
    return (_jsxs(Card, { accent: bad ? "alert" : "agent", label: `Run · ${value.runId}`, children: [_jsxs(View, { style: styles.wrap, children: [_jsx(ToneChip, { tone: bad ? "error" : terminal ? "success" : "agent", label: value.state.replaceAll("_", " "), testID: "run-state" }), value.branch ? (_jsx(Text, { variant: "bodyMedium", style: mono, children: value.branch })) : null, value.costUsd > 0 ? (_jsxs(Text, { variant: "bodyMedium", style: { color: theme.colors.onSurfaceVariant }, children: ["$", value.costUsd.toFixed(2)] })) : null] }), value.detail ? _jsx(Text, { variant: "bodyMedium", children: value.detail }) : null, started !== undefined ? (_jsxs(Text, { variant: "bodySmall", style: { color: theme.colors.onSurfaceVariant }, children: ["started ", fmt(started)] })) : null, value.runPanelUrl ? (_jsx(LinkText, { url: value.runPanelUrl, ctx: ctx, children: "run panel" })) : null] }));
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
export function FilePreviewBlock({ value, ctx }) {
    const theme = useTheme();
    const mono = { fontFamily: ctx.codeFontFamily ?? DEFAULT_CODE_FONT };
    return (_jsx(Card, { accent: "none", children: _jsxs(View, { style: styles.row, children: [value.thumbnailUrl ? (_jsx(Image, { source: { uri: value.thumbnailUrl }, style: [styles.thumb, { backgroundColor: theme.colors.surfaceVariant }], accessibilityIgnoresInvertColors: true })) : (_jsx(View, { style: [styles.thumb, styles.center, { backgroundColor: theme.colors.surfaceVariant }], children: _jsx(Text, { variant: "labelSmall", style: mono, children: value.mime.split("/")[1]?.slice(0, 4).toUpperCase() || "FILE" }) })), _jsxs(View, { style: styles.grow, children: [_jsx(Text, { variant: "bodyMedium", style: { fontWeight: "600" }, testID: `file-${value.fileId}`, children: value.name }), _jsxs(Text, { variant: "bodySmall", style: { color: theme.colors.onSurfaceVariant }, children: [value.mime || "file", " \u00B7 ", formatBytes(value.size)] })] })] }) }));
}
const styles = StyleSheet.create({
    card: { borderWidth: 1, borderLeftWidth: 3, padding: 12, gap: 8 },
    row: { flexDirection: "row", alignItems: "center", gap: 8 },
    wrap: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 },
    stack: { gap: 4 },
    labelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    mark: { width: 22, paddingTop: 2 },
    grow: { flex: 1, minWidth: 0, gap: 4 },
    fields: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    field: { minWidth: 140, flexGrow: 1 },
    button: { alignSelf: "flex-start" },
    chip: { height: 24, alignSelf: "flex-start" },
    chipText: { fontSize: 11, lineHeight: 14, marginVertical: 0 },
    progress: { height: 4, borderRadius: 2, marginBottom: 4 },
    step: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
    pre: { padding: 8, borderRadius: 6, marginTop: 4 },
    thumb: { width: 56, height: 56, borderRadius: 6 },
    center: { alignItems: "center", justifyContent: "center" },
});
