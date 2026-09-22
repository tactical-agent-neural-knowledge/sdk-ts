import { describe, expect, it } from "vitest";
import { AuthService } from "../contracts/tank/auth/v1/auth_pb.js";
import { ACT_AS_USER_HEADER, createTankTransport } from "./transport.js";

/** Captures the headers a transport actually puts on the wire. */
function capturing(): { headers: Headers[]; fetch: typeof globalThis.fetch } {
  const headers: Headers[] = [];
  const fetch: typeof globalThis.fetch = async (_input, init) => {
    headers.push(new Headers(init?.headers));
    return new Response(null, { status: 204 });
  };
  return { headers, fetch };
}

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
