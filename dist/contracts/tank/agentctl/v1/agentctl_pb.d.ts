import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Run, TreadPlan, TreadPlanItem, TreadSettings } from "../../agent/v1/agent_pb.js";
import type { Blocks, Check, GateKind, PlanStep, StepStatus } from "../../blocks/v1/blocks_pb.js";
import type { Board } from "../../board/v1/board_pb.js";
import type { CashSummary, Customer, Expense, Invoice, InvoiceLine, Report } from "../../books/v1/books_pb.js";
import type { Answer, Canvas } from "../../canvas/v1/canvas_pb.js";
import type { Account, Platform, Post } from "../../social/v1/social_pb.js";
import type { JsonObject, Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/agentctl/v1/agentctl.proto.
 */
export declare const file_tank_agentctl_v1_agentctl: GenFile;
/**
 * A file a human put in the thread. The sandbox has no route to the file
 * store, so the bytes come back through GetAttachment; this is only what the
 * agent needs to decide whether it wants them.
 *
 * @generated from message tank.agentctl.v1.Attachment
 */
export type Attachment = Message<"tank.agentctl.v1.Attachment"> & {
    /**
     * @generated from field: string file_id = 1;
     */
    fileId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string mime = 3;
     */
    mime: string;
    /**
     * @generated from field: int64 size = 4;
     */
    size: bigint;
    /**
     * the message it arrived on
     *
     * @generated from field: string message_id = 5;
     */
    messageId: string;
};
/**
 * Describes the message tank.agentctl.v1.Attachment.
 * Use `create(AttachmentSchema)` to create a new message.
 */
export declare const AttachmentSchema: GenMessage<Attachment>;
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
    /**
     * @generated from field: repeated tank.agentctl.v1.Attachment attachments = 7;
     */
    attachments: Attachment[];
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
    /**
     * policy's tools.gate.destructive_tool: the patterns that must open a
     * destructive_tool gate instead of running.
     *
     * This field was absent until 2026-10-07, and its absence was not a weak
     * control but no control at all. The patterns were in every workspace's
     * policy, the control plane evaluated them, and nothing inside a sandbox was
     * ever told about them — so the gate the policy promised could not open and
     * the command simply ran. A deny list the runner cannot see denies nothing.
     *
     * @generated from field: repeated string tools_gate_destructive = 9;
     */
    toolsGateDestructive: string[];
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
    /**
     * Everything attached in this thread, newest last. Present from the first
     * turn so the agent knows an image or a video exists without asking for it:
     * "add a filter to this image" is unanswerable otherwise.
     *
     * @generated from field: repeated tank.agentctl.v1.Attachment attachments = 21;
     */
    attachments: Attachment[];
    /**
     * Further repositories this Tread may reach, and how far; the run's own repo is
     * always writable in the implementing phase.
     *
     * @generated from field: repeated tank.agentctl.v1.RepoAccess repo_access = 22;
     */
    repoAccess: RepoAccess[];
    /**
     * True for a run inside one of TANK's own board products. The board's tools —
     * commit_files, set_brand, set_landing, record_finding, board_research — exist only
     * for those; a customer's run never sees them.
     *
     * @generated from field: bool product_run = 23;
     */
    productRun: boolean;
    /**
     * The Tread's own purpose and goal, so an agent reading the code knows what the
     * Tread is for and can offer the first step towards it.
     *
     * @generated from field: string channel_purpose = 24;
     */
    channelPurpose: string;
    /**
     * @generated from field: string channel_goal = 25;
     */
    channelGoal: string;
    /**
     * A Crew member's title and skill: who this agent is and what it does, from the
     * switchboard; empty for the workspace agent.
     *
     * @generated from field: string agent_title = 28;
     */
    agentTitle: string;
    /**
     * @generated from field: string agent_skill = 29;
     */
    agentSkill: string;
    /**
     * True when this run must not read or write the repository's Neural Knowledge:
     * the Tread turned it off, or the run is the control half of a measurement.
     *
     * @generated from field: bool skip_neural_knowledge = 26;
     */
    skipNeuralKnowledge: boolean;
    /**
     * How the control plane classed the ask: "single_area" (one place in the code, implemented
     * without a plan stage, on the cheaper model) or "multi_area". Empty on older runs and
     * special modes.
     *
     * @generated from field: string task_class = 27;
     */
    taskClass: string;
    /**
     * The thread's Workbench: the board the agent lays its steps and its work on while
     * people watch in the thread. Empty for runs nobody watches (neural, recon, remediation).
     *
     * @generated from field: string workbench_board_id = 30;
     */
    workbenchBoardId: string;
    /**
     * Everything the Tread holds, as one brief the control plane writes: its settings, what
     * TANK hosts for it and anything waiting on an owner, recent runs, boards and pages, the
     * latest messages with who wrote them (the agent's own notices included), and what the
     * Neural Vault knows about the ask. The same brief the agent's thread replies are written
     * from, so a run and a reply never disagree about the Tread.
     *
     * @generated from field: string tread_brief = 31;
     */
    treadBrief: string;
    /**
     * The Tread's plan ledger as it stands, so the run works against the whole plan and keeps
     * it current with UpdateTreadPlan. Unset when the Tread has none yet.
     *
     * @generated from field: tank.agent.v1.TreadPlan tread_plan = 32;
     */
    treadPlan?: TreadPlan;
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
 * @generated from message tank.agentctl.v1.RepoAccess
 */
export type RepoAccess = Message<"tank.agentctl.v1.RepoAccess"> & {
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
 * Describes the message tank.agentctl.v1.RepoAccess.
 * Use `create(RepoAccessSchema)` to create a new message.
 */
export declare const RepoAccessSchema: GenMessage<RepoAccess>;
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
    /**
     * owner/name git is asking about; empty means the run's own repository
     *
     * @generated from field: string repo = 2;
     */
    repo: string;
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
    /**
     * the message shows in the Tread too, not only in the thread
     *
     * @generated from field: bool also_send_to_tread = 3;
     */
    alsoSendToTread: boolean;
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
    /**
     * This is the finished thing, not something to look at before deciding. The
     * control plane posts it into the thread on its own message immediately,
     * which is both how a person gets it and the only way it becomes readable:
     * file_shares rows come from a message's file_ids and nothing else. A
     * preview waits instead for the plan card that will carry it.
     *
     * @generated from field: bool deliver = 5;
     */
    deliver: boolean;
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
 * GetAttachment streams one attachment's bytes into the sandbox. Server
 * streaming because a video is not a message-sized thing, and because the
 * runner writes each chunk straight to disk rather than holding the file in
 * memory.
 *
 * @generated from message tank.agentctl.v1.GetAttachmentRequest
 */
export type GetAttachmentRequest = Message<"tank.agentctl.v1.GetAttachmentRequest"> & {
    /**
     * @generated from field: string file_id = 1;
     */
    fileId: string;
};
/**
 * Describes the message tank.agentctl.v1.GetAttachmentRequest.
 * Use `create(GetAttachmentRequestSchema)` to create a new message.
 */
export declare const GetAttachmentRequestSchema: GenMessage<GetAttachmentRequest>;
/**
 * @generated from message tank.agentctl.v1.GetAttachmentResponse
 */
export type GetAttachmentResponse = Message<"tank.agentctl.v1.GetAttachmentResponse"> & {
    /**
     * Set on the first response only.
     *
     * @generated from field: tank.agentctl.v1.Attachment attachment = 1;
     */
    attachment?: Attachment;
    /**
     * @generated from field: bytes chunk = 2;
     */
    chunk: Uint8Array;
};
/**
 * Describes the message tank.agentctl.v1.GetAttachmentResponse.
 * Use `create(GetAttachmentResponseSchema)` to create a new message.
 */
export declare const GetAttachmentResponseSchema: GenMessage<GetAttachmentResponse>;
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
 * Progress through the approved plan, shown on the plan card as it moves: a step is
 * running when the run starts it and done when it is proven. Steps are named by the id
 * they were posted with, or by their 1-based position ("3"). A continuation run updates
 * the plan card of the thread's approved plan, whichever run posted it.
 * Keeps the Tread's plan ledger. Items are matched by key: a new key adds an item, a known
 * key updates its title, status, phase or note. replace_all sets the whole list (a new
 * version; keys left out are dropped), for creating the ledger or when the scope changes.
 *
 * @generated from message tank.agentctl.v1.UpdateTreadPlanRequest
 */
export type UpdateTreadPlanRequest = Message<"tank.agentctl.v1.UpdateTreadPlanRequest"> & {
    /**
     * @generated from field: string title = 1;
     */
    title: string;
    /**
     * @generated from field: string source = 2;
     */
    source: string;
    /**
     * @generated from field: repeated tank.agent.v1.TreadPlanItem items = 3;
     */
    items: TreadPlanItem[];
    /**
     * @generated from field: bool replace_all = 4;
     */
    replaceAll: boolean;
};
/**
 * Describes the message tank.agentctl.v1.UpdateTreadPlanRequest.
 * Use `create(UpdateTreadPlanRequestSchema)` to create a new message.
 */
export declare const UpdateTreadPlanRequestSchema: GenMessage<UpdateTreadPlanRequest>;
/**
 * @generated from message tank.agentctl.v1.UpdateTreadPlanResponse
 */
export type UpdateTreadPlanResponse = Message<"tank.agentctl.v1.UpdateTreadPlanResponse"> & {
    /**
     * @generated from field: tank.agent.v1.TreadPlan plan = 1;
     */
    plan?: TreadPlan;
};
/**
 * Describes the message tank.agentctl.v1.UpdateTreadPlanResponse.
 * Use `create(UpdateTreadPlanResponseSchema)` to create a new message.
 */
export declare const UpdateTreadPlanResponseSchema: GenMessage<UpdateTreadPlanResponse>;
/**
 * @generated from message tank.agentctl.v1.UpdatePlanStepsRequest
 */
export type UpdatePlanStepsRequest = Message<"tank.agentctl.v1.UpdatePlanStepsRequest"> & {
    /**
     * @generated from field: repeated tank.agentctl.v1.PlanStepUpdate steps = 1;
     */
    steps: PlanStepUpdate[];
};
/**
 * Describes the message tank.agentctl.v1.UpdatePlanStepsRequest.
 * Use `create(UpdatePlanStepsRequestSchema)` to create a new message.
 */
export declare const UpdatePlanStepsRequestSchema: GenMessage<UpdatePlanStepsRequest>;
/**
 * @generated from message tank.agentctl.v1.PlanStepUpdate
 */
export type PlanStepUpdate = Message<"tank.agentctl.v1.PlanStepUpdate"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: tank.blocks.v1.StepStatus status = 2;
     */
    status: StepStatus;
};
/**
 * Describes the message tank.agentctl.v1.PlanStepUpdate.
 * Use `create(PlanStepUpdateSchema)` to create a new message.
 */
export declare const PlanStepUpdateSchema: GenMessage<PlanStepUpdate>;
/**
 * @generated from message tank.agentctl.v1.UpdatePlanStepsResponse
 */
export type UpdatePlanStepsResponse = Message<"tank.agentctl.v1.UpdatePlanStepsResponse"> & {
    /**
     * ids that matched no step on the card
     *
     * @generated from field: repeated string unknown_ids = 1;
     */
    unknownIds: string[];
};
/**
 * Describes the message tank.agentctl.v1.UpdatePlanStepsResponse.
 * Use `create(UpdatePlanStepsResponseSchema)` to create a new message.
 */
export declare const UpdatePlanStepsResponseSchema: GenMessage<UpdatePlanStepsResponse>;
/**
 * @generated from message tank.agentctl.v1.ReportCompletionRequest
 */
export type ReportCompletionRequest = Message<"tank.agentctl.v1.ReportCompletionRequest"> & {
    /**
     * parts of the ask finished and pushed
     *
     * @generated from field: repeated string done = 1;
     */
    done: string[];
    /**
     * parts not started or not finished, in order
     *
     * @generated from field: repeated string remaining = 2;
     */
    remaining: string[];
    /**
     * parts that need a person: a decision, access, money
     *
     * @generated from field: repeated string blocked = 3;
     */
    blocked: string[];
};
/**
 * Describes the message tank.agentctl.v1.ReportCompletionRequest.
 * Use `create(ReportCompletionRequestSchema)` to create a new message.
 */
export declare const ReportCompletionRequestSchema: GenMessage<ReportCompletionRequest>;
/**
 * @generated from message tank.agentctl.v1.ReportCompletionResponse
 */
export type ReportCompletionResponse = Message<"tank.agentctl.v1.ReportCompletionResponse"> & {};
/**
 * Describes the message tank.agentctl.v1.ReportCompletionResponse.
 * Use `create(ReportCompletionResponseSchema)` to create a new message.
 */
export declare const ReportCompletionResponseSchema: GenMessage<ReportCompletionResponse>;
/**
 * @generated from message tank.agentctl.v1.ReadProductRequest
 */
export type ReadProductRequest = Message<"tank.agentctl.v1.ReadProductRequest"> & {
    /**
     * 0 = 200, at most 2000
     *
     * @generated from field: int32 tail_lines = 1;
     */
    tailLines: number;
    /**
     * read that pull request's preview instead of the live product
     *
     * @generated from field: int32 pull_request = 2;
     */
    pullRequest: number;
};
/**
 * Describes the message tank.agentctl.v1.ReadProductRequest.
 * Use `create(ReadProductRequestSchema)` to create a new message.
 */
export declare const ReadProductRequestSchema: GenMessage<ReadProductRequest>;
/**
 * @generated from message tank.agentctl.v1.ReadProductResponse
 */
export type ReadProductResponse = Message<"tank.agentctl.v1.ReadProductResponse"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
    /**
     * @generated from field: tank.agentctl.v1.ProductState state = 2;
     */
    state?: ProductState;
    /**
     * @generated from field: string logs = 3;
     */
    logs: string;
    /**
     * why nothing could be read (no product for this repository)
     *
     * @generated from field: string note = 4;
     */
    note: string;
};
/**
 * Describes the message tank.agentctl.v1.ReadProductResponse.
 * Use `create(ReadProductResponseSchema)` to create a new message.
 */
export declare const ReadProductResponseSchema: GenMessage<ReadProductResponse>;
/**
 * @generated from message tank.agentctl.v1.CheckLiveRequest
 */
export type CheckLiveRequest = Message<"tank.agentctl.v1.CheckLiveRequest"> & {
    /**
     * "/map"; the host is the product TANK runs for this repository
     *
     * @generated from field: string path = 1;
     */
    path: string;
    /**
     * 0 = 1440
     *
     * @generated from field: int32 viewport_width = 2;
     */
    viewportWidth: number;
    /**
     * 0 = 900
     *
     * @generated from field: int32 viewport_height = 3;
     */
    viewportHeight: number;
    /**
     * wait (up to ten minutes) until the live build is this commit
     *
     * @generated from field: string expect_sha = 4;
     */
    expectSha: string;
    /**
     * open that pull request's preview (<slug>--pr<n>) instead of the live product
     *
     * @generated from field: int32 pull_request = 5;
     */
    pullRequest: number;
};
/**
 * Describes the message tank.agentctl.v1.CheckLiveRequest.
 * Use `create(CheckLiveRequestSchema)` to create a new message.
 */
export declare const CheckLiveRequestSchema: GenMessage<CheckLiveRequest>;
/**
 * @generated from message tank.agentctl.v1.CheckLiveResponse
 */
export type CheckLiveResponse = Message<"tank.agentctl.v1.CheckLiveResponse"> & {
    /**
     * @generated from field: string url = 1;
     */
    url: string;
    /**
     * the page's HTTP status; 0 when it did not load
     *
     * @generated from field: int32 status = 2;
     */
    status: number;
    /**
     * what the live product says it is (/healthz X-Build-Sha)
     *
     * @generated from field: string build_sha = 3;
     */
    buildSha: string;
    /**
     * build_sha matches expect_sha (or none was asked for)
     *
     * @generated from field: bool deployed = 4;
     */
    deployed: boolean;
    /**
     * @generated from field: string title = 5;
     */
    title: string;
    /**
     * characters of visible text; near zero is a blank page
     *
     * @generated from field: int32 text_length = 6;
     */
    textLength: number;
    /**
     * console errors and failed loads
     *
     * @generated from field: repeated string errors = 7;
     */
    errors: string[];
    /**
     * @generated from field: bytes screenshot_png = 8;
     */
    screenshotPng: Uint8Array;
    /**
     * why nothing could be checked
     *
     * @generated from field: string note = 9;
     */
    note: string;
};
/**
 * Describes the message tank.agentctl.v1.CheckLiveResponse.
 * Use `create(CheckLiveResponseSchema)` to create a new message.
 */
export declare const CheckLiveResponseSchema: GenMessage<CheckLiveResponse>;
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
 * What the board already found, from every product's research: the tools people use,
 * what each gets right and wrong, prices, verdicts. Asked before fetching the web, so
 * a trade is researched once and every product in it inherits the finding.
 *
 * @generated from message tank.agentctl.v1.BoardResearchRequest
 */
