import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message as Message$1 } from "../../message/v1/message_pb.js";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/topo/v1/topo.proto.
 */
export declare const file_tank_topo_v1_topo: GenFile;
/**
 * @generated from message tank.topo.v1.Mark
 */
export type Mark = Message<"tank.topo.v1.Mark"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * The message this mark sits on. Empty for marks that are positional only,
     * such as the read horizon when the next message has not arrived yet.
     *
     * @generated from field: string message_id = 3;
     */
    messageId: string;
    /**
     * Position on the message-indexed axis. This is the channel_seq, which is
     * gapless and stable, so a mark cannot drift when history is paged in.
     *
     * @generated from field: int64 channel_seq = 4;
     */
    channelSeq: bigint;
    /**
     * @generated from field: tank.topo.v1.MarkType type = 5;
     */
    type: MarkType;
    /**
     * @generated from field: tank.topo.v1.Lane lane = 6;
     */
    lane: Lane;
    /**
     * Importance, 0-100. Benchmarks and incidents sit high, chatter low; the
     * renderer uses it for opacity and for what survives when marks collide.
     *
     * @generated from field: int32 elevation = 7;
     */
    elevation: number;
    /**
     * One line for the hover preview. Never the whole message: the strip is a
     * map, and reading happens in the Tread.
     *
     * @generated from field: string preview = 8;
     */
    preview: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 9;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: tank.topo.v1.MarkStatus status = 10;
     */
    status: MarkStatus;
    /**
     * Who this is waiting on. Only set for MARK_TYPE_WAITING_ON.
     *
     * @generated from field: repeated string waiting_on_user_ids = 11;
     */
    waitingOnUserIds: string[];
    /**
     * Who created the mark. Empty for anything derived rather than stored.
     *
     * @generated from field: string created_by_user_id = 12;
     */
    createdByUserId: string;
    /**
     * When it stopped being open, however it stopped.
     *
     * @generated from field: google.protobuf.Timestamp resolved_at = 13;
     */
    resolvedAt?: Timestamp;
    /**
     * One extra line for the hover, beyond the preview: "3 files", "Deployed
     * api@1fbe86c", "PR #24 merged". Empty when the preview says it all.
     *
     * @generated from field: string detail = 14;
     */
    detail: string;
    /**
     * Where the mark points outside TANK, if anywhere — a PR, a run, a dashboard.
     * Never a link to content the caller cannot already reach.
     *
     * @generated from field: string url = 15;
     */
    url: string;
    /**
     * Only meaningful for MARK_TYPE_ARTIFACT.
     *
     * @generated from field: tank.topo.v1.ArtifactKind artifact_kind = 16;
     */
    artifactKind: ArtifactKind;
    /**
     * Set on anything Survey proposed, so a mark can always say which extractor
     * and which version of it produced the claim — and so a later version can
     * supersede an earlier one rather than duplicating it.
     *
     * @generated from field: tank.topo.v1.SurveyOrigin survey = 17;
     */
    survey?: SurveyOrigin;
};
/**
 * Describes the message tank.topo.v1.Mark.
 * Use `create(MarkSchema)` to create a new message.
 */
export declare const MarkSchema: GenMessage<Mark>;
/**
 * Where an extracted mark came from.
 *
 * Every field here exists to answer "why am I seeing this?" after the fact. A
 * mark whose provenance cannot be reconstructed is one nobody can debug, retire
 * or trust, and Survey will eventually be proposing things people act on.
 *
 * @generated from message tank.topo.v1.SurveyOrigin
 */
