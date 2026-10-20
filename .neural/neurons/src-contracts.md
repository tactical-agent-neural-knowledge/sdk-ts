# Neurons · src/contracts

refreshed 2026-10-20 · d78c6876be81

- Never hand-edit anything under `src/contracts/tank/`: it's wholesale-replaced (`rm -rf` + recopy) by `scripts/sync-contracts.sh <sha>`, so hand edits are silently destroyed on the next sync.
- `src/contracts/VERSION` is the sha-of-record for the vendored `contracts` repo, currently `c57381e3040f15892e457f0ee6a2597e64ed9cb7` (commit d78c687, "environment client; contracts c57381e (service tier, environments)").
- `src/contracts/index.ts` is the **only hand-maintained file** in this area — a namespaced barrel (`export * as <pkg> from "./tank/<pkg>/v1/<pkg>_pb.js"`) covering 14 packages (agent, auth, blocks, channel, events, files, huddle, message, notification, presence, realtime, richtext, search, workspace). The sync script never touches it.
- `environment` is **not in the barrel** (`src/contracts/index.ts`) — it exists only as a flat shim `src/contracts/environment.ts`, reachable via the wildcard subpath `import * as env from ".../sdk/contracts/environment"`. Same for `ai` and 15+ other packages.
- The sync script auto-generates one flat two-line shim per vendored package, reachable only via the wildcard subpath `./contracts/*`. 28+ shims now exist against the barrel's 14 — `admin`, `agentctl`, `ai`, `billing`, `board`, `books`, `canvas`, `catalog`, `command`, `environment`, `monitor`, `platform`, `remediation`, `security`, `topo` are shim-only.
- `EnvironmentService` (`src/contracts/tank/environment/v1/environment_pb.ts`) was added at this sync: `ListEnvironments`, `GetEnvironment`, `ListScores`, `ListObservations`, `ListPredictions`, `ListRounds`, `ListComments`, `PostComment`; readable without auth. Key types: `Environment` (subjects, products, scoring metadata), `Score` (one product's skill over a window), `Prediction`/`Observation`, `ArenaRound`/`ArenaRurn`.
- `AiService` (`src/contracts/tank/ai/v1/ai_pb.ts`) gained `GetUsage` at this sync: returns per-day `UsageDay` rows (messages, input/output tokens, cost_micro_usd), totals, and per-conversation `ConversationUsage`. `Settings` gained `available: bool` (false = model not yet serving, show countdown) and `launch_at: Timestamp`.
- `CatalogService`/`ProductCard` (`src/contracts/tank/catalog/v1/catalog_pb.ts`) gained `ProductTier` enum (UNSPECIFIED/TAKEOVER/SERVICE), and `ProductCard` gained `tier`, `subscribed`, `environment_slug`, and `score_line` fields; services are subscribed to (not taken over) and listed above TAKEOVER products.
- `AiService` conversation CRUD: `ListConversations`, `GetConversation`, `CreateConversation`, `UpdateConversation`, `DeleteConversation`, `RateMessage`, `GetSettings`, `UpdateSettings`, and the streaming `SendMessage` which emits `started` / `delta` / `done` / `title` event variants.
- `Conversation` shape: `id`, `title`, `createdAt`, `updatedAt`, `preview`, `pinned`. `Message` shape: `id`, `conversationId`, `role` (USER/ASSISTANT enum), `text`, `attachments`, `createdAt`, `stopReason`, `inputTokens`, `outputTokens`, `rating`.
- `BillingService` (`src/contracts/tank/billing/v1/billing_pb.ts`) includes `VerifyAppleTransaction` (mobile IAP receipt → subscription) and `SetAgentCap` (workspace agent spend cap).
- `TreadSettings` in `agent_pb.ts` carries `model: string` (field 11); `""` lets TANK decide, `"tank-neural-1"` is TANK's own model; the Claude names route as-is.
- `Entitlements` in `workspace_pb.ts` has `addons: string[]` (field 10): purchased add-ons ("shield", "books", "blueprint", "atlas"); an unpurchased add-on is refused server-side.
- `EventPayload` is a closed union of vendored `tank.events.v1` types plus a literal `{ $typeName: "unknown", typeUrl, value }` member; the literal discriminant is what keeps `switch (payload.$typeName)` exhaustive.
- `@bufbuild/protobuf` v2 message types generated here *are* the store's message types — `src/client/store.ts` holds these shapes directly, there is no parallel hand-written DTO layer.
- After running `pnpm sync-contracts <sha>`, `pnpm build` and committing the regenerated `dist/` are still required before pushing — the sync script only touches `src/`.

## Verified

`pnpm lint`, `pnpm typecheck`
