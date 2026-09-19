/**
 * Colors shaped like react-native-paper's MD3 theme (`MD3Theme["colors"]`).
 * Plain data: this package never imports react-native. Mobile spreads it over
 * `MD3DarkTheme` / `MD3LightTheme` from react-native-paper.
 */
export interface PaperColors {
    primary: string;
    onPrimary: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    secondary: string;
    onSecondary: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    tertiary: string;
    onTertiary: string;
    tertiaryContainer: string;
    onTertiaryContainer: string;
    error: string;
    onError: string;
    errorContainer: string;
    onErrorContainer: string;
    background: string;
    onBackground: string;
    surface: string;
    onSurface: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
    outline: string;
    outlineVariant: string;
    shadow: string;
    scrim: string;
    inverseSurface: string;
    inverseOnSurface: string;
    inversePrimary: string;
    elevation: {
        level0: string;
        level1: string;
        level2: string;
        level3: string;
        level4: string;
        level5: string;
    };
    surfaceDisabled: string;
    onSurfaceDisabled: string;
    backdrop: string;
}
export interface PaperTheme {
    dark: boolean;
    version: 3;
    isV3: true;
    roundness: number;
    colors: PaperColors;
    fonts: {
        display: string;
        body: string;
        code: string;
    };
}
export declare const paperDarkTheme: PaperTheme;
export declare const paperLightTheme: PaperTheme;
/** Dark-first alias. */
export declare const paperTheme: PaperTheme;
/** Font family CSS strings, for web consumers that self-host the same faces. */
export declare const paperFontFamilies: {
    readonly fontDisplay: "\"Space Grotesk\", \"Helvetica Neue\", Arial, sans-serif";
    readonly fontBody: "\"Space Grotesk\", \"Helvetica Neue\", Arial, sans-serif";
    readonly fontCode: "\"JetBrains Mono\", \"Fira Code\", ui-monospace, SFMono-Regular, Menlo, monospace";
    readonly baseSize: 14;
};
