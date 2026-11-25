/**
 * Times in a message or card are sent as tokens, never as a clock written by the server
 * (Robby, 2026-11-25: "Approved by Robby at 11:16 UTC" must read "6:16 AM" for him in ET,
 * and each viewer's own time for everybody else). The server writes `<t:SECONDS>` or
 * `<t:SECONDS:STYLE>` (seconds since the Unix epoch) and every client replaces the token
 * with the moment in the device's own time zone and locale.
 *
 * Styles: `t` a clock time ("6:16 AM", the default), `f` the day and the time
 * ("Wednesday, December 2, 5:55 AM"), `d` the day alone ("December 2").
 */
export type LocalTimeStyle = "t" | "f" | "d";

export interface LocalTimeOptions {
  /** An IANA zone; the device's own when unset. Tests pin it. */
  timeZone?: string;
  /** A BCP 47 locale; the device's own when unset. */
  locale?: string | string[];
}

const TOKEN = /<t:(-?\d{1,12})(?::([tfd]))?>/g;

/** The token for a moment, as a server or a client writes it into text. */
export function timeToken(ms: number, style: LocalTimeStyle = "t"): string {
  const s = Math.floor(ms / 1000);
  return style === "t" ? `<t:${s}>` : `<t:${s}:${style}>`;
}

/** Whether text carries a time token. */
export function hasTimeTokens(text: string): boolean {
  return text.includes("<t:") && new RegExp(TOKEN.source).test(text);
}

const SHAPES: Record<LocalTimeStyle, Intl.DateTimeFormatOptions> = {
  t: { hour: "numeric", minute: "2-digit" },
  f: { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" },
  d: { month: "long", day: "numeric" },
};

const cache = new Map<string, Intl.DateTimeFormat>();

function formatter(style: LocalTimeStyle, opts: LocalTimeOptions): Intl.DateTimeFormat {
  const locale = opts.locale === undefined ? "" : String(opts.locale);
  const key = `${style}|${opts.timeZone ?? ""}|${locale}`;
  let f = cache.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat(opts.locale, { ...SHAPES[style], timeZone: opts.timeZone });
    cache.set(key, f);
  }
  return f;
}

/** A moment in the device's (or the given) time zone and locale. */
export function formatLocalTime(
  ms: number,
  style: LocalTimeStyle = "t",
  opts: LocalTimeOptions = {},
): string {
  return formatter(style, opts).format(new Date(ms));
}

/** Text with every time token replaced by the moment in the viewer's own time. */
export function localTimes(text: string, opts: LocalTimeOptions = {}): string {
  if (!text || !text.includes("<t:")) return text;
  return text.replace(TOKEN, (_, secs: string, style: string | undefined) =>
    formatLocalTime(Number(secs) * 1000, (style as LocalTimeStyle | undefined) ?? "t", opts),
  );
}

/**
 * A copy of a message's blocks (or any protobuf message) with the time tokens in every
 * string replaced; the same object back when there are none. Ids and URLs never carry a
 * token, so every string is walked.
 */
export function localizeTimes<T>(value: T, opts: LocalTimeOptions = {}): T {
  return walk(value, opts) as T;
}

function walk(v: unknown, opts: LocalTimeOptions): unknown {
  if (typeof v === "string") return localTimes(v, opts);
  if (v === null || typeof v !== "object" || v instanceof Uint8Array) return v;
  if (Array.isArray(v)) {
    let changed = false;
    const out = v.map((x) => {
      const y = walk(x, opts);
      if (y !== x) changed = true;
      return y;
    });
    return changed ? out : v;
  }
  let out: Record<string, unknown> | undefined;
  const src = v as Record<string, unknown>;
  for (const k of Object.keys(src)) {
    const y = walk(src[k], opts);
    if (y !== src[k]) {
      out ??= { ...src };
      out[k] = y;
    }
  }
  return out ?? v;
}
