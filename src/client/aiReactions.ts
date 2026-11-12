import { create } from "@bufbuild/protobuf";
import { type Reaction, ReactionSchema } from "../contracts/tank/ai/v1/ai_pb.js";

/**
 * Emoji reactions on Neural messages (Robby, 2026-11-12: "I need to be able to add an emoji as a
 * reaction"), shared by web and mobile so both offer the same row and change it the same way.
 * The server's answer (AddReaction / RemoveReaction, WatchResponse.reactions) always replaces
 * what `applyReaction` guessed.
 */

/** The row of quick reactions at the top of a message's options, in this order. */
export const QUICK_REACTIONS: readonly string[] = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

/** A workspace's own emoji is written ":name:"; a personal chat offers standard emoji only. */
export function isCustomEmoji(emoji: string): boolean {
  return emoji.length > 2 && emoji.startsWith(":") && emoji.endsWith(":");
}

/**
 * Reactions with `userId`'s `emoji` added (`on`) or taken away, as the server would store it: an
 * emoji keeps its place, a new one goes last, one nobody holds any more goes. Adding one already
 * there or removing one that is not changes nothing.
 */
export function applyReaction(
  reactions: readonly Reaction[],
  emoji: string,
  userId: string,
  on: boolean,
): Reaction[] {
  const out: Reaction[] = [];
  let found = false;
  for (const r of reactions) {
    if (r.emoji !== emoji) {
      out.push(r);
      continue;
    }
    found = true;
    const has = r.userIds.includes(userId) || r.mine;
    if (on === has) {
      out.push(r);
      continue;
    }
    const userIds = on ? [...r.userIds, userId] : r.userIds.filter((u) => u !== userId);
    const count = Math.max(0, r.count + (on ? 1 : -1));
    if (count > 0) out.push(create(ReactionSchema, { emoji, count, mine: on, userIds }));
  }
  if (!found && on) out.push(create(ReactionSchema, { emoji, count: 1, mine: true, userIds: [userId] }));
  return out;
}

/** Whether `userId` put `emoji` on the message. */
export function reacted(reactions: readonly Reaction[], emoji: string, userId: string): boolean {
  const r = reactions.find((x) => x.emoji === emoji);
  return !!r && (r.mine || r.userIds.includes(userId));
}
