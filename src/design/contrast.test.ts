import { createTheme } from "@mui/material/styles";
import { describe, expect, it } from "vitest";
import { contrastRatio, meetsAA, WCAG } from "./contrast.js";
import { muiThemeOptions } from "./mui.js";
import { paperDarkTheme, paperLightTheme } from "./paper.js";
import { brand, darkScheme, lightScheme } from "./tokens.js";

describe("contrast math", () => {
  it("black on white is 21:1", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
    expect(contrastRatio("#fff", "#000")).toBeCloseTo(21, 1);
  });
  it("purple brand fill is NOT readable as text on the abyss background (why shades.purple.text exists)", () => {
    expect(contrastRatio(brand.cyberneticPurple, brand.deepAbyssBlack)).toBeLessThan(WCAG.AA_TEXT);
  });
});

const schemes = { dark: darkScheme, light: lightScheme } as const;

describe.each(Object.entries(schemes))("WCAG AA — %s scheme", (_name, s) => {
  const textOnSurfaces: Array<[string, string, string]> = [];
  for (const [surfName, surf] of [
    ["background", s.background],
    ["paper", s.paper],
    ["panel", s.panel],
  ] as const) {
    textOnSurfaces.push([`textPrimary on ${surfName}`, s.textPrimary, surf]);
    textOnSurfaces.push([`textSecondary on ${surfName}`, s.textSecondary, surf]);
    textOnSurfaces.push([`primaryText on ${surfName}`, s.primaryText, surf]);
    textOnSurfaces.push([`secondaryText on ${surfName}`, s.secondaryText, surf]);
    textOnSurfaces.push([`warningText on ${surfName}`, s.warningText, surf]);
    textOnSurfaces.push([`error on ${surfName}`, s.error, surf]);
    textOnSurfaces.push([`success on ${surfName}`, s.success, surf]);
    textOnSurfaces.push([`info on ${surfName}`, s.info, surf]);
  }
  it.each(textOnSurfaces)("%s >= 4.5:1", (_label, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(WCAG.AA_TEXT);
  });

  const fills: Array<[string, string, string]> = [
    ["primary button text", s.primaryContrast, s.primary],
    ["secondary button text", s.secondaryContrast, s.secondary],
    ["warning button text", s.warningContrast, s.warning],
    ["success button text", s.successContrast, s.success],
    ["error button text", s.errorContrast, s.error],
    ["info button text", s.infoContrast, s.info],
  ];
  it.each(fills)("%s >= 4.5:1", (_label, fg, bg) => {
    expect(meetsAA(fg, bg)).toBe(true);
  });

  it("brand fills are distinguishable UI components on the background (>= 3:1)", () => {
    for (const fill of [s.primary, s.warning, s.error, s.success]) {
      expect(contrastRatio(fill, s.background)).toBeGreaterThanOrEqual(WCAG.AA_LARGE);
    }
  });
});

describe("theme projections", () => {
  it("muiThemeOptions builds a MUI 7 theme with both color schemes", () => {
    const theme = createTheme(muiThemeOptions);
    expect(theme.palette.primary.main.toUpperCase()).toBe(brand.neuralNeonCyan);
    expect(theme.palette.secondary.main.toUpperCase()).toBe(brand.cyberneticPurple);
    expect(theme.palette.background.default.toUpperCase()).toBe(brand.deepAbyssBlack);
    const light = createTheme({ ...muiThemeOptions, defaultColorScheme: "light" });
    expect(light.palette.background.paper).toBe("#FFFFFF");
    expect(light.palette.mode).toBe("light");
    expect(theme.typography.fontFamily).toContain("Space Grotesk");
    expect(theme.vars?.palette.primary.main).toContain("--mui-palette-primary-main");
  });

  it("paper themes carry every MD3 color slot with readable on-colors", () => {
    for (const t of [paperDarkTheme, paperLightTheme]) {
      expect(meetsAA(t.colors.onBackground, t.colors.background)).toBe(true);
      expect(meetsAA(t.colors.onSurface, t.colors.surface)).toBe(true);
      expect(meetsAA(t.colors.onPrimary, t.colors.primary)).toBe(true);
      expect(meetsAA(t.colors.onSecondary, t.colors.secondary)).toBe(true);
      expect(meetsAA(t.colors.onTertiary, t.colors.tertiary)).toBe(true);
      expect(meetsAA(t.colors.onError, t.colors.error)).toBe(true);
      expect(Object.keys(t.colors.elevation)).toHaveLength(6);
    }
    expect(paperDarkTheme.dark).toBe(true);
    expect(paperLightTheme.dark).toBe(false);
  });
});
