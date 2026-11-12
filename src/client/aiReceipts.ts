import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Conversation, Message, Receipts, ReceiptsChanged } from "../contracts/tank/ai/v1/ai_pb.js";

/**
 * Message times and read receipts in Neural conversations, shared by web and mobile so both say
 * and show the same (Robby, 2026-11-12: "swipe right and hold to see the time a message was
 * sent", "read receipts per conversation. Defaults to off, and those would be checkmarks like
 * WhatsApp"). Every tick state and every time is the server's (`Message.receipts`); nothing here
 * works one out.
 */

/** Every sentence the two apps show for these features, in one place (awaiting Robby's yes). */
export const RECEIPTS_COPY = {
  /** The switch in a conversation's people sheet. */
  label: "Read receipts",
  /** The line under the switch. */
  help: "See when your messages are read, and let others see when you've read theirs. Only works with people who turn it on too.",
  /** The sheet a tap on the ticks opens. */
  info: "Message info",
  readBy: "Read by",
  deliveredTo: "Delivered to",
  /** Under a heading with nobody under it. */
  nobodyYet: "No one yet",
  /** What the ticks say to a screen reader. */
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
} as const;

/** The ticks on one of my messages: none (receipts off, or nobody else there), ✓, ✓✓ or cyan ✓✓. */
export type Ticks = "none" | "sent" | "delivered" | "read";

/** The server's state as ticks; anything it does not name is no ticks. */
export function ticksOf(receipts: Receipts | undefined): Ticks {
  const s = receipts?.state;
  return s === "sent" || s === "delivered" || s === "read" ? s : "none";
}

/** What the ticks say to a screen reader, or "" for none. */
export function ticksLabel(t: Ticks): string {
  return t === "none" ? "" : RECEIPTS_COPY[t];
}

export function timestampDate(ts: Timestamp | undefined): Date | undefined {
  if (!ts) return undefined;
  return new Date(Number(ts.seconds) * 1000 + Math.floor(ts.nanos / 1e6));
}

export type TimeFormat = { locale?: string; timeZone?: string };

function dayKey(d: Date, f: TimeFormat): string {
  return d.toLocaleDateString("en-CA", { timeZone: f.timeZone });
}

/**
 * A message's time as the swipe shows it: the short time ("2:05 PM") today, with the date before
 * it on another day ("Nov 3, 2:05 PM"), and the year when it is not this year.
 */
export function messageTime(
  at: Date | Timestamp | undefined,
  now: Date = new Date(),
  f: TimeFormat = {},
): string {
  const d = at instanceof Date ? at : timestampDate(at);
  if (!d || Number.isNaN(d.getTime())) return "";
  const time = d.toLocaleTimeString(f.locale, { hour: "numeric", minute: "2-digit", timeZone: f.timeZone });
  if (dayKey(d, f) === dayKey(now, f)) return time;
  const sameYear =
    d.toLocaleDateString("en-CA", { year: "numeric", timeZone: f.timeZone }) ===
    now.toLocaleDateString("en-CA", { year: "numeric", timeZone: f.timeZone });
  const date = d.toLocaleDateString(f.locale, {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
    timeZone: f.timeZone,
  });
  return `${date}, ${time}`;
}

export type ReceiptPerson = { userId: string; name: string; avatarUrl: string; at: Date };

/**
 * Message info: who has read it (earliest first) and who has it but has not read it yet. Members
 * whose read receipts are off are not in `receipts.members` and so are in neither.
 */
export function receiptPeople(receipts: Receipts | undefined): {
  read: ReceiptPerson[];
  delivered: ReceiptPerson[];
} {
  const read: ReceiptPerson[] = [];
  const delivered: ReceiptPerson[] = [];
  for (const m of receipts?.members ?? []) {
    const base = { userId: m.userId, name: m.name, avatarUrl: m.avatarUrl };
    const r = timestampDate(m.readAt);
    const d = timestampDate(m.deliveredAt);
    if (r) read.push({ ...base, at: r });
    else if (d) delivered.push({ ...base, at: d });
  }
  const byAt = (a: ReceiptPerson, b: ReceiptPerson) => a.at.getTime() - b.at.getTime();
  return { read: read.sort(byAt), delivered: delivered.sort(byAt) };
}

/**
 * Messages with the receipts a Watch event carries put on them. The same array comes back when
 * none of them is in the list, so a store can skip the update.
 */
export function applyReceiptsChanged(messages: readonly Message[], changed: ReceiptsChanged): Message[] {
  const byId = new Map(changed.messages.map((m) => [m.messageId, m.receipts]));
  let touched = false;
  const out = messages.map((m) => {
    if (!byId.has(m.id)) return m;
    touched = true;
    return { ...m, receipts: byId.get(m.id) } as Message;
  });
  return touched ? out : (messages as Message[]);
}

/** Messages with every receipt taken off (the person turned theirs off). */
export function clearReceipts(messages: readonly Message[]): Message[] {
  if (!messages.some((m) => m.receipts)) return messages as Message[];
  return messages.map((m) => (m.receipts ? ({ ...m, receipts: undefined } as Message) : m));
}

/** The most conversations one MarkDelivered names (api MaxDelivered). */
export const MAX_DELIVERED = 200;

/**
 * What a chat list that just arrived has delivered to this device: each conversation with
 * something unread, by its newest message, skipping messages already said. Unread counts only
 * what others wrote, so my own newest message is never named. `said` is updated in place.
 */
export function deliveriesToAck(
  conversations: readonly Conversation[],
  said: Set<string>,
): { conversationId: string; messageId: string }[] {
  const out: { conversationId: string; messageId: string }[] = [];
  for (const c of conversations) {
    if (out.length >= MAX_DELIVERED) break;
    if (!c.lastMessageId || c.unread <= 0 || said.has(c.lastMessageId)) continue;
    said.add(c.lastMessageId);
    out.push({ conversationId: c.id, messageId: c.lastMessageId });
  }
  return out;
}
