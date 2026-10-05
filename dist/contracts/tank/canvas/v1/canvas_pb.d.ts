import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/canvas/v1/canvas.proto.
 */
export declare const file_tank_canvas_v1_canvas: GenFile;
/**
 * @generated from message tank.canvas.v1.TableRow
 */
export type TableRow = Message<"tank.canvas.v1.TableRow"> & {
    /**
     * @generated from field: repeated string cells = 1;
     */
    cells: string[];
};
/**
 * Describes the message tank.canvas.v1.TableRow.
 * Use `create(TableRowSchema)` to create a new message.
 */
export declare const TableRowSchema: GenMessage<TableRow>;
/**
 * @generated from message tank.canvas.v1.Table
 */
export type Table = Message<"tank.canvas.v1.Table"> & {
    /**
     * @generated from field: repeated string headers = 1;
     */
    headers: string[];
    /**
     * @generated from field: repeated tank.canvas.v1.TableRow rows = 2;
     */
    rows: TableRow[];
};
/**
 * Describes the message tank.canvas.v1.Table.
 * Use `create(TableSchema)` to create a new message.
 */
export declare const TableSchema: GenMessage<Table>;
/**
 * A decision is answerable: what, who, when, why, and what it replaced.
 *
 * @generated from message tank.canvas.v1.Decision
 */
export type Decision = Message<"tank.canvas.v1.Decision"> & {
    /**
     * one sentence, in the present tense
     *
     * @generated from field: string what = 1;
     */
    what: string;
    /**
     * user ids
     *
     * @generated from field: repeated string decided_by = 2;
     */
    decidedBy: string[];
    /**
     * @generated from field: google.protobuf.Timestamp decided_at = 3;
     */
    decidedAt?: Timestamp;
    /**
     * the reason, when one was given
     *
     * @generated from field: string because = 4;
     */
    because: string;
    /**
     * the decision this replaces
     *
     * @generated from field: string supersedes_block_id = 5;
     */
    supersedesBlockId: string;
    /**
     * where it was made
     *
     * @generated from field: string thread_root_id = 6;
     */
    threadRootId: string;
    /**
     * Set when something this decision rested on has since changed.
     *
     * @generated from field: bool needs_revisiting = 7;
     */
    needsRevisiting: boolean;
    /**
     * @generated from field: string revisit_note = 8;
     */
    revisitNote: string;
};
/**
 * Describes the message tank.canvas.v1.Decision.
 * Use `create(DecisionSchema)` to create a new message.
 */
export declare const DecisionSchema: GenMessage<Decision>;
/**
 * A live block is the real number, not a screenshot of it. Values are filled in by
 * the server when the page is read, so a canvas is never stale about its own data.
 *
 * @generated from message tank.canvas.v1.Live
 */
export type Live = Message<"tank.canvas.v1.Live"> & {
    /**
     * books.cash | books.overdue | radar.widget | agent.runs | catalog.product
     *
     * @generated from field: string kind = 1;
     */
    kind: string;
    /**
     * which widget, which product; empty when the kind is enough
     *
     * @generated from field: string ref = 2;
     */
    ref: string;
    /**
     * what to call it on the page
     *
     * @generated from field: string label = 3;
     */
    label: string;
    /**
     * server-filled
     *
     * @generated from field: string value = 4;
     */
    value: string;
    /**
     * server-filled
     *
     * @generated from field: string detail = 5;
     */
    detail: string;
    /**
     * @generated from field: google.protobuf.Timestamp as_of = 6;
     */
    asOf?: Timestamp;
    /**
     * why it could not be read, in a sentence
     *
     * @generated from field: string error = 7;
     */
    error: string;
};
/**
 * Describes the message tank.canvas.v1.Live.
 * Use `create(LiveSchema)` to create a new message.
 */
export declare const LiveSchema: GenMessage<Live>;
/**
 * @generated from message tank.canvas.v1.Block
 */
