import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Run } from "../../agent/v1/agent_pb.js";
import type { Blocks, Check, GateKind, PlanStep } from "../../blocks/v1/blocks_pb.js";
import type { JsonObject, Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/agentctl/v1/agentctl.proto.
 */
export declare const file_tank_agentctl_v1_agentctl: GenFile;
/**
 * @generated from message tank.agentctl.v1.ThreadMessage
 */
export type ThreadMessage = Message<"tank.agentctl.v1.ThreadMessage"> & {
    /**
     * @generated from field: string message_id = 1;
     */
    messageId: string;
    /**
     * @generated from field: string author_id = 2;
     */
    authorId: string;
    /**
     * @generated from field: string author_name = 3;
     */
    authorName: string;
    /**
     * user | bot | agent
     *
     * @generated from field: string author_kind = 4;
     */
    authorKind: string;
    /**
     * @generated from field: string text = 5;
     */
    text: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 6;
     */
    createdAt?: Timestamp;
};
/**
 * Describes the message tank.agentctl.v1.ThreadMessage.
 * Use `create(ThreadMessageSchema)` to create a new message.
 */
export declare const ThreadMessageSchema: GenMessage<ThreadMessage>;
/**
 * The subset of policy.v1 the runner enforces locally (deny lists, models,
 * limits). The control plane remains authoritative; this is a mirror.
 *
 * @generated from message tank.agentctl.v1.PolicySummary
 */
export type PolicySummary = Message<"tank.agentctl.v1.PolicySummary"> & {
    /**
     * propose_only | can_merge
     *
     * @generated from field: string mode = 1;
     */
    mode: string;
    /**
     * @generated from field: repeated string tools_deny = 2;
     */
    toolsDeny: string[];
    /**
     * @generated from field: repeated string network_allowed_hosts = 3;
     */
    networkAllowedHosts: string[];
    /**
     * @generated from field: string default_model = 4;
     */
    defaultModel: string;
    /**
     * @generated from field: string subagent_model = 5;
     */
    subagentModel: string;
    /**
     * @generated from field: int32 max_turns = 6;
     */
    maxTurns: number;
    /**
     * @generated from field: double max_budget_usd = 7;
     */
    maxBudgetUsd: number;
    /**
     * advisory rules surfaced to the model
     *
     * @generated from field: repeated string rules = 8;
     */
    rules: string[];
};
/**
 * Describes the message tank.agentctl.v1.PolicySummary.
 * Use `create(PolicySummarySchema)` to create a new message.
 */
export declare const PolicySummarySchema: GenMessage<PolicySummary>;
/**
 * @generated from message tank.agentctl.v1.ApprovedPlan
 */
export type ApprovedPlan = Message<"tank.agentctl.v1.ApprovedPlan"> & {
    /**
     * @generated from field: string plan_hash = 1;
     */
    planHash: string;
    /**
     * @generated from field: string summary = 2;
     */
    summary: string;
    /**
     * @generated from field: repeated tank.blocks.v1.PlanStep steps = 3;
     */
    steps: PlanStep[];
    /**
     * @generated from field: repeated string risks = 4;
     */
    risks: string[];
    /**
     * @generated from field: string approved_by = 5;
     */
    approvedBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp approved_at = 6;
     */
    approvedAt?: Timestamp;
    /**
     * approver comments carried into implementation
     *
     * @generated from field: string feedback = 7;
     */
    feedback: string;
};
/**
 * Describes the message tank.agentctl.v1.ApprovedPlan.
 * Use `create(ApprovedPlanSchema)` to create a new message.
 */
export declare const ApprovedPlanSchema: GenMessage<ApprovedPlan>;
/**
 * @generated from message tank.agentctl.v1.RunContext
 */
export type RunContext = Message<"tank.agentctl.v1.RunContext"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
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
     * @generated from field: string agent_name = 6;
     */
    agentName: string;
    /**
     * @generated from field: string requested_by = 7;
     */
    requestedBy: string;
    /**
     * @generated from field: tank.agentctl.v1.RunPhase phase = 8;
     */
    phase: RunPhase;
    /**
     * the user's ask, e.g. "fix the typo in README"
     *
     * @generated from field: string instructions = 9;
     */
    instructions: string;
    /**
     * @generated from field: repeated tank.agentctl.v1.ThreadMessage thread_excerpt = 10;
     */
    threadExcerpt: ThreadMessage[];
    /**
     * owner/name, or a file:// / https:// URL for local dev
     *
     * @generated from field: string repo = 11;
     */
    repo: string;
    /**
     * @generated from field: string base_branch = 12;
     */
    baseBranch: string;
    /**
     * agent/<channel>/<run>-<slug>
     *
     * @generated from field: string branch = 13;
     */
    branch: string;
    /**
     * @generated from field: string toolchain = 14;
     */
    toolchain: string;
    /**
     * @generated from field: tank.agentctl.v1.PolicySummary policy = 15;
     */
    policy?: PolicySummary;
    /**
     * TANK.md for the channel/workspace
     *
     * @generated from field: string operating_rules = 16;
     */
    operatingRules: string;
    /**
     * set when resuming after plan approval
     *
     * @generated from field: tank.agentctl.v1.ApprovedPlan approved_plan = 17;
     */
    approvedPlan?: ApprovedPlan;
    /**
     * set when resuming an SDK session
     *
     * @generated from field: string sdk_session_id = 18;
     */
    sdkSessionId: string;
    /**
     * deterministic cwd so projectKey matches across pods
     *
     * @generated from field: string workspace_dir = 19;
     */
    workspaceDir: string;
    /**
     * clone URL; credentials come from GetGitCredential
     *
     * @generated from field: string git_remote_url = 20;
     */
    gitRemoteUrl: string;
};
/**
 * Describes the message tank.agentctl.v1.RunContext.
 * Use `create(RunContextSchema)` to create a new message.
 */
export declare const RunContextSchema: GenMessage<RunContext>;
/**
 * @generated from message tank.agentctl.v1.GetRunContextRequest
 */
export type GetRunContextRequest = Message<"tank.agentctl.v1.GetRunContextRequest"> & {};
/**
 * Describes the message tank.agentctl.v1.GetRunContextRequest.
 * Use `create(GetRunContextRequestSchema)` to create a new message.
 */
export declare const GetRunContextRequestSchema: GenMessage<GetRunContextRequest>;
/**
 * @generated from message tank.agentctl.v1.GetRunContextResponse
 */
export type GetRunContextResponse = Message<"tank.agentctl.v1.GetRunContextResponse"> & {
    /**
     * @generated from field: tank.agentctl.v1.RunContext context = 1;
     */
    context?: RunContext;
};
/**
 * Describes the message tank.agentctl.v1.GetRunContextResponse.
 * Use `create(GetRunContextResponseSchema)` to create a new message.
 */
export declare const GetRunContextResponseSchema: GenMessage<GetRunContextResponse>;
/**
 * @generated from message tank.agentctl.v1.GetGitCredentialRequest
 */
export type GetGitCredentialRequest = Message<"tank.agentctl.v1.GetGitCredentialRequest"> & {
    /**
     * read | write
     *
     * @generated from field: string scope = 1;
     */
    scope: string;
};
/**
 * Describes the message tank.agentctl.v1.GetGitCredentialRequest.
 * Use `create(GetGitCredentialRequestSchema)` to create a new message.
 */
