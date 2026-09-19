import { create } from "@bufbuild/protobuf";
import { anyPack, timestampFromMs } from "@bufbuild/protobuf/wkt";
import { describe, expect, it } from "vitest";
import { type Run, RunSchema, RunState } from "../contracts/tank/agent/v1/agent_pb.js";
import { PrincipalSchema } from "../contracts/tank/auth/v1/auth_pb.js";
import { ChannelSchema, ChannelType } from "../contracts/tank/channel/v1/channel_pb.js";
import {
  AgentRunUpdatedSchema,
  AgentStatusSchema,
  EnvelopeSchema,
  FileReadySchema,
  NotificationCreatedSchema,
  NotificationsReadSchema,
} from "../contracts/tank/events/v1/events_pb.js";
import { FileSchema } from "../contracts/tank/files/v1/files_pb.js";
import { MessageSchema } from "../contracts/tank/message/v1/message_pb.js";
import { type Notification, NotificationSchema } from "../contracts/tank/notification/v1/notification_pb.js";
import { MemberSchema, WorkspaceSchema } from "../contracts/tank/workspace/v1/workspace_pb.js";
import { AGENT_STATUS_TTL_MS, type EventPayload, TankStore, unpackEnvelope } from "./store.js";

const T0 = 1_700_000_000_000;
const notif = (
  id: string,
  createdAt: number,
  over: Partial<Omit<Notification, "$typeName" | "$unknown">> = {},
) =>
  create(NotificationSchema, {
    id,
    workspaceId: "ws1",
    userId: "me",
    kind: "mention",
    channelId: "general",
    createdAt: timestampFromMs(createdAt),
    ...over,
  });
const run = (id: string, over: Partial<Omit<Run, "$typeName" | "$unknown">> = {}) =>
  create(RunSchema, {
    id,
    workspaceId: "ws1",
    channelId: "general",
    threadRootId: "root1",
    state: RunState.PLANNING,
    ...over,
  });

function bootstrapped(unreadNotificationCount = 4): TankStore {
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
    unreadNotificationCount,
  });
  return store;
}

