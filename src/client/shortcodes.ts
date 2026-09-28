import type { RichText, RichTextElement, Style } from "../contracts/tank/richtext/v1/richtext_pb.js";

/** Slack-style shortcode: `:name:` with 2–64 of `[a-z0-9_+-]`. */
const SHORTCODE = /:([a-z0-9_+-]{2,64}):/gi;

function emojiElement(name: string): RichTextElement {
  return {
    $typeName: "tank.richtext.v1.RichTextElement",
    kind: {
      case: "emoji",
      value: { $typeName: "tank.richtext.v1.EmojiElement", name, unicode: "" },
    },
  };
}

function textElement(text: string, style: Style | undefined): RichTextElement {
  return {
    $typeName: "tank.richtext.v1.RichTextElement",
    kind: { case: "text", value: { $typeName: "tank.richtext.v1.TextElement", text, style } },
  };
}

function expandElements(
  elements: readonly RichTextElement[],
  isKnown: (name: string) => boolean,
): RichTextElement[] {
  const out: RichTextElement[] = [];
  for (const el of elements) {
    if (el.kind.case !== "text" || el.kind.value.style?.code) {
      out.push(el);
      continue;
    }
    const { text, style } = el.kind.value;
    let last = 0;
    let changed = false;
    SHORTCODE.lastIndex = 0;
    for (let m = SHORTCODE.exec(text); m; m = SHORTCODE.exec(text)) {
      const name = m[1]!.toLowerCase();
      if (!isKnown(name)) continue;
      if (m.index > last) out.push(textElement(text.slice(last, m.index), style));
      out.push(emojiElement(name));
      last = m.index + m[0].length;
      changed = true;
    }
    if (!changed) {
      out.push(el);
      continue;
    }
    if (last < text.length) out.push(textElement(text.slice(last), style));
  }
  return out;
}

/** An expansion always adds elements; unchanged input comes back element-for-element identical. */
function same(a: readonly RichTextElement[], b: readonly RichTextElement[]): boolean {
  return a.length === b.length && a.every((e, i) => e === b[i]);
}

/**
 * Turns `:name:` shortcodes that name a workspace custom emoji into emoji elements, so a
 * renderer can draw the image. Text typed on any client and messages from before the
 * client learned to emit emoji elements both come through here. Unknown shortcodes, code
 * spans and code blocks are left alone. Returns the same object when nothing changed.
 */
export function expandShortcodes(rt: RichText, isKnown: (name: string) => boolean): RichText {
  let changed = false;
  const blocks = rt.blocks.map((b) => {
    const k = b.kind;
    switch (k.case) {
      case "section":
      case "quote": {
        const elements = expandElements(k.value.elements, isKnown);
        if (same(elements, k.value.elements)) return b;
        changed = true;
        return { ...b, kind: { ...k, value: { ...k.value, elements } } } as typeof b;
      }
      case "list": {
        let listChanged = false;
        const items = k.value.items.map((it) => {
          const elements = expandElements(it.elements, isKnown);
          if (same(elements, it.elements)) return it;
          listChanged = true;
          return { ...it, elements };
        });
        if (!listChanged) return b;
        changed = true;
        return { ...b, kind: { ...k, value: { ...k.value, items } } } as typeof b;
      }
      default:
        return b;
    }
  });
  return changed ? { ...rt, blocks } : rt;
}
