import { type Message } from "../contracts/tank/message/v1/message_pb.js";
/**
 * What the composer recalls on ↑: your own messages where you are typing, newest first.
 *
 * Only real messages, not system lines or agent events; nothing deleted; nothing empty
 * (a picture with no words has nothing to re-send as text); and a message repeated
 * back to back counts once, so ↑ ↑ does not show the same text twice.
 */
export declare function recentOwn(messages: readonly Message[], meId: string | undefined, limit?: number): Message[];