export declare const GetGitCredentialRequestSchema: GenMessage<GetGitCredentialRequest>;
/**
 * @generated from message tank.agentctl.v1.GetGitCredentialResponse
 */
export type GetGitCredentialResponse = Message<"tank.agentctl.v1.GetGitCredentialResponse"> & {
    /**
     * x-access-token for GitHub
     *
     * @generated from field: string username = 1;
     */
    username: string;
    /**
     * @generated from field: string password = 2;
     */
    password: string;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 3;
     */
    expiresAt?: Timestamp;
    /**
     * remote to use with these credentials
     *
     * @generated from field: string remote_url = 4;
     */
    remoteUrl: string;
};
/**
 * Describes the message tank.agentctl.v1.GetGitCredentialResponse.
 * Use `create(GetGitCredentialResponseSchema)` to create a new message.
 */
export declare const GetGitCredentialResponseSchema: GenMessage<GetGitCredentialResponse>;
/**
 * @generated from message tank.agentctl.v1.PostToThreadRequest
 */
export type PostToThreadRequest = Message<"tank.agentctl.v1.PostToThreadRequest"> & {
    /**
     * @generated from field: string text = 1;
     */
    text: string;
    /**
     * idempotency key
     *
     * @generated from field: string client_msg_id = 2;
     */
    clientMsgId: string;
};
/**
 * Describes the message tank.agentctl.v1.PostToThreadRequest.
 * Use `create(PostToThreadRequestSchema)` to create a new message.
 */
export declare const PostToThreadRequestSchema: GenMessage<PostToThreadRequest>;
/**
 * @generated from message tank.agentctl.v1.PostToThreadResponse
 */
export type PostToThreadResponse = Message<"tank.agentctl.v1.PostToThreadResponse"> & {
    /**
     * @generated from field: string message_id = 1;
     */
    messageId: string;
};
/**
 * Describes the message tank.agentctl.v1.PostToThreadResponse.
 * Use `create(PostToThreadResponseSchema)` to create a new message.
 */
export declare const PostToThreadResponseSchema: GenMessage<PostToThreadResponse>;
/**
 * @generated from message tank.agentctl.v1.PostPlanRequest
 */
export type PostPlanRequest = Message<"tank.agentctl.v1.PostPlanRequest"> & {
    /**
     * @generated from field: string summary = 1;
     */
    summary: string;
    /**
     * @generated from field: repeated tank.blocks.v1.PlanStep steps = 2;
     */
    steps: PlanStep[];
    /**
     * @generated from field: repeated string risks = 3;
     */
    risks: string[];
    /**
     * @generated from field: repeated string questions = 4;
     */
    questions: string[];
    /**
     * Artifacts from AttachArtifact, rendered above the approve buttons so a
     * human can see what the agent is proposing to change before approving it:
     * the page as it looks now, the slide being rewritten, the source image.
     *
     * @generated from field: repeated string preview_file_ids = 5;
     */
    previewFileIds: string[];
};
/**
 * Describes the message tank.agentctl.v1.PostPlanRequest.
 * Use `create(PostPlanRequestSchema)` to create a new message.
 */
export declare const PostPlanRequestSchema: GenMessage<PostPlanRequest>;
/**
 * @generated from message tank.agentctl.v1.PostPlanResponse
 */
export type PostPlanResponse = Message<"tank.agentctl.v1.PostPlanResponse"> & {
    /**
     * run_cards.id
     *
     * @generated from field: string card_id = 1;
     */
    cardId: string;
    /**
     * run_gates.id (plan gate)
     *
     * @generated from field: string gate_id = 2;
     */
    gateId: string;
    /**
     * @generated from field: string plan_hash = 3;
     */
    planHash: string;
};
/**
 * Describes the message tank.agentctl.v1.PostPlanResponse.
 * Use `create(PostPlanResponseSchema)` to create a new message.
 */
export declare const PostPlanResponseSchema: GenMessage<PostPlanResponse>;
/**
 * AttachArtifact publishes one file the sandbox produced (a screenshot, a
 * rendered slide, an exported image) into the run's channel, and returns the
 * file id to put on a card. The sandbox has no storage credentials and no
 * egress to S3: the bytes go through the control plane, which uploads them as
 * the agent principal. Capped at max_artifact_bytes; anything larger belongs
 * in the repo, not in a card.
 *
 * @generated from message tank.agentctl.v1.AttachArtifactRequest
 */
export type AttachArtifactRequest = Message<"tank.agentctl.v1.AttachArtifactRequest"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string mime = 2;
     */
    mime: string;
    /**
     * @generated from field: bytes content = 3;
     */
    content: Uint8Array;
    /**
     * Shown under the preview. Say what the reader is looking at.
     *
     * @generated from field: string caption = 4;
     */
    caption: string;
};
/**
 * Describes the message tank.agentctl.v1.AttachArtifactRequest.
 * Use `create(AttachArtifactRequestSchema)` to create a new message.
 */
export declare const AttachArtifactRequestSchema: GenMessage<AttachArtifactRequest>;
/**
 * @generated from message tank.agentctl.v1.AttachArtifactResponse
 */
export type AttachArtifactResponse = Message<"tank.agentctl.v1.AttachArtifactResponse"> & {
    /**
     * @generated from field: string file_id = 1;
     */
    fileId: string;
};
/**
 * Describes the message tank.agentctl.v1.AttachArtifactResponse.
 * Use `create(AttachArtifactResponseSchema)` to create a new message.
 */
export declare const AttachArtifactResponseSchema: GenMessage<AttachArtifactResponse>;
/**
 * @generated from message tank.agentctl.v1.UpdateCardRequest
 */
export type UpdateCardRequest = Message<"tank.agentctl.v1.UpdateCardRequest"> & {
    /**
     * @generated from field: string card_id = 1;
     */
    cardId: string;
    /**
     * @generated from field: tank.blocks.v1.Blocks blocks = 2;
     */
    blocks?: Blocks;
    /**
     * plain-text fallback
     *
     * @generated from field: string text = 3;
     */
    text: string;
};
/**
 * Describes the message tank.agentctl.v1.UpdateCardRequest.
 * Use `create(UpdateCardRequestSchema)` to create a new message.
 */
export declare const UpdateCardRequestSchema: GenMessage<UpdateCardRequest>;
/**
 * @generated from message tank.agentctl.v1.UpdateCardResponse
 */
export type UpdateCardResponse = Message<"tank.agentctl.v1.UpdateCardResponse"> & {};
/**
 * Describes the message tank.agentctl.v1.UpdateCardResponse.
 * Use `create(UpdateCardResponseSchema)` to create a new message.
 */
export declare const UpdateCardResponseSchema: GenMessage<UpdateCardResponse>;
/**
 * @generated from message tank.agentctl.v1.AskForApprovalRequest
 */
export type AskForApprovalRequest = Message<"tank.agentctl.v1.AskForApprovalRequest"> & {
    /**
     * @generated from field: tank.blocks.v1.GateKind kind = 1;
     */
    kind: GateKind;
    /**
     * what is being approved (scope change description, command, ...)
     *
     * @generated from field: string subject = 2;
     */
    subject: string;
    /**
     * @generated from field: string reason = 3;
     */
    reason: string;
};
/**
 * Describes the message tank.agentctl.v1.AskForApprovalRequest.
 * Use `create(AskForApprovalRequestSchema)` to create a new message.
 */
