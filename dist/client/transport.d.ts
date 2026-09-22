import type { Interceptor, Transport } from "@connectrpc/connect";
export type TankAuth = "cookie" | {
    bearer: () => Promise<string>;
};
/** Names which of the device's signed-in accounts a request acts as. */
export declare const ACT_AS_USER_HEADER = "x-tank-user";
export interface TransportOptions {
    baseUrl: string;
    auth: TankAuth;
    fetch?: typeof globalThis.fetch;
    interceptors?: Interceptor[];
    /**
     * Which of the device's signed-in accounts these calls act as.
     *
     * One session can hold several accounts — the same person often belongs to
     * workspaces under different email addresses — and the account is chosen per
     * request rather than by server-side "active" state, so two tabs can sit in
     * two accounts at once. Omit it to act as the session's default.
     */
    actAsUserId?: string;
}
/**
 * Connect transport for the TANK API: binary protobuf on the wire, cookies
 * included in cookie mode (web sessions), or an Authorization header minted
 * per request in bearer mode (mobile / node).
 */
export declare function createTankTransport(opts: TransportOptions): Transport;