export type SurveyOrigin = Message<"tank.topo.v1.SurveyOrigin"> & {
    /**
     * Which extractor produced it, e.g. "unanswered_question".
     *
     * @generated from field: string extractor = 1;
     */
    extractor: string;
    /**
     * The extractor's version. Changing prompt, model or logic changes this, and
     * a new version supersedes the marks the old one wrote.
     *
     * @generated from field: string version = 2;
     */
    version: string;
    /**
     * The model, where one was involved. Empty for a deterministic extractor —
     * which is worth being able to tell apart from a model that happened to
     * agree.
     *
     * @generated from field: string model = 3;
     */
    model: string;
    /**
     * 0-1. The runner drops anything under the configured threshold before it
     * ever becomes a mark, so what reaches a person has already cleared the bar.
     *
     * @generated from field: float confidence = 4;
     */
    confidence: number;
};
/**
 * Describes the message tank.topo.v1.SurveyOrigin.
 * Use `create(SurveyOriginSchema)` to create a new message.
 */
export declare const SurveyOriginSchema: GenMessage<SurveyOrigin>;
/**
 * @generated from message tank.topo.v1.ListMarksRequest
 */
export type ListMarksRequest = Message<"tank.topo.v1.ListMarksRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * Empty means every type the server can derive for this caller.
     *
     * @generated from field: repeated tank.topo.v1.MarkType types = 2;
     */
    types: MarkType[];
};
/**
 * Describes the message tank.topo.v1.ListMarksRequest.
 * Use `create(ListMarksRequestSchema)` to create a new message.
 */
export declare const ListMarksRequestSchema: GenMessage<ListMarksRequest>;
/**
 * @generated from message tank.topo.v1.ListMarksResponse
 */
export type ListMarksResponse = Message<"tank.topo.v1.ListMarksResponse"> & {
    /**
     * @generated from field: repeated tank.topo.v1.Mark marks = 1;
     */
    marks: Mark[];
    /**
     * The channel's newest seq, so the client can scale the axis without having
     * loaded the messages. This is what lets the strip render a 10k-message
     * Tread without paging it in.
     *
     * @generated from field: int64 last_seq = 2;
     */
    lastSeq: bigint;
};
/**
 * Describes the message tank.topo.v1.ListMarksResponse.
 * Use `create(ListMarksResponseSchema)` to create a new message.
 */
export declare const ListMarksResponseSchema: GenMessage<ListMarksResponse>;
/**
 * @generated from message tank.topo.v1.FlagWaitingOnRequest
 */
export type FlagWaitingOnRequest = Message<"tank.topo.v1.FlagWaitingOnRequest"> & {
    /**
     * @generated from field: string message_id = 1;
     */
    messageId: string;
    /**
     * Who owes a reply. Must be members of the message's channel.
     *
     * @generated from field: repeated string user_ids = 2;
     */
    userIds: string[];
};
/**
 * Describes the message tank.topo.v1.FlagWaitingOnRequest.
 * Use `create(FlagWaitingOnRequestSchema)` to create a new message.
 */
export declare const FlagWaitingOnRequestSchema: GenMessage<FlagWaitingOnRequest>;
/**
 * @generated from message tank.topo.v1.FlagWaitingOnResponse
 */
export type FlagWaitingOnResponse = Message<"tank.topo.v1.FlagWaitingOnResponse"> & {
    /**
     * @generated from field: tank.topo.v1.Mark mark = 1;
     */
    mark?: Mark;
};
/**
 * Describes the message tank.topo.v1.FlagWaitingOnResponse.
 * Use `create(FlagWaitingOnResponseSchema)` to create a new message.
 */
export declare const FlagWaitingOnResponseSchema: GenMessage<FlagWaitingOnResponse>;
/**
 * @generated from message tank.topo.v1.ResolveWaitingOnRequest
 */
export type ResolveWaitingOnRequest = Message<"tank.topo.v1.ResolveWaitingOnRequest"> & {
    /**
     * @generated from field: string mark_id = 1;
     */
    markId: string;
    /**
     * Called off rather than answered. Either way it stops being open.
     *
     * @generated from field: bool dismiss = 2;
     */
    dismiss: boolean;
};
/**
 * Describes the message tank.topo.v1.ResolveWaitingOnRequest.
 * Use `create(ResolveWaitingOnRequestSchema)` to create a new message.
 */
