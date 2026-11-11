import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { fromJson, type JsonValue } from "@bufbuild/protobuf";
import { act, create, type ReactTestInstance, type ReactTestRenderer } from "react-test-renderer";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  actions,
  approvalPrompt,
  blocks,
  header,
  normalizeBlocks,
  planCard,
  rt,
  section,
} from "../blocks/index.js";
import { BlocksSchema } from "../contracts/tank/blocks/v1/blocks_pb.js";
import { FIXTURE_NAMES } from "../test/fixture-defs.js";
import { alerts, opened } from "../test/mocks/react-native.js";
import { BlocksViewNative } from "./BlocksViewNative.js";

const FIXTURES_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "fixtures");
const load = (name: string) =>
  normalizeBlocks(
    fromJson(BlocksSchema, JSON.parse(readFileSync(join(FIXTURES_DIR, `${name}.json`), "utf8")) as JsonValue),
  );

let tree: ReactTestRenderer | undefined;
function render(el: React.ReactElement): ReactTestRenderer {
  act(() => {
    tree = create(el);
  });
  return tree!;
}
/** Host element (string type) with this testID; component wrappers carrying the same props are skipped. */
const byTestId = (root: ReactTestInstance, id: string) =>
  root.find((n) => typeof n.type === "string" && n.props.testID === id);
const hostTestIds = (root: ReactTestInstance, prefix: string) =>
  root.findAll(
    (n) =>
      typeof n.type === "string" && typeof n.props.testID === "string" && n.props.testID.startsWith(prefix),
  );
const textOf = (inst: ReactTestInstance): string =>
  inst.children.map((c) => (typeof c === "string" ? c : textOf(c))).join("");
const press = (inst: ReactTestInstance) => act(() => (inst.props as { onPress: () => void }).onPress());

beforeEach(() => {
  alerts.length = 0;
  opened.length = 0;
});
afterEach(() => {
  act(() => tree?.unmount());
  tree = undefined;
});

describe("BlocksViewNative fixtures", () => {
  it.each(FIXTURE_NAMES)("renders %s and matches its snapshot", (name) => {
    const card = load(name);
    const r = render(<BlocksViewNative blocks={card} formatTime={(ms) => new Date(ms).toISOString()} />);
    expect(byTestId(r.root, "blocks")).toBeDefined();
    expect(hostTestIds(r.root, "block-").length).toBe(card.blocks.length);
    expect(r.toJSON()).toMatchSnapshot();
  });

  it("uses the brand accents: purple for agent cards, amber for approvals and red CI, cyan for running CI", () => {
    const paper = { agent: "#6200EA", alert: "#FFC107", ai: "#00E5FF" };
    const stripe = (name: string, accent: keyof typeof paper) =>
      (
        byTestId(render(<BlocksViewNative blocks={load(name)} />).root, `card-${accent}`).props
          .style as Array<Record<string, string>>
      )[1]!.borderLeftColor;
    expect(stripe("plan", "agent")).toBe(paper.agent);
    expect(stripe("approval", "alert")).toBe(paper.alert);
    expect(stripe("ci-red", "alert")).toBe(paper.alert);
    expect(stripe("ci-green", "agent")).toBe(paper.agent);
    const red = render(<BlocksViewNative blocks={load("ci-red")} />);
    expect(red.root.findAllByProps({ testID: "check-failure" }).length).toBeGreaterThan(0);
  });
});

