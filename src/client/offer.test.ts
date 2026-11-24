import { create } from "@bufbuild/protobuf";
import { describe, expect, it } from "vitest";
import { DraftSchema } from "../contracts/tank/workspace/v1/workspace_pb.js";
import { OFFER_COPY, withOfferedMention } from "./offer.js";
import { TankStore } from "./store.js";

const offer = { channelId: "c1", threadRootId: "", agentId: "a1", agentUserId: "u-agent" };

describe("the offer on a draft", () => {
  it("adds the offered agent to the mentions once, and not when declined", () => {
    expect(withOfferedMention([], offer, false)).toEqual(["u-agent"]);
    expect(withOfferedMention(["u2"], offer, false)).toEqual(["u2", "u-agent"]);
    expect(withOfferedMention(["u-agent"], offer, false)).toEqual(["u-agent"]);
    expect(withOfferedMention(["u2"], offer, true)).toEqual(["u2"]);
    expect(withOfferedMention(["u2"], undefined, false)).toEqual(["u2"]);
  });

  it("names the agent with a capital", () => {
    expect(OFFER_COPY.ready("tank")).toBe("Tank will start on this when you send");
    expect(OFFER_COPY.ready("")).toBe("Tank will start on this when you send");
    expect(OFFER_COPY.declineLabel("neural")).toBe("Send this without Neural");
  });

  it("is kept per composer from the drafts the server answers with", () => {
    const store = new TankStore();
    const draft = (over: object) =>
      create(DraftSchema, { channelId: "c1", text: "fix the login page", ...over });
    expect(store.selectOffer("c1", "")).toBeUndefined();
    store.dispatch({
      type: "preparation/seed",
      draft: draft({ offeredAgentId: "a1", offeredAgentUserId: "u-agent" }),
    });
    expect(store.selectOffer("c1", "")).toEqual(offer);
    // Another composer is untouched; the thread composer has its own.
    expect(store.selectOffer("c1", "root1")).toBeUndefined();
    // An offer and a preparation live side by side.
    store.dispatch({
      type: "preparation/seed",
      draft: draft({
        offeredAgentId: "a1",
        offeredAgentUserId: "u-agent",
        preparationId: "p1",
        preparationState: 1,
      }),
    });
    expect(store.selectOffer("c1", "")).toEqual(offer);
    expect(store.selectPreparation("c1", "")?.preparationId).toBe("p1");
    // The text stops being work: the offer goes.
    store.dispatch({ type: "preparation/seed", draft: draft({ text: "thanks" }) });
    expect(store.selectOffer("c1", "")).toBeUndefined();
  });
});
