import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/agent/v1/agent.proto.
 */
export declare const file_tank_agent_v1_agent: GenFile;
/**
 * @generated from message tank.agent.v1.Agent
 */
export type Agent = Message<"tank.agent.v1.Agent"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * the agent's user row
     *
     * @generated from field: string principal_id = 3;
     */
    principalId: string;
    /**
     * @generated from field: string name = 4;
     */
    name: string;
    /**
     * @generated from field: repeated string scopes = 5;
     */
    scopes: string[];
    /**
     * A Crew member's title and skill (tank.crew.v1); empty for the workspace agent.
     *
     * @generated from field: string title = 6;
     */
    title: string;
    /**
     * @generated from field: string skill = 7;
     */
    skill: string;
    /**
     * Which kind of principal this is. A client draws and gates an agent from this, never
     * from its name or handle.
     *
     * @generated from field: tank.agent.v1.AgentKind kind = 8;
     */
    kind: AgentKind;
    /**
     * The one model this agent runs on, when model_pinned is set (e.g. "tank-neural-1").
     * Empty for an agent that uses the Tread's policy ladder.
     *
     * @generated from field: string model = 9;
     */
    model: string;
    /**
     * True means the model above is the only model the agent may use: no ladder, no
     * default-model routing, no escalation to a stronger model, no subagent model and no
     * fallback when it is not being served (the run is refused with
     * RUN_REFUSAL_REASON_MODEL_UNAVAILABLE). TreadSettings.model and TreadSettings.strongest_model
     * are ignored for a pinned agent; the pin is never overridable by Tread or workspace settings.
     *
     * @generated from field: bool model_pinned = 10;
     */
    modelPinned: boolean;
    /**
     * The lowest plan that may run this agent: "" for any plan, "premium" for premium only.
     * StartRun checks it server-side; a free workspace is refused with
     * RUN_REFUSAL_REASON_PREMIUM_ONLY_AGENT and no trial run is spent.
     *
     * @generated from field: string min_plan = 11;
     */
    minPlan: string;
};
/**
 * Describes the message tank.agent.v1.Agent.
 * Use `create(AgentSchema)` to create a new message.
 */
export declare const AgentSchema: GenMessage<Agent>;
/**
 * @generated from message tank.agent.v1.Run
 */
export type Run = Message<"tank.agent.v1.Run"> & {
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
     * @generated from field: string thread_root_id = 4;
     */
    threadRootId: string;
    /**
     * @generated from field: string agent_id = 5;
     */
    agentId: string;
    /**
     * @generated from field: string requested_by = 6;
     */
    requestedBy: string;
    /**
     * @generated from field: tank.agent.v1.RunState state = 7;
     */
    state: RunState;
    /**
     * @generated from field: string branch = 8;
     */
    branch: string;
    /**
     * @generated from field: string pr_url = 9;
     */
    prUrl: string;
    /**
     * @generated from field: double cost_usd = 10;
     */
    costUsd: number;
    /**
     * @generated from field: string status_message_id = 11;
     */
    statusMessageId: string;
    /**
     * @generated from field: google.protobuf.Timestamp started_at = 12;
     */
    startedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp ended_at = 13;
     */
    endedAt?: Timestamp;
    /**
     * hash of the approved plan, set by the control plane
     *
     * @generated from field: string plan_hash = 14;
     */
    planHash: string;
    /**
     * gate the run is blocked on, if any
     *
     * @generated from field: string pending_gate_id = 15;
     */
    pendingGateId: string;
    /**
     * True when the run took a sandbox prepared from the composer draft instead of
     * provisioning one, so a client and the metrics can tell a warm start from a cold one.
     *
     * @generated from field: bool prepared = 16;
     */
    prepared: boolean;
    /**
     * Delay breakdown, so the wait before the first reply is measured per workspace.
     * acked_at: the immediate acknowledgement was posted. sandbox_ready_at: the sandbox
     * could take work. first_reply_at: the first reply with content (not the ack) was posted.
     *
     * @generated from field: google.protobuf.Timestamp acked_at = 17;
     */
    ackedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp sandbox_ready_at = 18;
     */
    sandboxReadyAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp first_reply_at = 19;
     */
    firstReplyAt?: Timestamp;
    /**
     * When the run entered its current state: a strip shows how long a run has waited on a
     * person ("waiting since 7:38") rather than its whole age (cache7, 2026-11-24: "3h 04m"
     * under a merge waiting for a yes).
     *
     * @generated from field: google.protobuf.Timestamp state_changed_at = 20;
     */
    stateChangedAt?: Timestamp;
};
/**
 * Describes the message tank.agent.v1.Run.
 * Use `create(RunSchema)` to create a new message.
 */
export declare const RunSchema: GenMessage<Run>;
/**
 * @generated from message tank.agent.v1.StartRunRequest
 */
export type StartRunRequest = Message<"tank.agent.v1.StartRunRequest"> & {
    /**
     * @generated from field: string thread_root_id = 1;
     */
    threadRootId: string;
    /**
     * @generated from field: string agent_id = 2;
     */
    agentId: string;
    /**
     * @generated from field: string instructions = 3;
     */
    instructions: string;
    /**
     * Who summoned the agent. The control plane calls this as a bot whose
     * principal is the agent itself, and an agent is not a member of a private
     * Tread until it is brought in, so the caller cannot be the authority on
     * access. This person must be a member of the channel; their membership is
     * what permits the run and what adds the agent to the Tread.
     *
     * @generated from field: string requested_by = 4;
     */
    requestedBy: string;
    /**
     * The run that handed this one its work (an Ops team hand-off), by the core's id of
     * that run; empty for a run a person started. Spend attributes the child to the same
     * person, and the tree hangs off this.
     *
     * @generated from field: string parent_run_id = 5;
     */
    parentRunId: string;
    /**
     * The preparation id from the sender's Draft (tank.workspace.v1.Draft.preparation_id).
     * When it names a live preparation for this thread and agent, the run adopts that warm
     * sandbox; when it is empty, expired or cancelled the run provisions one as before.
     *
     * @generated from field: string preparation_id = 6;
     */
    preparationId: string;
};
/**
 * Describes the message tank.agent.v1.StartRunRequest.
 * Use `create(StartRunRequestSchema)` to create a new message.
 */
export declare const StartRunRequestSchema: GenMessage<StartRunRequest>;
/**
 * @generated from message tank.agent.v1.StartRunResponse
 */
export type StartRunResponse = Message<"tank.agent.v1.StartRunResponse"> & {
    /**
     * @generated from field: tank.agent.v1.Run run = 1;
     */
    run?: Run;
    /**
     * Agent-session token scoped to this thread; TTL = max run duration.
     *
     * @generated from field: string agent_session_token = 2;
     */
    agentSessionToken: string;
    /**
     * @generated from field: google.protobuf.Timestamp token_expires_at = 3;
     */
    tokenExpiresAt?: Timestamp;
    /**
     * Set instead of run when the workspace may not start a run: the typed reason, so the
     * reply and its button are the same on every client. A refusal is a normal answer, not
     * an error.
     *
     * @generated from field: tank.agent.v1.RunRefusal refusal = 4;
     */
    refusal?: RunRefusal;
    /**
     * The thread message posted the moment the run row exists, before the talker call or
     * planning, so the person sees a reply at once. Empty when no acknowledgement was posted.
     *
     * @generated from field: string ack_message_id = 5;
     */
    ackMessageId: string;
};
/**
 * Describes the message tank.agent.v1.StartRunResponse.
 * Use `create(StartRunResponseSchema)` to create a new message.
 */
export declare const StartRunResponseSchema: GenMessage<StartRunResponse>;
/**
 * @generated from message tank.agent.v1.RunRefusal
 */
export type RunRefusal = Message<"tank.agent.v1.RunRefusal"> & {
    /**
     * @generated from field: tank.agent.v1.RunRefusalReason reason = 1;
     */
    reason: RunRefusalReason;
    /**
     * @generated from field: tank.agent.v1.RunRefusalAction action = 2;
     */
    action: RunRefusalAction;
    /**
     * The sentence the agent's reply carries, in words people read.
     *
     * @generated from field: string message = 3;
     */
    message: string;
    /**
     * Label for the button, e.g. "Upgrade" or "Refill".
     *
     * @generated from field: string action_label = 4;
     */
    actionLabel: string;
};
/**
 * Describes the message tank.agent.v1.RunRefusal.
 * Use `create(RunRefusalSchema)` to create a new message.
 */
export declare const RunRefusalSchema: GenMessage<RunRefusal>;
/**
 * Open a new thread in a Tread as one of the workspace's agents: the root of an Ops
 * hand-off or of a shift. Only a bot (the control plane) may call it; the person named
 * in requested_by must be a member of the Tread, as for StartRun, and the agent is
 * seated there if it is not yet. A run's own token cannot open a thread: it is bound to
 * the one it works in, which is the point of it.
 *
 * @generated from message tank.agent.v1.OpenThreadRequest
 */
export type OpenThreadRequest = Message<"tank.agent.v1.OpenThreadRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: string agent_id = 2;
     */
    agentId: string;
    /**
     * @generated from field: string requested_by = 3;
     */
    requestedBy: string;
    /**
     * @generated from field: string text = 4;
     */
    text: string;
    /**
     * The run this thread is opened for (a hand-off's parent), recorded on the root.
     *
     * @generated from field: string parent_run_id = 5;
     */
    parentRunId: string;
    /**
     * What the thread is: "handoff" | "shift" | "" (a plain thread).
     *
     * @generated from field: string kind = 6;
     */
    kind: string;
};
/**
 * Describes the message tank.agent.v1.OpenThreadRequest.
 * Use `create(OpenThreadRequestSchema)` to create a new message.
 */
export declare const OpenThreadRequestSchema: GenMessage<OpenThreadRequest>;
/**
 * @generated from message tank.agent.v1.OpenThreadResponse
 */
export type OpenThreadResponse = Message<"tank.agent.v1.OpenThreadResponse"> & {
    /**
     * @generated from field: string thread_root_id = 1;
     */
    threadRootId: string;
};
/**
 * Describes the message tank.agent.v1.OpenThreadResponse.
 * Use `create(OpenThreadResponseSchema)` to create a new message.
 */
export declare const OpenThreadResponseSchema: GenMessage<OpenThreadResponse>;
/**
 * @generated from message tank.agent.v1.ReplyRequest
 */
export type ReplyRequest = Message<"tank.agent.v1.ReplyRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * The thread replied in: the root message's id.
     *
     * @generated from field: string thread_root_id = 2;
     */
    threadRootId: string;
    /**
     * @generated from field: string agent_id = 3;
     */
    agentId: string;
    /**
     * The person the agent is answering.
     *
     * @generated from field: string requested_by = 4;
     */
    requestedBy: string;
    /**
     * The whole reply so far, as Markdown.
     *
     * @generated from field: string text = 5;
     */
    text: string;
    /**
     * Empty to post; the posted message's id to replace its text.
     *
     * @generated from field: string message_id = 6;
     */
    messageId: string;
    /**
     * Idempotency key for the post: the same key never posts twice.
     *
     * @generated from field: string client_msg_id = 7;
     */
    clientMsgId: string;
};
/**
 * Describes the message tank.agent.v1.ReplyRequest.
 * Use `create(ReplyRequestSchema)` to create a new message.
 */
export declare const ReplyRequestSchema: GenMessage<ReplyRequest>;
/**
 * @generated from message tank.agent.v1.ReplyResponse
 */
export type ReplyResponse = Message<"tank.agent.v1.ReplyResponse"> & {
    /**
     * @generated from field: string message_id = 1;
     */
    messageId: string;
};
/**
 * Describes the message tank.agent.v1.ReplyResponse.
 * Use `create(ReplyResponseSchema)` to create a new message.
 */
export declare const ReplyResponseSchema: GenMessage<ReplyResponse>;
/**
 * @generated from message tank.agent.v1.ShowWorkingRequest
 */
export type ShowWorkingRequest = Message<"tank.agent.v1.ShowWorkingRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * The thread the agent is working in; empty for the Tread itself.
     *
     * @generated from field: string thread_root_id = 2;
     */
    threadRootId: string;
    /**
     * @generated from field: string agent_id = 3;
     */
    agentId: string;
    /**
     * What it is doing, to follow "<agent> is": "reading the thread". Empty clears it.
     *
     * @generated from field: string status = 4;
     */
    status: string;
};
/**
 * Describes the message tank.agent.v1.ShowWorkingRequest.
 * Use `create(ShowWorkingRequestSchema)` to create a new message.
 */
export declare const ShowWorkingRequestSchema: GenMessage<ShowWorkingRequest>;
/**
 * @generated from message tank.agent.v1.ShowWorkingResponse
 */
export type ShowWorkingResponse = Message<"tank.agent.v1.ShowWorkingResponse"> & {};
/**
 * Describes the message tank.agent.v1.ShowWorkingResponse.
 * Use `create(ShowWorkingResponseSchema)` to create a new message.
 */
export declare const ShowWorkingResponseSchema: GenMessage<ShowWorkingResponse>;
/**
 * Workspace-level agent settings, admins only. Off by default.
 *
 * @generated from message tank.agent.v1.WorkspaceAgentSettings
 */
export type WorkspaceAgentSettings = Message<"tank.agent.v1.WorkspaceAgentSettings"> & {
    /**
     * An organization grant ('*') made in any Tread counts for every Tread in the
     * workspace, present and future. Off: access is per Tread, as granted.
     *
     * @generated from field: bool org_access_everywhere = 1;
     */
    orgAccessEverywhere: boolean;
};
/**
 * Describes the message tank.agent.v1.WorkspaceAgentSettings.
 * Use `create(WorkspaceAgentSettingsSchema)` to create a new message.
 */
export declare const WorkspaceAgentSettingsSchema: GenMessage<WorkspaceAgentSettings>;
/**
 * @generated from message tank.agent.v1.GetWorkspaceAgentSettingsRequest
 */
export type GetWorkspaceAgentSettingsRequest = Message<"tank.agent.v1.GetWorkspaceAgentSettingsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.agent.v1.GetWorkspaceAgentSettingsRequest.
 * Use `create(GetWorkspaceAgentSettingsRequestSchema)` to create a new message.
 */
