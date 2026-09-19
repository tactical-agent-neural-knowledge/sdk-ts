# sdk-ts — working on this repo with Claude

Remote: `git@github.com:tactical-agent-neural-knowledge/sdk-ts.git`. Umbrella rules in `../CLAUDE.md` apply.

## Identity lock
No cloud identity: this repo touches no AWS account, cluster or store. CI only (`gh` with `--repo`).

## Purpose + stack
One npm package, `@tactical-agent-neural-knowledge/sdk`, repo root is the package. TypeScript 5.9 strict, ESM only,
built with `tsc` to `dist/` — **`dist/` is committed** because consumers (`web`, `mobile`, `agent-runner`) install it as
a git dependency `github:tactical-agent-neural-knowledge/sdk-ts#<sha>` with no registry or token. pnpm 11, Node 24,
Biome 2, Vitest. Runtime deps: `@bufbuild/protobuf`, `@connectrpc/connect(-web)`, `idb`. Peers (optional): React 19,
MUI 7 + Emotion (`blocks-web` only).

Subpaths: `.` (client), `./react`, `./design`, `./blocks`, `./blocks-web`, `./contracts`, `./contracts/*`,
`./fixtures/*`. `./blocks-native` (React Native Paper renderer) comes later, as its own subpath.

## CI / deploy path
| Workflow | Trigger | Does | Verified by |
|---|---|---|---|
| `ci.yml` check | PR, main | `pnpm install --frozen-lockfile`, lint, typecheck, test, build, **`git diff --exit-code dist/`** | green run |

There is no deploy: a green `main` sha is the artifact. Consumers bump the sha in their `package.json`.

## Command vocabulary
| Intent | Command |
|---|---|
| Everything CI runs | `pnpm check` |
| Build (and commit) `dist/` | `pnpm build` |
| Re-vendor contracts | `pnpm sync-contracts <contracts-sha>` (updates `src/contracts/tank`, `src/contracts/VERSION`, flat shims) |
| Regenerate block goldens | `UPDATE_FIXTURES=1 pnpm test` (edit `src/test/fixture-defs.ts` first) |
| Update renderer snapshots | `pnpm vitest run -u src/blocks-web` (only with a deliberate visual change) |
| Wait for CI | `../bin/ci-wait sdk-ts [sha]` |

## Layout
`src/contracts` vendored generated code + namespaced barrel · `src/design` tokens, fonts (names + Google/Expo sources, no binaries), MUI options, Paper theme, contrast ·
`src/client` transport, `RealtimeClient`, `TankStore`, outbox, storage adapters · `src/react` provider + hooks ·
`src/blocks` types, builders, normalizer · `src/blocks-web` MUI renderers · `src/test` fake gateway + fixture defs
(never built) · `fixtures/` golden JSON · `scripts/sync-contracts.sh`.

## Hard prohibitions
Editing `dist/` by hand (run `pnpm build`); editing `src/contracts/tank/` by hand (run the sync script); importing
`react-native` anywhere in this repo; `link:`/`file:` deps in a PR; pushing without committing the rebuilt `dist/`;
adding a non-optional peer that the client subpath would drag into node/mobile; message bodies anywhere but the
store (no logging of `text`).

## Decided — do not re-litigate
One package with subpaths (not a pnpm workspace); exports carry `types`/`import`/`default` (same ESM files, so
Jest/jest-expo resolve subpaths without a moduleNameMapper; `src/exports.test.ts` guards it); `dist/` committed and gated in CI; git dependency install (no
GitHub Packages token in consumers); contracts vendored by sha (no submodule, no fetch at build time); MUI 7 on web
and React Native Paper on mobile from the same tokens; `@bufbuild/protobuf` v2 shapes are the store's message types (no
parallel DTOs); binary Connect + binary gateway frames; cursors per workspace with strict ordering + gap buffer + Resume;
optimistic outbox keyed by UUIDv7 `client_msg_id` (`crypto.getRandomValues` or an injected `randomBytes`); client
helpers (`updateMessage`, `deleteMessage`, `joinChannel`, `leaveChannel`, `createChannel`, `setGoal`, `invite`,
`markThreadRead`) update the store optimistically and roll back on error so apps never dispatch raw actions;
thread read state lives in `threadReadStates` and is counted separately from channel unreads; the realtime
"back online" signal is injectable (`realtime.onlineSignal`); `TankStorage` is string key/value (IndexedDB on web, SQLite on
mobile, memory in tests); Biome not ESLint+Prettier; Vitest not Jest.
