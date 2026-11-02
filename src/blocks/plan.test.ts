import { describe, expect, it } from "vitest";
import { StepStatus } from "../contracts/tank/blocks/v1/blocks_pb.js";
import { planFileName, planMarkdown, planTitle } from "./plan.js";

const plan = {
  summary:
    "Move billing to Stripe. Subscriptions and invoices come from Stripe; the old tables are read-only.",
  steps: [
    { title: "Add the Stripe client", status: StepStatus.DONE, files: ["internal/billing/stripe.go"] },
    { title: "Backfill customers", status: StepStatus.RUNNING, files: [] },
    { title: "Drop the cron", status: StepStatus.SKIPPED, files: [] },
    { title: "Cut over", status: StepStatus.FAILED, files: [] },
  ],
  risks: ["Webhooks arrive out of order"],
  questions: ["Keep the old invoices visible?"],
  approverIds: ["42", "7"],
  planHash: "ab12cd34",
  version: 2,
  guardrails: [
    { text: "One pull request per repository", state: "met", quote: "" },
    { text: "Phase 0 lands first", state: "violated", quote: "step 2 starts before step 1 merges" },
  ],
};

// Robby, 2026-11-02: a plan TANK makes can be downloaded or added to Atlas.
describe("planMarkdown", () => {
  it("writes the plan as a document Atlas reads: title heading, summary, checklist, sections", () => {
    const f = planMarkdown(plan, (id) => (id === "42" ? "Robby" : undefined));
    expect(f.title).toBe("Move billing to Stripe");
    expect(f.name).toBe("plan-move-billing-to-stripe.md");
    expect(f.markdown).toBe(
      [
        "# Move billing to Stripe",
        "",
        "_Plan v2 · ab12cd34_",
        "",
        "Move billing to Stripe. Subscriptions and invoices come from Stripe; the old tables are read-only.",
        "",
        "## Steps",
        "",
        "- [x] Add the Stripe client",
        "  - `internal/billing/stripe.go`",
        "- [ ] Backfill customers",
        "- [x] Drop the cron (skipped)",
        "- [ ] Cut over (failed)",
        "",
        "## Risks",
        "",
        "- Webhooks arrive out of order",
        "",
        "## Questions",
        "",
        "- Keep the old invoices visible?",
        "",
        "## Guardrails",
        "",
        "- One pull request per repository (met)",
        "- Phase 0 lands first (conflict): “step 2 starts before step 1 merges”",
        "",
        "Approvers: Robby, 7",
        "",
      ].join("\n"),
    );
  });

  it("leaves out what the plan does not have", () => {
    const f = planMarkdown({
      ...plan,
      steps: [],
      risks: [],
      questions: [],
      approverIds: [],
      guardrails: [],
      planHash: "",
    });
    expect(f.markdown).not.toContain("##");
    expect(f.markdown).not.toContain("Approvers");
    expect(f.markdown).toContain("_Plan v2_");
  });
});

describe("planTitle", () => {
  it("takes the first sentence, cuts a long one at a word, and falls back to Plan", () => {
    expect(planTitle({ summary: "" })).toBe("Plan");
    expect(planTitle({ summary: "Ship it!\nThen rest." })).toBe("Ship it");
    const long = planTitle({
      summary:
        "Introduce a token-bucket limiter in the gateway, keyed by principal, with a 429 and Retry-After response and a metric per route",
    });
    expect(long.length).toBeLessThanOrEqual(81);
    expect(long.endsWith("…")).toBe(true);
    expect(long).not.toMatch(/\s…$/);
  });
});

describe("planFileName", () => {
  it("keeps six words and never says plan twice", () => {
    expect(planFileName("Plan the Q4 launch")).toBe("plan-the-q4-launch.md");
    expect(planFileName("Rename Treads in every client, web & mobile, today")).toBe(
      "plan-rename-treads-in-every-client-web.md",
    );
    expect(planFileName("…")).toBe("plan.md");
  });
});
