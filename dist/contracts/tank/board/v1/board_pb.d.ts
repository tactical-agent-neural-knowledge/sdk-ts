import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/board/v1/board.proto.
 */
export declare const file_tank_board_v1_board: GenFile;
/**
 * Where a thing sits. Boards are infinite, so these are board coordinates, not pixels
 * on anybody's screen.
 *
 * @generated from message tank.board.v1.Rect
 */
export type Rect = Message<"tank.board.v1.Rect"> & {
    /**
     * @generated from field: double x = 1;
     */
    x: number;
    /**
     * @generated from field: double y = 2;
     */
    y: number;
    /**
     * @generated from field: double w = 3;
     */
    w: number;
    /**
     * @generated from field: double h = 4;
     */
    h: number;
};
/**
 * Describes the message tank.board.v1.Rect.
 * Use `create(RectSchema)` to create a new message.
 */
export declare const RectSchema: GenMessage<Rect>;
/**
 * @generated from message tank.board.v1.Style
 */
export type Style = Message<"tank.board.v1.Style"> & {
    /**
     * #rrggbb, or empty for none
     *
     * @generated from field: string fill = 1;
     */
    fill: string;
    /**
     * @generated from field: string stroke = 2;
     */
    stroke: string;
    /**
     * @generated from field: double stroke_width = 3;
     */
    strokeWidth: number;
    /**
     * 0..1; 0 is treated as 1 so an unset style is visible
     *
     * @generated from field: double opacity = 4;
     */
    opacity: number;
    /**
     * @generated from field: double corner_radius = 5;
     */
    cornerRadius: number;
    /**
     * "", "dashed", "dotted"
     *
     * @generated from field: string dash = 6;
     */
    dash: string;
    /**
     * @generated from field: int32 font_size = 7;
     */
    fontSize: number;
    /**
     * "", "500", "700"
     *
     * @generated from field: string font_weight = 8;
     */
    fontWeight: string;
    /**
     * "", "center", "right"
     *
     * @generated from field: string align = 9;
     */
    align: string;
    /**
     * "0 2 8 #00000055" — offset x, offset y, blur, colour. Empty for none.
     *
     * @generated from field: string shadow = 10;
     */
    shadow: string;
    /**
     * Gaussian blur radius on the object itself.
     *
     * @generated from field: double blur = 11;
     */
    blur: number;
};
/**
 * Describes the message tank.board.v1.Style.
 * Use `create(StyleSchema)` to create a new message.
 */
export declare const StyleSchema: GenMessage<Style>;
/**
 * A frame holding the running application. This is the product: not a screenshot, the
 * app itself at a commit, which a person can click into and ask for changes.
 *
 * @generated from message tank.board.v1.AppFrame
 */
export type AppFrame = Message<"tank.board.v1.AppFrame"> & {
    /**
     * owner/name
     *
     * @generated from field: string repo = 1;
     */
    repo: string;
    /**
     * branch or sha the frame is showing
     *
     * @generated from field: string ref = 2;
     */
    ref: string;
    /**
     * route inside the app, e.g. /w/acme/books
     *
     * @generated from field: string path = 3;
     */
    path: string;
    /**
     * "web" | "ios" | "android"
     *
     * @generated from field: string platform = 4;
     */
    platform: string;
    /**
     * the device the frame is standing in for
     *
     * @generated from field: int32 viewport_width = 5;
     */
    viewportWidth: number;
    /**
     * @generated from field: int32 viewport_height = 6;
     */
    viewportHeight: number;
    /**
     * server-filled: where the running app is served
     *
     * @generated from field: string preview_url = 7;
     */
    previewUrl: string;
    /**
     * server-filled: building | live | failed | asleep
     *
     * @generated from field: string status = 8;
     */
    status: string;
    /**
     * server-filled: why it is not live, in a sentence
     *
     * @generated from field: string note = 9;
     */
    note: string;
    /**
     * The commit this frame was drawn from. Set when somebody draws or refreshes it;
     * comparing it with what is deployed now is how a board learns it has gone stale.
     *
     * @generated from field: string drawn_from_sha = 10;
     */
    drawnFromSha: string;
    /**
     * @generated from field: google.protobuf.Timestamp drawn_at = 11;
     */
    drawnAt?: Timestamp;
    /**
     * Server-filled: the app has moved on since this frame was drawn.
     *
     * @generated from field: bool moved_on = 12;
     */
    movedOn: boolean;
    /**
     * "the app has moved 23 commits since this was drawn"
     *
     * @generated from field: string moved_note = 13;
     */
    movedNote: string;
};
/**
 * Describes the message tank.board.v1.AppFrame.
 * Use `create(AppFrameSchema)` to create a new message.
 */
export declare const AppFrameSchema: GenMessage<AppFrame>;
/**
 * @generated from message tank.board.v1.BoardObject
 */
export type BoardObject = Message<"tank.board.v1.BoardObject"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: tank.board.v1.ObjectKind kind = 2;
     */
    kind: ObjectKind;
    /**
     * @generated from field: tank.board.v1.Rect at = 3;
     */
    at?: Rect;
    /**
     * @generated from field: tank.board.v1.Style style = 4;
     */
    style?: Style;
    /**
     * text, sticky, and a label on a shape
     *
     * @generated from field: string text = 5;
     */
    text: string;
    /**
     * @generated from field: double rotation = 6;
     */
    rotation: number;
    /**
     * paint order
     *
     * @generated from field: int32 z = 7;
     */
    z: number;
    /**
     * the frame it belongs to, when it is inside one
     *
     * @generated from field: string parent_id = 8;
     */
    parentId: string;
    /**
     * Connector: the two things it joins, so it follows them when they move.
     *
     * @generated from field: string from_id = 9;
     */
    fromId: string;
    /**
     * @generated from field: string to_id = 10;
     */
    toId: string;
    /**
     * freehand: x,y pairs in board coordinates
     *
     * @generated from field: repeated double points = 11;
     */
    points: number[];
    /**
     * image
     *
     * @generated from field: string file_id = 12;
     */
    fileId: string;
    /**
     * server-filled
     *
     * @generated from field: string file_url = 13;
     */
    fileUrl: string;
    /**
     * frame only
     *
     * @generated from field: tank.board.v1.AppFrame app = 14;
     */
    app?: AppFrame;
    /**
     * @generated from field: bool locked = 15;
     */
    locked: boolean;
    /**
     * Relationships a renderer does not need but an editor does: which component this
     * is an instance of, the named style it follows, how a frame lays its children out,
     * how a child is pinned when its parent resizes, whether it is hidden.
     *
     * One opaque string rather than a field per idea, because these are the editor's
     * own vocabulary and will keep growing; geometry and colour stay in their real
     * fields so a renderer that knows nothing about any of this still draws the board
     * correctly. Clients that do not understand a record leave it alone.
     *
     * @generated from field: string meta = 18;
     */
    meta: string;
    /**
     * @generated from field: string created_by = 16;
     */
    createdBy: string;
    /**
     * Bumped on every write, so two people editing different objects never collide and
     * the same object twice is reported rather than silently overwritten.
     *
     * @generated from field: int32 rev = 17;
     */
    rev: number;
    /**
     * Frame only: what this diagram was drawn from, when it was drawn from something
     * rather than by hand. The same idea as AppFrame.drawn_from_sha one level up.
     *
     * @generated from field: tank.board.v1.Derivation derived = 19;
     */
    derived?: Derivation;
};
/**
 * Describes the message tank.board.v1.BoardObject.
 * Use `create(BoardObjectSchema)` to create a new message.
 */
