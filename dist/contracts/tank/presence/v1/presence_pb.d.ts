import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/presence/v1/presence.proto.
 */
export declare const file_tank_presence_v1_presence: GenFile;
/**
 * @generated from message tank.presence.v1.Presence
 */
export type Presence = Message<"tank.presence.v1.Presence"> & {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
    /**
     * @generated from field: tank.presence.v1.PresenceStatus status = 2;
     */
    status: PresenceStatus;
    /**
     * @generated from field: google.protobuf.Timestamp last_seen = 3;
     */
    lastSeen?: Timestamp;
    /**
     * @generated from field: string custom_status_text = 4;
     */
    customStatusText: string;
    /**
     * @generated from field: string custom_status_emoji = 5;
     */
    customStatusEmoji: string;
    /**
     * @generated from field: google.protobuf.Timestamp status_expires_at = 6;
     */
    statusExpiresAt?: Timestamp;
    /**
     * When set, TANK answers anyone who @mentions this person with this text, on their behalf.
     *
     * @generated from field: string auto_reply = 7;
     */
    autoReply: string;
};
/**
 * Describes the message tank.presence.v1.Presence.
 * Use `create(PresenceSchema)` to create a new message.
 */
export declare const PresenceSchema: GenMessage<Presence>;
/**
 * @generated from message tank.presence.v1.SetStatusRequest
 */
export type SetStatusRequest = Message<"tank.presence.v1.SetStatusRequest"> & {
    /**
     * @generated from field: tank.presence.v1.PresenceStatus status = 1;
     */
    status: PresenceStatus;
    /**
     * @generated from field: string custom_status_text = 2;
     */
    customStatusText: string;
    /**
     * @generated from field: string custom_status_emoji = 3;
     */
    customStatusEmoji: string;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 4;
     */
    expiresAt?: Timestamp;
    /**
     * When set, only this workspace's presence is written; otherwise every workspace the caller belongs to.
     *
     * @generated from field: string workspace_id = 5;
     */
    workspaceId: string;
    /**
     * Answer @mentions with this text while the status lasts. Empty turns it off.
     *
     * @generated from field: string auto_reply = 6;
     */
    autoReply: string;
};
/**
 * Describes the message tank.presence.v1.SetStatusRequest.
 * Use `create(SetStatusRequestSchema)` to create a new message.
 */
export declare const SetStatusRequestSchema: GenMessage<SetStatusRequest>;
/**
 * @generated from message tank.presence.v1.SetStatusResponse
 */
export type SetStatusResponse = Message<"tank.presence.v1.SetStatusResponse"> & {
    /**
     * @generated from field: tank.presence.v1.Presence presence = 1;
     */
    presence?: Presence;
};
/**
 * Describes the message tank.presence.v1.SetStatusResponse.
 * Use `create(SetStatusResponseSchema)` to create a new message.
 */
export declare const SetStatusResponseSchema: GenMessage<SetStatusResponse>;
/**
 * @generated from message tank.presence.v1.GetPresenceRequest
 */
