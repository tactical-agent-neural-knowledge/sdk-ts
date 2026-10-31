import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/agentops/v1/agentops.proto.
 */
export declare const file_tank_agentops_v1_agentops: GenFile;
/**
 * Which tools a member may use, by tool name as the runner knows them (Bash, Edit,
 * open_pull_request, ...). An empty allow list means everything the Tread's policy
 * permits; deny always wins. Neither can widen what the policy permits.
 *
 * @generated from message tank.agentops.v1.ToolPolicy
 */
export type ToolPolicy = Message<"tank.agentops.v1.ToolPolicy"> & {
    /**
     * @generated from field: repeated string allow = 1;
     */
    allow: string[];
    /**
     * @generated from field: repeated string deny = 2;
     */
    deny: string[];
};
/**
 * Describes the message tank.agentops.v1.ToolPolicy.
 * Use `create(ToolPolicySchema)` to create a new message.
 */
export declare const ToolPolicySchema: GenMessage<ToolPolicy>;
/**
 * What one hand-off may spend. Zero means the team's default, and a hand-off can
 * never exceed what its parent has left.
 *
 * @generated from message tank.agentops.v1.Envelope
 */
export type Envelope = Message<"tank.agentops.v1.Envelope"> & {
    /**
     * @generated from field: double usd = 1;
     */
    usd: number;
    /**
     * @generated from field: int32 turns = 2;
     */
    turns: number;
    /**
     * @generated from field: int32 minutes = 3;
     */
    minutes: number;
};
/**
 * Describes the message tank.agentops.v1.Envelope.
 * Use `create(EnvelopeSchema)` to create a new message.
 */
export declare const EnvelopeSchema: GenMessage<Envelope>;
/**
 * @generated from message tank.agentops.v1.Member
 */
export type Member = Message<"tank.agentops.v1.Member"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string agent_id = 2;
     */
    agentId: string;
    /**
     * the agent's user row, for @mentions
     *
     * @generated from field: string principal_id = 3;
     */
    principalId: string;
    /**
     * @generated from field: tank.agentops.v1.Seat seat = 4;
     */
    seat: Seat;
    /**
     * "Reviewer"
     *
     * @generated from field: string title = 5;
     */
    title: string;
    /**
     * "reviewer": what @ resolves inside an attached Tread
     *
     * @generated from field: string handle = 6;
     */
    handle: string;
    /**
     * who this member is here and what it does
     *
     * @generated from field: string prompt = 7;
     */
    prompt: string;
    /**
     * the ladder, preferred first; each must be allowed by policy
     *
     * @generated from field: repeated string models = 8;
     */
    models: string[];
    /**
     * @generated from field: tank.agentops.v1.ToolPolicy tools = 9;
     */
    tools?: ToolPolicy;
    /**
     * may hand work to other members
     *
     * @generated from field: bool delegate = 10;
     */
    delegate: boolean;
    /**
     * member ids it may hand to; empty with delegate = any specialist
     *
     * @generated from field: repeated string delegate_to = 11;
     */
    delegateTo: string[];
    /**
     * kinds of ask that route here ("tests", "migration", "review")
     *
     * @generated from field: repeated string triggers = 12;
     */
    triggers: string[];
    /**
     * default for a hand-off to this member
     *
     * @generated from field: tank.agentops.v1.Envelope envelope = 13;
     */
    envelope?: Envelope;
    /**
     * @generated from field: bool enabled = 14;
     */
    enabled: boolean;
    /**
     * What it did, at the Tread rate.
     *
     * @generated from field: double spend_today_usd = 15;
     */
    spendTodayUsd: number;
    /**
     * @generated from field: double spend_month_usd = 16;
     */
    spendMonthUsd: number;
    /**
     * @generated from field: int32 runs_today = 17;
     */
    runsToday: number;
    /**
     * @generated from field: int32 running_now = 18;
     */
    runningNow: number;
    /**
     * A person's seat: their user id; the handle is theirs; no agent, no prompt.
     *
     * @generated from field: string user_id = 19;
     */
    userId: string;
    /**
     * The evidence: what this member actually finished, by kind of ask, so the
     * coordinator routes by record rather than by the roster's claims.
     *
     * @generated from field: tank.agentops.v1.MemberRecord record = 20;
     */
    record?: MemberRecord;
};
/**
 * Describes the message tank.agentops.v1.Member.
 * Use `create(MemberSchema)` to create a new message.
 */
export declare const MemberSchema: GenMessage<Member>;
/**
 * What a member has actually done over thirty days.
 *
 * @generated from message tank.agentops.v1.MemberRecord
 */