export declare const GetWorkspaceAgentSettingsRequestSchema: GenMessage<GetWorkspaceAgentSettingsRequest>;
/**
 * @generated from message tank.agent.v1.GetWorkspaceAgentSettingsResponse
 */
export type GetWorkspaceAgentSettingsResponse = Message<"tank.agent.v1.GetWorkspaceAgentSettingsResponse"> & {
    /**
     * @generated from field: tank.agent.v1.WorkspaceAgentSettings settings = 1;
     */
    settings?: WorkspaceAgentSettings;
    /**
     * the caller is an admin or owner
     *
     * @generated from field: bool can_manage = 2;
     */
    canManage: boolean;
};
/**
 * Describes the message tank.agent.v1.GetWorkspaceAgentSettingsResponse.
 * Use `create(GetWorkspaceAgentSettingsResponseSchema)` to create a new message.
 */
export declare const GetWorkspaceAgentSettingsResponseSchema: GenMessage<GetWorkspaceAgentSettingsResponse>;
/**
 * @generated from message tank.agent.v1.SetWorkspaceAgentSettingsRequest
 */
export type SetWorkspaceAgentSettingsRequest = Message<"tank.agent.v1.SetWorkspaceAgentSettingsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: tank.agent.v1.WorkspaceAgentSettings settings = 2;
     */
    settings?: WorkspaceAgentSettings;
};
/**
 * Describes the message tank.agent.v1.SetWorkspaceAgentSettingsRequest.
 * Use `create(SetWorkspaceAgentSettingsRequestSchema)` to create a new message.
 */
export declare const SetWorkspaceAgentSettingsRequestSchema: GenMessage<SetWorkspaceAgentSettingsRequest>;
/**
 * @generated from message tank.agent.v1.SetWorkspaceAgentSettingsResponse
 */
export type SetWorkspaceAgentSettingsResponse = Message<"tank.agent.v1.SetWorkspaceAgentSettingsResponse"> & {
    /**
     * @generated from field: tank.agent.v1.WorkspaceAgentSettings settings = 1;
     */
    settings?: WorkspaceAgentSettings;
};
/**
 * Describes the message tank.agent.v1.SetWorkspaceAgentSettingsResponse.
 * Use `create(SetWorkspaceAgentSettingsResponseSchema)` to create a new message.
 */
export declare const SetWorkspaceAgentSettingsResponseSchema: GenMessage<SetWorkspaceAgentSettingsResponse>;
/**
 * @generated from message tank.agent.v1.StopRunRequest
 */
export type StopRunRequest = Message<"tank.agent.v1.StopRunRequest"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
    /**
     * @generated from field: string reason = 2;
     */
    reason: string;
};
/**
 * Describes the message tank.agent.v1.StopRunRequest.
 * Use `create(StopRunRequestSchema)` to create a new message.
 */
export declare const StopRunRequestSchema: GenMessage<StopRunRequest>;
/**
 * @generated from message tank.agent.v1.StopRunResponse
 */
export type StopRunResponse = Message<"tank.agent.v1.StopRunResponse"> & {
    /**
     * @generated from field: tank.agent.v1.Run run = 1;
     */
    run?: Run;
};
/**
 * Describes the message tank.agent.v1.StopRunResponse.
 * Use `create(StopRunResponseSchema)` to create a new message.
 */
export declare const StopRunResponseSchema: GenMessage<StopRunResponse>;
/**
 * @generated from message tank.agent.v1.HeartbeatRequest
 */
export type HeartbeatRequest = Message<"tank.agent.v1.HeartbeatRequest"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
};
/**
 * Describes the message tank.agent.v1.HeartbeatRequest.
 * Use `create(HeartbeatRequestSchema)` to create a new message.
 */
export declare const HeartbeatRequestSchema: GenMessage<HeartbeatRequest>;
/**
 * @generated from message tank.agent.v1.HeartbeatResponse
 */
export type HeartbeatResponse = Message<"tank.agent.v1.HeartbeatResponse"> & {};
/**
 * Describes the message tank.agent.v1.HeartbeatResponse.
 * Use `create(HeartbeatResponseSchema)` to create a new message.
 */
export declare const HeartbeatResponseSchema: GenMessage<HeartbeatResponse>;
/**
 * A fresh agent-session token for a run that has not ended, for the control plane only. A
 * run can wait days for a person (a plan or merge approval) and its token keeps a fixed
 * eight-hour clock; without this the run could not say anything once the wait was over.
 * The old token is revoked; the new one has the same principal, workspace, thread, scopes
 * and clock.
 *
 * @generated from message tank.agent.v1.RenewRunTokenRequest
 */
export type RenewRunTokenRequest = Message<"tank.agent.v1.RenewRunTokenRequest"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
};
/**
 * Describes the message tank.agent.v1.RenewRunTokenRequest.
 * Use `create(RenewRunTokenRequestSchema)` to create a new message.
 */
export declare const RenewRunTokenRequestSchema: GenMessage<RenewRunTokenRequest>;
/**
 * @generated from message tank.agent.v1.RenewRunTokenResponse
 */
export type RenewRunTokenResponse = Message<"tank.agent.v1.RenewRunTokenResponse"> & {
    /**
     * @generated from field: string agent_session_token = 1;
     */
    agentSessionToken: string;
    /**
     * @generated from field: google.protobuf.Timestamp token_expires_at = 2;
     */
    tokenExpiresAt?: Timestamp;
};
/**
 * Describes the message tank.agent.v1.RenewRunTokenResponse.
 * Use `create(RenewRunTokenResponseSchema)` to create a new message.
 */
export declare const RenewRunTokenResponseSchema: GenMessage<RenewRunTokenResponse>;
/**
 * @generated from message tank.agent.v1.PublishRunStreamRequest
 */
export type PublishRunStreamRequest = Message<"tank.agent.v1.PublishRunStreamRequest"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
    /**
     * per run, starting at 1, assigned by the control plane
     *
     * @generated from field: uint64 seq = 2;
     */
    seq: bigint;
    /**
     * @generated from field: tank.agent.v1.RunStreamKind kind = 3;
     */
    kind: RunStreamKind;
    /**
     * @generated from field: string text = 4;
     */
    text: string;
    /**
     * a new turn begins: clear the partial text first
     *
     * @generated from field: bool reset = 5;
     */
    reset: boolean;
};
/**
 * Describes the message tank.agent.v1.PublishRunStreamRequest.
 * Use `create(PublishRunStreamRequestSchema)` to create a new message.
 */
export declare const PublishRunStreamRequestSchema: GenMessage<PublishRunStreamRequest>;
/**
 * @generated from message tank.agent.v1.PublishRunStreamResponse
 */
export type PublishRunStreamResponse = Message<"tank.agent.v1.PublishRunStreamResponse"> & {};
/**
 * Describes the message tank.agent.v1.PublishRunStreamResponse.
 * Use `create(PublishRunStreamResponseSchema)` to create a new message.
 */
export declare const PublishRunStreamResponseSchema: GenMessage<PublishRunStreamResponse>;
/**
 * @generated from message tank.agent.v1.GetRunStreamTailRequest
 */
export type GetRunStreamTailRequest = Message<"tank.agent.v1.GetRunStreamTailRequest"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
};
/**
 * Describes the message tank.agent.v1.GetRunStreamTailRequest.
 * Use `create(GetRunStreamTailRequestSchema)` to create a new message.
 */
export declare const GetRunStreamTailRequestSchema: GenMessage<GetRunStreamTailRequest>;
/**
 * @generated from message tank.agent.v1.GetRunStreamTailResponse
 */
export type GetRunStreamTailResponse = Message<"tank.agent.v1.GetRunStreamTailResponse"> & {
    /**
     * assistant text so far in the current turn
     *
     * @generated from field: string text = 1;
     */
    text: string;
    /**
     * the latest status line, empty if none
     *
     * @generated from field: string status = 2;
     */
    status: string;
    /**
     * seq of the last delta included; continue from last_seq + 1
     *
     * @generated from field: uint64 last_seq = 3;
     */
    lastSeq: bigint;
};
/**
 * Describes the message tank.agent.v1.GetRunStreamTailResponse.
 * Use `create(GetRunStreamTailResponseSchema)` to create a new message.
 */
export declare const GetRunStreamTailResponseSchema: GenMessage<GetRunStreamTailResponse>;
/**
 * @generated from message tank.agent.v1.SetStatusRequest
 */
export type SetStatusRequest = Message<"tank.agent.v1.SetStatusRequest"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
    /**
     * @generated from field: tank.agent.v1.RunState state = 2;
     */
    state: RunState;
    /**
     * human-readable, shown like typing
     *
     * @generated from field: string status = 3;
     */
    status: string;
    /**
     * @generated from field: string branch = 4;
     */
    branch: string;
    /**
     * @generated from field: string pr_url = 5;
     */
    prUrl: string;
    /**
     * @generated from field: double cost_usd = 6;
     */
    costUsd: number;
};
/**
 * Describes the message tank.agent.v1.SetStatusRequest.
 * Use `create(SetStatusRequestSchema)` to create a new message.
 */
export declare const SetStatusRequestSchema: GenMessage<SetStatusRequest>;
/**
 * @generated from message tank.agent.v1.SetStatusResponse
 */
export type SetStatusResponse = Message<"tank.agent.v1.SetStatusResponse"> & {
    /**
     * @generated from field: tank.agent.v1.Run run = 1;
     */
    run?: Run;
};
/**
 * Describes the message tank.agent.v1.SetStatusResponse.
 * Use `create(SetStatusResponseSchema)` to create a new message.
 */
export declare const SetStatusResponseSchema: GenMessage<SetStatusResponse>;
/**
 * SetProductBrand gives a product its mark and palette, from the run working in it.
 *
 * @generated from message tank.agent.v1.SetProductBrandRequest
 */
export type SetProductBrandRequest = Message<"tank.agent.v1.SetProductBrandRequest"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
    /**
     * viewBox 0 0 64 64; sanitised on the way in
     *
     * @generated from field: string icon_svg = 2;
     */
    iconSvg: string;
    /**
     * hex colours
     *
     * @generated from field: string primary = 3;
     */
    primary: string;
    /**
     * @generated from field: string secondary = 4;
     */
    secondary: string;
    /**
     * @generated from field: string background = 5;
     */
    background: string;
    /**
     * @generated from field: string accent = 6;
     */
    accent: string;
    /**
     * @generated from field: string tagline = 7;
     */
    tagline: string;
};
/**
 * Describes the message tank.agent.v1.SetProductBrandRequest.
 * Use `create(SetProductBrandRequestSchema)` to create a new message.
 */
export declare const SetProductBrandRequestSchema: GenMessage<SetProductBrandRequest>;
/**
 * @generated from message tank.agent.v1.SetProductBrandResponse
 */
export type SetProductBrandResponse = Message<"tank.agent.v1.SetProductBrandResponse"> & {
    /**
     * where the catalogue serves it
     *
     * @generated from field: string icon_url = 1;
     */
    iconUrl: string;
};
/**
 * Describes the message tank.agent.v1.SetProductBrandResponse.
 * Use `create(SetProductBrandResponseSchema)` to create a new message.
 */
export declare const SetProductBrandResponseSchema: GenMessage<SetProductBrandResponse>;
/**
 * SetProductLanding stores the product's landing page, sanitised, for its catalogue page.
 *
 * @generated from message tank.agent.v1.SetProductLandingRequest
 */
export type SetProductLandingRequest = Message<"tank.agent.v1.SetProductLandingRequest"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
    /**
     * @generated from field: string html = 2;
     */
    html: string;
};
/**
 * Describes the message tank.agent.v1.SetProductLandingRequest.
 * Use `create(SetProductLandingRequestSchema)` to create a new message.
 */
export declare const SetProductLandingRequestSchema: GenMessage<SetProductLandingRequest>;
/**
 * @generated from message tank.agent.v1.SetProductLandingResponse
 */
export type SetProductLandingResponse = Message<"tank.agent.v1.SetProductLandingResponse"> & {};
/**
 * Describes the message tank.agent.v1.SetProductLandingResponse.
 * Use `create(SetProductLandingResponseSchema)` to create a new message.
 */
export declare const SetProductLandingResponseSchema: GenMessage<SetProductLandingResponse>;
/**
 * RecordProductFinding stores one structured research fact about an existing tool,
 * from a run on a product of the board. See agentctl.RecordFinding for the fields.
 *
 * @generated from message tank.agent.v1.RecordProductFindingRequest
 */
export type RecordProductFindingRequest = Message<"tank.agent.v1.RecordProductFindingRequest"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
    /**
     * @generated from field: string tool = 2;
     */
    tool: string;
    /**
     * @generated from field: string kind = 3;
     */
    kind: string;
    /**
     * @generated from field: string value = 4;
     */
    value: string;
    /**
     * @generated from field: double amount = 5;
     */
    amount: number;
    /**
     * @generated from field: string unit = 6;
     */
    unit: string;
    /**
     * @generated from field: string quote = 7;
     */
    quote: string;
    /**
     * @generated from field: string url = 8;
     */
    url: string;
};
/**
 * Describes the message tank.agent.v1.RecordProductFindingRequest.
 * Use `create(RecordProductFindingRequestSchema)` to create a new message.
 */
export declare const RecordProductFindingRequestSchema: GenMessage<RecordProductFindingRequest>;
/**
 * @generated from message tank.agent.v1.RecordProductFindingResponse
 */
export type RecordProductFindingResponse = Message<"tank.agent.v1.RecordProductFindingResponse"> & {};
/**
 * Describes the message tank.agent.v1.RecordProductFindingResponse.
 * Use `create(RecordProductFindingResponseSchema)` to create a new message.
 */
export declare const RecordProductFindingResponseSchema: GenMessage<RecordProductFindingResponse>;
/**
 * @generated from message tank.agent.v1.GetRunRequest
 */
export type GetRunRequest = Message<"tank.agent.v1.GetRunRequest"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
};
/**
 * Describes the message tank.agent.v1.GetRunRequest.
 * Use `create(GetRunRequestSchema)` to create a new message.
 */
export declare const GetRunRequestSchema: GenMessage<GetRunRequest>;
/**
 * @generated from message tank.agent.v1.GetRunResponse
 */
export type GetRunResponse = Message<"tank.agent.v1.GetRunResponse"> & {
    /**
     * @generated from field: tank.agent.v1.Run run = 1;
     */
    run?: Run;
};
/**
 * Describes the message tank.agent.v1.GetRunResponse.
 * Use `create(GetRunResponseSchema)` to create a new message.
 */
