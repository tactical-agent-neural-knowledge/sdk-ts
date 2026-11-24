import { describe, expect, it } from "vitest";
import { DeliveryMode } from "../contracts/tank/agent/v1/agent_pb.js";
import {
  DELIVERY_CHOICES,
  deliveryMode,
  hitRateLine,
  migrationProofLine,
  OVERDRIVE_COPY,
  predictedAction,
  predictedLine,
} from "./overdrive.js";

describe("overdrive", () => {
  it("offers the CI a repository has today first", () => {
    expect(DELIVERY_CHOICES.map((c) => c.mode)).toEqual([
      DeliveryMode.OWN_CI,
      DeliveryMode.TANK_RUNNERS,
      DeliveryMode.OTHER_CI,
    ]);
    expect(DELIVERY_CHOICES.every((c) => c.label && c.detail)).toBe(true);
  });

  it("reads a repository with no setting as its current CI", () => {
    expect(deliveryMode(undefined)).toBe(DeliveryMode.OWN_CI);
    expect(deliveryMode(DeliveryMode.UNSPECIFIED)).toBe(DeliveryMode.OWN_CI);
    expect(deliveryMode(DeliveryMode.OTHER_CI)).toBe(DeliveryMode.OTHER_CI);
  });

  it("says what state a predicted item is in", () => {
    expect(predictedLine({ state: "ready" })).toBe(OVERDRIVE_COPY.predicted.ready);
    expect(predictedLine({ state: "idea" })).toBe(OVERDRIVE_COPY.predicted.idea);
    expect(predictedLine({ state: "" })).toBe(OVERDRIVE_COPY.predicted.idea);
    expect(predictedAction({ state: "ready" })).toBe("Take it");
    expect(predictedAction({ state: "idea" })).toBe("Start it");
  });

  it("names how a database change was proven, and nothing when it was not", () => {
    expect(migrationProofLine({ migrationProof: "none" })).toBe("");
    expect(migrationProofLine({ migrationProof: "" })).toBe("");
    expect(migrationProofLine({ migrationProof: "clone" })).toContain("private copy");
  });

  it("gives the hit rate only once something was offered", () => {
    expect(hitRateLine(0, 0)).toBe("");
    expect(hitRateLine(9, 4)).toBe("4 of 9 taken in the last 30 days");
    expect(hitRateLine(3, 7)).toBe("3 of 3 taken in the last 30 days");
  });
});

describe("askToLiveLine", () => {
  it("shows TANK's own time first and the wait for approval beside it, as the card does", async () => {
    const { askToLiveLine, clock } = await import("./overdrive.js");
    expect(askToLiveLine(0n)).toBe("");
    expect(askToLiveLine(undefined)).toBe("");
    expect(askToLiveLine(325n)).toBe("Live in 5m 25s");
    expect(askToLiveLine(325n, 0n)).toBe("Live in 5m 25s");
    expect(askToLiveLine(6383n, 5869n)).toBe("Live in 8m 34s of TANK's time · 1h 38m waiting for approval");
    expect(clock(40)).toBe("40s");
    expect(clock(300)).toBe("5m");
    expect(clock(7200)).toBe("2h");
  });
});
