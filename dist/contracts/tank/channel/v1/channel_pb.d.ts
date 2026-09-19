import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/channel/v1/channel.proto.
 */
export declare const file_tank_channel_v1_channel: GenFile;
/**
 * The pinned Goal Header of a Tread.
 *
 * @generated from message tank.channel.v1.TreadGoal
 */
export type TreadGoal = Message<"tank.channel.v1.TreadGoal"> & {
    /**
     * @generated from field: string goal = 1;
     */
    goal: string;
    /**
     * @generated from field: repeated string assignee_ids = 2;
     */
    assigneeIds: string[];
    /**
     * Free-form pipeline status rendered in the header, e.g. "PR #12 · CI green".
     *
     * @generated from field: string pipeline_status = 3;
     */
    pipelineStatus: string;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 4;
     */
    updatedAt?: Timestamp;
    /**
     * @generated from field: string updated_by = 5;
     */
    updatedBy: string;
};
/**
 * Describes the message tank.channel.v1.TreadGoal.
 * Use `create(TreadGoalSchema)` to create a new message.
 */
export declare const TreadGoalSchema: GenMessage<TreadGoal>;
/**
 * @generated from message tank.channel.v1.Channel
 */
export type Channel = Message<"tank.channel.v1.Channel"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * @generated from field: tank.channel.v1.ChannelType type = 3;
     */
    type: ChannelType;
    /**
     * @generated from field: string name = 4;
     */
    name: string;
    /**
     * @generated from field: string topic = 5;
     */
    topic: string;
    /**
     * @generated from field: string purpose = 6;
     */
    purpose: string;
    /**
     * Gapless per-channel sequence of the newest message; unread = last_seq - last_read_seq.
     *
     * @generated from field: int64 last_seq = 7;
     */
    lastSeq: bigint;
    /**
     * @generated from field: int32 member_count = 8;
     */
    memberCount: number;
    /**
     * @generated from field: google.protobuf.Timestamp last_message_at = 9;
     */
    lastMessageAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp archived_at = 10;
     */
    archivedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 11;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: tank.channel.v1.TreadGoal goal = 12;
     */
    goal?: TreadGoal;
    /**
     * DM / MPDM participants.
     *
     * @generated from field: repeated string member_ids = 13;
     */
    memberIds: string[];
};
/**
 * Describes the message tank.channel.v1.Channel.
 * Use `create(ChannelSchema)` to create a new message.
 */
export declare const ChannelSchema: GenMessage<Channel>;
/**
 * @generated from message tank.channel.v1.ChannelReadState
 */
export type ChannelReadState = Message<"tank.channel.v1.ChannelReadState"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: int64 last_read_seq = 2;
     */
    lastReadSeq: bigint;
    /**
     * @generated from field: int32 mention_count = 3;
     */
    mentionCount: number;
    /**
     * @generated from field: bool muted = 4;
     */
    muted: boolean;
    /**
     * @generated from field: bool starred = 5;
     */
    starred: boolean;
};
/**
 * Describes the message tank.channel.v1.ChannelReadState.
 * Use `create(ChannelReadStateSchema)` to create a new message.
 */
export declare const ChannelReadStateSchema: GenMessage<ChannelReadState>;
/**
 * @generated from message tank.channel.v1.CreateChannelRequest
 */
export type CreateChannelRequest = Message<"tank.channel.v1.CreateChannelRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: tank.channel.v1.ChannelType type = 2;
     */
    type: ChannelType;
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: string purpose = 4;
     */
    purpose: string;
    /**
     * DM/MPDM participants or initial invitees
     *
     * @generated from field: repeated string member_ids = 5;
     */
    memberIds: string[];
};
/**
 * Describes the message tank.channel.v1.CreateChannelRequest.
 * Use `create(CreateChannelRequestSchema)` to create a new message.
 */
export declare const CreateChannelRequestSchema: GenMessage<CreateChannelRequest>;
/**
 * @generated from message tank.channel.v1.CreateChannelResponse
 */
export type CreateChannelResponse = Message<"tank.channel.v1.CreateChannelResponse"> & {
    /**
     * @generated from field: tank.channel.v1.Channel channel = 1;
     */
    channel?: Channel;
};
/**
 * Describes the message tank.channel.v1.CreateChannelResponse.
 * Use `create(CreateChannelResponseSchema)` to create a new message.
 */
export declare const CreateChannelResponseSchema: GenMessage<CreateChannelResponse>;
/**
 * @generated from message tank.channel.v1.ListChannelsRequest
 */
export type ListChannelsRequest = Message<"tank.channel.v1.ListChannelsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * Only channels the caller can see; public ones the caller has not joined are included.
     *
     * @generated from field: bool include_unjoined_public = 2;
     */
    includeUnjoinedPublic: boolean;
    /**
     * @generated from field: string cursor = 3;
     */
    cursor: string;
    /**
     * @generated from field: int32 limit = 4;
     */
    limit: number;
};
/**
 * Describes the message tank.channel.v1.ListChannelsRequest.
 * Use `create(ListChannelsRequestSchema)` to create a new message.
 */
