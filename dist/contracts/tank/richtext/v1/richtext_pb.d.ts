import type { GenEnum, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/richtext/v1/richtext.proto.
 */
export declare const file_tank_richtext_v1_richtext: GenFile;
/**
 * Portable rich-text AST (the shape of Slack's rich_text block). Editors
 * convert to and from this; Markdown is never the storage format.
 *
 * @generated from message tank.richtext.v1.RichText
 */
export type RichText = Message<"tank.richtext.v1.RichText"> & {
    /**
     * @generated from field: repeated tank.richtext.v1.RichTextBlock blocks = 1;
     */
    blocks: RichTextBlock[];
};
/**
 * Describes the message tank.richtext.v1.RichText.
 * Use `create(RichTextSchema)` to create a new message.
 */
export declare const RichTextSchema: GenMessage<RichText>;
/**
 * @generated from message tank.richtext.v1.RichTextBlock
 */
export type RichTextBlock = Message<"tank.richtext.v1.RichTextBlock"> & {
    /**
     * @generated from oneof tank.richtext.v1.RichTextBlock.kind
     */
    kind: {
        /**
         * @generated from field: tank.richtext.v1.RichTextSection section = 1;
         */
        value: RichTextSection;
        case: "section";
    } | {
        /**
         * @generated from field: tank.richtext.v1.RichTextCode code = 2;
         */
        value: RichTextCode;
        case: "code";
    } | {
        /**
         * @generated from field: tank.richtext.v1.RichTextQuote quote = 3;
         */
        value: RichTextQuote;
        case: "quote";
    } | {
        /**
         * @generated from field: tank.richtext.v1.RichTextList list = 4;
         */
        value: RichTextList;
        case: "list";
    } | {
        /**
         * Added 2026-11-12 so an agent's Markdown (headings, GitHub tables, rules) has a
         * shape. A client that predates them sees an unset kind and draws nothing, so
         * the server only emits them once every client renders them.
         *
         * @generated from field: tank.richtext.v1.RichTextHeading heading = 5;
         */
        value: RichTextHeading;
        case: "heading";
    } | {
        /**
         * @generated from field: tank.richtext.v1.RichTextTable table = 6;
         */
        value: RichTextTable;
        case: "table";
    } | {
        /**
         * @generated from field: tank.richtext.v1.RichTextDivider divider = 7;
         */
        value: RichTextDivider;
        case: "divider";
    } | {
        case: undefined;
        value?: undefined;
    };
};
/**
 * Describes the message tank.richtext.v1.RichTextBlock.
 * Use `create(RichTextBlockSchema)` to create a new message.
 */
export declare const RichTextBlockSchema: GenMessage<RichTextBlock>;
/**
 * @generated from message tank.richtext.v1.Style
 */
export type Style = Message<"tank.richtext.v1.Style"> & {
    /**
     * @generated from field: bool bold = 1;
     */
    bold: boolean;
    /**
     * @generated from field: bool italic = 2;
     */
    italic: boolean;
    /**
     * @generated from field: bool strike = 3;
     */
    strike: boolean;
    /**
     * @generated from field: bool code = 4;
     */
    code: boolean;
};
/**
 * Describes the message tank.richtext.v1.Style.
 * Use `create(StyleSchema)` to create a new message.
 */
export declare const StyleSchema: GenMessage<Style>;
/**
 * @generated from message tank.richtext.v1.RichTextElement
 */
export type RichTextElement = Message<"tank.richtext.v1.RichTextElement"> & {
    /**
     * @generated from oneof tank.richtext.v1.RichTextElement.kind
     */
    kind: {
        /**
         * @generated from field: tank.richtext.v1.TextElement text = 1;
         */
        value: TextElement;
        case: "text";
    } | {
        /**
         * @generated from field: tank.richtext.v1.EmojiElement emoji = 2;
         */
        value: EmojiElement;
        case: "emoji";
    } | {
        /**
         * @generated from field: tank.richtext.v1.UserMention user = 3;
         */
        value: UserMention;
        case: "user";
    } | {
        /**
         * @generated from field: tank.richtext.v1.ChannelMention channel = 4;
         */
        value: ChannelMention;
        case: "channel";
    } | {
        /**
         * @generated from field: tank.richtext.v1.BroadcastMention broadcast = 5;
         */
        value: BroadcastMention;
        case: "broadcast";
    } | {
        /**
         * @generated from field: tank.richtext.v1.LinkElement link = 6;
         */
        value: LinkElement;
        case: "link";
    } | {
        /**
         * @generated from field: tank.richtext.v1.UserGroupMention user_group = 7;
         */
        value: UserGroupMention;
        case: "userGroup";
    } | {
        case: undefined;
        value?: undefined;
    };
};
/**
 * Describes the message tank.richtext.v1.RichTextElement.
 * Use `create(RichTextElementSchema)` to create a new message.
 */
export declare const RichTextElementSchema: GenMessage<RichTextElement>;
/**
 * @handle of a tank.workspace.v1.UserGroup; the notify worker expands it to
 * the group's members.
 *
 * @generated from message tank.richtext.v1.UserGroupMention
 */
export type UserGroupMention = Message<"tank.richtext.v1.UserGroupMention"> & {
    /**
     * @generated from field: string group_id = 1;
     */
    groupId: string;
    /**
     * @generated from field: string handle = 2;
     */
    handle: string;
};
/**
 * Describes the message tank.richtext.v1.UserGroupMention.
 * Use `create(UserGroupMentionSchema)` to create a new message.
 */
export declare const UserGroupMentionSchema: GenMessage<UserGroupMention>;
/**
 * @generated from message tank.richtext.v1.TextElement
 */
export type TextElement = Message<"tank.richtext.v1.TextElement"> & {
    /**
     * @generated from field: string text = 1;
     */
    text: string;
    /**
     * @generated from field: tank.richtext.v1.Style style = 2;
     */
    style?: Style;
};
/**
 * Describes the message tank.richtext.v1.TextElement.
 * Use `create(TextElementSchema)` to create a new message.
 */
export declare const TextElementSchema: GenMessage<TextElement>;
/**
 * @generated from message tank.richtext.v1.EmojiElement
 */
export type EmojiElement = Message<"tank.richtext.v1.EmojiElement"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string unicode = 2;
     */
    unicode: string;
};
/**
 * Describes the message tank.richtext.v1.EmojiElement.
 * Use `create(EmojiElementSchema)` to create a new message.
 */