export declare const GetRunResponseSchema: GenMessage<GetRunResponse>;
/**
 * @generated from message tank.agent.v1.ListRunsRequest
 */
export type ListRunsRequest = Message<"tank.agent.v1.ListRunsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * @generated from field: string thread_root_id = 3;
     */
    threadRootId: string;
    /**
     * @generated from field: string cursor = 4;
     */
    cursor: string;
    /**
     * @generated from field: int32 limit = 5;
     */
    limit: number;
};
/**
 * Describes the message tank.agent.v1.ListRunsRequest.
 * Use `create(ListRunsRequestSchema)` to create a new message.
 */
export declare const ListRunsRequestSchema: GenMessage<ListRunsRequest>;
/**
 * @generated from message tank.agent.v1.ListRunsResponse
 */
export type ListRunsResponse = Message<"tank.agent.v1.ListRunsResponse"> & {
    /**
     * @generated from field: repeated tank.agent.v1.Run runs = 1;
     */
    runs: Run[];
    /**
     * @generated from field: string next_cursor = 2;
     */
    nextCursor: string;
};
/**
 * Describes the message tank.agent.v1.ListRunsResponse.
 * Use `create(ListRunsResponseSchema)` to create a new message.
 */
export declare const ListRunsResponseSchema: GenMessage<ListRunsResponse>;
/**
 * @generated from message tank.agent.v1.ListAgentsRequest
 */
export type ListAgentsRequest = Message<"tank.agent.v1.ListAgentsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.agent.v1.ListAgentsRequest.
 * Use `create(ListAgentsRequestSchema)` to create a new message.
 */
export declare const ListAgentsRequestSchema: GenMessage<ListAgentsRequest>;
/**
 * @generated from message tank.agent.v1.ListAgentsResponse
 */
export type ListAgentsResponse = Message<"tank.agent.v1.ListAgentsResponse"> & {
    /**
     * @generated from field: repeated tank.agent.v1.Agent agents = 1;
     */
    agents: Agent[];
};
/**
 * Describes the message tank.agent.v1.ListAgentsResponse.
 * Use `create(ListAgentsResponseSchema)` to create a new message.
 */
export declare const ListAgentsResponseSchema: GenMessage<ListAgentsResponse>;
/**
 * What a Tread knows about GitHub: whether the workspace is connected at all, what
 * that installation can reach, and which repository this Tread works on.
 *
 * @generated from message tank.agent.v1.RepoBinding
 */
export type RepoBinding = Message<"tank.agent.v1.RepoBinding"> & {
    /**
     * owner/name
     *
     * @generated from field: string repo = 1;
     */
    repo: string;
    /**
     * default "main"
     *
     * @generated from field: string base_branch = 2;
     */
    baseBranch: string;
    /**
     * node | go | python | expo
     *
     * @generated from field: string toolchain = 3;
     */
    toolchain: string;
};
/**
 * Describes the message tank.agent.v1.RepoBinding.
 * Use `create(RepoBindingSchema)` to create a new message.
 */
export declare const RepoBindingSchema: GenMessage<RepoBinding>;
/**
 * RepoAccess is one further repository a Tread's agent may reach, and how far. The
 * primary repository (RepoBinding) is where runs branch and open pull requests and
 * is always writable; these are the others: "read" to clone and study, "write" to
 * push branches and open pull requests there too.
 *
 * @generated from message tank.agent.v1.RepoAccess
 */
export type RepoAccess = Message<"tank.agent.v1.RepoAccess"> & {
    /**
     * owner/name
     *
     * @generated from field: string repo = 1;
     */
    repo: string;
    /**
     * read | write
     *
     * @generated from field: string access = 2;
     */
    access: string;
};
/**
 * Describes the message tank.agent.v1.RepoAccess.
 * Use `create(RepoAccessSchema)` to create a new message.
 */
export declare const RepoAccessSchema: GenMessage<RepoAccess>;
/**
 * @generated from message tank.agent.v1.RepoConnection
 */
export type RepoConnection = Message<"tank.agent.v1.RepoConnection"> & {
    /**
     * the workspace has a GitHub installation
     *
     * @generated from field: bool connected = 1;
     */
    connected: boolean;
    /**
     * the org it is installed into
     *
     * @generated from field: string account_login = 2;
     */
    accountLogin: string;
    /**
     * what that installation can reach
     *
     * @generated from field: repeated string repos = 3;
     */
    repos: string[];
    /**
     * this Tread's binding, absent when unbound
     *
     * @generated from field: tank.agent.v1.RepoBinding binding = 4;
     */
    binding?: RepoBinding;
    /**
     * the caller may connect and bind: workspace admins only
     *
     * @generated from field: bool can_manage = 5;
     */
    canManage: boolean;
    /**
     * the further repositories this Tread may reach
     *
     * @generated from field: repeated tank.agent.v1.RepoAccess access = 6;
     */
    access: RepoAccess[];
    /**
     * Premium workspaces may ask TANK for a repository and hosting; both are requests an
     * admin makes, never a side effect of anything else.
     *
     * @generated from field: bool premium = 7;
     */
    premium: boolean;
    /**
     * the platform can create repositories and host them right now
     *
     * @generated from field: bool hosting_available = 8;
     */
    hostingAvailable: boolean;
    /**
     * present once TANK made this Tread's repository
     *
     * @generated from field: tank.agent.v1.TreadDeployment deployment = 9;
     */
    deployment?: TreadDeployment;
};
/**
 * Describes the message tank.agent.v1.RepoConnection.
 * Use `create(RepoConnectionSchema)` to create a new message.
 */
export declare const RepoConnectionSchema: GenMessage<RepoConnection>;
/**
 * SetRepoAccess replaces the Tread's list of further repositories. Admins only; every
 * repository must be one the workspace's installation can reach, and the primary is
 * not listed here (it is always writable).
 *
 * @generated from message tank.agent.v1.SetRepoAccessRequest
 */
export type SetRepoAccessRequest = Message<"tank.agent.v1.SetRepoAccessRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: repeated tank.agent.v1.RepoAccess access = 2;
     */
    access: RepoAccess[];
};
/**
 * Describes the message tank.agent.v1.SetRepoAccessRequest.
 * Use `create(SetRepoAccessRequestSchema)` to create a new message.
 */
export declare const SetRepoAccessRequestSchema: GenMessage<SetRepoAccessRequest>;
/**
 * @generated from message tank.agent.v1.SetRepoAccessResponse
 */
export type SetRepoAccessResponse = Message<"tank.agent.v1.SetRepoAccessResponse"> & {
    /**
     * @generated from field: repeated tank.agent.v1.RepoAccess access = 1;
     */
    access: RepoAccess[];
};
/**
 * Describes the message tank.agent.v1.SetRepoAccessResponse.
 * Use `create(SetRepoAccessResponseSchema)` to create a new message.
 */
export declare const SetRepoAccessResponseSchema: GenMessage<SetRepoAccessResponse>;
/**
 * Previews for repositories the workspace has already connected.
 *
 * TANK serves previews of the applications it builds; a workspace that builds its own
 * tells TANK where it put each build (BoardService.ReportPreview) and a frame points
 * at that. Handing somebody a snippet and wishing them luck is the weak half of that
 * trade: if the workspace has connected GitHub and TANK can reach the repository, TANK
 * can open the pull request itself.
 *
 * It is a pull request and never a push: a workflow file in somebody else's repository
 * is their decision. Several repositories at once, because a workspace that connects a
 * front end and an API wants a frame of each, and one failing must not stop the rest.
 *
 * @generated from message tank.agent.v1.SetUpRepoPreviewsRequest
 */
export type SetUpRepoPreviewsRequest = Message<"tank.agent.v1.SetUpRepoPreviewsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * owner/name each; one pull request per repository
     *
     * @generated from field: repeated string repos = 2;
     */
    repos: string[];
    /**
     * The branch each pull request targets. Empty means each repository's own default,
     * which is nearly always the right answer and the only one TANK can work out.
     *
     * @generated from field: string base_branch = 3;
     */
    baseBranch: string;
    /**
     * Issue a new token and revoke the one before it. The token is shown once and is
     * not readable afterwards, so rotating is the only way back from losing it.
     *
     * @generated from field: bool rotate_token = 4;
     */
    rotateToken: boolean;
};
/**
 * Describes the message tank.agent.v1.SetUpRepoPreviewsRequest.
 * Use `create(SetUpRepoPreviewsRequestSchema)` to create a new message.
 */
export declare const SetUpRepoPreviewsRequestSchema: GenMessage<SetUpRepoPreviewsRequest>;
/**
 * What happened for one repository. A repository that could not be set up carries its
 * own sentence saying why; the others are unaffected by it.
 *
 * @generated from message tank.agent.v1.RepoPreviewSetup
 */
export type RepoPreviewSetup = Message<"tank.agent.v1.RepoPreviewSetup"> & {
    /**
     * @generated from field: string repo = 1;
     */
    repo: string;
    /**
     * opened | already_open | refused. "already_open" is the idempotent answer: the
     * pull request was there from an earlier ask and no second one was opened.
     *
     * @generated from field: string status = 2;
     */
    status: string;
    /**
     * @generated from field: string pull_request_url = 3;
     */
    pullRequestUrl: string;
    /**
     * the head branch TANK pushed the workflow to
     *
     * @generated from field: string branch = 4;
     */
    branch: string;
    /**
     * where the file sits in the pull request
     *
     * @generated from field: string workflow_path = 5;
     */
    workflowPath: string;
    /**
     * why it was refused, in a sentence; empty otherwise
     *
     * @generated from field: string reason = 6;
     */
    reason: string;
    /**
     * @generated from field: google.protobuf.Timestamp requested_at = 7;
     */
    requestedAt?: Timestamp;
};
/**
 * Describes the message tank.agent.v1.RepoPreviewSetup.
 * Use `create(RepoPreviewSetupSchema)` to create a new message.
 */
export declare const RepoPreviewSetupSchema: GenMessage<RepoPreviewSetup>;
/**
 * @generated from message tank.agent.v1.SetUpRepoPreviewsResponse
 */
export type SetUpRepoPreviewsResponse = Message<"tank.agent.v1.SetUpRepoPreviewsResponse"> & {
    /**
     * @generated from field: repeated tank.agent.v1.RepoPreviewSetup results = 1;
     */
    results: RepoPreviewSetup[];
    /**
     * The token the repositories' CI authenticates with, returned exactly once and
     * never readable again. Empty when a token had already been issued and
     * rotate_token was not set. One token for the workspace, not one per repository:
     * the same secret name goes in every repository.
     *
     * @generated from field: string token = 2;
     */
    token: string;
    /**
     * @generated from field: string secret_name = 3;
     */
    secretName: string;
    /**
     * a token exists, whether or not it is in this response
     *
     * @generated from field: bool token_issued = 4;
     */
    tokenIssued: boolean;
    /**
     * What the workspace still has to do by hand, in plain words, so a client can show
     * it without knowing any of this.
     *
     * @generated from field: repeated string next_steps = 5;
     */
    nextSteps: string[];
};
/**
 * Describes the message tank.agent.v1.SetUpRepoPreviewsResponse.
 * Use `create(SetUpRepoPreviewsResponseSchema)` to create a new message.
 */
export declare const SetUpRepoPreviewsResponseSchema: GenMessage<SetUpRepoPreviewsResponse>;
/**
 * What has been set up already, so a board's settings can show it without asking TANK
 * to open anything.
 *
 * @generated from message tank.agent.v1.ListRepoPreviewSetupsRequest
 */
export type ListRepoPreviewSetupsRequest = Message<"tank.agent.v1.ListRepoPreviewSetupsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.agent.v1.ListRepoPreviewSetupsRequest.
 * Use `create(ListRepoPreviewSetupsRequestSchema)` to create a new message.
 */
export declare const ListRepoPreviewSetupsRequestSchema: GenMessage<ListRepoPreviewSetupsRequest>;
/**
 * @generated from message tank.agent.v1.ListRepoPreviewSetupsResponse
 */
export type ListRepoPreviewSetupsResponse = Message<"tank.agent.v1.ListRepoPreviewSetupsResponse"> & {
    /**
     * @generated from field: repeated tank.agent.v1.RepoPreviewSetup setups = 1;
     */
    setups: RepoPreviewSetup[];
    /**
     * @generated from field: string secret_name = 2;
     */
    secretName: string;
    /**
     * @generated from field: bool token_issued = 3;
     */
    tokenIssued: boolean;
};
/**
 * Describes the message tank.agent.v1.ListRepoPreviewSetupsResponse.
 * Use `create(ListRepoPreviewSetupsResponseSchema)` to create a new message.
 */
export declare const ListRepoPreviewSetupsResponseSchema: GenMessage<ListRepoPreviewSetupsResponse>;
/**
 * The Tread's switchboard: what its agents cost and did, by the hour, and the knobs a
 * workspace admin turns. Spend is the workspace's own: the workspace pays for its agents.
 *
 * @generated from message tank.agent.v1.TreadSettings
 */