export type BoardResearchRequest = Message<"tank.agentctl.v1.BoardResearchRequest"> & {
    /**
     * @generated from field: string query = 1;
     */
    query: string;
    /**
     * @generated from field: int32 limit = 2;
     */
    limit: number;
};
/**
 * Describes the message tank.agentctl.v1.BoardResearchRequest.
 * Use `create(BoardResearchRequestSchema)` to create a new message.
 */
export declare const BoardResearchRequestSchema: GenMessage<BoardResearchRequest>;
/**
 * @generated from message tank.agentctl.v1.ResearchHit
 */
export type ResearchHit = Message<"tank.agentctl.v1.ResearchHit"> & {
    /**
     * @generated from field: string product = 1;
     */
    product: string;
    /**
     * @generated from field: string slug = 2;
     */
    slug: string;
    /**
     * @generated from field: string url = 3;
     */
    url: string;
    /**
     * @generated from field: string industry = 4;
     */
    industry: string;
    /**
     * @generated from field: string stage = 5;
     */
    stage: string;
    /**
     * @generated from field: string excerpt = 6;
     */
    excerpt: string;
};
/**
 * Describes the message tank.agentctl.v1.ResearchHit.
 * Use `create(ResearchHitSchema)` to create a new message.
 */
export declare const ResearchHitSchema: GenMessage<ResearchHit>;
/**
 * @generated from message tank.agentctl.v1.BoardResearchResponse
 */
export type BoardResearchResponse = Message<"tank.agentctl.v1.BoardResearchResponse"> & {
    /**
     * @generated from field: repeated tank.agentctl.v1.ResearchHit hits = 1;
     */
    hits: ResearchHit[];
};
/**
 * Describes the message tank.agentctl.v1.BoardResearchResponse.
 * Use `create(BoardResearchResponseSchema)` to create a new message.
 */
export declare const BoardResearchResponseSchema: GenMessage<BoardResearchResponse>;
/**
 * Progress in the repository from every stage, without a sandbox: the control plane
 * commits the files as the App. Commits skip CI unless build is set, so a page of
 * writing does not build an image nobody runs.
 *
 * @generated from message tank.agentctl.v1.RepoFile
 */
export type RepoFile = Message<"tank.agentctl.v1.RepoFile"> & {
    /**
     * @generated from field: string path = 1;
     */
    path: string;
    /**
     * @generated from field: string content = 2;
     */
    content: string;
};
/**
 * Describes the message tank.agentctl.v1.RepoFile.
 * Use `create(RepoFileSchema)` to create a new message.
 */
export declare const RepoFileSchema: GenMessage<RepoFile>;
/**
 * @generated from message tank.agentctl.v1.CommitFilesRequest
 */
export type CommitFilesRequest = Message<"tank.agentctl.v1.CommitFilesRequest"> & {
    /**
     * @generated from field: repeated tank.agentctl.v1.RepoFile files = 1;
     */
    files: RepoFile[];
    /**
     * @generated from field: string message = 2;
     */
    message: string;
    /**
     * @generated from field: bool build = 3;
     */
    build: boolean;
};
/**
 * Describes the message tank.agentctl.v1.CommitFilesRequest.
 * Use `create(CommitFilesRequestSchema)` to create a new message.
 */
export declare const CommitFilesRequestSchema: GenMessage<CommitFilesRequest>;
/**
 * @generated from message tank.agentctl.v1.CommitFilesResponse
 */
export type CommitFilesResponse = Message<"tank.agentctl.v1.CommitFilesResponse"> & {
    /**
     * @generated from field: int32 committed = 1;
     */
    committed: number;
};
/**
 * Describes the message tank.agentctl.v1.CommitFilesResponse.
 * Use `create(CommitFilesResponseSchema)` to create a new message.
 */
export declare const CommitFilesResponseSchema: GenMessage<CommitFilesResponse>;
/**
 * The product's brand and landing page, through the run's own identity.
 *
 * @generated from message tank.agentctl.v1.SetBrandRequest
 */
export type SetBrandRequest = Message<"tank.agentctl.v1.SetBrandRequest"> & {
    /**
     * @generated from field: string icon_svg = 1;
     */
    iconSvg: string;
    /**
     * @generated from field: string primary = 2;
     */
    primary: string;
    /**
     * @generated from field: string secondary = 3;
     */
    secondary: string;
    /**
     * @generated from field: string background = 4;
     */
    background: string;
    /**
     * @generated from field: string accent = 5;
     */
    accent: string;
    /**
     * @generated from field: string tagline = 6;
     */
    tagline: string;
};
/**
 * Describes the message tank.agentctl.v1.SetBrandRequest.
 * Use `create(SetBrandRequestSchema)` to create a new message.
 */
export declare const SetBrandRequestSchema: GenMessage<SetBrandRequest>;
/**
 * @generated from message tank.agentctl.v1.SetBrandResponse
 */
export type SetBrandResponse = Message<"tank.agentctl.v1.SetBrandResponse"> & {
    /**
     * @generated from field: string icon_url = 1;
     */
    iconUrl: string;
};
/**
 * Describes the message tank.agentctl.v1.SetBrandResponse.
 * Use `create(SetBrandResponseSchema)` to create a new message.
 */
export declare const SetBrandResponseSchema: GenMessage<SetBrandResponse>;
/**
 * @generated from message tank.agentctl.v1.SetLandingRequest
 */
export type SetLandingRequest = Message<"tank.agentctl.v1.SetLandingRequest"> & {
    /**
     * @generated from field: string html = 1;
     */
    html: string;
};
/**
 * Describes the message tank.agentctl.v1.SetLandingRequest.
 * Use `create(SetLandingRequestSchema)` to create a new message.
 */
export declare const SetLandingRequestSchema: GenMessage<SetLandingRequest>;
/**
 * @generated from message tank.agentctl.v1.SetLandingResponse
 */
export type SetLandingResponse = Message<"tank.agentctl.v1.SetLandingResponse"> & {};
/**
 * Describes the message tank.agentctl.v1.SetLandingResponse.
 * Use `create(SetLandingResponseSchema)` to create a new message.
 */
export declare const SetLandingResponseSchema: GenMessage<SetLandingResponse>;
/**
 * RecordFinding writes one structured fact the agent learned about an existing tool
 * during research: what it costs, what people complain about, what it gets right, who
 * is leaving it. The board reads these across every product; prose cannot be counted.
 *
 * @generated from message tank.agentctl.v1.RecordFindingRequest
 */
export type RecordFindingRequest = Message<"tank.agentctl.v1.RecordFindingRequest"> & {
    /**
     * the tool's name as people say it: "Jobber", "QuickBooks"
     *
     * @generated from field: string tool = 1;
     */
    tool: string;
    /**
     * price | complaint | strength | gap | switching_cost | segment_leaving | evidence | other
     *
     * @generated from field: string kind = 2;
     */
    kind: string;
    /**
     * the fact in one sentence
     *
     * @generated from field: string value = 3;
     */
    value: string;
    /**
     * a number when the fact is one: a monthly price, a percentage
     *
     * @generated from field: double amount = 4;
     */
    amount: number;
    /**
     * usd_month | usd_year | percent | count | ""
     *
     * @generated from field: string unit = 5;
     */
    unit: string;
    /**
     * the words it rests on, when there are some
     *
     * @generated from field: string quote = 6;
     */
    quote: string;
    /**
     * where they were read, when there is one
     *
     * @generated from field: string url = 7;
     */
    url: string;
};
/**
 * Describes the message tank.agentctl.v1.RecordFindingRequest.
 * Use `create(RecordFindingRequestSchema)` to create a new message.
 */
export declare const RecordFindingRequestSchema: GenMessage<RecordFindingRequest>;
/**
 * @generated from message tank.agentctl.v1.RecordFindingResponse
 */
export type RecordFindingResponse = Message<"tank.agentctl.v1.RecordFindingResponse"> & {};
/**
 * Describes the message tank.agentctl.v1.RecordFindingResponse.
 * Use `create(RecordFindingResponseSchema)` to create a new message.
 */
export declare const RecordFindingResponseSchema: GenMessage<RecordFindingResponse>;
/**
 * Neuralbooks, from the thread. The run acts as the workspace's agent: the same
 * service a person uses from the page, with the same checks.
 *
 * @generated from message tank.agentctl.v1.BooksSummaryRequest
 */
export type BooksSummaryRequest = Message<"tank.agentctl.v1.BooksSummaryRequest"> & {};
/**
 * Describes the message tank.agentctl.v1.BooksSummaryRequest.
 * Use `create(BooksSummaryRequestSchema)` to create a new message.
 */
export declare const BooksSummaryRequestSchema: GenMessage<BooksSummaryRequest>;
/**
 * @generated from message tank.agentctl.v1.BooksSummaryResponse
 */
export type BooksSummaryResponse = Message<"tank.agentctl.v1.BooksSummaryResponse"> & {
    /**
     * false: say so and stop; nothing else is set
     *
     * @generated from field: bool enabled = 1;
     */
    enabled: boolean;
    /**
     * @generated from field: tank.books.v1.CashSummary summary = 2;
     */
    summary?: CashSummary;
    /**
     * @generated from field: repeated tank.books.v1.Invoice open_invoices = 3;
     */
    openInvoices: Invoice[];
    /**
     * @generated from field: repeated tank.books.v1.Customer customers = 4;
     */
    customers: Customer[];
};
/**
 * Describes the message tank.agentctl.v1.BooksSummaryResponse.
 * Use `create(BooksSummaryResponseSchema)` to create a new message.
 */
export declare const BooksSummaryResponseSchema: GenMessage<BooksSummaryResponse>;
/**
 * @generated from message tank.agentctl.v1.BooksCreateInvoiceRequest
 */
export type BooksCreateInvoiceRequest = Message<"tank.agentctl.v1.BooksCreateInvoiceRequest"> & {
    /**
     * found or created, case-insensitively
     *
     * @generated from field: string customer_name = 1;
     */
    customerName: string;
    /**
     * description, quantity, unit_cents
     *
     * @generated from field: repeated tank.books.v1.InvoiceLine lines = 2;
     */
    lines: InvoiceLine[];
    /**
     * @generated from field: int64 tax_cents = 3;
     */
    taxCents: bigint;
    /**
     * 0 = the workspace default
     *
     * @generated from field: int32 due_days = 4;
     */
    dueDays: number;
    /**
     * @generated from field: string notes = 5;
     */
    notes: string;
    /**
     * @generated from field: bool send = 6;
     */
    send: boolean;
};
/**
 * Describes the message tank.agentctl.v1.BooksCreateInvoiceRequest.
 * Use `create(BooksCreateInvoiceRequestSchema)` to create a new message.
 */
export declare const BooksCreateInvoiceRequestSchema: GenMessage<BooksCreateInvoiceRequest>;
/**
 * @generated from message tank.agentctl.v1.BooksCreateInvoiceResponse
 */
export type BooksCreateInvoiceResponse = Message<"tank.agentctl.v1.BooksCreateInvoiceResponse"> & {
    /**
     * @generated from field: tank.books.v1.Invoice invoice = 1;
     */
    invoice?: Invoice;
};
/**
 * Describes the message tank.agentctl.v1.BooksCreateInvoiceResponse.
 * Use `create(BooksCreateInvoiceResponseSchema)` to create a new message.
 */
export declare const BooksCreateInvoiceResponseSchema: GenMessage<BooksCreateInvoiceResponse>;
/**
 * @generated from message tank.agentctl.v1.BooksRecordExpenseRequest
 */
export type BooksRecordExpenseRequest = Message<"tank.agentctl.v1.BooksRecordExpenseRequest"> & {
    /**
     * @generated from field: string vendor = 1;
     */
    vendor: string;
    /**
     * @generated from field: string category = 2;
     */
    category: string;
    /**
     * @generated from field: int64 amount_cents = 3;
     */
    amountCents: bigint;
    /**
     * @generated from field: string notes = 4;
     */
    notes: string;
    /**
     * from list_attachments, when it came from a receipt
     *
     * @generated from field: string receipt_file_id = 5;
     */
    receiptFileId: string;
};
/**
 * Describes the message tank.agentctl.v1.BooksRecordExpenseRequest.
 * Use `create(BooksRecordExpenseRequestSchema)` to create a new message.
 */
export declare const BooksRecordExpenseRequestSchema: GenMessage<BooksRecordExpenseRequest>;
/**
 * @generated from message tank.agentctl.v1.BooksRecordExpenseResponse
 */
export type BooksRecordExpenseResponse = Message<"tank.agentctl.v1.BooksRecordExpenseResponse"> & {
    /**
     * @generated from field: tank.books.v1.Expense expense = 1;
     */
    expense?: Expense;
};
/**
 * Describes the message tank.agentctl.v1.BooksRecordExpenseResponse.
 * Use `create(BooksRecordExpenseResponseSchema)` to create a new message.
 */
export declare const BooksRecordExpenseResponseSchema: GenMessage<BooksRecordExpenseResponse>;
/**
 * @generated from message tank.agentctl.v1.BooksRecordPaymentRequest
 */
export type BooksRecordPaymentRequest = Message<"tank.agentctl.v1.BooksRecordPaymentRequest"> & {
    /**
     * e.g. INV-0007
     *
     * @generated from field: string invoice_number = 1;
     */
    invoiceNumber: string;
    /**
     * 0 = what is still due
     *
     * @generated from field: int64 amount_cents = 2;
     */
    amountCents: bigint;
    /**
     * @generated from field: string method = 3;
     */
    method: string;
    /**
     * @generated from field: string reference = 4;
     */
    reference: string;
};
/**
 * Describes the message tank.agentctl.v1.BooksRecordPaymentRequest.
 * Use `create(BooksRecordPaymentRequestSchema)` to create a new message.
 */
export declare const BooksRecordPaymentRequestSchema: GenMessage<BooksRecordPaymentRequest>;
/**
 * @generated from message tank.agentctl.v1.BooksRecordPaymentResponse
 */
export type BooksRecordPaymentResponse = Message<"tank.agentctl.v1.BooksRecordPaymentResponse"> & {
    /**
     * @generated from field: tank.books.v1.Invoice invoice = 1;
     */
    invoice?: Invoice;
};
/**
 * Describes the message tank.agentctl.v1.BooksRecordPaymentResponse.
 * Use `create(BooksRecordPaymentResponseSchema)` to create a new message.
 */
export declare const BooksRecordPaymentResponseSchema: GenMessage<BooksRecordPaymentResponse>;
/**
 * @generated from message tank.agentctl.v1.BooksReportRequest
 */
export type BooksReportRequest = Message<"tank.agentctl.v1.BooksReportRequest"> & {
    /**
     * this_month | last_month | this_quarter | this_year | last_30_days
     *
     * @generated from field: string period = 1;
     */
    period: string;
};
/**
 * Describes the message tank.agentctl.v1.BooksReportRequest.
 * Use `create(BooksReportRequestSchema)` to create a new message.
 */
export declare const BooksReportRequestSchema: GenMessage<BooksReportRequest>;
/**
 * Flare from the thread. The run posts as the workspace: the same service a
 * person uses from the settings page, with the same checks.
 *
 * @generated from message tank.agentctl.v1.SocialAccountsRequest
 */
export type SocialAccountsRequest = Message<"tank.agentctl.v1.SocialAccountsRequest"> & {};
/**
 * Describes the message tank.agentctl.v1.SocialAccountsRequest.
 * Use `create(SocialAccountsRequestSchema)` to create a new message.
 */
export declare const SocialAccountsRequestSchema: GenMessage<SocialAccountsRequest>;
/**
 * @generated from message tank.agentctl.v1.SocialAccountsResponse
 */
export type SocialAccountsResponse = Message<"tank.agentctl.v1.SocialAccountsResponse"> & {
    /**
     * false: say so and stop; nothing else is set
     *
     * @generated from field: bool enabled = 1;
     */
    enabled: boolean;
    /**
     * true: the post is a draft; ask for a go, then social_publish
     *
     * @generated from field: bool review_required = 2;
     */
    reviewRequired: boolean;
    /**
     * @generated from field: repeated tank.social.v1.Account accounts = 3;
     */
    accounts: Account[];
    /**
     * @generated from field: string voice = 4;
     */
    voice: string;
};
/**
 * Describes the message tank.agentctl.v1.SocialAccountsResponse.
 * Use `create(SocialAccountsResponseSchema)` to create a new message.
 */
export declare const SocialAccountsResponseSchema: GenMessage<SocialAccountsResponse>;
/**
 * @generated from message tank.agentctl.v1.SocialCreatePostRequest
 */
export type SocialCreatePostRequest = Message<"tank.agentctl.v1.SocialCreatePostRequest"> & {
    /**
     * @generated from field: tank.social.v1.Platform platform = 1;
     */
    platform: Platform;
    /**
     * @generated from field: string text = 2;
     */
    text: string;
    /**
     * from list_attachments; Instagram needs one
     *
     * @generated from field: repeated string file_ids = 3;
     */
    fileIds: string[];
};
/**
 * Describes the message tank.agentctl.v1.SocialCreatePostRequest.
 * Use `create(SocialCreatePostRequestSchema)` to create a new message.
 */
export declare const SocialCreatePostRequestSchema: GenMessage<SocialCreatePostRequest>;
/**
 * @generated from message tank.agentctl.v1.SocialCreatePostResponse
 */
