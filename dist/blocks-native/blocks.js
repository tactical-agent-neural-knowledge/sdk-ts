import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Alert, Image, Linking, StyleSheet, View } from "react-native";
import { Button, Chip, Divider, ProgressBar, Text, useTheme } from "react-native-paper";
import { ButtonStyle, CheckState, GateKind, StepStatus } from "../contracts/tank/blocks/v1/blocks_pb.js";
import { shades } from "../design/tokens.js";
import { DEFAULT_CODE_FONT } from "./context.js";
import { RichTextViewNative } from "./RichTextViewNative.js";
/** Accent colours from the Paper theme: purple (secondary) = agent execution, cyan (primary) = AI/context, amber (tertiary) = needs a human. */
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
export function Card({ accent, children, label }) {
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
        ], children: [label ? (_jsx(Text, { variant: "labelSmall", style: {
                    color: accent === "none" ? theme.colors.onSurfaceVariant : color,
                    textTransform: "uppercase",
                }, children: label })) : null, children] }));
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
    const theme = useTheme();
    const codeFont = ctx.codeFontFamily ?? DEFAULT_CODE_FONT;
    const done = value.steps.filter((s) => s.status === StepStatus.DONE).length;
    return (_jsxs(Card, { accent: "agent", label: `Plan · v${value.version}${value.planHash ? ` · ${value.planHash}` : ""}`, children: [_jsx(Text, { variant: "bodyLarge", children: value.summary }), value.steps.length > 0 ? (_jsxs(View, { style: styles.stack, children: [_jsx(ProgressBar, { progress: done / value.steps.length, color: theme.colors.secondary, style: styles.progress, accessibilityLabel: `${done} of ${value.steps.length} steps done` }), value.steps.map((s) => {
                        const g = STEP_GLYPH[s.status] ?? STEP_GLYPH[StepStatus.PENDING];
                        return (_jsxs(View, { style: styles.step, testID: `step-${g.label}`, children: [_jsx(Text, { style: { color: stepColor(theme, s.status), fontFamily: codeFont, width: 16 }, children: g.glyph }), _jsxs(View, { style: styles.grow, children: [_jsx(Text, { variant: "bodyMedium", children: s.title }), s.files.length > 0 ? (_jsx(Text, { variant: "bodySmall", style: { color: theme.colors.onSurfaceVariant, fontFamily: codeFont }, children: s.files.join("  ") })) : null] })] }, s.id));
                    })] })) : null, value.risks.length > 0 ? (_jsx(BulletList, { title: "Risks", items: value.risks, color: theme.colors.tertiary })) : null, value.questions.length > 0 ? (_jsx(BulletList, { title: "Questions", items: value.questions, color: theme.colors.primary })) : null, value.approverIds.length > 0 ? (_jsxs(Text, { variant: "bodySmall", style: { color: theme.colors.onSurfaceVariant }, children: ["Approvers: ", value.approverIds.join(", ")] })) : null] }));
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
};
export function ApprovalPromptBlock({ value, ctx }) {
    const theme = useTheme();
    const expires = tsMs(value.expiresAt);
    const fmt = ctx.formatTime ?? ((ms) => new Date(ms).toISOString());
    const fire = (actionId) => ctx.onAction?.({ blockId: ctx.blockId, actionId, value: value.gateId });
    return (_jsxs(Card, { accent: "alert", label: GATE_LABEL[value.kind] ?? "approval", children: [_jsx(Text, { variant: "bodyLarge", children: value.subject }), _jsxs(Text, { variant: "bodySmall", style: { color: theme.colors.onSurfaceVariant }, children: [value.minApprovals, " approval", value.minApprovals === 1 ? "" : "s", " needed", value.approverIds.length ? ` from ${value.approverIds.join(", ")}` : "", expires !== undefined && !value.decided ? ` · expires ${fmt(expires)}` : ""] }), value.decided ? (_jsx(ToneChip, { tone: value.decision === "approved" ? "success" : value.decision === "rejected" ? "error" : "muted", label: value.decision || "decided", testID: "approval-decision" })) : (_jsxs(View, { style: styles.wrap, children: [_jsx(Button, { compact: true, mode: "contained", onPress: () => fire("approve"), testID: "action-approve", style: styles.button, children: "Approve" }), _jsx(Button, { compact: true, mode: "outlined", textColor: theme.colors.error, onPress: () => fire("reject"), testID: "action-reject", style: styles.button, children: "Reject" })] }))] }));
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
