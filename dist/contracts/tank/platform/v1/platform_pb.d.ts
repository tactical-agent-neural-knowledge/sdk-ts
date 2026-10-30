import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/platform/v1/platform.proto.
 */
export declare const file_tank_platform_v1_platform: GenFile;
/**
 * AgentureRow is one product on the board as the console sees it.
 *
 * @generated from message tank.platform.v1.AgentureRow
 */
export type AgentureRow = Message<"tank.platform.v1.AgentureRow"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string slug = 2;
     */
    slug: string;
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: string description = 4;
     */
    description: string;
    /**
     * Allocation.
     *
     * @generated from field: bool enabled = 5;
     */
    enabled: boolean;
    /**
     * share of the board's attention, 0 to 100
     *
     * @generated from field: int32 weight = 6;
     */
    weight: number;
    /**
     * @generated from field: google.protobuf.Timestamp next_due_at = 7;
     */
    nextDueAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp last_run_at = 8;
     */
    lastRunAt?: Timestamp;
    /**
     * spikes asked for since it joined the board
     *
     * @generated from field: int32 runs = 9;
     */
    runs: number;
    /**
     * why the last attempt failed, if it did
     *
     * @generated from field: string last_error = 10;
     */
    lastError: string;
    /**
     * Work.
     *
     * everything an agent has spent in it
     *
     * @generated from field: int64 agent_minutes = 11;
     */
    agentMinutes: bigint;
    /**
     * empty when nothing is running
     *
     * @generated from field: string live_run_id = 12;
     */
    liveRunId: string;
    /**
     * the live run's state, for the console
     *
     * @generated from field: string live_state = 13;
     */
    liveState: string;
    /**
     * what its agents have cost, all time
     *
     * @generated from field: double spend_usd = 14;
     */
    spendUsd: number;
    /**
     * Money.
     *
     * what it would cost to take over right now
     *
     * @generated from field: int64 price_cents = 15;
     */
    priceCents: bigint;
    /**
     * @generated from field: bool claimed = 16;
     */
    claimed: boolean;
    /**
     * When set, a plan the agent stops at is approved for it rather than waiting for
     * somebody who is not coming.
     *
     * @generated from field: bool auto_approve = 17;
     */
    autoApprove: boolean;
};
/**
 * Describes the message tank.platform.v1.AgentureRow.
 * Use `create(AgentureRowSchema)` to create a new message.
 */
export declare const AgentureRowSchema: GenMessage<AgentureRow>;
/**
 * @generated from message tank.platform.v1.ListAgenturesRequest
 */
export type ListAgenturesRequest = Message<"tank.platform.v1.ListAgenturesRequest"> & {
    /**
     * match on name or slug
     *
     * @generated from field: string query = 1;
     */
    query: string;
    /**
     * @generated from field: int32 limit = 2;
     */
    limit: number;
    /**
     * @generated from field: int32 offset = 3;
     */
    offset: number;
};
/**
 * Describes the message tank.platform.v1.ListAgenturesRequest.
 * Use `create(ListAgenturesRequestSchema)` to create a new message.
 */
export declare const ListAgenturesRequestSchema: GenMessage<ListAgenturesRequest>;
/**
 * @generated from message tank.platform.v1.ListAgenturesResponse
 */
export type ListAgenturesResponse = Message<"tank.platform.v1.ListAgenturesResponse"> & {
    /**
     * @generated from field: repeated tank.platform.v1.AgentureRow agentures = 1;
     */
    agentures: AgentureRow[];
    /**
     * @generated from field: int32 total = 2;
     */
    total: number;
    /**
     * @generated from field: tank.platform.v1.BoardSummary summary = 3;
     */
    summary?: BoardSummary;
};
/**
 * Describes the message tank.platform.v1.ListAgenturesResponse.
 * Use `create(ListAgenturesResponseSchema)` to create a new message.
 */
export declare const ListAgenturesResponseSchema: GenMessage<ListAgenturesResponse>;
/**
 * BoardSummary is the state of the whole board in one line.
 *
 * @generated from message tank.platform.v1.BoardSummary
 */
export type BoardSummary = Message<"tank.platform.v1.BoardSummary"> & {
    /**
     * agents working, or briefed and about to be
     *
     * @generated from field: int32 in_flight = 1;
     */
    inFlight: number;
    /**
     * the cap they are held to
     *
     * @generated from field: int32 max_concurrent = 2;
     */
    maxConcurrent: number;
    /**
     * whether the board's agents run at all
     *
     * @generated from field: bool enabled = 3;
     */
    enabled: boolean;
    /**
     * Stopped outright: nothing starts and anything running is ended. Not the same as
     * a cap of zero, which lets what is running finish.
     *
     * @generated from field: bool killed = 8;
     */
    killed: boolean;
    /**
     * What a product starts as. Does not reach back and change products that exist.
     *
     * @generated from field: bool auto_default = 9;
     */
    autoDefault: boolean;
    /**
     * When agents may work. Minutes past midnight in hours_zone; equal means all day.
     *
     * @generated from field: int32 hours_from = 10;
     */
    hoursFrom: number;
    /**
     * @generated from field: int32 hours_to = 11;
     */
    hoursTo: number;
    /**
     * @generated from field: string hours_zone = 12;
     */
    hoursZone: string;
    /**
     * 0 is Sunday; empty means every day
     *
     * @generated from field: repeated int32 hours_days = 13;
     */
    hoursDays: number[];
    /**
     * @generated from field: int32 unclaimed = 4;
     */
    unclaimed: number;
    /**
     * @generated from field: int64 agent_minutes_24h = 5;
     */
    agentMinutes24h: bigint;
    /**
     * what the board cost in the last day
     *
     * @generated from field: double spend_usd_24h = 6;
     */
    spendUsd24h: number;
    /**
     * @generated from field: double spend_usd_total = 7;
     */
    spendUsdTotal: number;
    /**
     * The last hour and the last three, for reading a change to the cap or the
     * policy before the day's figure can show it.
     *
     * @generated from field: double spend_usd_1h = 14;
     */
    spendUsd1h: number;
    /**
     * @generated from field: double spend_usd_3h = 15;
     */
    spendUsd3h: number;
};
/**
 * Describes the message tank.platform.v1.BoardSummary.
 * Use `create(BoardSummarySchema)` to create a new message.
 */
export declare const BoardSummarySchema: GenMessage<BoardSummary>;
/**
 * SetAllocation changes how much attention a product gets. Weight 0 or enabled=false
 * both stop new work; neither touches a run already going.
 *
 * @generated from message tank.platform.v1.SetAllocationRequest
 */
export type SetAllocationRequest = Message<"tank.platform.v1.SetAllocationRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: bool enabled = 2;
     */
    enabled: boolean;
    /**
     * @generated from field: int32 weight = 3;
     */
    weight: number;
    /**
     * become due now rather than at its next turn
     *
     * @generated from field: bool run_now = 4;
     */
    runNow: boolean;
    /**
     * @generated from field: bool auto_approve = 5;
     */
    autoApprove: boolean;
};
/**
 * Describes the message tank.platform.v1.SetAllocationRequest.
 * Use `create(SetAllocationRequestSchema)` to create a new message.
 */
