import type { Interceptor, Transport } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";

export type TankAuth = "cookie" | { bearer: () => Promise<string> };

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
export function createTankTransport(opts: TransportOptions): Transport {
  const baseFetch = opts.fetch ?? globalThis.fetch;
  const interceptors: Interceptor[] = [...(opts.interceptors ?? [])];
  let fetchImpl: typeof globalThis.fetch = baseFetch;

  if (opts.auth === "cookie") {
    fetchImpl = (input, init) => baseFetch(input, { ...init, credentials: "include" });
  } else {
    const { bearer } = opts.auth;
    interceptors.unshift((next) => async (req) => {
      req.header.set("Authorization", `Bearer ${await bearer()}`);
      return next(req);
    });
  }

  return createConnectTransport({
    baseUrl: opts.baseUrl.replace(/\/$/, ""),
    useBinaryFormat: true,
    fetch: fetchImpl,
    interceptors,
  });
}
