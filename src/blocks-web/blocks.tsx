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
import { type ReactNode, useEffect, useState } from "react";
import { MARKS, planMark, stepMark } from "../blocks/marks.js";
import { type PlanFileActions, planGlance, planMarkdown } from "../blocks/plan.js";
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
import { typography } from "../design/tokens.js";
import { Mark } from "./Mark.js";
import { RichTextView, type RichTextViewProps } from "./RichTextView.js";

/** Posted when a user interacts with a block; pair with `TankClient.postBlockAction`. */
export interface BlockActionEvent {
  blockId: string;
  actionId: string;
  value: string;
}

export interface BlockContext extends Pick<RichTextViewProps, "resolveUser" | "resolveChannel"> {
  blockId: string;
  onAction?: (action: BlockActionEvent) => void;
  /** Format a timestamp (ms) for display. Default: locale time. */
  formatTime?: (ms: number) => string;
  /** Download and Add to Atlas on a plan card; each button shows only when its action is given. */
  planFile?: PlanFileActions | undefined;
  /**
   * A "Copy key" button (`neural.key.reveal`): redeem the reveal id with
   * `NeuralKeyService.RevealApiKey` and put the key on the clipboard, resolving true once it is
   * there. Without it the button says the key can no longer be shown.
   */
  revealKey?: ((revealId: string) => Promise<boolean>) | undefined;
}

// Branch names, run ids and diagnostic codes are single unbroken tokens that
// are wider than a phone. Without this they push the card sideways and the
// message list scrolls horizontally.
const mono = {
  fontFamily: typography.fontCode,
  fontSize: "0.8125rem",
  overflowWrap: "anywhere",
  minWidth: 0,
} as const;

/** Approver ids as names where the host can name them; an id nobody can name stays an id. */
function names(
  ids: readonly string[],
  ctx: { resolveUser?: ((id: string) => string | undefined) | undefined },
): string {
  return ids.map((id) => ctx.resolveUser?.(id) || id).join(", ");
}

function tsMs(t: { seconds: bigint; nanos: number } | undefined): number | undefined {
  return t ? Number(t.seconds) * 1000 + Math.floor(t.nanos / 1e6) : undefined;
}

/** Accent stripe for agent cards: purple = agent execution, cyan = AI/context, amber = needs a human. */
export function Card({
  accent,
  children,
  label,
  icon,
}: {
  accent: "agent" | "ai" | "alert" | "none";
  label?: string;
  /** Drawn before the label: a TANK mark, never an emoji. */
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Box
      data-accent={accent}
      sx={{
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
      }}
    >
      {label ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          {icon}
          <Typography
            variant="overline"
            sx={{ color: accent === "none" ? "text.secondary" : `tank.${accent}`, lineHeight: 1.5 }}
          >
            {label}
          </Typography>
        </Box>
      ) : null}
      {children}
    </Box>
  );
}

// ------------------------------------------------------------------ simple blocks

export function HeaderBlock({ value }: { value: Header }) {
  return (
    <Typography variant="h6" component="h3" sx={{ m: 0 }}>
      {value.text}
    </Typography>
  );
}

