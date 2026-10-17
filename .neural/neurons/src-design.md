# Neurons · src/design

refreshed 2026-10-08 · 83a77f18cf88

- One token source feeds both platforms: `mui.ts` (web) and `paper.ts` (mobile) both derive from the same palette/spacing/typography tokens rather than maintaining two theme definitions.
- The upstream color source of truth is `docs/brand/COLOR_PALETTE.json` in the `docs` repo — palette changes land there first and get pulled into `src/design`, they are not authored directly here.
- Text-safe shades exist as a distinct set from the raw brand palette because several brand colors fail WCAG contrast against both white and black at body-text size; `contrast.ts` is what enforces this rather than trusting the palette by eye.
- `mui.ts` extends the MUI `Theme` with a `tank` namespace for values MUI has no slot for (e.g. tone colors), rather than overloading existing theme keys.
- `paper.ts` is plain data — no `react-native` or `react-native-paper` import — so it can be imported from `src/blocks` and tested under Vitest without the RN stand-ins; only `src/blocks-native` wires it into an actual Paper `Theme`.
- `contrast.ts` exposes the WCAG contrast-ratio math directly (not hidden behind a boolean pass/fail helper only), so callers can report the actual ratio, not just a yes/no.
- `contrast.test.ts` is a 66-case table test over every token pair that can appear as text-on-background; a new palette entry that fails contrast fails this file, not a visual review.
- `fonts.ts` holds font **names** plus their Google Fonts / Expo Google Fonts source identifiers only — no binary font files live in this repo; consumers load the actual font assets themselves.
- `src/design/index.ts`'s barrel is the only supported import surface for this area; reaching into `src/design/mui.ts` etc. directly from outside the package is not part of the contract.
- The `@mui/material` import in this area is `import type` only — `src/design` never pulls in the MUI runtime, keeping the subpath usable without the `@mui/material` peer actually installed.

## Verified

`pnpm lint`, `pnpm typecheck`, `pnpm vitest run src/design`
