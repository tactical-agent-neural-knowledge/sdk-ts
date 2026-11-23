# Neurons · src/blocks

refreshed 2026-11-23 · 5a19bf7e597e

- `src/blocks/builders.ts` is the constructor surface (`blocks`, `header`, `section`, `context`, `divider`, `actions`, `planCard`, `diffPreview`, `ciStatus`, `approvalPrompt`, `toolLog`, `statusCard`, and the file preview builder); `index.ts` re-exports it.
- `src/blocks/types.ts` re-exports the generated `blocks_pb` and `richtext_pb` types; use these, not a new DTO.
- `normalizeBlocks()` in `src/blocks/normalize.ts` (line ~289) is the write-side guard; `LIMITS` at line 6 names every cap.
- `validateBlocks()` in `src/blocks/normalize.ts` (line ~316) returns `BlockIssue[]` without changing its input; use it in tests and when rejecting agent output.
- `runTone()` in `src/blocks/runTone.ts` (line 10) is the single `RunState` to `RunTone` map; `RUN_TONE_MUI_COLOR` (line 68) and `RUN_TONE_PAPER_COLOR` (line 78) in the same file are the colour maps both renderers must use.
- Trap: `runTone` groups `UNSPECIFIED` with `CANCELLED`, and `FAILED`, `BUDGET_EXHAUSTED`, `TIMED_OUT` and `APPROVAL_EXPIRED` are `failed`; a new `RunState` must be added to that switch explicitly.
- `isTerminalRunState()` (line 33) and `runStatusPhrase()` (line 120) sit beside `runTone`; read them before adding a state label anywhere else.
- `src/blocks/richtext.ts` builds `RichText` (`rt`, `richText`, `codeBlock`, `broadcastRange`) and converts back with `richTextToPlain` for copy and plain previews.
- `src/blocks/plan.ts` builds plan markdown (`planMarkdown`), the download file name (`planFileName`) and progress (`planProgress`); `src/blocks/marks.ts` maps step status to `MarkKind`.
- `src/blocks/reveal.ts` holds `ACTION_REVEAL_KEY` (`neural.key.reveal`), `REVEAL_COPIED` and `REVEAL_GONE` for the one-time key reveal; never log or store the revealed value.
- Tests: `blocks.test.ts`, `plan.test.ts` and `runTone.test.ts` cover builders, plans and tone mapping.

## Verified
- none run in this refresh: `pnpm install --frozen-lockfile` failed in the sandbox (no pnpm fetch, no node_modules), so lint, typecheck and tests were not run; CI runs `pnpm check`.