export declare const ResolveWaitingOnRequestSchema: GenMessage<ResolveWaitingOnRequest>;
/**
 * @generated from message tank.topo.v1.ResolveWaitingOnResponse
 */
export type ResolveWaitingOnResponse = Message<"tank.topo.v1.ResolveWaitingOnResponse"> & {
    /**
     * @generated from field: tank.topo.v1.Mark mark = 1;
     */
    mark?: Mark;
};
/**
 * Describes the message tank.topo.v1.ResolveWaitingOnResponse.
 * Use `create(ResolveWaitingOnResponseSchema)` to create a new message.
 */
export declare const ResolveWaitingOnResponseSchema: GenMessage<ResolveWaitingOnResponse>;
/**
 * @generated from message tank.topo.v1.ListWaitingOnRequest
 */
export type ListWaitingOnRequest = Message<"tank.topo.v1.ListWaitingOnRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: tank.topo.v1.WaitingDirection direction = 2;
     */
    direction: WaitingDirection;
    /**
     * Include marks that are no longer open. Off by default: a queue is what is
     * still outstanding, not a history.
     *
     * @generated from field: bool include_closed = 3;
     */
    includeClosed: boolean;
};
/**
 * Describes the message tank.topo.v1.ListWaitingOnRequest.
 * Use `create(ListWaitingOnRequestSchema)` to create a new message.
 */
export declare const ListWaitingOnRequestSchema: GenMessage<ListWaitingOnRequest>;
/**
 * @generated from message tank.topo.v1.WaitingOnItem
 */
export type WaitingOnItem = Message<"tank.topo.v1.WaitingOnItem"> & {
    /**
     * @generated from field: tank.topo.v1.Mark mark = 1;
     */
    mark?: Mark;
    /**
     * The message being waited on, so a queue renders without a second call.
     *
     * @generated from field: tank.message.v1.Message message = 2;
     */
    message?: Message$1;
};
/**
 * Describes the message tank.topo.v1.WaitingOnItem.
 * Use `create(WaitingOnItemSchema)` to create a new message.
 */
export declare const WaitingOnItemSchema: GenMessage<WaitingOnItem>;
/**
 * A decision the team made.
 *
 * Every field here exists so a benchmark can be argued with. A decision without
 * its sources is hearsay, and a ledger of hearsay is worse than no ledger —
 * people act on these.
 *
 * @generated from message tank.topo.v1.Benchmark
 */
export type Benchmark = Message<"tank.topo.v1.Benchmark"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * One line: "Ship the rate limiter behind a flag".
     *
     * @generated from field: string statement = 3;
     */
    statement: string;
    /**
     * Fuller context, where the statement alone loses the reasoning.
     *
     * @generated from field: string detail = 4;
     */
    detail: string;
    /**
     * The messages this was read from. Never empty — an extraction that cannot
     * point at what it read does not become a benchmark.
     *
     * @generated from field: repeated string source_message_ids = 5;
     */
    sourceMessageIds: string[];
    /**
     * Who was part of the conversation it came from.
     *
     * @generated from field: repeated string participant_ids = 6;
     */
    participantIds: string[];
    /**
     * @generated from field: tank.topo.v1.MarkStatus status = 7;
     */
    status: MarkStatus;
    /**
     * Who confirmed or dismissed it, and when.
     *
     * @generated from field: string decided_by_user_id = 8;
     */
    decidedByUserId: string;
    /**
     * @generated from field: google.protobuf.Timestamp decided_at = 9;
     */
    decidedAt?: Timestamp;
    /**
     * The benchmark that replaced this one, when something did.
     *
     * @generated from field: string superseded_by_id = 10;
     */
    supersededById: string;
    /**
     * @generated from field: tank.topo.v1.SurveyOrigin survey = 11;
     */
    survey?: SurveyOrigin;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 12;
     */
    createdAt?: Timestamp;
    /**
     * The benchmark this one replaces. On a proposal it is Survey's claim, which
     * is why confirming is the only thing that applies it: retiring a decision
     * somebody made is not a side effect anyone should get without being asked.
     * Together with superseded_by_id this links a chain in both directions, so a
     * ledger can show the history of a position without a second round trip.
     *
     * @generated from field: string supersedes_id = 13;
     */
    supersedesId: string;
};
/**
 * Describes the message tank.topo.v1.Benchmark.
 * Use `create(BenchmarkSchema)` to create a new message.
 */