export type Block = Message<"tank.canvas.v1.Block"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: tank.canvas.v1.BlockKind kind = 2;
     */
    kind: BlockKind;
    /**
     * @generated from field: string text = 3;
     */
    text: string;
    /**
     * nesting for bullets and numbers
     *
     * @generated from field: int32 depth = 4;
     */
    depth: number;
    /**
     * todo
     *
     * @generated from field: bool checked = 5;
     */
    checked: boolean;
    /**
     * code
     *
     * @generated from field: string lang = 6;
     */
    lang: string;
    /**
     * @generated from field: tank.canvas.v1.Decision decision = 7;
     */
    decision?: Decision;
    /**
     * @generated from field: tank.canvas.v1.Live live = 8;
     */
    live?: Live;
    /**
     * the quoted message
     *
     * @generated from field: string message_id = 9;
     */
    messageId: string;
    /**
     * the image
     *
     * @generated from field: string file_id = 10;
     */
    fileId: string;
    /**
     * @generated from field: tank.canvas.v1.Table table = 11;
     */
    table?: Table;
    /**
     * For an image: where to fetch it, filled in by the server when the page is read.
     *
     * @generated from field: string file_url = 12;
     */
    fileUrl: string;
};
/**
 * Describes the message tank.canvas.v1.Block.
 * Use `create(BlockSchema)` to create a new message.
 */
export declare const BlockSchema: GenMessage<Block>;
/**
 * Where the page came from, and whether it still holds.
 *
 * @generated from message tank.canvas.v1.Source
 */
export type Source = Message<"tank.canvas.v1.Source"> & {
    /**
     * thread | decision | repo | canvas
     *
     * @generated from field: string kind = 1;
     */
    kind: string;
    /**
     * thread root id, decision id, owner/repo, canvas id
     *
     * @generated from field: string ref = 2;
     */
    ref: string;
    /**
     * what to call it
     *
     * @generated from field: string label = 3;
     */
    label: string;
    /**
     * the state of it the page was written from
     *
     * @generated from field: google.protobuf.Timestamp seen_at = 4;
     */
    seenAt?: Timestamp;
    /**
     * @generated from field: bool changed = 5;
     */
    changed: boolean;
    /**
     * "9 messages since", "the decision was replaced"
     *
     * @generated from field: string changed_note = 6;
     */
    changedNote: string;
};
/**
 * Describes the message tank.canvas.v1.Source.
 * Use `create(SourceSchema)` to create a new message.
 */
export declare const SourceSchema: GenMessage<Source>;
/**
 * @generated from message tank.canvas.v1.Canvas
 */
export type Canvas = Message<"tank.canvas.v1.Canvas"> & {
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
     * one emoji
     *
     * @generated from field: string icon = 5;
     */
    icon: string;
    /**
     * @generated from field: repeated tank.canvas.v1.Block blocks = 6;
     */
    blocks: Block[];
    /**
     * @generated from field: repeated tank.canvas.v1.Source sources = 7;
     */
    sources: Source[];
    /**
     * 0 is current; 100 is nothing it rests on is still as it was.
     *
     * @generated from field: int32 staleness = 8;
     */
    staleness: number;
    /**
     * What has moved, in a sentence. Empty when the page is current.
     *
     * @generated from field: string staleness_note = 9;
     */
    stalenessNote: string;
    /**
     * @generated from field: string created_by = 10;
     */
    createdBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 11;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: string updated_by = 12;
     */
    updatedBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 13;
     */
    updatedAt?: Timestamp;
    /**
     * @generated from field: int32 version = 14;
     */
    version: number;
    /**
     * Set when the agent wrote or last revised it, so a reader always knows.
     *
     * @generated from field: bool written_by_agent = 15;
     */
    writtenByAgent: boolean;
    /**
     * one line, for lists and search
     *
     * @generated from field: string summary = 16;
     */
    summary: string;
    /**
     * The page this one sits under; empty for a page at the top level.
     *
     * @generated from field: string parent_id = 17;
     */
    parentId: string;
    /**
     * Pages directly under this one, for the reader to walk down.
     *
     * @generated from field: repeated tank.canvas.v1.CanvasSummary children = 18;
     */
    children: CanvasSummary[];
};
/**
 * Describes the message tank.canvas.v1.Canvas.
 * Use `create(CanvasSchema)` to create a new message.
 */
