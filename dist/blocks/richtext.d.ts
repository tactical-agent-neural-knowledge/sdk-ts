import { type RichText, type RichTextElement } from "../contracts/tank/richtext/v1/richtext_pb.js";
type ElementInit = RichTextElement["kind"];
export interface TextStyle {
    bold?: boolean;
    italic?: boolean;
    strike?: boolean;
    code?: boolean;
}
/** Inline element builders for RichText sections. */
export declare const rt: {
    text: (text: string, s?: TextStyle) => RichTextElement;
    bold: (text: string) => RichTextElement;
    code: (text: string) => RichTextElement;
    link: (url: string, text?: string, s?: TextStyle) => RichTextElement;
    user: (userId: string) => RichTextElement;
    channel: (channelId: string) => RichTextElement;
    emoji: (name: string, unicode?: string) => RichTextElement;
};
export type RichTextInput = string | RichText | RichTextElement[];
/** A RichText with one section. Strings become a single text element. */
export declare function richText(input: RichTextInput): RichText;
/** A RichText holding one fenced code block. */
export declare function codeBlock(text: string, language?: string): RichText;
/** Plain-text projection of a RichText (for search, previews and accessibility). */
export declare function richTextToPlain(r: RichText | undefined): string;
export declare function elementToPlain(e: RichTextElement): string;
export type { ElementInit };
