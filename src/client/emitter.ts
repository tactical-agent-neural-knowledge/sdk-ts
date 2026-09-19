export type Handler<T> = (payload: T) => void;

/** Minimal typed event emitter. `on` returns the unsubscribe function. */
export class Emitter<Events extends object> {
  private handlers = new Map<keyof Events, Set<Handler<never>>>();

  on<K extends keyof Events>(type: K, handler: Handler<Events[K]>): () => void {
    let set = this.handlers.get(type);
    if (!set) {
      set = new Set();
      this.handlers.set(type, set);
    }
    set.add(handler as Handler<never>);
    return () => this.off(type, handler);
  }

  once<K extends keyof Events>(type: K, handler: Handler<Events[K]>): () => void {
    const off = this.on(type, (p) => {
      off();
      handler(p);
    });
    return off;
  }

  off<K extends keyof Events>(type: K, handler: Handler<Events[K]>): void {
    this.handlers.get(type)?.delete(handler as Handler<never>);
  }

  emit<K extends keyof Events>(type: K, payload: Events[K]): void {
    const set = this.handlers.get(type);
    if (!set) return;
    for (const h of Array.from(set)) {
      try {
        (h as Handler<Events[K]>)(payload);
      } catch (err) {
        // A listener throwing must never break the socket loop.
        queueMicrotask(() => {
          throw err;
        });
      }
    }
  }

  listenerCount(type: keyof Events): number {
    return this.handlers.get(type)?.size ?? 0;
  }

  clear(): void {
    this.handlers.clear();
  }
}