export declare const BoardObjectSchema: GenMessage<BoardObject>;
/**
 * @generated from message tank.board.v1.Board
 */
export type Board = Message<"tank.board.v1.Board"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * the Tread it belongs to; empty for workspace-wide
     *
     * @generated from field: string channel_id = 3;
     */
    channelId: string;
    /**
     * @generated from field: string title = 4;
     */
    title: string;
    /**
     * @generated from field: string icon = 5;
     */
    icon: string;
    /**
     * @generated from field: repeated tank.board.v1.BoardObject objects = 6;
     */
    objects: BoardObject[];
    /**
     * @generated from field: int32 version = 7;
     */
    version: number;
    /**
     * @generated from field: string created_by = 8;
     */
    createdBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 9;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: string updated_by = 10;
     */
    updatedBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 11;
     */
    updatedAt?: Timestamp;
    /**
     * 0 is current; 100 is nothing it was drawn from is still as it was. The same idea
     * as a Neuralcanvas page: a board nobody can trust is a board nobody opens.
     *
     * @generated from field: int32 staleness = 12;
     */
    staleness: number;
    /**
     * What has moved, in a sentence. Empty when the board still matches the product.
     *
     * @generated from field: string staleness_note = 13;
     */
    stalenessNote: string;
};
/**
 * Describes the message tank.board.v1.Board.
 * Use `create(BoardSchema)` to create a new message.
 */
export declare const BoardSchema: GenMessage<Board>;
/**
 * @generated from message tank.board.v1.BoardSummary
 */
export type BoardSummary = Message<"tank.board.v1.BoardSummary"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string title = 2;
     */
    title: string;
    /**
     * @generated from field: string icon = 3;
     */
    icon: string;
    /**
     * @generated from field: int32 objects = 4;
     */
    objects: number;
    /**
     * @generated from field: int32 app_frames = 5;
     */
    appFrames: number;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 6;
     */
    updatedAt?: Timestamp;
    /**
     * @generated from field: string channel_id = 7;
     */
    channelId: string;
    /**
     * @generated from field: int32 staleness = 8;
     */
    staleness: number;
    /**
     * @generated from field: string staleness_note = 9;
     */
    stalenessNote: string;
};
/**
 * Describes the message tank.board.v1.BoardSummary.
 * Use `create(BoardSummarySchema)` to create a new message.
 */
export declare const BoardSummarySchema: GenMessage<BoardSummary>;
/**
 * @generated from message tank.board.v1.ListBoardsRequest
 */
export type ListBoardsRequest = Message<"tank.board.v1.ListBoardsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * @generated from field: int32 limit = 3;
     */
    limit: number;
    /**
     * Only the boards the product has moved past. The same filter ListCanvases has,
     * for the same reason: finding what needs a look should not mean reading the lot.
     *
     * @generated from field: bool stale_only = 4;
     */
    staleOnly: boolean;
};
/**
 * Describes the message tank.board.v1.ListBoardsRequest.
 * Use `create(ListBoardsRequestSchema)` to create a new message.
 */
export declare const ListBoardsRequestSchema: GenMessage<ListBoardsRequest>;
/**
 * @generated from message tank.board.v1.ListBoardsResponse
 */
export type ListBoardsResponse = Message<"tank.board.v1.ListBoardsResponse"> & {
    /**
     * @generated from field: repeated tank.board.v1.BoardSummary boards = 1;
     */
    boards: BoardSummary[];
};
/**
 * Describes the message tank.board.v1.ListBoardsResponse.
 * Use `create(ListBoardsResponseSchema)` to create a new message.
 */
export declare const ListBoardsResponseSchema: GenMessage<ListBoardsResponse>;
/**
 * @generated from message tank.board.v1.GetBoardRequest
 */
export type GetBoardRequest = Message<"tank.board.v1.GetBoardRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
};
/**
 * Describes the message tank.board.v1.GetBoardRequest.
 * Use `create(GetBoardRequestSchema)` to create a new message.
 */
export declare const GetBoardRequestSchema: GenMessage<GetBoardRequest>;
/**
 * @generated from message tank.board.v1.GetBoardResponse
 */
export type GetBoardResponse = Message<"tank.board.v1.GetBoardResponse"> & {
    /**
     * @generated from field: tank.board.v1.Board board = 1;
     */
    board?: Board;
};
/**
 * Describes the message tank.board.v1.GetBoardResponse.
 * Use `create(GetBoardResponseSchema)` to create a new message.
 */
export declare const GetBoardResponseSchema: GenMessage<GetBoardResponse>;
/**
 * @generated from message tank.board.v1.CreateBoardRequest
 */
export type CreateBoardRequest = Message<"tank.board.v1.CreateBoardRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * @generated from field: string title = 3;
     */
    title: string;
    /**
     * @generated from field: string icon = 4;
     */
    icon: string;
    /**
     * @generated from field: repeated tank.board.v1.BoardObject objects = 5;
     */
    objects: BoardObject[];
    /**
     * A starting shape, from ListTemplates. Nobody opens a blank infinite canvas and
     * feels invited; a flowchart that already has three boxes and two arrows does.
     *
     * @generated from field: string template = 6;
     */
    template: string;
};
/**
 * Describes the message tank.board.v1.CreateBoardRequest.
 * Use `create(CreateBoardRequestSchema)` to create a new message.
 */
export declare const CreateBoardRequestSchema: GenMessage<CreateBoardRequest>;
/**
 * @generated from message tank.board.v1.CreateBoardResponse
 */
export type CreateBoardResponse = Message<"tank.board.v1.CreateBoardResponse"> & {
    /**
     * @generated from field: tank.board.v1.Board board = 1;
     */
    board?: Board;
};
/**
 * Describes the message tank.board.v1.CreateBoardResponse.
 * Use `create(CreateBoardResponseSchema)` to create a new message.
 */
export declare const CreateBoardResponseSchema: GenMessage<CreateBoardResponse>;
/**
 * @generated from message tank.board.v1.UpdateBoardRequest
 */
export type UpdateBoardRequest = Message<"tank.board.v1.UpdateBoardRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * @generated from field: string title = 3;
     */
    title: string;
    /**
     * @generated from field: string icon = 4;
     */
    icon: string;
    /**
     * Which Tread the board belongs to. A board with no Tread has nowhere for a change
     * request to be discussed, and without this there was no way out of that state.
     *
     * @generated from field: string channel_id = 5;
     */
    channelId: string;
    /**
     * @generated from field: bool set_channel = 6;
     */
    setChannel: boolean;
};
/**
 * Describes the message tank.board.v1.UpdateBoardRequest.
 * Use `create(UpdateBoardRequestSchema)` to create a new message.
 */
export declare const UpdateBoardRequestSchema: GenMessage<UpdateBoardRequest>;
/**
 * @generated from message tank.board.v1.UpdateBoardResponse
 */
