import { darkScheme, lightScheme, type Scheme, spacing, typography } from "./tokens.js";

function palette(s: Scheme, mode: "dark" | "light") {
  return {
    mode,
    primary: { main: s.primary, contrastText: s.primaryContrast },
    secondary: { main: s.secondary, contrastText: s.secondaryContrast },
    warning: { main: s.warning, contrastText: s.warningContrast },
    success: { main: s.success, contrastText: s.successContrast },
    error: { main: s.error, contrastText: s.errorContrast },
    info: { main: s.info, contrastText: s.infoContrast },
    background: { default: s.background, paper: s.paper },
    text: { primary: s.textPrimary, secondary: s.textSecondary, disabled: s.textDisabled },
    divider: s.divider,
    /** TANK-specific slots, read via theme.palette.tank.* (declared by the consumer's module augmentation). */
    tank: {
      panel: s.panel,
      overlay: s.overlay,
      primaryText: s.primaryText,
      secondaryText: s.secondaryText,
      warningText: s.warningText,
      /** Agent executions / Threaded Action Cards accent. */
      agent: s.secondary,
      /** AI suggestions / Live Context accent. */
      ai: s.primary,
      /** Armor Mode / critical alert accent. */
      alert: s.warning,
    },
  };
}

const heading = { fontFamily: typography.fontDisplay, fontWeight: 600, letterSpacing: "-0.01em" };

/**
 * Options for MUI 7 `createTheme`. Dark-first: `defaultColorScheme: "dark"`,
 * with a derived light scheme. CSS variables are on so Emotion styles can read
 * `var(--mui-palette-*)` and the scheme can flip without a re-render storm.
 *
 * Usage: `createTheme(muiThemeOptions)`. The object is plain data (no MUI import)
 * so it can be consumed without pulling MUI into non-DOM bundles.
 */
export const muiThemeOptions = {
  cssVariables: { colorSchemeSelector: "data-tank-scheme" },
  defaultColorScheme: "dark",
  colorSchemes: {
    dark: { palette: palette(darkScheme, "dark") },
    light: { palette: palette(lightScheme, "light") },
  },
  shape: { borderRadius: spacing.radius.md },
  spacing: spacing.unit,
  typography: {
    fontFamily: typography.fontBody,
    fontSize: typography.baseSize,
    h1: { ...heading, fontSize: "2.25rem" },
    h2: { ...heading, fontSize: "1.75rem" },
    h3: { ...heading, fontSize: "1.5rem" },
    h4: { ...heading, fontSize: "1.25rem" },
    h5: { ...heading, fontSize: "1.125rem" },
    h6: { ...heading, fontSize: "1rem" },
    subtitle1: { fontFamily: typography.fontDisplay, fontWeight: 500 },
    subtitle2: { fontFamily: typography.fontDisplay, fontWeight: 500, fontSize: "0.8125rem" },
    body1: { fontSize: "0.9375rem", lineHeight: 1.5 },
    body2: { fontSize: "0.8125rem", lineHeight: 1.45 },
    button: { fontFamily: typography.fontDisplay, fontWeight: 600, textTransform: "none" },
    caption: { fontSize: "0.75rem" },
    overline: { fontFamily: typography.fontDisplay, fontWeight: 600, letterSpacing: "0.08em" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "code, kbd, pre, samp": { fontFamily: typography.fontCode },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: spacing.radius.md, paddingInline: 14 } },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiCard: {
      styleOverrides: { root: { backgroundImage: "none", border: "1px solid var(--mui-palette-divider)" } },
    },
    MuiChip: {
      styleOverrides: { root: { fontFamily: typography.fontDisplay, fontWeight: 500 } },
    },
    MuiTooltip: {
      styleOverrides: { tooltip: { fontSize: "0.75rem" } },
    },
    MuiLink: {
      defaultProps: { underline: "hover" },
    },
  },
} as const;

export type TankMuiThemeOptions = typeof muiThemeOptions;
