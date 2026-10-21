# Neurons · src/contracts

refreshed 2026-10-21 · e42fdf15b240

- Never hand-edit anything under `src/contracts/tank/`: it's wholesale-replaced (`rm -rf` + recopy) by `scripts/sync-contracts.sh <sha>`, so hand edits are silently destroyed on the next sync.
- `src/contracts/VERSION` is the sha-of-record for the vendored `contracts` repo, currently `a876f5fe4560c348558410a655262bc45c40323c` (commit e42fdf1, "Remote viewing").
- `src/contracts/index.ts` is the **only hand-maintained file** in this area — a namespaced barrel (`export * as <pkg> from "./tank/<pkg>/v1/<pkg>_pb.js"`) covering 14 packages (agent, auth, blocks, channel, events, files, huddle, message, notification, presence, realtime, richtext, search, workspace). The sync script never touches it.
- `environment` is **not in the barrel** (`src/contracts/index.ts`) — it exists only as a flat shim `src/contracts/environment.ts`, reachable via the wildcard subpath `import * as env from ".../sdk/contracts/environment"`. Same for `ai`, `board`, `agentctl` and 15+ other packages.
- The sync script auto-generates one flat two-line shim per vendored package, reachable only via the wildcard subpath `./contracts/*`. 28+ shims exist against the barrel's 14 — `admin`, `agentctl`, `ai`, `billing`, `board`, `books`, `canvas`, `catalog`, `command`, `environment`, `monitor`, `platform`, `remediation`, `security`, `topo` are shim-only.
- `BoardService` (`src/contracts/tank/board/v1/board_pb.ts`) gained three remote-viewing RPCs at contracts a876f5f: `CreateRemoteView`, `ListRemoteViews`, `StopRemoteViews`; `RemoteView` message carries the view token, expiry and board/object references.
- `AgentCtlService` (`src/contracts/tank/agentctl/v1/agentctl_pb.ts`) gained `BuildPreview` at contracts a876f5f: `BuildPreviewRequest`/`BuildPreviewResponse` for triggering a preview build inside an agent run.
- `EnvironmentService` (`src/contracts/tank/environment/v1/environment_pb.ts`) surfaces the arena grading system: `ListEnvironments`, `GetEnvironment`, `ListScores`, `ListObservations`, `ListPredictions`, `ListRounds`, `ListComments`, `PostComment`; readable without auth. Key types: `Environment` (subjects, products, scoring metadata), `Score`, `Prediction`/`Observation`, `ArenaRound`.
- `AiService` (`src/contracts/tank/ai/v1/ai_pb.ts`) conversation CRUD: `ListConversations`, `GetConversation`, `CreateConversation`, `UpdateConversation`, `DeleteConversation`, `RateMessage`, `GetSettings`, `UpdateSettings`, and the streaming `SendMessage` which emits `started` / `delta` / `done` / `title` event variants.
- `BillingService` (`src/contracts/tank/billing/v1/billing_pb.ts`) includes `VerifyAppleTransaction` (mobile IAP receipt → subscription) and `SetAgentCap` (workspace agent spend cap).
- `TreadSettings` in `agent_pb.ts` carries `model: string` (field 11); `""` lets TANK decide, `"tank-neural-1"` is TANK's own model; the Claude names route as-is.
- `Entitlements` in `workspace_pb.ts` has `addons: string[]` (field 10): purchased add-ons ("shield", "books", "blueprint", "atlas"); an unpurchased add-on is refused server-side.
- `EventPayload` is a closed union of vendored `tank.events.v1` types plus a literal `{ $typeName: "unknown", typeUrl, value }` member; the literal discriminant is what keeps `switch (payload.$typeName)` exhaustive.
- `@bufbuild/protobuf` v2 message types generated here *are* the store's message types — `src/client/store.ts` holds these shapes directly, there is no parallel hand-written DTO layer.
- After running `pnpm sync-contracts <sha>`, `pnpm build` and committing the regenerated `dist/` are still required before pushing — the sync script only touches `src/`.

## Verified

`pnpm lint`, `pnpm typecheck`
