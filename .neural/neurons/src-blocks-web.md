# Neurons · src/blocks-web

refreshed 2026-10-31 · bf59edafde49

- `src/blocks-web/index.ts` exports `BlocksView`, `BlockView`, `BlocksViewProps`, `BlockActionEvent`, `BlockContext`, `Card`, `CiStatusBlock`, `ContextBlock`, `DiffPreviewBlock`, `DividerBlock`, `FilePreviewBlock`, `HeaderBlock`, `PlanCardBlock`, `SectionBlock`, `StatusCardBlock`, `ToolLogBlock`, `ActionsBlock`, `ActionButton`, `ApprovalPromptBlock`, `Mark`, `ElementView`, `RichTextView`, `RichTextViewProps`, `muiThemeOptions`, `tankTheme`.
- `src/blocks-web/blocks.tsx` contains all block component implementations for MUI 7 + Emotion; `src/blocks-web/RichTextView.tsx` renders rich text inline; `src/blocks-web/theme.ts` exports `muiThemeOptions` and `tankTheme` built from `src/design` tokens.
- `src/blocks-web/BlocksView.tsx` is the top-level renderer: takes `blocks: Blocks`, `context: BlockContext`, and an optional `onAction` callback; dispatches `BlockActionEvent` on button/check interactions.
- Snapshot tests live in `src/blocks-web/__snapshots__/`; update with `pnpm vitest run -u src/blocks-web` only with a deliberate visual change.
- `src/blocks-web/BlocksView.test.tsx` and `src/blocks-web/RichTextView.test.tsx` use `@testing-library/react` with jsdom; they import from `src/test/fixture-defs.ts` for golden blocks.
- MUI and Emotion are optional peers (`peerDependenciesMeta`); `blocks-web` must not be imported in Node or React Native paths — it is guarded by the react-native isolation test in `src/exports.test.ts`.
- `biome.json` turns off `noArrayIndexKey` for `src/blocks-web/**` because block lists are keyed by stable block array index by design.

## Verified

`pnpm lint`, `pnpm typecheck`