export type SocialCreatePostResponse = Message<"tank.agentctl.v1.SocialCreatePostResponse"> & {
    /**
     * @generated from field: tank.social.v1.Post post = 1;
     */
    post?: Post;
    /**
     * the post is a draft until social_publish
     *
     * @generated from field: bool needs_review = 2;
     */
    needsReview: boolean;
};
/**
 * Describes the message tank.agentctl.v1.SocialCreatePostResponse.
 * Use `create(SocialCreatePostResponseSchema)` to create a new message.
 */
export declare const SocialCreatePostResponseSchema: GenMessage<SocialCreatePostResponse>;
/**
 * @generated from message tank.agentctl.v1.SocialPublishPostRequest
 */
export type SocialPublishPostRequest = Message<"tank.agentctl.v1.SocialPublishPostRequest"> & {
    /**
     * @generated from field: string post_id = 1;
     */
    postId: string;
};
/**
 * Describes the message tank.agentctl.v1.SocialPublishPostRequest.
 * Use `create(SocialPublishPostRequestSchema)` to create a new message.
 */
export declare const SocialPublishPostRequestSchema: GenMessage<SocialPublishPostRequest>;
/**
 * @generated from message tank.agentctl.v1.SocialPublishPostResponse
 */
export type SocialPublishPostResponse = Message<"tank.agentctl.v1.SocialPublishPostResponse"> & {
    /**
     * @generated from field: tank.social.v1.Post post = 1;
     */
    post?: Post;
};
/**
 * Describes the message tank.agentctl.v1.SocialPublishPostResponse.
 * Use `create(SocialPublishPostResponseSchema)` to create a new message.
 */
export declare const SocialPublishPostResponseSchema: GenMessage<SocialPublishPostResponse>;
/**
 * Neuralcanvas from the thread: write the page up, read one, ask the pages.
 *
 * @generated from message tank.agentctl.v1.WriteUpThreadRequest
 */
export type WriteUpThreadRequest = Message<"tank.agentctl.v1.WriteUpThreadRequest"> & {
    /**
     * empty lets the server name it from the thread
     *
     * @generated from field: string title = 1;
     */
    title: string;
};
/**
 * Describes the message tank.agentctl.v1.WriteUpThreadRequest.
 * Use `create(WriteUpThreadRequestSchema)` to create a new message.
 */
export declare const WriteUpThreadRequestSchema: GenMessage<WriteUpThreadRequest>;
/**
 * @generated from message tank.agentctl.v1.WriteUpThreadResponse
 */
export type WriteUpThreadResponse = Message<"tank.agentctl.v1.WriteUpThreadResponse"> & {
    /**
     * @generated from field: string canvas_id = 1;
     */
    canvasId: string;
    /**
     * @generated from field: string title = 2;
     */
    title: string;
    /**
     * @generated from field: int32 blocks = 3;
     */
    blocks: number;
    /**
     * @generated from field: int32 decisions = 4;
     */
    decisions: number;
};
/**
 * Describes the message tank.agentctl.v1.WriteUpThreadResponse.
 * Use `create(WriteUpThreadResponseSchema)` to create a new message.
 */
export declare const WriteUpThreadResponseSchema: GenMessage<WriteUpThreadResponse>;
/**
 * @generated from message tank.agentctl.v1.ReadCanvasRequest
 */
export type ReadCanvasRequest = Message<"tank.agentctl.v1.ReadCanvasRequest"> & {
    /**
     * @generated from field: string canvas_id = 1;
     */
    canvasId: string;
};
/**
 * Describes the message tank.agentctl.v1.ReadCanvasRequest.
 * Use `create(ReadCanvasRequestSchema)` to create a new message.
 */
export declare const ReadCanvasRequestSchema: GenMessage<ReadCanvasRequest>;
/**
 * @generated from message tank.agentctl.v1.ReadCanvasResponse
 */
export type ReadCanvasResponse = Message<"tank.agentctl.v1.ReadCanvasResponse"> & {
    /**
     * @generated from field: tank.canvas.v1.Canvas canvas = 1;
     */
    canvas?: Canvas;
};
/**
 * Describes the message tank.agentctl.v1.ReadCanvasResponse.
 * Use `create(ReadCanvasResponseSchema)` to create a new message.
 */
export declare const ReadCanvasResponseSchema: GenMessage<ReadCanvasResponse>;
/**
 * @generated from message tank.agentctl.v1.AskCanvasRequest
 */
export type AskCanvasRequest = Message<"tank.agentctl.v1.AskCanvasRequest"> & {
    /**
     * @generated from field: string question = 1;
     */
    question: string;
    /**
     * @generated from field: int32 limit = 2;
     */
    limit: number;
};
/**
 * Describes the message tank.agentctl.v1.AskCanvasRequest.
 * Use `create(AskCanvasRequestSchema)` to create a new message.
 */
export declare const AskCanvasRequestSchema: GenMessage<AskCanvasRequest>;
/**
 * @generated from message tank.agentctl.v1.AskCanvasResponse
 */
export type AskCanvasResponse = Message<"tank.agentctl.v1.AskCanvasResponse"> & {
    /**
     * @generated from field: string summary = 1;
     */
    summary: string;
    /**
     * @generated from field: repeated tank.canvas.v1.Answer answers = 2;
     */
    answers: Answer[];
};
/**
 * Describes the message tank.agentctl.v1.AskCanvasResponse.
 * Use `create(AskCanvasResponseSchema)` to create a new message.
 */
export declare const AskCanvasResponseSchema: GenMessage<AskCanvasResponse>;
/**
 * @generated from message tank.agentctl.v1.BooksReportResponse
 */
export type BooksReportResponse = Message<"tank.agentctl.v1.BooksReportResponse"> & {
    /**
     * @generated from field: bool enabled = 1;
     */
    enabled: boolean;
    /**
     * @generated from field: tank.books.v1.Report report = 2;
     */
    report?: Report;
};
/**
 * Describes the message tank.agentctl.v1.BooksReportResponse.
 * Use `create(BooksReportResponseSchema)` to create a new message.
 */
export declare const BooksReportResponseSchema: GenMessage<BooksReportResponse>;
/**
 * @generated from message tank.agentctl.v1.ListBoardsRequest
 */
export type ListBoardsRequest = Message<"tank.agentctl.v1.ListBoardsRequest"> & {
    /**
     * 0 takes the server's default
     *
     * @generated from field: int32 limit = 1;
     */
    limit: number;
};
/**
 * Describes the message tank.agentctl.v1.ListBoardsRequest.
 * Use `create(ListBoardsRequestSchema)` to create a new message.
 */
export declare const ListBoardsRequestSchema: GenMessage<ListBoardsRequest>;
/**
 * @generated from message tank.agentctl.v1.BoardListing
 */
export type BoardListing = Message<"tank.agentctl.v1.BoardListing"> & {
    /**
     * @generated from field: string board_id = 1;
     */
    boardId: string;
    /**
     * @generated from field: string title = 2;
     */
    title: string;
    /**
     * @generated from field: int32 objects = 3;
     */
    objects: number;
    /**
     * frames holding a running application
     *
     * @generated from field: int32 app_frames = 4;
     */
    appFrames: number;
};
/**
 * Describes the message tank.agentctl.v1.BoardListing.
 * Use `create(BoardListingSchema)` to create a new message.
 */
export declare const BoardListingSchema: GenMessage<BoardListing>;
/**
 * @generated from message tank.agentctl.v1.ListBoardsResponse
 */
export type ListBoardsResponse = Message<"tank.agentctl.v1.ListBoardsResponse"> & {
    /**
     * @generated from field: repeated tank.agentctl.v1.BoardListing boards = 1;
     */
    boards: BoardListing[];
};
/**
 * Describes the message tank.agentctl.v1.ListBoardsResponse.
 * Use `create(ListBoardsResponseSchema)` to create a new message.
 */
export declare const ListBoardsResponseSchema: GenMessage<ListBoardsResponse>;
/**
 * @generated from message tank.agentctl.v1.ReadBoardRequest
 */
export type ReadBoardRequest = Message<"tank.agentctl.v1.ReadBoardRequest"> & {
    /**
     * @generated from field: string board_id = 1;
     */
    boardId: string;
};
/**
 * Describes the message tank.agentctl.v1.ReadBoardRequest.
 * Use `create(ReadBoardRequestSchema)` to create a new message.
 */
export declare const ReadBoardRequestSchema: GenMessage<ReadBoardRequest>;
/**
 * @generated from message tank.agentctl.v1.ReadBoardResponse
 */
export type ReadBoardResponse = Message<"tank.agentctl.v1.ReadBoardResponse"> & {
    /**
     * @generated from field: tank.board.v1.Board board = 1;
     */
    board?: Board;
};
/**
 * Describes the message tank.agentctl.v1.ReadBoardResponse.
 * Use `create(ReadBoardResponseSchema)` to create a new message.
 */
export declare const ReadBoardResponseSchema: GenMessage<ReadBoardResponse>;
/**
 * One thing to draw. Compact on purpose: the model says what and where, and the
 * control plane fills in the rest of the object — paint order, revision, the style a
 * sticky note is expected to have.
 *
 * @generated from message tank.agentctl.v1.BoardShape
 */
export type BoardShape = Message<"tank.agentctl.v1.BoardShape"> & {
    /**
     * empty draws a new one; an id from read_board changes that one
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * frame | rect | ellipse | line | arrow | text | sticky | connector
     *
     * @generated from field: string kind = 2;
     */
    kind: string;
    /**
     * @generated from field: double x = 3;
     */
    x: number;
    /**
     * @generated from field: double y = 4;
     */
    y: number;
    /**
     * @generated from field: double w = 5;
     */
    w: number;
    /**
     * @generated from field: double h = 6;
     */
    h: number;
    /**
     * @generated from field: string text = 7;
     */
    text: string;
    /**
     * #rrggbb; empty takes the kind's default
     *
     * @generated from field: string fill = 8;
     */
    fill: string;
    /**
     * the frame it sits inside
     *
     * @generated from field: string parent_id = 9;
     */
    parentId: string;
    /**
     * connector: what it comes from
     *
     * @generated from field: string from_id = 10;
     */
    fromId: string;
    /**
     * connector: what it goes to
     *
     * @generated from field: string to_id = 11;
     */
    toId: string;
    /**
     * kind "image": one of this run's own artifacts (attach_preview returns the id).
     *
     * @generated from field: string file_id = 12;
     */
    fileId: string;
    /**
     * Step frames on a Workbench: pending | running | done | failed; the fill follows.
     *
     * @generated from field: string status = 13;
     */
    status: string;
    /**
     * kind "frame": the frame shows a running app; the server resolves where it is served.
     *
     * @generated from field: tank.agentctl.v1.AppFrameSpec app = 14;
     */
    app?: AppFrameSpec;
};
/**
 * Describes the message tank.agentctl.v1.BoardShape.
 * Use `create(BoardShapeSchema)` to create a new message.
 */
export declare const BoardShapeSchema: GenMessage<BoardShape>;
/**
 * @generated from message tank.agentctl.v1.AppFrameSpec
 */
export type AppFrameSpec = Message<"tank.agentctl.v1.AppFrameSpec"> & {
    /**
     * owner/name
     *
     * @generated from field: string repo = 1;
     */
    repo: string;
    /**
     * branch or sha
     *
     * @generated from field: string ref = 2;
     */
    ref: string;
    /**
     * route inside the app
     *
     * @generated from field: string path = 3;
     */
    path: string;
    /**
     * 0 takes 1280
     *
     * @generated from field: int32 viewport_width = 4;
     */
    viewportWidth: number;
    /**
     * 0 takes 800
     *
     * @generated from field: int32 viewport_height = 5;
     */
    viewportHeight: number;
};
/**
 * Describes the message tank.agentctl.v1.AppFrameSpec.
 * Use `create(AppFrameSpecSchema)` to create a new message.
 */
export declare const AppFrameSpecSchema: GenMessage<AppFrameSpec>;
/**
 * The Workbench: the process row across the top of the thread's board, and the stage
 * below it. The control plane does the layout so the model never computes coordinates.
 *
 * @generated from message tank.agentctl.v1.WorkbenchStep
 */
export type WorkbenchStep = Message<"tank.agentctl.v1.WorkbenchStep"> & {
    /**
     * stable across calls, e.g. "plan", "tests", "deploy"
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string title = 2;
     */
    title: string;
    /**
     * pending | running | done | failed
     *
     * @generated from field: string status = 3;
     */
    status: string;
};
/**
 * Describes the message tank.agentctl.v1.WorkbenchStep.
 * Use `create(WorkbenchStepSchema)` to create a new message.
 */
export declare const WorkbenchStepSchema: GenMessage<WorkbenchStep>;
/**
 * @generated from message tank.agentctl.v1.WorkbenchStepsRequest
 */
export type WorkbenchStepsRequest = Message<"tank.agentctl.v1.WorkbenchStepsRequest"> & {
    /**
     * the whole row, in order; a step left out is removed
     *
     * @generated from field: repeated tank.agentctl.v1.WorkbenchStep steps = 1;
     */
    steps: WorkbenchStep[];
};
/**
 * Describes the message tank.agentctl.v1.WorkbenchStepsRequest.
 * Use `create(WorkbenchStepsRequestSchema)` to create a new message.
 */
export declare const WorkbenchStepsRequestSchema: GenMessage<WorkbenchStepsRequest>;
/**
 * @generated from message tank.agentctl.v1.WorkbenchStepsResponse
 */
export type WorkbenchStepsResponse = Message<"tank.agentctl.v1.WorkbenchStepsResponse"> & {
    /**
     * @generated from field: string board_id = 1;
     */
    boardId: string;
};
/**
 * Describes the message tank.agentctl.v1.WorkbenchStepsResponse.
 * Use `create(WorkbenchStepsResponseSchema)` to create a new message.
 */
export declare const WorkbenchStepsResponseSchema: GenMessage<WorkbenchStepsResponse>;
/**
 * @generated from message tank.agentctl.v1.WorkbenchShowRequest
 */
export type WorkbenchShowRequest = Message<"tank.agentctl.v1.WorkbenchShowRequest"> & {
    /**
     * slides | screen | diagram | note | image
     *
     * @generated from field: string kind = 1;
     */
    kind: string;
    /**
     * slides, image, screen (a screenshot): this run's artifacts, in order
     *
     * @generated from field: repeated string file_ids = 2;
     */
    fileIds: string[];
    /**
     * screen: a running build the platform serves
     *
     * @generated from field: tank.agentctl.v1.AppFrameSpec app = 3;
     */
    app?: AppFrameSpec;
    /**
     * note: what the sticky says; also the caption under a stage
     *
     * @generated from field: string text = 4;
     */
    text: string;
    /**
     * diagram: erd | architecture, drawn by the server from the repository
     *
     * @generated from field: string diagram = 5;
     */
    diagram: string;
    /**
     * the stage's heading
     *
     * @generated from field: string title = 6;
     */
    title: string;
};
/**
 * Describes the message tank.agentctl.v1.WorkbenchShowRequest.
 * Use `create(WorkbenchShowRequestSchema)` to create a new message.
 */
export declare const WorkbenchShowRequestSchema: GenMessage<WorkbenchShowRequest>;
/**
 * @generated from message tank.agentctl.v1.WorkbenchShowResponse
 */
export type WorkbenchShowResponse = Message<"tank.agentctl.v1.WorkbenchShowResponse"> & {
    /**
     * @generated from field: string board_id = 1;
     */
    boardId: string;
    /**
     * @generated from field: repeated string object_ids = 2;
     */
    objectIds: string[];
};
/**
 * Describes the message tank.agentctl.v1.WorkbenchShowResponse.
 * Use `create(WorkbenchShowResponseSchema)` to create a new message.
 */
export declare const WorkbenchShowResponseSchema: GenMessage<WorkbenchShowResponse>;
/**
 * @generated from message tank.agentctl.v1.DrawOnBoardRequest
 */
export type DrawOnBoardRequest = Message<"tank.agentctl.v1.DrawOnBoardRequest"> & {
    /**
     * @generated from field: string board_id = 1;
     */
    boardId: string;
    /**
     * @generated from field: repeated tank.agentctl.v1.BoardShape shapes = 2;
     */
    shapes: BoardShape[];
    /**
     * @generated from field: repeated string delete_ids = 3;
     */
    deleteIds: string[];
    /**
     * The revisions the agent last read, keyed by object id, so a shape a person moved
     * since is reported rather than overwritten.
     *
     * @generated from field: map<string, int32> base_revs = 4;
     */
    baseRevs: {
        [key: string]: number;
    };
};
/**
 * Describes the message tank.agentctl.v1.DrawOnBoardRequest.
 * Use `create(DrawOnBoardRequestSchema)` to create a new message.
 */
export declare const DrawOnBoardRequestSchema: GenMessage<DrawOnBoardRequest>;
/**
 * @generated from message tank.agentctl.v1.DrawOnBoardResponse
 */
