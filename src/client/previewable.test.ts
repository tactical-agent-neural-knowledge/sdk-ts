import { describe, expect, it } from "vitest";
import { framesAsPage, opensAsPage, previewable } from "./previewable.js";

describe("previewable", () => {
  it("names what a browser shows and refuses what would run", () => {
    for (const m of [
      "application/pdf",
      "image/png",
      "image/jpeg; charset=binary",
      "video/mp4",
      "audio/mpeg",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]) {
      expect(previewable(m), m).toBe(true);
    }
    for (const m of [
      undefined,
      "",
      "application/octet-stream",
      "text/html",
      "image/svg+xml",
      "application/zip",
    ]) {
      expect(previewable(m), String(m)).toBe(false);
    }
  });
});

describe("opensAsPage", () => {
  it("opens web pages and drawings as pages, and nothing else", () => {
    expect(opensAsPage("text/html; charset=utf-8")).toBe(true);
    expect(opensAsPage("application/xhtml+xml")).toBe(true);
    expect(opensAsPage("image/svg+xml")).toBe(true);
    expect(opensAsPage("application/pdf")).toBe(false);
    expect(opensAsPage("text/xml")).toBe(false);
    expect(opensAsPage(undefined)).toBe(false);
  });
});

describe("framesAsPage", () => {
  it("runs pages, PDFs, media and Markdown in a Blueprint frame, and not archives", () => {
    for (const m of [
      "text/html",
      "image/svg+xml",
      "application/pdf",
      "video/mp4",
      "audio/mpeg",
      "text/markdown",
    ])
      expect(framesAsPage(m)).toBe(true);
    expect(framesAsPage("text/plain", "README.md")).toBe(true);
    for (const name of ["q3.csv", "main.go", "analysis.ipynb", "flow.mmd"])
      expect(framesAsPage("application/octet-stream", name)).toBe(true);
    expect(framesAsPage("application/zip", "a.zip")).toBe(false);
  });
});
