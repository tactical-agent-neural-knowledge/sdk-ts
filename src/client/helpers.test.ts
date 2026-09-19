import { create } from "@bufbuild/protobuf";
import { timestampFromMs } from "@bufbuild/protobuf/wkt";
import { Code, ConnectError, createRouterTransport } from "@connectrpc/connect";
import { beforeEach, describe, expect, it } from "vitest";
import { AgentService, RunSchema, RunState } from "../contracts/tank/agent/v1/agent_pb.js";
import { AuthService, PrincipalSchema } from "../contracts/tank/auth/v1/auth_pb.js";
import { ChannelSchema, ChannelType } from "../contracts/tank/channel/v1/channel_pb.js";
import {
  type CompleteUploadRequest,
  type CreateUploadRequest,
  FileSchema,
  FilesService,
} from "../contracts/tank/files/v1/files_pb.js";
import {
  type ListNotificationsRequest,
  type MarkNotificationsReadRequest,
  NotificationSchema,
  NotificationService,
} from "../contracts/tank/notification/v1/notification_pb.js";
import {
  PresenceSchema,
  PresenceService,
  PresenceStatus,
  type SetStatusRequest,
} from "../contracts/tank/presence/v1/presence_pb.js";
import {
  MemberSchema,
  WorkspaceSchema,
  WorkspaceService,
} from "../contracts/tank/workspace/v1/workspace_pb.js";
import { createTankClient, type TankClient, type TankClientOptions } from "./client.js";
import type { XhrLike } from "./upload.js";

interface Api {
  lists: ListNotificationsRequest[];
  marks: MarkNotificationsReadRequest[];
  statuses: SetStatusRequest[];
  creates: CreateUploadRequest[];
  completes: CompleteUploadRequest[];
  downloads: number;
  fail: Set<string>;
  partUrls: string[];
  partSize: bigint;
}
let api: Api;
const T0 = 1_700_000_000_000;
let now = T0;

function transport() {
  const guard = (rpc: string) => {
    if (api.fail.has(rpc)) throw new ConnectError(`${rpc} failed`, Code.Unavailable);
  };
  return createRouterTransport(({ service }) => {
    service(AuthService, { mintGatewayToken: () => ({ token: "tok" }) });
    service(WorkspaceService, {
      getBootstrap: () => ({
        workspace: create(WorkspaceSchema, { id: "ws1", name: "TANK", slug: "tank" }),
        me: create(MemberSchema, { principal: create(PrincipalSchema, { id: "me", kind: 1 }) }),
        channels: [
          create(ChannelSchema, {
            id: "general",
            workspaceId: "ws1",
            type: ChannelType.PUBLIC,
            name: "general",
          }),
        ],
        readStates: [],
        members: [],
        unreadNotificationCount: 3,
      }),
    });
    service(NotificationService, {
      listNotifications: (req) => {
        api.lists.push(req);
        guard("listNotifications");
        const page = req.cursor === "" ? ["n3", "n2"] : ["n1"];
        return {
          notifications: page.map((id, i) =>
            create(NotificationSchema, {
              id,
              workspaceId: "ws1",
              userId: "me",
              kind: "mention",
              createdAt: timestampFromMs(T0 + Number(id.slice(1)) * 1000 - i),
              ...(req.unreadOnly || id !== "n2" ? {} : { readAt: timestampFromMs(T0) }),
            }),
          ),
          nextCursor: req.cursor === "" ? "c1" : "",
          unreadCount: req.unreadOnly ? 2 : 5,
        };
      },
      markNotificationsRead: (req) => {
        api.marks.push(req);
        guard("markNotificationsRead");
        return {};
      },
    });
    service(AgentService, {
      listRuns: (req) => ({
        runs: [
          create(RunSchema, {
            id: "r1",
            workspaceId: "ws1",
            threadRootId: req.threadRootId || "root1",
            state: RunState.PLANNING,
            startedAt: timestampFromMs(T0),
          }),
        ],
        nextCursor: "",
      }),
      getRun: (req) => ({
        run: create(RunSchema, {
          id: req.runId,
          workspaceId: "ws1",
          threadRootId: "root2",
          state: RunState.DONE,
        }),
      }),
    });
    service(PresenceService, {
      setStatus: (req) => {
        api.statuses.push(req);
        guard("setStatus");
        return {
          presence: create(PresenceSchema, {
            userId: "me",
            status: req.status,
            customStatusText: `${req.customStatusText} (server)`,
          }),
        };
      },
    });
    service(FilesService, {
      createUpload: (req) => {
        api.creates.push(req);
        guard("createUpload");
        return {
          file: create(FileSchema, {
            id: "f1",
            workspaceId: req.workspaceId,
            name: req.name,
            mime: req.mime,
            size: req.size,
          }),
          uploadUrl: "https://s3.test/f1",
          uploadId: api.partUrls.length ? "mp-1" : "",
          partUrls: api.partUrls,
          partSize: api.partSize,
        };
      },
      completeUpload: (req) => {
        api.completes.push(req);
        return { file: create(FileSchema, { id: req.fileId, name: "done.bin", scanStatus: 2 }) };
      },
      getDownloadUrl: (req) => {
        api.downloads++;
        return {
          url: `https://cdn.test/${req.fileId}?n=${api.downloads}`,
          expiresAt: timestampFromMs(now + 60 * 60_000),
        };
      },
    });
  });
}

