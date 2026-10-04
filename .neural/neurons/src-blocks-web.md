# Neurons · src/blocks-web

refreshed 2026-10-04 · 5378a111dd9c

- The MUI half of the card renderer. Entry point is `BlocksView` in `src/blocks-web/BlocksView.tsx`; it must be wrapped in a MUI `ThemeProvider` with `tankTheme`.
- `BlockView` in the same file is the dispatcher: one `switch (block.kind.case)` over the 12 kinds with `default: return null`, so a card from a newer SDK renders as nothing rather than throwing. Adding a kind means editing this switch *and* its mirror in `src/blocks-native/BlocksViewNative.tsx`.
- `BlocksView` accepts `Blocks | Block[] | undefined` and returns `null` for an empty list; the wrapper emits `data-blocks`, `data-block-id` and `data-block-kind` attributes, which is what the tests and app-level styling hook onto.
- Layout is capped at `maxWidth: 720` with `gap: 1.25` — card width is decided here, not by the host.
- `src/blocks-web/theme.ts` augments MUI's `Palette` with a `tank` namespace and exports `tankTheme = createTheme(muiThemeOptions)`; consumers that read `theme.palette.tank.*` need their own module augmentation, which this file provides for the package.
- The `mono` style in `src/blocks-web/blocks.tsx` sets `overflowWrap: "anywhere"` on purpose: branch names, run ids and diagnostic codes are single unbroken tokens wider than a phone screen.
- `src/blocks-web/RichTextView.tsx` renders inline rich text with MUI `Typography`/`Link`; `renderEmoji` lets the app draw custom emoji and falling back to the unicode or `:name:` text is the documented default.
- `src/blocks-web/__snapshots__` holds the renderer snapshots. Update them only for a deliberate visual change, with `pnpm vitest run -u src/blocks-web`.
- Vitest runs this directory under jsdom via `environmentMatchGlobs: [["src/blocks-web/**", "jsdom"]]` in `vitest.config.ts`; everything else in the repo runs in the `node` environment.
- `biome.json` disables `noArrayIndexKey` for `src/blocks-web/**` because blocks fall back to the array index when `blockId` is empty.
- On a sandbox running Node below the repo's `engines.node >=24` these suites fail to collect (`fileURLToPath is not a function`, `React.act is not a function`); that is the environment, not the renderer.

## Verified

`pnpm lint`, `pnpm typecheck`
