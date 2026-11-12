import { Code, ConnectError } from "@connectrpc/connect";
import { describe, expect, it } from "vitest";
import { appendDictation, formatElapsed, VOICE_COPY, voiceErrorText } from "./voice.js";

describe("voice input", () => {
  it("shows elapsed time as m:ss", () => {
    expect(formatElapsed(0)).toBe("0:00");
    expect(formatElapsed(7_400)).toBe("0:07");
    expect(formatElapsed(72_000)).toBe("1:12");
    expect(formatElapsed(-5)).toBe("0:00");
  });

  it("puts the words after the draft with one space", () => {
    expect(appendDictation("", " hello there ")).toBe("hello there");
    expect(appendDictation("Dear Sam,", "thanks")).toBe("Dear Sam, thanks");
    expect(appendDictation("Dear Sam, ", "thanks")).toBe("Dear Sam, thanks");
    expect(appendDictation("keep", "  ")).toBe("keep");
  });

  it("never shows the server's own words", () => {
    const raw = "media answered 500: CUDA out of memory";
    expect(voiceErrorText(new ConnectError(raw, Code.Internal))).toBe(VOICE_COPY.failed);
    expect(voiceErrorText(new ConnectError(raw, Code.ResourceExhausted))).toBe(VOICE_COPY.tooMany);
    expect(voiceErrorText(new ConnectError(raw, Code.Unavailable))).toBe(VOICE_COPY.unavailable);
    expect(voiceErrorText(new ConnectError("a recording is at most two minutes", Code.InvalidArgument))).toBe(
      VOICE_COPY.tooLong,
    );
    expect(voiceErrorText(new Error(raw))).toBe(VOICE_COPY.failed);
    for (const s of Object.values(VOICE_COPY)) expect(s).not.toMatch(/whisper|vllm|error \d|undefined/i);
  });
});
