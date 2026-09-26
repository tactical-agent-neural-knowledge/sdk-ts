import { createConnectTransport } from "@connectrpc/connect-web";
/** Names which of the device's signed-in accounts a request acts as. */
export const ACT_AS_USER_HEADER = "x-tank-user";
/**
 * Connect transport for the TANK API: binary protobuf on the wire, cookies
 * included in cookie mode (web sessions), or an Authorization header minted
 * per request in bearer mode (mobile / node).
 */
export function createTankTransport(opts) {
    const baseFetch = opts.fetch ?? globalThis.fetch;
    const interceptors = [...(opts.interceptors ?? [])];
    let fetchImpl = baseFetch;
    if (opts.auth === "cookie") {
        fetchImpl = (input, init) => baseFetch(input, { ...init, credentials: "include" });
    }
    else {
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
