import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Mark } from "../../apps/v1/apps_pb.js";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/browse/v1/browse.proto.
 */
export declare const file_tank_browse_v1_browse: GenFile;
/**
 * @generated from message tank.browse.v1.Page
 */
export type Page = Message<"tank.browse.v1.Page"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string conversation_id = 2;
     */
    conversationId: string;
    /**
     * @generated from field: string url = 3;
     */
    url: string;
    /**
     * @generated from field: string title = 4;
     */
    title: string;
    /**
     * @generated from field: string owner_id = 5;
     */
    ownerId: string;
    /**
     * @generated from field: string owner_name = 6;
     */
    ownerName: string;
    /**
     * @generated from field: google.protobuf.Timestamp opened_at = 7;
     */
    openedAt?: Timestamp;
    /**
     * "loading", "ready", "closed", or "failed" (with reason).
     *
     * @generated from field: string state = 8;
     */
    state: string;
    /**
     * @generated from field: string reason = 9;
     */
    reason: string;
    /**
     * Who is driving now: the owner unless they gave control to someone else.
     *
     * @generated from field: string driver_id = 10;
     */
    driverId: string;
    /**
     * @generated from field: string driver_name = 11;
     */
    driverName: string;
};
/**
 * Describes the message tank.browse.v1.Page.
 * Use `create(PageSchema)` to create a new message.
 */
export declare const PageSchema: GenMessage<Page>;
/**
 * @generated from message tank.browse.v1.SetDriverRequest
 */
export type SetDriverRequest = Message<"tank.browse.v1.SetDriverRequest"> & {
    /**
     * @generated from field: string page_id = 1;
     */
    pageId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
};
/**
 * Describes the message tank.browse.v1.SetDriverRequest.
 * Use `create(SetDriverRequestSchema)` to create a new message.
 */
export declare const SetDriverRequestSchema: GenMessage<SetDriverRequest>;
/**
 * @generated from message tank.browse.v1.SetDriverResponse
 */
export type SetDriverResponse = Message<"tank.browse.v1.SetDriverResponse"> & {
    /**
     * @generated from field: tank.browse.v1.Page page = 1;
     */
    page?: Page;
};
/**
 * Describes the message tank.browse.v1.SetDriverResponse.
 * Use `create(SetDriverResponseSchema)` to create a new message.
 */
export declare const SetDriverResponseSchema: GenMessage<SetDriverResponse>;
/**
 * @generated from message tank.browse.v1.OpenPageRequest
 */
export type OpenPageRequest = Message<"tank.browse.v1.OpenPageRequest"> & {
    /**
     * @generated from field: string conversation_id = 1;
     */
    conversationId: string;
    /**
     * An http(s) address on the public internet.
     *
     * @generated from field: string url = 2;
     */
    url: string;
    /**
     * The person's screen, so the page is laid out for it: a phone gets the phone site.
     *
     * @generated from field: int32 viewport_width = 3;
     */
    viewportWidth: number;
    /**
     * @generated from field: int32 viewport_height = 4;
     */
    viewportHeight: number;
};
/**
 * Describes the message tank.browse.v1.OpenPageRequest.
 * Use `create(OpenPageRequestSchema)` to create a new message.
 */
export declare const OpenPageRequestSchema: GenMessage<OpenPageRequest>;
/**
 * @generated from message tank.browse.v1.OpenPageResponse
 */
export type OpenPageResponse = Message<"tank.browse.v1.OpenPageResponse"> & {
    /**
     * @generated from field: tank.browse.v1.Page page = 1;
     */
    page?: Page;
};
/**
 * Describes the message tank.browse.v1.OpenPageResponse.
 * Use `create(OpenPageResponseSchema)` to create a new message.
 */
export declare const OpenPageResponseSchema: GenMessage<OpenPageResponse>;
/**
 * @generated from message tank.browse.v1.ClosePageRequest
 */
export type ClosePageRequest = Message<"tank.browse.v1.ClosePageRequest"> & {
    /**
     * @generated from field: string page_id = 1;
     */
    pageId: string;
};
/**
 * Describes the message tank.browse.v1.ClosePageRequest.
 * Use `create(ClosePageRequestSchema)` to create a new message.
 */
export declare const ClosePageRequestSchema: GenMessage<ClosePageRequest>;
/**
 * @generated from message tank.browse.v1.ClosePageResponse
 */
export type ClosePageResponse = Message<"tank.browse.v1.ClosePageResponse"> & {};
/**
 * Describes the message tank.browse.v1.ClosePageResponse.
 * Use `create(ClosePageResponseSchema)` to create a new message.
 */
