import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { broadcastWord } from "../blocks/richtext.js";
import { TableAlign, } from "../contracts/tank/richtext/v1/richtext_pb.js";
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
export function ElementView({ element, resolveUser, resolveChannel, renderEmoji, }) {
    const k = element.kind;
    switch (k.case) {
        case "text":
            return _jsx(_Fragment, { children: styled(k.value.text, k.value.style) });
        case "link":
            return (_jsx(Link, { href: k.value.url, target: "_blank", rel: "noopener noreferrer", color: "primary", children: styled(k.value.text || k.value.url, k.value.style) }));
        case "user":
            return (_jsxs(Box, { component: "span", "data-mention": "user", "data-id": k.value.userId, sx: { color: "primary.main", fontWeight: 600 }, children: ["@", resolveUser?.(k.value.userId) ?? "…"] }));
        case "channel":
            return (_jsxs(Box, { component: "span", "data-mention": "channel", "data-id": k.value.channelId, sx: { color: "primary.main", fontWeight: 600 }, children: ["#", resolveChannel?.(k.value.channelId) ?? k.value.channelId] }));
        case "broadcast":
            return (_jsxs(Box, { component: "span", sx: { color: "tank.warningText", fontWeight: 600 }, children: ["@", broadcastWord(k.value.range)] }));
        case "emoji": {
            const custom = renderEmoji?.({ name: k.value.name, unicode: k.value.unicode });
            return _jsx("span", { "data-emoji": k.value.name, children: custom ?? (k.value.unicode || `:${k.value.name}:`) });
        }
        default:
            return null;
    }
}
export function RichTextView({ richText, resolveUser, resolveChannel, renderEmoji, variant = "body1", }) {
    if (!richText)
        return null;
    const elements = (els) => els.map((e, j) => (_jsx(ElementView, { element: e, resolveUser: resolveUser, resolveChannel: resolveChannel, renderEmoji: renderEmoji }, j)));
    return (_jsx(_Fragment, { children: richText.blocks.map((b, i) => {
            const k = b.kind;
            const key = `${k.case}-${i}`;
            switch (k.case) {
                case "section":
                    return (_jsx(Typography, { variant: variant, component: "p", sx: { m: 0, whiteSpace: "pre-wrap" }, children: k.value.elements.map((e, j) => (_jsx(ElementView, { element: e, resolveUser: resolveUser, resolveChannel: resolveChannel, renderEmoji: renderEmoji }, j))) }, key));
                case "quote":
                    return (_jsx(Typography, { variant: variant, component: "blockquote", sx: {
                            m: 0,
                            pl: 1.5,
                            borderLeft: 3,
                            borderColor: "tank.agent",
                            color: "text.secondary",
                            whiteSpace: "pre-wrap",
                        }, children: k.value.elements.map((e, j) => (_jsx(ElementView, { element: e, resolveUser: resolveUser, resolveChannel: resolveChannel, renderEmoji: renderEmoji }, j))) }, key));
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
                    return (_jsx(Box, { component: k.value.ordered ? "ol" : "ul", start: k.value.ordered && k.value.start > 1 ? k.value.start : undefined, sx: { m: 0, pl: 3 + k.value.indent * 2 }, children: k.value.items.map((it, j) => (_jsx(Typography, { component: "li", variant: variant, children: it.elements.map((e, m) => (_jsx(ElementView, { element: e, resolveUser: resolveUser, resolveChannel: resolveChannel, renderEmoji: renderEmoji }, m))) }, j))) }, key));
                case "heading": {
                    const level = Math.min(6, Math.max(1, k.value.level || 1));
                    return (_jsx(Typography, { component: `h${level}`, variant: variant, "data-testid": "rt-heading", sx: {
                            m: 0,
                            mt: i === 0 ? 0 : 0.5,
                            fontFamily: typography.fontDisplay,
                            fontWeight: 700,
                            fontSize: level === 1 ? "1.25em" : level === 2 ? "1.125em" : "1em",
                            lineHeight: 1.35,
                        }, children: elements(k.value.elements) }, key));
                }
                case "table":
                    return _jsx(TableView, { table: k.value, variant: variant, elements: elements }, key);
                case "divider":
                    return (_jsx(Box, { component: "hr", sx: { m: 0, my: 0.5, border: 0, borderTop: 1, borderColor: "divider" } }, key));
                default:
                    return null;
            }
        }) }));
}
function cellAlign(a) {
    return a === TableAlign.CENTER ? "center" : a === TableAlign.RIGHT ? "right" : "left";
}
/**
 * A table in a message. It is as wide as its cells need (a cell wraps past 22rem) and scrolls
 * sideways inside the message when that is wider than the column, so a phone-width page never
 * scrolls.
 */
function TableView({ table, variant, elements, }) {
    const cols = Math.max(table.header?.cells.length ?? 0, ...table.rows.map((r) => r.cells.length));
    const span = Array.from({ length: cols }, (_, c) => c);
    const cell = {
        px: 1.25,
        py: 0.75,
        maxWidth: "22rem",
        verticalAlign: "top",
        borderBottom: 1,
        borderColor: "divider",
        overflowWrap: "anywhere",
    };
    return (_jsx(Box, { "data-testid": "rt-table", sx: {
            maxWidth: "100%",
            overflowX: "auto",
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            width: "fit-content",
            my: 0.5,
        }, children: _jsxs(Box, { component: "table", sx: { borderCollapse: "collapse", minWidth: "100%" }, children: [table.header && (_jsx(Box, { component: "thead", sx: { bgcolor: "tank.panel" }, children: _jsx("tr", { children: span.map((c) => (_jsx(Typography, { component: "th", variant: variant, scope: "col", align: cellAlign(table.align[c]), sx: { ...cell, fontWeight: 700, whiteSpace: "nowrap" }, children: elements(table.header?.cells[c]?.elements ?? []) }, c))) }) })), _jsx("tbody", { children: table.rows.map((r, j) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: rows are positional and never reordered
                    _jsx(Box, { component: "tr", sx: { "&:last-of-type td": { borderBottom: 0 } }, children: span.map((c) => (_jsx(Typography, { component: "td", variant: variant, align: cellAlign(table.align[c]), sx: cell, children: elements(r.cells[c]?.elements ?? []) }, c))) }, j))) })] }) }));
}
