# Neurons · src/topo

refreshed 2026-10-04 · 5378a111dd9c

- Client-side logic for the Topo strip (the minimap beside a Tread): which mark families to draw, and how to turn search results into marks. Shared by web and mobile so a mark cannot mean one thing on each.
- `src/topo/visibility.ts` `visibleMarkTypes(prefs)` is the entry point for "what does this person see"; `isMarkVisible(type, prefs)` is the per-mark form.
- `prefs.configured` is the whole trick: it separates "never chosen" from "turned everything off". Without it an empty `visible` list would silently reopen the defaults for someone who deliberately cleared them.
- `DEFAULT_VISIBLE_MARKS` is four families — `MENTION`, `WAITING_ON`, `READ_HORIZON`, `EVENT`. `OWN_MESSAGE` and `ARTIFACT` are off by default because they are the high-volume ones, and a Tread where most messages are marked is a Tread where no mark means anything.
- `TOGGLEABLE_MARKS` is the six a person can turn on, in the order a legend should list them — use it for UI ordering rather than re-deriving one.
- `isAlwaysVisible` makes `SEARCH_HIT` bypass the toggles entirely: hits exist only while a search runs, so they cannot accumulate into noise, and hiding a hit the viewer just asked for reads as the search being broken.
- `markLabel(type)` holds the human strings ("Mentions you", "Where you left off", "Deploys and merges") so the legend and the hover cannot disagree.
- `src/topo/searchMarks.ts` `marksFromSearchHits(hits, channelId)` builds marks locally from `SearchHit`s, which already carry the message and therefore its `channel_seq` — no second round trip, which is what makes the strip light up with the results.
- It skips hits whose `channelId` differs, since a workspace-wide search returns other channels; mark ids are `search:<messageId>`, lane `MESSAGE`, elevation `70` (above chatter, below a mention), preview from `highlights[0]` or the first 140 chars.
- Output is sorted ascending by `channelSeq`, so "next hit" means further down the Tread rather than higher ranked.
- `./topo` is a real export subpath in `package.json` even though `CLAUDE.md`'s subpath list omits it.

## Verified

`pnpm lint`, `pnpm typecheck`, `pnpm vitest run src/topo`
