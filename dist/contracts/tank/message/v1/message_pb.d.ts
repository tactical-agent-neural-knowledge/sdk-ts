import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { PrincipalKind } from "../../auth/v1/auth_pb.js";
import type { BlockAction, Blocks } from "../../blocks/v1/blocks_pb.js";
import type { RichText } from "../../richtext/v1/richtext_pb.js";
import type { JsonObject, Message as Message$1 } from "@bufbuild/protobuf";
/**
 * Describes the file tank/message/v1/message.proto.
 */
export declare const file_tank_message_v1_message: GenFile;
/**
 * @generated from message tank.message.v1.Reaction
 */
export type Reaction = Message$1<"tank.message.v1.Reaction"> & {
    /**
     * @generated from field: string emoji = 1;
     */
    emoji: string;
    /**
     * @generated from field: int32 count = 2;
     */
    count: number;
    /**
     * capped
     *
     * @generated from field: repeated string user_ids = 3;
     */
    userIds: string[];
    /**
     * by the caller
     *
     * @generated from field: bool reacted = 4;
     */
    reacted: boolean;
};
/**
 * Describes the message tank.message.v1.Reaction.
 * Use `create(ReactionSchema)` to create a new message.
 */
export declare const ReactionSchema: GenMessage<Reaction>;
/**
 * @generated from message tank.message.v1.Message
 */
export type Message = Message$1<"tank.message.v1.Message"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * @generated from field: string channel_id = 3;
     */
    channelId: string;
    /**
     * @generated from field: int64 channel_seq = 4;
     */
    channelSeq: bigint;
    /**
     * @generated from field: string thread_root_id = 5;
     */
    threadRootId: string;
    /**
     * @generated from field: int64 thread_seq = 6;
     */
    threadSeq: bigint;
    /**
     * @generated from field: string author_id = 7;
     */
    authorId: string;
    /**
     * @generated from field: tank.auth.v1.PrincipalKind author_kind = 8;
     */
    authorKind: PrincipalKind;
    /**
     * @generated from field: tank.message.v1.MessageKind kind = 9;
     */
    kind: MessageKind;
    /**
     * @generated from field: string client_msg_id = 10;
     */
    clientMsgId: string;
    /**
     * plain-text fallback / search
     *
     * @generated from field: string text = 11;
     */
    text: string;
    /**
     * @generated from field: tank.richtext.v1.RichText rich_text = 12;
     */
    richText?: RichText;
    /**
     * @generated from field: tank.blocks.v1.Blocks blocks = 13;
     */
    blocks?: Blocks;
    /**
     * @generated from field: repeated string mention_ids = 14;
     */
    mentionIds: string[];
    /**
     * @generated from field: repeated string file_ids = 15;
     */
    fileIds: string[];
    /**
     * @generated from field: repeated tank.message.v1.Reaction reactions = 16;
     */
    reactions: Reaction[];
    /**
     * @generated from field: google.protobuf.Timestamp edited_at = 17;
     */
    editedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp deleted_at = 18;
     */
    deletedAt?: Timestamp;
    /**
     * @generated from field: int32 reply_count = 19;
     */
    replyCount: number;
    /**
     * @generated from field: google.protobuf.Timestamp last_reply_at = 20;
     */
    lastReplyAt?: Timestamp;
    /**
     * @generated from field: repeated string reply_user_ids = 21;
     */
    replyUserIds: string[];
    /**
     * Opaque per-message metadata returned on every event (run_id, card_type, ...).
     *
     * @generated from field: google.protobuf.Struct metadata = 22;
     */
    metadata?: JsonObject;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 23;
     */
    createdAt?: Timestamp;
};
/**
 * Describes the message tank.message.v1.Message.
 * Use `create(MessageSchema)` to create a new message.
 */
export declare const MessageSchema: GenMessage<Message>;
/**
 * @generated from message tank.message.v1.PostMessageRequest
 */
