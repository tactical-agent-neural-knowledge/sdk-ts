/**
 * TANK brand tokens. Source of truth: docs/brand/COLOR_PALETTE.json in the
 * docs repo ("TANK Dark Mode"). Everything in the design package derives from
 * this file; the MUI and Paper themes are projections of it.
 */
export const brand = {
    /** Neural Neon Cyan — primary; AI suggestions, active context, highlight triggers. */
    neuralNeonCyan: "#00E5FF",
    /** Cybernetic Purple — secondary; workflows, bot/agent executions, active thread focus. */
    cyberneticPurple: "#6200EA",
    /** Armor Slate Gray — panel borders, secondary UI, code cards. */
    armorSlateGray: "#263238",
    /** Deep Abyss Black — high-contrast dark background. */
    deepAbyssBlack: "#0D1117",
    /** Industrial Amber — high-priority alerts, Armor Mode overrides. */
    industrialAmber: "#FFC107",
};
/**
 * Derived shades. The brand hexes are fills; some are not readable as text on
 * their own background (purple on abyss is ~2:1), so each hue gets a text-safe
 * variant per scheme. Every pair used for text is asserted in contrast.test.ts.
 */
export const shades = {
    cyan: { main: "#00E5FF", light: "#6EFFFF", dark: "#00B2CC", text: "#00E5FF", onLight: "#006670" },
    purple: { main: "#6200EA", light: "#B388FF", dark: "#4A00B4", text: "#B388FF", onLight: "#6200EA" },
    amber: { main: "#FFC107", light: "#FFD54F", dark: "#FFA000", text: "#FFC107", onLight: "#8A5A00" },
    slate: { main: "#263238", light: "#37474F", dark: "#1C262B" },
    abyss: { main: "#0D1117", raised: "#161B22", overlay: "#1F2630" },
    success: { main: "#00E676", onLight: "#00702F" },
    error: { main: "#FF6B6B", onLight: "#B71C1C" },
    info: { main: "#40C4FF", onLight: "#01579B" },
    white: "#FFFFFF",
    black: "#000000",
};
export const typography = {
    /** Display / brand / headers. */
    fontDisplay: '"Space Grotesk", "Helvetica Neue", Arial, sans-serif',
    /** Body copy. Space Grotesk carries body too; the UI is dense and technical. */
    fontBody: '"Space Grotesk", "Helvetica Neue", Arial, sans-serif',
    /** Code, terminal streams, agent tool logs. */
    fontCode: '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace',
    baseSize: 14,
};
export const spacing = {
    unit: 8,
    radius: { sm: 4, md: 8, lg: 12, pill: 999 },
};
/** Semantic colors for the dark scheme (the default). */
export const darkScheme = {
    background: shades.abyss.main,
    paper: shades.abyss.raised,
    panel: shades.slate.main,
    overlay: shades.abyss.overlay,
    divider: shades.slate.main,
    textPrimary: "#E6EDF3",
    textSecondary: "#9FB0BF",
    textDisabled: "#5F6E7A",
    primary: shades.cyan.main,
    primaryContrast: shades.black,
    primaryText: shades.cyan.text,
    secondary: shades.purple.main,
    secondaryContrast: shades.white,
    secondaryText: shades.purple.text,
    warning: shades.amber.main,
    warningContrast: shades.black,
    warningText: shades.amber.text,
    success: shades.success.main,
    successContrast: shades.black,
    error: shades.error.main,
    errorContrast: shades.black,
    info: shades.info.main,
    infoContrast: shades.black,
};
/** Derived light scheme for accessibility and marketing; same hues, readable on white. */
export const lightScheme = {
    background: "#F4F7FA",
    paper: shades.white,
    panel: "#E3E8EE",
    overlay: "#D5DDE5",
    divider: "#CBD5DF",
    textPrimary: shades.abyss.main,
    textSecondary: "#3E4C59",
    textDisabled: "#8A97A3",
    primary: shades.cyan.onLight,
    primaryContrast: shades.white,
    primaryText: shades.cyan.onLight,
    secondary: shades.purple.onLight,
    secondaryContrast: shades.white,
    secondaryText: shades.purple.onLight,
    warning: shades.amber.onLight,
    warningContrast: shades.white,
    warningText: shades.amber.onLight,
    success: shades.success.onLight,
    successContrast: shades.white,
    error: shades.error.onLight,
    errorContrast: shades.white,
    info: shades.info.onLight,
    infoContrast: shades.white,
};
/** Product vocabulary: the data model keeps neutral names, the UI uses TANK's. */
export const vocabulary = {
    channel: "Tread",
    channels: "Treads",
    search: "Neural Vault",
    doNotDisturb: "Armor Mode",
    automation: "Auto-Pilot",
    liveContext: "Live Context",
    instantAnswers: "Instant Answers",
    focusFeed: "Filtered Focus Feed",
    actionCards: "Threaded Action Cards",
};
export const tokens = {
    brand,
    shades,
    typography,
    spacing,
    dark: darkScheme,
    light: lightScheme,
    vocabulary,
};