export type UpdateBoardResponse = Message<"tank.board.v1.UpdateBoardResponse"> & {
    /**
     * @generated from field: tank.board.v1.Board board = 1;
     */
    board?: Board;
};
/**
 * Describes the message tank.board.v1.UpdateBoardResponse.
 * Use `create(UpdateBoardResponseSchema)` to create a new message.
 */
export declare const UpdateBoardResponseSchema: GenMessage<UpdateBoardResponse>;
/**
 * @generated from message tank.board.v1.DeleteBoardRequest
 */
export type DeleteBoardRequest = Message<"tank.board.v1.DeleteBoardRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
};
/**
 * Describes the message tank.board.v1.DeleteBoardRequest.
 * Use `create(DeleteBoardRequestSchema)` to create a new message.
 */
export declare const DeleteBoardRequestSchema: GenMessage<DeleteBoardRequest>;
/**
 * @generated from message tank.board.v1.DeleteBoardResponse
 */
export type DeleteBoardResponse = Message<"tank.board.v1.DeleteBoardResponse"> & {};
/**
 * Describes the message tank.board.v1.DeleteBoardResponse.
 * Use `create(DeleteBoardResponseSchema)` to create a new message.
 */
export declare const DeleteBoardResponseSchema: GenMessage<DeleteBoardResponse>;
/**
 * One object at a time, for the same reason a canvas page writes one block at a time:
 * two people moving different shapes are not in conflict, and the only real collision
 * is the same shape twice.
 *
 * @generated from message tank.board.v1.PutObjectsRequest
 */
export type PutObjectsRequest = Message<"tank.board.v1.PutObjectsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string board_id = 2;
     */
    boardId: string;
    /**
     * created when the id is unknown, else updated
     *
     * @generated from field: repeated tank.board.v1.BoardObject objects = 3;
     */
    objects: BoardObject[];
    /**
     * @generated from field: repeated string delete_ids = 4;
     */
    deleteIds: string[];
    /**
     * The revs the editor started from, keyed by object id. A mismatch is reported
     * rather than overwritten. Empty means "do not check".
     *
     * @generated from field: map<string, int32> base_revs = 5;
     */
    baseRevs: {
        [key: string]: number;
    };
};
/**
 * Describes the message tank.board.v1.PutObjectsRequest.
 * Use `create(PutObjectsRequestSchema)` to create a new message.
 */
export declare const PutObjectsRequestSchema: GenMessage<PutObjectsRequest>;
/**
 * @generated from message tank.board.v1.PutObjectsResponse
 */
export type PutObjectsResponse = Message<"tank.board.v1.PutObjectsResponse"> & {
    /**
     * @generated from field: tank.board.v1.Board board = 1;
     */
    board?: Board;
    /**
     * Objects somebody else changed while this editor was working on them. Nothing was
     * overwritten; these are their versions.
     *
     * @generated from field: repeated tank.board.v1.BoardObject conflicts = 2;
     */
    conflicts: BoardObject[];
    /**
     * @generated from field: string conflict_note = 3;
     */
    conflictNote: string;
};
/**
 * Describes the message tank.board.v1.PutObjectsResponse.
 * Use `create(PutObjectsResponseSchema)` to create a new message.
 */
export declare const PutObjectsResponseSchema: GenMessage<PutObjectsResponse>;
/**
 * What was clicked inside a running frame: the element, and where it came from in
 * the source. The browser inside the frame reports this; it is the whole reason the
 * preview build stamps elements with their origin.
 *
 * @generated from message tank.board.v1.Element
 */
export type Element = Message<"tank.board.v1.Element"> & {
    /**
     * "src/features/shell/Logo.tsx:8:5"
     *
     * @generated from field: string source = 1;
     */
    source: string;
    /**
     * "button"
     *
     * @generated from field: string tag = 2;
     */
    tag: string;
    /**
     * what it says, for a human to recognise it by
     *
     * @generated from field: string text = 3;
     */
    text: string;
    /**
     * @generated from field: string test_id = 4;
     */
    testId: string;
    /**
     * where it sits inside the frame
     *
     * @generated from field: tank.board.v1.Rect at = 5;
     */
    at?: Rect;
    /**
     * @generated from field: repeated string classes = 6;
     */
    classes: string[];
};
/**
 * Describes the message tank.board.v1.Element.
 * Use `create(ElementSchema)` to create a new message.
 */
export declare const ElementSchema: GenMessage<Element>;
/**
 * Ask for a change to something in a running frame. This is the product's point: the
 * design and the code stop being two places.
 *
 * @generated from message tank.board.v1.RequestChangeRequest
 */
export type RequestChangeRequest = Message<"tank.board.v1.RequestChangeRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string board_id = 2;
     */
    boardId: string;
    /**
     * the frame it was asked of
     *
     * @generated from field: string object_id = 3;
     */
    objectId: string;
    /**
     * @generated from field: tank.board.v1.Element element = 4;
     */
    element?: Element;
    /**
     * "make this the same blue as the header"
     *
     * @generated from field: string ask = 5;
     */
    ask: string;
};
/**
 * Describes the message tank.board.v1.RequestChangeRequest.
 * Use `create(RequestChangeRequestSchema)` to create a new message.
 */
export declare const RequestChangeRequestSchema: GenMessage<RequestChangeRequest>;
/**
 * @generated from message tank.board.v1.RequestChangeResponse
 */
export type RequestChangeResponse = Message<"tank.board.v1.RequestChangeResponse"> & {
    /**
     * Where the work is being discussed and watched: a thread in the Tread the board
     * belongs to, which is where the agent posts its plan and its cards.
     *
     * @generated from field: string thread_root_id = 6;
     */
    threadRootId: string;
    /**
     * @generated from field: string channel_id = 7;
     */
    channelId: string;
    /**
     * What was asked, as it was sent to the agent, so the board can show it back.
     *
     * @generated from field: string prompt = 8;
     */
    prompt: string;
};
/**
 * Describes the message tank.board.v1.RequestChangeResponse.
 * Use `create(RequestChangeResponseSchema)` to create a new message.
 */
export declare const RequestChangeResponseSchema: GenMessage<RequestChangeResponse>;
/**
 * @generated from message tank.board.v1.BoardTemplate
 */
export type BoardTemplate = Message<"tank.board.v1.BoardTemplate"> & {
    /**
     * what to pass as CreateBoardRequest.template
     *
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string title = 2;
     */
    title: string;
    /**
     * @generated from field: string icon = 3;
     */
    icon: string;
    /**
     * one line: what it is for
     *
     * @generated from field: string about = 4;
     */
    about: string;
    /**
     * "Diagram" | "Design" | "Together" | "From your code"
     *
     * @generated from field: string group = 5;
     */
    group: string;
    /**
     * What it actually looks like. A card with a name and an emoji on it tells nobody
     * what they are about to get; a client that can draw a board can draw these.
     *
     * @generated from field: repeated tank.board.v1.BoardObject objects = 6;
     */
    objects: BoardObject[];
    /**
     * The box the objects sit in, so a client can fit them to a card without measuring.
     *
     * @generated from field: tank.board.v1.Rect viewbox = 7;
     */
    viewbox?: Rect;
    /**
     * The same picture the server would export, for a client that would rather not draw
     * it a second time. Filled only when ListTemplatesRequest asked.
     *
     * @generated from field: string thumbnail_svg = 8;
     */
    thumbnailSvg: string;
    /**
     * One this workspace saved rather than one TANK ships. Only these can be deleted.
     *
     * @generated from field: bool custom = 9;
     */
    custom: boolean;
    /**
     * @generated from field: string created_by = 10;
     */
    createdBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 11;
     */
    createdAt?: Timestamp;
};
/**
 * Describes the message tank.board.v1.BoardTemplate.
 * Use `create(BoardTemplateSchema)` to create a new message.
 */
