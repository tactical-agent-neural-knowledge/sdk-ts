/** WCAG 2.x relative luminance and contrast ratio for hex colors. */
export function hexToRgb(hex) {
    const h = hex.replace("#", "");
    const full = h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h;
    if (!/^[0-9a-fA-F]{6}$/.test(full))
        throw new Error(`bad hex color: ${hex}`);
    const n = Number.parseInt(full, 16);
    return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}
function channel(v) {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}
export function relativeLuminance(hex) {
    const [r, g, b] = hexToRgb(hex);
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}
/** Contrast ratio in [1, 21]; order of arguments does not matter. */
export function contrastRatio(a, b) {
    const la = relativeLuminance(a);
    const lb = relativeLuminance(b);
    const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
    return (hi + 0.05) / (lo + 0.05);
}
export const WCAG = {
    /** Normal text, level AA. */
    AA_TEXT: 4.5,
    /** Large text (>= 18pt or 14pt bold) and UI components, level AA. */
    AA_LARGE: 3,
    /** Normal text, level AAA. */
    AAA_TEXT: 7,
};
export function meetsAA(foreground, background, large = false) {
    return contrastRatio(foreground, background) >= (large ? WCAG.AA_LARGE : WCAG.AA_TEXT);
}
