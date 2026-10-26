import { type MarkKind } from "../blocks/marks.js";
/** One of TANK's status marks (see `blocks/marks.ts`), drawn with react-native-svg. */
export declare function Mark({ kind, size, title }: {
    kind: MarkKind;
    size?: number;
    title?: string;
}): import("react").JSX.Element;