export declare const SetAllocationRequestSchema: GenMessage<SetAllocationRequest>;
/**
 * @generated from message tank.platform.v1.SetAllocationResponse
 */
export type SetAllocationResponse = Message<"tank.platform.v1.SetAllocationResponse"> & {
    /**
     * @generated from field: tank.platform.v1.AgentureRow agenture = 1;
     */
    agenture?: AgentureRow;
};
/**
 * Describes the message tank.platform.v1.SetAllocationResponse.
 * Use `create(SetAllocationResponseSchema)` to create a new message.
 */
export declare const SetAllocationResponseSchema: GenMessage<SetAllocationResponse>;
/**
 * SetBoardSettings changes how the board as a whole behaves.
 *
 * @generated from message tank.platform.v1.SetBoardSettingsRequest
 */
export type SetBoardSettingsRequest = Message<"tank.platform.v1.SetBoardSettingsRequest"> & {
    /**
     * 0 stops new work without losing anything
     *
     * @generated from field: int32 max_concurrent = 1;
     */
    maxConcurrent: number;
    /**
     * stop, and end what is running
     *
     * @generated from field: bool killed = 2;
     */
    killed: boolean;
    /**
     * @generated from field: bool auto_default = 3;
     */
    autoDefault: boolean;
    /**
     * @generated from field: int32 hours_from = 4;
     */
    hoursFrom: number;
    /**
     * @generated from field: int32 hours_to = 5;
     */
    hoursTo: number;
    /**
     * @generated from field: string hours_zone = 6;
     */
    hoursZone: string;
    /**
     * @generated from field: repeated int32 hours_days = 7;
     */
    hoursDays: number[];
};
/**
 * Describes the message tank.platform.v1.SetBoardSettingsRequest.
 * Use `create(SetBoardSettingsRequestSchema)` to create a new message.
 */
export declare const SetBoardSettingsRequestSchema: GenMessage<SetBoardSettingsRequest>;
/**
 * @generated from message tank.platform.v1.SetBoardSettingsResponse
 */
export type SetBoardSettingsResponse = Message<"tank.platform.v1.SetBoardSettingsResponse"> & {
    /**
     * @generated from field: tank.platform.v1.BoardSummary summary = 1;
     */
    summary?: BoardSummary;
};
/**
 * Describes the message tank.platform.v1.SetBoardSettingsResponse.
 * Use `create(SetBoardSettingsResponseSchema)` to create a new message.
 */
export declare const SetBoardSettingsResponseSchema: GenMessage<SetBoardSettingsResponse>;
/**
 * StopRun stops an agent that is working right now.
 *
 * @generated from message tank.platform.v1.StopRunRequest
 */
export type StopRunRequest = Message<"tank.platform.v1.StopRunRequest"> & {
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
 * Describes the message tank.platform.v1.StopRunRequest.
 * Use `create(StopRunRequestSchema)` to create a new message.
 */
export declare const StopRunRequestSchema: GenMessage<StopRunRequest>;
/**
 * @generated from message tank.platform.v1.StopRunResponse
 */
export type StopRunResponse = Message<"tank.platform.v1.StopRunResponse"> & {};
/**
 * Describes the message tank.platform.v1.StopRunResponse.
 * Use `create(StopRunResponseSchema)` to create a new message.
 */
export declare const StopRunResponseSchema: GenMessage<StopRunResponse>;
/**
 * MergeProposal is a twin the daily pass found: one product that should absorb
 * another. Approving carries it out; nothing is deleted either way.
 *
 * @generated from message tank.platform.v1.MergeProposal
 */
export type MergeProposal = Message<"tank.platform.v1.MergeProposal"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string absorbed_slug = 2;
     */
    absorbedSlug: string;
    /**
     * @generated from field: string absorbed_name = 3;
     */
    absorbedName: string;
    /**
     * @generated from field: string absorbed_summary = 4;
     */
    absorbedSummary: string;
    /**
     * @generated from field: string survivor_slug = 5;
     */
    survivorSlug: string;
    /**
     * @generated from field: string survivor_name = 6;
     */
    survivorName: string;
    /**
     * @generated from field: string survivor_summary = 7;
     */
    survivorSummary: string;
    /**
     * @generated from field: double similarity = 8;
     */
    similarity: number;
    /**
     * proposed | rejected | done
     *
     * @generated from field: string status = 9;
     */
    status: string;
    /**
     * the board decided it on its own, beyond doubt
     *
     * @generated from field: bool auto = 10;
     */
    auto: boolean;
    /**
     * @generated from field: google.protobuf.Timestamp proposed_at = 11;
     */
    proposedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp done_at = 12;
     */
    doneAt?: Timestamp;
};
/**
 * Describes the message tank.platform.v1.MergeProposal.
 * Use `create(MergeProposalSchema)` to create a new message.
 */
export declare const MergeProposalSchema: GenMessage<MergeProposal>;
/**
 * @generated from message tank.platform.v1.ListMergesRequest
 */
export type ListMergesRequest = Message<"tank.platform.v1.ListMergesRequest"> & {
    /**
     * also what was already merged or kept
     *
     * @generated from field: bool include_decided = 1;
     */
    includeDecided: boolean;
};
/**
 * Describes the message tank.platform.v1.ListMergesRequest.
 * Use `create(ListMergesRequestSchema)` to create a new message.
 */
export declare const ListMergesRequestSchema: GenMessage<ListMergesRequest>;
/**
 * @generated from message tank.platform.v1.ListMergesResponse
 */
export type ListMergesResponse = Message<"tank.platform.v1.ListMergesResponse"> & {
    /**
     * @generated from field: repeated tank.platform.v1.MergeProposal merges = 1;
     */
    merges: MergeProposal[];
};
/**
 * Describes the message tank.platform.v1.ListMergesResponse.
 * Use `create(ListMergesResponseSchema)` to create a new message.
 */
export declare const ListMergesResponseSchema: GenMessage<ListMergesResponse>;
/**
 * @generated from message tank.platform.v1.DecideMergeRequest
 */
export type DecideMergeRequest = Message<"tank.platform.v1.DecideMergeRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * false keeps both products
     *
     * @generated from field: bool approve = 2;
     */
    approve: boolean;
};
/**
 * Describes the message tank.platform.v1.DecideMergeRequest.
 * Use `create(DecideMergeRequestSchema)` to create a new message.
 */
export declare const DecideMergeRequestSchema: GenMessage<DecideMergeRequest>;
/**
 * @generated from message tank.platform.v1.DecideMergeResponse
 */
export type DecideMergeResponse = Message<"tank.platform.v1.DecideMergeResponse"> & {
    /**
     * @generated from field: tank.platform.v1.MergeProposal merge = 1;
     */
    merge?: MergeProposal;
};
/**
 * Describes the message tank.platform.v1.DecideMergeResponse.
 * Use `create(DecideMergeResponseSchema)` to create a new message.
 */
export declare const DecideMergeResponseSchema: GenMessage<DecideMergeResponse>;
/**
 * DropCandidate is a product the drop job would retire today, and why. The job is a
 * dry run until it is switched on; this list is how it is read meanwhile.
 *
 * @generated from message tank.platform.v1.DropCandidate
 */
