import { create } from "@bufbuild/protobuf";
import { describe, expect, it } from "vitest";
import { BoardObjectSchema, ReplayFrameSchema } from "../contracts/tank/board/v1/board_pb.js";
import { benchAt, frameAtFraction, liveAt, replayClock, replayEnding } from "./replay.js";

const at = (s: number) => ({ seconds: BigInt(1_700_000_000 + s), nanos: 0 });
const obj = (id: string, fill: string, z = 1, parentId = "") =>
  create(BoardObjectSchema, { id, z, parentId, style: { fill } });

describe("replay", () => {
  const frames = [
    create(ReplayFrameSchema, {
      at: at(0),
      objects: [obj("wb-step-plan", "#6200EA"), obj("wb-stage", "#fff", 2)],
    }),
    create(ReplayFrameSchema, { at: at(10), live: "Reading src/api.ts" }),
    create(ReplayFrameSchema, {
      at: at(30),
      objects: [obj("wb-step-plan", "#00E676"), obj("in-stage", "#000", 3, "wb-stage")],
    }),
    create(ReplayFrameSchema, { at: at(60), deleteIds: ["wb-stage"], live: "Running the tests" }),
    create(ReplayFrameSchema, { at: at(245), state: "done" }),
  ];

  it("folds the bench up to a moment, a later write replacing an earlier one", () => {
    expect(benchAt(frames, 0).map((o) => o.style?.fill)).toEqual(["#6200EA", "#fff"]);
    const third = benchAt(frames, 2);
    expect(third.map((o) => o.id)).toEqual(["wb-step-plan", "wb-stage", "in-stage"]);
    expect(third[0]?.style?.fill).toBe("#00E676");
  });

  it("takes a frame's contents off with it", () => {
    expect(benchAt(frames, 3).map((o) => o.id)).toEqual(["wb-step-plan"]);
  });

  it("keeps the last live line said by then", () => {
    expect(liveAt(frames, 0)).toBe("");
    expect(liveAt(frames, 2)).toBe("Reading src/api.ts");
    expect(liveAt(frames, 4)).toBe("Running the tests");
  });

  it("scrubs on the run's own clock", () => {
    expect(frameAtFraction(frames, 0)).toBe(0);
    expect(frameAtFraction(frames, 0.2)).toBe(2);
    expect(frameAtFraction(frames, 0.25)).toBe(3);
    expect(frameAtFraction(frames, 1)).toBe(4);
    expect(frameAtFraction([], 0.5)).toBe(-1);
    expect(replayClock(frames, 4)).toBe("4:05");
  });

  it("says how it ended in words", () => {
    expect(replayEnding({ state: "done", endedAt: at(1) })).toBe("Finished");
    expect(replayEnding({ state: "failed", endedAt: at(1) })).toBe("Did not finish");
    expect(replayEnding({ state: "running", endedAt: undefined })).toBe("Still working");
  });
});
