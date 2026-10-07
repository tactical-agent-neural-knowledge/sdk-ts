# Neural Knowledge by TANK · refreshed 2026-10-07 · 93fc7f8ed552

This repository is `@tactical-agent-neural-knowledge/sdk`, a single TypeScript package (no monorepo) that gives web, mobile and agent-runner clients one typed way to talk to Tank: Connect-RPC clients, a normalized realtime store, React hooks and matching MUI/React Native Paper renderers for block content. It is consumed by other repos as a git dependency pinned to a commit sha (`github:tactical-agent-neural-knowledge/sdk-ts#<sha>`), so a green `main` sha is the shippable artifact — there is no registry publish and no deploy step. `dist/` is built with `tsc` and committed; CI fails if source and `dist/` ever disagree.

## Commands

- `pnpm check` — everything CI runs: lint, typecheck, test, build, then `git diff --exit-code --stat dist/`.
- `pnpm build` — compile `src/` to `dist/` (commit the result).
- `pnpm lint` / `pnpm typecheck` / `pnpm test` — the individual steps; `pnpm vitest run <path>` scopes tests to one area.
- `pnpm sync-contracts <contracts-sha>` — re-vendor `src/contracts/tank/**` from the `contracts` repo at that sha; never hand-edit the vendored tree.
- `UPDATE_FIXTURES=1 pnpm test` — regenerate golden block cards under `fixtures/` after editing `src/test/fixture-defs.ts`.
- `pnpm vitest run -u src/blocks-web` / `src/blocks-native` — update renderer snapshots (only for a deliberate visual change).
- `../bin/ci-wait sdk-ts [sha]` — wait for CI on a pushed sha.

## Areas

- `.` — the package root: `package.json` exports map, `biome.json`, `tsconfig*.json`, CI gate. See `.neural/neurons/root.md`.
- `.github` — the single CI workflow (`ci.yml`): install, lint, typecheck, test, build, dist-is-current check. See `.neural/neurons/github.md`.
- `scripts` — `sync-contracts.sh`, the only way `src/contracts/tank` is allowed to change. See `.neural/neurons/scripts.md`.
- `src` — the packaging guard `exports.test.ts` and the one-way layer rule (contracts → design/blocks → client → react/blocks-web/blocks-native). See `.neural/neurons/src.md`.
- `src/blocks` — shared block/rich-text model, builders, normalizer, `runTone`; no rendering. See `.neural/neurons/src-blocks.md`.
- `src/blocks-web` — MUI renderers for blocks and rich text. See `.neural/neurons/src-blocks-web.md`.
- `src/blocks-native` — the only directory allowed to import `react-native`/`react-native-paper`. See `.neural/neurons/src-blocks-native.md`.
- `src/client` — transport, `RealtimeClient`, `TankStore`, outbox, storage adapters, uploads; `createTankClient` is the entry point. See `.neural/neurons/src-client.md`.
- `src/contracts` — vendored Connect/protobuf code plus a hand-maintained namespaced barrel; `board`/`canvas`/`books` are vendored but have no client wiring yet. See `.neural/neurons/src-contracts.md`.
- `src/design` — single token source projected into MUI, Paper and board-picker palettes, plus the WCAG contrast guard. See `.neural/neurons/src-design.md`.
- `src/react` — provider and hooks over the client/store. See `.neural/neurons/src-react.md`.
- `src/test` — fake gateway, fixture defs, and the `react-native`/`react-native-paper` Vitest stand-ins (never built). See `.neural/neurons/src-test.md`.
- `src/topo` — search and visibility helpers for the topology view. See `.neural/neurons/src-topo.md`.

## Rules

Hard prohibitions (`CLAUDE.md`): "Editing `dist/` by hand (run `pnpm build`); editing `src/contracts/tank/` by hand (run the sync script); importing `react-native` / `react-native-paper` outside `src/blocks-native` (`src/exports.test.ts` scans `src/` and `dist/`); `link:`/`file:` deps in a PR; pushing without committing the rebuilt `dist/`; adding a non-optional peer that the client subpath would drag into node/mobile; message bodies anywhere but the store (no logging of `text`)."

Decided, do not re-litigate (`CLAUDE.md`): one package with subpaths, not a pnpm workspace; `exports` entries carry `types`/`import`/`default` with `default === import`; `dist/` committed and CI-gated; git-dependency install (no registry token); contracts vendored by sha (no submodule, no build-time fetch); MUI 7 and React Native Paper from the same design tokens; `@bufbuild/protobuf` v2 shapes are the store's message types directly (no parallel DTOs); binary Connect + binary gateway frames; optimistic outbox keyed by UUIDv7 `client_msg_id`; the named client helpers (`updateMessage`, `deleteMessage`, `joinChannel`, `leaveChannel`, `createChannel`, `setGoal`, `invite`, `markThreadRead`) update the store optimistically and roll back on error; thread read state is counted separately from channel unreads; `TankStorage` is string key/value across all platforms; Biome, not ESLint+Prettier; Vitest, not Jest.

## Before changing anything

- Run `pnpm check` before pushing — it is the exact sequence CI runs, including the `dist/` drift check.
- Any `src/` change that affects runtime output needs a `pnpm build` and the rebuilt `dist/` committed in the same change.
- A `src/contracts` change goes through `pnpm sync-contracts <sha>`, never a manual edit under `src/contracts/tank`.
- Snapshot/fixture changes (`src/blocks-web`, `src/blocks-native`, `fixtures/`) must be deliberate — regenerate with the commands above, don't hand-edit golden files.
- `src/exports.test.ts` is the packaging contract; if it fails, fix the `exports` map or the import, not the test.

## Neural Knowledge

This layer — `AGENTS.md` and `.neural/` — is generated by TANK from reading this repository, and is refreshed automatically on every push to the default branch. Hand edits to these files are overwritten on the next refresh; durable facts belong in code comments, `CLAUDE.md`, or the project's own docs instead.