export declare const AskForApprovalRequestSchema: GenMessage<AskForApprovalRequest>;
/**
 * @generated from message tank.agentctl.v1.AskForApprovalResponse
 */
export type AskForApprovalResponse = Message<"tank.agentctl.v1.AskForApprovalResponse"> & {
    /**
     * @generated from field: string gate_id = 1;
     */
    gateId: string;
    /**
     * approved | rejected | expired (empty when async)
     *
     * @generated from field: string decision = 2;
     */
    decision: string;
    /**
     * @generated from field: string feedback = 3;
     */
    feedback: string;
};
/**
 * Describes the message tank.agentctl.v1.AskForApprovalResponse.
 * Use `create(AskForApprovalResponseSchema)` to create a new message.
 */
export declare const AskForApprovalResponseSchema: GenMessage<AskForApprovalResponse>;
/**
 * @generated from message tank.agentctl.v1.AskQuestionRequest
 */
export type AskQuestionRequest = Message<"tank.agentctl.v1.AskQuestionRequest"> & {
    /**
     * @generated from field: string question = 1;
     */
    question: string;
    /**
     * @generated from field: repeated string options = 2;
     */
    options: string[];
    /**
     * @generated from field: bool multi_select = 3;
     */
    multiSelect: boolean;
};
/**
 * Describes the message tank.agentctl.v1.AskQuestionRequest.
 * Use `create(AskQuestionRequestSchema)` to create a new message.
 */
export declare const AskQuestionRequestSchema: GenMessage<AskQuestionRequest>;
/**
 * @generated from message tank.agentctl.v1.AskQuestionResponse
 */
export type AskQuestionResponse = Message<"tank.agentctl.v1.AskQuestionResponse"> & {
    /**
     * @generated from field: string card_id = 1;
     */
    cardId: string;
    /**
     * empty when async; the answer arrives as a steer message
     *
     * @generated from field: string answer = 2;
     */
    answer: string;
};
/**
 * Describes the message tank.agentctl.v1.AskQuestionResponse.
 * Use `create(AskQuestionResponseSchema)` to create a new message.
 */
export declare const AskQuestionResponseSchema: GenMessage<AskQuestionResponse>;
/**
 * @generated from message tank.agentctl.v1.ReportStatusRequest
 */
export type ReportStatusRequest = Message<"tank.agentctl.v1.ReportStatusRequest"> & {
    /**
     * "reading repo", "running tests"
     *
     * @generated from field: string status = 1;
     */
    status: string;
    /**
     * @generated from field: string detail = 2;
     */
    detail: string;
};
/**
 * Describes the message tank.agentctl.v1.ReportStatusRequest.
 * Use `create(ReportStatusRequestSchema)` to create a new message.
 */
export declare const ReportStatusRequestSchema: GenMessage<ReportStatusRequest>;
/**
 * @generated from message tank.agentctl.v1.ReportStatusResponse
 */
export type ReportStatusResponse = Message<"tank.agentctl.v1.ReportStatusResponse"> & {};
/**
 * Describes the message tank.agentctl.v1.ReportStatusResponse.
 * Use `create(ReportStatusResponseSchema)` to create a new message.
 */
export declare const ReportStatusResponseSchema: GenMessage<ReportStatusResponse>;
/**
 * @generated from message tank.agentctl.v1.ReadThreadRequest
 */
export type ReadThreadRequest = Message<"tank.agentctl.v1.ReadThreadRequest"> & {
    /**
     * @generated from field: int64 after_thread_seq = 1;
     */
    afterThreadSeq: bigint;
    /**
     * @generated from field: int32 limit = 2;
     */
    limit: number;
};
/**
 * Describes the message tank.agentctl.v1.ReadThreadRequest.
 * Use `create(ReadThreadRequestSchema)` to create a new message.
 */
export declare const ReadThreadRequestSchema: GenMessage<ReadThreadRequest>;
/**
 * @generated from message tank.agentctl.v1.ReadThreadResponse
 */
export type ReadThreadResponse = Message<"tank.agentctl.v1.ReadThreadResponse"> & {
    /**
     * @generated from field: repeated tank.agentctl.v1.ThreadMessage messages = 1;
     */
    messages: ThreadMessage[];
};
/**
 * Describes the message tank.agentctl.v1.ReadThreadResponse.
 * Use `create(ReadThreadResponseSchema)` to create a new message.
 */
export declare const ReadThreadResponseSchema: GenMessage<ReadThreadResponse>;
/**
 * @generated from message tank.agentctl.v1.OpenPullRequestRequest
 */
export type OpenPullRequestRequest = Message<"tank.agentctl.v1.OpenPullRequestRequest"> & {
    /**
     * @generated from field: string title = 1;
     */
    title: string;
    /**
     * @generated from field: string body = 2;
     */
    body: string;
    /**
     * @generated from field: string head_sha = 3;
     */
    headSha: string;
    /**
     * @generated from field: bool draft = 4;
     */
    draft: boolean;
};
/**
 * Describes the message tank.agentctl.v1.OpenPullRequestRequest.
 * Use `create(OpenPullRequestRequestSchema)` to create a new message.
 */
export declare const OpenPullRequestRequestSchema: GenMessage<OpenPullRequestRequest>;
/**
 * @generated from message tank.agentctl.v1.OpenPullRequestResponse
 */
export type OpenPullRequestResponse = Message<"tank.agentctl.v1.OpenPullRequestResponse"> & {
    /**
     * @generated from field: string pr_url = 1;
     */
    prUrl: string;
    /**
     * @generated from field: int32 pr_number = 2;
     */
    prNumber: number;
};
/**
 * Describes the message tank.agentctl.v1.OpenPullRequestResponse.
 * Use `create(OpenPullRequestResponseSchema)` to create a new message.
 */
export declare const OpenPullRequestResponseSchema: GenMessage<OpenPullRequestResponse>;
/**
 * @generated from message tank.agentctl.v1.RequestCiWatchRequest
 */
export type RequestCiWatchRequest = Message<"tank.agentctl.v1.RequestCiWatchRequest"> & {
    /**
     * @generated from field: string head_sha = 1;
     */
    headSha: string;
    /**
     * empty = binding's watched workflows
     *
     * @generated from field: repeated string workflows = 2;
     */
    workflows: string[];
};
/**
 * Describes the message tank.agentctl.v1.RequestCiWatchRequest.
 * Use `create(RequestCiWatchRequestSchema)` to create a new message.
 */
export declare const RequestCiWatchRequestSchema: GenMessage<RequestCiWatchRequest>;
/**
 * @generated from message tank.agentctl.v1.RequestCiWatchResponse
 */
export type RequestCiWatchResponse = Message<"tank.agentctl.v1.RequestCiWatchResponse"> & {
    /**
     * @generated from field: string watch_id = 1;
     */
    watchId: string;
};
/**
 * Describes the message tank.agentctl.v1.RequestCiWatchResponse.
 * Use `create(RequestCiWatchResponseSchema)` to create a new message.
 */
export declare const RequestCiWatchResponseSchema: GenMessage<RequestCiWatchResponse>;
/**
 * @generated from message tank.agentctl.v1.GetCiFailureRequest
 */
