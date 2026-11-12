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
export declare const RECEIPTS_COPY: {
    /** The switch in a conversation's people sheet. */
    readonly label: "Read receipts";
    /** The line under the switch. */
    readonly help: "See when your messages are read, and let others see when you've read theirs. Only works with people who turn it on too.";
    /** The sheet a tap on the ticks opens. */
    readonly info: "Message info";
    readonly readBy: "Read by";
    readonly deliveredTo: "Delivered to";
    /** Under a heading with nobody under it. */
    readonly nobodyYet: "No one yet";
    /** What the ticks say to a screen reader. */
    readonly sent: "Sent";
    readonly delivered: "Delivered";
    readonly read: "Read";
};
/** The ticks on one of my messages: none (receipts off, or nobody else there), ✓, ✓✓ or cyan ✓✓. */
export type Ticks = "none" | "sent" | "delivered" | "read";
/** The server's state as ticks; anything it does not name is no ticks. */
export declare function ticksOf(receipts: Receipts | undefined): Ticks;
/** What the ticks say to a screen reader, or "" for none. */
export declare function ticksLabel(t: Ticks): string;
export declare function timestampDate(ts: Timestamp | undefined): Date | undefined;
export type TimeFormat = {
    locale?: string;
    timeZone?: string;
};
/**
 * A message's time as the swipe shows it: the short time ("2:05 PM") today, with the date before
 * it on another day ("Nov 3, 2:05 PM"), and the year when it is not this year.
 */
export declare function messageTime(at: Date | Timestamp | undefined, now?: Date, f?: TimeFormat): string;
export type ReceiptPerson = {
    userId: string;
    name: string;
    avatarUrl: string;
    at: Date;
};
/**
 * Message info: who has read it (earliest first) and who has it but has not read it yet. Members
 * whose read receipts are off are not in `receipts.members` and so are in neither.
 */
export declare function receiptPeople(receipts: Receipts | undefined): {
    read: ReceiptPerson[];
    delivered: ReceiptPerson[];
};
/**
 * Messages with the receipts a Watch event carries put on them. The same array comes back when
 * none of them is in the list, so a store can skip the update.
 */
export declare function applyReceiptsChanged(messages: readonly Message[], changed: ReceiptsChanged): Message[];
/** Messages with every receipt taken off (the person turned theirs off). */
export declare function clearReceipts(messages: readonly Message[]): Message[];
/** The most conversations one MarkDelivered names (api MaxDelivered). */
export declare const MAX_DELIVERED = 200;
/**
 * What a chat list that just arrived has delivered to this device: each conversation with
 * something unread, by its newest message, skipping messages already said. Unread counts only
 * what others wrote, so my own newest message is never named. `said` is updated in place.
 */
export declare function deliveriesToAck(conversations: readonly Conversation[], said: Set<string>): {
    conversationId: string;
    messageId: string;
}[];