export type MemberRecord = Message<"tank.agentops.v1.MemberRecord"> & {
    /**
     * @generated from field: int32 finished = 1;
     */
    finished: number;
    /**
     * @generated from field: int32 failed = 2;
     */
    failed: number;
    /**
     * hand-offs the coordinator accepted
     *
     * @generated from field: int32 accepted = 3;
     */
    accepted: number;
    /**
     * @generated from field: int32 rejected = 4;
     */
    rejected: number;
    /**
     * @generated from field: double avg_cost_usd = 5;
     */
    avgCostUsd: number;
    /**
     * @generated from field: double avg_minutes = 6;
     */
    avgMinutes: number;
    /**
     * @generated from field: repeated tank.agentops.v1.KindRecord kinds = 7;
     */
    kinds: KindRecord[];
};
/**
 * Describes the message tank.agentops.v1.MemberRecord.
 * Use `create(MemberRecordSchema)` to create a new message.
 */
export declare const MemberRecordSchema: GenMessage<MemberRecord>;
/**
 * @generated from message tank.agentops.v1.KindRecord
 */
export type KindRecord = Message<"tank.agentops.v1.KindRecord"> & {
    /**
     * the trigger the ask matched, else the run's task class
     *
     * @generated from field: string kind = 1;
     */
    kind: string;
    /**
     * @generated from field: int32 finished = 2;
     */
    finished: number;
    /**
     * @generated from field: int32 failed = 3;
     */
    failed: number;
    /**
     * @generated from field: int32 accepted = 4;
     */
    accepted: number;
    /**
     * @generated from field: int32 rejected = 5;
     */
    rejected: number;
};
/**
 * Describes the message tank.agentops.v1.KindRecord.
 * Use `create(KindRecordSchema)` to create a new message.
 */
export declare const KindRecordSchema: GenMessage<KindRecord>;
/**
 * @generated from message tank.agentops.v1.Team
 */
export type Team = Message<"tank.agentops.v1.Team"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * "Release team"
     *
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * "release": @release in an attached Tread
     *
     * @generated from field: string handle = 4;
     */
    handle: string;
    /**
     * one or two lines the coordinator reads first
     *
     * @generated from field: string purpose = 5;
     */
    purpose: string;
    /**
     * @generated from field: repeated tank.agentops.v1.Member members = 6;
     */
    members: Member[];
    /**
     * the Treads it works in
     *
     * @generated from field: repeated string channel_ids = 7;
     */
    channelIds: string[];
    /**
     * 0 = no cap
     *
     * @generated from field: double daily_cap_usd = 8;
     */
    dailyCapUsd: number;
    /**
     * 0 = the workspace's
     *
     * @generated from field: int32 concurrent_cap = 9;
     */
    concurrentCap: number;
    /**
     * the team's default hand-off envelope
     *
     * @generated from field: tank.agentops.v1.Envelope envelope = 10;
     */
    envelope?: Envelope;
    /**
     * @generated from field: double spend_today_usd = 11;
     */
    spendTodayUsd: number;
    /**
     * @generated from field: double spend_month_usd = 12;
     */
    spendMonthUsd: number;
    /**
     * @generated from field: int32 runs_today = 13;
     */
    runsToday: number;
    /**
     * @generated from field: int32 running_now = 14;
     */
    runningNow: number;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 15;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 16;
     */
    updatedAt?: Timestamp;
    /**
     * @generated from field: string created_by = 17;
     */
    createdBy: string;
    /**
     * The formation board: one lane per member, hand-off edges drawn as they happen, a
     * note dropped in a lane steers that member's run. Made with the team.
     *
     * @generated from field: string board_id = 18;
     */
    boardId: string;
    /**
     * Draining: no new run starts and no new hand-off is made; what runs finishes.
     *
     * @generated from field: bool paused = 19;
     */
    paused: boolean;
    /**
     * What the team's runs hold right now (files, tables, routes, Treads), so two
     * agents never work the same thing at once.
     *
     * @generated from field: repeated tank.agentops.v1.Claim claims = 20;
     */
    claims: Claim[];
    /**
     * @generated from field: tank.agentops.v1.TeamSlo slo = 21;
     */
    slo?: TeamSlo;
    /**
     * A shift: the team works a backlog on its own at a time of day, inside an envelope,
     * and posts a brief when the shift ends.
     *
     * @generated from field: tank.agentops.v1.Shift shift = 22;
     */
    shift?: Shift;
    /**
     * What the team learned, newest last: lines its hand-offs reported done and what
     * members chose to remember. Every member's run reads them.
     *
     * @generated from field: repeated string memory = 23;
     */
    memory: string[];
};
/**
 * Describes the message tank.agentops.v1.Team.
 * Use `create(TeamSchema)` to create a new message.
 */
