import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Linking, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { DEFAULT_CODE_FONT } from "./context.js";
function styledSpan(node, s, codeFont, panel) {
    if (!s)
        return node;
    const style = {};
    if (s.bold)
        style.fontWeight = "700";
    if (s.italic)
        style.fontStyle = "italic";
    if (s.strike)
        style.textDecorationLine = "line-through";
    if (s.code) {
        style.fontFamily = codeFont;
        style.backgroundColor = panel;
    }
    return Object.keys(style).length ? _jsx(Text, { style: style, children: node }) : node;
}
export function ElementViewNative({ element, ...p }) {
    const theme = useTheme();
    const codeFont = p.codeFontFamily ?? DEFAULT_CODE_FONT;
    const open = p.openUrl ?? ((url) => void Linking.openURL(url));
    const k = element.kind;
    switch (k.case) {
        case "text":
            return _jsx(_Fragment, { children: styledSpan(k.value.text, k.value.style, codeFont, theme.colors.surfaceVariant) });
        case "link": {
            const url = k.value.url;
            return (_jsx(Text, { style: { color: theme.colors.primary, textDecorationLine: "underline" }, onPress: () => open(url), accessibilityRole: "link", children: styledSpan(k.value.text || url, k.value.style, codeFont, theme.colors.surfaceVariant) }));
        }
        case "user":
            return (_jsxs(Text, { style: { color: theme.colors.primary, fontWeight: "600" }, testID: `mention-user-${k.value.userId}`, children: ["@", p.resolveUser?.(k.value.userId) ?? k.value.userId] }));
        case "channel":
            return (_jsxs(Text, { style: { color: theme.colors.primary, fontWeight: "600" }, testID: `mention-channel-${k.value.channelId}`, children: ["#", p.resolveChannel?.(k.value.channelId) ?? k.value.channelId] }));
        case "broadcast":
            return (_jsxs(Text, { style: { color: theme.colors.tertiary, fontWeight: "600" }, children: ["@", k.value.range === 1 ? "here" : k.value.range === 2 ? "channel" : "everyone"] }));
        case "emoji":
            return _jsx(Text, { testID: `emoji-${k.value.name}`, children: k.value.unicode || `:${k.value.name}:` });
        default:
            return null;
    }
}
/** Renders `tank.richtext.v1.RichText` with nested Paper `Text` spans; code blocks get the mono face. */
export function RichTextViewNative({ richText, variant = "bodyMedium", ...p }) {
    const theme = useTheme();
    if (!richText)
        return null;
    const codeFont = p.codeFontFamily ?? DEFAULT_CODE_FONT;
    const elements = (els) => els.map((e, j) => _jsx(ElementViewNative, { element: e, ...p }, j));
    return (_jsx(View, { style: styles.stack, children: richText.blocks.map((b, i) => {
            const k = b.kind;
            const key = `${k.case}-${i}`;
            switch (k.case) {
                case "section":
                    return (_jsx(Text, { variant: variant, children: elements(k.value.elements) }, key));
                case "quote":
                    return (_jsx(View, { style: [styles.quote, { borderLeftColor: theme.colors.secondary }], children: _jsx(Text, { variant: variant, style: { color: theme.colors.onSurfaceVariant }, children: elements(k.value.elements) }) }, key));
                case "code":
                    return (_jsx(View, { style: [styles.code, { backgroundColor: theme.colors.surfaceVariant }], testID: `code-${k.value.language || "plain"}`, children: _jsx(Text, { variant: "bodySmall", style: { fontFamily: codeFont }, children: k.value.text }) }, key));
                case "list":
                    return (_jsx(View, { style: { paddingLeft: 12 + k.value.indent * 12 }, children: k.value.items.map((it, j) => (_jsxs(Text, { variant: variant, children: [k.value.ordered ? `${j + 1}. ` : "• ", elements(it.elements)] }, j))) }, key));
                default:
                    return null;
            }
        }) }));
}
const styles = StyleSheet.create({
    stack: { gap: 6 },
    quote: { borderLeftWidth: 3, paddingLeft: 10 },
    code: { padding: 10, borderRadius: 6 },
});
