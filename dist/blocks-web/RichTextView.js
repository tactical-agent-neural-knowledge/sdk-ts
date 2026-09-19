import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { typography } from "../design/tokens.js";
function styled(node, s) {
    if (!s)
        return node;
    let out = node;
    if (s.code) {
        out = (_jsx(Box, { component: "code", sx: {
                fontFamily: typography.fontCode,
                fontSize: "0.875em",
                px: 0.5,
                borderRadius: 0.5,
                bgcolor: "tank.panel",
            }, children: out }));
    }
    if (s.bold)
        out = _jsx("strong", { children: out });
    if (s.italic)
        out = _jsx("em", { children: out });
    if (s.strike)
        out = _jsx("s", { children: out });
    return out;
}
export function ElementView({ element, resolveUser, resolveChannel, }) {
    const k = element.kind;
    switch (k.case) {
        case "text":
            return _jsx(_Fragment, { children: styled(k.value.text, k.value.style) });
        case "link":
            return (_jsx(Link, { href: k.value.url, target: "_blank", rel: "noopener noreferrer", color: "primary", children: styled(k.value.text || k.value.url, k.value.style) }));
        case "user":
            return (_jsxs(Box, { component: "span", "data-mention": "user", "data-id": k.value.userId, sx: { color: "primary.main", fontWeight: 600 }, children: ["@", resolveUser?.(k.value.userId) ?? k.value.userId] }));
        case "channel":
            return (_jsxs(Box, { component: "span", "data-mention": "channel", "data-id": k.value.channelId, sx: { color: "primary.main", fontWeight: 600 }, children: ["#", resolveChannel?.(k.value.channelId) ?? k.value.channelId] }));
        case "broadcast":
            return (_jsxs(Box, { component: "span", sx: { color: "tank.warningText", fontWeight: 600 }, children: ["@", k.value.range === 1 ? "here" : k.value.range === 2 ? "channel" : "everyone"] }));
        case "emoji":
            return _jsx("span", { "data-emoji": k.value.name, children: k.value.unicode || `:${k.value.name}:` });
        default:
            return null;
    }
}
export function RichTextView({ richText, resolveUser, resolveChannel, variant = "body1", }) {
    if (!richText)
        return null;
    return (_jsx(_Fragment, { children: richText.blocks.map((b, i) => {
            const k = b.kind;
            const key = `${k.case}-${i}`;
            switch (k.case) {
                case "section":
                    return (_jsx(Typography, { variant: variant, component: "p", sx: { m: 0, whiteSpace: "pre-wrap" }, children: k.value.elements.map((e, j) => (_jsx(ElementView, { element: e, resolveUser: resolveUser, resolveChannel: resolveChannel }, j))) }, key));
                case "quote":
                    return (_jsx(Typography, { variant: variant, component: "blockquote", sx: {
                            m: 0,
                            pl: 1.5,
                            borderLeft: 3,
                            borderColor: "tank.agent",
                            color: "text.secondary",
                            whiteSpace: "pre-wrap",
                        }, children: k.value.elements.map((e, j) => (_jsx(ElementView, { element: e, resolveUser: resolveUser, resolveChannel: resolveChannel }, j))) }, key));
                case "code":
                    return (_jsx(Box, { component: "pre", "data-language": k.value.language, sx: {
                            m: 0,
                            p: 1.5,
                            overflowX: "auto",
                            borderRadius: 1,
                            bgcolor: "tank.panel",
                            fontFamily: typography.fontCode,
                            fontSize: "0.8125rem",
                            lineHeight: 1.5,
                        }, children: _jsx("code", { children: k.value.text }) }, key));
                case "list":
                    return (_jsx(Box, { component: k.value.ordered ? "ol" : "ul", sx: { m: 0, pl: 3 + k.value.indent * 2 }, children: k.value.items.map((it, j) => (_jsx(Typography, { component: "li", variant: variant, children: it.elements.map((e, m) => (_jsx(ElementView, { element: e, resolveUser: resolveUser, resolveChannel: resolveChannel }, m))) }, j))) }, key));
                default:
                    return null;
            }
        }) }));
}