export declare const EmojiElementSchema: GenMessage<EmojiElement>;
/**
 * @generated from message tank.richtext.v1.UserMention
 */
export type UserMention = Message<"tank.richtext.v1.UserMention"> & {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
    /**
     * @generated from field: tank.richtext.v1.Style style = 2;
     */
    style?: Style;
};
/**
 * Describes the message tank.richtext.v1.UserMention.
 * Use `create(UserMentionSchema)` to create a new message.
 */
export declare const UserMentionSchema: GenMessage<UserMention>;
/**
 * @generated from message tank.richtext.v1.ChannelMention
 */
export type ChannelMention = Message<"tank.richtext.v1.ChannelMention"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
};
/**
 * Describes the message tank.richtext.v1.ChannelMention.
 * Use `create(ChannelMentionSchema)` to create a new message.
 */
export declare const ChannelMentionSchema: GenMessage<ChannelMention>;
/**
 * @generated from message tank.richtext.v1.BroadcastMention
 */
export type BroadcastMention = Message<"tank.richtext.v1.BroadcastMention"> & {
    /**
     * @generated from field: tank.richtext.v1.Broadcast range = 1;
     */
    range: Broadcast;
};
/**
 * Describes the message tank.richtext.v1.BroadcastMention.
 * Use `create(BroadcastMentionSchema)` to create a new message.
 */
export declare const BroadcastMentionSchema: GenMessage<BroadcastMention>;
/**
 * @generated from message tank.richtext.v1.LinkElement
 */
export type LinkElement = Message<"tank.richtext.v1.LinkElement"> & {
    /**
     * @generated from field: string url = 1;
     */
    url: string;
    /**
     * @generated from field: string text = 2;
     */
    text: string;
    /**
     * @generated from field: tank.richtext.v1.Style style = 3;
     */
    style?: Style;
};
/**
 * Describes the message tank.richtext.v1.LinkElement.
 * Use `create(LinkElementSchema)` to create a new message.
 */
export declare const LinkElementSchema: GenMessage<LinkElement>;
/**
 * @generated from message tank.richtext.v1.RichTextSection
 */
export type RichTextSection = Message<"tank.richtext.v1.RichTextSection"> & {
    /**
     * @generated from field: repeated tank.richtext.v1.RichTextElement elements = 1;
     */
    elements: RichTextElement[];
};
/**
 * Describes the message tank.richtext.v1.RichTextSection.
 * Use `create(RichTextSectionSchema)` to create a new message.
 */
export declare const RichTextSectionSchema: GenMessage<RichTextSection>;
/**
 * @generated from message tank.richtext.v1.RichTextCode
 */
export type RichTextCode = Message<"tank.richtext.v1.RichTextCode"> & {
    /**
     * @generated from field: string language = 1;
     */
    language: string;
    /**
     * @generated from field: string text = 2;
     */
    text: string;
};
/**
 * Describes the message tank.richtext.v1.RichTextCode.
 * Use `create(RichTextCodeSchema)` to create a new message.
 */
export declare const RichTextCodeSchema: GenMessage<RichTextCode>;
/**
 * @generated from message tank.richtext.v1.RichTextQuote
 */
export type RichTextQuote = Message<"tank.richtext.v1.RichTextQuote"> & {
    /**
     * @generated from field: repeated tank.richtext.v1.RichTextElement elements = 1;
     */
    elements: RichTextElement[];
};
/**
 * Describes the message tank.richtext.v1.RichTextQuote.
 * Use `create(RichTextQuoteSchema)` to create a new message.
 */
export declare const RichTextQuoteSchema: GenMessage<RichTextQuote>;
/**
 * @generated from message tank.richtext.v1.RichTextList
 */
