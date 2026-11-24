import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Channel } from "../../channel/v1/channel_pb.js";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/task/v1/task.proto.
 */
export declare const file_tank_task_v1_task: GenFile;
/**
 * One line of the checklist against the ask, with whether TANK's record says it was met.
 *
 * @generated from message tank.task.v1.ProofCheck
 */
export type ProofCheck = Message<"tank.task.v1.ProofCheck"> & {
    /**
     * @generated from field: string text = 1;
     */
    text: string;
    /**
     * @generated from field: bool met = 2;
     */
    met: boolean;
};
/**
 * Describes the message tank.task.v1.ProofCheck.
 * Use `create(ProofCheckSchema)` to create a new message.
 */
export declare const ProofCheckSchema: GenMessage<ProofCheck>;
/**
 * What the run showed when it said it was finished: a live link or a screenshot and a
 * checklist against the ask. Never the model's word alone.
 *
 * @generated from message tank.task.v1.TaskProof
 */
export type TaskProof = Message<"tank.task.v1.TaskProof"> & {
    /**
     * the page TANK opened, when the product is hosted
     *
     * @generated from field: string live_url = 1;
     */
    liveUrl: string;
    /**
     * a picture the run took, readable by the Tread
     *
     * @generated from field: string screenshot_file_id = 2;
     */
    screenshotFileId: string;
    /**
     * @generated from field: repeated tank.task.v1.ProofCheck checklist = 3;
     */
    checklist: ProofCheck[];
    /**
     * @generated from field: string pull_request_url = 4;
     */
    pullRequestUrl: string;
    /**
     * @generated from field: google.protobuf.Timestamp at = 5;
     */
    at?: Timestamp;
    /**
     * A recording TANK's browser made of the run doing the thing (video/mp4), posted in the
     * task's Tread (2026-11-13). Shown under "What TANK showed".
     *
     * @generated from field: string video_file_id = 6;
     */
    videoFileId: string;
    /**
     * Overdrive's stopwatch (2026-11-24): seconds from the ask to the change being live, when
     * it got there; 0 when nothing confirms it is out. Shown small beside the proof.
     *
     * @generated from field: int64 ask_to_live_seconds = 7;
     */
    askToLiveSeconds: bigint;
};
/**
 * Describes the message tank.task.v1.TaskProof.
 * Use `create(TaskProofSchema)` to create a new message.
 */
export declare const TaskProofSchema: GenMessage<TaskProof>;
/**
 * Who hears about a task when it reaches a stage.
 *
 * @generated from message tank.task.v1.TaskNotify
 */
export type TaskNotify = Message<"tank.task.v1.TaskNotify"> & {
    /**
     * @generated from field: tank.task.v1.TaskStage stage = 1;
     */
    stage: TaskStage;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
    /**
     * Set on read: the rule comes from Settings → Tasks and cannot be removed here.
     *
     * @generated from field: bool from_workspace = 3;
     */
    fromWorkspace: boolean;
};
/**
 * Describes the message tank.task.v1.TaskNotify.
 * Use `create(TaskNotifySchema)` to create a new message.
 */
export declare const TaskNotifySchema: GenMessage<TaskNotify>;
/**
 * @generated from message tank.task.v1.Task
 */
