/**
 * TANK brand tokens. Source of truth: docs/brand/COLOR_PALETTE.json in the
 * docs repo ("TANK Dark Mode"). Everything in the design package derives from
 * this file; the MUI and Paper themes are projections of it.
 */
export declare const brand: {
    /** Neural Neon Cyan — primary; AI suggestions, active context, highlight triggers. */
    readonly neuralNeonCyan: "#00E5FF";
    /** Cybernetic Purple — secondary; workflows, bot/agent executions, active thread focus. */
    readonly cyberneticPurple: "#6200EA";
    /** Armor Slate Gray — panel borders, secondary UI, code cards. */
    readonly armorSlateGray: "#263238";
    /** Deep Abyss Black — high-contrast dark background. */
    readonly deepAbyssBlack: "#0D1117";
    /** Industrial Amber — high-priority alerts, Armor Mode overrides. */
    readonly industrialAmber: "#FFC107";
};
/**
 * Derived shades. The brand hexes are fills; some are not readable as text on
 * their own background (purple on abyss is ~2:1), so each hue gets a text-safe
 * variant per scheme. Every pair used for text is asserted in contrast.test.ts.
 */
export declare const shades: {
    readonly cyan: {
        readonly main: "#00E5FF";
        readonly light: "#6EFFFF";
        readonly dark: "#00B2CC";
        readonly text: "#00E5FF";
        readonly onLight: "#006670";
    };
    readonly purple: {
        readonly main: "#6200EA";
        readonly light: "#B388FF";
        readonly dark: "#4A00B4";
        readonly text: "#B388FF";
        readonly onLight: "#6200EA";
    };
    readonly amber: {
        readonly main: "#FFC107";
        readonly light: "#FFD54F";
        readonly dark: "#FFA000";
        readonly text: "#FFC107";
        readonly onLight: "#8A5A00";
    };
    readonly slate: {
        readonly main: "#263238";
        readonly light: "#37474F";
        readonly dark: "#1C262B";
    };
    readonly abyss: {
        readonly main: "#0D1117";
        readonly raised: "#161B22";
        readonly overlay: "#1F2630";
    };
    readonly success: {
        readonly main: "#00E676";
        readonly onLight: "#00702F";
    };
    readonly error: {
        readonly main: "#FF6B6B";
        readonly onLight: "#B71C1C";
    };
    readonly info: {
        readonly main: "#40C4FF";
        readonly onLight: "#01579B";
    };
    readonly white: "#FFFFFF";
    readonly black: "#000000";
};
export declare const typography: {
    /** Display / brand / headers. */
    readonly fontDisplay: "\"Space Grotesk\", \"Helvetica Neue\", Arial, sans-serif";
    /** Body copy. Space Grotesk carries body too; the UI is dense and technical. */
    readonly fontBody: "\"Space Grotesk\", \"Helvetica Neue\", Arial, sans-serif";
    /** Code, terminal streams, agent tool logs. */
    readonly fontCode: "\"JetBrains Mono\", \"Fira Code\", ui-monospace, SFMono-Regular, Menlo, monospace";
    readonly baseSize: 14;
};
export declare const spacing: {
    readonly unit: 8;
    readonly radius: {
        readonly sm: 4;
        readonly md: 8;
        readonly lg: 12;
        readonly pill: 999;
    };
};
/** Semantic colors for the dark scheme (the default). */
export declare const darkScheme: {
    readonly background: "#0D1117";
    readonly paper: "#161B22";
    readonly panel: "#263238";
    readonly overlay: "#1F2630";
    readonly divider: "#263238";
    readonly textPrimary: "#E6EDF3";
    readonly textSecondary: "#9FB0BF";
    readonly textDisabled: "#5F6E7A";
    readonly primary: "#00E5FF";
    readonly primaryContrast: "#000000";
    readonly primaryText: "#00E5FF";
    readonly secondary: "#6200EA";
    readonly secondaryContrast: "#FFFFFF";
    readonly secondaryText: "#B388FF";
    readonly warning: "#FFC107";
    readonly warningContrast: "#000000";
    readonly warningText: "#FFC107";
    readonly success: "#00E676";
    readonly successContrast: "#000000";
    readonly error: "#FF6B6B";
    readonly errorContrast: "#000000";
    readonly info: "#40C4FF";
    readonly infoContrast: "#000000";
};
/** Derived light scheme for accessibility and marketing; same hues, readable on white. */
export declare const lightScheme: {
    readonly background: "#F4F7FA";
    readonly paper: "#FFFFFF";
    readonly panel: "#E3E8EE";
    readonly overlay: "#D5DDE5";
    readonly divider: "#CBD5DF";
    readonly textPrimary: "#0D1117";
    readonly textSecondary: "#3E4C59";
    readonly textDisabled: "#8A97A3";
    readonly primary: "#006670";
    readonly primaryContrast: "#FFFFFF";
    readonly primaryText: "#006670";
    readonly secondary: "#6200EA";
    readonly secondaryContrast: "#FFFFFF";
    readonly secondaryText: "#6200EA";
    readonly warning: "#8A5A00";
    readonly warningContrast: "#FFFFFF";
    readonly warningText: "#8A5A00";
    readonly success: "#00702F";
    readonly successContrast: "#FFFFFF";
    readonly error: "#B71C1C";
    readonly errorContrast: "#FFFFFF";
    readonly info: "#01579B";
    readonly infoContrast: "#FFFFFF";
};
export type Scheme = {
    readonly [K in keyof typeof darkScheme]: string;
};
/** Product vocabulary: the data model keeps neutral names, the UI uses TANK's. */
export declare const vocabulary: {
    readonly channel: "Tread";
    readonly channels: "Treads";
    readonly search: "Neural Vault";
    readonly doNotDisturb: "Armor Mode";
    readonly automation: "Auto-Pilot";
    readonly liveContext: "Live Context";
    readonly instantAnswers: "Instant Answers";
    readonly focusFeed: "Filtered Focus Feed";
    readonly actionCards: "Threaded Action Cards";
};
export declare const tokens: {
    readonly brand: {
        /** Neural Neon Cyan — primary; AI suggestions, active context, highlight triggers. */
        readonly neuralNeonCyan: "#00E5FF";
        /** Cybernetic Purple — secondary; workflows, bot/agent executions, active thread focus. */
        readonly cyberneticPurple: "#6200EA";
        /** Armor Slate Gray — panel borders, secondary UI, code cards. */
        readonly armorSlateGray: "#263238";
        /** Deep Abyss Black — high-contrast dark background. */
        readonly deepAbyssBlack: "#0D1117";
        /** Industrial Amber — high-priority alerts, Armor Mode overrides. */
        readonly industrialAmber: "#FFC107";
    };
    readonly shades: {
        readonly cyan: {
            readonly main: "#00E5FF";
            readonly light: "#6EFFFF";
            readonly dark: "#00B2CC";
            readonly text: "#00E5FF";
            readonly onLight: "#006670";
        };
        readonly purple: {
            readonly main: "#6200EA";
            readonly light: "#B388FF";
            readonly dark: "#4A00B4";
            readonly text: "#B388FF";
            readonly onLight: "#6200EA";
        };
        readonly amber: {
            readonly main: "#FFC107";
            readonly light: "#FFD54F";
            readonly dark: "#FFA000";
            readonly text: "#FFC107";
            readonly onLight: "#8A5A00";
        };
        readonly slate: {
            readonly main: "#263238";
            readonly light: "#37474F";
            readonly dark: "#1C262B";
        };
        readonly abyss: {
            readonly main: "#0D1117";
            readonly raised: "#161B22";
            readonly overlay: "#1F2630";
        };
        readonly success: {
            readonly main: "#00E676";
            readonly onLight: "#00702F";
        };
        readonly error: {
            readonly main: "#FF6B6B";
            readonly onLight: "#B71C1C";
        };
        readonly info: {
            readonly main: "#40C4FF";
            readonly onLight: "#01579B";
        };
        readonly white: "#FFFFFF";
        readonly black: "#000000";
    };
    readonly typography: {
        /** Display / brand / headers. */
        readonly fontDisplay: "\"Space Grotesk\", \"Helvetica Neue\", Arial, sans-serif";
        /** Body copy. Space Grotesk carries body too; the UI is dense and technical. */
        readonly fontBody: "\"Space Grotesk\", \"Helvetica Neue\", Arial, sans-serif";
        /** Code, terminal streams, agent tool logs. */
        readonly fontCode: "\"JetBrains Mono\", \"Fira Code\", ui-monospace, SFMono-Regular, Menlo, monospace";
        readonly baseSize: 14;
    };
    readonly spacing: {
        readonly unit: 8;
        readonly radius: {
            readonly sm: 4;
            readonly md: 8;
            readonly lg: 12;
            readonly pill: 999;
        };
    };
    readonly dark: {
        readonly background: "#0D1117";
        readonly paper: "#161B22";
        readonly panel: "#263238";
        readonly overlay: "#1F2630";
        readonly divider: "#263238";
        readonly textPrimary: "#E6EDF3";
        readonly textSecondary: "#9FB0BF";
        readonly textDisabled: "#5F6E7A";
        readonly primary: "#00E5FF";
        readonly primaryContrast: "#000000";
        readonly primaryText: "#00E5FF";
        readonly secondary: "#6200EA";
        readonly secondaryContrast: "#FFFFFF";
        readonly secondaryText: "#B388FF";
        readonly warning: "#FFC107";
        readonly warningContrast: "#000000";
        readonly warningText: "#FFC107";
        readonly success: "#00E676";
        readonly successContrast: "#000000";
        readonly error: "#FF6B6B";
        readonly errorContrast: "#000000";
        readonly info: "#40C4FF";
        readonly infoContrast: "#000000";
    };
    readonly light: {
        readonly background: "#F4F7FA";
        readonly paper: "#FFFFFF";
        readonly panel: "#E3E8EE";
        readonly overlay: "#D5DDE5";
        readonly divider: "#CBD5DF";
        readonly textPrimary: "#0D1117";
        readonly textSecondary: "#3E4C59";
        readonly textDisabled: "#8A97A3";
        readonly primary: "#006670";
        readonly primaryContrast: "#FFFFFF";
        readonly primaryText: "#006670";
        readonly secondary: "#6200EA";
        readonly secondaryContrast: "#FFFFFF";
        readonly secondaryText: "#6200EA";
        readonly warning: "#8A5A00";
        readonly warningContrast: "#FFFFFF";
        readonly warningText: "#8A5A00";
        readonly success: "#00702F";
        readonly successContrast: "#FFFFFF";
        readonly error: "#B71C1C";
        readonly errorContrast: "#FFFFFF";
        readonly info: "#01579B";
        readonly infoContrast: "#FFFFFF";
    };
    readonly vocabulary: {
        readonly channel: "Tread";
        readonly channels: "Treads";
        readonly search: "Neural Vault";
        readonly doNotDisturb: "Armor Mode";
        readonly automation: "Auto-Pilot";
        readonly liveContext: "Live Context";
        readonly instantAnswers: "Instant Answers";
        readonly focusFeed: "Filtered Focus Feed";
        readonly actionCards: "Threaded Action Cards";
    };
};
