import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/files/v1/files.proto.
 */
export declare const file_tank_files_v1_files: GenFile;
/**
 * @generated from message tank.files.v1.File
 */
export type File = Message<"tank.files.v1.File"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * @generated from field: string uploader_id = 3;
     */
    uploaderId: string;
    /**
     * @generated from field: string name = 4;
     */
    name: string;
    /**
     * @generated from field: string mime = 5;
     */
    mime: string;
    /**
     * @generated from field: int64 size = 6;
     */
    size: bigint;
    /**
     * @generated from field: tank.files.v1.ScanStatus scan_status = 7;
     */
    scanStatus: ScanStatus;
    /**
     * @generated from field: int32 width = 8;
     */
    width: number;
    /**
     * @generated from field: int32 height = 9;
     */
    height: number;
    /**
     * @generated from field: int64 duration_ms = 10;
     */
    durationMs: bigint;
    /**
     * size -> signed URL
     *
     * @generated from field: map<string, string> thumbnails = 11;
     */
    thumbnails: {
        [key: string]: string;
    };
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 12;
     */
    createdAt?: Timestamp;
    /**
     * Channels the file has been shared in (through messages) that the caller can see.
     *
     * @generated from field: repeated string shared_in_channel_ids = 13;
     */
    sharedInChannelIds: string[];
    /**
     * @generated from field: string uploader_display_name = 14;
     */
    uploaderDisplayName: string;
};
/**
 * Describes the message tank.files.v1.File.
 * Use `create(FileSchema)` to create a new message.
 */
export declare const FileSchema: GenMessage<File>;
/**
 * @generated from message tank.files.v1.CreateUploadRequest
 */
export type CreateUploadRequest = Message<"tank.files.v1.CreateUploadRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string mime = 3;
     */
    mime: string;
    /**
     * @generated from field: int64 size = 4;
     */
    size: bigint;
    /**
     * @generated from field: string channel_id = 5;
     */
    channelId: string;
};
/**
 * Describes the message tank.files.v1.CreateUploadRequest.
 * Use `create(CreateUploadRequestSchema)` to create a new message.
 */
export declare const CreateUploadRequestSchema: GenMessage<CreateUploadRequest>;
/**
 * @generated from message tank.files.v1.CreateUploadResponse
 */
export type CreateUploadResponse = Message<"tank.files.v1.CreateUploadResponse"> & {
    /**
     * @generated from field: tank.files.v1.File file = 1;
     */
    file?: File;
    /**
     * presigned PUT (single part)
     *
     * @generated from field: string upload_url = 2;
     */
    uploadUrl: string;
    /**
     * multipart when set
     *
     * @generated from field: string upload_id = 3;
     */
    uploadId: string;
    /**
     * @generated from field: repeated string part_urls = 4;
     */
    partUrls: string[];
    /**
     * @generated from field: int64 part_size = 5;
     */
    partSize: bigint;
};
/**
 * Describes the message tank.files.v1.CreateUploadResponse.
 * Use `create(CreateUploadResponseSchema)` to create a new message.
 */
export declare const CreateUploadResponseSchema: GenMessage<CreateUploadResponse>;
/**
 * @generated from message tank.files.v1.CompleteUploadRequest
 */
export type CompleteUploadRequest = Message<"tank.files.v1.CompleteUploadRequest"> & {
    /**
     * @generated from field: string file_id = 1;
     */
    fileId: string;
    /**
     * @generated from field: string upload_id = 2;
     */
    uploadId: string;
    /**
     * @generated from field: repeated string etags = 3;
     */
    etags: string[];
};
/**
 * Describes the message tank.files.v1.CompleteUploadRequest.
 * Use `create(CompleteUploadRequestSchema)` to create a new message.
 */
export declare const CompleteUploadRequestSchema: GenMessage<CompleteUploadRequest>;
/**
 * @generated from message tank.files.v1.CompleteUploadResponse
 */
export type CompleteUploadResponse = Message<"tank.files.v1.CompleteUploadResponse"> & {
    /**
     * @generated from field: tank.files.v1.File file = 1;
     */
    file?: File;
};
/**
 * Describes the message tank.files.v1.CompleteUploadResponse.
 * Use `create(CompleteUploadResponseSchema)` to create a new message.
 */
export declare const CompleteUploadResponseSchema: GenMessage<CompleteUploadResponse>;
/**
 * @generated from message tank.files.v1.GetDownloadUrlRequest
 */
export type GetDownloadUrlRequest = Message<"tank.files.v1.GetDownloadUrlRequest"> & {
    /**
     * @generated from field: string file_id = 1;
     */
    fileId: string;
};
/**
 * Describes the message tank.files.v1.GetDownloadUrlRequest.
 * Use `create(GetDownloadUrlRequestSchema)` to create a new message.
 */
export declare const GetDownloadUrlRequestSchema: GenMessage<GetDownloadUrlRequest>;
/**
 * @generated from message tank.files.v1.GetDownloadUrlResponse
 */
export type GetDownloadUrlResponse = Message<"tank.files.v1.GetDownloadUrlResponse"> & {
    /**
     * @generated from field: string url = 1;
     */
    url: string;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 2;
     */
    expiresAt?: Timestamp;
};
/**
 * Describes the message tank.files.v1.GetDownloadUrlResponse.
 * Use `create(GetDownloadUrlResponseSchema)` to create a new message.
 */
export declare const GetDownloadUrlResponseSchema: GenMessage<GetDownloadUrlResponse>;
/**
 * GetFile returns metadata for one file the caller may read (uploader, member
 * of a channel it was shared in, or a workspace member for emoji / avatars).
 *
 * @generated from message tank.files.v1.GetFileRequest
 */