export declare const TeamSchema: GenMessage<Team>;
/**
 * @generated from message tank.agentops.v1.Shift
 */
export type Shift = Message<"tank.agentops.v1.Shift"> & {
    /**
     * @generated from field: bool enabled = 1;
     */
    enabled: boolean;
    /**
     * 0..23
     *
     * @generated from field: int32 start_hour_utc = 2;
     */
    startHourUtc: number;
    /**
     * how long the shift runs; the brief posts at the end
     *
     * @generated from field: int32 hours = 3;
     */
    hours: number;
    /**
     * the shift's envelope
     *
     * @generated from field: double usd = 4;
     */
    usd: number;
    /**
     * what to work on: "the backlog in #eng", a list, a goal
     *
     * @generated from field: string ask = 5;
     */
    ask: string;
    /**
     * the Tread the shift runs in (one the team is attached to)
     *
     * @generated from field: string channel_id = 6;
     */
    channelId: string;
    /**
     * @generated from field: google.protobuf.Timestamp last_started_at = 7;
     */
    lastStartedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp last_brief_at = 8;
     */
    lastBriefAt?: Timestamp;
};
/**
 * Describes the message tank.agentops.v1.Shift.
 * Use `create(ShiftSchema)` to create a new message.
 */
export declare const ShiftSchema: GenMessage<Shift>;
/**
 * @generated from message tank.agentops.v1.SetTeamShiftRequest
 */
export type SetTeamShiftRequest = Message<"tank.agentops.v1.SetTeamShiftRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string team_id = 2;
     */
    teamId: string;
    /**
     * @generated from field: tank.agentops.v1.Shift shift = 3;
     */
    shift?: Shift;
};
/**
 * Describes the message tank.agentops.v1.SetTeamShiftRequest.
 * Use `create(SetTeamShiftRequestSchema)` to create a new message.
 */
export declare const SetTeamShiftRequestSchema: GenMessage<SetTeamShiftRequest>;
/**
 * @generated from message tank.agentops.v1.SetTeamShiftResponse
 */
export type SetTeamShiftResponse = Message<"tank.agentops.v1.SetTeamShiftResponse"> & {
    /**
     * @generated from field: tank.agentops.v1.Team team = 1;
     */
    team?: Team;
};
/**
 * Describes the message tank.agentops.v1.SetTeamShiftResponse.
 * Use `create(SetTeamShiftResponseSchema)` to create a new message.
 */
export declare const SetTeamShiftResponseSchema: GenMessage<SetTeamShiftResponse>;
/**
 * Replay: the team's runs and hand-offs over a window, as a tree with cost on every
 * node, so "why did this cost $40" has an answer per branch.
 *
 * @generated from message tank.agentops.v1.ReplayRun
 */
export type ReplayRun = Message<"tank.agentops.v1.ReplayRun"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
    /**
     * @generated from field: string parent_run_id = 2;
     */
    parentRunId: string;
    /**
     * @generated from field: string member_id = 3;
     */
    memberId: string;
    /**
     * who ran it
     *
     * @generated from field: string title = 4;
     */
    title: string;
    /**
     * @generated from field: string handle = 5;
     */
    handle: string;
    /**
     * @generated from field: string ask = 6;
     */
    ask: string;
    /**
     * @generated from field: string state = 7;
     */
    state: string;
    /**
     * @generated from field: google.protobuf.Timestamp started_at = 8;
     */
    startedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp ended_at = 9;
     */
    endedAt?: Timestamp;
    /**
     * this run alone, at the Tread rate
     *
     * @generated from field: double cost_usd = 10;
     */
    costUsd: number;
    /**
     * this run and every hand-off under it
     *
     * @generated from field: double tree_cost_usd = 11;
     */
    treeCostUsd: number;
    /**
     * accepted | rejected | "" for a hand-off
     *
     * @generated from field: string verdict = 12;
     */
    verdict: string;
    /**
     * @generated from field: string channel_id = 13;
     */
    channelId: string;
    /**
     * @generated from field: string thread_root_id = 14;
     */
    threadRootId: string;
    /**
     * @generated from field: string pr_url = 15;
     */
    prUrl: string;
    /**
     * @generated from field: int32 depth = 16;
     */
    depth: number;
    /**
     * a hand-off to a person (state waiting | done | timed_out)
     *
     * @generated from field: bool person = 17;
     */
    person: boolean;
    /**
     * @generated from field: string requested_by = 18;
     */
    requestedBy: string;
};
/**
 * Describes the message tank.agentops.v1.ReplayRun.
 * Use `create(ReplayRunSchema)` to create a new message.
 */
export declare const ReplayRunSchema: GenMessage<ReplayRun>;
/**
 * @generated from message tank.agentops.v1.GetTeamReplayRequest
 */
