import type { PlanFileActions } from "../blocks/plan.js";
import type { RichTextViewNativeProps } from "./RichTextViewNative.js";
/** Posted when a user interacts with a block; pair with `TankClient.postBlockAction`. Same shape as blocks-web. */
export interface BlockActionEvent {
    blockId: string;
    actionId: string;
    value: string;
}
export interface BlocksNativeOptions extends Pick<RichTextViewNativeProps, "resolveUser" | "resolveChannel"> {
    onAction?: (action: BlockActionEvent) => void;
    /** Format a timestamp (ms) for display. Default: ISO 8601. */
    formatTime?: (ms: number) => string;
    /** Font family registered with expo-font for code. Default `fonts.code.expoFonts[400]` ("JetBrainsMono_400Regular"). */
    codeFontFamily?: string;
    /** Open a URL (link buttons, PR links). Default: `Linking.openURL`. */
    openUrl?: (url: string) => void;
    /** Download and Add to Atlas on a plan card; each button shows only when its action is given. */
    planFile?: PlanFileActions | undefined;
    /**
     * A "Copy key" button (`neural.key.reveal`): redeem the reveal id with
     * `NeuralKeyService.RevealApiKey` and put the key on the clipboard, resolving true once it is
     * there. Without it the button says the key can no longer be shown.
     */
    revealKey?: ((revealId: string) => Promise<boolean>) | undefined;
}
export interface BlockContext extends BlocksNativeOptions {
    blockId: string;
}
export declare const DEFAULT_CODE_FONT: "JetBrainsMono_400Regular";
export declare const BlocksNativeContext: import("react").Context<BlocksNativeOptions>;
export declare function useBlocksOptions(): BlocksNativeOptions;
