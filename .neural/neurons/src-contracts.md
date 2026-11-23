# Neurons · src/contracts

refreshed 2026-11-23 · 5a19bf7e597e

- `src/contracts/tank/**` is vendored generated code from the contracts repo at the sha in `src/contracts/VERSION` (`1670e4e249b5c075ae5296a77908b5ac19d0e1e7`); never edit it, and rerun `pnpm sync-contracts <sha>` instead.
- `scripts/sync-contracts.sh` fails with "run 'make gen' in contracts first" when `gen/ts/src/tank` is missing at the sha; that is a contracts-repo problem, not a local one.
- `src/contracts/index.ts` (23 lines) is the hand-maintained namespaced barrel: `export * as agent from "./tank/agent/v1/agent_pb.js"`, one line per package; same-named messages (for example `SetStatusRequest` in presence and agent) are reached only through their namespace.
- The barrel is a subset: `client.ts` and `react/index.tsx` import some packages straight from `tank/<pkg>/v1/*_pb.js`; add a barrel line when a new package needs a namespace.
- The flat shims `src/contracts/<pkg>.ts` are generated per package by the sync script so consumers can import `@tactical-agent-neural-knowledge/sdk/contracts/<pkg>`.
- Generated `*_pb.ts` files export `*Schema` values for `create` and `fromJson`/`toJson` from `@bufbuild/protobuf` v2; the store keeps these shapes directly.
- Hot files named in the map: `ai_pb.ts`, `agentctl_pb.ts`, `platform_pb.ts`, `agent_pb.ts`, `apps_pb.ts`.
- Contract changes are additive by convention in this repo's history; a removed or renamed field is a breaking change for all four consumers.

## Verified
- none run in this refresh: `pnpm install --frozen-lockfile` failed in the sandbox (no pnpm fetch, no node_modules), so lint, typecheck and tests were not run; CI runs `pnpm check`.
