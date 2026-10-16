/**
 * Whether a file of this type can be shown in a browser view rather than saved: documents,
 * pictures, sound, video, plain text. Mirrors the server's list (api internal/files/previewable.go),
 * which is the one that decides; this is for a client to choose "open" over "download" before asking.
 * HTML, SVG and XML are out on purpose: rendered inline they would run script on the files origin.
 */
export declare function previewable(mime: string | undefined): boolean;