describe("notifications", () => {
  it("bootstrap seeds the unread count and upsert orders newest first, deduped", () => {
    const store = bootstrapped();
    expect(store.getState().unreadNotificationCount.ws1).toBe(4);
    store.dispatch({
      type: "notifications/upsert",
      workspaceId: "ws1",
      notifications: [notif("n1", T0 + 1000), notif("n3", T0 + 3000)],
      unreadCount: 2,
    });
    store.dispatch({
      type: "notifications/upsert",
      workspaceId: "ws1",
      notifications: [notif("n2", T0 + 2000), notif("n1", T0 + 1000)],
    });
    expect(store.getState().notificationIds.ws1).toEqual(["n3", "n2", "n1"]);
    expect(store.getState().unreadNotificationCount.ws1).toBe(2);
    const first = store.selectNotifications("ws1");
    expect(first.map((n) => n.id)).toEqual(["n3", "n2", "n1"]);
    expect(store.selectNotifications("ws1")).toBe(first);
  });

  it("created bumps the count once per id and prepends; read flips rows and drops the count", () => {
    const store = bootstrapped(1);
    store.dispatch({ type: "notifications/upsert", workspaceId: "ws1", notifications: [notif("n1", T0)] });
    const env = create(EnvelopeSchema, {
      workspaceId: "ws1",
      occurredAt: timestampFromMs(T0 + 5000),
      payload: anyPack(
        NotificationCreatedSchema,
        create(NotificationCreatedSchema, {
          notificationId: "n9",
          kind: "dm",
          channelId: "dm-1",
          actorId: "u2",
        }),
      ),
    });
    store.applyEnvelope(env, T0 + 5000);
    store.applyEnvelope(env, T0 + 5000);
    const s = store.getState();
    expect(s.unreadNotificationCount.ws1).toBe(2);
    expect(s.notificationIds.ws1).toEqual(["n9", "n1"]);
    expect(s.notifications.n9?.userId).toBe("me");
    expect(s.notifications.n9?.kind).toBe("dm");
    expect(store.selectNotifications("ws1", true).map((n) => n.id)).toEqual(["n9", "n1"]);

    // read one loaded id + one unknown id: both count against the badge
    store.dispatch({
      type: "notifications/read",
      workspaceId: "ws1",
      notificationIds: ["n9", "zzz"],
      readAt: timestampFromMs(T0 + 6000),
    });
    expect(store.getState().unreadNotificationCount.ws1).toBe(0);
    expect(store.getState().notifications.n9?.readAt).toBeDefined();
    expect(store.selectNotifications("ws1", true).map((n) => n.id)).toEqual(["n1"]);
    expect(store.selectNotifications("ws1").map((n) => n.id)).toEqual(["n9", "n1"]);

    // NotificationsRead with no ids = everything read, badge to zero
    store.dispatch({ type: "unreadNotificationCount/set", workspaceId: "ws1", count: 7 });
    store.applyEnvelope(
      create(EnvelopeSchema, {
        workspaceId: "ws1",
        payload: anyPack(NotificationsReadSchema, create(NotificationsReadSchema, { notificationIds: [] })),
      }),
      T0 + 7000,
    );
    expect(store.getState().unreadNotificationCount.ws1).toBe(0);
    expect(store.selectNotifications("ws1", true)).toEqual([]);
  });

  it("restore puts rows and the count back", () => {
    const store = bootstrapped(2);
    const before = [notif("n1", T0), notif("n2", T0 + 1)];
    store.dispatch({ type: "notifications/upsert", workspaceId: "ws1", notifications: before });
    store.dispatch({
      type: "notifications/read",
      workspaceId: "ws1",
      notificationIds: [],
      readAt: timestampFromMs(T0 + 9),
    });
    expect(store.getState().unreadNotificationCount.ws1).toBe(0);
    store.dispatch({
      type: "notifications/restore",
      workspaceId: "ws1",
      notifications: before,
      unreadCount: 2,
    });
    expect(store.getState().unreadNotificationCount.ws1).toBe(2);
    expect(store.selectNotifications("ws1", true).length).toBe(2);
  });

  it("paging state merges per (workspace, mode)", () => {
    const store = bootstrapped();
    store.dispatch({
      type: "notificationPaging/set",
      workspaceId: "ws1",
      mode: "unread",
      paging: { loading: true },
    });
    store.dispatch({
      type: "notificationPaging/set",
      workspaceId: "ws1",
      mode: "unread",
      paging: { loading: false, loaded: true, cursor: "c1", hasMore: true },
    });
    expect(store.getState().notificationPaging["ws1:unread"]).toEqual({
      loading: false,
      loaded: true,
      cursor: "c1",
      hasMore: true,
    });
    expect(store.getState().notificationPaging["ws1:all"]).toBeUndefined();
  });
});

describe("agent runs", () => {
  it("runsById keeps every run; runsByThread keeps the newest per thread but a run's own update always wins", () => {
    const store = bootstrapped();
    store.dispatch({
      type: "runs/upsert",
      runs: [
        run("r1", { startedAt: timestampFromMs(T0) }),
        run("r2", { startedAt: timestampFromMs(T0 + 10) }),
      ],
    });
    expect(store.getState().runsByThread.root1?.id).toBe("r2");
    // older run reported later does not replace the newer one…
    store.dispatch({
      type: "runs/upsert",
      runs: [run("r1", { startedAt: timestampFromMs(T0), state: RunState.DONE })],
    });
    expect(store.getState().runsByThread.root1?.id).toBe("r2");
    expect(store.getState().runsById.r1?.state).toBe(RunState.DONE);
    // …but the newer run's own update does
    store.applyEnvelope(
      create(EnvelopeSchema, {
        workspaceId: "ws1",
        payload: anyPack(
          AgentRunUpdatedSchema,
          create(AgentRunUpdatedSchema, {
            run: run("r2", { startedAt: timestampFromMs(T0 + 10), state: RunState.AWAITING_PLAN_APPROVAL }),
          }),
        ),
      }),
      T0,
    );
    expect(store.getState().runsByThread.root1?.state).toBe(RunState.AWAITING_PLAN_APPROVAL);
    const list = store.selectRuns("ws1");
    expect(list.map((r) => r.id)).toEqual(["r2", "r1"]);
    expect(store.selectRuns("ws1")).toBe(list);
    expect(store.selectRuns("other")).toEqual([]);
  });

  it("agent_status frames live in agentStatusByThread for 30 s and empty status clears them", () => {
    const store = bootstrapped();
    const frame = create(AgentStatusSchema, {
      channelId: "general",
      threadRootId: "root1",
      runId: "r1",
      status: "running tests",
    });
    store.dispatch({ type: "agentStatus", status: frame, now: T0 });
    expect(store.selectAgentStatus("root1")?.status).toBe("running tests");
    expect(store.getState().agentStatus.root1).toBe(frame);
    expect(store.selectAgentStatuses("general")).toEqual([frame]);
    store.dispatch({ type: "agentStatus/expire", now: T0 + AGENT_STATUS_TTL_MS - 1 });
    expect(store.selectAgentStatus("root1")).toBe(frame);
    store.dispatch({ type: "agentStatus/expire", now: T0 + AGENT_STATUS_TTL_MS });
    expect(store.selectAgentStatus("root1")).toBeUndefined();
    expect(store.getState().agentStatus.root1).toBeUndefined();
    expect(store.selectAgentStatuses("general")).toEqual([]);

    store.dispatch({ type: "agentStatus", status: frame, now: T0 });
    store.dispatch({ type: "agentStatus", status: { ...frame, status: "" }, now: T0 });
    expect(store.selectAgentStatus("root1")).toBeUndefined();
  });
});