export type TreadSettings = Message<"tank.agent.v1.TreadSettings"> & {
    /**
     * agents at once in this Tread, 1..5
     *
     * @generated from field: int32 concurrent_runs = 1;
     */
    concurrentRuns: number;
    /**
     * skip the plan gate: the agent goes straight from plan to work
     *
     * @generated from field: bool auto_accept_plans = 2;
     */
    autoAcceptPlans: boolean;
    /**
     * a single run's ceiling; 0 keeps the workspace default
     *
     * @generated from field: double max_run_usd = 3;
     */
    maxRunUsd: number;
    /**
     * this Tread's ceiling for a day; 0 keeps the workspace default
     *
     * @generated from field: double daily_usd = 4;
     */
    dailyUsd: number;
    /**
     * What happens to a pull request the agent opens: "review" (default) posts it and
     * mentions pr_reviewer_ids in the thread; "merge_when_green" has TANK watch the
     * checks and merge it, so the agent's work keeps flowing without a person.
     *
     * @generated from field: string pull_requests = 5;
     */
    pullRequests: string;
    /**
     * user ids mentioned when a pull request is ready
     *
     * @generated from field: repeated string pr_reviewer_ids = 6;
     */
    prReviewerIds: string[];
    /**
     * Whether runs in this Tread read the repository's Neural Knowledge and record what
     * they learn. On by default; the server always sets it.
     *
     * @generated from field: bool read_neural_knowledge = 7;
     */
    readNeuralKnowledge: boolean;
    /**
     * Whether TANK may approve and merge the pull requests it opens in this Tread's
     * repositories. Off, a pull request is a proposal and a person merges it; on, the
     * Tread decides how: pull_requests "merge_when_green" merges once the checks pass,
     * "review" asks for an approval in the thread and merges on it.
     *
     * @generated from field: bool merge_allowed = 8;
     */
    mergeAllowed: boolean;
    /**
     * When a pull request waits on a person (merge_allowed off, or pull_requests
     * "review"): mention pr_reviewer_ids, or the person who asked for the run when the
     * list is empty, so somebody hears about it. Off, the card is posted and waits.
     *
     * @generated from field: bool notify_reviewers = 9;
     */
    notifyReviewers: boolean;
    /**
     * Run this Tread's code on the strongest model (Opus) from the start. Off, a run
     * starts on Sonnet and is moved up only after its checks have failed twice; most
     * work never needs the move, and the strongest model costs two and a half times as
     * much on every token.
     *
     * @generated from field: bool strongest_model = 10;
     */
    strongestModel: boolean;
    /**
     * The model this Tread's runs use, by name, chosen on the switchboard: "" lets TANK
     * decide per run (the default), "tank-neural-1" is TANK's own model, and the Claude
     * names are routed as they are. A name the gateway does not know is refused at save.
     * Supersedes strongest_model, which stays for older clients: picking claude-opus-5
     * is what that switch meant.
     *
     * @generated from field: string model = 11;
     */
    model: string;
};
/**
 * Describes the message tank.agent.v1.TreadSettings.
 * Use `create(TreadSettingsSchema)` to create a new message.
 */
export declare const TreadSettingsSchema: GenMessage<TreadSettings>;
/**
 * @generated from message tank.agent.v1.HourBucket
 */
export type HourBucket = Message<"tank.agent.v1.HourBucket"> & {
    /**
     * @generated from field: google.protobuf.Timestamp hour = 1;
     */
    hour?: Timestamp;
    /**
     * @generated from field: int32 runs = 2;
     */
    runs: number;
    /**
     * @generated from field: double spend_usd = 3;
     */
    spendUsd: number;
    /**
     * What Neural Knowledge saved on this hour's runs: for each run, the per-run cost of
     * the same class of work on the same model in the earlier half of the last thirty
     * days, less what the run cost, when the comparison exists. An estimate against a
     * baseline, not a measurement with a control; zero while nothing is comparable.
     *
     * @generated from field: double neural_saved_usd = 4;
     */
    neuralSavedUsd: number;
};
/**
 * Describes the message tank.agent.v1.HourBucket.
 * Use `create(HourBucketSchema)` to create a new message.
 */
export declare const HourBucketSchema: GenMessage<HourBucket>;
/**
 * @generated from message tank.agent.v1.TreadMetrics
 */
export type TreadMetrics = Message<"tank.agent.v1.TreadMetrics"> & {
    /**
     * @generated from field: double spend_today_usd = 1;
     */
    spendTodayUsd: number;
    /**
     * @generated from field: double spend_month_usd = 2;
     */
    spendMonthUsd: number;
    /**
     * @generated from field: int32 runs_today = 3;
     */
    runsToday: number;
    /**
     * @generated from field: int32 runs_month = 4;
     */
    runsMonth: number;
    /**
     * 0..1, done or delivered over finished runs
     *
     * @generated from field: double success_rate_30d = 5;
     */
    successRate30d: number;
    /**
     * the last twenty-four hours, oldest first
     *
     * @generated from field: repeated tank.agent.v1.HourBucket hours = 6;
     */
    hours: HourBucket[];
    /**
     * @generated from field: double workspace_spend_today_usd = 7;
     */
    workspaceSpendTodayUsd: number;
    /**
     * @generated from field: double workspace_spend_month_usd = 8;
     */
    workspaceSpendMonthUsd: number;
    /**
     * @generated from field: int32 running_now = 9;
     */
    runningNow: number;
    /**
     * @generated from field: double avg_run_minutes_30d = 10;
     */
    avgRunMinutes30d: number;
    /**
     * the same estimate, over this month's runs
     *
     * @generated from field: double neural_saved_month_usd = 11;
     */
    neuralSavedMonthUsd: number;
    /**
     * Whether any of this month's runs had a baseline to compare against. False reads
     * "measuring", never zero saved: after a model change nothing is comparable for a while.
     *
     * @generated from field: bool neural_measured = 12;
     */
    neuralMeasured: boolean;
    /**
     * Who asked for this Tread's runs this month, most spend first.
     *
     * @generated from field: repeated tank.agent.v1.SpendByPerson people = 13;
     */
    people: SpendByPerson[];
    /**
     * Every Tread in the workspace with a run this month, most spend first, each with the
     * people who asked for its runs. A member sees the Treads they belong to and the
     * public ones; a workspace admin sees them all. The workspace totals above count
     * every Tread either way.
     *
     * @generated from field: repeated tank.agent.v1.SpendByTread treads = 14;
     */
    treads: SpendByTread[];
};
/**
 * Describes the message tank.agent.v1.TreadMetrics.
 * Use `create(TreadMetricsSchema)` to create a new message.
 */
export declare const TreadMetricsSchema: GenMessage<TreadMetrics>;
/**
 * What one person's asks cost: the runs they requested, this month and today. Dollars
 * are marked up like everything else on the switchboard.
 *
 * @generated from message tank.agent.v1.SpendByPerson
 */
export type SpendByPerson = Message<"tank.agent.v1.SpendByPerson"> & {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
    /**
     * @generated from field: string display_name = 2;
     */
    displayName: string;
    /**
     * @generated from field: int32 runs_month = 3;
     */
    runsMonth: number;
    /**
     * @generated from field: double spend_month_usd = 4;
     */
    spendMonthUsd: number;
    /**
     * @generated from field: int32 runs_today = 5;
     */
    runsToday: number;
    /**
     * @generated from field: double spend_today_usd = 6;
     */
    spendTodayUsd: number;
};
/**
 * Describes the message tank.agent.v1.SpendByPerson.
 * Use `create(SpendByPersonSchema)` to create a new message.
 */
export declare const SpendByPersonSchema: GenMessage<SpendByPerson>;
/**
 * What one Tread's runs cost, and who asked for them.
 *
 * @generated from message tank.agent.v1.SpendByTread
 */
export type SpendByTread = Message<"tank.agent.v1.SpendByTread"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: int32 runs_month = 3;
     */
    runsMonth: number;
    /**
     * @generated from field: double spend_month_usd = 4;
     */
    spendMonthUsd: number;
    /**
     * @generated from field: int32 runs_today = 5;
     */
    runsToday: number;
    /**
     * @generated from field: double spend_today_usd = 6;
     */
    spendTodayUsd: number;
    /**
     * @generated from field: repeated tank.agent.v1.SpendByPerson people = 7;
     */
    people: SpendByPerson[];
};
/**
 * Describes the message tank.agent.v1.SpendByTread.
 * Use `create(SpendByTreadSchema)` to create a new message.
 */
export declare const SpendByTreadSchema: GenMessage<SpendByTread>;
/**
 * What one Ops team's runs cost, and who asked for them.
 *
 * @generated from message tank.agent.v1.SpendByTeam
 */
export type SpendByTeam = Message<"tank.agent.v1.SpendByTeam"> & {
    /**
     * @generated from field: string team_id = 1;
     */
    teamId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: int32 runs_month = 3;
     */
    runsMonth: number;
    /**
     * @generated from field: double spend_month_usd = 4;
     */
    spendMonthUsd: number;
    /**
     * @generated from field: int32 runs_today = 5;
     */
    runsToday: number;
    /**
     * @generated from field: double spend_today_usd = 6;
     */
    spendTodayUsd: number;
    /**
     * @generated from field: repeated tank.agent.v1.SpendByPerson people = 7;
     */
    people: SpendByPerson[];
};
/**
 * Describes the message tank.agent.v1.SpendByTeam.
 * Use `create(SpendByTeamSchema)` to create a new message.
 */
export declare const SpendByTeamSchema: GenMessage<SpendByTeam>;
/**
 * One UTC day of the workspace's agent spend.
 *
 * @generated from message tank.agent.v1.SpendByDay
 */
export type SpendByDay = Message<"tank.agent.v1.SpendByDay"> & {
    /**
     * YYYY-MM-DD, UTC
     *
     * @generated from field: string day = 1;
     */
    day: string;
    /**
     * @generated from field: int32 runs = 2;
     */
    runs: number;
    /**
     * @generated from field: double spend_usd = 3;
     */
    spendUsd: number;
};
/**
 * Describes the message tank.agent.v1.SpendByDay.
 * Use `create(SpendByDaySchema)` to create a new message.
 */
export declare const SpendByDaySchema: GenMessage<SpendByDay>;
/**
 * Who ran it: the Tread's own agents, Crew members, or an Ops team.
 *
 * @generated from message tank.agent.v1.SpendByKind
 */
export type SpendByKind = Message<"tank.agent.v1.SpendByKind"> & {
    /**
     * tread | crew | ops
     *
     * @generated from field: string kind = 1;
     */
    kind: string;
    /**
     * @generated from field: int32 runs_month = 2;
     */
    runsMonth: number;
    /**
     * @generated from field: double spend_month_usd = 3;
     */
    spendMonthUsd: number;
    /**
     * @generated from field: int32 runs_today = 4;
     */
    runsToday: number;
    /**
     * @generated from field: double spend_today_usd = 5;
     */
    spendTodayUsd: number;
};
/**
 * Describes the message tank.agent.v1.SpendByKind.
 * Use `create(SpendByKindSchema)` to create a new message.
 */
export declare const SpendByKindSchema: GenMessage<SpendByKind>;
/**
 * Spend: the whole picture of the workspace's agent money. Dollars are at the Tread rate,
 * the number Books books. A member sees the Treads they belong to and the public ones; a
 * workspace admin sees them all. The totals count every Tread either way.
 *
 * @generated from message tank.agent.v1.WorkspaceSpend
 */
export type WorkspaceSpend = Message<"tank.agent.v1.WorkspaceSpend"> & {
    /**
     * @generated from field: double spend_today_usd = 1;
     */
    spendTodayUsd: number;
    /**
     * @generated from field: double spend_month_usd = 2;
     */
    spendMonthUsd: number;
    /**
     * @generated from field: int32 runs_today = 3;
     */
    runsToday: number;
    /**
     * @generated from field: int32 runs_month = 4;
     */
    runsMonth: number;
    /**
     * @generated from field: int32 running_now = 5;
     */
    runningNow: number;
    /**
     * the workspace's monthly cap; 0 = none
     *
     * @generated from field: double cap_month_usd = 6;
     */
    capMonthUsd: number;
    /**
     * what Books holds for this month so far
     *
     * @generated from field: double booked_month_usd = 7;
     */
    bookedMonthUsd: number;
    /**
     * @generated from field: repeated tank.agent.v1.SpendByPerson people = 8;
     */
    people: SpendByPerson[];
    /**
     * @generated from field: repeated tank.agent.v1.SpendByTread treads = 9;
     */
    treads: SpendByTread[];
    /**
     * @generated from field: repeated tank.agent.v1.SpendByTeam teams = 10;
     */
    teams: SpendByTeam[];
    /**
     * @generated from field: repeated tank.agent.v1.SpendByKind kinds = 11;
     */
    kinds: SpendByKind[];
    /**
     * the last thirty-one days, oldest first
     *
     * @generated from field: repeated tank.agent.v1.SpendByDay days = 12;
     */
    days: SpendByDay[];
    /**
     * Whether Books is turned on in this workspace. Off, Books books nothing, so the page says
     * so rather than promising the roll-up (2026-11-10: edero had $0 booked for that reason).
     *
     * @generated from field: bool books_on = 13;
     */
    booksOn: boolean;
    /**
     * Cost per run over the last ninety days, oldest first, at the Tread rate: whether the work
     * is getting cheaper as Neural Knowledge learns the workspace's repositories.
     *
     * @generated from field: repeated tank.agent.v1.CostPerRunDay cost_per_run = 14;
     */
    costPerRun: CostPerRunDay[];
    /**
     * What Neural Knowledge saved this workspace this month, at what it pays: its share of the
     * saving (Robby, 2026-11-10: TANK keeps half). The rate behind it is never shown.
     *
     * @generated from field: double neural_saved_month_usd = 15;
     */
    neuralSavedMonthUsd: number;
    /**
     * The workspace's Claude 5 spend this month against its Claude 5 cap, when one is set
     * (2026-11-12), at the Tread rate like every dollar here. Past the cap its agents carry on
     * on Claude Sonnet 4.6. claude5_capped false = no cap, and the page shows neither.
     *
     * @generated from field: bool claude5_capped = 16;
     */
    claude5Capped: boolean;
    /**
     * @generated from field: double claude5_month_usd = 17;
     */
    claude5MonthUsd: number;
    /**
     * @generated from field: double claude5_cap_month_usd = 18;
     */
    claude5CapMonthUsd: number;
};
/**
 * Describes the message tank.agent.v1.WorkspaceSpend.
 * Use `create(WorkspaceSpendSchema)` to create a new message.
 */
export declare const WorkspaceSpendSchema: GenMessage<WorkspaceSpend>;
/**
 * One UTC day of agent runs (Neural chats excluded: a reply is not a run). Dollars at the
 * Tread rate. cost_per_run_usd is the day's spend over its runs, 0 on a day with none;
 * trailing_7d_usd is the seven days ending here, summed spend over summed runs, the line to read.
 *
 * @generated from message tank.agent.v1.CostPerRunDay
 */
export type CostPerRunDay = Message<"tank.agent.v1.CostPerRunDay"> & {
    /**
     * YYYY-MM-DD, UTC
     *
     * @generated from field: string day = 1;
     */
    day: string;
    /**
     * @generated from field: int32 runs = 2;
     */
    runs: number;
    /**
     * @generated from field: double spend_usd = 3;
     */
    spendUsd: number;
    /**
     * @generated from field: double cost_per_run_usd = 4;
     */
    costPerRunUsd: number;
    /**
     * @generated from field: double trailing_7d_usd = 5;
     */
    trailing7dUsd: number;
};
/**
 * Describes the message tank.agent.v1.CostPerRunDay.
 * Use `create(CostPerRunDaySchema)` to create a new message.
 */
