// @vitest-environment jsdom
import { create } from "@bufbuild/protobuf";
import { Code, ConnectError, createRouterTransport } from "@connectrpc/connect";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { createTankClient, type TankClient } from "../client/client.js";
import { TaskSchema, TaskService } from "../contracts/tank/task/v1/task_pb.js";
import { TankProvider, useTaskAccess } from "./index.js";

afterEach(cleanup);

function makeClient(): TankClient {
  const transport = createRouterTransport(({ service }) => {
    service(TaskService, {
      getTask: (req) => {
        if (req.taskId === "outside")
          throw new ConnectError("This task is in a Tread you're not in.", Code.PermissionDenied);
        if (req.taskId === "missing") throw new ConnectError("That task is gone.", Code.NotFound);
        return { task: create(TaskSchema, { id: req.taskId, title: "Fix the login page" }) };
      },
    });
  });
  return createTankClient({ baseUrl: "http://unused", wsUrl: "ws://unused", auth: "cookie", transport });
}

function wrap(client: TankClient) {
  return ({ children }: { children: ReactNode }) => (
    <TankProvider client={client} autoStart={false}>
      {children}
    </TankProvider>
  );
}

describe("useTaskAccess", () => {
  it("is ready with the task for somebody in its Tread", async () => {
    const { result } = renderHook(() => useTaskAccess("t1"), { wrapper: wrap(makeClient()) });
    await waitFor(() => expect(result.current.state).toBe("ready"));
    expect(result.current.task?.title).toBe("Fix the login page");
  });

  it("says not_in_tread and holds no task when the server refuses", async () => {
    const client = makeClient();
    // Even a copy the store already has gives way to the refusal.
    client.store.dispatch({
      type: "tasks/upsert",
      tasks: [create(TaskSchema, { id: "outside", title: "secret" })],
    });
    const { result } = renderHook(() => useTaskAccess("outside"), { wrapper: wrap(client) });
    await waitFor(() => expect(result.current.state).toBe("not_in_tread"));
    expect(result.current.task).toBeUndefined();
  });

  it("says gone for a task that is not there", async () => {
    const { result } = renderHook(() => useTaskAccess("missing"), { wrapper: wrap(makeClient()) });
    await waitFor(() => expect(result.current.state).toBe("gone"));
  });
});
