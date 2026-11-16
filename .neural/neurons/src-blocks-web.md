# Neurons · src/blocks-web

refreshed 2026-11-16 · ad2838acc55d

- Entry point is `BlocksView` in `BlocksView.tsx`; it renders a message's blocks with MUI and expects a ThemeProvider wrapped with `tankTheme` (`theme.ts`).
- `BlockView` in `BlocksView.tsx` switches on `block.kind.case` for the 12 kinds and returns null for unknown kinds; a new kind is added there and in `blocks-native`.
- Every block component lives in `blocks.tsx` (about 1,100 lines); `BlockContext` carries `resolveUser`, `resolveChannel`, `formatTime`, `planFile` and `revealKey`.
- `RichTextView.tsx` renders rich text: `ElementView` per element, tables through `TableView` with `cellAlign`.
- `theme.ts` augments the MUI `Palette` with the `tank` colours (panel, overlay, agent, ai, alert and text variants) through a module declaration.
- Run-state colours come from `RUN_TONE_MUI_COLOR` in `src/blocks/runTone.ts`; do not add a local map.
- Parity: a feature here must also land in `src/blocks-native` in the same change (guardrail 380454556067254325).
- Snapshot tests: `BlocksView.test.tsx` renders each `FIXTURE_NAMES` entry and matches `innerHTML`; update only on a deliberate visual change (`pnpm vitest run -u src/blocks-web`).
- `Mark.tsx` renders the marks defined in `src/blocks/marks.ts`; keep the mark list shared with native.

## Verified
- none run in this refresh: `pnpm install --frozen-lockfile` could not reach the npm registry from the sandbox (ENETUNREACH), so lint, typecheck and tests were not run here; CI runs `pnpm check`.
