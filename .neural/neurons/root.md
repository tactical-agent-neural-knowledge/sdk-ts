# Neurons · .

refreshed 2026-11-16 · ad2838acc55d

- The repo root is the npm package `@tactical-agent-neural-knowledge/sdk`; there is no `packages/` directory and no workspace (`package.json` has no `workspaces`).
- `dist/` is committed and consumed as a git dependency by `web`, `mobile` and `agent-runner`; CI fails with "dist/ is stale" if `pnpm build` output differs (`.github/workflows/ci.yml`).
- `pnpm check` is the whole CI gate: `pnpm lint && pnpm typecheck && pnpm test && pnpm build && git diff --exit-code --stat dist/` (`package.json` scripts.check).
- Code subpaths in `package.json` `exports`: `.`, `./react`, `./topo`, `./design`, `./blocks`, `./blocks-web`, `./blocks-native`, `./contracts`, `./contracts/*`; plus `./fixtures/*` and `./package.json`.
- Each code export carries exactly `types`, `import`, `default` with `default === import` (same ESM files); `src/exports.test.ts` asserts this and resolves through `require.resolve` and `import.meta.resolve`.
- `./topo` is exported in `package.json` but missing from the subpath list in `CLAUDE.md`; `package.json` is authoritative.
- Peer dependencies are optional (`CLAUDE.md`, Purpose + stack); adding a non-optional peer that the client subpath pulls into node or mobile is a listed prohibition.
- Engines: `node >=24` (`package.json`), and CI runs `setup-node` with node 24 (`.github/workflows/ci.yml`).
- `src/contracts/VERSION` pins the vendored contracts sha `30277bee2e882a36282d6a9ddf6d9a6b1a9be822`; bump it only through `pnpm sync-contracts <sha>`.
- `sideEffects: false` and `files: ["dist", "fixtures", "src"]` in `package.json`: source ships alongside dist.

## Verified
- none run in this refresh: `pnpm install --frozen-lockfile` could not reach the npm registry from the sandbox (ENETUNREACH), so lint, typecheck and tests were not run here; CI runs `pnpm check`.

## Learned in runs
- Sandbox installs fail with ENETUNREACH because corepack's node fetch ignores the egress proxy; run `NODE_USE_ENV_PROXY=1 corepack prepare pnpm@11.9.0 --activate` once (curl/npm go through the proxy fine) and open_pull_request's install/lint then works offline from the cache. (learned 2026-11-17, run 381066540660605901)
