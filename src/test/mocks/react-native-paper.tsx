/**
 * Minimal `react-native-paper` stand-in for Vitest: every component renders as a host element named
 * after itself with its props, `useTheme` returns the SDK's dark Paper theme.
 */
import { createElement, type ReactNode } from "react";
import { paperDarkTheme } from "../../design/paper.js";

type Props = Record<string, unknown> & { children?: ReactNode };
const host = (name: string) => (props: Props) => createElement(name, props);

export const Text = host("Text");
export const Button = host("Button");
export const Chip = host("Chip");
export const Divider = host("Divider");
export const ProgressBar = host("ProgressBar");

export type MD3Theme = typeof paperDarkTheme;
export function useTheme(): MD3Theme {
  return paperDarkTheme;
}
