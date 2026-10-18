# Neurons · src/contracts

refreshed 2026-10-18 · d7c882a75bba

- Never hand-edit anything under `src/contracts/tank/`: it's wholesale-replaced (`rm -rf` + recopy) by `scripts/sync-contracts.sh <sha>`, so hand edits are silently destroyed on the next sync.
- `src/contracts/VERSION` is the sha-of-record for the vendored `contracts` repo, currently `88b93f57c9fd3d2e20e9e1fc4f81b5c513d01de6` (commit `d7c882a`, "Entitlements.addons").
- `src/contracts/index.ts` is the **only hand-maintained file** in this area — a namespaced barrel (`export * as <pkg> from "./tank/<pkg>/v1/<pkg>_pb.js"`) covering 14 packages (agent, auth, blocks, channel, events, files, huddle, message, notification, presence, realtime, richtext, search, workspace). The sync script never touches it.
- The sync script auto-generates one flat two-line shim per vendored package (`export * from "./tank/<pkg>/v1/<pkg>_pb.js"`), reachable only via the wildcard subpath `./contracts/*`. There are 26+ shims against the barrel's 14 — `admin`, `agentctl`, `billing`, `board`, `books`, `canvas`, `catalog`, `command`, `monitor`, `platform`, `remediation`, `security` and `topo` exist only as flat shims; `import { admin } from ".../sdk/contracts"` does not work, only `import * as admin from ".../sdk/contracts/admin"`.
- `TreadSettings` in `agent_pb.ts` gained a `model: string` field (11) in this refresh cycle: `""` lets TANK decide per run, `"tank-neural-1"` is TANK's own model, the Claude names route as-is. This field supersedes `strongest_model` (field 10, still present for older clients; setting `claude-opus-5` is what that bool meant).
- `Entitlements` in `workspace_pb.ts` gained `addons: string[]` (field 10): the list of add-ons the workspace has purchased ("shield", "books", "blueprint", "atlas"); a feature behind an unpurchased add-on shows an upgrade prompt and is refused server-side.
- `security` and `remediation` packages exist only as flat shims — they are not in the barrel in `src/contracts/index.ts` and are not consumed anywhere in `src/client` or `src/react` as of this refresh.
- `agentctl_pb.ts` holds the GitHub-repo-binding surface (`BindChannelRepoRequest/Response`, `UnbindChannelRepoRequest/Response`, `SetChannelRepoAccess*`, `CreateGitHubConnectState*`) and agent-settings surface (`SetChannelAgentSettings*`, `SetWorkspaceAgentPolicy*`) — none consumed by `src/client` yet.
- `@bufbuild/protobuf` v2 message types generated here *are* the store's message types — `src/client/store.ts` holds these shapes directly, there is no parallel hand-written DTO layer.
- `EventPayload` (`src/contracts` consumers) is a closed union of vendored `tank.events.v1` types plus a literal `{ $typeName: "unknown", typeUrl, value }` member; the literal discriminant is what keeps `switch (payload.$typeName)` exhaustive — widening that member to `{ $typeName: string }` would break narrowing.
- `biome.json` excludes `src/contracts/tank` entirely (generated code is not linted); the flat shims and `index.ts` are not excluded and are linted normally.
- After running `pnpm sync-contracts <sha>`, `pnpm build` and committing the regenerated `dist/` are still required before pushing — the sync script only touches `src/`.

## Verified

`pnpm lint`, `pnpm typecheck`
