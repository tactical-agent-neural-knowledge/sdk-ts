import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { fromJson, type JsonValue, toJson } from "@bufbuild/protobuf";
import { describe, expect, it } from "vitest";
import { BlocksSchema } from "../contracts/tank/blocks/v1/blocks_pb.js";
import { FIXTURE_NAMES, fixtureDefs } from "../test/fixture-defs.js";
import { actions, blocks, button, header, planCard, section, toolLog } from "./builders.js";
import { LIMITS, normalizeBlocks, truncate, validateBlocks } from "./normalize.js";
import { richText, richTextToPlain, rt } from "./richtext.js";

const FIXTURES_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "fixtures");

describe("golden fixtures", () => {
  it("there are eight", () => {
    expect(FIXTURE_NAMES).toEqual([
      "plan",
      "diff",
      "ci-green",
      "ci-red",
      "approval",
      "tool-log",
      "status",
      "file",
    ]);
  });

  it.each(FIXTURE_NAMES)(
    "%s: builders reproduce fixtures/%s.json, which validates and normalizes to itself",
    (name) => {
      const built = fixtureDefs[name]!();
      const json = toJson(BlocksSchema, built);
      const file = join(FIXTURES_DIR, `${name}.json`);
      if (process.env.UPDATE_FIXTURES) {
        mkdirSync(FIXTURES_DIR, { recursive: true });
        writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
      }
      expect(existsSync(file), `missing ${file}; run UPDATE_FIXTURES=1 pnpm test`).toBe(true);
      const onDisk = JSON.parse(readFileSync(file, "utf8")) as JsonValue;
      expect(json).toEqual(onDisk);
      const parsed = fromJson(BlocksSchema, onDisk);
      expect(validateBlocks(parsed)).toEqual([]);
      // Fixtures are authored without block ids; normalizing fills them and is then stable.
      const once = normalizeBlocks(parsed);
      expect(once.blocks.every((b) => b.blockId !== "")).toBe(true);
      expect(normalizeBlocks(once)).toEqual(once);
    },
  );
});

describe("normalizeBlocks", () => {
  it("fills block ids by position and de-duplicates explicit ones", () => {
    const out = normalizeBlocks([header("a"), header("b", "x"), header("c", "x"), header("d")]);
    expect(out.blocks.map((b) => b.blockId)).toEqual(["b1", "x", "x_2", "b4"]);
  });
  it("truncates long strings with an ellipsis and caps arrays", () => {
    const long = "x".repeat(LIMITS.headerText + 50);
    const many = Array.from({ length: LIMITS.buttons + 5 }, (_, i) =>
      button({ actionId: `a${i}`, text: `b${i}` }),
    );
    const out = normalizeBlocks([
      header(long),
      actions(many),
      section({ text: "y".repeat(LIMITS.textElement + 1) }),
    ]);
    const h = out.blocks[0]!.kind;
    expect(h.case === "header" && h.value.text.length).toBe(LIMITS.headerText);
    expect(h.case === "header" && h.value.text.endsWith("…")).toBe(true);
    const a = out.blocks[1]!.kind;
    expect(a.case === "actions" && a.value.buttons.length).toBe(LIMITS.buttons);
    const s = out.blocks[2]!.kind;
    const el = s.case === "section" ? s.value.text?.blocks[0]?.kind : undefined;
    expect(
      el?.case === "section" &&
        el.value.elements[0]?.kind.case === "text" &&
        el.value.elements[0].kind.value.text.length,
    ).toBe(LIMITS.textElement);
  });
  it("keeps the tail of a tool log and drops kind-less blocks", () => {
    const recent = Array.from({ length: 30 }, (_, i) => ({ at: i, tool: "t", summary: `s${i}` }));
    const out = normalizeBlocks([
      toolLog({ phase: "p", recent }),
      { $typeName: "tank.blocks.v1.Block", blockId: "", kind: { case: undefined } },
    ]);
    expect(out.blocks).toHaveLength(1);
    const k = out.blocks[0]!.kind;
    expect(k.case === "toolLog" && k.value.recent.length).toBe(LIMITS.toolLogRecent);
    expect(k.case === "toolLog" && k.value.recent[0]?.summary).toBe("s10");
  });
  it("caps the block count", () => {
    const out = normalizeBlocks(Array.from({ length: LIMITS.blocks + 3 }, () => header("h")));
    expect(out.blocks).toHaveLength(LIMITS.blocks);
  });
  it("truncate is a no-op under the limit", () => {
    expect(truncate("abc", 3)).toBe("abc");
    expect(truncate("abcd", 3)).toBe("ab…");
  });
});

describe("validateBlocks", () => {
  it("reports missing kinds, empty headers, buttons without action or url, duplicate ids", () => {
    const issues = validateBlocks(
      blocks(
        header(""),
        { $typeName: "tank.blocks.v1.Block", blockId: "dup", kind: { case: undefined } },
        actions([{ text: "no action" }], "dup"),
        planCard({ summary: "ok", steps: [{ id: "", title: "t" }] }),
      ),
    );
    expect(issues.map((i) => i.path)).toEqual([
      "blocks[0].header.text",
      "blocks[1].kind",
      "blocks[2].block_id",
      "blocks[2].actions.buttons[0].action_id",
      "blocks[3].plan_card.steps[0].id",
    ]);
  });
  it("accepts a link button without action_id", () => {
    expect(validateBlocks([actions([{ text: "Open", url: "https://example.com" }])])).toEqual([]);
  });
});

describe("richText", () => {
  it("builds from strings and elements and projects to plain text", () => {
    const r = richText([
      rt.text("Hi "),
      rt.user("u1"),
      rt.text(", see "),
      rt.link("https://x", "this"),
      rt.emoji("tada", "🎉"),
    ]);
    expect(richTextToPlain(r)).toBe("Hi @u1, see this🎉");
    expect(richTextToPlain(richText("plain"))).toBe("plain");
  });
});
