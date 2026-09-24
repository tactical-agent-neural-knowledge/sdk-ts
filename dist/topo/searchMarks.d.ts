import type { SearchHit } from "../contracts/tank/search/v1/search_pb.js";
import { type Mark } from "../contracts/tank/topo/v1/topo_pb.js";
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
export declare function marksFromSearchHits(hits: readonly SearchHit[], channelId: string): Mark[];
