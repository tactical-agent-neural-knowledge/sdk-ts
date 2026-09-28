import { describe, expect, it } from "vitest";
import type { RichText } from "../contracts/tank/richtext/v1/richtext_pb.js";
import { expandShortcodes } from "./shortcodes.js";

function section(...texts: string[]): RichText {
  return {
    $typeName: "tank.richtext.v1.RichText",
    blocks: [
      {
        $typeName: "tank.richtext.v1.RichTextBlock",
        kind: {
          case: "section",
          value: {
            $typeName: "tank.richtext.v1.RichTextSection",
            elements: texts.map((text) => ({
              $typeName: "tank.richtext.v1.RichTextElement",
              kind: {
                case: "text",
                value: { $typeName: "tank.richtext.v1.TextElement", text, style: undefined },
              },
            })),
          },
        },
      },
    ],
  };
}

function kinds(rt: RichText): string[] {
  const b = rt.blocks[0]!.kind;
  if (b.case !== "section") return [];
  return b.value.elements.map((e) =>
    e.kind.case === "emoji"
      ? `emoji:${e.kind.value.name}`
      : e.kind.case === "text"
        ? `text:${e.kind.value.text}`
        : String(e.kind.case),
  );
}

describe("expandShortcodes", () => {
  const known = (n: string) => n === "tank" || n === "party-parrot";

  it("turns a known shortcode into an emoji element and keeps the text around it", () => {
    expect(kinds(expandShortcodes(section("ship it :tank: now"), known))).toEqual([
      "text:ship it ",
      "emoji:tank",
      "text: now",
    ]);
  });

  it("handles a message that is only the shortcode, and several in a row", () => {
    expect(kinds(expandShortcodes(section(":tank:"), known))).toEqual(["emoji:tank"]);
    expect(kinds(expandShortcodes(section(":tank::party-parrot:"), known))).toEqual([
      "emoji:tank",
      "emoji:party-parrot",
    ]);
  });

  it("leaves unknown shortcodes, times and code spans alone", () => {
    const rt = section("at 10:30: nope :unknown: ok");
    expect(expandShortcodes(rt, known)).toBe(rt);
    const code: RichText = section("`:tank:`");
    const el = code.blocks[0]!.kind.case === "section" ? code.blocks[0]!.kind.value.elements[0]! : undefined;
    if (el?.kind.case === "text")
      el.kind.value.style = {
        $typeName: "tank.richtext.v1.Style",
        bold: false,
        italic: false,
        strike: false,
        code: true,
      };
    expect(expandShortcodes(code, known)).toBe(code);
  });

  it("matches names case-insensitively and lowercases the element name", () => {
    expect(kinds(expandShortcodes(section("GO :TANK:"), known))).toEqual(["text:GO ", "emoji:tank"]);
  });
});
