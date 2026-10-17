/**
 * The models a Tread's switchboard can pick from, by the names the gateway resolves.
 *
 * "" lets TANK decide per run (the default: a small change on Sonnet, a multi-area change
 * on the Tread's default, a check-in on Haiku). "tank-neural-1" is TANK's own model: a
 * name the gateway owns, behind which sits whatever the platform has trained, and until
 * the first training lands the base model that training starts from. The Claude names
 * route as they are. The gateway refuses a name not on this list at save.
 */
export interface ModelChoice {
  id: string;
  label: string;
  /** One line the picker shows under the name. */
  note: string;
  /** Rough price relative to Sonnet: 0.5 = half, 2.5 = two and a half times. */
  relativeCost: number;
}

export const TANK_NEURAL = "tank-neural-1";

export const MODEL_CHOICES: readonly ModelChoice[] = [
  {
    id: "",
    label: "TANK decides",
    note: "The cheapest model that fits each run; moves up only after checks fail.",
    relativeCost: 1,
  },
  {
    id: TANK_NEURAL,
    label: "TANK Neural 1.0",
    note: "TANK's own model, trained on consenting workspaces' runs. Preview: answers from its base model until the first training lands.",
    relativeCost: 0.5,
  },
  {
    id: "claude-sonnet-5",
    label: "Claude Sonnet 5",
    note: "The default for a change a person asked for.",
    relativeCost: 1,
  },
  {
    id: "claude-opus-5",
    label: "Claude Opus 5",
    note: "The strongest; two and a half times the cost on every token.",
    relativeCost: 2.5,
  },
  {
    id: "claude-haiku-4-5",
    label: "Claude Haiku 4.5",
    note: "Fast and cheap; for small, well-described changes.",
    relativeCost: 0.5,
  },
];

/** The label for a model id, or the id itself for one the list does not know. */
export function modelLabel(id: string): string {
  return MODEL_CHOICES.find((m) => m.id === id)?.label ?? id;
}
