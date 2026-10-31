# Neurons · src/blocks-native

refreshed 2026-10-31 · bf59edafde49

- `src/blocks-native/index.ts` exports `BlocksViewNative`, `BlockViewNative`, `BlocksViewNativeProps`, `BlocksNativeContext`, `BlocksNativeOptions`, `BlockActionEvent`, `BlockContext`, `DEFAULT_CODE_FONT`, `useBlocksOptions`, `Accent`, `ActionButton`, `ActionsBlock`, `ApprovalPromptBlock`, `accentColor`, `Card`, `ChipTone`, `CiStatusBlock`, `ContextBlock`, `chipColors`, `DiffPreviewBlock`, `DividerBlock`, `FilePreviewBlock`, `HeaderBlock`, `PlanCardBlock`, `SectionBlock`, `StatusCardBlock`, `semanticColors`, `ToneChip`, `ToolLogBlock`, `Mark`, `ElementViewNative`, `RichTextViewNative`, `RichTextViewNativeProps`.
- `src/blocks-native/` is **the only directory in the repo that may import `react-native` or `react-native-paper`** — this is a hard prohibition enforced by `src/exports.test.ts`'s react-native isolation test which also scans `dist/`.
- `src/blocks-native/blocks.tsx` contains all block components for `react-native-paper`; `src/blocks-native/RichTextViewNative.tsx` renders rich text with native `Text` elements.
- Vitest runs `blocks-native` tests against stand-ins in `src/test/mocks/`: `react-native.tsx`, `react-native-paper.tsx`, `react-native-svg.tsx` — aliased in `vitest.config.ts`; these stubs are never in `dist/`.
- Snapshot tests live in `src/blocks-native/__snapshots__/`; update with `pnpm vitest run -u src/blocks-native` only with a deliberate visual change.
- `biome.json` turns off `noArrayIndexKey` for `src/blocks-native/**` for the same reason as `blocks-web`.
- `react-native` 0.81.x is a devDependency (types only); the optional peer is `>=0.76`. `react-native-paper ^5` and `react-native-svg >=15` are also optional peers.

## Verified

`pnpm lint`, `pnpm typecheck`
