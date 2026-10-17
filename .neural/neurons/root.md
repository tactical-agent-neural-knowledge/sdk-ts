# Neurons · .
refreshed 2026-10-17 · 6b360350cf49

- `package.json` root IS the published package `@tactical-agent-neural-knowledge/sdk`; no `packages/` subdir, no monorepo. `pnpm-workspace.yaml` gates `esbuild` allowBuilds and pins `tinypool`/`shell-quote` overrides, not a workspace.
- `dist/` is committed; consumers install via `github:tactical-agent-neural-knowledge/sdk-ts#<sha>` with no registry token. Never hand-edit `dist/`; run `pnpm build`.
- `pnpm check` = `pnpm lint && pnpm typecheck && pnpm test && pnpm build && git diff --exit-code --stat dist/` — this is the exact CI gate, run it before opening a PR.
- Nine code subpaths in `exports`: `.` (client), `./react`, `./topo`, `./design`, `./blocks`, `./blocks-web`, `./blocks-native`, `./contracts`, `./contracts/*`. Each code entry has exactly `types`/`import`/`default` with `default === import`.
- `pnpm-lock.yaml` must be committed alongside any dep change; CI uses `--frozen-lockfile` and fails before running any check if it drifts.
- Runtime deps: `@bufbuild/protobuf`, `@connectrpc/connect(-web)`, `idb`. All peers optional (React 19, MUI 7, Emotion, react-native, react-native-paper 5).
- `biome.json` controls lint/format (Biome 2, not ESLint+Prettier). `pnpm lint` = `biome check .`.
- Node 24 required (`engines.node >= 24`); pnpm 11 required (`packageManager` field).
- Contracts vendored from `tactical-agent-neural-knowledge/contracts` at the SHA in `src/contracts/VERSION` by `scripts/sync-contracts.sh`; never edit `src/contracts/tank/` by hand.
- `UPDATE_FIXTURES=1 pnpm test` regenerates golden JSON in `fixtures/`; `pnpm vitest run -u src/blocks-web` updates renderer snapshots.

## Verified
pnpm lint
