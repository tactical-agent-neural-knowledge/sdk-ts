import { describe, expect, it } from "vitest";
import { plainPreview } from "./plainPreview.js";

describe("plainPreview", () => {
  it("drops bold, italics, strike and backticks", () => {
    expect(plainPreview("Here's the combined idea: **Product Name:** MountainGuide")).toBe(
      "Here's the combined idea: Product Name: MountainGuide",
    );
    expect(plainPreview("an *italic* and _also_ ~~gone~~ word, the `df` command")).toBe(
      "an italic and also gone word, the df command",
    );
  });

  it("keeps words that only look like Markdown", () => {
    expect(plainPreview("snake_case_name and 2 * 3 * 4 and __init__.py")).toBe(
      "snake_case_name and 2 * 3 * 4 and init.py",
    );
    expect(plainPreview("costs <$0.01 at aero.chat")).toBe("costs <$0.01 at aero.chat");
  });

  it("turns a link into its words, even one clipped before it closes", () => {
    expect(plainPreview("refer to the [Dreamscapes](https://dreamscapes.tank.chat/x) page")).toBe(
      "refer to the Dreamscapes page",
    );
    expect(plainPreview("refer to the [Dreamscapes](https://dreamscapes.tank.chat…")).toBe(
      "refer to the Dreamscapes",
    );
    expect(plainPreview("![a chart](https://x/y.png) and <https://tank.chat>")).toBe(
      "a chart and https://tank.chat",
    );
  });

  it("drops heading, quote and list markers and joins the lines", () => {
    expect(plainPreview("## Plan\n\n> quoted\n\n* Task 1: Review\n- Task 2\n3. Task 3\n- [x] done")).toBe(
      "Plan quoted Task 1: Review Task 2 Task 3 done",
    );
  });

  it("reads a table as its cells and a code block as its code", () => {
    expect(
      plainPreview("| Workspace | Calls |\n|---|---:|\n| tank-team | 97 |\n\n---\n```sh\nls -la\n```"),
    ).toBe("Workspace · Calls tank-team · 97 ls -la");
  });

  it("collapses whitespace and resolves escapes", () => {
    expect(plainPreview("  \\*not bold\\*   \n\n\t next  ")).toBe("*not bold* next");
    expect(plainPreview("")).toBe("");
  });
});