export function SectionBlock({ value, ctx }: { value: Section; ctx: BlockContext }) {
  return (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
        <RichTextView
          richText={value.text}
          resolveUser={ctx.resolveUser}
          resolveChannel={ctx.resolveChannel}
        />
        {value.fields.length > 0 ? (
          <Box
            component="dl"
            sx={{
              m: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 1,
            }}
          >
            {value.fields.map((f) => (
              <Box key={f.label}>
                <Typography component="dt" variant="caption" color="text.secondary">
                  {f.label}
                </Typography>
                <Typography component="dd" variant="body2" sx={{ m: 0 }}>
                  {f.value}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : null}
      </Box>
      {value.accessory ? <ActionButton button={value.accessory} ctx={ctx} /> : null}
    </Stack>
  );
}

export function ContextBlock({ value, ctx }: { value: Context; ctx: BlockContext }) {
  return (
    <Box sx={{ color: "text.secondary", display: "flex", flexWrap: "wrap", gap: 1 }}>
      {value.elements.map((e, i) => (
        <RichTextView
          key={i}
          richText={e}
          variant="caption"
          resolveUser={ctx.resolveUser}
          resolveChannel={ctx.resolveChannel}
        />
      ))}
    </Box>
  );
}

export function DividerBlock() {
  return <Divider />;
}

// ------------------------------------------------------------------ buttons

export function ActionButton({
  button,
  ctx,
  size = "small",
}: {
  button: ButtonMsg;
  ctx: BlockContext;
  size?: "small" | "medium";
}) {
  const [confirming, setConfirming] = useState(false);
  if (button.actionId === ACTION_REVEAL_KEY) return <RevealKeyButton button={button} ctx={ctx} size={size} />;
  const color =
    button.style === ButtonStyle.DANGER
      ? "error"
      : button.style === ButtonStyle.PRIMARY
        ? "primary"
        : "inherit";
  const variant = button.style === ButtonStyle.UNSPECIFIED ? "outlined" : "contained";
  const fire = () => ctx.onAction?.({ blockId: ctx.blockId, actionId: button.actionId, value: button.value });
  if (button.url) {
    return (
      <Button
        size={size}
        variant={variant}
        color={color}
        href={button.url}
        target="_blank"
        rel="noopener noreferrer"
        data-action-id={button.actionId}
      >
        {button.text}
      </Button>
    );
  }
  return (
    <>
      <Button
        size={size}
        variant={variant}
        color={color}
        data-action-id={button.actionId}
        onClick={() => (button.confirm ? setConfirming(true) : fire())}
      >
        {button.text}
      </Button>
      {button.confirm ? (
        <Dialog open={confirming} onClose={() => setConfirming(false)}>
          <DialogTitle>{button.confirm.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{button.confirm.text}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirming(false)}>{button.confirm.deny || "Cancel"}</Button>
            <Button
              color={color === "inherit" ? "primary" : color}
              variant="contained"
              onClick={() => {
                setConfirming(false);
                fire();
              }}
            >
              {button.confirm.confirm || "Confirm"}
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </>
  );
}

/**
 * Copies a key a run made, through the host: the key goes from the server to the clipboard and
 * is never posted as an action. A refusal (somebody else, a second press, expired) is one line.
 */
function RevealKeyButton({
  button,
  ctx,
  size,
}: {
  button: ButtonMsg;
  ctx: BlockContext;
  size: "small" | "medium";
}) {
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
    <Stack spacing={0.5} alignItems="flex-start">
      <Button
        size={size}
        variant="contained"
        color="primary"
        data-action-id={button.actionId}
        disabled={busy}
        onClick={() => void press()}
      >
        {copied ? REVEAL_COPIED : button.text}
      </Button>
      {gone ? (
        <Typography variant="caption" color="text.secondary" role="status" data-testid="reveal-gone">
          {REVEAL_GONE}
        </Typography>
      ) : null}
    </Stack>
  );
}

export function ActionsBlock({ value, ctx }: { value: Actions; ctx: BlockContext }) {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {value.buttons.map((b, i) => (
        <ActionButton key={b.actionId || b.url || i} button={b} ctx={ctx} />
      ))}
    </Stack>
  );
}

// ------------------------------------------------------------------ agent cards

const STEP_GLYPH: Record<StepStatusT, { glyph: string; color: string; label: string }> = {
  [StepStatus.UNSPECIFIED]: { glyph: "○", color: "text.disabled", label: "pending" },
  [StepStatus.PENDING]: { glyph: "○", color: "text.disabled", label: "pending" },
  [StepStatus.RUNNING]: { glyph: "◐", color: "tank.agent", label: "running" },
  [StepStatus.DONE]: { glyph: "●", color: "success.main", label: "done" },
  [StepStatus.FAILED]: { glyph: "✕", color: "error.main", label: "failed" },
  [StepStatus.SKIPPED]: { glyph: "–", color: "text.disabled", label: "skipped" },
};

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
        <Box
          component="ol"
          role="button"
          tabIndex={0}
          aria-expanded={false}
          aria-label="Show the whole plan"
          data-testid="plan-glance"
          onClick={() => setDetail(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setDetail(true);
            }
          }}
          sx={{
            m: 0,
            p: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            cursor: "pointer",
          }}
        >
          {value.steps.map((s, i) => (
            <Box
              component="li"
              key={s.id || i}
              data-step-status={(STEP_GLYPH[s.status] ?? STEP_GLYPH[StepStatus.PENDING]).label}
              sx={{ display: "flex", gap: 1, alignItems: "baseline" }}
            >
              <Box component="span" sx={{ width: "1.4em", flexShrink: 0, alignSelf: "flex-start", pt: 0.25 }}>
                <Mark kind={stepMark(s.status)} title={MARKS[stepMark(s.status)].label} />
              </Box>
              <Typography variant="body2" component="span" sx={{ minWidth: 0 }}>
                {s.title}
              </Typography>
            </Box>
          ))}
        </Box>
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
  const done = value.steps.filter((s) => s.status === StepStatus.DONE).length;
  // Selecting text to copy a file path must not fold the plan away.
  const toggle = onToggle
    ? () => {
        if (typeof window !== "undefined" && window.getSelection?.()?.toString()) return;
        onToggle();
      }
    : undefined;
  return (
    <Card accent="agent" label={`Plan · v${value.version}${value.planHash ? ` · ${value.planHash}` : ""}`}>
      <Box
        role={toggle ? "button" : undefined}
        tabIndex={toggle ? 0 : undefined}
        aria-expanded={toggle ? true : undefined}
        data-testid="plan-detail"
        onClick={toggle}
        onKeyDown={
          toggle
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle();
                }
              }
            : undefined
        }
        sx={{ display: "flex", flexDirection: "column", gap: 1.5, cursor: toggle ? "pointer" : undefined }}
      >
        <Typography variant="body1">{value.summary}</Typography>
        {value.steps.length > 0 ? (
          <Box>
            <LinearProgress
              variant="determinate"
              color="secondary"
              value={(done / value.steps.length) * 100}
              sx={{ mb: 1, height: 4, borderRadius: 2 }}
              aria-label={`${done} of ${value.steps.length} steps done`}
            />
            <Box
              component="ol"
              sx={{ m: 0, p: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 0.5 }}
            >
              {value.steps.map((s) => {
                const g = STEP_GLYPH[s.status] ?? STEP_GLYPH[StepStatus.PENDING];
                return (
                  <Box
                    component="li"
                    key={s.id}
                    data-step-status={g.label}
                    sx={{ display: "flex", gap: 1, alignItems: "baseline" }}
                  >
                    <Box
                      component="span"
                      aria-label={g.label}
                      sx={{ color: g.color, width: "1em", textAlign: "center", ...mono }}
                    >
                      {g.glyph}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" component="span">
                        {s.title}
                      </Typography>
                      {s.files.length > 0 ? (
                        <Typography variant="caption" component="div" color="text.secondary" sx={mono}>
                          {s.files.join("  ")}
                        </Typography>
                      ) : null}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        ) : null}
        {value.risks.length > 0 ? (
          <BulletList title="Risks" items={value.risks} color="tank.warningText" />
        ) : null}
        {value.questions.length > 0 ? (
          <BulletList title="Questions" items={value.questions} color="tank.primaryText" />
        ) : null}
        {value.guardrails.length > 0 ? <GuardrailChecks checks={value.guardrails} /> : null}
        {value.approverIds.length > 0 ? (
          <Typography variant="caption" color="text.secondary">
            Approvers: {names(value.approverIds, ctx)}
          </Typography>
        ) : null}
      </Box>
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
    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }} data-testid="plan-file">
      {actions.download ? (
        <Button size="small" onClick={() => void actions.download?.(file())} data-testid="plan-download">
          Download
        </Button>
      ) : null}
      {actions.addToAtlas ? (
        <Button
          size="small"
          variant="outlined"
          disabled={adding}
          onClick={async () => {
            setAdding(true);
            try {
              await actions.addToAtlas?.(file());
            } finally {
              setAdding(false);
            }
          }}
          data-testid="plan-atlas"
        >
          Add to Atlas
        </Button>
      ) : null}
    </Stack>
  );
}

/** How a guardrail's check reads on a card: the mark, the word, and the color it sits in. */
const GUARDRAIL_NA = { glyph: "–", label: "not applicable", color: "text.secondary" };
export const GUARDRAIL_STATE: Record<string, { glyph: string; label: string; color: string }> = {
  met: { glyph: "✓", label: "met", color: "tank.successText" },
  violated: { glyph: "✗", label: "conflict", color: "tank.errorText" },
  unsure: { glyph: "?", label: "unsure", color: "tank.warningText" },
  blocked: { glyph: "✗", label: "blocked", color: "tank.errorText" },
  not_applicable: GUARDRAIL_NA,
};

/** Whether a plan can be approved: not while a guardrail check is a conflict or a doubt. */
export function planConflicts(checks: GuardrailCheck[]): boolean {
  return checks.some((c) => c.state === "violated" || c.state === "unsure");
}

/**
 * The plan card's Guardrails section (phase 1): each guardrail the run carries, met or in
 * conflict with the quoted reason. A conflict is why the plan cannot be approved as it is.
 */
function GuardrailChecks({ checks }: { checks: GuardrailCheck[] }) {
  const conflict = planConflicts(checks);
  return (
    <Box data-testid="plan-guardrails">
      <Typography variant="subtitle2" sx={{ color: conflict ? "tank.errorText" : "tank.successText" }}>
        Guardrails
      </Typography>
      <Box
        component="ul"
        sx={{ m: 0, p: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 0.25 }}
      >
        {checks.map((c) => {
          const st = GUARDRAIL_STATE[c.state] ?? GUARDRAIL_NA;
          return (
            <Box
              component="li"
              key={c.guardrailId || c.text}
              data-guardrail-state={c.state}
              sx={{ display: "flex", gap: 1, alignItems: "baseline" }}
            >
              <Box
                component="span"
                aria-label={st.label}
                sx={{ color: st.color, width: "1em", textAlign: "center", ...mono }}
              >
                {st.glyph}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" component="span">
                  {c.text}
                </Typography>
                {c.judged ? (
                  <Typography variant="caption" component="span" color="text.secondary" sx={{ ml: 0.75 }}>
                    watched
                  </Typography>
                ) : null}
                {c.quote && c.state !== "met" ? (
                  <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                    sx={{ fontStyle: "italic" }}
                  >
                    “{c.quote}”
                  </Typography>
                ) : null}
              </Box>
            </Box>
          );
        })}
      </Box>
      {conflict ? (
        <Typography variant="caption" component="div" color="text.secondary" sx={{ mt: 0.5 }}>
          This plan cannot be approved as it is: ask for a new plan, or change the guardrail.
        </Typography>
      ) : null}
    </Box>
  );
}

function BulletList({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ color }}>
        {title}
      </Typography>
      <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
        {items.map((r) => (
          <Typography component="li" variant="body2" key={r}>
            {r}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

export function DiffPreviewBlock({ value }: { value: DiffPreview }) {
  return (
    <Card accent="agent" label={`Diff · ${value.commitSha.slice(0, 7)}`}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Typography variant="body2" sx={mono}>
          {value.files.length} file{value.files.length === 1 ? "" : "s"}
        </Typography>
        <Typography variant="body2" sx={{ ...mono, color: "success.main" }}>
          +{value.totalAdditions}
        </Typography>
        <Typography variant="body2" sx={{ ...mono, color: "error.main" }}>
          −{value.totalDeletions}
        </Typography>
        {value.compareUrl ? (
          <Link href={value.compareUrl} target="_blank" rel="noopener noreferrer" variant="body2">
            compare
          </Link>
        ) : null}
      </Stack>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {value.files.map((f) => (
          <Box key={f.path} data-diff-file={f.path}>
            <Stack direction="row" spacing={1} alignItems="baseline">
              <Typography variant="body2" sx={{ ...mono, flex: 1, minWidth: 0, overflowWrap: "anywhere" }}>
                {f.path}
              </Typography>
              <Typography variant="caption" sx={{ ...mono, color: "success.main" }}>
                +{f.additions}
              </Typography>
              <Typography variant="caption" sx={{ ...mono, color: "error.main" }}>
                −{f.deletions}
              </Typography>
            </Stack>
            {f.hunkPreview ? (
              <Box
                component="pre"
                sx={{
                  m: 0,
                  mt: 0.5,
                  p: 1,
                  borderRadius: 1,
                  bgcolor: "tank.panel",
                  overflowX: "auto",
                  ...mono,
                  lineHeight: 1.45,
                }}
              >
                {f.hunkPreview.split("\n").map((line, i) => (
                  <Box
                    key={i}
                    component="span"
                    sx={{
                      display: "block",
                      color: line.startsWith("+")
                        ? "success.main"
                        : line.startsWith("-")
                          ? "error.main"
                          : line.startsWith("@@")
                            ? "tank.primaryText"
                            : "inherit",
                    }}
                  >
                    {line}
                  </Box>
                ))}
              </Box>
            ) : null}
          </Box>
        ))}
      </Box>
    </Card>
  );
}

const CHECK_CHIP: Record<
  CheckStateT,
  { label: string; color: "default" | "info" | "success" | "error" | "warning" }
> = {
  [CheckState.UNSPECIFIED]: { label: "unknown", color: "default" },
  [CheckState.QUEUED]: { label: "queued", color: "default" },
  [CheckState.RUNNING]: { label: "running", color: "info" },
  [CheckState.SUCCESS]: { label: "success", color: "success" },
  [CheckState.FAILURE]: { label: "failure", color: "error" },
  [CheckState.CANCELLED]: { label: "cancelled", color: "warning" },
};

export function CiStatusBlock({ value }: { value: CiStatus }) {
  const failed = value.checks.some((c) => c.state === CheckState.FAILURE);
  const running = value.checks.some((c) => c.state === CheckState.RUNNING || c.state === CheckState.QUEUED);
  const accent = failed ? "alert" : running ? "ai" : "agent";
  const summary = failed ? "CI red" : running ? "CI running" : "CI green";
  return (
    <Card accent={accent} label={`${summary} · ${value.headSha.slice(0, 7)}`}>
      {value.prUrl ? (
        <Link href={value.prUrl} target="_blank" rel="noopener noreferrer" variant="body2">
          PR #{value.prNumber}
        </Link>
      ) : null}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        {value.checks.map((c) => {
          const chip = CHECK_CHIP[c.state] ?? CHECK_CHIP[CheckState.UNSPECIFIED];
          return (
            <Box key={c.name} data-check={c.name} data-check-state={chip.label}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  size="small"
                  label={chip.label}
                  color={chip.color}
                  variant={chip.color === "default" ? "outlined" : "filled"}
                />
                {c.url ? (
                  <Link href={c.url} target="_blank" rel="noopener noreferrer" variant="body2">
                    {c.name}
                  </Link>
                ) : (
                  <Typography variant="body2">{c.name}</Typography>
                )}
              </Stack>
              {c.failureExcerpt ? (
                <Box
                  component="pre"
                  sx={{
                    m: 0,
                    mt: 0.5,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: "tank.panel",
                    overflowX: "auto",
                    ...mono,
                    color: "error.main",
                  }}
                >
                  {c.failureExcerpt}
                </Box>
              ) : null}
            </Box>
          );
        })}
      </Box>
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
 * once, so there is no Approve: change the guardrail (the client opens the page; action
 * guardrail.change carries the guardrail's id), resume once it has changed (gate.approve,
 * which the control plane refuses until then), or stop the run (gate.request_changes).
 */
function GuardrailPromptBlock({ value, ctx }: { value: ApprovalPrompt; ctx: BlockContext }) {
  const fire = (actionId: "gate.approve" | "gate.request_changes" | "guardrail.change") =>
    ctx.onAction?.({
      blockId: ctx.blockId,
      actionId,
      value: actionId === "guardrail.change" ? value.guardrailId : value.gateId,
    });
  const platform = !value.guardrailId || value.guardrailId.startsWith("platform:");
  return (
    <Card accent="alert" label="guardrail">
      <Typography variant="body1" data-testid="guardrail-text">
        {value.guardrailText || value.subject}
      </Typography>
      {value.blocker ? (
        <Typography variant="body2" color="text.secondary" data-testid="guardrail-blocker">
          {value.blocker}
        </Typography>
      ) : null}
      {value.decided ? (
        <Chip
          size="small"
          label={
            value.decision === "approved"
              ? "resumed"
              : value.decision === "rejected"
                ? "stopped"
                : value.decision || "decided"
          }
          color={
            value.decision === "approved" ? "success" : value.decision === "rejected" ? "error" : "default"
          }
          sx={{ alignSelf: "flex-start" }}
        />
      ) : (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {!platform ? (
            <Button
              size="small"
              variant="contained"
              color="primary"
              data-action-id="guardrail.change"
              onClick={() => fire("guardrail.change")}
            >
              Change the guardrail
            </Button>
          ) : null}
          {!platform ? (
            <Button
              size="small"
              variant="outlined"
              data-action-id="gate.approve"
              onClick={() => fire("gate.approve")}
            >
              Resume the run
            </Button>
          ) : null}
          <Button
            size="small"
            variant="outlined"
            color="error"
            data-action-id="gate.request_changes"
            onClick={() => fire("gate.request_changes")}
          >
            Stop the run
          </Button>
        </Stack>
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
  const [pending, setPending] = usePendingDecision(value.decided);
  const fire = (actionId: "gate.approve" | "gate.request_changes") => {
    if (pending) return;
    setPending(actionId);
    ctx.onAction?.({ blockId: ctx.blockId, actionId, value: value.gateId });
  };
  const expires = tsMs(value.expiresAt);
  const fmt = ctx.formatTime ?? ((ms: number) => new Date(ms).toISOString());
  if (value.kind === GateKind.GUARDRAIL) return <GuardrailPromptBlock value={value} ctx={ctx} />;
  return (
    <Card accent="alert" label={GATE_LABEL[value.kind] ?? "approval"}>
      {/* A merge's subject is its pull request: a link before and after the decision
          (Robby, 2026-11-01: "I still want to be able to click and navigate to the PR even
          after approving"). */}
      {isWebUrl(value.subject) ? (
        <Link
          href={value.subject}
          target="_blank"
          rel="noopener noreferrer"
          variant="body1"
          sx={{ wordBreak: "break-all" }}
          data-testid="approval-subject-link"
        >
          {value.subject}
        </Link>
      ) : (
        <Typography variant="body1">{value.subject}</Typography>
      )}
      {value.detail ? (
        <Typography variant="body2" color="text.secondary" data-testid="approval-detail">
          {value.detail}
        </Typography>
      ) : (
        <Typography variant="caption" color="text.secondary">
          {value.minApprovals} approval{value.minApprovals === 1 ? "" : "s"} needed
          {value.approverIds.length ? ` from ${names(value.approverIds, ctx)}` : ""}
          {expires !== undefined && !value.decided ? ` · expires ${fmt(expires)}` : ""}
        </Typography>
      )}
      {value.decided ? (
        <Chip
          size="small"
          label={value.decision || "decided"}
          color={
            value.decision === "approved" ? "success" : value.decision === "rejected" ? "error" : "default"
          }
          sx={{ alignSelf: "flex-start" }}
        />
      ) : (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            data-action-id="gate.approve"
            disabled={pending !== null}
            onClick={() => fire("gate.approve")}
          >
            {pending === "gate.approve" ? "Approving…" : value.approveLabel || "Approve"}
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            data-action-id="gate.request_changes"
            disabled={pending !== null}
            onClick={() => fire("gate.request_changes")}
          >
            {pending === "gate.request_changes" ? "Sending…" : value.rejectLabel || "Reject"}
          </Button>
        </Stack>
      )}
    </Card>
  );
}

export function ToolLogBlock({ value, ctx }: { value: ToolLog; ctx: BlockContext }) {
  const fmt = ctx.formatTime ?? ((ms: number) => new Date(ms).toISOString().slice(11, 19));
  return (
    <Card accent="agent" label={`Agent · ${value.phase}`}>
      <Typography variant="caption" color="text.secondary">
        {value.toolCalls} tool call{value.toolCalls === 1 ? "" : "s"} · {value.filesEdited} file
        {value.filesEdited === 1 ? "" : "s"} edited
        {value.runPanelUrl ? (
          <>
            {" · "}
            <Link href={value.runPanelUrl} target="_blank" rel="noopener noreferrer">
              run panel
            </Link>
          </>
        ) : null}
      </Typography>
      {value.recent.length > 0 ? (
        <Box
          component="ol"
          sx={{ m: 0, p: 0, listStyle: "none", ...mono, display: "flex", flexDirection: "column", gap: 0.25 }}
        >
          {value.recent.map((e, i) => {
            const at = tsMs(e.at);
            return (
              <Box
                component="li"
                key={i}
                data-ok={e.ok}
                sx={{ display: "flex", gap: 1, color: e.ok ? "inherit" : "error.main" }}
              >
                <Box component="span" sx={{ color: "text.disabled" }}>
                  {at !== undefined ? fmt(at) : "--:--:--"}
                </Box>
                <Box component="span" sx={{ color: "tank.secondaryText", minWidth: "4em" }}>
                  {e.tool}
                </Box>
                <Box component="span" sx={{ overflowWrap: "anywhere" }}>
                  {e.summary}
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : null}
    </Card>
  );
}

export function StatusCardBlock({ value, ctx }: { value: StatusCard; ctx: BlockContext }) {
  const started = tsMs(value.startedAt);
  const fmt = ctx.formatTime ?? ((ms: number) => new Date(ms).toISOString());
  const terminal = /^(done|merged|failed|cancelled|timed_out|budget_exhausted|approval_expired)$/.test(
    value.state,
  );
  const bad = /^(failed|cancelled|timed_out|budget_exhausted|approval_expired)$/.test(value.state);
  return (
    <Card accent={bad ? "alert" : "agent"} label={`Run · ${value.runId}`}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Chip
          size="small"
          label={value.state.replaceAll("_", " ")}
          color={bad ? "error" : terminal ? "success" : "secondary"}
        />
        {value.branch ? (
          <Typography variant="body2" sx={mono}>
            {value.branch}
          </Typography>
        ) : null}
        {value.costUsd > 0 ? (
          <Typography variant="body2" color="text.secondary">
            ${value.costUsd.toFixed(2)}
          </Typography>
        ) : null}
      </Stack>
      {value.detail ? <Typography variant="body2">{value.detail}</Typography> : null}
      <Typography variant="caption" color="text.secondary">
        {started !== undefined ? `started ${fmt(started)}` : ""}
        {value.runPanelUrl ? (
          <>
            {started !== undefined ? " · " : ""}
            <Link href={value.runPanelUrl} target="_blank" rel="noopener noreferrer">
              run panel
            </Link>
          </>
        ) : null}
      </Typography>
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

export function FilePreviewBlock({ value }: { value: FilePreview }) {
  return (
    <Card accent="none">
      <Stack direction="row" spacing={1.5} alignItems="center">
        {value.thumbnailUrl ? (
          <Box
            component="img"
            src={value.thumbnailUrl}
            alt=""
            sx={{ width: 56, height: 56, objectFit: "cover", borderRadius: 1, bgcolor: "tank.panel" }}
          />
        ) : (
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 1,
              bgcolor: "tank.panel",
              display: "grid",
              placeItems: "center",
              ...mono,
            }}
            aria-hidden
          >
            {value.mime.split("/")[1]?.slice(0, 4).toUpperCase() || "FILE"}
          </Box>
        )}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, overflowWrap: "anywhere" }}
            data-file-id={value.fileId}
          >
            {value.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {value.mime || "file"} · {formatBytes(value.size)}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
