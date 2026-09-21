/**
 * The one place that recognises "you need to pay for this".
 *
 * The api answers a gated call with FailedPrecondition and a sentence written for a person to read.
 * Both clients already forward a short FailedPrecondition message verbatim, so the sentence is the UI
 * and this only has to tell a paywall apart from the other preconditions — an archived Tread, a deleted
 * thread — which must not open an upsell.
 */
export declare function paywallMessage(err: unknown): string | undefined;
export declare function isPaywall(err: unknown): boolean;
