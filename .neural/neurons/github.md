# Neurons · .github
refreshed 2026-10-17 · 6b360350cf49

- Two workflow files, two gates on PRs and pushes to `main`: `ci.yml` (job `check`) and `security.yml` (jobs `secrets`, `deps`).
- `ci.yml` runs in order: `pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm typecheck` → `pnpm test` → `pnpm build`. A green local `pnpm check` is a reliable predictor of green CI.
- After build, `ci.yml` has a dedicated "dist/ is current" step: fails on `git diff --exit-code --stat dist/` AND on `git status --porcelain dist/` (untracked new files are caught too, not just modified ones).
- `security.yml` is hand-maintained (not a call to `tactical-agent-neural-knowledge/workflows`) because this repo is **public** and that one is **private**; GitHub prevents public repos from calling reusable workflows in private repos. When the shared workflows change, update this file too — originals are `workflows/.github/workflows/secret-scan.yml` and `deps-scan.yml`.
- `security.yml` runs: gitleaks (secrets scan, redacted output, SARIF artifact) and trivy (dep vuln scan, CRITICAL+HIGH block the job).
- Security scan runs on PR, push to main, and weekly schedule (Monday 06:17 UTC); the weekly run uses `fetch-depth: 0` to walk full git history.
- `ci.yml` uses concurrency group `ci-${{ github.ref }}` with `cancel-in-progress: true` so stacked pushes don't queue.

## Verified
(no commands run for .github — workflow files are YAML only)