function makeClient(over: Partial<TankClientOptions> = {}): TankClient {
  return createTankClient({
    baseUrl: "http://unused",
    wsUrl: "ws://unused",
    auth: "cookie",
    transport: transport(),
    now: () => now,
    ...over,
  });
}

beforeEach(() => {
  now = T0;
  api = {
    lists: [],
    marks: [],
    statuses: [],
    creates: [],
    completes: [],
    downloads: 0,
    fail: new Set(),
    partUrls: [],
    partSize: 0n,
  };
});

describe("notifications", () => {
  it("bootstrap seeds the badge; loadNotifications pages per mode and reseeds it", async () => {
    const c = makeClient();
    await c.bootstrap("ws1");
    expect(c.store.getState().unreadNotificationCount.ws1).toBe(3);
    const first = await c.loadNotifications({ workspaceId: "ws1" });
    expect(first.hasMore).toBe(true);
    expect(first.nextCursor).toBe("c1");
    expect(c.store.getState().unreadNotificationCount.ws1).toBe(5);
    expect(c.store.getState().notificationPaging["ws1:all"]).toEqual({
      loading: false,
      loaded: true,
      cursor: "c1",
      hasMore: true,
    });
    const second = await c.loadNotifications({ workspaceId: "ws1", cursor: first.nextCursor });
    expect(second.hasMore).toBe(false);
    expect(c.store.selectNotifications("ws1").map((n) => n.id)).toEqual(["n3", "n2", "n1"]);
    expect(c.store.selectNotifications("ws1", true).map((n) => n.id)).toEqual(["n3", "n1"]);
    expect(api.lists.map((r) => [r.unreadOnly, r.cursor, r.limit])).toEqual([
      [false, "", 30],
      [false, "c1", 30],
    ]);
    await c.loadNotifications({ workspaceId: "ws1", unreadOnly: true, limit: 5 });
    expect(api.lists[2]?.unreadOnly).toBe(true);
    expect(c.store.getState().notificationPaging["ws1:unread"]?.loaded).toBe(true);
  });

  it("loadNotifications clears `loading` and rethrows on failure", async () => {
    const c = makeClient();
    api.fail.add("listNotifications");
    await expect(c.loadNotifications({ workspaceId: "ws1" })).rejects.toBeInstanceOf(ConnectError);
    expect(c.store.getState().notificationPaging["ws1:all"]).toMatchObject({ loading: false, loaded: false });
  });

  it("markNotificationsRead is optimistic and rolls rows and the badge back on failure", async () => {
    const c = makeClient();
    await c.bootstrap("ws1");
    await c.loadNotifications({ workspaceId: "ws1" });
    expect(c.store.getState().unreadNotificationCount.ws1).toBe(5);

    await c.markNotificationsRead("ws1", ["n3"]);
    expect(api.marks[0]?.notificationIds).toEqual(["n3"]);
    expect(c.store.getState().notifications.n3?.readAt).toBeDefined();
    expect(c.store.getState().unreadNotificationCount.ws1).toBe(4);

    api.fail.add("markNotificationsRead");
    const p = c.markNotificationsRead("ws1");
    expect(c.store.getState().unreadNotificationCount.ws1).toBe(0); // optimistic
    await expect(p).rejects.toBeInstanceOf(ConnectError);
    expect(c.store.getState().unreadNotificationCount.ws1).toBe(4);
    expect(c.store.selectNotifications("ws1", true).map((n) => n.id)).toEqual(
      ["n2"].filter(() => false).concat([]),
    ); // n2 was read server-side
    expect(c.store.getState().notifications.n2?.readAt).toBeDefined();
  });
});

