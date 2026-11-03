import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message as Message$1 } from "@bufbuild/protobuf";
/**
 * Describes the file tank/ai/v1/ai.proto.
 */
export declare const file_tank_ai_v1_ai: GenFile;
/**
 * @generated from message tank.ai.v1.Conversation
 */
export type Conversation = Message$1<"tank.ai.v1.Conversation"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string title = 2;
     */
    title: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 3;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 4;
     */
    updatedAt?: Timestamp;
    /**
     * The first words of the first message, for the list when there is no title yet.
     *
     * @generated from field: string preview = 5;
     */
    preview: string;
    /**
     * @generated from field: bool pinned = 6;
     */
    pinned: boolean;
    /**
     * The workspace this conversation acts in, or empty for a personal one. In a
     * workspace, the person's own Neuron for it and its Vault join the answer; the
     * person must be a member, and a conversation keeps its workspace for life.
     *
     * @generated from field: string workspace_id = 7;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.ai.v1.Conversation.
 * Use `create(ConversationSchema)` to create a new message.
 */
export declare const ConversationSchema: GenMessage<Conversation>;
/**
 * An attachment a person sends with a message: an image the model can see or a text file
 * whose contents are given to it. Bytes travel in the request; the stored copy is what the
 * conversation shows afterwards.
 *
 * @generated from message tank.ai.v1.Attachment
 */
export type Attachment = Message$1<"tank.ai.v1.Attachment"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string mime = 3;
     */
    mime: string;
    /**
     * @generated from field: bytes data = 4;
     */
    data: Uint8Array;
    /**
     * @generated from field: int64 size = 5;
     */
    size: bigint;
    /**
     * A video, uploaded through FilesService into the conversation's workspace first,
     * because it is too large to travel in the request: data is empty and the server reads
     * the file itself. TANK's own models see its frames and hear its speech; nothing else
     * does. Clients play it back through FilesService.GetDownloadUrl.
     *
     * @generated from field: string file_id = 6;
     */
    fileId: string;
};
/**
 * Describes the message tank.ai.v1.Attachment.
 * Use `create(AttachmentSchema)` to create a new message.
 */
export declare const AttachmentSchema: GenMessage<Attachment>;
/**
 * @generated from message tank.ai.v1.Message
 */
export type Message = Message$1<"tank.ai.v1.Message"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string conversation_id = 2;
     */
    conversationId: string;
    /**
     * @generated from field: tank.ai.v1.Role role = 3;
     */
    role: Role;
    /**
     * @generated from field: string text = 4;
     */
    text: string;
    /**
     * @generated from field: repeated tank.ai.v1.Attachment attachments = 5;
     */
    attachments: Attachment[];
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 6;
     */
    createdAt?: Timestamp;
    /**
     * Why an assistant turn ended: "end_turn", "max_tokens", "stopped" (the person pressed
     * stop), "error".
     *
     * @generated from field: string stop_reason = 7;
     */
    stopReason: string;
    /**
     * @generated from field: int32 input_tokens = 8;
     */
    inputTokens: number;
    /**
     * @generated from field: int32 output_tokens = 9;
     */
    outputTokens: number;
    /**
     * -1 thumbs down, 0 none, 1 thumbs up.
     *
     * @generated from field: int32 rating = 10;
     */
    rating: number;
    /**
     * How current the sources behind an assistant turn were, as the server says it ("Sources
     * from today"); empty when nothing was looked up.
     *
     * @generated from field: string as_of = 11;
     */
    asOf: string;
};
/**
 * Describes the message tank.ai.v1.Message.
 * Use `create(MessageSchema)` to create a new message.
 */
export declare const MessageSchema: GenMessage<Message>;
/**
 * @generated from message tank.ai.v1.ListConversationsRequest
 */