export type GetFileRequest = Message<"tank.files.v1.GetFileRequest"> & {
    /**
     * @generated from field: string file_id = 1;
     */
    fileId: string;
};
/**
 * Describes the message tank.files.v1.GetFileRequest.
 * Use `create(GetFileRequestSchema)` to create a new message.
 */
export declare const GetFileRequestSchema: GenMessage<GetFileRequest>;
/**
 * @generated from message tank.files.v1.GetFileResponse
 */
export type GetFileResponse = Message<"tank.files.v1.GetFileResponse"> & {
    /**
     * @generated from field: tank.files.v1.File file = 1;
     */
    file?: File;
};
/**
 * Describes the message tank.files.v1.GetFileResponse.
 * Use `create(GetFileResponseSchema)` to create a new message.
 */
export declare const GetFileResponseSchema: GenMessage<GetFileResponse>;
/**
 * ListFiles pages the files the caller may read in a workspace, newest first;
 * channel_id narrows to files shared in that channel (caller must be a member).
 *
 * @generated from message tank.files.v1.ListFilesRequest
 */
export type ListFilesRequest = Message<"tank.files.v1.ListFilesRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * opaque
     *
     * @generated from field: string cursor = 3;
     */
    cursor: string;
    /**
     * @generated from field: int32 limit = 4;
     */
    limit: number;
};
/**
 * Describes the message tank.files.v1.ListFilesRequest.
 * Use `create(ListFilesRequestSchema)` to create a new message.
 */
export declare const ListFilesRequestSchema: GenMessage<ListFilesRequest>;
/**
 * @generated from message tank.files.v1.ListFilesResponse
 */
export type ListFilesResponse = Message<"tank.files.v1.ListFilesResponse"> & {
    /**
     * @generated from field: repeated tank.files.v1.File files = 1;
     */
    files: File[];
    /**
     * @generated from field: string next_cursor = 2;
     */
    nextCursor: string;
};
/**
 * Describes the message tank.files.v1.ListFilesResponse.
 * Use `create(ListFilesResponseSchema)` to create a new message.
 */
export declare const ListFilesResponseSchema: GenMessage<ListFilesResponse>;
/**
 * @generated from message tank.files.v1.DeleteFileRequest
 */
export type DeleteFileRequest = Message<"tank.files.v1.DeleteFileRequest"> & {
    /**
     * @generated from field: string file_id = 1;
     */
    fileId: string;
};
/**
 * Describes the message tank.files.v1.DeleteFileRequest.
 * Use `create(DeleteFileRequestSchema)` to create a new message.
 */
export declare const DeleteFileRequestSchema: GenMessage<DeleteFileRequest>;
/**
 * @generated from message tank.files.v1.DeleteFileResponse
 */
export type DeleteFileResponse = Message<"tank.files.v1.DeleteFileResponse"> & {
    /**
     * The messages that carried the file, now without it. Clients replace their
     * copies so the chip disappears everywhere at once, not just where the
     * delete was pressed.
     *
     * @generated from field: repeated string message_ids = 1;
     */
    messageIds: string[];
};
/**
 * Describes the message tank.files.v1.DeleteFileResponse.
 * Use `create(DeleteFileResponseSchema)` to create a new message.
 */
export declare const DeleteFileResponseSchema: GenMessage<DeleteFileResponse>;
/**
 * @generated from enum tank.files.v1.ScanStatus
 */
export declare enum ScanStatus {
    /**
     * @generated from enum value: SCAN_STATUS_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: SCAN_STATUS_PENDING = 1;
     */
    PENDING = 1,
    /**
     * @generated from enum value: SCAN_STATUS_CLEAN = 2;
     */
    CLEAN = 2,
    /**
     * @generated from enum value: SCAN_STATUS_INFECTED = 3;
     */
    INFECTED = 3,
    /**
     * @generated from enum value: SCAN_STATUS_FAILED = 4;
     */
    FAILED = 4
}
/**
 * Describes the enum tank.files.v1.ScanStatus.
 */
export declare const ScanStatusSchema: GenEnum<ScanStatus>;
/**
 * @generated from service tank.files.v1.FilesService
 */
export declare const FilesService: GenService<{
    /**
     * @generated from rpc tank.files.v1.FilesService.CreateUpload
     */
    createUpload: {
        methodKind: "unary";
        input: typeof CreateUploadRequestSchema;
        output: typeof CreateUploadResponseSchema;
    };
    /**
     * @generated from rpc tank.files.v1.FilesService.CompleteUpload
     */
    completeUpload: {
        methodKind: "unary";
        input: typeof CompleteUploadRequestSchema;
        output: typeof CompleteUploadResponseSchema;
    };
    /**
     * @generated from rpc tank.files.v1.FilesService.GetDownloadUrl
     */
    getDownloadUrl: {
        methodKind: "unary";
        input: typeof GetDownloadUrlRequestSchema;
        output: typeof GetDownloadUrlResponseSchema;
    };
    /**
     * @generated from rpc tank.files.v1.FilesService.GetFile
     */
    getFile: {
        methodKind: "unary";
        input: typeof GetFileRequestSchema;
        output: typeof GetFileResponseSchema;
    };
    /**
     * @generated from rpc tank.files.v1.FilesService.ListFiles
     */
    listFiles: {
        methodKind: "unary";
        input: typeof ListFilesRequestSchema;
        output: typeof ListFilesResponseSchema;
    };
    /**
     * Remove a file: its bytes, its record, and its place in every message that
     * carried it. The uploader may, and so may a workspace admin — a file
     * someone else attached is still the workspace's to take down.
     *
     * @generated from rpc tank.files.v1.FilesService.DeleteFile
     */
    deleteFile: {
        methodKind: "unary";
        input: typeof DeleteFileRequestSchema;
        output: typeof DeleteFileResponseSchema;
    };
}>;
