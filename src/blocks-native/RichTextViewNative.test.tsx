import { act, create, type ReactTestInstance, type ReactTestRenderer } from "react-test-renderer";
import { afterEach, describe, expect, it } from "vitest";
import { usageReport } from "../test/richtext-markdown.js";
import { RichTextViewNative } from "./RichTextViewNative.js";

let tree: ReactTestRenderer | undefined;
afterEach(() => {
  act(() => tree?.unmount());
  tree = undefined;
});

const host = (root: ReactTestInstance, id: string) =>
  root.find((n) => typeof n.type === "string" && n.props.testID === id);
const text = (n: ReactTestInstance): string =>
  n.children.map((c) => (typeof c === "string" ? c : text(c))).join("");

describe("RichTextViewNative headings, tables and rules", () => {
  it("draws the heading, every cell of the table in a sideways scroller, and the rule", () => {
    act(() => {
      tree = create(<RichTextViewNative richText={usageReport} />);
    });
    const root = tree!.root;
    expect(text(host(root, "rt-heading"))).toBe("Customer AI usage");
    const table = host(root, "rt-table");
    expect(table.type).toBe("ScrollView");
    expect(table.props.horizontal).toBe(true);
    const body = text(table);
    for (const s of [
      "Workspace",
      "Calls",
      "Charged",
      "tank-team",
      "97",
      "$0.30",
      "Edero",
      "Total",
      "$1.70",
    ]) {
      expect(body).toContain(s);
    }
    // Header row plus three rows, each with all three columns.
    const rows = table.findAll(
      (n) => (n.type as unknown) === "View" && n.props.style?.[0]?.flexDirection === "row",
    );
    expect(rows).toHaveLength(4);
    for (const r of rows) expect(r.children).toHaveLength(3);
    expect(text(root)).toContain("3. third");
    expect(text(root)).toContain("4. fourth");
  });
});
