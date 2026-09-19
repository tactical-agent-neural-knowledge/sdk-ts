import type { ReactNode } from "react";
import { type MD3Theme } from "react-native-paper";
import type { Actions, ApprovalPrompt, Button as ButtonMsg, CiStatus, Context, DiffPreview, FilePreview, Header, PlanCard, Section, StatusCard, ToolLog } from "../contracts/tank/blocks/v1/blocks_pb.js";
import { type BlockContext } from "./context.js";
export type Accent = "agent" | "ai" | "alert" | "none";
/** Accent colours from the Paper theme: purple (secondary) = agent execution, cyan (primary) = AI/context, amber (tertiary) = needs a human. */
export declare function accentColor(theme: MD3Theme, accent: Accent): string;
/** Semantic colours Paper's palette has no slot for. */
export declare function semanticColors(theme: MD3Theme): {
    success: string;
    error: string;
    muted: string;
};
export type ChipTone = "agent" | "ai" | "alert" | "success" | "error" | "muted";
/** Flat chip colours per tone (tinted background, readable foreground); `muted` renders outlined. */
export declare function chipColors(theme: MD3Theme, tone: ChipTone): {
    bg: string;
    fg: string;
    outlined: boolean;
};
export declare function ToneChip({ tone, label, testID }: {
    tone: ChipTone;
    label: string;
    testID?: string;
}): import("react").JSX.Element;
/** Accent stripe card: purple = agent execution, cyan = AI/context, amber = needs a human. */
export declare function Card({ accent, children, label }: {
    accent: Accent;
    label?: string;
    children: ReactNode;
}): import("react").JSX.Element;
export declare function HeaderBlock({ value }: {
    value: Header;
}): import("react").JSX.Element;
export declare function SectionBlock({ value, ctx }: {
    value: Section;
    ctx: BlockContext;
}): import("react").JSX.Element;
export declare function ContextBlock({ value, ctx }: {
    value: Context;
    ctx: BlockContext;
}): import("react").JSX.Element;
export declare function DividerBlock(): import("react").JSX.Element;
export declare function ActionButton({ button, ctx }: {
    button: ButtonMsg;
    ctx: BlockContext;
}): import("react").JSX.Element;
export declare function ActionsBlock({ value, ctx }: {
    value: Actions;
    ctx: BlockContext;
}): import("react").JSX.Element;
export declare function PlanCardBlock({ value, ctx }: {
    value: PlanCard;
    ctx: BlockContext;
}): import("react").JSX.Element;
export declare function DiffPreviewBlock({ value, ctx }: {
    value: DiffPreview;
    ctx: BlockContext;
}): import("react").JSX.Element;
export declare function CiStatusBlock({ value, ctx }: {
    value: CiStatus;
    ctx: BlockContext;
}): import("react").JSX.Element;
export declare function ApprovalPromptBlock({ value, ctx }: {
    value: ApprovalPrompt;
    ctx: BlockContext;
}): import("react").JSX.Element;
export declare function ToolLogBlock({ value, ctx }: {
    value: ToolLog;
    ctx: BlockContext;
}): import("react").JSX.Element;
export declare function StatusCardBlock({ value, ctx }: {
    value: StatusCard;
    ctx: BlockContext;
}): import("react").JSX.Element;
export declare function FilePreviewBlock({ value, ctx }: {
    value: FilePreview;
    ctx: BlockContext;
}): import("react").JSX.Element;
