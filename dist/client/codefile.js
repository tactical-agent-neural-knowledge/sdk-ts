/**
 * What a code block in a Neural answer is saved as (Robby, 2026-11-02: "I asked it for a file
 * I could download but there's no way to download anything"). Web downloads it and the phone
 * shares it; both name it the same way from here.
 */
const EXTENSIONS = {
    markdown: "md",
    md: "md",
    python: "py",
    py: "py",
    javascript: "js",
    js: "js",
    jsx: "jsx",
    typescript: "ts",
    ts: "ts",
    tsx: "tsx",
    json: "json",
    yaml: "yaml",
    yml: "yaml",
    toml: "toml",
    html: "html",
    css: "css",
    scss: "scss",
    sql: "sql",
    go: "go",
    rust: "rs",
    rs: "rs",
    java: "java",
    kotlin: "kt",
    swift: "swift",
    ruby: "rb",
    rb: "rb",
    php: "php",
    c: "c",
    cpp: "cpp",
    "c++": "cpp",
    csharp: "cs",
    cs: "cs",
    bash: "sh",
    sh: "sh",
    shell: "sh",
    zsh: "sh",
    dockerfile: "Dockerfile",
    xml: "xml",
    csv: "csv",
    svg: "svg",
    text: "txt",
    txt: "txt",
    plaintext: "txt",
};
/** The file name a code block in the given language is saved under. */
export function codeFileName(lang) {
    const ext = EXTENSIONS[lang.trim().toLowerCase()] ?? "txt";
    return ext === "Dockerfile" ? "Dockerfile" : `neural.${ext}`;
}
/** The media type a saved code block is written with. */
export function codeFileType(name) {
    if (name.endsWith(".md"))
        return "text/markdown";
    if (name.endsWith(".json"))
        return "application/json";
    if (name.endsWith(".html"))
        return "text/html";
    if (name.endsWith(".csv"))
        return "text/csv";
    if (name.endsWith(".svg"))
        return "image/svg+xml";
    return "text/plain";
}
