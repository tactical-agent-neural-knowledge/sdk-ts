import type { Interceptor, Transport } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";

export type TankAuth = "cookie" | { bearer: () => Promise<string> };

/** Names which of the device's signed-in accounts a request acts as. */
export const ACT_AS_USER_HEADER = "x-tank-user";

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
export function createTankTransport(opts: TransportOptions): Transport {
  const baseFetch = opts.fetch ?? globalThis.fetch;
  const interceptors: Interceptor[] = [...(opts.interceptors ?? [])];
  let fetchImpl: typeof globalThis.fetch = baseFetch;

  if (opts.auth === "cookie") {
    fetchImpl = (input, init) => baseFetch(input, { ...init, credentials: "include" });
  } else {
    // A bearer client authenticates with its header alone. Left to itself, a
    // phone's URL loader stores the cookie every sign-in also sets and
    // replays it on every request, and the server then has two credentials
    // to choose between — which is how adding a second account joined it to
    // a cookie session the app never uses. Send none.
    fetchImpl = (input, init) => baseFetch(input, { ...init, credentials: "omit" });
    const { bearer } = opts.auth;
    interceptors.unshift((next) => async (req) => {
      req.header.set("Authorization", `Bearer ${await bearer()}`);
      return next(req);
    });
  }

  if (opts.actAsUserId) {
    const userId = opts.actAsUserId;
    interceptors.unshift((next) => async (req) => {
      req.header.set(ACT_AS_USER_HEADER, userId);
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