export declare const CostPerRunDaySchema: GenMessage<CostPerRunDay>;
/**
 * @generated from message tank.agent.v1.GetWorkspaceSpendRequest
 */
export type GetWorkspaceSpendRequest = Message<"tank.agent.v1.GetWorkspaceSpendRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.agent.v1.GetWorkspaceSpendRequest.
 * Use `create(GetWorkspaceSpendRequestSchema)` to create a new message.
 */
export declare const GetWorkspaceSpendRequestSchema: GenMessage<GetWorkspaceSpendRequest>;
/**
 * @generated from message tank.agent.v1.GetWorkspaceSpendResponse
 */
export type GetWorkspaceSpendResponse = Message<"tank.agent.v1.GetWorkspaceSpendResponse"> & {
    /**
     * @generated from field: tank.agent.v1.WorkspaceSpend spend = 1;
     */
    spend?: WorkspaceSpend;
    /**
     * @generated from field: bool can_manage = 2;
     */
    canManage: boolean;
};
/**
 * Describes the message tank.agent.v1.GetWorkspaceSpendResponse.
 * Use `create(GetWorkspaceSpendResponseSchema)` to create a new message.
 */
export declare const GetWorkspaceSpendResponseSchema: GenMessage<GetWorkspaceSpendResponse>;
/**
 * @generated from message tank.agent.v1.GetTreadSwitchboardRequest
 */
export type GetTreadSwitchboardRequest = Message<"tank.agent.v1.GetTreadSwitchboardRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
};
/**
 * Describes the message tank.agent.v1.GetTreadSwitchboardRequest.
 * Use `create(GetTreadSwitchboardRequestSchema)` to create a new message.
 */
export declare const GetTreadSwitchboardRequestSchema: GenMessage<GetTreadSwitchboardRequest>;
/**
 * @generated from message tank.agent.v1.GetTreadSwitchboardResponse
 */
export type GetTreadSwitchboardResponse = Message<"tank.agent.v1.GetTreadSwitchboardResponse"> & {
    /**
     * @generated from field: tank.agent.v1.TreadMetrics metrics = 1;
     */
    metrics?: TreadMetrics;
    /**
     * @generated from field: tank.agent.v1.TreadSettings settings = 2;
     */
    settings?: TreadSettings;
    /**
     * @generated from field: bool can_manage = 3;
     */
    canManage: boolean;
};
/**
 * Describes the message tank.agent.v1.GetTreadSwitchboardResponse.
 * Use `create(GetTreadSwitchboardResponseSchema)` to create a new message.
 */
export declare const GetTreadSwitchboardResponseSchema: GenMessage<GetTreadSwitchboardResponse>;
/**
 * @generated from message tank.agent.v1.SetTreadSettingsRequest
 */
export type SetTreadSettingsRequest = Message<"tank.agent.v1.SetTreadSettingsRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: tank.agent.v1.TreadSettings settings = 2;
     */
    settings?: TreadSettings;
};
/**
 * Describes the message tank.agent.v1.SetTreadSettingsRequest.
 * Use `create(SetTreadSettingsRequestSchema)` to create a new message.
 */
export declare const SetTreadSettingsRequestSchema: GenMessage<SetTreadSettingsRequest>;
/**
 * @generated from message tank.agent.v1.SetTreadSettingsResponse
 */
export type SetTreadSettingsResponse = Message<"tank.agent.v1.SetTreadSettingsResponse"> & {
    /**
     * @generated from field: tank.agent.v1.TreadSettings settings = 1;
     */
    settings?: TreadSettings;
};
/**
 * Describes the message tank.agent.v1.SetTreadSettingsResponse.
 * Use `create(SetTreadSettingsResponseSchema)` to create a new message.
 */
export declare const SetTreadSettingsResponseSchema: GenMessage<SetTreadSettingsResponse>;
/**
 * @generated from message tank.agent.v1.GetRepoConnectionRequest
 */
export type GetRepoConnectionRequest = Message<"tank.agent.v1.GetRepoConnectionRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
};
/**
 * Describes the message tank.agent.v1.GetRepoConnectionRequest.
 * Use `create(GetRepoConnectionRequestSchema)` to create a new message.
 */
export declare const GetRepoConnectionRequestSchema: GenMessage<GetRepoConnectionRequest>;
/**
 * @generated from message tank.agent.v1.GetRepoConnectionResponse
 */
export type GetRepoConnectionResponse = Message<"tank.agent.v1.GetRepoConnectionResponse"> & {
    /**
     * @generated from field: tank.agent.v1.RepoConnection connection = 1;
     */
    connection?: RepoConnection;
};
/**
 * Describes the message tank.agent.v1.GetRepoConnectionResponse.
 * Use `create(GetRepoConnectionResponseSchema)` to create a new message.
 */
export declare const GetRepoConnectionResponseSchema: GenMessage<GetRepoConnectionResponse>;
/**
 * StartGitHubConnect mints the one-time state GitHub carries through an install and
 * returns where to send somebody. Admins only.
 *
 * @generated from message tank.agent.v1.StartGitHubConnectRequest
 */
export type StartGitHubConnectRequest = Message<"tank.agent.v1.StartGitHubConnectRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.agent.v1.StartGitHubConnectRequest.
 * Use `create(StartGitHubConnectRequestSchema)` to create a new message.
 */
export declare const StartGitHubConnectRequestSchema: GenMessage<StartGitHubConnectRequest>;
/**
 * @generated from message tank.agent.v1.StartGitHubConnectResponse
 */
export type StartGitHubConnectResponse = Message<"tank.agent.v1.StartGitHubConnectResponse"> & {
    /**
     * @generated from field: string install_url = 1;
     */
    installUrl: string;
};
/**
 * Describes the message tank.agent.v1.StartGitHubConnectResponse.
 * Use `create(StartGitHubConnectResponseSchema)` to create a new message.
 */
export declare const StartGitHubConnectResponseSchema: GenMessage<StartGitHubConnectResponse>;
/**
 * @generated from message tank.agent.v1.BindRepoRequest
 */
export type BindRepoRequest = Message<"tank.agent.v1.BindRepoRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: string repo = 2;
     */
    repo: string;
    /**
     * empty means "main"
     *
     * @generated from field: string base_branch = 3;
     */
    baseBranch: string;
    /**
     * empty means "node"
     *
     * @generated from field: string toolchain = 4;
     */
    toolchain: string;
};
/**
 * Describes the message tank.agent.v1.BindRepoRequest.
 * Use `create(BindRepoRequestSchema)` to create a new message.
 */
export declare const BindRepoRequestSchema: GenMessage<BindRepoRequest>;
/**
 * @generated from message tank.agent.v1.BindRepoResponse
 */
export type BindRepoResponse = Message<"tank.agent.v1.BindRepoResponse"> & {
    /**
     * @generated from field: tank.agent.v1.RepoBinding binding = 1;
     */
    binding?: RepoBinding;
};
/**
 * Describes the message tank.agent.v1.BindRepoResponse.
 * Use `create(BindRepoResponseSchema)` to create a new message.
 */
export declare const BindRepoResponseSchema: GenMessage<BindRepoResponse>;
/**
 * @generated from message tank.agent.v1.UnbindRepoRequest
 */
export type UnbindRepoRequest = Message<"tank.agent.v1.UnbindRepoRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
};
/**
 * Describes the message tank.agent.v1.UnbindRepoRequest.
 * Use `create(UnbindRepoRequestSchema)` to create a new message.
 */
export declare const UnbindRepoRequestSchema: GenMessage<UnbindRepoRequest>;
/**
 * @generated from message tank.agent.v1.UnbindRepoResponse
 */
export type UnbindRepoResponse = Message<"tank.agent.v1.UnbindRepoResponse"> & {};
/**
 * Describes the message tank.agent.v1.UnbindRepoResponse.
 * Use `create(UnbindRepoResponseSchema)` to create a new message.
 */
export declare const UnbindRepoResponseSchema: GenMessage<UnbindRepoResponse>;
/**
 * What neuralsecurity last found on the code a Tread is connected to: the newest finished
 * scan of a push to the repository, as the Home screen shows it beside the Tread. One row
 * per Tread that has a repository bound; a Tread with none is not listed.
 *
 * @generated from message tank.agent.v1.TreadSecurity
 */
export type TreadSecurity = Message<"tank.agent.v1.TreadSecurity"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * owner/name
     *
     * @generated from field: string repo = 2;
     */
    repo: string;
    /**
     * clean      the last scan finished with no secret and no fixable critical or high advisory
     * findings   it finished and found some (the counts below say what)
     * scanning   a scan is queued or running and none has finished yet
     * failed     the last scan could not run (the Tread has the card saying why)
     * unscanned  nothing has been pushed since the Tread was bound
     *
     * @generated from field: string state = 3;
     */
    state: string;
    /**
     * @generated from field: int32 secrets = 4;
     */
    secrets: number;
    /**
     * @generated from field: int32 vulns_critical = 5;
     */
    vulnsCritical: number;
    /**
     * @generated from field: int32 vulns_high = 6;
     */
    vulnsHigh: number;
    /**
     * the commit the counts are about
     *
     * @generated from field: string sha = 7;
     */
    sha: string;
    /**
     * when that scan finished
     *
     * @generated from field: google.protobuf.Timestamp scanned_at = 8;
     */
    scannedAt?: Timestamp;
};
/**
 * Describes the message tank.agent.v1.TreadSecurity.
 * Use `create(TreadSecuritySchema)` to create a new message.
 */
export declare const TreadSecuritySchema: GenMessage<TreadSecurity>;
/**
 * Every app the workspace hosts on TANK, with the Tread it belongs to: the list the
 * workspace settings show, so an address is found without opening each Tread.
 *
 * @generated from message tank.agent.v1.WorkspaceDeployment
 */
export type WorkspaceDeployment = Message<"tank.agent.v1.WorkspaceDeployment"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: string channel_name = 2;
     */
    channelName: string;
    /**
     * @generated from field: tank.agent.v1.TreadDeployment deployment = 3;
     */
    deployment?: TreadDeployment;
};
/**
 * Describes the message tank.agent.v1.WorkspaceDeployment.
 * Use `create(WorkspaceDeploymentSchema)` to create a new message.
 */
export declare const WorkspaceDeploymentSchema: GenMessage<WorkspaceDeployment>;
/**
 * @generated from message tank.agent.v1.ListWorkspaceDeploymentsRequest
 */
export type ListWorkspaceDeploymentsRequest = Message<"tank.agent.v1.ListWorkspaceDeploymentsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.agent.v1.ListWorkspaceDeploymentsRequest.
 * Use `create(ListWorkspaceDeploymentsRequestSchema)` to create a new message.
 */
export declare const ListWorkspaceDeploymentsRequestSchema: GenMessage<ListWorkspaceDeploymentsRequest>;
/**
 * @generated from message tank.agent.v1.ListWorkspaceDeploymentsResponse
 */
export type ListWorkspaceDeploymentsResponse = Message<"tank.agent.v1.ListWorkspaceDeploymentsResponse"> & {
    /**
     * @generated from field: repeated tank.agent.v1.WorkspaceDeployment deployments = 1;
     */
    deployments: WorkspaceDeployment[];
};
/**
 * Describes the message tank.agent.v1.ListWorkspaceDeploymentsResponse.
 * Use `create(ListWorkspaceDeploymentsResponseSchema)` to create a new message.
 */
export declare const ListWorkspaceDeploymentsResponseSchema: GenMessage<ListWorkspaceDeploymentsResponse>;
/**
 * @generated from message tank.agent.v1.ListTreadSecurityRequest
 */
export type ListTreadSecurityRequest = Message<"tank.agent.v1.ListTreadSecurityRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.agent.v1.ListTreadSecurityRequest.
 * Use `create(ListTreadSecurityRequestSchema)` to create a new message.
 */
export declare const ListTreadSecurityRequestSchema: GenMessage<ListTreadSecurityRequest>;
/**
 * @generated from message tank.agent.v1.ListTreadSecurityResponse
 */
export type ListTreadSecurityResponse = Message<"tank.agent.v1.ListTreadSecurityResponse"> & {
    /**
     * @generated from field: repeated tank.agent.v1.TreadSecurity treads = 1;
     */
    treads: TreadSecurity[];
};
/**
 * Describes the message tank.agent.v1.ListTreadSecurityResponse.
 * Use `create(ListTreadSecurityResponseSchema)` to create a new message.
 */
export declare const ListTreadSecurityResponseSchema: GenMessage<ListTreadSecurityResponse>;
/**
 * A Tread's hosting on TANK's own cluster: the repository TANK generated for it and
 * whether the app built from it is awake at its URL.
 *
 * @generated from message tank.agent.v1.TreadDeployment
 */
export type TreadDeployment = Message<"tank.agent.v1.TreadDeployment"> & {
    /**
     * <slug>.tank.chat and the repository agenture-<slug>
     *
     * @generated from field: string slug = 1;
     */
    slug: string;
    /**
     * owner/name
     *
     * @generated from field: string repo = 2;
     */
    repo: string;
    /**
     * https://<slug>.tank.chat
     *
     * @generated from field: string url = 3;
     */
    url: string;
    /**
     * running (1 replica) or asleep (0); builds never wake it
     *
     * @generated from field: bool awake = 4;
     */
    awake: boolean;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 5;
     */
    updatedAt?: Timestamp;
    /**
     * TANK generated the repository; otherwise it is the workspace's own
     *
     * @generated from field: bool managed = 6;
     */
    managed: boolean;
    /**
     * the repository carries .github/workflows/tank.yml on its default branch
     *
     * @generated from field: bool workflow_present = 7;
     */
    workflowPresent: boolean;
    /**
     * empty until the first build on main has landed
     *
     * @generated from field: string image_tag = 8;
     */
    imageTag: string;
    /**
     * the workflow file to add, for a repository the workspace brought
     *
     * @generated from field: string workflow_snippet = 9;
     */
    workflowSnippet: string;
};
/**
 * Describes the message tank.agent.v1.TreadDeployment.
 * Use `create(TreadDeploymentSchema)` to create a new message.
 */
