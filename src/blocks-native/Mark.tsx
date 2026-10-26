import { Circle, Path, Svg } from "react-native-svg";
import { MARK_HEX, MARKS, type MarkKind } from "../blocks/marks.js";

/** One of TANK's status marks (see `blocks/marks.ts`), drawn with react-native-svg. */
export function Mark({ kind, size = 18, title }: { kind: MarkKind; size?: number; title?: string }) {
  const m = MARKS[kind];
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      opacity={m.opacity ?? 1}
      accessibilityLabel={title}
      testID={`mark-${kind}`}
    >
      <Path d={MARK_HEX} fill={m.fill} stroke={m.stroke} strokeWidth={1.6} strokeLinejoin="round" />
      {m.glyph ? (
        <Path
          d={m.glyph.d}
          fill="none"
          stroke={m.glyph.color}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
      {m.dot ? <Circle cx={m.dot.cx} cy={m.dot.cy} r={m.dot.r} fill={m.dot.color} /> : null}
    </Svg>
  );
}
