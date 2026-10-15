import { type Message } from "../contracts/tank/message/v1/message_pb.js";
/**
 * What the composer recalls on ↑: your own messages where you are typing, newest first.
 *
 * Only real messages, not system lines or agent events; nothing deleted; nothing empty
 * (a picture with no words has nothing to re-send as text); and a message repeated
 * back to back counts once, so ↑ ↑ does not show the same text twice.
 */
export declare function recentOwn(messages: readonly Message[], meId: string | undefined, limit?: number): Message[];
/** Where the composer is in its history: -1 is "typing fresh", otherwise an index into recentOwn. */
export interface Recall {
    index: number;
    /** The text the composer was given at that index, to tell "unchanged" from "edited". */
    text: string;
}
export declare const noRecall: Recall;
export type RecallStep = {
    kind: "ignore";
} | {
    kind: "hold";
} | {
    kind: "clear";
    state: Recall;
} | {
    kind: "show";
    message: Message;
    state: Recall;
};
/**
 * What ↑ (dir 1) or ↓ (dir -1) does, given the history and what the composer holds now.
 * Only an empty composer, or one still showing a recalled message unchanged, moves through
 * history; typed text keeps the arrow keys for the caret. ↓ past the newest clears the box.
 * "hold" means the key is spent with nothing to do, so the caret does not jump.
 */
export declare function recallStep(state: Recall, dir: 1 | -1, list: readonly Message[], current: string): RecallStep;