export declare const TreadDeploymentSchema: GenMessage<TreadDeployment>;
/**
 * CreateTreadRepo asks TANK to generate a repository for this Tread from its template, in
 * TANK's organization, and bind it. Premium workspaces, admins only, one per Tread.
 *
 * @generated from message tank.agent.v1.CreateTreadRepoRequest
 */
export type CreateTreadRepoRequest = Message<"tank.agent.v1.CreateTreadRepoRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
};
/**
 * Describes the message tank.agent.v1.CreateTreadRepoRequest.
 * Use `create(CreateTreadRepoRequestSchema)` to create a new message.
 */
export declare const CreateTreadRepoRequestSchema: GenMessage<CreateTreadRepoRequest>;
/**
 * @generated from message tank.agent.v1.CreateTreadRepoResponse
 */
export type CreateTreadRepoResponse = Message<"tank.agent.v1.CreateTreadRepoResponse"> & {
    /**
     * @generated from field: tank.agent.v1.RepoBinding binding = 1;
     */
    binding?: RepoBinding;
    /**
     * @generated from field: tank.agent.v1.TreadDeployment deployment = 2;
     */
    deployment?: TreadDeployment;
};
/**
 * Describes the message tank.agent.v1.CreateTreadRepoResponse.
 * Use `create(CreateTreadRepoResponseSchema)` to create a new message.
 */
export declare const CreateTreadRepoResponseSchema: GenMessage<CreateTreadRepoResponse>;
/**
 * SetTreadDeployment wakes the Tread's app on TANK's cluster or puts it to sleep.
 *
 * @generated from message tank.agent.v1.SetTreadDeploymentRequest
 */
export type SetTreadDeploymentRequest = Message<"tank.agent.v1.SetTreadDeploymentRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: bool awake = 2;
     */
    awake: boolean;
};
/**
 * Describes the message tank.agent.v1.SetTreadDeploymentRequest.
 * Use `create(SetTreadDeploymentRequestSchema)` to create a new message.
 */
export declare const SetTreadDeploymentRequestSchema: GenMessage<SetTreadDeploymentRequest>;
/**
 * @generated from message tank.agent.v1.SetTreadDeploymentResponse
 */
export type SetTreadDeploymentResponse = Message<"tank.agent.v1.SetTreadDeploymentResponse"> & {
    /**
     * @generated from field: tank.agent.v1.TreadDeployment deployment = 1;
     */
    deployment?: TreadDeployment;
};
/**
 * Describes the message tank.agent.v1.SetTreadDeploymentResponse.
 * Use `create(SetTreadDeploymentResponseSchema)` to create a new message.
 */
export declare const SetTreadDeploymentResponseSchema: GenMessage<SetTreadDeploymentResponse>;
/**
 * @generated from message tank.agent.v1.TreadPlanItem
 */
export type TreadPlanItem = Message<"tank.agent.v1.TreadPlanItem"> & {
    /**
     * stable across versions, e.g. "data.osm-places"
     *
     * @generated from field: string key = 1;
     */
    key: string;
    /**
     * @generated from field: string title = 2;
     */
    title: string;
    /**
     * @generated from field: tank.agent.v1.PlanItemStatus status = 3;
     */
    status: PlanItemStatus;
    /**
     * the section or phase of the plan it belongs to
     *
     * @generated from field: string phase = 4;
     */
    phase: string;
    /**
     * one line: what is left, or why it waits
     *
     * @generated from field: string note = 5;
     */
    note: string;
};
/**
 * Describes the message tank.agent.v1.TreadPlanItem.
 * Use `create(TreadPlanItemSchema)` to create a new message.
 */
export declare const TreadPlanItemSchema: GenMessage<TreadPlanItem>;
/**
 * @generated from message tank.agent.v1.TreadPlan
 */
export type TreadPlan = Message<"tank.agent.v1.TreadPlan"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * what the plan is, e.g. "Datum Master Build Plan"
     *
     * @generated from field: string title = 2;
     */
    title: string;
    /**
     * the document it was drawn from, when there is one
     *
     * @generated from field: string source = 3;
     */
    source: string;
    /**
     * @generated from field: repeated tank.agent.v1.TreadPlanItem items = 4;
     */
    items: TreadPlanItem[];
    /**
     * grows when items are added or dropped
     *
     * @generated from field: int32 version = 5;
     */
    version: number;
    /**
     * how many items the first version had
     *
     * @generated from field: int32 first_total = 6;
     */
    firstTotal: number;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 7;
     */
    updatedAt?: Timestamp;
};
/**
 * Describes the message tank.agent.v1.TreadPlan.
 * Use `create(TreadPlanSchema)` to create a new message.
 */
export declare const TreadPlanSchema: GenMessage<TreadPlan>;
/**
 * @generated from message tank.agent.v1.GetTreadPlanRequest
 */
export type GetTreadPlanRequest = Message<"tank.agent.v1.GetTreadPlanRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
};
/**
 * Describes the message tank.agent.v1.GetTreadPlanRequest.
 * Use `create(GetTreadPlanRequestSchema)` to create a new message.
 */
export declare const GetTreadPlanRequestSchema: GenMessage<GetTreadPlanRequest>;
/**
 * @generated from message tank.agent.v1.GetTreadPlanResponse
 */
export type GetTreadPlanResponse = Message<"tank.agent.v1.GetTreadPlanResponse"> & {
    /**
     * unset when the Tread has none
     *
     * @generated from field: tank.agent.v1.TreadPlan plan = 1;
     */
    plan?: TreadPlan;
};
/**
 * Describes the message tank.agent.v1.GetTreadPlanResponse.
 * Use `create(GetTreadPlanResponseSchema)` to create a new message.
 */
export declare const GetTreadPlanResponseSchema: GenMessage<GetTreadPlanResponse>;
/**
 * @generated from message tank.agent.v1.EnsureAgentTreadRequest
 */
export type EnsureAgentTreadRequest = Message<"tank.agent.v1.EnsureAgentTreadRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * The Tread's name, without '#': 1-80 of a-z 0-9 . _ -
     *
     * @generated from field: string name = 2;
     */
    name: string;
};
/**
 * Describes the message tank.agent.v1.EnsureAgentTreadRequest.
 * Use `create(EnsureAgentTreadRequestSchema)` to create a new message.
 */
export declare const EnsureAgentTreadRequestSchema: GenMessage<EnsureAgentTreadRequest>;
/**
 * @generated from message tank.agent.v1.EnsureAgentTreadResponse
 */
export type EnsureAgentTreadResponse = Message<"tank.agent.v1.EnsureAgentTreadResponse"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: bool created = 2;
     */
    created: boolean;
};
/**
 * Describes the message tank.agent.v1.EnsureAgentTreadResponse.
 * Use `create(EnsureAgentTreadResponseSchema)` to create a new message.
 */
export declare const EnsureAgentTreadResponseSchema: GenMessage<EnsureAgentTreadResponse>;
/**
 * RepoDelivery is one repository's setting. A repository with no setting behaves as
 * DELIVERY_MODE_OWN_CI, which is how every repository worked before the setting existed.
 *
 * @generated from message tank.agent.v1.RepoDelivery
 */
export type RepoDelivery = Message<"tank.agent.v1.RepoDelivery"> & {
    /**
     * owner/name
     *
     * @generated from field: string repo = 1;
     */
    repo: string;
    /**
     * @generated from field: tank.agent.v1.DeliveryMode mode = 2;
     */
    mode: DeliveryMode;
    /**
     * TANK_RUNNERS: the pull request that switches the jobs, and where it stands:
     * none | opened | merged | refused.
     *
     * @generated from field: string switch_pull_request_url = 3;
     */
    switchPullRequestUrl: string;
    /**
     * @generated from field: string switch_status = 4;
     */
    switchStatus: string;
    /**
     * why a switch was refused, in a sentence; empty otherwise
     *
     * @generated from field: string reason = 5;
     */
    reason: string;
    /**
     * OTHER_CI: whether a report token exists, and where reports are sent. The token
     * itself is only ever in the response to the SetRepoDelivery that issued it.
     *
     * @generated from field: bool has_report_token = 6;
     */
    hasReportToken: boolean;
    /**
     * @generated from field: string report_url = 7;
     */
    reportUrl: string;
    /**
     * The address TANK checks after a deploy to say whether the change is live; empty
     * when the repository has no environment to check.
     *
     * @generated from field: string live_check_url = 8;
     */
    liveCheckUrl: string;
    /**
     * False until the workspace's runners are approved for it: TANK_RUNNERS cannot be
     * chosen while this is false, and the reason says why.
     *
     * @generated from field: bool tank_runners_available = 9;
     */
    tankRunnersAvailable: boolean;
    /**
     * @generated from field: string tank_runners_reason = 10;
     */
    tankRunnersReason: string;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 11;
     */
    updatedAt?: Timestamp;
    /**
     * @generated from field: string updated_by = 12;
     */
    updatedBy: string;
    /**
     * True when the repository has no choice of its own and follows the workspace's; mode is
     * then the workspace default it follows.
     *
     * @generated from field: bool follows_default = 13;
     */
    followsDefault: boolean;
};
/**
 * Describes the message tank.agent.v1.RepoDelivery.
 * Use `create(RepoDeliverySchema)` to create a new message.
 */
export declare const RepoDeliverySchema: GenMessage<RepoDelivery>;
/**
 * @generated from message tank.agent.v1.ListRepoDeliveryRequest
 */
export type ListRepoDeliveryRequest = Message<"tank.agent.v1.ListRepoDeliveryRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.agent.v1.ListRepoDeliveryRequest.
 * Use `create(ListRepoDeliveryRequestSchema)` to create a new message.
 */
export declare const ListRepoDeliveryRequestSchema: GenMessage<ListRepoDeliveryRequest>;
/**
 * @generated from message tank.agent.v1.ListRepoDeliveryResponse
 */
export type ListRepoDeliveryResponse = Message<"tank.agent.v1.ListRepoDeliveryResponse"> & {
    /**
     * @generated from field: repeated tank.agent.v1.RepoDelivery repos = 1;
     */
    repos: RepoDelivery[];
    /**
     * The workspace's own choice; UNSPECIFIED is the same as OWN_CI (nothing moves).
     *
     * @generated from field: tank.agent.v1.DeliveryMode workspace_default = 2;
     */
    workspaceDefault: DeliveryMode;
    /**
     * Why the workspace default could not be applied, in one sentence; empty when it was.
     *
     * @generated from field: string workspace_reason = 3;
     */
    workspaceReason: string;
    /**
     * Whether TANK's runners can be chosen in this workspace now, and why not.
     *
     * @generated from field: bool tank_runners_available = 4;
     */
    tankRunnersAvailable: boolean;
    /**
     * @generated from field: string tank_runners_reason = 5;
     */
    tankRunnersReason: string;
};
/**
 * Describes the message tank.agent.v1.ListRepoDeliveryResponse.
 * Use `create(ListRepoDeliveryResponseSchema)` to create a new message.
 */
export declare const ListRepoDeliveryResponseSchema: GenMessage<ListRepoDeliveryResponse>;
/**
 * @generated from message tank.agent.v1.SetRepoDeliveryRequest
 */
export type SetRepoDeliveryRequest = Message<"tank.agent.v1.SetRepoDeliveryRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string repo = 2;
     */
    repo: string;
    /**
     * @generated from field: tank.agent.v1.DeliveryMode mode = 3;
     */
    mode: DeliveryMode;
    /**
     * OTHER_CI: issue a new report token and revoke the one before it.
     *
     * @generated from field: bool rotate_report_token = 4;
     */
    rotateReportToken: boolean;
    /**
     * Drop the repository's own choice: it follows the workspace default again (mode is
     * then ignored).
     *
     * @generated from field: bool use_default = 5;
     */
    useDefault: boolean;
};
/**
 * Describes the message tank.agent.v1.SetRepoDeliveryRequest.
 * Use `create(SetRepoDeliveryRequestSchema)` to create a new message.
 */
export declare const SetRepoDeliveryRequestSchema: GenMessage<SetRepoDeliveryRequest>;
/**
 * @generated from message tank.agent.v1.SetRepoDeliveryResponse
 */
export type SetRepoDeliveryResponse = Message<"tank.agent.v1.SetRepoDeliveryResponse"> & {
    /**
     * @generated from field: tank.agent.v1.RepoDelivery repo = 1;
     */
    repo?: RepoDelivery;
    /**
     * Shown once, when a token was issued by this call.
     *
     * @generated from field: string report_token = 2;
     */
    reportToken: string;
};
/**
 * Describes the message tank.agent.v1.SetRepoDeliveryResponse.
 * Use `create(SetRepoDeliveryResponseSchema)` to create a new message.
 */
export declare const SetRepoDeliveryResponseSchema: GenMessage<SetRepoDeliveryResponse>;
/**
 * @generated from message tank.agent.v1.SetWorkspaceDeliveryRequest
 */
export type SetWorkspaceDeliveryRequest = Message<"tank.agent.v1.SetWorkspaceDeliveryRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: tank.agent.v1.DeliveryMode mode = 2;
     */
    mode: DeliveryMode;
};
/**
 * Describes the message tank.agent.v1.SetWorkspaceDeliveryRequest.
 * Use `create(SetWorkspaceDeliveryRequestSchema)` to create a new message.
 */
export declare const SetWorkspaceDeliveryRequestSchema: GenMessage<SetWorkspaceDeliveryRequest>;
/**
 * The whole list again, every repository with what it now follows.
 *
 * @generated from message tank.agent.v1.SetWorkspaceDeliveryResponse
 */
export type SetWorkspaceDeliveryResponse = Message<"tank.agent.v1.SetWorkspaceDeliveryResponse"> & {
    /**
     * @generated from field: tank.agent.v1.ListRepoDeliveryResponse delivery = 1;
     */
    delivery?: ListRepoDeliveryResponse;
};
/**
 * Describes the message tank.agent.v1.SetWorkspaceDeliveryResponse.
 * Use `create(SetWorkspaceDeliveryResponseSchema)` to create a new message.
 */
export declare const SetWorkspaceDeliveryResponseSchema: GenMessage<SetWorkspaceDeliveryResponse>;
/**
 * PredictedWork is something TANK built, or proposes to build, before it was asked for.
 * It lives on a branch that is never merged until a person takes it.
 *
 * @generated from message tank.agent.v1.PredictedWork
 */