export declare const CanvasSchema: GenMessage<Canvas>;
/**
 * A canvas as it appears in a list: no blocks.
 *
 * @generated from message tank.canvas.v1.CanvasSummary
 */
export type CanvasSummary = Message<"tank.canvas.v1.CanvasSummary"> & {
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
     * @generated from field: string channel_id = 4;
     */
    channelId: string;
    /**
     * @generated from field: string summary = 5;
     */
    summary: string;
    /**
     * @generated from field: int32 staleness = 6;
     */
    staleness: number;
    /**
     * @generated from field: string staleness_note = 7;
     */
    stalenessNote: string;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 8;
     */
    updatedAt?: Timestamp;
    /**
     * @generated from field: string updated_by = 9;
     */
    updatedBy: string;
    /**
     * @generated from field: bool written_by_agent = 10;
     */
    writtenByAgent: boolean;
    /**
     * how many decision blocks it holds
     *
     * @generated from field: int32 decisions = 11;
     */
    decisions: number;
    /**
     * @generated from field: string parent_id = 12;
     */
    parentId: string;
    /**
     * @generated from field: int32 child_count = 13;
     */
    childCount: number;
};
/**
 * Describes the message tank.canvas.v1.CanvasSummary.
 * Use `create(CanvasSummarySchema)` to create a new message.
 */
export declare const CanvasSummarySchema: GenMessage<CanvasSummary>;
/**
 * @generated from message tank.canvas.v1.ListCanvasesRequest
 */
export type ListCanvasesRequest = Message<"tank.canvas.v1.ListCanvasesRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * empty for every canvas the caller can read
     *
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * @generated from field: bool stale_only = 3;
     */
    staleOnly: boolean;
    /**
     * Only the pages directly under this one. Set top_level to list the roots.
     *
     * @generated from field: string parent_id = 4;
     */
    parentId: string;
    /**
     * @generated from field: bool top_level = 5;
     */
    topLevel: boolean;
};
/**
 * Describes the message tank.canvas.v1.ListCanvasesRequest.
 * Use `create(ListCanvasesRequestSchema)` to create a new message.
 */
export declare const ListCanvasesRequestSchema: GenMessage<ListCanvasesRequest>;
/**
 * @generated from message tank.canvas.v1.ListCanvasesResponse
 */
export type ListCanvasesResponse = Message<"tank.canvas.v1.ListCanvasesResponse"> & {
    /**
     * @generated from field: repeated tank.canvas.v1.CanvasSummary canvases = 1;
     */
    canvases: CanvasSummary[];
};
/**
 * Describes the message tank.canvas.v1.ListCanvasesResponse.
 * Use `create(ListCanvasesResponseSchema)` to create a new message.
 */
export declare const ListCanvasesResponseSchema: GenMessage<ListCanvasesResponse>;
/**
 * @generated from message tank.canvas.v1.GetCanvasRequest
 */
