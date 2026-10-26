import { MARK_HEX, MARKS, type MarkKind } from "../blocks/marks.js";

/** One of TANK's status marks (see `blocks/marks.ts`), as inline SVG. */
export function Mark({ kind, size = 18, title }: { kind: MarkKind; size?: number; title?: string }) {
  const m = MARKS[kind];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      data-mark={kind}
      style={{ flexShrink: 0, opacity: m.opacity ?? 1, display: "inline-block", verticalAlign: "-0.2em" }}
    >
      <path d={MARK_HEX} fill={m.fill} stroke={m.stroke} strokeWidth={1.6} strokeLinejoin="round" />
      {m.glyph ? (
        <path
          d={m.glyph.d}
          fill="none"
          stroke={m.glyph.color}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
      {m.dot ? <circle cx={m.dot.cx} cy={m.dot.cy} r={m.dot.r} fill={m.dot.color} /> : null}
    </svg>
  );
}
