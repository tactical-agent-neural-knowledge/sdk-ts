import { createTheme, type Theme } from "@mui/material/styles";
import { muiThemeOptions } from "../design/mui.js";

declare module "@mui/material/styles" {
  interface Palette {
    tank: {
      panel: string;
      overlay: string;
      primaryText: string;
      secondaryText: string;
      warningText: string;
      agent: string;
      ai: string;
      alert: string;
    };
  }
  interface PaletteOptions {
    tank?: Partial<Palette["tank"]>;
  }
}

/** The TANK MUI theme (dark default, light scheme available). Build your own with `createTheme(muiThemeOptions)`. */
export const tankTheme: Theme = createTheme(muiThemeOptions);

export { muiThemeOptions };
