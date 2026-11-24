/**
 * Neural's one-word status line: TANK's own working mark (the shield with the chevron), gently
 * breathing, beside one word from `STATUS_WORDS`. A new word fades in softly (the same fade
 * arriving text uses). With reduced motion asked for, the mark is still and the word simply
 * changes. Renders nothing for an empty word. The text takes the color of where it is put.
 */
export declare function StatusLine({ word, testId }: {
    word: string;
    testId?: string;
}): import("react").JSX.Element | null;
