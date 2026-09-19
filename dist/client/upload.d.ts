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
    upload: {
        onprogress: ((ev: {
            loaded: number;
            total: number;
            lengthComputable: boolean;
        }) => void) | null;
    };
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
export declare class UploadError extends Error {
    readonly status: number;
    constructor(message: string, status: number);
}
export declare function isNativeFile(input: UploadInput): input is NativeFileInput;
export declare function inputSize(input: UploadInput): number;
export declare function inputName(input: UploadInput): string;
export declare function inputMime(input: UploadInput): string;
/** Turn a native `{ uri }` handle into a Blob (needed to slice multipart parts). */
export declare function toBlob(input: UploadInput, fetchFn: typeof globalThis.fetch): Promise<Blob>;
/** PUT `body` to `url`; resolves to the response ETag ("" when the server sent none). */
export declare function putUpload(opts: PutOptions): Promise<{
    etag: string;
}>;
