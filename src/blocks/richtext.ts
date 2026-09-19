import { create } from "@bufbuild/protobuf";
import {
  type RichText,
  type RichTextElement,
  RichTextSchema,
  type Style,
} from "../contracts/tank/richtext/v1/richtext_pb.js";

type ElementInit = RichTextElement["kind"];

export interface TextStyle {
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  code?: boolean;
}

function style(s?: TextStyle): Style | undefined {
  if (!s) return undefined;
  return {
    $typeName: "tank.richtext.v1.Style",
    bold: s.bold ?? false,
    italic: s.italic ?? false,
    strike: s.strike ?? false,
    code: s.code ?? false,
  };
}

/** Inline element builders for RichText sections. */
export const rt = {
  text: (text: string, s?: TextStyle): RichTextElement => ({
    $typeName: "tank.richtext.v1.RichTextElement",
    kind: { case: "text", value: { $typeName: "tank.richtext.v1.TextElement", text, style: style(s) } },
  }),
  bold: (text: string): RichTextElement => rt.text(text, { bold: true }),
  code: (text: string): RichTextElement => rt.text(text, { code: true }),
  link: (url: string, text = "", s?: TextStyle): RichTextElement => ({
    $typeName: "tank.richtext.v1.RichTextElement",
    kind: { case: "link", value: { $typeName: "tank.richtext.v1.LinkElement", url, text, style: style(s) } },
  }),
  user: (userId: string): RichTextElement => ({
    $typeName: "tank.richtext.v1.RichTextElement",
    kind: { case: "user", value: { $typeName: "tank.richtext.v1.UserMention", userId, style: undefined } },
  }),
  channel: (channelId: string): RichTextElement => ({
    $typeName: "tank.richtext.v1.RichTextElement",
    kind: { case: "channel", value: { $typeName: "tank.richtext.v1.ChannelMention", channelId } },
  }),
  emoji: (name: string, unicode = ""): RichTextElement => ({
    $typeName: "tank.richtext.v1.RichTextElement",
    kind: { case: "emoji", value: { $typeName: "tank.richtext.v1.EmojiElement", name, unicode } },
  }),
};

export type RichTextInput = string | RichText | RichTextElement[];

/** A RichText with one section. Strings become a single text element. */
export function richText(input: RichTextInput): RichText {
  if (typeof input === "string") return richText([rt.text(input)]);
  if (Array.isArray(input)) {
    return create(RichTextSchema, {
      blocks: [{ kind: { case: "section", value: { elements: input } } }],
    });
  }
  return input;
}

/** A RichText holding one fenced code block. */
export function codeBlock(text: string, language = ""): RichText {
  return create(RichTextSchema, { blocks: [{ kind: { case: "code", value: { language, text } } }] });
}

/** Plain-text projection of a RichText (for search, previews and accessibility). */
export function richTextToPlain(r: RichText | undefined): string {
  if (!r) return "";
  const out: string[] = [];
  for (const b of r.blocks) {
    const k = b.kind;
    switch (k.case) {
      case "section":
      case "quote":
        out.push(k.value.elements.map(elementToPlain).join(""));
        break;
      case "code":
        out.push(k.value.text);
        break;
      case "list":
        out.push(
          k.value.items
            .map(
              (it, i) => `${k.value.ordered ? `${i + 1}.` : "•"} ${it.elements.map(elementToPlain).join("")}`,
            )
            .join("\n"),
        );
        break;
      default:
        break;
    }
  }
  return out.join("\n");
}

export function elementToPlain(e: RichTextElement): string {
  const k = e.kind;
  switch (k.case) {
    case "text":
      return k.value.text;
    case "link":
      return k.value.text || k.value.url;
    case "user":
      return `@${k.value.userId}`;
    case "channel":
      return `#${k.value.channelId}`;
    case "broadcast":
      return "@here";
    case "emoji":
      return k.value.unicode || `:${k.value.name}:`;
    default:
      return "";
  }
}

export type { ElementInit };