export type DropCandidate = Message<"tank.platform.v1.DropCandidate"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string slug = 2;
     */
    slug: string;
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: string industry = 4;
     */
    industry: string;
    /**
     * @generated from field: int32 score = 5;
     */
    score: number;
    /**
     * @generated from field: string reasons = 6;
     */
    reasons: string;
};
/**
 * Describes the message tank.platform.v1.DropCandidate.
 * Use `create(DropCandidateSchema)` to create a new message.
 */
export declare const DropCandidateSchema: GenMessage<DropCandidate>;
/**
 * @generated from message tank.platform.v1.ListDropCandidatesRequest
 */
export type ListDropCandidatesRequest = Message<"tank.platform.v1.ListDropCandidatesRequest"> & {};
/**
 * Describes the message tank.platform.v1.ListDropCandidatesRequest.
 * Use `create(ListDropCandidatesRequestSchema)` to create a new message.
 */
export declare const ListDropCandidatesRequestSchema: GenMessage<ListDropCandidatesRequest>;
/**
 * @generated from message tank.platform.v1.ListDropCandidatesResponse
 */
export type ListDropCandidatesResponse = Message<"tank.platform.v1.ListDropCandidatesResponse"> & {
    /**
     * @generated from field: repeated tank.platform.v1.DropCandidate candidates = 1;
     */
    candidates: DropCandidate[];
    /**
     * YYYY-MM-DD the list is for
     *
     * @generated from field: string day = 2;
     */
    day: string;
};
/**
 * Describes the message tank.platform.v1.ListDropCandidatesResponse.
 * Use `create(ListDropCandidatesResponseSchema)` to create a new message.
 */
export declare const ListDropCandidatesResponseSchema: GenMessage<ListDropCandidatesResponse>;
/**
 * UserRow is one account as the directory lists it.
 *
 * @generated from message tank.platform.v1.UserRow
 */
export type UserRow = Message<"tank.platform.v1.UserRow"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string display_name = 2;
     */
    displayName: string;
    /**
     * @generated from field: string email = 3;
     */
    email: string;
    /**
     * user | bot | agent
     *
     * @generated from field: string kind = 4;
     */
    kind: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 5;
     */
    createdAt?: Timestamp;
    /**
     * the last time a session was opened
     *
     * @generated from field: google.protobuf.Timestamp last_login_at = 6;
     */
    lastLoginAt?: Timestamp;
    /**
     * latest across the workspaces they are in
     *
     * @generated from field: google.protobuf.Timestamp last_active_at = 7;
     */
    lastActiveAt?: Timestamp;
    /**
     * @generated from field: int32 workspaces = 8;
     */
    workspaces: number;
    /**
     * @generated from field: bool super_admin = 9;
     */
    superAdmin: boolean;
};
/**
 * Describes the message tank.platform.v1.UserRow.
 * Use `create(UserRowSchema)` to create a new message.
 */
export declare const UserRowSchema: GenMessage<UserRow>;
/**
 * @generated from message tank.platform.v1.SearchUsersRequest
 */
export type SearchUsersRequest = Message<"tank.platform.v1.SearchUsersRequest"> & {
    /**
     * name or email
     *
     * @generated from field: string query = 1;
     */
    query: string;
    /**
     * @generated from field: int32 limit = 2;
     */
    limit: number;
    /**
     * @generated from field: int32 offset = 3;
     */
    offset: number;
    /**
     * bots and agents as well as people
     *
     * @generated from field: bool include_machines = 4;
     */
    includeMachines: boolean;
    /**
     * newest (default) | active | login | name
     *
     * @generated from field: string sort = 5;
     */
    sort: string;
};
/**
 * Describes the message tank.platform.v1.SearchUsersRequest.
 * Use `create(SearchUsersRequestSchema)` to create a new message.
 */
export declare const SearchUsersRequestSchema: GenMessage<SearchUsersRequest>;
/**
 * @generated from message tank.platform.v1.SearchUsersResponse
 */
export type SearchUsersResponse = Message<"tank.platform.v1.SearchUsersResponse"> & {
    /**
     * @generated from field: repeated tank.platform.v1.UserRow users = 1;
     */
    users: UserRow[];
    /**
     * @generated from field: int32 total = 2;
     */
    total: number;
};
/**
 * Describes the message tank.platform.v1.SearchUsersResponse.
 * Use `create(SearchUsersResponseSchema)` to create a new message.
 */
export declare const SearchUsersResponseSchema: GenMessage<SearchUsersResponse>;
/**
 * Membership is one workspace somebody is in, and how recently they used it.
 *
 * @generated from message tank.platform.v1.Membership
 */
export type Membership = Message<"tank.platform.v1.Membership"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string slug = 2;
     */
    slug: string;
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: string role = 4;
     */
    role: string;
    /**
     * @generated from field: google.protobuf.Timestamp joined_at = 5;
     */
    joinedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp last_active_at = 6;
     */
    lastActiveAt?: Timestamp;
    /**
     * @generated from field: bool deactivated = 7;
     */
    deactivated: boolean;
    /**
     * @generated from field: string plan = 8;
     */
    plan: string;
};
/**
 * Describes the message tank.platform.v1.Membership.
 * Use `create(MembershipSchema)` to create a new message.
 */
export declare const MembershipSchema: GenMessage<Membership>;
/**
 * LoginRow is one session: when it was opened and from what.
 *
 * @generated from message tank.platform.v1.LoginRow
 */
export type LoginRow = Message<"tank.platform.v1.LoginRow"> & {
    /**
     * @generated from field: google.protobuf.Timestamp at = 1;
     */
    at?: Timestamp;
    /**
     * web | mobile_refresh
     *
     * @generated from field: string kind = 2;
     */
    kind: string;
    /**
     * the user agent, shortened
     *
     * @generated from field: string client = 3;
     */
    client: string;
    /**
     * not yet expired
     *
     * @generated from field: bool live = 4;
     */
    live: boolean;
};
/**
 * Describes the message tank.platform.v1.LoginRow.
 * Use `create(LoginRowSchema)` to create a new message.
 */
export declare const LoginRowSchema: GenMessage<LoginRow>;
/**
 * @generated from message tank.platform.v1.GetUserRequest
 */
export type GetUserRequest = Message<"tank.platform.v1.GetUserRequest"> & {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
};
/**
 * Describes the message tank.platform.v1.GetUserRequest.
 * Use `create(GetUserRequestSchema)` to create a new message.
 */
export declare const GetUserRequestSchema: GenMessage<GetUserRequest>;
/**
 * @generated from message tank.platform.v1.GetUserResponse
 */
export type GetUserResponse = Message<"tank.platform.v1.GetUserResponse"> & {
    /**
     * @generated from field: tank.platform.v1.UserRow user = 1;
     */
    user?: UserRow;
    /**
     * @generated from field: repeated tank.platform.v1.Membership memberships = 2;
     */
    memberships: Membership[];
    /**
     * newest first
     *
     * @generated from field: repeated tank.platform.v1.LoginRow logins = 3;
     */
    logins: LoginRow[];
};
/**
 * Describes the message tank.platform.v1.GetUserResponse.
 * Use `create(GetUserResponseSchema)` to create a new message.
 */