export type PredictedWork = Message<"tank.agent.v1.PredictedWork"> & {
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
     * @generated from field: string thread_root_id = 4;
     */
    threadRootId: string;
    /**
     * the finished task it is offered on as a next step, if any
     *
     * @generated from field: string task_id = 5;
     */
    taskId: string;
    /**
     * @generated from field: string title = 6;
     */
    title: string;
    /**
     * @generated from field: string summary = 7;
     */
    summary: string;
    /**
     * Where the prediction came from, most certain first:
     * queued_task | plan_step | conversation | guess.
     *
     * @generated from field: string source = 8;
     */
    source: string;
    /**
     * idea: a suggestion only (the workspace does not have the add-on).
     * building | ready: on a branch, checks green and a preview ready when ready.
     * stale: main moved and it has not been brought up to date yet.
     * taken | dismissed | expired.
     *
     * @generated from field: string state = 9;
     */
    state: string;
    /**
     * @generated from field: string repo = 10;
     */
    repo: string;
    /**
     * @generated from field: string branch = 11;
     */
    branch: string;
    /**
     * @generated from field: string preview_url = 12;
     */
    previewUrl: string;
    /**
     * A database change proven ahead: none | structure | questions | clone, the furthest
     * tier it was proven at, and how long it took to apply there.
     *
     * @generated from field: string migration_proof = 13;
     */
    migrationProof: string;
    /**
     * @generated from field: int32 migration_ms = 14;
     */
    migrationMs: number;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 15;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp ready_at = 16;
     */
    readyAt?: Timestamp;
    /**
     * the run that built it, when one did
     *
     * @generated from field: string run_id = 17;
     */
    runId: string;
    /**
     * source = queued_task: the task waiting in Queued that this was predicted from.
     * Starting that task is how an idea is taken.
     *
     * @generated from field: string source_task_id = 18;
     */
    sourceTaskId: string;
    /**
     * The draft pull request it was built on, when it was built.
     *
     * @generated from field: string pr_url = 19;
     */
    prUrl: string;
};
/**
 * Describes the message tank.agent.v1.PredictedWork.
 * Use `create(PredictedWorkSchema)` to create a new message.
 */
export declare const PredictedWorkSchema: GenMessage<PredictedWork>;
/**
 * @generated from message tank.agent.v1.ListPredictedWorkRequest
 */
export type ListPredictedWorkRequest = Message<"tank.agent.v1.ListPredictedWorkRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * only the next suggestions for this task (at most three)
     *
     * @generated from field: string task_id = 2;
     */
    taskId: string;
    /**
     * only this thread's
     *
     * @generated from field: string thread_root_id = 3;
     */
    threadRootId: string;
    /**
     * taken, dismissed and expired too
     *
     * @generated from field: bool include_closed = 4;
     */
    includeClosed: boolean;
};
/**
 * Describes the message tank.agent.v1.ListPredictedWorkRequest.
 * Use `create(ListPredictedWorkRequestSchema)` to create a new message.
 */
export declare const ListPredictedWorkRequestSchema: GenMessage<ListPredictedWorkRequest>;
/**
 * @generated from message tank.agent.v1.ListPredictedWorkResponse
 */
export type ListPredictedWorkResponse = Message<"tank.agent.v1.ListPredictedWorkResponse"> & {
    /**
     * @generated from field: repeated tank.agent.v1.PredictedWork work = 1;
     */
    work: PredictedWork[];
    /**
     * Whether the workspace has the add-on: without it every item is an idea.
     *
     * @generated from field: bool addon = 2;
     */
    addon: boolean;
    /**
     * Of the items offered in the last 30 days, how many were taken.
     *
     * @generated from field: int32 offered_30d = 3;
     */
    offered30d: number;
    /**
     * @generated from field: int32 taken_30d = 4;
     */
    taken30d: number;
};
/**
 * Describes the message tank.agent.v1.ListPredictedWorkResponse.
 * Use `create(ListPredictedWorkResponseSchema)` to create a new message.
 */
export declare const ListPredictedWorkResponseSchema: GenMessage<ListPredictedWorkResponse>;
/**
 * @generated from message tank.agent.v1.DismissPredictedWorkRequest
 */
export type DismissPredictedWorkRequest = Message<"tank.agent.v1.DismissPredictedWorkRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
};
/**
 * Describes the message tank.agent.v1.DismissPredictedWorkRequest.
 * Use `create(DismissPredictedWorkRequestSchema)` to create a new message.
 */
export declare const DismissPredictedWorkRequestSchema: GenMessage<DismissPredictedWorkRequest>;
/**
 * @generated from message tank.agent.v1.DismissPredictedWorkResponse
 */
export type DismissPredictedWorkResponse = Message<"tank.agent.v1.DismissPredictedWorkResponse"> & {};
/**
 * Describes the message tank.agent.v1.DismissPredictedWorkResponse.
 * Use `create(DismissPredictedWorkResponseSchema)` to create a new message.
 */
export declare const DismissPredictedWorkResponseSchema: GenMessage<DismissPredictedWorkResponse>;
/**
 * @generated from message tank.agent.v1.TakePredictedWorkRequest
 */
export type TakePredictedWorkRequest = Message<"tank.agent.v1.TakePredictedWorkRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
};
/**
 * Describes the message tank.agent.v1.TakePredictedWorkRequest.
 * Use `create(TakePredictedWorkRequestSchema)` to create a new message.
 */
export declare const TakePredictedWorkRequestSchema: GenMessage<TakePredictedWorkRequest>;
/**
 * @generated from message tank.agent.v1.TakePredictedWorkResponse
 */
export type TakePredictedWorkResponse = Message<"tank.agent.v1.TakePredictedWorkResponse"> & {
    /**
     * Where the run that carries it on is working.
     *
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: string thread_root_id = 2;
     */
    threadRootId: string;
};
/**
 * Describes the message tank.agent.v1.TakePredictedWorkResponse.
 * Use `create(TakePredictedWorkResponseSchema)` to create a new message.
 */
export declare const TakePredictedWorkResponseSchema: GenMessage<TakePredictedWorkResponse>;
/**
 * @generated from enum tank.agent.v1.RunState
 */
export declare enum RunState {
    /**
     * @generated from enum value: RUN_STATE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: RUN_STATE_REQUESTED = 1;
     */
    REQUESTED = 1,
    /**
     * @generated from enum value: RUN_STATE_ADMITTED = 2;
     */
    ADMITTED = 2,
    /**
     * @generated from enum value: RUN_STATE_PROVISIONING = 3;
     */
    PROVISIONING = 3,
    /**
     * @generated from enum value: RUN_STATE_PLANNING = 4;
     */
    PLANNING = 4,
    /**
     * @generated from enum value: RUN_STATE_AWAITING_PLAN_APPROVAL = 5;
     */
    AWAITING_PLAN_APPROVAL = 5,
    /**
     * @generated from enum value: RUN_STATE_IMPLEMENTING = 6;
     */
    IMPLEMENTING = 6,
    /**
     * @generated from enum value: RUN_STATE_PUSHED = 7;
     */
    PUSHED = 7,
    /**
     * @generated from enum value: RUN_STATE_CI_WATCHING = 8;
     */
    CI_WATCHING = 8,
    /**
     * @generated from enum value: RUN_STATE_PR_OPEN = 9;
     */
    PR_OPEN = 9,
    /**
     * @generated from enum value: RUN_STATE_AWAITING_MERGE_APPROVAL = 10;
     */
    AWAITING_MERGE_APPROVAL = 10,
    /**
     * @generated from enum value: RUN_STATE_MERGED = 11;
     */
    MERGED = 11,
    /**
     * @generated from enum value: RUN_STATE_VERIFYING_DEPLOY = 12;
     */
    VERIFYING_DEPLOY = 12,
    /**
     * @generated from enum value: RUN_STATE_DONE = 13;
     */
    DONE = 13,
    /**
     * @generated from enum value: RUN_STATE_CANCELLED = 14;
     */
    CANCELLED = 14,
    /**
     * @generated from enum value: RUN_STATE_FAILED = 15;
     */
    FAILED = 15,
    /**
     * @generated from enum value: RUN_STATE_BUDGET_EXHAUSTED = 16;
     */
    BUDGET_EXHAUSTED = 16,
    /**
     * @generated from enum value: RUN_STATE_TIMED_OUT = 17;
     */
    TIMED_OUT = 17,
    /**
     * @generated from enum value: RUN_STATE_APPROVAL_EXPIRED = 18;
     */
    APPROVAL_EXPIRED = 18,
    /**
     * Stopped at a guardrail it cannot meet, waiting for the guardrail to change or the run
     * to be stopped. Not terminal: the run's branch and session are kept.
     *
     * @generated from enum value: RUN_STATE_BLOCKED = 19;
     */
    BLOCKED = 19,
    /**
     * Held for an answer to a question the agent asked in the thread. Not terminal: the
     * answer goes in the thread and the run carries on. Before this value the control plane
     * reported such a run as RUN_STATE_AWAITING_PLAN_APPROVAL, so a client read "waiting for
     * your go on the plan" for a run that had no plan waiting.
     *
     * @generated from enum value: RUN_STATE_AWAITING_ANSWER = 20;
     */
    AWAITING_ANSWER = 20
}
/**
 * Describes the enum tank.agent.v1.RunState.
 */
export declare const RunStateSchema: GenEnum<RunState>;
/**
 * What an agent principal is. @neural is the agent of kind AGENT_KIND_NEURAL: it resolves to
 * that principal in any Tread of a workspace that has it, whatever the workspace's Crew or
 * Ops handles are. It is the same on web, desktop and mobile: it appears in the mention
 * picker when workspace.v1.Entitlements.neural_agent is true, is shown as the Neural agent
 * with its pinned model name, and a refusal renders the same typed message and button on
 * every surface.
 *
 * @generated from enum tank.agent.v1.AgentKind
 */
export declare enum AgentKind {
    /**
     * the workspace agent, or a client that predates this field
     *
     * @generated from enum value: AGENT_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * the workspace's own agent (@tank)
     *
     * @generated from enum value: AGENT_KIND_WORKSPACE = 1;
     */
    WORKSPACE = 1,
    /**
     * a Crew member (tank.crew.v1)
     *
     * @generated from enum value: AGENT_KIND_CREW = 2;
     */
    CREW = 2,
    /**
     * the built-in Neural agent: premium, pinned to the Neural model
     *
     * @generated from enum value: AGENT_KIND_NEURAL = 3;
     */
    NEURAL = 3
}
/**
 * Describes the enum tank.agent.v1.AgentKind.
 */
export declare const AgentKindSchema: GenEnum<AgentKind>;
/**
 * @generated from enum tank.agent.v1.RunRefusalReason
 */
export declare enum RunRefusalReason {
    /**
     * @generated from enum value: RUN_REFUSAL_REASON_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * The workspace is on the free plan; agent time needs premium.
     *
     * @generated from enum value: RUN_REFUSAL_REASON_FREE_PLAN = 1;
     */
    FREE_PLAN = 1,
    /**
     * Prepaid agent time is spent and no auto-refill covered it.
     *
     * @generated from enum value: RUN_REFUSAL_REASON_OUT_OF_FUNDS = 2;
     */
    OUT_OF_FUNDS = 2,
    /**
     * A free workspace mentioned an agent whose min_plan is "premium" (@neural). The action is
     * UPGRADE, the same button as FREE_PLAN, and no free trial run is spent on it. StartRun
     * checks min_plan server-side. Out-of-funds and low-funds behaviour is unchanged: a premium
     * workspace with no agent time left is refused with OUT_OF_FUNDS as for any agent.
     *
     * @generated from enum value: RUN_REFUSAL_REASON_PREMIUM_ONLY_AGENT = 3;
     */
    PREMIUM_ONLY_AGENT = 3,
    /**
     * The agent is pinned to a model that is not being served right now. The run is refused with
     * no action; it never falls back to another model.
     *
     * @generated from enum value: RUN_REFUSAL_REASON_MODEL_UNAVAILABLE = 4;
     */
    MODEL_UNAVAILABLE = 4
}
/**
 * Describes the enum tank.agent.v1.RunRefusalReason.
 */
export declare const RunRefusalReasonSchema: GenEnum<RunRefusalReason>;
/**
 * @generated from enum tank.agent.v1.RunRefusalAction
 */
export declare enum RunRefusalAction {
    /**
     * @generated from enum value: RUN_REFUSAL_ACTION_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * The button opens BillingService.StartUpgradeCheckout.
     *
     * @generated from enum value: RUN_REFUSAL_ACTION_UPGRADE = 1;
     */
    UPGRADE = 1,
    /**
     * The button opens BillingService.StartAgentTimeCheckout.
     *
     * @generated from enum value: RUN_REFUSAL_ACTION_REFILL = 2;
     */
    REFILL = 2
}
/**
 * Describes the enum tank.agent.v1.RunRefusalAction.
 */
export declare const RunRefusalActionSchema: GenEnum<RunRefusalAction>;
/**
 * The live output of a run so far, for a person who opens the thread or turns
 * the live output setting for that thread (ThreadLiveStream) on mid-run, on any device. Same assistant text and
 * status only as AgentStreamDelta, never tool input or output. The control plane keeps a
 * bounded in-memory tail while the run is live; a finished run has an empty tail and
 * the stored message is the record.
 * One piece of a run's live output, handed to the api by the control plane (called with the
 * run's own token) to fan out as AgentStreamDelta, only to users whose setting for the run's
 * thread (channel_id plus thread_root_id) is on, and to fold into GetRunStreamTail. Only
 * assistant text and status lines are ever sent; tool input and output never are. The
 * control plane has already scrubbed the text. Best effort: the api may drop what it
 * cannot place, and a run that has ended is not an error.
 *
 * @generated from enum tank.agent.v1.RunStreamKind
 */
export declare enum RunStreamKind {
    /**
     * @generated from enum value: RUN_STREAM_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * text is a chunk of the assistant's reply to append
     *
     * @generated from enum value: RUN_STREAM_KIND_TEXT = 1;
     */
    TEXT = 1,
    /**
     * text is a status line replacing the previous one
     *
     * @generated from enum value: RUN_STREAM_KIND_STATUS = 2;
     */
    STATUS = 2,
    /**
     * the turn's output is complete
     *
     * @generated from enum value: RUN_STREAM_KIND_END = 3;
     */
    END = 3
}
/**
 * Describes the enum tank.agent.v1.RunStreamKind.
 */
