import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { fromJson, type JsonValue } from "@bufbuild/protobuf";
import { act, create, type ReactTestInstance, type ReactTestRenderer } from "react-test-renderer";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { actions, blocks, header, normalizeBlocks, rt, section } from "../blocks/index.js";
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
    press(byTestId(r.root, "action-reject"));
    expect(seen).toEqual([
      { blockId: "b3", actionId: "approve", value: "gate_01J8ZX" },
      { blockId: "b3", actionId: "reject", value: "gate_01J8ZX" },
    ]);
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