export type Task = Message<"tank.task.v1.Task"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * @generated from field: string channel_id = 3;
     */
    channelId: string;
    /**
     * The thread the task's conversation and runs live in; empty until it starts.
     *
     * @generated from field: string thread_root_id = 4;
     */
    threadRootId: string;
    /**
     * the ask, in the asker's words
     *
     * @generated from field: string title = 5;
     */
    title: string;
    /**
     * @generated from field: string details = 6;
     */
    details: string;
    /**
     * @generated from field: tank.task.v1.TaskStage stage = 7;
     */
    stage: TaskStage;
    /**
     * @generated from field: string created_by = 8;
     */
    createdBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 9;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 10;
     */
    updatedAt?: Timestamp;
    /**
     * When it entered its stage.
     *
     * @generated from field: google.protobuf.Timestamp stage_at = 11;
     */
    stageAt?: Timestamp;
    /**
     * the newest run on it, the core's id
     *
     * @generated from field: string run_id = 12;
     */
    runId: string;
    /**
     * One plain line while IN_PROGRESS ("Working on the login page · 3 of 5").
     *
     * @generated from field: string progress = 13;
     */
    progress: string;
    /**
     * READY_TO_CHECK and DONE
     *
     * @generated from field: tank.task.v1.TaskProof proof = 14;
     */
    proof?: TaskProof;
    /**
     * @generated from field: string checked_by = 15;
     */
    checkedBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp checked_at = 16;
     */
    checkedAt?: Timestamp;
    /**
     * STUCK: one sentence
     *
     * @generated from field: string stuck_reason = 17;
     */
    stuckReason: string;
    /**
     * The task's own picks plus the workspace's rules (from_workspace).
     *
     * @generated from field: repeated tank.task.v1.TaskNotify notify = 18;
     */
    notify: TaskNotify[];
    /**
     * The asker hears about READY_TO_CHECK and STUCK unless they turned it off.
     *
     * @generated from field: bool asker_muted = 19;
     */
    askerMuted: boolean;
    /**
     * For Command: the Tread's name, so a card can say where it lives.
     *
     * @generated from field: string channel_name = 20;
     */
    channelName: string;
    /**
     * The task's own address in the web app (https://app.tank.chat/w/<workspace slug>/c/<tread
     * id>?task=<id>), the same one its Activity row and push open. It opens only for people in
     * the task's Tread; anyone else is told it is in a Tread they're not in, and sees nothing of it.
     *
     * @generated from field: string link = 21;
     */
    link: string;
    /**
     * Files attached when the task was made, shared into its Tread when it starts.
     *
     * @generated from field: repeated string file_ids = 22;
     */
    fileIds: string[];
    /**
     * The message this task was made from (a reaction on it), empty for a task somebody typed.
     * Its thread is the task's thread, so nothing is posted twice.
     *
     * @generated from field: string source_message_id = 23;
     */
    sourceMessageId: string;
};
/**
 * Describes the message tank.task.v1.Task.
 * Use `create(TaskSchema)` to create a new message.
 */
export declare const TaskSchema: GenMessage<Task>;
/**
 * @generated from message tank.task.v1.ListTasksRequest
 */
export type ListTasksRequest = Message<"tank.task.v1.ListTasksRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * one Tread; empty = every Tread the caller can see (Command)
     *
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * empty = all
     *
     * @generated from field: repeated tank.task.v1.TaskStage stages = 3;
     */
    stages: TaskStage[];
    /**
     * only tasks this person asked for
     *
     * @generated from field: string asked_by = 4;
     */
    askedBy: string;
    /**
     * 0 = 500
     *
     * @generated from field: int32 limit = 5;
     */
    limit: number;
};
/**
 * Describes the message tank.task.v1.ListTasksRequest.
 * Use `create(ListTasksRequestSchema)` to create a new message.
 */
export declare const ListTasksRequestSchema: GenMessage<ListTasksRequest>;
/**
 * @generated from message tank.task.v1.ListTasksResponse
 */
export type ListTasksResponse = Message<"tank.task.v1.ListTasksResponse"> & {
    /**
     * @generated from field: repeated tank.task.v1.Task tasks = 1;
     */
    tasks: Task[];
    /**
     * The workspace has an agent, so Start does something. Free workspaces add and
     * track tasks; only an agent moves them.
     *
     * @generated from field: bool has_agent = 2;
     */
    hasAgent: boolean;
    /**
     * count for Home's badge, independent of filters
     *
     * @generated from field: int32 ready_to_check = 3;
     */
    readyToCheck: number;
};
/**
 * Describes the message tank.task.v1.ListTasksResponse.
 * Use `create(ListTasksResponseSchema)` to create a new message.
 */
