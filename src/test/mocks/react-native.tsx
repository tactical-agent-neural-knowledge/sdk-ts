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
export const ScrollView = host("ScrollView");

export const StyleSheet = {
  hairlineWidth: 1,
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

/** `Animated` and `Easing` as far as `StatusLine` uses them: values that hold a number, and
 * animations that jump to their end when started. No timers, so a test never waits on one. */
class AnimatedValue {
  constructor(public value: number) {}
  setValue(v: number): void {
    this.value = v;
  }
}
const animation = (run: () => void) => ({ start: () => run(), stop: () => undefined });
export const Animated = {
  Value: AnimatedValue,
  View: host("View"),
  Text: host("Text"),
  timing: (v: AnimatedValue, cfg: { toValue: number }) => animation(() => v.setValue(cfg.toValue)),
  sequence: (all: Array<{ start: () => void }>) =>
    animation(() => {
      for (const a of all) a.start();
    }),
  loop: (a: { start: () => void; stop: () => void }) => a,
};
export const Easing = { ease: (t: number) => t, inOut: (f: (t: number) => number) => f };