export type GetCiFailureRequest = Message<"tank.agentctl.v1.GetCiFailureRequest"> & {
    /**
     * @generated from field: string head_sha = 1;
     */
    headSha: string;
};
/**
 * Describes the message tank.agentctl.v1.GetCiFailureRequest.
 * Use `create(GetCiFailureRequestSchema)` to create a new message.
 */
export declare const GetCiFailureRequestSchema: GenMessage<GetCiFailureRequest>;
/**
 * @generated from message tank.agentctl.v1.GetCiFailureResponse
 */
export type GetCiFailureResponse = Message<"tank.agentctl.v1.GetCiFailureResponse"> & {
    /**
     * all watched workflows finished
     *
     * @generated from field: bool complete = 1;
     */
    complete: boolean;
    /**
     * @generated from field: bool green = 2;
     */
    green: boolean;
    /**
     * @generated from field: repeated tank.blocks.v1.Check checks = 3;
     */
    checks: Check[];
    /**
     * @generated from field: string failed_log_excerpt = 4;
     */
    failedLogExcerpt: string;
};
/**
 * Describes the message tank.agentctl.v1.GetCiFailureResponse.
 * Use `create(GetCiFailureResponseSchema)` to create a new message.
 */
export declare const GetCiFailureResponseSchema: GenMessage<GetCiFailureResponse>;
/**
 * @generated from message tank.agentctl.v1.RecordDecisionRequest
 */
export type RecordDecisionRequest = Message<"tank.agentctl.v1.RecordDecisionRequest"> & {
    /**
     * @generated from field: string title = 1;
     */
    title: string;
    /**
     * @generated from field: string body = 2;
     */
    body: string;
    /**
     * @generated from field: repeated string tags = 3;
     */
    tags: string[];
};
/**
 * Describes the message tank.agentctl.v1.RecordDecisionRequest.
 * Use `create(RecordDecisionRequestSchema)` to create a new message.
 */
export declare const RecordDecisionRequestSchema: GenMessage<RecordDecisionRequest>;
/**
 * @generated from message tank.agentctl.v1.RecordDecisionResponse
 */
export type RecordDecisionResponse = Message<"tank.agentctl.v1.RecordDecisionResponse"> & {
    /**
     * @generated from field: string decision_id = 1;
     */
    decisionId: string;
};
/**
 * Describes the message tank.agentctl.v1.RecordDecisionResponse.
 * Use `create(RecordDecisionResponseSchema)` to create a new message.
 */
export declare const RecordDecisionResponseSchema: GenMessage<RecordDecisionResponse>;
/**
 * @generated from message tank.agentctl.v1.RememberRequest
 */
export type RememberRequest = Message<"tank.agentctl.v1.RememberRequest"> & {
    /**
     * @generated from field: string key = 1;
     */
    key: string;
    /**
     * @generated from field: string value = 2;
     */
    value: string;
};
/**
 * Describes the message tank.agentctl.v1.RememberRequest.
 * Use `create(RememberRequestSchema)` to create a new message.
 */
export declare const RememberRequestSchema: GenMessage<RememberRequest>;
/**
 * @generated from message tank.agentctl.v1.RememberResponse
 */
export type RememberResponse = Message<"tank.agentctl.v1.RememberResponse"> & {};
/**
 * Describes the message tank.agentctl.v1.RememberResponse.
 * Use `create(RememberResponseSchema)` to create a new message.
 */
export declare const RememberResponseSchema: GenMessage<RememberResponse>;
/**
 * @generated from message tank.agentctl.v1.Usage
 */
export type Usage = Message<"tank.agentctl.v1.Usage"> & {
    /**
     * @generated from field: int64 input_tokens = 1;
     */
    inputTokens: bigint;
    /**
     * @generated from field: int64 output_tokens = 2;
     */
    outputTokens: bigint;
    /**
     * @generated from field: int64 cache_read_input_tokens = 3;
     */
    cacheReadInputTokens: bigint;
    /**
     * @generated from field: int64 cache_creation_input_tokens = 4;
     */
    cacheCreationInputTokens: bigint;
    /**
     * @generated from field: double cost_usd = 5;
     */
    costUsd: number;
    /**
     * @generated from field: string model = 6;
     */
    model: string;
};
/**
 * Describes the message tank.agentctl.v1.Usage.
 * Use `create(UsageSchema)` to create a new message.
 */
export declare const UsageSchema: GenMessage<Usage>;
/**
 * @generated from message tank.agentctl.v1.RunEvent
 */
export type RunEvent = Message<"tank.agentctl.v1.RunEvent"> & {
    /**
     * runner-assigned, monotonic per run
     *
     * @generated from field: int64 seq = 1;
     */
    seq: bigint;
    /**
     * @generated from field: google.protobuf.Timestamp at = 2;
     */
    at?: Timestamp;
    /**
     * @generated from field: tank.agentctl.v1.RunEventKind kind = 3;
     */
    kind: RunEventKind;
    /**
     * @generated from field: string sdk_session_id = 4;
     */
    sdkSessionId: string;
    /**
     * assistant_delta text, status, log line
     *
     * @generated from field: string text = 5;
     */
    text: string;
    /**
     * tool_call / tool_result / permission_request
     *
     * @generated from field: string tool_name = 6;
     */
    toolName: string;
    /**
     * @generated from field: string tool_use_id = 7;
     */
    toolUseId: string;
    /**
     * @generated from field: google.protobuf.Struct tool_input = 8;
     */
    toolInput?: JsonObject;
    /**
     * truncated
     *
     * @generated from field: string tool_output = 9;
     */
    toolOutput: string;
    /**
     * @generated from field: string tool_output_sha256 = 10;
     */
    toolOutputSha256: string;
    /**
     * @generated from field: bool is_error = 11;
     */
    isError: boolean;
    /**
     * result / usage
     *
     * @generated from field: tank.agentctl.v1.Usage usage = 12;
     */
    usage?: Usage;
    /**
     * success | error_max_turns | ...
     *
     * @generated from field: string result_subtype = 13;
     */
    resultSubtype: string;
    /**
     * @generated from field: int32 num_turns = 14;
     */
    numTurns: number;
    /**
     * @generated from field: int64 duration_ms = 15;
     */
    durationMs: bigint;
};
/**
 * Describes the message tank.agentctl.v1.RunEvent.
 * Use `create(RunEventSchema)` to create a new message.
 */
export declare const RunEventSchema: GenMessage<RunEvent>;
/**
 * @generated from message tank.agentctl.v1.StreamEventsRequest
 */
export type StreamEventsRequest = Message<"tank.agentctl.v1.StreamEventsRequest"> & {
    /**
     * @generated from field: tank.agentctl.v1.RunEvent event = 1;
     */
    event?: RunEvent;
};
/**
 * Describes the message tank.agentctl.v1.StreamEventsRequest.
 * Use `create(StreamEventsRequestSchema)` to create a new message.
 */
export declare const StreamEventsRequestSchema: GenMessage<StreamEventsRequest>;
/**
 * @generated from message tank.agentctl.v1.StreamEventsResponse
 */
export type StreamEventsResponse = Message<"tank.agentctl.v1.StreamEventsResponse"> & {
    /**
     * @generated from field: int64 accepted = 1;
     */
    accepted: bigint;
};
/**
 * Describes the message tank.agentctl.v1.StreamEventsResponse.
 * Use `create(StreamEventsResponseSchema)` to create a new message.
 */