export type ListConversationsRequest = Message$1<"tank.ai.v1.ListConversationsRequest"> & {
    /**
     * Matches the title and the first message; empty lists everything.
     *
     * @generated from field: string query = 1;
     */
    query: string;
    /**
     * @generated from field: int32 limit = 2;
     */
    limit: number;
    /**
     * With a workspace id: only the caller's conversations in that workspace, for its TANK
     * Neural section (2026-11-01). Empty keeps the list as it was: every conversation.
     *
     * @generated from field: string workspace_id = 3;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.ai.v1.ListConversationsRequest.
 * Use `create(ListConversationsRequestSchema)` to create a new message.
 */
export declare const ListConversationsRequestSchema: GenMessage<ListConversationsRequest>;
/**
 * @generated from message tank.ai.v1.ListConversationsResponse
 */
export type ListConversationsResponse = Message$1<"tank.ai.v1.ListConversationsResponse"> & {
    /**
     * @generated from field: repeated tank.ai.v1.Conversation conversations = 1;
     */
    conversations: Conversation[];
};
/**
 * Describes the message tank.ai.v1.ListConversationsResponse.
 * Use `create(ListConversationsResponseSchema)` to create a new message.
 */
export declare const ListConversationsResponseSchema: GenMessage<ListConversationsResponse>;
/**
 * @generated from message tank.ai.v1.GetConversationRequest
 */
export type GetConversationRequest = Message$1<"tank.ai.v1.GetConversationRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
};
/**
 * Describes the message tank.ai.v1.GetConversationRequest.
 * Use `create(GetConversationRequestSchema)` to create a new message.
 */
export declare const GetConversationRequestSchema: GenMessage<GetConversationRequest>;
/**
 * @generated from message tank.ai.v1.GetConversationResponse
 */
export type GetConversationResponse = Message$1<"tank.ai.v1.GetConversationResponse"> & {
    /**
     * @generated from field: tank.ai.v1.Conversation conversation = 1;
     */
    conversation?: Conversation;
    /**
     * @generated from field: repeated tank.ai.v1.Message messages = 2;
     */
    messages: Message[];
    /**
     * The Markdown files from this conversation that are pages in Atlas, oldest first. A page
     * since deleted is not listed.
     *
     * @generated from field: repeated tank.ai.v1.AtlasPage atlas_pages = 3;
     */
    atlasPages: AtlasPage[];
};
/**
 * Describes the message tank.ai.v1.GetConversationResponse.
 * Use `create(GetConversationResponseSchema)` to create a new message.
 */
export declare const GetConversationResponseSchema: GenMessage<GetConversationResponse>;
/**
 * A Markdown file Neural wrote, added to Atlas from this conversation (Robby, 2026-11-03:
 * a file already added is not offered again; a changed one is offered as a new page or as
 * a replacement for the page it made).
 *
 * @generated from message tank.ai.v1.AtlasPage
 */
export type AtlasPage = Message$1<"tank.ai.v1.AtlasPage"> & {
    /**
     * the file's name, as Neural's fence named it
     *
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string canvas_id = 2;
     */
    canvasId: string;
    /**
     * The Markdown the page was last made from: the same text means the file is in Atlas.
     *
     * @generated from field: string markdown = 3;
     */
    markdown: string;
    /**
     * @generated from field: google.protobuf.Timestamp added_at = 4;
     */
    addedAt?: Timestamp;
};
/**
 * Describes the message tank.ai.v1.AtlasPage.
 * Use `create(AtlasPageSchema)` to create a new message.
 */
export declare const AtlasPageSchema: GenMessage<AtlasPage>;
/**
 * AddToAtlas makes a page from a file in a workspace conversation, or with
 * replace_canvas_id replaces the page an earlier version of it made (that page must be
 * one of this conversation's atlas_pages, and the person must be able to edit it).
 *
 * @generated from message tank.ai.v1.AddToAtlasRequest
 */
export type AddToAtlasRequest = Message$1<"tank.ai.v1.AddToAtlasRequest"> & {
    /**
     * @generated from field: string conversation_id = 1;
     */
    conversationId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string markdown = 3;
     */
    markdown: string;
    /**
     * @generated from field: string replace_canvas_id = 4;
     */
    replaceCanvasId: string;
};
/**
 * Describes the message tank.ai.v1.AddToAtlasRequest.
 * Use `create(AddToAtlasRequestSchema)` to create a new message.
 */
export declare const AddToAtlasRequestSchema: GenMessage<AddToAtlasRequest>;
/**
 * @generated from message tank.ai.v1.AddToAtlasResponse
 */
export type AddToAtlasResponse = Message$1<"tank.ai.v1.AddToAtlasResponse"> & {
    /**
     * @generated from field: tank.ai.v1.AtlasPage page = 1;
     */
    page?: AtlasPage;
};
/**
 * Describes the message tank.ai.v1.AddToAtlasResponse.
 * Use `create(AddToAtlasResponseSchema)` to create a new message.
 */
