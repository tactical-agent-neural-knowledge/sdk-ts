import { ThemeProvider } from "@mui/material/styles";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { expandShortcodes } from "../client/shortcodes.js";
import type { RichText } from "../contracts/tank/richtext/v1/richtext_pb.js";
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
