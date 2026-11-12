import { create, type MessageInitShape } from "@bufbuild/protobuf";
import { anyPack, timestampFromMs } from "@bufbuild/protobuf/wkt";
import { createRouterTransport } from "@connectrpc/connect";
import { describe, expect, it } from "vitest";
import { PrincipalKind } from "../contracts/tank/auth/v1/auth_pb.js";
import { BlockSchema, BlocksSchema } from "../contracts/tank/blocks/v1/blocks_pb.js";
import {
  ChannelReadStateSchema,
  ChannelSchema,
  ChannelService,
  ChannelView,
  type SetChannelPreferenceRequest,
} from "../contracts/tank/channel/v1/channel_pb.js";
import { EnvelopeSchema, TaskChangedSchema } from "../contracts/tank/events/v1/events_pb.js";
import { MessageSchema } from "../contracts/tank/message/v1/message_pb.js";
import {
  type CreateTaskWithChannelRequest,
  type Task,
  TaskNotifySchema,
  TaskSchema,
  TaskService,
  TaskStage,
} from "../contracts/tank/task/v1/task_pb.js";
import { createTankClient } from "./client.js";
import { envelopeToActions, TankStore } from "./store.js";
import {
  commandTasks,
  DONE_WINDOW_MS,
  effectiveView,
  isAgentInternal,
  notifyFor,
  ownNotify,
  readyToCheckCount,
  simpleConversation,
  TASK_STAGES,
  taskForThread,
  taskStageKey,
  tasksByStage,
} from "./tasks.js";

const T0 = 1_700_000_000_000;

function task(over: MessageInitShape<typeof TaskSchema> = {}): Task {
  return create(TaskSchema, {
    id: "t1",
    workspaceId: "ws1",
    channelId: "c1",
    title: "Fix the login page",
    stage: TaskStage.QUEUED,
    createdBy: "u1",
    createdAt: timestampFromMs(T0),
    updatedAt: timestampFromMs(T0),
    ...over,
  });
}

describe("task store", () => {
  it("keeps the newer copy when an event and a response cross", () => {
    const s = new TankStore();
    s.dispatch({
      type: "tasks/upsert",
      tasks: [task({ stage: TaskStage.IN_PROGRESS, updatedAt: timestampFromMs(T0 + 2000) })],
    });
    s.dispatch({
      type: "tasks/upsert",
      tasks: [task({ stage: TaskStage.QUEUED, updatedAt: timestampFromMs(T0 + 1000) })],
    });
    expect(s.getState().tasksById.t1?.stage).toBe(TaskStage.IN_PROGRESS);
    s.dispatch({
      type: "tasks/upsert",
      tasks: [task({ stage: TaskStage.READY_TO_CHECK, updatedAt: timestampFromMs(T0 + 3000) })],
    });
    expect(s.getState().tasksById.t1?.stage).toBe(TaskStage.READY_TO_CHECK);
  });

  it("applies task.changed from the gateway", () => {
    const env = create(EnvelopeSchema, {
      workspaceId: "ws1",
      type: "task.changed",
      subject: "evt.ws1.ch.c1",
      payload: anyPack(
        TaskChangedSchema,
        create(TaskChangedSchema, { task: task({ stage: TaskStage.STUCK }) }),
      ),
    });
    const s = new TankStore();
    s.applyEnvelope(env);
    expect(s.selectChannelTasks("c1").map((t) => t.stage)).toEqual([TaskStage.STUCK]);
    expect(s.selectTasks("ws1")).toHaveLength(1);
    expect(s.selectTasks("ws2")).toHaveLength(0);
    expect(envelopeToActions(env, T0)[0]?.type).toBe("tasks/upsert");
  });

  it("orders a Tread's tasks oldest first and keeps the array when nothing changed", () => {
    const s = new TankStore();
    s.dispatch({
      type: "tasks/upsert",
      tasks: [
        task({ id: "b", createdAt: timestampFromMs(T0 + 5) }),
        task({ id: "a", createdAt: timestampFromMs(T0) }),
      ],
    });
    const first = s.selectChannelTasks("c1");
    expect(first.map((t) => t.id)).toEqual(["a", "b"]);
    expect(s.selectChannelTasks("c1")).toBe(first);
  });
});

