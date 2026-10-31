# Neurons · src/blocks

refreshed 2026-10-31 · bf59edafde49

- `src/blocks/index.ts` is the barrel for `./blocks`; it re-exports from `builders.ts`, `marks.ts`, `normalize.ts`, `plan.ts`, `richtext.ts`, `runTone.ts`, and `types.ts`.
- `src/blocks/runTone.ts` maps `RunState` → `RunTone` (`"running" | "awaiting" | "done" | "failed" | "cancelled"`): `AWAITING_PLAN_APPROVAL` and `AWAITING_MERGE_APPROVAL` → `"awaiting"`; `DONE` → `"done"`; `FAILED`, `BUDGET_EXHAUSTED`, `TIMED_OUT`, `APPROVAL_EXPIRED` → `"failed"`; `CANCELLED`/`UNSPECIFIED` → `"cancelled"`; all others → `"running"`. Also exports `isTerminalRunState`, `RUN_TONE_MUI_COLOR`, `RUN_TONE_PAPER_COLOR`, `runStateLabel`, and `runStatusPhrase`.
- `isTerminalRunState(state)` returns `true` when `runTone` returns `"done"`, `"failed"`, or `"cancelled"` — both renderers use this to stop polling.
- `src/blocks/builders.ts` exports typed block constructors: `blocks()`, `header()`, `section()`, `field()`, `divider()`, `context()`, `actions()`, `ciStatus()`, `statusCard()`, `planCard()`, `diffPreview()`, `filePreview()`, `toolLog()`, `approvalPrompt()`. All return `Block` or `Blocks` protobuf messages created with `@bufbuild/protobuf` `create()`.
- `src/blocks/richtext.ts` exports `richText(input)` (builds a `RichText` protobuf from a string, nested array, or template), `rt` (template-literal alias), `richTextToPlain`, `elementToPlain`, `broadcastRange`, `broadcastWord`, `codeBlock`, and `TextStyle`.
- `src/blocks/normalize.ts` exports `normalizeBlocks`, `normalizeRichText`, `validateBlocks`, `truncate`, `LIMITS`, and `BlockIssue` — the normalizer the server runs before storing; clients call it before sending to avoid a round-trip rejection.
- `src/blocks/types.ts` re-exports `Block`, `Blocks`, `Button`, `Check`, `Confirm`, `DiffFile`, `Field`, `GateKind`, `PlanStep`, `StepStatus`, `ToolLogEntry` from `contracts/tank/blocks` and `RichText` from `contracts/tank/richtext` — consumers import from `./blocks`, never from the deep contracts path.
- `src/blocks/marks.ts` exports `MarkKind`, `MarkSpec`, `MARKS`, `MARK_HEX`, `planMark`, `planItemMark`, `stepMark`, `progressMark` — the mark type registry for the Topo strip.
- `src/blocks/plan.ts` exports `planGlance`, `planProgress`, `planItemEmoji`, `stepEmoji` — helpers for summarising a `TreadPlan` into a status line or an emoji.
- `runTone` lives in `./blocks` (not `./blocks-web` or `./blocks-native`) so both renderers share one state-to-colour mapping without a circular dependency.

## Verified

`pnpm lint`, `pnpm typecheck`, `pnpm vitest run src/blocks/`
