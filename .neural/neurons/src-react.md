# Neurons · src/react

refreshed 2026-10-04 · 5378a111dd9c

- `src/react/index.tsx` is the whole `./react` subpath: `TankProvider` plus twenty-odd hooks. There is no separate barrel.
- Every hook reads through `useSyncExternalStore` against the store's memoized selectors (`src/client/store.ts`); that memoization is load-bearing — a selector that returns a new object each call makes React re-render forever.
- Hooks never mutate state directly: they call the client's optimistic helpers, which roll back on error. Apps are not expected to dispatch store actions at all.
- Presence is ref-counted: `PresenceRegistry` in this file unions every `usePresence()` set and flushes once per tick, so one gateway subscription covers every visible list instead of one per component.
- `useTopoVisibility` writes are read-modify-write on purpose — `UpdatePreferences` replaces the whole `Preferences` message, so sending only the Topo part would quietly reset somebody's notification and theme settings.
- `useTopoMarks` refetches when `lastSeq` moves and drops stale responses from a channel the user has already left; without the staleness check a slow response repaints marks for the wrong Tread.
- `useWaitingOn` invalidates on *any* mark change — deliberately coarse, because the alternative is reconciling mark deltas client-side.
- `useThreadRun` seeds from `ListRuns` once and `useRun` from `GetRun`; `useAgentStatus` expires on the store's `AGENT_STATUS_TTL_MS` (30 s), so a dead agent's "thinking" indicator clears itself.
- Notification hooks page per mode and load the first page once; the unread badge follows the bootstrap count and then live events, not local arithmetic.
- `isTerminalRunState` from `src/blocks/runTone.js` is imported here to decide when to stop polling a run — the tone mapping is shared with the renderers rather than duplicated.
- `react` and `react-dom` are optional peers at `^19`; this directory must never import `react-native` (`src/exports.test.ts` enforces it).
- `src/react/hooks.test.tsx` and `index.test.tsx` need a DOM-capable React 19 runtime; on a sandbox below `engines.node >=24` they fail with `React.act is not a function`, which is the environment rather than the hooks.

## Verified

`pnpm lint`, `pnpm typecheck`
