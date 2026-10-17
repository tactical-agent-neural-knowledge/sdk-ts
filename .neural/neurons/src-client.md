# Neurons · src/client
refreshed 2026-10-17 · 6b360350cf49

- `TankClient` (`client.ts`) is the main entry point; instantiate with `createTankClient(opts)`. Options include `baseUrl`, `wsUrl`, `auth`, `storage`, `WebSocket`, `XMLHttpRequest`, `interceptors`, `transport`, `actAsUserId`, `realtime`, `randomBytes`.
- `TankStore` (`store.ts`) holds `TankState`, dispatches `Action` objects to `reduce()`, and notifies listeners synchronously. `useSyncExternalStore`-compatible: `subscribe` + `getState`.
- `TankState` fields: `me`, `workspaces`, `members`, `channels`, `channelOrder`, `messages`, `messageIdsByChannel`, `threadIds`, `channelPaging`, `readStates`, `threadReadStates`, `readPositions`, `threadReadPositions`, `presence`, `typing`, `agentStatus`, `agentStatusByThread`, `pending`, `connection`, `cursors`, `notifications`, `notificationIds`, `unreadNotificationCount`, `entitlements`, `notificationPaging`, `runsById`, `runsByThread`, `filesById`.
- `loadChannel(channelId, opts)` pages messages; on first open of a channel in a session it fetches the tail (newest page) to close any gap from offline time — a channel page that never resolves no longer holds the Tread blank (fixed 6b36035).
- `getDownloadUrl(fileId, { inline? })` returns a pre-signed URL, memoized 10 min; `inline: true` asks for a browser-display URL (server grants it only for previewable types); the two kinds are memoized separately.
- `previewable(mime)` (`previewable.ts`) — client-side mirror of the server's list; PDF/JSON/text/image/video/audio/Office docs return true; HTML/SVG/XML return false (unsafe to render inline).
- `TankStore.selectUnreads(workspaceId)` returns `Unreads` with `total`, `mentions`, `byChannel`, `threads`, `byThread`; `selectThread(rootId)` returns `ThreadView { root, replies }`.
- `agentStatus` and `agentStatusByThread` both track live agent status frames; `AGENT_STATUS_TTL_MS = 30_000` ms expiry; the `agentStatus/expire` action prunes stale entries from both.
- `messages/resetChannel` action replaces a channel's timeline with a fresh server page while keeping optimistic rows and not touching the `messages` map (so threads still in view are unaffected).
- `upload.ts` — `putUpload` does HTTP PUT with XHR for byte-level progress in browsers/React Native, `fetch` fallback in Node. `UploadError` carries the HTTP status. `NativeFileInput` is `{ uri, name, mime, size }`.
- `uuidv7.ts` generates `client_msg_id`; `cryptoRandomBytes` is the default (or pass `randomBytes` from `expo-crypto`). `isUuidv7` validates format; `uuidv7Time` extracts the timestamp.

## Verified
pnpm vitest run src/client
