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
export interface DraftPreparerOptions {
    /** Reports one draft. Rejections are swallowed. */
    send: (key: string, text: string) => Promise<unknown>;
    /** How long typing must pause before the draft is reported. */
    pauseMs?: number;
    setTimer?: (fn: () => void, ms: number) => unknown;
    clearTimer?: (id: unknown) => void;
}
export declare const PREPARE_PAUSE_MS = 250;
export declare function createDraftPreparer(opts: DraftPreparerOptions): DraftPreparer;
