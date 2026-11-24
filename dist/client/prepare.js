export const PREPARE_PAUSE_MS = 250;
export function createDraftPreparer(opts) {
    const pause = opts.pauseMs ?? PREPARE_PAUSE_MS;
    const setTimer = opts.setTimer ?? ((fn, ms) => setTimeout(fn, ms));
    const clearTimer = opts.clearTimer ?? ((id) => clearTimeout(id));
    let timer;
    let last; // key + "\n" + text of the last draft reported
    let busy = false;
    let waiting;
    let woke = "";
    const report = (key, text) => {
        const id = `${key}\n${text}`;
        if (id === last)
            return;
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
            if (next)
                report(next.key, next.text);
        });
    };
    return {
        changed(key, text) {
            if (timer !== undefined)
                clearTimer(timer);
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
            if (timer !== undefined)
                clearTimer(timer);
            timer = undefined;
            waiting = undefined;
            last = undefined;
            woke = "";
        },
    };
}
