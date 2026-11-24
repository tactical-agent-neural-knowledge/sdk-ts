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

export const PREPARE_PAUSE_MS = 250;

export function createDraftPreparer(opts: DraftPreparerOptions): DraftPreparer {
  const pause = opts.pauseMs ?? PREPARE_PAUSE_MS;
  const setTimer = opts.setTimer ?? ((fn, ms) => setTimeout(fn, ms));
  const clearTimer = opts.clearTimer ?? ((id) => clearTimeout(id as ReturnType<typeof setTimeout>));
  let timer: unknown;
  let last: string | undefined; // key + "\n" + text of the last draft reported
  let busy = false;
  let waiting: { key: string; text: string } | undefined;
  let woke = "";
  let state: DraftState = "quiet";
  // Reports are told apart so that an answer to an old one cannot set the state of a newer one.
  let turn = 0;
  const say = (next: DraftState) => {
    if (next === state) return;
    state = next;
    opts.onState?.(next);
  };

  const report = (key: string, text: string) => {
    const id = `${key}\n${text}`;
    if (id === last) return;
    if (busy) {
      waiting = { key, text };
      return;
    }
    last = id;
    busy = true;
    const mine = ++turn;
    say(text === "" ? "heard" : "reading");
    void opts
      .send(key, text)
      .catch(() => undefined)
      .then((res) => {
        busy = false;
        if (mine === turn && state !== "quiet") {
          const asleep =
            typeof res === "object" && res !== null && (res as { awake?: unknown }).awake === false;
          if (asleep) say("waking");
          else if (text !== "") say("preparing");
        }
        const next = waiting;
        waiting = undefined;
        if (next) report(next.key, next.text);
      });
  };

  return {
    changed(key, text) {
      if (timer !== undefined) clearTimer(timer);
      timer = undefined;
      const trimmed = text.trim();
      if (trimmed === "") {
        waiting = undefined;
        turn++;
        say("quiet");
        return;
      }
      // The first thing typed here is reported straight away, with no words: it wakes the model.
      if (woke !== key || last === undefined) {
        woke = key;
        report(key, "");
      }
      timer = setTimer(() => {
        timer = undefined;
        report(key, text);
      }, pause);
    },
    done() {
      if (timer !== undefined) clearTimer(timer);
      timer = undefined;
      waiting = undefined;
      turn++;
      say("quiet");
      last = undefined;
      woke = "";
    },
  };
}
