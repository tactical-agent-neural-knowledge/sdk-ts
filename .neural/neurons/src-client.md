# Neurons · src/client

refreshed 2026-11-23 · 5a19bf7e597e

- `createTankClient(opts)` (`client.ts` line ~1918) is the entry point; all methods live on the `TankClient` class (about 1,940 lines) and `index.ts` is the barrel for the `.` subpath.
- Apps never dispatch raw store actions: `sendMessage`, `updateMessage`, `deleteMessage`, `joinChannel`, `leaveChannel`, `createChannel`, `setGoal`, `invite` and `markThreadRead` update the store optimistically and roll back on error (`CLAUDE.md`, decided list).
- `sendMessage` (`client.ts` line 737) mints a UUIDv7 `clientMsgId` through the injected `randomBytes` (line 362), persists it to the outbox, and retries up to `MAX_SEND_ATTEMPTS` (6, line 280) with `SEND_TIMEOUT_MS` (15 s, line 282).
- Trap: a persisted store is a first paint, not a sync point; the first open of a channel takes the newest page through `loadChannelTail` (`client.ts` line 667, reached from `loadChannel` line 602) instead of paging before a stale row.
- Thread live output is per thread: `setThreadLiveStream`, `getThreadLiveStream` and `refreshAgentStreamTail` (`client.ts` lines ~480-530) drive it; the store key is `threadLiveStreamKey(channelId, threadRootId)` (`store.ts` line 184).
- `store.ts` is the only state: `reduce(state, action)` (line 649) is the one transition function, `envelopeToActions` (line 1336) turns gateway envelopes into actions, and `TankState` (line 121) holds every slice; `AGENT_STATUS_TTL_MS` (30 s, line 190) expires agent status.
- Trust the `EventPayload` union in `store.ts` (line 1325): an unrecognised event arrives as `{ $typeName: "unknown" }` and is not reduced until handled.
- `realtime.ts` `RealtimeClient`: heartbeat every 25 s by default (line 166), reconnect backoff from `backoff.ts` (250 ms to 30 s defaults), and an injectable `onlineSignal` (line 96) that defaults to `browserOnlineSignal`.
- Storage is string key/value through `TankStorage`: `MemoryStorage` (`storage.ts` line 17) for tests, `IndexedDbStorage` (`storage-idb.ts` line 16) for web; `storageKeys` (`storage.ts` line 36) names every key.
- `upload.ts` PUTs to the presigned URL with XHR progress and a fetch fallback that reports progress only at 0 and 1; failures throw `UploadError` (line 43).
- Tests: `client.test.ts`, `realtime.test.ts` and `thread-live-stream.test.ts` drive the client through the fake gateway in `src/test/fake-gateway.ts`.

## Verified
- none run in this refresh: `pnpm install --frozen-lockfile` failed in the sandbox (no pnpm fetch, no node_modules), so lint, typecheck and tests were not run; CI runs `pnpm check`.