export declare const ListTasksResponseSchema: GenMessage<ListTasksResponse>;
/**
 * @generated from message tank.task.v1.GetTaskRequest
 */
export type GetTaskRequest = Message<"tank.task.v1.GetTaskRequest"> & {
    /**
     * @generated from field: string task_id = 1;
     */
    taskId: string;
};
/**
 * Describes the message tank.task.v1.GetTaskRequest.
 * Use `create(GetTaskRequestSchema)` to create a new message.
 */
export declare const GetTaskRequestSchema: GenMessage<GetTaskRequest>;
/**
 * @generated from message tank.task.v1.GetTaskResponse
 */
export type GetTaskResponse = Message<"tank.task.v1.GetTaskResponse"> & {
    /**
     * @generated from field: tank.task.v1.Task task = 1;
     */
    task?: Task;
};
/**
 * Describes the message tank.task.v1.GetTaskResponse.
 * Use `create(GetTaskResponseSchema)` to create a new message.
 */
export declare const GetTaskResponseSchema: GenMessage<GetTaskResponse>;
/**
 * @generated from message tank.task.v1.CreateTaskRequest
 */
export type CreateTaskRequest = Message<"tank.task.v1.CreateTaskRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * @generated from field: string title = 3;
     */
    title: string;
    /**
     * @generated from field: string details = 4;
     */
    details: string;
    /**
     * @generated from field: bool start_now = 5;
     */
    startNow: boolean;
    /**
     * @generated from field: repeated tank.task.v1.TaskNotify notify = 6;
     */
    notify: TaskNotify[];
    /**
     * Finished uploads by the caller in this workspace; at most 10.
     *
     * @generated from field: repeated string file_ids = 7;
     */
    fileIds: string[];
};
/**
 * Describes the message tank.task.v1.CreateTaskRequest.
 * Use `create(CreateTaskRequestSchema)` to create a new message.
 */
export declare const CreateTaskRequestSchema: GenMessage<CreateTaskRequest>;
/**
 * @generated from message tank.task.v1.CreateTaskResponse
 */
export type CreateTaskResponse = Message<"tank.task.v1.CreateTaskResponse"> & {
    /**
     * @generated from field: tank.task.v1.Task task = 1;
     */
    task?: Task;
};
/**
 * Describes the message tank.task.v1.CreateTaskResponse.
 * Use `create(CreateTaskResponseSchema)` to create a new message.
 */
export declare const CreateTaskResponseSchema: GenMessage<CreateTaskResponse>;
/**
 * Command's Add task: a new Tread whose goal is the title, with the task in it and the
 * caller as its first member.
 *
 * @generated from message tank.task.v1.CreateTaskWithChannelRequest
 */
export type CreateTaskWithChannelRequest = Message<"tank.task.v1.CreateTaskWithChannelRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string title = 2;
     */
    title: string;
    /**
     * @generated from field: string details = 3;
     */
    details: string;
    /**
     * @generated from field: bool start_now = 4;
     */
    startNow: boolean;
    /**
     * @generated from field: repeated tank.task.v1.TaskNotify notify = 5;
     */
    notify: TaskNotify[];
    /**
     * @generated from field: repeated string file_ids = 6;
     */
    fileIds: string[];
};
/**
 * Describes the message tank.task.v1.CreateTaskWithChannelRequest.
 * Use `create(CreateTaskWithChannelRequestSchema)` to create a new message.
 */
export declare const CreateTaskWithChannelRequestSchema: GenMessage<CreateTaskWithChannelRequest>;
/**
 * @generated from message tank.task.v1.CreateTaskWithChannelResponse
 */
