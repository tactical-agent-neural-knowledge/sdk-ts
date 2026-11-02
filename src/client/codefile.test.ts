import { describe, expect, it } from "vitest";
import { codeFileName, codeFileType } from "./codefile.js";

describe("codeFileName", () => {
  it("names a block by its language, plain text when unknown", () => {
    expect(codeFileName("markdown")).toBe("neural.md");
    expect(codeFileName("Python")).toBe("neural.py");
    expect(codeFileName("yml")).toBe("neural.yaml");
    expect(codeFileName("dockerfile")).toBe("Dockerfile");
    expect(codeFileName("")).toBe("neural.txt");
    expect(codeFileName("brainfuck")).toBe("neural.txt");
    expect(codeFileType("neural.md")).toBe("text/markdown");
    expect(codeFileType("neural.py")).toBe("text/plain");
  });
});
