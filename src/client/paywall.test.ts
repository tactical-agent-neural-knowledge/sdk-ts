import { Code, ConnectError } from "@connectrpc/connect";
import { describe, expect, it } from "vitest";
import { isPaywall, paywallMessage } from "./paywall.js";

const denied = new ConnectError(
  "The Neural Vault requires a premium subscription. Please contact support at premium@tank.chat",
  Code.FailedPrecondition,
);

describe("paywallMessage", () => {
  it("returns the sentence the api wrote, because that sentence is the UI", () => {
    expect(paywallMessage(denied)).toContain("premium@tank.chat");
    expect(isPaywall(denied)).toBe(true);
  });

  it("leaves the other preconditions alone", () => {
    // An archived Tread is also FailedPrecondition and must not open an upsell.
    const archived = new ConnectError("channel is archived", Code.FailedPrecondition);
    expect(paywallMessage(archived)).toBeUndefined();
    expect(isPaywall(archived)).toBe(false);
  });

  it("is not fooled by another code carrying the words", () => {
    const wrongCode = new ConnectError("premium subscription", Code.Internal);
    expect(isPaywall(wrongCode)).toBe(false);
  });

  it("survives things that are not errors at all", () => {
    for (const v of [undefined, null, "boom", new Error("boom")]) {
      expect(isPaywall(v)).toBe(false);
    }
  });
});
