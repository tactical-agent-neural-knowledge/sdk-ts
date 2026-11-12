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

export const NEURAL_STARTERS: readonly Starter[] = [
  // Writing
  { text: "Help me write a thank-you note to a friend" },
  { text: "Make this paragraph shorter and clearer" },
  { text: "Write a short toast for a friend's wedding" },
  { text: "Help me write a kind message to someone who is grieving" },
  // Work email
  { text: "Write a polite email asking for more time on a deadline" },
  { text: "Help me answer a tough email calmly" },
  { text: "Turn my rough notes into a clear email" },
  { text: "Write a short note introducing two colleagues" },
  // Work
  { text: "Help me prepare for a job interview" },
  { text: "Write an agenda for a 30-minute team meeting" },
  { text: "Make my resume summary sound stronger" },
  // Planning
  { text: "Help me plan my week around three big tasks" },
  { text: "Turn these notes into a short plan" },
  { text: "Make a packing list for a three-day trip" },
  // Learning and explaining
  { text: "Explain how vaccines work in plain words" },
  { text: "Why is the sky blue? Explain it simply" },
  { text: "Explain compound interest with a simple example" },
  { text: "Quiz me on world capitals" },
  { text: "Teach me ten useful phrases in Spanish" },
  // Cooking
  { text: "What can I cook with eggs, rice and spinach?" },
  { text: "Plan five easy dinners for a busy week" },
  { text: "How do I make a simple tomato sauce from scratch?" },
  // Travel
  { text: "Plan three relaxed days in Lisbon on a budget" },
  { text: "What should I know before my first trip abroad?" },
  { text: "Suggest a scenic road trip for a long weekend" },
  // Money
  { text: "Help me make a simple monthly budget" },
  { text: "How do I start an emergency fund?" },
  { text: "Compare renting and buying a home in plain words" },
  // Health, answered with care
  { text: "What questions should I ask at my next checkup?" },
  { text: "Give me simple habits for better sleep" },
  { text: "Help me understand a medical term my doctor used" },
  // Summarizing
  { text: "Summarize an article I paste in" },
  { text: "Pull the key points out of these meeting notes" },
  // Brainstorming
  { text: "Give me ten birthday gift ideas for my dad" },
  { text: "Brainstorm names for a small neighborhood bakery" },
  { text: "Suggest fun things to do with kids on a rainy day" },
  // A little fun
  { text: "Tell me a fun fact I can share at dinner" },
  { text: "Write a short poem about Monday mornings" },
  { text: "Give me a riddle and let me guess the answer" },
  { text: "Make a picture of a cozy cabin in the snow" },
  // What Neural has: photos, the camera, a connected device, a webpage
  { text: "Look at this photo and tell me what you see", needs: "photo" },
  { text: "Read this receipt and add up the total", needs: "photo" },
  { text: "Look through my camera and tell me what you see", needs: "camera" },
  { text: "Connect my device and tell me what it measures", needs: "device" },
  { text: "Open a webpage and sum it up for me", needs: "webpage" },
];

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
export function pickStarters(opts: PickStartersOptions = {}): Starter[] {
  const { count = 4, maxNeeds = 1, random = Math.random, pool = NEURAL_STARTERS } = opts;
  const can = new Set(opts.can ?? []);
  const seen = new Set<string>();
  const eligible = pool.filter((s) => {
    if (seen.has(s.text) || (s.needs && !can.has(s.needs))) return false;
    seen.add(s.text);
    return true;
  });
  // Fisher–Yates, front to back, stopping once there are enough.
  const deck = eligible.slice();
  const out: Starter[] = [];
  let needs = 0;
  for (let i = 0; i < deck.length && out.length < count; i++) {
    const j = i + Math.floor(Math.min(random(), 0.999999) * (deck.length - i));
    const picked = deck[j] as Starter;
    deck[j] = deck[i] as Starter;
    deck[i] = picked;
    if (picked.needs) {
      if (needs >= maxNeeds) continue;
      needs++;
    }
    out.push(picked);
  }
  return out;
}
