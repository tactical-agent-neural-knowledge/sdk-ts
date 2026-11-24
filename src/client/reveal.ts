/**
 * How much of a text that is still arriving to show next (Robby, 2026-11-23: "sped up so it
 * seems lightning fast"). Words appear in groups and never letter by letter: each step shows
 * at least the next whole word and at least a third of what is waiting, so a burst of text is
 * on screen in a few frames however long it is, and text that arrives slowly is shown the
 * moment it arrives. Web, iOS and Android all step with this one function.
 */
export const REVEAL_TICK_MS = 16;

/** The number of characters to show after one step, given `shown` are on screen now. */
export function nextReveal(text: string, shown: number): number {
  const total = text.length;
  if (shown >= total) return total;
  if (shown < 0) shown = 0;
  let next = shown + Math.max(1, Math.ceil((total - shown) / 3));
  if (next >= total) return total;
  // Up to the end of the word the step lands in, so a word is never shown in pieces.
  while (next < total && !/\s/.test(text[next] as string)) next++;
  return next;
}

/** How many steps it takes to show all of `text` from nothing. */
export function revealSteps(text: string): number {
  let n = 0;
  for (let shown = 0; shown < text.length; n++) shown = nextReveal(text, shown);
  return n;
}
