# Neurons · .

refreshed 2026-11-23 · 5a19bf7e597e

- The repo root is the npm package `@tactical-agent-neural-knowledge/sdk`; there is no `packages/` directory and no workspace (`package.json` has no `workspaces`).
- `dist/` is committed and consumed as a git dependency by `web`, `mobile` and `agent-runner`; CI fails with "dist/ is stale" if `pnpm build` output differs (`.github/workflows/ci.yml`).
- `pnpm check` is the whole CI gate: `pnpm lint && pnpm typecheck && pnpm test && pnpm build && git diff --exit-code --stat dist/` (`package.json` scripts.check).
- Code subpaths in `package.json` `exports`: `.`, `./react`, `./topo`, `./design`, `./blocks`, `./blocks-web`, `./blocks-native`, `./contracts`, `./contracts/*`; plus `./fixtures/*` and `./package.json`.
- Each code export carries exactly `types`, `import`, `default` with `default === import` (same ESM files); `src/exports.test.ts` guards this.
- `./topo` is exported in `package.json` but missing from the subpath list in `CLAUDE.md`; `package.json` is authoritative.
- Peer dependencies are optional (`CLAUDE.md`, Purpose + stack); adding a non-optional peer that the client subpath pulls into node or mobile is a listed prohibition.
- Engines: `node >=24` (`package.json`); CI runs `setup-node` with node 24 (`.github/workflows/ci.yml`).
- `src/contracts/VERSION` pins the vendored contracts sha `1670e4e249b5c075ae5296a77908b5ac19d0e1e7`; bump it only through `pnpm sync-contracts <sha>`.
- `sideEffects: false` and `files: ["dist", "fixtures", "src"]` in `package.json`: source ships alongside dist.

## Verified
- none run in this refresh: `pnpm install --frozen-lockfile` failed in the sandbox (corepack could not fetch pnpm 11.9.0, ETIMEDOUT, and the local node is v22 while engines require 24), so lint, typecheck and tests were not run; CI runs `pnpm check`.