export type GetCanvasRequest = Message<"tank.canvas.v1.GetCanvasRequest"> & {
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
 * Describes the message tank.canvas.v1.GetCanvasRequest.
 * Use `create(GetCanvasRequestSchema)` to create a new message.
 */
export declare const GetCanvasRequestSchema: GenMessage<GetCanvasRequest>;
/**
 * @generated from message tank.canvas.v1.GetCanvasResponse
 */
export type GetCanvasResponse = Message<"tank.canvas.v1.GetCanvasResponse"> & {
    /**
     * @generated from field: tank.canvas.v1.Canvas canvas = 1;
     */
    canvas?: Canvas;
};
/**
 * Describes the message tank.canvas.v1.GetCanvasResponse.
 * Use `create(GetCanvasResponseSchema)` to create a new message.
 */
export declare const GetCanvasResponseSchema: GenMessage<GetCanvasResponse>;
/**
 * @generated from message tank.canvas.v1.CreateCanvasRequest
 */
export type CreateCanvasRequest = Message<"tank.canvas.v1.CreateCanvasRequest"> & {
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
     * @generated from field: repeated tank.canvas.v1.Block blocks = 5;
     */
    blocks: Block[];
    /**
     * @generated from field: repeated tank.canvas.v1.Source sources = 6;
     */
    sources: Source[];
    /**
     * @generated from field: string parent_id = 7;
     */
    parentId: string;
    /**
     * A starting shape rather than a blank page: see ListTemplates. Ignored when
     * blocks are given.
     *
     * @generated from field: string template = 8;
     */
    template: string;
};
/**
 * Describes the message tank.canvas.v1.CreateCanvasRequest.
 * Use `create(CreateCanvasRequestSchema)` to create a new message.
 */
export declare const CreateCanvasRequestSchema: GenMessage<CreateCanvasRequest>;
/**
 * @generated from message tank.canvas.v1.CreateCanvasResponse
 */
export type CreateCanvasResponse = Message<"tank.canvas.v1.CreateCanvasResponse"> & {
    /**
     * @generated from field: tank.canvas.v1.Canvas canvas = 1;
     */
    canvas?: Canvas;
};
/**
 * Describes the message tank.canvas.v1.CreateCanvasResponse.
 * Use `create(CreateCanvasResponseSchema)` to create a new message.
 */
export declare const CreateCanvasResponseSchema: GenMessage<CreateCanvasResponse>;
/**
 * @generated from message tank.canvas.v1.UpdateCanvasRequest
 */
export type UpdateCanvasRequest = Message<"tank.canvas.v1.UpdateCanvasRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * empty leaves it
     *
     * @generated from field: string title = 3;
     */
    title: string;
    /**
     * @generated from field: string icon = 4;
     */
    icon: string;
    /**
     * the whole page; empty leaves the blocks alone
     *
     * @generated from field: repeated tank.canvas.v1.Block blocks = 5;
     */
    blocks: Block[];
    /**
     * true to replace the blocks, even with none
     *
     * @generated from field: bool set_blocks = 6;
     */
    setBlocks: boolean;
    /**
     * @generated from field: repeated tank.canvas.v1.Source sources = 7;
     */
    sources: Source[];
    /**
     * @generated from field: bool set_sources = 8;
     */
    setSources: boolean;
    /**
     * The version the editor last read. A mismatch is refused rather than overwritten.
     *
     * @generated from field: int32 base_version = 9;
     */
    baseVersion: number;
};
/**
 * Describes the message tank.canvas.v1.UpdateCanvasRequest.
 * Use `create(UpdateCanvasRequestSchema)` to create a new message.
 */
export declare const UpdateCanvasRequestSchema: GenMessage<UpdateCanvasRequest>;
/**
 * @generated from message tank.canvas.v1.UpdateCanvasResponse
 */
export type UpdateCanvasResponse = Message<"tank.canvas.v1.UpdateCanvasResponse"> & {
    /**
     * @generated from field: tank.canvas.v1.Canvas canvas = 1;
     */
    canvas?: Canvas;
};
/**
 * Describes the message tank.canvas.v1.UpdateCanvasResponse.
 * Use `create(UpdateCanvasResponseSchema)` to create a new message.
 */
export declare const UpdateCanvasResponseSchema: GenMessage<UpdateCanvasResponse>;
/**
 * @generated from message tank.canvas.v1.DeleteCanvasRequest
 */