describe("interactions", () => {
  it("buttons post BlockAction events with the block id", () => {
    const seen: unknown[] = [];
    const r = render(
      <BlocksViewNative
        blocks={normalizeBlocks(
          blocks(
            header("h"),
            actions([{ actionId: "go", text: "Go", value: "v1", style: "primary" }], "act"),
          ),
        )}
        onAction={(a) => seen.push(a)}
      />,
    );
    press(byTestId(r.root, "action-go"));
    expect(seen).toEqual([{ blockId: "act", actionId: "go", value: "v1" }]);
  });

  it("approval prompts fire approve/reject with the gate id", () => {
    const seen: unknown[] = [];
    const r = render(<BlocksViewNative blocks={load("approval")} onAction={(a) => seen.push(a)} />);
    press(byTestId(r.root, "action-approve"));
    // A tap locks the card until it comes back decided: a second tap sends nothing.
    press(byTestId(r.root, "action-approve"));
    press(byTestId(r.root, "action-reject"));
    expect(seen).toEqual([{ blockId: "b3", actionId: "gate.approve", value: "gate_01J8ZX" }]);
    const r2 = render(<BlocksViewNative blocks={load("approval")} onAction={(a) => seen.push(a)} />);
    press(byTestId(r2.root, "action-reject"));
    expect(seen[1]).toEqual({ blockId: "b3", actionId: "gate.request_changes", value: "gate_01J8ZX" });
  });

  it("a run's key card copies through the host once, never posts the action, and refuses after", async () => {
    const seen: unknown[] = [];
    const asked: string[] = [];
    let left = 1;
    const card = blocks(
      header("API key “Barn robot” created"),
      actions([{ actionId: "neural.key.reveal", text: "Copy key", value: "rv1", style: "primary" }], "key"),
    );
    const r = render(
      <BlocksViewNative
        blocks={card}
        onAction={(a) => seen.push(a)}
        revealKey={async (id) => {
          asked.push(id);
          return left-- > 0;
        }}
      />,
    );
    const button = () => byTestId(r.root, "action-neural.key.reveal");
    await act(async () => (button().props as { onPress: () => void }).onPress());
    expect(textOf(button())).toContain("Copied");
    expect(hostTestIds(r.root, "reveal-gone")).toHaveLength(0);
    await act(async () => (button().props as { onPress: () => void }).onPress());
    expect(textOf(byTestId(r.root, "reveal-gone"))).toBe("This key can no longer be shown.");
    expect(asked).toEqual(["rv1"]);
    expect(seen).toEqual([]);
    // Somebody else's app, or one with no way to copy: the same sentence.
    const other = render(<BlocksViewNative blocks={card} />);
    await act(async () =>
      (byTestId(other.root, "action-neural.key.reveal").props as { onPress: () => void }).onPress(),
    );
    expect(textOf(byTestId(other.root, "reveal-gone"))).toBe("This key can no longer be shown.");
  });

  it("a gate can name its buttons and say what approving does", () => {
    const seen: unknown[] = [];
    const r = render(
      <BlocksViewNative
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
      />,
    );
    expect(textOf(byTestId(r.root, "approval-detail"))).toBe("Apps using it stop working right away.");
    expect(textOf(byTestId(r.root, "action-approve"))).toContain("Revoke");
    expect(textOf(byTestId(r.root, "action-reject"))).toContain("Keep");
    expect(textOf(r.root)).not.toContain("approval needed");
    press(byTestId(r.root, "action-reject"));
    expect(seen).toEqual([{ blockId: expect.any(String), actionId: "gate.request_changes", value: "g9" }]);
  });

  it("confirm buttons go through Alert and fire only on confirm", () => {
    const seen: unknown[] = [];
    const r = render(<BlocksViewNative blocks={load("status")} onAction={(a) => seen.push(a)} />);
    press(byTestId(r.root, "action-run.stop"));
    expect(seen).toEqual([]);
    expect(alerts).toHaveLength(1);
    expect(alerts[0]?.title).toBe("Stop this run?");
    act(() => alerts[0]?.buttons?.[1]?.onPress?.());
    expect(seen).toEqual([{ blockId: "b4", actionId: "run.stop", value: "run_01J8" }]);
  });

  it("an approved merge still links to its pull request", () => {
    const url = "https://github.com/edero-io/edero-app-v3/pull/20";
    const openedHere: string[] = [];
    const r = render(
      <BlocksViewNative
        blocks={blocks([
          approvalPrompt({ gateId: "g1", kind: "merge", subject: url, decided: true, decision: "approved" }),
        ])}
        openUrl={(u) => openedHere.push(u)}
      />,
    );
    press(hostTestIds(r.root, "link-")[0]!);
    expect(openedHere).toEqual([url]);
  });

  it("url buttons and links open through `openUrl` (default: Linking.openURL)", () => {
    const openedHere: string[] = [];
    const r = render(<BlocksViewNative blocks={load("ci-green")} openUrl={(u) => openedHere.push(u)} />);
    const links = hostTestIds(r.root, "link-");
    expect(links.length).toBeGreaterThan(0);
    press(links[0]!);
    expect(openedHere).toHaveLength(1);
    const d = render(<BlocksViewNative blocks={load("ci-green")} />);
    press(hostTestIds(d.root, "link-")[0]!);
    expect(opened).toHaveLength(1);
  });

  it("resolves @user and #channel mentions and renders nothing for empty input", () => {
    const r = render(
      <BlocksViewNative
        blocks={normalizeBlocks(
          blocks(section({ text: [rt.user("u1"), rt.text(" in "), rt.channel("c1")] })),
        )}
        resolveUser={(id) => (id === "u1" ? "Ada" : undefined)}
        resolveChannel={() => "ops"}
      />,
    );
    expect(textOf(byTestId(r.root, "mention-user-u1"))).toBe("@Ada");
    expect(textOf(byTestId(r.root, "mention-channel-c1"))).toBe("#ops");
    const empty = render(<BlocksViewNative blocks={undefined} />);
    expect(empty.toJSON()).toBeNull();
  });
});

