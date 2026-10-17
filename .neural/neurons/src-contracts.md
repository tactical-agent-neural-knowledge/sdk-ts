# Neurons · src/contracts

refreshed 2026-10-08 · 83a77f18cf88

- Never hand-edit anything under `src/contracts/tank/`: it's wholesale-replaced (`rm -rf` + recopy) by `scripts/sync-contracts.sh <sha>`, so hand edits are silently destroyed on the next sync.
- `src/contracts/VERSION` is the sha-of-record for the vendored `contracts` repo, currently `e52a377a71d9116560dab77ea76365959835a082` (commit `83a77f1`, "EndMemberSessions").
- `src/contracts/index.ts` is the **only hand-maintained file** in this area — a namespaced barrel (`export * as <pkg> from "./tank/<pkg>/v1/<pkg>_pb.js"`) covering 14 packages (agent, auth, blocks, channel, events, files, huddle, message, notification, presence, realtime, richtext, search, workspace). The sync script never touches it.
- The sync script auto-generates one flat two-line shim per vendored package (`export * from "./tank/<pkg>/v1/<pkg>_pb.js"`), reachable only via the wildcard subpath `./contracts/*`. There are 26 shims against the barrel's 14 — `admin`, `agentctl`, `billing`, `board`, `books`, `canvas`, `catalog`, `command`, `monitor`, `platform`, `remediation`, `security` and `topo` exist only as flat shims; `import { admin } from ".../sdk/contracts"` does not work, only `import * as admin from ".../sdk/contracts/admin"`.
- This sync vendored two brand-new packages with no barrel entry yet: `security` (`Posture`, `Control`, `Finding`, `Evidence`, `Attestation`, `FrameworkCoverage`, `ControlState`/`ControlCategory`/`CheckKind` enums, `GetPosture`/`GetControl`/`ListFrameworks`/`GetFrameworkCoverage`/`Evaluate` RPCs) and `remediation` (`Remediation`, `Finding`, `Class`, `Target`, `Disposition`/`RemediationState` enums, `SubmitFinding`/`GetRemediation`/`ListRemediations`/`ListClasses`/`CancelRemediation` RPCs) — a compliance/security-posture surface, unused anywhere in `src/client` or `src/react` as of this refresh.
- `agentctl_pb.ts` gained a GitHub-repo-binding surface in the same sync: `BindChannelRepoRequest/Response`, `UnbindChannelRepoRequest/Response`, `RepoAccessEntry` + `SetChannelRepoAccessRequest/Response`, `CreateGitHubConnectStateRequest/Response`, plus `SetChannelAgentSettingsRequest/Response` and `SetWorkspaceAgentPolicyRequest/Response` — none consumed by `src/client` yet either.
- `admin_pb.ts` gained `EndMemberSessionsRequest`/`EndMemberSessionsResponse` (the commit this sync is named for).
- `books_pb.ts`'s only change is a new `rotate: boolean` field (3) on `GetInvoiceRequest`: setting it mints a new invoice share link and invalidates the old one in the same call; the share token is stored as a hash so no response ever echoes `share_url` back out after creation.
- `@bufbuild/protobuf` v2 message types generated here *are* the store's message types — `src/client/store.ts` holds these shapes directly, there is no parallel hand-written DTO layer.
- `EventPayload` (`src/contracts` consumers) is a closed union of vendored `tank.events.v1` types plus a literal `{ $typeName: "unknown", typeUrl, value }` member; the literal discriminant is what keeps `switch (payload.$typeName)` exhaustive — widening that member to `{ $typeName: string }` would break narrowing.
- `biome.json` excludes `src/contracts/tank` entirely (generated code is not linted); the flat shims and `index.ts` are not excluded and are linted normally.
- After running `pnpm sync-contracts <sha>`, `pnpm build` and committing the regenerated `dist/` are still required before pushing — the sync script only touches `src/`.

## Verified

`pnpm lint`, `pnpm typecheck`
