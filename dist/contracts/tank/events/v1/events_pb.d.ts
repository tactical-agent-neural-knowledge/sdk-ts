import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import type { Any, Timestamp } from "@bufbuild/protobuf/wkt";
import type { BlockAction } from "../../blocks/v1/blocks_pb.js";
import type { Message as Message$1 } from "../../message/v1/message_pb.js";
import type { Presence } from "../../presence/v1/presence_pb.js";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/events/v1/events.proto.
 */
export declare const file_tank_events_v1_events: GenFile;
/**
 * Every durable event on the bus and every realtime frame payload is one of
 * these, wrapped in an Envelope. Subjects: evt.{ws}.ch.{channel},
 * evt.{ws}.thread.{root}, evt.{ws}.user.{uid}, evt.{ws}.ws.
 *
 * @generated from message tank.events.v1.Envelope
 */
export type Envelope = Message<"tank.events.v1.Envelope"> & {
    /**
     * Nats-Msg-Id, idempotency key
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * e.g. message.created
     *
     * @generated from field: string type = 3;
     */
    type: string;
    /**
     * @generated from field: string subject = 4;
     */
    subject: string;
    /**
     * @generated from field: google.protobuf.Timestamp occurred_at = 5;
     */
    occurredAt?: Timestamp;
    /**
     * @generated from field: string trace_parent = 6;
     */
    traceParent: string;
    /**
     * @generated from field: google.protobuf.Any payload = 7;
     */
    payload?: Any;
};
/**
 * Describes the message tank.events.v1.Envelope.
 * Use `create(EnvelopeSchema)` to create a new message.
 */
export declare const EnvelopeSchema: GenMessage<Envelope>;
/**
 * @generated from message tank.events.v1.MessageCreated
 */
export type MessageCreated = Message<"tank.events.v1.MessageCreated"> & {
    /**
     * @generated from field: tank.message.v1.Message message = 1;
     */
    message?: Message$1;
};
/**
 * Describes the message tank.events.v1.MessageCreated.
 * Use `create(MessageCreatedSchema)` to create a new message.
 */
export declare const MessageCreatedSchema: GenMessage<MessageCreated>;
/**
 * @generated from message tank.events.v1.MessageUpdated
 */
export type MessageUpdated = Message<"tank.events.v1.MessageUpdated"> & {
    /**
     * @generated from field: tank.message.v1.Message message = 1;
     */
    message?: Message$1;
};
/**
 * Describes the message tank.events.v1.MessageUpdated.
 * Use `create(MessageUpdatedSchema)` to create a new message.
 */
export declare const MessageUpdatedSchema: GenMessage<MessageUpdated>;
/**
 * @generated from message tank.events.v1.MessageDeleted
 */
export type MessageDeleted = Message<"tank.events.v1.MessageDeleted"> & {
    /**
     * @generated from field: string message_id = 1;
     */
    messageId: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * @generated from field: string thread_root_id = 3;
     */
    threadRootId: string;
};
/**
 * Describes the message tank.events.v1.MessageDeleted.
 * Use `create(MessageDeletedSchema)` to create a new message.
 */
export declare const MessageDeletedSchema: GenMessage<MessageDeleted>;
/**
 * @generated from message tank.events.v1.ReactionAdded
 */
export type ReactionAdded = Message<"tank.events.v1.ReactionAdded"> & {
    /**
     * @generated from field: string message_id = 1;
     */
    messageId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
    /**
     * @generated from field: string emoji = 3;
     */
    emoji: string;
};
/**
 * Describes the message tank.events.v1.ReactionAdded.
 * Use `create(ReactionAddedSchema)` to create a new message.
 */
export declare const ReactionAddedSchema: GenMessage<ReactionAdded>;
/**
 * @generated from message tank.events.v1.ReactionRemoved
 */
export type ReactionRemoved = Message<"tank.events.v1.ReactionRemoved"> & {
    /**
     * @generated from field: string message_id = 1;
     */
    messageId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
    /**
     * @generated from field: string emoji = 3;
     */
    emoji: string;
};
/**
 * Describes the message tank.events.v1.ReactionRemoved.
 * Use `create(ReactionRemovedSchema)` to create a new message.
 */
export declare const ReactionRemovedSchema: GenMessage<ReactionRemoved>;
/**
 * @generated from message tank.events.v1.ReadStateUpdated
 */
export type ReadStateUpdated = Message<"tank.events.v1.ReadStateUpdated"> & {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * @generated from field: int64 last_read_seq = 3;
     */
    lastReadSeq: bigint;
    /**
     * @generated from field: string thread_root_id = 4;
     */
    threadRootId: string;
    /**
     * @generated from field: int64 last_read_thread_seq = 5;
     */
    lastReadThreadSeq: bigint;
};
/**
 * Describes the message tank.events.v1.ReadStateUpdated.
 * Use `create(ReadStateUpdatedSchema)` to create a new message.
 */
