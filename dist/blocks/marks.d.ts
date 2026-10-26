import { StepStatus } from "../contracts/tank/blocks/v1/blocks_pb.js";
/**
 * TANK's own status marks, in place of emoji (Robby, 2026-10-26: "Custom emojis for tank and
 * custom colors with tank branding"). Each is the logo's hexagonal shield in a brand colour
 * with one glyph inside; the agent's chevron means work under way. One geometry, drawn as
 * SVG on the web (`blocks-web` Mark) and with react-native-svg on the phone (`blocks-native`
 * Mark), on a 24-unit square.
 */
export type MarkKind = "done" | "doing" | "todo" | "needs" | "failed" | "skipped";
/** The shield: a hexagon standing on a point, like the logo's. */
export declare const MARK_HEX = "M12 2.2 L20.5 7.1 V16.9 L12 21.8 L3.5 16.9 V7.1 Z";
export interface MarkSpec {
    label: string;
    fill: string;
    stroke: string;
    opacity?: number;
    /** A stroked line inside the shield. */
    glyph?: {
        d: string;
        color: string;
    };
    /** A filled dot inside the shield (the point of "!"). */
    dot?: {
        cx: number;
        cy: number;
        r: number;
        color: string;
    };
}
export declare const MARKS: Record<MarkKind, MarkSpec>;
/** A plan card step's mark. */
export declare function stepMark(status: StepStatus): MarkKind;
/** A Tread plan ledger item's mark (tank.agent.v1.PlanItemStatus). */
export declare function planItemMark(status: number): MarkKind;
/** The whole plan's mark: done when every step is, failed when one did, under way once one has moved. */
export declare function planMark(steps: readonly {
    status: StepStatus;
}[]): MarkKind;
/** A ledger's mark from its progress. */
export declare function progressMark(p: {
    done: number;
    doing: number;
    total: number;
    needsPerson: number;
}): MarkKind;
