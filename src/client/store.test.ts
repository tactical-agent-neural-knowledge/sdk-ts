import { create } from "@bufbuild/protobuf";
import { anyPack, timestampFromMs } from "@bufbuild/protobuf/wkt";
import { beforeEach, describe, expect, it } from "vitest";
import { PrincipalSchema } from "../contracts/tank/auth/v1/auth_pb.js";
import {
  type Channel,
  ChannelReadStateSchema,
  ChannelSchema,
  ChannelType,
} from "../contracts/tank/channel/v1/channel_pb.js";
import { EnvelopeSchema, MessageCreatedSchema, TypingSchema } from "../contracts/tank/events/v1/events_pb.js";
import { type Message, MessageSchema } from "../contracts/tank/message/v1/message_pb.js";
import { PresenceSchema, PresenceStatus } from "../contracts/tank/presence/v1/presence_pb.js";
import { MemberSchema, WorkspaceSchema } from "../contracts/tank/workspace/v1/workspace_pb.js";
import { initialState, reduce, TankStore, TYPING_TTL_MS } from "./store.js";
import { uuidv7 } from "./uuidv7.js";

const ws = create(WorkspaceSchema, { id: "ws1", slug: "tank", name: "TANK" });
const me = create(PrincipalSchema, { id: "me", kind: 1, displayName: "Robby" });
type Over<T> = Omit<Partial<T>, "$typeName" | "$unknown">;
const ch = (id: string, over: Over<Channel> = {}) =>
  create(ChannelSchema, { id, workspaceId: "ws1", type: ChannelType.PUBLIC, name: id, lastSeq: 0n, ...over });
const msg = (id: string, seq: number, over: Over<Message> = {}) =>
  create(MessageSchema, {
    id,
    workspaceId: "ws1",
    channelId: "general",
    channelSeq: BigInt(seq),
    authorId: "u2",
    text: id,
    createdAt: timestampFromMs(1_700_000_000_000 + seq),
    ...over,
  });

function bootstrapped(): TankStore {
  const store = new TankStore();
  store.dispatch({
    type: "bootstrap",
    workspace: ws,
    me: create(MemberSchema, { principal: me, role: 1 }),
    channels: [
      ch("zeta"),
      ch("general", { lastSeq: 3n }),
      ch("dm-1", { type: ChannelType.DM, name: "" }),
      ch("alpha"),
    ],
    readStates: [create(ChannelReadStateSchema, { channelId: "general", lastReadSeq: 1n, mentionCount: 1 })],
    members: [create(MemberSchema, { principal: create(PrincipalSchema, { id: "u2", displayName: "Ada" }) })],
  });
  return store;
}

describe("bootstrap", () => {
  it("normalizes workspace, me, channels (ordered), read states and members", () => {
    const s = bootstrapped().getState();
    expect(s.me?.id).toBe("me");
    expect(s.workspaces.ws1?.name).toBe("TANK");
    expect(s.channelOrder.ws1).toEqual(["alpha", "general", "zeta", "dm-1"]);
    expect(s.readStates.general?.lastReadSeq).toBe(1n);
    expect(Object.keys(s.members.ws1 ?? {}).sort()).toEqual(["me", "u2"]);
  });
});

