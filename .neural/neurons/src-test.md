# Neurons · src/test

refreshed 2026-10-04 · 5378a111dd9c

- Test-only support code, and it is excluded from `tsconfig.build.json` (`src/test/**`), so nothing here can reach `dist/` even if something imports it by accident.
- `src/test/fake-gateway.ts` is an in-process `tank.realtime.v1` server over the `ws` package: it speaks the real binary `ClientFrame`/`ServerFrame` encoding, so `src/client/realtime.test.ts` exercises the actual wire format rather than a stub.
- `FakeConn` records what the client sent (`received`), what it subscribed to (`channels`, `threads`, `presence`, `focused`) and the per-workspace `resumeCursors` from Resume — assert against those rather than against internal client state.
- `FakeGatewayOptions` is how reconnection paths are driven: `acceptToken` to reject a Hello, `heartbeatIntervalMs` to override the server-advertised heartbeat, and `rejectResumeFor` (a set of session ids) to force a `ResyncRequired`.
- `src/test/fixture-defs.ts` defines the eight golden cards in asserted order — `plan, diff, ci-green, ci-red, approval, tool-log, status, file`. Edit this file, then run `UPDATE_FIXTURES=1 pnpm test` to rewrite `fixtures/*.json`.
- Fixtures are authored **without** block ids and must normalize to themselves; `T0 = Date.UTC(2026, 8, 18, 12, 0, 0)` is pinned so timestamps do not churn the goldens.
- `src/test/mocks/react-native.tsx` and `react-native-paper.tsx` are the stand-ins Vitest aliases both RN packages to (`vitest.config.ts`); `src/blocks-native` renders against these, and the real packages are dev dependencies for types only.
- In the stand-ins `StyleSheet.create` is the identity function, so a snapshot shows the style object literally; `useTheme()` returns `paperDarkTheme` from `src/design`.
- The exported `alerts` and `opened` arrays in the mocks record `Alert.alert` and `Linking.openURL` calls — that is how the confirm-button and link tests assert, since there is no real native bridge.
- `src/exports.test.ts`'s react-native scan excludes `/test/mocks/`, which is the only reason these two files are allowed to import the RN package names.

## Verified

`pnpm lint`, `pnpm typecheck`, `pnpm vitest run src/client`
