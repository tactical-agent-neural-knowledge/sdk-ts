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
};
/**
 * Describes the message tank.topo.v1.Mark.
 * Use `create(MarkSchema)` to create a new message.
 */
export declare const MarkSchema: GenMessage<Mark>;
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
    WAITING_ON = 5
}
/**
 * Describes the enum tank.topo.v1.MarkType.
 */
export declare const MarkTypeSchema: GenEnum<MarkType>;
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
    DISMISSED = 3
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
}>;
