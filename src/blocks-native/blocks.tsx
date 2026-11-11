import { type ReactNode, useEffect, useState } from "react";
import { Alert, Image, Linking, Pressable, StyleSheet, View } from "react-native";
import { Button, Chip, Divider, type MD3Theme, ProgressBar, Text, useTheme } from "react-native-paper";
import { MARKS, planMark, stepMark } from "../blocks/marks.js";
import { planGlance, planMarkdown } from "../blocks/plan.js";
import { ACTION_REVEAL_KEY, REVEAL_COPIED, REVEAL_GONE } from "../blocks/reveal.js";
import type {
  Actions,
  ApprovalPrompt,
  Button as ButtonMsg,
  CheckState as CheckStateT,
  CiStatus,
  Context,
  DiffPreview,
  FilePreview,
  GuardrailCheck,
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
import { Mark } from "./Mark.js";
import { RichTextViewNative } from "./RichTextViewNative.js";

export type Accent = "agent" | "ai" | "alert" | "none";

/** Accent colours from the Paper theme: purple (secondary) = agent execution, cyan (primary) = AI/context, amber (tertiary) = needs a human. */

/** Approver ids as names where the host can name them; an id nobody can name stays an id. */
function names(
  ids: readonly string[],
  ctx: { resolveUser?: ((id: string) => string | undefined) | undefined },
): string {
  return ids.map((id) => ctx.resolveUser?.(id) || id).join(", ");
}

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
export function Card({
  accent,
  children,
  label,
  icon,
}: {
  accent: Accent;
  label?: string;
  /** Drawn before the label: a TANK mark, never an emoji. */
  icon?: ReactNode;
  children: ReactNode;
}) {
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
        <View style={styles.labelRow}>
          {icon}
          <Text
            variant="labelSmall"
            style={{
              color: accent === "none" ? theme.colors.onSurfaceVariant : color,
              textTransform: "uppercase",
            }}
          >
            {label}
          </Text>
        </View>
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
  if (button.actionId === ACTION_REVEAL_KEY) return <RevealKeyButton button={button} ctx={ctx} />;
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

/**
 * Copies a key a run made, through the host: the key goes from the server to the clipboard and
 * is never posted as an action. A refusal (somebody else, a second press, expired) is one line.
 */
function RevealKeyButton({ button, ctx }: { button: ButtonMsg; ctx: BlockContext }) {
  const theme = useTheme();
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [gone, setGone] = useState(false);
  const press = async () => {
    setBusy(true);
    let ok = false;
    try {
      ok = copied ? false : ((await ctx.revealKey?.(button.value)) ?? false);
    } catch {
      ok = false;
    }
    setBusy(false);
    if (ok) setCopied(true);
    else setGone(true);
  };
  return (
    <View>
      <Button
        compact
        mode="contained"
        onPress={() => void press()}
        disabled={busy}
        testID={`action-${button.actionId}`}
        accessibilityLabel={copied ? REVEAL_COPIED : button.text}
        style={styles.button}
      >
        {copied ? REVEAL_COPIED : button.text}
      </Button>
      {gone ? (
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }} testID="reveal-gone">
          {REVEAL_GONE}
        </Text>
      ) : null}
    </View>
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
  // At a glance by default: an emoji and a line per step. Tapping the text shows the whole
  // plan and tapping it again goes back; no button (Robby, 2026-10-25). A plan with no steps
  // has nothing to glance at and is shown whole.
  const [detail, setDetail] = useState(false);
  if (value.steps.length > 0 && !detail) {
    const g = planGlance(value.steps);
    return (
      <Card
        accent="agent"
        label={`${g.done}/${g.total}`}
        icon={<Mark kind={planMark(value.steps)} size={16} />}
      >
        <Pressable
          onPress={() => setDetail(true)}
          accessibilityRole="button"
          accessibilityLabel="Show the whole plan"
          accessibilityState={{ expanded: false }}
          testID="plan-glance"
          style={styles.stack}
        >
          {value.steps.map((s, i) => (
            <View
              key={s.id || i}
              style={styles.step}
              testID={`step-${(STEP_GLYPH[s.status] ?? STEP_GLYPH[StepStatus.PENDING]).label}`}
            >
              <View style={styles.mark}>
                <Mark kind={stepMark(s.status)} title={MARKS[stepMark(s.status)].label} />
              </View>
              <Text variant="bodyMedium" style={styles.grow}>
                {s.title}
              </Text>
            </View>
          ))}
        </Pressable>
        <PlanFileRow value={value} ctx={ctx} />
      </Card>
    );
  }
  return (
    <PlanCardDetail
      value={value}
      ctx={ctx}
      onToggle={value.steps.length > 0 ? () => setDetail(false) : undefined}
    />
  );
}

function PlanCardDetail({
  value,
  ctx,
  onToggle,
}: {
  value: PlanCard;
  ctx: BlockContext;
  onToggle?: () => void;
}) {
  const theme = useTheme();
  const codeFont = ctx.codeFontFamily ?? DEFAULT_CODE_FONT;
  const done = value.steps.filter((s) => s.status === StepStatus.DONE).length;
  return (
    <Card accent="agent" label={`Plan · v${value.version}${value.planHash ? ` · ${value.planHash}` : ""}`}>
      <Pressable
        onPress={onToggle}
        disabled={!onToggle}
        accessibilityRole={onToggle ? "button" : undefined}
        accessibilityState={onToggle ? { expanded: true } : undefined}
        testID="plan-detail"
        style={styles.stack}
      >
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
        {value.guardrails.length > 0 ? <GuardrailChecks checks={value.guardrails} ctx={ctx} /> : null}
        {value.approverIds.length > 0 ? (
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Approvers: {names(value.approverIds, ctx)}
          </Text>
        ) : null}
      </Pressable>
      <PlanFileRow value={value} ctx={ctx} />
    </Card>
  );
}

/**
 * Download and Add to Atlas under a plan (Robby, 2026-11-02): the plan as a Markdown file,
 * written by `planMarkdown` so both apps save and add the same document.
 */
function PlanFileRow({ value, ctx }: { value: PlanCard; ctx: BlockContext }) {
  const [adding, setAdding] = useState(false);
  const actions = ctx.planFile;
  if (!actions?.download && !actions?.addToAtlas) return null;
  const file = () => planMarkdown(value, ctx.resolveUser);
  return (
    <View style={styles.wrap} testID="plan-file">
      {actions.download ? (
        <Button
          compact
          icon="download-outline"
          onPress={() => void actions.download?.(file())}
          testID="plan-download"
        >
          Download
        </Button>
      ) : null}
      {actions.addToAtlas ? (
        <Button
          compact
          mode="outlined"
          icon="book-open-page-variant-outline"
          disabled={adding}
          loading={adding}
          onPress={async () => {
            setAdding(true);
            try {
              await actions.addToAtlas?.(file());
            } finally {
              setAdding(false);
            }
          }}
          testID="plan-atlas"
        >
          Add to Atlas
        </Button>
      ) : null}
    </View>
  );
}

const GUARDRAIL_NA = { glyph: "–", label: "not applicable" };
const GUARDRAIL_GLYPH: Record<string, { glyph: string; label: string }> = {
  met: { glyph: "✓", label: "met" },
  violated: { glyph: "✗", label: "conflict" },
  unsure: { glyph: "?", label: "unsure" },
  blocked: { glyph: "✗", label: "blocked" },
  not_applicable: GUARDRAIL_NA,
};

/** Whether a plan can be approved: not while a guardrail check is a conflict or a doubt. */
export function planConflicts(checks: GuardrailCheck[]): boolean {
  return checks.some((c) => c.state === "violated" || c.state === "unsure");
}

/** The plan card's Guardrails section: each guardrail met or in conflict, with the quoted reason. */
function GuardrailChecks({ checks, ctx }: { checks: GuardrailCheck[]; ctx: BlockContext }) {
  const theme = useTheme();
  const sem = semanticColors(theme);
  const codeFont = ctx.codeFontFamily ?? DEFAULT_CODE_FONT;
  const conflict = planConflicts(checks);
  const colorOf = (state: string) =>
    state === "met"
      ? sem.success
      : state === "unsure"
        ? theme.colors.tertiary
        : state === "not_applicable"
          ? theme.colors.onSurfaceVariant
          : sem.error;
  return (
    <View testID="plan-guardrails">
      <Text variant="labelLarge" style={{ color: conflict ? sem.error : sem.success }}>
        Guardrails
      </Text>
      {checks.map((c) => {
        const g = GUARDRAIL_GLYPH[c.state] ?? GUARDRAIL_NA;
        return (
          <View key={c.guardrailId || c.text} style={styles.step} testID={`guardrail-${c.state}`}>
            <Text
              style={{ color: colorOf(c.state), fontFamily: codeFont, width: 16 }}
              accessibilityLabel={g.label}
            >
              {g.glyph}
            </Text>
            <View style={styles.grow}>
              <Text variant="bodyMedium">
                {c.text}
                {c.judged ? (
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {"  watched"}
                  </Text>
                ) : null}
              </Text>
              {c.quote && c.state !== "met" ? (
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant, fontStyle: "italic" }}
                >
                  “{c.quote}”
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
      {conflict ? (
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          This plan cannot be approved as it is: ask for a new plan, or change the guardrail.
        </Text>
      ) : null}
    </View>
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
  [GateKind.GUARDRAIL]: "guardrail",
};

/**
 * A guardrail gate (phase 1): the run stopped at a guardrail and asks. Nothing is allowed
 * once, so there is no Approve: change the guardrail (guardrail.change carries its id and
 * the app opens the page), resume once it has changed (gate.approve, refused by the
 * control plane until then), or stop the run (gate.request_changes).
 */
function GuardrailPromptBlock({ value, ctx }: { value: ApprovalPrompt; ctx: BlockContext }) {
  const theme = useTheme();
  const fire = (actionId: "gate.approve" | "gate.request_changes" | "guardrail.change") =>
    ctx.onAction?.({
      blockId: ctx.blockId,
      actionId,
      value: actionId === "guardrail.change" ? value.guardrailId : value.gateId,
    });
  const platform = !value.guardrailId || value.guardrailId.startsWith("platform:");
  return (
    <Card accent="alert" label="guardrail">
      <Text variant="bodyLarge" testID="guardrail-text">
        {value.guardrailText || value.subject}
      </Text>
      {value.blocker ? (
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onSurfaceVariant }}
          testID="guardrail-blocker"
        >
          {value.blocker}
        </Text>
      ) : null}
      {value.decided ? (
        <ToneChip
          tone={value.decision === "approved" ? "success" : value.decision === "rejected" ? "error" : "muted"}
          label={
            value.decision === "approved"
              ? "resumed"
              : value.decision === "rejected"
                ? "stopped"
                : value.decision || "decided"
          }
          testID="approval-decision"
        />
      ) : (
        <View style={styles.wrap}>
          {!platform ? (
            <Button
              compact
              mode="contained"
              onPress={() => fire("guardrail.change")}
              testID="action-change-guardrail"
              style={styles.button}
            >
              Change the guardrail
            </Button>
          ) : null}
          {!platform ? (
            <Button
              compact
              mode="outlined"
              onPress={() => fire("gate.approve")}
              testID="action-resume"
              style={styles.button}
            >
              Resume the run
            </Button>
          ) : null}
          <Button
            compact
            mode="outlined"
            textColor={theme.colors.error}
            onPress={() => fire("gate.request_changes")}
            testID="action-stop"
            style={styles.button}
          >
            Stop the run
          </Button>
        </View>
      )}
    </Card>
  );
}

function isWebUrl(s: string): boolean {
  return /^https?:\/\/\S+$/.test(s.trim());
}

/**
 * A decision tapped and not yet reflected on the card (Robby, 2026-11-11: "the button didn't
 * update for 5-7 seconds and I kept tapping it"). The buttons lock at once and say what is
 * happening; they unlock when the card comes back decided, or after 20 s so a lost tap can be
 * retried.
 */
function usePendingDecision(decided: boolean): [string | null, (which: string) => void] {
  const [pending, setPending] = useState<string | null>(null);
  useEffect(() => {
    if (decided) setPending(null);
  }, [decided]);
  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => setPending(null), 20000);
    return () => clearTimeout(t);
  }, [pending]);
  return [pending, setPending];
}

export function ApprovalPromptBlock({ value, ctx }: { value: ApprovalPrompt; ctx: BlockContext }) {
  const theme = useTheme();
  const expires = tsMs(value.expiresAt);
  const fmt = ctx.formatTime ?? ((ms: number) => new Date(ms).toISOString());
  const [pending, setPending] = usePendingDecision(value.decided);
  if (value.kind === GateKind.GUARDRAIL) return <GuardrailPromptBlock value={value} ctx={ctx} />;
  // The ids the control plane answers to (agent-control/internal/cards: gate.approve,
  // gate.request_changes). These sent "approve" / "reject" until 2026-10-15 and were
  // ignored, which is why every approval card carried a second pair of buttons.
  const fire = (actionId: "gate.approve" | "gate.request_changes") => {
    if (pending) return;
    setPending(actionId);
    ctx.onAction?.({ blockId: ctx.blockId, actionId, value: value.gateId });
  };
  return (
    <Card accent="alert" label={GATE_LABEL[value.kind] ?? "approval"}>
      {/* A merge's subject is its pull request: a link before and after the decision
          (Robby, 2026-11-01). */}
      {isWebUrl(value.subject) ? (
        <LinkText url={value.subject.trim()} ctx={ctx}>
          {value.subject}
        </LinkText>
      ) : (
        <Text variant="bodyLarge">{value.subject}</Text>
      )}
      {value.detail ? (
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }} testID="approval-detail">
          {value.detail}
        </Text>
      ) : (
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {value.minApprovals} approval{value.minApprovals === 1 ? "" : "s"} needed
          {value.approverIds.length ? ` from ${names(value.approverIds, ctx)}` : ""}
          {expires !== undefined && !value.decided ? ` · expires ${fmt(expires)}` : ""}
        </Text>
      )}
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
            onPress={() => fire("gate.approve")}
            disabled={pending !== null}
            loading={pending === "gate.approve"}
            testID="action-approve"
            style={styles.button}
          >
            {pending === "gate.approve" ? "Approving…" : value.approveLabel || "Approve"}
          </Button>
          <Button
            compact
            mode="outlined"
            textColor={theme.colors.error}
            onPress={() => fire("gate.request_changes")}
            disabled={pending !== null}
            loading={pending === "gate.request_changes"}
            testID="action-reject"
            style={styles.button}
          >
            {pending === "gate.request_changes" ? "Sending…" : value.rejectLabel || "Reject"}
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
