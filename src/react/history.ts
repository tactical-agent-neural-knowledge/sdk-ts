import { type Message, MessageKind } from "../contracts/tank/message/v1/message_pb.js";

/**
 * What the composer recalls on ↑: your own messages where you are typing, newest first.
 *
 * Only real messages, not system lines or agent events; nothing deleted; nothing empty
 * (a picture with no words has nothing to re-send as text); and a message repeated
 * back to back counts once, so ↑ ↑ does not show the same text twice.
 */
export function recentOwn(messages: readonly Message[], meId: string | undefined, limit = 20): Message[] {
  if (!meId) return [];
  const out: Message[] = [];
  for (let i = messages.length - 1; i >= 0 && out.length < limit; i--) {
    const m = messages[i];
    if (!m || m.authorId !== meId || m.kind !== MessageKind.MESSAGE || m.deletedAt || !m.text.trim()) continue;
    if (out[out.length - 1]?.text === m.text) continue;
    out.push(m);
  }
  return out;
}

/** Where the composer is in its history: -1 is "typing fresh", otherwise an index into recentOwn. */
export interface Recall {
  index: number;
  /** The text the composer was given at that index, to tell "unchanged" from "edited". */
  text: string;
}
export const noRecall: Recall = { index: -1, text: "" };

export type RecallStep =
  | { kind: "ignore" }
  | { kind: "hold" }
  | { kind: "clear"; state: Recall }
  | { kind: "show"; message: Message; state: Recall };

/**
 * What ↑ (dir 1) or ↓ (dir -1) does, given the history and what the composer holds now.
 * Only an empty composer, or one still showing a recalled message unchanged, moves through
 * history; typed text keeps the arrow keys for the caret. ↓ past the newest clears the box.
 * "hold" means the key is spent with nothing to do, so the caret does not jump.
 */
export function recallStep(
  state: Recall,
  dir: 1 | -1,
  list: readonly Message[],
  current: string,
): RecallStep {
  const atRecalled = state.index >= 0 && current === state.text;
  if (current.trim() !== "" && !atRecalled) return { kind: "ignore" };
  const next = state.index + dir;
  if (next >= list.length) return state.index >= 0 ? { kind: "hold" } : { kind: "ignore" };
  if (next < 0) return state.index < 0 ? { kind: "ignore" } : { kind: "clear", state: noRecall };
  const message = list[next];
  if (!message) return { kind: "ignore" };
  return { kind: "show", message, state: { index: next, text: message.text } };
}
