import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")) as {
  name: string;
  exports: Record<string, string | Record<string, string>>;
};

const SUBPATHS = [
  ".",
  "./react",
  "./design",
  "./blocks",
  "./blocks-web",
  "./contracts",
  "./contracts/message",
];

function node(script: string, esm = false): string {
  return execFileSync(process.execPath, [...(esm ? ["--input-type=module"] : []), "-e", script], {
    cwd: ROOT,
    encoding: "utf8",
    env: { ...process.env, NODE_NO_WARNINGS: "1" },
  }).trim();
}

describe("package exports", () => {
  it("carry types, import and default (same ESM files) on every code subpath", () => {
    for (const [sub, entry] of Object.entries(pkg.exports)) {
      if (typeof entry === "string") continue;
      expect(Object.keys(entry), sub).toEqual(["types", "import", "default"]);
      expect(entry.default, sub).toBe(entry.import);
      expect(entry.types, sub).toMatch(/\.d\.ts$/);
    }
  });

  it("resolve through a CommonJS require (default condition) and through ESM import", () => {
    // A CJS `require.resolve` uses the conditions ["require", "node", "default"]: without `default`
    // Jest / jest-expo cannot find the subpaths without a moduleNameMapper.
    const cjs = JSON.parse(
      node(`
        const { createRequire } = require("node:module");
        const req = createRequire(${JSON.stringify(join(ROOT, "package.json"))});
        const out = {};
        for (const s of ${JSON.stringify(SUBPATHS)}) out[s] = req.resolve(${JSON.stringify(pkg.name)} + s.slice(1));
        console.log(JSON.stringify(out));
      `),
    ) as Record<string, string>;
    const esm = JSON.parse(
      node(
        `
        const out = {};
        for (const s of ${JSON.stringify(SUBPATHS)}) out[s] = import.meta.resolve(${JSON.stringify(pkg.name)} + s.slice(1));
        console.log(JSON.stringify(out));
      `,
        true,
      ),
    ) as Record<string, string>;
    for (const s of SUBPATHS) {
      const entry = pkg.exports[s === "./contracts/message" ? "./contracts/*" : s] as Record<string, string>;
      const expected = join(ROOT, entry.default!.replace("*", "message"));
      expect(cjs[s], `require ${s}`).toBe(expected);
      expect(fileURLToPath(esm[s]!), `import ${s}`).toBe(expected);
    }
  });

  it("load under require() (Node's require(esm)) so Jest-style consumers get real modules", () => {
    const out = node(`
      const { createRequire } = require("node:module");
      const req = createRequire(${JSON.stringify(join(ROOT, "package.json"))});
      const design = req(${JSON.stringify(`${pkg.name}/design`)});
      const blocks = req(${JSON.stringify(`${pkg.name}/blocks`)});
      const contracts = req(${JSON.stringify(`${pkg.name}/contracts/message`)});
      console.log([typeof design.brand, typeof blocks.normalizeBlocks, typeof contracts.ChatService].join(","));
    `);
    expect(out).toBe("object,function,object");
  });
});
