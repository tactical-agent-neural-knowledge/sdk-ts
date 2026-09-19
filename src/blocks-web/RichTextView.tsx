import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import type { RichText, RichTextElement, Style } from "../contracts/tank/richtext/v1/richtext_pb.js";
import { typography } from "../design/tokens.js";

export interface RichTextViewProps {
  richText: RichText | undefined;
  /** Resolve a user id to a display name for @mentions. */
  resolveUser?: (userId: string) => string | undefined;
  /** Resolve a channel id to a Tread name for #mentions. */
  resolveChannel?: (channelId: string) => string | undefined;
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
}: { element: RichTextElement } & Pick<RichTextViewProps, "resolveUser" | "resolveChannel">) {
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
          @{resolveUser?.(k.value.userId) ?? k.value.userId}
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
          @{k.value.range === 1 ? "here" : k.value.range === 2 ? "channel" : "everyone"}
        </Box>
      );
    case "emoji":
      return <span data-emoji={k.value.name}>{k.value.unicode || `:${k.value.name}:`}</span>;
    default:
      return null;
  }
}

export function RichTextView({
  richText,
  resolveUser,
  resolveChannel,
  variant = "body1",
}: RichTextViewProps) {
  if (!richText) return null;
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
                      />
                    ))}
                  </Typography>
                ))}
              </Box>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
