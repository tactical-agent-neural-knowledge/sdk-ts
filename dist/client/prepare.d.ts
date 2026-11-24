/**
 * Telling the server what somebody is typing to Neural, so the reply can be worked out before
 * they press send (AiService.Prepare; Robby, 2026-11-23: replies within half a second). The
 * first keystroke is reported at once, which wakes a sleeping model; after that the draft is
 * reported when the typing pauses. A draft is never reported twice in a row, calls never
 * overlap, and a failure is silent: preparing is a head start, never something a message waits
 * for. Web, iOS and Android all use this one function, with their own timers.
 */
export interface DraftPreparer {
    /** The draft changed. `key` names where it is being written (a conversation id, or "" for a new one). */
    changed(key: string, text: string): void;
    /** The draft was sent or thrown away: nothing more is reported for it. */
    done(): void;
}
/**
 * What is really happening to a draft, for a line of status beside the composer. Each state is a
 * step that took place, in the order they take place; none of them costs a model call of its
 * own, and none is shown for longer than the step lasts.
 *
 * - `quiet`: nothing is being written, or the draft was sent or thrown away.
 * - `heard`: typing has begun and the server is being told (the first report, with no words,
 *   which also wakes a sleeping model). The draft is heard but not yet read.
 * - `waking`: the server answered that the model is starting; nothing can be prepared until it
 *   is up. Typing on reports again, so this ends by itself.
 * - `reading`: typing paused and the draft as it stands is on its way to the server.
 * - `preparing`: the server has this draft and the model is awake: the question is being
 *   sorted and, if it needs it, looked up. The server does not say when that ends; it ends for
 *   the client when the draft changes (back to `reading`) or is sent (`quiet`).
 */
export type DraftState = "quiet" | "heard" | "waking" | "reading" | "preparing";
export interface DraftPreparerOptions {
    /** Reports one draft. Rejections are swallowed. A result with `awake: false` means the model is starting. */
    send: (key: string, text: string) => Promise<unknown>;
    /** Told each time the draft's state changes (never twice in a row with the same state). */
    onState?: (state: DraftState) => void;
    /** How long typing must pause before the draft is reported. */
    pauseMs?: number;
    setTimer?: (fn: () => void, ms: number) => unknown;
    clearTimer?: (id: unknown) => void;
}
export declare const PREPARE_PAUSE_MS = 250;
export declare function createDraftPreparer(opts: DraftPreparerOptions): DraftPreparer;
