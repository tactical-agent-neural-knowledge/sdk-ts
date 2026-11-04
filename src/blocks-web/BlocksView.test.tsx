import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { fromJson, type JsonValue } from "@bufbuild/protobuf";
import { ThemeProvider } from "@mui/material/styles";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { actions, approvalPrompt, blocks, header, normalizeBlocks, planCard } from "../blocks/index.js";
import { BlocksSchema } from "../contracts/tank/blocks/v1/blocks_pb.js";
import { FIXTURE_NAMES } from "../test/fixture-defs.js";
import { BlocksView } from "./BlocksView.js";
import { tankTheme } from "./theme.js";

const FIXTURES_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "fixtures");
const load = (name: string) =>
  normalizeBlocks(
    fromJson(BlocksSchema, JSON.parse(readFileSync(join(FIXTURES_DIR, `${name}.json`), "utf8")) as JsonValue),
  );

afterEach(cleanup);

describe("BlocksView fixtures", () => {
  it.each(FIXTURE_NAMES)("renders %s and matches its snapshot", (name) => {
    const { container } = render(
      <ThemeProvider theme={tankTheme}>
        <BlocksView blocks={load(name)} formatTime={(ms) => new Date(ms).toISOString()} />
      </ThemeProvider>,
    );
    const root = container.querySelector("[data-blocks]");
    expect(root).not.toBeNull();
    expect(root?.querySelectorAll("[data-block-id]").length).toBe(load(name).blocks.length);
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("uses the brand accents: purple for agent cards, amber for approvals, cyan for running CI", () => {
    const { container: plan } = render(
      <ThemeProvider theme={tankTheme}>
        <BlocksView blocks={load("plan")} />
      </ThemeProvider>,
    );
    expect(plan.querySelector('[data-accent="agent"]')).not.toBeNull();
    cleanup();
    const { container: approval } = render(
      <ThemeProvider theme={tankTheme}>
        <BlocksView blocks={load("approval")} />
      </ThemeProvider>,
    );
    expect(approval.querySelector('[data-accent="alert"]')).not.toBeNull();
    cleanup();
    const { container: red } = render(
      <ThemeProvider theme={tankTheme}>
        <BlocksView blocks={load("ci-red")} />
      </ThemeProvider>,
    );
    expect(red.querySelector('[data-accent="alert"]')).not.toBeNull();
    expect(red.querySelector('[data-check-state="failure"]')).not.toBeNull();
  });
});

describe("interactions", () => {
  it("buttons post BlockAction events with the block id", () => {
    const seen: unknown[] = [];
    render(
      <ThemeProvider theme={tankTheme}>
        <BlocksView
          blocks={normalizeBlocks(
            blocks(
              header("h"),
              actions([{ actionId: "go", text: "Go", value: "v1", style: "primary" }], "act"),
            ),
          )}
          onAction={(a) => seen.push(a)}
        />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(seen).toEqual([{ blockId: "act", actionId: "go", value: "v1" }]);
  });

  it("approval prompts fire approve/reject with the gate id; decided ones show the decision", () => {
    const seen: unknown[] = [];
    render(
      <ThemeProvider theme={tankTheme}>
        <BlocksView blocks={load("approval")} onAction={(a) => seen.push(a)} />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    fireEvent.click(screen.getByRole("button", { name: "Reject" }));
    expect(seen).toEqual([
      { blockId: "b3", actionId: "gate.approve", value: "gate_01J8ZX" },
      { blockId: "b3", actionId: "gate.request_changes", value: "gate_01J8ZX" },
    ]);
  });

  it("a run's key card copies through the host once, never posts the action, and refuses after", async () => {
    const seen: unknown[] = [];
    const asked: string[] = [];
    let left = 1;
    render(
      <ThemeProvider theme={tankTheme}>
        <BlocksView
          blocks={blocks(
            header("API key “Barn robot” created"),
            actions(
              [{ actionId: "neural.key.reveal", text: "Copy key", value: "rv1", style: "primary" }],
              "key",
            ),
          )}
          onAction={(a) => seen.push(a)}
          revealKey={async (id) => {
            asked.push(id);
            return left-- > 0;
          }}
        />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Copy key" }));
    fireEvent.click(await screen.findByRole("button", { name: "Copied" }));
    expect((await screen.findByTestId("reveal-gone")).textContent).toBe("This key can no longer be shown.");
    expect(asked).toEqual(["rv1"]);
    expect(seen).toEqual([]);
  });

  it("a gate can name its buttons and say what approving does", () => {
    const seen: unknown[] = [];
    render(
      <ThemeProvider theme={tankTheme}>
        <BlocksView
          blocks={blocks([
            approvalPrompt({
              gateId: "g9",
              kind: "destructive_tool",
              subject: "Revoke API key “Barn robot”?",
              detail: "Apps using it stop working right away.",
              approveLabel: "Revoke",
              rejectLabel: "Keep",
            }),
          ])}
          onAction={(a) => seen.push(a)}
        />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("approval-detail").textContent).toBe("Apps using it stop working right away.");
    expect(screen.queryByText(/approval needed/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Revoke" }));
    fireEvent.click(screen.getByRole("button", { name: "Keep" }));
    expect(seen.map((a) => (a as { actionId: string }).actionId)).toEqual([
      "gate.approve",
      "gate.request_changes",
    ]);
  });

  it("a merge approval links to its pull request, before and after the decision", () => {
    const url = "https://github.com/edero-io/edero-app-v3/pull/20";
    for (const decided of [false, true]) {
      const { unmount } = render(
        <ThemeProvider theme={tankTheme}>
          <BlocksView
            blocks={blocks([
              approvalPrompt({
                gateId: "g1",
                kind: "merge",
                subject: url,
                decided,
                decision: decided ? "approved" : "",
              }),
            ])}
          />
        </ThemeProvider>,
      );
      expect(screen.getByTestId("approval-subject-link").getAttribute("href")).toBe(url);
      unmount();
    }
  });

  it("confirm buttons open a dialog and fire only on confirm", () => {
    const seen: unknown[] = [];
    render(
      <ThemeProvider theme={tankTheme}>
        <BlocksView blocks={load("status")} onAction={(a) => seen.push(a)} />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Stop run" }));
    expect(seen).toEqual([]);
    expect(screen.getByRole("dialog").textContent).toContain("Stop this run?");
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(seen).toEqual([{ blockId: "b4", actionId: "run.stop", value: "run_01J8" }]);
  });

  it("renders nothing for empty input", () => {
    const { container } = render(
      <ThemeProvider theme={tankTheme}>
        <BlocksView blocks={undefined} />
      </ThemeProvider>,
    );
    expect(container.innerHTML).toBe("");
  });
});

// Robby, 2026-10-25: a plan reads as marks and a to-do list; tapping the text shows the
// whole plan and tapping again goes back, no button. 2026-10-26: TANK's own marks, never emoji.
describe("plan card at a glance", () => {
  it("shows a to-do list with TANK marks, and toggles to the whole plan and back on a tap", () => {
    render(
      <ThemeProvider theme={tankTheme}>
        <BlocksView blocks={load("plan")} />
      </ThemeProvider>,
    );
    const glance = screen.getByTestId("plan-glance");
    const marks = Array.from(glance.querySelectorAll("li")).map((li) => [
      li.querySelector("svg")?.getAttribute("data-mark"),
      li.textContent,
    ]);
    const markOf = (title: string) => marks.find(([, text]) => text?.startsWith(title))?.[0];
    expect(markOf("Add limiter middleware")).toBe("done");
    expect(markOf("Wire per-route budgets")).toBe("doing");
    expect(markOf("Emit tank_gateway_ratelimited_total")).toBe("todo");
    expect(glance.textContent).not.toMatch(/[\u2705\u{1F504}\u2B1C\u274C]/u);
    expect(screen.getByText("1/4")).toBeTruthy();
    expect(screen.queryByText(/token-bucket limiter/)).toBeNull();
    expect(screen.queryByText("internal/gateway/limit.go")).toBeNull();
    expect(screen.queryByRole("button", { name: /show more|details/i })).toBeNull();

    fireEvent.click(glance);
    expect(screen.getByText(/token-bucket limiter/)).toBeTruthy();
    expect(screen.getByText("Should bots get a separate, higher budget?")).toBeTruthy();

    fireEvent.click(screen.getByTestId("plan-detail"));
    expect(screen.getByTestId("plan-glance")).toBeTruthy();
    expect(screen.queryByText(/token-bucket limiter/)).toBeNull();
  });
});

// Robby, 2026-11-02: a plan TANK makes can be downloaded or added to Atlas, from the glance
// and from the whole plan alike; with no actions given the card shows neither button.
describe("plan card file actions", () => {
  it("offers Download and Add to Atlas, each handed the plan as Markdown", async () => {
    const saved: { name: string; markdown: string }[] = [];
    const added: string[] = [];
    render(
      <ThemeProvider theme={tankTheme}>
        <BlocksView
          blocks={load("plan")}
          planFile={{
            download: (f) => void saved.push(f),
            addToAtlas: async (f) => void added.push(f.title),
          }}
        />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByTestId("plan-download"));
    expect(saved[0]?.name).toMatch(/^plan-introduce-a-token-bucket-limiter.*\.md$/);
    expect(saved[0]?.markdown).toContain("- [x] Add limiter middleware in internal/gateway/limit.go");
    fireEvent.click(screen.getByTestId("plan-glance"));
    fireEvent.click(screen.getByTestId("plan-atlas"));
    await screen.findByTestId("plan-atlas");
    expect(added).toHaveLength(1);
    // The buttons do not fold the plan away.
    expect(screen.getByTestId("plan-detail")).toBeTruthy();
  });

  it("shows no buttons when the host offers none", () => {
    render(
      <ThemeProvider theme={tankTheme}>
        <BlocksView blocks={load("plan")} />
      </ThemeProvider>,
    );
    expect(screen.queryByTestId("plan-file")).toBeNull();
  });
});

// Guardrails phase 1: a plan carries each guardrail's check, a conflict says why the plan
// cannot be approved, and a guardrail gate offers the only ways on: change it, resume once
// changed, or stop. Nothing is allowed once, so there is no Approve.
describe("guardrails", () => {
  it("the plan card lists each guardrail met or in conflict, with the quoted reason", () => {
    const b = blocks([
      planCard({
        summary: "Build it",
        guardrails: [
          {
            $typeName: "tank.blocks.v1.GuardrailCheck",
            guardrailId: "1",
            text: "One pull request per repository",
            state: "met",
            quote: "",
            judged: true,
          },
          {
            $typeName: "tank.blocks.v1.GuardrailCheck",
            guardrailId: "2",
            text: "Phase 0 lands before any other phase starts",
            state: "violated",
            quote: "step 2: Phase 1.1 buy-option links",
            judged: true,
          },
        ],
      }),
    ]);
    render(
      <ThemeProvider theme={tankTheme}>
        <BlocksView blocks={b} />
      </ThemeProvider>,
    );
    const list = screen.getByTestId("plan-guardrails");
    expect(list.querySelectorAll("[data-guardrail-state=met]").length).toBe(1);
    expect(list.querySelectorAll("[data-guardrail-state=violated]").length).toBe(1);
    expect(screen.getByText(/step 2: Phase 1.1 buy-option links/)).toBeTruthy();
    expect(screen.getByText(/cannot be approved as it is/)).toBeTruthy();
  });

  it("a guardrail gate offers change, resume and stop, never approve; a platform one only stop", () => {
    const seen: { actionId: string; value: string }[] = [];
    const b = blocks([
      approvalPrompt({
        gateId: "g9",
        kind: "guardrail",
        subject: "One pull request per repository",
        guardrailId: "17",
        guardrailText: "One pull request per repository",
        blocker: "About to open a second pull request in acme/app from agent/x",
      }),
    ]);
    render(
      <ThemeProvider theme={tankTheme}>
        <BlocksView blocks={b} onAction={(a) => seen.push(a)} />
      </ThemeProvider>,
    );
    expect(screen.queryByRole("button", { name: "Approve" })).toBeNull();
    expect(screen.getByTestId("guardrail-blocker").textContent).toMatch(/second pull request/);
    fireEvent.click(screen.getByRole("button", { name: "Change the guardrail" }));
    fireEvent.click(screen.getByRole("button", { name: "Resume the run" }));
    fireEvent.click(screen.getByRole("button", { name: "Stop the run" }));
    expect(seen).toEqual([
      { blockId: expect.any(String), actionId: "guardrail.change", value: "17" },
      { blockId: expect.any(String), actionId: "gate.approve", value: "g9" },
      { blockId: expect.any(String), actionId: "gate.request_changes", value: "g9" },
    ]);
    cleanup();
    render(
      <ThemeProvider theme={tankTheme}>
        <BlocksView
          blocks={blocks([
            approvalPrompt({
              gateId: "g1",
              kind: "guardrail",
              subject: "x",
              guardrailId: "platform:no-secrets",
            }),
          ])}
        />
      </ThemeProvider>,
    );
    expect(screen.queryByRole("button", { name: "Change the guardrail" })).toBeNull();
    expect(screen.getByRole("button", { name: "Stop the run" })).toBeTruthy();
  });
});
