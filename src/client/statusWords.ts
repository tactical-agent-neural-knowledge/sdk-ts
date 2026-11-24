/**
 * The one-word status line Neural shows (Robby, 2026-11-24): while a person is typing to it,
 * and the instant a message to it is sent, before any reply has arrived.
 *
 * Every word people read is in STATUS_WORDS and nowhere else, so a word is changed in one
 * place for the browser and both phones, the TANK app and the Neural app alike. Robby chose
 * them; change one only with his yes.
 *
 * Each word is tied to something that is really happening. Nothing here runs a timer to look
 * busy, and nothing here costs a model or a GPU anything: the functions below only translate
 * states that already exist (the draft preparer's, a reply stream's, a run's live step line)
 * into the word for them.
 */
import type { DraftState } from "./prepare.js";

export const STATUS_WORDS = {
  // While the person is typing to Neural, by the composer. Only they see it.
  /** Their keystrokes are being reported. */
  listening: "Listening…",
  /** The draft as it stands has gone to the server, which is reading it with its conversation. */
  watching: "Watching…",
  /** The server has this exact draft and is working out how it would answer. */
  planning: "Planning…",

  // After Send, where the reply will appear, until its first words arrive.
  /** The message has been sent; shown in the same frame, before anything comes back. */
  firing: "Neurons firing…",
  /** The server has the message and is reading the conversation it belongs to: a Tread or thread… */
  readingTread: "Reading the Tread…",
  /** …or a Neural chat. */
  readingChat: "Reading the chat…",
  /** Looking it up in the workspace's own knowledge. */
  searchingVault: "Searching the Vault…",
  /** Looking it up on the web. */
  searchingWeb: "Searching the web…",
  /** Writing the reply. */
  composing: "Composing…",
} as const;

export type StatusWord = (typeof STATUS_WORDS)[keyof typeof STATUS_WORDS];

/** The word by the composer for a draft's state, or "" when there is nothing to say. */
export function typingWord(state: DraftState | undefined): StatusWord | "" {
  switch (state) {
    case "heard":
    case "waking":
      return STATUS_WORDS.listening;
    case "reading":
      return STATUS_WORDS.watching;
    case "preparing":
      return STATUS_WORDS.planning;
    default:
      return "";
  }
}

/** Where the message was sent: a Neural chat, or a Tread or thread where an agent was tagged. */
export type StatusPlace = "chat" | "tread";

/**
 * What a reply has reported so far, most recent last. A Neural chat's stream gives `started`
 * (the server has the message) and then stages by kind: sorting, searching, reading, writing,
 * outline. Nothing reported yet is the moment of the send itself.
 */
export type ReplyStep = "sent" | "started" | "sorting" | "searching" | "reading" | "writing" | "outline";

/** The word after Send for the latest step a Neural chat reply reported. */
export function replyWord(step: ReplyStep | string | undefined, place: StatusPlace): StatusWord {
  switch (step) {
    case "started":
    case "sorting":
      return place === "chat" ? STATUS_WORDS.readingChat : STATUS_WORDS.readingTread;
    case "searching":
    case "reading":
      // A chat's lookup stages are the web index: searching it, then reading the pages found.
      return STATUS_WORDS.searchingWeb;
    case "writing":
    case "outline":
      return STATUS_WORDS.composing;
    default:
      return STATUS_WORDS.firing;
  }
}

/**
 * The word after Send in a Tread or thread, from the live step line the run or the reply
 * reports there (the control plane's own lines: "Reading the thread", "Looking it up in the
 * Neural Vault", "Searching the web", "Writing to the thread"). A line that is none of these
 * has no word of its own here: the caller shows the line itself, which is live output.
 */
export function treadWord(stepLine: string | undefined): StatusWord | "" {
  const line = (stepLine ?? "").trim().toLowerCase();
  if (line === "") return STATUS_WORDS.firing;
  if (line === "reading the thread" || line === "reading the tread") return STATUS_WORDS.readingTread;
  if (line.startsWith("looking it up in the neural vault") || line.startsWith("searching the vault"))
    return STATUS_WORDS.searchingVault;
  if (line === "searching the web") return STATUS_WORDS.searchingWeb;
  if (line === "writing to the thread" || line === "composing") return STATUS_WORDS.composing;
  return "";
}