export type DrawOnBoardResponse = Message<"tank.agentctl.v1.DrawOnBoardResponse"> & {
    /**
     * what was written, in the order asked
     *
     * @generated from field: repeated string object_ids = 1;
     */
    objectIds: string[];
    /**
     * how many are on the board now
     *
     * @generated from field: int32 objects = 2;
     */
    objects: number;
    /**
     * left alone because somebody else had moved them
     *
     * @generated from field: repeated string conflict_ids = 3;
     */
    conflictIds: string[];
    /**
     * @generated from field: string conflict_note = 4;
     */
    conflictNote: string;
};
/**
 * Describes the message tank.agentctl.v1.DrawOnBoardResponse.
 * Use `create(DrawOnBoardResponseSchema)` to create a new message.
 */
export declare const DrawOnBoardResponseSchema: GenMessage<DrawOnBoardResponse>;
/**
 * @generated from message tank.agentctl.v1.ArrangeBoardRequest
 */
export type ArrangeBoardRequest = Message<"tank.agentctl.v1.ArrangeBoardRequest"> & {
    /**
     * @generated from field: string board_id = 1;
     */
    boardId: string;
    /**
     * @generated from field: repeated string object_ids = 2;
     */
    objectIds: string[];
    /**
     * row | column | grid
     *
     * @generated from field: string layout = 3;
     */
    layout: string;
    /**
     * 0 takes the default
     *
     * @generated from field: double gap = 4;
     */
    gap: number;
    /**
     * grid only; 0 picks a near-square
     *
     * @generated from field: int32 columns = 5;
     */
    columns: number;
    /**
     * @generated from field: map<string, int32> base_revs = 6;
     */
    baseRevs: {
        [key: string]: number;
    };
};
/**
 * Describes the message tank.agentctl.v1.ArrangeBoardRequest.
 * Use `create(ArrangeBoardRequestSchema)` to create a new message.
 */
export declare const ArrangeBoardRequestSchema: GenMessage<ArrangeBoardRequest>;
/**
 * @generated from message tank.agentctl.v1.ArrangeBoardResponse
 */
export type ArrangeBoardResponse = Message<"tank.agentctl.v1.ArrangeBoardResponse"> & {
    /**
     * @generated from field: int32 moved = 1;
     */
    moved: number;
    /**
     * what the result looks like, in a sentence
     *
     * @generated from field: string note = 2;
     */
    note: string;
    /**
     * @generated from field: repeated string conflict_ids = 3;
     */
    conflictIds: string[];
    /**
     * @generated from field: string conflict_note = 4;
     */
    conflictNote: string;
};
/**
 * Describes the message tank.agentctl.v1.ArrangeBoardResponse.
 * Use `create(ArrangeBoardResponseSchema)` to create a new message.
 */
export declare const ArrangeBoardResponseSchema: GenMessage<ArrangeBoardResponse>;
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
    /**
     * "" for an ordinary run; "neural" for a Neural Knowledge refresh, which
     * skips planning and works in `repo` regardless of the Tread's binding.
     *
     * @generated from field: string mode = 7;
     */
    mode: string;
    /**
     * owner/name; required for mode "neural"
     *
     * @generated from field: string repo = 8;
     */
    repo: string;
    /**
     * Run without reading or writing the repository's Neural Knowledge. For measuring
     * the layer: the same task with and without it.
     *
     * @generated from field: bool skip_neural_knowledge = 9;
     */
    skipNeuralKnowledge: boolean;
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
 * Refresh a repository's Neural Knowledge: the control plane finds a Tread in the
 * workspace with access to the repository, keeps one standing thread per repository
 * for the refreshes, and starts a neural run there. Idempotent while one is active.
 *
 * @generated from message tank.agentctl.v1.RefreshNeuralKnowledgeRequest
 */
export type RefreshNeuralKnowledgeRequest = Message<"tank.agentctl.v1.RefreshNeuralKnowledgeRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * owner/name
     *
     * @generated from field: string repo = 2;
     */
    repo: string;
    /**
     * user id; empty means the platform (a push)
     *
     * @generated from field: string requested_by = 3;
     */
    requestedBy: string;
};
/**
 * Describes the message tank.agentctl.v1.RefreshNeuralKnowledgeRequest.
 * Use `create(RefreshNeuralKnowledgeRequestSchema)` to create a new message.
 */
export declare const RefreshNeuralKnowledgeRequestSchema: GenMessage<RefreshNeuralKnowledgeRequest>;
/**
 * @generated from message tank.agentctl.v1.RefreshNeuralKnowledgeResponse
 */
export type RefreshNeuralKnowledgeResponse = Message<"tank.agentctl.v1.RefreshNeuralKnowledgeResponse"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: string thread_root_id = 2;
     */
    threadRootId: string;
    /**
     * false when a refresh was already running for this repository
     *
     * @generated from field: bool started = 3;
     */
    started: boolean;
};
/**
 * Describes the message tank.agentctl.v1.RefreshNeuralKnowledgeResponse.
 * Use `create(RefreshNeuralKnowledgeResponseSchema)` to create a new message.
 */
export declare const RefreshNeuralKnowledgeResponseSchema: GenMessage<RefreshNeuralKnowledgeResponse>;
/**
 * Opens a thread in a Tread as the workspace's agent and returns its root. Used by
 * the platform when it needs a thread of its own: a measurement run, a refresh.
 *
 * @generated from message tank.agentctl.v1.OpenThreadRequest
 */
export type OpenThreadRequest = Message<"tank.agentctl.v1.OpenThreadRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * @generated from field: string text = 3;
     */
    text: string;
};
/**
 * Describes the message tank.agentctl.v1.OpenThreadRequest.
 * Use `create(OpenThreadRequestSchema)` to create a new message.
 */
export declare const OpenThreadRequestSchema: GenMessage<OpenThreadRequest>;
/**
 * @generated from message tank.agentctl.v1.OpenThreadResponse
 */
export type OpenThreadResponse = Message<"tank.agentctl.v1.OpenThreadResponse"> & {
    /**
     * @generated from field: string thread_root_id = 1;
     */
    threadRootId: string;
};
/**
 * Describes the message tank.agentctl.v1.OpenThreadResponse.
 * Use `create(OpenThreadResponseSchema)` to create a new message.
 */
export declare const OpenThreadResponseSchema: GenMessage<OpenThreadResponse>;
/**
 * The control plane composes the workflow file itself: only it can see the repository,
 * so only it knows which workflows the file should run after and what the default
 * branch is called. api passes the things only api knows — where TANK answers, which
 * workspace is reporting, and the name of the secret holding the token.
 *
 * @generated from message tank.agentctl.v1.SetUpPreviewWorkflowRequest
 */
export type SetUpPreviewWorkflowRequest = Message<"tank.agentctl.v1.SetUpPreviewWorkflowRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * owner/name each
     *
     * @generated from field: repeated string repos = 2;
     */
    repos: string[];
    /**
     * empty = each repository's own default branch
     *
     * @generated from field: string base_branch = 3;
     */
    baseBranch: string;
    /**
     * the TANK origin their CI posts to, e.g. https://api.tank.chat
     *
     * @generated from field: string api_url = 4;
     */
    apiUrl: string;
    /**
     * the repository secret holding the TANK token
     *
     * @generated from field: string secret_name = 5;
     */
    secretName: string;
    /**
     * head branch to push to; empty = tank/preview-reporting
     *
     * @generated from field: string branch = 6;
     */
    branch: string;
};
/**
 * Describes the message tank.agentctl.v1.SetUpPreviewWorkflowRequest.
 * Use `create(SetUpPreviewWorkflowRequestSchema)` to create a new message.
 */
export declare const SetUpPreviewWorkflowRequestSchema: GenMessage<SetUpPreviewWorkflowRequest>;
/**
 * @generated from message tank.agentctl.v1.PreviewWorkflowResult
 */
export type PreviewWorkflowResult = Message<"tank.agentctl.v1.PreviewWorkflowResult"> & {
    /**
     * @generated from field: string repo = 1;
     */
    repo: string;
    /**
     * opened | already_open | refused
     *
     * @generated from field: string status = 2;
     */
    status: string;
    /**
     * @generated from field: string pull_request_url = 3;
     */
    pullRequestUrl: string;
    /**
     * @generated from field: string branch = 4;
     */
    branch: string;
    /**
     * @generated from field: string base_branch = 5;
     */
    baseBranch: string;
    /**
     * @generated from field: string workflow_path = 6;
     */
    workflowPath: string;
    /**
     * why it was refused, in a sentence; empty otherwise
     *
     * @generated from field: string reason = 7;
     */
    reason: string;
};
/**
 * Describes the message tank.agentctl.v1.PreviewWorkflowResult.
 * Use `create(PreviewWorkflowResultSchema)` to create a new message.
 */
export declare const PreviewWorkflowResultSchema: GenMessage<PreviewWorkflowResult>;
/**
 * @generated from message tank.agentctl.v1.SetUpPreviewWorkflowResponse
 */
export type SetUpPreviewWorkflowResponse = Message<"tank.agentctl.v1.SetUpPreviewWorkflowResponse"> & {
    /**
     * @generated from field: repeated tank.agentctl.v1.PreviewWorkflowResult results = 1;
     */
    results: PreviewWorkflowResult[];
};
/**
 * Describes the message tank.agentctl.v1.SetUpPreviewWorkflowResponse.
 * Use `create(SetUpPreviewWorkflowResponseSchema)` to create a new message.
 */
export declare const SetUpPreviewWorkflowResponseSchema: GenMessage<SetUpPreviewWorkflowResponse>;
/**
 * @generated from message tank.agentctl.v1.RegisterDeploymentRequest
 */
export type RegisterDeploymentRequest = Message<"tank.agentctl.v1.RegisterDeploymentRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * <slug>.tank.chat
     *
     * @generated from field: string slug = 2;
     */
    slug: string;
    /**
     * owner/name the images come from
     *
     * @generated from field: string repo = 3;
     */
    repo: string;
    /**
     * @generated from field: string description = 4;
     */
    description: string;
};
/**
 * Describes the message tank.agentctl.v1.RegisterDeploymentRequest.
 * Use `create(RegisterDeploymentRequestSchema)` to create a new message.
 */
export declare const RegisterDeploymentRequestSchema: GenMessage<RegisterDeploymentRequest>;
/**
 * @generated from message tank.agentctl.v1.RegisterDeploymentResponse
 */
export type RegisterDeploymentResponse = Message<"tank.agentctl.v1.RegisterDeploymentResponse"> & {
    /**
     * @generated from field: string url = 1;
     */
    url: string;
};
/**
 * Describes the message tank.agentctl.v1.RegisterDeploymentResponse.
 * Use `create(RegisterDeploymentResponseSchema)` to create a new message.
 */
export declare const RegisterDeploymentResponseSchema: GenMessage<RegisterDeploymentResponse>;
/**
 * @generated from message tank.agentctl.v1.GetDeploymentRequest
 */
export type GetDeploymentRequest = Message<"tank.agentctl.v1.GetDeploymentRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
};
/**
 * Describes the message tank.agentctl.v1.GetDeploymentRequest.
 * Use `create(GetDeploymentRequestSchema)` to create a new message.
 */
export declare const GetDeploymentRequestSchema: GenMessage<GetDeploymentRequest>;
/**
 * One process of a product: a service, a worker, a schedule or a job.
 *
 * @generated from message tank.agentctl.v1.ProductProcess
 */
export type ProductProcess = Message<"tank.agentctl.v1.ProductProcess"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * service | worker | cron | job
     *
     * @generated from field: string kind = 2;
     */
    kind: string;
    /**
     * s | m | l | xl | 2xl
     *
     * @generated from field: string size = 3;
     */
    size: string;
    /**
     * @generated from field: string cpu = 4;
     */
    cpu: string;
    /**
     * @generated from field: string memory = 5;
     */
    memory: string;
    /**
     * @generated from field: int32 port = 6;
     */
    port: number;
    /**
     * served at <slug>.tank.chat (web)
     *
     * @generated from field: bool public = 7;
     */
    public: boolean;
    /**
     * @generated from field: int32 min = 8;
     */
    min: number;
    /**
     * @generated from field: int32 max = 9;
     */
    max: number;
    /**
     * @generated from field: string schedule = 10;
     */
    schedule: string;
    /**
     * @generated from field: int32 timeout_seconds = 11;
     */
    timeoutSeconds: number;
    /**
     * @generated from field: repeated string command = 12;
     */
    command: string[];
    /**
     * web's data volume, "20Gi"
     *
     * @generated from field: string volume = 13;
     */
    volume: string;
    /**
     * working disk at /scratch for a worker, schedule or job
     *
     * @generated from field: int32 scratch_gi = 14;
     */
    scratchGi: number;
};
/**
 * Describes the message tank.agentctl.v1.ProductProcess.
 * Use `create(ProductProcessSchema)` to create a new message.
 */
export declare const ProductProcessSchema: GenMessage<ProductProcess>;
/**
 * What else a product is made of besides its processes.
 *
 * @generated from message tank.agentctl.v1.ProductParts
 */
export type ProductParts = Message<"tank.agentctl.v1.ProductParts"> & {
    /**
     * @generated from field: repeated tank.agentctl.v1.ProductDatabase databases = 1;
     */
    databases: ProductDatabase[];
    /**
     * empty: no cache
     *
     * @generated from field: string cache_size = 2;
     */
    cacheSize: string;
    /**
     * @generated from field: repeated string buckets = 3;
     */
    buckets: string[];
    /**
     * @generated from field: repeated string datasets = 4;
     */
    datasets: string[];
    /**
     * every dataset TANK's library offers
     *
     * @generated from field: repeated string library = 5;
     */
    library: string[];
};
/**
 * Describes the message tank.agentctl.v1.ProductParts.
 * Use `create(ProductPartsSchema)` to create a new message.
 */
export declare const ProductPartsSchema: GenMessage<ProductParts>;
/**
 * @generated from message tank.agentctl.v1.ProductDatabase
 */
export type ProductDatabase = Message<"tank.agentctl.v1.ProductDatabase"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string size = 2;
     */
    size: string;
    /**
     * "20Gi"
     *
     * @generated from field: string storage = 3;
     */
    storage: string;
    /**
     * @generated from field: repeated string extensions = 4;
     */
    extensions: string[];
};
/**
 * Describes the message tank.agentctl.v1.ProductDatabase.
 * Use `create(ProductDatabaseSchema)` to create a new message.
 */
export declare const ProductDatabaseSchema: GenMessage<ProductDatabase>;
/**
 * One change to tank.yaml from hosting settings. kind and name say what it is about.
 *
 * @generated from message tank.agentctl.v1.ProductSpecChange
 */
export type ProductSpecChange = Message<"tank.agentctl.v1.ProductSpecChange"> & {
    /**
     * service | worker | cron | job | database | cache | bucket | dataset | env
     *
     * @generated from field: string kind = 1;
     */
    kind: string;
    /**
     * empty for cache
     *
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: bool remove = 3;
     */
    remove: boolean;
    /**
     * empty leaves it
     *
     * @generated from field: string size = 4;
     */
    size: string;
    /**
     * 0 leaves it
     *
     * @generated from field: int32 min = 5;
     */
    min: number;
    /**
     * @generated from field: int32 max = 6;
     */
    max: number;
    /**
     * @generated from field: string schedule = 7;
     */
    schedule: string;
    /**
     * a database's storage, or web's /data volume: "40Gi"
     *
     * @generated from field: string storage = 8;
     */
    storage: string;
    /**
     * @generated from field: repeated string extensions = 9;
     */
    extensions: string[];
    /**
     * @generated from field: repeated string command = 10;
     */
    command: string[];
    /**
     * "50Gi"; "0" removes it
     *
     * @generated from field: string scratch = 11;
     */
    scratch: string;
    /**
     * @generated from field: string timeout = 12;
     */
    timeout: string;
    /**
     * env
     *
     * @generated from field: string value = 13;
     */
    value: string;
};
/**
 * Describes the message tank.agentctl.v1.ProductSpecChange.
 * Use `create(ProductSpecChangeSchema)` to create a new message.
 */
export declare const ProductSpecChangeSchema: GenMessage<ProductSpecChange>;
/**
 * @generated from message tank.agentctl.v1.PreviewProductSpecRequest
 */
export type PreviewProductSpecRequest = Message<"tank.agentctl.v1.PreviewProductSpecRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
    /**
     * @generated from oneof tank.agentctl.v1.PreviewProductSpecRequest.edit
     */
    edit: {
        /**
         * @generated from field: tank.agentctl.v1.ProductSpecChange change = 2;
         */
        value: ProductSpecChange;
        case: "change";
    } | {
        /**
         * the whole tank.yaml
         *
         * @generated from field: string text = 3;
         */
        value: string;
        case: "text";
    } | {
        case: undefined;
        value?: undefined;
    };
};
/**
 * Describes the message tank.agentctl.v1.PreviewProductSpecRequest.
 * Use `create(PreviewProductSpecRequestSchema)` to create a new message.
 */
export declare const PreviewProductSpecRequestSchema: GenMessage<PreviewProductSpecRequest>;
/**
 * @generated from message tank.agentctl.v1.PreviewProductSpecResponse
 */
