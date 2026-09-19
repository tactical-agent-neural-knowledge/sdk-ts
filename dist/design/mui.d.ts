/**
 * Options for MUI 7 `createTheme`. Dark-first: `defaultColorScheme: "dark"`,
 * with a derived light scheme. CSS variables are on so Emotion styles can read
 * `var(--mui-palette-*)` and the scheme can flip without a re-render storm.
 *
 * Usage: `createTheme(muiThemeOptions)`. The object is plain data (no MUI import)
 * so it can be consumed without pulling MUI into non-DOM bundles.
 */
export declare const muiThemeOptions: {
    readonly cssVariables: {
        readonly colorSchemeSelector: "data-tank-scheme";
    };
    readonly defaultColorScheme: "dark";
    readonly colorSchemes: {
        readonly dark: {
            readonly palette: {
                mode: "light" | "dark";
                primary: {
                    main: string;
                    contrastText: string;
                };
                secondary: {
                    main: string;
                    contrastText: string;
                };
                warning: {
                    main: string;
                    contrastText: string;
                };
                success: {
                    main: string;
                    contrastText: string;
                };
                error: {
                    main: string;
                    contrastText: string;
                };
                info: {
                    main: string;
                    contrastText: string;
                };
                background: {
                    default: string;
                    paper: string;
                };
                text: {
                    primary: string;
                    secondary: string;
                    disabled: string;
                };
                divider: string;
                /** TANK-specific slots, read via theme.palette.tank.* (declared by the consumer's module augmentation). */
                tank: {
                    panel: string;
                    overlay: string;
                    primaryText: string;
                    secondaryText: string;
                    warningText: string;
                    /** Agent executions / Threaded Action Cards accent. */
                    agent: string;
                    /** AI suggestions / Live Context accent. */
                    ai: string;
                    /** Armor Mode / critical alert accent. */
                    alert: string;
                };
            };
        };
        readonly light: {
            readonly palette: {
                mode: "light" | "dark";
                primary: {
                    main: string;
                    contrastText: string;
                };
                secondary: {
                    main: string;
                    contrastText: string;
                };
                warning: {
                    main: string;
                    contrastText: string;
                };
                success: {
                    main: string;
                    contrastText: string;
                };
                error: {
                    main: string;
                    contrastText: string;
                };
                info: {
                    main: string;
                    contrastText: string;
                };
                background: {
                    default: string;
                    paper: string;
                };
                text: {
                    primary: string;
                    secondary: string;
                    disabled: string;
                };
                divider: string;
                /** TANK-specific slots, read via theme.palette.tank.* (declared by the consumer's module augmentation). */
                tank: {
                    panel: string;
                    overlay: string;
                    primaryText: string;
                    secondaryText: string;
                    warningText: string;
                    /** Agent executions / Threaded Action Cards accent. */
                    agent: string;
                    /** AI suggestions / Live Context accent. */
                    ai: string;
                    /** Armor Mode / critical alert accent. */
                    alert: string;
                };
            };
        };
    };
    readonly shape: {
        readonly borderRadius: 8;
    };
    readonly spacing: 8;
    readonly typography: {
        readonly fontFamily: "\"Space Grotesk\", \"Helvetica Neue\", Arial, sans-serif";
        readonly fontSize: 14;
        readonly h1: {
            readonly fontSize: "2.25rem";
            readonly fontFamily: "\"Space Grotesk\", \"Helvetica Neue\", Arial, sans-serif";
            readonly fontWeight: number;
            readonly letterSpacing: string;
        };
        readonly h2: {
            readonly fontSize: "1.75rem";
            readonly fontFamily: "\"Space Grotesk\", \"Helvetica Neue\", Arial, sans-serif";
            readonly fontWeight: number;
            readonly letterSpacing: string;
        };
        readonly h3: {
            readonly fontSize: "1.5rem";
            readonly fontFamily: "\"Space Grotesk\", \"Helvetica Neue\", Arial, sans-serif";
            readonly fontWeight: number;
            readonly letterSpacing: string;
        };
        readonly h4: {
            readonly fontSize: "1.25rem";
            readonly fontFamily: "\"Space Grotesk\", \"Helvetica Neue\", Arial, sans-serif";
            readonly fontWeight: number;
            readonly letterSpacing: string;
        };
        readonly h5: {
            readonly fontSize: "1.125rem";
            readonly fontFamily: "\"Space Grotesk\", \"Helvetica Neue\", Arial, sans-serif";
            readonly fontWeight: number;
            readonly letterSpacing: string;
        };
        readonly h6: {
            readonly fontSize: "1rem";
            readonly fontFamily: "\"Space Grotesk\", \"Helvetica Neue\", Arial, sans-serif";
            readonly fontWeight: number;
            readonly letterSpacing: string;
        };
        readonly subtitle1: {
            readonly fontFamily: "\"Space Grotesk\", \"Helvetica Neue\", Arial, sans-serif";
            readonly fontWeight: 500;
        };
        readonly subtitle2: {
            readonly fontFamily: "\"Space Grotesk\", \"Helvetica Neue\", Arial, sans-serif";
            readonly fontWeight: 500;
            readonly fontSize: "0.8125rem";
        };
        readonly body1: {
            readonly fontSize: "0.9375rem";
            readonly lineHeight: 1.5;
        };
        readonly body2: {
            readonly fontSize: "0.8125rem";
            readonly lineHeight: 1.45;
        };
        readonly button: {
            readonly fontFamily: "\"Space Grotesk\", \"Helvetica Neue\", Arial, sans-serif";
            readonly fontWeight: 600;
            readonly textTransform: "none";
        };
        readonly caption: {
            readonly fontSize: "0.75rem";
        };
        readonly overline: {
            readonly fontFamily: "\"Space Grotesk\", \"Helvetica Neue\", Arial, sans-serif";
            readonly fontWeight: 600;
            readonly letterSpacing: "0.08em";
        };
    };
    readonly components: {
        readonly MuiCssBaseline: {
            readonly styleOverrides: {
                readonly "code, kbd, pre, samp": {
                    readonly fontFamily: "\"JetBrains Mono\", \"Fira Code\", ui-monospace, SFMono-Regular, Menlo, monospace";
                };
            };
        };
        readonly MuiButton: {
            readonly defaultProps: {
                readonly disableElevation: true;
            };
            readonly styleOverrides: {
                readonly root: {
                    readonly borderRadius: 8;
                    readonly paddingInline: 14;
                };
            };
        };
        readonly MuiPaper: {
            readonly styleOverrides: {
                readonly root: {
                    readonly backgroundImage: "none";
                };
            };
        };
        readonly MuiCard: {
            readonly styleOverrides: {
                readonly root: {
                    readonly backgroundImage: "none";
                    readonly border: "1px solid var(--mui-palette-divider)";
                };
            };
        };
        readonly MuiChip: {
            readonly styleOverrides: {
                readonly root: {
                    readonly fontFamily: "\"Space Grotesk\", \"Helvetica Neue\", Arial, sans-serif";
                    readonly fontWeight: 500;
                };
            };
        };
        readonly MuiTooltip: {
            readonly styleOverrides: {
                readonly tooltip: {
                    readonly fontSize: "0.75rem";
                };
            };
        };
        readonly MuiLink: {
            readonly defaultProps: {
                readonly underline: "hover";
            };
        };
    };
};
export type TankMuiThemeOptions = typeof muiThemeOptions;