export type RichTextList = Message<"tank.richtext.v1.RichTextList"> & {
    /**
     * @generated from field: bool ordered = 1;
     */
    ordered: boolean;
    /**
     * @generated from field: int32 indent = 2;
     */
    indent: number;
    /**
     * @generated from field: repeated tank.richtext.v1.RichTextSection items = 3;
     */
    items: RichTextSection[];
};
/**
 * Describes the message tank.richtext.v1.RichTextList.
 * Use `create(RichTextListSchema)` to create a new message.
 */
export declare const RichTextListSchema: GenMessage<RichTextList>;
/**
 * A heading line; level 1 to 6, as in Markdown's # to ######.
 *
 * @generated from message tank.richtext.v1.RichTextHeading
 */
export type RichTextHeading = Message<"tank.richtext.v1.RichTextHeading"> & {
    /**
     * @generated from field: int32 level = 1;
     */
    level: number;
    /**
     * @generated from field: repeated tank.richtext.v1.RichTextElement elements = 2;
     */
    elements: RichTextElement[];
};
/**
 * Describes the message tank.richtext.v1.RichTextHeading.
 * Use `create(RichTextHeadingSchema)` to create a new message.
 */
export declare const RichTextHeadingSchema: GenMessage<RichTextHeading>;
/**
 * A table: a header row, the rows under it, and each column's alignment
 * (align[i] is column i; a missing entry is unspecified, drawn as left).
 *
 * @generated from message tank.richtext.v1.RichTextTable
 */
export type RichTextTable = Message<"tank.richtext.v1.RichTextTable"> & {
    /**
     * @generated from field: tank.richtext.v1.RichTextTableRow header = 1;
     */
    header?: RichTextTableRow;
    /**
     * @generated from field: repeated tank.richtext.v1.RichTextTableRow rows = 2;
     */
    rows: RichTextTableRow[];
    /**
     * @generated from field: repeated tank.richtext.v1.TableAlign align = 3;
     */
    align: TableAlign[];
};
/**
 * Describes the message tank.richtext.v1.RichTextTable.
 * Use `create(RichTextTableSchema)` to create a new message.
 */
export declare const RichTextTableSchema: GenMessage<RichTextTable>;
/**
 * @generated from message tank.richtext.v1.RichTextTableRow
 */
export type RichTextTableRow = Message<"tank.richtext.v1.RichTextTableRow"> & {
    /**
     * @generated from field: repeated tank.richtext.v1.RichTextTableCell cells = 1;
     */
    cells: RichTextTableCell[];
};
/**
 * Describes the message tank.richtext.v1.RichTextTableRow.
 * Use `create(RichTextTableRowSchema)` to create a new message.
 */
export declare const RichTextTableRowSchema: GenMessage<RichTextTableRow>;
/**
 * @generated from message tank.richtext.v1.RichTextTableCell
 */
export type RichTextTableCell = Message<"tank.richtext.v1.RichTextTableCell"> & {
    /**
     * @generated from field: repeated tank.richtext.v1.RichTextElement elements = 1;
     */
    elements: RichTextElement[];
};
/**
 * Describes the message tank.richtext.v1.RichTextTableCell.
 * Use `create(RichTextTableCellSchema)` to create a new message.
 */
export declare const RichTextTableCellSchema: GenMessage<RichTextTableCell>;
/**
 * A horizontal rule between blocks.
 *
 * @generated from message tank.richtext.v1.RichTextDivider
 */
export type RichTextDivider = Message<"tank.richtext.v1.RichTextDivider"> & {};
/**
 * Describes the message tank.richtext.v1.RichTextDivider.
 * Use `create(RichTextDividerSchema)` to create a new message.
 */
export declare const RichTextDividerSchema: GenMessage<RichTextDivider>;
/**
 * @generated from enum tank.richtext.v1.Broadcast
 */
export declare enum Broadcast {
    /**
     * @generated from enum value: BROADCAST_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: BROADCAST_HERE = 1;
     */
    HERE = 1,
    /**
     * @generated from enum value: BROADCAST_CHANNEL = 2;
     */
    CHANNEL = 2,
    /**
     * @generated from enum value: BROADCAST_EVERYONE = 3;
     */
    EVERYONE = 3
}
/**
 * Describes the enum tank.richtext.v1.Broadcast.
 */
export declare const BroadcastSchema: GenEnum<Broadcast>;
/**
 * @generated from enum tank.richtext.v1.TableAlign
 */
export declare enum TableAlign {
    /**
     * @generated from enum value: TABLE_ALIGN_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: TABLE_ALIGN_LEFT = 1;
     */
    LEFT = 1,
    /**
     * @generated from enum value: TABLE_ALIGN_CENTER = 2;
     */
    CENTER = 2,
    /**
     * @generated from enum value: TABLE_ALIGN_RIGHT = 3;
     */
    RIGHT = 3
}
/**
 * Describes the enum tank.richtext.v1.TableAlign.
 */
export declare const TableAlignSchema: GenEnum<TableAlign>;
