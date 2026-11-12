// Shared task rules for web and mobile (docs/tasks/PLAN.md, 2026-11-12), kept here so the
// two clients cannot drift: the stage order, Command's filters and its 30-day Done window,
// which view a person reads a Tread in, and which messages Simple mode folds into a task.
import { PrincipalKind } from "../contracts/tank/auth/v1/auth_pb.js";
import { type Channel, type ChannelReadState, ChannelView } from "../contracts/tank/channel/v1/channel_pb.js";
import type { Message } from "../contracts/tank/message/v1/message_pb.js";
import { type Task, type TaskNotify, TaskStage } from "../contracts/tank/task/v1/task_pb.js";
import { tsMs } from "./store.js";

/** Command's columns and the strip's groups, left to right. */
export const TASK_STAGES: readonly TaskStage[] = [
  TaskStage.QUEUED,
  TaskStage.IN_PROGRESS,
  TaskStage.READY_TO_CHECK,
  TaskStage.DONE,
  TaskStage.STUCK,
];

/** A stable key per stage, for test ids, routes and analytics-free CSS hooks. */
export function taskStageKey(
  stage: TaskStage,
): "queued" | "in_progress" | "ready_to_check" | "done" | "stuck" {
  switch (stage) {
    case TaskStage.IN_PROGRESS:
      return "in_progress";
    case TaskStage.READY_TO_CHECK:
      return "ready_to_check";
    case TaskStage.DONE:
      return "done";
    case TaskStage.STUCK:
      return "stuck";
    default:
      return "queued";
  }
}

/** Command keeps Done for 30 days; older ones stay on their Tread. */
export const DONE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export interface TaskFilter {
  /** Only this person's asks. */
  askedBy?: string;
  /** Only this Tread. */
  channelId?: string;
}

/** Tasks for Command: the filter, and Done trimmed to the window. */
export function commandTasks(tasks: readonly Task[], filter: TaskFilter = {}, now = Date.now()): Task[] {
  return tasks.filter((t) => {
    if (filter.askedBy && t.createdBy !== filter.askedBy) return false;
    if (filter.channelId && t.channelId !== filter.channelId) return false;
    if (t.stage === TaskStage.DONE) {
      const at = tsMs(t.checkedAt) || tsMs(t.stageAt) || tsMs(t.updatedAt);
      if (at && now - at > DONE_WINDOW_MS) return false;
    }
    return true;
  });
}

/** Tasks grouped by stage, every stage present (possibly empty), each group oldest first. */
export function tasksByStage(tasks: readonly Task[]): Map<TaskStage, Task[]> {
  const out = new Map<TaskStage, Task[]>(TASK_STAGES.map((s) => [s, []]));
  for (const t of tasks) out.get(TASK_STAGES.includes(t.stage) ? t.stage : TaskStage.QUEUED)?.push(t);
  return out;
}

/** How many tasks wait for a person to check them. */
export function readyToCheckCount(tasks: readonly Task[]): number {
  return tasks.filter((t) => t.stage === TaskStage.READY_TO_CHECK).length;
}

/**
 * The view this person reads the Tread in: their own pick, else the Tread's default, else
 * Builder (today's Tread, unchanged).
 */
export function effectiveView(
  channel: Pick<Channel, "defaultView"> | undefined,
  readState: Pick<ChannelReadState, "view"> | undefined,
): ChannelView.BUILDER | ChannelView.SIMPLE {
  const mine = readState?.view ?? ChannelView.UNSPECIFIED;
  if (mine === ChannelView.SIMPLE || mine === ChannelView.BUILDER) return mine;
  return channel?.defaultView === ChannelView.SIMPLE ? ChannelView.SIMPLE : ChannelView.BUILDER;
}

/** Agent cards a person must answer stay in the Simple conversation; the rest fold into a task. */
const PERSON_CARDS = new Set(["message", "question_card", "approval_card", "api_key_card"]);

function cardType(m: Pick<Message, "metadata">): string {
  const v = m.metadata?.card_type;
  return typeof v === "string" ? v : "";
}

/**
 * Whether Simple mode leaves this message out of the conversation and folds it into its
 * task: an agent's status, plan, tool, pull request, CI, summary and other run cards. People's
 * messages, the agent's plain replies and the cards waiting on a person stay.
 */
export function isAgentInternal(m: Pick<Message, "authorKind" | "metadata" | "blocks">): boolean {
  const agent = m.authorKind === PrincipalKind.AGENT || m.authorKind === PrincipalKind.BOT;
  if (!agent) return false;
  const type = cardType(m);
  if (type) return !PERSON_CARDS.has(type);
  // A run card always says what it is; an agent message with blocks and no type is a card
  // from an older control plane.
  return (m.blocks?.blocks?.length ?? 0) > 0 && typeof m.metadata?.run_id === "string";
}

/** The messages Simple mode shows, in order. */
export function simpleConversation<M extends Pick<Message, "authorKind" | "metadata" | "blocks">>(
  messages: readonly M[],
): M[] {
  return messages.filter((m) => !isAgentInternal(m));
}

/** The task a message belongs to: the one whose thread it is in (or roots). */
export function taskForThread(tasks: readonly Task[], threadRootId: string): Task | undefined {
  if (!threadRootId) return undefined;
  let found: Task | undefined;
  for (const t of tasks)
    if (t.threadRootId === threadRootId && (!found || tsMs(t.createdAt) > tsMs(found.createdAt))) found = t;
  return found;
}

/** Who hears about the task at a stage: workspace rules first, then the task's own picks, each person once. */
export function notifyFor(task: Pick<Task, "notify">, stage: TaskStage): TaskNotify[] {
  const seen = new Set<string>();
  const rows = [...task.notify].sort((a, b) => Number(b.fromWorkspace) - Number(a.fromWorkspace));
  const out: TaskNotify[] = [];
  for (const n of rows) {
    if (n.stage !== stage || seen.has(n.userId)) continue;
    seen.add(n.userId);
    out.push(n);
  }
  return out;
}

/** The task's own picks only (what SetTaskNotify replaces). */
export function ownNotify(task: Pick<Task, "notify">): TaskNotify[] {
  return task.notify.filter((n) => !n.fromWorkspace);
}