export declare const GetUserResponseSchema: GenMessage<GetUserResponse>;
/**
 * WorkspaceRow is one workspace as the directory lists it.
 *
 * @generated from message tank.platform.v1.WorkspaceRow
 */
export type WorkspaceRow = Message<"tank.platform.v1.WorkspaceRow"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string slug = 2;
     */
    slug: string;
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * venture | agenture | service | environment
     *
     * @generated from field: string kind = 4;
     */
    kind: string;
    /**
     * @generated from field: string plan = 5;
     */
    plan: string;
    /**
     * @generated from field: repeated string addons = 6;
     */
    addons: string[];
    /**
     * active human members
     *
     * @generated from field: int32 people = 7;
     */
    people: number;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 8;
     */
    createdAt?: Timestamp;
    /**
     * the latest of its members
     *
     * @generated from field: google.protobuf.Timestamp last_active_at = 9;
     */
    lastActiveAt?: Timestamp;
    /**
     * @generated from field: string owner_email = 10;
     */
    ownerEmail: string;
    /**
     * @generated from field: int32 agent_runs_30d = 11;
     */
    agentRuns30d: number;
    /**
     * what its agents cost us
     *
     * @generated from field: double agent_cost_usd_30d = 12;
     */
    agentCostUsd30d: number;
    /**
     * what it is charged this month
     *
     * @generated from field: int64 agent_billed_cents_month = 13;
     */
    agentBilledCentsMonth: bigint;
};
/**
 * Describes the message tank.platform.v1.WorkspaceRow.
 * Use `create(WorkspaceRowSchema)` to create a new message.
 */
export declare const WorkspaceRowSchema: GenMessage<WorkspaceRow>;
/**
 * @generated from message tank.platform.v1.SearchWorkspacesRequest
 */
export type SearchWorkspacesRequest = Message<"tank.platform.v1.SearchWorkspacesRequest"> & {
    /**
     * name, slug or a member's email
     *
     * @generated from field: string query = 1;
     */
    query: string;
    /**
     * @generated from field: int32 limit = 2;
     */
    limit: number;
    /**
     * @generated from field: int32 offset = 3;
     */
    offset: number;
    /**
     * newest (default) | active | usage | name
     *
     * @generated from field: string sort = 4;
     */
    sort: string;
    /**
     * empty is every kind
     *
     * @generated from field: string kind = 5;
     */
    kind: string;
    /**
     * empty is every plan
     *
     * @generated from field: string plan = 6;
     */
    plan: string;
};
/**
 * Describes the message tank.platform.v1.SearchWorkspacesRequest.
 * Use `create(SearchWorkspacesRequestSchema)` to create a new message.
 */
export declare const SearchWorkspacesRequestSchema: GenMessage<SearchWorkspacesRequest>;
/**
 * @generated from message tank.platform.v1.SearchWorkspacesResponse
 */
export type SearchWorkspacesResponse = Message<"tank.platform.v1.SearchWorkspacesResponse"> & {
    /**
     * @generated from field: repeated tank.platform.v1.WorkspaceRow workspaces = 1;
     */
    workspaces: WorkspaceRow[];
    /**
     * @generated from field: int32 total = 2;
     */
    total: number;
};
/**
 * Describes the message tank.platform.v1.SearchWorkspacesResponse.
 * Use `create(SearchWorkspacesResponseSchema)` to create a new message.
 */
export declare const SearchWorkspacesResponseSchema: GenMessage<SearchWorkspacesResponse>;
/**
 * MemberRow is one person in a workspace.
 *
 * @generated from message tank.platform.v1.MemberRow
 */
export type MemberRow = Message<"tank.platform.v1.MemberRow"> & {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
    /**
     * @generated from field: string display_name = 2;
     */
    displayName: string;
    /**
     * @generated from field: string email = 3;
     */
    email: string;
    /**
     * @generated from field: string kind = 4;
     */
    kind: string;
    /**
     * @generated from field: string role = 5;
     */
    role: string;
    /**
     * @generated from field: google.protobuf.Timestamp joined_at = 6;
     */
    joinedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp last_login_at = 7;
     */
    lastLoginAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp last_active_at = 8;
     */
    lastActiveAt?: Timestamp;
    /**
     * @generated from field: bool deactivated = 9;
     */
    deactivated: boolean;
};
/**
 * Describes the message tank.platform.v1.MemberRow.
 * Use `create(MemberRowSchema)` to create a new message.
 */
export declare const MemberRowSchema: GenMessage<MemberRow>;
/**
 * Feature is one thing a workspace can use, and whether it can.
 *
 * @generated from message tank.platform.v1.Feature
 */
export type Feature = Message<"tank.platform.v1.Feature"> & {
    /**
     * premium | agent | shield | books | blueprint | atlas
     *
     * @generated from field: string key = 1;
     */
    key: string;
    /**
     * @generated from field: string label = 2;
     */
    label: string;
    /**
     * @generated from field: bool on = 3;
     */
    on: boolean;
    /**
     * @generated from field: google.protobuf.Timestamp since = 4;
     */
    since?: Timestamp;
};
/**
 * Describes the message tank.platform.v1.Feature.
 * Use `create(FeatureSchema)` to create a new message.
 */
export declare const FeatureSchema: GenMessage<Feature>;
/**
 * @generated from message tank.platform.v1.Subscription
 */
export type Subscription = Message<"tank.platform.v1.Subscription"> & {
    /**
     * @generated from field: string product = 1;
     */
    product: string;
    /**
     * @generated from field: string provider = 2;
     */
    provider: string;
    /**
     * @generated from field: string status = 3;
     */
    status: string;
    /**
     * @generated from field: int32 seats = 4;
     */
    seats: number;
    /**
     * @generated from field: string period_end = 5;
     */
    periodEnd: string;
};
/**
 * Describes the message tank.platform.v1.Subscription.
 * Use `create(SubscriptionSchema)` to create a new message.
 */
export declare const SubscriptionSchema: GenMessage<Subscription>;
/**
 * DailyCount is one day of activity. Counts only.
 *
 * @generated from message tank.platform.v1.DailyCount
 */
export type DailyCount = Message<"tank.platform.v1.DailyCount"> & {
    /**
     * YYYY-MM-DD, UTC
     *
     * @generated from field: string day = 1;
     */
    day: string;
    /**
     * @generated from field: int32 messages = 2;
     */
    messages: number;
    /**
     * distinct people who posted
     *
     * @generated from field: int32 active_people = 3;
     */
    activePeople: number;
    /**
     * @generated from field: int32 agent_runs = 4;
     */
    agentRuns: number;
    /**
     * @generated from field: double agent_cost_usd = 5;
     */
    agentCostUsd: number;
    /**
     * overview only
     *
     * @generated from field: int32 new_people = 6;
     */
    newPeople: number;
    /**
     * overview only
     *
     * @generated from field: int32 new_workspaces = 7;
     */
    newWorkspaces: number;
};
/**
 * Describes the message tank.platform.v1.DailyCount.
 * Use `create(DailyCountSchema)` to create a new message.
 */
export declare const DailyCountSchema: GenMessage<DailyCount>;
/**
 * AgentRunRow is one run without its ask: what an agent was asked is the
 * workspace's content and stays in the workspace.
 *
 * @generated from message tank.platform.v1.AgentRunRow
 */