export declare const ClosePageResponseSchema: GenMessage<ClosePageResponse>;
/**
 * @generated from message tank.browse.v1.ListPagesRequest
 */
export type ListPagesRequest = Message<"tank.browse.v1.ListPagesRequest"> & {
    /**
     * @generated from field: string conversation_id = 1;
     */
    conversationId: string;
};
/**
 * Describes the message tank.browse.v1.ListPagesRequest.
 * Use `create(ListPagesRequestSchema)` to create a new message.
 */
export declare const ListPagesRequestSchema: GenMessage<ListPagesRequest>;
/**
 * @generated from message tank.browse.v1.ListPagesResponse
 */
export type ListPagesResponse = Message<"tank.browse.v1.ListPagesResponse"> & {
    /**
     * @generated from field: repeated tank.browse.v1.Page pages = 1;
     */
    pages: Page[];
};
/**
 * Describes the message tank.browse.v1.ListPagesResponse.
 * Use `create(ListPagesResponseSchema)` to create a new message.
 */
export declare const ListPagesResponseSchema: GenMessage<ListPagesResponse>;
/**
 * @generated from message tank.browse.v1.ActRequest
 */
export type ActRequest = Message<"tank.browse.v1.ActRequest"> & {
    /**
     * @generated from field: string page_id = 1;
     */
    pageId: string;
    /**
     * @generated from oneof tank.browse.v1.ActRequest.action
     */
    action: {
        /**
         * Where on the frame, as fractions of its width and height (0..1).
         *
         * @generated from field: tank.browse.v1.Point tap = 2;
         */
        value: Point;
        case: "tap";
    } | {
        /**
         * Text typed into whatever has focus.
         *
         * @generated from field: string type = 3;
         */
        value: string;
        case: "type";
    } | {
        /**
         * "Enter", "Tab", "Escape", "Backspace".
         *
         * @generated from field: string key = 4;
         */
        value: string;
        case: "key";
    } | {
        /**
         * Pixels down (negative is up), in the page's own pixels.
         *
         * @generated from field: int32 scroll = 5;
         */
        value: number;
        case: "scroll";
    } | {
        /**
         * @generated from field: bool back = 6;
         */
        value: boolean;
        case: "back";
    } | {
        /**
         * @generated from field: bool forward = 7;
         */
        value: boolean;
        case: "forward";
    } | {
        /**
         * @generated from field: string navigate = 8;
         */
        value: string;
        case: "navigate";
    } | {
        /**
         * @generated from field: bool reload = 9;
         */
        value: boolean;
        case: "reload";
    } | {
        case: undefined;
        value?: undefined;
    };
};
/**
 * Describes the message tank.browse.v1.ActRequest.
 * Use `create(ActRequestSchema)` to create a new message.
 */
export declare const ActRequestSchema: GenMessage<ActRequest>;
/**
 * @generated from message tank.browse.v1.Point
 */
export type Point = Message<"tank.browse.v1.Point"> & {
    /**
     * @generated from field: double x = 1;
     */
    x: number;
    /**
     * @generated from field: double y = 2;
     */
    y: number;
};
/**
 * Describes the message tank.browse.v1.Point.
 * Use `create(PointSchema)` to create a new message.
 */
export declare const PointSchema: GenMessage<Point>;
/**
 * @generated from message tank.browse.v1.ActResponse
 */
export type ActResponse = Message<"tank.browse.v1.ActResponse"> & {
    /**
     * @generated from field: tank.browse.v1.Page page = 1;
     */
    page?: Page;
};
/**
 * Describes the message tank.browse.v1.ActResponse.
 * Use `create(ActResponseSchema)` to create a new message.
 */
export declare const ActResponseSchema: GenMessage<ActResponse>;
/**
 * @generated from message tank.browse.v1.WatchPageRequest
 */
export type WatchPageRequest = Message<"tank.browse.v1.WatchPageRequest"> & {
    /**
     * @generated from field: string page_id = 1;
     */
    pageId: string;
};
/**
 * Describes the message tank.browse.v1.WatchPageRequest.
 * Use `create(WatchPageRequestSchema)` to create a new message.
 */
export declare const WatchPageRequestSchema: GenMessage<WatchPageRequest>;
/**
 * @generated from message tank.browse.v1.WatchPageResponse
 */
