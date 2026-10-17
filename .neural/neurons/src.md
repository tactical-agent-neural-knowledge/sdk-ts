# Neurons · src

refreshed 2026-10-08 · 83a77f18cf88

- `src/` has no `index.ts` of its own: every published subpath points at a directory barrel (`src/client/index.ts`, `src/react/index.tsx`, `src/design/index.ts`, `src/blocks/index.ts`, `src/blocks-web/index.ts`, `src/blocks-native/index.ts`, `src/contracts/index.ts`, `src/topo/index.ts`) mapped in `package.json` `exports`.
- `src/exports.test.ts` is the only file directly in `src/` and it is the packaging guard — it fails the build when an `exports` entry drifts, not at install time in a consumer.
- That test asserts each code subpath's keys are exactly `["types","import","default"]`, that `default === import` (the same ESM file), and that `types` ends in `.d.ts`; this is what lets Jest, `jest-expo` and Metro resolve `…/sdk/react` with no `moduleNameMapper`.
- It resolves eight subpaths twice — through `createRequire(...).resolve` (CJS) and `import.meta.resolve` (ESM) — and asserts both land on the same file.
- Its `react-native isolation` test walks **both `src/` and `dist/`**, excluding only `/blocks-native/` and `/test/mocks/`, and fails any file matching `/from\s+["']react-native(-paper)?["']/`; an RN import added to `src/design` or `src/blocks` is caught here, and so is one that only survives in a stale `dist/`.
- Layer direction is one-way: `contracts` → `design`/`blocks` → `client` → `react`/`blocks-web`/`blocks-native`. `src/blocks` holds the shared card model, the two renderer directories hold only presentation.
- Nothing outside `src/contracts` imports a generated path directly in public API terms — `src/blocks/types.ts` re-exports the block and rich-text message types so consumers never reach into `contracts/tank/...`.
- `src/test/**` is excluded from `tsconfig.build.json`, so anything imported from there is test-only by construction and cannot leak into `dist/`.
- Every relative import ends in `.js` (NodeNext + `verbatimModuleSyntax`), and type-only imports must use `import type` or the build fails.
- Area suites can be run alone: `pnpm vitest run src/client`, `src/topo`, `src/design`, `src/blocks/` — note the trailing slash on `src/blocks/`, without it the pattern also pulls in `src/blocks-web` and `src/blocks-native`.

## Verified

`pnpm lint`, `pnpm typecheck`, `pnpm vitest run src/exports.test.ts`