export type PostMessageRequest = Message$1<"tank.message.v1.PostMessageRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: string thread_root_id = 2;
     */
    threadRootId: string;
    /**
     * UUIDv7, idempotency key
     *
     * @generated from field: string client_msg_id = 3;
     */
    clientMsgId: string;
    /**
     * @generated from field: string text = 4;
     */
    text: string;
    /**
     * @generated from field: tank.richtext.v1.RichText rich_text = 5;
     */
    richText?: RichText;
    /**
     * @generated from field: tank.blocks.v1.Blocks blocks = 6;
     */
    blocks?: Blocks;
    /**
     * @generated from field: repeated string file_ids = 7;
     */
    fileIds: string[];
    /**
     * @generated from field: tank.message.v1.MessageKind kind = 8;
     */
    kind: MessageKind;
    /**
     * @generated from field: google.protobuf.Struct metadata = 9;
     */
    metadata?: JsonObject;
    /**
     * @generated from field: bool also_send_to_channel = 10;
     */
    alsoSendToChannel: boolean;
    /**
     * visible only to ephemeral_user_id, never stored
     *
     * @generated from field: bool ephemeral = 11;
     */
    ephemeral: boolean;
    /**
     * @generated from field: string ephemeral_user_id = 12;
     */
    ephemeralUserId: string;
};
/**
 * Describes the message tank.message.v1.PostMessageRequest.
 * Use `create(PostMessageRequestSchema)` to create a new message.
 */
export declare const PostMessageRequestSchema: GenMessage<PostMessageRequest>;
/**
 * @generated from message tank.message.v1.PostMessageResponse
 */
export type PostMessageResponse = Message$1<"tank.message.v1.PostMessageResponse"> & {
    /**
     * @generated from field: tank.message.v1.Message message = 1;
     */
    message?: Message;
};
/**
 * Describes the message tank.message.v1.PostMessageResponse.
 * Use `create(PostMessageResponseSchema)` to create a new message.
 */
export declare const PostMessageResponseSchema: GenMessage<PostMessageResponse>;
/**
 * @generated from message tank.message.v1.UpdateMessageRequest
 */
export type UpdateMessageRequest = Message$1<"tank.message.v1.UpdateMessageRequest"> & {
    /**
     * @generated from field: string message_id = 1;
     */
    messageId: string;
    /**
     * @generated from field: string text = 2;
     */
    text: string;
    /**
     * @generated from field: tank.richtext.v1.RichText rich_text = 3;
     */
    richText?: RichText;
    /**
     * @generated from field: tank.blocks.v1.Blocks blocks = 4;
     */
    blocks?: Blocks;
    /**
     * @generated from field: google.protobuf.Struct metadata = 5;
     */
    metadata?: JsonObject;
    /**
     * Monotonic hint so gateways can coalesce rapid agent edits.
     *
     * @generated from field: int64 stream_seq = 6;
     */
    streamSeq: bigint;
};
/**
 * Describes the message tank.message.v1.UpdateMessageRequest.
 * Use `create(UpdateMessageRequestSchema)` to create a new message.
 */
export declare const UpdateMessageRequestSchema: GenMessage<UpdateMessageRequest>;
/**
 * @generated from message tank.message.v1.UpdateMessageResponse
 */
export type UpdateMessageResponse = Message$1<"tank.message.v1.UpdateMessageResponse"> & {
    /**
     * @generated from field: tank.message.v1.Message message = 1;
     */
    message?: Message;
};
/**
 * Describes the message tank.message.v1.UpdateMessageResponse.
 * Use `create(UpdateMessageResponseSchema)` to create a new message.
 */
export declare const UpdateMessageResponseSchema: GenMessage<UpdateMessageResponse>;
/**
 * @generated from message tank.message.v1.DeleteMessageRequest
 */
export type DeleteMessageRequest = Message$1<"tank.message.v1.DeleteMessageRequest"> & {
    /**
     * @generated from field: string message_id = 1;
     */
    messageId: string;
};
/**
 * Describes the message tank.message.v1.DeleteMessageRequest.
 * Use `create(DeleteMessageRequestSchema)` to create a new message.
 */