export type CreateTaskWithChannelResponse = Message<"tank.task.v1.CreateTaskWithChannelResponse"> & {
    /**
     * @generated from field: tank.task.v1.Task task = 1;
     */
    task?: Task;
    /**
     * @generated from field: tank.channel.v1.Channel channel = 2;
     */
    channel?: Channel;
};
/**
 * Describes the message tank.task.v1.CreateTaskWithChannelResponse.
 * Use `create(CreateTaskWithChannelResponseSchema)` to create a new message.
 */
export declare const CreateTaskWithChannelResponseSchema: GenMessage<CreateTaskWithChannelResponse>;
/**
 * @generated from message tank.task.v1.StartTaskRequest
 */
export type StartTaskRequest = Message<"tank.task.v1.StartTaskRequest"> & {
    /**
     * @generated from field: string task_id = 1;
     */
    taskId: string;
};
/**
 * Describes the message tank.task.v1.StartTaskRequest.
 * Use `create(StartTaskRequestSchema)` to create a new message.
 */
export declare const StartTaskRequestSchema: GenMessage<StartTaskRequest>;
/**
 * @generated from message tank.task.v1.StartTaskResponse
 */
export type StartTaskResponse = Message<"tank.task.v1.StartTaskResponse"> & {
    /**
     * @generated from field: tank.task.v1.Task task = 1;
     */
    task?: Task;
};
/**
 * Describes the message tank.task.v1.StartTaskResponse.
 * Use `create(StartTaskResponseSchema)` to create a new message.
 */
export declare const StartTaskResponseSchema: GenMessage<StartTaskResponse>;
/**
 * Looks right: READY_TO_CHECK → DONE, by anyone in the Tread.
 *
 * @generated from message tank.task.v1.ConfirmTaskRequest
 */
export type ConfirmTaskRequest = Message<"tank.task.v1.ConfirmTaskRequest"> & {
    /**
     * @generated from field: string task_id = 1;
     */
    taskId: string;
};
/**
 * Describes the message tank.task.v1.ConfirmTaskRequest.
 * Use `create(ConfirmTaskRequestSchema)` to create a new message.
 */
export declare const ConfirmTaskRequestSchema: GenMessage<ConfirmTaskRequest>;
/**
 * @generated from message tank.task.v1.ConfirmTaskResponse
 */
export type ConfirmTaskResponse = Message<"tank.task.v1.ConfirmTaskResponse"> & {
    /**
     * @generated from field: tank.task.v1.Task task = 1;
     */
    task?: Task;
};
/**
 * Describes the message tank.task.v1.ConfirmTaskResponse.
 * Use `create(ConfirmTaskResponseSchema)` to create a new message.
 */
export declare const ConfirmTaskResponseSchema: GenMessage<ConfirmTaskResponse>;
/**
 * Not yet: one sentence, posted in the task's thread as the caller, steers or continues
 * the run, and the task goes back to IN_PROGRESS.
 *
 * @generated from message tank.task.v1.SendBackTaskRequest
 */
export type SendBackTaskRequest = Message<"tank.task.v1.SendBackTaskRequest"> & {
    /**
     * @generated from field: string task_id = 1;
     */
    taskId: string;
    /**
     * @generated from field: string text = 2;
     */
    text: string;
};
/**
 * Describes the message tank.task.v1.SendBackTaskRequest.
 * Use `create(SendBackTaskRequestSchema)` to create a new message.
 */
export declare const SendBackTaskRequestSchema: GenMessage<SendBackTaskRequest>;
/**
 * @generated from message tank.task.v1.SendBackTaskResponse
 */
export type SendBackTaskResponse = Message<"tank.task.v1.SendBackTaskResponse"> & {
    /**
     * @generated from field: tank.task.v1.Task task = 1;
     */
    task?: Task;
};
/**
 * Describes the message tank.task.v1.SendBackTaskResponse.
 * Use `create(SendBackTaskResponseSchema)` to create a new message.
 */