export declare const BenchmarkSchema: GenMessage<Benchmark>;
/**
 * @generated from message tank.topo.v1.ListBenchmarksRequest
 */
export type ListBenchmarksRequest = Message<"tank.topo.v1.ListBenchmarksRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * Include dismissed and superseded ones. Off by default: a ledger shows what
     * stands, and history is something you ask for.
     *
     * @generated from field: bool include_closed = 2;
     */
    includeClosed: boolean;
};
/**
 * Describes the message tank.topo.v1.ListBenchmarksRequest.
 * Use `create(ListBenchmarksRequestSchema)` to create a new message.
 */
export declare const ListBenchmarksRequestSchema: GenMessage<ListBenchmarksRequest>;
/**
 * @generated from message tank.topo.v1.ListBenchmarksResponse
 */
export type ListBenchmarksResponse = Message<"tank.topo.v1.ListBenchmarksResponse"> & {
    /**
     * @generated from field: repeated tank.topo.v1.Benchmark benchmarks = 1;
     */
    benchmarks: Benchmark[];
};
/**
 * Describes the message tank.topo.v1.ListBenchmarksResponse.
 * Use `create(ListBenchmarksResponseSchema)` to create a new message.
 */
export declare const ListBenchmarksResponseSchema: GenMessage<ListBenchmarksResponse>;
/**
 * Confirm, edit or dismiss a proposal. The three are one call because they are
 * one decision — a person looking at a proposal is choosing between them.
 *
 * @generated from message tank.topo.v1.DecideBenchmarkRequest
 */
export type DecideBenchmarkRequest = Message<"tank.topo.v1.DecideBenchmarkRequest"> & {
    /**
     * @generated from field: string benchmark_id = 1;
     */
    benchmarkId: string;
    /**
     * @generated from field: tank.topo.v1.DecideBenchmarkRequest.Decision decision = 2;
     */
    decision: DecideBenchmarkRequest_Decision;
    /**
     * Optional corrections, applied on confirm. Editing is how a nearly-right
     * extraction becomes right, instead of being thrown away and retyped.
     *
     * @generated from field: string statement = 3;
     */
    statement: string;
    /**
     * @generated from field: string detail = 4;
     */
    detail: string;
    /**
     * Which earlier benchmark this one retires, applied on confirm.
     *
     * Optional so that absent and empty differ: absent accepts whatever Survey
     * proposed, "" rejects it and confirms the new decision on its own, and an id
     * corrects a wrong guess. Without presence there would be no way to say "this
     * does not replace anything" — the commonest correction of the three.
     *
     * @generated from field: optional string supersedes_id = 5;
     */
    supersedesId?: string;
};
/**
 * Describes the message tank.topo.v1.DecideBenchmarkRequest.
 * Use `create(DecideBenchmarkRequestSchema)` to create a new message.
 */
export declare const DecideBenchmarkRequestSchema: GenMessage<DecideBenchmarkRequest>;
/**
 * @generated from enum tank.topo.v1.DecideBenchmarkRequest.Decision
 */
export declare enum DecideBenchmarkRequest_Decision {
    /**
     * @generated from enum value: DECISION_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: DECISION_CONFIRM = 1;
     */
    CONFIRM = 1,
    /**
     * @generated from enum value: DECISION_DISMISS = 2;
     */
    DISMISS = 2
}
/**
 * Describes the enum tank.topo.v1.DecideBenchmarkRequest.Decision.
 */
