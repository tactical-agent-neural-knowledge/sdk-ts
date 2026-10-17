# Neurons · src/blocks-native
refreshed 2026-10-17 · 6b360350cf49

- The **only** directory in the SDK that may import `react-native` or `react-native-paper`; `src/exports.test.ts` enforces this.
- `blocks.tsx` — block components backed by react-native-paper: `HeaderBlock`, `SectionBlock`, `ContextBlock`, `ActionsBlock`, `PlanCardBlock`, `StatusCardBlock`, `CiStatusBlock`, `ApprovalPromptBlock`, `DiffPreviewBlock`, `FilePreviewBlock`, `ToolLogBlock`, `DividerBlock`.
- `Accent` type (`"agent" | "ai" | "alert" | "none"`) and `accentColor(theme, accent)` derive colours from the Paper theme: secondary=purple (agent), primary=cyan (AI), tertiary=amber (needs a human).
- `ChipTone` type for chip colouring; `semanticColors(theme)` returns `{ success, error, muted }` using `shades` from `../design/tokens.js` — Paper has no success slot.
- `BlocksViewNative.tsx` + `BlockViewNative` — top-level renderer; takes `Blocks | Block[] | undefined` and `BlocksNativeOptions` (resolveUser, resolveChannel, formatTime, onAction).
- `context.ts` defines `BlockContext`, `BlocksNativeContext` (React context), `BlocksNativeOptions`, and `DEFAULT_CODE_FONT`.
- `RichTextViewNative.tsx` renders rich text in react-native.
- Snapshots in `__snapshots__/BlocksViewNative.test.tsx.snap`; update with `pnpm vitest run -u src/blocks-native` only on deliberate visual changes.
- Vitest resolves `react-native` and `react-native-paper` through stand-in mocks in `src/test/mocks/`; the real packages are dev deps for types only and never built into `dist/`.

## Verified
pnpm vitest run src/blocks-native
