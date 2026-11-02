import { describe, expect, it } from "vitest";
import { codeFileName, codeFileType, fenceFileName } from "./codefile.js";

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
  it("keeps a file's own name when the fence is one", () => {
    expect(fenceFileName("release-notes.md")).toBe("release-notes.md");
    expect(codeFileName("release-notes.md")).toBe("release-notes.md");
    expect(fenceFileName("markdown")).toBeNull();
    expect(fenceFileName("../etc/passwd")).toBeNull();
    expect(fenceFileName("c++")).toBeNull();
  });
});
