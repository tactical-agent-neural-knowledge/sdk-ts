/**
 * A "Copy key" button on the card the control plane posts when the tank agent makes a Neural API
 * key. Its value is a reveal id, not the key: the host redeems it with
 * `NeuralKeyService.RevealApiKey` (only the person who asked, signed in, once), puts the key on
 * the clipboard and never posts the action anywhere. The key never passes through the agent.
 */
export declare const ACTION_REVEAL_KEY = "neural.key.reveal";
/** What the button says once the key is on the clipboard (approved by Robby, 2026-11-03). */
export declare const REVEAL_COPIED = "Copied";
/** Shown to anyone else, on a second press, and once the reveal has expired. */
export declare const REVEAL_GONE = "This key can no longer be shown.";