describe("task rules", () => {
  it("lists the stages in Command's order", () => {
    expect(TASK_STAGES.map(taskStageKey)).toEqual([
      "queued",
      "in_progress",
      "ready_to_check",
      "done",
      "stuck",
    ]);
  });

  it("filters Command and trims Done to 30 days", () => {
    const now = T0 + DONE_WINDOW_MS + 10_000;
    const list = [
      task({ id: "old", stage: TaskStage.DONE, checkedAt: timestampFromMs(T0) }),
      task({ id: "new", stage: TaskStage.DONE, checkedAt: timestampFromMs(now - 1000) }),
      task({ id: "mine", createdBy: "me", channelId: "c2" }),
      task({ id: "ready", stage: TaskStage.READY_TO_CHECK }),
    ];
    expect(commandTasks(list, {}, now).map((t) => t.id)).toEqual(["new", "mine", "ready"]);
    expect(commandTasks(list, { askedBy: "me" }, now).map((t) => t.id)).toEqual(["mine"]);
    expect(commandTasks(list, { channelId: "c2" }, now).map((t) => t.id)).toEqual(["mine"]);
    expect(readyToCheckCount(list)).toBe(1);
    const groups = tasksByStage(list);
    expect([...groups.keys()]).toEqual([...TASK_STAGES]);
    expect(groups.get(TaskStage.DONE)?.map((t) => t.id)).toEqual(["old", "new"]);
    expect(groups.get(TaskStage.STUCK)).toEqual([]);
  });

  it("reads the person's view, then the Tread's default, then Builder", () => {
    const simple = create(ChannelSchema, { defaultView: ChannelView.SIMPLE });
    expect(effectiveView(undefined, undefined)).toBe(ChannelView.BUILDER);
    expect(effectiveView(simple, undefined)).toBe(ChannelView.SIMPLE);
    expect(effectiveView(simple, create(ChannelReadStateSchema, { view: ChannelView.BUILDER }))).toBe(
      ChannelView.BUILDER,
    );
    expect(
      effectiveView(create(ChannelSchema), create(ChannelReadStateSchema, { view: ChannelView.SIMPLE })),
    ).toBe(ChannelView.SIMPLE);
  });

  it("folds run cards out of Simple mode and keeps what people need", () => {
    const blocks = create(BlocksSchema, { blocks: [create(BlockSchema, {})] });
    const msgs = [
      create(MessageSchema, {
        id: "person",
        authorKind: PrincipalKind.USER,
        metadata: { card_type: "status_card" },
      }),
      create(MessageSchema, {
        id: "reply",
        authorKind: PrincipalKind.AGENT,
        metadata: { run_id: "r1", card_type: "message" },
      }),
      create(MessageSchema, {
        id: "status",
        authorKind: PrincipalKind.AGENT,
        metadata: { run_id: "r1", card_type: "status_card" },
      }),
      create(MessageSchema, {
        id: "plan",
        authorKind: PrincipalKind.AGENT,
        metadata: { card_type: "plan_card" },
      }),
      create(MessageSchema, {
        id: "pr",
        authorKind: PrincipalKind.AGENT,
        metadata: { card_type: "pr_card" },
      }),
      create(MessageSchema, {
        id: "ci",
        authorKind: PrincipalKind.AGENT,
        metadata: { card_type: "ci_status_card" },
      }),
      create(MessageSchema, {
        id: "question",
        authorKind: PrincipalKind.AGENT,
        metadata: { card_type: "question_card" },
      }),
      create(MessageSchema, {
        id: "approval",
        authorKind: PrincipalKind.AGENT,
        metadata: { card_type: "approval_card" },
      }),
      create(MessageSchema, {
        id: "untyped",
        authorKind: PrincipalKind.AGENT,
        metadata: { run_id: "r1" },
        blocks,
      }),
      create(MessageSchema, { id: "webhook", authorKind: PrincipalKind.BOT, blocks }),
      create(MessageSchema, { id: "plain", authorKind: PrincipalKind.AGENT }),
    ];
    expect(simpleConversation(msgs).map((m) => m.id)).toEqual([
      "person",
      "reply",
      "question",
      "approval",
      "webhook",
      "plain",
    ]);
    expect(isAgentInternal(msgs[2] as (typeof msgs)[number])).toBe(true);
  });

  it("finds a thread's task and the people to tell once each", () => {
    const t = task({
      threadRootId: "root1",
      notify: [
        create(TaskNotifySchema, { stage: TaskStage.STUCK, userId: "bob" }),
        create(TaskNotifySchema, { stage: TaskStage.STUCK, userId: "bob", fromWorkspace: true }),
        create(TaskNotifySchema, { stage: TaskStage.DONE, userId: "amy", fromWorkspace: true }),
      ],
    });
    expect(taskForThread([t], "root1")?.id).toBe("t1");
    expect(taskForThread([t], "")).toBeUndefined();
    const stuck = notifyFor(t, TaskStage.STUCK);
    expect(stuck).toHaveLength(1);
    expect(stuck[0]?.fromWorkspace).toBe(true);
    expect(ownNotify(t).map((n) => n.userId)).toEqual(["bob"]);
  });
});

