import { createContext, useContext } from "react";
import { fonts } from "../design/fonts.js";
export const DEFAULT_CODE_FONT = fonts.code.expoFonts[400] ?? "JetBrainsMono_400Regular";
export const BlocksNativeContext = createContext({});
export function useBlocksOptions() {
    return useContext(BlocksNativeContext);
}
