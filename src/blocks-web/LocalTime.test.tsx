// The renderer draws a card's time in the device's own zone: pin the zone to Eastern.
process.env.TZ = "America/New_York";

import { ThemeProvider } from "@mui/material/styles";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { approvalPrompt, blocks, context, richText, timeToken } from "../blocks/index.js";
import { BlocksView } from "./BlocksView.js";
import { RichTextView } from "./RichTextView.js";
import { tankTheme } from "./theme.js";

const AT = Date.UTC(2026, 10, 25, 11, 16);

afterEach(cleanup);

describe("times in the viewer's zone", () => {
  it("an approval card says 6:16 AM to a viewer in Eastern time, not 11:16 UTC", () => {
    render(
      <ThemeProvider theme={tankTheme}>
        <BlocksView
          blocks={blocks(
            approvalPrompt({
              gateId: "1",
              kind: "merge",
              subject: "#151",
              decided: true,
              decision: "approved",
              detail: `Approved by Robby at ${timeToken(AT)}`,
            }),
            context([`Plan approved by Robby at ${timeToken(AT)}`]),
          )}
        />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("approval-detail").textContent).toMatch(/^Approved by Robby at 6:16\sAM$/);
    expect(document.body.textContent).toMatch(/Plan approved by Robby at 6:16\sAM/);
    expect(document.body.textContent).not.toContain("<t:");
    expect(document.body.textContent).not.toContain("UTC");
  });

  it("an expiry with no formatter is local, not ISO", () => {
    render(
      <ThemeProvider theme={tankTheme}>
        <BlocksView
          blocks={blocks(approvalPrompt({ gateId: "1", kind: "merge", subject: "#151", expiresAt: AT }))}
        />
      </ThemeProvider>,
    );
    expect(document.body.textContent).toMatch(/expires Wednesday, November 25,? (at )?6:16\sAM/);
  });

  it("a message's text says the local time", () => {
    render(
      <ThemeProvider theme={tankTheme}>
        <RichTextView richText={richText(`#151 merged at ${timeToken(AT)}.`)} />
      </ThemeProvider>,
    );
    expect(document.body.textContent).toMatch(/#151 merged at 6:16\sAM\./);
  });
});
