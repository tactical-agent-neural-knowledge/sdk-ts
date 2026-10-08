# Neurons · .github

refreshed 2026-10-08 · 83a77f18cf88

- Two workflow files, two independent gates on PRs and pushes to `main`: `ci.yml` (job `check`) and `security.yml` (jobs `secrets` and `deps`).
- `ci.yml`'s `check` job runs, in order: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` — the same chain `pnpm check` runs locally, so a green `pnpm check` is a reliable predictor of a green run.
- After the build, `ci.yml` has a dedicated "dist/ is current" step that fails both on `git diff --exit-code --stat dist/` **and** on untracked output (`git status --porcelain dist/`); a new file under `dist/` that was never `git add`ed fails just as loudly as a modified one.
- `security.yml` is a **hand-maintained copy**, not a call to the shared `tactical-agent-neural-knowledge/workflows` repo: GitHub refuses to let a public repo call a reusable workflow hosted in a private one, and `sdk-ts` (like `contracts`) is public while `workflows` is private. The file's own header says so and names the originals (`workflows/.github/workflows/secret-scan.yml`, `deps-scan.yml`) — when those change, this file must be updated by hand too.
- `security.yml` runs on every PR, every push to `main`, a Monday 06:17 UTC cron (full-history secret scan), and `workflow_dispatch`.
- `secrets` job: installs gitleaks 8.30.1, scans tree-only (`gitleaks dir`) except on the scheduled run which scans full history (`gitleaks git .`, `fetch-depth: 0`) — a credential committed and reverted still fails the Monday run even though it's invisible on a normal PR diff.
- `deps` job: installs trivy 0.75.0, `trivy fs . --scanners vuln --ignore-unfixed`, blocks on `CRITICAL`/`HIGH` with a fix available (SLA documented in the step: CRITICAL 7 days, HIGH 30, MEDIUM 90, LOW next routine bump). Two vulnerability-DB mirrors are configured because the anonymous pull is rate-limited.
- Both jobs treat "no report file" as a hard failure (`::error::... produced no report`), not a pass — an unknown scan result must never read as clean.
- `--frozen-lockfile` means `pnpm-lock.yaml` must be committed alongside any `package.json` dependency change or install fails before a single check runs.
- There is no deploy workflow and no publish step: the artifact is a green `main` sha, and consumers (`web`, `mobile`, `agent-runner`) bump `github:tactical-agent-neural-knowledge/sdk-ts#<sha>` in their own `package.json`. Neither workflow holds a deploy credential.
- `../bin/ci-wait sdk-ts [sha]` is the sanctioned way to wait on a run (`CLAUDE.md` command vocabulary); `gh` is scoped with `--repo` because this repo has no cloud identity.
- Node and pnpm versions in `ci.yml` must track `engines.node` (`>=24`) and `packageManager` (`pnpm@11.9.0`) in `package.json`; the React/jsdom suites are the part that actually breaks on an older Node.

## Verified

`pnpm lint`, `pnpm typecheck`
