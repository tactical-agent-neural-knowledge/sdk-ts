/**
 * How much of a text that is still arriving to show next (Robby, 2026-11-23: "sped up so it
 * seems lightning fast"). Words appear in groups and never letter by letter: each step shows
 * at least the next whole word and at least a third of what is waiting, so a burst of text is
 * on screen in a few frames however long it is, and text that arrives slowly is shown the
 * moment it arrives. Web, iOS and Android all step with this one function.
 */
export declare const REVEAL_TICK_MS = 16;
/** The number of characters to show after one step, given `shown` are on screen now. */
export declare function nextReveal(text: string, shown: number): number;
/** How many steps it takes to show all of `text` from nothing. */
export declare function revealSteps(text: string): number;
