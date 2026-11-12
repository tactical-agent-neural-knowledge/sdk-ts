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
export declare function plainPreview(markdown: string): string;
