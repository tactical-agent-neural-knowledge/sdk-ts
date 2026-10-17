# Neurons · src/blocks
refreshed 2026-10-17 · 6b360350cf49

- Exports: `builders.ts` (block builders), `normalize.ts` (`normalizeBlocks`, `normalizeRichText`, `validateBlocks`, `truncate`, `LIMITS`), `richtext.ts` (`richText`, `rt`, `codeBlock`, `richTextToPlain`, `elementToPlain`), `runTone.ts`, `types.ts`.
- `runTone.ts` owns the state→colour mapping shared by both renderers: `runTone(state)` → `RunTone` ("running"/"awaiting"/"done"/"failed"/"cancelled"), `RUN_TONE_MUI_COLOR` (MUI palette keys), `RUN_TONE_PAPER_COLOR` (Paper MD3 slots).
- `runStatusPhrase(state)` added in fcff541 — returns what the run is doing in a person's words for UI strips ("Waiting for your go to merge", "Watching the checks"); `runStateLabel` returns the technical name.
- `isTerminalRunState(state)` returns true once a run can no longer change state (done, failed, cancelled, budget_exhausted, timed_out, approval_expired).
- `LIMITS` in `normalize.ts` defines the block count/size constraints enforced by `validateBlocks`; violations are returned as `BlockIssue[]`.
- No `react-native` imports anywhere in this directory — it is consumed by both `blocks-web` and `blocks-native`.
- `src/blocks/types.ts` defines the TypeScript types for block payloads; `builders.ts` has convenience constructors.

## Verified
pnpm vitest run src/blocks
