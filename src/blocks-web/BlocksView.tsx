import Box from "@mui/material/Box";
import type { Block, Blocks } from "../contracts/tank/blocks/v1/blocks_pb.js";
import {
  ActionsBlock,
  ApprovalPromptBlock,
  type BlockActionEvent,
  type BlockContext,
  CiStatusBlock,
  ContextBlock,
  DiffPreviewBlock,
  DividerBlock,
  FilePreviewBlock,
  HeaderBlock,
  PlanCardBlock,
  SectionBlock,
  StatusCardBlock,
  ToolLogBlock,
} from "./blocks.js";

export interface BlocksViewProps extends Pick<BlockContext, "resolveUser" | "resolveChannel" | "formatTime"> {
  blocks: Blocks | Block[] | undefined;
  onAction?: (action: BlockActionEvent) => void;
}

export function BlockView({ block, ...ctxProps }: { block: Block } & Omit<BlocksViewProps, "blocks">) {
  const ctx: BlockContext = { ...ctxProps, blockId: block.blockId };
  const k = block.kind;
  switch (k.case) {
    case "header":
      return <HeaderBlock value={k.value} />;
    case "section":
      return <SectionBlock value={k.value} ctx={ctx} />;
    case "context":
      return <ContextBlock value={k.value} ctx={ctx} />;
    case "divider":
      return <DividerBlock />;
    case "actions":
      return <ActionsBlock value={k.value} ctx={ctx} />;
    case "planCard":
      return <PlanCardBlock value={k.value} />;
    case "diffPreview":
      return <DiffPreviewBlock value={k.value} />;
    case "ciStatus":
      return <CiStatusBlock value={k.value} />;
    case "approvalPrompt":
      return <ApprovalPromptBlock value={k.value} ctx={ctx} />;
    case "toolLog":
      return <ToolLogBlock value={k.value} ctx={ctx} />;
    case "filePreview":
      return <FilePreviewBlock value={k.value} />;
    case "statusCard":
      return <StatusCardBlock value={k.value} ctx={ctx} />;
    default:
      return null;
  }
}

/** Renders a message's blocks (Threaded Action Cards) with MUI. Wrap in a ThemeProvider with `tankTheme`. */
export function BlocksView({ blocks, ...ctxProps }: BlocksViewProps) {
  const list = blocks === undefined ? [] : Array.isArray(blocks) ? blocks : blocks.blocks;
  if (list.length === 0) return null;
  return (
    <Box data-blocks sx={{ display: "flex", flexDirection: "column", gap: 1.25, maxWidth: 720 }}>
      {list.map((b, i) => (
        <Box key={b.blockId || i} data-block-id={b.blockId} data-block-kind={b.kind.case}>
          <BlockView block={b} {...ctxProps} />
        </Box>
      ))}
    </Box>
  );
}