export declare const SendBackTaskResponseSchema: GenMessage<SendBackTaskResponse>;
/**
 * Try again on STUCK: a continuation of the run that stopped.
 *
 * @generated from message tank.task.v1.RetryTaskRequest
 */
export type RetryTaskRequest = Message<"tank.task.v1.RetryTaskRequest"> & {
    /**
     * @generated from field: string task_id = 1;
     */
    taskId: string;
};
/**
 * Describes the message tank.task.v1.RetryTaskRequest.
 * Use `create(RetryTaskRequestSchema)` to create a new message.
 */
export declare const RetryTaskRequestSchema: GenMessage<RetryTaskRequest>;
/**
 * @generated from message tank.task.v1.RetryTaskResponse
 */
export type RetryTaskResponse = Message<"tank.task.v1.RetryTaskResponse"> & {
    /**
     * @generated from field: tank.task.v1.Task task = 1;
     */
    task?: Task;
};
/**
 * Describes the message tank.task.v1.RetryTaskResponse.
 * Use `create(RetryTaskResponseSchema)` to create a new message.
 */
export declare const RetryTaskResponseSchema: GenMessage<RetryTaskResponse>;
/**
 * Cancel a task at any stage short of DONE: a live run is stopped, and the task moves to
 * CANCELLED. Cancelling a task that is already CANCELLED returns it unchanged.
 *
 * @generated from message tank.task.v1.CancelTaskRequest
 */
export type CancelTaskRequest = Message<"tank.task.v1.CancelTaskRequest"> & {
    /**
     * @generated from field: string task_id = 1;
     */
    taskId: string;
};
/**
 * Describes the message tank.task.v1.CancelTaskRequest.
 * Use `create(CancelTaskRequestSchema)` to create a new message.
 */
export declare const CancelTaskRequestSchema: GenMessage<CancelTaskRequest>;
/**
 * @generated from message tank.task.v1.CancelTaskResponse
 */
export type CancelTaskResponse = Message<"tank.task.v1.CancelTaskResponse"> & {
    /**
     * @generated from field: tank.task.v1.Task task = 1;
     */
    task?: Task;
};
/**
 * Describes the message tank.task.v1.CancelTaskResponse.
 * Use `create(CancelTaskResponseSchema)` to create a new message.
 */
export declare const CancelTaskResponseSchema: GenMessage<CancelTaskResponse>;
/**
 * Replace the task's own picks (workspace rules are not affected).
 *
 * @generated from message tank.task.v1.SetTaskNotifyRequest
 */
export type SetTaskNotifyRequest = Message<"tank.task.v1.SetTaskNotifyRequest"> & {
    /**
     * @generated from field: string task_id = 1;
     */
    taskId: string;
    /**
     * @generated from field: repeated tank.task.v1.TaskNotify notify = 2;
     */
    notify: TaskNotify[];
    /**
     * @generated from field: optional bool asker_muted = 3;
     */
    askerMuted?: boolean;
};
/**
 * Describes the message tank.task.v1.SetTaskNotifyRequest.
 * Use `create(SetTaskNotifyRequestSchema)` to create a new message.
 */
export declare const SetTaskNotifyRequestSchema: GenMessage<SetTaskNotifyRequest>;
/**
 * @generated from message tank.task.v1.SetTaskNotifyResponse
 */
export type SetTaskNotifyResponse = Message<"tank.task.v1.SetTaskNotifyResponse"> & {
    /**
     * @generated from field: tank.task.v1.Task task = 1;
     */
    task?: Task;
};
/**
 * Describes the message tank.task.v1.SetTaskNotifyResponse.
 * Use `create(SetTaskNotifyResponseSchema)` to create a new message.
 */
export declare const SetTaskNotifyResponseSchema: GenMessage<SetTaskNotifyResponse>;
/**
 * Settings → Tasks: rules every task in the workspace follows.
 *
 * @generated from message tank.task.v1.GetTaskSettingsRequest
 */