export declare const ListChannelsRequestSchema: GenMessage<ListChannelsRequest>;
/**
 * @generated from message tank.channel.v1.ListChannelsResponse
 */
export type ListChannelsResponse = Message<"tank.channel.v1.ListChannelsResponse"> & {
    /**
     * @generated from field: repeated tank.channel.v1.Channel channels = 1;
     */
    channels: Channel[];
    /**
     * @generated from field: string next_cursor = 2;
     */
    nextCursor: string;
};
/**
 * Describes the message tank.channel.v1.ListChannelsResponse.
 * Use `create(ListChannelsResponseSchema)` to create a new message.
 */
export declare const ListChannelsResponseSchema: GenMessage<ListChannelsResponse>;
/**
 * @generated from message tank.channel.v1.GetChannelRequest
 */
export type GetChannelRequest = Message<"tank.channel.v1.GetChannelRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
};
/**
 * Describes the message tank.channel.v1.GetChannelRequest.
 * Use `create(GetChannelRequestSchema)` to create a new message.
 */
export declare const GetChannelRequestSchema: GenMessage<GetChannelRequest>;
/**
 * @generated from message tank.channel.v1.GetChannelResponse
 */
export type GetChannelResponse = Message<"tank.channel.v1.GetChannelResponse"> & {
    /**
     * @generated from field: tank.channel.v1.Channel channel = 1;
     */
    channel?: Channel;
    /**
     * @generated from field: tank.channel.v1.ChannelReadState read_state = 2;
     */
    readState?: ChannelReadState;
};
/**
 * Describes the message tank.channel.v1.GetChannelResponse.
 * Use `create(GetChannelResponseSchema)` to create a new message.
 */
export declare const GetChannelResponseSchema: GenMessage<GetChannelResponse>;
/**
 * @generated from message tank.channel.v1.JoinChannelRequest
 */
export type JoinChannelRequest = Message<"tank.channel.v1.JoinChannelRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
};
/**
 * Describes the message tank.channel.v1.JoinChannelRequest.
 * Use `create(JoinChannelRequestSchema)` to create a new message.
 */
export declare const JoinChannelRequestSchema: GenMessage<JoinChannelRequest>;
/**
 * @generated from message tank.channel.v1.JoinChannelResponse
 */
export type JoinChannelResponse = Message<"tank.channel.v1.JoinChannelResponse"> & {
    /**
     * @generated from field: tank.channel.v1.Channel channel = 1;
     */
    channel?: Channel;
};
/**
 * Describes the message tank.channel.v1.JoinChannelResponse.
 * Use `create(JoinChannelResponseSchema)` to create a new message.
 */
export declare const JoinChannelResponseSchema: GenMessage<JoinChannelResponse>;
/**
 * @generated from message tank.channel.v1.LeaveChannelRequest
 */
export type LeaveChannelRequest = Message<"tank.channel.v1.LeaveChannelRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
};
/**
 * Describes the message tank.channel.v1.LeaveChannelRequest.
 * Use `create(LeaveChannelRequestSchema)` to create a new message.
 */
export declare const LeaveChannelRequestSchema: GenMessage<LeaveChannelRequest>;
/**
 * @generated from message tank.channel.v1.LeaveChannelResponse
 */
export type LeaveChannelResponse = Message<"tank.channel.v1.LeaveChannelResponse"> & {};
/**
 * Describes the message tank.channel.v1.LeaveChannelResponse.
 * Use `create(LeaveChannelResponseSchema)` to create a new message.
 */
export declare const LeaveChannelResponseSchema: GenMessage<LeaveChannelResponse>;
/**
 * @generated from message tank.channel.v1.InviteToChannelRequest
 */
export type InviteToChannelRequest = Message<"tank.channel.v1.InviteToChannelRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: repeated string member_ids = 2;
     */
    memberIds: string[];
};
/**
 * Describes the message tank.channel.v1.InviteToChannelRequest.
 * Use `create(InviteToChannelRequestSchema)` to create a new message.
 */
export declare const InviteToChannelRequestSchema: GenMessage<InviteToChannelRequest>;
/**
 * @generated from message tank.channel.v1.InviteToChannelResponse
 */
export type InviteToChannelResponse = Message<"tank.channel.v1.InviteToChannelResponse"> & {};
/**
 * Describes the message tank.channel.v1.InviteToChannelResponse.
 * Use `create(InviteToChannelResponseSchema)` to create a new message.
 */
export declare const InviteToChannelResponseSchema: GenMessage<InviteToChannelResponse>;
/**
 * @generated from message tank.channel.v1.SetGoalRequest
 */
export type SetGoalRequest = Message<"tank.channel.v1.SetGoalRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: tank.channel.v1.TreadGoal goal = 2;
     */
    goal?: TreadGoal;
};
/**
 * Describes the message tank.channel.v1.SetGoalRequest.
 * Use `create(SetGoalRequestSchema)` to create a new message.
 */
