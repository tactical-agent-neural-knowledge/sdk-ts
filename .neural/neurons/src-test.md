# Neurons · src/test

refreshed 2026-10-31 · bf59edafde49

- `src/test/` is excluded from `tsconfig.build.json` entirely; nothing here reaches `dist/`; all imports from `src/test/` are test-only by construction.
- `src/test/fake-gateway.ts` exports `FakeGateway` and `FakeConn`. `FakeGateway.start(opts)` spins up an in-process `ws` WebSocketServer on a random port; `FakeConn` records every `ClientFrame` the client sends and tracks per-workspace Resume cursors in `resumeCursors: Record<string, bigint>`. `FakeGatewayOptions` lets tests control which tokens are accepted and which session ids trigger `ResyncRequired`.
- `FakeGateway` maintains a per-workspace event log (`log: Map<string, Array<{cursor, envelope}>>`) so Resume can replay missed envelopes; used in `src/client/client.test.ts` to test gap-buffer and resume logic.
- `src/test/fixture-defs.ts` exports `fixtureDefs: Record<string, () => Blocks>` — the eight golden block card factories (plan, statusCard, ciStatus, diffPreview, toolLog, approvalPrompt, context, actions). Edit here, then run `UPDATE_FIXTURES=1 pnpm test` to regenerate `fixtures/*.json`.
- `src/test/mocks/react-native.tsx` is a partial stub of `react-native` for Vitest; `react-native-paper.tsx` stubs the Paper components `blocks-native` uses; `react-native-svg.tsx` stubs SVG primitives. All three are aliased in `vitest.config.ts` and must not be imported in production code.
- `vitest.config.ts` sets up the module name mapper for the three RN stubs, configures jsdom for `src/blocks-web/**` and `src/react/**` tests, and sets `TEST_TRANSPORT` for `src/client/` integration tests.

## Verified

`pnpm lint`, `pnpm typecheck`