export type GetTeamReplayRequest = Message<"tank.agentops.v1.GetTeamReplayRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string team_id = 2;
     */
    teamId: string;
    /**
     * default: seven days
     *
     * @generated from field: google.protobuf.Timestamp since = 3;
     */
    since?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp until = 4;
     */
    until?: Timestamp;
};
/**
 * Describes the message tank.agentops.v1.GetTeamReplayRequest.
 * Use `create(GetTeamReplayRequestSchema)` to create a new message.
 */
export declare const GetTeamReplayRequestSchema: GenMessage<GetTeamReplayRequest>;
/**
 * @generated from message tank.agentops.v1.GetTeamReplayResponse
 */
export type GetTeamReplayResponse = Message<"tank.agentops.v1.GetTeamReplayResponse"> & {
    /**
     * oldest first, parents before their hand-offs
     *
     * @generated from field: repeated tank.agentops.v1.ReplayRun runs = 1;
     */
    runs: ReplayRun[];
    /**
     * @generated from field: double total_usd = 2;
     */
    totalUsd: number;
};
/**
 * Describes the message tank.agentops.v1.GetTeamReplayResponse.
 * Use `create(GetTeamReplayResponseSchema)` to create a new message.
 */
export declare const GetTeamReplayResponseSchema: GenMessage<GetTeamReplayResponse>;
/**
 * Publish the team as a template others start from: the workspace's own, or everyone's.
 *
 * @generated from message tank.agentops.v1.PublishTemplateRequest
 */
export type PublishTemplateRequest = Message<"tank.agentops.v1.PublishTemplateRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string team_id = 2;
     */
    teamId: string;
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: string summary = 4;
     */
    summary: string;
    /**
     * share across every workspace; false keeps it in this one
     *
     * @generated from field: bool everyone = 5;
     */
    everyone: boolean;
};
/**
 * Describes the message tank.agentops.v1.PublishTemplateRequest.
 * Use `create(PublishTemplateRequestSchema)` to create a new message.
 */
export declare const PublishTemplateRequestSchema: GenMessage<PublishTemplateRequest>;
/**
 * @generated from message tank.agentops.v1.PublishTemplateResponse
 */
export type PublishTemplateResponse = Message<"tank.agentops.v1.PublishTemplateResponse"> & {
    /**
     * @generated from field: tank.agentops.v1.Template template = 1;
     */
    template?: Template;
};
/**
 * Describes the message tank.agentops.v1.PublishTemplateResponse.
 * Use `create(PublishTemplateResponseSchema)` to create a new message.
 */
export declare const PublishTemplateResponseSchema: GenMessage<PublishTemplateResponse>;
/**
 * A claim: one run holds one thing for its duration. A second run wanting it waits
 * or is told who has it.
 *
 * @generated from message tank.agentops.v1.Claim
 */
export type Claim = Message<"tank.agentops.v1.Claim"> & {
    /**
     * path | table | route | tread
     *
     * @generated from field: string kind = 1;
     */
    kind: string;
    /**
     * @generated from field: string key = 2;
     */
    key: string;
    /**
     * @generated from field: string run_id = 3;
     */
    runId: string;
    /**
     * the member holding it
     *
     * @generated from field: string title = 4;
     */
    title: string;
    /**
     * what for
     *
     * @generated from field: string ask = 5;
     */
    ask: string;
    /**
     * @generated from field: google.protobuf.Timestamp since = 6;
     */
    since?: Timestamp;
};
/**
 * Describes the message tank.agentops.v1.Claim.
 * Use `create(ClaimSchema)` to create a new message.
 */
export declare const ClaimSchema: GenMessage<Claim>;
/**
 * How the team is doing, over the last thirty days and right now.
 *
 * @generated from message tank.agentops.v1.TeamSlo
 */
export type TeamSlo = Message<"tank.agentops.v1.TeamSlo"> & {
    /**
     * from a run's start to its first message in the thread
     *
     * @generated from field: double first_result_minutes_p50 = 1;
     */
    firstResultMinutesP50: number;
    /**
     * @generated from field: double run_minutes_p95 = 2;
     */
    runMinutesP95: number;
    /**
     * @generated from field: int32 finished_30d = 3;
     */
    finished30d: number;
    /**
     * @generated from field: int32 failed_30d = 4;
     */
    failed30d: number;
    /**
     * running with no sign of life for ten minutes
     *
     * @generated from field: int32 stalled_now = 5;
     */
    stalledNow: number;
    /**
     * hand-offs accepted over hand-offs judged
     *
     * @generated from field: double accepted_rate_30d = 6;
     */
    acceptedRate30d: number;
    /**
     * Near the daily cap (80%): the coordinator is told to finish, not start.
     *
     * @generated from field: bool near_cap = 7;
     */
    nearCap: boolean;
};
/**
 * Describes the message tank.agentops.v1.TeamSlo.
 * Use `create(TeamSloSchema)` to create a new message.
 */
