import type { Block, Blocks } from "../contracts/tank/blocks/v1/blocks_pb.js";
import { type BlockActionEvent, type BlockContext } from "./blocks.js";
export interface BlocksViewProps extends Pick<BlockContext, "resolveUser" | "resolveChannel" | "formatTime"> {
    blocks: Blocks | Block[] | undefined;
    onAction?: (action: BlockActionEvent) => void;
}
export declare function BlockView({ block, ...ctxProps }: {
    block: Block;
} & Omit<BlocksViewProps, "blocks">): import("react").JSX.Element | null;
/** Renders a message's blocks (Threaded Action Cards) with MUI. Wrap in a ThemeProvider with `tankTheme`. */
export declare function BlocksView({ blocks, ...ctxProps }: BlocksViewProps): import("react").JSX.Element | null;
