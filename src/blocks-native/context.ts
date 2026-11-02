import { createContext, useContext } from "react";
import type { PlanFileActions } from "../blocks/plan.js";
import { fonts } from "../design/fonts.js";
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
}

export interface BlockContext extends BlocksNativeOptions {
  blockId: string;
}

export const DEFAULT_CODE_FONT = fonts.code.expoFonts[400] ?? "JetBrainsMono_400Regular";

export const BlocksNativeContext = createContext<BlocksNativeOptions>({});

export function useBlocksOptions(): BlocksNativeOptions {
  return useContext(BlocksNativeContext);
}
