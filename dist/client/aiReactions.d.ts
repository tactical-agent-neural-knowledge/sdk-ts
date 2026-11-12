import { type Reaction } from "../contracts/tank/ai/v1/ai_pb.js";
/**
 * Emoji reactions on Neural messages (Robby, 2026-11-12: "I need to be able to add an emoji as a
 * reaction"), shared by web and mobile so both offer the same row and change it the same way.
 * The server's answer (AddReaction / RemoveReaction, WatchResponse.reactions) always replaces
 * what `applyReaction` guessed.
 */
/** The row of quick reactions at the top of a message's options, in this order. */
export declare const QUICK_REACTIONS: readonly string[];
/** A workspace's own emoji is written ":name:"; a personal chat offers standard emoji only. */
export declare function isCustomEmoji(emoji: string): boolean;
/**
 * Reactions with `userId`'s `emoji` added (`on`) or taken away, as the server would store it: an
 * emoji keeps its place, a new one goes last, one nobody holds any more goes. Adding one already
 * there or removing one that is not changes nothing.
 */
export declare function applyReaction(reactions: readonly Reaction[], emoji: string, userId: string, on: boolean): Reaction[];
/** Whether `userId` put `emoji` on the message. */
export declare function reacted(reactions: readonly Reaction[], emoji: string, userId: string): boolean;
