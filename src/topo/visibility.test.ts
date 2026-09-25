import { create } from "@bufbuild/protobuf";
import { describe, expect, it } from "vitest";
import { MarkType } from "../contracts/tank/topo/v1/topo_pb.js";
import { TopoPreferencesSchema } from "../contracts/tank/workspace/v1/workspace_pb.js";
import {
  DEFAULT_VISIBLE_MARKS,
  isMarkVisible,
  markLabel,
  TOGGLEABLE_MARKS,
  visibleMarkTypes,
} from "./visibility.js";

describe("Topo visibility", () => {
  it("defaults to at most four families, which is R5's calm cap", () => {
    expect(DEFAULT_VISIBLE_MARKS.length).toBeLessThanOrEqual(4);
  });

  it("leaves the two high-volume families off by default", () => {
    // Your own messages and artifacts are the ones that would mark most of a busy Tread.
    expect(DEFAULT_VISIBLE_MARKS).not.toContain(MarkType.OWN_MESSAGE);
    expect(DEFAULT_VISIBLE_MARKS).not.toContain(MarkType.ARTIFACT);
  });

  it("uses the defaults when nobody has chosen", () => {
    expect(visibleMarkTypes(undefined)).toEqual(new Set(DEFAULT_VISIBLE_MARKS));
    const untouched = create(TopoPreferencesSchema, { configured: false, visible: [] });
    expect(visibleMarkTypes(untouched)).toEqual(new Set(DEFAULT_VISIBLE_MARKS));
  });

  it("respects turning everything off, which is why configured exists", () => {
    const cleared = create(TopoPreferencesSchema, { configured: true, visible: [] });
    expect(visibleMarkTypes(cleared).size).toBe(0);
    expect(isMarkVisible(MarkType.MENTION, cleared)).toBe(false);
  });

  it("always shows search hits, whatever the toggles say", () => {
    // A hit the viewer just asked for, hidden by a preference, reads as broken search.
    const cleared = create(TopoPreferencesSchema, { configured: true, visible: [] });
    expect(isMarkVisible(MarkType.SEARCH_HIT, cleared)).toBe(true);
  });

  it("honours an explicit choice", () => {
    const chosen = create(TopoPreferencesSchema, {
      configured: true,
      visible: [MarkType.ARTIFACT],
    });
    expect(isMarkVisible(MarkType.ARTIFACT, chosen)).toBe(true);
    expect(isMarkVisible(MarkType.MENTION, chosen)).toBe(false);
  });

  it("labels every toggleable family, so the legend has no blanks", () => {
    for (const t of TOGGLEABLE_MARKS) {
      expect(markLabel(t)).not.toBe("Marks");
      expect(markLabel(t).length).toBeGreaterThan(0);
    }
  });
});