export declare const AddToAtlasResponseSchema: GenMessage<AddToAtlasResponse>;
/**
 * @generated from message tank.ai.v1.CreateConversationRequest
 */
export type CreateConversationRequest = Message$1<"tank.ai.v1.CreateConversationRequest"> & {
    /**
     * Empty for a personal conversation (see Conversation.workspace_id).
     *
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.ai.v1.CreateConversationRequest.
 * Use `create(CreateConversationRequestSchema)` to create a new message.
 */
export declare const CreateConversationRequestSchema: GenMessage<CreateConversationRequest>;
/**
 * @generated from message tank.ai.v1.CreateConversationResponse
 */
export type CreateConversationResponse = Message$1<"tank.ai.v1.CreateConversationResponse"> & {
    /**
     * @generated from field: tank.ai.v1.Conversation conversation = 1;
     */
    conversation?: Conversation;
};
/**
 * Describes the message tank.ai.v1.CreateConversationResponse.
 * Use `create(CreateConversationResponseSchema)` to create a new message.
 */
export declare const CreateConversationResponseSchema: GenMessage<CreateConversationResponse>;
/**
 * @generated from message tank.ai.v1.UpdateConversationRequest
 */
export type UpdateConversationRequest = Message$1<"tank.ai.v1.UpdateConversationRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * Empty keeps the title; the server titles a new conversation itself after the first reply.
     *
     * @generated from field: string title = 2;
     */
    title: string;
    /**
     * @generated from field: bool set_title = 3;
     */
    setTitle: boolean;
    /**
     * @generated from field: bool pinned = 4;
     */
    pinned: boolean;
    /**
     * @generated from field: bool set_pinned = 5;
     */
    setPinned: boolean;
};
/**
 * Describes the message tank.ai.v1.UpdateConversationRequest.
 * Use `create(UpdateConversationRequestSchema)` to create a new message.
 */
export declare const UpdateConversationRequestSchema: GenMessage<UpdateConversationRequest>;
/**
 * @generated from message tank.ai.v1.UpdateConversationResponse
 */
export type UpdateConversationResponse = Message$1<"tank.ai.v1.UpdateConversationResponse"> & {
    /**
     * @generated from field: tank.ai.v1.Conversation conversation = 1;
     */
    conversation?: Conversation;
};
/**
 * Describes the message tank.ai.v1.UpdateConversationResponse.
 * Use `create(UpdateConversationResponseSchema)` to create a new message.
 */
export declare const UpdateConversationResponseSchema: GenMessage<UpdateConversationResponse>;
/**
 * @generated from message tank.ai.v1.DeleteConversationRequest
 */
export type DeleteConversationRequest = Message$1<"tank.ai.v1.DeleteConversationRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
};
/**
 * Describes the message tank.ai.v1.DeleteConversationRequest.
 * Use `create(DeleteConversationRequestSchema)` to create a new message.
 */
export declare const DeleteConversationRequestSchema: GenMessage<DeleteConversationRequest>;
/**
 * @generated from message tank.ai.v1.DeleteConversationResponse
 */
export type DeleteConversationResponse = Message$1<"tank.ai.v1.DeleteConversationResponse"> & {};
/**
 * Describes the message tank.ai.v1.DeleteConversationResponse.
 * Use `create(DeleteConversationResponseSchema)` to create a new message.
 */
export declare const DeleteConversationResponseSchema: GenMessage<DeleteConversationResponse>;
/**
 * SendMessage adds the person's message and streams the model's reply. Closing the stream
 * stops the reply; what had arrived is kept and marked "stopped".
 *
 * @generated from message tank.ai.v1.SendMessageRequest
 */