export type AgentRunRow = Message<"tank.platform.v1.AgentRunRow"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string agent_name = 2;
     */
    agentName: string;
    /**
     * @generated from field: string state = 3;
     */
    state: string;
    /**
     * @generated from field: google.protobuf.Timestamp started_at = 4;
     */
    startedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp ended_at = 5;
     */
    endedAt?: Timestamp;
    /**
     * @generated from field: int64 minutes = 6;
     */
    minutes: bigint;
    /**
     * @generated from field: double cost_usd = 7;
     */
    costUsd: number;
};
/**
 * Describes the message tank.platform.v1.AgentRunRow.
 * Use `create(AgentRunRowSchema)` to create a new message.
 */
export declare const AgentRunRowSchema: GenMessage<AgentRunRow>;
/**
 * @generated from message tank.platform.v1.AgentUsage
 */
export type AgentUsage = Message<"tank.platform.v1.AgentUsage"> & {
    /**
     * @generated from field: int32 runs_30d = 1;
     */
    runs30d: number;
    /**
     * @generated from field: int32 failed_30d = 2;
     */
    failed30d: number;
    /**
     * @generated from field: int64 minutes_30d = 3;
     */
    minutes30d: bigint;
    /**
     * @generated from field: double cost_usd_30d = 4;
     */
    costUsd30d: number;
    /**
     * @generated from field: double cost_usd_month = 5;
     */
    costUsdMonth: number;
    /**
     * @generated from field: int64 billed_cents_month = 6;
     */
    billedCentsMonth: bigint;
    /**
     * 0 is no cap
     *
     * @generated from field: int64 cap_cents = 7;
     */
    capCents: bigint;
    /**
     * @generated from field: repeated tank.platform.v1.AgentRunRow recent = 8;
     */
    recent: AgentRunRow[];
    /**
     * the agents it has, by name
     *
     * @generated from field: repeated string agents = 9;
     */
    agents: string[];
};
/**
 * Describes the message tank.platform.v1.AgentUsage.
 * Use `create(AgentUsageSchema)` to create a new message.
 */
export declare const AgentUsageSchema: GenMessage<AgentUsage>;
/**
 * @generated from message tank.platform.v1.WorkspaceCounts
 */
export type WorkspaceCounts = Message<"tank.platform.v1.WorkspaceCounts"> & {
    /**
     * @generated from field: int32 treads = 1;
     */
    treads: number;
    /**
     * @generated from field: int64 messages = 2;
     */
    messages: bigint;
    /**
     * @generated from field: int32 files = 3;
     */
    files: number;
    /**
     * @generated from field: int32 boards = 4;
     */
    boards: number;
    /**
     * @generated from field: int32 pages = 5;
     */
    pages: number;
};
/**
 * Describes the message tank.platform.v1.WorkspaceCounts.
 * Use `create(WorkspaceCountsSchema)` to create a new message.
 */
export declare const WorkspaceCountsSchema: GenMessage<WorkspaceCounts>;
/**
 * @generated from message tank.platform.v1.GetWorkspaceRequest
 */
export type GetWorkspaceRequest = Message<"tank.platform.v1.GetWorkspaceRequest"> & {
    /**
     * or
     *
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string slug = 2;
     */
    slug: string;
};
/**
 * Describes the message tank.platform.v1.GetWorkspaceRequest.
 * Use `create(GetWorkspaceRequestSchema)` to create a new message.
 */
export declare const GetWorkspaceRequestSchema: GenMessage<GetWorkspaceRequest>;
/**
 * @generated from message tank.platform.v1.GetWorkspaceResponse
 */
export type GetWorkspaceResponse = Message<"tank.platform.v1.GetWorkspaceResponse"> & {
    /**
     * @generated from field: tank.platform.v1.WorkspaceRow workspace = 1;
     */
    workspace?: WorkspaceRow;
    /**
     * @generated from field: repeated tank.platform.v1.MemberRow members = 2;
     */
    members: MemberRow[];
    /**
     * @generated from field: repeated tank.platform.v1.Feature features = 3;
     */
    features: Feature[];
    /**
     * @generated from field: repeated tank.platform.v1.Subscription subscriptions = 4;
     */
    subscriptions: Subscription[];
    /**
     * @generated from field: tank.platform.v1.AgentUsage agent_usage = 5;
     */
    agentUsage?: AgentUsage;
    /**
     * the last 30, oldest first
     *
     * @generated from field: repeated tank.platform.v1.DailyCount days = 6;
     */
    days: DailyCount[];
    /**
     * @generated from field: tank.platform.v1.WorkspaceCounts counts = 7;
     */
    counts?: WorkspaceCounts;
};
/**
 * Describes the message tank.platform.v1.GetWorkspaceResponse.
 * Use `create(GetWorkspaceResponseSchema)` to create a new message.
 */
export declare const GetWorkspaceResponseSchema: GenMessage<GetWorkspaceResponse>;
/**
 * @generated from message tank.platform.v1.GetOverviewRequest
 */
export type GetOverviewRequest = Message<"tank.platform.v1.GetOverviewRequest"> & {};
/**
 * Describes the message tank.platform.v1.GetOverviewRequest.
 * Use `create(GetOverviewRequestSchema)` to create a new message.
 */
export declare const GetOverviewRequestSchema: GenMessage<GetOverviewRequest>;
/**
 * @generated from message tank.platform.v1.GetOverviewResponse
 */
export type GetOverviewResponse = Message<"tank.platform.v1.GetOverviewResponse"> & {
    /**
     * @generated from field: int32 people = 1;
     */
    people: number;
    /**
     * @generated from field: int32 people_new_7d = 2;
     */
    peopleNew7d: number;
    /**
     * @generated from field: int32 people_active_1d = 3;
     */
    peopleActive1d: number;
    /**
     * @generated from field: int32 people_active_7d = 4;
     */
    peopleActive7d: number;
    /**
     * @generated from field: int32 workspaces = 5;
     */
    workspaces: number;
    /**
     * @generated from field: int32 workspaces_new_7d = 6;
     */
    workspacesNew7d: number;
    /**
     * @generated from field: int32 premium = 7;
     */
    premium: number;
    /**
     * @generated from field: double agent_cost_usd_month = 8;
     */
    agentCostUsdMonth: number;
    /**
     * @generated from field: int32 agent_runs_30d = 9;
     */
    agentRuns30d: number;
    /**
     * the last 30, oldest first
     *
     * @generated from field: repeated tank.platform.v1.DailyCount days = 10;
     */
    days: DailyCount[];
    /**
     * may add and remove super admins
     *
     * @generated from field: bool caller_is_root = 11;
     */
    callerIsRoot: boolean;
    /**
     * the top few by last 7 days of messages
     *
     * @generated from field: repeated tank.platform.v1.WorkspaceRow most_active = 12;
     */
    mostActive: WorkspaceRow[];
};
/**
 * Describes the message tank.platform.v1.GetOverviewResponse.
 * Use `create(GetOverviewResponseSchema)` to create a new message.
 */
export declare const GetOverviewResponseSchema: GenMessage<GetOverviewResponse>;
/**
 * SuperAdminRow is one person who may use this console.
 *
 * @generated from message tank.platform.v1.SuperAdminRow
 */
