import { create } from "@bufbuild/protobuf";
import { anyPack } from "@bufbuild/protobuf/wkt";
import { describe, expect, it } from "vitest";
import { ChannelReadStateSchema } from "../contracts/tank/channel/v1/channel_pb.js";
import {
  ChannelPreferenceUpdatedSchema,
  EnvelopeSchema,
  MemberUpdatedSchema,
  PinChangedSchema,
} from "../contracts/tank/events/v1/events_pb.js";
import { MemberSchema } from "../contracts/tank/workspace/v1/workspace_pb.js";
import { envelopeToActions, unpackEnvelope } from "./store.js";

// The daily-driver events that used to arrive only on refetch. The store owns the two whose
// state it already holds; the rest decode to a known type so a client can switch on them
// without casting.
describe("live events the store reduces itself", () => {
  it("a Tread preference changed elsewhere lands in my read state", () => {
    const rs = create(ChannelReadStateSchema, { channelId: "c1", muted: true, starred: true });
    const env = create(EnvelopeSchema, {
      workspaceId: "ws1",
      type: "channel_preference.updated",
      payload: anyPack(
        ChannelPreferenceUpdatedSchema,
        create(ChannelPreferenceUpdatedSchema, { userId: "me", readState: rs }),
      ),
    });
    expect(envelopeToActions(env, 0)).toEqual([{ type: "readStates/upsert", readStates: [rs] }]);
  });

  it("a member's profile change replaces the member row", () => {
    const m = create(MemberSchema, { userId: "u2", displayName: "Ada", timezone: "Europe/London" });
    const env = create(EnvelopeSchema, {
      workspaceId: "ws1",
      type: "member.updated",
      payload: anyPack(MemberUpdatedSchema, create(MemberUpdatedSchema, { member: m })),
    });
    expect(envelopeToActions(env, 0)).toEqual([{ type: "members/upsert", workspaceId: "ws1", members: [m] }]);
  });

  it("a pin change decodes to its own type rather than unknown", () => {
    const env = create(EnvelopeSchema, {
      type: "pin.changed",
      payload: anyPack(
        PinChangedSchema,
        create(PinChangedSchema, { messageId: "m1", channelId: "c1", pinned: true }),
      ),
    });
    const p = unpackEnvelope(env);
    expect(p?.$typeName).toBe("tank.events.v1.PinChanged");
    expect(envelopeToActions(env, 0)).toEqual([]);
  });
});
