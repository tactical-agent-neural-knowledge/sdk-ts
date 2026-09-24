import { create } from "@bufbuild/protobuf";
import type { SearchHit } from "../contracts/tank/search/v1/search_pb.js";
import { Lane, type Mark, MarkSchema, MarkType } from "../contracts/tank/topo/v1/topo_pb.js";

/** Elevation for a search hit: high enough to read over chatter, below a mention. */
const SEARCH_ELEVATION = 70;

/**
 * Turns in-channel search hits into Topo marks, client-side.
 *
 * Search hits already carry the message and therefore its `channel_seq`, which is the strip's
 * axis — so the strip can light up the instant results land, with no second round trip. That is
 * what makes R2's "within 200ms of results returning" achievable at all: the only latency is the
 * search itself.
 *
 * Shared by both clients so a hit cannot mean one thing on web and another on mobile.
 */
export function marksFromSearchHits(hits: readonly SearchHit[], channelId: string): Mark[] {
  const marks: Mark[] = [];
  for (const hit of hits) {
    const msg = hit.message;
    // A workspace-wide search can return other channels; a strip only maps its own.
    if (!msg || hit.channelId !== channelId) continue;
    marks.push(
      create(MarkSchema, {
        id: `search:${msg.id}`,
        channelId,
        messageId: msg.id,
        channelSeq: msg.channelSeq,
        type: MarkType.SEARCH_HIT,
        lane: Lane.MESSAGE,
        elevation: SEARCH_ELEVATION,
        preview: hit.highlights[0] ?? msg.text.slice(0, 140),
      }),
    );
  }
  // Ascending seq, so "next hit" means "further down the Tread" rather than "higher ranked".
  return marks.sort((a, b) => (a.channelSeq < b.channelSeq ? -1 : a.channelSeq > b.channelSeq ? 1 : 0));
}