export type SuperAdminRow = Message<"tank.platform.v1.SuperAdminRow"> & {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
    /**
     * @generated from field: string email = 2;
     */
    email: string;
    /**
     * @generated from field: string display_name = 3;
     */
    displayName: string;
    /**
     * named in the deployment; not removable here
     *
     * @generated from field: bool root = 4;
     */
    root: boolean;
    /**
     * @generated from field: string added_by_email = 5;
     */
    addedByEmail: string;
    /**
     * @generated from field: google.protobuf.Timestamp added_at = 6;
     */
    addedAt?: Timestamp;
};
/**
 * Describes the message tank.platform.v1.SuperAdminRow.
 * Use `create(SuperAdminRowSchema)` to create a new message.
 */
export declare const SuperAdminRowSchema: GenMessage<SuperAdminRow>;
/**
 * @generated from message tank.platform.v1.ListSuperAdminsRequest
 */
export type ListSuperAdminsRequest = Message<"tank.platform.v1.ListSuperAdminsRequest"> & {};
/**
 * Describes the message tank.platform.v1.ListSuperAdminsRequest.
 * Use `create(ListSuperAdminsRequestSchema)` to create a new message.
 */
export declare const ListSuperAdminsRequestSchema: GenMessage<ListSuperAdminsRequest>;
/**
 * @generated from message tank.platform.v1.ListSuperAdminsResponse
 */
export type ListSuperAdminsResponse = Message<"tank.platform.v1.ListSuperAdminsResponse"> & {
    /**
     * @generated from field: repeated tank.platform.v1.SuperAdminRow admins = 1;
     */
    admins: SuperAdminRow[];
    /**
     * @generated from field: bool caller_is_root = 2;
     */
    callerIsRoot: boolean;
};
/**
 * Describes the message tank.platform.v1.ListSuperAdminsResponse.
 * Use `create(ListSuperAdminsResponseSchema)` to create a new message.
 */
export declare const ListSuperAdminsResponseSchema: GenMessage<ListSuperAdminsResponse>;
/**
 * AddSuperAdmin names an existing account. Root only.
 *
 * @generated from message tank.platform.v1.AddSuperAdminRequest
 */
export type AddSuperAdminRequest = Message<"tank.platform.v1.AddSuperAdminRequest"> & {
    /**
     * @generated from field: string email = 1;
     */
    email: string;
};
/**
 * Describes the message tank.platform.v1.AddSuperAdminRequest.
 * Use `create(AddSuperAdminRequestSchema)` to create a new message.
 */
export declare const AddSuperAdminRequestSchema: GenMessage<AddSuperAdminRequest>;
/**
 * @generated from message tank.platform.v1.AddSuperAdminResponse
 */
export type AddSuperAdminResponse = Message<"tank.platform.v1.AddSuperAdminResponse"> & {
    /**
     * @generated from field: repeated tank.platform.v1.SuperAdminRow admins = 1;
     */
    admins: SuperAdminRow[];
};
/**
 * Describes the message tank.platform.v1.AddSuperAdminResponse.
 * Use `create(AddSuperAdminResponseSchema)` to create a new message.
 */
export declare const AddSuperAdminResponseSchema: GenMessage<AddSuperAdminResponse>;
/**
 * RemoveSuperAdmin removes one added in the console. Root only; a root is not removable.
 *
 * @generated from message tank.platform.v1.RemoveSuperAdminRequest
 */
export type RemoveSuperAdminRequest = Message<"tank.platform.v1.RemoveSuperAdminRequest"> & {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
};
/**
 * Describes the message tank.platform.v1.RemoveSuperAdminRequest.
 * Use `create(RemoveSuperAdminRequestSchema)` to create a new message.
 */
export declare const RemoveSuperAdminRequestSchema: GenMessage<RemoveSuperAdminRequest>;
/**
 * @generated from message tank.platform.v1.RemoveSuperAdminResponse
 */
export type RemoveSuperAdminResponse = Message<"tank.platform.v1.RemoveSuperAdminResponse"> & {
    /**
     * @generated from field: repeated tank.platform.v1.SuperAdminRow admins = 1;
     */
    admins: SuperAdminRow[];
};
/**
 * Describes the message tank.platform.v1.RemoveSuperAdminResponse.
 * Use `create(RemoveSuperAdminResponseSchema)` to create a new message.
 */
export declare const RemoveSuperAdminResponseSchema: GenMessage<RemoveSuperAdminResponse>;
/**
 * NeuronRow is one Neuron as the registry holds it: a LoRA adapter on the base model.
 *
 * @generated from message tank.platform.v1.NeuronRow
 */
export type NeuronRow = Message<"tank.platform.v1.NeuronRow"> & {
    /**
     * code | environments | books | chat | ws-<workspace id>
     *
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * the training job that made it
     *
     * @generated from field: string version = 2;
     */
    version: string;
    /**
     * specialist | workspace
     *
     * @generated from field: string kind = 3;
     */
    kind: string;
    /**
     * workspace Neurons only
     *
     * @generated from field: string workspace_id = 4;
     */
    workspaceId: string;
    /**
     * @generated from field: string workspace_slug = 5;
     */
    workspaceSlug: string;
    /**
     * the sorter's field a specialist answers
     *
     * @generated from field: string field = 6;
     */
    field: string;
    /**
     * candidate | approved | retired
     *
     * @generated from field: string state = 7;
     */
    state: string;
    /**
     * held-out improvement over the base; 0 when unscored
     *
     * @generated from field: double eval_score = 8;
     */
    evalScore: number;
    /**
     * @generated from field: string eval_note = 9;
     */
    evalNote: string;
    /**
     * @generated from field: google.protobuf.Timestamp trained_at = 10;
     */
    trainedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp approved_at = 11;
     */
    approvedAt?: Timestamp;
    /**
     * on the model server now
     *
     * @generated from field: bool loaded = 12;
     */
    loaded: boolean;
    /**
     * /ai replies it gave
     *
     * @generated from field: int32 answers_30d = 13;
     */
    answers30d: number;
    /**
     * @generated from field: google.protobuf.Timestamp last_answered_at = 14;
     */
    lastAnsweredAt?: Timestamp;
};
/**
 * Describes the message tank.platform.v1.NeuronRow.
 * Use `create(NeuronRowSchema)` to create a new message.
 */
export declare const NeuronRowSchema: GenMessage<NeuronRow>;
/**
 * NeuronWorkspace is a workspace with the Private Neuron add-on and how close it is to
 * its first Neuron: the nightly trainer needs `floor` dialogs before it trains one.
 *
 * @generated from message tank.platform.v1.NeuronWorkspace
 */
export type NeuronWorkspace = Message<"tank.platform.v1.NeuronWorkspace"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string slug = 2;
     */
    slug: string;
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: int32 dialogs = 4;
     */
    dialogs: number;
    /**
     * @generated from field: int32 floor = 5;
     */
    floor: number;
    /**
     * none | candidate | approved
     *
     * @generated from field: string neuron_state = 6;
     */
    neuronState: string;
};
/**
 * Describes the message tank.platform.v1.NeuronWorkspace.
 * Use `create(NeuronWorkspaceSchema)` to create a new message.
 */
