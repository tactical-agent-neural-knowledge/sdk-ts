/**
 * Voice in the Neural composer (Robby, 2026-11-12): tap the mic, speak, tap again; the words
 * come back as text in the composer to edit and send. Only TANK's own hearing model writes them
 * out (AiService.Transcribe), never another company's service or the device's dictation.
 *
 * The limits and every sentence live here so web and mobile behave and read the same. Every
 * sentence is copy people read: change one only with Robby's yes.
 */
/** A recording stops by itself here (the server refuses longer). */
export declare const VOICE_MAX_SECONDS = 120;
/** The largest recording sent (the server refuses larger). */
export declare const VOICE_MAX_BYTES: number;
export declare const VOICE_COPY: {
    /** The mic button, before recording. */
    readonly record: "Speak a message";
    /** The mic button while recording: stops and writes out what was said. */
    readonly stop: "Stop and write it out";
    /** Throws the recording away. */
    readonly cancel: "Cancel recording";
    /** Beside the elapsed time while recording: "Listening 0:12". */
    readonly listening: "Listening";
    /** While the hearing model writes it out. */
    readonly writing: "Writing out what you said…";
    /** The person said no to the microphone (or it was turned off for this app or site). */
    readonly denied: "Neural needs the microphone to hear you. Allow it in your settings, then tap the mic again.";
    /** No microphone on this device. */
    readonly noMicrophone: "No microphone was found on this device.";
    /** This browser cannot record audio at all. */
    readonly unsupported: "This browser cannot record audio. You can type your message instead.";
    /** The recording reached the limit and stopped by itself. */
    readonly tooLong: "Recordings stop at two minutes, so this one stopped there.";
    /** The hearing model heard no words. */
    readonly nothingHeard: "Neural did not hear any words. Try again a little closer to the microphone.";
    /** Too many recordings in a short time. */
    readonly tooMany: "That is a lot of recordings in a short time. Wait a minute, then try again.";
    /** The hearing model is not running here. */
    readonly unavailable: "Neural cannot hear recordings right now. Try again in a little while.";
    /** Anything else. */
    readonly failed: "Neural could not write out that recording. Please try again.";
};
/** Elapsed recording time as m:ss. */
export declare function formatElapsed(ms: number): string;
/** The sentence for a failed Transcribe call: never the server's or a vendor's own words. */
export declare function voiceErrorText(err: unknown): string;
/** Puts dictated words into a draft: after what is there, with one space between. */
export declare function appendDictation(draft: string, words: string): string;
