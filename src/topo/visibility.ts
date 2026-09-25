import { MarkType } from "../contracts/tank/topo/v1/topo_pb.js";
import type { TopoPreferences } from "../contracts/tank/workspace/v1/workspace_pb.js";

/**
 * What the strip draws when nobody has chosen.
 *
 * Four categories, which is the cap R5 sets, and they are the four that earn it: a mention is
 * addressed to you, a waiting-on is owed by or to you, the read horizon is one line, and events are
 * rare by nature. Your own messages and artifacts are deliberately off — they are the two
 * high-volume families, and a Tread where most messages are marked is a Tread where no mark means
 * anything.
 */
export const DEFAULT_VISIBLE_MARKS: readonly MarkType[] = [
  MarkType.MENTION,
  MarkType.WAITING_ON,
  MarkType.READ_HORIZON,
  MarkType.EVENT,
];

/** Every family a person can turn on, in the order a legend should list them. */
export const TOGGLEABLE_MARKS: readonly MarkType[] = [
  MarkType.MENTION,
  MarkType.WAITING_ON,
  MarkType.READ_HORIZON,
  MarkType.EVENT,
  MarkType.OWN_MESSAGE,
  MarkType.ARTIFACT,
];

/**
 * Search hits ignore the toggles entirely.
 *
 * They exist only while a search is running and vanish when it clears, so they cannot accumulate
 * into noise — and a hit the viewer just asked for, hidden because a preference said so, would read
 * as the search being broken.
 */
export function isAlwaysVisible(type: MarkType): boolean {
  return type === MarkType.SEARCH_HIT;
}

/**
 * The mark families to draw for this person.
 *
 * `configured` is what separates "never chosen" from "turned everything off"; without it an empty
 * list would silently reopen the defaults for somebody who had deliberately cleared them.
 */
export function visibleMarkTypes(prefs: TopoPreferences | undefined): Set<MarkType> {
  if (!prefs?.configured) return new Set(DEFAULT_VISIBLE_MARKS);
  return new Set(prefs.visible);
}

/** Whether a mark should be drawn, given the person's preferences. */
export function isMarkVisible(type: MarkType, prefs: TopoPreferences | undefined): boolean {
  return isAlwaysVisible(type) || visibleMarkTypes(prefs).has(type);
}

/** Human labels, shared so the legend and the hover cannot disagree. */
export function markLabel(type: MarkType): string {
  switch (type) {
    case MarkType.MENTION:
      return "Mentions you";
    case MarkType.OWN_MESSAGE:
      return "Your messages";
    case MarkType.READ_HORIZON:
      return "Where you left off";
    case MarkType.SEARCH_HIT:
      return "Search hits";
    case MarkType.WAITING_ON:
      return "Waiting on a reply";
    case MarkType.ARTIFACT:
      return "Files, links and code";
    case MarkType.EVENT:
      return "Deploys and merges";
    default:
      return "Marks";
  }
}
