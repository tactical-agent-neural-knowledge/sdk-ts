# Neurons · src/contracts

refreshed 2026-10-31 · bf59edafde49

- `src/contracts/VERSION` records the contracts repo commit this vendoring was cut from: currently `727058f2fd99` (adds `OpenThread` to `AgentService`); bump by running `pnpm sync-contracts <new-sha>`.
- `src/contracts/index.ts` is the namespaced barrel: each package exported as a named namespace (`agent`, `auth`, `blocks`, `channel`, `events`, `files`, `huddle`, `message`, `notification`, `presence`, `realtime`, `richtext`, `search`, `workspace`) to avoid cross-package name collisions like `SetStatusRequest`. **`agentops`, `agentctl`, and `crew` are vendored but not yet in this barrel.**
- `src/contracts/tank/agent/v1/agent_pb.ts` exports `AgentService` (the main agent control service), `Run`, `RunSchema`, `RunState` enum, `TreadPlan`, `TreadPlanSchema`, `OpenThreadRequest/Response` (added in latest sync), `StartRun/StopRun/Heartbeat/SetStatus/SetProductBrand/SetProductLanding/RecordProductFinding/GetRun/ListRuns` — all RPCs TANK's runner calls.
- `src/contracts/tank/agentops/v1/agentops_pb.ts` is the agent-ops analytics/management layer: `ToolPolicy`, `Envelope` (cost summary), `Member` (agentops member with spend/run counts), `MemberRecord`, `KindRecord`, `Team`, `Shift`, `Claim` — not yet imported by `src/client/`.
- `src/contracts/tank/agentctl/v1/agentctl_pb.ts` is the internal agent control/handoff protocol: `Attachment`, `ThreadMessage`, `PolicySummary`, `RunContext`, `TeamContext`, `ClaimItem`, `HeldClaim`, `ClaimRequest/Response`, `ReleaseClaimsRequest/Response`, `CheckClaimRequest/Response`, `ListClaimsRequest/Response` — not yet imported by `src/client/`.
- `src/contracts/tank/crew/v1/crew_pb.ts` is the Crew AI-swarm management service: `CrewService` with `ListCrew`, `AddMember`, `UpdateMember`, `RemoveMember`; `Member` has `id`, `agentId`, `principalId`, `role`, `title`, `handle`, `skill`, `enabled`, `treads` (enum), `channelIds`, `activity`, `dailyCapUsd`, `concurrentCap`, and spend/run stats; `Preset` for template crew configs; `Treads` enum (`ALL` / `SELECTED`); `Activity` enum (MENTIONED / LOW / NORMAL / HIGH) — not yet imported by `src/client/`.
- Hand-editing anything under `src/contracts/tank/` is a hard prohibition; run `pnpm sync-contracts <sha>` instead — the script also regenerates the flat shims.
- `src/contracts/tank/events/v1/events_pb.ts` is the closed event union that feeds `TankState`; every `$typeName` in `EventPayload` must be a literal string for discriminated-union `switch` narrowing.
- The flat shims (e.g. `src/contracts/message.ts`) re-export specific named symbols from the deep generated paths so `./contracts/message` resolves as the `./contracts/*` wildcard export.

## Verified

`pnpm lint`, `pnpm typecheck`
