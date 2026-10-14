# Neurons · src/design

refreshed 2026-10-14T19:15:56Z · 8eebea37f816

- `src/design/tokens.ts` is the single source of truth feeding both `mui.ts` (web) and `paper.ts` (mobile); upstream of that is `docs/brand/COLOR_PALETTE.json` in the `docs` repo.
- `tokens.ts` exports both brand hexes and per-scheme text-safe `shades`; `contrast.test.ts` pins this with an explicit known-failure case (Cybernetic Purple on Deep Abyss Black fails AA) so nobody "fixes" the assertion instead of the color.
- `mui.ts`'s `tank` palette namespace (`panel`, `overlay`, `primaryText`, `secondaryText`, `warningText`, plus `agent`/`ai`/`alert` accents) requires the module augmentation declared in `src/blocks-web/theme.ts` to type-check — importing `mui.ts` alone in a consumer without that augmentation loses the extra keys.
- `paper.ts` exports plain MD3-shaped theme data with zero `react-native` imports on purpose — that's what lets it live outside `src/blocks-native` without tripping `src/exports.test.ts`'s RN-isolation scan.
- `contrast.ts` implements the WCAG math directly (`hexToRgb`, `relativeLuminance`, `contrastRatio`) with thresholds `WCAG.AA_TEXT = 4.5`, `AA_LARGE = 3`, `AAA_TEXT = 7`, and a `meetsAA` helper; `contrast.test.ts` runs it exhaustively over 66 foreground/background pairs.
- `fonts.ts` ships names and sources only — Google Fonts URLs for web, `@expo-google-fonts/*` package names for mobile — never binaries; `fonts.code.expoFonts[400]` is read directly by `src/blocks-native/context.ts`'s `DEFAULT_CODE_FONT`.
- New this sync: `src/design/palette.ts` is a "board/drawing-tool" palette so Neuralboards store a token name, not a raw hex — `boardFills`, `stickyFills` and `boardStrokes` are named `Swatch[]` (`{name, hex, ink}`), `boardTextSizes`/`boardFonts` are plain arrays, `hexFor(name)`/`tokenFor(hex)` round-trip between the two, case-insensitively and whitespace-trimmed.
- Every `Swatch` in `palette.ts` carries its own `ink` (the readable text/stroke color for that fill) and `palette.test.ts` asserts `contrastRatio(s.ink, s.hex) >= WCAG.AA_LARGE` for all of them — adding a fill without an AA-passing `ink` fails this test, not just a visual review.
- `src/design/index.ts` re-exports `palette.ts`'s eight names (`boardFills, boardFonts, boardStrokes, boardTextSizes, hexFor, stickyFills, tokenFor, type Swatch`) alongside the pre-existing tokens/mui/paper/contrast/fonts exports — it is the only file under `./design` that changed to wire the new module in.
- `@mui/material` is imported here only for types (module augmentation, `ThemeOptions`), never as a runtime dependency of `src/design` itself.

## Verified

(none — this sandbox has no network access and no `node_modules`; `pnpm install` fails with `ENETUNREACH`/`ETIMEDOUT`, so lint/typecheck/`vitest run src/design` could not be run here)
