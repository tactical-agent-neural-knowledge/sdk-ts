import {
  actions,
  approvalPrompt,
  blocks,
  ciStatus,
  context,
  diffPreview,
  divider,
  filePreview,
  header,
  planCard,
  section,
  statusCard,
  toolLog,
} from "../blocks/builders.js";
import { codeBlock, rt } from "../blocks/richtext.js";
import type { Blocks } from "../contracts/tank/blocks/v1/blocks_pb.js";

const T0 = Date.UTC(2026, 8, 18, 12, 0, 0); // 2026-09-18T12:00:00Z, fixed so goldens are stable

/** The eight golden cards, keyed by fixture file name. */
export const fixtureDefs: Record<string, () => Blocks> = {
  plan: () =>
    blocks(
      header("Plan: add rate limiting to /v1/messages"),
      planCard({
        summary:
          "Introduce a token-bucket limiter in the gateway, keyed by principal, with a 429 + Retry-After response and a metric per route.",
        steps: [
          {
            id: "s1",
            title: "Add limiter middleware in internal/gateway/limit.go",
            status: "done",
            files: ["internal/gateway/limit.go"],
          },
          {
            id: "s2",
            title: "Wire per-route budgets from config",
            status: "running",
            files: ["internal/config/config.go", "deploy/values.yaml"],
          },
          { id: "s3", title: "Emit tank_gateway_ratelimited_total", status: "pending" },
          {
            id: "s4",
            title: "Integration test: burst then recover",
            status: "pending",
            files: ["internal/gateway/limit_test.go"],
          },
        ],
        risks: [
          "Shared Valkey hop adds ~1ms p99 to every message post",
          "Bots with legit bursts (CI notifiers) may trip the limit",
        ],
        questions: ["Should bots get a separate, higher budget?"],
        approverIds: ["u_robby"],
        planHash: "9f3c1d2e",
        version: 2,
      }),
      actions([
        { actionId: "plan.approve", text: "Approve plan", value: "9f3c1d2e", style: "primary" },
        { actionId: "plan.request_changes", text: "Request changes", value: "9f3c1d2e" },
      ]),
      context([
        [
          rt.text("Agent run "),
          rt.code("run_01J8"),
          rt.text(" · plan v2 · "),
          rt.link("https://app.tank.chat/w/tank/runs/run_01J8", "open run panel"),
        ],
      ]),
    ),

  diff: () =>
    blocks(
      header("Pushed 2 commits to feat/rate-limit"),
      diffPreview({
        commitSha: "a1b2c3d4e5f6",
        compareUrl: "https://github.com/tactical-agent-neural-knowledge/api/compare/main...feat/rate-limit",
        files: [
          {
            path: "internal/gateway/limit.go",
            additions: 88,
            deletions: 0,
            hunkPreview:
              "@@ -0,0 +1,20 @@\n+package gateway\n+\n+type Limiter struct {\n+\tbuckets map[string]*bucket\n+}\n+\n+func (l *Limiter) Allow(principal string) bool {",
          },
          {
            path: "internal/gateway/server.go",
            additions: 6,
            deletions: 1,
            hunkPreview:
              '@@ -41,7 +41,12 @@\n-\th.ServeHTTP(w, r)\n+\tif !s.limiter.Allow(p.ID) {\n+\t\tw.Header().Set("Retry-After", "1")',
          },
          { path: "internal/gateway/limit_test.go", additions: 54, deletions: 0, hunkPreview: "" },
        ],
      }),
      context([[rt.text("Branch "), rt.code("feat/rate-limit"), rt.text(" · +148 −1 across 3 files")]]),
    ),

  "ci-green": () =>
    blocks(
      ciStatus({
        headSha: "a1b2c3d4e5f6",
        prUrl: "https://github.com/tactical-agent-neural-knowledge/api/pull/42",
        prNumber: 42,
        checks: [
          {
            name: "lint",
            state: "success",
            url: "https://github.com/tactical-agent-neural-knowledge/api/actions/runs/1",
          },
          {
            name: "test",
            state: "success",
            url: "https://github.com/tactical-agent-neural-knowledge/api/actions/runs/1",
          },
          {
            name: "docker-ecr / api",
            state: "success",
            url: "https://github.com/tactical-agent-neural-knowledge/api/actions/runs/1",
          },
        ],
      }),
      actions([{ actionId: "merge.approve", text: "Approve merge", value: "42", style: "primary" }]),
    ),

  "ci-red": () =>
    blocks(
      ciStatus({
        headSha: "f6e5d4c3b2a1",
        prUrl: "https://github.com/tactical-agent-neural-knowledge/api/pull/42",
        prNumber: 42,
        checks: [
          {
            name: "lint",
            state: "success",
            url: "https://github.com/tactical-agent-neural-knowledge/api/actions/runs/2",
          },
          {
            name: "test",
            state: "failure",
            url: "https://github.com/tactical-agent-neural-knowledge/api/actions/runs/2",
            failureExcerpt:
              "--- FAIL: TestLimiter_Burst (0.01s)\n    limit_test.go:41: expected 429 after 100 requests, got 200\nFAIL\nFAIL\tgithub.com/tactical-agent-neural-knowledge/api/internal/gateway\t0.113s",
          },
          { name: "docker-ecr / api", state: "cancelled" },
        ],
      }),
      section({
        text: [rt.text("Fixing the failing test and pushing again. ")],
        fields: [{ label: "Attempt", value: "2 of 3" }],
      }),
    ),

  approval: () =>
    blocks(
      header("Deploy api@a1b2c3d to prod?"),
      section({
        text: "The change adds rate limiting to the gateway. Rollout is a rolling update behind ArgoCD; rollback is one revert.",
        fields: [
          { label: "Gate", value: "deploy" },
          { label: "Requested by", value: "@u_agent_tank" },
        ],
      }),
      approvalPrompt({
        gateId: "gate_01J8ZX",
        kind: "deploy",
        subject: "api@a1b2c3d → prod",
        approverIds: ["u_robby", "u_ops"],
        minApprovals: 1,
        expiresAt: T0 + 30 * 60 * 1000,
      }),
    ),

  "tool-log": () =>
    blocks(
      toolLog({
        phase: "implementing",
        toolCalls: 37,
        filesEdited: 4,
        runPanelUrl: "https://app.tank.chat/w/tank/runs/run_01J8",
        recent: [
          { at: T0 - 40_000, tool: "Read", summary: "internal/gateway/server.go", ok: true },
          { at: T0 - 31_000, tool: "Edit", summary: "internal/gateway/limit.go (+12 −3)", ok: true },
          { at: T0 - 20_000, tool: "Bash", summary: "go test ./internal/gateway/... (exit 1)", ok: false },
          { at: T0 - 8_000, tool: "Edit", summary: "internal/gateway/limit_test.go (+2 −2)", ok: true },
          { at: T0 - 1_000, tool: "Bash", summary: "go test ./internal/gateway/... (ok)", ok: true },
        ],
      }),
    ),

  status: () =>
    blocks(
      statusCard({
        runId: "run_01J8",
        state: "ci_watching",
        detail: "Waiting for 3 checks on PR #42",
        branch: "feat/rate-limit",
        costUsd: 1.37,
        startedAt: T0 - 14 * 60 * 1000,
        runPanelUrl: "https://app.tank.chat/w/tank/runs/run_01J8",
      }),
      divider(),
      section({ text: codeBlock("go test ./... \nok  \tinternal/gateway\t0.113s", "console") }),
      actions([
        {
          actionId: "run.stop",
          text: "Stop run",
          value: "run_01J8",
          style: "danger",
          confirm: { title: "Stop this run?", text: "The sandbox is destroyed; pushed commits stay." },
        },
      ]),
    ),

  file: () =>
    blocks(
      section("Coverage report for feat/rate-limit"),
      filePreview({
        fileId: "f_01J8COV",
        name: "coverage.html",
        mime: "text/html",
        size: 48_213,
        thumbnailUrl: "https://files.tank.chat/t/f_01J8COV/256.png",
      }),
      actions([{ text: "Download", url: "https://files.tank.chat/d/f_01J8COV" }]),
    ),
};

export const FIXTURE_NAMES = Object.keys(fixtureDefs);
