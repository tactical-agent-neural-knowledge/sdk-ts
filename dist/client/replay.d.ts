import type { BoardObject, ReplayFrame } from "../contracts/tank/board/v1/board_pb.js";
/** The bench as it stood after frame `upTo` (inclusive), in paint order. */
export declare function benchAt(frames: readonly ReplayFrame[], upTo: number): BoardObject[];
/** The live line people read at frame `upTo`: the last one said by then, or "". */
export declare function liveAt(frames: readonly ReplayFrame[], upTo: number): string;
/** The frame showing at `fraction` (0..1) of the run's time, for a scrubber on a clock. */
export declare function frameAtFraction(frames: readonly ReplayFrame[], fraction: number): number;
/** How long into the run frame `i` happened, as "4:05" (or "1:02:03" past an hour). */
export declare function replayClock(frames: readonly ReplayFrame[], i: number): string;
/** The words for how a run ended, for the replay's last frame. */
export declare function replayEnding(r: {
    state: string;
    endedAt?: unknown;
}): string;