describe("messages", () => {
  let store: TankStore;
  beforeEach(() => {
    store = bootstrapped();
  });

  it("orders by channel_seq regardless of arrival order and dedupes", () => {
    store.dispatch({ type: "messages/created", message: msg("m3", 3) });
    store.dispatch({ type: "messages/created", message: msg("m1", 1) });
    store.dispatch({ type: "messages/upsert", messages: [msg("m2", 2), msg("m1", 1, { text: "edited" })] });
    const list = store.selectChannelMessages("general");
    expect(list.map((m) => m.id)).toEqual(["m1", "m2", "m3"]);
    expect(list[0]?.text).toBe("edited");
  });

  it("bumps channel.last_seq on created", () => {
    store.dispatch({ type: "messages/created", message: msg("m9", 9) });
    expect(store.getState().channels.general?.lastSeq).toBe(9n);
    expect(store.selectUnreads("ws1").byChannel.general).toEqual({ unread: 8, mentions: 1 });
  });

  it("selectors return the same reference until their inputs change", () => {
    store.dispatch({ type: "messages/created", message: msg("m1", 1) });
    const a = store.selectChannelMessages("general");
    const b = store.selectChannelMessages("general");
    expect(a).toBe(b);
    store.dispatch({
      type: "presence/changed",
      presence: create(PresenceSchema, { userId: "u2", status: 1 }),
    });
    expect(store.selectChannelMessages("general")).toBe(a);
    store.dispatch({ type: "messages/created", message: msg("m2", 2) });
    expect(store.selectChannelMessages("general")).not.toBe(a);
    expect(store.selectChannels("ws1")).toBe(store.selectChannels("ws1"));
  });

  it("threads: replies index by root ordered by thread_seq, root gets reply_count", () => {
    store.dispatch({ type: "messages/created", message: msg("root", 1) });
    store.dispatch({
      type: "messages/created",
      message: msg("r2", 0, { threadRootId: "root", threadSeq: 2n }),
    });
    store.dispatch({
      type: "messages/created",
      message: msg("r1", 0, { threadRootId: "root", threadSeq: 1n }),
    });
    const t = store.selectThread("root");
    expect(t.replies.map((m) => m.id)).toEqual(["r1", "r2"]);
    expect(t.root?.replyCount).toBe(2);
    expect(t.root?.replyUserIds).toEqual(["u2"]);
    // replies that are not broadcast do not appear in the channel timeline
    expect(store.selectChannelMessages("general").map((m) => m.id)).toEqual(["root"]);
    // a broadcast reply (channel_seq > 0) appears in both
    store.dispatch({
      type: "messages/created",
      message: msg("r3", 5, { threadRootId: "root", threadSeq: 3n }),
    });
    expect(store.selectChannelMessages("general").map((m) => m.id)).toEqual(["root", "r3"]);
  });

  it("delete removes from every index; updated with deleted_at too", () => {
    store.dispatch({ type: "messages/created", message: msg("m1", 1) });
    store.dispatch({ type: "messages/created", message: msg("m2", 2) });
    store.dispatch({ type: "messages/deleted", messageId: "m1", channelId: "general", threadRootId: "" });
    expect(store.selectChannelMessages("general").map((m) => m.id)).toEqual(["m2"]);
    store.dispatch({ type: "messages/updated", message: msg("m2", 2, { deletedAt: timestampFromMs(1) }) });
    expect(store.selectChannelMessages("general")).toEqual([]);
    expect(store.getState().messages.m2).toBeUndefined();
  });

  it("reactions add/remove with counts and the caller's `reacted` flag", () => {
    store.dispatch({ type: "messages/created", message: msg("m1", 1) });
    store.dispatch({ type: "reactions/added", messageId: "m1", userId: "u2", emoji: "tada" });
    store.dispatch({ type: "reactions/added", messageId: "m1", userId: "me", emoji: "tada" });
    store.dispatch({ type: "reactions/added", messageId: "m1", userId: "me", emoji: "tada" }); // dup
    let r = store.getState().messages.m1?.reactions[0];
    expect(r).toMatchObject({ emoji: "tada", count: 2, reacted: true });
    store.dispatch({ type: "reactions/removed", messageId: "m1", userId: "me", emoji: "tada" });
    r = store.getState().messages.m1?.reactions[0];
    expect(r).toMatchObject({ count: 1, reacted: false, userIds: ["u2"] });
    store.dispatch({ type: "reactions/removed", messageId: "m1", userId: "u2", emoji: "tada" });
    expect(store.getState().messages.m1?.reactions).toEqual([]);
  });
});

describe("outbox reconciliation", () => {
  it("optimistic rows trail real ones and are replaced by the echoed event", () => {
    const store = bootstrapped();
    store.dispatch({ type: "messages/created", message: msg("m5", 5) });
    const clientMsgId = uuidv7();
    const optimistic = msg(clientMsgId, 0, { clientMsgId, authorId: "me", text: "hi" });
    store.dispatch({ type: "pending/add", message: optimistic, now: Date.now() });
    expect(store.selectChannelMessages("general").map((m) => m.id)).toEqual(["m5", clientMsgId]);
    expect(store.getState().pending[clientMsgId]?.status).toBe("sending");

    // A newer real message from someone else still sorts before the optimistic row.
    store.dispatch({ type: "messages/created", message: msg("m6", 6) });
    expect(store.selectChannelMessages("general").map((m) => m.id)).toEqual(["m5", "m6", clientMsgId]);

    // Echo: same client_msg_id, server id and seq.
    store.dispatch({
      type: "messages/created",
      message: msg("m7", 7, { clientMsgId, authorId: "me", text: "hi" }),
    });
    expect(store.selectChannelMessages("general").map((m) => m.id)).toEqual(["m5", "m6", "m7"]);
    expect(store.getState().pending[clientMsgId]).toBeUndefined();
    expect(store.getState().messages[clientMsgId]).toBeUndefined();

    // A late RPC response with the same message is a harmless upsert.
    store.dispatch({
      type: "pending/resolve",
      clientMsgId,
      message: msg("m7", 7, { clientMsgId, text: "hi" }),
    });
    expect(store.selectChannelMessages("general")).toHaveLength(3);
  });

  it("failed / retry / discard", () => {
    const store = bootstrapped();
    const id = uuidv7();
    store.dispatch({ type: "pending/add", message: msg(id, 0, { clientMsgId: id }), now: 1 });
    store.dispatch({ type: "pending/failed", clientMsgId: id, error: "boom" });
    expect(store.getState().pending[id]).toMatchObject({ status: "failed", error: "boom" });
    store.dispatch({ type: "pending/retry", clientMsgId: id });
    expect(store.getState().pending[id]).toMatchObject({ status: "sending", attempts: 1 });
    store.dispatch({ type: "pending/discard", clientMsgId: id });
    expect(store.getState().pending[id]).toBeUndefined();
    expect(store.selectChannelMessages("general")).toEqual([]);
  });
});