export type SendMessageRequest = Message$1<"tank.ai.v1.SendMessageRequest"> & {
    /**
     * Empty creates a conversation and the first event names it.
     *
     * @generated from field: string conversation_id = 1;
     */
    conversationId: string;
    /**
     * @generated from field: string text = 2;
     */
    text: string;
    /**
     * @generated from field: repeated tank.ai.v1.Attachment attachments = 3;
     */
    attachments: Attachment[];
    /**
     * Regenerate: no new text; the assistant message with this id and everything after it
     * are replaced by a fresh reply.
     *
     * @generated from field: string regenerate_message_id = 4;
     */
    regenerateMessageId: string;
    /**
     * Edit and resend: this user message and everything after it are replaced by text.
     *
     * @generated from field: string replace_message_id = 5;
     */
    replaceMessageId: string;
    /**
     * For a message that creates the conversation (empty conversation_id): the
     * workspace it acts in, or empty for a personal one. Ignored otherwise.
     *
     * @generated from field: string workspace_id = 6;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.ai.v1.SendMessageRequest.
 * Use `create(SendMessageRequestSchema)` to create a new message.
 */
export declare const SendMessageRequestSchema: GenMessage<SendMessageRequest>;
/**
 * @generated from message tank.ai.v1.SendMessageResponse
 */
export type SendMessageResponse = Message$1<"tank.ai.v1.SendMessageResponse"> & {
    /**
     * @generated from oneof tank.ai.v1.SendMessageResponse.event
     */
    event: {
        /**
         * First: the conversation (new or existing) and the stored user message.
         *
         * @generated from field: tank.ai.v1.Started started = 1;
         */
        value: Started;
        case: "started";
    } | {
        /**
         * A piece of the reply as it arrives.
         *
         * @generated from field: string delta = 2;
         */
        value: string;
        case: "delta";
    } | {
        /**
         * Last: the stored assistant message, with tokens and the stop reason.
         *
         * @generated from field: tank.ai.v1.Message done = 3;
         */
        value: Message;
        case: "done";
    } | {
        /**
         * The conversation got a title (after the first reply).
         *
         * @generated from field: string title = 4;
         */
        value: string;
        case: "title";
    } | {
        /**
         * The model was asleep and is starting: the reply follows in a few minutes. The
         * sentence to show, from the server.
         *
         * @generated from field: string warming = 5;
         */
        value: string;
        case: "warming";
    } | {
        /**
         * What Neural is doing before the first word: sorting the question, searching, reading
         * what it found, writing. Each one replaces the last; the reply's first delta ends them.
         *
         * @generated from field: tank.ai.v1.Stage stage = 6;
         */
        value: Stage;
        case: "stage";
    } | {
        case: undefined;
        value?: undefined;
    };
};
/**
 * Describes the message tank.ai.v1.SendMessageResponse.
 * Use `create(SendMessageResponseSchema)` to create a new message.
 */
export declare const SendMessageResponseSchema: GenMessage<SendMessageResponse>;
/**
 * Stage is one step of the work before a reply, as the server names it.
 *
 * @generated from message tank.ai.v1.Stage
 */
export type Stage = Message$1<"tank.ai.v1.Stage"> & {
    /**
     * sorting | searching | reading | writing | outline
     *
     * @generated from field: string kind = 1;
     */
    kind: string;
    /**
     * The line to show, from the server (for example "Searching 6.1M pages"). Empty for an
     * outline, which has no line of its own.
     *
     * @generated from field: string text = 2;
     */
    text: string;
    /**
     * Reading: the pages found, in the order the answer numbers them.
     *
     * @generated from field: repeated tank.ai.v1.StageSource sources = 3;
     */
    sources: StageSource[];
    /**
     * Outline: the sections a long answer is about to write, in order. It arrives with or
     * after the first words and the clients tick each one off as its heading appears.
     *
     * @generated from field: repeated string outline = 4;
     */
    outline: string[];
};
/**
 * Describes the message tank.ai.v1.Stage.
 * Use `create(StageSchema)` to create a new message.
 */
export declare const StageSchema: GenMessage<Stage>;
/**
 * @generated from message tank.ai.v1.StageSource
 */
export type StageSource = Message$1<"tank.ai.v1.StageSource"> & {
    /**
     * @generated from field: string title = 1;
     */
    title: string;
    /**
     * The site, for the chip: "en.wikipedia.org".
     *
     * @generated from field: string host = 2;
     */
    host: string;
    /**
     * @generated from field: string url = 3;
     */
    url: string;
};
/**
 * Describes the message tank.ai.v1.StageSource.
 * Use `create(StageSourceSchema)` to create a new message.
 */
export declare const StageSourceSchema: GenMessage<StageSource>;
/**
 * @generated from message tank.ai.v1.Started
 */
export type Started = Message$1<"tank.ai.v1.Started"> & {
    /**
     * @generated from field: tank.ai.v1.Conversation conversation = 1;
     */
    conversation?: Conversation;
    /**
     * @generated from field: tank.ai.v1.Message user_message = 2;
     */
    userMessage?: Message;
    /**
     * The assistant message's id, assigned before the first delta so a stop can name it.
     *
     * @generated from field: string assistant_message_id = 3;
     */
    assistantMessageId: string;
};
/**
 * Describes the message tank.ai.v1.Started.
 * Use `create(StartedSchema)` to create a new message.
 */
export declare const StartedSchema: GenMessage<Started>;
/**
 * @generated from message tank.ai.v1.RateMessageRequest
 */
export type RateMessageRequest = Message$1<"tank.ai.v1.RateMessageRequest"> & {
    /**
     * @generated from field: string message_id = 1;
     */
    messageId: string;
    /**
     * @generated from field: int32 rating = 2;
     */
    rating: number;
};
/**
 * Describes the message tank.ai.v1.RateMessageRequest.
 * Use `create(RateMessageRequestSchema)` to create a new message.
 */
export declare const RateMessageRequestSchema: GenMessage<RateMessageRequest>;
/**
 * @generated from message tank.ai.v1.RateMessageResponse
 */
export type RateMessageResponse = Message$1<"tank.ai.v1.RateMessageResponse"> & {};
/**
 * Describes the message tank.ai.v1.RateMessageResponse.
 * Use `create(RateMessageResponseSchema)` to create a new message.
 */
export declare const RateMessageResponseSchema: GenMessage<RateMessageResponse>;
/**
 * Stops a reply the server is writing. A reply belongs to the server once it starts, so a
 * dropped connection does not stop it (the client fetches the stored reply instead); only
 * this does. The reply is stored as far as it got, with stop_reason "stopped".
 *
 * @generated from message tank.ai.v1.StopReplyRequest
 */
export type StopReplyRequest = Message$1<"tank.ai.v1.StopReplyRequest"> & {
    /**
     * the assistant message id from Started
     *
     * @generated from field: string message_id = 1;
     */
    messageId: string;
};
/**
 * Describes the message tank.ai.v1.StopReplyRequest.
 * Use `create(StopReplyRequestSchema)` to create a new message.
 */
export declare const StopReplyRequestSchema: GenMessage<StopReplyRequest>;
/**
 * @generated from message tank.ai.v1.StopReplyResponse
 */
export type StopReplyResponse = Message$1<"tank.ai.v1.StopReplyResponse"> & {};
/**
 * Describes the message tank.ai.v1.StopReplyResponse.
 * Use `create(StopReplyResponseSchema)` to create a new message.
 */
export declare const StopReplyResponseSchema: GenMessage<StopReplyResponse>;
/**
 * What the person wants the model to know every time: name, how to answer, their work.
 *
 * @generated from message tank.ai.v1.GetSettingsRequest
 */
export type GetSettingsRequest = Message$1<"tank.ai.v1.GetSettingsRequest"> & {};
/**
 * Describes the message tank.ai.v1.GetSettingsRequest.
 * Use `create(GetSettingsRequestSchema)` to create a new message.
 */
export declare const GetSettingsRequestSchema: GenMessage<GetSettingsRequest>;
/**
 * @generated from message tank.ai.v1.GetSettingsResponse
 */
export type GetSettingsResponse = Message$1<"tank.ai.v1.GetSettingsResponse"> & {
    /**
     * @generated from field: tank.ai.v1.Settings settings = 1;
     */
    settings?: Settings;
};
/**
 * Describes the message tank.ai.v1.GetSettingsResponse.
 * Use `create(GetSettingsResponseSchema)` to create a new message.
 */
export declare const GetSettingsResponseSchema: GenMessage<GetSettingsResponse>;
/**
 * @generated from message tank.ai.v1.Settings
 */
export type Settings = Message$1<"tank.ai.v1.Settings"> & {
    /**
     * @generated from field: string instructions = 1;
     */
    instructions: string;
    /**
     * The model offered, for the page's header: "Neural 1.0".
     *
     * @generated from field: string model_label = 2;
     */
    modelLabel: string;
    /**
     * Whether TANK's own model is serving. False means the page says it is coming and
     * counts down to launch_at; nothing answers in its place.
     *
     * @generated from field: bool available = 3;
     */
    available: boolean;
    /**
     * @generated from field: google.protobuf.Timestamp launch_at = 4;
     */
    launchAt?: Timestamp;
};
/**
 * Describes the message tank.ai.v1.Settings.
 * Use `create(SettingsSchema)` to create a new message.
 */
export declare const SettingsSchema: GenMessage<Settings>;
/**
 * @generated from message tank.ai.v1.UpdateSettingsRequest
 */
export type UpdateSettingsRequest = Message$1<"tank.ai.v1.UpdateSettingsRequest"> & {
    /**
     * @generated from field: string instructions = 1;
     */
    instructions: string;
};
/**
 * Describes the message tank.ai.v1.UpdateSettingsRequest.
 * Use `create(UpdateSettingsRequestSchema)` to create a new message.
 */
export declare const UpdateSettingsRequestSchema: GenMessage<UpdateSettingsRequest>;
/**
 * @generated from message tank.ai.v1.UpdateSettingsResponse
 */
export type UpdateSettingsResponse = Message$1<"tank.ai.v1.UpdateSettingsResponse"> & {
    /**
     * @generated from field: tank.ai.v1.Settings settings = 1;
     */
    settings?: Settings;
};
/**
 * Describes the message tank.ai.v1.UpdateSettingsResponse.
 * Use `create(UpdateSettingsResponseSchema)` to create a new message.
 */
export declare const UpdateSettingsResponseSchema: GenMessage<UpdateSettingsResponse>;
/**
 * GetUsage is what the person's chats have used: per day for the last `days`, in total,
 * and by conversation. Cost is in millionths of a dollar so nothing here is a float.
 *
 * @generated from message tank.ai.v1.GetUsageRequest
 */
export type GetUsageRequest = Message$1<"tank.ai.v1.GetUsageRequest"> & {
    /**
     * @generated from field: int32 days = 1;
     */
    days: number;
};
/**
 * Describes the message tank.ai.v1.GetUsageRequest.
 * Use `create(GetUsageRequestSchema)` to create a new message.
 */
export declare const GetUsageRequestSchema: GenMessage<GetUsageRequest>;
/**
 * @generated from message tank.ai.v1.UsageDay
 */
export type UsageDay = Message$1<"tank.ai.v1.UsageDay"> & {
    /**
     * YYYY-MM-DD, in UTC
     *
     * @generated from field: string date = 1;
     */
    date: string;
    /**
     * @generated from field: int32 messages = 2;
     */
    messages: number;
    /**
     * @generated from field: int64 input_tokens = 3;
     */
    inputTokens: bigint;
    /**
     * @generated from field: int64 output_tokens = 4;
     */
    outputTokens: bigint;
    /**
     * @generated from field: int64 cost_micro_usd = 5;
     */
    costMicroUsd: bigint;
};
/**
 * Describes the message tank.ai.v1.UsageDay.
 * Use `create(UsageDaySchema)` to create a new message.
 */
export declare const UsageDaySchema: GenMessage<UsageDay>;
/**
 * @generated from message tank.ai.v1.ConversationUsage
 */
export type ConversationUsage = Message$1<"tank.ai.v1.ConversationUsage"> & {
    /**
     * @generated from field: string conversation_id = 1;
     */
    conversationId: string;
    /**
     * @generated from field: string title = 2;
     */
    title: string;
    /**
     * @generated from field: int32 messages = 3;
     */
    messages: number;
    /**
     * @generated from field: int64 input_tokens = 4;
     */
    inputTokens: bigint;
    /**
     * @generated from field: int64 output_tokens = 5;
     */
    outputTokens: bigint;
    /**
     * @generated from field: int64 cost_micro_usd = 6;
     */
    costMicroUsd: bigint;
};
/**
 * Describes the message tank.ai.v1.ConversationUsage.
 * Use `create(ConversationUsageSchema)` to create a new message.
 */
export declare const ConversationUsageSchema: GenMessage<ConversationUsage>;
/**
 * @generated from message tank.ai.v1.GetUsageResponse
 */
export type GetUsageResponse = Message$1<"tank.ai.v1.GetUsageResponse"> & {
    /**
     * @generated from field: repeated tank.ai.v1.UsageDay days = 1;
     */
    days: UsageDay[];
    /**
     * Totals over the same window.
     *
     * @generated from field: int32 messages = 2;
     */
    messages: number;
    /**
     * @generated from field: int64 input_tokens = 3;
     */
    inputTokens: bigint;
    /**
     * @generated from field: int64 output_tokens = 4;
     */
    outputTokens: bigint;
    /**
     * @generated from field: int64 cost_micro_usd = 5;
     */
    costMicroUsd: bigint;
    /**
     * Today and this calendar month, whatever the window.
     *
     * @generated from field: int32 today_messages = 6;
     */
    todayMessages: number;
    /**
     * @generated from field: int64 month_cost_micro_usd = 7;
     */
    monthCostMicroUsd: bigint;
    /**
     * @generated from field: int64 all_time_messages = 8;
     */
    allTimeMessages: bigint;
    /**
     * @generated from field: repeated tank.ai.v1.ConversationUsage conversations = 9;
     */
    conversations: ConversationUsage[];
    /**
     * @generated from field: string model_label = 10;
     */
    modelLabel: string;
};
/**
 * Describes the message tank.ai.v1.GetUsageResponse.
 * Use `create(GetUsageResponseSchema)` to create a new message.
 */
export declare const GetUsageResponseSchema: GenMessage<GetUsageResponse>;
/**
 * @generated from enum tank.ai.v1.Role
 */
export declare enum Role {
    /**
     * @generated from enum value: ROLE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: ROLE_USER = 1;
     */
    USER = 1,
    /**
     * @generated from enum value: ROLE_ASSISTANT = 2;
     */
    ASSISTANT = 2
}
/**
 * Describes the enum tank.ai.v1.Role.
 */
export declare const RoleSchema: GenEnum<Role>;
/**
 * @generated from service tank.ai.v1.AiService
 */
export declare const AiService: GenService<{
    /**
     * @generated from rpc tank.ai.v1.AiService.ListConversations
     */
    listConversations: {
        methodKind: "unary";
        input: typeof ListConversationsRequestSchema;
        output: typeof ListConversationsResponseSchema;
    };
    /**
     * @generated from rpc tank.ai.v1.AiService.GetConversation
     */
    getConversation: {
        methodKind: "unary";
        input: typeof GetConversationRequestSchema;
        output: typeof GetConversationResponseSchema;
    };
    /**
     * @generated from rpc tank.ai.v1.AiService.CreateConversation
     */
    createConversation: {
        methodKind: "unary";
        input: typeof CreateConversationRequestSchema;
        output: typeof CreateConversationResponseSchema;
    };
    /**
     * @generated from rpc tank.ai.v1.AiService.UpdateConversation
     */
    updateConversation: {
        methodKind: "unary";
        input: typeof UpdateConversationRequestSchema;
        output: typeof UpdateConversationResponseSchema;
    };
    /**
     * @generated from rpc tank.ai.v1.AiService.DeleteConversation
     */
    deleteConversation: {
        methodKind: "unary";
        input: typeof DeleteConversationRequestSchema;
        output: typeof DeleteConversationResponseSchema;
    };
    /**
     * @generated from rpc tank.ai.v1.AiService.SendMessage
     */
    sendMessage: {
        methodKind: "server_streaming";
        input: typeof SendMessageRequestSchema;
        output: typeof SendMessageResponseSchema;
    };
    /**
     * @generated from rpc tank.ai.v1.AiService.RateMessage
     */
    rateMessage: {
        methodKind: "unary";
        input: typeof RateMessageRequestSchema;
        output: typeof RateMessageResponseSchema;
    };
    /**
     * @generated from rpc tank.ai.v1.AiService.StopReply
     */
    stopReply: {
        methodKind: "unary";
        input: typeof StopReplyRequestSchema;
        output: typeof StopReplyResponseSchema;
    };
    /**
     * @generated from rpc tank.ai.v1.AiService.GetSettings
     */
    getSettings: {
        methodKind: "unary";
        input: typeof GetSettingsRequestSchema;
        output: typeof GetSettingsResponseSchema;
    };
    /**
     * @generated from rpc tank.ai.v1.AiService.UpdateSettings
     */
    updateSettings: {
        methodKind: "unary";
        input: typeof UpdateSettingsRequestSchema;
        output: typeof UpdateSettingsResponseSchema;
    };
    /**
     * @generated from rpc tank.ai.v1.AiService.GetUsage
     */
    getUsage: {
        methodKind: "unary";
        input: typeof GetUsageRequestSchema;
        output: typeof GetUsageResponseSchema;
    };
    /**
     * @generated from rpc tank.ai.v1.AiService.AddToAtlas
     */
    addToAtlas: {
        methodKind: "unary";
        input: typeof AddToAtlasRequestSchema;
        output: typeof AddToAtlasResponseSchema;
    };
}>;
