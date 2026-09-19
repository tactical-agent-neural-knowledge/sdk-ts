import { type ReactNode } from "react";
import type { Actions, ApprovalPrompt, Button as ButtonMsg, CiStatus, Context, DiffPreview, FilePreview, Header, PlanCard, Section, StatusCard, ToolLog } from "../contracts/tank/blocks/v1/blocks_pb.js";
import { type RichTextViewProps } from "./RichTextView.js";
/** Posted when a user interacts with a block; pair with `TankClient.postBlockAction`. */
export interface BlockActionEvent {
    blockId: string;
    actionId: string;
    value: string;
}
export interface BlockContext extends Pick<RichTextViewProps, "resolveUser" | "resolveChannel"> {
    blockId: string;
    onAction?: (action: BlockActionEvent) => void;
    /** Format a timestamp (ms) for display. Default: locale time. */
    formatTime?: (ms: number) => string;
}
/** Accent stripe for agent cards: purple = agent execution, cyan = AI/context, amber = needs a human. */
export declare function Card({ accent, children, label, }: {
    accent: "agent" | "ai" | "alert" | "none";
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
export declare function ActionButton({ button, ctx, size, }: {
    button: ButtonMsg;
    ctx: BlockContext;
    size?: "small" | "medium";
}): import("react").JSX.Element;
export declare function ActionsBlock({ value, ctx }: {
    value: Actions;
    ctx: BlockContext;
}): import("react").JSX.Element;
export declare function PlanCardBlock({ value }: {
    value: PlanCard;
}): import("react").JSX.Element;
export declare function DiffPreviewBlock({ value }: {
    value: DiffPreview;
}): import("react").JSX.Element;
export declare function CiStatusBlock({ value }: {
    value: CiStatus;
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
export declare function FilePreviewBlock({ value }: {
    value: FilePreview;
}): import("react").JSX.Element;
