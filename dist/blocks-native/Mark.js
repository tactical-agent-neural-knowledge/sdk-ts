import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Circle, Path, Svg } from "react-native-svg";
import { MARK_HEX, MARKS } from "../blocks/marks.js";
/** One of TANK's status marks (see `blocks/marks.ts`), drawn with react-native-svg. */
export function Mark({ kind, size = 18, title }) {
    const m = MARKS[kind];
    return (_jsxs(Svg, { width: size, height: size, viewBox: "0 0 24 24", opacity: m.opacity ?? 1, accessibilityLabel: title, testID: `mark-${kind}`, children: [_jsx(Path, { d: MARK_HEX, fill: m.fill, stroke: m.stroke, strokeWidth: 1.6, strokeLinejoin: "round" }), m.glyph ? (_jsx(Path, { d: m.glyph.d, fill: "none", stroke: m.glyph.color, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" })) : null, m.dot ? _jsx(Circle, { cx: m.dot.cx, cy: m.dot.cy, r: m.dot.r, fill: m.dot.color }) : null] }));
}
