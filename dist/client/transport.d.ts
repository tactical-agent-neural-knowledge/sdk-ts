import type { Interceptor, Transport } from "@connectrpc/connect";
export type TankAuth = "cookie" | {
    bearer: () => Promise<string>;
};
export interface TransportOptions {
    baseUrl: string;
    auth: TankAuth;
    fetch?: typeof globalThis.fetch;
    interceptors?: Interceptor[];
}
/**
 * Connect transport for the TANK API: binary protobuf on the wire, cookies
 * included in cookie mode (web sessions), or an Authorization header minted
 * per request in bearer mode (mobile / node).
 */
export declare function createTankTransport(opts: TransportOptions): Transport;
