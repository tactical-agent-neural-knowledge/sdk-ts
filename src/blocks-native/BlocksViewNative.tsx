import { StyleSheet, View } from "react-native";
import type { Block, Blocks } from "../contracts/tank/blocks/v1/blocks_pb.js";
import {
  ActionsBlock,
  ApprovalPromptBlock,
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
import { type BlockContext, BlocksNativeContext, type BlocksNativeOptions } from "./context.js";

export interface BlocksViewNativeProps extends BlocksNativeOptions {
  blocks: Blocks | Block[] | undefined;
}

export function BlockViewNative({ block, ...opts }: { block: Block } & BlocksNativeOptions) {
  const ctx: BlockContext = { ...opts, blockId: block.blockId };
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
      return <PlanCardBlock value={k.value} ctx={ctx} />;
    case "diffPreview":
      return <DiffPreviewBlock value={k.value} ctx={ctx} />;
    case "ciStatus":
      return <CiStatusBlock value={k.value} ctx={ctx} />;
    case "approvalPrompt":
      return <ApprovalPromptBlock value={k.value} ctx={ctx} />;
    case "toolLog":
      return <ToolLogBlock value={k.value} ctx={ctx} />;
    case "filePreview":
      return <FilePreviewBlock value={k.value} ctx={ctx} />;
    case "statusCard":
      return <StatusCardBlock value={k.value} ctx={ctx} />;
    default:
      return null;
  }
}

/**
 * Renders a message's blocks (Threaded Action Cards) with react-native-paper. Same tones as
 * `blocks-web`: purple cards for agent execution, cyan for AI/context, amber when a human is needed.
 * Render inside a `PaperProvider` whose theme is built from `paperTheme` (see `…/sdk/design`).
 */
export function BlocksViewNative({ blocks, ...opts }: BlocksViewNativeProps) {
  const list = blocks === undefined ? [] : Array.isArray(blocks) ? blocks : blocks.blocks;
  if (list.length === 0) return null;
  return (
    <BlocksNativeContext.Provider value={opts}>
      <View testID="blocks" style={styles.root}>
        {list.map((b, i) => (
          <View key={b.blockId || i} testID={`block-${b.blockId}`} accessibilityLabel={b.kind.case}>
            <BlockViewNative block={b} {...opts} />
          </View>
        ))}
      </View>
    </BlocksNativeContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: { gap: 10, maxWidth: 720 },
});