export declare const TeamSloSchema: GenMessage<TeamSlo>;
/**
 * Drain (paused = true): nothing new starts, what runs finishes. Resume with false.
 *
 * @generated from message tank.agentops.v1.SetTeamPauseRequest
 */
export type SetTeamPauseRequest = Message<"tank.agentops.v1.SetTeamPauseRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string team_id = 2;
     */
    teamId: string;
    /**
     * @generated from field: bool paused = 3;
     */
    paused: boolean;
};
/**
 * Describes the message tank.agentops.v1.SetTeamPauseRequest.
 * Use `create(SetTeamPauseRequestSchema)` to create a new message.
 */
export declare const SetTeamPauseRequestSchema: GenMessage<SetTeamPauseRequest>;
/**
 * @generated from message tank.agentops.v1.SetTeamPauseResponse
 */
export type SetTeamPauseResponse = Message<"tank.agentops.v1.SetTeamPauseResponse"> & {
    /**
     * @generated from field: tank.agentops.v1.Team team = 1;
     */
    team?: Team;
};
/**
 * Describes the message tank.agentops.v1.SetTeamPauseResponse.
 * Use `create(SetTeamPauseResponseSchema)` to create a new message.
 */
export declare const SetTeamPauseResponseSchema: GenMessage<SetTeamPauseResponse>;
/**
 * Stop everything the team is doing now, hand-offs included, and drain.
 *
 * @generated from message tank.agentops.v1.StopTeamRequest
 */
export type StopTeamRequest = Message<"tank.agentops.v1.StopTeamRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string team_id = 2;
     */
    teamId: string;
    /**
     * @generated from field: string reason = 3;
     */
    reason: string;
};
/**
 * Describes the message tank.agentops.v1.StopTeamRequest.
 * Use `create(StopTeamRequestSchema)` to create a new message.
 */
export declare const StopTeamRequestSchema: GenMessage<StopTeamRequest>;
/**
 * @generated from message tank.agentops.v1.StopTeamResponse
 */
export type StopTeamResponse = Message<"tank.agentops.v1.StopTeamResponse"> & {
    /**
     * @generated from field: tank.agentops.v1.Team team = 1;
     */
    team?: Team;
    /**
     * runs cancelled
     *
     * @generated from field: int32 stopped = 2;
     */
    stopped: number;
};
/**
 * Describes the message tank.agentops.v1.StopTeamResponse.
 * Use `create(StopTeamResponseSchema)` to create a new message.
 */
export declare const StopTeamResponseSchema: GenMessage<StopTeamResponse>;
/**
 * A roster ready to start from; the members are a starting point, editable.
 *
 * @generated from message tank.agentops.v1.Template
 */
export type Template = Message<"tank.agentops.v1.Template"> & {
    /**
     * @generated from field: string key = 1;
     */
    key: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * one line for the picker
     *
     * @generated from field: string summary = 3;
     */
    summary: string;
    /**
     * name, handle, purpose, members, envelope filled; no ids
     *
     * @generated from field: tank.agentops.v1.Team team = 4;
     */
    team?: Team;
    /**
     * Who shared it: "" for one TANK ships, the workspace's name for its own, or the
     * sharing workspace's name for one shared with everyone.
     *
     * @generated from field: string shared_by = 5;
     */
    sharedBy: string;
    /**
     * this workspace published it (so it can be withdrawn)
     *
     * @generated from field: bool mine = 6;
     */
    mine: boolean;
};
/**
 * Describes the message tank.agentops.v1.Template.
 * Use `create(TemplateSchema)` to create a new message.
 */
export declare const TemplateSchema: GenMessage<Template>;
/**
 * @generated from message tank.agentops.v1.ListTeamsRequest
 */
export type ListTeamsRequest = Message<"tank.agentops.v1.ListTeamsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * only teams attached to this Tread; empty = every team
     *
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
};
/**
 * Describes the message tank.agentops.v1.ListTeamsRequest.
 * Use `create(ListTeamsRequestSchema)` to create a new message.
 */
export declare const ListTeamsRequestSchema: GenMessage<ListTeamsRequest>;
/**
 * @generated from message tank.agentops.v1.ListTeamsResponse
 */
