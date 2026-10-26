import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { fromJson, type JsonValue } from "@bufbuild/protobuf";
import { ThemeProvider } from "@mui/material/styles";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { actions, blocks, header, normalizeBlocks } from "../blocks/index.js";
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
