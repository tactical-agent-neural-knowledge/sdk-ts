import { create } from "@bufbuild/protobuf";
import { anyPack } from "@bufbuild/protobuf/wkt";
import { describe, expect, it } from "vitest";
import { EnvelopeSchema, ReadStateUpdatedSchema } from "../contracts/tank/events/v1/events_pb.js";
import { envelopeToActions, readReceipt, TankStore } from "./store.js";

describe("read receipts", () => {
  it("positions load, only ever rise, and a thread keeps its own map", () => {
    const store = new TankStore();
    store.dispatch({
      type: "readPositions/upsert",
      channelId: "c1",
      positions: [
        { $typeName: "tank.message.v1.ReadPosition", userId: "u1", seq: 5n },
        { $typeName: "tank.message.v1.ReadPosition", userId: "u2", seq: 2n },
      ],
    });
    store.dispatch({ type: "readPositions/updated", channelId: "c1", userId: "u2", seq: 1n });
    expect(store.selectReadPositions("c1")).toEqual({ u1: 5n, u2: 2n });
    store.dispatch({ type: "readPositions/updated", channelId: "c1", userId: "u2", seq: 7n });
    expect(store.selectReadPositions("c1").u2).toBe(7n);
    store.dispatch({
      type: "readPositions/updated",
      channelId: "c1",
      userId: "u3",
      seq: 3n,
      threadRootId: "root",
    });
    expect(store.selectThreadReadPositions("root")).toEqual({ u3: 3n });
    expect(store.selectReadPositions("c1").u3).toBeUndefined();
    expect(store.selectReadPositions("none")).toBe(store.selectReadPositions("none"));
  });

  it("read_position.updated moves a member's receipt; read_state.updated stays my own read state", () => {
    const payload = create(ReadStateUpdatedSchema, { userId: "u9", channelId: "c1", lastReadSeq: 4n });
    const env = (type: string) =>
      create(EnvelopeSchema, { type, payload: anyPack(ReadStateUpdatedSchema, payload) });
    expect(envelopeToActions(env("read_position.updated"), 0)).toEqual([
      { type: "readPositions/updated", channelId: "c1", userId: "u9", seq: 4n },
    ]);
    expect(envelopeToActions(env("read_state.updated"), 0)[0]?.type).toBe("readStates/updated");
  });

  it("a receipt counts everyone but the author, and is 'everyone' only when all expected have read", () => {
    const positions = { me: 10n, a: 10n, b: 3n };
    expect(readReceipt({ seq: 5n, authorId: "me", positions, expected: 3 })).toEqual({
      readBy: ["a"],
      everyone: false,
    });
    expect(readReceipt({ seq: 3n, authorId: "me", positions, expected: 3 })).toEqual({
      readBy: ["a", "b"],
      everyone: true,
    });
    // Pending (no seq yet) has no readers.
    expect(readReceipt({ seq: 0n, authorId: "me", positions, expected: 3 }).readBy).toEqual([]);
    // Threads: expected is whoever has a position.
    expect(readReceipt({ seq: 2n, authorId: "me", positions }).everyone).toBe(true);
  });
});
