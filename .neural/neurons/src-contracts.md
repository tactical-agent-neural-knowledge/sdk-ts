# Neurons · src/contracts

refreshed 2026-10-21 · 9a5847392f7a

- Never hand-edit anything under `src/contracts/tank/`: it's wholesale-replaced (`rm -rf` + recopy) by `scripts/sync-contracts.sh <sha>`, so hand edits are silently destroyed on the next sync.
- `src/contracts/VERSION` is the sha-of-record for the vendored `contracts` repo, currently `875e5a4f351ac0216157239ddb16afe7b094172b` (three syncs since last neural refresh, ending commit 54d0a87).
- `src/contracts/index.ts` is the **only hand-maintained file** in this area — a namespaced barrel (`export * as <pkg> from "./tank/<pkg>/v1/<pkg>_pb.js"`) covering 14 packages (agent, auth, blocks, channel, events, files, huddle, message, notification, presence, realtime, richtext, search, workspace). The sync script never touches it.
- `environment` is **not in the barrel** (`src/contracts/index.ts`) — it exists only as a flat shim `src/contracts/environment.ts`, reachable via the wildcard subpath `import * as env from ".../sdk/contracts/environment"`. Same for `ai`, `billing`, `board`, and 15+ other packages.
- The sync script auto-generates one flat two-line shim per vendored package, reachable only via the wildcard subpath `./contracts/*`. 28+ shims now exist against the barrel's 14 — `admin`, `agentctl`, `ai`, `billing`, `board`, `books`, `canvas`, `catalog`, `command`, `environment`, `monitor`, `platform`, `remediation`, `security`, `topo` are shim-only.
- **`board_pb.ts` (sync 875e5a4):** Added `CodeFrame` (a card element pointing at a file or file range within a granted repository), `RepoEnvironment` (links a board/repo to a grading environment) with full CRUD: `ListRepoEnvironments`, `SetRepoEnvironment`, `VerifyRepoEnvironment`, `DeleteRepoEnvironment`, and `RepoRoute`/`ListRepoRoutes` (the HTTP routes exposed by a repo's live environment).
- **`agentctl_pb.ts` (syncs 875e5a4 and 80329c2):** Added `ArenaTurn` RPC on `ControlService` — writes one turn of a service's public arena conversation using TANK's own model; also added `ReadRepo` RPC for reading a repository via the control plane.
- **`billing_pb.ts` (sync 80329c2):** Added `ServiceSubscription` type (`id`, `workspaceId`, `productId`, `subscribedAt`, `cancelledAt`) and `ListServiceSubscriptions` RPC on `BillingService` — lists which services a workspace has subscribed to (distinct from TAKEOVER products which are purchased).
- **`workspace_pb.ts` (sync a89b371):** `AgentureDetail` gained `service` boolean field (true = the product is a subscribed service, not a takeover) and `environment_slug` string field (names the environment in which a service product is graded); `price_cents` is 0 and `available` is false for service-type agentures.
- `EnvironmentService` (`src/contracts/tank/environment/v1/environment_pb.ts`): `ListEnvironments`, `GetEnvironment`, `ListScores`, `ListObservations`, `ListPredictions`, `ListRounds`, `ListComments`, `PostComment`; readable without auth. Key types: `Environment` (subjects, products, scoring metadata), `Score`, `Prediction`/`Observation`, `ArenaRound`/`ArenaTurn`.
- `AiService` conversation CRUD: `ListConversations`, `GetConversation`, `CreateConversation`, `UpdateConversation`, `DeleteConversation`, `RateMessage`, `GetSettings`, `UpdateSettings`, and the streaming `SendMessage` which emits `started` / `delta` / `done` / `title` event variants.
- `CatalogService`/`ProductCard` (`catalog_pb.ts`) has `ProductTier` enum (UNSPECIFIED/TAKEOVER/SERVICE); `ProductCard` carries `tier`, `subscribed`, `environment_slug`, and `score_line` — services are subscribed to (not taken over) and listed above TAKEOVER products.
- `TreadSettings` in `agent_pb.ts` carries `model: string` (field 11); `""` lets TANK decide, `"tank-neural-1"` is TANK's own model; the Claude names route as-is.
- `Entitlements` in `workspace_pb.ts` has `addons: string[]` (field 10): purchased add-ons ("shield", "books", "blueprint", "atlas"); an unpurchased add-on is refused server-side.
- `EventPayload` is a closed union of vendored `tank.events.v1` types plus a literal `{ $typeName: "unknown", typeUrl, value }` member; the literal discriminant is what keeps `switch (payload.$typeName)` exhaustive.
- `@bufbuild/protobuf` v2 message types generated here *are* the store's message types — `src/client/store.ts` holds these shapes directly, there is no parallel hand-written DTO layer.
- After running `pnpm sync-contracts <sha>`, `pnpm build` and committing the regenerated `dist/` are still required before pushing — the sync script only touches `src/`.

## Verified

`pnpm lint`, `pnpm typecheck`
