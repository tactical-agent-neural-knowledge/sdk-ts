# Neurons · .github

refreshed 2026-10-17 · 4cf30dae33e3

- Two workflow files, two independent gates on PRs and pushes to `main`: `ci.yml` (job `check`) and `security.yml` (jobs `secrets` and `deps`).
- `ci.yml`'s `check` job runs, in order: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` — the same chain `pnpm check` runs locally, so a green `pnpm check` is a reliable predictor of a green run.
- After the build, `ci.yml` has a dedicated "dist/ is current" step that fails both on `git diff --exit-code --stat dist/` **and** on untracked output (`git status --porcelain dist/`); a new file under `dist/` that was never `git add`ed fails just as loudly as a modified one.
- `--frozen-lockfile` means `pnpm-lock.yaml` must be committed alongside any `package.json` dependency change or install fails before a single check runs.
- There is no deploy workflow and no publish step: the artifact is a green `main` sha, and consumers (`web`, `mobile`, `agent-runner`) bump `github:tactical-agent-neural-knowledge/sdk-ts#<sha>` in their own `package.json`.
- `security.yml` is a **hand-maintained copy**, not a call to the shared `tactical-agent-neural-knowledge/workflows` repo: this repo is **public** and that repo is **private**, and GitHub does not let a public repo call a reusable workflow from a private one. The comment at the top of `security.yml` explains why; when the shared workflows change, `security.yml` must be updated to match.
- `security.yml` `secrets` job runs gitleaks with `--redact` to prevent credential double-exposure in run logs; PRs scan the directory tree, the weekly schedule (Monday 06:17 UTC) scans full git history, and the SARIF report is uploaded as an artifact.
- `security.yml` `deps` job runs trivy against the filesystem with `--ignore-unfixed`; the threshold is CRITICAL and HIGH (`BLOCKING="CRITICAL,HIGH"`). A stale or empty database fails the check rather than silently passing.
- `../bin/ci-wait sdk-ts [sha]` is the sanctioned way to wait on a run (`CLAUDE.md` command vocabulary); `gh` is scoped with `--repo` because this repo has no cloud identity.
- Node and pnpm versions in the workflow must track `engines.node` (`>=24`) and `packageManager` (`pnpm@11.9.0`) in `package.json`; the React/jsdom suites are the part that actually breaks on an older Node.

## Verified

none — pnpm unavailable in this environment
