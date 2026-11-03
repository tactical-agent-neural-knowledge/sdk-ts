import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Attachment } from "../../ai/v1/ai_pb.js";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/neural/v1/neural.proto.
 */
export declare const file_tank_neural_v1_neural: GenFile;
/**
 * An API key as its workspace sees it. The secret is shown once, when it is made.
 *
 * @generated from message tank.neural.v1.ApiKey
 */
export type ApiKey = Message<"tank.neural.v1.ApiKey"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * The key's last four characters, so a person can tell keys apart.
     *
     * @generated from field: string last4 = 3;
     */
    last4: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 4;
     */
    createdAt?: Timestamp;
    /**
     * Unset when the key has never been used.
     *
     * @generated from field: google.protobuf.Timestamp last_used_at = 5;
     */
    lastUsedAt?: Timestamp;
    /**
     * @generated from field: string created_by = 6;
     */
    createdBy: string;
};
/**
 * Describes the message tank.neural.v1.ApiKey.
 * Use `create(ApiKeySchema)` to create a new message.
 */
export declare const ApiKeySchema: GenMessage<ApiKey>;
/**
 * @generated from message tank.neural.v1.ListApiKeysRequest
 */
export type ListApiKeysRequest = Message<"tank.neural.v1.ListApiKeysRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.neural.v1.ListApiKeysRequest.
 * Use `create(ListApiKeysRequestSchema)` to create a new message.
 */
export declare const ListApiKeysRequestSchema: GenMessage<ListApiKeysRequest>;
/**
 * @generated from message tank.neural.v1.ListApiKeysResponse
 */
export type ListApiKeysResponse = Message<"tank.neural.v1.ListApiKeysResponse"> & {
    /**
     * @generated from field: repeated tank.neural.v1.ApiKey keys = 1;
     */
    keys: ApiKey[];
};
/**
 * Describes the message tank.neural.v1.ListApiKeysResponse.
 * Use `create(ListApiKeysResponseSchema)` to create a new message.
 */
export declare const ListApiKeysResponseSchema: GenMessage<ListApiKeysResponse>;
/**
 * @generated from message tank.neural.v1.CreateApiKeyRequest
 */
export type CreateApiKeyRequest = Message<"tank.neural.v1.CreateApiKeyRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
};
/**
 * Describes the message tank.neural.v1.CreateApiKeyRequest.
 * Use `create(CreateApiKeyRequestSchema)` to create a new message.
 */
export declare const CreateApiKeyRequestSchema: GenMessage<CreateApiKeyRequest>;
/**
 * @generated from message tank.neural.v1.CreateApiKeyResponse
 */
export type CreateApiKeyResponse = Message<"tank.neural.v1.CreateApiKeyResponse"> & {
    /**
     * @generated from field: tank.neural.v1.ApiKey key = 1;
     */
    key?: ApiKey;
    /**
     * The key itself, returned this once and never again.
     *
     * @generated from field: string secret = 2;
     */
    secret: string;
};
/**
 * Describes the message tank.neural.v1.CreateApiKeyResponse.
 * Use `create(CreateApiKeyResponseSchema)` to create a new message.
 */
export declare const CreateApiKeyResponseSchema: GenMessage<CreateApiKeyResponse>;
/**
 * @generated from message tank.neural.v1.RevokeApiKeyRequest
 */
export type RevokeApiKeyRequest = Message<"tank.neural.v1.RevokeApiKeyRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string key_id = 2;
     */
    keyId: string;
};
/**
 * Describes the message tank.neural.v1.RevokeApiKeyRequest.
 * Use `create(RevokeApiKeyRequestSchema)` to create a new message.
 */
export declare const RevokeApiKeyRequestSchema: GenMessage<RevokeApiKeyRequest>;
/**
 * @generated from message tank.neural.v1.RevokeApiKeyResponse
 */
