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

  const report = (key: string, text: string) => {
    const id = `${key}\n${text}`;
    if (id === last) return;
    if (busy) {
      waiting = { key, text };
      return;
    }
    last = id;
    busy = true;
    void opts
      .send(key, text)
      .catch(() => undefined)
      .then(() => {
        busy = false;
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
      last = undefined;
      woke = "";
    },
  };
}
