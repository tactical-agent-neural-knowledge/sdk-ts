/**
 * Whether a file of this type can be shown in a browser view rather than saved: documents,
 * pictures, sound, video, plain text. Mirrors the server's list (api internal/files/previewable.go),
 * which is the one that decides; this is for a client to choose "open" over "download" before asking.
 * HTML, SVG and XML are out on purpose: rendered inline they would run script on the files origin.
 */
export declare function previewable(mime: string | undefined): boolean;
/**
 * Whether a file of this type opens as a page in the browser: a web page or a drawing somebody
 * sent. Asked for inline, the server hands back an address on the file's own preview host,
 * where it runs sandboxed and never on a TANK address (api internal/files/pages.go). Where
 * the server has no preview host the same request answers with a download instead.
 */
export declare function opensAsPage(mime: string | undefined): boolean;
/**
 * Whether a file of this type runs as a live frame in Blueprint: a web page or a drawing as
 * it is; a PDF, a video, a recording, Markdown, a CSV, source code, a Jupyter notebook or a
 * Mermaid diagram inside a page the server writes around it. Ask
 * `getDownloadUrl(id, { page: true })` for its address. Mirrors the server's `PageKind`
 * (api internal/files/pagewrap.go).
 */
export declare function framesAsPage(mime: string | undefined, name?: string): boolean;