export declare const BoardTemplateSchema: GenMessage<BoardTemplate>;
/**
 * @generated from message tank.board.v1.ListTemplatesRequest
 */
export type ListTemplatesRequest = Message<"tank.board.v1.ListTemplatesRequest"> & {
    /**
     * Whose saved templates to include alongside the ones TANK ships. Empty lists only
     * TANK's, which is what an unauthenticated gallery wants.
     *
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * Render each one as well. A few kilobytes apiece, so it is asked for rather than
     * always sent.
     *
     * @generated from field: bool thumbnails = 2;
     */
    thumbnails: boolean;
};
/**
 * Describes the message tank.board.v1.ListTemplatesRequest.
 * Use `create(ListTemplatesRequestSchema)` to create a new message.
 */
export declare const ListTemplatesRequestSchema: GenMessage<ListTemplatesRequest>;
/**
 * @generated from message tank.board.v1.ListTemplatesResponse
 */
export type ListTemplatesResponse = Message<"tank.board.v1.ListTemplatesResponse"> & {
    /**
     * @generated from field: repeated tank.board.v1.BoardTemplate templates = 1;
     */
    templates: BoardTemplate[];
};
/**
 * Describes the message tank.board.v1.ListTemplatesResponse.
 * Use `create(ListTemplatesResponseSchema)` to create a new message.
 */
export declare const ListTemplatesResponseSchema: GenMessage<ListTemplatesResponse>;
/**
 * Save the board somebody is looking at as a template the rest of the workspace can
 * start from.
 *
 * `CreateBoardRequest.template` is a name the server resolves, so until there was an
 * RPC to register one this could not be done from a client at all — a team could make
 * the same board by hand every week and never turn it into a starting point.
 *
 * @generated from message tank.board.v1.SaveBoardTemplateRequest
 */
export type SaveBoardTemplateRequest = Message<"tank.board.v1.SaveBoardTemplateRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string board_id = 2;
     */
    boardId: string;
    /**
     * What CreateBoardRequest.template will carry. Made from the title when empty.
     *
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: string title = 4;
     */
    title: string;
    /**
     * @generated from field: string icon = 5;
     */
    icon: string;
    /**
     * @generated from field: string about = 6;
     */
    about: string;
    /**
     * @generated from field: string group = 7;
     */
    group: string;
    /**
     * Empty saves the whole board. A selection saves those objects, which is how a
     * corner of a board becomes a template without the rest of it coming too.
     *
     * @generated from field: repeated string object_ids = 8;
     */
    objectIds: string[];
    /**
     * Overwrite one of this workspace's own by that name. Without it a clash is a
     * refusal, because quietly replacing somebody else's template is not a save.
     *
     * @generated from field: bool replace = 9;
     */
    replace: boolean;
};
/**
 * Describes the message tank.board.v1.SaveBoardTemplateRequest.
 * Use `create(SaveBoardTemplateRequestSchema)` to create a new message.
 */
export declare const SaveBoardTemplateRequestSchema: GenMessage<SaveBoardTemplateRequest>;
/**
 * @generated from message tank.board.v1.SaveBoardTemplateResponse
 */
export type SaveBoardTemplateResponse = Message<"tank.board.v1.SaveBoardTemplateResponse"> & {
    /**
     * @generated from field: tank.board.v1.BoardTemplate template = 1;
     */
    template?: BoardTemplate;
};
/**
 * Describes the message tank.board.v1.SaveBoardTemplateResponse.
 * Use `create(SaveBoardTemplateResponseSchema)` to create a new message.
 */
export declare const SaveBoardTemplateResponseSchema: GenMessage<SaveBoardTemplateResponse>;
/**
 * @generated from message tank.board.v1.DeleteBoardTemplateRequest
 */
export type DeleteBoardTemplateRequest = Message<"tank.board.v1.DeleteBoardTemplateRequest"> & {
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
 * Describes the message tank.board.v1.DeleteBoardTemplateRequest.
 * Use `create(DeleteBoardTemplateRequestSchema)` to create a new message.
 */
export declare const DeleteBoardTemplateRequestSchema: GenMessage<DeleteBoardTemplateRequest>;
/**
 * @generated from message tank.board.v1.DeleteBoardTemplateResponse
 */
export type DeleteBoardTemplateResponse = Message<"tank.board.v1.DeleteBoardTemplateResponse"> & {};
/**
 * Describes the message tank.board.v1.DeleteBoardTemplateResponse.
 * Use `create(DeleteBoardTemplateResponseSchema)` to create a new message.
 */
export declare const DeleteBoardTemplateResponseSchema: GenMessage<DeleteBoardTemplateResponse>;
/**
 * A named region of a board that exports on its own: the "slice" every design tool
 * has. A slice is an ordinary object carrying a record saying it is one, for the same
 * reason a flowchart's decision is a rectangle that says it is drawn as a diamond —
 * moving, resizing, snapping and layout all keep working on the box they already know.
 *
 * @generated from message tank.board.v1.BoardSlice
 */
export type BoardSlice = Message<"tank.board.v1.BoardSlice"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: tank.board.v1.Rect at = 2;
     */
    at?: Rect;
    /**
     * @generated from field: string object_id = 3;
     */
    objectId: string;
};
/**
 * Describes the message tank.board.v1.BoardSlice.
 * Use `create(BoardSliceSchema)` to create a new message.
 */
export declare const BoardSliceSchema: GenMessage<BoardSlice>;
/**
 * Export a board, or part of one, as a file somebody can send to a person who does
 * not have a TANK account.
 *
 * @generated from message tank.board.v1.ExportBoardRequest
 */
export type ExportBoardRequest = Message<"tank.board.v1.ExportBoardRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * "svg" | "png" | "jpg" | "pdf". Empty is svg.
     *
     * @generated from field: string format = 3;
     */
    format: string;
    /**
     * empty exports everything
     *
     * @generated from field: repeated string object_ids = 4;
     */
    objectIds: string[];
    /**
     * @generated from field: bool transparent = 5;
     */
    transparent: boolean;
    /**
     * 1, 2 or 3 — the @1x/@2x/@3x a handoff asks for. Raster only: a vector file is
     * already every scale. 0 means 1.
     *
     * @generated from field: int32 scale = 6;
     */
    scale: number;
    /**
     * Export one named region instead of the whole board or a selection. A slice wins
     * over object_ids, because naming a region is the more specific ask.
     *
     * @generated from field: string slice = 7;
     */
    slice: string;
    /**
     * jpg only: 1..100. 0 means 82.
     *
     * @generated from field: int32 quality = 8;
     */
    quality: number;
};
/**
 * Describes the message tank.board.v1.ExportBoardRequest.
 * Use `create(ExportBoardRequestSchema)` to create a new message.
 */
