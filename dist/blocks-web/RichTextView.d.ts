import type { ReactNode } from "react";
import type { RichText, RichTextElement } from "../contracts/tank/richtext/v1/richtext_pb.js";
export interface RichTextViewProps {
    richText: RichText | undefined;
    /** Resolve a user id to a display name for @mentions. */
    resolveUser?: (userId: string) => string | undefined;
    /** Resolve a channel id to a Tread name for #mentions. */
    resolveChannel?: (channelId: string) => string | undefined;
    /**
     * Draw an emoji element. Custom emoji carry a `name` and no `unicode`; the app supplies
     * the image. Return `undefined` to fall back to the unicode or `:name:` text.
     */
    renderEmoji?: (emoji: {
        name: string;
        unicode: string;
    }) => ReactNode | undefined;
    variant?: "body1" | "body2" | "caption";
}
export declare function ElementView({ element, resolveUser, resolveChannel, renderEmoji, }: {
    element: RichTextElement;
} & Pick<RichTextViewProps, "resolveUser" | "resolveChannel" | "renderEmoji">): import("react").JSX.Element | null;
export declare function RichTextView({ richText, resolveUser, resolveChannel, renderEmoji, variant, }: RichTextViewProps): import("react").JSX.Element | null;