describe("agent runs", () => {
  it("listRuns and getRun fill runsById / runsByThread", async () => {
    const c = makeClient();
    const { runs } = await c.listRuns({ threadRootId: "root1" });
    expect(runs.map((r) => r.id)).toEqual(["r1"]);
    expect(c.store.getState().runsByThread.root1?.id).toBe("r1");
    const r9 = await c.getRun("r9");
    expect(r9?.state).toBe(RunState.DONE);
    expect(c.store.getState().runsByThread.root2?.id).toBe("r9");
    expect(c.agent).toBe(c.agents);
  });
});

describe("presence", () => {
  it("setStatus is optimistic, takes the server's presence, and rolls back on failure", async () => {
    const c = makeClient();
    await c.bootstrap("ws1");
    const p = c.setStatus({
      workspaceId: "ws1",
      status: PresenceStatus.DND,
      customText: "heads down",
      expiresAt: new Date(T0 + 3_600_000),
    });
    expect(c.store.getState().presence.me).toMatchObject({
      status: PresenceStatus.DND,
      customStatusText: "heads down",
    });
    await p;
    expect(c.store.getState().presence.me?.customStatusText).toBe("heads down (server)");
    expect(api.statuses[0]?.expiresAt).toEqual(timestampFromMs(T0 + 3_600_000));

    api.fail.add("setStatus");
    const q = c.setStatus({ workspaceId: "ws1", status: PresenceStatus.AWAY });
    expect(c.store.getState().presence.me?.status).toBe(PresenceStatus.AWAY);
    await expect(q).rejects.toBeInstanceOf(ConnectError);
    expect(c.store.getState().presence.me).toMatchObject({
      status: PresenceStatus.DND,
      customStatusText: "heads down (server)",
    });
  });

  it("setStatus rollback removes the row when there was none before", async () => {
    const c = makeClient();
    await c.bootstrap("ws1");
    api.fail.add("setStatus");
    await expect(c.setStatus({ workspaceId: "ws1", status: PresenceStatus.ACTIVE })).rejects.toBeInstanceOf(
      ConnectError,
    );
    expect(c.store.getState().presence.me).toBeUndefined();
  });
});

/** Scripted XMLHttpRequest: records PUTs, reports progress in two steps, answers with an ETag. */
class FakeXhr implements XhrLike {
  static puts: Array<{ url: string; headers: Record<string, string>; body: unknown }> = [];
  static failWith: number | undefined;
  upload: XhrLike["upload"] = { onprogress: null };
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onabort: (() => void) | null = null;
  status = 0;
  statusText = "";
  private url = "";
  private headers: Record<string, string> = {};
  open(_m: string, url: string): void {
    this.url = url;
  }
  setRequestHeader(k: string, v: string): void {
    this.headers[k] = v;
  }
  getResponseHeader(name: string): string | null {
    return name === "ETag" ? `"etag-${FakeXhr.puts.length}"` : null;
  }
  send(body: unknown): void {
    FakeXhr.puts.push({ url: this.url, headers: this.headers, body });
    const total = (body as { size?: number }).size ?? 0;
    setTimeout(() => {
      this.upload.onprogress?.({ loaded: Math.floor(total / 2), total, lengthComputable: true });
      this.status = FakeXhr.failWith ?? 200;
      this.statusText = this.status === 200 ? "OK" : "Bad";
      this.onload?.();
    }, 0);
  }
  abort(): void {
    this.onabort?.();
  }
}

