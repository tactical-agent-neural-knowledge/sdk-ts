import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MARK_HEX, MARKS } from "../blocks/marks.js";
/** One of TANK's status marks (see `blocks/marks.ts`), as inline SVG. */
export function Mark({ kind, size = 18, title }) {
    const m = MARKS[kind];
    return (_jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", role: title ? "img" : undefined, "aria-hidden": title ? undefined : true, "aria-label": title, "data-mark": kind, style: { flexShrink: 0, opacity: m.opacity ?? 1, display: "inline-block", verticalAlign: "-0.2em" }, children: [_jsx("path", { d: MARK_HEX, fill: m.fill, stroke: m.stroke, strokeWidth: 1.6, strokeLinejoin: "round" }), m.glyph ? (_jsx("path", { d: m.glyph.d, fill: "none", stroke: m.glyph.color, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" })) : null, m.dot ? _jsx("circle", { cx: m.dot.cx, cy: m.dot.cy, r: m.dot.r, fill: m.dot.color }) : null] }));
}
