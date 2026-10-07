# Neural Knowledge by TANK · refreshed 2026-10-07 · d3746781a46d

This repository is one npm package, `@tactical-agent-neural-knowledge/sdk`: the TypeScript SDK every TANK client
builds on. It holds typed Connect clients for the API, a binary realtime gateway client, a normalized message store
with an optimistic outbox, React hooks, the brand design tokens projected into MUI and React Native Paper themes,
and the "Threaded Action Cards" block model with a renderer for each platform. The repo root *is* the package, it is
ESM only, and `dist/` is committed because consumers install it straight from git by sha — no registry, no token.

## Commands

- `pnpm install --frozen-lockfile` — install (what CI runs; the lockfile must be committed)
- `pnpm build` — `rm -rf dist && tsc -p tsconfig.build.json`; commit the result
- `pnpm test` — `vitest run`
- `pnpm lint` — `biome check .`
- `pnpm format` — `biome check --write .`
- `pnpm typecheck` — `tsc -p tsconfig.json --noEmit`
- `pnpm check` — everything CI runs: lint, typecheck, test, build, `git diff --exit-code --stat dist/`
- `pnpm sync-contracts <contracts-sha>` — re-vendor `src/contracts/tank`, `src/contracts/VERSION` and the flat shims
- `UPDATE_FIXTURES=1 pnpm test` — regenerate the golden block cards in `fixtures/` (edit `src/test/fixture-defs.ts` first)
- `pnpm vitest run -u src/blocks-web` / `pnpm vitest run -u src/blocks-native` — update renderer snapshots, only for a deliberate visual change
- `pnpm vitest run src/client` / `src/topo` / `src/design` / `src/blocks/` — one area at a time (the trailing slash on `src/blocks/` matters)
- `../bin/ci-wait sdk-ts [sha]` — wait for CI

Node must be `>=24` and pnpm is pinned to `11.9.0`. Below Node 24, lint, typecheck and the non-React suites still
pass but the jsdom/React renderer suites fail to collect (`React.act is not a function`).

## Areas

- `.` — package manifest, tsconfigs, Biome config, Vitest config, committed `dist/`, golden `fixtures/` → `.neural/neurons/root.md`
- `.github` — the single `ci.yml` check workflow; there is no deploy → `.neural/neurons/github.md`
- `scripts` — `sync-contracts.sh`, the only way to change vendored contracts → `.neural/neurons/scripts.md`
- `src` — layering and the `src/exports.test.ts` packaging guard → `.neural/neurons/src.md`
- `src/blocks` — platform-free card model: types, builders, normalizer, `runTone` → `.neural/neurons/src-blocks.md`
- `src/blocks-native` — react-native-paper renderers; the only place RN may be imported → `.neural/neurons/src-blocks-native.md`
- `src/blocks-web` — MUI renderers and `tankTheme` → `.neural/neurons/src-blocks-web.md`
- `src/client` — transport, `RealtimeClient`, `TankStore`, outbox, storage adapters, upload → `.neural/neurons/src-client.md`
- `src/contracts` — vendored generated protobuf/Connect code and the hand-written namespaced barrel → `.neural/neurons/src-contracts.md`
- `src/design` — brand tokens, fonts, MUI options, Paper theme, WCAG contrast guards → `.neural/neurons/src-design.md`
- `src/react` — `TankProvider` and the hooks → `.neural/neurons/src-react.md`
- `src/test` — fake gateway, fixture definitions, the Vitest react-native stand-ins → `.neural/neurons/src-test.md`
- `src/topo` — Topo strip mark visibility and search-hit marks → `.neural/neurons/src-topo.md`

## Rules

From `CLAUDE.md`, "Hard prohibitions" — quoted:

> Editing `dist/` by hand (run `pnpm build`); editing `src/contracts/tank/` by hand (run the sync script); importing
> `react-native` / `react-native-paper` outside `src/blocks-native` (`src/exports.test.ts` scans `src/` and `dist/`);
> `link:`/`file:` deps in a PR; pushing without committing the rebuilt `dist/`; adding a non-optional peer that the
> client subpath would drag into node/mobile; message bodies anywhere but the store (no logging of `text`).

Also from `CLAUDE.md`: "No cloud identity: this repo touches no AWS account, cluster or store. CI only (`gh` with
`--repo`)." And: "There is no deploy: a green `main` sha is the artifact. Consumers bump the sha in their
`package.json`."

`CLAUDE.md` has a "Decided — do not re-litigate" section covering, among others: one package with subpaths (not a
pnpm workspace); exports carrying `types`/`import`/`default`; `dist/` committed and gated in CI; contracts vendored
by sha; `@bufbuild/protobuf` v2 shapes as the store's message types (no parallel DTOs); Biome not ESLint+Prettier;
Vitest not Jest. Read it before proposing an architectural change.

Enforced by config rather than prose: `biome.json` sets `lineWidth` 110 and `suspicious.noExplicitAny: "error"`;
`tsconfig.json` adds `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`,
`noImplicitOverride`, `verbatimModuleSyntax` and `NodeNext`, so relative imports must end in `.js`.

## Before changing anything

- Run `pnpm check` — it is exactly the CI chain, so a green local run predicts a green PR.
- If you touched anything under `src/`, run `pnpm build` and commit `dist/` in the same change; CI fails on both a
  modified and an untracked file under `dist/`.
- Adding or renaming an export subpath means updating `package.json` `exports` and satisfying `src/exports.test.ts`.
- Changing a block builder invalidates `fixtures/` (`UPDATE_FIXTURES=1 pnpm test`) and both renderers' snapshots.
- Changing a design token re-runs `src/design/contrast.test.ts`, which asserts WCAG AA for every text/surface pair.
- Ship through a pull request against `main`; there is nothing to deploy, and consumers pick the change up by sha.

## Neural Knowledge

This layer is generated by TANK. It lives in `.neural/` — `map.yaml` and `index.json` are the deterministic map of
areas, commands, entry points and hot files, and `.neural/neurons/*.md` holds the per-area facts that only reading
the code produces. It is refreshed on every push to the default branch, and this `AGENTS.md` is written from it, so
hand edits to either are overwritten on the next refresh; change the code or the rules files instead and let the
refresh pick them up.