export type ListTeamsResponse = Message<"tank.agentops.v1.ListTeamsResponse"> & {
    /**
     * @generated from field: repeated tank.agentops.v1.Team teams = 1;
     */
    teams: Team[];
    /**
     * @generated from field: repeated tank.agentops.v1.Template templates = 2;
     */
    templates: Template[];
    /**
     * @generated from field: bool can_manage = 3;
     */
    canManage: boolean;
};
/**
 * Describes the message tank.agentops.v1.ListTeamsResponse.
 * Use `create(ListTeamsResponseSchema)` to create a new message.
 */
export declare const ListTeamsResponseSchema: GenMessage<ListTeamsResponse>;
/**
 * @generated from message tank.agentops.v1.GetTeamRequest
 */
export type GetTeamRequest = Message<"tank.agentops.v1.GetTeamRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string team_id = 2;
     */
    teamId: string;
};
/**
 * Describes the message tank.agentops.v1.GetTeamRequest.
 * Use `create(GetTeamRequestSchema)` to create a new message.
 */
export declare const GetTeamRequestSchema: GenMessage<GetTeamRequest>;
/**
 * @generated from message tank.agentops.v1.GetTeamResponse
 */
export type GetTeamResponse = Message<"tank.agentops.v1.GetTeamResponse"> & {
    /**
     * @generated from field: tank.agentops.v1.Team team = 1;
     */
    team?: Team;
};
/**
 * Describes the message tank.agentops.v1.GetTeamResponse.
 * Use `create(GetTeamResponseSchema)` to create a new message.
 */
export declare const GetTeamResponseSchema: GenMessage<GetTeamResponse>;
/**
 * Makes a team and provisions an agent principal per member. A template key brings
 * its roster; members given here replace the template's. channel_id attaches it to
 * that Tread at once.
 *
 * @generated from message tank.agentops.v1.CreateTeamRequest
 */
export type CreateTeamRequest = Message<"tank.agentops.v1.CreateTeamRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string handle = 3;
     */
    handle: string;
    /**
     * @generated from field: string purpose = 4;
     */
    purpose: string;
    /**
     * @generated from field: string template_key = 5;
     */
    templateKey: string;
    /**
     * @generated from field: repeated tank.agentops.v1.Member members = 6;
     */
    members: Member[];
    /**
     * @generated from field: string channel_id = 7;
     */
    channelId: string;
};
/**
 * Describes the message tank.agentops.v1.CreateTeamRequest.
 * Use `create(CreateTeamRequestSchema)` to create a new message.
 */
export declare const CreateTeamRequestSchema: GenMessage<CreateTeamRequest>;
/**
 * @generated from message tank.agentops.v1.CreateTeamResponse
 */
export type CreateTeamResponse = Message<"tank.agentops.v1.CreateTeamResponse"> & {
    /**
     * @generated from field: tank.agentops.v1.Team team = 1;
     */
    team?: Team;
};
/**
 * Describes the message tank.agentops.v1.CreateTeamResponse.
 * Use `create(CreateTeamResponseSchema)` to create a new message.
 */
export declare const CreateTeamResponseSchema: GenMessage<CreateTeamResponse>;
/**
 * Replaces the team's name, handle, purpose, caps, envelope and roster. A member
 * without an id is added (its principal provisioned); a member missing from the
 * list is removed (its runs stop being started; what it said stays).
 *
 * @generated from message tank.agentops.v1.UpdateTeamRequest
 */
export type UpdateTeamRequest = Message<"tank.agentops.v1.UpdateTeamRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: tank.agentops.v1.Team team = 2;
     */
    team?: Team;
};
/**
 * Describes the message tank.agentops.v1.UpdateTeamRequest.
 * Use `create(UpdateTeamRequestSchema)` to create a new message.
 */
export declare const UpdateTeamRequestSchema: GenMessage<UpdateTeamRequest>;
/**
 * @generated from message tank.agentops.v1.UpdateTeamResponse
 */
export type UpdateTeamResponse = Message<"tank.agentops.v1.UpdateTeamResponse"> & {
    /**
     * @generated from field: tank.agentops.v1.Team team = 1;
     */
    team?: Team;
};
/**
 * Describes the message tank.agentops.v1.UpdateTeamResponse.
 * Use `create(UpdateTeamResponseSchema)` to create a new message.
 */
export declare const UpdateTeamResponseSchema: GenMessage<UpdateTeamResponse>;
/**
 * @generated from message tank.agentops.v1.DeleteTeamRequest
 */
export type DeleteTeamRequest = Message<"tank.agentops.v1.DeleteTeamRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string team_id = 2;
     */
    teamId: string;
};
/**
 * Describes the message tank.agentops.v1.DeleteTeamRequest.
 * Use `create(DeleteTeamRequestSchema)` to create a new message.
 */
export declare const DeleteTeamRequestSchema: GenMessage<DeleteTeamRequest>;
/**
 * @generated from message tank.agentops.v1.DeleteTeamResponse
 */
