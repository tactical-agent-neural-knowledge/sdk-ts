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
export declare const TANK_NEURAL = "tank-neural-1";
/** The candidate being built and measured against the stable name; a Tread may run it on purpose. */
export declare const TANK_NEURAL_NEXT = "tank-neural-next";
export declare const MODEL_CHOICES: readonly ModelChoice[];
/** The label for a model id, or the id itself for one the list does not know. */
export declare function modelLabel(id: string): string;
