/**
 * The brand, as a palette a drawing tool can offer.
 *
 * On a Neuralboard the colour picker is not a colour picker: picking "Agent purple"
 * has to mean the token, not the hex that token happens to be today, or a board drifts
 * away from the product the moment the brand moves. Every swatch here carries the
 * token name it came from, so what a board records is a decision rather than a number.
 *
 * It is also what makes "design tokens are the real tokens" possible later: a board
 * that stored `#6200EA` could never be told the token changed, and one that stored
 * `color-accent-purple` can.
 */
export type Swatch = {
    /** The token's name, as the design package knows it: "cyan.main", "slate.light". */
    token: string;
    /** What a person calls it. */
    label: string;
    hex: string;
    /** What it is for, in the brand's own terms. */
    meaning?: string;
    /** Readable text on top of this fill. */
    ink: string;
};
/** Fills a board offers, in the order they should appear. */
export declare const boardFills: readonly Swatch[];
/** Sticky notes want saturated, readable-on-dark-ink colours and nothing else. */
export declare const stickyFills: readonly Swatch[];
/** Strokes are quieter than fills; a line in brand cyan shouts. */
export declare const boardStrokes: readonly Swatch[];
/** The type scale a board offers, rather than a free number field. */
export declare const boardTextSizes: readonly {
    token: string;
    label: string;
    px: number;
}[];
export declare const boardFonts: {
    readonly display: "\"Space Grotesk\", \"Helvetica Neue\", Arial, sans-serif";
    readonly mono: "\"JetBrains Mono\", \"Fira Code\", ui-monospace, SFMono-Regular, Menlo, monospace";
};
/** The hex a token resolves to today, or undefined when the name is not one of ours. */
export declare function hexFor(token: string): string | undefined;
/**
 * The token a hex came from, when it came from one. A board that was drawn before
 * tokens existed, or pasted from elsewhere, still holds raw hexes; this is how such a
 * shape gets adopted back into the brand instead of being left behind.
 */
export declare function tokenFor(hex: string): string | undefined;
