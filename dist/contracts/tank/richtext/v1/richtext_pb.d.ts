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