export type GetPresenceRequest = Message<"tank.presence.v1.GetPresenceRequest"> & {
    /**
     * max 500
     *
     * @generated from field: repeated string user_ids = 1;
     */
    userIds: string[];
    /**
     * When set, presence is read from this workspace; otherwise from any workspace the caller shares with each user.
     *
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.presence.v1.GetPresenceRequest.
 * Use `create(GetPresenceRequestSchema)` to create a new message.
 */
export declare const GetPresenceRequestSchema: GenMessage<GetPresenceRequest>;
/**
 * @generated from message tank.presence.v1.GetPresenceResponse
 */
export type GetPresenceResponse = Message<"tank.presence.v1.GetPresenceResponse"> & {
    /**
     * @generated from field: repeated tank.presence.v1.Presence presences = 1;
     */
    presences: Presence[];
};
/**
 * Describes the message tank.presence.v1.GetPresenceResponse.
 * Use `create(GetPresenceResponseSchema)` to create a new message.
 */
export declare const GetPresenceResponseSchema: GenMessage<GetPresenceResponse>;
/**
 * "Deep in a Rust refactor until 3" → a status, an emoji, when it clears, and an auto-reply.
 *
 * @generated from message tank.presence.v1.DescribeStatusRequest
 */
export type DescribeStatusRequest = Message<"tank.presence.v1.DescribeStatusRequest"> & {
    /**
     * at most 15 words
     *
     * @generated from field: string description = 1;
     */
    description: string;
    /**
     * The person's local time, "HH:MM", so "until 3" becomes a duration.
     *
     * @generated from field: string local_time = 2;
     */
    localTime: string;
};
/**
 * Describes the message tank.presence.v1.DescribeStatusRequest.
 * Use `create(DescribeStatusRequestSchema)` to create a new message.
 */
export declare const DescribeStatusRequestSchema: GenMessage<DescribeStatusRequest>;
/**
 * @generated from message tank.presence.v1.DescribeStatusResponse
 */
export type DescribeStatusResponse = Message<"tank.presence.v1.DescribeStatusResponse"> & {
    /**
     * @generated from field: tank.presence.v1.PresenceStatus status = 1;
     */
    status: PresenceStatus;
    /**
     * @generated from field: string custom_status_text = 2;
     */
    customStatusText: string;
    /**
     * @generated from field: string custom_status_emoji = 3;
     */
    customStatusEmoji: string;
    /**
     * Minutes from now until the status clears; 0 means it does not.
     *
     * @generated from field: int32 expires_in_minutes = 4;
     */
    expiresInMinutes: number;
    /**
     * @generated from field: string auto_reply = 5;
     */
    autoReply: string;
};
/**
 * Describes the message tank.presence.v1.DescribeStatusResponse.
 * Use `create(DescribeStatusResponseSchema)` to create a new message.
 */
export declare const DescribeStatusResponseSchema: GenMessage<DescribeStatusResponse>;
/**
 * @generated from enum tank.presence.v1.PresenceStatus
 */
export declare enum PresenceStatus {
    /**
     * @generated from enum value: PRESENCE_STATUS_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: PRESENCE_STATUS_ACTIVE = 1;
     */
    ACTIVE = 1,
    /**
     * @generated from enum value: PRESENCE_STATUS_AWAY = 2;
     */
    AWAY = 2,
    /**
     * @generated from enum value: PRESENCE_STATUS_DND = 3;
     */
    DND = 3,
    /**
     * Armor Mode: ambient messages are summarised; only critical alerts break through.
     *
     * @generated from enum value: PRESENCE_STATUS_ARMOR = 4;
     */
    ARMOR = 4
}
/**
 * Describes the enum tank.presence.v1.PresenceStatus.
 */
export declare const PresenceStatusSchema: GenEnum<PresenceStatus>;
/**
 * @generated from service tank.presence.v1.PresenceService
 */
export declare const PresenceService: GenService<{
    /**
     * @generated from rpc tank.presence.v1.PresenceService.SetStatus
     */
    setStatus: {
        methodKind: "unary";
        input: typeof SetStatusRequestSchema;
        output: typeof SetStatusResponseSchema;
    };
    /**
     * Turns a sentence into a status to review before saving; nothing is written.
     *
     * @generated from rpc tank.presence.v1.PresenceService.DescribeStatus
     */
    describeStatus: {
        methodKind: "unary";
        input: typeof DescribeStatusRequestSchema;
        output: typeof DescribeStatusResponseSchema;
    };
    /**
     * @generated from rpc tank.presence.v1.PresenceService.GetPresence
     */
    getPresence: {
        methodKind: "unary";
        input: typeof GetPresenceRequestSchema;
        output: typeof GetPresenceResponseSchema;
    };
}>;