// Robby, 2026-10-25: the same glance and tap-to-toggle on the phone.
describe("plan card at a glance (native)", () => {
  it("shows a to-do list with TANK marks, and toggles to the whole plan and back on a press", () => {
    const r = render(<BlocksViewNative blocks={load("plan")} />);
    const all = () => textOf(r.root);
    expect(textOf(byTestId(r.root, "plan-glance"))).toContain("Add limiter middleware");
    expect(
      r.root.findAll((n) => n.props.testID === "mark-done" && typeof n.type === "string").length,
    ).toBeGreaterThan(0);
    expect(
      r.root.findAll((n) => n.props.testID === "mark-doing" && typeof n.type === "string").length,
    ).toBeGreaterThan(0);
    expect(all()).not.toMatch(/[\u2705\u{1F504}\u2B1C\u274C]/u);
    expect(all()).toContain("1/4");
    expect(all()).not.toContain("token-bucket limiter");
    press(byTestId(r.root, "plan-glance"));
    expect(all()).toContain("token-bucket limiter");
    expect(all()).toContain("Should bots get a separate, higher budget?");
    press(byTestId(r.root, "plan-detail"));
    expect(all()).not.toContain("token-bucket limiter");
  });
});

// Robby, 2026-11-02: Download and Add to Atlas on the phone's plan card too.
describe("plan card file actions (native)", () => {
  it("offers Download and Add to Atlas, each handed the plan as Markdown", async () => {
    const got: string[] = [];
    const r = render(
      <BlocksViewNative
        blocks={load("plan")}
        planFile={{
          download: (f) => void got.push(`save ${f.name}`),
          addToAtlas: (f) => void got.push(`atlas ${f.title}`),
        }}
      />,
    );
    press(byTestId(r.root, "plan-download"));
    // Add to Atlas is async (it shows a spinner while the page is made): await its act.
    await act(async () => {
      await (byTestId(r.root, "plan-atlas").props as { onPress: () => Promise<void> }).onPress();
    });
    expect(got[0]).toMatch(/^save plan-introduce-a-token-bucket-limiter.*\.md$/);
    expect(got[1]).toMatch(/^atlas Introduce a token-bucket limiter/);
  });

  it("shows no buttons when the host offers none", () => {
    const r = render(<BlocksViewNative blocks={load("plan")} />);
    expect(hostTestIds(r.root, "plan-file")).toHaveLength(0);
  });
});

// Guardrails phase 1, the native half: the plan's checks, and a gate with no Approve.
describe("guardrails", () => {
  it("the plan card lists each guardrail's check and a guardrail gate offers change, resume and stop", () => {
    const plan = render(
      <BlocksViewNative
        blocks={blocks([
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
                text: "Phase 0 lands first",
                state: "violated",
                quote: "step 2: Phase 1.1",
                judged: true,
              },
            ],
          }),
        ])}
      />,
    );
    expect(hostTestIds(plan.root, "guardrail-").map((n) => n.props.testID)).toEqual([
      "guardrail-met",
      "guardrail-violated",
    ]);
    const seen: { actionId: string; value: string }[] = [];
    const r = render(
      <BlocksViewNative
        blocks={blocks([
          approvalPrompt({
            gateId: "g9",
            kind: "guardrail",
            subject: "x",
            guardrailId: "17",
            guardrailText: "One pull request per repository",
            blocker: "About to open a second pull request",
          }),
        ])}
        onAction={(a) => seen.push(a)}
      />,
    );
    expect(r.root.findAll((n) => n.props.testID === "action-approve").length).toBe(0);
    press(byTestId(r.root, "action-change-guardrail"));
    press(byTestId(r.root, "action-resume"));
    press(byTestId(r.root, "action-stop"));
    expect(seen.map((a) => `${a.actionId}:${a.value}`)).toEqual([
      "guardrail.change:17",
      "gate.approve:g9",
      "gate.request_changes:g9",
    ]);
  });
});
