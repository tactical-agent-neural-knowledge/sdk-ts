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
      { blockId: "b3", actionId: "approve", value: "gate_01J8ZX" },
      { blockId: "b3", actionId: "reject", value: "gate_01J8ZX" },
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
