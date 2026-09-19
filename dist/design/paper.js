import { darkScheme, lightScheme, shades, typography } from "./tokens.js";
function colors(s, dark) {
    return {
        primary: s.primary,
        onPrimary: s.primaryContrast,
        primaryContainer: dark ? shades.cyan.dark : "#B2EBF2",
        onPrimaryContainer: dark ? shades.black : shades.abyss.main,
        secondary: s.secondary,
        onSecondary: s.secondaryContrast,
        secondaryContainer: dark ? shades.purple.dark : "#E8DDFF",
        onSecondaryContainer: dark ? shades.white : shades.abyss.main,
        tertiary: s.warning,
        onTertiary: s.warningContrast,
        tertiaryContainer: dark ? shades.amber.dark : "#FFECB3",
        onTertiaryContainer: shades.black,
        error: s.error,
        onError: s.errorContrast,
        errorContainer: dark ? "#5C1B1B" : "#FFDAD6",
        onErrorContainer: dark ? "#FFDAD6" : "#410002",
        background: s.background,
        onBackground: s.textPrimary,
        surface: s.paper,
        onSurface: s.textPrimary,
        surfaceVariant: s.panel,
        onSurfaceVariant: s.textSecondary,
        outline: dark ? "#5F6E7A" : "#74808C",
        outlineVariant: s.divider,
        shadow: shades.black,
        scrim: shades.black,
        inverseSurface: dark ? "#E6EDF3" : shades.abyss.main,
        inverseOnSurface: dark ? shades.abyss.main : "#E6EDF3",
        inversePrimary: dark ? shades.cyan.onLight : shades.cyan.main,
        elevation: dark
            ? {
                level0: "transparent",
                level1: shades.abyss.raised,
                level2: "#1A2029",
                level3: shades.abyss.overlay,
                level4: "#222A34",
                level5: shades.slate.main,
            }
            : {
                level0: "transparent",
                level1: "#FFFFFF",
                level2: "#F7F9FB",
                level3: "#F0F3F6",
                level4: "#EBEFF3",
                level5: "#E3E8EE",
            },
        surfaceDisabled: dark ? "rgba(230, 237, 243, 0.12)" : "rgba(13, 17, 23, 0.12)",
        onSurfaceDisabled: dark ? "rgba(230, 237, 243, 0.38)" : "rgba(13, 17, 23, 0.38)",
        backdrop: "rgba(13, 17, 23, 0.6)",
    };
}
const fonts = { display: "SpaceGrotesk", body: "SpaceGrotesk", code: "JetBrainsMono" };
export const paperDarkTheme = {
    dark: true,
    version: 3,
    isV3: true,
    roundness: 2,
    colors: colors(darkScheme, true),
    fonts: { ...fonts },
};
export const paperLightTheme = {
    dark: false,
    version: 3,
    isV3: true,
    roundness: 2,
    colors: colors(lightScheme, false),
    fonts: { ...fonts },
};
/** Dark-first alias. */
export const paperTheme = paperDarkTheme;
/** Font family CSS strings, for web consumers that self-host the same faces. */
export const paperFontFamilies = typography;
