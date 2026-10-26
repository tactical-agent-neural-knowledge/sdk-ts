import { StepStatus } from "../contracts/tank/blocks/v1/blocks_pb.js";
import { shades } from "../design/tokens.js";
/** The shield: a hexagon standing on a point, like the logo's. */
export const MARK_HEX = "M12 2.2 L20.5 7.1 V16.9 L12 21.8 L3.5 16.9 V7.1 Z";
/** A quiet edge for what has not started: readable on the dark and the light ground. */
const QUIET = "#5C6B73";
export const MARKS = {
    done: {
        label: "Done",
        fill: shades.cyan.main,
        stroke: shades.cyan.main,
        glyph: { d: "M7.6 12.3 L10.6 15.2 L16.4 9.2", color: shades.abyss.main },
    },
    doing: {
        label: "Working on it",
        fill: shades.purple.main,
        stroke: shades.purple.main,
        glyph: { d: "M8.2 14.2 L12 10.4 L15.8 14.2", color: shades.cyan.main },
    },
    todo: { label: "To do", fill: "none", stroke: QUIET },
    needs: {
        label: "Needs a person",
        fill: shades.amber.main,
        stroke: shades.amber.main,
        glyph: { d: "M12 7.6 V12.9", color: shades.abyss.main },
        dot: { cx: 12, cy: 16.1, r: 1.35, color: shades.abyss.main },
    },
    failed: {
        label: "Failed",
        fill: "none",
        stroke: shades.amber.main,
        glyph: { d: "M9.3 9.3 L14.7 14.7 M14.7 9.3 L9.3 14.7", color: shades.amber.main },
    },
    skipped: {
        label: "Skipped",
        fill: "none",
        stroke: QUIET,
        opacity: 0.6,
        glyph: { d: "M8.6 12 H15.4", color: QUIET },
    },
};
/** A plan card step's mark. */
export function stepMark(status) {
    switch (status) {
        case StepStatus.RUNNING:
            return "doing";
        case StepStatus.DONE:
            return "done";
        case StepStatus.FAILED:
            return "failed";
        case StepStatus.SKIPPED:
            return "skipped";
        default:
            return "todo";
    }
}
/** A Tread plan ledger item's mark (tank.agent.v1.PlanItemStatus). */
export function planItemMark(status) {
    switch (status) {
        case 2:
            return "doing";
        case 3:
            return "done";
        case 4:
            return "needs";
        case 5:
            return "skipped";
        default:
            return "todo";
    }
}
/** The whole plan's mark: done when every step is, failed when one did, under way once one has moved. */
export function planMark(steps) {
    const done = steps.filter((s) => s.status === StepStatus.DONE || s.status === StepStatus.SKIPPED).length;
    if (steps.length > 0 && done === steps.length)
        return "done";
    if (steps.some((s) => s.status === StepStatus.FAILED))
        return "failed";
    if (steps.some((s) => s.status === StepStatus.RUNNING || s.status === StepStatus.DONE))
        return "doing";
    return "todo";
}
/** A ledger's mark from its progress. */
export function progressMark(p) {
    if (p.total > 0 && p.done === p.total)
        return "done";
    if (p.doing > 0 || p.done > 0)
        return "doing";
    if (p.needsPerson > 0)
        return "needs";
    return "todo";
}
