import { create } from "@bufbuild/protobuf";
import { describe, expect, it } from "vitest";
import { PrincipalSchema } from "../contracts/tank/auth/v1/auth_pb.js";
import { MemberSchema, WorkspaceSchema } from "../contracts/tank/workspace/v1/workspace_pb.js";
import { TankStore } from "./store.js";

describe("members/upsert", () => {
  it("refreshes me when my own membership comes back from a profile save", () => {
    const store = new TankStore();
    const me = create(PrincipalSchema, { id: "u1", displayName: "robby" });
    store.dispatch({
      type: "bootstrap",
      workspace: create(WorkspaceSchema, { id: "w1", slug: "t", name: "T" }),
      me: create(MemberSchema, { principal: me, title: "Engineer" }),
      channels: [],
      readStates: [],
      members: [],
    });
    expect(store.getState().me?.displayName).toBe("robby");
    const other = create(MemberSchema, {
      principal: create(PrincipalSchema, { id: "u2", displayName: "kev" }),
    });
    store.dispatch({ type: "members/upsert", workspaceId: "w1", members: [other] });
    expect(store.getState().me?.displayName).toBe("robby");
    const saved = create(MemberSchema, {
      principal: create(PrincipalSchema, { id: "u1", displayName: "Robby K" }),
      title: "Founder",
      timezone: "America/New_York",
    });
    store.dispatch({ type: "members/upsert", workspaceId: "w1", members: [saved] });
    expect(store.getState().me?.displayName).toBe("Robby K");
    expect(store.getState().members.w1?.u1?.timezone).toBe("America/New_York");
  });
});
