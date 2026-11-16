# Neurons · src/react

refreshed 2026-11-16 · ad2838acc55d

- `src/react/index.tsx` (about 850 lines) is the whole subpath; `TankProvider` calls `client.start()` on mount and `stop()` on unmount unless `autoStart={false}`.
- Every hook throws "TANK hooks must be used inside <TankProvider>" outside the provider; the private `useCtx()` does the check.
- `useTankSelector(select)` is the generic subscription; the named hooks (`useMessages`, `useThread`, `useNotifications`, `useTasks`, `useRun`) are thin selectors over it.
- `PresenceRegistry` (line 45) ref-counts every `usePresence` set and sends one `presenceSubscribe` per tick (`setTimeout(…, 0)`), so separate lists do not each open a subscription.
- Notifications, runs, files and agent status come from the store (`useNotifications`, `useRuns`, `useAgentStatus`, `useFile`); no hook keeps a side store.
- `useTopoVisibility` and `useTopoMarks` build on the rules in `src/topo/visibility.ts` (`visibleMarkTypes`, `isMarkVisible`), not their own list.
- `useChannelView` returns `ChannelView.BUILDER` or `ChannelView.SIMPLE`; `useTaskAccess` returns the `TaskAccess` union for the current principal.
- `history.ts` `recentOwn` implements composer recall (up arrow): own real messages only, skipping deleted, empty and back-to-back duplicate text.
- Tests: `hooks.test.tsx`, `index.test.tsx`, `taskAccess.test.tsx` and `history.test.ts`.

## Verified
- none run in this refresh: `pnpm install --frozen-lockfile` could not reach the npm registry from the sandbox (ENETUNREACH), so lint, typecheck and tests were not run here; CI runs `pnpm check`.
