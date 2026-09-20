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
import { type ReactNode, useState } from "react";
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
import { typography } from "../design/tokens.js";
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

function tsMs(t: { seconds: bigint; nanos: number } | undefined): number | undefined {
  return t ? Number(t.seconds) * 1000 + Math.floor(t.nanos / 1e6) : undefined;
}

/** Accent stripe for agent cards: purple = agent execution, cyan = AI/context, amber = needs a human. */
export function Card({
  accent,
  children,
  label,
}: {
  accent: "agent" | "ai" | "alert" | "none";
  label?: string;
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
        <Typography
          variant="overline"
          sx={{ color: accent === "none" ? "text.secondary" : `tank.${accent}`, lineHeight: 1.5 }}
        >
          {label}
        </Typography>
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

export function PlanCardBlock({ value }: { value: PlanCard }) {
  const done = value.steps.filter((s) => s.status === StepStatus.DONE).length;
  return (
    <Card accent="agent" label={`Plan · v${value.version}${value.planHash ? ` · ${value.planHash}` : ""}`}>
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
      {value.approverIds.length > 0 ? (
        <Typography variant="caption" color="text.secondary">
          Approvers: {value.approverIds.join(", ")}
        </Typography>
      ) : null}
    </Card>
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
};

export function ApprovalPromptBlock({ value, ctx }: { value: ApprovalPrompt; ctx: BlockContext }) {
  const expires = tsMs(value.expiresAt);
  const fmt = ctx.formatTime ?? ((ms: number) => new Date(ms).toISOString());
  return (
    <Card accent="alert" label={GATE_LABEL[value.kind] ?? "approval"}>
      <Typography variant="body1">{value.subject}</Typography>
      <Typography variant="caption" color="text.secondary">
        {value.minApprovals} approval{value.minApprovals === 1 ? "" : "s"} needed
        {value.approverIds.length ? ` from ${value.approverIds.join(", ")}` : ""}
        {expires !== undefined && !value.decided ? ` · expires ${fmt(expires)}` : ""}
      </Typography>
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
            data-action-id="approve"
            onClick={() => ctx.onAction?.({ blockId: ctx.blockId, actionId: "approve", value: value.gateId })}
          >
            Approve
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            data-action-id="reject"
            onClick={() => ctx.onAction?.({ blockId: ctx.blockId, actionId: "reject", value: value.gateId })}
          >
            Reject
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