export declare const DeleteMessageRequestSchema: GenMessage<DeleteMessageRequest>;
/**
 * @generated from message tank.message.v1.DeleteMessageResponse
 */
export type DeleteMessageResponse = Message$1<"tank.message.v1.DeleteMessageResponse"> & {};
/**
 * Describes the message tank.message.v1.DeleteMessageResponse.
 * Use `create(DeleteMessageResponseSchema)` to create a new message.
 */
export declare const DeleteMessageResponseSchema: GenMessage<DeleteMessageResponse>;
/**
 * @generated from message tank.message.v1.ListMessagesRequest
 */
export type ListMessagesRequest = Message$1<"tank.message.v1.ListMessagesRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: int64 before_seq = 2;
     */
    beforeSeq: bigint;
    /**
     * @generated from field: int64 after_seq = 3;
     */
    afterSeq: bigint;
    /**
     * @generated from field: int32 limit = 4;
     */
    limit: number;
    /**
     * Filtered Focus Feed
     *
     * @generated from field: repeated tank.message.v1.MessageKind kinds = 5;
     */
    kinds: MessageKind[];
};
/**
 * Describes the message tank.message.v1.ListMessagesRequest.
 * Use `create(ListMessagesRequestSchema)` to create a new message.
 */
export declare const ListMessagesRequestSchema: GenMessage<ListMessagesRequest>;
/**
 * @generated from message tank.message.v1.ListMessagesResponse
 */
export type ListMessagesResponse = Message$1<"tank.message.v1.ListMessagesResponse"> & {
    /**
     * @generated from field: repeated tank.message.v1.Message messages = 1;
     */
    messages: Message[];
    /**
     * @generated from field: bool has_more = 2;
     */
    hasMore: boolean;
};
/**
 * Describes the message tank.message.v1.ListMessagesResponse.
 * Use `create(ListMessagesResponseSchema)` to create a new message.
 */
export declare const ListMessagesResponseSchema: GenMessage<ListMessagesResponse>;
/**
 * @generated from message tank.message.v1.GetThreadRequest
 */
export type GetThreadRequest = Message$1<"tank.message.v1.GetThreadRequest"> & {
    /**
     * @generated from field: string thread_root_id = 1;
     */
    threadRootId: string;
    /**
     * @generated from field: int64 after_thread_seq = 2;
     */
    afterThreadSeq: bigint;
    /**
     * @generated from field: int32 limit = 3;
     */
    limit: number;
};
/**
 * Describes the message tank.message.v1.GetThreadRequest.
 * Use `create(GetThreadRequestSchema)` to create a new message.
 */
export declare const GetThreadRequestSchema: GenMessage<GetThreadRequest>;
/**
 * @generated from message tank.message.v1.GetThreadResponse
 */
export type GetThreadResponse = Message$1<"tank.message.v1.GetThreadResponse"> & {
    /**
     * @generated from field: tank.message.v1.Message root = 1;
     */
    root?: Message;
    /**
     * @generated from field: repeated tank.message.v1.Message replies = 2;
     */
    replies: Message[];
    /**
     * @generated from field: bool has_more = 3;
     */
    hasMore: boolean;
};
/**
 * Describes the message tank.message.v1.GetThreadResponse.
 * Use `create(GetThreadResponseSchema)` to create a new message.
 */
export declare const GetThreadResponseSchema: GenMessage<GetThreadResponse>;
/**
 * @generated from message tank.message.v1.MarkReadRequest
 */
export type MarkReadRequest = Message$1<"tank.message.v1.MarkReadRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: int64 seq = 2;
     */
    seq: bigint;
    /**
     * @generated from field: string thread_root_id = 3;
     */
    threadRootId: string;
    /**
     * @generated from field: int64 thread_seq = 4;
     */
    threadSeq: bigint;
};
/**
 * Describes the message tank.message.v1.MarkReadRequest.
 * Use `create(MarkReadRequestSchema)` to create a new message.
 */