export declare const DecideBenchmarkRequest_DecisionSchema: GenEnum<DecideBenchmarkRequest_Decision>;
/**
 * @generated from message tank.topo.v1.DecideBenchmarkResponse
 */
export type DecideBenchmarkResponse = Message<"tank.topo.v1.DecideBenchmarkResponse"> & {
    /**
     * @generated from field: tank.topo.v1.Benchmark benchmark = 1;
     */
    benchmark?: Benchmark;
};
/**
 * Describes the message tank.topo.v1.DecideBenchmarkResponse.
 * Use `create(DecideBenchmarkResponseSchema)` to create a new message.
 */
export declare const DecideBenchmarkResponseSchema: GenMessage<DecideBenchmarkResponse>;
/**
 * @generated from message tank.topo.v1.RecordEventRequest
 */
export type RecordEventRequest = Message<"tank.topo.v1.RecordEventRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * What happened: "deploy", "pr_merged", "incident". Free-form on purpose, so
     * a new source of events needs no contract change; the strip lanes them all
     * together and the hover reads `detail`.
     *
     * @generated from field: string kind = 2;
     */
    kind: string;
    /**
     * The one line a human reads: "Deployed api@1fbe86c", "PR #24 merged".
     *
     * @generated from field: string detail = 3;
     */
    detail: string;
    /**
     * Where to go for the whole story. Optional.
     *
     * @generated from field: string url = 4;
     */
    url: string;
    /**
     * Idempotency. A webhook redelivered, or a workflow retried, must not tick
     * the strip twice.
     *
     * @generated from field: string dedupe_key = 5;
     */
    dedupeKey: string;
};
/**
 * Describes the message tank.topo.v1.RecordEventRequest.
 * Use `create(RecordEventRequestSchema)` to create a new message.
 */
export declare const RecordEventRequestSchema: GenMessage<RecordEventRequest>;
/**
 * @generated from message tank.topo.v1.RecordEventResponse
 */
export type RecordEventResponse = Message<"tank.topo.v1.RecordEventResponse"> & {
    /**
     * @generated from field: tank.topo.v1.Mark mark = 1;
     */
    mark?: Mark;
};
/**
 * Describes the message tank.topo.v1.RecordEventResponse.
 * Use `create(RecordEventResponseSchema)` to create a new message.
 */
export declare const RecordEventResponseSchema: GenMessage<RecordEventResponse>;
/**
 * @generated from message tank.topo.v1.ListWaitingOnResponse
 */
export type ListWaitingOnResponse = Message<"tank.topo.v1.ListWaitingOnResponse"> & {
    /**
     * @generated from field: repeated tank.topo.v1.WaitingOnItem items = 1;
     */
    items: WaitingOnItem[];
};
/**
 * Describes the message tank.topo.v1.ListWaitingOnResponse.
 * Use `create(ListWaitingOnResponseSchema)` to create a new message.
 */
export declare const ListWaitingOnResponseSchema: GenMessage<ListWaitingOnResponse>;
/**
 * @generated from enum tank.topo.v1.MarkType
 */
