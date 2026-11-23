# Neurons · src/react

refreshed 2026-11-23 · 5a19bf7e597e

- `src/react/index.tsx` (about 890 lines) is the whole subpath; `TankProvider` (line 85) calls `client.start()` on mount and `stop()` on unmount unless `autoStart={false}`.
- Every hook goes through the private `useCtx()` (line 100), which throws "TANK hooks must be used inside <TankProvider>" outside the provider.
- `useTankSelector(select)` (line 111) is the generic subscription; the named hooks are thin selectors over it.
- `PresenceRegistry` (line 46) ref-counts every `usePresence` set and batches the subscribe in one `setTimeout`, so separate lists do not each open a subscription.
- Notifications, runs, files and agent status come from the store (`useNotifications`, `useRuns` at line 678, `useAgentStatus` at line 688, `useFile`); no hook keeps a side store.
- Agent output per thread: `useAgentStream` (line 695) returns the `AgentStreamEntry` for a thread root or channel, and `ThreadLiveStreamState` (line 702) describes its lifecycle.
- Run hooks: `useRun` (line 567) and `useThreadRun` (line 582) take `{ load }` to fetch on demand; `useTreadPlan` (line 620) reads the plan ledger for a channel.
- `useTopoVisibility` and `useTopoMarks` build on the rules in `src/topo/visibility.ts`, not their own list.
- `history.ts` `recentOwn` (line 10) and `recallStep` (line 43) implement composer recall (up arrow): own real messages only.
- Tests: `hooks.test.tsx`, `index.test.tsx`, `taskAccess.test.tsx` and `history.test.ts`.

## Verified
- none run in this refresh: `pnpm install --frozen-lockfile` failed in the sandbox (no pnpm fetch, no node_modules), so lint, typecheck and tests were not run; CI runs `pnpm check`.
