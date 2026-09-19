/** WCAG 2.x relative luminance and contrast ratio for hex colors. */
export declare function hexToRgb(hex: string): [number, number, number];
export declare function relativeLuminance(hex: string): number;
/** Contrast ratio in [1, 21]; order of arguments does not matter. */
export declare function contrastRatio(a: string, b: string): number;
export declare const WCAG: {
    /** Normal text, level AA. */
    readonly AA_TEXT: 4.5;
    /** Large text (>= 18pt or 14pt bold) and UI components, level AA. */
    readonly AA_LARGE: 3;
    /** Normal text, level AAA. */
    readonly AAA_TEXT: 7;
};
export declare function meetsAA(foreground: string, background: string, large?: boolean): boolean;
