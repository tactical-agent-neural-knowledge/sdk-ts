import { shades, typography } from "./tokens.js";

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

const ON_DARK = shades.white;
const ON_LIGHT = shades.abyss.main;

/** Fills a board offers, in the order they should appear. */
export const boardFills: readonly Swatch[] = [
  {
    token: "cyan.main",
    label: "Neural cyan",
    hex: shades.cyan.main,
    ink: ON_LIGHT,
    meaning: "AI and active context",
  },
  {
    token: "purple.main",
    label: "Agent purple",
    hex: shades.purple.main,
    ink: ON_DARK,
    meaning: "agent work",
  },
  {
    token: "amber.main",
    label: "Industrial amber",
    hex: shades.amber.main,
    ink: ON_LIGHT,
    meaning: "alerts and attention",
  },
  {
    token: "slate.main",
    label: "Armor slate",
    hex: shades.slate.main,
    ink: ON_DARK,
    meaning: "panels and quiet shapes",
  },
  { token: "slate.light", label: "Slate light", hex: shades.slate.light, ink: ON_DARK },
  { token: "abyss.main", label: "Deep abyss", hex: shades.abyss.main, ink: ON_DARK, meaning: "the ground" },
  { token: "abyss.raised", label: "Abyss raised", hex: shades.abyss.raised, ink: ON_DARK },
  { token: "success.main", label: "Green", hex: shades.success.main, ink: ON_LIGHT },
  { token: "error.main", label: "Red", hex: shades.error.main, ink: ON_LIGHT },
  { token: "info.main", label: "Blue", hex: shades.info.main, ink: ON_LIGHT },
  { token: "white", label: "White", hex: shades.white, ink: ON_LIGHT },
] as const;

/** Sticky notes want saturated, readable-on-dark-ink colours and nothing else. */
export const stickyFills: readonly Swatch[] = boardFills.filter((s) =>
  ["amber.main", "cyan.main", "purple.main", "success.main", "error.main", "info.main"].includes(s.token),
);

/** Strokes are quieter than fills; a line in brand cyan shouts. */
export const boardStrokes: readonly Swatch[] = [
  { token: "slate.main", label: "Slate", hex: shades.slate.main, ink: ON_DARK },
  { token: "slate.light", label: "Slate light", hex: shades.slate.light, ink: ON_DARK },
  { token: "cyan.main", label: "Neural cyan", hex: shades.cyan.main, ink: ON_LIGHT },
  { token: "purple.light", label: "Agent purple", hex: shades.purple.light, ink: ON_LIGHT },
  { token: "amber.main", label: "Amber", hex: shades.amber.main, ink: ON_LIGHT },
  { token: "white", label: "White", hex: shades.white, ink: ON_LIGHT },
] as const;

/** The type scale a board offers, rather than a free number field. */
export const boardTextSizes: readonly { token: string; label: string; px: number }[] = [
  { token: "text.caption", label: "Caption", px: 12 },
  { token: "text.body", label: "Body", px: 15 },
  { token: "text.lead", label: "Lead", px: 20 },
  { token: "text.heading", label: "Heading", px: 28 },
  { token: "text.display", label: "Display", px: 44 },
] as const;

export const boardFonts = {
  display: typography.fontDisplay,
  mono: typography.fontCode,
} as const;

/** The hex a token resolves to today, or undefined when the name is not one of ours. */
export function hexFor(token: string): string | undefined {
  return [...boardFills, ...boardStrokes].find((s) => s.token === token)?.hex;
}

/**
 * The token a hex came from, when it came from one. A board that was drawn before
 * tokens existed, or pasted from elsewhere, still holds raw hexes; this is how such a
 * shape gets adopted back into the brand instead of being left behind.
 */
export function tokenFor(hex: string): string | undefined {
  const want = hex.trim().toUpperCase();
  return [...boardFills, ...boardStrokes].find((s) => s.hex.toUpperCase() === want)?.token;
}