export type PreviewProductSpecResponse = Message<"tank.agentctl.v1.PreviewProductSpecResponse"> & {
    /**
     * tank.yaml as it would be
     *
     * @generated from field: string text = 1;
     */
    text: string;
    /**
     * what the running build costs
     *
     * @generated from field: tank.agentctl.v1.ProductCost before = 2;
     */
    before?: ProductCost;
    /**
     * @generated from field: tank.agentctl.v1.ProductCost after = 3;
     */
    after?: ProductCost;
    /**
     * non-empty: the change cannot be made as it is
     *
     * @generated from field: repeated string problems = 4;
     */
    problems: string[];
};
/**
 * Describes the message tank.agentctl.v1.PreviewProductSpecResponse.
 * Use `create(PreviewProductSpecResponseSchema)` to create a new message.
 */
export declare const PreviewProductSpecResponseSchema: GenMessage<PreviewProductSpecResponse>;
/**
 * @generated from message tank.agentctl.v1.ApplyProductSpecRequest
 */
export type ApplyProductSpecRequest = Message<"tank.agentctl.v1.ApplyProductSpecRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
    /**
     * @generated from oneof tank.agentctl.v1.ApplyProductSpecRequest.edit
     */
    edit: {
        /**
         * @generated from field: tank.agentctl.v1.ProductSpecChange change = 2;
         */
        value: ProductSpecChange;
        case: "change";
    } | {
        /**
         * @generated from field: string text = 3;
         */
        value: string;
        case: "text";
    } | {
        case: undefined;
        value?: undefined;
    };
    /**
     * @generated from field: string author_name = 4;
     */
    authorName: string;
    /**
     * @generated from field: string author_email = 5;
     */
    authorEmail: string;
    /**
     * The monthly total an owner saw and accepted. A change that costs more lands at once
     * when this equals its estimate; otherwise it waits for an owner like any build.
     *
     * @generated from field: int64 accepted_total_cents = 6;
     */
    acceptedTotalCents: bigint;
    /**
     * @generated from field: string accepted_by = 7;
     */
    acceptedBy: string;
};
/**
 * Describes the message tank.agentctl.v1.ApplyProductSpecRequest.
 * Use `create(ApplyProductSpecRequestSchema)` to create a new message.
 */
export declare const ApplyProductSpecRequestSchema: GenMessage<ApplyProductSpecRequest>;
/**
 * @generated from message tank.agentctl.v1.ApplyProductSpecResponse
 */
export type ApplyProductSpecResponse = Message<"tank.agentctl.v1.ApplyProductSpecResponse"> & {
    /**
     * @generated from field: string commit_sha = 1;
     */
    commitSha: string;
    /**
     * @generated from field: tank.agentctl.v1.ProductCost estimate = 2;
     */
    estimate?: ProductCost;
    /**
     * false: held, see GetProductSpec's pending
     *
     * @generated from field: bool live = 3;
     */
    live: boolean;
};
/**
 * Describes the message tank.agentctl.v1.ApplyProductSpecResponse.
 * Use `create(ApplyProductSpecResponseSchema)` to create a new message.
 */
export declare const ApplyProductSpecResponseSchema: GenMessage<ApplyProductSpecResponse>;
/**
 * @generated from message tank.agentctl.v1.GetProductSpecTextRequest
 */
export type GetProductSpecTextRequest = Message<"tank.agentctl.v1.GetProductSpecTextRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
};
/**
 * Describes the message tank.agentctl.v1.GetProductSpecTextRequest.
 * Use `create(GetProductSpecTextRequestSchema)` to create a new message.
 */
export declare const GetProductSpecTextRequestSchema: GenMessage<GetProductSpecTextRequest>;
/**
 * @generated from message tank.agentctl.v1.GetProductSpecTextResponse
 */
export type GetProductSpecTextResponse = Message<"tank.agentctl.v1.GetProductSpecTextResponse"> & {
    /**
     * empty: the product has no tank.yaml yet
     *
     * @generated from field: string text = 1;
     */
    text: string;
};
/**
 * Describes the message tank.agentctl.v1.GetProductSpecTextResponse.
 * Use `create(GetProductSpecTextResponseSchema)` to create a new message.
 */
export declare const GetProductSpecTextResponseSchema: GenMessage<GetProductSpecTextResponse>;
/**
 * @generated from message tank.agentctl.v1.ProductCost
 */
export type ProductCost = Message<"tank.agentctl.v1.ProductCost"> & {
    /**
     * @generated from field: int64 base_cents = 1;
     */
    baseCents: bigint;
    /**
     * @generated from field: int64 overage_cents = 2;
     */
    overageCents: bigint;
    /**
     * @generated from field: repeated string lines = 3;
     */
    lines: string[];
};
/**
 * Describes the message tank.agentctl.v1.ProductCost.
 * Use `create(ProductCostSchema)` to create a new message.
 */
export declare const ProductCostSchema: GenMessage<ProductCost>;
/**
 * @generated from message tank.agentctl.v1.PendingBuild
 */
export type PendingBuild = Message<"tank.agentctl.v1.PendingBuild"> & {
    /**
     * @generated from field: string sha = 1;
     */
    sha: string;
    /**
     * spec | cost
     *
     * @generated from field: string reason = 2;
     */
    reason: string;
    /**
     * @generated from field: repeated string problems = 3;
     */
    problems: string[];
    /**
     * @generated from field: tank.agentctl.v1.ProductCost estimate = 4;
     */
    estimate?: ProductCost;
    /**
     * RFC 3339
     *
     * @generated from field: string at = 5;
     */
    at: string;
    /**
     * @generated from field: repeated tank.agentctl.v1.ProductProcess processes = 6;
     */
    processes: ProductProcess[];
};
/**
 * Describes the message tank.agentctl.v1.PendingBuild.
 * Use `create(PendingBuildSchema)` to create a new message.
 */
export declare const PendingBuildSchema: GenMessage<PendingBuild>;
/**
 * @generated from message tank.agentctl.v1.ProcessState
 */
export type ProcessState = Message<"tank.agentctl.v1.ProcessState"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string kind = 2;
     */
    kind: string;
    /**
     * @generated from field: int32 desired = 3;
     */
    desired: number;
    /**
     * @generated from field: int32 ready = 4;
     */
    ready: number;
    /**
     * a paused schedule
     *
     * @generated from field: bool suspended = 5;
     */
    suspended: boolean;
    /**
     * RFC 3339, schedules and jobs
     *
     * @generated from field: string last_run_at = 6;
     */
    lastRunAt: string;
    /**
     * succeeded | failed | running
     *
     * @generated from field: string last_run_result = 7;
     */
    lastRunResult: string;
};
/**
 * Describes the message tank.agentctl.v1.ProcessState.
 * Use `create(ProcessStateSchema)` to create a new message.
 */
export declare const ProcessStateSchema: GenMessage<ProcessState>;
/**
 * @generated from message tank.agentctl.v1.JobRun
 */
export type JobRun = Message<"tank.agentctl.v1.JobRun"> & {
    /**
     * @generated from field: string job = 1;
     */
    job: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
};
/**
 * Describes the message tank.agentctl.v1.JobRun.
 * Use `create(JobRunSchema)` to create a new message.
 */
export declare const JobRunSchema: GenMessage<JobRun>;
/**
 * @generated from message tank.agentctl.v1.ProductChange
 */
export type ProductChange = Message<"tank.agentctl.v1.ProductChange"> & {
    /**
     * the GitOps commit
     *
     * @generated from field: string sha = 1;
     */
    sha: string;
    /**
     * @generated from field: string message = 2;
     */
    message: string;
    /**
     * RFC 3339
     *
     * @generated from field: string at = 3;
     */
    at: string;
    /**
     * the build the product ran after it, when it changed
     *
     * @generated from field: string image_tag = 4;
     */
    imageTag: string;
};
/**
 * Describes the message tank.agentctl.v1.ProductChange.
 * Use `create(ProductChangeSchema)` to create a new message.
 */
export declare const ProductChangeSchema: GenMessage<ProductChange>;
/**
 * @generated from message tank.agentctl.v1.ValidateSpecRequest
 */
export type ValidateSpecRequest = Message<"tank.agentctl.v1.ValidateSpecRequest"> & {
    /**
     * @generated from field: string tank_yaml = 1;
     */
    tankYaml: string;
};
/**
 * Describes the message tank.agentctl.v1.ValidateSpecRequest.
 * Use `create(ValidateSpecRequestSchema)` to create a new message.
 */
export declare const ValidateSpecRequestSchema: GenMessage<ValidateSpecRequest>;
/**
 * @generated from message tank.agentctl.v1.ValidateSpecResponse
 */
export type ValidateSpecResponse = Message<"tank.agentctl.v1.ValidateSpecResponse"> & {
    /**
     * @generated from field: bool ok = 1;
     */
    ok: boolean;
    /**
     * @generated from field: repeated string problems = 2;
     */
    problems: string[];
    /**
     * @generated from field: tank.agentctl.v1.ProductCost estimate = 3;
     */
    estimate?: ProductCost;
    /**
     * @generated from field: repeated tank.agentctl.v1.ProductProcess processes = 4;
     */
    processes: ProductProcess[];
};
/**
 * Describes the message tank.agentctl.v1.ValidateSpecResponse.
 * Use `create(ValidateSpecResponseSchema)` to create a new message.
 */
export declare const ValidateSpecResponseSchema: GenMessage<ValidateSpecResponse>;
/**
 * @generated from message tank.agentctl.v1.GetProductSpecRequest
 */
export type GetProductSpecRequest = Message<"tank.agentctl.v1.GetProductSpecRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
};
/**
 * Describes the message tank.agentctl.v1.GetProductSpecRequest.
 * Use `create(GetProductSpecRequestSchema)` to create a new message.
 */
export declare const GetProductSpecRequestSchema: GenMessage<GetProductSpecRequest>;
/**
 * @generated from message tank.agentctl.v1.GetProductSpecResponse
 */
export type GetProductSpecResponse = Message<"tank.agentctl.v1.GetProductSpecResponse"> & {
    /**
     * empty: the single web process of a product with no tank.yaml
     *
     * @generated from field: repeated tank.agentctl.v1.ProductProcess processes = 1;
     */
    processes: ProductProcess[];
    /**
     * @generated from field: tank.agentctl.v1.ProductCost estimate = 2;
     */
    estimate?: ProductCost;
    /**
     * @generated from field: tank.agentctl.v1.PendingBuild pending = 3;
     */
    pending?: PendingBuild;
    /**
     * @generated from field: string restarted_at = 4;
     */
    restartedAt: string;
    /**
     * @generated from field: repeated string paused = 5;
     */
    paused: string[];
    /**
     * @generated from field: repeated tank.agentctl.v1.JobRun runs = 6;
     */
    runs: JobRun[];
    /**
     * @generated from field: repeated string env_keys = 7;
     */
    envKeys: string[];
    /**
     * @generated from field: repeated string secrets = 8;
     */
    secrets: string[];
    /**
     * open pull requests' previews
     *
     * @generated from field: repeated tank.agentctl.v1.ProductPreview previews = 9;
     */
    previews: ProductPreview[];
    /**
     * the declared secrets that have a value
     *
     * @generated from field: repeated string secrets_set = 10;
     */
    secretsSet: string[];
    /**
     * @generated from field: tank.agentctl.v1.ProductParts parts = 11;
     */
    parts?: ProductParts;
};
/**
 * Describes the message tank.agentctl.v1.GetProductSpecResponse.
 * Use `create(GetProductSpecResponseSchema)` to create a new message.
 */
export declare const GetProductSpecResponseSchema: GenMessage<GetProductSpecResponse>;
/**
 * @generated from message tank.agentctl.v1.ProductPreview
 */
export type ProductPreview = Message<"tank.agentctl.v1.ProductPreview"> & {
    /**
     * @generated from field: int32 pull_request = 1;
     */
    pullRequest: number;
    /**
     * @generated from field: string url = 2;
     */
    url: string;
    /**
     * @generated from field: string image_tag = 3;
     */
    imageTag: string;
    /**
     * RFC 3339
     *
     * @generated from field: string expires_at = 4;
     */
    expiresAt: string;
};
/**
 * Describes the message tank.agentctl.v1.ProductPreview.
 * Use `create(ProductPreviewSchema)` to create a new message.
 */
export declare const ProductPreviewSchema: GenMessage<ProductPreview>;
/**
 * @generated from message tank.agentctl.v1.ApproveProductBuildRequest
 */
export type ApproveProductBuildRequest = Message<"tank.agentctl.v1.ApproveProductBuildRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
    /**
     * @generated from field: string sha = 2;
     */
    sha: string;
    /**
     * who, for the commit message
     *
     * @generated from field: string by = 3;
     */
    by: string;
};
/**
 * Describes the message tank.agentctl.v1.ApproveProductBuildRequest.
 * Use `create(ApproveProductBuildRequestSchema)` to create a new message.
 */
export declare const ApproveProductBuildRequestSchema: GenMessage<ApproveProductBuildRequest>;
/**
 * @generated from message tank.agentctl.v1.ApproveProductBuildResponse
 */
export type ApproveProductBuildResponse = Message<"tank.agentctl.v1.ApproveProductBuildResponse"> & {};
/**
 * Describes the message tank.agentctl.v1.ApproveProductBuildResponse.
 * Use `create(ApproveProductBuildResponseSchema)` to create a new message.
 */
export declare const ApproveProductBuildResponseSchema: GenMessage<ApproveProductBuildResponse>;
/**
 * @generated from message tank.agentctl.v1.OperateProductRequest
 */
export type OperateProductRequest = Message<"tank.agentctl.v1.OperateProductRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
    /**
     * restart | pause | resume | run
     *
     * @generated from field: string action = 2;
     */
    action: string;
    /**
     * the schedule or job; empty for restart
     *
     * @generated from field: string process = 3;
     */
    process: string;
    /**
     * @generated from field: string by = 4;
     */
    by: string;
};
/**
 * Describes the message tank.agentctl.v1.OperateProductRequest.
 * Use `create(OperateProductRequestSchema)` to create a new message.
 */
export declare const OperateProductRequestSchema: GenMessage<OperateProductRequest>;
/**
 * @generated from message tank.agentctl.v1.OperateProductResponse
 */
export type OperateProductResponse = Message<"tank.agentctl.v1.OperateProductResponse"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
};
/**
 * Describes the message tank.agentctl.v1.OperateProductResponse.
 * Use `create(OperateProductResponseSchema)` to create a new message.
 */
export declare const OperateProductResponseSchema: GenMessage<OperateProductResponse>;
/**
 * @generated from message tank.agentctl.v1.ListProductChangesRequest
 */
export type ListProductChangesRequest = Message<"tank.agentctl.v1.ListProductChangesRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
    /**
     * 0 = 30, at most 100
     *
     * @generated from field: int32 limit = 2;
     */
    limit: number;
};
/**
 * Describes the message tank.agentctl.v1.ListProductChangesRequest.
 * Use `create(ListProductChangesRequestSchema)` to create a new message.
 */
export declare const ListProductChangesRequestSchema: GenMessage<ListProductChangesRequest>;
/**
 * @generated from message tank.agentctl.v1.ListProductChangesResponse
 */
export type ListProductChangesResponse = Message<"tank.agentctl.v1.ListProductChangesResponse"> & {
    /**
     * @generated from field: repeated tank.agentctl.v1.ProductChange changes = 1;
     */
    changes: ProductChange[];
};
/**
 * Describes the message tank.agentctl.v1.ListProductChangesResponse.
 * Use `create(ListProductChangesResponseSchema)` to create a new message.
 */
export declare const ListProductChangesResponseSchema: GenMessage<ListProductChangesResponse>;
/**
 * @generated from message tank.agentctl.v1.RollbackProductRequest
 */
export type RollbackProductRequest = Message<"tank.agentctl.v1.RollbackProductRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
    /**
     * the build (product repository commit) to put back
     *
     * @generated from field: string sha = 2;
     */
    sha: string;
    /**
     * @generated from field: string by = 3;
     */
    by: string;
};
/**
 * Describes the message tank.agentctl.v1.RollbackProductRequest.
 * Use `create(RollbackProductRequestSchema)` to create a new message.
 */
export declare const RollbackProductRequestSchema: GenMessage<RollbackProductRequest>;
/**
 * @generated from message tank.agentctl.v1.RollbackProductResponse
 */
export type RollbackProductResponse = Message<"tank.agentctl.v1.RollbackProductResponse"> & {
    /**
     * @generated from field: bool applied = 1;
     */
    applied: boolean;
    /**
     * spec | cost when it waits instead
     *
     * @generated from field: string reason = 2;
     */
    reason: string;
    /**
     * @generated from field: repeated string problems = 3;
     */
    problems: string[];
    /**
     * @generated from field: tank.agentctl.v1.ProductCost estimate = 4;
     */
    estimate?: ProductCost;
};
/**
 * Describes the message tank.agentctl.v1.RollbackProductResponse.
 * Use `create(RollbackProductResponseSchema)` to create a new message.
 */
export declare const RollbackProductResponseSchema: GenMessage<RollbackProductResponse>;
/**
 * @generated from message tank.agentctl.v1.SetProductSecretRequest
 */
