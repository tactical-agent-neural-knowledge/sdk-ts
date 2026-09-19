export type Handler<T> = (payload: T) => void;
/** Minimal typed event emitter. `on` returns the unsubscribe function. */
export declare class Emitter<Events extends object> {
    private handlers;
    on<K extends keyof Events>(type: K, handler: Handler<Events[K]>): () => void;
    once<K extends keyof Events>(type: K, handler: Handler<Events[K]>): () => void;
    off<K extends keyof Events>(type: K, handler: Handler<Events[K]>): void;
    emit<K extends keyof Events>(type: K, payload: Events[K]): void;
    listenerCount(type: keyof Events): number;
    clear(): void;
}
