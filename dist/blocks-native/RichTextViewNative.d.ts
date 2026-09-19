import type { RichText, RichTextElement } from "../contracts/tank/richtext/v1/richtext_pb.js";
export interface RichTextViewNativeProps {
    richText: RichText | undefined;
    /** Resolve a user id to a display name for @mentions. */
    resolveUser?: ((userId: string) => string | undefined) | undefined;
    /** Resolve a channel id to a Tread name for #mentions. */
    resolveChannel?: ((channelId: string) => string | undefined) | undefined;
    variant?: "bodyLarge" | "bodyMedium" | "bodySmall";
    codeFontFamily?: string | undefined;
    openUrl?: ((url: string) => void) | undefined;
}
type ElementProps = Pick<RichTextViewNativeProps, "resolveUser" | "resolveChannel" | "codeFontFamily" | "openUrl">;
export declare function ElementViewNative({ element, ...p }: {
    element: RichTextElement;
} & ElementProps): import("react").JSX.Element | null;
/** Renders `tank.richtext.v1.RichText` with nested Paper `Text` spans; code blocks get the mono face. */
export declare function RichTextViewNative({ richText, variant, ...p }: RichTextViewNativeProps): import("react").JSX.Element | null;
export {};
