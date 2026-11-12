/**
 * Conversation starters: what an empty Neural conversation offers under "What can Neural 1.0 do
 * for you?". One pool for every client (web /ai, a workspace's TANK Neural, the Neural app, the
 * TANK app) so they always match. Everyday things first; a few work ones; none about writing
 * software (Robby, 2026-11-12: "They are too focused on software development").
 *
 * Every line here is copy people read: change one only with Robby's yes.
 */
/** What a starter needs from the client before it makes sense: the flow a tap opens. */
export type StarterNeed = "photo" | "camera" | "device" | "webpage";
export interface Starter {
    text: string;
    /** Set when the starter uses something only Neural has; the tap also opens that flow. */
    needs?: StarterNeed;
}
export declare const NEURAL_STARTERS: readonly Starter[];
export interface PickStartersOptions {
    /** How many to show; 4 by default. */
    count?: number;
    /** What this client can open from a tap; starters needing anything else are left out. */
    can?: Iterable<StarterNeed>;
    /** At most this many starters that need something (1 by default), so the set stays general. */
    maxNeeds?: number;
    /** [0, 1); Math.random by default, a seeded one in tests. */
    random?: () => number;
    pool?: readonly Starter[];
}
/**
 * A fresh handful for a new conversation: `count` different starters, picked at random from the
 * pool, never two the same.
 */
export declare function pickStarters(opts?: PickStartersOptions): Starter[];
