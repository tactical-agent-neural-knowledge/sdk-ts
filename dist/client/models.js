export const TANK_NEURAL = "tank-neural-1";
/** The candidate being built and measured against the stable name; a Tread may run it on purpose. */
export const TANK_NEURAL_NEXT = "tank-neural-next";
export const MODEL_CHOICES = [
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
        id: TANK_NEURAL_NEXT,
        label: "TANK Neural next",
        note: "The candidate for the next TANK Neural, measured against the stable one. Pick it to help prove it.",
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
export function modelLabel(id) {
    return MODEL_CHOICES.find((m) => m.id === id)?.label ?? id;
}
