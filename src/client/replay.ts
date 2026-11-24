import type { BoardObject, ReplayFrame } from "../contracts/tank/board/v1/board_pb.js";

/**
 * A run's replay (Overdrive, 2026-11-24): the server keeps every write the run made to its
 * Workbench and every live line, in order; a client folds them up to a moment to show the bench
 * as it stood then. Shared by web and mobile so both scrub the same way.
 */

function ms(f: ReplayFrame | undefined): number {
  const t = f?.at;
  return t ? Number(t.seconds) * 1000 + Math.floor(t.nanos / 1e6) : 0;
}

/** The bench as it stood after frame `upTo` (inclusive), in paint order. */
export function benchAt(frames: readonly ReplayFrame[], upTo: number): BoardObject[] {
  const objs = new Map<string, BoardObject>();
  const last = Math.min(upTo, frames.length - 1);
  for (let i = 0; i <= last; i++) {
    const f = frames[i];
    if (!f) continue;
    for (const o of f.objects) objs.set(o.id, o);
    for (const d of f.deleteIds) {
      objs.delete(d);
      // A frame taken off takes what was inside it, as the board does.
      for (const [id, o] of objs) if (o.parentId === d) objs.delete(id);
    }
  }
  return [...objs.values()].sort((a, b) => a.z - b.z);
}

/** The live line people read at frame `upTo`: the last one said by then, or "". */
export function liveAt(frames: readonly ReplayFrame[], upTo: number): string {
  for (let i = Math.min(upTo, frames.length - 1); i >= 0; i--) {
    const l = frames[i]?.live;
    if (l) return l;
  }
  return "";
}

/** The frame showing at `fraction` (0..1) of the run's time, for a scrubber on a clock. */
export function frameAtFraction(frames: readonly ReplayFrame[], fraction: number): number {
  if (frames.length === 0) return -1;
  const start = ms(frames[0]);
  const end = ms(frames[frames.length - 1]);
  if (end <= start) return Math.round(Math.max(0, Math.min(1, fraction)) * (frames.length - 1));
  const at = start + Math.max(0, Math.min(1, fraction)) * (end - start);
  let i = 0;
  while (i + 1 < frames.length && ms(frames[i + 1]) <= at) i++;
  return i;
}

/** How long into the run frame `i` happened, as "4:05" (or "1:02:03" past an hour). */
export function replayClock(frames: readonly ReplayFrame[], i: number): string {
  const s = Math.max(0, Math.round((ms(frames[i]) - ms(frames[0])) / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

/** The words for how a run ended, for the replay's last frame. */
export function replayEnding(r: { state: string; endedAt?: unknown }): string {
  if (!r.endedAt) return "Still working";
  switch (r.state) {
    case "done":
    case "merged":
      return "Finished";
    case "cancelled":
      return "Stopped";
    default:
      return "Did not finish";
  }
}
