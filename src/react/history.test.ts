import { create } from "@bufbuild/protobuf";
import { timestampFromMs } from "@bufbuild/protobuf/wkt";
import { describe, expect, it } from "vitest";
import { MessageKind, MessageSchema } from "../contracts/tank/message/v1/message_pb.js";
import { recentOwn } from "./history.js";

const msg = (id: string, authorId: string, text: string, extra: object = {}) =>
  create(MessageSchema, { id, authorId, text, kind: MessageKind.MESSAGE, ...extra });

describe("recentOwn", () => {
  it("lists my own real messages newest first and skips what cannot be re-sent", () => {
    const list = [
      msg("1", "me", "first"),
      msg("2", "alice", "not mine"),
      msg("3", "me", "", {}),
      msg("4", "me", "gone", { deletedAt: timestampFromMs(1) }),
      msg("5", "me", "joined", { kind: MessageKind.SYSTEM }),
      msg("6", "me", "second"),
      msg("7", "me", "second"),
      msg("8", "me", "third"),
    ];
    expect(recentOwn(list, "me").map((m) => m.text)).toEqual(["third", "second", "first"]);
  });

  it("is empty for nobody and respects the limit", () => {
    const list = Array.from({ length: 30 }, (_, i) => msg(String(i), "me", `m${i}`));
    expect(recentOwn(list, undefined)).toEqual([]);
    expect(recentOwn(list, "me", 5).map((m) => m.text)).toEqual(["m29", "m28", "m27", "m26", "m25"]);
  });
});
