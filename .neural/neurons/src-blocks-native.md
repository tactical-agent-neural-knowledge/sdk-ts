# Neurons · src/blocks-native

refreshed 2026-11-16 · ad2838acc55d

- This folder is the only place `react-native` and `react-native-paper` may be imported; `src/exports.test.ts` enforces it.
- Entry point is `BlocksViewNative` in `BlocksViewNative.tsx`; `BlockViewNative` switches on `block.kind.case` for the 12 kinds and returns null for unknown kinds, so a new kind must be added there and in `blocks-web`.
- Options flow through `BlocksNativeContext` and `useBlocksOptions()` in `context.ts`: `onAction`, `formatTime`, `codeFontFamily` (default `fonts.code.expoFonts[400]`), `openUrl` (default `Linking.openURL`), `planFile`, `revealKey`.
- Every block component lives in `blocks.tsx` (about 1,000 lines); tones come from `RUN_TONE_PAPER_COLOR` in `src/blocks/runTone.ts`, not a local map.
- Trap: a table in a card scrolls sideways in a horizontal `ScrollView` (`RichTextViewNative.tsx` around line 169); the comment near lines 178-180 explains an iOS touch-down responder issue, so read it before wrapping that area in a `Pressable` (commit 48af999).
- Parity: a feature here must also land in `src/blocks-web` in the same change (guardrail 380454556067254325, mobile and web parity).
- Snapshot tests: `BlocksViewNative.test.tsx` renders each `FIXTURE_NAMES` entry with `react-test-renderer` and matches `__snapshots__/`; update only on a deliberate visual change (`pnpm vitest run -u src/blocks-native`).
- Real `react-native` is a dev dependency for types only; tests run against the Vitest stand-ins in `src/test/mocks/`.
- `index.ts` also exports `ToneChip`, `chipColors`, `semanticColors` and `accentColor` for apps that match the native look.

## Verified
- none run in this refresh: `pnpm install --frozen-lockfile` could not reach the npm registry from the sandbox (ENETUNREACH), so lint, typecheck and tests were not run here; CI runs `pnpm check`.