export declare const SetGoalRequestSchema: GenMessage<SetGoalRequest>;
/**
 * @generated from message tank.channel.v1.SetGoalResponse
 */
export type SetGoalResponse = Message<"tank.channel.v1.SetGoalResponse"> & {
    /**
     * @generated from field: tank.channel.v1.Channel channel = 1;
     */
    channel?: Channel;
};
/**
 * Describes the message tank.channel.v1.SetGoalResponse.
 * Use `create(SetGoalResponseSchema)` to create a new message.
 */
export declare const SetGoalResponseSchema: GenMessage<SetGoalResponse>;
/**
 * @generated from message tank.channel.v1.ListChannelMembersRequest
 */
export type ListChannelMembersRequest = Message<"tank.channel.v1.ListChannelMembersRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: string cursor = 2;
     */
    cursor: string;
    /**
     * @generated from field: int32 limit = 3;
     */
    limit: number;
};
/**
 * Describes the message tank.channel.v1.ListChannelMembersRequest.
 * Use `create(ListChannelMembersRequestSchema)` to create a new message.
 */
export declare const ListChannelMembersRequestSchema: GenMessage<ListChannelMembersRequest>;
/**
 * @generated from message tank.channel.v1.ListChannelMembersResponse
 */
export type ListChannelMembersResponse = Message<"tank.channel.v1.ListChannelMembersResponse"> & {
    /**
     * @generated from field: repeated string member_ids = 1;
     */
    memberIds: string[];
    /**
     * @generated from field: string next_cursor = 2;
     */
    nextCursor: string;
};
/**
 * Describes the message tank.channel.v1.ListChannelMembersResponse.
 * Use `create(ListChannelMembersResponseSchema)` to create a new message.
 */
export declare const ListChannelMembersResponseSchema: GenMessage<ListChannelMembersResponse>;
/**
 * A Channel is presented as a "Tread" in the product: an objective-centric
 * stream with a pinned Goal Header. The wire name stays Channel.
 *
 * @generated from enum tank.channel.v1.ChannelType
 */
export declare enum ChannelType {
    /**
     * @generated from enum value: CHANNEL_TYPE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: CHANNEL_TYPE_PUBLIC = 1;
     */
    PUBLIC = 1,
    /**
     * @generated from enum value: CHANNEL_TYPE_PRIVATE = 2;
     */
    PRIVATE = 2,
    /**
     * @generated from enum value: CHANNEL_TYPE_DM = 3;
     */
    DM = 3,
    /**
     * @generated from enum value: CHANNEL_TYPE_MPDM = 4;
     */
    MPDM = 4
}
/**
 * Describes the enum tank.channel.v1.ChannelType.
 */
export declare const ChannelTypeSchema: GenEnum<ChannelType>;
/**
 * @generated from service tank.channel.v1.ChannelService
 */
export declare const ChannelService: GenService<{
    /**
     * @generated from rpc tank.channel.v1.ChannelService.CreateChannel
     */
    createChannel: {
        methodKind: "unary";
        input: typeof CreateChannelRequestSchema;
        output: typeof CreateChannelResponseSchema;
    };
    /**
     * @generated from rpc tank.channel.v1.ChannelService.ListChannels
     */
    listChannels: {
        methodKind: "unary";
        input: typeof ListChannelsRequestSchema;
        output: typeof ListChannelsResponseSchema;
    };
    /**
     * @generated from rpc tank.channel.v1.ChannelService.GetChannel
     */
    getChannel: {
        methodKind: "unary";
        input: typeof GetChannelRequestSchema;
        output: typeof GetChannelResponseSchema;
    };
    /**
     * @generated from rpc tank.channel.v1.ChannelService.JoinChannel
     */
    joinChannel: {
        methodKind: "unary";
        input: typeof JoinChannelRequestSchema;
        output: typeof JoinChannelResponseSchema;
    };
    /**
     * @generated from rpc tank.channel.v1.ChannelService.LeaveChannel
     */
    leaveChannel: {
        methodKind: "unary";
        input: typeof LeaveChannelRequestSchema;
        output: typeof LeaveChannelResponseSchema;
    };
    /**
     * @generated from rpc tank.channel.v1.ChannelService.InviteToChannel
     */
    inviteToChannel: {
        methodKind: "unary";
        input: typeof InviteToChannelRequestSchema;
        output: typeof InviteToChannelResponseSchema;
    };
    /**
     * @generated from rpc tank.channel.v1.ChannelService.SetGoal
     */
    setGoal: {
        methodKind: "unary";
        input: typeof SetGoalRequestSchema;
        output: typeof SetGoalResponseSchema;
    };
    /**
     * @generated from rpc tank.channel.v1.ChannelService.ListChannelMembers
     */
    listChannelMembers: {
        methodKind: "unary";
        input: typeof ListChannelMembersRequestSchema;
        output: typeof ListChannelMembersResponseSchema;
    };
}>;