export type DeleteTeamResponse = Message<"tank.agentops.v1.DeleteTeamResponse"> & {};
/**
 * Describes the message tank.agentops.v1.DeleteTeamResponse.
 * Use `create(DeleteTeamResponseSchema)` to create a new message.
 */
export declare const DeleteTeamResponseSchema: GenMessage<DeleteTeamResponse>;
/**
 * Puts the team to work in a Tread: its members are seated there and its handle
 * resolves. A team may be in any number of Treads.
 *
 * @generated from message tank.agentops.v1.AttachTeamRequest
 */
export type AttachTeamRequest = Message<"tank.agentops.v1.AttachTeamRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string team_id = 2;
     */
    teamId: string;
    /**
     * @generated from field: string channel_id = 3;
     */
    channelId: string;
};
/**
 * Describes the message tank.agentops.v1.AttachTeamRequest.
 * Use `create(AttachTeamRequestSchema)` to create a new message.
 */
export declare const AttachTeamRequestSchema: GenMessage<AttachTeamRequest>;
/**
 * @generated from message tank.agentops.v1.AttachTeamResponse
 */
export type AttachTeamResponse = Message<"tank.agentops.v1.AttachTeamResponse"> & {
    /**
     * @generated from field: tank.agentops.v1.Team team = 1;
     */
    team?: Team;
};
/**
 * Describes the message tank.agentops.v1.AttachTeamResponse.
 * Use `create(AttachTeamResponseSchema)` to create a new message.
 */
export declare const AttachTeamResponseSchema: GenMessage<AttachTeamResponse>;
/**
 * @generated from message tank.agentops.v1.DetachTeamRequest
 */
export type DetachTeamRequest = Message<"tank.agentops.v1.DetachTeamRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string team_id = 2;
     */
    teamId: string;
    /**
     * @generated from field: string channel_id = 3;
     */
    channelId: string;
};
/**
 * Describes the message tank.agentops.v1.DetachTeamRequest.
 * Use `create(DetachTeamRequestSchema)` to create a new message.
 */
export declare const DetachTeamRequestSchema: GenMessage<DetachTeamRequest>;
/**
 * @generated from message tank.agentops.v1.DetachTeamResponse
 */
export type DetachTeamResponse = Message<"tank.agentops.v1.DetachTeamResponse"> & {
    /**
     * @generated from field: tank.agentops.v1.Team team = 1;
     */
    team?: Team;
};
/**
 * Describes the message tank.agentops.v1.DetachTeamResponse.
 * Use `create(DetachTeamResponseSchema)` to create a new message.
 */
export declare const DetachTeamResponseSchema: GenMessage<DetachTeamResponse>;
/**
 * The team as a file (team.yaml), portable between workspaces.
 *
 * @generated from message tank.agentops.v1.ExportTeamRequest
 */
export type ExportTeamRequest = Message<"tank.agentops.v1.ExportTeamRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string team_id = 2;
     */
    teamId: string;
};
/**
 * Describes the message tank.agentops.v1.ExportTeamRequest.
 * Use `create(ExportTeamRequestSchema)` to create a new message.
 */
export declare const ExportTeamRequestSchema: GenMessage<ExportTeamRequest>;
/**
 * @generated from message tank.agentops.v1.ExportTeamResponse
 */
export type ExportTeamResponse = Message<"tank.agentops.v1.ExportTeamResponse"> & {
    /**
     * @generated from field: string yaml = 1;
     */
    yaml: string;
};
/**
 * Describes the message tank.agentops.v1.ExportTeamResponse.
 * Use `create(ExportTeamResponseSchema)` to create a new message.
 */
export declare const ExportTeamResponseSchema: GenMessage<ExportTeamResponse>;
/**
 * @generated from message tank.agentops.v1.ImportTeamRequest
 */
export type ImportTeamRequest = Message<"tank.agentops.v1.ImportTeamRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string yaml = 2;
     */
    yaml: string;
    /**
     * attach at once, optional
     *
     * @generated from field: string channel_id = 3;
     */
    channelId: string;
};
/**
 * Describes the message tank.agentops.v1.ImportTeamRequest.
 * Use `create(ImportTeamRequestSchema)` to create a new message.
 */
export declare const ImportTeamRequestSchema: GenMessage<ImportTeamRequest>;
/**
 * @generated from message tank.agentops.v1.ImportTeamResponse
 */
export type ImportTeamResponse = Message<"tank.agentops.v1.ImportTeamResponse"> & {
    /**
     * @generated from field: tank.agentops.v1.Team team = 1;
     */
    team?: Team;
};
/**
 * Describes the message tank.agentops.v1.ImportTeamResponse.
 * Use `create(ImportTeamResponseSchema)` to create a new message.
 */
