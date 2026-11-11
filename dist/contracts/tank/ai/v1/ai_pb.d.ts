import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { App, AppAccount, Mark } from "../../apps/v1/apps_pb.js";
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
    /**
     * Apps connected to this conversation ("Connect apps"). Their data joins the answer and
     * is cited; any published app may be connected, from any workspace or none.
     *
     * @generated from field: repeated tank.apps.v1.App apps = 8;
     */
    apps: App[];
    /**
     * What Neural has put over the person's camera in this conversation, oldest first. A
     * phone connected here draws them on its camera view; ClearOverlay takes one away.
     *
     * @generated from field: repeated tank.ai.v1.Overlay overlays = 9;
     */
    overlays: Overlay[];
    /**
     * The people in the conversation (Robby, 2026-11-11: "the thing we are adding is people"),
     * the owner first. One member is a personal conversation: Neural answers every message.
     * With more, Neural answers a message that addresses it ("Neural, ...", "@Neural").
     *
     * @generated from field: repeated tank.ai.v1.Member members = 10;
     */
    members: Member[];
    /**
     * Webpages connected to the conversation ("Connect a webpage"), from tank.browse.v1: id,
     * address and title, so the list and the chat show them without another call.
     *
     * @generated from field: repeated tank.ai.v1.ConnectedPage pages = 11;
     */
    pages: ConnectedPage[];
    /**
     * For the chat list (Robby's redesign, 2026-11-11): the newest message, who wrote it and
     * when, so a row reads "Sam: …" with its time.
     *
     * @generated from field: string last_text = 12;
     */
    lastText: string;
    /**
     * @generated from field: string last_author_id = 13;
     */
    lastAuthorId: string;
    /**
     * @generated from field: string last_author_name = 14;
     */
    lastAuthorName: string;
    /**
     * "user" or "assistant".
     *
     * @generated from field: string last_role = 15;
     */
    lastRole: string;
    /**
     * @generated from field: google.protobuf.Timestamp last_at = 16;
     */
    lastAt?: Timestamp;
    /**
     * Messages after the caller last read the conversation; 0 when read.
     *
     * @generated from field: int32 unread = 17;
     */
    unread: number;
    /**
     * The caller has muted it: no pushes.
     *
     * @generated from field: bool muted = 18;
     */
    muted: boolean;
    /**
     * Devices connected to it now, for the row's avatar and the LIVE card.
     *
     * @generated from field: repeated tank.ai.v1.ConnectedDevice devices = 19;
     */
    devices: ConnectedDevice[];
    /**
     * Who connected each app, so an app the person signed in to shows whose account it reads
     * ("Datum · Robby's account"). In a shared conversation such an app answers only the
     * messages of the person whose account it is.
     *
     * @generated from field: repeated tank.ai.v1.AppConnection app_connections = 20;
     */
    appConnections: AppConnection[];
};
/**
 * Describes the message tank.ai.v1.Conversation.
 * Use `create(ConversationSchema)` to create a new message.
 */
export declare const ConversationSchema: GenMessage<Conversation>;
/**
 * @generated from message tank.ai.v1.AppConnection
 */
export type AppConnection = Message$1<"tank.ai.v1.AppConnection"> & {
    /**
     * @generated from field: string app_id = 1;
     */
    appId: string;
    /**
     * @generated from field: string connected_by_id = 2;
     */
    connectedById: string;
    /**
     * @generated from field: string connected_by_name = 3;
     */
    connectedByName: string;
    /**
     * The app requires login and the person who connected it has not signed in yet.
     *
     * @generated from field: bool needs_login = 4;
     */
    needsLogin: boolean;
};
/**
 * Describes the message tank.ai.v1.AppConnection.
 * Use `create(AppConnectionSchema)` to create a new message.
 */
export declare const AppConnectionSchema: GenMessage<AppConnection>;
/**
 * @generated from message tank.ai.v1.ConnectedDevice
 */
export type ConnectedDevice = Message$1<"tank.ai.v1.ConnectedDevice"> & {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
    /**
     * What Neural says it is, or its own name.
     *
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * "phone" or "bluetooth".
     *
     * @generated from field: string transport = 3;
     */
    transport: string;
    /**
     * @generated from field: string owner_id = 4;
     */
    ownerId: string;
    /**
     * @generated from field: string owner_name = 5;
     */
    ownerName: string;
    /**
     * @generated from field: bool camera = 6;
     */
    camera: boolean;
};
/**
 * Describes the message tank.ai.v1.ConnectedDevice.
 * Use `create(ConnectedDeviceSchema)` to create a new message.
 */
export declare const ConnectedDeviceSchema: GenMessage<ConnectedDevice>;
/**
 * @generated from message tank.ai.v1.ConnectedPage
 */
