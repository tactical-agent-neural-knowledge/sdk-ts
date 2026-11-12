/** Escaped characters are parked in the private-use plane while the rules run. */
const PROTECT = 0xe000;
/**
 * One line of plain words from Markdown, for a preview: a chat list row, a notification, a
 * search hit. Neural and the agents write Markdown, and a preview that shows `**Product
 * Name:**` or `[Dreamscapes](https://…)` reads as broken (Robby, 2026-11-12). Both apps call
 * this, so the rule is written once.
 *
 * It is deliberately forgiving rather than a parser: the server clips a preview to a number
 * of characters, so the input may end half way through a link or a code span, and that must
 * still come out as words. Raw HTML is left as text; nothing here renders.
 */
export function plainPreview(markdown) {
    if (!markdown)
        return "";
    const lines = [];
    let fence = false;
    for (const raw of markdown.split(/\r?\n/)) {
        // A fence line goes; the code inside it stays as words.
        if (/^\s{0,3}(```|~~~)/.test(raw)) {
            fence = !fence;
            continue;
        }
        if (fence) {
            lines.push(raw);
            continue;
        }
        // A table's divider row (|---|:--:|) and a horizontal rule say nothing.
        if (/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(raw))
            continue;
        if (/^\s{0,3}([-*_])(\s*\1){2,}\s*$/.test(raw))
            continue;
        let line = raw
            .replace(/^\s{0,3}#{1,6}\s+/, "") // heading
            .replace(/^(\s*>\s?)+/, "") // quote
            .replace(/^\s*(?:[-*+]|\d{1,9}[.)])\s+(\[[ xX]\]\s+)?/, ""); // list item, task box
        // A table row: its cells, separated by a space.
        if (/^\s*\|.*\|\s*$/.test(line)) {
            line = line
                .trim()
                .replace(/^\||\|$/g, "")
                .split(/(?<!\\)\|/)
                .map((c) => c.trim())
                .filter(Boolean)
                .join(" · ");
        }
        lines.push(line);
    }
    return (lines
        .join(" ")
        // Backslash escapes are the character itself, kept out of the rules below meanwhile.
        .replace(/\\([\\`*_{}[\]()#+\-.!|~>])/g, (_, c) => String.fromCharCode(PROTECT + c.charCodeAt(0)))
        // ![alt](url) and [text](url) are their words; a link clipped before its ")" too.
        .replace(/!?\[([^\]]*)\]\([^)\s]*(?:\s+"[^"]*")?\)?/g, "$1")
        // <https://…> autolinks are their address.
        .replace(/<((?:https?|mailto):[^>\s]+)>/g, "$1")
        // Bold, strike, and backticks (code keeps its words).
        .replace(/(\*\*|__|~~)(?=\S)([\s\S]*?\S)\1/g, "$2")
        .replace(/`+/g, "")
        // Single * or _ around words, never inside one (snake_case stays).
        .replace(/(^|[^\w*])[*_](?=\S)([^*_]*?\S)[*_](?![\w*])/g, "$1$2")
        // What is left of a clipped emphasis: a stray ** or __ opener.
        .replace(/(\*\*|__)(?=\S)/g, "")
        .replace(/[\uE000-\uE07F]/g, (c) => String.fromCharCode(c.charCodeAt(0) - PROTECT))
        .replace(/\s+/g, " ")
        .trim());
}