export type SetProductSecretRequest = Message<"tank.agentctl.v1.SetProductSecretRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
    /**
     * one of the names its tank.yaml declares
     *
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * empty clears it
     *
     * @generated from field: string value = 3;
     */
    value: string;
};
/**
 * Describes the message tank.agentctl.v1.SetProductSecretRequest.
 * Use `create(SetProductSecretRequestSchema)` to create a new message.
 */
export declare const SetProductSecretRequestSchema: GenMessage<SetProductSecretRequest>;
/**
 * @generated from message tank.agentctl.v1.SetProductSecretResponse
 */
export type SetProductSecretResponse = Message<"tank.agentctl.v1.SetProductSecretResponse"> & {};
/**
 * Describes the message tank.agentctl.v1.SetProductSecretResponse.
 * Use `create(SetProductSecretResponseSchema)` to create a new message.
 */
export declare const SetProductSecretResponseSchema: GenMessage<SetProductSecretResponse>;
/**
 * @generated from message tank.agentctl.v1.ExportProductRequest
 */
export type ExportProductRequest = Message<"tank.agentctl.v1.ExportProductRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
};
/**
 * Describes the message tank.agentctl.v1.ExportProductRequest.
 * Use `create(ExportProductRequestSchema)` to create a new message.
 */
export declare const ExportProductRequestSchema: GenMessage<ExportProductRequest>;
/**
 * @generated from message tank.agentctl.v1.ExportProductResponse
 */
export type ExportProductResponse = Message<"tank.agentctl.v1.ExportProductResponse"> & {
    /**
     * @generated from field: string compose_yaml = 1;
     */
    composeYaml: string;
    /**
     * the image it names, for the buyer to pull or rebuild
     *
     * @generated from field: string image = 2;
     */
    image: string;
};
/**
 * Describes the message tank.agentctl.v1.ExportProductResponse.
 * Use `create(ExportProductResponseSchema)` to create a new message.
 */
export declare const ExportProductResponseSchema: GenMessage<ExportProductResponse>;
/**
 * @generated from message tank.agentctl.v1.UpdateProductSpecRequest
 */
export type UpdateProductSpecRequest = Message<"tank.agentctl.v1.UpdateProductSpecRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
    /**
     * @generated from field: string process = 2;
     */
    process: string;
    /**
     * empty leaves it
     *
     * @generated from field: string size = 3;
     */
    size: string;
    /**
     * 0 leaves it
     *
     * @generated from field: int32 min = 4;
     */
    min: number;
    /**
     * @generated from field: int32 max = 5;
     */
    max: number;
    /**
     * empty leaves it
     *
     * @generated from field: string schedule = 6;
     */
    schedule: string;
    /**
     * @generated from field: string author_name = 7;
     */
    authorName: string;
    /**
     * @generated from field: string author_email = 8;
     */
    authorEmail: string;
};
/**
 * Describes the message tank.agentctl.v1.UpdateProductSpecRequest.
 * Use `create(UpdateProductSpecRequestSchema)` to create a new message.
 */
export declare const UpdateProductSpecRequestSchema: GenMessage<UpdateProductSpecRequest>;
/**
 * @generated from message tank.agentctl.v1.UpdateProductSpecResponse
 */
export type UpdateProductSpecResponse = Message<"tank.agentctl.v1.UpdateProductSpecResponse"> & {
    /**
     * @generated from field: string commit_sha = 1;
     */
    commitSha: string;
    /**
     * what the product will cost once the build lands
     *
     * @generated from field: tank.agentctl.v1.ProductCost estimate = 2;
     */
    estimate?: ProductCost;
};
/**
 * Describes the message tank.agentctl.v1.UpdateProductSpecResponse.
 * Use `create(UpdateProductSpecResponseSchema)` to create a new message.
 */
export declare const UpdateProductSpecResponseSchema: GenMessage<UpdateProductSpecResponse>;
/**
 * What the cluster says about a running product.
 *
 * @generated from message tank.agentctl.v1.ProductState
 */
export type ProductState = Message<"tank.agentctl.v1.ProductState"> & {
    /**
     * not_deployed | asleep | starting | running | failing
     *
     * @generated from field: string phase = 1;
     */
    phase: string;
    /**
     * what the workload runs
     *
     * @generated from field: string image_tag = 2;
     */
    imageTag: string;
    /**
     * wanted
     *
     * @generated from field: int32 replicas = 3;
     */
    replicas: number;
    /**
     * serving
     *
     * @generated from field: int32 ready = 4;
     */
    ready: number;
    /**
     * since the pod started
     *
     * @generated from field: int32 restarts = 5;
     */
    restarts: number;
    /**
     * "Error", "OOMKilled", … of the last crash
     *
     * @generated from field: string last_exit_reason = 6;
     */
    lastExitReason: string;
    /**
     * @generated from field: int32 last_exit_code = 7;
     */
    lastExitCode: number;
    /**
     * RFC 3339, when the current pod started
     *
     * @generated from field: string started_at = 8;
     */
    startedAt: string;
    /**
     * capacity of the product's data volume
     *
     * @generated from field: int64 disk_bytes = 9;
     */
    diskBytes: bigint;
    /**
     * "1"
     *
     * @generated from field: string cpu_limit = 10;
     */
    cpuLimit: string;
    /**
     * "2Gi"
     *
     * @generated from field: string memory_limit = 11;
     */
    memoryLimit: string;
    /**
     * @generated from field: repeated tank.agentctl.v1.ProductEvent events = 12;
     */
    events: ProductEvent[];
    /**
     * @generated from field: repeated tank.agentctl.v1.ProcessState processes = 13;
     */
    processes: ProcessState[];
};
/**
 * Describes the message tank.agentctl.v1.ProductState.
 * Use `create(ProductStateSchema)` to create a new message.
 */
export declare const ProductStateSchema: GenMessage<ProductState>;
/**
 * @generated from message tank.agentctl.v1.ProductEvent
 */
export type ProductEvent = Message<"tank.agentctl.v1.ProductEvent"> & {
    /**
     * RFC 3339
     *
     * @generated from field: string at = 1;
     */
    at: string;
    /**
     * Normal | Warning
     *
     * @generated from field: string type = 2;
     */
    type: string;
    /**
     * @generated from field: string reason = 3;
     */
    reason: string;
    /**
     * @generated from field: string message = 4;
     */
    message: string;
};
/**
 * Describes the message tank.agentctl.v1.ProductEvent.
 * Use `create(ProductEventSchema)` to create a new message.
 */
export declare const ProductEventSchema: GenMessage<ProductEvent>;
/**
 * @generated from message tank.agentctl.v1.CheckProductPageRequest
 */
export type CheckProductPageRequest = Message<"tank.agentctl.v1.CheckProductPageRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
    /**
     * "/" when empty
     *
     * @generated from field: string path = 2;
     */
    path: string;
};
/**
 * Describes the message tank.agentctl.v1.CheckProductPageRequest.
 * Use `create(CheckProductPageRequestSchema)` to create a new message.
 */
export declare const CheckProductPageRequestSchema: GenMessage<CheckProductPageRequest>;
/**
 * @generated from message tank.agentctl.v1.CheckProductPageResponse
 */
export type CheckProductPageResponse = Message<"tank.agentctl.v1.CheckProductPageResponse"> & {
    /**
     * @generated from field: tank.agentctl.v1.CheckLiveResponse check = 1;
     */
    check?: CheckLiveResponse;
};
/**
 * Describes the message tank.agentctl.v1.CheckProductPageResponse.
 * Use `create(CheckProductPageResponseSchema)` to create a new message.
 */
export declare const CheckProductPageResponseSchema: GenMessage<CheckProductPageResponse>;
/**
 * @generated from message tank.agentctl.v1.GetProductStateRequest
 */
export type GetProductStateRequest = Message<"tank.agentctl.v1.GetProductStateRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
    /**
     * 0 = 200, at most 2000
     *
     * @generated from field: int32 tail_lines = 2;
     */
    tailLines: number;
};
/**
 * Describes the message tank.agentctl.v1.GetProductStateRequest.
 * Use `create(GetProductStateRequestSchema)` to create a new message.
 */
export declare const GetProductStateRequestSchema: GenMessage<GetProductStateRequest>;
/**
 * @generated from message tank.agentctl.v1.GetProductStateResponse
 */
export type GetProductStateResponse = Message<"tank.agentctl.v1.GetProductStateResponse"> & {
    /**
     * @generated from field: tank.agentctl.v1.ProductState state = 1;
     */
    state?: ProductState;
    /**
     * the app's log tail; the previous container's when it crashed
     *
     * @generated from field: string logs = 2;
     */
    logs: string;
};
/**
 * Describes the message tank.agentctl.v1.GetProductStateResponse.
 * Use `create(GetProductStateResponseSchema)` to create a new message.
 */
export declare const GetProductStateResponseSchema: GenMessage<GetProductStateResponse>;
/**
 * @generated from message tank.agentctl.v1.GetDeploymentResponse
 */
export type GetDeploymentResponse = Message<"tank.agentctl.v1.GetDeploymentResponse"> & {
    /**
     * owner/name recorded for the slug
     *
     * @generated from field: string repo = 1;
     */
    repo: string;
    /**
     * @generated from field: string url = 2;
     */
    url: string;
    /**
     * empty until a build on main has landed
     *
     * @generated from field: string image_tag = 3;
     */
    imageTag: string;
    /**
     * @generated from field: int32 replicas = 4;
     */
    replicas: number;
    /**
     * .github/workflows/tank.yml exists on the repository's default branch
     *
     * @generated from field: bool workflow_present = 5;
     */
    workflowPresent: boolean;
    /**
     * TANK generated the repository (agenture-<slug> in TANK's org)
     *
     * @generated from field: bool managed = 6;
     */
    managed: boolean;
};
/**
 * Describes the message tank.agentctl.v1.GetDeploymentResponse.
 * Use `create(GetDeploymentResponseSchema)` to create a new message.
 */
export declare const GetDeploymentResponseSchema: GenMessage<GetDeploymentResponse>;
/**
 * @generated from message tank.agentctl.v1.SetProductReplicasRequest
 */
export type SetProductReplicasRequest = Message<"tank.agentctl.v1.SetProductReplicasRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
    /**
     * 0 or 1; the database lives in the pod, so never more
     *
     * @generated from field: int32 replicas = 2;
     */
    replicas: number;
    /**
     * "preview", "sale", "idle" — goes in the commit message
     *
     * @generated from field: string reason = 3;
     */
    reason: string;
};
/**
 * Describes the message tank.agentctl.v1.SetProductReplicasRequest.
 * Use `create(SetProductReplicasRequestSchema)` to create a new message.
 */
export declare const SetProductReplicasRequestSchema: GenMessage<SetProductReplicasRequest>;
/**
 * @generated from message tank.agentctl.v1.SetProductReplicasResponse
 */
export type SetProductReplicasResponse = Message<"tank.agentctl.v1.SetProductReplicasResponse"> & {
    /**
     * https://<slug>.tank.chat
     *
     * @generated from field: string url = 1;
     */
    url: string;
};
/**
 * Describes the message tank.agentctl.v1.SetProductReplicasResponse.
 * Use `create(SetProductReplicasResponseSchema)` to create a new message.
 */
export declare const SetProductReplicasResponseSchema: GenMessage<SetProductReplicasResponse>;
/**
 * @generated from message tank.agentctl.v1.CreateProductRepoRequest
 */
export type CreateProductRepoRequest = Message<"tank.agentctl.v1.CreateProductRepoRequest"> & {
    /**
     * the product
     *
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * becomes agenture-<slug>
     *
     * @generated from field: string slug = 2;
     */
    slug: string;
    /**
     * the repo's description on GitHub: name and one line
     *
     * @generated from field: string description = 3;
     */
    description: string;
};
/**
 * Describes the message tank.agentctl.v1.CreateProductRepoRequest.
 * Use `create(CreateProductRepoRequestSchema)` to create a new message.
 */
export declare const CreateProductRepoRequestSchema: GenMessage<CreateProductRepoRequest>;
/**
 * @generated from message tank.agentctl.v1.CreateProductRepoResponse
 */
export type CreateProductRepoResponse = Message<"tank.agentctl.v1.CreateProductRepoResponse"> & {
    /**
     * owner/name
     *
     * @generated from field: string repo = 1;
     */
    repo: string;
};
/**
 * Describes the message tank.agentctl.v1.CreateProductRepoResponse.
 * Use `create(CreateProductRepoResponseSchema)` to create a new message.
 */
export declare const CreateProductRepoResponseSchema: GenMessage<CreateProductRepoResponse>;
/**
 * CommitProductFiles writes files to a product's repository as the App, for the board's
 * own writing — a stage done without a sandbox still leaves its document behind.
 *
 * @generated from message tank.agentctl.v1.CommitProductFilesRequest
 */
export type CommitProductFilesRequest = Message<"tank.agentctl.v1.CommitProductFilesRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
    /**
     * @generated from field: repeated tank.agentctl.v1.RepoFile files = 2;
     */
    files: RepoFile[];
    /**
     * @generated from field: string message = 3;
     */
    message: string;
    /**
     * @generated from field: bool build = 4;
     */
    build: boolean;
};
/**
 * Describes the message tank.agentctl.v1.CommitProductFilesRequest.
 * Use `create(CommitProductFilesRequestSchema)` to create a new message.
 */
export declare const CommitProductFilesRequestSchema: GenMessage<CommitProductFilesRequest>;
/**
 * @generated from message tank.agentctl.v1.CommitProductFilesResponse
 */
export type CommitProductFilesResponse = Message<"tank.agentctl.v1.CommitProductFilesResponse"> & {
    /**
     * @generated from field: int32 committed = 1;
     */
    committed: number;
};
/**
 * Describes the message tank.agentctl.v1.CommitProductFilesResponse.
 * Use `create(CommitProductFilesResponseSchema)` to create a new message.
 */
export declare const CommitProductFilesResponseSchema: GenMessage<CommitProductFilesResponse>;
/**
 * @generated from message tank.agentctl.v1.BindChannelRepoRequest
 */
export type BindChannelRepoRequest = Message<"tank.agentctl.v1.BindChannelRepoRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * owner/name
     *
     * @generated from field: string repo = 3;
     */
    repo: string;
    /**
     * empty = main
     *
     * @generated from field: string base_branch = 4;
     */
    baseBranch: string;
    /**
     * node | go | python | expo; empty = node
     *
     * @generated from field: string toolchain = 5;
     */
    toolchain: string;
    /**
     * Set when the repository is one TANK generated for this workspace's hosting.
     * Such a repository lives under TANK's own installation rather than the
     * workspace's, so the reachability check is a different one.
     *
     * @generated from field: bool hosted = 6;
     */
    hosted: boolean;
    /**
     * user id, for the record
     *
     * @generated from field: string requested_by = 7;
     */
    requestedBy: string;
};
/**
 * Describes the message tank.agentctl.v1.BindChannelRepoRequest.
 * Use `create(BindChannelRepoRequestSchema)` to create a new message.
 */
export declare const BindChannelRepoRequestSchema: GenMessage<BindChannelRepoRequest>;
/**
 * @generated from message tank.agentctl.v1.BindChannelRepoResponse
 */
export type BindChannelRepoResponse = Message<"tank.agentctl.v1.BindChannelRepoResponse"> & {
    /**
     * @generated from field: string repo = 1;
     */
    repo: string;
    /**
     * @generated from field: string base_branch = 2;
     */
    baseBranch: string;
    /**
     * @generated from field: string toolchain = 3;
     */
    toolchain: string;
    /**
     * What was bound before, so the caller can offer a catch-up only when the
     * binding actually changed.
     *
     * @generated from field: string previous_repo = 4;
     */
    previousRepo: string;
};
/**
 * Describes the message tank.agentctl.v1.BindChannelRepoResponse.
 * Use `create(BindChannelRepoResponseSchema)` to create a new message.
 */
export declare const BindChannelRepoResponseSchema: GenMessage<BindChannelRepoResponse>;
/**
 * @generated from message tank.agentctl.v1.UnbindChannelRepoRequest
 */
export type UnbindChannelRepoRequest = Message<"tank.agentctl.v1.UnbindChannelRepoRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * @generated from field: string requested_by = 3;
     */
    requestedBy: string;
};
/**
 * Describes the message tank.agentctl.v1.UnbindChannelRepoRequest.
 * Use `create(UnbindChannelRepoRequestSchema)` to create a new message.
 */
export declare const UnbindChannelRepoRequestSchema: GenMessage<UnbindChannelRepoRequest>;
/**
 * @generated from message tank.agentctl.v1.UnbindChannelRepoResponse
 */
export type UnbindChannelRepoResponse = Message<"tank.agentctl.v1.UnbindChannelRepoResponse"> & {
    /**
     * @generated from field: bool removed = 1;
     */
    removed: boolean;
};
/**
 * Describes the message tank.agentctl.v1.UnbindChannelRepoResponse.
 * Use `create(UnbindChannelRepoResponseSchema)` to create a new message.
 */
export declare const UnbindChannelRepoResponseSchema: GenMessage<UnbindChannelRepoResponse>;
/**
 * @generated from message tank.agentctl.v1.RepoAccessEntry
 */
