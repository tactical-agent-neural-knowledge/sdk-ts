# Neurons · src/client

refreshed 2026-10-19 · a22dd59ccea3

- `createTankClient` (`src/client/client.ts`) is the single entry point; `client.start()` must run before any send/subscribe call — it opens the realtime socket, replays the outbox, and primes the store from `GetBootstrap` in that order.
- Optimistic helpers (`updateMessage`, `deleteMessage`, `joinChannel`, `leaveChannel`, `createChannel`, `setGoal`, `invite`, `markThreadRead`) are the only sanctioned way to mutate state — each applies to the store immediately and rolls back on RPC error, so apps must never dispatch a raw store action directly.
- Send retries are narrow by design: only a fixed `RETRYABLE` status set is retried, capped at `MAX_SEND_ATTEMPTS = 6`, backed off per `backoff.ts` — anything else (e.g. validation errors) surfaces immediately instead of retrying into a wall.
- `store.ts` is the single state owner (~1500 lines, ~30 state keys, ~50-action reducer) covering messages, channels, threads, notifications, agent runs and files — web/mobile keep no side stores; selectors are memoized so re-render cost tracks subscriptions, not store size.
- `TankClient` now exposes two new typed service clients: `client.billing` (`BillingService` — subscriptions, checkouts, portal, App Store verification) and `client.ai` (`AiService` — the `/ai` chat with TANK's own model: conversation CRUD, streamed `SendMessage`, `RateMessage`, `GetSettings`/`UpdateSettings`).
- `client.ai.sendMessage` is a **server-side streaming RPC** — the response is an `AsyncIterable<SendMessageResponse>` that emits `started`, `delta`, `done` and `title` event variants; callers must iterate to completion or cancel, not just await.
- `client.billing` gained `VerifyAppleTransaction` (mobile In-App Purchase receipt verification) and `SetAgentCap` since the previous refresh; these join the existing subscription and portal RPCs.
- Timeline trap: `inChannelTimeline` filters by channel *and* excludes thread-only replies — a message that looks "in the channel" in the data can still be absent from the rendered timeline if it's a thread reply.
- Unread-count trap: the server's count always wins over any local recomputation on reconnect; client-side increment/decrement is a display optimization only, never the source of truth.
- Thread read state lives in `threadReadStates`, counted separately from channel unreads — `markThreadRead` touches only that map.
- `realtime.ts` holds the cursor/gap-buffer/Resume reconnection logic; `reopen(code)` is the one path back in after a drop, gated by a heartbeat-death threshold before it gives up and surfaces offline.
- The "back online" signal is injectable (`realtime.onlineSignal`) specifically so tests can simulate reconnect without a real network transition.
- `transport.ts` supports two credential modes — cookie and bearer — selected at construction; mixing modes mid-session is not supported.
- `TankStorage` is string key/value only; three implementations exist (IndexedDB web, SQLite mobile, memory in tests) behind the same interface, keyed with a namespace prefix to avoid collisions across workspaces.
- `uuidv7.ts` generates `client_msg_id` via `crypto.getRandomValues` by default but accepts an injected `randomBytes`, which is what makes outbox ordering deterministic in tests.
- `upload.ts`'s `uploadFile` runs CreateUpload → PUT (XHR for progress, fetch fallback, multipart parts when the server returns them) → CompleteUpload; skipping CompleteUpload leaves an orphaned pending upload server-side.
- `models.ts` exports `MODEL_CHOICES` (six entries: "", `tank-neural-1`, `tank-neural-next`, `claude-sonnet-5`, `claude-opus-5`, `claude-haiku-4-5`), `TANK_NEURAL = "tank-neural-1"`, `TANK_NEURAL_NEXT = "tank-neural-next"`, and `modelLabel(id)` — these are the names the gateway accepts on `TreadSettings.model`; a name not in this list is refused at save.

## Verified

`pnpm lint`, `pnpm typecheck`, `pnpm vitest run src/client`
