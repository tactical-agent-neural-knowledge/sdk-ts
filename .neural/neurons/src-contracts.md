# Neurons · src/contracts

refreshed 2026-10-23 · f3cdb0af2c34

- Never hand-edit anything under `src/contracts/tank/`: it's wholesale-replaced (`rm -rf` + recopy) by `scripts/sync-contracts.sh <sha>`, so hand edits are silently destroyed on the next sync.
- `src/contracts/VERSION` is the sha-of-record for the vendored `contracts` repo, currently `f233da6cd976ad87383bdd3118a7c643f76790ee` (commit f3cdb0a, "hosting: the Infrastructure page's client").
- `src/contracts/index.ts` is the **only hand-maintained file** in this area — a namespaced barrel (`export * as <pkg> from "./tank/<pkg>/v1/<pkg>_pb.js"`) covering 14 packages (agent, auth, blocks, channel, events, files, huddle, message, notification, presence, realtime, richtext, search, workspace). The sync script never touches it.
- `environment`, `board`, `agentctl`, `hosting` and 18+ other packages are **not in the barrel** — they exist only as flat two-line shims (e.g. `src/contracts/hosting.ts`), reachable only via the wildcard subpath `import * from ".../sdk/contracts/hosting"`. 33 shim files now exist against the barrel's 14 packages.
- `HostingService` (`src/contracts/tank/hosting/v1/hosting_pb.ts`) was added at contracts f233da6 with two RPCs: `GetProduct` (returns a `Product` + logs + `ProductEvent[]` for a Tread's hosted app) and `CheckProduct` (returns a `LiveCheck` with status code, screenshot_png, errors, build_sha).
- `Product` (hosting) carries: slug, repo (owner/name), url, awake, status, image_tag, restarts, last_exit_reason, started_at, cpu_limit, memory_limit, disk_bytes, can_manage, managed, updated_at.
- `AgentCtlService` (`src/contracts/tank/agentctl/v1/agentctl_pb.ts`) gained five new RPCs at contracts f233da6: `ReportCompletion` (agent signals its run is done), `CheckLive` (check a live URL), `ReadProduct` (read the hosted product's state from inside an agent run), `GetProductState` (full product state), `CheckProductPage` (check one page of the live product).
- `BoardService` (`src/contracts/tank/board/v1/board_pb.ts`) has its full CRUD suite plus remote-viewing RPCs and, as of contracts b8fae68, four change-loop RPCs: `ReadElement`, `GetAppSetup`, `ConnectApp`, `ApproveChange`.
- `ControlService` (`src/contracts/tank/agentctl/v1/agentctl_pb.ts`) gained three RPCs at contracts b8fae68: `OpenSetupPullRequest`, `ReadElementAt`, `MergeChange` (the final step of the change loop).
- The change loop flow: `ReadElementAt` (read the current source) → agent edits code → `MergeChange` (ControlService, push/merge) + `ApproveChange` (BoardService, unblock the board-side gate).
- `AgentCtlService` gained `BuildPreview` at contracts a876f5f: triggers a preview build inside an agent run.
- `EnvironmentService` surfaces the arena grading system: `ListEnvironments`, `GetEnvironment`, `ListScores`, `ListObservations`, `ListPredictions`, `ListRounds`, `ListComments`, `PostComment`; readable without auth.
- `AiService` conversation CRUD plus a streaming `SendMessage` emitting `started` / `delta` / `done` / `title` event variants.
- `BillingService` includes `VerifyAppleTransaction` (mobile IAP receipt → subscription) and `SetAgentCap` (workspace agent spend cap).
- `TreadSettings` in `agent_pb.ts` carries `model: string` (field 11); `""` lets TANK decide, `"tank-neural-1"` is TANK's own model; the Claude names route as-is.
- `Entitlements` in `workspace_pb.ts` has `addons: string[]` (field 10): purchased add-ons ("shield", "books", "blueprint", "atlas"); an unpurchased add-on is refused server-side.
- `EventPayload` is a closed union of vendored `tank.events.v1` types plus a literal `{ $typeName: "unknown", typeUrl, value }` member; the literal discriminant is what keeps `switch (payload.$typeName)` exhaustive.
- `@bufbuild/protobuf` v2 message types generated here *are* the store's message types — `src/client/store.ts` holds these shapes directly, there is no parallel hand-written DTO layer.
- After running `pnpm sync-contracts <sha>`, `pnpm build` and committing the regenerated `dist/` are still required before pushing — the sync script only touches `src/`.

## Verified

`pnpm lint`, `pnpm typecheck`
