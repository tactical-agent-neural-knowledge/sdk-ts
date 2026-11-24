import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FRESH_FADE_MS } from "../client/fresh.js";
import { Mark } from "./Mark.js";
const STYLE_ID = "tank-status-line";
const CSS = `
@keyframes tank-status-mark { 0%, 100% { opacity: .55; transform: scale(.92) } 50% { opacity: 1; transform: scale(1) } }
@keyframes tank-status-word { from { opacity: 0 } to { opacity: 1 } }
.tank-status-line { display: inline-flex; align-items: center; gap: 6px; min-width: 0; font-size: 12px; line-height: 18px; opacity: .8 }
.tank-status-line > .tank-status-mark { display: inline-flex; animation: tank-status-mark 1.2s ease-in-out infinite; transform-origin: center }
.tank-status-line > .tank-status-word { animation: tank-status-word ${FRESH_FADE_MS}ms ease-in-out; white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
@media (prefers-reduced-motion: reduce) {
  .tank-status-line > .tank-status-mark, .tank-status-line > .tank-status-word { animation: none }
}`;
/** Adds the status line's few rules to the page once. */
function ensureStyle() {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID))
        return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
}
/**
 * Neural's one-word status line: TANK's own working mark (the shield with the chevron), gently
 * breathing, beside one word from `STATUS_WORDS`. A new word fades in softly (the same fade
 * arriving text uses). With reduced motion asked for, the mark is still and the word simply
 * changes. Renders nothing for an empty word. The text takes the color of where it is put.
 */
export function StatusLine({ word, testId = "status-line" }) {
    if (!word)
        return null;
    ensureStyle();
    return (_jsxs("span", { className: "tank-status-line", role: "status", "aria-live": "polite", "data-testid": testId, children: [_jsx("span", { className: "tank-status-mark", "aria-hidden": true, children: _jsx(Mark, { kind: "doing", size: 16 }) }), _jsx("span", { className: "tank-status-word", children: word }, word)] }));
}