export type DeleteCanvasRequest = Message<"tank.canvas.v1.DeleteCanvasRequest"> & {
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
 * Describes the message tank.canvas.v1.DeleteCanvasRequest.
 * Use `create(DeleteCanvasRequestSchema)` to create a new message.
 */
export declare const DeleteCanvasRequestSchema: GenMessage<DeleteCanvasRequest>;
/**
 * @generated from message tank.canvas.v1.DeleteCanvasResponse
 */
export type DeleteCanvasResponse = Message<"tank.canvas.v1.DeleteCanvasResponse"> & {};
/**
 * Describes the message tank.canvas.v1.DeleteCanvasResponse.
 * Use `create(DeleteCanvasResponseSchema)` to create a new message.
 */
export declare const DeleteCanvasResponseSchema: GenMessage<DeleteCanvasResponse>;
/**
 * Write a page from what was actually said. The thread's decisions and the shape of
 * the conversation become the first draft; a person edits from there.
 * Editing one block does not touch the rest of the page, so two people writing in
 * different places both succeed. This is what a page needs far more often than it
 * needs cursors.
 *
 * @generated from message tank.canvas.v1.UpdateBlockRequest
 */
export type UpdateBlockRequest = Message<"tank.canvas.v1.UpdateBlockRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string canvas_id = 2;
     */
    canvasId: string;
    /**
     * its id names the block; a new id appends
     *
     * @generated from field: tank.canvas.v1.Block block = 3;
     */
    block?: Block;
    /**
     * @generated from field: bool delete = 4;
     */
    delete: boolean;
    /**
     * where a new block goes; empty appends
     *
     * @generated from field: string after_block_id = 5;
     */
    afterBlockId: string;
};
/**
 * Describes the message tank.canvas.v1.UpdateBlockRequest.
 * Use `create(UpdateBlockRequestSchema)` to create a new message.
 */
export declare const UpdateBlockRequestSchema: GenMessage<UpdateBlockRequest>;
/**
 * @generated from message tank.canvas.v1.UpdateBlockResponse
 */
export type UpdateBlockResponse = Message<"tank.canvas.v1.UpdateBlockResponse"> & {
    /**
     * @generated from field: tank.canvas.v1.Canvas canvas = 1;
     */
    canvas?: Canvas;
};
/**
 * Describes the message tank.canvas.v1.UpdateBlockResponse.
 * Use `create(UpdateBlockResponseSchema)` to create a new message.
 */
export declare const UpdateBlockResponseSchema: GenMessage<UpdateBlockResponse>;
/**
 * @generated from message tank.canvas.v1.Template
 */
export type Template = Message<"tank.canvas.v1.Template"> & {
    /**
     * what to pass as CreateCanvasRequest.template
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
     * one line: when to reach for it
     *
     * @generated from field: string about = 4;
     */
    about: string;
};
/**
 * Describes the message tank.canvas.v1.Template.
 * Use `create(TemplateSchema)` to create a new message.
 */
export declare const TemplateSchema: GenMessage<Template>;
/**
 * @generated from message tank.canvas.v1.ListTemplatesRequest
 */
export type ListTemplatesRequest = Message<"tank.canvas.v1.ListTemplatesRequest"> & {};
/**
 * Describes the message tank.canvas.v1.ListTemplatesRequest.
 * Use `create(ListTemplatesRequestSchema)` to create a new message.
 */
export declare const ListTemplatesRequestSchema: GenMessage<ListTemplatesRequest>;
/**
 * @generated from message tank.canvas.v1.ListTemplatesResponse
 */
export type ListTemplatesResponse = Message<"tank.canvas.v1.ListTemplatesResponse"> & {
    /**
     * @generated from field: repeated tank.canvas.v1.Template templates = 1;
     */
    templates: Template[];
};
/**
 * Describes the message tank.canvas.v1.ListTemplatesResponse.
 * Use `create(ListTemplatesResponseSchema)` to create a new message.
 */
export declare const ListTemplatesResponseSchema: GenMessage<ListTemplatesResponse>;
/**
 * @generated from message tank.canvas.v1.WriteFromThreadRequest
 */
