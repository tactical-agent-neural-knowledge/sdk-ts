import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { afterEach, describe, expect, it } from "vitest";
import { StatusLine } from "./StatusLine.js";

let tree: ReactTestRenderer | undefined;
afterEach(() => {
  act(() => tree?.unmount());
  tree = undefined;
});

function words(t: ReactTestRenderer): string {
  return t.root
    .findAll((n) => typeof n.type !== "string" && n.props.numberOfLines === 1)
    .map((n) => String(n.props.children))
    .join("|");
}

describe("StatusLine (native)", () => {
  // Reduced motion is what an app's own tests run with: no loop is started, and the word is whole.
  it("shows the word beside the working mark", () => {
    act(() => {
      tree = create(<StatusLine word="Planning…" reducedMotion />);
    });
    const t = tree as ReactTestRenderer;
    expect(words(t)).toContain("Planning…");
    expect(t.root.findAll((n) => n.props.testID === "mark-doing").length).toBeGreaterThan(0);
    expect(t.root.findAll((n) => n.props.testID === "status-line").length).toBeGreaterThan(0);
  });

  it("renders nothing with no word", () => {
    act(() => {
      tree = create(<StatusLine word="" reducedMotion />);
    });
    expect((tree as ReactTestRenderer).toJSON()).toBeNull();
  });
});