export declare const ReadStateUpdatedSchema: GenMessage<ReadStateUpdated>;
/**
 * @generated from message tank.events.v1.ChannelUpdated
 */
export type ChannelUpdated = Message<"tank.events.v1.ChannelUpdated"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
};
/**
 * Describes the message tank.events.v1.ChannelUpdated.
 * Use `create(ChannelUpdatedSchema)` to create a new message.
 */
export declare const ChannelUpdatedSchema: GenMessage<ChannelUpdated>;
/**
 * @generated from message tank.events.v1.ChannelMembershipChanged
 */
export type ChannelMembershipChanged = Message<"tank.events.v1.ChannelMembershipChanged"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
    /**
     * @generated from field: bool joined = 3;
     */
    joined: boolean;
};
/**
 * Describes the message tank.events.v1.ChannelMembershipChanged.
 * Use `create(ChannelMembershipChangedSchema)` to create a new message.
 */
export declare const ChannelMembershipChangedSchema: GenMessage<ChannelMembershipChanged>;
/**
 * @generated from message tank.events.v1.CardAction
 */
export type CardAction = Message<"tank.events.v1.CardAction"> & {
    /**
     * @generated from field: tank.blocks.v1.BlockAction action = 1;
     */
    action?: BlockAction;
};
/**
 * Describes the message tank.events.v1.CardAction.
 * Use `create(CardActionSchema)` to create a new message.
 */
export declare const CardActionSchema: GenMessage<CardAction>;
/**
 * @generated from message tank.events.v1.AppCommand
 */
export type AppCommand = Message<"tank.events.v1.AppCommand"> & {
    /**
     * e.g. tank
     *
     * @generated from field: string command = 1;
     */
    command: string;
    /**
     * @generated from field: string text = 2;
     */
    text: string;
    /**
     * @generated from field: string user_id = 3;
     */
    userId: string;
    /**
     * @generated from field: string channel_id = 4;
     */
    channelId: string;
    /**
     * @generated from field: string thread_root_id = 5;
     */
    threadRootId: string;
};
/**
 * Describes the message tank.events.v1.AppCommand.
 * Use `create(AppCommandSchema)` to create a new message.
 */
export declare const AppCommandSchema: GenMessage<AppCommand>;
/**
 * @generated from message tank.events.v1.PresenceChanged
 */
export type PresenceChanged = Message<"tank.events.v1.PresenceChanged"> & {
    /**
     * @generated from field: tank.presence.v1.Presence presence = 1;
     */
    presence?: Presence;
};
/**
 * Describes the message tank.events.v1.PresenceChanged.
 * Use `create(PresenceChangedSchema)` to create a new message.
 */
export declare const PresenceChangedSchema: GenMessage<PresenceChanged>;
/**
 * @generated from message tank.events.v1.Typing
 */
export type Typing = Message<"tank.events.v1.Typing"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
    /**
     * @generated from field: string thread_root_id = 3;
     */
    threadRootId: string;
};
/**
 * Describes the message tank.events.v1.Typing.
 * Use `create(TypingSchema)` to create a new message.
 */
export declare const TypingSchema: GenMessage<Typing>;
/**
 * @generated from message tank.events.v1.AgentStatus
 */
export type AgentStatus = Message<"tank.events.v1.AgentStatus"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: string thread_root_id = 2;
     */
    threadRootId: string;
    /**
     * @generated from field: string run_id = 3;
     */
    runId: string;
    /**
     * "reading repo", "running tests", ...
     *
     * @generated from field: string status = 4;
     */
    status: string;
};
/**
 * Describes the message tank.events.v1.AgentStatus.
 * Use `create(AgentStatusSchema)` to create a new message.
 */
export declare const AgentStatusSchema: GenMessage<AgentStatus>;
/**
 * @generated from message tank.events.v1.NotificationCreated
 */
export type NotificationCreated = Message<"tank.events.v1.NotificationCreated"> & {
    /**
     * @generated from field: string notification_id = 1;
     */
    notificationId: string;
    /**
     * @generated from field: string kind = 2;
     */
    kind: string;
    /**
     * @generated from field: string message_id = 3;
     */
    messageId: string;
    /**
     * @generated from field: string channel_id = 4;
     */
    channelId: string;
    /**
     * @generated from field: string actor_id = 5;
     */
    actorId: string;
};
/**
 * Describes the message tank.events.v1.NotificationCreated.
 * Use `create(NotificationCreatedSchema)` to create a new message.
 */
export declare const NotificationCreatedSchema: GenMessage<NotificationCreated>;
