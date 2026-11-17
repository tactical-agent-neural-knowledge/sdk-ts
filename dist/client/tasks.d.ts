import { type Channel, type ChannelReadState, ChannelView } from "../contracts/tank/channel/v1/channel_pb.js";
import type { Message } from "../contracts/tank/message/v1/message_pb.js";
import { type Task, type TaskNotify, TaskStage } from "../contracts/tank/task/v1/task_pb.js";
import type { Member } from "../contracts/tank/workspace/v1/workspace_pb.js";
/** Command's columns and the strip's groups, left to right. */
export declare const TASK_STAGES: readonly TaskStage[];
/** A stable key per stage, for test ids, routes and analytics-free CSS hooks. */
export declare function taskStageKey(stage: TaskStage): "queued" | "in_progress" | "ready_to_check" | "done" | "stuck" | "cancelled";
/** Command keeps Done and Cancelled for 30 days; older ones stay on their Tread. */
export declare const DONE_WINDOW_MS: number;
export interface TaskFilter {
    /** Only this person's asks. */
    askedBy?: string;
    /** Only this Tread. */
    channelId?: string;
}
/**
 * Which Done tasks Command and the strip show: everything (the 30-day window on Command), a
 * preset in the person's local time (weeks start on Monday), or picked days. Custom days are
 * "YYYY-MM-DD" as a date input gives them; one day alone means that single day.
 */
export type DoneRange = {
    kind: "all" | "today" | "yesterday" | "week" | "month";
} | {
    kind: "custom";
    from?: string;
    to?: string;
};
/** The ranges a person can pick without choosing days, in the order the chips show them. */
export declare const DONE_RANGE_PRESETS: readonly ["all", "today", "yesterday", "week", "month"];
export declare const DONE_ALL: DoneRange;
/** A local date as "YYYY-MM-DD", the value of a date input. */
export declare function localDateKey(ms: number): string;
/** Whether the range keeps every Done task (so Command's 30-day window applies). */
export declare function isAllDone(range: DoneRange | undefined): boolean;
/**
 * The span of a range in the person's local time: [start, end) in ms, or undefined for All
 * (or custom days that are empty or not dates). A reversed pair is put the right way round.
 */
export declare function doneRangeBounds(range: DoneRange | undefined, now?: number): {
    start: number;
    end: number;
} | undefined;
/** When a task was done: checked, else moved to its stage, else last touched (what the 30-day trim reads). */
export declare function doneAt(task: Pick<Task, "checkedAt" | "stageAt" | "updatedAt">): number;
/** The Done and Cancelled tasks inside the range; other tasks pass through. A task with no time is left out of a chosen range. */
export declare function filterDone<T extends Pick<Task, "stage" | "checkedAt" | "stageAt" | "updatedAt">>(tasks: readonly T[], range: DoneRange | undefined, now?: number): T[];
/**
 * Tasks for Command: the filter, and Done and Cancelled trimmed to the window, or to the range when one is
 * chosen (a chosen range replaces the window, so older days can be looked at).
 */
export declare function commandTasks(tasks: readonly Task[], filter?: TaskFilter, now?: number, doneRange?: DoneRange): Task[];
/** Tasks grouped by stage, every stage present (possibly empty), each group oldest first. */
export declare function tasksByStage(tasks: readonly Task[]): Map<TaskStage, Task[]>;
/** How the stage list in Command's modal is ordered. */
export type TaskSort = "newest" | "oldest" | "title" | "tread";
/** The sorts a person can pick, in the order the control shows them. */
export declare const TASK_SORTS: readonly TaskSort[];
/** A copy of the tasks in this order; ties keep a stable order by title then id. */
export declare function sortTasks<T extends Task>(tasks: readonly T[], sort?: TaskSort): T[];
/** The tasks whose title or Tread name has every word of the query (case-insensitive); a blank query keeps all. */
export declare function searchTasks<T extends Pick<Task, "title" | "channelName">>(tasks: readonly T[], query: string): T[];
/** A task can be cancelled at any stage short of Done (and Cancelled again changes nothing). */
export declare function canCancelTask(task: Pick<Task, "stage">): boolean;
/** How many tasks wait for a person to check them. */
export declare function readyToCheckCount(tasks: readonly Task[]): number;
/**
 * The view this person reads the Tread in: their own pick, else the Tread's default, else
 * Builder (today's Tread, unchanged).
 */
export declare function effectiveView(channel: Pick<Channel, "defaultView"> | undefined, readState: Pick<ChannelReadState, "view"> | undefined): ChannelView.BUILDER | ChannelView.SIMPLE;
/**
 * Whether Simple mode leaves this message out of the conversation and folds it into its
 * task: an agent's status, plan, tool, pull request, CI, summary and other run cards. People's
 * messages, the agent's plain replies and the cards waiting on a person stay.
 */
export declare function isAgentInternal(m: Pick<Message, "authorKind" | "metadata" | "blocks">): boolean;
/** The messages Simple mode shows, in order. */
export declare function simpleConversation<M extends Pick<Message, "authorKind" | "metadata" | "blocks">>(messages: readonly M[]): M[];
/** The task a message belongs to: the one whose thread it is in (or roots). */
export declare function taskForThread(tasks: readonly Task[], threadRootId: string): Task | undefined;
/** Who hears about the task at a stage: workspace rules first, then the task's own picks, each person once. */
export declare function notifyFor(task: Pick<Task, "notify">, stage: TaskStage): TaskNotify[];
/** The task's own picks only (what SetTaskNotify replaces). */
export declare function ownNotify(task: Pick<Task, "notify">): TaskNotify[];
/** The longest note Send to takes (the server refuses more). */
export declare const SEND_NOTE_MAX = 500;
/**
 * Who Send to offers: the Tread's members (ListChannelMembers) who are people, still in the
 * workspace, and not the caller, in the order given. The server checks the same rule again;
 * this only keeps a name off the list that would be refused.
 */
export declare function taskSendCandidates(treadMemberIds: readonly string[], members: Readonly<Record<string, Pick<Member, "principal" | "deactivatedAt"> | undefined>>, meId: string | undefined): string[];
