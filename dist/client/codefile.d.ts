/**
 * A fence named for a file rather than a language: Neural writes a file it was asked for as
 * one block whose info string is the file's name (```release-notes.md), and both apps draw
 * that block as a file card.
 */
export declare function fenceFileName(lang: string): string | null;
/** The file name a code block in the given language is saved under. */
export declare function codeFileName(lang: string): string;
/** The media type a saved code block is written with. */
export declare function codeFileType(name: string): string;
