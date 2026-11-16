# Neurons · src/contracts

refreshed 2026-11-16 · ad2838acc55d

- `src/contracts/tank/**` (84 files) is vendored generated code from the contracts repo at the sha in `src/contracts/VERSION`; never edit it, and rerun `pnpm sync-contracts <sha>` instead.
- `scripts/sync-contracts.sh` fails with "run 'make gen' in contracts first" when `gen/ts/src/tank` is missing at the sha; that is a contracts-repo problem, not a local one.
- `src/contracts/index.ts` is the hand-maintained namespaced barrel: `export * as presence from ...`, one line per package, 17 packages today; same-named messages (for example `SetStatusRequest` in presence and agent) are reached only through their namespace.
- The barrel is a subset: `client.ts` imports `ai`, `billing`, `command`, `environment`, `hosting` and `monitor` straight from `tank/<pkg>/v1/*_pb.js`; add a barrel line when a new package needs a namespace.
- The flat shims `src/contracts/<pkg>.ts` are generated per package and exist so consumers can import `@tactical-agent-neural-knowledge/sdk/contracts/<pkg>`.
- Generated `*_pb.ts` files export `*Schema` values for `create` and `fromJson`/`toJson` from `@bufbuild/protobuf` v2; the store keeps these shapes directly.
- Hot files named in the map: `ai_pb.ts`, `agentctl_pb.ts`, `platform_pb.ts`, `agent_pb.ts`, `apps_pb.ts`.
- Contract changes are additive by convention in this repo's history (commit titles such as "contracts 30277be: workspace markup schedule (additive)"); a removed or renamed field is a breaking change for all four consumers.

## Verified
- none run in this refresh: `pnpm install --frozen-lockfile` could not reach the npm registry from the sandbox (ENETUNREACH), so lint, typecheck and tests were not run here; CI runs `pnpm check`.
