import { create } from "@bufbuild/protobuf";
import { anyPack } from "@bufbuild/protobuf/wkt";
import { describe, expect, it } from "vitest";
import { PrincipalSchema } from "../contracts/tank/auth/v1/auth_pb.js";
import { ChannelSchema, ChannelType } from "../contracts/tank/channel/v1/channel_pb.js";
import { EnvelopeSchema, ThreadLiveStreamUpdatedSchema } from "../contracts/tank/events/v1/events_pb.js";
import {
  MemberSchema,
  ThreadLiveStreamSchema,
  WorkspaceSchema,
} from "../contracts/tank/workspace/v1/workspace_pb.js";
import { envelopeToActions, TankStore } from "./store.js";

const setting = (threadRootId: string, enabled: boolean) =>
  create(ThreadLiveStreamSchema, { channelId: "general", threadRootId, enabled });

function bootstrapped(streams?: ReturnType<typeof setting>[]): TankStore {
  const store = new TankStore();
  store.dispatch({
    type: "bootstrap",
    workspace: create(WorkspaceSchema, { id: "ws1", slug: "tank", name: "TANK" }),
    me: create(MemberSchema, { principal: create(PrincipalSchema, { id: "me", kind: 1 }) }),
    channels: [
      create(ChannelSchema, { id: "general", workspaceId: "ws1", type: ChannelType.PUBLIC, name: "general" }),
    ],
    readStates: [],
    members: [],
    unreadNotificationCount: 0,
    threadLiveStreams: streams,
  });
  return store;
}

describe("live agent output is a per-thread setting", () => {
  it("thread_live_stream.updated from another device becomes a set action", () => {
    const env = create(EnvelopeSchema, {
      workspaceId: "ws1",
      type: "thread_live_stream.updated",
      payload: anyPack(
        ThreadLiveStreamUpdatedSchema,
        create(ThreadLiveStreamUpdatedSchema, { userId: "me", setting: setting("root1", true) }),
      ),
    });
    expect(envelopeToActions(env, 0)).toEqual([
      { type: "threadLiveStream/set", workspaceId: "ws1", threadRootId: "root1", enabled: true },
    ]);
  });

  it("is off until turned on, and the toggle is per thread", () => {
    const store = bootstrapped();
    expect(store.selectThreadLiveStream("root1")).toBe(false);
    store.dispatch({
      type: "threadLiveStream/set",
      workspaceId: "ws1",
      threadRootId: "root1",
      enabled: true,
    });
    expect(store.selectThreadLiveStream("root1")).toBe(true);
    expect(store.selectThreadLiveStream("root2")).toBe(false);
    store.dispatch({
      type: "threadLiveStream/set",
      workspaceId: "ws1",
      threadRootId: "root1",
      enabled: false,
    });
    expect(store.selectThreadLiveStream("root1")).toBe(false);
  });

  it("bootstrap replaces this workspace's settings and keeps other workspaces'", () => {
    const store = bootstrapped([setting("a", true), setting("b", false)]);
    expect(store.selectThreadLiveStream("a")).toBe(true);
    expect(store.selectThreadLiveStream("b")).toBe(false);
    store.dispatch({
      type: "threadLiveStream/set",
      workspaceId: "ws2",
      threadRootId: "other",
      enabled: true,
    });
    store.dispatch({
      type: "bootstrap",
      workspace: create(WorkspaceSchema, { id: "ws1", slug: "tank", name: "TANK" }),
      me: create(MemberSchema, { principal: create(PrincipalSchema, { id: "me", kind: 1 }) }),
      channels: [],
      readStates: [],
      members: [],
      unreadNotificationCount: 0,
      threadLiveStreams: [setting("c", true)],
    });
    expect(store.selectThreadLiveStream("a")).toBe(false);
    expect(store.selectThreadLiveStream("c")).toBe(true);
    expect(store.selectThreadLiveStream("other")).toBe(true);
  });
});
