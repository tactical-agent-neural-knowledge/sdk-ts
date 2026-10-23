# Neurons · src/client

refreshed 2026-10-23 · f3cdb0af2c34

- `createTankClient` (`src/client/client.ts`) is the single entry point; `client.start()` must run before any send/subscribe call — it opens the realtime socket, replays the outbox, and primes the store from `GetBootstrap` in that order.
- Optimistic helpers (`updateMessage`, `deleteMessage`, `joinChannel`, `leaveChannel`, `createChannel`, `setGoal`, `invite`, `markThreadRead`) are the only sanctioned way to mutate state — each applies to the store immediately and rolls back on RPC error, so apps must never dispatch a raw store action directly.
- **Send is fire-and-forget on storage**: `sendMessage` calls `void this.persistOutboxEntry(...)` and `void this.flushOne(...)` without awaiting — storage is for crash-recovery only, never a gate on send. Storage failures are swallowed with `.catch(() => undefined)`.
- **Send has a hard per-attempt timeout**: `SEND_TIMEOUT_MS = 15_000` (15 s); configurable via `TankClientOptions.sendTimeoutMs`. A timed-out `postMessage` yields `DeadlineExceeded`, which is in `RETRYABLE` so the message backs off and retries; the server deduplicates by `client_msg_id`.
- Send retries are narrow by design: only a fixed `RETRYABLE` status set is retried, capped at `MAX_SEND_ATTEMPTS = 6`, backed off per `backoff.ts` — anything else (e.g. validation errors) surfaces immediately instead of retrying into a wall.
- `store.ts` is the single state owner (~1500 lines, ~30 state keys, ~50-action reducer) covering messages, channels, threads, notifications, agent runs and files — web/mobile keep no side stores; selectors are memoized so re-render cost tracks subscriptions, not store size.
- `TankClient` exposes typed service clients for every backend service: `auth`, `workspaces`, `channels`, `chat`, `presence`, `files`, `agents`/`agent`, `notifications`, `topo`, `monitor`, `command`, `billing`, `ai`, `environment`, and now **`hosting`**.
- `client.hosting` (`HostingService`) surfaces the Infrastructure page: `GetProduct` (product state + logs + events for a Tread's hosted app) and `CheckProduct` (a `LiveCheck` of the running app's URL — status, screenshot_png, errors). Added commit f3cdb0a.
- `client.environment` (`EnvironmentService`) surfaces the arena grading system: `ListEnvironments`, `GetEnvironment`, `ListScores`, `ListObservations`, `ListPredictions`, `ListRounds`, `ListComments`, `PostComment` — readable signed out.
- `client.ai.sendMessage` is a **server-side streaming RPC** — the response is an `AsyncIterable<SendMessageResponse>` that emits `started`, `delta`, `done` and `title` event variants; callers must iterate to completion or cancel, not just await.
- `client.billing` includes `VerifyAppleTransaction` (mobile In-App Purchase receipt verification) and `SetAgentCap` (workspace agent spend cap).
- `paywall.ts` exports `paywallMessage(err)` and `isPaywall(err)` — the single place that recognises a `FailedPrecondition` with `"premium subscription"` text as an upsell; other `FailedPrecondition` errors (archived Tread, deleted thread) must not open an upgrade prompt.
- Timeline trap: `inChannelTimeline` filters by channel *and* excludes thread-only replies — a message that looks "in the channel" in the data can still be absent from the rendered timeline if it's a thread reply.
- Unread-count trap: the server's count always wins over any local recomputation on reconnect; client-side increment/decrement is a display optimization only, never the source of truth.
- Thread read state lives in `threadReadStates`, counted separately from channel unreads — `markThreadRead` touches only that map.
- `realtime.ts` holds the cursor/gap-buffer/Resume reconnection logic; `reopen(code)` is the one path back in after a drop, gated by a heartbeat-death threshold before it gives up and surfaces offline.
- `models.ts` exports `MODEL_CHOICES` (six entries: "", `tank-neural-1`, `tank-neural-next`, `claude-sonnet-5`, `claude-opus-5`, `claude-haiku-4-5`), `TANK_NEURAL = "tank-neural-1"`, `TANK_NEURAL_NEXT = "tank-neural-next"`, and `modelLabel(id)` — these are the names the gateway accepts on `TreadSettings.model`; a name not in this list is refused at save.
- `upload.ts`'s `uploadFile` runs CreateUpload → PUT (XHR for progress, fetch fallback, multipart parts when the server returns them) → CompleteUpload; skipping CompleteUpload leaves an orphaned pending upload server-side.
- `uuidv7.ts` generates `client_msg_id` via `crypto.getRandomValues` by default but accepts an injected `randomBytes`, which is what makes outbox ordering deterministic in tests.

## Verified

`pnpm lint`, `pnpm typecheck`, `pnpm vitest run src/client`
