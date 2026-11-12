import { create } from "@bufbuild/protobuf";
import { timestampFromDate } from "@bufbuild/protobuf/wkt";
import { describe, expect, it } from "vitest";
import {
  ConversationSchema,
  MemberReceiptSchema,
  MessageReceiptsSchema,
  MessageSchema,
  ReceiptsChangedSchema,
  ReceiptsSchema,
} from "../contracts/tank/ai/v1/ai_pb.js";
import {
  applyReceiptsChanged,
  clearReceipts,
  deliveriesToAck,
  MAX_DELIVERED,
  messageTime,
  RECEIPTS_COPY,
  receiptPeople,
  ticksLabel,
  ticksOf,
} from "./aiReceipts.js";

const ny = { locale: "en-US", timeZone: "America/New_York" };
const at = (iso: string) => timestampFromDate(new Date(iso));

describe("messageTime", () => {
  const now = new Date("2026-11-12T20:00:00Z"); // 3:00 PM in New York
  it("is the short time today", () => {
    expect(messageTime(at("2026-11-12T14:05:00Z"), now, ny)).toBe("9:05 AM");
  });
  it("puts the date first on another day", () => {
    expect(messageTime(at("2026-11-03T19:05:00Z"), now, ny)).toBe("Nov 3, 2:05 PM");
  });
  it("adds the year when it is not this year", () => {
    expect(messageTime(at("2025-12-31T17:00:00Z"), now, ny)).toBe("Dec 31, 2025, 12:00 PM");
  });
  it("judges today in the reader's own zone, not UTC", () => {
    // 02:00 UTC on the 13th is still the evening of the 12th in New York.
    expect(messageTime(at("2026-11-13T02:00:00Z"), new Date("2026-11-13T03:00:00Z"), ny)).toBe("9:00 PM");
  });
  it("is empty with no time", () => {
    expect(messageTime(undefined, now, ny)).toBe("");
  });
});

describe("ticks", () => {
  it("are the server's state, and none for anything else", () => {
    expect(ticksOf(undefined)).toBe("none");
    expect(ticksOf(create(ReceiptsSchema, { state: "sent" }))).toBe("sent");
    expect(ticksOf(create(ReceiptsSchema, { state: "delivered" }))).toBe("delivered");
    expect(ticksOf(create(ReceiptsSchema, { state: "read" }))).toBe("read");
    expect(ticksOf(create(ReceiptsSchema, { state: "seen" }))).toBe("none");
  });
  it("say what they mean to a screen reader", () => {
    expect(ticksLabel("read")).toBe(RECEIPTS_COPY.read);
    expect(ticksLabel("none")).toBe("");
  });
});

describe("receiptPeople", () => {
  it("lists readers earliest first, then those who have it but have not read it", () => {
    const r = create(ReceiptsSchema, {
      state: "delivered",
      members: [
        create(MemberReceiptSchema, {
          userId: "2",
          name: "Sam",
          deliveredAt: at("2026-11-12T10:00:00Z"),
          readAt: at("2026-11-12T10:05:00Z"),
        }),
        create(MemberReceiptSchema, { userId: "3", name: "Ana", deliveredAt: at("2026-11-12T10:01:00Z") }),
        create(MemberReceiptSchema, {
          userId: "4",
          name: "Lee",
          deliveredAt: at("2026-11-12T09:59:00Z"),
          readAt: at("2026-11-12T10:02:00Z"),
        }),
        create(MemberReceiptSchema, { userId: "5", name: "Kim" }),
      ],
    });
    const { read, delivered } = receiptPeople(r);
    expect(read.map((p) => p.name)).toEqual(["Lee", "Sam"]);
    expect(delivered.map((p) => p.name)).toEqual(["Ana"]);
    expect(read[0]?.at.toISOString()).toBe("2026-11-12T10:02:00.000Z");
  });
  it("is empty without receipts", () => {
    expect(receiptPeople(undefined)).toEqual({ read: [], delivered: [] });
  });
});

describe("applyReceiptsChanged", () => {
  const a = create(MessageSchema, { id: "1", text: "a" });
  const b = create(MessageSchema, { id: "2", text: "b" });
  it("puts the new receipts on the messages named", () => {
    const changed = create(ReceiptsChangedSchema, {
      messages: [
        create(MessageReceiptsSchema, {
          messageId: "2",
          receipts: create(ReceiptsSchema, { state: "read" }),
        }),
      ],
    });
    const out = applyReceiptsChanged([a, b], changed);
    expect(out[0]).toBe(a);
    expect(out[1]?.receipts?.state).toBe("read");
    expect(out[1]?.text).toBe("b");
  });
  it("hands back the same list when none is in it", () => {
    const list = [a];
    expect(
      applyReceiptsChanged(
        list,
        create(ReceiptsChangedSchema, { messages: [create(MessageReceiptsSchema, { messageId: "9" })] }),
      ),
    ).toBe(list);
  });
  it("clears every receipt when the switch goes off", () => {
    const withR = { ...a, receipts: create(ReceiptsSchema, { state: "sent" }) };
    expect(clearReceipts([withR, b])[0]?.receipts).toBeUndefined();
    const list = [a, b];
    expect(clearReceipts(list)).toBe(list);
  });
});

describe("deliveriesToAck", () => {
  const conv = (id: string, lastMessageId: string, unread: number) =>
    create(ConversationSchema, { id, lastMessageId, unread });
  it("names each conversation with something unread by its newest message, once", () => {
    const said = new Set<string>();
    const list = [conv("c1", "m1", 2), conv("c2", "m2", 0), conv("c3", "", 1), conv("c4", "m4", 1)];
    expect(deliveriesToAck(list, said)).toEqual([
      { conversationId: "c1", messageId: "m1" },
      { conversationId: "c4", messageId: "m4" },
    ]);
    expect(deliveriesToAck(list, said)).toEqual([]);
    expect(deliveriesToAck([conv("c1", "m5", 3)], said)).toEqual([{ conversationId: "c1", messageId: "m5" }]);
  });
  it("never names more than one call takes", () => {
    const list = Array.from({ length: MAX_DELIVERED + 5 }, (_, i) => conv(`c${i}`, `m${i}`, 1));
    expect(deliveriesToAck(list, new Set())).toHaveLength(MAX_DELIVERED);
  });
});