export type GetTaskSettingsRequest = Message<"tank.task.v1.GetTaskSettingsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.task.v1.GetTaskSettingsRequest.
 * Use `create(GetTaskSettingsRequestSchema)` to create a new message.
 */
export declare const GetTaskSettingsRequestSchema: GenMessage<GetTaskSettingsRequest>;
/**
 * @generated from message tank.task.v1.GetTaskSettingsResponse
 */
export type GetTaskSettingsResponse = Message<"tank.task.v1.GetTaskSettingsResponse"> & {
    /**
     * @generated from field: repeated tank.task.v1.TaskNotify notify = 1;
     */
    notify: TaskNotify[];
    /**
     * owner or admin
     *
     * @generated from field: bool can_manage = 2;
     */
    canManage: boolean;
};
/**
 * Describes the message tank.task.v1.GetTaskSettingsResponse.
 * Use `create(GetTaskSettingsResponseSchema)` to create a new message.
 */
export declare const GetTaskSettingsResponseSchema: GenMessage<GetTaskSettingsResponse>;
/**
 * @generated from message tank.task.v1.SetTaskSettingsRequest
 */
export type SetTaskSettingsRequest = Message<"tank.task.v1.SetTaskSettingsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: repeated tank.task.v1.TaskNotify notify = 2;
     */
    notify: TaskNotify[];
};
/**
 * Describes the message tank.task.v1.SetTaskSettingsRequest.
 * Use `create(SetTaskSettingsRequestSchema)` to create a new message.
 */
export declare const SetTaskSettingsRequestSchema: GenMessage<SetTaskSettingsRequest>;
/**
 * @generated from message tank.task.v1.SetTaskSettingsResponse
 */
export type SetTaskSettingsResponse = Message<"tank.task.v1.SetTaskSettingsResponse"> & {
    /**
     * @generated from field: repeated tank.task.v1.TaskNotify notify = 1;
     */
    notify: TaskNotify[];
};
/**
 * Describes the message tank.task.v1.SetTaskSettingsResponse.
 * Use `create(SetTaskSettingsResponseSchema)` to create a new message.
 */
export declare const SetTaskSettingsResponseSchema: GenMessage<SetTaskSettingsResponse>;
/**
 * Send to: hand a task to people in its Tread so they hear about it now, at whatever stage it
 * is in ("I want someone else to check it"). The caller must be in the task's Tread, and so
 * must everyone named: a person who isn't is refused for the whole call, and nobody is told
 * anything. People only (no agents or bots), never the caller, each person once.
 *
 * @generated from message tank.task.v1.SendTaskRequest
 */
export type SendTaskRequest = Message<"tank.task.v1.SendTaskRequest"> & {
    /**
     * @generated from field: string task_id = 1;
     */
    taskId: string;
    /**
     * @generated from field: repeated string user_ids = 2;
     */
    userIds: string[];
    /**
     * Optional, at most 500 characters. Shown in Activity inside the app; never in a push.
     *
     * @generated from field: string note = 3;
     */
    note: string;
};
/**
 * Describes the message tank.task.v1.SendTaskRequest.
 * Use `create(SendTaskRequestSchema)` to create a new message.
 */
export declare const SendTaskRequestSchema: GenMessage<SendTaskRequest>;
/**
 * @generated from message tank.task.v1.SendTaskResponse
 */
export type SendTaskResponse = Message<"tank.task.v1.SendTaskResponse"> & {
    /**
     * @generated from field: repeated string sent_user_ids = 1;
     */
    sentUserIds: string[];
};
/**
 * Describes the message tank.task.v1.SendTaskResponse.
 * Use `create(SendTaskResponseSchema)` to create a new message.
 */
export declare const SendTaskResponseSchema: GenMessage<SendTaskResponse>;
/**
 * Control plane only: the run's own token or the control plane's bot token with
 * agent:run, authorised as AgentService.SetStatus is.
 *
 * @generated from message tank.task.v1.RecordTaskRunRequest
 */
