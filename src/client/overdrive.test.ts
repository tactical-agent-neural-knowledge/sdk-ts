import { create } from "@bufbuild/protobuf";
import { describe, expect, it } from "vitest";
import { ChecksReportSchema, DeliveryMode } from "../contracts/tank/agent/v1/agent_pb.js";
import {
  checksCompareLine,
  checksImageLine,
  checksReportLines,
  DELIVERY_CHOICES,
  deliveryMode,
  hitRateLine,
  migrationProofLine,
  msClock,
  OVERDRIVE_COPY,
  predictedAction,
  predictedLine,
  takesBuilt,
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

describe("switchLine", () => {
  it("names the pull request that moves the jobs, either way, and nothing once the way back is done", async () => {
    const { switchLine } = await import("./overdrive.js");
    const url = "https://github.com/acme/app/pull/1";
    const on = DeliveryMode.TANK_RUNNERS;
    const own = DeliveryMode.OWN_CI;
    expect(switchLine({ mode: on, switchStatus: "opened", switchPullRequestUrl: "" })).toBe("");
    expect(switchLine({ mode: on, switchStatus: "opened", switchPullRequestUrl: url })).toBe(
      OVERDRIVE_COPY.delivery.switchOpened,
    );
    expect(switchLine({ mode: on, switchStatus: "merged", switchPullRequestUrl: url })).toBe(
      OVERDRIVE_COPY.delivery.switchMerged,
    );
    expect(switchLine({ mode: own, switchStatus: "opened", switchPullRequestUrl: url })).toBe(
      OVERDRIVE_COPY.delivery.switchBackOpened,
    );
    expect(switchLine({ mode: own, switchStatus: "merged", switchPullRequestUrl: url })).toBe("");
  });
});

describe("taking built work", () => {
  it("takes built work that no queued task owns; a task is started instead", () => {
    expect(takesBuilt({ state: "ready", sourceTaskId: "" })).toBe(true);
    expect(takesBuilt({ state: "stale", sourceTaskId: "" })).toBe(true);
    expect(takesBuilt({ state: "ready", sourceTaskId: "9" })).toBe(false);
    expect(takesBuilt({ state: "idea", sourceTaskId: "" })).toBe(false);
    expect(OVERDRIVE_COPY.spend.fee).toBe("Overdrive add-on fee");
  });
});

describe("workspace default", () => {
  it("names the default option after what it follows, and picks it while a repository follows", async () => {
    const { workspaceDefaultLabel, deliveryChoice, deliveryLabel, FOLLOWS_DEFAULT } = await import(
      "./overdrive.js"
    );
    expect(workspaceDefaultLabel(DeliveryMode.TANK_RUNNERS)).toBe("Workspace default (TANK's runners)");
    expect(workspaceDefaultLabel(DeliveryMode.UNSPECIFIED)).toBe("Workspace default (Your current CI)");
    expect(deliveryLabel(DeliveryMode.OTHER_CI)).toBe("Another CI");
    expect(deliveryChoice({ mode: DeliveryMode.OTHER_CI, followsDefault: true })).toBe(FOLLOWS_DEFAULT);
    expect(deliveryChoice({ mode: DeliveryMode.OTHER_CI, followsDefault: false })).toBe(
      DeliveryMode.OTHER_CI,
    );
  });
});

describe("checks choice", () => {
  it("is TANK unless it says the repository's own CI", async () => {
    const { checksMode, checksLabel, checksChoice, workspaceChecksLabel, FOLLOWS_DEFAULT, CHECKS_CHOICES } =
      await import("./overdrive.js");
    const { ChecksMode } = await import("../contracts/tank/agent/v1/agent_pb.js");
    expect(checksMode(undefined)).toBe(ChecksMode.TANK);
    expect(checksMode(ChecksMode.UNSPECIFIED)).toBe(ChecksMode.TANK);
    expect(checksMode(ChecksMode.OWN_CI)).toBe(ChecksMode.OWN_CI);
    expect(checksLabel(ChecksMode.OWN_CI)).toBe("Wait for the repository's own CI");
    expect(workspaceChecksLabel(undefined)).toBe("Workspace default (TANK runs them)");
    expect(checksChoice({ checksMode: ChecksMode.OWN_CI, checksFollowsDefault: true })).toBe(FOLLOWS_DEFAULT);
    expect(checksChoice({ checksMode: ChecksMode.OWN_CI, checksFollowsDefault: false })).toBe(
      ChecksMode.OWN_CI,
    );
    expect(CHECKS_CHOICES.map((c) => c.mode)).toEqual([ChecksMode.TANK, ChecksMode.OWN_CI]);
  });
});

describe("checks report", () => {
  const report = create(ChecksReportSchema, {
    runs: 12,
    passed: 11,
    p50Ms: 48_000,
    p95Ms: 125_000,
    waitP50Ms: 5_000,
    waitP95Ms: 21_000,
    compareTankMs: 48_000,
    compareOwnCiMs: 432_000,
    cacheHits: 9,
    cacheMisses: 1,
    flaky: [{ step: "go test", flaky: 2, runs: 12 }],
    image: "031879841669.dkr.ecr.us-east-1.amazonaws.com/agent-runner:sha-9e8c50e3e926",
    imageSource: "first_green",
  });
  it("words the server's numbers", () => {
    expect(checksReportLines(report)).toEqual([
      "TANK 48s · GitHub 7m 12s",
      "11 of 12 passed in the last 30 days · usually 48s, 2m 5s at the slowest 1 in 20",
      "Waited for a machine: usually 5s, up to 21s",
      "Dependency cache: 9 hits, 1 miss",
      "Flaky: go test (2 of 12 runs)",
    ]);
    expect(checksImageLine(report)).toBe("agent-runner:sha-9e8c50e3e926, kept from the first green run");
  });
  it("says nothing it does not have", () => {
    expect(checksReportLines(undefined)).toEqual([]);
    expect(checksReportLines(create(ChecksReportSchema, {}))).toEqual([]);
    expect(checksCompareLine(create(ChecksReportSchema, { compareTankMs: 1_700 }))).toBe("");
    expect(checksImageLine(undefined)).toBe("TANK's current image");
    expect(msClock(1_721)).toBe("1.7s");
    expect(msClock(0)).toBe("");
  });
});
