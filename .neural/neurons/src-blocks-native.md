# Neurons · src/blocks-native

refreshed 2026-11-23 · 5a19bf7e597e

- This folder is the only place `react-native` and `react-native-paper` may be imported; `src/exports.test.ts` enforces it.
- Entry point is `BlocksViewNative` in `BlocksViewNative.tsx`; `BlockViewNative` switches on `block.kind.case` and returns null for unknown kinds, so a new kind is added there and in `src/blocks-web` in the same change.
- Options flow through `BlocksNativeContext` and `useBlocksOptions()` in `context.ts`: `onAction`, `formatTime`, `codeFontFamily` (defaults to `DEFAULT_CODE_FONT`, line 35), `openUrl`, `planFile`, `revealKey`.
- Every block component lives in `blocks.tsx` (about 1,100 lines); tones come from `RUN_TONE_PAPER_COLOR` in `src/blocks/runTone.ts`, not a local map.
- `index.ts` also exports `ToneChip`, `chipColors`, `semanticColors` and `accentColor` for apps that match the native look.
- `RichTextViewNative.tsx` renders rich text through `ElementViewNative`; its tests are `RichTextViewNative.test.tsx`.
- Snapshot tests: `BlocksViewNative.test.tsx` renders each `FIXTURE_NAMES` entry with `react-test-renderer` and matches `__snapshots__/`; update only on a deliberate visual change (`pnpm vitest run -u src/blocks-native`).
- Real `react-native` is a dev dependency for types only; tests run against the Vitest stand-ins in `src/test/mocks/`.

## Verified
- none run in this refresh: `pnpm install --frozen-lockfile` failed in the sandbox (no pnpm fetch, no node_modules), so lint, typecheck and tests were not run; CI runs `pnpm check`.
