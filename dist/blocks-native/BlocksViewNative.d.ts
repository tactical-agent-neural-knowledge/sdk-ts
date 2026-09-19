import type { Block, Blocks } from "../contracts/tank/blocks/v1/blocks_pb.js";
import { type BlocksNativeOptions } from "./context.js";
export interface BlocksViewNativeProps extends BlocksNativeOptions {
    blocks: Blocks | Block[] | undefined;
}
export declare function BlockViewNative({ block, ...opts }: {
    block: Block;
} & BlocksNativeOptions): import("react").JSX.Element | null;
/**
 * Renders a message's blocks (Threaded Action Cards) with react-native-paper. Same tones as
 * `blocks-web`: purple cards for agent execution, cyan for AI/context, amber when a human is needed.
 * Render inside a `PaperProvider` whose theme is built from `paperTheme` (see `…/sdk/design`).
 */
export declare function BlocksViewNative({ blocks, ...opts }: BlocksViewNativeProps): import("react").JSX.Element | null;