export declare const StreamEventsResponseSchema: GenMessage<StreamEventsResponse>;
/**
 * Mirrors the Claude Agent SDK SessionStore contract (append/load keyed by
 * projectKey + sessionId + optional subpath for subagent transcripts, plus a
 * per-session summary), so a new pod can resume the session.
 *
 * @generated from message tank.agentctl.v1.SessionEntry
 */
export type SessionEntry = Message<"tank.agentctl.v1.SessionEntry"> & {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
    /**
     * @generated from field: string project_key = 2;
     */
    projectKey: string;
    /**
     * "" for the main transcript
     *
     * @generated from field: string subpath = 3;
     */
    subpath: string;
    /**
     * server-assigned append order
     *
     * @generated from field: int64 seq = 4;
     */
    seq: bigint;
    /**
     * SDK entry uuid, used for de-duplication
     *
     * @generated from field: string entry_uuid = 5;
     */
    entryUuid: string;
    /**
     * the SDK entry, JSON-encoded
     *
     * @generated from field: bytes payload = 6;
     */
    payload: Uint8Array;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 7;
     */
    createdAt?: Timestamp;
};
/**
 * Describes the message tank.agentctl.v1.SessionEntry.
 * Use `create(SessionEntrySchema)` to create a new message.
 */
export declare const SessionEntrySchema: GenMessage<SessionEntry>;
/**
 * @generated from message tank.agentctl.v1.SessionSummary
 */
export type SessionSummary = Message<"tank.agentctl.v1.SessionSummary"> & {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
    /**
     * @generated from field: int64 mtime_ms = 2;
     */
    mtimeMs: bigint;
    /**
     * SDK-owned, persisted verbatim
     *
     * @generated from field: google.protobuf.Struct data = 3;
     */
    data?: JsonObject;
};
/**
 * Describes the message tank.agentctl.v1.SessionSummary.
 * Use `create(SessionSummarySchema)` to create a new message.
 */
export declare const SessionSummarySchema: GenMessage<SessionSummary>;
/**
 * @generated from message tank.agentctl.v1.SessionStorePutRequest
 */
export type SessionStorePutRequest = Message<"tank.agentctl.v1.SessionStorePutRequest"> & {
    /**
     * @generated from field: repeated tank.agentctl.v1.SessionEntry entries = 1;
     */
    entries: SessionEntry[];
    /**
     * optional: replaces the session's summary
     *
     * @generated from field: tank.agentctl.v1.SessionSummary summary = 2;
     */
    summary?: SessionSummary;
};
/**
 * Describes the message tank.agentctl.v1.SessionStorePutRequest.
 * Use `create(SessionStorePutRequestSchema)` to create a new message.
 */
export declare const SessionStorePutRequestSchema: GenMessage<SessionStorePutRequest>;
/**
 * @generated from message tank.agentctl.v1.SessionStorePutResponse
 */
export type SessionStorePutResponse = Message<"tank.agentctl.v1.SessionStorePutResponse"> & {
    /**
     * @generated from field: int32 written = 1;
     */
    written: number;
};
/**
 * Describes the message tank.agentctl.v1.SessionStorePutResponse.
 * Use `create(SessionStorePutResponseSchema)` to create a new message.
 */
export declare const SessionStorePutResponseSchema: GenMessage<SessionStorePutResponse>;
/**
 * @generated from message tank.agentctl.v1.SessionStoreListRequest
 */
export type SessionStoreListRequest = Message<"tank.agentctl.v1.SessionStoreListRequest"> & {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
    /**
     * @generated from field: string project_key = 2;
     */
    projectKey: string;
    /**
     * @generated from field: string subpath = 3;
     */
    subpath: string;
    /**
     * @generated from field: int64 after_seq = 4;
     */
    afterSeq: bigint;
    /**
     * @generated from field: int32 limit = 5;
     */
    limit: number;
};
/**
 * Describes the message tank.agentctl.v1.SessionStoreListRequest.
 * Use `create(SessionStoreListRequestSchema)` to create a new message.
 */
export declare const SessionStoreListRequestSchema: GenMessage<SessionStoreListRequest>;
/**
 * @generated from message tank.agentctl.v1.SessionStoreListResponse
 */
export type SessionStoreListResponse = Message<"tank.agentctl.v1.SessionStoreListResponse"> & {
    /**
     * @generated from field: repeated tank.agentctl.v1.SessionEntry entries = 1;
     */
    entries: SessionEntry[];
    /**
     * @generated from field: bool has_more = 2;
     */
    hasMore: boolean;
    /**
     * false when no entries exist for the key at all
     *
     * @generated from field: bool found = 3;
     */
    found: boolean;
};
/**
 * Describes the message tank.agentctl.v1.SessionStoreListResponse.
 * Use `create(SessionStoreListResponseSchema)` to create a new message.
 */
export declare const SessionStoreListResponseSchema: GenMessage<SessionStoreListResponse>;
/**
 * @generated from message tank.agentctl.v1.SessionStoreListSessionsRequest
 */
export type SessionStoreListSessionsRequest = Message<"tank.agentctl.v1.SessionStoreListSessionsRequest"> & {
    /**
     * @generated from field: string project_key = 1;
     */
    projectKey: string;
};
/**
 * Describes the message tank.agentctl.v1.SessionStoreListSessionsRequest.
 * Use `create(SessionStoreListSessionsRequestSchema)` to create a new message.
 */
export declare const SessionStoreListSessionsRequestSchema: GenMessage<SessionStoreListSessionsRequest>;
/**
 * @generated from message tank.agentctl.v1.SessionStoreListSessionsResponse
 */
export type SessionStoreListSessionsResponse = Message<"tank.agentctl.v1.SessionStoreListSessionsResponse"> & {
    /**
     * @generated from field: repeated tank.agentctl.v1.SessionSummary sessions = 1;
     */
    sessions: SessionSummary[];
};
/**
 * Describes the message tank.agentctl.v1.SessionStoreListSessionsResponse.
 * Use `create(SessionStoreListSessionsResponseSchema)` to create a new message.
 */
export declare const SessionStoreListSessionsResponseSchema: GenMessage<SessionStoreListSessionsResponse>;
/**
 * @generated from message tank.agentctl.v1.SessionStoreListSubkeysRequest
 */
export type SessionStoreListSubkeysRequest = Message<"tank.agentctl.v1.SessionStoreListSubkeysRequest"> & {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
    /**
     * @generated from field: string project_key = 2;
     */
    projectKey: string;
};
/**
 * Describes the message tank.agentctl.v1.SessionStoreListSubkeysRequest.
 * Use `create(SessionStoreListSubkeysRequestSchema)` to create a new message.
 */
export declare const SessionStoreListSubkeysRequestSchema: GenMessage<SessionStoreListSubkeysRequest>;
/**
 * @generated from message tank.agentctl.v1.SessionStoreListSubkeysResponse
 */
export type SessionStoreListSubkeysResponse = Message<"tank.agentctl.v1.SessionStoreListSubkeysResponse"> & {
    /**
     * @generated from field: repeated string subpaths = 1;
     */
    subpaths: string[];
};
/**
 * Describes the message tank.agentctl.v1.SessionStoreListSubkeysResponse.
 * Use `create(SessionStoreListSubkeysResponseSchema)` to create a new message.
 */
