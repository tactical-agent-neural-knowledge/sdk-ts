/**
 * Brand fonts. No font binaries live in this repo: web loads them from Google
 * Fonts, mobile from the matching `@expo-google-fonts/*` packages. The family
 * names here are what `typography.fontDisplay` / `fontCode` (tokens.ts) and
 * the MUI/Paper themes reference.
 */
export interface FontFace {
    /** CSS / Google Fonts family name. */
    family: string;
    /** Weights shipped by both the Google Fonts URL and the Expo package. */
    weights: readonly number[];
    /** `@expo-google-fonts` package for mobile. */
    expoPackage: string;
    /** Named exports of that package (one per weight) → the `fontFamily` string React Native expects. */
    expoFonts: Readonly<Record<number, string>>;
}
export declare const fonts: {
    /** Display, headers and body copy. */
    readonly display: {
        readonly family: "Space Grotesk";
        readonly weights: readonly [400, 500, 600, 700];
        readonly expoPackage: "@expo-google-fonts/space-grotesk";
        readonly expoFonts: {
            readonly 400: "SpaceGrotesk_400Regular";
            readonly 500: "SpaceGrotesk_500Medium";
            readonly 600: "SpaceGrotesk_600SemiBold";
            readonly 700: "SpaceGrotesk_700Bold";
        };
    };
    /** Code, terminal streams, agent tool logs. */
    readonly code: {
        readonly family: "JetBrains Mono";
        readonly weights: readonly [400, 500, 700];
        readonly expoPackage: "@expo-google-fonts/jetbrains-mono";
        readonly expoFonts: {
            readonly 400: "JetBrainsMono_400Regular";
            readonly 500: "JetBrainsMono_500Medium";
            readonly 700: "JetBrainsMono_700Bold";
        };
    };
};
/** Family names by role: `{ display: "Space Grotesk", code: "JetBrains Mono" }`. */
export declare const fontFamilies: {
    readonly display: "Space Grotesk";
    readonly body: "Space Grotesk";
    readonly code: "JetBrains Mono";
};
/** Google Fonts stylesheet for the web app (`<link rel="stylesheet" href={googleFontsUrl}>`). */
export declare const googleFontsUrl: string;
/** The `<link>` tags to drop in `index.html` (preconnect + stylesheet). */
export declare const googleFontsLinkTag: string;
/** `@expo-google-fonts/*` packages the mobile app installs (`npx expo install ...`). */
export declare const expoGoogleFontsPackages: readonly ["@expo-google-fonts/space-grotesk", "@expo-google-fonts/jetbrains-mono"];
