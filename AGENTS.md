# Neural Knowledge by TANK · refreshed 2026-10-14T19:15:56Z · 8eebea37f816

`@tactical-agent-neural-knowledge/sdk` is the one TypeScript SDK that `web`, `mobile`, and `agent-runner` all install to talk to the Tank backend: a Connect RPC client, a normalized realtime store, React hooks, and matching MUI/React-Native-Paper block renderers, all built from one shared design-token and protobuf-contract source. The repo root is the package itself — there is no monorepo, no `packages/` directory, and no npm registry publish; consumers pin a commit sha of this repo as a git dependency and `dist/` (committed, `tsc`-built) is the artifact CI gates on. ESM-only, TypeScript 5.9 strict, pnpm 11, Node ≥24, Biome 2, Vitest.

## Commands
- `pnpm check` — everything CI runs: lint, typecheck, test, build, then asserts `dist/` is unchanged.
- `pnpm lint` / `pnpm typecheck` / `pnpm test` / `pnpm build`
- `pnpm vitest run src/client` (or `src/design`, `src/topo`, `src/blocks/` with the trailing slash) — one area's suite only.
- `pnpm sync-contracts <contracts-sha>` — re-vendor `src/contracts/tank`, bump `VERSION`, regenerate flat shims; always follow with `pnpm build`.
- `UPDATE_FIXTURES=1 pnpm test` — regenerate golden block fixtures after editing `src/test/fixture-defs.ts`.
- `pnpm vitest run -u src/blocks-web` / `src/blocks-native` — update renderer snapshots, only for a deliberate visual change.
- `../bin/ci-wait sdk-ts [sha]` — wait for CI on a pushed sha.

## Areas
- `.` — package root: `package.json` exports/peers, `biome.json`, `tsconfig*.json`, `pnpm-workspace.yaml`. Read `.neural/neurons/root.md`.
- `.github` — the two CI gates (build/test, security scanning). Read `.neural/neurons/github.md`.
- `scripts` — `sync-contracts.sh`, the only sanctioned way to touch `src/contracts/tank`. Read `.neural/neurons/scripts.md`.
- `src` — the packaging guard (`exports.test.ts`) and the one-way layering rule. Read `.neural/neurons/src.md`.
- `src/blocks` — block card types, builders, normalizer, `runTone`; shared by both renderers. Read `.neural/neurons/src-blocks.md`.
- `src/blocks-native` — React Native Paper renderers; the only place `react-native` may be imported. Read `.neural/neurons/src-blocks-native.md`.
- `src/blocks-web` — MUI renderers for the same block model. Read `.neural/neurons/src-blocks-web.md`.
- `src/client` — `TankClient`, `TankStore`, `RealtimeClient`, storage, outbox, upload. Read `.neural/neurons/src-client.md`.
- `src/contracts` — vendored protobuf/Connect code plus the namespaced barrel. Read `.neural/neurons/src-contracts.md`.
- `src/design` — brand tokens, MUI/Paper theme projections, WCAG contrast guard, board palette. Read `.neural/neurons/src-design.md`.
- `src/react` — the context provider and hooks over `TankClient`. Read `.neural/neurons/src-react.md`.
- `src/test` — fake gateway, fixture defs, `react-native`/`react-native-paper` Vitest stand-ins (never built). Read `.neural/neurons/src-test.md`.
- `src/topo` — topology/graph client surface. Read `.neural/neurons/src-topo.md`.

## Rules
From `CLAUDE.md`'s "Hard prohibitions": editing `dist/` by hand (run `pnpm build`); editing `src/contracts/tank/` by hand (run the sync script); importing `react-native` / `react-native-paper` outside `src/blocks-native` (`src/exports.test.ts` scans `src/` and `dist/`); `link:`/`file:` deps in a PR; pushing without committing the rebuilt `dist/`; adding a non-optional peer that the client subpath would drag into node/mobile; message bodies anywhere but the store (no logging of `text`).

From "Decided — do not re-litigate": one package with subpaths, not a pnpm workspace; `exports` carry `types`/`import`/`default` as the same ESM file; `dist/` committed and gated in CI; git-dependency install (no registry token); contracts vendored by sha; `@bufbuild/protobuf` v2 shapes are the store's message types (no parallel DTOs); optimistic outbox keyed by UUIDv7 `client_msg_id`; client helpers update the store optimistically and roll back on error; thread read state is counted separately from channel unreads; `TankStorage` is string key/value; Biome not ESLint+Prettier, Vitest not Jest.

From "Identity lock": no cloud identity — this repo touches no AWS account, cluster, or store; CI only, `gh` scoped with `--repo`.

Enforced by config, not prose: `biome.json` (`suspicious.noExplicitAny: error`, `lineWidth` 110), `tsconfig.json` (`noUncheckedIndexedAccess`, `verbatimModuleSyntax`, NodeNext — relative imports end `.js`), `tsconfig.build.json` (excludes all of `src/test/**` from `dist/`).

## Before changing anything
- `pnpm check` is the single command that reproduces CI locally; run it before opening a PR.
- A source change with no matching `pnpm build` fails CI on the `dist/` freshness check (diff and untracked-files both checked).
- Changing `src/contracts/tank` directly instead of via `pnpm sync-contracts <sha>` will be overwritten by the next sync and drifts from `VERSION`.
- A new vendored event type decoding to `KnownEventPayload` does not mean it reaches the store — check `envelopeToActions`'s `switch` in `src/client/store.ts` for an actual `case`.
- `.github/workflows/security.yml` is a hand-maintained copy of a shared reusable workflow (public repo can't call a private one's reusable workflow) — a change to the shared version has to be re-copied here by hand.
- There is no deploy: a green `main` sha is the artifact; consumers bump the sha themselves.

## Neural Knowledge
This file and everything under `.neural/` is generated by TANK: the deterministic part (`.neural/map.yaml`, `.neural/index.json`) comes from scanning the repo, and the per-area facts (`.neural/neurons/*.md`) and this summary come from an agent reading the code. It is refreshed on every push to the default branch — hand edits here are overwritten on the next refresh, so fix facts by fixing the code or by asking for a refresh, not by editing this file directly.
