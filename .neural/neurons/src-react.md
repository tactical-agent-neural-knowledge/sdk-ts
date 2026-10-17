# Neurons · src/react
refreshed 2026-10-17 · 6b360350cf49

- React 19 provider and hooks. Entry: `src/react/index.tsx`.
- `TankProvider` wraps the app; takes `client: TankClient`, `autoStart?: boolean` (default true — calls `client.start()` on mount, `stop()` on unmount), `children`.
- `useTank()` returns the `TankClient`. `useTankSelector(select)` subscribes to a memoized slice via `useSyncExternalStore`; `select` must return a stable reference for unchanged input (use `useCallback`).
- Core hooks: `useConnectionState`, `useWorkspace`, `useChannels`, `useChannel`, `usePresence`, `useMe`, `useMembers`, `useMember`, `useMessages`, `useThreadMessages`, `useReadState`, `useUnreads`, `useRun`, `useAgentStatus`, `useNotifications`, `useFile`.
- `useTopoVisibility(workspaceId)` — the person's Topo preferences (which mark families, time axis). Every write is read-modify-write via `UpdatePreferences` to avoid silently resetting notification/theme settings.
- `PresenceRegistry` is an internal ref-counted union of all `usePresence()` sets so one gateway subscription covers all visible lists; batches subscribes via a 0 ms timer.
- `history.ts` — `recentOwn(messages, meId)` returns the person's own recent non-deleted non-system messages for composer ↑ recall; `recallStep(state, dir, list, current)` drives the recall state machine. Exported from the index so callers get `noRecall`, `Recall`, `RecallStep`, `recallStep`, `recentOwn`.
- `isTerminalRunState` re-exported from `../blocks/runTone.js` so React consumers don't need a separate import from `./blocks`.

## Verified
pnpm vitest run src/react