export type ConnectedPage = Message$1<"tank.ai.v1.ConnectedPage"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string url = 2;
     */
    url: string;
    /**
     * @generated from field: string title = 3;
     */
    title: string;
    /**
     * @generated from field: string owner_id = 4;
     */
    ownerId: string;
    /**
     * @generated from field: string owner_name = 5;
     */
    ownerName: string;
};
/**
 * Describes the message tank.ai.v1.ConnectedPage.
 * Use `create(ConnectedPageSchema)` to create a new message.
 */
export declare const ConnectedPageSchema: GenMessage<ConnectedPage>;
/**
 * Member is one person in a conversation.
 *
 * @generated from message tank.ai.v1.Member
 */
export type Member = Message$1<"tank.ai.v1.Member"> & {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string avatar_url = 3;
     */
    avatarUrl: string;
    /**
     * "owner" (made it; may remove people and delete it) or "member".
     *
     * @generated from field: string role = 4;
     */
    role: string;
    /**
     * @generated from field: google.protobuf.Timestamp joined_at = 5;
     */
    joinedAt?: Timestamp;
};
/**
 * Describes the message tank.ai.v1.Member.
 * Use `create(MemberSchema)` to create a new message.
 */
export declare const MemberSchema: GenMessage<Member>;
/**
 * Overlay is a layer Neural drew over the person's camera when they took an offer.
 *
 * @generated from message tank.ai.v1.Overlay
 */
export type Overlay = Message$1<"tank.ai.v1.Overlay"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * "Wind", "Sunset": the overlay's name, from the server.
     *
     * @generated from field: string title = 2;
     */
    title: string;
    /**
     * Who the figures came from, cited on the overlay: an app's name, or "TANK".
     *
     * @generated from field: string source = 3;
     */
    source: string;
    /**
     * @generated from field: repeated tank.apps.v1.Mark marks = 4;
     */
    marks: Mark[];
    /**
     * When the figures were read.
     *
     * @generated from field: google.protobuf.Timestamp as_of = 5;
     */
    asOf?: Timestamp;
    /**
     * The offer it came from.
     *
     * @generated from field: string offer_id = 6;
     */
    offerId: string;
};
/**
 * Describes the message tank.ai.v1.Overlay.
 * Use `create(OverlaySchema)` to create a new message.
 */
export declare const OverlaySchema: GenMessage<Overlay>;
/**
 * Offer is something Neural offers to do with what is connected to the conversation; taking
 * it sends SendMessageRequest.offer_id with the offer's text.
 *
 * @generated from message tank.ai.v1.Offer
 */
export type Offer = Message$1<"tank.ai.v1.Offer"> & {
    /**
     * "app:<app id>/<tool>" for an app's tool, "tank:<name>" for one of TANK's own.
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string text = 2;
     */
    text: string;
};
/**
 * Describes the message tank.ai.v1.Offer.
 * Use `create(OfferSchema)` to create a new message.
 */
export declare const OfferSchema: GenMessage<Offer>;
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
    /**
     * What Neural could do next, as short requests the person can tap to send, worked out from
     * the reply and the apps and devices connected to the conversation (Robby, 2026-11-10).
     * Assistant turns only; the clients show them under the latest one.
     *
     * @generated from field: repeated string suggestions = 12;
     */
    suggestions: string[];
    /**
     * What Neural offers to do next with what is connected (the wind over the camera, where
     * the sun sets), shown before the suggestions. Assistant turns only, latest one only.
     *
     * @generated from field: repeated tank.ai.v1.Offer offers = 13;
     */
    offers: Offer[];
    /**
     * Who wrote a user message, so a conversation with several people shows each person.
     *
     * @generated from field: string author_id = 14;
     */
    authorId: string;
    /**
     * @generated from field: string author_name = 15;
     */
    authorName: string;
    /**
     * @generated from field: string author_avatar_url = 16;
     */
    authorAvatarUrl: string;
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
    /**
     * Taking an offer (Message.offers): text is the offer's text, shown as the person's
     * message, and the server does what the offer says before it replies.
     *
     * @generated from field: string offer_id = 7;
     */
    offerId: string;
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
        /**
         * After done: what Neural could do next (Message.suggestions of the message just done).
         *
         * @generated from field: tank.ai.v1.Suggestions suggestions = 7;
         */
        value: Suggestions;
        case: "suggestions";
    } | {
        /**
         * An offer was taken and its overlay is ready: draw it over the camera now. It is also
         * in Conversation.overlays from here on.
         *
         * @generated from field: tank.ai.v1.Overlay overlay = 8;
         */
        value: Overlay;
        case: "overlay";
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
 * @generated from message tank.ai.v1.Suggestions
 */
export type Suggestions = Message$1<"tank.ai.v1.Suggestions"> & {
    /**
     * @generated from field: string message_id = 1;
     */
    messageId: string;
    /**
     * @generated from field: repeated string items = 2;
     */
    items: string[];
    /**
     * @generated from field: repeated tank.ai.v1.Offer offers = 3;
     */
    offers: Offer[];
};
/**
 * Describes the message tank.ai.v1.Suggestions.
 * Use `create(SuggestionsSchema)` to create a new message.
 */
export declare const SuggestionsSchema: GenMessage<Suggestions>;
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
     * Empty when Neural does not answer this message (a conversation with several people in
     * which the message does not address Neural): the stream ends after started.
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
    /**
     * What every new conversation starts with (Robby, 2026-11-11: "if I want datum in every
     * new conversation, I can select it in settings … same thing for devices and webpages").
     *
     * @generated from field: tank.ai.v1.Defaults defaults = 5;
     */
    defaults?: Defaults;
};
/**
 * Describes the message tank.ai.v1.Settings.
 * Use `create(SettingsSchema)` to create a new message.
 */
