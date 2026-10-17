# Neurons · src/contracts
refreshed 2026-10-17 · 6b360350cf49

- Vendored generated protobuf code from `tactical-agent-neural-knowledge/contracts`. Current SHA: `fee5860e47dda3e21872c278f11d048babbbc4eb` (in `src/contracts/VERSION`).
- Never edit `src/contracts/tank/` by hand. To update: `pnpm sync-contracts <contracts-sha>` which runs `scripts/sync-contracts.sh`.
- `src/contracts/index.ts` is a namespaced barrel: exports every package as a namespace (`agent`, `auth`, `blocks`, `channel`, `events`, `files`, `huddle`, `message`, `notification`, `presence`, `realtime`, `richtext`, `search`, `workspace`) to prevent same-named message collisions across packages.
- Flat shim files in `src/contracts/` (e.g. `agent.ts`, `channel.ts`, `events.ts`) re-export from the vendored `tank/` subdirs for the `./contracts/*` wildcard export path.
- `src/contracts/crew.ts` is new at `fee5860` (Workbench); `src/contracts/tank/agentctl/v1/agentctl_pb.ts` provides agent control service definitions.
- `EventPayload` (in `store.ts`, not here) is a closed union of `tank.events.v1` types plus `{ $typeName: "unknown", typeUrl, value }` — the literal discriminant enables `switch` narrowing; open string members would not.
- `@bufbuild/protobuf` v2 shapes are the store's message types; no parallel DTOs in the app layer.
- The `./contracts/*` wildcard export maps to individual shim files, so consumers can `import { ChatService } from "@tactical-agent-neural-knowledge/sdk/contracts/message"`.

## Verified
pnpm typecheck
