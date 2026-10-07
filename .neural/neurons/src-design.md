# Neurons · src/design

refreshed 2026-10-07 · d3746781a46d

- `tokens.ts` is the single source of brand values (sourced from `docs/brand/COLOR_PALETTE.json`); `mui.ts` and `paper.ts` each project those tokens onto one platform's theme shape — never hand-pick colours in a component, add a token here instead.
- New this refresh: `palette.ts` projects the same tokens into a board-oriented swatch system — `Swatch { token, label, hex, meaning?, ink }`, `boardFills` (11 entries), `stickyFills` (a filtered subset of `boardFills`), `boardStrokes` (6 quieter entries), `boardTextSizes` (a 5-step type scale), `boardFonts`, plus `hexFor(token)` and `tokenFor(hex)` lookups. The doc comment states the reason directly: "a board that stored `#6200EA` could never be told the token changed, and one that stored `color-accent-purple` can" — Neuralboards shapes must store the token, never the raw hex.
- `palette.test.ts` is the guard for that contract: round-trips every swatch through `hexFor`/`tokenFor` (case/whitespace-insensitive on the reverse lookup), requires a `meaning` on the brand-identity tokens (cyan/purple/amber mains), and asserts every `boardFills`/`stickyFills` swatch's `ink` clears `WCAG.AA_LARGE` against its own `hex` — a swatch that fails this is a sticky note nobody can read.
- `index.ts` re-exports `palette.ts` alongside the existing modules — `boardFills`, `boardFonts`, `boardStrokes`, `boardTextSizes`, `hexFor`, `stickyFills`, `tokenFor`, `type Swatch` are now public API via the `./design` subpath, even though nothing in `src/blocks`/`src/react`/the renderers consumes them yet (see `src.md`).
- `mui.ts` adds a custom `tank` palette namespace (`panel`, `overlay`, `primaryText`, `secondaryText`, `warningText`, plus `agent`/`ai`/`alert` accents) that requires a module-augmentation declaration — `src/blocks-web/theme.ts` is where that augmentation lives; importing `mui.ts`'s theme without it loses type access to `theme.tank.*`.
- `paper.ts` is plain data describing an MD3 theme shape — it imports nothing from `react-native` or `react-native-paper`, which is what lets `src/design` stay outside the `react-native` isolation boundary enforced by `src/exports.test.ts`.
- `contrast.ts` implements the WCAG math directly (`hexToRgb`, `relativeLuminance`, `contrastRatio`, the `WCAG` threshold constants, `meetsAA`) — `contrast.test.ts` is a 66-case guard pinning specific brand pairs (e.g. Cybernetic Purple on Deep Abyss Black) to a passing ratio, not a unit test of the math itself.
- `fonts.ts` holds font **names and sources** only (Google Fonts / Expo font identifiers) — no binary font files in this package; `fonts.code.expoFonts[400]` is what `src/blocks-native/context.ts` consumes to register the monospace face on native.
- `@mui/material` is imported only in dev-time type positions in `mui.ts`, keeping it an optional peer — a runtime import here would force every Node/Expo consumer of the `.` or `./design` subpath to install MUI.

## Verified

`pnpm lint`, `pnpm typecheck`, `pnpm vitest run src/design`
