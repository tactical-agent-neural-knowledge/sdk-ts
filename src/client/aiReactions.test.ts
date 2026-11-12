import { create } from "@bufbuild/protobuf";
import { describe, expect, it } from "vitest";
import { ReactionSchema } from "../contracts/tank/ai/v1/ai_pb.js";
import { applyReaction, isCustomEmoji, QUICK_REACTIONS, reacted } from "./aiReactions.js";

const r = (emoji: string, userIds: string[], mine = false) =>
  create(ReactionSchema, { emoji, count: userIds.length, userIds, mine });

describe("applyReaction", () => {
  it("adds a new emoji last, mine, counted once", () => {
    const out = applyReaction([r("👍", ["2"])], "😂", "1", true);
    expect(out.map((x) => [x.emoji, x.count, x.mine, x.userIds])).toEqual([
      ["👍", 1, false, ["2"]],
      ["😂", 1, true, ["1"]],
    ]);
  });

  it("joins an emoji someone else used, keeping its place", () => {
    const out = applyReaction([r("👍", ["2"]), r("❤️", ["3"])], "👍", "1", true);
    expect(out[0]).toMatchObject({ emoji: "👍", count: 2, mine: true, userIds: ["2", "1"] });
    expect(out[1]?.emoji).toBe("❤️");
  });

  it("removes mine, and the emoji goes when nobody holds it", () => {
    expect(applyReaction([r("👍", ["1", "2"], true)], "👍", "1", false)[0]).toMatchObject({
      count: 1,
      mine: false,
      userIds: ["2"],
    });
    expect(applyReaction([r("👍", ["1"], true)], "👍", "1", false)).toEqual([]);
  });

  it("changes nothing when adding one already there or removing one that is not", () => {
    const start = [r("👍", ["1"], true)];
    expect(applyReaction(start, "👍", "1", true)).toEqual(start);
    expect(applyReaction(start, "😂", "1", false)).toEqual(start);
  });
});

describe("reacted / isCustomEmoji / QUICK_REACTIONS", () => {
  it("reads mine from either field", () => {
    expect(reacted([r("👍", ["1"])], "👍", "1")).toBe(true);
    expect(reacted([r("👍", [], true)], "👍", "9")).toBe(true);
    expect(reacted([r("👍", ["2"])], "👍", "1")).toBe(false);
  });
  it("knows a workspace's custom emoji", () => {
    expect(isCustomEmoji(":tank:")).toBe(true);
    expect(isCustomEmoji("👍")).toBe(false);
    expect(isCustomEmoji("::")).toBe(false);
  });
  it("offers six quick reactions", () => {
    expect(QUICK_REACTIONS).toEqual(["👍", "❤️", "😂", "😮", "😢", "🙏"]);
  });
});