export type RecordTaskRunRequest = Message<"tank.task.v1.RecordTaskRunRequest"> & {
    /**
     * the core's run id
     *
     * @generated from field: string run_id = 1;
     */
    runId: string;
    /**
     * empty: the thread's open task, or a new one made from `ask`
     *
     * @generated from field: string task_id = 2;
     */
    taskId: string;
    /**
     * @generated from field: tank.task.v1.TaskRunEvent event = 3;
     */
    event: TaskRunEvent;
    /**
     * STARTED/WAITING with no task: the person's words, as the title
     *
     * @generated from field: string ask = 4;
     */
    ask: string;
    /**
     * @generated from field: tank.task.v1.TaskProof proof = 5;
     */
    proof?: TaskProof;
    /**
     * STUCK: one sentence a person reads
     *
     * @generated from field: string reason = 6;
     */
    reason: string;
    /**
     * @generated from field: string progress = 7;
     */
    progress: string;
};
/**
 * Describes the message tank.task.v1.RecordTaskRunRequest.
 * Use `create(RecordTaskRunRequestSchema)` to create a new message.
 */
export declare const RecordTaskRunRequestSchema: GenMessage<RecordTaskRunRequest>;
/**
 * @generated from message tank.task.v1.RecordTaskRunResponse
 */
export type RecordTaskRunResponse = Message<"tank.task.v1.RecordTaskRunResponse"> & {
    /**
     * @generated from field: tank.task.v1.Task task = 1;
     */
    task?: Task;
};
/**
 * Describes the message tank.task.v1.RecordTaskRunResponse.
 * Use `create(RecordTaskRunResponseSchema)` to create a new message.
 */
export declare const RecordTaskRunResponseSchema: GenMessage<RecordTaskRunResponse>;
/**
 * @generated from enum tank.task.v1.TaskStage
 */
export declare enum TaskStage {
    /**
     * @generated from enum value: TASK_STAGE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: TASK_STAGE_QUEUED = 1;
     */
    QUEUED = 1,
    /**
     * @generated from enum value: TASK_STAGE_IN_PROGRESS = 2;
     */
    IN_PROGRESS = 2,
    /**
     * @generated from enum value: TASK_STAGE_READY_TO_CHECK = 3;
     */
    READY_TO_CHECK = 3,
    /**
     * @generated from enum value: TASK_STAGE_DONE = 4;
     */
    DONE = 4,
    /**
     * @generated from enum value: TASK_STAGE_STUCK = 5;
     */
    STUCK = 5,
    /**
     * @generated from enum value: TASK_STAGE_CANCELLED = 6;
     */
    CANCELLED = 6
}
/**
 * Describes the enum tank.task.v1.TaskStage.
 */
export declare const TaskStageSchema: GenEnum<TaskStage>;
/**
 * What a run did to its task, from the control plane.
 *
 * @generated from enum tank.task.v1.TaskRunEvent
 */
export declare enum TaskRunEvent {
    /**
     * @generated from enum value: TASK_RUN_EVENT_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * → IN_PROGRESS (creates the task for an @tank ask)
     *
     * @generated from enum value: TASK_RUN_EVENT_STARTED = 1;
     */
    STARTED = 1,
    /**
     * the Tread asks before building: → QUEUED until a yes
     *
     * @generated from enum value: TASK_RUN_EVENT_WAITING = 2;
     */
    WAITING = 2,
    /**
     * the progress line changed
     *
     * @generated from enum value: TASK_RUN_EVENT_PROGRESS = 3;
     */
    PROGRESS = 3,
    /**
     * finished with proof: → READY_TO_CHECK
     *
     * @generated from enum value: TASK_RUN_EVENT_READY = 4;
     */
    READY = 4,
    /**
     * failed, stopped, out of agent time, or at a guardrail
     *
     * @generated from enum value: TASK_RUN_EVENT_STUCK = 5;
     */
    STUCK = 5
}
/**
 * Describes the enum tank.task.v1.TaskRunEvent.
 */
