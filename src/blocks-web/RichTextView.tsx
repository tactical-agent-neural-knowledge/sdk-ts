import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { broadcastWord } from "../blocks/richtext.js";
import {
  type RichText,
  type RichTextElement,
  type RichTextTable,
  type Style,
  TableAlign,
} from "../contracts/tank/richtext/v1/richtext_pb.js";
import { typography } from "../design/tokens.js";

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
  renderEmoji?: (emoji: { name: string; unicode: string }) => ReactNode | undefined;
  variant?: "body1" | "body2" | "caption";
}

function styled(node: ReactNode, s: Style | undefined): ReactNode {
  if (!s) return node;
  let out = node;
  if (s.code) {
    out = (
      <Box
        component="code"
        sx={{
          fontFamily: typography.fontCode,
          fontSize: "0.875em",
          px: 0.5,
          borderRadius: 0.5,
          bgcolor: "tank.panel",
        }}
      >
        {out}
      </Box>
    );
  }
  if (s.bold) out = <strong>{out}</strong>;
  if (s.italic) out = <em>{out}</em>;
  if (s.strike) out = <s>{out}</s>;
  return out;
}

export function ElementView({
  element,
  resolveUser,
  resolveChannel,
  renderEmoji,
}: { element: RichTextElement } & Pick<RichTextViewProps, "resolveUser" | "resolveChannel" | "renderEmoji">) {
  const k = element.kind;
  switch (k.case) {
    case "text":
      return <>{styled(k.value.text, k.value.style)}</>;
    case "link":
      return (
        <Link href={k.value.url} target="_blank" rel="noopener noreferrer" color="primary">
          {styled(k.value.text || k.value.url, k.value.style)}
        </Link>
      );
    case "user":
      return (
        <Box
          component="span"
          data-mention="user"
          data-id={k.value.userId}
          sx={{ color: "primary.main", fontWeight: 600 }}
        >
          @{resolveUser?.(k.value.userId) ?? "…"}
        </Box>
      );
    case "channel":
      return (
        <Box
          component="span"
          data-mention="channel"
          data-id={k.value.channelId}
          sx={{ color: "primary.main", fontWeight: 600 }}
        >
          #{resolveChannel?.(k.value.channelId) ?? k.value.channelId}
        </Box>
      );
    case "broadcast":
      return (
        <Box component="span" sx={{ color: "tank.warningText", fontWeight: 600 }}>
          @{broadcastWord(k.value.range)}
        </Box>
      );
    case "emoji": {
      const custom = renderEmoji?.({ name: k.value.name, unicode: k.value.unicode });
      return <span data-emoji={k.value.name}>{custom ?? (k.value.unicode || `:${k.value.name}:`)}</span>;
    }
    default:
      return null;
  }
}

