import { describe, expect, it } from "vitest";
import { approvalPrompt, blocks, context } from "./builders.js";
import { formatLocalTime, hasTimeTokens, localizeTimes, localTimes, timeToken } from "./localtime.js";
import { richText, richTextToPlain } from "./richtext.js";

// 2026-11-25 11:16 UTC, the moment of "Approved by Robby at 11:16 UTC".
const AT = Date.UTC(2026, 10, 25, 11, 16);
const ET = { timeZone: "America/New_York", locale: "en-US" };
// ICU versions differ on the space before AM (U+202F) and the joiner before the time.
const plain = (s: string | false | undefined) => (s || "").replace(/\s/g, " ");

describe("time tokens", () => {
  it("writes a token the server and the clients agree on", () => {
    expect(timeToken(AT)).toBe(`<t:${AT / 1000}>`);
    expect(timeToken(AT, "f")).toBe(`<t:${AT / 1000}:f>`);
    expect(hasTimeTokens(`at ${timeToken(AT)}`)).toBe(true);
    expect(hasTimeTokens("at <t:soon>")).toBe(false);
  });

  it("draws the moment in the viewer's zone, never UTC", () => {
    expect(plain(localTimes(`Approved by Robby at ${timeToken(AT)}`, ET))).toBe(
      "Approved by Robby at 6:16 AM",
    );
    expect(
      localTimes(`Approved by Robby at ${timeToken(AT)}`, { timeZone: "Europe/London", locale: "en-GB" }),
    ).toBe("Approved by Robby at 11:16");
    expect(plain(localTimes(`Reply by ${timeToken(AT, "f")}`, ET))).toMatch(
      /^Reply by Wednesday, November 25(,| at) 6:16 AM$/,
    );
    expect(formatLocalTime(AT, "d", ET)).toBe("November 25");
  });

  it("leaves text without tokens as it is", () => {
    expect(localTimes("at 11:16 <b>", ET)).toBe("at 11:16 <b>");
    const b = blocks(context(["no times here"]));
    expect(localizeTimes(b, ET)).toBe(b);
  });

  it("replaces tokens in every string of a card", () => {
    const b = blocks(
      approvalPrompt({
        gateId: "1",
        kind: "merge",
        subject: "#151",
        decided: true,
        decision: "approved",
        detail: `Approved by Robby at ${timeToken(AT)}`,
      }),
      context([`Plan approved by Robby at ${timeToken(AT)}`]),
    );
    const out = localizeTimes(b, ET);
    expect(out).not.toBe(b);
    const ap = out.blocks[0]?.kind;
    expect(plain(ap?.case === "approvalPrompt" && ap.value.detail)).toBe("Approved by Robby at 6:16 AM");
    const cx = out.blocks[1]?.kind;
    expect(plain(cx?.case === "context" && richTextToPlain(cx.value.elements[0]))).toBe(
      "Plan approved by Robby at 6:16 AM",
    );
    expect(out.blocks[0]?.$typeName).toBe("tank.blocks.v1.Block");
  });

  it("projects tokens to plain text for previews", () => {
    expect(richTextToPlain(richText(`merged at ${timeToken(AT)}`))).not.toContain("<t:");
  });
});