export type WatchPageResponse = Message<"tank.browse.v1.WatchPageResponse"> & {
    /**
     * @generated from oneof tank.browse.v1.WatchPageResponse.event
     */
    event: {
        /**
         * @generated from field: tank.browse.v1.Frame frame = 1;
         */
        value: Frame;
        case: "frame";
    } | {
        /**
         * The page itself changed (address, title, state).
         *
         * @generated from field: tank.browse.v1.Page page = 2;
         */
        value: Page;
        case: "page";
    } | {
        case: undefined;
        value?: undefined;
    };
};
/**
 * Describes the message tank.browse.v1.WatchPageResponse.
 * Use `create(WatchPageResponseSchema)` to create a new message.
 */
export declare const WatchPageResponseSchema: GenMessage<WatchPageResponse>;
/**
 * Frame is the page's screen at one moment.
 *
 * @generated from message tank.browse.v1.Frame
 */
export type Frame = Message<"tank.browse.v1.Frame"> & {
    /**
     * @generated from field: bytes jpeg = 1;
     */
    jpeg: Uint8Array;
    /**
     * @generated from field: int32 width = 2;
     */
    width: number;
    /**
     * @generated from field: int32 height = 3;
     */
    height: number;
    /**
     * @generated from field: string url = 4;
     */
    url: string;
    /**
     * @generated from field: string title = 5;
     */
    title: string;
    /**
     * @generated from field: google.protobuf.Timestamp at = 6;
     */
    at?: Timestamp;
    /**
     * Neural's marks on this frame: kind "box" (x, y, w, h set) rings what to look at or tap.
     *
     * @generated from field: repeated tank.apps.v1.Mark marks = 7;
     */
    marks: Mark[];
    /**
     * Neural is waiting for the person to tap the marked box (it would submit or change
     * something), with the sentence to show.
     *
     * @generated from field: string waiting_for_tap = 8;
     */
    waitingForTap: string;
};
/**
 * Describes the message tank.browse.v1.Frame.
 * Use `create(FrameSchema)` to create a new message.
 */
export declare const FrameSchema: GenMessage<Frame>;
/**
 * Connect a webpage (Robby, 2026-11-11): a page opened in a Neural conversation, run by TANK in
 * an isolated browser that reaches only the public internet, and shown in the chat the way a
 * phone camera is. Neural reads it, points at things on it ("show me how to find these
 * settings") and navigates it: links, scrolling, back, typing into a search box. Anything
 * that submits or changes something (signing in, saving, buying, deleting, sending) Neural
 * marks and waits for the person to tap. Nothing a person types is stored; the browser and
 * its cookies are gone when the page is closed. In a shared conversation everyone sees the
 * page and only the person who opened it drives it.
 *
 * @generated from service tank.browse.v1.BrowseService
 */
export declare const BrowseService: GenService<{
    /**
     * @generated from rpc tank.browse.v1.BrowseService.OpenPage
     */
    openPage: {
        methodKind: "unary";
        input: typeof OpenPageRequestSchema;
        output: typeof OpenPageResponseSchema;
    };
    /**
     * @generated from rpc tank.browse.v1.BrowseService.ClosePage
     */
    closePage: {
        methodKind: "unary";
        input: typeof ClosePageRequestSchema;
        output: typeof ClosePageResponseSchema;
    };
    /**
     * The conversation's open pages.
     *
     * @generated from rpc tank.browse.v1.BrowseService.ListPages
     */
    listPages: {
        methodKind: "unary";
        input: typeof ListPagesRequestSchema;
        output: typeof ListPagesResponseSchema;
    };
    /**
     * What the person does on the page: tap, type, scroll, back, go to an address. Only the
     * page's current driver may act.
     *
     * @generated from rpc tank.browse.v1.BrowseService.Act
     */
    act: {
        methodKind: "unary";
        input: typeof ActRequestSchema;
        output: typeof ActResponseSchema;
    };
    /**
     * Hands control of the page to someone else in the conversation (Robby, 2026-11-11: "allow
     * them to give control to the other people in the conversation"). The owner may give it to
     * anyone in the conversation and take it back at any time; the current driver may hand it
     * back to the owner. An empty user_id gives it back to the owner.
     *
     * @generated from rpc tank.browse.v1.BrowseService.SetDriver
     */
    setDriver: {
        methodKind: "unary";
        input: typeof SetDriverRequestSchema;
        output: typeof SetDriverResponseSchema;
    };
    /**
     * The page's screen as it changes (about once a second while it moves), with Neural's
     * marks on it. Any member of the conversation may watch.
     *
     * @generated from rpc tank.browse.v1.BrowseService.WatchPage
     */
    watchPage: {
        methodKind: "server_streaming";
        input: typeof WatchPageRequestSchema;
        output: typeof WatchPageResponseSchema;
    };
}>;