export type WriteFromThreadRequest = Message<"tank.canvas.v1.WriteFromThreadRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string thread_root_id = 2;
     */
    threadRootId: string;
    /**
     * empty lets the server name it from the thread
     *
     * @generated from field: string title = 3;
     */
    title: string;
};
/**
 * Describes the message tank.canvas.v1.WriteFromThreadRequest.
 * Use `create(WriteFromThreadRequestSchema)` to create a new message.
 */
export declare const WriteFromThreadRequestSchema: GenMessage<WriteFromThreadRequest>;
/**
 * @generated from message tank.canvas.v1.WriteFromThreadResponse
 */
export type WriteFromThreadResponse = Message<"tank.canvas.v1.WriteFromThreadResponse"> & {
    /**
     * @generated from field: tank.canvas.v1.Canvas canvas = 1;
     */
    canvas?: Canvas;
};
/**
 * Describes the message tank.canvas.v1.WriteFromThreadResponse.
 * Use `create(WriteFromThreadResponseSchema)` to create a new message.
 */
export declare const WriteFromThreadResponseSchema: GenMessage<WriteFromThreadResponse>;
/**
 * Ask the pages a question and get the passage that answers it.
 *
 * @generated from message tank.canvas.v1.AskRequest
 */
export type AskRequest = Message<"tank.canvas.v1.AskRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string question = 2;
     */
    question: string;
    /**
     * @generated from field: int32 limit = 3;
     */
    limit: number;
};
/**
 * Describes the message tank.canvas.v1.AskRequest.
 * Use `create(AskRequestSchema)` to create a new message.
 */
export declare const AskRequestSchema: GenMessage<AskRequest>;
/**
 * @generated from message tank.canvas.v1.Answer
 */
export type Answer = Message<"tank.canvas.v1.Answer"> & {
    /**
     * @generated from field: string canvas_id = 1;
     */
    canvasId: string;
    /**
     * @generated from field: string title = 2;
     */
    title: string;
    /**
     * @generated from field: string icon = 3;
     */
    icon: string;
    /**
     * the part that answers it
     *
     * @generated from field: string passage = 4;
     */
    passage: string;
    /**
     * @generated from field: string block_id = 5;
     */
    blockId: string;
    /**
     * @generated from field: double score = 6;
     */
    score: number;
    /**
     * How this page was found: "words", "meaning", or "both". A reader deserves to
     * know whether the Vault understood the question or merely matched it.
     *
     * @generated from field: string matched = 7;
     */
    matched: string;
};
/**
 * Describes the message tank.canvas.v1.Answer.
 * Use `create(AnswerSchema)` to create a new message.
 */
export declare const AnswerSchema: GenMessage<Answer>;
/**
 * @generated from message tank.canvas.v1.AskResponse
 */
export type AskResponse = Message<"tank.canvas.v1.AskResponse"> & {
    /**
     * @generated from field: repeated tank.canvas.v1.Answer answers = 1;
     */
    answers: Answer[];
    /**
     * One sentence over the top when the pages agree on an answer.
     *
     * @generated from field: string summary = 2;
     */
    summary: string;
    /**
     * False when the Vault could not be reached and this is words only, so the
     * caller can say so rather than implying the pages were understood.
     *
     * @generated from field: bool semantic = 3;
     */
    semantic: boolean;
};
/**
 * Describes the message tank.canvas.v1.AskResponse.
 * Use `create(AskResponseSchema)` to create a new message.
 */
export declare const AskResponseSchema: GenMessage<AskResponse>;
/**
 * @generated from enum tank.canvas.v1.BlockKind
 */