export declare const MarkReadRequestSchema: GenMessage<MarkReadRequest>;
/**
 * @generated from message tank.message.v1.MarkReadResponse
 */
export type MarkReadResponse = Message$1<"tank.message.v1.MarkReadResponse"> & {};
/**
 * Describes the message tank.message.v1.MarkReadResponse.
 * Use `create(MarkReadResponseSchema)` to create a new message.
 */
export declare const MarkReadResponseSchema: GenMessage<MarkReadResponse>;
/**
 * @generated from message tank.message.v1.AddReactionRequest
 */
export type AddReactionRequest = Message$1<"tank.message.v1.AddReactionRequest"> & {
    /**
     * @generated from field: string message_id = 1;
     */
    messageId: string;
    /**
     * @generated from field: string emoji = 2;
     */
    emoji: string;
};
/**
 * Describes the message tank.message.v1.AddReactionRequest.
 * Use `create(AddReactionRequestSchema)` to create a new message.
 */
export declare const AddReactionRequestSchema: GenMessage<AddReactionRequest>;
/**
 * @generated from message tank.message.v1.AddReactionResponse
 */
export type AddReactionResponse = Message$1<"tank.message.v1.AddReactionResponse"> & {};
/**
 * Describes the message tank.message.v1.AddReactionResponse.
 * Use `create(AddReactionResponseSchema)` to create a new message.
 */
export declare const AddReactionResponseSchema: GenMessage<AddReactionResponse>;
/**
 * @generated from message tank.message.v1.RemoveReactionRequest
 */
export type RemoveReactionRequest = Message$1<"tank.message.v1.RemoveReactionRequest"> & {
    /**
     * @generated from field: string message_id = 1;
     */
    messageId: string;
    /**
     * @generated from field: string emoji = 2;
     */
    emoji: string;
};
/**
 * Describes the message tank.message.v1.RemoveReactionRequest.
 * Use `create(RemoveReactionRequestSchema)` to create a new message.
 */
export declare const RemoveReactionRequestSchema: GenMessage<RemoveReactionRequest>;
/**
 * @generated from message tank.message.v1.RemoveReactionResponse
 */
export type RemoveReactionResponse = Message$1<"tank.message.v1.RemoveReactionResponse"> & {};
/**
 * Describes the message tank.message.v1.RemoveReactionResponse.
 * Use `create(RemoveReactionResponseSchema)` to create a new message.
 */
export declare const RemoveReactionResponseSchema: GenMessage<RemoveReactionResponse>;
/**
 * @generated from message tank.message.v1.SubscribeThreadRequest
 */
export type SubscribeThreadRequest = Message$1<"tank.message.v1.SubscribeThreadRequest"> & {
    /**
     * @generated from field: string thread_root_id = 1;
     */
    threadRootId: string;
    /**
     * @generated from field: bool subscribed = 2;
     */
    subscribed: boolean;
};
/**
 * Describes the message tank.message.v1.SubscribeThreadRequest.
 * Use `create(SubscribeThreadRequestSchema)` to create a new message.
 */
export declare const SubscribeThreadRequestSchema: GenMessage<SubscribeThreadRequest>;
/**
 * @generated from message tank.message.v1.SubscribeThreadResponse
 */
export type SubscribeThreadResponse = Message$1<"tank.message.v1.SubscribeThreadResponse"> & {};
/**
 * Describes the message tank.message.v1.SubscribeThreadResponse.
 * Use `create(SubscribeThreadResponseSchema)` to create a new message.
 */
export declare const SubscribeThreadResponseSchema: GenMessage<SubscribeThreadResponse>;
/**
 * @generated from message tank.message.v1.PostBlockActionRequest
 */
export type PostBlockActionRequest = Message$1<"tank.message.v1.PostBlockActionRequest"> & {
    /**
     * @generated from field: tank.blocks.v1.BlockAction action = 1;
     */
    action?: BlockAction;
};
/**
 * Describes the message tank.message.v1.PostBlockActionRequest.
 * Use `create(PostBlockActionRequestSchema)` to create a new message.
 */
