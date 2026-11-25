const TOKEN = /<t:(-?\d{1,12})(?::([tfd]))?>/g;
/** The token for a moment, as a server or a client writes it into text. */
export function timeToken(ms, style = "t") {
    const s = Math.floor(ms / 1000);
    return style === "t" ? `<t:${s}>` : `<t:${s}:${style}>`;
}
/** Whether text carries a time token. */
export function hasTimeTokens(text) {
    return text.includes("<t:") && new RegExp(TOKEN.source).test(text);
}
const SHAPES = {
    t: { hour: "numeric", minute: "2-digit" },
    f: { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" },
    d: { month: "long", day: "numeric" },
};
const cache = new Map();
function formatter(style, opts) {
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
export function formatLocalTime(ms, style = "t", opts = {}) {
    return formatter(style, opts).format(new Date(ms));
}
/** Text with every time token replaced by the moment in the viewer's own time. */
export function localTimes(text, opts = {}) {
    if (!text || !text.includes("<t:"))
        return text;
    return text.replace(TOKEN, (_, secs, style) => formatLocalTime(Number(secs) * 1000, style ?? "t", opts));
}
/**
 * A copy of a message's blocks (or any protobuf message) with the time tokens in every
 * string replaced; the same object back when there are none. Ids and URLs never carry a
 * token, so every string is walked.
 */
export function localizeTimes(value, opts = {}) {
    return walk(value, opts);
}
function walk(v, opts) {
    if (typeof v === "string")
        return localTimes(v, opts);
    if (v === null || typeof v !== "object" || v instanceof Uint8Array)
        return v;
    if (Array.isArray(v)) {
        let changed = false;
        const out = v.map((x) => {
            const y = walk(x, opts);
            if (y !== x)
                changed = true;
            return y;
        });
        return changed ? out : v;
    }
    let out;
    const src = v;
    for (const k of Object.keys(src)) {
        const y = walk(src[k], opts);
        if (y !== src[k]) {
            out ??= { ...src };
            out[k] = y;
        }
    }
    return out ?? v;
}
