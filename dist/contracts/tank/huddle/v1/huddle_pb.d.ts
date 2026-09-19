import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/huddle/v1/huddle.proto.
 */
export declare const file_tank_huddle_v1_huddle: GenFile;
/**
 * A huddle is the audio/video room of one channel (LiveKit room
 * ws-{workspace_id}-ch-{channel_id}); at most one is active per channel.
 *
 * @generated from message tank.huddle.v1.HuddleParticipant
 */
export type HuddleParticipant = Message<"tank.huddle.v1.HuddleParticipant"> & {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
    /**
     * @generated from field: google.protobuf.Timestamp joined_at = 2;
     */
    joinedAt?: Timestamp;
    /**
     * microphone muted / no audio track published
     *
     * @generated from field: bool muted = 3;
     */
    muted: boolean;
};
/**
 * Describes the message tank.huddle.v1.HuddleParticipant.
 * Use `create(HuddleParticipantSchema)` to create a new message.
 */
export declare const HuddleParticipantSchema: GenMessage<HuddleParticipant>;
/**
 * @generated from message tank.huddle.v1.Huddle
 */
export type Huddle = Message<"tank.huddle.v1.Huddle"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * @generated from field: string room_name = 3;
     */
    roomName: string;
    /**
     * @generated from field: string started_by = 4;
     */
    startedBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp started_at = 5;
     */
    startedAt?: Timestamp;
    /**
     * set only on huddle.ended
     *
     * @generated from field: google.protobuf.Timestamp ended_at = 6;
     */
    endedAt?: Timestamp;
    /**
     * currently connected
     *
     * @generated from field: repeated tank.huddle.v1.HuddleParticipant participants = 7;
     */
    participants: HuddleParticipant[];
};
/**
 * Describes the message tank.huddle.v1.Huddle.
 * Use `create(HuddleSchema)` to create a new message.
 */
export declare const HuddleSchema: GenMessage<Huddle>;
/**
 * @generated from message tank.huddle.v1.JoinHuddleRequest
 */
export type JoinHuddleRequest = Message<"tank.huddle.v1.JoinHuddleRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * the token may publish only a microphone track
     *
     * @generated from field: bool audio_only = 2;
     */
    audioOnly: boolean;
};
/**
 * Describes the message tank.huddle.v1.JoinHuddleRequest.
 * Use `create(JoinHuddleRequestSchema)` to create a new message.
 */
export declare const JoinHuddleRequestSchema: GenMessage<JoinHuddleRequest>;
/**
 * @generated from message tank.huddle.v1.JoinHuddleResponse
 */
export type JoinHuddleResponse = Message<"tank.huddle.v1.JoinHuddleResponse"> & {
    /**
     * LiveKit server URL (wss://)
     *
     * @generated from field: string url = 1;
     */
    url: string;
    /**
     * room token for this user
     *
     * @generated from field: string token = 2;
     */
    token: string;
    /**
     * @generated from field: string room_name = 3;
     */
    roomName: string;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 4;
     */
    expiresAt?: Timestamp;
    /**
     * @generated from field: tank.huddle.v1.Huddle huddle = 5;
     */
    huddle?: Huddle;
};
/**
 * Describes the message tank.huddle.v1.JoinHuddleResponse.
 * Use `create(JoinHuddleResponseSchema)` to create a new message.
 */
export declare const JoinHuddleResponseSchema: GenMessage<JoinHuddleResponse>;
/**
 * @generated from message tank.huddle.v1.LeaveHuddleRequest
 */
export type LeaveHuddleRequest = Message<"tank.huddle.v1.LeaveHuddleRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
};
/**
 * Describes the message tank.huddle.v1.LeaveHuddleRequest.
 * Use `create(LeaveHuddleRequestSchema)` to create a new message.
 */
export declare const LeaveHuddleRequestSchema: GenMessage<LeaveHuddleRequest>;
/**
 * @generated from message tank.huddle.v1.LeaveHuddleResponse
 */
export type LeaveHuddleResponse = Message<"tank.huddle.v1.LeaveHuddleResponse"> & {};
/**
 * Describes the message tank.huddle.v1.LeaveHuddleResponse.
 * Use `create(LeaveHuddleResponseSchema)` to create a new message.
 */
export declare const LeaveHuddleResponseSchema: GenMessage<LeaveHuddleResponse>;
/**
 * @generated from message tank.huddle.v1.GetHuddleRequest
 */
export type GetHuddleRequest = Message<"tank.huddle.v1.GetHuddleRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
};
/**
 * Describes the message tank.huddle.v1.GetHuddleRequest.
 * Use `create(GetHuddleRequestSchema)` to create a new message.
 */
export declare const GetHuddleRequestSchema: GenMessage<GetHuddleRequest>;
/**
 * @generated from message tank.huddle.v1.GetHuddleResponse
 */
export type GetHuddleResponse = Message<"tank.huddle.v1.GetHuddleResponse"> & {
    /**
     * unset when no huddle is active
     *
     * @generated from field: tank.huddle.v1.Huddle huddle = 1;
     */
    huddle?: Huddle;
};
/**
 * Describes the message tank.huddle.v1.GetHuddleResponse.
 * Use `create(GetHuddleResponseSchema)` to create a new message.
 */
export declare const GetHuddleResponseSchema: GenMessage<GetHuddleResponse>;
/**
 * @generated from message tank.huddle.v1.ListActiveHuddlesRequest
 */
export type ListActiveHuddlesRequest = Message<"tank.huddle.v1.ListActiveHuddlesRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.huddle.v1.ListActiveHuddlesRequest.
 * Use `create(ListActiveHuddlesRequestSchema)` to create a new message.
 */
export declare const ListActiveHuddlesRequestSchema: GenMessage<ListActiveHuddlesRequest>;
/**
 * @generated from message tank.huddle.v1.ListActiveHuddlesResponse
 */
export type ListActiveHuddlesResponse = Message<"tank.huddle.v1.ListActiveHuddlesResponse"> & {
    /**
     * in channels the caller can see
     *
     * @generated from field: repeated tank.huddle.v1.Huddle huddles = 1;
     */
    huddles: Huddle[];
};
/**
 * Describes the message tank.huddle.v1.ListActiveHuddlesResponse.
 * Use `create(ListActiveHuddlesResponseSchema)` to create a new message.
 */
export declare const ListActiveHuddlesResponseSchema: GenMessage<ListActiveHuddlesResponse>;
/**
 * @generated from service tank.huddle.v1.HuddleService
 */
export declare const HuddleService: GenService<{
    /**
     * @generated from rpc tank.huddle.v1.HuddleService.JoinHuddle
     */
    joinHuddle: {
        methodKind: "unary";
        input: typeof JoinHuddleRequestSchema;
        output: typeof JoinHuddleResponseSchema;
    };
    /**
     * @generated from rpc tank.huddle.v1.HuddleService.LeaveHuddle
     */
    leaveHuddle: {
        methodKind: "unary";
        input: typeof LeaveHuddleRequestSchema;
        output: typeof LeaveHuddleResponseSchema;
    };
    /**
     * @generated from rpc tank.huddle.v1.HuddleService.GetHuddle
     */
    getHuddle: {
        methodKind: "unary";
        input: typeof GetHuddleRequestSchema;
        output: typeof GetHuddleResponseSchema;
    };
    /**
     * @generated from rpc tank.huddle.v1.HuddleService.ListActiveHuddles
     */
    listActiveHuddles: {
        methodKind: "unary";
        input: typeof ListActiveHuddlesRequestSchema;
        output: typeof ListActiveHuddlesResponseSchema;
    };
}>;