export declare enum MarkType {
    /**
     * @generated from enum value: MARK_TYPE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * A message mentioning the person asking. Their "error squiggle".
     *
     * @generated from enum value: MARK_TYPE_MENTION = 1;
     */
    MENTION = 1,
    /**
     * A message the person asking wrote.
     *
     * @generated from enum value: MARK_TYPE_OWN_MESSAGE = 2;
     */
    OWN_MESSAGE = 2,
    /**
     * Where they last caught up. At most one per channel, and never for anyone else.
     *
     * @generated from enum value: MARK_TYPE_READ_HORIZON = 3;
     */
    READ_HORIZON = 3,
    /**
     * A message matching the current in-channel search (R2).
     *
     * @generated from enum value: MARK_TYPE_SEARCH_HIT = 4;
     */
    SEARCH_HIT = 4,
    /**
     * A message flagged as needing a reply from specific people.
     *
     * @generated from enum value: MARK_TYPE_WAITING_ON = 5;
     */
    WAITING_ON = 5,
    /**
     * A message carrying something durable: a file, a link, a code block. These
     * are the things people scroll back looking for.
     *
     * @generated from enum value: MARK_TYPE_ARTIFACT = 6;
     */
    ARTIFACT = 6,
    /**
     * Something that happened to the channel rather than in it: a deploy, a
     * merged PR, an incident. Written by whatever observed it.
     *
     * @generated from enum value: MARK_TYPE_EVENT = 7;
     */
    EVENT = 7,
    /**
     * A question nobody answered. Proposed by Survey, resolved by an answer
     * arriving rather than by anyone pressing a button.
     *
     * @generated from enum value: MARK_TYPE_UNANSWERED_QUESTION = 8;
     */
    UNANSWERED_QUESTION = 8,
    /**
     * A decision, recorded with its sources and the people who made it.
     *
     * @generated from enum value: MARK_TYPE_BENCHMARK = 9;
     */
    BENCHMARK = 9
}
/**
 * Describes the enum tank.topo.v1.MarkType.
 */
export declare const MarkTypeSchema: GenEnum<MarkType>;
/**
 * What kind of durable thing an artifact mark points at. Kept separate from
 * MarkType so the strip can lane every artifact together while the hover and
 * the legend still say which sort it is.
 *
 * @generated from enum tank.topo.v1.ArtifactKind
 */
export declare enum ArtifactKind {
    /**
     * @generated from enum value: ARTIFACT_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: ARTIFACT_KIND_FILE = 1;
     */
    FILE = 1,
    /**
     * @generated from enum value: ARTIFACT_KIND_LINK = 2;
     */
    LINK = 2,
    /**
     * @generated from enum value: ARTIFACT_KIND_CODE = 3;
     */
    CODE = 3
}
/**
 * Describes the enum tank.topo.v1.ArtifactKind.
 */
export declare const ArtifactKindSchema: GenEnum<ArtifactKind>;
/**
 * Whether a mark is still live. Derived marks are always open: they exist only
 * while the thing they describe is true. Stored marks carry a real lifecycle.
 *
 * @generated from enum tank.topo.v1.MarkStatus
 */
export declare enum MarkStatus {
    /**
     * @generated from enum value: MARK_STATUS_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: MARK_STATUS_OPEN = 1;
     */
    OPEN = 1,
    /**
     * Answered: the people being waited on replied.
     *
     * @generated from enum value: MARK_STATUS_RESOLVED = 2;
     */
    RESOLVED = 2,
    /**
     * Called off by a person, answered or not.
     *
     * @generated from enum value: MARK_STATUS_DISMISSED = 3;
     */
    DISMISSED = 3,
    /**
     * Extracted but not yet confirmed by a person. High-stakes extractions start
     * here: a decision nobody has agreed to is a suggestion, and rendering it as
     * a fact is how a ledger stops being trustworthy.
     *
     * @generated from enum value: MARK_STATUS_PROPOSED = 4;
     */
    PROPOSED = 4,
    /**
     * Replaced by a later decision. Kept rather than deleted, because "what did
     * we decide, and when did that change" is the question a ledger exists for.
     *
     * @generated from enum value: MARK_STATUS_SUPERSEDED = 5;
     */
    SUPERSEDED = 5
}
/**
 * Describes the enum tank.topo.v1.MarkStatus.
 */
export declare const MarkStatusSchema: GenEnum<MarkStatus>;
/**
 * Which vertical strip a mark belongs to. Keeping families apart is what stops
 * a busy Tread reading as one undifferentiated smear.
 *
 * @generated from enum tank.topo.v1.Lane
 */
