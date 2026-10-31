# Neurons · .

refreshed 2026-10-31 · bf59edafde49

- The repo root *is* the npm package `@tactical-agent-neural-knowledge/sdk` — there is no `packages/` and `pnpm-workspace.yaml` exists only to whitelist `esbuild`'s install script (`allowBuilds`) and pin `tinypool`/`shell-quote` overrides, not to declare a workspace.
- `dist/` is committed. `package.json` `check` ends with `git diff --exit-code --stat dist/`, so any source change that is not followed by `pnpm build` fails CI; never hand-edit `dist/`.
- One command reproduces CI: `pnpm check` = `lint && typecheck && test && build && git diff --exit-code --stat dist/` (`package.json`).
- `package.json` exports nine code subpaths (`.`, `./react`, `./topo`, `./design`, `./blocks`, `./blocks-web`, `./blocks-native`, `./contracts`, `./contracts/*`) plus `./fixtures/*` and `./package.json`; each code entry carries exactly `types`/`import`/`default` and `default === import` — `src/exports.test.ts` asserts the shape and resolves every subpath through both `require.resolve` and `import.meta.resolve`.
- `./topo` is a real export subpath in `package.json` but is still missing from the subpath list in `CLAUDE.md`; trust `package.json`, not `CLAUDE.md`.
- All seven peer dependencies (react, react-dom, @mui/material, @emotion/*, react-native, react-native-paper, react-native-svg) are `optional: true` in `peerDependenciesMeta`, so installing the client subpath in Node or Expo drags in nothing; adding a non-optional peer is a listed prohibition.
- `biome.json` is the only linter/formatter config (no ESLint, no Prettier): `lineWidth` 110, 2-space indent, `suspicious.noExplicitAny: "error"`, `style.noNonNullAssertion: "off"`; `src/contracts/tank` and `dist` are excluded from linting; `noArrayIndexKey` is off for `src/blocks-web/**` and `src/blocks-native/**`.
- `tsconfig.json` is strict plus `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noImplicitOverride`, `verbatimModuleSyntax`, `isolatedModules`, `NodeNext` — relative imports must end in `.js` even from `.ts` sources.
- `tsconfig.build.json` ships only runtime code: `rootDir: src`, `types: []`, and it excludes `*.test.ts(x)`, `__tests__` and all of `src/test/**`, which is why the Vitest stand-ins never reach `dist/`.
- `fixtures/*.json` are golden block cards published as a subpath (`./fixtures/*`) and regenerated with `UPDATE_FIXTURES=1 pnpm test` after editing `src/test/fixture-defs.ts`.
- `CLAUDE.md` holds the binding rules: the hard prohibitions list and a "Decided — do not re-litigate" section; read it before proposing an architectural change.
- Two gates run on every PR and push to `main`: `.github/workflows/ci.yml` (`check`) and `.github/workflows/security.yml` (secret + dependency scanning) — see `.neural/neurons/github.md`.
- Latest contracts sync: commit `727058f` (adds `OpenThread` to `AgentService`); the `src/contracts/VERSION` file records the contracts commit sha.

## Verified

`pnpm lint`, `pnpm typecheck`