export declare const NeuronWorkspaceSchema: GenMessage<NeuronWorkspace>;
/**
 * FieldRow is one field the /ai sorter names and which Neuron answers it.
 *
 * @generated from message tank.platform.v1.FieldRow
 */
export type FieldRow = Message<"tank.platform.v1.FieldRow"> & {
    /**
     * @generated from field: string field = 1;
     */
    field: string;
    /**
     * @generated from field: int32 questions_30d = 2;
     */
    questions30d: number;
    /**
     * the approved specialist; "" when the base answers
     *
     * @generated from field: string neuron = 3;
     */
    neuron: string;
};
/**
 * Describes the message tank.platform.v1.FieldRow.
 * Use `create(FieldRowSchema)` to create a new message.
 */
export declare const FieldRowSchema: GenMessage<FieldRow>;
/**
 * @generated from message tank.platform.v1.FeedRow
 */
export type FeedRow = Message<"tank.platform.v1.FeedRow"> & {
    /**
     * @generated from field: string url = 1;
     */
    url: string;
    /**
     * rss | sitemap
     *
     * @generated from field: string kind = 2;
     */
    kind: string;
    /**
     * @generated from field: int64 found = 3;
     */
    found: bigint;
    /**
     * @generated from field: google.protobuf.Timestamp last_fetched_at = 4;
     */
    lastFetchedAt?: Timestamp;
    /**
     * @generated from field: string last_error = 5;
     */
    lastError: string;
};
/**
 * Describes the message tank.platform.v1.FeedRow.
 * Use `create(FeedRowSchema)` to create a new message.
 */
export declare const FeedRowSchema: GenMessage<FeedRow>;
/**
 * @generated from message tank.platform.v1.HostRow
 */
export type HostRow = Message<"tank.platform.v1.HostRow"> & {
    /**
     * @generated from field: string host = 1;
     */
    host: string;
    /**
     * @generated from field: int64 fetched = 2;
     */
    fetched: bigint;
    /**
     * @generated from field: int64 refused = 3;
     */
    refused: bigint;
    /**
     * @generated from field: int32 robots_status = 4;
     */
    robotsStatus: number;
    /**
     * @generated from field: int32 crawl_delay_ms = 5;
     */
    crawlDelayMs: number;
};
/**
 * Describes the message tank.platform.v1.HostRow.
 * Use `create(HostRowSchema)` to create a new message.
 */
export declare const HostRowSchema: GenMessage<HostRow>;
/**
 * @generated from message tank.platform.v1.SourceCount
 */
export type SourceCount = Message<"tank.platform.v1.SourceCount"> & {
    /**
     * wikipedia | news | asked | list
     *
     * @generated from field: string source = 1;
     */
    source: string;
    /**
     * @generated from field: int64 pages = 2;
     */
    pages: bigint;
    /**
     * @generated from field: int64 pages_24h = 3;
     */
    pages24h: bigint;
};
/**
 * Describes the message tank.platform.v1.SourceCount.
 * Use `create(SourceCountSchema)` to create a new message.
 */
export declare const SourceCountSchema: GenMessage<SourceCount>;
/**
 * WebIndex is the crawl as it stands: what is held, what is queued, what is flowing.
 *
 * @generated from message tank.platform.v1.WebIndex
 */
export type WebIndex = Message<"tank.platform.v1.WebIndex"> & {
    /**
     * @generated from field: int64 pages = 1;
     */
    pages: bigint;
    /**
     * @generated from field: int32 hosts = 2;
     */
    hosts: number;
    /**
     * @generated from field: int32 feeds = 3;
     */
    feeds: number;
    /**
     * @generated from field: int64 queued = 4;
     */
    queued: bigint;
    /**
     * due now and not claimed
     *
     * @generated from field: int64 queued_due = 5;
     */
    queuedDue: bigint;
    /**
     * @generated from field: google.protobuf.Timestamp oldest_due = 6;
     */
    oldestDue?: Timestamp;
    /**
     * fetched or re-read
     *
     * @generated from field: int64 pages_1h = 7;
     */
    pages1h: bigint;
    /**
     * @generated from field: int64 pages_24h = 8;
     */
    pages24h: bigint;
    /**
     * @generated from field: repeated tank.platform.v1.SourceCount sources = 9;
     */
    sources: SourceCount[];
    /**
     * @generated from field: repeated tank.platform.v1.FeedRow feed_rows = 10;
     */
    feedRows: FeedRow[];
    /**
     * the busiest
     *
     * @generated from field: repeated tank.platform.v1.HostRow host_rows = 11;
     */
    hostRows: HostRow[];
};
/**
 * Describes the message tank.platform.v1.WebIndex.
 * Use `create(WebIndexSchema)` to create a new message.
 */
export declare const WebIndexSchema: GenMessage<WebIndex>;
/**
 * @generated from message tank.platform.v1.NeuralDay
 */
export type NeuralDay = Message<"tank.platform.v1.NeuralDay"> & {
    /**
     * YYYY-MM-DD, UTC
     *
     * @generated from field: string day = 1;
     */
    day: string;
    /**
     * /ai replies
     *
     * @generated from field: int32 answers = 2;
     */
    answers: number;
    /**
     * distinct people asking
     *
     * @generated from field: int32 people = 3;
     */
    people: number;
    /**
     * @generated from field: int32 lookups = 4;
     */
    lookups: number;
    /**
     * @generated from field: int32 lookups_with_sources = 5;
     */
    lookupsWithSources: number;
    /**
     * @generated from field: int64 input_tokens = 6;
     */
    inputTokens: bigint;
    /**
     * @generated from field: int64 output_tokens = 7;
     */
    outputTokens: bigint;
    /**
     * @generated from field: double cost_usd = 8;
     */
    costUsd: number;
    /**
     * pages the index fetched or re-read
     *
     * @generated from field: int64 pages_read = 9;
     */
    pagesRead: bigint;
    /**
     * tokens agents spent on TANK Neural
     *
     * @generated from field: int64 agent_tokens = 10;
     */
    agentTokens: bigint;
};
/**
 * Describes the message tank.platform.v1.NeuralDay.
 * Use `create(NeuralDaySchema)` to create a new message.
 */
export declare const NeuralDaySchema: GenMessage<NeuralDay>;
/**
 * @generated from message tank.platform.v1.NeuralUsage
 */
export type NeuralUsage = Message<"tank.platform.v1.NeuralUsage"> & {
    /**
     * @generated from field: int32 answers_30d = 1;
     */
    answers30d: number;
    /**
     * @generated from field: int32 people_30d = 2;
     */
    people30d: number;
    /**
     * @generated from field: int32 lookups_30d = 3;
     */
    lookups30d: number;
    /**
     * @generated from field: int32 lookups_with_sources_30d = 4;
     */
    lookupsWithSources30d: number;
    /**
     * follow-ups that found the answer out of date
     *
     * @generated from field: int32 changed_30d = 5;
     */
    changed30d: number;
    /**
     * @generated from field: int64 lookup_ms_avg = 6;
     */
    lookupMsAvg: bigint;
    /**
     * @generated from field: int64 input_tokens_30d = 7;
     */
    inputTokens30d: bigint;
    /**
     * @generated from field: int64 output_tokens_30d = 8;
     */
    outputTokens30d: bigint;
    /**
     * @generated from field: double cost_usd_30d = 9;
     */
    costUsd30d: number;
    /**
     * runs that used TANK Neural
     *
     * @generated from field: int32 agent_runs_30d = 10;
     */
    agentRuns30d: number;
    /**
     * @generated from field: int64 agent_tokens_30d = 11;
     */
    agentTokens30d: bigint;
    /**
     * @generated from field: int32 thumbs_up_30d = 12;
     */
    thumbsUp30d: number;
    /**
     * @generated from field: int32 thumbs_down_30d = 13;
     */
    thumbsDown30d: number;
};
/**
 * Describes the message tank.platform.v1.NeuralUsage.
 * Use `create(NeuralUsageSchema)` to create a new message.
 */