export declare enum Lane {
    /**
     * @generated from enum value: LANE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Structure and events that happened to the channel rather than in it.
     *
     * @generated from enum value: LANE_STRUCTURE = 1;
     */
    STRUCTURE = 1,
    /**
     * Marks about messages themselves.
     *
     * @generated from enum value: LANE_MESSAGE = 2;
     */
    MESSAGE = 2,
    /**
     * Marks that exist only for the person asking.
     *
     * @generated from enum value: LANE_PERSONAL = 3;
     */
    PERSONAL = 3
}
/**
 * Describes the enum tank.topo.v1.Lane.
 */
export declare const LaneSchema: GenEnum<Lane>;
/**
 * Which side of a waiting-on the caller is on.
 *
 * @generated from enum tank.topo.v1.WaitingDirection
 */
export declare enum WaitingDirection {
    /**
     * @generated from enum value: WAITING_DIRECTION_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Things other people are waiting on the caller for.
     *
     * @generated from enum value: WAITING_DIRECTION_ON_ME = 1;
     */
    ON_ME = 1,
    /**
     * Things the caller is waiting on other people for.
     *
     * @generated from enum value: WAITING_DIRECTION_BY_ME = 2;
     */
    BY_ME = 2
}
/**
 * Describes the enum tank.topo.v1.WaitingDirection.
 */
export declare const WaitingDirectionSchema: GenEnum<WaitingDirection>;
/**
 * Marks are always read through the channel, so a Tread the caller cannot see
 * has no marks, and a mark can never carry content from one that they cannot.
 *
 * @generated from service tank.topo.v1.TopoService
 */
export declare const TopoService: GenService<{
    /**
     * @generated from rpc tank.topo.v1.TopoService.ListMarks
     */
    listMarks: {
        methodKind: "unary";
        input: typeof ListMarksRequestSchema;
        output: typeof ListMarksResponseSchema;
    };
    /**
     * Flag a message as waiting on specific people. The caller must be able to
     * post in the channel; you cannot make a demand of a Tread you only read.
     *
     * @generated from rpc tank.topo.v1.TopoService.FlagWaitingOn
     */
    flagWaitingOn: {
        methodKind: "unary";
        input: typeof FlagWaitingOnRequestSchema;
        output: typeof FlagWaitingOnResponseSchema;
    };
    /**
     * Resolve or dismiss. Allowed to whoever flagged it and to anybody being
     * waited on: both of them know when it is done.
     *
     * @generated from rpc tank.topo.v1.TopoService.ResolveWaitingOn
     */
    resolveWaitingOn: {
        methodKind: "unary";
        input: typeof ResolveWaitingOnRequestSchema;
        output: typeof ResolveWaitingOnResponseSchema;
    };
    /**
     * @generated from rpc tank.topo.v1.TopoService.ListWaitingOn
     */
    listWaitingOn: {
        methodKind: "unary";
        input: typeof ListWaitingOnRequestSchema;
        output: typeof ListWaitingOnResponseSchema;
    };
    /**
     * Record something that happened to a channel rather than in it. For the
     * control plane and other first-party observers, never for a person: an
     * event tick claims something occurred, and a human claim belongs in a
     * message where it can be argued with.
     *
     * @generated from rpc tank.topo.v1.TopoService.RecordEvent
     */
    recordEvent: {
        methodKind: "unary";
        input: typeof RecordEventRequestSchema;
        output: typeof RecordEventResponseSchema;
    };
    /**
     * The channel's decision ledger.
     *
     * @generated from rpc tank.topo.v1.TopoService.ListBenchmarks
     */
    listBenchmarks: {
        methodKind: "unary";
        input: typeof ListBenchmarksRequestSchema;
        output: typeof ListBenchmarksResponseSchema;
    };
    /**
     * Confirm, correct or dismiss a proposed decision. Anyone who can post in the
     * channel may decide: a decision belongs to the people who made it, not to
     * whoever happened to be mentioned in the message it was read from.
     *
     * @generated from rpc tank.topo.v1.TopoService.DecideBenchmark
     */
    decideBenchmark: {
        methodKind: "unary";
        input: typeof DecideBenchmarkRequestSchema;
        output: typeof DecideBenchmarkResponseSchema;
    };
}>;
