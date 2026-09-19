/**
 * Raw HTTP PUT of an upload body to a pre-signed URL, with progress. Uses `XMLHttpRequest` when the
 * platform has one (browsers, React Native) so `onProgress` gets byte-level updates; otherwise
 * `fetch` (Node) with progress reported at 0 and 1.
 */

export interface XhrLike {
  open(method: string, url: string): void;
  setRequestHeader(name: string, value: string): void;
  getResponseHeader(name: string): string | null;
  send(body?: unknown): void;
  abort(): void;
  upload: { onprogress: ((ev: { loaded: number; total: number; lengthComputable: boolean }) => void) | null };
  onload: (() => void) | null;
  onerror: (() => void) | null;
  onabort: (() => void) | null;
  status: number;
  statusText: string;
}

export type XhrCtor = new () => XhrLike;

/** React Native file handle: `{ uri, name, mime, size }` (from expo-image-picker / document-picker). */
export interface NativeFileInput {
  uri: string;
  name: string;
  mime: string;
  size: number;
}

export type UploadInput = Blob | NativeFileInput;

export interface PutOptions {
  url: string;
  body: UploadInput;
  contentType: string;
  onProgress?: (loaded: number, total: number) => void;
  XMLHttpRequest?: XhrCtor | undefined;
  fetch?: typeof globalThis.fetch | undefined;
  signal?: AbortSignal | undefined;
}

export class UploadError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "UploadError";
  }
}

export function isNativeFile(input: UploadInput): input is NativeFileInput {
  return typeof (input as NativeFileInput).uri === "string";
}

export function inputSize(input: UploadInput): number {
  return isNativeFile(input) ? input.size : input.size;
}

export function inputName(input: UploadInput): string {
  if (isNativeFile(input)) return input.name;
  const name = (input as { name?: unknown }).name;
  return typeof name === "string" && name ? name : "file";
}

export function inputMime(input: UploadInput): string {
  return (isNativeFile(input) ? input.mime : input.type) || "application/octet-stream";
}

/** The body a platform PUT accepts: Blobs as-is, native handles as React Native's `{ uri, type, name }`. */
function requestBody(input: UploadInput): unknown {
  return isNativeFile(input) ? { uri: input.uri, type: input.mime, name: input.name } : input;
}

/** Turn a native `{ uri }` handle into a Blob (needed to slice multipart parts). */
export async function toBlob(input: UploadInput, fetchFn: typeof globalThis.fetch): Promise<Blob> {
  if (!isNativeFile(input)) return input;
  const res = await fetchFn(input.uri);
  if (!res.ok) throw new UploadError(`could not read ${input.name}: ${res.status}`, res.status);
  return res.blob();
}

/** PUT `body` to `url`; resolves to the response ETag ("" when the server sent none). */
export function putUpload(opts: PutOptions): Promise<{ etag: string }> {
  const total = inputSize(opts.body);
  const Xhr = opts.XMLHttpRequest ?? (globalThis as { XMLHttpRequest?: XhrCtor }).XMLHttpRequest;
  if (Xhr) return putWithXhr(Xhr, opts, total);
  const fetchFn = opts.fetch ?? globalThis.fetch;
  return putWithFetch(fetchFn, opts, total);
}

function putWithXhr(Xhr: XhrCtor, opts: PutOptions, total: number): Promise<{ etag: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new Xhr();
    xhr.open("PUT", opts.url);
    xhr.setRequestHeader("Content-Type", opts.contentType);
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) opts.onProgress?.(ev.loaded, ev.total || total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        opts.onProgress?.(total, total);
        resolve({ etag: stripQuotes(xhr.getResponseHeader("ETag") ?? "") });
      } else reject(new UploadError(`upload failed: ${xhr.status} ${xhr.statusText}`, xhr.status));
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

async function putWithFetch(
  fetchFn: typeof globalThis.fetch,
  opts: PutOptions,
  total: number,
): Promise<{ etag: string }> {
  opts.onProgress?.(0, total);
  const res = await fetchFn(opts.url, {
    method: "PUT",
    headers: { "Content-Type": opts.contentType },
    body: requestBody(opts.body) as BodyInit,
    ...(opts.signal ? { signal: opts.signal } : {}),
  });
  if (!res.ok) throw new UploadError(`upload failed: ${res.status} ${res.statusText}`, res.status);
  opts.onProgress?.(total, total);
  return { etag: stripQuotes(res.headers.get("ETag") ?? "") };
}

function stripQuotes(s: string): string {
  return s.replace(/^"(.*)"$/, "$1");
}
