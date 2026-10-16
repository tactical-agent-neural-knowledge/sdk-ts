import { describe, expect, it } from "vitest";
import { previewable } from "./previewable.js";

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
