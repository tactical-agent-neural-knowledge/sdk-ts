import { ThemeProvider } from "@mui/material/styles";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { expandShortcodes } from "../client/shortcodes.js";
import type { RichText } from "../contracts/tank/richtext/v1/richtext_pb.js";
import { usageReport } from "../test/richtext-markdown.js";
import { RichTextView } from "./RichTextView.js";
import { tankTheme } from "./theme.js";

afterEach(cleanup);

const message: RichText = {
  $typeName: "tank.richtext.v1.RichText",
  blocks: [
    {
      $typeName: "tank.richtext.v1.RichTextBlock",
      kind: {
        case: "section",
        value: {
          $typeName: "tank.richtext.v1.RichTextSection",
          elements: [
            {
              $typeName: "tank.richtext.v1.RichTextElement",
              kind: {
                case: "text",
                value: {
                  $typeName: "tank.richtext.v1.TextElement",
                  text: "ship it :tank:",
                  style: undefined,
                },
              },
            },
          ],
        },
      },
    },
  ],
};

describe("RichTextView emoji", () => {
  it("draws a custom emoji through renderEmoji once its shortcode is expanded", () => {
    render(
      <ThemeProvider theme={tankTheme}>
        <RichTextView
          richText={expandShortcodes(message, (n) => n === "tank")}
          renderEmoji={(e) =>
            e.name === "tank" ? <img alt=":tank:" data-testid="custom-tank" /> : undefined
          }
        />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("custom-tank")).toBeTruthy();
    expect(screen.queryByText(":tank:")).toBeNull();
  });

  it("falls back to the shortcode text when the app has no image for it", () => {
    render(
      <ThemeProvider theme={tankTheme}>
        <RichTextView
          richText={expandShortcodes(message, (n) => n === "tank")}
          renderEmoji={() => undefined}
        />
      </ThemeProvider>,
    );
    expect(screen.getByText(":tank:")).toBeTruthy();
  });
});

// Robby, 2026-10-26: @everyone is every person in the Tread, @tread is the people and the agents.
describe("RichTextView Tread-wide mentions", () => {
  it("writes each range as the word people type", () => {
    const words = [1, 2, 3].map((range) => {
      const rt: RichText = {
        $typeName: "tank.richtext.v1.RichText",
        blocks: [
          {
            $typeName: "tank.richtext.v1.RichTextBlock",
            kind: {
              case: "section",
              value: {
                $typeName: "tank.richtext.v1.RichTextSection",
                elements: [
                  {
                    $typeName: "tank.richtext.v1.RichTextElement",
                    kind: {
                      case: "broadcast",
                      value: { $typeName: "tank.richtext.v1.BroadcastMention", range },
                    },
                  },
                ],
              },
            },
          },
        ],
      };
      const { container, unmount } = render(
        <ThemeProvider theme={tankTheme}>
          <RichTextView richText={rt} />
        </ThemeProvider>,
      );
      const text = container.textContent;
      unmount();
      return text;
    });
    expect(words).toEqual(["@here", "@everyone", "@tread"]);
  });
});

describe("RichTextView headings, tables and rules", () => {
  it("draws a heading, a table with its header and cells, and a rule", () => {
    const { container } = render(
      <ThemeProvider theme={tankTheme}>
        <RichTextView richText={usageReport} />
      </ThemeProvider>,
    );
    const h = screen.getByTestId("rt-heading");
    expect(h.tagName).toBe("H2");
    expect(h.textContent).toBe("Customer AI usage");
    const table = screen.getByTestId("rt-table").querySelector("table");
    expect(table).toBeTruthy();
    const heads = [...(table?.querySelectorAll("th") ?? [])].map((th) => th.textContent);
    expect(heads).toEqual(["Workspace", "Calls", "Charged"]);
    const rows = [...(table?.querySelectorAll("tbody tr") ?? [])];
    expect(rows).toHaveLength(3);
    // A short row still has every column, so the grid never shifts.
    expect(rows[1]?.querySelectorAll("td")).toHaveLength(3);
    expect(rows[2]?.querySelector("strong")?.textContent).toBe("Total");
    expect(rows[0]?.querySelectorAll("td")[1]?.className).toMatch(/alignRight/);
    expect(container.querySelector("hr")).toBeTruthy();
    expect(container.querySelector("ol")?.getAttribute("start")).toBe("3");
    expect(container.querySelector("code")?.textContent).toBe("tank-neural");
  });

  it("scrolls a wide table inside its own box rather than the page", () => {
    render(
      <ThemeProvider theme={tankTheme}>
        <RichTextView richText={usageReport} />
      </ThemeProvider>,
    );
    const box = screen.getByTestId("rt-table");
    const css = getComputedStyle(box);
    expect(css.overflowX).toBe("auto");
    expect(css.maxWidth).toBe("100%");
  });
});
