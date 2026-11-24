import { type TextStyle } from "react-native";
/**
 * Neural's one-word status line on the phone: TANK's own working mark (the shield with the
 * chevron), gently breathing, beside one word from `STATUS_WORDS`. A new word fades in softly.
 * With `reducedMotion` the mark is still and the word simply changes; the app passes its own
 * Reduce Motion reading, which is also what keeps an animation loop out of a test run.
 * Renders nothing for an empty word.
 */
export declare function StatusLine({ word, reducedMotion, textStyle, testID, }: {
    word: string;
    reducedMotion?: boolean;
    textStyle?: TextStyle;
    testID?: string;
}): import("react").JSX.Element | null;