export declare const RunStreamKindSchema: GenEnum<RunStreamKind>;
/**
 * A Tread's plan ledger: the whole of what the Tread set out to build (a document like a
 * master build plan, or the first approved plan), item by item, with where each stands.
 * Runs keep it current; people read it as one progress bar under the goal and tap for the
 * list (Robby, 2026-10-25: "I don't know where we are at"). The first version's size is kept,
 * so a plan that grew says so.
 *
 * @generated from enum tank.agent.v1.PlanItemStatus
 */
export declare enum PlanItemStatus {
    /**
     * @generated from enum value: PLAN_ITEM_STATUS_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: PLAN_ITEM_STATUS_TODO = 1;
     */
    TODO = 1,
    /**
     * @generated from enum value: PLAN_ITEM_STATUS_DOING = 2;
     */
    DOING = 2,
    /**
     * seen working by a run, never assumed
     *
     * @generated from enum value: PLAN_ITEM_STATUS_DONE = 3;
     */
    DONE = 3,
    /**
     * a trademark search, a domain to buy, a decision
     *
     * @generated from enum value: PLAN_ITEM_STATUS_NEEDS_PERSON = 4;
     */
    NEEDS_PERSON = 4,
    /**
     * taken out of the plan on purpose
     *
     * @generated from enum value: PLAN_ITEM_STATUS_DROPPED = 5;
     */
    DROPPED = 5
}
/**
 * Describes the enum tank.agent.v1.PlanItemStatus.
 */
export declare const PlanItemStatusSchema: GenEnum<PlanItemStatus>;
/**
 * DeliveryMode is who runs a repository's CI. Whichever it is, the repository's own
 * workflow files stay the definition of passing, and its deploy still goes where it
 * goes today.
 *
 * @generated from enum tank.agent.v1.DeliveryMode
 */
export declare enum DeliveryMode {
    /**
     * @generated from enum value: DELIVERY_MODE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * TANK's runners: TANK opens one pull request switching the repository's jobs to the
     * workspace's own runner label. Its secrets stay in GitHub.
     *
     * @generated from enum value: DELIVERY_MODE_TANK_RUNNERS = 1;
     */
    TANK_RUNNERS = 1,
    /**
     * The CI it has today: nothing moves. TANK hears results by webhook, reads the
     * failure log and fixes it.
     *
     * @generated from enum value: DELIVERY_MODE_OWN_CI = 2;
     */
    OWN_CI = 2,
    /**
     * Another CI system: it reports each result to TANK with one call, authenticated by
     * the report token. The same fix loop follows.
     *
     * @generated from enum value: DELIVERY_MODE_OTHER_CI = 3;
     */
    OTHER_CI = 3
}
/**
 * Describes the enum tank.agent.v1.DeliveryMode.
 */
export declare const DeliveryModeSchema: GenEnum<DeliveryMode>;
/**
 * @generated from service tank.agent.v1.AgentService
 */
export declare const AgentService: GenService<{
    /**
     * @generated from rpc tank.agent.v1.AgentService.StartRun
     */
    startRun: {
        methodKind: "unary";
        input: typeof StartRunRequestSchema;
        output: typeof StartRunResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.OpenThread
     */
    openThread: {
        methodKind: "unary";
        input: typeof OpenThreadRequestSchema;
        output: typeof OpenThreadResponseSchema;
    };
    /**
     * An agent's reply written in a thread without a run (2026-11-23): an agent that answers from
     * the Neural model alone talks within half a second, so the control plane posts its words as
     * the agent the moment they start and replaces the text as the rest is written. The first
     * call posts (message_id empty) and returns the message; later calls name it and carry the
     * whole text so far. Bot tokens only, on the requester's membership, like OpenThread; the
     * agent must be one of the workspace's own and allowed to run there.
     *
     * @generated from rpc tank.agent.v1.AgentService.Reply
     */
    reply: {
        methodKind: "unary";
        input: typeof ReplyRequestSchema;
        output: typeof ReplyResponseSchema;
    };
    /**
     * Shows an agent at work in a Tread or a thread before it has anything to say: the same
     * agent.status frame a run's status sends, with no run (Overdrive, 2026-11-24: a person
     * sees the agent respond within a few hundred milliseconds of pressing Send, every time).
     * Nothing is stored and nothing is posted; clients drop the frame after 30 s or when an
     * empty status follows. Bot tokens only; the agent must be one of the workspace's own and
     * a member of the Tread.
     *
     * @generated from rpc tank.agent.v1.AgentService.ShowWorking
     */
    showWorking: {
        methodKind: "unary";
        input: typeof ShowWorkingRequestSchema;
        output: typeof ShowWorkingResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.GetWorkspaceAgentSettings
     */
    getWorkspaceAgentSettings: {
        methodKind: "unary";
        input: typeof GetWorkspaceAgentSettingsRequestSchema;
        output: typeof GetWorkspaceAgentSettingsResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.SetWorkspaceAgentSettings
     */
    setWorkspaceAgentSettings: {
        methodKind: "unary";
        input: typeof SetWorkspaceAgentSettingsRequestSchema;
        output: typeof SetWorkspaceAgentSettingsResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.GetTreadPlan
     */
    getTreadPlan: {
        methodKind: "unary";
        input: typeof GetTreadPlanRequestSchema;
        output: typeof GetTreadPlanResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.StopRun
     */
    stopRun: {
        methodKind: "unary";
        input: typeof StopRunRequestSchema;
        output: typeof StopRunResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.Heartbeat
     */
    heartbeat: {
        methodKind: "unary";
        input: typeof HeartbeatRequestSchema;
        output: typeof HeartbeatResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.RenewRunToken
     */
    renewRunToken: {
        methodKind: "unary";
        input: typeof RenewRunTokenRequestSchema;
        output: typeof RenewRunTokenResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.GetRunStreamTail
     */
    getRunStreamTail: {
        methodKind: "unary";
        input: typeof GetRunStreamTailRequestSchema;
        output: typeof GetRunStreamTailResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.PublishRunStream
     */
    publishRunStream: {
        methodKind: "unary";
        input: typeof PublishRunStreamRequestSchema;
        output: typeof PublishRunStreamResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.SetStatus
     */
    setStatus: {
        methodKind: "unary";
        input: typeof SetStatusRequestSchema;
        output: typeof SetStatusResponseSchema;
    };
    /**
     * A product's brand and landing page, set by the run working in it (an agenture only).
     *
     * @generated from rpc tank.agent.v1.AgentService.SetProductBrand
     */
    setProductBrand: {
        methodKind: "unary";
        input: typeof SetProductBrandRequestSchema;
        output: typeof SetProductBrandResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.SetProductLanding
     */
    setProductLanding: {
        methodKind: "unary";
        input: typeof SetProductLandingRequestSchema;
        output: typeof SetProductLandingResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.RecordProductFinding
     */
    recordProductFinding: {
        methodKind: "unary";
        input: typeof RecordProductFindingRequestSchema;
        output: typeof RecordProductFindingResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.GetRun
     */
    getRun: {
        methodKind: "unary";
        input: typeof GetRunRequestSchema;
        output: typeof GetRunResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.ListRuns
     */
    listRuns: {
        methodKind: "unary";
        input: typeof ListRunsRequestSchema;
        output: typeof ListRunsResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.ListAgents
     */
    listAgents: {
        methodKind: "unary";
        input: typeof ListAgentsRequestSchema;
        output: typeof ListAgentsResponseSchema;
    };
    /**
     * Connecting a Tread to code. A Radar is private and so is this: only workspace
     * admins may connect an org or bind a repository.
     *
     * @generated from rpc tank.agent.v1.AgentService.GetRepoConnection
     */
    getRepoConnection: {
        methodKind: "unary";
        input: typeof GetRepoConnectionRequestSchema;
        output: typeof GetRepoConnectionResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.StartGitHubConnect
     */
    startGitHubConnect: {
        methodKind: "unary";
        input: typeof StartGitHubConnectRequestSchema;
        output: typeof StartGitHubConnectResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.BindRepo
     */
    bindRepo: {
        methodKind: "unary";
        input: typeof BindRepoRequestSchema;
        output: typeof BindRepoResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.UnbindRepo
     */
    unbindRepo: {
        methodKind: "unary";
        input: typeof UnbindRepoRequestSchema;
        output: typeof UnbindRepoResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.SetRepoAccess
     */
    setRepoAccess: {
        methodKind: "unary";
        input: typeof SetRepoAccessRequestSchema;
        output: typeof SetRepoAccessResponseSchema;
    };
    /**
     * Repositories and hosting on request, for premium workspaces.
     *
     * @generated from rpc tank.agent.v1.AgentService.CreateTreadRepo
     */
    createTreadRepo: {
        methodKind: "unary";
        input: typeof CreateTreadRepoRequestSchema;
        output: typeof CreateTreadRepoResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.SetTreadDeployment
     */
    setTreadDeployment: {
        methodKind: "unary";
        input: typeof SetTreadDeploymentRequestSchema;
        output: typeof SetTreadDeploymentResponseSchema;
    };
    /**
     * Previews for repositories the workspace has already connected: TANK opens a pull
     * request in each one adding the workflow that reports its builds, and hands back the
     * token that CI will need. Admins only, premium only, never a side effect.
     *
     * @generated from rpc tank.agent.v1.AgentService.SetUpRepoPreviews
     */
    setUpRepoPreviews: {
        methodKind: "unary";
        input: typeof SetUpRepoPreviewsRequestSchema;
        output: typeof SetUpRepoPreviewsResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.ListRepoPreviewSetups
     */
    listRepoPreviewSetups: {
        methodKind: "unary";
        input: typeof ListRepoPreviewSetupsRequestSchema;
        output: typeof ListRepoPreviewSetupsResponseSchema;
    };
    /**
     * Overdrive: where each connected repository builds and deploys, and the work TANK
     * has built ahead for the workspace. Admins set; members read.
     *
     * @generated from rpc tank.agent.v1.AgentService.ListRepoDelivery
     */
    listRepoDelivery: {
        methodKind: "unary";
        input: typeof ListRepoDeliveryRequestSchema;
        output: typeof ListRepoDeliveryResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.SetRepoDelivery
     */
    setRepoDelivery: {
        methodKind: "unary";
        input: typeof SetRepoDeliveryRequestSchema;
        output: typeof SetRepoDeliveryResponseSchema;
    };
    /**
     * The workspace's own choice, which every repository follows unless it has its own
     * (Robby, 2026-11-24: "set it globally for a workspace so they don't need to be set per
     * tread"). Admins only. Choosing TANK's runners opens the switch pull request in every
     * repository that follows it, and in each repository connected later.
     *
     * @generated from rpc tank.agent.v1.AgentService.SetWorkspaceDelivery
     */
    setWorkspaceDelivery: {
        methodKind: "unary";
        input: typeof SetWorkspaceDeliveryRequestSchema;
        output: typeof SetWorkspaceDeliveryResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.ListPredictedWork
     */
    listPredictedWork: {
        methodKind: "unary";
        input: typeof ListPredictedWorkRequestSchema;
        output: typeof ListPredictedWorkResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.DismissPredictedWork
     */
    dismissPredictedWork: {
        methodKind: "unary";
        input: typeof DismissPredictedWorkRequestSchema;
        output: typeof DismissPredictedWorkResponseSchema;
    };
    /**
     * Take work TANK built ahead: a run carries on its branch in a thread of the Tread it was
     * predicted in, finishes it and asks for the merge like any other run. A prediction from a
     * queued task is taken by starting the task instead.
     *
     * @generated from rpc tank.agent.v1.AgentService.TakePredictedWork
     */
    takePredictedWork: {
        methodKind: "unary";
        input: typeof TakePredictedWorkRequestSchema;
        output: typeof TakePredictedWorkResponseSchema;
    };
    /**
     * The Tread's switchboard: metrics for members, settings for admins.
     *
     * @generated from rpc tank.agent.v1.AgentService.GetTreadSwitchboard
     */
    getTreadSwitchboard: {
        methodKind: "unary";
        input: typeof GetTreadSwitchboardRequestSchema;
        output: typeof GetTreadSwitchboardResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.SetTreadSettings
     */
    setTreadSettings: {
        methodKind: "unary";
        input: typeof SetTreadSettingsRequestSchema;
        output: typeof SetTreadSettingsResponseSchema;
    };
    /**
     * Spend: the workspace's agent money by Tread, person, team, kind and day.
     *
     * @generated from rpc tank.agent.v1.AgentService.GetWorkspaceSpend
     */
    getWorkspaceSpend: {
        methodKind: "unary";
        input: typeof GetWorkspaceSpendRequestSchema;
        output: typeof GetWorkspaceSpendResponseSchema;
    };
    /**
     * The security state of every Tread in the workspace that is connected to a repository.
     *
     * @generated from rpc tank.agent.v1.AgentService.ListTreadSecurity
     */
    listTreadSecurity: {
        methodKind: "unary";
        input: typeof ListTreadSecurityRequestSchema;
        output: typeof ListTreadSecurityResponseSchema;
    };
    /**
     * Every app the workspace hosts on TANK, for the Treads the caller is in.
     *
     * @generated from rpc tank.agent.v1.AgentService.ListWorkspaceDeployments
     */
    listWorkspaceDeployments: {
        methodKind: "unary";
        input: typeof ListWorkspaceDeploymentsRequestSchema;
        output: typeof ListWorkspaceDeploymentsResponseSchema;
    };
    /**
     * The control plane's own Tread in a workspace, found by name or made, with the
     * workspace's agent, owners and admins in it. Platform token only. First use: Neural
     * Knowledge refreshes live in #neural-knowledge rather than a Tread like #general
     * (Robby, 2026-11-01).
     *
     * @generated from rpc tank.agent.v1.AgentService.EnsureAgentTread
     */
    ensureAgentTread: {
        methodKind: "unary";
        input: typeof EnsureAgentTreadRequestSchema;
        output: typeof EnsureAgentTreadResponseSchema;
    };
}>;