export function RichTextView({
  richText,
  resolveUser,
  resolveChannel,
  renderEmoji,
  variant = "body1",
}: RichTextViewProps) {
  if (!richText) return null;
  const elements = (els: RichTextElement[]) =>
    els.map((e, j) => (
      <ElementView
        key={j}
        element={e}
        resolveUser={resolveUser}
        resolveChannel={resolveChannel}
        renderEmoji={renderEmoji}
      />
    ));
  return (
    <>
      {richText.blocks.map((b, i) => {
        const k = b.kind;
        const key = `${k.case}-${i}`;
        switch (k.case) {
          case "section":
            return (
              <Typography key={key} variant={variant} component="p" sx={{ m: 0, whiteSpace: "pre-wrap" }}>
                {k.value.elements.map((e, j) => (
                  <ElementView
                    key={j}
                    element={e}
                    resolveUser={resolveUser}
                    resolveChannel={resolveChannel}
                    renderEmoji={renderEmoji}
                  />
                ))}
              </Typography>
            );
          case "quote":
            return (
              <Typography
                key={key}
                variant={variant}
                component="blockquote"
                sx={{
                  m: 0,
                  pl: 1.5,
                  borderLeft: 3,
                  borderColor: "tank.agent",
                  color: "text.secondary",
                  whiteSpace: "pre-wrap",
                }}
              >
                {k.value.elements.map((e, j) => (
                  <ElementView
                    key={j}
                    element={e}
                    resolveUser={resolveUser}
                    resolveChannel={resolveChannel}
                    renderEmoji={renderEmoji}
                  />
                ))}
              </Typography>
            );
          case "code":
            return (
              <Box
                key={key}
                component="pre"
                data-language={k.value.language}
                sx={{
                  m: 0,
                  p: 1.5,
                  overflowX: "auto",
                  borderRadius: 1,
                  bgcolor: "tank.panel",
                  fontFamily: typography.fontCode,
                  fontSize: "0.8125rem",
                  lineHeight: 1.5,
                }}
              >
                <code>{k.value.text}</code>
              </Box>
            );
          case "list":
            return (
              <Box
                key={key}
                component={k.value.ordered ? "ol" : "ul"}
                start={k.value.ordered && k.value.start > 1 ? k.value.start : undefined}
                sx={{ m: 0, pl: 3 + k.value.indent * 2 }}
              >
                {k.value.items.map((it, j) => (
                  <Typography key={j} component="li" variant={variant}>
                    {it.elements.map((e, m) => (
                      <ElementView
                        key={m}
                        element={e}
                        resolveUser={resolveUser}
                        resolveChannel={resolveChannel}
                        renderEmoji={renderEmoji}
                      />
                    ))}
                  </Typography>
                ))}
              </Box>
            );
          case "heading": {
            const level = Math.min(6, Math.max(1, k.value.level || 1));
            return (
              <Typography
                key={key}
                component={`h${level}` as "h1"}
                variant={variant}
                data-testid="rt-heading"
                sx={{
                  m: 0,
                  mt: i === 0 ? 0 : 0.5,
                  fontFamily: typography.fontDisplay,
                  fontWeight: 700,
                  fontSize: level === 1 ? "1.25em" : level === 2 ? "1.125em" : "1em",
                  lineHeight: 1.35,
                }}
              >
                {elements(k.value.elements)}
              </Typography>
            );
          }
          case "table":
            return <TableView key={key} table={k.value} variant={variant} elements={elements} />;
          case "divider":
            return (
              <Box
                key={key}
                component="hr"
                sx={{ m: 0, my: 0.5, border: 0, borderTop: 1, borderColor: "divider" }}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}

function cellAlign(a: TableAlign | undefined): "left" | "center" | "right" {
  return a === TableAlign.CENTER ? "center" : a === TableAlign.RIGHT ? "right" : "left";
}

/**
 * A table in a message. It is as wide as its cells need (a cell wraps past 22rem) and scrolls
 * sideways inside the message when that is wider than the column, so a phone-width page never
 * scrolls.
 */
function TableView({
  table,
  variant,
  elements,
}: {
  table: RichTextTable;
  variant: NonNullable<RichTextViewProps["variant"]>;
  elements: (els: RichTextElement[]) => ReactNode;
}) {
  const cols = Math.max(table.header?.cells.length ?? 0, ...table.rows.map((r) => r.cells.length));
  const span = Array.from({ length: cols }, (_, c) => c);
  const cell = {
    px: 1.25,
    py: 0.75,
    verticalAlign: "top",
    borderBottom: 1,
    borderColor: "divider",
  } as const;
  // A cell is as wide as its words up to 22rem, then wraps between words; the table never
  // squeezes a cell to fit the column (that broke words mid-way), it scrolls instead.
  const words = (els: RichTextElement[]) => (
    <Box
      component="span"
      sx={{ display: "inline-block", maxWidth: "22rem", overflowWrap: "break-word", textAlign: "inherit" }}
    >
      {elements(els)}
    </Box>
  );
  return (
    <Box
      data-testid="rt-table"
      sx={{
        maxWidth: "100%",
        overflowX: "auto",
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        width: "fit-content",
        my: 0.5,
      }}
    >
      <Box component="table" sx={{ borderCollapse: "collapse", width: "max-content", minWidth: "100%" }}>
        {table.header && (
          <Box component="thead" sx={{ bgcolor: "tank.panel" }}>
            <tr>
              {span.map((c) => (
                <Typography
                  key={c}
                  component="th"
                  variant={variant}
                  scope="col"
                  align={cellAlign(table.align[c])}
                  sx={{ ...cell, fontWeight: 700, whiteSpace: "nowrap" }}
                >
                  {words(table.header?.cells[c]?.elements ?? [])}
                </Typography>
              ))}
            </tr>
          </Box>
        )}
        <tbody>
          {table.rows.map((r, j) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: rows are positional and never reordered
            <Box component="tr" key={j} sx={{ "&:last-of-type td": { borderBottom: 0 } }}>
              {span.map((c) => (
                <Typography
                  key={c}
                  component="td"
                  variant={variant}
                  align={cellAlign(table.align[c])}
                  sx={cell}
                >
                  {words(r.cells[c]?.elements ?? [])}
                </Typography>
              ))}
            </Box>
          ))}
        </tbody>
      </Box>
    </Box>
  );
}