export type RevokeApiKeyResponse = Message<"tank.neural.v1.RevokeApiKeyResponse"> & {};
/**
 * Describes the message tank.neural.v1.RevokeApiKeyResponse.
 * Use `create(RevokeApiKeyResponseSchema)` to create a new message.
 */
export declare const RevokeApiKeyResponseSchema: GenMessage<RevokeApiKeyResponse>;
/**
 * One key's use on one day (UTC).
 *
 * @generated from message tank.neural.v1.UsageDay
 */
export type UsageDay = Message<"tank.neural.v1.UsageDay"> & {
    /**
     * 2026-11-03
     *
     * @generated from field: string day = 1;
     */
    day: string;
    /**
     * @generated from field: string key_id = 2;
     */
    keyId: string;
    /**
     * @generated from field: int64 requests = 3;
     */
    requests: bigint;
    /**
     * @generated from field: int64 input_tokens = 4;
     */
    inputTokens: bigint;
    /**
     * @generated from field: int64 output_tokens = 5;
     */
    outputTokens: bigint;
    /**
     * @generated from field: double charge_usd = 6;
     */
    chargeUsd: number;
};
/**
 * Describes the message tank.neural.v1.UsageDay.
 * Use `create(UsageDaySchema)` to create a new message.
 */
export declare const UsageDaySchema: GenMessage<UsageDay>;
/**
 * @generated from message tank.neural.v1.GetApiUsageRequest
 */
export type GetApiUsageRequest = Message<"tank.neural.v1.GetApiUsageRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.neural.v1.GetApiUsageRequest.
 * Use `create(GetApiUsageRequestSchema)` to create a new message.
 */
export declare const GetApiUsageRequestSchema: GenMessage<GetApiUsageRequest>;
/**
 * This month's use of the workspace's keys, by day and key, and the totals.
 *
 * @generated from message tank.neural.v1.GetApiUsageResponse
 */
export type GetApiUsageResponse = Message<"tank.neural.v1.GetApiUsageResponse"> & {
    /**
     * @generated from field: repeated tank.neural.v1.UsageDay days = 1;
     */
    days: UsageDay[];
    /**
     * @generated from field: int64 requests = 2;
     */
    requests: bigint;
    /**
     * @generated from field: int64 input_tokens = 3;
     */
    inputTokens: bigint;
    /**
     * @generated from field: int64 output_tokens = 4;
     */
    outputTokens: bigint;
    /**
     * @generated from field: double charge_usd = 5;
     */
    chargeUsd: number;
};
/**
 * Describes the message tank.neural.v1.GetApiUsageResponse.
 * Use `create(GetApiUsageResponseSchema)` to create a new message.
 */
export declare const GetApiUsageResponseSchema: GenMessage<GetApiUsageResponse>;
/**
 * One turn of a conversation the caller keeps.
 *
 * @generated from message tank.neural.v1.ChatMessage
 */
export type ChatMessage = Message<"tank.neural.v1.ChatMessage"> & {
    /**
     * "user" or "assistant"
     *
     * @generated from field: string role = 1;
     */
    role: string;
    /**
     * @generated from field: string text = 2;
     */
    text: string;
    /**
     * Pictures and text files travel as bytes; a video is uploaded first (FilesService
     * CreateUpload / CompleteUpload, with the same key) and named by file_id.
     *
     * @generated from field: repeated tank.ai.v1.Attachment attachments = 3;
     */
    attachments: Attachment[];
};
/**
 * Describes the message tank.neural.v1.ChatMessage.
 * Use `create(ChatMessageSchema)` to create a new message.
 */
export declare const ChatMessageSchema: GenMessage<ChatMessage>;
/**
 * @generated from message tank.neural.v1.ChatRequest
 */