export declare const PostBlockActionRequestSchema: GenMessage<PostBlockActionRequest>;
/**
 * @generated from message tank.message.v1.PostBlockActionResponse
 */
export type PostBlockActionResponse = Message$1<"tank.message.v1.PostBlockActionResponse"> & {};
/**
 * Describes the message tank.message.v1.PostBlockActionResponse.
 * Use `create(PostBlockActionResponseSchema)` to create a new message.
 */
export declare const PostBlockActionResponseSchema: GenMessage<PostBlockActionResponse>;
/**
 * @generated from enum tank.message.v1.MessageKind
 */
export declare enum MessageKind {
    /**
     * @generated from enum value: MESSAGE_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: MESSAGE_KIND_MESSAGE = 1;
     */
    MESSAGE = 1,
    /**
     * @generated from enum value: MESSAGE_KIND_SYSTEM = 2;
     */
    SYSTEM = 2,
    /**
     * @generated from enum value: MESSAGE_KIND_AGENT_EVENT = 3;
     */
    AGENT_EVENT = 3,
    /**
     * @generated from enum value: MESSAGE_KIND_BOT = 4;
     */
    BOT = 4
}
/**
 * Describes the enum tank.message.v1.MessageKind.
 */
export declare const MessageKindSchema: GenEnum<MessageKind>;
/**
 * @generated from service tank.message.v1.ChatService
 */
export declare const ChatService: GenService<{
    /**
     * @generated from rpc tank.message.v1.ChatService.PostMessage
     */
    postMessage: {
        methodKind: "unary";
        input: typeof PostMessageRequestSchema;
        output: typeof PostMessageResponseSchema;
    };
    /**
     * @generated from rpc tank.message.v1.ChatService.UpdateMessage
     */
    updateMessage: {
        methodKind: "unary";
        input: typeof UpdateMessageRequestSchema;
        output: typeof UpdateMessageResponseSchema;
    };
    /**
     * @generated from rpc tank.message.v1.ChatService.DeleteMessage
     */
    deleteMessage: {
        methodKind: "unary";
        input: typeof DeleteMessageRequestSchema;
        output: typeof DeleteMessageResponseSchema;
    };
    /**
     * @generated from rpc tank.message.v1.ChatService.ListMessages
     */
    listMessages: {
        methodKind: "unary";
        input: typeof ListMessagesRequestSchema;
        output: typeof ListMessagesResponseSchema;
    };
    /**
     * @generated from rpc tank.message.v1.ChatService.GetThread
     */
    getThread: {
        methodKind: "unary";
        input: typeof GetThreadRequestSchema;
        output: typeof GetThreadResponseSchema;
    };
    /**
     * @generated from rpc tank.message.v1.ChatService.MarkRead
     */
    markRead: {
        methodKind: "unary";
        input: typeof MarkReadRequestSchema;
        output: typeof MarkReadResponseSchema;
    };
    /**
     * @generated from rpc tank.message.v1.ChatService.AddReaction
     */
    addReaction: {
        methodKind: "unary";
        input: typeof AddReactionRequestSchema;
        output: typeof AddReactionResponseSchema;
    };
    /**
     * @generated from rpc tank.message.v1.ChatService.RemoveReaction
     */
    removeReaction: {
        methodKind: "unary";
        input: typeof RemoveReactionRequestSchema;
        output: typeof RemoveReactionResponseSchema;
    };
    /**
     * @generated from rpc tank.message.v1.ChatService.SubscribeThread
     */
    subscribeThread: {
        methodKind: "unary";
        input: typeof SubscribeThreadRequestSchema;
        output: typeof SubscribeThreadResponseSchema;
    };
    /**
     * @generated from rpc tank.message.v1.ChatService.PostBlockAction
     */
    postBlockAction: {
        methodKind: "unary";
        input: typeof PostBlockActionRequestSchema;
        output: typeof PostBlockActionResponseSchema;
    };
}>;
