import type { RichText } from "../contracts/tank/richtext/v1/richtext_pb.js";
/**
 * Turns `:name:` shortcodes that name a workspace custom emoji into emoji elements, so a
 * renderer can draw the image. Text typed on any client and messages from before the
 * client learned to emit emoji elements both come through here. Unknown shortcodes, code
 * spans and code blocks are left alone. Returns the same object when nothing changed.
 */
export declare function expandShortcodes(rt: RichText, isKnown: (name: string) => boolean): RichText;