export declare const ExportBoardRequestSchema: GenMessage<ExportBoardRequest>;
/**
 * @generated from message tank.board.v1.ExportBoardResponse
 */
export type ExportBoardResponse = Message<"tank.board.v1.ExportBoardResponse"> & {
    /**
     * @generated from field: string filename = 1;
     */
    filename: string;
    /**
     * @generated from field: string content_type = 2;
     */
    contentType: string;
    /**
     * @generated from field: bytes body = 3;
     */
    body: Uint8Array;
    /**
     * The pixels in the file. Zero for a vector format, which has none.
     *
     * @generated from field: int32 width = 4;
     */
    width: number;
    /**
     * @generated from field: int32 height = 5;
     */
    height: number;
    /**
     * What this file could not carry, in sentences somebody can act on: an effect the
     * format has no way to draw, or a count of the prototyping hotspots left out of it.
     * Empty means the file carries everything the board has.
     *
     * @generated from field: repeated string notes = 6;
     */
    notes: string[];
};
/**
 * Describes the message tank.board.v1.ExportBoardResponse.
 * Use `create(ExportBoardResponseSchema)` to create a new message.
 */
export declare const ExportBoardResponseSchema: GenMessage<ExportBoardResponse>;
/**
 * @generated from message tank.board.v1.ListBoardSlicesRequest
 */
export type ListBoardSlicesRequest = Message<"tank.board.v1.ListBoardSlicesRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
};
/**
 * Describes the message tank.board.v1.ListBoardSlicesRequest.
 * Use `create(ListBoardSlicesRequestSchema)` to create a new message.
 */
export declare const ListBoardSlicesRequestSchema: GenMessage<ListBoardSlicesRequest>;
/**
 * @generated from message tank.board.v1.ListBoardSlicesResponse
 */
export type ListBoardSlicesResponse = Message<"tank.board.v1.ListBoardSlicesResponse"> & {
    /**
     * @generated from field: repeated tank.board.v1.BoardSlice slices = 1;
     */
    slices: BoardSlice[];
};
/**
 * Describes the message tank.board.v1.ListBoardSlicesResponse.
 * Use `create(ListBoardSlicesResponseSchema)` to create a new message.
 */
export declare const ListBoardSlicesResponseSchema: GenMessage<ListBoardSlicesResponse>;
/**
 * An embed link: the board, or one slice of it, as a URL somebody with no TANK
 * account can put in a page.
 *
 * The link is the credential, the way an invoice's share link is, so it is readable
 * back to anyone who may read the board and rotating it is how it is taken away.
 *
 * @generated from message tank.board.v1.BoardEmbedRequest
 */
export type BoardEmbedRequest = Message<"tank.board.v1.BoardEmbedRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * @generated from field: string slice = 3;
     */
    slice: string;
    /**
     * mint a new link, which stops the old one working
     *
     * @generated from field: bool rotate = 4;
     */
    rotate: boolean;
    /**
     * stop the board being embeddable at all
     *
     * @generated from field: bool revoke = 5;
     */
    revoke: boolean;
};
/**
 * Describes the message tank.board.v1.BoardEmbedRequest.
 * Use `create(BoardEmbedRequestSchema)` to create a new message.
 */
export declare const BoardEmbedRequestSchema: GenMessage<BoardEmbedRequest>;
/**
 * @generated from message tank.board.v1.BoardEmbedResponse
 */
export type BoardEmbedResponse = Message<"tank.board.v1.BoardEmbedResponse"> & {
    /**
     * a page to put in an iframe
     *
     * @generated from field: string page_url = 1;
     */
    pageUrl: string;
    /**
     * the picture on its own, for a README or an <img>
     *
     * @generated from field: string image_url = 2;
     */
    imageUrl: string;
    /**
     * false once revoked
     *
     * @generated from field: bool embedded = 3;
     */
    embedded: boolean;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 4;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: string created_by = 5;
     */
    createdBy: string;
};
/**
 * Describes the message tank.board.v1.BoardEmbedResponse.
 * Use `create(BoardEmbedResponseSchema)` to create a new message.
 */
export declare const BoardEmbedResponseSchema: GenMessage<BoardEmbedResponse>;
/**
 * One thing somebody did while clicking through a running frame.
 *
 * @generated from message tank.board.v1.FlowStep
 */
export type FlowStep = Message<"tank.board.v1.FlowStep"> & {
    /**
     * @generated from field: tank.board.v1.Element element = 1;
     */
    element?: Element;
    /**
     * "click" | "fill" | "press" | "expect" | "goto"
     *
     * @generated from field: string action = 2;
     */
    action: string;
    /**
     * what was typed, the key, or the text expected
     *
     * @generated from field: string value = 3;
     */
    value: string;
    /**
     * what the person said about this step
     *
     * @generated from field: string note = 4;
     */
    note: string;
};
/**
 * Describes the message tank.board.v1.FlowStep.
 * Use `create(FlowStepSchema)` to create a new message.
 */
export declare const FlowStepSchema: GenMessage<FlowStep>;
/**
 * Turn a journey through the running app into a test. Clicking through a flow to
 * check it works and writing the test that checks it works are the same activity
 * done twice; this makes the second one fall out of the first.
 *
 * @generated from message tank.board.v1.GenerateTestRequest
 */
export type GenerateTestRequest = Message<"tank.board.v1.GenerateTestRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string board_id = 2;
     */
    boardId: string;
    /**
     * the frame the flow was recorded in
     *
     * @generated from field: string object_id = 3;
     */
    objectId: string;
    /**
     * "a customer pays an invoice"
     *
     * @generated from field: string name = 4;
     */
    name: string;
    /**
     * @generated from field: repeated tank.board.v1.FlowStep steps = 5;
     */
    steps: FlowStep[];
};
/**
 * Describes the message tank.board.v1.GenerateTestRequest.
 * Use `create(GenerateTestRequestSchema)` to create a new message.
 */
export declare const GenerateTestRequestSchema: GenMessage<GenerateTestRequest>;
/**
 * @generated from message tank.board.v1.GenerateTestResponse
 */
export type GenerateTestResponse = Message<"tank.board.v1.GenerateTestResponse"> & {
    /**
     * e2e/<name>.spec.ts
     *
     * @generated from field: string playwright_path = 1;
     */
    playwrightPath: string;
    /**
     * @generated from field: string playwright = 2;
     */
    playwright: string;
    /**
     * mobile/.maestro/<name>.yaml
     *
     * @generated from field: string maestro_path = 3;
     */
    maestroPath: string;
    /**
     * @generated from field: string maestro = 4;
     */
    maestro: string;
    /**
     * Steps the recorder could not turn into an assertion anybody should trust.
     *
     * @generated from field: repeated string skipped = 5;
     */
    skipped: string[];
};
/**
 * Describes the message tank.board.v1.GenerateTestResponse.
 * Use `create(GenerateTestResponseSchema)` to create a new message.
 */
