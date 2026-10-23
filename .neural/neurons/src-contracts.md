# Neurons · src/contracts

refreshed 2026-10-23 · 516e642632b1

- Never hand-edit anything under `src/contracts/tank/`: it's wholesale-replaced (`rm -rf` + recopy) by `scripts/sync-contracts.sh <sha>`, so hand edits are silently destroyed on the next sync.
- `src/contracts/VERSION` is the sha-of-record for the vendored `contracts` repo, currently `b8fae6898e5839c1c8882fcdb47bfbc616db3a5d` (commit 516e642, "the change loop").
- `src/contracts/index.ts` is the **only hand-maintained file** in this area — a namespaced barrel (`export * as <pkg> from "./tank/<pkg>/v1/<pkg>_pb.js"`) covering 14 packages (agent, auth, blocks, channel, events, files, huddle, message, notification, presence, realtime, richtext, search, workspace). The sync script never touches it.
- `environment`, `board`, `agentctl` and 18+ other packages are **not in the barrel** — they exist only as flat two-line shims (e.g. `src/contracts/board.ts`), reachable only via the wildcard subpath `import * from ".../sdk/contracts/board"`. 32 shim files exist against the barrel's 14 packages.
- `BoardService` (`src/contracts/tank/board/v1/board_pb.ts`) has its full CRUD suite plus remote-viewing RPCs (`CreateRemoteView`, `ListRemoteViews`, `StopRemoteViews`) and, as of contracts b8fae68 ("the change loop"), four new RPCs: `ReadElement`, `GetAppSetup`, `ConnectApp`, `ApproveChange`.
- `AppSetup` (board) carries configuration for connecting an external app to a board object; `ConnectApp` persists the connection; `ApproveChange` gates a pending change from the agent's change loop.
- `ControlService` (`src/contracts/tank/agentctl/v1/agentctl_pb.ts`) gained three RPCs at contracts b8fae68: `OpenSetupPullRequest` (open a GitHub PR for the setup workflow), `ReadElementAt` (read a board element's source at a specific path or revision), `MergeChange` (merge a ready change into the repo — the final step of the change loop).
- The change loop flow: `ReadElementAt` (read the current source) → agent edits code → `MergeChange` (ControlService, push/merge) + `ApproveChange` (BoardService, unblock the board-side gate).
- `AgentCtlService` (`src/contracts/tank/agentctl/v1/agentctl_pb.ts`) gained `BuildPreview` at contracts a876f5f: `BuildPreviewRequest`/`BuildPreviewResponse` for triggering a preview build inside an agent run.
- `EnvironmentService` (`src/contracts/tank/environment/v1/environment_pb.ts`) surfaces the arena grading system: `ListEnvironments`, `GetEnvironment`, `ListScores`, `ListObservations`, `ListPredictions`, `ListRounds`, `ListComments`, `PostComment`; readable without auth.
- `AiService` (`src/contracts/tank/ai/v1/ai_pb.ts`) conversation CRUD plus a streaming `SendMessage` emitting `started` / `delta` / `done` / `title` event variants.
- `BillingService` (`src/contracts/tank/billing/v1/billing_pb.ts`) includes `VerifyAppleTransaction` (mobile IAP receipt → subscription) and `SetAgentCap` (workspace agent spend cap).
- `TreadSettings` in `agent_pb.ts` carries `model: string` (field 11); `""` lets TANK decide, `"tank-neural-1"` is TANK's own model; the Claude names route as-is.
- `Entitlements` in `workspace_pb.ts` has `addons: string[]` (field 10): purchased add-ons ("shield", "books", "blueprint", "atlas"); an unpurchased add-on is refused server-side.
- `EventPayload` is a closed union of vendored `tank.events.v1` types plus a literal `{ $typeName: "unknown", typeUrl, value }` member; the literal discriminant is what keeps `switch (payload.$typeName)` exhaustive.
- `@bufbuild/protobuf` v2 message types generated here *are* the store's message types — `src/client/store.ts` holds these shapes directly, there is no parallel hand-written DTO layer.
- After running `pnpm sync-contracts <sha>`, `pnpm build` and committing the regenerated `dist/` are still required before pushing — the sync script only touches `src/`.

## Verified

`pnpm lint`, `pnpm typecheck`
