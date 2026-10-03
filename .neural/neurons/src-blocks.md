# Neurons · src/blocks

refreshed 2026-10-03 · f9489740a406

- This is the platform-free half of "Threaded Action Cards": types, builders, normalizer, rich-text helpers and `runTone`. It imports no React and no UI toolkit, so web and mobile cannot disagree about what a card means.
- `src/blocks/types.ts` re-exports the `tank.blocks.v1` and `tank.richtext.v1` message types so consumers never import a generated path; `BLOCK_KINDS` is the 12-kind list, written `as const satisfies readonly BlockKind[]` so a kind added to the proto but forgotten here is a type error.
- `src/blocks/builders.ts` is the authoring entry point — `blocks(...)` wraps items into the `Blocks` message that `Message.blocks` holds, and every per-kind builder goes through one private `block(kind, blockId = "")`, leaving the id empty for the normalizer to fill.
- `src/blocks/normalize.ts` `normalizeBlocks` fills missing ids as `b1`, `b2`, …, de-duplicates collisions with `_2`/`_3` suffixes, drops blocks with no `kind`, and is idempotent — normalizing twice is a no-op, which is what the fixture round-trip relies on.
- `LIMITS` in `normalize.ts` is the single cap table (~35 entries: `blocks: 50`, `headerText: 150`, `buttons: 10`, `textElement: 3000`, …); `truncate` cuts to the cap and appends `…`, so over-long input is clipped rather than rejected.
- `validateBlocks` returns `BlockIssue[]` with dotted paths like `blocks[2].actions.buttons[0].action_id` — use it for authoring feedback; `normalizeBlocks` is what you call before sending.
- `src/blocks/runTone.ts` maps `RunState` to five tones (`running`/`awaiting`/`done`/`failed`/`cancelled`); `awaiting` is the two approval states, `failed` folds in `BUDGET_EXHAUSTED`, `TIMED_OUT` and `APPROVAL_EXPIRED`. `isTerminalRunState` is derived from the tone, so a new terminal state only needs the switch updated once.
- `src/blocks/richtext.ts` exposes the `rt.*` inline element builders and the `richText()` helper; elements are constructed as plain `$typeName`-tagged literals, not via `create()`, so they stay cheap.
- Golden fixtures live in `fixtures/*.json` and are driven by `src/test/fixture-defs.ts`; `src/blocks/blocks.test.ts` asserts the eight in order (`plan, diff, ci-green, ci-red, approval, tool-log, status, file`) and that each fixture normalizes to itself.
- Changing a builder's output means regenerating goldens with `UPDATE_FIXTURES=1 pnpm test` — and that also invalidates the web and native renderer snapshots.
- Area check: `pnpm vitest run src/blocks/` (the trailing slash matters — `src/blocks` also matches `src/blocks-web` and `src/blocks-native`).

## Verified

`pnpm lint`, `pnpm typecheck`, `pnpm vitest run src/blocks/`
