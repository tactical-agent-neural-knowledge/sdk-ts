# Neurons · src/contracts

refreshed 2026-10-07 · d3746781a46d

- `src/contracts/tank/**` is vendored by sha from the separate `contracts` repo — never hand-edit it; `src/contracts/VERSION` (currently `77435ec229ee930c7b7ce688a4f6634b7113cfca`) is the source of truth and `scripts/sync-contracts.sh` is the only way to bump it.
- The sha that landed this refresh's changes added `board.ts`, `books.ts`, `canvas.ts` flat shims and the matching `src/contracts/tank/board/v1/`, `tank/books/v1/`, `tank/canvas/v1/` generated directories — Neuralboards and Neuralcanvas presence/content types, and Neuralbooks agentctl RPCs, reaching the SDK for the first time.
- `board_pb.ts` carries staleness as a first-class concept: paired `staleness`/`stalenessNote` fields on two message shapes, a `staleOnly` filter flag, and a `shadow` string field for cast-shadow rendering — comments in the file literally describe "comparing it with what is deployed now is how a board learns it has gone stale."
- `agentctl_pb.ts` gained the full Neuralbooks RPC surface: `BooksSummaryRequest/Response`, `BooksCreateInvoiceRequest/Response`, `BooksRecordExpenseRequest/Response`, `BooksRecordPaymentRequest/Response` and siblings — request/response message types only, no SDK-level client wrapper yet.
- `src/contracts/index.ts` is a hand-maintained namespaced barrel (`agent`, `auth`, `blocks`, `channel`, `events`, `files`, `huddle`, `message`, `notification`, `presence`, `realtime`, `richtext`, `search`, `workspace`) that exists to dodge name collisions between packages — adding a new vendored package means adding its line here by hand, and `board`/`books`/`canvas` have **not** been added yet.
- Several packages are intentionally flat-shim-only, reachable only via `./contracts/*` and never through the namespaced barrel: `admin`, `agentctl`, `billing`, `catalog`, `command`, `monitor`, `platform`, `topo` — `board`, `books` and `canvas` now join that list.
- Each flat shim (`src/contracts/<pkg>.ts`) is two lines with a generated "do not edit" header re-exporting the versioned `_pb.js` path; this is what backs the `./contracts/*` wildcard export without hand-listing every package in `package.json`.
- `@bufbuild/protobuf` v2 shapes are the store's message types directly — no parallel hand-written DTOs anywhere in `src/client` or `src/blocks`.
- `EventPayload`'s closed union depends on every vendored event message carrying a literal `$typeName` discriminant; `biome.json` excludes `src/contracts/tank` from formatting/linting but not the flat shims or `index.ts`, so those two stay subject to normal lint rules.
- After any `sync-contracts` run, `pnpm build` and a `dist/` commit are mandatory — the CI `git diff --exit-code --stat dist/` step fails otherwise, same as any other source change.

## Verified

`pnpm lint`, `pnpm typecheck`
