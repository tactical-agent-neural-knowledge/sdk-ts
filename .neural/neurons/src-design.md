# Neurons · src/design

refreshed 2026-10-04 · 5378a111dd9c

- One token source feeds both platforms: `src/design/tokens.ts` → `muiThemeOptions` (`mui.ts`) for web and `paperDarkTheme`/`paperLightTheme` (`paper.ts`) for mobile. Never hand-pick a hex in a renderer.
- The upstream source of truth for the palette is `docs/brand/COLOR_PALETTE.json` in the `docs` repo; `tokens.ts` is the vendored projection of it.
- `tokens.ts` exports both brand hexes *and* text-safe `shades` per scheme, because several brand fills are unreadable as text — `contrast.test.ts` pins this with an explicit case: Cybernetic Purple on Deep Abyss Black is below AA, which is why `shades.purple.text` exists.
- `src/design/mui.ts` adds a `tank` namespace to the MUI palette (`panel`, `overlay`, `primaryText`, `secondaryText`, `warningText`, plus the three accents `agent` = secondary/purple, `ai` = primary/cyan, `alert` = warning/amber); consumers read `theme.palette.tank.*` and need the module augmentation that `src/blocks-web/theme.ts` provides.
- `src/design/paper.ts` exports **plain data** shaped like MD3 `colors` and imports nothing from react-native — mobile spreads it over `MD3DarkTheme`/`MD3LightTheme` itself. That is what keeps `react-native` out of this directory and out of `src/exports.test.ts`'s scan.
- `src/design/contrast.ts` is the WCAG 2.x maths: `hexToRgb` (3- or 6-digit, throws on anything else), `relativeLuminance`, `contrastRatio` (argument order irrelevant), the `WCAG` thresholds `AA_TEXT 4.5` / `AA_LARGE 3` / `AAA_TEXT 7`, and `meetsAA`.
- `src/design/contrast.test.ts` is a guard, not a unit test: it enumerates every text/surface pair in both schemes and asserts ≥ 4.5:1. Changing a token colour without updating its text shade fails here first (66 cases).
- `src/design/fonts.ts` ships font *names and sources only* — Google Fonts URLs for web, `@expo-google-fonts/*` package names for mobile. No binaries are committed; `fonts.code.expoFonts[400]` is what `src/blocks-native/context.ts` reads for `DEFAULT_CODE_FONT`.
- `src/design/index.ts` is the `./design` subpath barrel: tokens, `muiThemeOptions`, the Paper themes, contrast helpers, `fonts` / `googleFontsUrl` / `expoGoogleFontsPackages`.
- `@mui/material` is only a type/dev import here — the subpath itself is importable from Node, which is why the peers are all optional.

## Verified

`pnpm lint`, `pnpm typecheck`, `pnpm vitest run src/design`
