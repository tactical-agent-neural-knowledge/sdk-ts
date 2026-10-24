# Neurons · src/contracts

refreshed 2026-10-24 · 178b798fa808

- Never hand-edit anything under `src/contracts/tank/`: it's wholesale-replaced (`rm -rf` + recopy) by `scripts/sync-contracts.sh <sha>`, so hand edits are silently destroyed on the next sync.
- `src/contracts/VERSION` is the sha-of-record for the vendored `contracts` repo, currently `e71dfe1d8dbe23b748128e2d086d7398be53ea7f` (commit 178b798, "hosting settings: preview, apply, buy any tank.yaml change").
- `src/contracts/index.ts` is the **only hand-maintained file** in this area — a namespaced barrel (`export * as <pkg> from "./tank/<pkg>/v1/<pkg>_pb.js"`) covering 14 packages (agent, auth, blocks, channel, events, files, huddle, message, notification, presence, realtime, richtext, search, workspace). The sync script never touches it.
- `environment`, `board`, `agentctl`, `hosting`, and 18+ other packages are **not in the barrel** — they exist only as flat two-line shims (e.g. `src/contracts/hosting.ts`), reachable only via the wildcard subpath `import * from ".../sdk/contracts/hosting"`. Over 32 shim files exist against the barrel's 14 packages.
- `HostingService` (`src/contracts/tank/hosting/v1/hosting_pb.ts`) now has a full management surface: `GetProduct`, `CheckProduct`, `GetResources`, `ApproveBuildn`, `Operate`, `ListChanges`, `Rollback`, `UpdateResource`, `SetCap`, `ListHosting`, `SetAllowance`, `ExportProduct`, `SetSecret`, `PreviewChange`, `ApplyChange`, `GetSpecText`.
- `PreviewChange` accepts either a `ResourceChange` message or a raw text edit, returns before/after `Cost`, a list of problems, and `can_apply`; `ApplyChange` takes the same input plus `accepted_total_cents` and returns `commit_sha` + `live` flag. These implement the "buy any tank.yaml change" workflow.
- `GetSpecText`/`GetSpecTextResponse` expose the raw tank.yaml text and a `can_edit` flag; together with `ApplyChange(text:)` they let agents or users edit the spec directly.
- `HostedProduct` and `ListHosting`/`SetAllowance` enable workspace-level hosting management: list all hosted products, their costs, and set a workspace-wide allowance cap.
- `SetSecret` adds/replaces an environment secret on a hosted product by name+value; the value is write-only — the server never returns it; `GetResources` lists only which secret names are set.
- `BoardService` (`src/contracts/tank/board/v1/board_pb.ts`) has its full CRUD suite plus remote-viewing RPCs and change-loop RPCs (`ReadElement`, `GetAppSetup`, `ConnectApp`, `ApproveChange`).
- `ControlService` (`src/contracts/tank/agentctl/v1/agentctl_pb.ts`) has `OpenSetupPullRequest`, `ReadElementAt`, `MergeChange`, and `BuildPreview`.
- `EnvironmentService` (`src/contracts/tank/environment/v1/environment_pb.ts`) surfaces the arena grading system: `ListEnvironments`, `GetEnvironment`, `ListScores`, `ListObservations`, `ListPredictions`, `ListRounds`, `ListComments`, `PostComment`; readable without auth.
- `AiService` (`src/contracts/tank/ai/v1/ai_pb.ts`) conversation CRUD plus a streaming `SendMessage` emitting `started` / `delta` / `done` / `title` event variants.
- `TreadSettings` in `agent_pb.ts` carries `model: string` (field 11); `""` lets TANK decide, `"tank-neural-1"` is TANK's own model; the Claude names route as-is.
- `Entitlements` in `workspace_pb.ts` has `addons: string[]` (field 10): purchased add-ons ("shield", "books", "blueprint", "atlas"); an unpurchased add-on is refused server-side.
- `EventPayload` is a closed union of vendored `tank.events.v1` types plus a literal `{ $typeName: "unknown", typeUrl, value }` member; the literal discriminant is what keeps `switch (payload.$typeName)` exhaustive.
- `@bufbuild/protobuf` v2 message types generated here *are* the store's message types — `src/client/store.ts` holds these shapes directly, there is no parallel hand-written DTO layer.
- After running `pnpm sync-contracts <sha>`, `pnpm build` and committing the regenerated `dist/` are still required before pushing — the sync script only touches `src/`.

## Verified

`pnpm lint`, `pnpm typecheck`
