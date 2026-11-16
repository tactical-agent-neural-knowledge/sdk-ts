# Neurons · src/client

refreshed 2026-11-16 · ad2838acc55d

- `createTankClient(opts)` in `client.ts` is the entry point; all methods live on the `TankClient` class (about 1,840 lines), and `index.ts` is the barrel for the `.` subpath.
- Apps never dispatch raw store actions: `sendMessage`, `updateMessage`, `deleteMessage`, `joinChannel`, `leaveChannel`, `createChannel`, `setGoal`, `invite` and `markThreadRead` update the store optimistically and roll back on error (`CLAUDE.md`, decided list).
- `sendMessage` (around line 652) mints a UUIDv7 `clientMsgId`, persists the entry to the outbox, and retries up to `MAX_SEND_ATTEMPTS` (6) with a 15 s `SEND_TIMEOUT_MS`; the outbox is flushed after reconnect.
- `store.ts` is the only state: `reduce(state, action)` (around line 578) is the one transition function, `envelopeToActions` (around line 1173) turns gateway events into actions, and `TankState` (line 99) holds every slice.
- Trap: a persisted store is a first paint, not a sync point; the first open of a channel in a session takes the newest page through `loadChannelTail` instead of paging "before" a stale row (`client.ts` around lines 531-536).
- Trap: `loadThread` asks from the first missing reply `threadSeq`, not from the newest reply held, or a gap stays forever (`client.ts` around lines 610-614).
- `realtime.ts` `RealtimeClient`: heartbeat every 25 s by default (`heartbeatMs`), reconnect with full-jitter backoff 250 ms to 30 s, and a skipped cursor is held for `gapBufferMs` before a Resume.
- Storage is string key/value through `TankStorage`: `MemoryStorage` (tests), `IndexedDbStorage` in `storage-idb.ts` (web); `storageKeys` in `storage.ts` names every key.
- `upload.ts` `putUpload` PUTs to the presigned URL with XHR progress and a fetch fallback that reports progress only at 0 and 1; failures throw `UploadError`.
- `uuidv7.ts` takes an injected `randomBytes`; tests pass a fixed source, production uses `cryptoRandomBytes`.
- Trust the `EventPayload` union in `store.ts`: an unrecognised event arrives as `{ $typeName: "unknown" }` and is not reduced until handled.
- Tests: `client.test.ts` (about 1,040 lines) and `realtime.test.ts` drive the client through `FakeGateway` in `src/test/fake-gateway.ts`.

## Verified
- none run in this refresh: `pnpm install --frozen-lockfile` could not reach the npm registry from the sandbox (ENETUNREACH), so lint, typecheck and tests were not run here; CI runs `pnpm check`.