export type RepoAccessEntry = Message<"tank.agentctl.v1.RepoAccessEntry"> & {
    /**
     * owner/name, or "*" for every repository the installation covers
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
 * Describes the message tank.agentctl.v1.RepoAccessEntry.
 * Use `create(RepoAccessEntrySchema)` to create a new message.
 */
export declare const RepoAccessEntrySchema: GenMessage<RepoAccessEntry>;
/**
 * Replaces a Tread's whole access list in one call. Replacing rather than
 * patching is deliberate: a diff applied by two callers at once leaves a set
 * nobody asked for, and the set is small enough to send whole.
 *
 * @generated from message tank.agentctl.v1.SetChannelRepoAccessRequest
 */
export type SetChannelRepoAccessRequest = Message<"tank.agentctl.v1.SetChannelRepoAccessRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * @generated from field: repeated tank.agentctl.v1.RepoAccessEntry entries = 3;
     */
    entries: RepoAccessEntry[];
    /**
     * @generated from field: string requested_by = 4;
     */
    requestedBy: string;
};
/**
 * Describes the message tank.agentctl.v1.SetChannelRepoAccessRequest.
 * Use `create(SetChannelRepoAccessRequestSchema)` to create a new message.
 */
export declare const SetChannelRepoAccessRequestSchema: GenMessage<SetChannelRepoAccessRequest>;
/**
 * @generated from message tank.agentctl.v1.SetChannelRepoAccessResponse
 */
export type SetChannelRepoAccessResponse = Message<"tank.agentctl.v1.SetChannelRepoAccessResponse"> & {
    /**
     * @generated from field: repeated tank.agentctl.v1.RepoAccessEntry entries = 1;
     */
    entries: RepoAccessEntry[];
    /**
     * Repositories that were not in the list before, so the caller can offer a
     * catch-up for exactly those.
     *
     * @generated from field: repeated string added = 2;
     */
    added: string[];
};
/**
 * Describes the message tank.agentctl.v1.SetChannelRepoAccessResponse.
 * Use `create(SetChannelRepoAccessResponseSchema)` to create a new message.
 */
export declare const SetChannelRepoAccessResponseSchema: GenMessage<SetChannelRepoAccessResponse>;
/**
 * The one-time state GitHub carries through an installation, which is what ties
 * the installation it reports back to the workspace that asked.
 *
 * @generated from message tank.agentctl.v1.CreateGitHubConnectStateRequest
 */
export type CreateGitHubConnectStateRequest = Message<"tank.agentctl.v1.CreateGitHubConnectStateRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string created_by = 2;
     */
    createdBy: string;
    /**
     * empty = the control plane's own default
     *
     * @generated from field: int32 ttl_seconds = 3;
     */
    ttlSeconds: number;
};
/**
 * Describes the message tank.agentctl.v1.CreateGitHubConnectStateRequest.
 * Use `create(CreateGitHubConnectStateRequestSchema)` to create a new message.
 */
export declare const CreateGitHubConnectStateRequestSchema: GenMessage<CreateGitHubConnectStateRequest>;
/**
 * @generated from message tank.agentctl.v1.CreateGitHubConnectStateResponse
 */
export type CreateGitHubConnectStateResponse = Message<"tank.agentctl.v1.CreateGitHubConnectStateResponse"> & {
    /**
     * @generated from field: string state_token = 1;
     */
    stateToken: string;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 2;
     */
    expiresAt?: Timestamp;
};
/**
 * Describes the message tank.agentctl.v1.CreateGitHubConnectStateResponse.
 * Use `create(CreateGitHubConnectStateResponseSchema)` to create a new message.
 */
export declare const CreateGitHubConnectStateResponseSchema: GenMessage<CreateGitHubConnectStateResponse>;
/**
 * A Tread's agent settings, as the switchboard screen sets them. Typed rather
 * than a policy document on purpose: the messaging core does not author policy,
 * it asks for five things to be true, and the control plane decides whether its
 * own document can say that.
 *
 * @generated from message tank.agentctl.v1.SetChannelAgentSettingsRequest
 */
export type SetChannelAgentSettingsRequest = Message<"tank.agentctl.v1.SetChannelAgentSettingsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * @generated from field: tank.agent.v1.TreadSettings settings = 3;
     */
    settings?: TreadSettings;
    /**
     * @generated from field: string requested_by = 4;
     */
    requestedBy: string;
};
/**
 * Describes the message tank.agentctl.v1.SetChannelAgentSettingsRequest.
 * Use `create(SetChannelAgentSettingsRequestSchema)` to create a new message.
 */
export declare const SetChannelAgentSettingsRequestSchema: GenMessage<SetChannelAgentSettingsRequest>;
/**
 * @generated from message tank.agentctl.v1.SetChannelAgentSettingsResponse
 */
export type SetChannelAgentSettingsResponse = Message<"tank.agentctl.v1.SetChannelAgentSettingsResponse"> & {
    /**
     * @generated from field: tank.agent.v1.TreadSettings settings = 1;
     */
    settings?: TreadSettings;
};
/**
 * Describes the message tank.agentctl.v1.SetChannelAgentSettingsResponse.
 * Use `create(SetChannelAgentSettingsResponseSchema)` to create a new message.
 */
export declare const SetChannelAgentSettingsResponseSchema: GenMessage<SetChannelAgentSettingsResponse>;
/**
 * A whole policy.v1 document at workspace scope, for the one caller that has
 * one: the board, which narrows every product it stands up to the same figures.
 * The control plane parses it and refuses a document that widens the default
 * rather than narrowing it, so this is not a back door to the typed call above.
 *
 * @generated from message tank.agentctl.v1.SetWorkspaceAgentPolicyRequest
 */
export type SetWorkspaceAgentPolicyRequest = Message<"tank.agentctl.v1.SetWorkspaceAgentPolicyRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * policy.v1 JSON
     *
     * @generated from field: bytes policy = 2;
     */
    policy: Uint8Array;
    /**
     * @generated from field: string requested_by = 3;
     */
    requestedBy: string;
};
/**
 * Describes the message tank.agentctl.v1.SetWorkspaceAgentPolicyRequest.
 * Use `create(SetWorkspaceAgentPolicyRequestSchema)` to create a new message.
 */
export declare const SetWorkspaceAgentPolicyRequestSchema: GenMessage<SetWorkspaceAgentPolicyRequest>;
/**
 * @generated from message tank.agentctl.v1.SetWorkspaceAgentPolicyResponse
 */
export type SetWorkspaceAgentPolicyResponse = Message<"tank.agentctl.v1.SetWorkspaceAgentPolicyResponse"> & {
    /**
     * what was stored, after narrowing
     *
     * @generated from field: bytes policy = 1;
     */
    policy: Uint8Array;
};
/**
 * Describes the message tank.agentctl.v1.SetWorkspaceAgentPolicyResponse.
 * Use `create(SetWorkspaceAgentPolicyResponseSchema)` to create a new message.
 */
export declare const SetWorkspaceAgentPolicyResponseSchema: GenMessage<SetWorkspaceAgentPolicyResponse>;
/**
 * @generated from message tank.agentctl.v1.ArenaTurnRequest
 */
export type ArenaTurnRequest = Message<"tank.agentctl.v1.ArenaTurnRequest"> & {
    /**
     * @generated from field: string environment_id = 1;
     */
    environmentId: string;
    /**
     * @generated from field: string round_id = 2;
     */
    roundId: string;
    /**
     * @generated from field: string product_workspace_id = 3;
     */
    productWorkspaceId: string;
    /**
     * @generated from field: string system = 4;
     */
    system: string;
    /**
     * @generated from field: string user = 5;
     */
    user: string;
    /**
     * 0 = the control plane's default
     *
     * @generated from field: int32 max_tokens = 6;
     */
    maxTokens: number;
};
/**
 * Describes the message tank.agentctl.v1.ArenaTurnRequest.
 * Use `create(ArenaTurnRequestSchema)` to create a new message.
 */
export declare const ArenaTurnRequestSchema: GenMessage<ArenaTurnRequest>;
/**
 * @generated from message tank.agentctl.v1.ArenaTurnResponse
 */
export type ArenaTurnResponse = Message<"tank.agentctl.v1.ArenaTurnResponse"> & {
    /**
     * @generated from field: string text = 1;
     */
    text: string;
    /**
     * the model that answered, resolved, never the alias
     *
     * @generated from field: string model = 2;
     */
    model: string;
    /**
     * sha256 of system + user
     *
     * @generated from field: string prompt_hash = 3;
     */
    promptHash: string;
    /**
     * @generated from field: int32 input_tokens = 4;
     */
    inputTokens: number;
    /**
     * @generated from field: int32 output_tokens = 5;
     */
    outputTokens: number;
};
/**
 * Describes the message tank.agentctl.v1.ArenaTurnResponse.
 * Use `create(ArenaTurnResponseSchema)` to create a new message.
 */
export declare const ArenaTurnResponseSchema: GenMessage<ArenaTurnResponse>;
/**
 * @generated from message tank.agentctl.v1.ReadRepoRequest
 */
export type ReadRepoRequest = Message<"tank.agentctl.v1.ReadRepoRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * owner/name
     *
     * @generated from field: string repo = 2;
     */
    repo: string;
    /**
     * branch or commit; empty = the default branch
     *
     * @generated from field: string ref = 3;
     */
    ref: string;
    /**
     * a file; empty with tree = the whole repository
     *
     * @generated from field: string path = 4;
     */
    path: string;
    /**
     * list file paths under path instead of reading one
     *
     * @generated from field: bool tree = 5;
     */
    tree: boolean;
    /**
     * cap on content; 0 = 256 KiB
     *
     * @generated from field: int32 max_bytes = 6;
     */
    maxBytes: number;
};
/**
 * Describes the message tank.agentctl.v1.ReadRepoRequest.
 * Use `create(ReadRepoRequestSchema)` to create a new message.
 */
export declare const ReadRepoRequestSchema: GenMessage<ReadRepoRequest>;
/**
 * @generated from message tank.agentctl.v1.ReadRepoResponse
 */
export type ReadRepoResponse = Message<"tank.agentctl.v1.ReadRepoResponse"> & {
    /**
     * the commit read
     *
     * @generated from field: string sha = 1;
     */
    sha: string;
    /**
     * @generated from field: bytes content = 2;
     */
    content: Uint8Array;
    /**
     * with tree: file paths, capped
     *
     * @generated from field: repeated string paths = 3;
     */
    paths: string[];
    /**
     * "ok" | "missing" | "denied" | "too_large"
     *
     * @generated from field: string status = 4;
     */
    status: string;
    /**
     * @generated from field: string reason = 5;
     */
    reason: string;
    /**
     * @generated from field: bool truncated = 6;
     */
    truncated: boolean;
};
/**
 * Describes the message tank.agentctl.v1.ReadRepoResponse.
 * Use `create(ReadRepoResponseSchema)` to create a new message.
 */
export declare const ReadRepoResponseSchema: GenMessage<ReadRepoResponse>;
/**
 * @generated from message tank.agentctl.v1.BuildPreviewRequest
 */
export type BuildPreviewRequest = Message<"tank.agentctl.v1.BuildPreviewRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * owner/name
     *
     * @generated from field: string repo = 2;
     */
    repo: string;
    /**
     * branch; empty = the default branch
     *
     * @generated from field: string ref = 3;
     */
    ref: string;
};
/**
 * Describes the message tank.agentctl.v1.BuildPreviewRequest.
 * Use `create(BuildPreviewRequestSchema)` to create a new message.
 */
export declare const BuildPreviewRequestSchema: GenMessage<BuildPreviewRequest>;
/**
 * @generated from message tank.agentctl.v1.BuildPreviewResponse
 */
export type BuildPreviewResponse = Message<"tank.agentctl.v1.BuildPreviewResponse"> & {
    /**
     * "queued" | "building" | "done" | "failed" | "refused"
     *
     * @generated from field: string state = 1;
     */
    state: string;
    /**
     * when done
     *
     * @generated from field: string url = 2;
     */
    url: string;
    /**
     * the commit being or been built
     *
     * @generated from field: string sha = 3;
     */
    sha: string;
    /**
     * when failed or refused, in a sentence
     *
     * @generated from field: string reason = 4;
     */
    reason: string;
    /**
     * @generated from field: string framework = 5;
     */
    framework: string;
};
/**
 * Describes the message tank.agentctl.v1.BuildPreviewResponse.
 * Use `create(BuildPreviewResponseSchema)` to create a new message.
 */
export declare const BuildPreviewResponseSchema: GenMessage<BuildPreviewResponse>;
/**
 * @generated from message tank.agentctl.v1.OpenSetupPullRequestRequest
 */
export type OpenSetupPullRequestRequest = Message<"tank.agentctl.v1.OpenSetupPullRequestRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * owner/name, granted to the workspace
     *
     * @generated from field: string repo = 2;
     */
    repo: string;
    /**
     * "tank-verify=…", written to .well-known/tank-verify.txt
     *
     * @generated from field: string verify_token = 3;
     */
    verifyToken: string;
    /**
     * the exact <script> tag, pinned by its hash
     *
     * @generated from field: string bridge_tag = 4;
     */
    bridgeTag: string;
};
/**
 * Describes the message tank.agentctl.v1.OpenSetupPullRequestRequest.
 * Use `create(OpenSetupPullRequestRequestSchema)` to create a new message.
 */
export declare const OpenSetupPullRequestRequestSchema: GenMessage<OpenSetupPullRequestRequest>;
/**
 * @generated from message tank.agentctl.v1.OpenSetupPullRequestResponse
 */
export type OpenSetupPullRequestResponse = Message<"tank.agentctl.v1.OpenSetupPullRequestResponse"> & {
    /**
     * @generated from field: string url = 1;
     */
    url: string;
    /**
     * "open" | "merged" | "closed"
     *
     * @generated from field: string state = 2;
     */
    state: string;
    /**
     * @generated from field: string framework = 3;
     */
    framework: string;
    /**
     * Files the pull request changes, and what it could not place (then the person adds the
     * tag by hand; the note says where).
     *
     * @generated from field: repeated string files = 4;
     */
    files: string[];
    /**
     * @generated from field: string note = 5;
     */
    note: string;
};
/**
 * Describes the message tank.agentctl.v1.OpenSetupPullRequestResponse.
 * Use `create(OpenSetupPullRequestResponseSchema)` to create a new message.
 */
export declare const OpenSetupPullRequestResponseSchema: GenMessage<OpenSetupPullRequestResponse>;
/**
 * @generated from message tank.agentctl.v1.ReadElementAtRequest
 */
export type ReadElementAtRequest = Message<"tank.agentctl.v1.ReadElementAtRequest"> & {
    /**
     * https, public; checked again on TANK's side
     *
     * @generated from field: string url = 1;
     */
    url: string;
    /**
     * @generated from field: int32 viewport_width = 2;
     */
    viewportWidth: number;
    /**
     * @generated from field: int32 viewport_height = 3;
     */
    viewportHeight: number;
    /**
     * @generated from field: double x = 4;
     */
    x: number;
    /**
     * @generated from field: double y = 5;
     */
    y: number;
};
/**
 * Describes the message tank.agentctl.v1.ReadElementAtRequest.
 * Use `create(ReadElementAtRequestSchema)` to create a new message.
 */
export declare const ReadElementAtRequestSchema: GenMessage<ReadElementAtRequest>;
/**
 * @generated from message tank.agentctl.v1.ReadElementAtResponse
 */
export type ReadElementAtResponse = Message<"tank.agentctl.v1.ReadElementAtResponse"> & {
    /**
     * @generated from field: string tag = 1;
     */
    tag: string;
    /**
     * @generated from field: string text = 2;
     */
    text: string;
    /**
     * @generated from field: string test_id = 3;
     */
    testId: string;
    /**
     * @generated from field: repeated string classes = 4;
     */
    classes: string[];
    /**
     * @generated from field: string selector = 5;
     */
    selector: string;
    /**
     * @generated from field: double x = 6;
     */
    x: number;
    /**
     * @generated from field: double y = 7;
     */
    y: number;
    /**
     * @generated from field: double w = 8;
     */
    w: number;
    /**
     * @generated from field: double h = 9;
     */
    h: number;
    /**
     * why nothing was read
     *
     * @generated from field: string note = 10;
     */
    note: string;
};
/**
 * Describes the message tank.agentctl.v1.ReadElementAtResponse.
 * Use `create(ReadElementAtResponseSchema)` to create a new message.
 */
export declare const ReadElementAtResponseSchema: GenMessage<ReadElementAtResponse>;
/**
 * @generated from message tank.agentctl.v1.MergeChangeRequest
 */
export type MergeChangeRequest = Message<"tank.agentctl.v1.MergeChangeRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string thread_root_id = 2;
     */
    threadRootId: string;
    /**
     * @generated from field: string sha = 3;
     */
    sha: string;
};
/**
 * Describes the message tank.agentctl.v1.MergeChangeRequest.
 * Use `create(MergeChangeRequestSchema)` to create a new message.
 */
export declare const MergeChangeRequestSchema: GenMessage<MergeChangeRequest>;
/**
 * @generated from message tank.agentctl.v1.MergeChangeResponse
 */