export declare const GenerateTestResponseSchema: GenMessage<GenerateTestResponse>;
/**
 * A preview somebody else's CI published.
 *
 * TANK serves previews of the applications it builds, which is no use to a workspace
 * that builds its own. Rather than make every customer hand TANK their pipeline, a
 * workspace's CI tells TANK where it has already put the build, and a frame points at
 * that. The workspace keeps its own CI; TANK keeps the board.
 *
 * @generated from message tank.board.v1.ReportPreviewRequest
 */
export type ReportPreviewRequest = Message<"tank.board.v1.ReportPreviewRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * owner/name, as the frame names it
     *
     * @generated from field: string repo = 2;
     */
    repo: string;
    /**
     * the branch this build is of; "main" is allowed
     *
     * @generated from field: string ref = 3;
     */
    ref: string;
    /**
     * the commit it was built from
     *
     * @generated from field: string sha = 4;
     */
    sha: string;
    /**
     * where it is served, e.g. https://preview.example.com/abc123
     *
     * @generated from field: string url = 5;
     */
    url: string;
    /**
     * How long to trust it. The publisher knows its own retention; TANK will not claim
     * a build is there after this. Zero means the workspace's default.
     *
     * @generated from field: int32 retain_days = 6;
     */
    retainDays: number;
};
/**
 * Describes the message tank.board.v1.ReportPreviewRequest.
 * Use `create(ReportPreviewRequestSchema)` to create a new message.
 */
export declare const ReportPreviewRequestSchema: GenMessage<ReportPreviewRequest>;
/**
 * @generated from message tank.board.v1.ReportPreviewResponse
 */
export type ReportPreviewResponse = Message<"tank.board.v1.ReportPreviewResponse"> & {
    /**
     * @generated from field: string repo = 1;
     */
    repo: string;
    /**
     * @generated from field: string ref = 2;
     */
    ref: string;
    /**
     * @generated from field: string sha = 3;
     */
    sha: string;
    /**
     * @generated from field: string url = 4;
     */
    url: string;
    /**
     * @generated from field: google.protobuf.Timestamp built_at = 5;
     */
    builtAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 6;
     */
    expiresAt?: Timestamp;
};
/**
 * Describes the message tank.board.v1.ReportPreviewResponse.
 * Use `create(ReportPreviewResponseSchema)` to create a new message.
 */
export declare const ReportPreviewResponseSchema: GenMessage<ReportPreviewResponse>;
/**
 * @generated from message tank.board.v1.ListPreviewsRequest
 */
export type ListPreviewsRequest = Message<"tank.board.v1.ListPreviewsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * empty lists every repo the workspace has reported
     *
     * @generated from field: string repo = 2;
     */
    repo: string;
    /**
     * @generated from field: int32 limit = 3;
     */
    limit: number;
};
/**
 * Describes the message tank.board.v1.ListPreviewsRequest.
 * Use `create(ListPreviewsRequestSchema)` to create a new message.
 */
export declare const ListPreviewsRequestSchema: GenMessage<ListPreviewsRequest>;
/**
 * @generated from message tank.board.v1.ListPreviewsResponse
 */
export type ListPreviewsResponse = Message<"tank.board.v1.ListPreviewsResponse"> & {
    /**
     * @generated from field: repeated tank.board.v1.ReportPreviewResponse previews = 1;
     */
    previews: ReportPreviewResponse[];
};
/**
 * Describes the message tank.board.v1.ListPreviewsResponse.
 * Use `create(ListPreviewsResponseSchema)` to create a new message.
 */
export declare const ListPreviewsResponseSchema: GenMessage<ListPreviewsResponse>;
/**
 * Stop trusting one. A build that has been taken down should stop being offered the
 * moment its publisher says so, rather than when TANK's clock runs out.
 *
 * @generated from message tank.board.v1.ForgetPreviewRequest
 */
export type ForgetPreviewRequest = Message<"tank.board.v1.ForgetPreviewRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string repo = 2;
     */
    repo: string;
    /**
     * empty forgets every ref of that repo
     *
     * @generated from field: string ref = 3;
     */
    ref: string;
};
/**
 * Describes the message tank.board.v1.ForgetPreviewRequest.
 * Use `create(ForgetPreviewRequestSchema)` to create a new message.
 */
export declare const ForgetPreviewRequestSchema: GenMessage<ForgetPreviewRequest>;
/**
 * @generated from message tank.board.v1.ForgetPreviewResponse
 */
export type ForgetPreviewResponse = Message<"tank.board.v1.ForgetPreviewResponse"> & {
    /**
     * @generated from field: int32 forgotten = 1;
     */
    forgotten: number;
};
/**
 * Describes the message tank.board.v1.ForgetPreviewResponse.
 * Use `create(ForgetPreviewResponseSchema)` to create a new message.
 */
export declare const ForgetPreviewResponseSchema: GenMessage<ForgetPreviewResponse>;
/**
 * A column in a table somebody reported the schema of.
 *
 * @generated from message tank.board.v1.SchemaColumn
 */
export type SchemaColumn = Message<"tank.board.v1.SchemaColumn"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string type = 2;
     */
    type: string;
    /**
     * @generated from field: bool primary_key = 3;
     */
    primaryKey: boolean;
    /**
     * @generated from field: bool nullable = 4;
     */
    nullable: boolean;
    /**
     * "orders.id": the column this one points at, when it points at one.
     *
     * @generated from field: string references = 5;
     */
    references: string;
};
/**
 * Describes the message tank.board.v1.SchemaColumn.
 * Use `create(SchemaColumnSchema)` to create a new message.
 */
export declare const SchemaColumnSchema: GenMessage<SchemaColumn>;
/**
 * @generated from message tank.board.v1.SchemaTable
 */
export type SchemaTable = Message<"tank.board.v1.SchemaTable"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * "public"
     *
     * @generated from field: string schema = 2;
     */
    schema: string;
    /**
     * @generated from field: repeated tank.board.v1.SchemaColumn columns = 3;
     */
    columns: SchemaColumn[];
};
/**
 * Describes the message tank.board.v1.SchemaTable.
 * Use `create(SchemaTableSchema)` to create a new message.
 */
export declare const SchemaTableSchema: GenMessage<SchemaTable>;
/**
 * One file of infrastructure-as-code, as the repository holds it.
 *
 * @generated from message tank.board.v1.InfraFile
 */
export type InfraFile = Message<"tank.board.v1.InfraFile"> & {
    /**
     * @generated from field: string path = 1;
     */
    path: string;
    /**
     * @generated from field: string body = 2;
     */
    body: string;
};
/**
 * Describes the message tank.board.v1.InfraFile.
 * Use `create(InfraFileSchema)` to create a new message.
 */
export declare const InfraFileSchema: GenMessage<InfraFile>;
/**
 * Tell TANK what a database's schema is, or what is in a repository's `infra/`, so a
 * diagram can be drawn from the real thing instead of from somebody's memory of it.
 *
 * Deliberately the same shape as ReportPreview, and for the same reason. TANK holding
 * a connection string and reaching into somebody's network to read their database
 * would be a credential to store, to rotate and to lose, a route into their VPC, and
 * one more thing that can be breached — and the migration job that has just changed
 * the schema knows it better than any poller of ours would. So the workspace's own CI
 * says what it already knows, with a token whose only scope is board:preview, exactly
 * as it already does for previews.
 *
 * @generated from message tank.board.v1.ReportBoardSourceRequest
 */
