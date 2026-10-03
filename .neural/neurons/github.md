# Neurons · .github

refreshed 2026-10-03 · f9489740a406

- `.github/workflows/ci.yml` is the only workflow and the only gate: one job, `check`, on pull requests and on pushes to `main`.
- The job runs, in order: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` — the same chain `pnpm check` runs locally, so a green `pnpm check` is a reliable predictor of a green run.
- After the build the workflow has a dedicated "dist/ is current" step that fails both on `git diff --exit-code --stat dist/` **and** on untracked output (`git status --porcelain dist/`); a new file under `dist/` that was never `git add`ed fails just as loudly as a modified one.
- `--frozen-lockfile` means `pnpm-lock.yaml` must be committed alongside any `package.json` dependency change or install fails before a single check runs.
- There is no deploy workflow and no publish step: the artifact is a green `main` sha, and consumers (`web`, `mobile`, `agent-runner`) bump `github:tactical-agent-neural-knowledge/sdk-ts#<sha>` in their own `package.json`.
- Because there is no registry publish, nothing in CI needs an npm token; the workflow holds no deploy credential at all.
- `../bin/ci-wait sdk-ts [sha]` is the sanctioned way to wait on a run (`CLAUDE.md` command vocabulary); `gh` is scoped with `--repo` because this repo has no cloud identity.
- Node and pnpm versions in the workflow must track `engines.node` (`>=24`) and `packageManager` (`pnpm@11.9.0`) in `package.json`; the React/jsdom suites are the part that actually breaks on an older Node.

## Verified

`pnpm lint`, `pnpm typecheck`
