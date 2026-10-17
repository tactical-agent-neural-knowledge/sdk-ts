# Neurons · src
refreshed 2026-10-17 · 6b360350cf49

- `src/` contains only one file directly: `src/exports.test.ts`. All published code lives in subdirectories.
- `src/exports.test.ts` is the packaging guard — it fails CI when any `exports` entry drifts from the `["types","import","default"]` shape or when `default !== import`.
- The test resolves all eight code subpaths via both `createRequire` (CJS, `default` condition) and `import.meta.resolve` (ESM), verifying Jest/jest-expo can find them without `moduleNameMapper`.
- A separate `react-native isolation` describe block walks all `.js/.ts/.tsx` files in `src/` and `dist/` and asserts that only `src/blocks-native/` and `src/test/mocks/` import `react-native` or `react-native-paper`; every other subpath must be DOM/Node safe.
- The subpaths tested: `.`, `./react`, `./design`, `./blocks`, `./blocks-web`, `./blocks-native`, `./contracts`, `./contracts/message` (the wildcard entry tested via an explicit resolved name).

## Verified
pnpm vitest run src/exports.test.ts
