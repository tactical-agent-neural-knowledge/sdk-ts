/** TS types over tank.blocks.v1, re-exported so consumers never import generated paths. */
export type {
  Actions,
  ApprovalPrompt,
  Block,
  BlockAction,
  Blocks,
  Button,
  Check,
  CiStatus,
  Confirm,
  Context,
  DiffFile,
  DiffPreview,
  Divider,
  Field,
  FilePreview,
  Header,
  PlanCard,
  PlanStep,
  Section,
  StatusCard,
  ToolLog,
  ToolLogEntry,
} from "../contracts/tank/blocks/v1/blocks_pb.js";
export {
  BlockActionSchema,
  BlockSchema,
  BlocksSchema,
  ButtonStyle,
  CheckState,
  GateKind,
  StepStatus,
} from "../contracts/tank/blocks/v1/blocks_pb.js";
export type {
  RichText,
  RichTextBlock,
  RichTextElement,
  RichTextSection,
  Style,
} from "../contracts/tank/richtext/v1/richtext_pb.js";
export { RichTextSchema } from "../contracts/tank/richtext/v1/richtext_pb.js";

/** Every block kind name, as the oneof case string. */
export type BlockKind = NonNullable<import("../contracts/tank/blocks/v1/blocks_pb.js").Block["kind"]["case"]>;

export const BLOCK_KINDS = [
  "header",
  "section",
  "context",
  "divider",
  "actions",
  "planCard",
  "diffPreview",
  "ciStatus",
  "approvalPrompt",
  "toolLog",
  "filePreview",
  "statusCard",
] as const satisfies readonly BlockKind[];
