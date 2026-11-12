import { type Channel, type ChannelReadState, ChannelView } from "../contracts/tank/channel/v1/channel_pb.js";
import type { Message } from "../contracts/tank/message/v1/message_pb.js";
import { type Task, type TaskNotify, TaskStage } from "../contracts/tank/task/v1/task_pb.js";
/** Command's columns and the strip's groups, left to right. */
export declare const TASK_STAGES: readonly TaskStage[];
/** A stable key per stage, for test ids, routes and analytics-free CSS hooks. */
export declare function taskStageKey(stage: TaskStage): "queued" | "in_progress" | "ready_to_check" | "done" | "stuck";
/** Command keeps Done for 30 days; older ones stay on their Tread. */
export declare const DONE_WINDOW_MS: number;
export interface TaskFilter {
    /** Only this person's asks. */
    askedBy?: string;
    /** Only this Tread. */
    channelId?: string;
}
/** Tasks for Command: the filter, and Done trimmed to the window. */
export declare function commandTasks(tasks: readonly Task[], filter?: TaskFilter, now?: number): Task[];
/** Tasks grouped by stage, every stage present (possibly empty), each group oldest first. */
export declare function tasksByStage(tasks: readonly Task[]): Map<TaskStage, Task[]>;
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
