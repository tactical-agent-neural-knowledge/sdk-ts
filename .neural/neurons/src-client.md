# Neurons · src/client

refreshed 2026-10-31 · bf59edafde49

- `src/client/client.ts` exports `TankClient` (the main class) and `createTankClient` (factory). `TankClient` holds typed Connect clients for every service as named properties: `auth`, `workspaces`, `channels`, `chat`, `presence`, `files`, `agents`/`agent` (same `AgentService` client), `notifications`, `topo`, `monitor`, `command`, `billing`, `ai`, `environment`, `hosting`.
- `agentops`, `agentctl`, and `crew` contracts are vendored but no `CrewService`/`AgentOpsService`/`AgentCtlService` clients are wired into `TankClient` yet; they are in `src/contracts/tank/` only.
- `src/client/store.ts` is the single Redux-style reducer for all realtime state. Key `TankState` maps: `messages`, `channels`, `members`, `readStates` (channel-level, `ChannelReadState`), `threadReadStates` (thread-level, `bigint` per root id), `readPositions` (channel → user → seq), `threadReadPositions` (root → user → thread_seq), `notifications`, `runsById`, `runsByThread`, `agentStatusByThread`, `filesById`.
- `AGENT_STATUS_TTL_MS = 30_000` — `agentStatusByThread` entries older than this are pruned on an `agentStatus/expire` action; `TYPING_TTL_MS = 5_000` for the same pattern on `typing`.
- `EventPayload` is a discriminated union: `KnownEventPayload` (one case per `tank.events.v1` message type, `$typeName` is a string literal) | `UnknownEventPayload` (`$typeName: string`, `typeUrl`, `value`). Using an open `$typeName: string` member would break `switch` narrowing — the closed literal union is deliberate.
- `src/client/models.ts` exports `TANK_NEURAL = "tank-neural-1"`, `TANK_NEURAL_NEXT = "tank-neural-next"`, and `MODEL_CHOICES` (readonly array of `ModelChoice` with `id/label/note/relativeCost`). These are the only model ids the gateway accepts.
- `src/client/previewable.ts` exports `previewable(mime)`, `opensAsPage(mime)`, and `framesAsPage(mime)` — mirrors server logic for choosing "open" vs "download" before requesting the server; HTML/SVG/XML are intentionally excluded from `previewable` to prevent script execution on the files origin.
- `src/client/upload.ts` implements `putUpload`: calls `CreateUpload`, then PUT (XHR for progress, fetch fallback, multipart parts when returned), then `CompleteUpload`. XHR progress is via injected `XhrCtor`; `UploadError` is the typed failure class.
- `src/client/uuidv7.ts` exports `uuidv7()` (generates a sortable id using `randomBytes`), `uuidv7Time()`, `isUuidv7()`, `cryptoRandomBytes`, and the `RandomBytes` type. All outbox entries are keyed by UUIDv7 `client_msg_id`.
- Optimistic helpers (`updateMessage`, `deleteMessage`, `joinChannel`, `leaveChannel`, `createChannel`, `setGoal`, `invite`, `markThreadRead`) update the store immediately and roll back on error — apps never dispatch raw actions.
- `src/client/realtime.ts` exports `RealtimeClient`; its `onlineSignal` option is injectable (defaults to `browserOnlineSignal`) so React Native and tests can supply their own; `realtime.presenceSubscribe` is called via a ref-counted `PresenceRegistry` in the React provider.
- The `TankStorage` interface is string key/value: `IndexedDbStorage` on web, SQLite in mobile, `MemoryStorage` in tests; it persists cursors, the outbox, recent channel caches, and read states across sessions.

## Verified

`pnpm lint`, `pnpm typecheck`, `pnpm vitest run src/client/`
