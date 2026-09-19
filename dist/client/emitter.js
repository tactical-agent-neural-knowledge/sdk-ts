/** Minimal typed event emitter. `on` returns the unsubscribe function. */
export class Emitter {
    handlers = new Map();
    on(type, handler) {
        let set = this.handlers.get(type);
        if (!set) {
            set = new Set();
            this.handlers.set(type, set);
        }
        set.add(handler);
        return () => this.off(type, handler);
    }
    once(type, handler) {
        const off = this.on(type, (p) => {
            off();
            handler(p);
        });
        return off;
    }
    off(type, handler) {
        this.handlers.get(type)?.delete(handler);
    }
    emit(type, payload) {
        const set = this.handlers.get(type);
        if (!set)
            return;
        for (const h of Array.from(set)) {
            try {
                h(payload);
            }
            catch (err) {
                // A listener throwing must never break the socket loop.
                queueMicrotask(() => {
                    throw err;
                });
            }
        }
    }
    listenerCount(type) {
        return this.handlers.get(type)?.size ?? 0;
    }
    clear() {
        this.handlers.clear();
    }
}
