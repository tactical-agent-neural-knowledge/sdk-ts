/**
 * Whether a file of this type can be shown in a browser view rather than saved: documents,
 * pictures, sound, video, plain text. Mirrors the server's list (api internal/files/previewable.go),
 * which is the one that decides; this is for a client to choose "open" over "download" before asking.
 * HTML, SVG and XML are out on purpose: rendered inline they would run script on the files origin.
 */
export function previewable(mime) {
    const m = (mime ?? "").split(";")[0]?.trim().toLowerCase() ?? "";
    if (!m)
        return false;
    if (["application/pdf", "application/json", "text/plain", "text/csv", "text/markdown"].includes(m))
        return true;
    if (["image/svg+xml", "text/html", "application/xhtml+xml", "text/xml", "application/xml"].includes(m))
        return false;
    if (m.startsWith("image/") || m.startsWith("video/") || m.startsWith("audio/"))
        return true;
    if (m.startsWith("application/vnd.openxmlformats-officedocument.") ||
        m === "application/msword" ||
        m === "application/vnd.ms-excel" ||
        m === "application/vnd.ms-powerpoint" ||
        m.startsWith("application/vnd.apple."))
        return true;
    return false;
}
/**
 * Whether a file of this type opens as a page in the browser: a web page or a drawing somebody
 * sent. Asked for inline, the server hands back an address on the file's own preview host,
 * where it runs sandboxed and never on a TANK address (api internal/files/pages.go). Where
 * the server has no preview host the same request answers with a download instead.
 */
export function opensAsPage(mime) {
    const m = (mime ?? "").split(";")[0]?.trim().toLowerCase() ?? "";
    return m === "text/html" || m === "application/xhtml+xml" || m === "image/svg+xml";
}
