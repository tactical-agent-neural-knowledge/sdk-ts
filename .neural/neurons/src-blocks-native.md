# Neurons · src/blocks-native

refreshed 2026-10-03 · f9489740a406

- The react-native-paper half of the card renderer, and **the only directory in the package allowed to import `react-native` or `react-native-paper`** — `src/exports.test.ts` scans both `src/` and `dist/` and fails any other file that does.
- Entry point is `BlocksViewNative` in `src/blocks-native/BlocksViewNative.tsx`; it mirrors the web `switch` over the same 12 kinds with `default: return null`, so the two renderers must be changed together.
- It wraps its children in `BlocksNativeContext.Provider`, which is how per-block callbacks and resolvers reach deep components without prop drilling (`src/blocks-native/context.ts`).
- Test hooks are part of the contract: `testID="blocks"` on the container, `testID={`block-${b.blockId}`}` per block, and `accessibilityLabel={b.kind.case}` — both the snapshot tests and mobile's e2e selectors depend on them.
- `accentColor` in `src/blocks-native/context.ts` maps the shared accents onto Paper's MD3 slots: agent → `secondary` (purple), ai → `primary` (cyan), alert → `tertiary` (amber), none → `outlineVariant`. `semanticColors` supplies success/error/muted, which MD3 has no slot for.
- `DEFAULT_CODE_FONT` is `fonts.code.expoFonts[400] ?? "JetBrainsMono_400Regular"`; code spans in `src/blocks-native/RichTextViewNative.tsx` use it unless the host passes `codeFontFamily`.
- Links and URL buttons go through an injectable `openUrl`, defaulting to `Linking.openURL`; confirm buttons go through `Alert.alert` and fire only on confirm.
- The real `react-native` / `react-native-paper` packages are dev dependencies **for types only**. Vitest aliases both to `src/test/mocks/*.tsx` stand-ins (`vitest.config.ts`), and `tsconfig.build.json` excludes `src/test/**`, so neither the mocks nor the real packages ever reach `dist/`.
- `src/blocks-native/__snapshots__` holds the Paper snapshots; refresh with `pnpm vitest run -u src/blocks-native` only for a deliberate visual change.
- `biome.json` disables `noArrayIndexKey` for `src/blocks-native/**`, same reason as the web renderer.
- On a sandbox running Node below `engines.node >=24` these suites fail with `React.act is not a function` and report the eight fixture snapshots as obsolete; do not re-record snapshots from such a run.

## Verified

`pnpm lint`, `pnpm typecheck`