describe("files", () => {
  it("file.ready upserts filesById and selectMessageFiles follows a message's file_ids", () => {
    const store = bootstrapped();
    const f1 = create(FileSchema, {
      id: "f1",
      workspaceId: "ws1",
      name: "a.png",
      mime: "image/png",
      size: 10n,
    });
    store.applyEnvelope(
      create(EnvelopeSchema, {
        workspaceId: "ws1",
        payload: anyPack(FileReadySchema, create(FileReadySchema, { file: f1 })),
      }),
      T0,
    );
    expect(store.getState().filesById.f1).toEqual(f1);
    store.dispatch({
      type: "messages/upsert",
      messages: [
        create(MessageSchema, {
          id: "m1",
          workspaceId: "ws1",
          channelId: "general",
          channelSeq: 1n,
          fileIds: ["f1", "f2"],
        }),
      ],
    });
    const files = store.selectMessageFiles("m1");
    expect(files).toEqual([f1]);
    expect(store.selectMessageFiles("m1")).toBe(files);
    store.dispatch({ type: "files/upsert", files: [create(FileSchema, { id: "f2", name: "b" })] });
    expect(store.selectMessageFiles("m1").map((f) => f.id)).toEqual(["f1", "f2"]);
  });
});

describe("EventPayload", () => {
  it("decodes every vendored event type and falls back to an `unknown` payload for future types", () => {
    const known = unpackEnvelope(
      create(EnvelopeSchema, {
        payload: anyPack(
          NotificationsReadSchema,
          create(NotificationsReadSchema, { notificationIds: ["n1"] }),
        ),
      }),
    );
    expect(known?.$typeName).toBe("tank.events.v1.NotificationsRead");
    const future = unpackEnvelope(
      create(EnvelopeSchema, {
        payload: {
          $typeName: "google.protobuf.Any",
          typeUrl: "type.googleapis.com/tank.events.v99.NotYetDefined",
          value: new Uint8Array([8, 1]),
        },
      }),
    );
    expect(future).toEqual({
      $typeName: "unknown",
      typeUrl: "type.googleapis.com/tank.events.v99.NotYetDefined",
      value: new Uint8Array([8, 1]),
    });
    expect(unpackEnvelope(create(EnvelopeSchema, {}))).toBeUndefined();

    // A switch narrows each known case and can be exhaustive over the union.
    const describe = (p: EventPayload): string => {
      switch (p.$typeName) {
        case "tank.events.v1.NotificationsRead":
          return `read ${p.notificationIds.length}`;
        case "tank.events.v1.AgentRunUpdated":
          return `run ${p.run?.id ?? "?"}`;
        case "unknown":
          return `unknown ${p.typeUrl}`;
        default:
          return p.$typeName;
      }
    };
    expect(describe(known!)).toBe("read 1");
    expect(describe(future!)).toBe("unknown type.googleapis.com/tank.events.v99.NotYetDefined");
  });
});