export declare const SessionStoreListSubkeysResponseSchema: GenMessage<SessionStoreListSubkeysResponse>;
/**
 * @generated from message tank.agentctl.v1.SessionStoreDeleteRequest
 */
export type SessionStoreDeleteRequest = Message<"tank.agentctl.v1.SessionStoreDeleteRequest"> & {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
    /**
     * @generated from field: string project_key = 2;
     */
    projectKey: string;
    /**
     * @generated from field: string subpath = 3;
     */
    subpath: string;
};
/**
 * Describes the message tank.agentctl.v1.SessionStoreDeleteRequest.
 * Use `create(SessionStoreDeleteRequestSchema)` to create a new message.
 */
export declare const SessionStoreDeleteRequestSchema: GenMessage<SessionStoreDeleteRequest>;
/**
 * @generated from message tank.agentctl.v1.SessionStoreDeleteResponse
 */
export type SessionStoreDeleteResponse = Message<"tank.agentctl.v1.SessionStoreDeleteResponse"> & {};
/**
 * Describes the message tank.agentctl.v1.SessionStoreDeleteResponse.
 * Use `create(SessionStoreDeleteResponseSchema)` to create a new message.
 */
export declare const SessionStoreDeleteResponseSchema: GenMessage<SessionStoreDeleteResponse>;
/**
 * @generated from message tank.agentctl.v1.InboxItem
 */
export type InboxItem = Message<"tank.agentctl.v1.InboxItem"> & {
    /**
     * @generated from field: int64 seq = 1;
     */
    seq: bigint;
    /**
     * @generated from field: tank.agentctl.v1.InboxKind kind = 2;
     */
    kind: InboxKind;
    /**
     * @generated from field: string user_id = 3;
     */
    userId: string;
    /**
     * @generated from field: string user_name = 4;
     */
    userName: string;
    /**
     * steer text, answer, feedback
     *
     * @generated from field: string text = 5;
     */
    text: string;
    /**
     * approval
     *
     * @generated from field: string gate_id = 6;
     */
    gateId: string;
    /**
     * approved | rejected
     *
     * @generated from field: string decision = 7;
     */
    decision: string;
    /**
     * answer
     *
     * @generated from field: string card_id = 8;
     */
    cardId: string;
    /**
     * @generated from field: google.protobuf.Timestamp at = 9;
     */
    at?: Timestamp;
};
/**
 * Describes the message tank.agentctl.v1.InboxItem.
 * Use `create(InboxItemSchema)` to create a new message.
 */
export declare const InboxItemSchema: GenMessage<InboxItem>;
/**
 * Long-poll: returns as soon as an item with seq > after_seq exists, or after
 * wait_ms with an empty list.
 *
 * @generated from message tank.agentctl.v1.PollInboxRequest
 */
export type PollInboxRequest = Message<"tank.agentctl.v1.PollInboxRequest"> & {
    /**
     * @generated from field: int64 after_seq = 1;
     */
    afterSeq: bigint;
    /**
     * @generated from field: int32 wait_ms = 2;
     */
    waitMs: number;
};
/**
 * Describes the message tank.agentctl.v1.PollInboxRequest.
 * Use `create(PollInboxRequestSchema)` to create a new message.
 */
export declare const PollInboxRequestSchema: GenMessage<PollInboxRequest>;
/**
 * @generated from message tank.agentctl.v1.PollInboxResponse
 */
export type PollInboxResponse = Message<"tank.agentctl.v1.PollInboxResponse"> & {
    /**
     * @generated from field: repeated tank.agentctl.v1.InboxItem items = 1;
     */
    items: InboxItem[];
};
/**
 * Describes the message tank.agentctl.v1.PollInboxResponse.
 * Use `create(PollInboxResponseSchema)` to create a new message.
 */
export declare const PollInboxResponseSchema: GenMessage<PollInboxResponse>;
/**
 * @generated from message tank.agentctl.v1.StartRunRequest
 */
export type StartRunRequest = Message<"tank.agentctl.v1.StartRunRequest"> & {
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
     * @generated from field: string agent_id = 4;
     */
    agentId: string;
    /**
     * @generated from field: string requested_by = 5;
     */
    requestedBy: string;
    /**
     * @generated from field: string instructions = 6;
     */
    instructions: string;
};
/**
 * Describes the message tank.agentctl.v1.StartRunRequest.
 * Use `create(StartRunRequestSchema)` to create a new message.
 */
export declare const StartRunRequestSchema: GenMessage<StartRunRequest>;
/**
 * @generated from message tank.agentctl.v1.StartRunResponse
 */
export type StartRunResponse = Message<"tank.agentctl.v1.StartRunResponse"> & {
    /**
     * @generated from field: tank.agent.v1.Run run = 1;
     */
    run?: Run;
};
/**
 * Describes the message tank.agentctl.v1.StartRunResponse.
 * Use `create(StartRunResponseSchema)` to create a new message.
 */
export declare const StartRunResponseSchema: GenMessage<StartRunResponse>;
/**
 * @generated from message tank.agentctl.v1.GetRunRequest
 */
export type GetRunRequest = Message<"tank.agentctl.v1.GetRunRequest"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
};
/**
 * Describes the message tank.agentctl.v1.GetRunRequest.
 * Use `create(GetRunRequestSchema)` to create a new message.
 */
export declare const GetRunRequestSchema: GenMessage<GetRunRequest>;
/**
 * @generated from message tank.agentctl.v1.GetRunResponse
 */
export type GetRunResponse = Message<"tank.agentctl.v1.GetRunResponse"> & {
    /**
     * @generated from field: tank.agent.v1.Run run = 1;
     */
    run?: Run;
    /**
     * @generated from field: string sdk_session_id = 2;
     */
    sdkSessionId: string;
    /**
     * @generated from field: string head_sha = 3;
     */
    headSha: string;
    /**
     * @generated from field: repeated tank.agentctl.v1.Gate gates = 4;
     */
    gates: Gate[];
};
/**
 * Describes the message tank.agentctl.v1.GetRunResponse.
 * Use `create(GetRunResponseSchema)` to create a new message.
 */
export declare const GetRunResponseSchema: GenMessage<GetRunResponse>;
/**
 * @generated from message tank.agentctl.v1.Gate
 */
export type Gate = Message<"tank.agentctl.v1.Gate"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: tank.blocks.v1.GateKind kind = 2;
     */
    kind: GateKind;
    /**
     * @generated from field: string subject_hash = 3;
     */
    subjectHash: string;
    /**
     * @generated from field: repeated string required_approvers = 4;
     */
    requiredApprovers: string[];
    /**
     * @generated from field: int32 min_approvals = 5;
     */
    minApprovals: number;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 6;
     */
    expiresAt?: Timestamp;
    /**
     * pending | approved | rejected | expired
     *
     * @generated from field: string decision = 7;
     */
    decision: string;
    /**
     * @generated from field: repeated tank.agentctl.v1.GateDecision decisions = 8;
     */
    decisions: GateDecision[];
};
/**
 * Describes the message tank.agentctl.v1.Gate.
 * Use `create(GateSchema)` to create a new message.
 */
export declare const GateSchema: GenMessage<Gate>;
/**
 * @generated from message tank.agentctl.v1.GateDecision
 */
