# Neurons · src/blocks

refreshed 2026-11-16 · ad2838acc55d

- `src/blocks/builders.ts` is the constructor surface (`blocks`, `section`, `actions`, `planCard`, `diffPreview`, `ciStatus`, `approvalPrompt`, `toolLog`, `statusCard`, `filePreview`); `index.ts` re-exports it with `export *`.
- `src/blocks/types.ts` re-exports generated `blocks_pb` and `richtext_pb` types plus `BLOCK_KINDS`; use these, not a new DTO.
- `normalizeBlocks()` in `src/blocks/normalize.ts` drops blocks with no kind case, de-duplicates `blockId` by suffixing `_2`, and caps lists with `LIMITS` (blocks 50, fields 10, buttons 10, fieldValue 2000, textElement 3000).
- `validateBlocks()` in `src/blocks/normalize.ts` returns `BlockIssue[]` without changing input; use it in tests and when rejecting agent output.
- `runTone()` in `src/blocks/runTone.ts` is the single RunState to tone map; `RUN_TONE_MUI_COLOR` and `RUN_TONE_PAPER_COLOR` in the same file are the colour maps both renderers must use.
- Trap: `runTone` maps `UNSPECIFIED` to `cancelled`, and `FAILED`, `BUDGET_EXHAUSTED`, `TIMED_OUT`, `APPROVAL_EXPIRED` to `failed`; a new RunState falls through to `running`, so add it explicitly.
- `src/blocks/richtext.ts` builds `RichText` (`rt`, `richText`, `codeBlock`, `broadcastRange`) and converts back with `richTextToPlain` for copy and plain previews.
- `src/blocks/plan.ts` builds plan markdown (`planMarkdown`), the download file name (`planFileName`) and progress (`planProgress`); `src/blocks/marks.ts` maps step status to `MarkKind`.
- `src/blocks/reveal.ts` holds the `ACTION_REVEAL_KEY`, `REVEAL_COPIED` and `REVEAL_GONE` constants for the one-time key reveal button.
- Tests: `blocks.test.ts`, `plan.test.ts` and `runTone.test.ts` cover builders, plans and tone mapping.

## Verified
- none run in this refresh: `pnpm install --frozen-lockfile` could not reach the npm registry from the sandbox (ENETUNREACH), so lint, typecheck and tests were not run here; CI runs `pnpm check`.
