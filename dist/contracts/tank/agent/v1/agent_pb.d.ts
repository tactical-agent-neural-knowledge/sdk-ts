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
};
/**
 * Describes the message tank.agent.v1.StartRunResponse.
 * Use `create(StartRunResponseSchema)` to create a new message.
 */
export declare const StartRunResponseSchema: GenMessage<StartRunResponse>;
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
};
/**
 * Describes the message tank.agent.v1.TreadMetrics.
 * Use `create(TreadMetricsSchema)` to create a new message.
 */
export declare const TreadMetricsSchema: GenMessage<TreadMetrics>;
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
    APPROVAL_EXPIRED = 18
}
/**
 * Describes the enum tank.agent.v1.RunState.
 */
export declare const RunStateSchema: GenEnum<RunState>;
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
}>;