export type MergeChangeResponse = Message<"tank.agentctl.v1.MergeChangeResponse"> & {
    /**
     * @generated from field: bool merged = 1;
     */
    merged: boolean;
    /**
     * @generated from field: string pull_request_url = 2;
     */
    pullRequestUrl: string;
    /**
     * @generated from field: string note = 3;
     */
    note: string;
};
/**
 * Describes the message tank.agentctl.v1.MergeChangeResponse.
 * Use `create(MergeChangeResponseSchema)` to create a new message.
 */
export declare const MergeChangeResponseSchema: GenMessage<MergeChangeResponse>;
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
     * @generated from rpc tank.agentctl.v1.RunnerService.GetAttachment
     */
    getAttachment: {
        methodKind: "server_streaming";
        input: typeof GetAttachmentRequestSchema;
        output: typeof GetAttachmentResponseSchema;
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
     * @generated from rpc tank.agentctl.v1.RunnerService.UpdatePlanSteps
     */
    updatePlanSteps: {
        methodKind: "unary";
        input: typeof UpdatePlanStepsRequestSchema;
        output: typeof UpdatePlanStepsResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.UpdateTreadPlan
     */
    updateTreadPlan: {
        methodKind: "unary";
        input: typeof UpdateTreadPlanRequestSchema;
        output: typeof UpdateTreadPlanResponseSchema;
    };
    /**
     * How far the run got against the whole ask (2026-10-23): what is done, what is left,
     * and what needs a person. Items left with nothing blocked start a continuation run.
     *
     * @generated from rpc tank.agentctl.v1.RunnerService.ReportCompletion
     */
    reportCompletion: {
        methodKind: "unary";
        input: typeof ReportCompletionRequestSchema;
        output: typeof ReportCompletionResponseSchema;
    };
    /**
     * Opens a page of the product TANK hosts for this run's repository, as a visitor would,
     * once it serves the expected build: status, errors, how much it shows, a screenshot.
     *
     * @generated from rpc tank.agentctl.v1.RunnerService.CheckLive
     */
    checkLive: {
        methodKind: "unary";
        input: typeof CheckLiveRequestSchema;
        output: typeof CheckLiveResponseSchema;
    };
    /**
     * The product TANK runs for this run's repository, as its operator sees it: whether it
     * is up, how often it has restarted and why, recent cluster events and its log. So an
     * agent can see the product it built fail instead of hearing about it from a person.
     *
     * @generated from rpc tank.agentctl.v1.RunnerService.ReadProduct
     */
    readProduct: {
        methodKind: "unary";
        input: typeof ReadProductRequestSchema;
        output: typeof ReadProductResponseSchema;
    };
    /**
     * Checks a tank.yaml the way a deploy will and prices it, before anything is built.
     *
     * @generated from rpc tank.agentctl.v1.RunnerService.ValidateSpec
     */
    validateSpec: {
        methodKind: "unary";
        input: typeof ValidateSpecRequestSchema;
        output: typeof ValidateSpecResponseSchema;
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
     * @generated from rpc tank.agentctl.v1.RunnerService.BoardResearch
     */
    boardResearch: {
        methodKind: "unary";
        input: typeof BoardResearchRequestSchema;
        output: typeof BoardResearchResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.CommitFiles
     */
    commitFiles: {
        methodKind: "unary";
        input: typeof CommitFilesRequestSchema;
        output: typeof CommitFilesResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.SetBrand
     */
    setBrand: {
        methodKind: "unary";
        input: typeof SetBrandRequestSchema;
        output: typeof SetBrandResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.SetLanding
     */
    setLanding: {
        methodKind: "unary";
        input: typeof SetLandingRequestSchema;
        output: typeof SetLandingResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.RecordFinding
     */
    recordFinding: {
        methodKind: "unary";
        input: typeof RecordFindingRequestSchema;
        output: typeof RecordFindingResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.BooksSummary
     */
    booksSummary: {
        methodKind: "unary";
        input: typeof BooksSummaryRequestSchema;
        output: typeof BooksSummaryResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.BooksCreateInvoice
     */
    booksCreateInvoice: {
        methodKind: "unary";
        input: typeof BooksCreateInvoiceRequestSchema;
        output: typeof BooksCreateInvoiceResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.BooksRecordExpense
     */
    booksRecordExpense: {
        methodKind: "unary";
        input: typeof BooksRecordExpenseRequestSchema;
        output: typeof BooksRecordExpenseResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.BooksRecordPayment
     */
    booksRecordPayment: {
        methodKind: "unary";
        input: typeof BooksRecordPaymentRequestSchema;
        output: typeof BooksRecordPaymentResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.BooksReport
     */
    booksReport: {
        methodKind: "unary";
        input: typeof BooksReportRequestSchema;
        output: typeof BooksReportResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.SocialAccounts
     */
    socialAccounts: {
        methodKind: "unary";
        input: typeof SocialAccountsRequestSchema;
        output: typeof SocialAccountsResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.SocialCreatePost
     */
    socialCreatePost: {
        methodKind: "unary";
        input: typeof SocialCreatePostRequestSchema;
        output: typeof SocialCreatePostResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.SocialPublishPost
     */
    socialPublishPost: {
        methodKind: "unary";
        input: typeof SocialPublishPostRequestSchema;
        output: typeof SocialPublishPostResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.WriteUpThread
     */
    writeUpThread: {
        methodKind: "unary";
        input: typeof WriteUpThreadRequestSchema;
        output: typeof WriteUpThreadResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.ReadCanvas
     */
    readCanvas: {
        methodKind: "unary";
        input: typeof ReadCanvasRequestSchema;
        output: typeof ReadCanvasResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.AskCanvas
     */
    askCanvas: {
        methodKind: "unary";
        input: typeof AskCanvasRequestSchema;
        output: typeof AskCanvasResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.ListBoards
     */
    listBoards: {
        methodKind: "unary";
        input: typeof ListBoardsRequestSchema;
        output: typeof ListBoardsResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.ReadBoard
     */
    readBoard: {
        methodKind: "unary";
        input: typeof ReadBoardRequestSchema;
        output: typeof ReadBoardResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.DrawOnBoard
     */
    drawOnBoard: {
        methodKind: "unary";
        input: typeof DrawOnBoardRequestSchema;
        output: typeof DrawOnBoardResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.ArrangeBoard
     */
    arrangeBoard: {
        methodKind: "unary";
        input: typeof ArrangeBoardRequestSchema;
        output: typeof ArrangeBoardResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.WorkbenchSteps
     */
    workbenchSteps: {
        methodKind: "unary";
        input: typeof WorkbenchStepsRequestSchema;
        output: typeof WorkbenchStepsResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.RunnerService.WorkbenchShow
     */
    workbenchShow: {
        methodKind: "unary";
        input: typeof WorkbenchShowRequestSchema;
        output: typeof WorkbenchShowResponseSchema;
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
     * ArenaTurn writes one turn of a service's public conversation on TANK's own model,
     * text only, with no tools and no sandbox, so it can only be answered by TANK's
     * weights. Refused when tank-neural is not served by TANK's own model server.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.ArenaTurn
     */
    arenaTurn: {
        methodKind: "unary";
        input: typeof ArenaTurnRequestSchema;
        output: typeof ArenaTurnResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.ControlService.StartRun
     */
    startRun: {
        methodKind: "unary";
        input: typeof StartRunRequestSchema;
        output: typeof StartRunResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.ControlService.OpenThread
     */
    openThread: {
        methodKind: "unary";
        input: typeof OpenThreadRequestSchema;
        output: typeof OpenThreadResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.ControlService.RefreshNeuralKnowledge
     */
    refreshNeuralKnowledge: {
        methodKind: "unary";
        input: typeof RefreshNeuralKnowledgeRequestSchema;
        output: typeof RefreshNeuralKnowledgeResponseSchema;
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
    /**
     * Creates the repository a product's code lives in, from the product template.
     * The control plane does it because it holds the GitHub App; api asks at product
     * birth. Idempotent: asking twice for the same product returns the same repo.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.CreateProductRepo
     */
    createProductRepo: {
        methodKind: "unary";
        input: typeof CreateProductRepoRequestSchema;
        output: typeof CreateProductRepoResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.ControlService.CommitProductFiles
     */
    commitProductFiles: {
        methodKind: "unary";
        input: typeof CommitProductFilesRequestSchema;
        output: typeof CommitProductFilesResponseSchema;
    };
    /**
     * Wakes a product (replicas 1) or puts it to sleep (replicas 0). A product is
     * asleep by default and a new image never wakes it: waking is a decision — a
     * preview, a sale — made here, and recorded in GitOps like everything else.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.SetProductReplicas
     */
    setProductReplicas: {
        methodKind: "unary";
        input: typeof SetProductReplicasRequestSchema;
        output: typeof SetProductReplicasResponseSchema;
    };
    /**
     * Hosting for a repository TANK did not generate: writes the slug's deployment file
     * naming that repository, so its CI may push images for the slug and the app can be
     * woken like a product. The workspace's own installation must reach the repository.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.RegisterDeployment
     */
    registerDeployment: {
        methodKind: "unary";
        input: typeof RegisterDeploymentRequestSchema;
        output: typeof RegisterDeploymentResponseSchema;
    };
    /**
     * What GitOps holds for a slug right now, and whether the repository carries the
     * deploy workflow yet.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.GetDeployment
     */
    getDeployment: {
        methodKind: "unary";
        input: typeof GetDeploymentRequestSchema;
        output: typeof GetDeploymentResponseSchema;
    };
    /**
     * The running state of a slug read from the cluster, with its log tail: what the
     * Infrastructure page shows. Read only.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.GetProductState
     */
    getProductState: {
        methodKind: "unary";
        input: typeof GetProductStateRequestSchema;
        output: typeof GetProductStateResponseSchema;
    };
    /**
     * Opens a page of a slug's product through the headless reader, as a visitor would.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.CheckProductPage
     */
    checkProductPage: {
        methodKind: "unary";
        input: typeof CheckProductPageRequestSchema;
        output: typeof CheckProductPageResponseSchema;
    };
    /**
     * A product's compiled spec, its cost, a build waiting to land, and the operations taken.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.GetProductSpec
     */
    getProductSpec: {
        methodKind: "unary";
        input: typeof GetProductSpecRequestSchema;
        output: typeof GetProductSpecResponseSchema;
    };
    /**
     * Lands a build that waits on a cost approval. The sha must be the waiting build's.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.ApproveProductBuild
     */
    approveProductBuild: {
        methodKind: "unary";
        input: typeof ApproveProductBuildRequestSchema;
        output: typeof ApproveProductBuildResponseSchema;
    };
    /**
     * Restart, pause or resume a schedule, run a job: recorded in GitOps like everything else.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.OperateProduct
     */
    operateProduct: {
        methodKind: "unary";
        input: typeof OperateProductRequestSchema;
        output: typeof OperateProductResponseSchema;
    };
    /**
     * The product's history: every deploy, hold, approval and operation, newest first.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.ListProductChanges
     */
    listProductChanges: {
        methodKind: "unary";
        input: typeof ListProductChangesRequestSchema;
        output: typeof ListProductChangesResponseSchema;
    };
    /**
     * Puts an earlier build back, with the tank.yaml it was built from.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.RollbackProduct
     */
    rollbackProduct: {
        methodKind: "unary";
        input: typeof RollbackProductRequestSchema;
        output: typeof RollbackProductResponseSchema;
    };
    /**
     * Changes one process's size, scale or schedule as a commit to the product's tank.yaml,
     * authored as the person who asked; the build that follows deploys it.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.UpdateProductSpec
     */
    updateProductSpec: {
        methodKind: "unary";
        input: typeof UpdateProductSpecRequestSchema;
        output: typeof UpdateProductSpecResponseSchema;
    };
    /**
     * What a change to tank.yaml would cost and whether it compiles, without making it.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.PreviewProductSpec
     */
    previewProductSpec: {
        methodKind: "unary";
        input: typeof PreviewProductSpecRequestSchema;
        output: typeof PreviewProductSpecResponseSchema;
    };
    /**
     * Makes the change: a commit to tank.yaml in the person's name, deployed on the running
     * build; one that costs more lands at once only with an owner's accepted price.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.ApplyProductSpec
     */
    applyProductSpec: {
        methodKind: "unary";
        input: typeof ApplyProductSpecRequestSchema;
        output: typeof ApplyProductSpecResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.ControlService.GetProductSpecText
     */
    getProductSpecText: {
        methodKind: "unary";
        input: typeof GetProductSpecTextRequestSchema;
        output: typeof GetProductSpecTextResponseSchema;
    };
    /**
     * The running product as a docker-compose file anybody can run without TANK.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.ExportProduct
     */
    exportProduct: {
        methodKind: "unary";
        input: typeof ExportProductRequestSchema;
        output: typeof ExportProductResponseSchema;
    };
    /**
     * Sets one of a product's declared secrets. The value is stored and never returned.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.SetProductSecret
     */
    setProductSecret: {
        methodKind: "unary";
        input: typeof SetProductSecretRequestSchema;
        output: typeof SetProductSecretResponseSchema;
    };
    /**
     * Adds the preview-reporting workflow to repositories the workspace's own
     * installation reaches, each as a pull request: branch, file, pull request. Nothing
     * is merged and nothing is written to a default branch — TANK proposes, the
     * workspace decides. Idempotent per repository, and one repository's refusal never
     * stops the others.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.SetUpPreviewWorkflow
     */
    setUpPreviewWorkflow: {
        methodKind: "unary";
        input: typeof SetUpPreviewWorkflowRequestSchema;
        output: typeof SetUpPreviewWorkflowResponseSchema;
    };
    /**
     * Reads a repository the workspace's own installation reaches, at a ref: one file's
     * content, or the list of file paths. For a board's route list and code frames. api
     * asks only after its own grant check; this refuses a repository the installation
     * does not reach, so a workspace can never read through TANK's own installation.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.ReadRepo
     */
    readRepo: {
        methodKind: "unary";
        input: typeof ReadRepoRequestSchema;
        output: typeof ReadRepoResponseSchema;
    };
    /**
     * Builds a branch of a repository the workspace's own installation reaches into a
     * static site served at https://<build_id>.preview.<domain>, for board frames. Queues
     * once per commit; answers with the newest build's state for that commit. Refused for
     * a repository outside the installation and past the workspace's daily build cap.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.BuildPreview
     */
    buildPreview: {
        methodKind: "unary";
        input: typeof BuildPreviewRequestSchema;
        output: typeof BuildPreviewResponseSchema;
    };
    /**
     * Opens (or finds) the one pull request that connects a repository's app to boards: the
     * domain proof file and TANK's board bridge, placed for the repository's framework.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.OpenSetupPullRequest
     */
    openSetupPullRequest: {
        methodKind: "unary";
        input: typeof OpenSetupPullRequestRequestSchema;
        output: typeof OpenSetupPullRequestResponseSchema;
    };
    /**
     * What a page shows at a point, read by a headless browser on TANK's side.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.ReadElementAt
     */
    readElementAt: {
        methodKind: "unary";
        input: typeof ReadElementAtRequestSchema;
        output: typeof ReadElementAtResponseSchema;
    };
    /**
     * Merges the pull request of the newest run in a thread, only when its head is exactly
     * sha (the commit a person saw previewed). api asks after its own checks.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.MergeChange
     */
    mergeChange: {
        methodKind: "unary";
        input: typeof MergeChangeRequestSchema;
        output: typeof MergeChangeResponseSchema;
    };
    /**
     * Writes into schema `agent`, which belongs to the control plane. The
     * messaging core may read that schema and may not write it, so each of these
     * is a thing it needs done rather than a statement it issues. See the block
     * of messages below for why this is a call and not a wider grant.
     *
     * @generated from rpc tank.agentctl.v1.ControlService.BindChannelRepo
     */
    bindChannelRepo: {
        methodKind: "unary";
        input: typeof BindChannelRepoRequestSchema;
        output: typeof BindChannelRepoResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.ControlService.UnbindChannelRepo
     */
    unbindChannelRepo: {
        methodKind: "unary";
        input: typeof UnbindChannelRepoRequestSchema;
        output: typeof UnbindChannelRepoResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.ControlService.SetChannelRepoAccess
     */
    setChannelRepoAccess: {
        methodKind: "unary";
        input: typeof SetChannelRepoAccessRequestSchema;
        output: typeof SetChannelRepoAccessResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.ControlService.CreateGitHubConnectState
     */
    createGitHubConnectState: {
        methodKind: "unary";
        input: typeof CreateGitHubConnectStateRequestSchema;
        output: typeof CreateGitHubConnectStateResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.ControlService.SetChannelAgentSettings
     */
    setChannelAgentSettings: {
        methodKind: "unary";
        input: typeof SetChannelAgentSettingsRequestSchema;
        output: typeof SetChannelAgentSettingsResponseSchema;
    };
    /**
     * @generated from rpc tank.agentctl.v1.ControlService.SetWorkspaceAgentPolicy
     */
    setWorkspaceAgentPolicy: {
        methodKind: "unary";
        input: typeof SetWorkspaceAgentPolicyRequestSchema;
        output: typeof SetWorkspaceAgentPolicyResponseSchema;
    };
}>;
