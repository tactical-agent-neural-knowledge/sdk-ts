# Neurons · src/test

refreshed 2026-11-16 · ad2838acc55d

- `src/test/fake-gateway.ts` `FakeGateway` (line 49) is a `ws` server that speaks the binary Connect realtime frames; it records each connection's `received` client frames and pushes `Event` frames to tests.
- `fakeMessage()` builds a `Message` fixture with a fixed shape; `resetSeq()` resets the gateway sequence counters between tests.
- `src/test/fixture-defs.ts` maps names to block builders (`fixtureDefs`, line 22); `FIXTURE_NAMES` drives the snapshot tests in `blocks-web` and `blocks-native`, so editing a fixture changes snapshots.
- Regenerate the golden JSON in the repo-root `fixtures/` folder after editing a fixture with `UPDATE_FIXTURES=1 pnpm test` (`CLAUDE.md`, command vocabulary).
- `src/test/mocks/react-native.tsx` renders host components as plain elements, makes `StyleSheet.create` the identity and records `Alert` and `Linking` calls; these are aliased in the Vitest config and never built.
- `src/test/mocks/react-native-paper.tsx` and `react-native-svg.tsx` are the matching stand-ins; extend them only for what `src/blocks-native` actually touches.
- `src/test/richtext-markdown.ts` exports `usageReport`, a `RichText` fixture for rich text rendering tests.

## Verified
- none run in this refresh: `pnpm install --frozen-lockfile` could not reach the npm registry from the sandbox (ENETUNREACH), so lint, typecheck and tests were not run here; CI runs `pnpm check`.
