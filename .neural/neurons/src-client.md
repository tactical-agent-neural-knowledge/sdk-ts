# Neurons · src/client

refreshed 2026-10-04 · 5378a111dd9c

- `createTankClient` in `src/client/client.ts` is the single entry point; the `TankClient` it returns owns the typed Connect clients (`auth, workspaces, channels, chat, presence, files, agents`/`agent`, `notifications, topo, monitor, command`) plus `realtime`, `store`, `storage` and `events`.
- `client.start()` has a fixed order: hydrate from storage → `realtime.setWorkspaceIds` → `realtime.start()` → a 1 s interval dispatching `typing/expire` and `agentStatus/expire` → the persist subscription. Calling realtime before hydration loses the resume cursors.
- Apps never dispatch raw store actions: the helpers (`updateMessage`, `deleteMessage`, `joinChannel`, `leaveChannel`, `createChannel`, `setGoal`, `invite`, `markThreadRead`, `stopRun`) apply an optimistic change and roll it back on error.
- Retries are narrow by design: `RETRYABLE` is `Unavailable, DeadlineExceeded, Aborted, Internal, Unknown`, `MAX_SEND_ATTEMPTS = 6`, send backoff `{minMs: 500, maxMs: 15_000}` — anything else surfaces to the caller on the first failure.
- `src/client/store.ts` is the normalized store (~1500 lines): a `TankState` of about thirty keyed maps, a ~50-member `Action` union, and a `TankStore` that memoizes selector results by key plus dependencies so `useSyncExternalStore` sees stable references. A selector that builds a fresh array every call will loop React.
- Timeline trap, in `inChannelTimeline`: a reply appears in the Tread only if its author also sent it to the channel. Ordering by `seq` alone is what used to make every live agent reply show up in the Tread until the next refresh.
- Unread trap: the server's count wins over local arithmetic, because the arithmetic counts every row that took a seq — hidden replies and deleted messages included. Thread read positions arriving from the server never lower what the device already marked.
- `readReceipt({seq, authorId, positions, expected})` in `store.ts` returns `{readBy, everyone}`, skips the author, and defaults `expected` to the number of other positions.
- `src/client/realtime.ts` — **the gap buffer is gone**: `gapBufferMs` is `@deprecated` and `clearGap()` is a no-op, although the class doc comment and `CLAUDE.md` still describe one. Cursor skips are normal and never trigger a Resume; `handleEvent` drops `ev.cursor <= last` as replay overlap.
- Reconnection in `realtime.ts`: `reopen(code)` bumps a generation counter and nulls the old handlers; `CLOSE_GAP`/`CLOSE_RESYNC` reconnect immediately, everything else waits `backoff.next()`. Heartbeat death is `now() - lastActivity > heartbeatMs * 2` → `reopen(CLOSE_STALE)`, with the server's `Ready.heartbeat_interval_ms` overriding when positive. Subscriptions are resent after every Ready/Resumed.
- `decode()` in `realtime.ts` accepts `Uint8Array`, `ArrayBuffer`, `ArrayBufferView`, `Blob` and an array of chunks, because the `ws` package delivers fragmented frames as an array.
- `src/client/transport.ts`: cookie mode sends `credentials: "include"`, bearer mode sends `credentials: "omit"` — deliberately, so a phone's URL loader cannot replay a stale cookie alongside the Authorization header. `actAsUserId` becomes the `x-tank-user` header (`ACT_AS_USER_HEADER`); give each account its own storage namespace or they overwrite each other's cache.
- `src/client/storage.ts` is a flat string key/value interface with colon-namespaced keys (`cursor:<ws>`, `outbox:<id>`, `channel:<id>:messages`) so `scan(prefix)` hydrates one family at a time; `MemoryStorage` here, `IndexedDbStorage` in `storage-idb.ts` (lazy `import("idb")`, safe to import under SSR), SQLite on mobile.
- `src/client/uuidv7.ts` mints the `client_msg_id` that keys the outbox — time-ordered and monotonic within a process; `cryptoRandomBytes` throws with a pointer to `expo-crypto` when `crypto.getRandomValues` is missing, and `randomBytes` is injectable through `createTankClient`.
- `src/client/upload.ts` + `client.uploadFile`: CreateUpload → multipart PUTs when `created.partUrls.length > 0`, otherwise a single PUT → CompleteUpload. `putUpload` prefers `XMLHttpRequest` for byte-level progress and falls back to `fetch` (progress 0 then 1).
- `src/client/paywall.ts` is the only place that recognises a paywall: `FailedPrecondition` whose message matches `/premium subscription/i`. Other FailedPreconditions (archived Tread, deleted thread) must not open an upsell.
- `src/client/backoff.ts` is full-jitter exponential backoff — each delay is uniform in `[0, min(max, base·2^attempt)]`, defaults `250 ms` / `30 s`, with an injectable `random` for tests.

## Verified

`pnpm lint`, `pnpm typecheck`, `pnpm vitest run src/client`
