import type { ReactNode } from "react";
import { Alert, Image, Linking, StyleSheet, View } from "react-native";
import { Button, Chip, Divider, type MD3Theme, ProgressBar, Text, useTheme } from "react-native-paper";
import type {
  Actions,
  ApprovalPrompt,
  Button as ButtonMsg,
  CheckState as CheckStateT,
  CiStatus,
  Context,
  DiffPreview,
  FilePreview,
  Header,
  PlanCard,
  Section,
  StatusCard,
  StepStatus as StepStatusT,
  ToolLog,
} from "../contracts/tank/blocks/v1/blocks_pb.js";
import { ButtonStyle, CheckState, GateKind, StepStatus } from "../contracts/tank/blocks/v1/blocks_pb.js";
import { shades } from "../design/tokens.js";
import { type BlockContext, DEFAULT_CODE_FONT } from "./context.js";
import { RichTextViewNative } from "./RichTextViewNative.js";

export type Accent = "agent" | "ai" | "alert" | "none";

/** Accent colours from the Paper theme: purple (secondary) = agent execution, cyan (primary) = AI/context, amber (tertiary) = needs a human. */
export function accentColor(theme: MD3Theme, accent: Accent): string {
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
export function semanticColors(theme: MD3Theme): { success: string; error: string; muted: string } {
  return {
    success: theme.dark ? shades.success.main : shades.success.onLight,
    error: theme.colors.error,
    muted: theme.colors.onSurfaceDisabled,
  };
}

export type ChipTone = "agent" | "ai" | "alert" | "success" | "error" | "muted";

/** Flat chip colours per tone (tinted background, readable foreground); `muted` renders outlined. */
export function chipColors(theme: MD3Theme, tone: ChipTone): { bg: string; fg: string; outlined: boolean } {
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

export function ToneChip({ tone, label, testID }: { tone: ChipTone; label: string; testID?: string }) {
  const theme = useTheme();
  const c = chipColors(theme, tone);
  return (
    <Chip
      compact
      mode={c.outlined ? "outlined" : "flat"}
      style={[styles.chip, { backgroundColor: c.bg, borderColor: c.fg }]}
      textStyle={[styles.chipText, { color: c.fg }]}
      testID={testID}
      accessibilityLabel={label}
    >
      {label}
    </Chip>
  );
}

function tsMs(t: { seconds: bigint; nanos: number } | undefined): number | undefined {
  return t ? Number(t.seconds) * 1000 + Math.floor(t.nanos / 1e6) : undefined;
}

function LinkText({ url, children, ctx }: { url: string; children: ReactNode; ctx: BlockContext }) {
  const theme = useTheme();
  const open = ctx.openUrl ?? ((u: string) => void Linking.openURL(u));
  return (
    <Text
      variant="bodyMedium"
      style={{ color: theme.colors.primary, textDecorationLine: "underline" }}
      onPress={() => open(url)}
      accessibilityRole="link"
      testID={`link-${url}`}
    >
      {children}
    </Text>
  );
}

/** Accent stripe card: purple = agent execution, cyan = AI/context, amber = needs a human. */
export function Card({ accent, children, label }: { accent: Accent; label?: string; children: ReactNode }) {
  const theme = useTheme();
  const color = accentColor(theme, accent);
  return (
    <View
      testID={`card-${accent}`}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
          borderLeftColor: color,
          borderRadius: theme.roundness * 2,
        },
      ]}
    >
      {label ? (
        <Text
          variant="labelSmall"
          style={{
            color: accent === "none" ? theme.colors.onSurfaceVariant : color,
            textTransform: "uppercase",
          }}
        >
          {label}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

// ------------------------------------------------------------------ simple blocks

export function HeaderBlock({ value }: { value: Header }) {
  return (
    <Text variant="titleMedium" accessibilityRole="header">
      {value.text}
    </Text>
  );
}

export function SectionBlock({ value, ctx }: { value: Section; ctx: BlockContext }) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.grow}>
        <RichTextViewNative
          richText={value.text}
          resolveUser={ctx.resolveUser}
          resolveChannel={ctx.resolveChannel}
          codeFontFamily={ctx.codeFontFamily}
          openUrl={ctx.openUrl}
        />
        {value.fields.length > 0 ? (
          <View style={styles.fields}>
            {value.fields.map((f) => (
              <View key={f.label} style={styles.field}>
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {f.label}
                </Text>
                <Text variant="bodyMedium">{f.value}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
      {value.accessory ? <ActionButton button={value.accessory} ctx={ctx} /> : null}
    </View>
  );
}

export function ContextBlock({ value, ctx }: { value: Context; ctx: BlockContext }) {
  return (
    <View style={styles.wrap}>
      {value.elements.map((e, i) => (
        <RichTextViewNative
          key={i}
          richText={e}
          variant="bodySmall"
          resolveUser={ctx.resolveUser}
          resolveChannel={ctx.resolveChannel}
          codeFontFamily={ctx.codeFontFamily}
          openUrl={ctx.openUrl}
        />
      ))}
    </View>
  );
}

export function DividerBlock() {
  return <Divider />;
}

// ------------------------------------------------------------------ buttons

export function ActionButton({ button, ctx }: { button: ButtonMsg; ctx: BlockContext }) {
  const theme = useTheme();
  const danger = button.style === ButtonStyle.DANGER;
  const mode = button.style === ButtonStyle.UNSPECIFIED ? "outlined" : "contained";
  const color = danger ? { buttonColor: theme.colors.error, textColor: theme.colors.onError } : {};
  const fire = () => ctx.onAction?.({ blockId: ctx.blockId, actionId: button.actionId, value: button.value });
  const open = ctx.openUrl ?? ((u: string) => void Linking.openURL(u));
  const onPress = () => {
    if (button.url) return open(button.url);
    if (!button.confirm) return fire();
    Alert.alert(button.confirm.title, button.confirm.text, [
      { text: button.confirm.deny || "Cancel", style: "cancel" },
      { text: button.confirm.confirm || "Confirm", style: danger ? "destructive" : "default", onPress: fire },
    ]);
  };
  return (
    <Button
      compact
      mode={mode}
      {...color}
      onPress={onPress}
      testID={`action-${button.actionId || button.url}`}
      accessibilityLabel={button.text}
      style={styles.button}
    >
      {button.text}
    </Button>
  );
}

export function ActionsBlock({ value, ctx }: { value: Actions; ctx: BlockContext }) {
  return (
    <View style={styles.wrap}>
      {value.buttons.map((b, i) => (
        <ActionButton key={b.actionId || b.url || i} button={b} ctx={ctx} />
      ))}
    </View>
  );
}

// ------------------------------------------------------------------ agent cards

const STEP_GLYPH: Record<StepStatusT, { glyph: string; label: string }> = {
  [StepStatus.UNSPECIFIED]: { glyph: "○", label: "pending" },
  [StepStatus.PENDING]: { glyph: "○", label: "pending" },
  [StepStatus.RUNNING]: { glyph: "◐", label: "running" },
  [StepStatus.DONE]: { glyph: "●", label: "done" },
  [StepStatus.FAILED]: { glyph: "✕", label: "failed" },
  [StepStatus.SKIPPED]: { glyph: "–", label: "skipped" },
};

function stepColor(theme: MD3Theme, status: StepStatusT): string {
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

export function PlanCardBlock({ value, ctx }: { value: PlanCard; ctx: BlockContext }) {
  const theme = useTheme();
  const codeFont = ctx.codeFontFamily ?? DEFAULT_CODE_FONT;
  const done = value.steps.filter((s) => s.status === StepStatus.DONE).length;
  return (
    <Card accent="agent" label={`Plan · v${value.version}${value.planHash ? ` · ${value.planHash}` : ""}`}>
      <Text variant="bodyLarge">{value.summary}</Text>
      {value.steps.length > 0 ? (
        <View style={styles.stack}>
          <ProgressBar
            progress={done / value.steps.length}
            color={theme.colors.secondary}
            style={styles.progress}
            accessibilityLabel={`${done} of ${value.steps.length} steps done`}
          />
          {value.steps.map((s) => {
            const g = STEP_GLYPH[s.status] ?? STEP_GLYPH[StepStatus.PENDING];
            return (
              <View key={s.id} style={styles.step} testID={`step-${g.label}`}>
                <Text style={{ color: stepColor(theme, s.status), fontFamily: codeFont, width: 16 }}>
                  {g.glyph}
                </Text>
                <View style={styles.grow}>
                  <Text variant="bodyMedium">{s.title}</Text>
                  {s.files.length > 0 ? (
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.onSurfaceVariant, fontFamily: codeFont }}
                    >
                      {s.files.join("  ")}
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      ) : null}
      {value.risks.length > 0 ? (
        <BulletList title="Risks" items={value.risks} color={theme.colors.tertiary} />
      ) : null}
      {value.questions.length > 0 ? (
        <BulletList title="Questions" items={value.questions} color={theme.colors.primary} />
      ) : null}
      {value.approverIds.length > 0 ? (
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          Approvers: {value.approverIds.join(", ")}
        </Text>
      ) : null}
    </Card>
  );
}

function BulletList({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <View>
      <Text variant="labelLarge" style={{ color }}>
        {title}
      </Text>
      {items.map((r) => (
        <Text variant="bodyMedium" key={r}>
          • {r}
        </Text>
      ))}
    </View>
  );
}

export function DiffPreviewBlock({ value, ctx }: { value: DiffPreview; ctx: BlockContext }) {
  const theme = useTheme();
  const sem = semanticColors(theme);
  const mono = { fontFamily: ctx.codeFontFamily ?? DEFAULT_CODE_FONT };
  return (
    <Card accent="agent" label={`Diff · ${value.commitSha.slice(0, 7)}`}>
      <View style={styles.wrap}>
        <Text variant="bodyMedium" style={mono}>
          {value.files.length} file{value.files.length === 1 ? "" : "s"}
        </Text>
        <Text variant="bodyMedium" style={[mono, { color: sem.success }]}>
          +{value.totalAdditions}
        </Text>
        <Text variant="bodyMedium" style={[mono, { color: sem.error }]}>
          −{value.totalDeletions}
        </Text>
        {value.compareUrl ? (
          <LinkText url={value.compareUrl} ctx={ctx}>
            compare
          </LinkText>
        ) : null}
      </View>
      {value.files.map((f) => (
        <View key={f.path} testID={`diff-${f.path}`}>
          <View style={styles.wrap}>
            <Text variant="bodyMedium" style={[mono, styles.grow]}>
              {f.path}
            </Text>
            <Text variant="bodySmall" style={[mono, { color: sem.success }]}>
              +{f.additions}
            </Text>
            <Text variant="bodySmall" style={[mono, { color: sem.error }]}>
              −{f.deletions}
            </Text>
          </View>
          {f.hunkPreview ? (
            <View style={[styles.pre, { backgroundColor: theme.colors.surfaceVariant }]}>
              {f.hunkPreview.split("\n").map((line, i) => (
                <Text
                  key={i}
                  variant="bodySmall"
                  style={[
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
                  ]}
                >
                  {line}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      ))}
    </Card>
  );
}

const CHECK_CHIP: Record<CheckStateT, { label: string; tone: ChipTone }> = {
  [CheckState.UNSPECIFIED]: { label: "unknown", tone: "muted" },
  [CheckState.QUEUED]: { label: "queued", tone: "muted" },
  [CheckState.RUNNING]: { label: "running", tone: "ai" },
  [CheckState.SUCCESS]: { label: "success", tone: "success" },
  [CheckState.FAILURE]: { label: "failure", tone: "error" },
  [CheckState.CANCELLED]: { label: "cancelled", tone: "alert" },
};

export function CiStatusBlock({ value, ctx }: { value: CiStatus; ctx: BlockContext }) {
  const theme = useTheme();
  const failed = value.checks.some((c) => c.state === CheckState.FAILURE);
  const running = value.checks.some((c) => c.state === CheckState.RUNNING || c.state === CheckState.QUEUED);
  const accent: Accent = failed ? "alert" : running ? "ai" : "agent";
  const summary = failed ? "CI red" : running ? "CI running" : "CI green";
  const mono = { fontFamily: ctx.codeFontFamily ?? DEFAULT_CODE_FONT };
  return (
    <Card accent={accent} label={`${summary} · ${value.headSha.slice(0, 7)}`}>
      {value.prUrl ? (
        <LinkText url={value.prUrl} ctx={ctx}>
          PR #{value.prNumber}
        </LinkText>
      ) : null}
      {value.checks.map((c) => {
        const chip = CHECK_CHIP[c.state] ?? CHECK_CHIP[CheckState.UNSPECIFIED];
        return (
          <View key={c.name} testID={`check-${chip.label}`}>
            <View style={styles.row}>
              <ToneChip tone={chip.tone} label={chip.label} />
              {c.url ? (
                <LinkText url={c.url} ctx={ctx}>
                  {c.name}
                </LinkText>
              ) : (
                <Text variant="bodyMedium">{c.name}</Text>
              )}
            </View>
            {c.failureExcerpt ? (
              <View style={[styles.pre, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Text variant="bodySmall" style={[mono, { color: theme.colors.error }]}>
                  {c.failureExcerpt}
                </Text>
              </View>
            ) : null}
          </View>
        );
      })}
    </Card>
  );
}

const GATE_LABEL: Record<number, string> = {
  [GateKind.UNSPECIFIED]: "approval",
  [GateKind.PLAN]: "plan approval",
  [GateKind.SCOPE_CHANGE]: "scope change",
  [GateKind.MERGE]: "merge approval",
  [GateKind.DEPLOY]: "deploy approval",
  [GateKind.DESTRUCTIVE_TOOL]: "destructive tool",
  [GateKind.BUDGET_INCREASE]: "budget increase",
};

export function ApprovalPromptBlock({ value, ctx }: { value: ApprovalPrompt; ctx: BlockContext }) {
  const theme = useTheme();
  const expires = tsMs(value.expiresAt);
  const fmt = ctx.formatTime ?? ((ms: number) => new Date(ms).toISOString());
  const fire = (actionId: "approve" | "reject") =>
    ctx.onAction?.({ blockId: ctx.blockId, actionId, value: value.gateId });
  return (
    <Card accent="alert" label={GATE_LABEL[value.kind] ?? "approval"}>
      <Text variant="bodyLarge">{value.subject}</Text>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
        {value.minApprovals} approval{value.minApprovals === 1 ? "" : "s"} needed
        {value.approverIds.length ? ` from ${value.approverIds.join(", ")}` : ""}
        {expires !== undefined && !value.decided ? ` · expires ${fmt(expires)}` : ""}
      </Text>
      {value.decided ? (
        <ToneChip
          tone={value.decision === "approved" ? "success" : value.decision === "rejected" ? "error" : "muted"}
          label={value.decision || "decided"}
          testID="approval-decision"
        />
      ) : (
        <View style={styles.wrap}>
          <Button
            compact
            mode="contained"
            onPress={() => fire("approve")}
            testID="action-approve"
            style={styles.button}
          >
            Approve
          </Button>
          <Button
            compact
            mode="outlined"
            textColor={theme.colors.error}
            onPress={() => fire("reject")}
            testID="action-reject"
            style={styles.button}
          >
            Reject
          </Button>
        </View>
      )}
    </Card>
  );
}

export function ToolLogBlock({ value, ctx }: { value: ToolLog; ctx: BlockContext }) {
  const theme = useTheme();
  const sem = semanticColors(theme);
  const fmt = ctx.formatTime ?? ((ms: number) => new Date(ms).toISOString().slice(11, 19));
  const mono = { fontFamily: ctx.codeFontFamily ?? DEFAULT_CODE_FONT };
  return (
    <Card accent="agent" label={`Agent · ${value.phase}`}>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
        {value.toolCalls} tool call{value.toolCalls === 1 ? "" : "s"} · {value.filesEdited} file
        {value.filesEdited === 1 ? "" : "s"} edited
      </Text>
      {value.runPanelUrl ? (
        <LinkText url={value.runPanelUrl} ctx={ctx}>
          run panel
        </LinkText>
      ) : null}
      {value.recent.map((e, i) => {
        const at = tsMs(e.at);
        const color = e.ok ? theme.colors.onSurface : sem.error;
        return (
          <View key={i} style={styles.row} testID={`tool-${e.ok ? "ok" : "failed"}`}>
            <Text variant="bodySmall" style={[mono, { color: sem.muted }]}>
              {at !== undefined ? fmt(at) : "--:--:--"}
            </Text>
            <Text
              variant="bodySmall"
              style={[mono, { color: theme.dark ? shades.purple.text : theme.colors.secondary }]}
            >
              {e.tool}
            </Text>
            <Text variant="bodySmall" style={[mono, styles.grow, { color }]}>
              {e.summary}
            </Text>
          </View>
        );
      })}
    </Card>
  );
}

export function StatusCardBlock({ value, ctx }: { value: StatusCard; ctx: BlockContext }) {
  const theme = useTheme();
  const started = tsMs(value.startedAt);
  const fmt = ctx.formatTime ?? ((ms: number) => new Date(ms).toISOString());
  const terminal = /^(done|merged|failed|cancelled|timed_out|budget_exhausted|approval_expired)$/.test(
    value.state,
  );
  const bad = /^(failed|cancelled|timed_out|budget_exhausted|approval_expired)$/.test(value.state);
  const mono = { fontFamily: ctx.codeFontFamily ?? DEFAULT_CODE_FONT };
  return (
    <Card accent={bad ? "alert" : "agent"} label={`Run · ${value.runId}`}>
      <View style={styles.wrap}>
        <ToneChip
          tone={bad ? "error" : terminal ? "success" : "agent"}
          label={value.state.replaceAll("_", " ")}
          testID="run-state"
        />
        {value.branch ? (
          <Text variant="bodyMedium" style={mono}>
            {value.branch}
          </Text>
        ) : null}
        {value.costUsd > 0 ? (
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            ${value.costUsd.toFixed(2)}
          </Text>
        ) : null}
      </View>
      {value.detail ? <Text variant="bodyMedium">{value.detail}</Text> : null}
      {started !== undefined ? (
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          started {fmt(started)}
        </Text>
      ) : null}
      {value.runPanelUrl ? (
        <LinkText url={value.runPanelUrl} ctx={ctx}>
          run panel
        </LinkText>
      ) : null}
    </Card>
  );
}

function formatBytes(n: bigint): string {
  const v = Number(n);
  if (v < 1024) return `${v} B`;
  if (v < 1024 * 1024) return `${(v / 1024).toFixed(1)} KB`;
  if (v < 1024 * 1024 * 1024) return `${(v / 1024 / 1024).toFixed(1)} MB`;
  return `${(v / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function FilePreviewBlock({ value, ctx }: { value: FilePreview; ctx: BlockContext }) {
  const theme = useTheme();
  const mono = { fontFamily: ctx.codeFontFamily ?? DEFAULT_CODE_FONT };
  return (
    <Card accent="none">
      <View style={styles.row}>
        {value.thumbnailUrl ? (
          <Image
            source={{ uri: value.thumbnailUrl }}
            style={[styles.thumb, { backgroundColor: theme.colors.surfaceVariant }]}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View style={[styles.thumb, styles.center, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text variant="labelSmall" style={mono}>
              {value.mime.split("/")[1]?.slice(0, 4).toUpperCase() || "FILE"}
            </Text>
          </View>
        )}
        <View style={styles.grow}>
          <Text variant="bodyMedium" style={{ fontWeight: "600" }} testID={`file-${value.fileId}`}>
            {value.name}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {value.mime || "file"} · {formatBytes(value.size)}
          </Text>
        </View>
      </View>
    </Card>
  );
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