export type GateDecision = Message<"tank.agentctl.v1.GateDecision"> & {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
    /**
     * @generated from field: string decision = 2;
     */
    decision: string;
    /**
     * @generated from field: string feedback = 3;
     */
    feedback: string;
    /**
     * @generated from field: google.protobuf.Timestamp at = 4;
     */
    at?: Timestamp;
};
/**
 * Describes the message tank.agentctl.v1.GateDecision.
 * Use `create(GateDecisionSchema)` to create a new message.
 */
export declare const GateDecisionSchema: GenMessage<GateDecision>;
/**
 * @generated from message tank.agentctl.v1.ListRunsRequest
 */
export type ListRunsRequest = Message<"tank.agentctl.v1.ListRunsRequest"> & {
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
     * @generated from field: int32 limit = 4;
     */
    limit: number;
};
/**
 * Describes the message tank.agentctl.v1.ListRunsRequest.
 * Use `create(ListRunsRequestSchema)` to create a new message.
 */
export declare const ListRunsRequestSchema: GenMessage<ListRunsRequest>;
/**
 * @generated from message tank.agentctl.v1.ListRunsResponse
 */
export type ListRunsResponse = Message<"tank.agentctl.v1.ListRunsResponse"> & {
    /**
     * @generated from field: repeated tank.agent.v1.Run runs = 1;
     */
    runs: Run[];
};
/**
 * Describes the message tank.agentctl.v1.ListRunsResponse.
 * Use `create(ListRunsResponseSchema)` to create a new message.
 */
export declare const ListRunsResponseSchema: GenMessage<ListRunsResponse>;
/**
 * @generated from message tank.agentctl.v1.DecideGateRequest
 */
export type DecideGateRequest = Message<"tank.agentctl.v1.DecideGateRequest"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
    /**
     * @generated from field: string gate_id = 2;
     */
    gateId: string;
    /**
     * @generated from field: string user_id = 3;
     */
    userId: string;
    /**
     * approved | rejected
     *
     * @generated from field: string decision = 4;
     */
    decision: string;
    /**
     * @generated from field: string feedback = 5;
     */
    feedback: string;
};
/**
 * Describes the message tank.agentctl.v1.DecideGateRequest.
 * Use `create(DecideGateRequestSchema)` to create a new message.
 */
export declare const DecideGateRequestSchema: GenMessage<DecideGateRequest>;
/**
 * @generated from message tank.agentctl.v1.DecideGateResponse
 */
export type DecideGateResponse = Message<"tank.agentctl.v1.DecideGateResponse"> & {
    /**
     * @generated from field: tank.agentctl.v1.Gate gate = 1;
     */
    gate?: Gate;
};
/**
 * Describes the message tank.agentctl.v1.DecideGateResponse.
 * Use `create(DecideGateResponseSchema)` to create a new message.
 */
export declare const DecideGateResponseSchema: GenMessage<DecideGateResponse>;
/**
 * @generated from message tank.agentctl.v1.SteerRunRequest
 */
export type SteerRunRequest = Message<"tank.agentctl.v1.SteerRunRequest"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
    /**
     * @generated from field: string text = 3;
     */
    text: string;
};
/**
 * Describes the message tank.agentctl.v1.SteerRunRequest.
 * Use `create(SteerRunRequestSchema)` to create a new message.
 */
export declare const SteerRunRequestSchema: GenMessage<SteerRunRequest>;
/**
 * @generated from message tank.agentctl.v1.SteerRunResponse
 */
export type SteerRunResponse = Message<"tank.agentctl.v1.SteerRunResponse"> & {};
/**
 * Describes the message tank.agentctl.v1.SteerRunResponse.
 * Use `create(SteerRunResponseSchema)` to create a new message.
 */
export declare const SteerRunResponseSchema: GenMessage<SteerRunResponse>;
/**
 * @generated from message tank.agentctl.v1.CancelRunRequest
 */
export type CancelRunRequest = Message<"tank.agentctl.v1.CancelRunRequest"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
    /**
     * @generated from field: string reason = 3;
     */
    reason: string;
};
/**
 * Describes the message tank.agentctl.v1.CancelRunRequest.
 * Use `create(CancelRunRequestSchema)` to create a new message.
 */
export declare const CancelRunRequestSchema: GenMessage<CancelRunRequest>;
/**
 * @generated from message tank.agentctl.v1.CancelRunResponse
 */
export type CancelRunResponse = Message<"tank.agentctl.v1.CancelRunResponse"> & {};
/**
 * Describes the message tank.agentctl.v1.CancelRunResponse.
 * Use `create(CancelRunResponseSchema)` to create a new message.
 */
export declare const CancelRunResponseSchema: GenMessage<CancelRunResponse>;
/**
 * @generated from message tank.agentctl.v1.ListRunEventsRequest
 */
export type ListRunEventsRequest = Message<"tank.agentctl.v1.ListRunEventsRequest"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
    /**
     * @generated from field: int64 after_seq = 2;
     */
    afterSeq: bigint;
    /**
     * @generated from field: int32 limit = 3;
     */
    limit: number;
};
/**
 * Describes the message tank.agentctl.v1.ListRunEventsRequest.
 * Use `create(ListRunEventsRequestSchema)` to create a new message.
 */
export declare const ListRunEventsRequestSchema: GenMessage<ListRunEventsRequest>;
/**
 * @generated from message tank.agentctl.v1.ListRunEventsResponse
 */
export type ListRunEventsResponse = Message<"tank.agentctl.v1.ListRunEventsResponse"> & {
    /**
     * @generated from field: repeated tank.agentctl.v1.RunEvent events = 1;
     */
    events: RunEvent[];
    /**
     * @generated from field: bool has_more = 2;
     */
    hasMore: boolean;
};
/**
 * Describes the message tank.agentctl.v1.ListRunEventsResponse.
 * Use `create(ListRunEventsResponseSchema)` to create a new message.
 */
export declare const ListRunEventsResponseSchema: GenMessage<ListRunEventsResponse>;
/**
 * Phase the runner is being started for. The control plane decides; the runner
 * picks its permission mode from it (planning -> "plan", implementing ->
 * "acceptEdits").
 *
 * @generated from enum tank.agentctl.v1.RunPhase
 */
export declare enum RunPhase {
    /**
     * @generated from enum value: RUN_PHASE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: RUN_PHASE_PLANNING = 1;
     */
    PLANNING = 1,
    /**
     * @generated from enum value: RUN_PHASE_IMPLEMENTING = 2;
     */
    IMPLEMENTING = 2
}
/**
 * Describes the enum tank.agentctl.v1.RunPhase.
 */
export declare const RunPhaseSchema: GenEnum<RunPhase>;
/**
 * @generated from enum tank.agentctl.v1.RunEventKind
 */