describe("task client", () => {
  function makeClient() {
    const calls: { created?: CreateTaskWithChannelRequest; pref?: SetChannelPreferenceRequest } = {};
    let failPref = false;
    const transport = createRouterTransport(({ service }) => {
      service(TaskService, {
        listTasks: (req) => ({
          tasks: [
            task({ channelId: req.channelId || "c1" }),
            task({ id: "t2", stage: TaskStage.READY_TO_CHECK }),
          ],
          hasAgent: true,
          readyToCheck: 1,
        }),
        createTaskWithChannel: (req) => {
          calls.created = req;
          return {
            task: task({ id: "t3", channelId: "c9", title: req.title }),
            channel: create(ChannelSchema, { id: "c9", workspaceId: "ws1", name: "fix-the-login-page" }),
          };
        },
        confirmTask: (req) => ({
          task: task({
            id: req.taskId,
            stage: TaskStage.DONE,
            checkedBy: "me",
            updatedAt: timestampFromMs(T0 + 9),
          }),
        }),
      });
      service(ChannelService, {
        setChannelPreference: (req) => {
          calls.pref = req;
          if (failPref) throw new Error("down");
          return {
            readState: create(ChannelReadStateSchema, { channelId: req.channelId, view: req.view ?? 0 }),
          };
        },
      });
    });
    const client = createTankClient({
      baseUrl: "http://unused",
      wsUrl: "ws://unused",
      auth: "cookie",
      transport,
    });
    return { client, calls, fail: () => (failPref = true) };
  }

  it("lists into the store and keeps what the server says", async () => {
    const { client } = makeClient();
    const res = await client.listTasks({ workspaceId: "ws1" });
    expect(res.hasAgent).toBe(true);
    expect(client.store.selectTasks("ws1").map((t) => t.id)).toEqual(["t1", "t2"]);
    await client.confirmTask("t2");
    expect(client.store.getState().tasksById.t2?.stage).toBe(TaskStage.DONE);
  });

  it("adds a task with a Tread and notify picks", async () => {
    const { client, calls } = makeClient();
    const { task: t, channel } = await client.createTaskWithChannel({
      workspaceId: "ws1",
      title: "Fix the login page",
      startNow: true,
      notify: [{ stage: TaskStage.READY_TO_CHECK, userId: "amy" }],
    });
    expect(calls.created?.startNow).toBe(true);
    expect(calls.created?.notify.map((n) => [n.stage, n.userId])).toEqual([
      [TaskStage.READY_TO_CHECK, "amy"],
    ]);
    expect(t.channelId).toBe("c9");
    expect(channel?.id).toBe("c9");
    expect(client.store.getState().channels.c9?.name).toBe("fix-the-login-page");
  });

  it("switches the view at once and rolls back on error", async () => {
    const { client, calls, fail } = makeClient();
    await client.setChannelView("c1", ChannelView.SIMPLE);
    expect(calls.pref?.view).toBe(ChannelView.SIMPLE);
    expect(client.store.getState().readStates.c1?.view).toBe(ChannelView.SIMPLE);
    fail();
    await expect(client.setChannelView("c1", ChannelView.BUILDER)).rejects.toThrow();
    expect(client.store.getState().readStates.c1?.view).toBe(ChannelView.SIMPLE);
  });
});

describe("reading a Tread keeps its view", () => {
  it("a read position update leaves the person's view and notify level alone", () => {
    const s = new TankStore();
    s.dispatch({
      type: "readStates/upsert",
      readStates: [
        create(ChannelReadStateSchema, { channelId: "c1", view: ChannelView.SIMPLE, notifyPref: 2 }),
      ],
    });
    s.dispatch({ type: "readStates/updated", channelId: "c1", lastReadSeq: 9n, userId: "" });
    const rs = s.getState().readStates.c1;
    expect(rs?.lastReadSeq).toBe(9n);
    expect(rs?.view).toBe(ChannelView.SIMPLE);
    expect(rs?.notifyPref).toBe(2);
  });
});
