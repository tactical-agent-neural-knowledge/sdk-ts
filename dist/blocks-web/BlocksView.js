import { jsx as _jsx } from "react/jsx-runtime";
import Box from "@mui/material/Box";
import { ActionsBlock, ApprovalPromptBlock, CiStatusBlock, ContextBlock, DiffPreviewBlock, DividerBlock, FilePreviewBlock, HeaderBlock, PlanCardBlock, SectionBlock, StatusCardBlock, ToolLogBlock, } from "./blocks.js";
export function BlockView({ block, ...ctxProps }) {
    const ctx = { ...ctxProps, blockId: block.blockId };
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
            return _jsx(PlanCardBlock, { value: k.value });
        case "diffPreview":
            return _jsx(DiffPreviewBlock, { value: k.value });
        case "ciStatus":
            return _jsx(CiStatusBlock, { value: k.value });
        case "approvalPrompt":
            return _jsx(ApprovalPromptBlock, { value: k.value, ctx: ctx });
        case "toolLog":
            return _jsx(ToolLogBlock, { value: k.value, ctx: ctx });
        case "filePreview":
            return _jsx(FilePreviewBlock, { value: k.value });
        case "statusCard":
            return _jsx(StatusCardBlock, { value: k.value, ctx: ctx });
        default:
            return null;
    }
}
/** Renders a message's blocks (Threaded Action Cards) with MUI. Wrap in a ThemeProvider with `tankTheme`. */
export function BlocksView({ blocks, ...ctxProps }) {
    const list = blocks === undefined ? [] : Array.isArray(blocks) ? blocks : blocks.blocks;
    if (list.length === 0)
        return null;
    return (_jsx(Box, { "data-blocks": true, sx: { display: "flex", flexDirection: "column", gap: 1.25, maxWidth: 720 }, children: list.map((b, i) => (_jsx(Box, { "data-block-id": b.blockId, "data-block-kind": b.kind.case, children: _jsx(BlockView, { block: b, ...ctxProps }) }, b.blockId || i))) }));
}