export declare enum RunEventKind {
    /**
     * @generated from enum value: RUN_EVENT_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: RUN_EVENT_KIND_ASSISTANT_DELTA = 1;
     */
    ASSISTANT_DELTA = 1,
    /**
     * @generated from enum value: RUN_EVENT_KIND_TOOL_CALL = 2;
     */
    TOOL_CALL = 2,
    /**
     * @generated from enum value: RUN_EVENT_KIND_TOOL_RESULT = 3;
     */
    TOOL_RESULT = 3,
    /**
     * @generated from enum value: RUN_EVENT_KIND_PERMISSION_REQUEST = 4;
     */
    PERMISSION_REQUEST = 4,
    /**
     * @generated from enum value: RUN_EVENT_KIND_RESULT = 5;
     */
    RESULT = 5,
    /**
     * @generated from enum value: RUN_EVENT_KIND_USAGE = 6;
     */
    USAGE = 6,
    /**
     * @generated from enum value: RUN_EVENT_KIND_STATUS = 7;
     */
    STATUS = 7,
    /**
     * @generated from enum value: RUN_EVENT_KIND_LOG = 8;
     */
    LOG = 8
}
/**
 * Describes the enum tank.agentctl.v1.RunEventKind.
 */
export declare const RunEventKindSchema: GenEnum<RunEventKind>;
/**
 * Human -> agent traffic queued by the control plane for the runner: steer
 * messages, approval decisions, question answers, cancel.
 *
 * @generated from enum tank.agentctl.v1.InboxKind
 */
export declare enum InboxKind {
    /**
     * @generated from enum value: INBOX_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: INBOX_KIND_STEER = 1;
     */
    STEER = 1,
    /**
     * @generated from enum value: INBOX_KIND_APPROVAL = 2;
     */
    APPROVAL = 2,
    /**
     * @generated from enum value: INBOX_KIND_ANSWER = 3;
     */
    ANSWER = 3,
    /**
     * @generated from enum value: INBOX_KIND_CANCEL = 4;
     */
    CANCEL = 4
}
/**
 * Describes the enum tank.agentctl.v1.InboxKind.
 */
export declare const InboxKindSchema: GenEnum<InboxKind>;
/**
 * RunnerService is the only network surface the sandbox may reach besides the
 * LLM gateway. Every call carries "Authorization: Bearer <RUN_TOKEN>".
 *
 * @generated from service tank.agentctl.v1.RunnerService
 */
export declare const RunnerService: GenService<{
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.GetRunContext
     */
    getRunContext: {
        methodKind: "unary";
        input: typeof GetRunContextRequestSchema;
        output: typeof GetRunContextResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.GetGitCredential
     */
    getGitCredential: {
        methodKind: "unary";
        input: typeof GetGitCredentialRequestSchema;
        output: typeof GetGitCredentialResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.PostToThread
     */
    postToThread: {
        methodKind: "unary";
        input: typeof PostToThreadRequestSchema;
        output: typeof PostToThreadResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.AttachArtifact
     */
    attachArtifact: {
        methodKind: "unary";
        input: typeof AttachArtifactRequestSchema;
        output: typeof AttachArtifactResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.PostPlan
     */
    postPlan: {
        methodKind: "unary";
        input: typeof PostPlanRequestSchema;
        output: typeof PostPlanResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.UpdateCard
     */
    updateCard: {
        methodKind: "unary";
        input: typeof UpdateCardRequestSchema;
        output: typeof UpdateCardResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.AskForApproval
     */
    askForApproval: {
        methodKind: "unary";
        input: typeof AskForApprovalRequestSchema;
        output: typeof AskForApprovalResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.AskQuestion
     */
    askQuestion: {
        methodKind: "unary";
        input: typeof AskQuestionRequestSchema;
        output: typeof AskQuestionResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.ReportStatus
     */
    reportStatus: {
        methodKind: "unary";
        input: typeof ReportStatusRequestSchema;
        output: typeof ReportStatusResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.ReadThread
     */
    readThread: {
        methodKind: "unary";
        input: typeof ReadThreadRequestSchema;
        output: typeof ReadThreadResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.PollInbox
     */
    pollInbox: {
        methodKind: "unary";
        input: typeof PollInboxRequestSchema;
        output: typeof PollInboxResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.OpenPullRequest
     */
    openPullRequest: {
        methodKind: "unary";
        input: typeof OpenPullRequestRequestSchema;
        output: typeof OpenPullRequestResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.RequestCiWatch
     */
    requestCiWatch: {
        methodKind: "unary";
        input: typeof RequestCiWatchRequestSchema;
        output: typeof RequestCiWatchResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.GetCiFailure
     */
    getCiFailure: {
        methodKind: "unary";
        input: typeof GetCiFailureRequestSchema;
        output: typeof GetCiFailureResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.RecordDecision
     */
    recordDecision: {
        methodKind: "unary";
        input: typeof RecordDecisionRequestSchema;
        output: typeof RecordDecisionResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.Remember
     */
    remember: {
        methodKind: "unary";
        input: typeof RememberRequestSchema;
        output: typeof RememberResponseSchema;
    };
    /**
     * Client-streaming transcript: assistant_delta, tool_call, tool_result,
     * permission_request, result, usage. Persisted to agent.run_events.
     *
     * @generated from rpc tank.agentctl.v1.RunnerService.StreamEvents
     */
    streamEvents: {
        methodKind: "client_streaming";
        input: typeof StreamEventsRequestSchema;
        output: typeof StreamEventsResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.SessionStorePut
     */
    sessionStorePut: {
        methodKind: "unary";
        input: typeof SessionStorePutRequestSchema;
        output: typeof SessionStorePutResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.SessionStoreList
     */
    sessionStoreList: {
        methodKind: "unary";
        input: typeof SessionStoreListRequestSchema;
        output: typeof SessionStoreListResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.SessionStoreListSessions
     */
    sessionStoreListSessions: {
        methodKind: "unary";
        input: typeof SessionStoreListSessionsRequestSchema;
        output: typeof SessionStoreListSessionsResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.SessionStoreListSubkeys
     */
    sessionStoreListSubkeys: {
        methodKind: "unary";
        input: typeof SessionStoreListSubkeysRequestSchema;
        output: typeof SessionStoreListSubkeysResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.SessionStoreDelete
     */
    sessionStoreDelete: {
        methodKind: "unary";
        input: typeof SessionStoreDeleteRequestSchema;
        output: typeof SessionStoreDeleteResponseSchema;
    };
}>;
/**
 * @generated from service tank.agentctl.v1.ControlService
 */
export declare const ControlService: GenService<{
    /**
     * @generated from rpc tank.agentctl.v1.ControlService.StartRun
     */
    startRun: {
        methodKind: "unary";
        input: typeof StartRunRequestSchema;
        output: typeof StartRunResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.ControlService.GetRun
     */
    getRun: {
        methodKind: "unary";
        input: typeof GetRunRequestSchema;
        output: typeof GetRunResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.ControlService.ListRuns
     */
    listRuns: {
        methodKind: "unary";
        input: typeof ListRunsRequestSchema;
        output: typeof ListRunsResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.ControlService.DecideGate
     */
    decideGate: {
        methodKind: "unary";
        input: typeof DecideGateRequestSchema;
        output: typeof DecideGateResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.ControlService.SteerRun
     */
    steerRun: {
        methodKind: "unary";
        input: typeof SteerRunRequestSchema;
        output: typeof SteerRunResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.ControlService.CancelRun
     */
    cancelRun: {
        methodKind: "unary";
        input: typeof CancelRunRequestSchema;
        output: typeof CancelRunResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.ControlService.ListRunEvents
     */
    listRunEvents: {
        methodKind: "unary";
        input: typeof ListRunEventsRequestSchema;
        output: typeof ListRunEventsResponseSchema;
    };
}>;
