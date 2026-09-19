/**
 * Brand fonts. No font binaries live in this repo: web loads them from Google
 * Fonts, mobile from the matching `@expo-google-fonts/*` packages. The family
 * names here are what `typography.fontDisplay` / `fontCode` (tokens.ts) and
 * the MUI/Paper themes reference.
 */
export const fonts = {
    /** Display, headers and body copy. */
    display: {
        family: "Space Grotesk",
        weights: [400, 500, 600, 700],
        expoPackage: "@expo-google-fonts/space-grotesk",
        expoFonts: {
            400: "SpaceGrotesk_400Regular",
            500: "SpaceGrotesk_500Medium",
            600: "SpaceGrotesk_600SemiBold",
            700: "SpaceGrotesk_700Bold",
        },
    },
    /** Code, terminal streams, agent tool logs. */
    code: {
        family: "JetBrains Mono",
        weights: [400, 500, 700],
        expoPackage: "@expo-google-fonts/jetbrains-mono",
        expoFonts: {
            400: "JetBrainsMono_400Regular",
            500: "JetBrainsMono_500Medium",
            700: "JetBrainsMono_700Bold",
        },
    },
};
/** Family names by role: `{ display: "Space Grotesk", code: "JetBrains Mono" }`. */
export const fontFamilies = {
    display: fonts.display.family,
    body: fonts.display.family,
    code: fonts.code.family,
};
/** Google Fonts stylesheet for the web app (`<link rel="stylesheet" href={googleFontsUrl}>`). */
export const googleFontsUrl = `https://fonts.googleapis.com/css2?${[fonts.display, fonts.code]
    .map((f) => `family=${f.family.replace(/ /g, "+")}:wght@${f.weights.join(";")}`)
    .join("&")}&display=swap`;
/** The `<link>` tags to drop in `index.html` (preconnect + stylesheet). */
export const googleFontsLinkTag = [
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    `<link rel="stylesheet" href="${googleFontsUrl}">`,
].join("\n");
/** `@expo-google-fonts/*` packages the mobile app installs (`npx expo install ...`). */
export const expoGoogleFontsPackages = [fonts.display.expoPackage, fonts.code.expoPackage];
