# Neurons · src/blocks-web

refreshed 2026-11-23 · 5a19bf7e597e

- Public surface is `src/blocks-web/index.ts`: `BlocksView`, `BlockView`, `RichTextView`, `ElementView`, `Mark`, `tankTheme` and `muiThemeOptions`.
- Entry point is `BlocksView` in `BlocksView.tsx`; it renders a message's blocks with MUI and expects a ThemeProvider wrapped with `tankTheme` (`theme.ts`).
- `BlockView` in `BlocksView.tsx` switches on `block.kind.case`; a new kind is added there and in `src/blocks-native` in the same change.
- Every block component lives in `blocks.tsx` (about 1,100 lines); `BlockContext` (line 47) carries `resolveUser`, `resolveChannel`, `formatTime`, `planFile` and `revealKey`.
- `blocks.tsx` exports `planConflicts` (line 559) and `GUARDRAIL_STATE` (line 550) for the guardrail checks on a plan card; keep those next to the card, not in a second file.
- `RichTextView.tsx` renders rich text: `ElementView` per element, tables through `TableView` with `cellAlign`.
- Run-state colours come from `RUN_TONE_MUI_COLOR` in `src/blocks/runTone.ts`; do not add a local map.
- `theme.ts` augments the MUI `Palette` with the `tank` colours through a module declaration.
- `Mark.tsx` renders the marks defined in `src/blocks/marks.ts`; keep the mark list shared with native.
- Snapshot tests: `BlocksView.test.tsx` renders each `FIXTURE_NAMES` entry and matches `__snapshots__`; update only on a deliberate visual change (`pnpm vitest run -u src/blocks-web`).

## Verified
- none run in this refresh: `pnpm install --frozen-lockfile` failed in the sandbox (no pnpm fetch, no node_modules), so lint, typecheck and tests were not run; CI runs `pnpm check`.
