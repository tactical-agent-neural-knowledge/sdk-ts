/**
 * Times in a message or card are sent as tokens, never as a clock written by the server
 * (Robby, 2026-11-25: "Approved by Robby at 11:16 UTC" must read "6:16 AM" for him in ET,
 * and each viewer's own time for everybody else). The server writes `<t:SECONDS>` or
 * `<t:SECONDS:STYLE>` (seconds since the Unix epoch) and every client replaces the token
 * with the moment in the device's own time zone and locale.
 *
 * Styles: `t` a clock time ("6:16 AM", the default), `f` the day and the time
 * ("Wednesday, December 2, 5:55 AM"), `d` the day alone ("December 2").
 */
export type LocalTimeStyle = "t" | "f" | "d";
export interface LocalTimeOptions {
    /** An IANA zone; the device's own when unset. Tests pin it. */
    timeZone?: string;
    /** A BCP 47 locale; the device's own when unset. */
    locale?: string | string[];
}
/** The token for a moment, as a server or a client writes it into text. */
export declare function timeToken(ms: number, style?: LocalTimeStyle): string;
/** Whether text carries a time token. */
export declare function hasTimeTokens(text: string): boolean;
/** A moment in the device's (or the given) time zone and locale. */
export declare function formatLocalTime(ms: number, style?: LocalTimeStyle, opts?: LocalTimeOptions): string;
/** Text with every time token replaced by the moment in the viewer's own time. */
export declare function localTimes(text: string, opts?: LocalTimeOptions): string;
/**
 * A copy of a message's blocks (or any protobuf message) with the time tokens in every
 * string replaced; the same object back when there are none. Ids and URLs never carry a
 * token, so every string is walked.
 */
export declare function localizeTimes<T>(value: T, opts?: LocalTimeOptions): T;
