/**
 * Minimal `react-native` stand-in for Vitest: host components render as plain elements (the same
 * thing React Native's own Jest preset does), `StyleSheet.create` is the identity and `Alert` /
 * `Linking` record calls. Only what `src/blocks-native` touches is implemented.
 */
import { createElement, type ReactNode } from "react";

type Props = Record<string, unknown> & { children?: ReactNode };
const host = (name: string) => (props: Props) => createElement(name, props);

export const View = host("View");
export const Image = host("Image");
export const Pressable = host("Pressable");

export const StyleSheet = {
  create<T>(styles: T): T {
    return styles;
  },
  flatten(style: unknown): unknown {
    return style;
  },
};

export const alerts: Array<{
  title: string;
  message?: string;
  buttons?: Array<{ text?: string; onPress?: () => void }>;
}> = [];
export const Alert = {
  alert(title: string, message?: string, buttons?: Array<{ text?: string; onPress?: () => void }>): void {
    alerts.push({ title, message, buttons });
  },
};

export const opened: string[] = [];
export const Linking = {
  openURL(url: string): Promise<void> {
    opened.push(url);
    return Promise.resolve();
  },
};

export const Platform = { OS: "ios", select: <T,>(o: Record<string, T>) => o.ios ?? o.default };