export declare const SettingsSchema: GenMessage<Settings>;
/**
 * @generated from message tank.ai.v1.Defaults
 */
export type Defaults = Message$1<"tank.ai.v1.Defaults"> & {
    /**
     * Apps connected to every new conversation by the server when it is made.
     *
     * @generated from field: repeated string app_ids = 1;
     */
    appIds: string[];
    /**
     * Devices the app connects itself when it starts a new conversation, if it can.
     *
     * @generated from field: repeated tank.ai.v1.DefaultDevice devices = 2;
     */
    devices: DefaultDevice[];
    /**
     * Webpages the app opens in every new conversation (tank.browse.v1.OpenPage).
     *
     * @generated from field: repeated string page_urls = 3;
     */
    pageUrls: string[];
};
/**
 * Describes the message tank.ai.v1.Defaults.
 * Use `create(DefaultsSchema)` to create a new message.
 */
export declare const DefaultsSchema: GenMessage<Defaults>;
/**
 * @generated from message tank.ai.v1.DefaultDevice
 */
export type DefaultDevice = Message$1<"tank.ai.v1.DefaultDevice"> & {
    /**
     * "phone": this phone's own sensors; "bluetooth": a Bluetooth device the app has paired.
     *
     * @generated from field: string kind = 1;
     */
    kind: string;
    /**
     * For a phone: which of its sensors ("camera", "location", "motion", ...).
     *
     * @generated from field: repeated string sensors = 2;
     */
    sensors: string[];
    /**
     * For Bluetooth: the id the app knows it by and its name.
     *
     * @generated from field: string bluetooth_id = 3;
     */
    bluetoothId: string;
    /**
     * @generated from field: string name = 4;
     */
    name: string;
};
/**
 * Describes the message tank.ai.v1.DefaultDevice.
 * Use `create(DefaultDeviceSchema)` to create a new message.
 */
export declare const DefaultDeviceSchema: GenMessage<DefaultDevice>;
/**
 * @generated from message tank.ai.v1.UpdateSettingsRequest
 */
