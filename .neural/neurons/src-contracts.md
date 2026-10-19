# Neurons · src/contracts

refreshed 2026-10-19 · a22dd59ccea3

- Never hand-edit anything under `src/contracts/tank/`: it's wholesale-replaced (`rm -rf` + recopy) by `scripts/sync-contracts.sh <sha>`, so hand edits are silently destroyed on the next sync.
- `src/contracts/VERSION` is the sha-of-record for the vendored `contracts` repo, currently `dc04457b73f958ccb26d163cdccf653fb755242d` (commit `a22dd59`, "ai: the chat client, and the contracts for it").
- `src/contracts/index.ts` is the **only hand-maintained file** in this area — a namespaced barrel (`export * as <pkg> from "./tank/<pkg>/v1/<pkg>_pb.js"`) covering 14 packages (agent, auth, blocks, channel, events, files, huddle, message, notification, presence, realtime, richtext, search, workspace). The sync script never touches it.
- `ai` is **not in the barrel** (`src/contracts/index.ts`) — it exists only as a flat shim `src/contracts/ai.ts`, reachable via the wildcard subpath `import * as ai from ".../sdk/contracts/ai"`. `import { ai } from ".../sdk/contracts"` does not work.
- The sync script auto-generates one flat two-line shim per vendored package (`export * from "./tank/<pkg>/v1/<pkg>_pb.js"`), reachable only via the wildcard subpath `./contracts/*`. 27+ shims exist against the barrel's 14 — `admin`, `agentctl`, `ai`, `billing`, `board`, `books`, `canvas`, `catalog`, `command`, `monitor`, `platform`, `remediation`, `security`, `topo` exist only as flat shims.
- `AiService` (`src/contracts/tank/ai/v1/ai_pb.ts`) is the chat-with-TANK's-own-model surface: `ListConversations`, `GetConversation`, `CreateConversation`, `UpdateConversation`, `DeleteConversation`, `RateMessage`, `GetSettings`, `UpdateSettings`, and the streaming `SendMessage` which emits `started` / `delta` / `done` / `title` event variants via a server-side stream.
- `Conversation` has `id`, `title`, `createdAt`, `updatedAt`, `preview` (first words for untitled list entries), and `pinned`; `Message` has `role` (enum: USER/ASSISTANT), `text`, `attachments`, `stopReason`, `inputTokens`, `outputTokens`, `rating`.
- `SendMessage` request accepts `conversationId`, `text`, `attachments`, `regenerateMessageId` (re-run from a given message), and `replaceMessageId`; on completion the stream emits a `done` variant carrying the full saved `Message`.
- `BillingService` (`src/contracts/tank/billing/v1/billing_pb.ts`) gained `VerifyAppleTransaction` (mobile IAP receipt → subscription) and `SetAgentCap` (workspace agent spend cap) in this sync.
- `TreadSettings` in `agent_pb.ts` carries a `model: string` field (11): `""` lets TANK decide, `"tank-neural-1"` is TANK's own model; the Claude names route as-is. `strongest_model` (field 10) still exists for older clients.
- `Entitlements` in `workspace_pb.ts` has `addons: string[]` (field 10): the list of purchased add-ons ("shield", "books", "blueprint", "atlas"); an unpurchased add-on shows an upgrade prompt and is refused server-side.
- `security` and `remediation` packages exist only as flat shims — not in the barrel and not consumed anywhere in `src/client` or `src/react`.
- `@bufbuild/protobuf` v2 message types generated here *are* the store's message types — `src/client/store.ts` holds these shapes directly, there is no parallel hand-written DTO layer.
- `EventPayload` is a closed union of vendored `tank.events.v1` types plus a literal `{ $typeName: "unknown", typeUrl, value }` member; the literal discriminant is what keeps `switch (payload.$typeName)` exhaustive — widening that member to `{ $typeName: string }` would break narrowing.
- `biome.json` excludes `src/contracts/tank` entirely (generated code is not linted); the flat shims and `index.ts` are not excluded and are linted normally.
- After running `pnpm sync-contracts <sha>`, `pnpm build` and committing the regenerated `dist/` are still required before pushing — the sync script only touches `src/`.

## Verified

`pnpm lint`, `pnpm typecheck`
