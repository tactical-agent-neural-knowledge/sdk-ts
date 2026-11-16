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
  type CreateTaskRequest,
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
  type DoneRange,
  doneAt,
  doneRangeBounds,
  effectiveView,
  filterDone,
  isAgentInternal,
  isAllDone,
  localDateKey,
  notifyFor,
  ownNotify,
  readyToCheckCount,
  SEND_NOTE_MAX,
  searchTasks,
  simpleConversation,
  sortTasks,
  TASK_STAGES,
  taskForThread,
  taskSendCandidates,
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
    const calls: {
      created?: CreateTaskWithChannelRequest;
      createdIn?: CreateTaskRequest;
      pref?: SetChannelPreferenceRequest;
    } = {};
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
        createTask: (req) => {
          calls.createdIn = req;
          return {
            task: task({ id: "t4", channelId: req.channelId, title: req.title, fileIds: req.fileIds }),
          };
        },
        createTaskWithChannel: (req) => {
          calls.created = req;
          return {
            task: task({ id: "t3", channelId: "c9", title: req.title, fileIds: req.fileIds }),
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

  it("sends the files a task is added with, in a Tread and in a new one", async () => {
    const { client, calls } = makeClient();
    const inTread = await client.createTask({
      workspaceId: "ws1",
      channelId: "c1",
      title: "Look",
      fileIds: ["f1", "f2"],
    });
    expect(calls.createdIn?.fileIds).toEqual(["f1", "f2"]);
    expect(inTread.fileIds).toEqual(["f1", "f2"]);
    const { task: t } = await client.createTaskWithChannel({
      workspaceId: "ws1",
      title: "Look",
      fileIds: ["f3"],
    });
    expect(calls.created?.fileIds).toEqual(["f3"]);
    expect(t.fileIds).toEqual(["f3"]);
    await client.createTask({ workspaceId: "ws1", channelId: "c1", title: "No files" });
    expect(calls.createdIn?.fileIds).toEqual([]);
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

describe("Send to and the task link", () => {
  it("offers only people in the Tread, never the caller, each once", () => {
    const person = (kind: PrincipalKind, gone = false) => ({
      principal: { kind } as never,
      deactivatedAt: gone ? ({ seconds: 1n, nanos: 0 } as never) : undefined,
    });
    const members = {
      me: person(PrincipalKind.USER),
      amy: person(PrincipalKind.USER),
      bob: person(PrincipalKind.USER, true),
      tank: person(PrincipalKind.AGENT),
      hook: person(PrincipalKind.BOT),
      cat: person(PrincipalKind.USER),
    };
    expect(
      taskSendCandidates(["me", "amy", "bob", "tank", "hook", "amy", "cat", "stranger"], members, "me"),
    ).toEqual(["amy", "cat"]);
    expect(SEND_NOTE_MAX).toBe(500);
  });

  it("sends the ids and the trimmed note, and returns who was told", async () => {
    const seen: { taskId: string; userIds: string[]; note: string }[] = [];
    const transport = createRouterTransport(({ service }) => {
      service(TaskService, {
        sendTask: (req) => {
          seen.push({ taskId: req.taskId, userIds: [...req.userIds], note: req.note });
          return { sentUserIds: req.userIds };
        },
      });
    });
    const client = createTankClient({
      baseUrl: "http://unused",
      wsUrl: "ws://unused",
      auth: "cookie",
      transport,
    });
    expect(await client.sendTask("t1", ["amy", "cat"], "  please check  ")).toEqual(["amy", "cat"]);
    expect(seen).toEqual([{ taskId: "t1", userIds: ["amy", "cat"], note: "please check" }]);
  });

  it("carries the server's link on a task", () => {
    const t = create(TaskSchema, { id: "t1", link: "https://app.tank.chat/w/acme/c/c1?task=t1" });
    expect(t.link).toBe("https://app.tank.chat/w/acme/c/c1?task=t1");
  });
});

describe("done range", () => {
  // Wednesday 18 November 2026, noon, local time.
  const now = new Date(2026, 10, 18, 12).getTime();
  const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h).getTime();
  const done = (id: string, ms: number) =>
    task({ id, stage: TaskStage.DONE, checkedAt: timestampFromMs(ms) });
  const ids = (list: Task[]) => list.map((t) => t.id);

  const list = [
    done("today", at(2026, 11, 18, 1)),
    done("yesterday", at(2026, 11, 17, 23)),
    done("monday", at(2026, 11, 16, 0)),
    done("sunday", at(2026, 11, 15, 23)),
    done("nov1", at(2026, 11, 1, 0)),
    done("oct31", at(2026, 10, 31, 23)),
    done("lastyear", at(2025, 12, 31, 12)),
    task({ id: "open", stage: TaskStage.IN_PROGRESS }),
  ];
  const pick = (range: DoneRange | undefined) =>
    ids(filterDone(list, range, now)).filter((i) => i !== "open");

  it("keeps everything for All, no range or empty days", () => {
    expect(filterDone(list, undefined, now)).toHaveLength(list.length);
    expect(filterDone(list, { kind: "all" }, now)).toHaveLength(list.length);
    expect(filterDone(list, { kind: "custom" }, now)).toHaveLength(list.length);
    expect(filterDone(list, { kind: "custom", from: "nope" }, now)).toHaveLength(list.length);
    expect(isAllDone({ kind: "custom", from: "" })).toBe(true);
    expect(isAllDone({ kind: "today" })).toBe(false);
  });

  it("cuts each preset at local midnight", () => {
    expect(pick({ kind: "today" })).toEqual(["today"]);
    expect(pick({ kind: "yesterday" })).toEqual(["yesterday"]);
    expect(pick({ kind: "week" })).toEqual(["today", "yesterday", "monday"]);
    expect(pick({ kind: "month" })).toEqual(["today", "yesterday", "monday", "sunday", "nov1"]);
  });

  it("never drops a task that is not Done", () => {
    expect(ids(filterDone(list, { kind: "today" }, now))).toContain("open");
  });

  it("starts the week on Monday, also when today is Sunday or Monday", () => {
    const sunday = at(2026, 11, 22);
    expect(doneRangeBounds({ kind: "week" }, sunday)).toEqual({
      start: at(2026, 11, 16, 0),
      end: at(2026, 11, 23, 0),
    });
    const monday = at(2026, 11, 16);
    expect(doneRangeBounds({ kind: "week" }, monday)?.start).toBe(at(2026, 11, 16, 0));
  });

  it("crosses a month and a year boundary", () => {
    expect(doneRangeBounds({ kind: "yesterday" }, at(2026, 1, 1))).toEqual({
      start: at(2025, 12, 31, 0),
      end: at(2026, 1, 1, 0),
    });
    expect(doneRangeBounds({ kind: "month" }, at(2026, 12, 31))).toEqual({
      start: at(2026, 12, 1, 0),
      end: at(2027, 1, 1, 0),
    });
    expect(doneRangeBounds({ kind: "week" }, at(2026, 1, 1))?.start).toBe(at(2025, 12, 29, 0));
  });

  it("takes one picked date as that single day, and two as an inclusive range", () => {
    expect(pick({ kind: "custom", from: "2026-11-17" })).toEqual(["yesterday"]);
    expect(pick({ kind: "custom", to: "2026-11-17" })).toEqual(["yesterday"]);
    expect(pick({ kind: "custom", from: "2026-11-15", to: "2026-11-16" })).toEqual(["monday", "sunday"]);
  });

  it("puts a reversed range the right way round", () => {
    expect(pick({ kind: "custom", from: "2026-11-16", to: "2026-11-15" })).toEqual(["monday", "sunday"]);
  });

  it("reaches past the 30-day window and refuses impossible dates", () => {
    expect(pick({ kind: "custom", from: "2025-12-31" })).toEqual(["lastyear"]);
    expect(doneRangeBounds({ kind: "custom", from: "2026-02-31" }, now)).toBeUndefined();
  });

  it("leaves a Done task with no time out of a chosen range", () => {
    const blank = task({ id: "blank", stage: TaskStage.DONE, updatedAt: undefined });
    expect(doneAt(blank)).toBe(0);
    expect(filterDone([blank], { kind: "month" }, now)).toEqual([]);
    expect(filterDone([blank], { kind: "all" }, now)).toEqual([blank]);
  });

  it("falls back from checkedAt to stageAt to updatedAt", () => {
    const t = at(2026, 11, 18, 3);
    expect(doneAt(task({ stage: TaskStage.DONE, stageAt: timestampFromMs(t) }))).toBe(t);
    expect(doneAt(task({ stage: TaskStage.DONE, updatedAt: timestampFromMs(t) }))).toBe(t);
  });

  it("lets Command take a range in place of the 30-day window", () => {
    const all = commandTasks(list, {}, now);
    expect(ids(all)).toContain("nov1");
    expect(ids(all)).not.toContain("lastyear");
    expect(ids(commandTasks(list, {}, now, { kind: "today" })).filter((i) => i !== "open")).toEqual([
      "today",
    ]);
    expect(ids(commandTasks(list, { channelId: "zzz" }, now, { kind: "today" }))).toEqual([]);
    expect(ids(commandTasks(list, {}, now, { kind: "custom", from: "2025-12-31" }))).toContain("lastyear");
  });

  it("formats a local date as a date input does", () => {
    expect(localDateKey(at(2026, 3, 4))).toBe("2026-03-04");
  });
});

describe("sorting and searching a stage", () => {
  const ids = (list: Task[]) => list.map((t) => t.id);
  const list = [
    task({ id: "a", title: "banana", channelName: "zeta", createdAt: timestampFromMs(T0 + 1000) }),
    task({ id: "b", title: "Apple", channelName: "alpha", createdAt: timestampFromMs(T0 + 3000) }),
    task({ id: "c", title: "cherry", channelName: "alpha", createdAt: timestampFromMs(T0 + 2000) }),
  ];

  it("sorts newest, oldest, title A to Z and by Tread without touching the input", () => {
    const before = ids(list);
    expect(ids(sortTasks(list, "newest"))).toEqual(["b", "c", "a"]);
    expect(ids(sortTasks(list, "oldest"))).toEqual(["a", "c", "b"]);
    expect(ids(sortTasks(list, "title"))).toEqual(["b", "a", "c"]);
    expect(ids(sortTasks(list, "tread"))).toEqual(["b", "c", "a"]);
    expect(ids(list)).toEqual(before);
  });

  it("sorts Done by when they were done", () => {
    const done = [
      task({
        id: "x",
        stage: TaskStage.DONE,
        createdAt: timestampFromMs(T0),
        checkedAt: timestampFromMs(T0 + 9000),
      }),
      task({
        id: "y",
        stage: TaskStage.DONE,
        createdAt: timestampFromMs(T0 + 5000),
        checkedAt: timestampFromMs(T0 + 6000),
      }),
    ];
    expect(ids(sortTasks(done, "newest"))).toEqual(["x", "y"]);
    expect(ids(sortTasks(done, "oldest"))).toEqual(["y", "x"]);
  });

  it("searches title and Tread name, every word, any case", () => {
    expect(ids(searchTasks(list, "APPLE"))).toEqual(["b"]);
    expect(ids(searchTasks(list, "alpha"))).toEqual(["b", "c"]);
    expect(ids(searchTasks(list, "alpha cher"))).toEqual(["c"]);
    expect(ids(searchTasks(list, "nothing"))).toEqual([]);
    expect(ids(searchTasks(list, "  "))).toEqual(["a", "b", "c"]);
  });
});