describe("files", () => {
  beforeEach(() => {
    FakeXhr.puts = [];
    FakeXhr.failWith = undefined;
  });

  it("uploadFile: CreateUpload → PUT (XHR with progress) → CompleteUpload, and the File lands in the store", async () => {
    const c = makeClient({ XMLHttpRequest: FakeXhr });
    const progress: Array<[number, number]> = [];
    const blob = new Blob([new Uint8Array(100)], { type: "image/png" });
    const file = await c.uploadFile(blob, {
      workspaceId: "ws1",
      channelId: "general",
      onProgress: (l, t) => progress.push([l, t]),
    });
    expect(api.creates[0]).toMatchObject({
      workspaceId: "ws1",
      channelId: "general",
      name: "file",
      mime: "image/png",
      size: 100n,
    });
    expect(FakeXhr.puts).toHaveLength(1);
    expect(FakeXhr.puts[0]).toMatchObject({
      url: "https://s3.test/f1",
      headers: { "Content-Type": "image/png" },
    });
    expect(FakeXhr.puts[0]?.body).toBe(blob);
    expect(progress).toEqual([
      [0, 100],
      [50, 100],
      [100, 100],
    ]);
    expect(api.completes[0]).toMatchObject({ fileId: "f1", uploadId: "", etags: [] });
    expect(file.name).toBe("done.bin");
    expect(c.store.getState().filesById.f1).toBe(file);
  });

  it("uploadFile: multipart parts go to each part URL and their ETags complete the upload", async () => {
    api.partUrls = ["https://s3.test/p1", "https://s3.test/p2", "https://s3.test/p3"];
    api.partSize = 40n;
    const c = makeClient({ XMLHttpRequest: FakeXhr });
    const progress: number[] = [];
    const named = new File([new Uint8Array(100)], "big.bin", { type: "application/octet-stream" });
    await c.uploadFile(named, { workspaceId: "ws1", onProgress: (l) => progress.push(l) });
    expect(api.creates[0]?.name).toBe("big.bin");
    expect(FakeXhr.puts.map((p) => [p.url, (p.body as Blob).size])).toEqual([
      ["https://s3.test/p1", 40],
      ["https://s3.test/p2", 40],
      ["https://s3.test/p3", 20],
    ]);
    expect(api.completes[0]).toMatchObject({ uploadId: "mp-1", etags: ["etag-1", "etag-2", "etag-3"] });
    expect(progress[progress.length - 1]).toBe(100);
    expect(progress.every((v, i) => i === 0 || v >= progress[i - 1]!)).toBe(true);
  });

  it("uploadFile: falls back to fetch when there is no XMLHttpRequest, and native {uri} handles are sent as-is", async () => {
    const calls: Array<{ url: string; init: RequestInit }> = [];
    const fetchFn: typeof fetch = async (url, init) => {
      calls.push({ url: String(url), init: init ?? {} });
      return new Response(null, { status: 200, headers: { ETag: '"e1"' } });
    };
    const c = makeClient({ fetch: fetchFn, XMLHttpRequest: undefined });
    // node has no global XMLHttpRequest, so the fetch path is taken
    const handle = { uri: "file:///tmp/photo.jpg", name: "photo.jpg", mime: "image/jpeg", size: 12 };
    const progress: number[] = [];
    await c.uploadFile(handle, { workspaceId: "ws1", onProgress: (l) => progress.push(l) });
    expect(calls[0]?.url).toBe("https://s3.test/f1");
    expect(calls[0]?.init.method).toBe("PUT");
    expect(calls[0]?.init.body).toEqual({ uri: handle.uri, type: "image/jpeg", name: "photo.jpg" });
    expect(progress).toEqual([0, 12]);
    expect(api.creates[0]).toMatchObject({ name: "photo.jpg", mime: "image/jpeg", size: 12n });
  });

  it("uploadFile: a failed PUT rejects with the status and never completes the upload", async () => {
    FakeXhr.failWith = 403;
    const c = makeClient({ XMLHttpRequest: FakeXhr });
    await expect(c.uploadFile(new Blob([new Uint8Array(3)]), { workspaceId: "ws1" })).rejects.toMatchObject({
      name: "UploadError",
      status: 403,
    });
    expect(api.completes).toHaveLength(0);
  });

  it("getDownloadUrl memoizes for 10 minutes and dedupes concurrent calls", async () => {
    const c = makeClient();
    const [a, b] = await Promise.all([c.getDownloadUrl("f1"), c.getDownloadUrl("f1")]);
    expect(a).toBe(b);
    expect(api.downloads).toBe(1);
    now = T0 + 9 * 60_000;
    expect(await c.getDownloadUrl("f1")).toBe(a);
    now = T0 + 10 * 60_000 + 1;
    expect(await c.getDownloadUrl("f1")).not.toBe(a);
    expect(api.downloads).toBe(2);
  });
});