export type ReportBoardSourceRequest = Message<"tank.board.v1.ReportBoardSourceRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * "erd" | "architecture"
     *
     * @generated from field: string kind = 2;
     */
    kind: string;
    /**
     * What to call it on a board: a database name, or owner/name for a repository.
     *
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * the branch; "main" when it does not apply
     *
     * @generated from field: string ref = 4;
     */
    ref: string;
    /**
     * the commit, or the migration version, it was read at
     *
     * @generated from field: string sha = 5;
     */
    sha: string;
    /**
     * kind = "erd"
     *
     * @generated from field: repeated tank.board.v1.SchemaTable tables = 6;
     */
    tables: SchemaTable[];
    /**
     * kind = "architecture"
     *
     * @generated from field: repeated tank.board.v1.InfraFile files = 7;
     */
    files: InfraFile[];
    /**
     * @generated from field: int32 retain_days = 8;
     */
    retainDays: number;
};
/**
 * Describes the message tank.board.v1.ReportBoardSourceRequest.
 * Use `create(ReportBoardSourceRequestSchema)` to create a new message.
 */
export declare const ReportBoardSourceRequestSchema: GenMessage<ReportBoardSourceRequest>;
/**
 * @generated from message tank.board.v1.BoardSource
 */
export type BoardSource = Message<"tank.board.v1.BoardSource"> & {
    /**
     * @generated from field: string kind = 1;
     */
    kind: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string ref = 3;
     */
    ref: string;
    /**
     * @generated from field: string sha = 4;
     */
    sha: string;
    /**
     * tables, or files
     *
     * @generated from field: int32 items = 5;
     */
    items: number;
    /**
     * @generated from field: google.protobuf.Timestamp reported_at = 6;
     */
    reportedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 7;
     */
    expiresAt?: Timestamp;
};
/**
 * Describes the message tank.board.v1.BoardSource.
 * Use `create(BoardSourceSchema)` to create a new message.
 */
export declare const BoardSourceSchema: GenMessage<BoardSource>;
/**
 * @generated from message tank.board.v1.ReportBoardSourceResponse
 */
export type ReportBoardSourceResponse = Message<"tank.board.v1.ReportBoardSourceResponse"> & {
    /**
     * @generated from field: tank.board.v1.BoardSource source = 1;
     */
    source?: BoardSource;
};
/**
 * Describes the message tank.board.v1.ReportBoardSourceResponse.
 * Use `create(ReportBoardSourceResponseSchema)` to create a new message.
 */
export declare const ReportBoardSourceResponseSchema: GenMessage<ReportBoardSourceResponse>;
/**
 * @generated from message tank.board.v1.ListBoardSourcesRequest
 */
export type ListBoardSourcesRequest = Message<"tank.board.v1.ListBoardSourcesRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * empty lists every kind
     *
     * @generated from field: string kind = 2;
     */
    kind: string;
};
/**
 * Describes the message tank.board.v1.ListBoardSourcesRequest.
 * Use `create(ListBoardSourcesRequestSchema)` to create a new message.
 */
export declare const ListBoardSourcesRequestSchema: GenMessage<ListBoardSourcesRequest>;
/**
 * @generated from message tank.board.v1.ListBoardSourcesResponse
 */
export type ListBoardSourcesResponse = Message<"tank.board.v1.ListBoardSourcesResponse"> & {
    /**
     * @generated from field: repeated tank.board.v1.BoardSource sources = 1;
     */
    sources: BoardSource[];
};
/**
 * Describes the message tank.board.v1.ListBoardSourcesResponse.
 * Use `create(ListBoardSourcesResponseSchema)` to create a new message.
 */
export declare const ListBoardSourcesResponseSchema: GenMessage<ListBoardSourcesResponse>;
/**
 * What a derived diagram was drawn from.
 *
 * The same idea as AppFrame.drawn_from_sha, applied to a drawing rather than to a
 * running app: a diagram that records what it rests on can say when that has moved,
 * and can be drawn again from the new thing instead of by hand. This is what makes
 * "the diagram re-derives itself when the code moves" a mechanism rather than a wish.
 *
 * @generated from message tank.board.v1.Derivation
 */
export type Derivation = Message<"tank.board.v1.Derivation"> & {
    /**
     * @generated from field: string kind = 1;
     */
    kind: string;
    /**
     * @generated from field: string source = 2;
     */
    source: string;
    /**
     * @generated from field: string ref = 3;
     */
    ref: string;
    /**
     * @generated from field: string sha = 4;
     */
    sha: string;
    /**
     * @generated from field: google.protobuf.Timestamp derived_at = 5;
     */
    derivedAt?: Timestamp;
    /**
     * Server-filled: something newer has been reported since this was drawn.
     *
     * @generated from field: bool moved_on = 6;
     */
    movedOn: boolean;
    /**
     * @generated from field: string moved_note = 7;
     */
    movedNote: string;
    /**
     * @generated from field: string moved_to_sha = 8;
     */
    movedToSha: string;
};
/**
 * Describes the message tank.board.v1.Derivation.
 * Use `create(DerivationSchema)` to create a new message.
 */
export declare const DerivationSchema: GenMessage<Derivation>;
/**
 * @generated from message tank.board.v1.DeriveDiagramRequest
 */
export type DeriveDiagramRequest = Message<"tank.board.v1.DeriveDiagramRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string board_id = 2;
     */
    boardId: string;
    /**
     * "erd" | "architecture"
     *
     * @generated from field: string kind = 3;
     */
    kind: string;
    /**
     * which reported source to draw
     *
     * @generated from field: string source = 4;
     */
    source: string;
    /**
     * @generated from field: string ref = 5;
     */
    ref: string;
    /**
     * Redraw a frame derived earlier rather than drawing a second one. With this set,
     * kind, source and ref come from the frame itself and need not be repeated.
     *
     * @generated from field: string frame_id = 6;
     */
    frameId: string;
    /**
     * @generated from field: double x = 7;
     */
    x: number;
    /**
     * @generated from field: double y = 8;
     */
    y: number;
};
/**
 * Describes the message tank.board.v1.DeriveDiagramRequest.
 * Use `create(DeriveDiagramRequestSchema)` to create a new message.
 */
export declare const DeriveDiagramRequestSchema: GenMessage<DeriveDiagramRequest>;
/**
 * @generated from message tank.board.v1.DeriveDiagramResponse
 */
export type DeriveDiagramResponse = Message<"tank.board.v1.DeriveDiagramResponse"> & {
    /**
     * @generated from field: string frame_id = 1;
     */
    frameId: string;
    /**
     * @generated from field: tank.board.v1.Board board = 2;
     */
    board?: Board;
    /**
     * @generated from field: tank.board.v1.Derivation derivation = 3;
     */
    derivation?: Derivation;
    /**
     * What the source did not say: a foreign key with no table to point at, a resource
     * nothing could be told about.
     *
     * @generated from field: repeated string notes = 4;
     */
    notes: string[];
};
/**
 * Describes the message tank.board.v1.DeriveDiagramResponse.
 * Use `create(DeriveDiagramResponseSchema)` to create a new message.
 */