export declare const TaskRunEventSchema: GenEnum<TaskRunEvent>;
/**
 * @generated from service tank.task.v1.TaskService
 */
export declare const TaskService: GenService<{
    /**
     * @generated from rpc tank.task.v1.TaskService.ListTasks
     */
    listTasks: {
        methodKind: "unary";
        input: typeof ListTasksRequestSchema;
        output: typeof ListTasksResponseSchema;
    };
    /**
     * @generated from rpc tank.task.v1.TaskService.GetTask
     */
    getTask: {
        methodKind: "unary";
        input: typeof GetTaskRequestSchema;
        output: typeof GetTaskResponseSchema;
    };
    /**
     * @generated from rpc tank.task.v1.TaskService.CreateTask
     */
    createTask: {
        methodKind: "unary";
        input: typeof CreateTaskRequestSchema;
        output: typeof CreateTaskResponseSchema;
    };
    /**
     * @generated from rpc tank.task.v1.TaskService.CreateTaskWithChannel
     */
    createTaskWithChannel: {
        methodKind: "unary";
        input: typeof CreateTaskWithChannelRequestSchema;
        output: typeof CreateTaskWithChannelResponseSchema;
    };
    /**
     * @generated from rpc tank.task.v1.TaskService.StartTask
     */
    startTask: {
        methodKind: "unary";
        input: typeof StartTaskRequestSchema;
        output: typeof StartTaskResponseSchema;
    };
    /**
     * @generated from rpc tank.task.v1.TaskService.ConfirmTask
     */
    confirmTask: {
        methodKind: "unary";
        input: typeof ConfirmTaskRequestSchema;
        output: typeof ConfirmTaskResponseSchema;
    };
    /**
     * @generated from rpc tank.task.v1.TaskService.SendBackTask
     */
    sendBackTask: {
        methodKind: "unary";
        input: typeof SendBackTaskRequestSchema;
        output: typeof SendBackTaskResponseSchema;
    };
    /**
     * @generated from rpc tank.task.v1.TaskService.RetryTask
     */
    retryTask: {
        methodKind: "unary";
        input: typeof RetryTaskRequestSchema;
        output: typeof RetryTaskResponseSchema;
    };
    /**
     * @generated from rpc tank.task.v1.TaskService.CancelTask
     */
    cancelTask: {
        methodKind: "unary";
        input: typeof CancelTaskRequestSchema;
        output: typeof CancelTaskResponseSchema;
    };
    /**
     * @generated from rpc tank.task.v1.TaskService.SetTaskNotify
     */
    setTaskNotify: {
        methodKind: "unary";
        input: typeof SetTaskNotifyRequestSchema;
        output: typeof SetTaskNotifyResponseSchema;
    };
    /**
     * @generated from rpc tank.task.v1.TaskService.GetTaskSettings
     */
    getTaskSettings: {
        methodKind: "unary";
        input: typeof GetTaskSettingsRequestSchema;
        output: typeof GetTaskSettingsResponseSchema;
    };
    /**
     * @generated from rpc tank.task.v1.TaskService.SetTaskSettings
     */
    setTaskSettings: {
        methodKind: "unary";
        input: typeof SetTaskSettingsRequestSchema;
        output: typeof SetTaskSettingsResponseSchema;
    };
    /**
     * @generated from rpc tank.task.v1.TaskService.RecordTaskRun
     */
    recordTaskRun: {
        methodKind: "unary";
        input: typeof RecordTaskRunRequestSchema;
        output: typeof RecordTaskRunResponseSchema;
    };
    /**
     * @generated from rpc tank.task.v1.TaskService.SendTask
     */
    sendTask: {
        methodKind: "unary";
        input: typeof SendTaskRequestSchema;
        output: typeof SendTaskResponseSchema;
    };
}>;
