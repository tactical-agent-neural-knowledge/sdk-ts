# Neurons · src/blocks-web
refreshed 2026-10-17 · 6b360350cf49

- MUI 7 renderers for agent blocks. Imports from `@mui/material` only; no `react-native` imports (enforced by `src/exports.test.ts`).
- `BlocksView.tsx` + `BlockView` — top-level renderer; takes `Blocks | Block[] | undefined` and `BlocksViewProps` (resolveUser, resolveChannel, formatTime, onAction).
- `blocks.tsx` — individual block components: `HeaderBlock`, `SectionBlock`, `ContextBlock`, `ActionsBlock`, `PlanCardBlock`, `StatusCardBlock`, `CiStatusBlock`, `ApprovalPromptBlock`, `DiffPreviewBlock`, `FilePreviewBlock`, `ToolLogBlock`, `DividerBlock`.
- `BlockContext` interface (defined in `blocks.tsx`) carries `blockId`, `resolveUser`, `resolveChannel`, `formatTime`, `onAction`; `BlockActionEvent` is the payload posted back on user interaction.
- `RichTextView.tsx` renders rich text inline; `RichTextViewProps` is re-exported for callers that render standalone rich text.
- `theme.ts` exposes any MUI-specific theme helpers for the web blocks.
- Monospace code tokens use `typography.fontCode` from `../design/tokens.js` directly; branch names and run IDs get `overflowWrap: "anywhere"` to avoid horizontal scroll on mobile viewports.
- Snapshots live in `__snapshots__/BlocksView.test.tsx.snap`; update only with `pnpm vitest run -u src/blocks-web` and only when a visual change is intentional.

## Verified
pnpm vitest run src/blocks-web
