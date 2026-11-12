import { Code, ConnectError } from "@connectrpc/connect";

/**
 * Voice in the Neural composer (Robby, 2026-11-12): tap the mic, speak, tap again; the words
 * come back as text in the composer to edit and send. Only TANK's own hearing model writes them
 * out (AiService.Transcribe), never another company's service or the device's dictation.
 *
 * The limits and every sentence live here so web and mobile behave and read the same. Every
 * sentence is copy people read: change one only with Robby's yes.
 */

/** A recording stops by itself here (the server refuses longer). */
export const VOICE_MAX_SECONDS = 120;
/** The largest recording sent (the server refuses larger). */
export const VOICE_MAX_BYTES = 10 * 1024 * 1024;

export const VOICE_COPY = {
  /** The mic button, before recording. */
  record: "Speak a message",
  /** The mic button while recording: stops and writes out what was said. */
  stop: "Stop and write it out",
  /** Throws the recording away. */
  cancel: "Cancel recording",
  /** Beside the elapsed time while recording: "Listening 0:12". */
  listening: "Listening",
  /** While the hearing model writes it out. */
  writing: "Writing out what you said…",
  /** The person said no to the microphone (or it was turned off for this app or site). */
  denied: "Neural needs the microphone to hear you. Allow it in your settings, then tap the mic again.",
  /** No microphone on this device. */
  noMicrophone: "No microphone was found on this device.",
  /** This browser cannot record audio at all. */
  unsupported: "This browser cannot record audio. You can type your message instead.",
  /** The recording reached the limit and stopped by itself. */
  tooLong: "Recordings stop at two minutes, so this one stopped there.",
  /** The hearing model heard no words. */
  nothingHeard: "Neural did not hear any words. Try again a little closer to the microphone.",
  /** Too many recordings in a short time. */
  tooMany: "That is a lot of recordings in a short time. Wait a minute, then try again.",
  /** The hearing model is not running here. */
  unavailable: "Neural cannot hear recordings right now. Try again in a little while.",
  /** Anything else. */
  failed: "Neural could not write out that recording. Please try again.",
} as const;

/** Elapsed recording time as m:ss. */
export function formatElapsed(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** The sentence for a failed Transcribe call: never the server's or a vendor's own words. */
export function voiceErrorText(err: unknown): string {
  if (err instanceof ConnectError) {
    switch (err.code) {
      case Code.ResourceExhausted:
        return VOICE_COPY.tooMany;
      case Code.Unavailable:
      case Code.Unimplemented:
        return VOICE_COPY.unavailable;
      case Code.InvalidArgument:
        return /two minutes|10 MB|too long|too large/i.test(err.rawMessage)
          ? VOICE_COPY.tooLong
          : VOICE_COPY.failed;
      default:
        return VOICE_COPY.failed;
    }
  }
  return VOICE_COPY.failed;
}

/** Puts dictated words into a draft: after what is there, with one space between. */
export function appendDictation(draft: string, words: string): string {
  const said = words.trim();
  if (!said) return draft;
  if (!draft.trim()) return said;
  return /\s$/.test(draft) ? `${draft}${said}` : `${draft} ${said}`;
}
