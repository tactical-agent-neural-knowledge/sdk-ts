# Neurons · src/design
refreshed 2026-10-17 · 6b360350cf49

- Design tokens, fonts, MUI options, Paper theme, contrast utilities, and palette helpers. No React imports; safe to import from Node and non-React environments.
- `tokens.ts` exports: `brand`, `lightScheme`, `darkScheme`, `shades`, `spacing`, `tokens`, `typography`, `vocabulary`. `typography.fontDisplay` and `typography.fontCode` are the family names both MUI and Paper themes reference.
- `fonts.ts` — brand font metadata only, no binaries. `fonts.display` = "Space Grotesk" (400/500/600/700, `@expo-google-fonts/space-grotesk`); `fonts.code` = "JetBrains Mono" (400/500/700, `@expo-google-fonts/jetbrains-mono`). `googleFontsUrl` / `googleFontsLinkTag` for web; `expoGoogleFontsPackages` / `fontFamilies` for mobile.
- `mui.ts` exports `muiThemeOptions` — MUI 7 `ThemeOptions` built from the tokens; compose with `createTheme` in the app.
- `paper.ts` exports `paperLightTheme`, `paperDarkTheme`, `paperTheme(colorScheme)` — react-native-paper `MD3Theme` objects. `PaperColors` and `PaperTheme` are the type exports.
- `palette.ts` — board/sticky colours: `boardFills`, `boardStrokes`, `boardFonts`, `boardTextSizes`, `stickyFills`; `hexFor(swatch)` and `tokenFor(swatch)` converters; `Swatch` type.
- `contrast.ts` — WCAG utilities: `relativeLuminance`, `contrastRatio`, `meetsAA`, `hexToRgb`, `WCAG` constants.

## Verified
pnpm vitest run src/design
