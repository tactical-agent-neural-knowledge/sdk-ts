// @vitest-environment jsdom
import { create } from "@bufbuild/protobuf";
import { anyPack, timestampFromMs } from "@bufbuild/protobuf/wkt";
import { createRouterTransport } from "@connectrpc/connect";
import { act, cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { createTankClient, type TankClient } from "../client/client.js";
import type { WebSocketCtor, WebSocketLike } from "../client/realtime.js";
import { AgentService, RunSchema, RunState } from "../contracts/tank/agent/v1/agent_pb.js";
import { AuthService, PrincipalSchema } from "../contracts/tank/auth/v1/auth_pb.js";
import {
  AgentStatusSchema,
  EnvelopeSchema,
  NotificationCreatedSchema,
} from "../contracts/tank/events/v1/events_pb.js";
import { FileSchema } from "../contracts/tank/files/v1/files_pb.js";
import {
  type ListNotificationsRequest,
  NotificationSchema,
  NotificationService,
} from "../contracts/tank/notification/v1/notification_pb.js";
import {
  MemberSchema,
  WorkspaceSchema,
  WorkspaceService,
} from "../contracts/tank/workspace/v1/workspace_pb.js";
import {
  TankProvider,
  useAgentStatus,
  useAgentStatuses,
  useFile,
  useNotifications,
  useRun,
  useThreadRun,
  useUnreadNotificationCount,
} from "./index.js";

class NoopSocket implements WebSocketLike {
  binaryType = "arraybuffer";
  readyState = 3;
  onopen = null;
  onmessage = null;
  onclose = null;
  onerror = null;
  send(): void {}
  close(): void {}
}

const T0 = 1_700_000_000_000;
const lists: ListNotificationsRequest[] = [];
let listRunsCalls = 0;
let getRunCalls = 0;

function makeClient(): TankClient {
  const transport = createRouterTransport(({ service }) => {
    service(AuthService, { mintGatewayToken: () => ({ token: "tok" }) });
    service(WorkspaceService, {
      getBootstrap: () => ({
        workspace: create(WorkspaceSchema, { id: "ws1", name: "TANK", slug: "tank" }),
        me: create(MemberSchema, { principal: create(PrincipalSchema, { id: "me", kind: 1 }) }),
        channels: [],
        readStates: [],
        members: [],
        unreadNotificationCount: 2,
      }),
    });
    service(NotificationService, {
      listNotifications: (req) => {
        lists.push(req);
        return {
          notifications: [
            create(NotificationSchema, {
              id: `n-${req.unreadOnly ? "u" : "a"}`,
              workspaceId: "ws1",
              createdAt: timestampFromMs(T0),
            }),
          ],
          nextCursor: "",
          unreadCount: 2,
        };
      },
      markNotificationsRead: () => ({}),
    });
    service(AgentService, {
      listRuns: (req) => {
        listRunsCalls++;
        return {
          runs: [
            create(RunSchema, {
              id: "r1",
              workspaceId: "ws1",
              threadRootId: req.threadRootId,
              state: RunState.PLANNING,
            }),
          ],
          nextCursor: "",
        };
      },
      getRun: (req) => {
        getRunCalls++;
        return { run: create(RunSchema, { id: req.runId, workspaceId: "ws1", state: RunState.DONE }) };
      },
    });
  });
  return createTankClient({
    baseUrl: "http://unused",
    wsUrl: "ws://unused",
    auth: "cookie",
    transport,
    WebSocket: NoopSocket as unknown as WebSocketCtor,
    realtime: { listenOnline: false },
  });
}

const wrap =
  (client: TankClient) =>
  ({ children }: { children: ReactNode }) => (
    <TankProvider client={client} autoStart={false}>
      {children}
    </TankProvider>
  );
const flush = () => act(() => new Promise((r) => setTimeout(r, 10)));

afterEach(() => {
  cleanup();
  lists.length = 0;
  listRunsCalls = 0;
  getRunCalls = 0;
});

describe("notification hooks", () => {
  it("useNotifications loads the first page per mode once; the badge follows bootstrap and live events", async () => {
    const client = makeClient();
    await client.bootstrap("ws1");
    const { result, rerender } = renderHook(({ unreadOnly }) => useNotifications("ws1", { unreadOnly }), {
      wrapper: wrap(client),
      initialProps: { unreadOnly: false },
    });
    const badge = renderHook(() => useUnreadNotificationCount("ws1"), { wrapper: wrap(client) });
    expect(badge.result.current).toBe(2);
    expect(result.current.hasMore).toBe(false);
    await flush();
    expect(result.current.notifications.map((n) => n.id)).toEqual(["n-a"]);
    expect(result.current.loading).toBe(false);
    rerender({ unreadOnly: true });
    await flush();
    expect(lists.map((l) => l.unreadOnly)).toEqual([false, true]);
    rerender({ unreadOnly: false });
    await flush();
    expect(lists).toHaveLength(2); // "all" was already loaded

    act(() =>
      client.store.applyEnvelope(
        create(EnvelopeSchema, {
          workspaceId: "ws1",
          payload: anyPack(
            NotificationCreatedSchema,
            create(NotificationCreatedSchema, { notificationId: "n-live", kind: "dm" }),
          ),
        }),
        T0,
      ),
    );
    expect(badge.result.current).toBe(3);
    expect(result.current.notifications[0]?.id).toBe("n-live");
    await act(() => result.current.markRead());
    expect(badge.result.current).toBe(0);
  });
});

describe("agent hooks", () => {
  it("useThreadRun seeds from ListRuns once, useRun from GetRun, and useAgentStatus expires", async () => {
    const client = makeClient();
    const w = wrap(client);
    const thread = renderHook(() => useThreadRun("root1"), { wrapper: w });
    expect(thread.result.current).toBeUndefined();
    await flush();
    expect(thread.result.current?.id).toBe("r1");
    renderHook(() => useThreadRun("root1"), { wrapper: w });
    await flush();
    expect(listRunsCalls).toBe(1);

    const one = renderHook(() => useRun("r7"), { wrapper: w });
    await flush();
    expect(one.result.current?.state).toBe(RunState.DONE);
    expect(getRunCalls).toBe(1);

    const status = renderHook(() => useAgentStatus("root1"), { wrapper: w });
    const all = renderHook(() => useAgentStatuses("general"), { wrapper: w });
    act(() =>
      client.store.dispatch({
        type: "agentStatus",
        status: create(AgentStatusSchema, {
          channelId: "general",
          threadRootId: "root1",
          status: "reading repo",
        }),
        now: T0,
      }),
    );
    expect(status.result.current?.status).toBe("reading repo");
    expect(all.result.current.map((f) => f.status)).toEqual(["reading repo"]);
    act(() => client.store.dispatch({ type: "agentStatus/expire", now: T0 + 30_001 }));
    expect(status.result.current).toBeUndefined();
    expect(all.result.current).toEqual([]);
  });
});

describe("file hooks", () => {
  it("useFile follows filesById", () => {
    const client = makeClient();
    const { result } = renderHook(() => useFile("f1"), { wrapper: wrap(client) });
    expect(result.current).toBeUndefined();
    act(() =>
      client.store.dispatch({
        type: "files/upsert",
        files: [create(FileSchema, { id: "f1", name: "a.png" })],
      }),
    );
    expect(result.current?.name).toBe("a.png");
  });
});
