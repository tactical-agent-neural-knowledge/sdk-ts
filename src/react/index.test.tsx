// @vitest-environment jsdom
import { create } from "@bufbuild/protobuf";
import { timestampFromMs } from "@bufbuild/protobuf/wkt";
import { createRouterTransport } from "@connectrpc/connect";
import { act, cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { createTankClient, type TankClient } from "../client/client.js";
import type { WebSocketCtor, WebSocketLike } from "../client/realtime.js";
import { TankStore as ClientTankStore } from "../client/store.js";
import { AuthService, PrincipalSchema } from "../contracts/tank/auth/v1/auth_pb.js";
import { ChannelSchema, ChannelType } from "../contracts/tank/channel/v1/channel_pb.js";
import { ChatService, type Message, MessageSchema } from "../contracts/tank/message/v1/message_pb.js";
import {
  MemberSchema,
  WorkspaceSchema,
  WorkspaceService,
} from "../contracts/tank/workspace/v1/workspace_pb.js";
import { TankProvider, TankStore, useMessages, useThreadUnread, useUnreads } from "./index.js";

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

function deferred<T>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

function msg(id: string, seq: number, over: Partial<Omit<Message, "$typeName" | "$unknown">> = {}): Message {
  return create(MessageSchema, {
    id,
    workspaceId: "ws1",
    channelId: "general",
    channelSeq: BigInt(seq),
    authorId: "u2",
    text: id,
    createdAt: timestampFromMs(1_700_000_000_000 + seq),
    ...over,
  });
}

function makeClient(list: { promise: Promise<{ messages: Message[]; hasMore: boolean }> }): TankClient {
  const transport = createRouterTransport(({ service }) => {
    service(AuthService, { mintGatewayToken: () => ({ token: "tok" }) });
    service(WorkspaceService, {
      getBootstrap: () => ({
        workspace: create(WorkspaceSchema, { id: "ws1", name: "TANK", slug: "tank" }),
        me: create(MemberSchema, { principal: create(PrincipalSchema, { id: "me", kind: 1 }) }),
        channels: [
          create(ChannelSchema, { id: "general", workspaceId: "ws1", type: ChannelType.PUBLIC, lastSeq: 3n }),
        ],
        readStates: [],
        members: [],
      }),
    });
    service(ChatService, { listMessages: () => list.promise });
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

afterEach(cleanup);

describe("useMessages", () => {
  it("reports hasMoreBefore=false and loading=true until the first page lands", async () => {
    const list = deferred<{ messages: Message[]; hasMore: boolean }>();
    const client = makeClient(list);
    await client.bootstrap("ws1");
    const wrapper = ({ children }: { children: ReactNode }) => (
      <TankProvider client={client} autoStart={false}>
        {children}
      </TankProvider>
    );
    const { result } = renderHook(() => useMessages("general"), { wrapper });
    expect(result.current.hasMoreBefore).toBe(false);
    expect(result.current.messages).toEqual([]);
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.loading).toBe(true);
    expect(result.current.hasMoreBefore).toBe(false);

    await act(async () => {
      list.resolve({ messages: [msg("m2", 2), msg("m3", 3)], hasMore: true });
      await list.promise;
      await Promise.resolve();
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.hasMoreBefore).toBe(true);
    expect(result.current.messages.map((m) => m.id)).toEqual(["m2", "m3"]);
  });

  it("reports hasMoreBefore=false after a first page that reaches the beginning", async () => {
    const list = deferred<{ messages: Message[]; hasMore: boolean }>();
    list.resolve({ messages: [msg("m1", 1)], hasMore: false });
    const client = makeClient(list);
    await client.bootstrap("ws1");
    const wrapper = ({ children }: { children: ReactNode }) => (
      <TankProvider client={client} autoStart={false}>
        {children}
      </TankProvider>
    );
    const { result } = renderHook(() => useMessages("general"), { wrapper });
    await act(async () => {
      await list.promise;
      await Promise.resolve();
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.hasMoreBefore).toBe(false);
    expect(client.store.getState().channelPaging.general?.loaded).toBe(true);
  });
});

describe("thread unreads", () => {
  it("useThreadUnread and useUnreads.threads follow thread read state", async () => {
    const list = deferred<{ messages: Message[]; hasMore: boolean }>();
    const client = makeClient(list);
    await client.bootstrap("ws1");
    client.store.dispatch({ type: "messages/created", message: msg("root", 1, { authorId: "me" }) });
    client.store.dispatch({
      type: "messages/created",
      message: msg("r1", 0, { threadRootId: "root", threadSeq: 1n }),
    });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <TankProvider client={client} autoStart={false}>
        {children}
      </TankProvider>
    );
    const { result } = renderHook(() => ({ thread: useThreadUnread("root"), all: useUnreads("ws1") }), {
      wrapper,
    });
    expect(result.current.thread).toBe(1);
    expect(result.current.all.threads).toBe(1);
    expect(result.current.all.byThread).toEqual({ root: 1 });
    act(() => {
      client.store.dispatch({
        type: "readStates/updated",
        channelId: "general",
        lastReadSeq: 0n,
        userId: "me",
        threadRootId: "root",
        lastReadThreadSeq: 1n,
      });
    });
    expect(result.current.thread).toBe(0);
    expect(result.current.all.threads).toBe(0);
  });
});

describe("re-exports", () => {
  it("exposes TankStore from ./react", () => {
    expect(TankStore).toBe(ClientTankStore);
    expect(new TankStore().getState().threadReadStates).toEqual({});
  });
});
