import { jsx as _jsx } from "react/jsx-runtime";
import { StyleSheet, View } from "react-native";
import { ActionsBlock, ApprovalPromptBlock, CiStatusBlock, ContextBlock, DiffPreviewBlock, DividerBlock, FilePreviewBlock, HeaderBlock, PlanCardBlock, SectionBlock, StatusCardBlock, ToolLogBlock, } from "./blocks.js";
import { BlocksNativeContext } from "./context.js";
export function BlockViewNative({ block, ...opts }) {
    const ctx = { ...opts, blockId: block.blockId };
    const k = block.kind;
    switch (k.case) {
        case "header":
            return _jsx(HeaderBlock, { value: k.value });
        case "section":
            return _jsx(SectionBlock, { value: k.value, ctx: ctx });
        case "context":
            return _jsx(ContextBlock, { value: k.value, ctx: ctx });
        case "divider":
            return _jsx(DividerBlock, {});
        case "actions":
            return _jsx(ActionsBlock, { value: k.value, ctx: ctx });
        case "planCard":
            return _jsx(PlanCardBlock, { value: k.value, ctx: ctx });
        case "diffPreview":
            return _jsx(DiffPreviewBlock, { value: k.value, ctx: ctx });
        case "ciStatus":
            return _jsx(CiStatusBlock, { value: k.value, ctx: ctx });
        case "approvalPrompt":
            return _jsx(ApprovalPromptBlock, { value: k.value, ctx: ctx });
        case "toolLog":
            return _jsx(ToolLogBlock, { value: k.value, ctx: ctx });
        case "filePreview":
            return _jsx(FilePreviewBlock, { value: k.value, ctx: ctx });
        case "statusCard":
            return _jsx(StatusCardBlock, { value: k.value, ctx: ctx });
        default:
            return null;
    }
}
/**
 * Renders a message's blocks (Threaded Action Cards) with react-native-paper. Same tones as
 * `blocks-web`: purple cards for agent execution, cyan for AI/context, amber when a human is needed.
 * Render inside a `PaperProvider` whose theme is built from `paperTheme` (see `…/sdk/design`).
 */
export function BlocksViewNative({ blocks, ...opts }) {
    const list = blocks === undefined ? [] : Array.isArray(blocks) ? blocks : blocks.blocks;
    if (list.length === 0)
        return null;
    return (_jsx(BlocksNativeContext.Provider, { value: opts, children: _jsx(View, { testID: "blocks", style: styles.root, children: list.map((b, i) => (_jsx(View, { testID: `block-${b.blockId}`, accessibilityLabel: b.kind.case, children: _jsx(BlockViewNative, { block: b, ...opts }) }, b.blockId || i))) }) }));
}
const styles = StyleSheet.create({
    root: { gap: 10, maxWidth: 720 },
});
