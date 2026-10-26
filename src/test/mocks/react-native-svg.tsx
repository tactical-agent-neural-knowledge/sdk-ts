/** Minimal `react-native-svg` stand-in for Vitest: each shape renders as a host element. */
import { createElement, type ReactNode } from "react";

type Props = Record<string, unknown> & { children?: ReactNode };
const host = (name: string) => (props: Props) => createElement(name, props);

export const Svg = host("Svg");
export const Path = host("Path");
export const Circle = host("Circle");
