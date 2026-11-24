import type { OfferEntry } from "./store.js";

/**
 * Starting work without typing "@tank" (Overdrive, 2026-11-23). When a draft tags no agent but
 * reads like work, the server offers the workspace's agent (`Draft.offered_agent_id`) and the
 * composer shows it above the text. Sending with the offer on starts the work; the person can
 * turn it off for that message and send it as an ordinary one.
 *
 * The sentences live here so web and mobile read the same. Every sentence is copy people read:
 * change one only with Robby's yes.
 */
export const OFFER_COPY = {
  /** The line above the composer: "Tank will start on this when you send". */
  ready: (agentName: string) => `${capitalize(agentName)} will start on this when you send`,
  /** The control that turns the offer off for this message. */
  decline: "Just send it",
  /** What that control says to a screen reader. */
  declineLabel: (agentName: string) => `Send this without ${capitalize(agentName)}`,
};

function capitalize(name: string): string {
  const n = name.trim() || "tank";
  return n.charAt(0).toUpperCase() + n.slice(1);
}

/**
 * The mention ids a message goes out with: the ones it already has, plus the offered agent's
 * user when there is an offer and the person has not turned it off. Never adds it twice.
 */
export function withOfferedMention(
  mentionIds: readonly string[],
  offer: OfferEntry | undefined,
  declined: boolean,
): string[] {
  const out = [...mentionIds];
  if (offer && !declined && !out.includes(offer.agentUserId)) out.push(offer.agentUserId);
  return out;
}
