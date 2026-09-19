import type { RichText, RichTextElement } from "../contracts/tank/richtext/v1/richtext_pb.js";
export interface RichTextViewProps {
    richText: RichText | undefined;
    /** Resolve a user id to a display name for @mentions. */
    resolveUser?: (userId: string) => string | undefined;
    /** Resolve a channel id to a Tread name for #mentions. */
    resolveChannel?: (channelId: string) => string | undefined;
    variant?: "body1" | "body2" | "caption";
}
export declare function ElementView({ element, resolveUser, resolveChannel, }: {
    element: RichTextElement;
} & Pick<RichTextViewProps, "resolveUser" | "resolveChannel">): import("react").JSX.Element | null;
export declare function RichTextView({ richText, resolveUser, resolveChannel, variant, }: RichTextViewProps): import("react").JSX.Element | null;
