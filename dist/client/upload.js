/**
 * Raw HTTP PUT of an upload body to a pre-signed URL, with progress. Uses `XMLHttpRequest` when the
 * platform has one (browsers, React Native) so `onProgress` gets byte-level updates; otherwise
 * `fetch` (Node) with progress reported at 0 and 1.
 */
export class UploadError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = "UploadError";
    }
}
export function isNativeFile(input) {
    return typeof input.uri === "string";
}
export function inputSize(input) {
    return isNativeFile(input) ? input.size : input.size;
}
export function inputName(input) {
    if (isNativeFile(input))
        return input.name;
    const name = input.name;
    return typeof name === "string" && name ? name : "file";
}
export function inputMime(input) {
    return (isNativeFile(input) ? input.mime : input.type) || "application/octet-stream";
}
/** The body a platform PUT accepts: Blobs as-is, native handles as React Native's `{ uri, type, name }`. */
function requestBody(input) {
    return isNativeFile(input) ? { uri: input.uri, type: input.mime, name: input.name } : input;
}
/** Turn a native `{ uri }` handle into a Blob (needed to slice multipart parts). */
export async function toBlob(input, fetchFn) {
    if (!isNativeFile(input))
        return input;
    const res = await fetchFn(input.uri);
    if (!res.ok)
        throw new UploadError(`could not read ${input.name}: ${res.status}`, res.status);
    return res.blob();
}
/** PUT `body` to `url`; resolves to the response ETag ("" when the server sent none). */
export function putUpload(opts) {
    const total = inputSize(opts.body);
    const Xhr = opts.XMLHttpRequest ?? globalThis.XMLHttpRequest;
    if (Xhr)
        return putWithXhr(Xhr, opts, total);
    const fetchFn = opts.fetch ?? globalThis.fetch;
    return putWithFetch(fetchFn, opts, total);
}
function putWithXhr(Xhr, opts, total) {
    return new Promise((resolve, reject) => {
        const xhr = new Xhr();
        xhr.open("PUT", opts.url);
        xhr.setRequestHeader("Content-Type", opts.contentType);
        xhr.upload.onprogress = (ev) => {
            if (ev.lengthComputable)
                opts.onProgress?.(ev.loaded, ev.total || total);
        };
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                opts.onProgress?.(total, total);
                resolve({ etag: stripQuotes(xhr.getResponseHeader("ETag") ?? "") });
            }
            else
                reject(new UploadError(`upload failed: ${xhr.status} ${xhr.statusText}`, xhr.status));
        };
        xhr.onerror = () => reject(new UploadError("upload failed: network error", 0));
        xhr.onabort = () => reject(new UploadError("upload aborted", 0));
        if (opts.signal) {
            if (opts.signal.aborted) {
                xhr.abort();
                return;
            }
            opts.signal.addEventListener("abort", () => xhr.abort(), { once: true });
        }
        opts.onProgress?.(0, total);
        xhr.send(requestBody(opts.body));
    });
}
async function putWithFetch(fetchFn, opts, total) {
    opts.onProgress?.(0, total);
    const res = await fetchFn(opts.url, {
        method: "PUT",
        headers: { "Content-Type": opts.contentType },
        body: requestBody(opts.body),
        ...(opts.signal ? { signal: opts.signal } : {}),
    });
    if (!res.ok)
        throw new UploadError(`upload failed: ${res.status} ${res.statusText}`, res.status);
    opts.onProgress?.(total, total);
    return { etag: stripQuotes(res.headers.get("ETag") ?? "") };
}
function stripQuotes(s) {
    return s.replace(/^"(.*)"$/, "$1");
}