describe("read states, presence, typing, membership", () => {
  it("read state updates only for me and unread math respects mute", () => {
    const store = bootstrapped();
    store.dispatch({
      type: "readStates/updated",
      channelId: "general",
      lastReadSeq: 3n,
      userId: "someone-else",
    });
    expect(store.getState().readStates.general?.lastReadSeq).toBe(1n);
    store.dispatch({ type: "readStates/updated", channelId: "general", lastReadSeq: 3n, userId: "me" });
    expect(store.selectUnreads("ws1").total).toBe(0);
    store.dispatch({ type: "messages/created", message: msg("m4", 4) });
    expect(store.selectUnreads("ws1").total).toBe(1);
    store.dispatch({
      type: "readStates/upsert",
      readStates: [create(ChannelReadStateSchema, { channelId: "general", lastReadSeq: 3n, muted: true })],
    });
    expect(store.selectUnreads("ws1").total).toBe(0);
  });

  it("typing entries expire after the TTL and ignore my own", () => {
    const store = bootstrapped();
    const t0 = 1000;
    store.dispatch({
      type: "typing",
      typing: create(TypingSchema, { channelId: "general", userId: "u2" }),
      now: t0,
    });
    store.dispatch({
      type: "typing",
      typing: create(TypingSchema, { channelId: "general", userId: "me" }),
      now: t0,
    });
    expect(store.selectTyping("general")).toEqual(["u2"]);
    store.dispatch({ type: "typing/expire", now: t0 + TYPING_TTL_MS - 1 });
    expect(store.selectTyping("general")).toEqual(["u2"]);
    store.dispatch({ type: "typing/expire", now: t0 + TYPING_TTL_MS });
    expect(store.selectTyping("general")).toEqual([]);
  });

  it("presence selector is keyed by the requested ids", () => {
    const store = bootstrapped();
    store.dispatch({
      type: "presence/changed",
      presence: create(PresenceSchema, { userId: "u2", status: PresenceStatus.ARMOR }),
    });
    const p = store.selectPresence(["u2", "u3"]);
    expect(p.u2?.status).toBe(PresenceStatus.ARMOR);
    expect(p.u3).toBeUndefined();
    expect(store.selectPresence(["u2", "u3"])).toBe(p);
  });

  it("leaving a channel myself removes it from the order", () => {
    const store = bootstrapped();
    store.dispatch({ type: "membership/changed", channelId: "alpha", userId: "u2", joined: true });
    expect(store.getState().channels.alpha?.memberIds).toEqual(["u2"]);
    store.dispatch({ type: "membership/changed", channelId: "alpha", userId: "me", joined: false });
    expect(store.getState().channelOrder.ws1).not.toContain("alpha");
  });
});

describe("envelopes", () => {
  it("applies a MessageCreated envelope via Any unpacking", () => {
    const store = bootstrapped();
    const env = create(EnvelopeSchema, {
      id: "e1",
      workspaceId: "ws1",
      type: "message.created",
      payload: anyPack(MessageCreatedSchema, create(MessageCreatedSchema, { message: msg("m1", 1) })),
    });
    store.applyEnvelope(env);
    expect(store.selectChannelMessages("general")).toHaveLength(1);
  });
  it("ignores envelopes without payload", () => {
    const s = reduce(initialState(), { type: "connection", state: "ready" });
    const store = new TankStore(s);
    store.applyEnvelope(create(EnvelopeSchema, { id: "e", workspaceId: "ws1" }));
    expect(store.getState().connection).toBe("ready");
  });
});
