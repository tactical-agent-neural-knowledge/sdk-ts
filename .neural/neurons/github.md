# Neurons · .github

refreshed 2026-10-14T19:15:56Z · 8eebea37f816

- Two workflow files, two independent gates on pull requests and pushes to `main`: `ci.yml` (job `check`) and `security.yml` (jobs `secrets` and `deps`).
- `ci.yml`'s `check` job runs, in order: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` — the same chain `pnpm check` runs locally, so a green `pnpm check` is a reliable predictor of a green run.
- After the build, `ci.yml` has a dedicated "dist/ is current" step that fails both on `git diff --exit-code --stat dist/` **and** on untracked output (`git status --porcelain dist/`); a new file under `dist/` that was never `git add`ed fails just as loudly as a modified one.
- `--frozen-lockfile` means `pnpm-lock.yaml` must be committed alongside any `package.json` dependency change or install fails before a single check runs.
- `security.yml` is a **hand-maintained copy**, not a call to the shared `tactical-agent-neural-knowledge/workflows` repo — its own comment block explains why: this repo is public, `workflows` is private, and GitHub refuses to let a public repo call a reusable workflow hosted in a private one. `workflows/.github/workflows/secret-scan.yml` and `deps-scan.yml` are the originals; `contracts` carries the same duplicated copy for the same reason. When the shared workflows change, this file has to be hand-updated too.
- `secrets` job (gitleaks): tree scan on PR/push (`fetch-depth: 1`), full history scan on the Monday 06:17 UTC cron (`fetch-depth: 0`) because a committed-then-reverted credential is still a leak. Findings are `--redact`ed in the log/SARIF on purpose — printing a secret to prove it exists leaks it a second time. A missing SARIF report (crash, not "zero findings") is itself a failure, enforced in the `report` step.
- `deps` job (trivy): `fs --scanners vuln --ignore-unfixed`, two `--db-repository` mirrors so a rate-limited anonymous DB pull doesn't redden every repo at once. Blocking threshold is `CRITICAL,HIGH`; everything else is informational in the step summary only, with a stated SLA (CRITICAL 7d / HIGH 30d / MEDIUM 90d / LOW next routine bump) that nothing enforces automatically.
- There is no deploy workflow and no publish step: the artifact is a green `main` sha, and consumers (`web`, `mobile`, `agent-runner`) bump `github:tactical-agent-neural-knowledge/sdk-ts#<sha>` in their own `package.json`.
- Because there is no registry publish, nothing in `ci.yml` needs an npm token; `security.yml` needs none either — gitleaks and trivy binaries are fetched by pinned version over HTTPS, not via an action with credentials.
- `../bin/ci-wait sdk-ts [sha]` is the sanctioned way to wait on a run (`CLAUDE.md` command vocabulary); `gh` is scoped with `--repo` because this repo has no cloud identity.
- Node and pnpm versions in `ci.yml` must track `engines.node` (`>=24`) and `packageManager` (`pnpm@11.9.0`) in `package.json`; the React/jsdom suites are the part that actually breaks on an older Node.

## Verified

(none — this sandbox has no network access and no `node_modules`; `pnpm install` fails with `ENETUNREACH`/`ETIMEDOUT`, so lint/typecheck could not be run here)
