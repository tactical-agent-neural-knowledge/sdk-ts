# Neurons · .

refreshed 2026-10-04 · 6a1f2b084d98

- The repo root *is* the npm package `@tactical-agent-neural-knowledge/sdk` — there is no `packages/`, and `pnpm-workspace.yaml` exists only to whitelist `esbuild`'s install script (`allowBuilds`), not to declare a workspace.
- `dist/` is committed. `package.json` `check` ends with `git diff --exit-code --stat dist/`, so any source change not followed by `pnpm build` fails CI; never hand-edit `dist/`.
- One command reproduces CI: `pnpm check` = `lint && typecheck && test && build && git diff --exit-code --stat dist/` (`package.json`).
- `package.json` `exports` has nine object entries — eight named code subpaths (`.`, `./react`, `./topo`, `./design`, `./blocks`, `./blocks-web`, `./blocks-native`, `./contracts`) plus the `./contracts/*` wildcard — and two string entries (`./fixtures/*`, `./package.json`). Each object entry carries exactly `types`/`import`/`default` with `default === import`; `src/exports.test.ts` asserts the shape and resolves the subpaths through both `require.resolve` and `import.meta.resolve`.
- `./topo` is a real export subpath in `package.json` but is missing from the subpath list in `CLAUDE.md` and from `SUBPATHS` in `src/exports.test.ts`; trust `package.json`.
- All seven peer dependencies (react, react-dom, @mui/material, @emotion/react, @emotion/styled, react-native, react-native-paper) are `optional: true` in `peerDependenciesMeta`, so installing the client subpath in Node or Expo drags in nothing; adding a non-optional peer is a listed prohibition.
- `biome.json` is the only linter/formatter config (no ESLint, no Prettier): `lineWidth` 110, 2-space indent, `suspicious.noExplicitAny: "error"`, `style.noNonNullAssertion: "off"`; `src/contracts/tank` and `dist` are excluded via `!`-prefixed `files.includes`, and `noArrayIndexKey` is turned off for `src/blocks-web/**` and `src/blocks-native/**`.
- `biome check .` exits 0 on warnings — the repo currently carries one (an optional-chain suggestion in `src/client/store.ts`). A warning is not a CI failure; don't "fix" it as if it were.
- `tsconfig.json` is strict *plus* `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noImplicitOverride`, `verbatimModuleSyntax`, `isolatedModules`, `NodeNext` — relative imports must end in `.js` even from `.ts` sources.
- `tsconfig.build.json` ships only runtime code: `rootDir: src`, `types: []`, `declaration` on with `declarationMap`/`sourceMap` off, and it excludes `*.test.ts(x)`, `__tests__` and all of `src/test/**`, which is why the Vitest stand-ins never reach `dist/`.
- `vitest.config.ts` aliases `react-native` and `react-native-paper` to `src/test/mocks/*.tsx` for *every* suite, and only `src/blocks-web/**` runs in jsdom (`environmentMatchGlobs`); everything else is the node environment, so a DOM API in a non-web suite fails there rather than in CI.
- `engines.node` is `>=24` and `packageManager` is `pnpm@11.9.0`. On Node 22 pnpm only warns, and lint, typecheck and `src/exports.test.ts` still pass; the jsdom/React renderer suites are what break (`React.act is not a function`).
- `fixtures/` holds eight golden block cards (`plan`, `approval`, `diff`, `ci-green`, `ci-red`, `file`, `status`, `tool-log`) published as `./fixtures/*` and regenerated with `UPDATE_FIXTURES=1 pnpm test` after editing `src/test/fixture-defs.ts`.
- `CLAUDE.md` holds the binding rules: the hard prohibitions list and a "Decided — do not re-litigate" section; read it before proposing an architectural change.

## Verified

`pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm vitest run src/exports.test.ts`