export declare const DeriveDiagramResponseSchema: GenMessage<DeriveDiagramResponse>;
/**
 * @generated from enum tank.board.v1.ObjectKind
 */
export declare enum ObjectKind {
    /**
     * @generated from enum value: OBJECT_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * an artboard; may hold the running app
     *
     * @generated from enum value: OBJECT_KIND_FRAME = 1;
     */
    FRAME = 1,
    /**
     * @generated from enum value: OBJECT_KIND_RECT = 2;
     */
    RECT = 2,
    /**
     * @generated from enum value: OBJECT_KIND_ELLIPSE = 3;
     */
    ELLIPSE = 3,
    /**
     * @generated from enum value: OBJECT_KIND_LINE = 4;
     */
    LINE = 4,
    /**
     * @generated from enum value: OBJECT_KIND_ARROW = 5;
     */
    ARROW = 5,
    /**
     * @generated from enum value: OBJECT_KIND_TEXT = 6;
     */
    TEXT = 6,
    /**
     * the FigJam/Lucidspark note
     *
     * @generated from enum value: OBJECT_KIND_STICKY = 7;
     */
    STICKY = 7,
    /**
     * @generated from enum value: OBJECT_KIND_IMAGE = 8;
     */
    IMAGE = 8,
    /**
     * joins two objects and follows them
     *
     * @generated from enum value: OBJECT_KIND_CONNECTOR = 9;
     */
    CONNECTOR = 9,
    /**
     * freehand, a path of points
     *
     * @generated from enum value: OBJECT_KIND_DRAW = 10;
     */
    DRAW = 10
}
/**
 * Describes the enum tank.board.v1.ObjectKind.
 */
export declare const ObjectKindSchema: GenEnum<ObjectKind>;
/**
 * @generated from service tank.board.v1.BoardService
 */
export declare const BoardService: GenService<{
    /**
     * @generated from rpc tank.board.v1.BoardService.ListBoards
     */
    listBoards: {
        methodKind: "unary";
        input: typeof ListBoardsRequestSchema;
        output: typeof ListBoardsResponseSchema;
    };
    /**
     * @generated from rpc tank.board.v1.BoardService.GetBoard
     */
    getBoard: {
        methodKind: "unary";
        input: typeof GetBoardRequestSchema;
        output: typeof GetBoardResponseSchema;
    };
    /**
     * @generated from rpc tank.board.v1.BoardService.CreateBoard
     */
    createBoard: {
        methodKind: "unary";
        input: typeof CreateBoardRequestSchema;
        output: typeof CreateBoardResponseSchema;
    };
    /**
     * @generated from rpc tank.board.v1.BoardService.UpdateBoard
     */
    updateBoard: {
        methodKind: "unary";
        input: typeof UpdateBoardRequestSchema;
        output: typeof UpdateBoardResponseSchema;
    };
    /**
     * @generated from rpc tank.board.v1.BoardService.DeleteBoard
     */
    deleteBoard: {
        methodKind: "unary";
        input: typeof DeleteBoardRequestSchema;
        output: typeof DeleteBoardResponseSchema;
    };
    /**
     * @generated from rpc tank.board.v1.BoardService.PutObjects
     */
    putObjects: {
        methodKind: "unary";
        input: typeof PutObjectsRequestSchema;
        output: typeof PutObjectsResponseSchema;
    };
    /**
     * @generated from rpc tank.board.v1.BoardService.RequestChange
     */
    requestChange: {
        methodKind: "unary";
        input: typeof RequestChangeRequestSchema;
        output: typeof RequestChangeResponseSchema;
    };
    /**
     * @generated from rpc tank.board.v1.BoardService.ListTemplates
     */
    listTemplates: {
        methodKind: "unary";
        input: typeof ListTemplatesRequestSchema;
        output: typeof ListTemplatesResponseSchema;
    };
    /**
     * @generated from rpc tank.board.v1.BoardService.SaveBoardTemplate
     */
    saveBoardTemplate: {
        methodKind: "unary";
        input: typeof SaveBoardTemplateRequestSchema;
        output: typeof SaveBoardTemplateResponseSchema;
    };
    /**
     * @generated from rpc tank.board.v1.BoardService.DeleteBoardTemplate
     */
    deleteBoardTemplate: {
        methodKind: "unary";
        input: typeof DeleteBoardTemplateRequestSchema;
        output: typeof DeleteBoardTemplateResponseSchema;
    };
    /**
     * @generated from rpc tank.board.v1.BoardService.ExportBoard
     */
    exportBoard: {
        methodKind: "unary";
        input: typeof ExportBoardRequestSchema;
        output: typeof ExportBoardResponseSchema;
    };
    /**
     * @generated from rpc tank.board.v1.BoardService.ListBoardSlices
     */
    listBoardSlices: {
        methodKind: "unary";
        input: typeof ListBoardSlicesRequestSchema;
        output: typeof ListBoardSlicesResponseSchema;
    };
    /**
     * @generated from rpc tank.board.v1.BoardService.BoardEmbed
     */
    boardEmbed: {
        methodKind: "unary";
        input: typeof BoardEmbedRequestSchema;
        output: typeof BoardEmbedResponseSchema;
    };
    /**
     * @generated from rpc tank.board.v1.BoardService.GenerateTest
     */
    generateTest: {
        methodKind: "unary";
        input: typeof GenerateTestRequestSchema;
        output: typeof GenerateTestResponseSchema;
    };
    /**
     * @generated from rpc tank.board.v1.BoardService.ReportPreview
     */
    reportPreview: {
        methodKind: "unary";
        input: typeof ReportPreviewRequestSchema;
        output: typeof ReportPreviewResponseSchema;
    };
    /**
     * @generated from rpc tank.board.v1.BoardService.ListPreviews
     */
    listPreviews: {
        methodKind: "unary";
        input: typeof ListPreviewsRequestSchema;
        output: typeof ListPreviewsResponseSchema;
    };
    /**
     * @generated from rpc tank.board.v1.BoardService.ForgetPreview
     */
    forgetPreview: {
        methodKind: "unary";
        input: typeof ForgetPreviewRequestSchema;
        output: typeof ForgetPreviewResponseSchema;
    };
    /**
     * @generated from rpc tank.board.v1.BoardService.ReportBoardSource
     */
    reportBoardSource: {
        methodKind: "unary";
        input: typeof ReportBoardSourceRequestSchema;
        output: typeof ReportBoardSourceResponseSchema;
    };
    /**
     * @generated from rpc tank.board.v1.BoardService.ListBoardSources
     */
    listBoardSources: {
        methodKind: "unary";
        input: typeof ListBoardSourcesRequestSchema;
        output: typeof ListBoardSourcesResponseSchema;
    };
    /**
     * @generated from rpc tank.board.v1.BoardService.DeriveDiagram
     */
    deriveDiagram: {
        methodKind: "unary";
        input: typeof DeriveDiagramRequestSchema;
        output: typeof DeriveDiagramResponseSchema;
    };
}>;
