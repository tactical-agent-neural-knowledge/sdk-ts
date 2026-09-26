import { describe, expect, it } from "vitest";
import { AuthService } from "../contracts/tank/auth/v1/auth_pb.js";
import { ACT_AS_USER_HEADER, createTankTransport } from "./transport.js";

/** Captures the headers and fetch options a transport actually puts on the wire. */
function capturing(): { headers: Headers[]; inits: RequestInit[]; fetch: typeof globalThis.fetch } {
  const headers: Headers[] = [];
  const inits: RequestInit[] = [];
  const fetch: typeof globalThis.fetch = async (_input, init) => {
    headers.push(new Headers(init?.headers));
    inits.push(init ?? {});
    return new Response(null, { status: 204 });
  };
  return { headers, inits, fetch };
}

describe("which credentials go on the wire", () => {
  it("a cookie client sends its cookies", async () => {
    const cap = capturing();
    const t = createTankTransport({ baseUrl: "http://api.test", auth: "cookie", fetch: cap.fetch });
    await t
      .unary(AuthService.method.getMe, undefined, undefined, undefined, {}, undefined)
      .catch(() => undefined);
    expect(cap.inits[0]?.credentials).toBe("include");
  });

  // A phone's URL loader stores the cookie every sign-in also sets and replays it unasked. With
  // both on the wire the server had two sessions to choose between, and adding a second account
  // joined the wrong one. The header is the bearer client's only credential.
  it("a bearer client sends the header and no cookies", async () => {
    const cap = capturing();
    const t = createTankTransport({
      baseUrl: "http://api.test",
      auth: { bearer: async () => "tok" },
      fetch: cap.fetch,
    });
    await t
      .unary(AuthService.method.getMe, undefined, undefined, undefined, {}, undefined)
      .catch(() => undefined);
    expect(cap.headers[0]?.get("Authorization")).toBe("Bearer tok");
    expect(cap.inits[0]?.credentials).toBe("omit");
  });
});

describe("acting as one of the device's accounts", () => {
  it("names the account on every request", async () => {
    const cap = capturing();
    const t = createTankTransport({
      baseUrl: "http://api.test",
      auth: "cookie",
      fetch: cap.fetch,
      actAsUserId: "42",
    });
    await t
      .unary(AuthService.method.getMe, undefined, undefined, undefined, {}, undefined)
      .catch(() => undefined);
    expect(cap.headers[0]?.get(ACT_AS_USER_HEADER)).toBe("42");
  });

  it("sends no account header when none is chosen, so the session default applies", async () => {
    const cap = capturing();
    const t = createTankTransport({ baseUrl: "http://api.test", auth: "cookie", fetch: cap.fetch });
    await t
      .unary(AuthService.method.getMe, undefined, undefined, undefined, {}, undefined)
      .catch(() => undefined);
    expect(cap.headers[0]?.get(ACT_AS_USER_HEADER)).toBeNull();
  });
});
