import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
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
    SEARCH_HIT = 4
}
/**
 * Describes the enum tank.topo.v1.MarkType.
 */
export declare const MarkTypeSchema: GenEnum<MarkType>;
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
}>;