export type ChatRequest = Message<"tank.neural.v1.ChatRequest"> & {
    /**
     * Oldest first; the last is the caller's new message.
     *
     * @generated from field: repeated tank.neural.v1.ChatMessage messages = 1;
     */
    messages: ChatMessage[];
    /**
     * The caller's own instructions, after TANK's.
     *
     * @generated from field: string instructions = 2;
     */
    instructions: string;
    /**
     * Look the question up in TANK's own web index first, and cite what was used.
     *
     * @generated from field: bool look_up = 3;
     */
    lookUp: boolean;
};
/**
 * Describes the message tank.neural.v1.ChatRequest.
 * Use `create(ChatRequestSchema)` to create a new message.
 */
export declare const ChatRequestSchema: GenMessage<ChatRequest>;
/**
 * @generated from message tank.neural.v1.ChatDone
 */
export type ChatDone = Message<"tank.neural.v1.ChatDone"> & {
    /**
     * the reply's id, as it appears in usage
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string stop_reason = 2;
     */
    stopReason: string;
    /**
     * @generated from field: int32 input_tokens = 3;
     */
    inputTokens: number;
    /**
     * @generated from field: int32 output_tokens = 4;
     */
    outputTokens: number;
    /**
     * @generated from field: double charge_usd = 5;
     */
    chargeUsd: number;
};
/**
 * Describes the message tank.neural.v1.ChatDone.
 * Use `create(ChatDoneSchema)` to create a new message.
 */
export declare const ChatDoneSchema: GenMessage<ChatDone>;
/**
 * @generated from message tank.neural.v1.ChatResponse
 */
export type ChatResponse = Message<"tank.neural.v1.ChatResponse"> & {
    /**
     * @generated from oneof tank.neural.v1.ChatResponse.event
     */
    event: {
        /**
         * the next piece of the reply's text
         *
         * @generated from field: string delta = 1;
         */
        value: string;
        case: "delta";
    } | {
        /**
         * last
         *
         * @generated from field: tank.neural.v1.ChatDone done = 2;
         */
        value: ChatDone;
        case: "done";
    } | {
        case: undefined;
        value?: undefined;
    };
};
/**
 * Describes the message tank.neural.v1.ChatResponse.
 * Use `create(ChatResponseSchema)` to create a new message.
 */
export declare const ChatResponseSchema: GenMessage<ChatResponse>;
/**
 * Managing keys: a workspace's owners and admins, signed in.
 *
 * @generated from service tank.neural.v1.NeuralKeyService
 */
export declare const NeuralKeyService: GenService<{
    /**
     * @generated from rpc tank.neural.v1.NeuralKeyService.ListApiKeys
     */
    listApiKeys: {
        methodKind: "unary";
        input: typeof ListApiKeysRequestSchema;
        output: typeof ListApiKeysResponseSchema;
    };
    /**
     * @generated from rpc tank.neural.v1.NeuralKeyService.CreateApiKey
     */
    createApiKey: {
        methodKind: "unary";
        input: typeof CreateApiKeyRequestSchema;
        output: typeof CreateApiKeyResponseSchema;
    };
    /**
     * @generated from rpc tank.neural.v1.NeuralKeyService.RevokeApiKey
     */
    revokeApiKey: {
        methodKind: "unary";
        input: typeof RevokeApiKeyRequestSchema;
        output: typeof RevokeApiKeyResponseSchema;
    };
    /**
     * @generated from rpc tank.neural.v1.NeuralKeyService.GetApiUsage
     */
    getApiUsage: {
        methodKind: "unary";
        input: typeof GetApiUsageRequestSchema;
        output: typeof GetApiUsageResponseSchema;
    };
}>;
/**
 * Called with an API key: "Authorization: Bearer <key>".
 *
 * @generated from service tank.neural.v1.NeuralService
 */
export declare const NeuralService: GenService<{
    /**
     * @generated from rpc tank.neural.v1.NeuralService.Chat
     */
    chat: {
        methodKind: "server_streaming";
        input: typeof ChatRequestSchema;
        output: typeof ChatResponseSchema;
    };
}>;