export declare enum BlockKind {
    /**
     * @generated from enum value: BLOCK_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: BLOCK_KIND_HEADING = 1;
     */
    HEADING = 1,
    /**
     * @generated from enum value: BLOCK_KIND_TEXT = 2;
     */
    TEXT = 2,
    /**
     * @generated from enum value: BLOCK_KIND_BULLET = 3;
     */
    BULLET = 3,
    /**
     * @generated from enum value: BLOCK_KIND_NUMBER = 4;
     */
    NUMBER = 4,
    /**
     * @generated from enum value: BLOCK_KIND_QUOTE = 5;
     */
    QUOTE = 5,
    /**
     * @generated from enum value: BLOCK_KIND_CODE = 6;
     */
    CODE = 6,
    /**
     * @generated from enum value: BLOCK_KIND_DIVIDER = 7;
     */
    DIVIDER = 7,
    /**
     * @generated from enum value: BLOCK_KIND_TODO = 8;
     */
    TODO = 8,
    /**
     * What the team settled, kept as structure rather than a paragraph.
     *
     * @generated from enum value: BLOCK_KIND_DECISION = 9;
     */
    DECISION = 9,
    /**
     * A real figure from the workspace, current when the page is read.
     *
     * @generated from enum value: BLOCK_KIND_LIVE = 10;
     */
    LIVE = 10,
    /**
     * A message from a thread, quoted with its author.
     *
     * @generated from enum value: BLOCK_KIND_MESSAGE = 11;
     */
    MESSAGE = 11,
    /**
     * @generated from enum value: BLOCK_KIND_IMAGE = 12;
     */
    IMAGE = 12,
    /**
     * Rows and columns, for the things a page is otherwise bad at holding.
     *
     * @generated from enum value: BLOCK_KIND_TABLE = 13;
     */
    TABLE = 13
}
/**
 * Describes the enum tank.canvas.v1.BlockKind.
 */
export declare const BlockKindSchema: GenEnum<BlockKind>;
/**
 * @generated from service tank.canvas.v1.CanvasService
 */
export declare const CanvasService: GenService<{
    /**
     * @generated from rpc tank.canvas.v1.CanvasService.ListCanvases
     */
    listCanvases: {
        methodKind: "unary";
        input: typeof ListCanvasesRequestSchema;
        output: typeof ListCanvasesResponseSchema;
    };
    /**
     * @generated from rpc tank.canvas.v1.CanvasService.GetCanvas
     */
    getCanvas: {
        methodKind: "unary";
        input: typeof GetCanvasRequestSchema;
        output: typeof GetCanvasResponseSchema;
    };
    /**
     * @generated from rpc tank.canvas.v1.CanvasService.CreateCanvas
     */
    createCanvas: {
        methodKind: "unary";
        input: typeof CreateCanvasRequestSchema;
        output: typeof CreateCanvasResponseSchema;
    };
    /**
     * @generated from rpc tank.canvas.v1.CanvasService.UpdateCanvas
     */
    updateCanvas: {
        methodKind: "unary";
        input: typeof UpdateCanvasRequestSchema;
        output: typeof UpdateCanvasResponseSchema;
    };
    /**
     * @generated from rpc tank.canvas.v1.CanvasService.DeleteCanvas
     */
    deleteCanvas: {
        methodKind: "unary";
        input: typeof DeleteCanvasRequestSchema;
        output: typeof DeleteCanvasResponseSchema;
    };
    /**
     * @generated from rpc tank.canvas.v1.CanvasService.WriteFromThread
     */
    writeFromThread: {
        methodKind: "unary";
        input: typeof WriteFromThreadRequestSchema;
        output: typeof WriteFromThreadResponseSchema;
    };
    /**
     * @generated from rpc tank.canvas.v1.CanvasService.Ask
     */
    ask: {
        methodKind: "unary";
        input: typeof AskRequestSchema;
        output: typeof AskResponseSchema;
    };
    /**
     * @generated from rpc tank.canvas.v1.CanvasService.UpdateBlock
     */
    updateBlock: {
        methodKind: "unary";
        input: typeof UpdateBlockRequestSchema;
        output: typeof UpdateBlockResponseSchema;
    };
    /**
     * @generated from rpc tank.canvas.v1.CanvasService.ListTemplates
     */
    listTemplates: {
        methodKind: "unary";
        input: typeof ListTemplatesRequestSchema;
        output: typeof ListTemplatesResponseSchema;
    };
}>;
