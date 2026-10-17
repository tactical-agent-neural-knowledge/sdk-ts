# Neurons · src/client

refreshed 2026-10-17 · 4cf30dae33e3

- `createTankClient` in `src/client/client.ts` is the single entry point; the `TankClient` it returns owns the typed Connect clients (`auth, workspaces, channels, chat, presence, files, agents`/`agent`, `notifications, topo, monitor, command`) plus `realtime`, `store`, `storage` and `events`.
- **New in this refresh**: `src/client/models.ts` exports `MODEL_CHOICES` (a readonly array of `ModelChoice`), `TANK_NEURAL = "tank-neural-1"`, and `modelLabel(id)`. These are the names a Tread switchboard picker shows; the gateway refuses any name not on the list. All exported from `src/client/index.ts`.
- `client.start()` has a fixed order: hydrate from storage → `realtime.setWorkspaceIds` → `realtime.start()` → a 1 s interval dispatching `typing/expire` and `agentStatus/expire` → the persist subscription. Calling realtime before hydration loses the resume cursors.
- Apps never dispatch raw store actions: the helpers (`updateMessage`, `deleteMessage`, `joinChannel`, `leaveChannel`, `createChannel`, `setGoal`, `invite`, `markThreadRead`, `stopRun`) apply an optimistic change and roll it back on error.
- Retries are narrow by design: `RETRYABLE` is `Unavailable, DeadlineExceeded, Aborted, Internal, Unknown`, `MAX_SEND_ATTEMPTS = 6`, send backoff `{minMs: 500, maxMs: 15_000}` — anything else surfaces to the caller on the first failure.
- `src/client/store.ts` is the normalized store (~1500 lines): a `TankState` of about thirty keyed maps, a ~50-member `Action` union, and a `TankStore` that memoizes selector results by key plus dependencies so `useSyncExternalStore` sees stable references. A selector that builds a fresh array every call will loop React.
- `src/client/previewable.ts` returns `true` for images, video, audio, PDF, JSON, plain text, CSV, markdown and Office formats; explicitly returns `false` for HTML, SVG, and XML — they would run script on the file's origin if opened inline. Call `previewable(mime)` before offering "open" vs "download" to a user.
- Unread trap: the server's count wins over local arithmetic, because the arithmetic counts every row that took a seq — hidden replies and deleted messages included. Thread read positions arriving from the server never lower what the device already marked.
- `src/client/realtime.ts` — **the gap buffer is gone**: `gapBufferMs` is `@deprecated` and `clearGap()` is a no-op. Cursor skips are normal and never trigger a Resume; `handleEvent` drops `ev.cursor <= last` as replay overlap.
- Reconnection in `realtime.ts`: `reopen(code)` bumps a generation counter and nulls the old handlers; `CLOSE_GAP`/`CLOSE_RESYNC` reconnect immediately, everything else waits `backoff.next()`. Heartbeat death is `now() - lastActivity > heartbeatMs * 2` → `reopen(CLOSE_STALE)`.
- `src/client/transport.ts`: cookie mode sends `credentials: "include"`, bearer mode sends `credentials: "omit"` — deliberately, so a phone's URL loader cannot replay a stale cookie alongside the Authorization header.
- `src/client/storage.ts` is a flat string key/value interface with colon-namespaced keys; `MemoryStorage` here, `IndexedDbStorage` in `storage-idb.ts` (lazy `import("idb")`, safe to import under SSR), SQLite on mobile.
- `src/client/uuidv7.ts` mints the `client_msg_id` that keys the outbox — time-ordered and monotonic within a process; `cryptoRandomBytes` throws with a pointer to `expo-crypto` when `crypto.getRandomValues` is missing.
- `src/client/upload.ts` + `client.uploadFile`: CreateUpload → multipart PUTs when `created.partUrls.length > 0`, otherwise a single PUT → CompleteUpload. `putUpload` prefers `XMLHttpRequest` for byte-level progress and falls back to `fetch`.
- `src/client/paywall.ts` is the only place that recognises a paywall: `FailedPrecondition` whose message matches `/premium subscription/i`. Other FailedPreconditions must not open an upsell.

## Verified

none — pnpm unavailable in this environment
