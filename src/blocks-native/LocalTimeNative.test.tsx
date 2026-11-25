// The renderer draws a card's time in the device's own zone: pin the zone to Eastern.
process.env.TZ = "America/New_York";

import { act, create, type ReactTestInstance, type ReactTestRenderer } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import { approvalPrompt, blocks, timeToken } from "../blocks/index.js";
import { BlocksViewNative } from "./BlocksViewNative.js";

const AT = Date.UTC(2026, 10, 25, 11, 16);
const textOf = (inst: ReactTestInstance): string =>
  inst.children.map((c) => (typeof c === "string" ? c : textOf(c))).join("");

describe("times in the viewer's zone (native)", () => {
  it("an approval card says 6:16 AM to a viewer in Eastern time, not 11:16 UTC", () => {
    let tree: ReactTestRenderer | undefined;
    act(() => {
      tree = create(
        <BlocksViewNative
          blocks={blocks(
            approvalPrompt({
              gateId: "1",
              kind: "merge",
              subject: "#151",
              decided: true,
              decision: "approved",
              detail: `Approved by Robby at ${timeToken(AT)}`,
            }),
          )}
        />,
      );
    });
    const detail = tree!.root.find((n) => typeof n.type === "string" && n.props.testID === "approval-detail");
    expect(textOf(detail)).toMatch(/^Approved by Robby at 6:16\sAM$/);
  });
});
