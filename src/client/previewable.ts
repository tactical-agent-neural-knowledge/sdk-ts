/**
 * Whether a file of this type can be shown in a browser view rather than saved: documents,
 * pictures, sound, video, plain text. Mirrors the server's list (api internal/files/previewable.go),
 * which is the one that decides; this is for a client to choose "open" over "download" before asking.
 * HTML, SVG and XML are out on purpose: rendered inline they would run script on the files origin.
 */
export function previewable(mime: string | undefined): boolean {
  const m = (mime ?? "").split(";")[0]?.trim().toLowerCase() ?? "";
  if (!m) return false;
  if (["application/pdf", "application/json", "text/plain", "text/csv", "text/markdown"].includes(m))
    return true;
  if (["image/svg+xml", "text/html", "application/xhtml+xml", "text/xml", "application/xml"].includes(m))
    return false;
  if (m.startsWith("image/") || m.startsWith("video/") || m.startsWith("audio/")) return true;
  if (
    m.startsWith("application/vnd.openxmlformats-officedocument.") ||
    m === "application/msword" ||
    m === "application/vnd.ms-excel" ||
    m === "application/vnd.ms-powerpoint" ||
    m.startsWith("application/vnd.apple.")
  )
    return true;
  return false;
}

/**
 * Whether a file of this type opens as a page in the browser: a web page or a drawing somebody
 * sent. Asked for inline, the server hands back an address on the file's own preview host,
 * where it runs sandboxed and never on a TANK address (api internal/files/pages.go). Where
 * the server has no preview host the same request answers with a download instead.
 */
export function opensAsPage(mime: string | undefined): boolean {
  const m = (mime ?? "").split(";")[0]?.trim().toLowerCase() ?? "";
  return m === "text/html" || m === "application/xhtml+xml" || m === "image/svg+xml";
}

/** Source files shown highlighted, by extension (api internal/files/pagewrap.go `codeExt`). */
const CODE_EXT = new Set([
  ".go",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".py",
  ".rb",
  ".rs",
  ".java",
  ".kt",
  ".swift",
  ".c",
  ".h",
  ".cc",
  ".cpp",
  ".cs",
  ".php",
  ".sh",
  ".sql",
  ".yaml",
  ".yml",
  ".toml",
  ".json",
  ".css",
  ".scss",
  ".tf",
  ".proto",
  ".lua",
  ".dart",
  ".scala",
]);

/**
 * Whether a file of this type runs as a live frame in Blueprint: a web page or a drawing as
 * it is; a PDF, a video, a recording, Markdown, a CSV, source code, a Jupyter notebook or a
 * Mermaid diagram inside a page the server writes around it. Ask
 * `getDownloadUrl(id, { page: true })` for its address. Mirrors the server's `PageKind`
 * (api internal/files/pagewrap.go).
 */
export function framesAsPage(mime: string | undefined, name = ""): boolean {
  const m = (mime ?? "").split(";")[0]?.trim().toLowerCase() ?? "";
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot).toLowerCase() : "";
  return (
    opensAsPage(m) ||
    m === "application/pdf" ||
    m.startsWith("video/") ||
    m.startsWith("audio/") ||
    m === "text/markdown" ||
    m === "text/x-markdown" ||
    m === "text/csv" ||
    [".md", ".csv", ".tsv", ".ipynb", ".mmd", ".mermaid"].includes(ext) ||
    CODE_EXT.has(ext)
  );
}
