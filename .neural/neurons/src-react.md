# Neurons · src/react

refreshed 2026-10-31 · bf59edafde49

- `src/react/index.tsx` is the single barrel; it also re-exports `TankStore` and common types from `src/client/store.ts`, and `noRecall`/`Recall`/`recallStep`/`recentOwn` from `src/react/history.ts`.
- `TankProvider` wires a `TankClient` into context; `autoStart` (default `true`) calls `client.start()` on mount and `stop()` on unmount. It also creates a `PresenceRegistry` that ref-counts every `usePresence()` call so a single gateway subscription covers all visible lists.
- `useTank()` returns the `TankClient`; `useTankSelector<T>(select)` subscribes to the store with `useSyncExternalStore` — the preferred way to read any slice of `TankState`.
- Run-related hooks: `useRun(runId, {load?})` fetches and subscribes to a single run; `useThreadRun(rootId, {load?})` does the same for the run attached to a thread; `useRuns(workspaceId)` returns all runs in the workspace from the store; `useRunsByThread()` returns the `runsByThread` map.
- Agent status hooks: `useAgentStatus(threadRootIdOrChannelId)` returns the live `AgentStatus` for a specific thread or channel; `useAgentStatuses(channelId)` returns all statuses under a channel. Statuses expire after `AGENT_STATUS_TTL_MS` (30 s).
- Plan hook: `useTreadPlan(channelId)` returns `TreadPlanState` with `plan`, `loading`, and `error`; it fetches `GetTreadPlan` on first call and subscribes to `AgentRunUpdated` events to keep the plan current.
- Topo hooks: `useTopoVisibility` returns `TopoVisibility` (which mark types to show based on workspace preferences); `useTopoMarks(channelId)` returns all visible marks sorted for the strip; `useWaitingOn(workspaceId, direction)` returns items this workspace is waiting on or waiting for.
- Notification hooks: `useNotifications(opts)` pages through notifications; `useUnreadNotificationCount(workspaceId)` returns the live unread badge count from the store.
- `src/react/history.ts` provides `recentOwn(messages, meId, limit)` (your own real messages, newest first, deduped back-to-back) and `recallStep(state, dir, list, current)` (what ↑/↓ does in the composer — ignore / hold / clear / show — without touching React state).
- `useFile(fileId)` and `useMessageFiles(messageId)` subscribe to `filesById` in the store; files are seeded from bootstrap and updated by `FileReady`/`FileDeleted` events.
- `usePresence` debounces gateway subscription through `PresenceRegistry.flush()` (zero-timeout) so multiple mounts coalesce into one `realtime.presenceSubscribe` call.

## Verified

`pnpm lint`, `pnpm typecheck`, `pnpm vitest run src/react/`
