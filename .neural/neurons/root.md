# Neurons · .

refreshed 2026-10-14T19:15:56Z · 8eebea37f816

- The repo root *is* the npm package `@tactical-agent-neural-knowledge/sdk` — there is no `packages/`; `pnpm-workspace.yaml` is not a workspace declaration, it carries two unrelated pnpm-11 blocks: `allowBuilds` (just `esbuild`) and, as of this history, `overrides` pinning `tinypool >=2.1.2` / `shell-quote >=1.11.0` to close transitive dev-dependency advisories (vitest pulls in `tinypool`, react-native's devtools pulls in `shell-quote`; neither ships in `dist/`).
- `dist/` is committed. `package.json` `check` ends with `git diff --exit-code --stat dist/`, so any source change that is not followed by `pnpm build` fails CI; never hand-edit `dist/`.
- One command reproduces CI: `pnpm check` = `lint && typecheck && test && build && git diff --exit-code --stat dist/` (`package.json`).
- `package.json` `exports` has nine code subpaths plus `./contracts/*` and `./fixtures/*`; each code entry carries exactly `types`/`import`/`default` and `default === import` — `src/exports.test.ts` asserts the shape and resolves every subpath through both `require.resolve` and `import.meta.resolve`.
- `./topo` is a real export subpath in `package.json` but is missing from the subpath list in `CLAUDE.md`; trust `package.json`.
- All seven peer dependencies (react, react-dom, @mui/material, @emotion/*, react-native, react-native-paper) are `optional: true` in `peerDependenciesMeta`, so installing the client subpath in Node or Expo drags in nothing; adding a non-optional peer is a listed prohibition.
- `biome.json` is the only linter/formatter config (no ESLint, no Prettier): `lineWidth` 110, 2-space indent, `suspicious.noExplicitAny: "error"`, `style.noNonNullAssertion: "off"`; `src/contracts/tank` and `dist` are excluded, and `noArrayIndexKey` is turned off for `src/blocks-web/**` and `src/blocks-native/**`.
- `tsconfig.json` is strict *plus* `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noImplicitOverride`, `verbatimModuleSyntax`, `isolatedModules`, `NodeNext` — relative imports must end in `.js` even from `.ts` sources.
- `tsconfig.build.json` ships only runtime code: `rootDir: src`, `types: []`, and it excludes `*.test.ts(x)`, `__tests__` and all of `src/test/**`, which is why the Vitest stand-ins never reach `dist/`.
- `engines.node` is `>=24` and `packageManager` is `pnpm@11.9.0`; on Node 22 lint, typecheck and the non-React suites still pass but the jsdom/React renderer suites fail with `React.act is not a function` / `fileURLToPath is not a function`.
- `fixtures/*.json` are golden block cards published as a subpath (`./fixtures/*`) and regenerated with `UPDATE_FIXTURES=1 pnpm test` after editing `src/test/fixture-defs.ts`.
- `CLAUDE.md` holds the binding rules: the hard prohibitions list and a "Decided — do not re-litigate" section; read it before proposing an architectural change.
- Two independent CI gates exist now, not one: `.github/workflows/ci.yml` (lint/typecheck/test/build/dist-check) and `.github/workflows/security.yml` (secret + dependency scanning) — see `.neural/neurons/github.md`.

## Verified

(none — this sandbox has no network access and no `node_modules`; `pnpm install` fails with `ENETUNREACH`/`ETIMEDOUT`, so lint/typecheck/test could not be run here)
