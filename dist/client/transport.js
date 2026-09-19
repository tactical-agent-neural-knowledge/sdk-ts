import { createConnectTransport } from "@connectrpc/connect-web";
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
