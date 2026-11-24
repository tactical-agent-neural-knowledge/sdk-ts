import { describe, expect, it } from "vitest";
import { replyWord, STATUS_WORDS, treadWord, typingWord } from "./statusWords.js";

describe("the status line's words", () => {
  it("are exactly the ones Robby chose", () => {
    expect(STATUS_WORDS).toEqual({
      listening: "Listening…",
      watching: "Watching…",
      planning: "Planning…",
      firing: "Neurons firing…",
      readingTread: "Reading the Tread…",
      readingChat: "Reading the chat…",
      searchingVault: "Searching the Vault…",
      searchingWeb: "Searching the web…",
      composing: "Composing…",
    });
  });

  it("follow the draft's real state while typing, and say nothing when nothing is happening", () => {
    expect(typingWord("quiet")).toBe("");
    expect(typingWord(undefined)).toBe("");
    expect(typingWord("heard")).toBe("Listening…");
    expect(typingWord("waking")).toBe("Listening…");
    expect(typingWord("reading")).toBe("Watching…");
    expect(typingWord("preparing")).toBe("Planning…");
  });

  it("start at the send and follow what a chat reply reports", () => {
    expect(replyWord(undefined, "chat")).toBe("Neurons firing…");
    expect(replyWord("sent", "tread")).toBe("Neurons firing…");
    expect(replyWord("started", "chat")).toBe("Reading the chat…");
    expect(replyWord("started", "tread")).toBe("Reading the Tread…");
    expect(replyWord("sorting", "chat")).toBe("Reading the chat…");
    expect(replyWord("searching", "chat")).toBe("Searching the web…");
    expect(replyWord("reading", "chat")).toBe("Searching the web…");
    expect(replyWord("writing", "chat")).toBe("Composing…");
    expect(replyWord("something new", "chat")).toBe("Neurons firing…");
  });

  it("name a Tread's live step when it is one of theirs, and leave any other line to be shown as it is", () => {
    expect(treadWord(undefined)).toBe("Neurons firing…");
    expect(treadWord("Reading the thread")).toBe("Reading the Tread…");
    expect(treadWord("Looking it up in the Neural Vault")).toBe("Searching the Vault…");
    expect(treadWord("Searching the web")).toBe("Searching the web…");
    expect(treadWord("Writing to the thread")).toBe("Composing…");
    expect(treadWord("Editing src/api.ts")).toBe("");
  });
});