export declare const ImportTeamResponseSchema: GenMessage<ImportTeamResponse>;
/**
 * Where a member sits in the team.
 *
 * @generated from enum tank.agentops.v1.Seat
 */
export declare enum Seat {
    /**
     * @generated from enum value: SEAT_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * receives the team's asks; decides what to hand to whom
     *
     * @generated from enum value: SEAT_COORDINATOR = 1;
     */
    COORDINATOR = 1,
    /**
     * does bounded work and reports back
     *
     * @generated from enum value: SEAT_SPECIALIST = 2;
     */
    SPECIALIST = 2,
    /**
     * a person on the team: a hand-off to them is a question with a deadline
     *
     * @generated from enum value: SEAT_PERSON = 3;
     */
    PERSON = 3
}
/**
 * Describes the enum tank.agentops.v1.Seat.
 */
export declare const SeatSchema: GenEnum<Seat>;
/**
 * @generated from service tank.agentops.v1.OpsService
 */
export declare const OpsService: GenService<{
    /**
     * @generated from rpc tank.agentops.v1.OpsService.ListTeams
     */
    listTeams: {
        methodKind: "unary";
        input: typeof ListTeamsRequestSchema;
        output: typeof ListTeamsResponseSchema;
    };
    /**
     * @generated from rpc tank.agentops.v1.OpsService.GetTeam
     */
    getTeam: {
        methodKind: "unary";
        input: typeof GetTeamRequestSchema;
        output: typeof GetTeamResponseSchema;
    };
    /**
     * @generated from rpc tank.agentops.v1.OpsService.CreateTeam
     */
    createTeam: {
        methodKind: "unary";
        input: typeof CreateTeamRequestSchema;
        output: typeof CreateTeamResponseSchema;
    };
    /**
     * @generated from rpc tank.agentops.v1.OpsService.UpdateTeam
     */
    updateTeam: {
        methodKind: "unary";
        input: typeof UpdateTeamRequestSchema;
        output: typeof UpdateTeamResponseSchema;
    };
    /**
     * @generated from rpc tank.agentops.v1.OpsService.DeleteTeam
     */
    deleteTeam: {
        methodKind: "unary";
        input: typeof DeleteTeamRequestSchema;
        output: typeof DeleteTeamResponseSchema;
    };
    /**
     * @generated from rpc tank.agentops.v1.OpsService.AttachTeam
     */
    attachTeam: {
        methodKind: "unary";
        input: typeof AttachTeamRequestSchema;
        output: typeof AttachTeamResponseSchema;
    };
    /**
     * @generated from rpc tank.agentops.v1.OpsService.DetachTeam
     */
    detachTeam: {
        methodKind: "unary";
        input: typeof DetachTeamRequestSchema;
        output: typeof DetachTeamResponseSchema;
    };
    /**
     * @generated from rpc tank.agentops.v1.OpsService.ExportTeam
     */
    exportTeam: {
        methodKind: "unary";
        input: typeof ExportTeamRequestSchema;
        output: typeof ExportTeamResponseSchema;
    };
    /**
     * @generated from rpc tank.agentops.v1.OpsService.ImportTeam
     */
    importTeam: {
        methodKind: "unary";
        input: typeof ImportTeamRequestSchema;
        output: typeof ImportTeamResponseSchema;
    };
    /**
     * @generated from rpc tank.agentops.v1.OpsService.SetTeamPause
     */
    setTeamPause: {
        methodKind: "unary";
        input: typeof SetTeamPauseRequestSchema;
        output: typeof SetTeamPauseResponseSchema;
    };
    /**
     * @generated from rpc tank.agentops.v1.OpsService.StopTeam
     */
    stopTeam: {
        methodKind: "unary";
        input: typeof StopTeamRequestSchema;
        output: typeof StopTeamResponseSchema;
    };
    /**
     * @generated from rpc tank.agentops.v1.OpsService.SetTeamShift
     */
    setTeamShift: {
        methodKind: "unary";
        input: typeof SetTeamShiftRequestSchema;
        output: typeof SetTeamShiftResponseSchema;
    };
    /**
     * @generated from rpc tank.agentops.v1.OpsService.GetTeamReplay
     */
    getTeamReplay: {
        methodKind: "unary";
        input: typeof GetTeamReplayRequestSchema;
        output: typeof GetTeamReplayResponseSchema;
    };
    /**
     * @generated from rpc tank.agentops.v1.OpsService.PublishTemplate
     */
    publishTemplate: {
        methodKind: "unary";
        input: typeof PublishTemplateRequestSchema;
        output: typeof PublishTemplateResponseSchema;
    };
}>;
