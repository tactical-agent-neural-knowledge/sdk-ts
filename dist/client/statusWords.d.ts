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
export declare const STATUS_WORDS: {
    /** Their keystrokes are being reported. */
    readonly listening: "Listening…";
    /** The draft as it stands has gone to the server, which is reading it with its conversation. */
    readonly watching: "Watching…";
    /** The server has this exact draft and is working out how it would answer. */
    readonly planning: "Planning…";
    /** The message has been sent; shown in the same frame, before anything comes back. */
    readonly firing: "Neurons firing…";
    /** The server has the message and is reading the conversation it belongs to: a Tread or thread… */
    readonly readingTread: "Reading the Tread…";
    /** …or a Neural chat. */
    readonly readingChat: "Reading the chat…";
    /** Looking it up in the workspace's own knowledge. */
    readonly searchingVault: "Searching the Vault…";
    /** Looking it up on the web. */
    readonly searchingWeb: "Searching the web…";
    /** Writing the reply. */
    readonly composing: "Composing…";
};
export type StatusWord = (typeof STATUS_WORDS)[keyof typeof STATUS_WORDS];
/** The word by the composer for a draft's state, or "" when there is nothing to say. */
export declare function typingWord(state: DraftState | undefined): StatusWord | "";
/** Where the message was sent: a Neural chat, or a Tread or thread where an agent was tagged. */
export type StatusPlace = "chat" | "tread";
/**
 * What a reply has reported so far, most recent last. A Neural chat's stream gives `started`
 * (the server has the message) and then stages by kind: sorting, searching, reading, writing,
 * outline. Nothing reported yet is the moment of the send itself.
 */
export type ReplyStep = "sent" | "started" | "sorting" | "searching" | "reading" | "writing" | "outline";
/** The word after Send for the latest step a Neural chat reply reported. */
export declare function replyWord(step: ReplyStep | string | undefined, place: StatusPlace): StatusWord;
/**
 * The word after Send in a Tread or thread, from the live step line the run or the reply
 * reports there (the control plane's own lines: "Reading the thread", "Looking it up in the
 * Neural Vault", "Searching the web", "Writing to the thread"). A line that is none of these
 * has no word of its own here: the caller shows the line itself, which is live output.
 */
export declare function treadWord(stepLine: string | undefined): StatusWord | "";
