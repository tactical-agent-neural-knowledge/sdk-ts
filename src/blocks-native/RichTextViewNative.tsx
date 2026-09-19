import type { ReactNode } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import type { RichText, RichTextElement, Style } from "../contracts/tank/richtext/v1/richtext_pb.js";
import { DEFAULT_CODE_FONT } from "./context.js";

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

type ElementProps = Pick<
  RichTextViewNativeProps,
  "resolveUser" | "resolveChannel" | "codeFontFamily" | "openUrl"
>;

function styledSpan(node: ReactNode, s: Style | undefined, codeFont: string, panel: string): ReactNode {
  if (!s) return node;
  const style: Record<string, unknown> = {};
  if (s.bold) style.fontWeight = "700";
  if (s.italic) style.fontStyle = "italic";
  if (s.strike) style.textDecorationLine = "line-through";
  if (s.code) {
    style.fontFamily = codeFont;
    style.backgroundColor = panel;
  }
  return Object.keys(style).length ? <Text style={style}>{node}</Text> : node;
}

export function ElementViewNative({ element, ...p }: { element: RichTextElement } & ElementProps) {
  const theme = useTheme();
  const codeFont = p.codeFontFamily ?? DEFAULT_CODE_FONT;
  const open = p.openUrl ?? ((url: string) => void Linking.openURL(url));
  const k = element.kind;
  switch (k.case) {
    case "text":
      return <>{styledSpan(k.value.text, k.value.style, codeFont, theme.colors.surfaceVariant)}</>;
    case "link": {
      const url = k.value.url;
      return (
        <Text
          style={{ color: theme.colors.primary, textDecorationLine: "underline" }}
          onPress={() => open(url)}
          accessibilityRole="link"
        >
          {styledSpan(k.value.text || url, k.value.style, codeFont, theme.colors.surfaceVariant)}
        </Text>
      );
    }
    case "user":
      return (
        <Text
          style={{ color: theme.colors.primary, fontWeight: "600" }}
          testID={`mention-user-${k.value.userId}`}
        >
          @{p.resolveUser?.(k.value.userId) ?? k.value.userId}
        </Text>
      );
    case "channel":
      return (
        <Text
          style={{ color: theme.colors.primary, fontWeight: "600" }}
          testID={`mention-channel-${k.value.channelId}`}
        >
          #{p.resolveChannel?.(k.value.channelId) ?? k.value.channelId}
        </Text>
      );
    case "broadcast":
      return (
        <Text style={{ color: theme.colors.tertiary, fontWeight: "600" }}>
          @{k.value.range === 1 ? "here" : k.value.range === 2 ? "channel" : "everyone"}
        </Text>
      );
    case "emoji":
      return <Text testID={`emoji-${k.value.name}`}>{k.value.unicode || `:${k.value.name}:`}</Text>;
    default:
      return null;
  }
}

/** Renders `tank.richtext.v1.RichText` with nested Paper `Text` spans; code blocks get the mono face. */
export function RichTextViewNative({ richText, variant = "bodyMedium", ...p }: RichTextViewNativeProps) {
  const theme = useTheme();
  if (!richText) return null;
  const codeFont = p.codeFontFamily ?? DEFAULT_CODE_FONT;
  const elements = (els: RichTextElement[]) =>
    els.map((e, j) => <ElementViewNative key={j} element={e} {...p} />);
  return (
    <View style={styles.stack}>
      {richText.blocks.map((b, i) => {
        const k = b.kind;
        const key = `${k.case}-${i}`;
        switch (k.case) {
          case "section":
            return (
              <Text key={key} variant={variant}>
                {elements(k.value.elements)}
              </Text>
            );
          case "quote":
            return (
              <View key={key} style={[styles.quote, { borderLeftColor: theme.colors.secondary }]}>
                <Text variant={variant} style={{ color: theme.colors.onSurfaceVariant }}>
                  {elements(k.value.elements)}
                </Text>
              </View>
            );
          case "code":
            return (
              <View
                key={key}
                style={[styles.code, { backgroundColor: theme.colors.surfaceVariant }]}
                testID={`code-${k.value.language || "plain"}`}
              >
                <Text variant="bodySmall" style={{ fontFamily: codeFont }}>
                  {k.value.text}
                </Text>
              </View>
            );
          case "list":
            return (
              <View key={key} style={{ paddingLeft: 12 + k.value.indent * 12 }}>
                {k.value.items.map((it, j) => (
                  <Text key={j} variant={variant}>
                    {k.value.ordered ? `${j + 1}. ` : "• "}
                    {elements(it.elements)}
                  </Text>
                ))}
              </View>
            );
          default:
            return null;
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 6 },
  quote: { borderLeftWidth: 3, paddingLeft: 10 },
  code: { padding: 10, borderRadius: 6 },
});