export declare const NeuralUsageSchema: GenMessage<NeuralUsage>;
/**
 * @generated from message tank.platform.v1.GetNeuralRequest
 */
export type GetNeuralRequest = Message<"tank.platform.v1.GetNeuralRequest"> & {};
/**
 * Describes the message tank.platform.v1.GetNeuralRequest.
 * Use `create(GetNeuralRequestSchema)` to create a new message.
 */
export declare const GetNeuralRequestSchema: GenMessage<GetNeuralRequest>;
/**
 * @generated from message tank.platform.v1.GetNeuralResponse
 */
export type GetNeuralResponse = Message<"tank.platform.v1.GetNeuralResponse"> & {
    /**
     * what the server calls the base
     *
     * @generated from field: string base_model = 1;
     */
    baseModel: string;
    /**
     * @generated from field: bool server_up = 2;
     */
    serverUp: boolean;
    /**
     * adapters the server holds now, by served name
     *
     * @generated from field: repeated string loaded = 3;
     */
    loaded: string[];
    /**
     * @generated from field: repeated tank.platform.v1.NeuronRow neurons = 4;
     */
    neurons: NeuronRow[];
    /**
     * @generated from field: repeated tank.platform.v1.NeuronWorkspace neuron_workspaces = 5;
     */
    neuronWorkspaces: NeuronWorkspace[];
    /**
     * @generated from field: repeated tank.platform.v1.FieldRow fields = 6;
     */
    fields: FieldRow[];
    /**
     * @generated from field: tank.platform.v1.WebIndex web = 7;
     */
    web?: WebIndex;
    /**
     * @generated from field: tank.platform.v1.NeuralUsage usage = 8;
     */
    usage?: NeuralUsage;
    /**
     * the last 30, oldest first
     *
     * @generated from field: repeated tank.platform.v1.NeuralDay days = 9;
     */
    days: NeuralDay[];
};
/**
 * Describes the message tank.platform.v1.GetNeuralResponse.
 * Use `create(GetNeuralResponseSchema)` to create a new message.
 */
export declare const GetNeuralResponseSchema: GenMessage<GetNeuralResponse>;
/**
 * @generated from service tank.platform.v1.PlatformService
 */
export declare const PlatformService: GenService<{
    /**
     * @generated from rpc tank.platform.v1.PlatformService.ListAgentures
     */
    listAgentures: {
        methodKind: "unary";
        input: typeof ListAgenturesRequestSchema;
        output: typeof ListAgenturesResponseSchema;
    };
    /**
     * @generated from rpc tank.platform.v1.PlatformService.SetAllocation
     */
    setAllocation: {
        methodKind: "unary";
        input: typeof SetAllocationRequestSchema;
        output: typeof SetAllocationResponseSchema;
    };
    /**
     * @generated from rpc tank.platform.v1.PlatformService.SetBoardSettings
     */
    setBoardSettings: {
        methodKind: "unary";
        input: typeof SetBoardSettingsRequestSchema;
        output: typeof SetBoardSettingsResponseSchema;
    };
    /**
     * @generated from rpc tank.platform.v1.PlatformService.StopRun
     */
    stopRun: {
        methodKind: "unary";
        input: typeof StopRunRequestSchema;
        output: typeof StopRunResponseSchema;
    };
    /**
     * @generated from rpc tank.platform.v1.PlatformService.ListMerges
     */
    listMerges: {
        methodKind: "unary";
        input: typeof ListMergesRequestSchema;
        output: typeof ListMergesResponseSchema;
    };
    /**
     * @generated from rpc tank.platform.v1.PlatformService.DecideMerge
     */
    decideMerge: {
        methodKind: "unary";
        input: typeof DecideMergeRequestSchema;
        output: typeof DecideMergeResponseSchema;
    };
    /**
     * @generated from rpc tank.platform.v1.PlatformService.ListDropCandidates
     */
    listDropCandidates: {
        methodKind: "unary";
        input: typeof ListDropCandidatesRequestSchema;
        output: typeof ListDropCandidatesResponseSchema;
    };
    /**
     * @generated from rpc tank.platform.v1.PlatformService.GetOverview
     */
    getOverview: {
        methodKind: "unary";
        input: typeof GetOverviewRequestSchema;
        output: typeof GetOverviewResponseSchema;
    };
    /**
     * @generated from rpc tank.platform.v1.PlatformService.SearchUsers
     */
    searchUsers: {
        methodKind: "unary";
        input: typeof SearchUsersRequestSchema;
        output: typeof SearchUsersResponseSchema;
    };
    /**
     * @generated from rpc tank.platform.v1.PlatformService.GetUser
     */
    getUser: {
        methodKind: "unary";
        input: typeof GetUserRequestSchema;
        output: typeof GetUserResponseSchema;
    };
    /**
     * @generated from rpc tank.platform.v1.PlatformService.SearchWorkspaces
     */
    searchWorkspaces: {
        methodKind: "unary";
        input: typeof SearchWorkspacesRequestSchema;
        output: typeof SearchWorkspacesResponseSchema;
    };
    /**
     * @generated from rpc tank.platform.v1.PlatformService.GetWorkspace
     */
    getWorkspace: {
        methodKind: "unary";
        input: typeof GetWorkspaceRequestSchema;
        output: typeof GetWorkspaceResponseSchema;
    };
    /**
     * @generated from rpc tank.platform.v1.PlatformService.ListSuperAdmins
     */
    listSuperAdmins: {
        methodKind: "unary";
        input: typeof ListSuperAdminsRequestSchema;
        output: typeof ListSuperAdminsResponseSchema;
    };
    /**
     * @generated from rpc tank.platform.v1.PlatformService.AddSuperAdmin
     */
    addSuperAdmin: {
        methodKind: "unary";
        input: typeof AddSuperAdminRequestSchema;
        output: typeof AddSuperAdminResponseSchema;
    };
    /**
     * @generated from rpc tank.platform.v1.PlatformService.RemoveSuperAdmin
     */
    removeSuperAdmin: {
        methodKind: "unary";
        input: typeof RemoveSuperAdminRequestSchema;
        output: typeof RemoveSuperAdminResponseSchema;
    };
    /**
     * @generated from rpc tank.platform.v1.PlatformService.GetNeural
     */
    getNeural: {
        methodKind: "unary";
        input: typeof GetNeuralRequestSchema;
        output: typeof GetNeuralResponseSchema;
    };
}>;
