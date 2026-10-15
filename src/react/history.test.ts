import { create } from "@bufbuild/protobuf";
import { timestampFromMs } from "@bufbuild/protobuf/wkt";
import { describe, expect, it } from "vitest";
import { MessageKind, MessageSchema } from "../contracts/tank/message/v1/message_pb.js";
import { noRecall, recallStep, recentOwn } from "./history.js";

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

describe("recallStep", () => {
  const list = [msg("3", "me", "third"), msg("2", "me", "second"), msg("1", "me", "first")];
  it("walks back through history from an empty box and forward again to empty", () => {
    let st = noRecall;
    let step = recallStep(st, 1, list, "");
    expect(step.kind).toBe("show");
    if (step.kind !== "show") return;
    expect(step.message.text).toBe("third");
    st = step.state;
    step = recallStep(st, 1, list, "third");
    if (step.kind !== "show") throw new Error(step.kind);
    expect(step.message.text).toBe("second");
    st = step.state;
    step = recallStep(st, -1, list, "second");
    if (step.kind !== "show") throw new Error(step.kind);
    expect(step.message.text).toBe("third");
    st = step.state;
    expect(recallStep(st, -1, list, "third")).toEqual({ kind: "clear", state: noRecall });
  });

  it("leaves the arrows alone while someone is typing, and holds at the oldest", () => {
    expect(recallStep(noRecall, 1, list, "half a thou")).toEqual({ kind: "ignore" });
    expect(recallStep(noRecall, -1, list, "")).toEqual({ kind: "ignore" });
    const edited = recallStep({ index: 0, text: "third" }, 1, list, "third, edited");
    expect(edited).toEqual({ kind: "ignore" });
    expect(recallStep({ index: 2, text: "first" }, 1, list, "first")).toEqual({ kind: "hold" });
    expect(recallStep(noRecall, 1, [], "")).toEqual({ kind: "ignore" });
  });
});