export type UpdateSettingsRequest = Message$1<"tank.ai.v1.UpdateSettingsRequest"> & {
    /**
     * @generated from field: string instructions = 1;
     */
    instructions: string;
    /**
     * Set defaults (replacing them) only when set_defaults is true, so an older client that
     * sends only instructions never clears them.
     *
     * @generated from field: tank.ai.v1.Defaults defaults = 2;
     */
    defaults?: Defaults;
    /**
     * @generated from field: bool set_defaults = 3;
     */
    setDefaults: boolean;
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
 * @generated from message tank.ai.v1.ListAppsRequest
 */
export type ListAppsRequest = Message$1<"tank.ai.v1.ListAppsRequest"> & {
    /**
     * @generated from field: string query = 1;
     */
    query: string;
};
/**
 * Describes the message tank.ai.v1.ListAppsRequest.
 * Use `create(ListAppsRequestSchema)` to create a new message.
 */
export declare const ListAppsRequestSchema: GenMessage<ListAppsRequest>;
/**
 * @generated from message tank.ai.v1.ListAppsResponse
 */
export type ListAppsResponse = Message$1<"tank.ai.v1.ListAppsResponse"> & {
    /**
     * @generated from field: repeated tank.apps.v1.App apps = 1;
     */
    apps: App[];
};
/**
 * Describes the message tank.ai.v1.ListAppsResponse.
 * Use `create(ListAppsResponseSchema)` to create a new message.
 */
export declare const ListAppsResponseSchema: GenMessage<ListAppsResponse>;
/**
 * @generated from message tank.ai.v1.ConnectAppRequest
 */
export type ConnectAppRequest = Message$1<"tank.ai.v1.ConnectAppRequest"> & {
    /**
     * @generated from field: string conversation_id = 1;
     */
    conversationId: string;
    /**
     * @generated from field: string app_id = 2;
     */
    appId: string;
};
/**
 * Describes the message tank.ai.v1.ConnectAppRequest.
 * Use `create(ConnectAppRequestSchema)` to create a new message.
 */
export declare const ConnectAppRequestSchema: GenMessage<ConnectAppRequest>;
/**
 * @generated from message tank.ai.v1.ConnectAppResponse
 */
export type ConnectAppResponse = Message$1<"tank.ai.v1.ConnectAppResponse"> & {
    /**
     * @generated from field: tank.ai.v1.Conversation conversation = 1;
     */
    conversation?: Conversation;
};
/**
 * Describes the message tank.ai.v1.ConnectAppResponse.
 * Use `create(ConnectAppResponseSchema)` to create a new message.
 */
export declare const ConnectAppResponseSchema: GenMessage<ConnectAppResponse>;
/**
 * @generated from message tank.ai.v1.DisconnectAppRequest
 */
export type DisconnectAppRequest = Message$1<"tank.ai.v1.DisconnectAppRequest"> & {
    /**
     * @generated from field: string conversation_id = 1;
     */
    conversationId: string;
    /**
     * @generated from field: string app_id = 2;
     */
    appId: string;
};
/**
 * Describes the message tank.ai.v1.DisconnectAppRequest.
 * Use `create(DisconnectAppRequestSchema)` to create a new message.
 */
export declare const DisconnectAppRequestSchema: GenMessage<DisconnectAppRequest>;
/**
 * @generated from message tank.ai.v1.DisconnectAppResponse
 */
export type DisconnectAppResponse = Message$1<"tank.ai.v1.DisconnectAppResponse"> & {
    /**
     * @generated from field: tank.ai.v1.Conversation conversation = 1;
     */
    conversation?: Conversation;
};
/**
 * Describes the message tank.ai.v1.DisconnectAppResponse.
 * Use `create(DisconnectAppResponseSchema)` to create a new message.
 */
export declare const DisconnectAppResponseSchema: GenMessage<DisconnectAppResponse>;
/**
 * @generated from message tank.ai.v1.ClearOverlayRequest
 */
export type ClearOverlayRequest = Message$1<"tank.ai.v1.ClearOverlayRequest"> & {
    /**
     * @generated from field: string conversation_id = 1;
     */
    conversationId: string;
    /**
     * @generated from field: string overlay_id = 2;
     */
    overlayId: string;
};
/**
 * Describes the message tank.ai.v1.ClearOverlayRequest.
 * Use `create(ClearOverlayRequestSchema)` to create a new message.
 */
export declare const ClearOverlayRequestSchema: GenMessage<ClearOverlayRequest>;
/**
 * @generated from message tank.ai.v1.ClearOverlayResponse
 */
export type ClearOverlayResponse = Message$1<"tank.ai.v1.ClearOverlayResponse"> & {
    /**
     * @generated from field: tank.ai.v1.Conversation conversation = 1;
     */
    conversation?: Conversation;
};
/**
 * Describes the message tank.ai.v1.ClearOverlayResponse.
 * Use `create(ClearOverlayResponseSchema)` to create a new message.
 */
export declare const ClearOverlayResponseSchema: GenMessage<ClearOverlayResponse>;
/**
 * @generated from message tank.ai.v1.RefreshOverlaysRequest
 */
export type RefreshOverlaysRequest = Message$1<"tank.ai.v1.RefreshOverlaysRequest"> & {
    /**
     * @generated from field: string conversation_id = 1;
     */
    conversationId: string;
};
/**
 * Describes the message tank.ai.v1.RefreshOverlaysRequest.
 * Use `create(RefreshOverlaysRequestSchema)` to create a new message.
 */
export declare const RefreshOverlaysRequestSchema: GenMessage<RefreshOverlaysRequest>;
/**
 * @generated from message tank.ai.v1.RefreshOverlaysResponse
 */
export type RefreshOverlaysResponse = Message$1<"tank.ai.v1.RefreshOverlaysResponse"> & {
    /**
     * @generated from field: repeated tank.ai.v1.Overlay overlays = 1;
     */
    overlays: Overlay[];
};
/**
 * Describes the message tank.ai.v1.RefreshOverlaysResponse.
 * Use `create(RefreshOverlaysResponseSchema)` to create a new message.
 */
export declare const RefreshOverlaysResponseSchema: GenMessage<RefreshOverlaysResponse>;
/**
 * @generated from message tank.ai.v1.CreateInviteRequest
 */
export type CreateInviteRequest = Message$1<"tank.ai.v1.CreateInviteRequest"> & {
    /**
     * @generated from field: string conversation_id = 1;
     */
    conversationId: string;
};
/**
 * Describes the message tank.ai.v1.CreateInviteRequest.
 * Use `create(CreateInviteRequestSchema)` to create a new message.
 */
export declare const CreateInviteRequestSchema: GenMessage<CreateInviteRequest>;
/**
 * @generated from message tank.ai.v1.CreateInviteResponse
 */
export type CreateInviteResponse = Message$1<"tank.ai.v1.CreateInviteResponse"> & {
    /**
     * The link to send. It is not stored and cannot be read again.
     *
     * @generated from field: string url = 1;
     */
    url: string;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 2;
     */
    expiresAt?: Timestamp;
};
/**
 * Describes the message tank.ai.v1.CreateInviteResponse.
 * Use `create(CreateInviteResponseSchema)` to create a new message.
 */
export declare const CreateInviteResponseSchema: GenMessage<CreateInviteResponse>;
/**
 * @generated from message tank.ai.v1.PreviewInviteRequest
 */
export type PreviewInviteRequest = Message$1<"tank.ai.v1.PreviewInviteRequest"> & {
    /**
     * The token from the link.
     *
     * @generated from field: string token = 1;
     */
    token: string;
};
/**
 * Describes the message tank.ai.v1.PreviewInviteRequest.
 * Use `create(PreviewInviteRequestSchema)` to create a new message.
 */
export declare const PreviewInviteRequestSchema: GenMessage<PreviewInviteRequest>;
/**
 * @generated from message tank.ai.v1.PreviewInviteResponse
 */
export type PreviewInviteResponse = Message$1<"tank.ai.v1.PreviewInviteResponse"> & {
    /**
     * @generated from field: string conversation_title = 1;
     */
    conversationTitle: string;
    /**
     * @generated from field: string inviter_name = 2;
     */
    inviterName: string;
    /**
     * @generated from field: int32 member_count = 3;
     */
    memberCount: number;
    /**
     * Set when the caller is already in it; the client opens it.
     *
     * @generated from field: string conversation_id = 4;
     */
    conversationId: string;
};
/**
 * Describes the message tank.ai.v1.PreviewInviteResponse.
 * Use `create(PreviewInviteResponseSchema)` to create a new message.
 */
export declare const PreviewInviteResponseSchema: GenMessage<PreviewInviteResponse>;
/**
 * @generated from message tank.ai.v1.JoinConversationRequest
 */
export type JoinConversationRequest = Message$1<"tank.ai.v1.JoinConversationRequest"> & {
    /**
     * @generated from field: string token = 1;
     */
    token: string;
};
/**
 * Describes the message tank.ai.v1.JoinConversationRequest.
 * Use `create(JoinConversationRequestSchema)` to create a new message.
 */
export declare const JoinConversationRequestSchema: GenMessage<JoinConversationRequest>;
/**
 * @generated from message tank.ai.v1.JoinConversationResponse
 */
export type JoinConversationResponse = Message$1<"tank.ai.v1.JoinConversationResponse"> & {
    /**
     * @generated from field: tank.ai.v1.Conversation conversation = 1;
     */
    conversation?: Conversation;
};
/**
 * Describes the message tank.ai.v1.JoinConversationResponse.
 * Use `create(JoinConversationResponseSchema)` to create a new message.
 */
export declare const JoinConversationResponseSchema: GenMessage<JoinConversationResponse>;
/**
 * @generated from message tank.ai.v1.LeaveConversationRequest
 */
export type LeaveConversationRequest = Message$1<"tank.ai.v1.LeaveConversationRequest"> & {
    /**
     * @generated from field: string conversation_id = 1;
     */
    conversationId: string;
};
/**
 * Describes the message tank.ai.v1.LeaveConversationRequest.
 * Use `create(LeaveConversationRequestSchema)` to create a new message.
 */
export declare const LeaveConversationRequestSchema: GenMessage<LeaveConversationRequest>;
/**
 * @generated from message tank.ai.v1.LeaveConversationResponse
 */
export type LeaveConversationResponse = Message$1<"tank.ai.v1.LeaveConversationResponse"> & {};
/**
 * Describes the message tank.ai.v1.LeaveConversationResponse.
 * Use `create(LeaveConversationResponseSchema)` to create a new message.
 */
export declare const LeaveConversationResponseSchema: GenMessage<LeaveConversationResponse>;
/**
 * @generated from message tank.ai.v1.RemoveMemberRequest
 */
export type RemoveMemberRequest = Message$1<"tank.ai.v1.RemoveMemberRequest"> & {
    /**
     * @generated from field: string conversation_id = 1;
     */
    conversationId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
};
/**
 * Describes the message tank.ai.v1.RemoveMemberRequest.
 * Use `create(RemoveMemberRequestSchema)` to create a new message.
 */
export declare const RemoveMemberRequestSchema: GenMessage<RemoveMemberRequest>;
/**
 * @generated from message tank.ai.v1.RemoveMemberResponse
 */
export type RemoveMemberResponse = Message$1<"tank.ai.v1.RemoveMemberResponse"> & {
    /**
     * @generated from field: tank.ai.v1.Conversation conversation = 1;
     */
    conversation?: Conversation;
};
/**
 * Describes the message tank.ai.v1.RemoveMemberResponse.
 * Use `create(RemoveMemberResponseSchema)` to create a new message.
 */
export declare const RemoveMemberResponseSchema: GenMessage<RemoveMemberResponse>;
/**
 * @generated from message tank.ai.v1.WatchRequest
 */
export type WatchRequest = Message$1<"tank.ai.v1.WatchRequest"> & {
    /**
     * @generated from field: string conversation_id = 1;
     */
    conversationId: string;
};
/**
 * Describes the message tank.ai.v1.WatchRequest.
 * Use `create(WatchRequestSchema)` to create a new message.
 */
export declare const WatchRequestSchema: GenMessage<WatchRequest>;
/**
 * @generated from message tank.ai.v1.WatchResponse
 */
export type WatchResponse = Message$1<"tank.ai.v1.WatchResponse"> & {
    /**
     * @generated from oneof tank.ai.v1.WatchResponse.event
     */
    event: {
        /**
         * A stored message: someone's, or Neural's when its reply is done.
         *
         * @generated from field: tank.ai.v1.Message message = 1;
         */
        value: Message;
        case: "message";
    } | {
        /**
         * Neural has started a reply; deltas for it follow.
         *
         * @generated from field: tank.ai.v1.ReplyStarted reply_started = 2;
         */
        value: ReplyStarted;
        case: "replyStarted";
    } | {
        /**
         * A piece of Neural's reply as it is written.
         *
         * @generated from field: tank.ai.v1.ReplyDelta reply_delta = 3;
         */
        value: ReplyDelta;
        case: "replyDelta";
    } | {
        /**
         * The conversation changed: people, apps, overlays or its title.
         *
         * @generated from field: tank.ai.v1.Conversation conversation = 4;
         */
        value: Conversation;
        case: "conversation";
    } | {
        /**
         * Someone is typing.
         *
         * @generated from field: tank.ai.v1.Typing typing = 5;
         */
        value: Typing;
        case: "typing";
    } | {
        /**
         * Offers and suggestions for a message just done.
         *
         * @generated from field: tank.ai.v1.Suggestions suggestions = 6;
         */
        value: Suggestions;
        case: "suggestions";
    } | {
        /**
         * A device was connected or disconnected; the client reloads the conversation's devices.
         *
         * @generated from field: string devices_changed = 7;
         */
        value: string;
        case: "devicesChanged";
    } | {
        /**
         * A webpage was opened or closed; the client reloads the conversation's pages.
         *
         * @generated from field: string pages_changed = 8;
         */
        value: string;
        case: "pagesChanged";
    } | {
        case: undefined;
        value?: undefined;
    };
};
/**
 * Describes the message tank.ai.v1.WatchResponse.
 * Use `create(WatchResponseSchema)` to create a new message.
 */
export declare const WatchResponseSchema: GenMessage<WatchResponse>;
/**
 * @generated from message tank.ai.v1.ReplyStarted
 */
export type ReplyStarted = Message$1<"tank.ai.v1.ReplyStarted"> & {
    /**
     * @generated from field: string message_id = 1;
     */
    messageId: string;
    /**
     * Who addressed Neural.
     *
     * @generated from field: string asked_by = 2;
     */
    askedBy: string;
};
/**
 * Describes the message tank.ai.v1.ReplyStarted.
 * Use `create(ReplyStartedSchema)` to create a new message.
 */
export declare const ReplyStartedSchema: GenMessage<ReplyStarted>;
/**
 * @generated from message tank.ai.v1.ReplyDelta
 */
export type ReplyDelta = Message$1<"tank.ai.v1.ReplyDelta"> & {
    /**
     * @generated from field: string message_id = 1;
     */
    messageId: string;
    /**
     * @generated from field: string text = 2;
     */
    text: string;
};
/**
 * Describes the message tank.ai.v1.ReplyDelta.
 * Use `create(ReplyDeltaSchema)` to create a new message.
 */
export declare const ReplyDeltaSchema: GenMessage<ReplyDelta>;
/**
 * @generated from message tank.ai.v1.Typing
 */
export type Typing = Message$1<"tank.ai.v1.Typing"> & {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
};
/**
 * Describes the message tank.ai.v1.Typing.
 * Use `create(TypingSchema)` to create a new message.
 */
export declare const TypingSchema: GenMessage<Typing>;
/**
 * @generated from message tank.ai.v1.SetTypingRequest
 */
export type SetTypingRequest = Message$1<"tank.ai.v1.SetTypingRequest"> & {
    /**
     * @generated from field: string conversation_id = 1;
     */
    conversationId: string;
};
/**
 * Describes the message tank.ai.v1.SetTypingRequest.
 * Use `create(SetTypingRequestSchema)` to create a new message.
 */
export declare const SetTypingRequestSchema: GenMessage<SetTypingRequest>;
/**
 * @generated from message tank.ai.v1.SetTypingResponse
 */
export type SetTypingResponse = Message$1<"tank.ai.v1.SetTypingResponse"> & {};
/**
 * Describes the message tank.ai.v1.SetTypingResponse.
 * Use `create(SetTypingResponseSchema)` to create a new message.
 */
export declare const SetTypingResponseSchema: GenMessage<SetTypingResponse>;
/**
 * @generated from message tank.ai.v1.MarkReadRequest
 */
export type MarkReadRequest = Message$1<"tank.ai.v1.MarkReadRequest"> & {
    /**
     * @generated from field: string conversation_id = 1;
     */
    conversationId: string;
};
/**
 * Describes the message tank.ai.v1.MarkReadRequest.
 * Use `create(MarkReadRequestSchema)` to create a new message.
 */
export declare const MarkReadRequestSchema: GenMessage<MarkReadRequest>;
/**
 * @generated from message tank.ai.v1.MarkReadResponse
 */
export type MarkReadResponse = Message$1<"tank.ai.v1.MarkReadResponse"> & {};
/**
 * Describes the message tank.ai.v1.MarkReadResponse.
 * Use `create(MarkReadResponseSchema)` to create a new message.
 */
export declare const MarkReadResponseSchema: GenMessage<MarkReadResponse>;
/**
 * @generated from message tank.ai.v1.SetMutedRequest
 */
export type SetMutedRequest = Message$1<"tank.ai.v1.SetMutedRequest"> & {
    /**
     * @generated from field: string conversation_id = 1;
     */
    conversationId: string;
    /**
     * @generated from field: bool muted = 2;
     */
    muted: boolean;
};
/**
 * Describes the message tank.ai.v1.SetMutedRequest.
 * Use `create(SetMutedRequestSchema)` to create a new message.
 */
export declare const SetMutedRequestSchema: GenMessage<SetMutedRequest>;
/**
 * @generated from message tank.ai.v1.SetMutedResponse
 */
export type SetMutedResponse = Message$1<"tank.ai.v1.SetMutedResponse"> & {
    /**
     * @generated from field: tank.ai.v1.Conversation conversation = 1;
     */
    conversation?: Conversation;
};
/**
 * Describes the message tank.ai.v1.SetMutedResponse.
 * Use `create(SetMutedResponseSchema)` to create a new message.
 */
export declare const SetMutedResponseSchema: GenMessage<SetMutedResponse>;
/**
 * @generated from message tank.ai.v1.StartAppLoginRequest
 */
export type StartAppLoginRequest = Message$1<"tank.ai.v1.StartAppLoginRequest"> & {
    /**
     * @generated from field: string app_id = 1;
     */
    appId: string;
    /**
     * Where the browser goes when sign-in finishes: a TANK web address or an app link.
     *
     * @generated from field: string return_to = 2;
     */
    returnTo: string;
};
/**
 * Describes the message tank.ai.v1.StartAppLoginRequest.
 * Use `create(StartAppLoginRequestSchema)` to create a new message.
 */
export declare const StartAppLoginRequestSchema: GenMessage<StartAppLoginRequest>;
/**
 * @generated from message tank.ai.v1.StartAppLoginResponse
 */
export type StartAppLoginResponse = Message$1<"tank.ai.v1.StartAppLoginResponse"> & {
    /**
     * @generated from field: string url = 1;
     */
    url: string;
};
/**
 * Describes the message tank.ai.v1.StartAppLoginResponse.
 * Use `create(StartAppLoginResponseSchema)` to create a new message.
 */
export declare const StartAppLoginResponseSchema: GenMessage<StartAppLoginResponse>;
/**
 * @generated from message tank.ai.v1.ListAppAccountsRequest
 */
export type ListAppAccountsRequest = Message$1<"tank.ai.v1.ListAppAccountsRequest"> & {};
/**
 * Describes the message tank.ai.v1.ListAppAccountsRequest.
 * Use `create(ListAppAccountsRequestSchema)` to create a new message.
 */
export declare const ListAppAccountsRequestSchema: GenMessage<ListAppAccountsRequest>;
/**
 * @generated from message tank.ai.v1.ListAppAccountsResponse
 */
export type ListAppAccountsResponse = Message$1<"tank.ai.v1.ListAppAccountsResponse"> & {
    /**
     * @generated from field: repeated tank.apps.v1.AppAccount accounts = 1;
     */
    accounts: AppAccount[];
};
/**
 * Describes the message tank.ai.v1.ListAppAccountsResponse.
 * Use `create(ListAppAccountsResponseSchema)` to create a new message.
 */
export declare const ListAppAccountsResponseSchema: GenMessage<ListAppAccountsResponse>;
/**
 * @generated from message tank.ai.v1.SignOutOfAppRequest
 */
export type SignOutOfAppRequest = Message$1<"tank.ai.v1.SignOutOfAppRequest"> & {
    /**
     * @generated from field: string app_id = 1;
     */
    appId: string;
};
/**
 * Describes the message tank.ai.v1.SignOutOfAppRequest.
 * Use `create(SignOutOfAppRequestSchema)` to create a new message.
 */
export declare const SignOutOfAppRequestSchema: GenMessage<SignOutOfAppRequest>;
/**
 * @generated from message tank.ai.v1.SignOutOfAppResponse
 */
export type SignOutOfAppResponse = Message$1<"tank.ai.v1.SignOutOfAppResponse"> & {};
/**
 * Describes the message tank.ai.v1.SignOutOfAppResponse.
 * Use `create(SignOutOfAppResponseSchema)` to create a new message.
 */
export declare const SignOutOfAppResponseSchema: GenMessage<SignOutOfAppResponse>;
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
    /**
     * Every app published to Neural, for the "Connect apps" picker.
     *
     * @generated from rpc tank.ai.v1.AiService.ListApps
     */
    listApps: {
        methodKind: "unary";
        input: typeof ListAppsRequestSchema;
        output: typeof ListAppsResponseSchema;
    };
    /**
     * @generated from rpc tank.ai.v1.AiService.ConnectApp
     */
    connectApp: {
        methodKind: "unary";
        input: typeof ConnectAppRequestSchema;
        output: typeof ConnectAppResponseSchema;
    };
    /**
     * @generated from rpc tank.ai.v1.AiService.DisconnectApp
     */
    disconnectApp: {
        methodKind: "unary";
        input: typeof DisconnectAppRequestSchema;
        output: typeof DisconnectAppResponseSchema;
    };
    /**
     * Signing in to an app that requires it: the address of the app's own sign-in page, which
     * the client opens in the system browser; it comes back to return_to when done.
     *
     * @generated from rpc tank.ai.v1.AiService.StartAppLogin
     */
    startAppLogin: {
        methodKind: "unary";
        input: typeof StartAppLoginRequestSchema;
        output: typeof StartAppLoginResponseSchema;
    };
    /**
     * @generated from rpc tank.ai.v1.AiService.ListAppAccounts
     */
    listAppAccounts: {
        methodKind: "unary";
        input: typeof ListAppAccountsRequestSchema;
        output: typeof ListAppAccountsResponseSchema;
    };
    /**
     * @generated from rpc tank.ai.v1.AiService.SignOutOfApp
     */
    signOutOfApp: {
        methodKind: "unary";
        input: typeof SignOutOfAppRequestSchema;
        output: typeof SignOutOfAppResponseSchema;
    };
    /**
     * Takes an overlay off the camera.
     *
     * @generated from rpc tank.ai.v1.AiService.ClearOverlay
     */
    clearOverlay: {
        methodKind: "unary";
        input: typeof ClearOverlayRequestSchema;
        output: typeof ClearOverlayResponseSchema;
    };
    /**
     * Reads every overlay's figures again where they are more than ten minutes old, from where
     * the phone is now. Clients call it while the camera is showing.
     *
     * @generated from rpc tank.ai.v1.AiService.RefreshOverlays
     */
    refreshOverlays: {
        methodKind: "unary";
        input: typeof RefreshOverlaysRequestSchema;
        output: typeof RefreshOverlaysResponseSchema;
    };
    /**
     * People (docs/neural-people/PLAN.md). An invite is a link shown once when made; opening it
     * signed in joins the conversation.
     *
     * @generated from rpc tank.ai.v1.AiService.CreateInvite
     */
    createInvite: {
        methodKind: "unary";
        input: typeof CreateInviteRequestSchema;
        output: typeof CreateInviteResponseSchema;
    };
    /**
     * What a link leads to, for the page that asks whether to join.
     *
     * @generated from rpc tank.ai.v1.AiService.PreviewInvite
     */
    previewInvite: {
        methodKind: "unary";
        input: typeof PreviewInviteRequestSchema;
        output: typeof PreviewInviteResponseSchema;
    };
    /**
     * @generated from rpc tank.ai.v1.AiService.JoinConversation
     */
    joinConversation: {
        methodKind: "unary";
        input: typeof JoinConversationRequestSchema;
        output: typeof JoinConversationResponseSchema;
    };
    /**
     * @generated from rpc tank.ai.v1.AiService.LeaveConversation
     */
    leaveConversation: {
        methodKind: "unary";
        input: typeof LeaveConversationRequestSchema;
        output: typeof LeaveConversationResponseSchema;
    };
    /**
     * The owner takes someone out.
     *
     * @generated from rpc tank.ai.v1.AiService.RemoveMember
     */
    removeMember: {
        methodKind: "unary";
        input: typeof RemoveMemberRequestSchema;
        output: typeof RemoveMemberResponseSchema;
    };
    /**
     * Everything that happens in a conversation, live, for every member with it open: messages
     * from anyone, Neural's reply as it is written, people, devices and overlays changing.
     *
     * @generated from rpc tank.ai.v1.AiService.Watch
     */
    watch: {
        methodKind: "server_streaming";
        input: typeof WatchRequestSchema;
        output: typeof WatchResponseSchema;
    };
    /**
     * The caller is typing; the others see it for a few seconds.
     *
     * @generated from rpc tank.ai.v1.AiService.SetTyping
     */
    setTyping: {
        methodKind: "unary";
        input: typeof SetTypingRequestSchema;
        output: typeof SetTypingResponseSchema;
    };
    /**
     * The caller has read the conversation up to now.
     *
     * @generated from rpc tank.ai.v1.AiService.MarkRead
     */
    markRead: {
        methodKind: "unary";
        input: typeof MarkReadRequestSchema;
        output: typeof MarkReadResponseSchema;
    };
    /**
     * @generated from rpc tank.ai.v1.AiService.SetMuted
     */
    setMuted: {
        methodKind: "unary";
        input: typeof SetMutedRequestSchema;
        output: typeof SetMutedResponseSchema;
    };
}>;
