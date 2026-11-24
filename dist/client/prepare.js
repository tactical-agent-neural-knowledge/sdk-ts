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
    let state = "quiet";
    // Reports are told apart so that an answer to an old one cannot set the state of a newer one.
    let turn = 0;
    const say = (next) => {
        if (next === state)
            return;
        state = next;
        opts.onState?.(next);
    };
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
        const mine = ++turn;
        say(text === "" ? "heard" : "reading");
        void opts
            .send(key, text)
            .catch(() => undefined)
            .then((res) => {
            busy = false;
            if (mine === turn && state !== "quiet") {
                const asleep = typeof res === "object" && res !== null && res.awake === false;
                if (asleep)
                    say("waking");
                else if (text !== "")
                    say("preparing");
            }
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
            if (timer !== undefined)
                clearTimer(timer);
            timer = undefined;
            waiting = undefined;
            turn++;
            say("quiet");
            last = undefined;
            woke = "";
        },
    };
}
