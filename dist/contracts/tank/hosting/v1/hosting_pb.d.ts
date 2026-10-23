import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/hosting/v1/hosting.proto.
 */
export declare const file_tank_hosting_v1_hosting: GenFile;
/**
 * @generated from message tank.hosting.v1.GetProductRequest
 */
export type GetProductRequest = Message<"tank.hosting.v1.GetProductRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * 0 = 200, at most 2000
     *
     * @generated from field: int32 tail_lines = 2;
     */
    tailLines: number;
};
/**
 * Describes the message tank.hosting.v1.GetProductRequest.
 * Use `create(GetProductRequestSchema)` to create a new message.
 */
export declare const GetProductRequestSchema: GenMessage<GetProductRequest>;
/**
 * @generated from message tank.hosting.v1.GetProductResponse
 */
export type GetProductResponse = Message<"tank.hosting.v1.GetProductResponse"> & {
    /**
     * absent when the Tread hosts nothing
     *
     * @generated from field: tank.hosting.v1.Product product = 1;
     */
    product?: Product;
    /**
     * the app's log; the crashed container's when it is failing
     *
     * @generated from field: string logs = 2;
     */
    logs: string;
    /**
     * @generated from field: repeated tank.hosting.v1.ProductEvent events = 3;
     */
    events: ProductEvent[];
};
/**
 * Describes the message tank.hosting.v1.GetProductResponse.
 * Use `create(GetProductResponseSchema)` to create a new message.
 */
export declare const GetProductResponseSchema: GenMessage<GetProductResponse>;
/**
 * @generated from message tank.hosting.v1.Product
 */
export type Product = Message<"tank.hosting.v1.Product"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
    /**
     * owner/name
     *
     * @generated from field: string repo = 2;
     */
    repo: string;
    /**
     * https://<slug>.tank.chat
     *
     * @generated from field: string url = 3;
     */
    url: string;
    /**
     * @generated from field: bool awake = 4;
     */
    awake: boolean;
    /**
     * not_deployed | asleep | starting | running | failing | unknown
     *
     * @generated from field: string status = 5;
     */
    status: string;
    /**
     * the build the cluster runs
     *
     * @generated from field: string image_tag = 6;
     */
    imageTag: string;
    /**
     * @generated from field: int32 restarts = 7;
     */
    restarts: number;
    /**
     * of the last crash: "Error", "OOMKilled", …
     *
     * @generated from field: string last_exit_reason = 8;
     */
    lastExitReason: string;
    /**
     * @generated from field: google.protobuf.Timestamp started_at = 9;
     */
    startedAt?: Timestamp;
    /**
     * "1"
     *
     * @generated from field: string cpu_limit = 10;
     */
    cpuLimit: string;
    /**
     * "2Gi"
     *
     * @generated from field: string memory_limit = 11;
     */
    memoryLimit: string;
    /**
     * @generated from field: int64 disk_bytes = 12;
     */
    diskBytes: bigint;
    /**
     * the caller may wake, sleep and (later) change it
     *
     * @generated from field: bool can_manage = 13;
     */
    canManage: boolean;
    /**
     * TANK generated the repository
     *
     * @generated from field: bool managed = 14;
     */
    managed: boolean;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 15;
     */
    updatedAt?: Timestamp;
};
/**
 * Describes the message tank.hosting.v1.Product.
 * Use `create(ProductSchema)` to create a new message.
 */
export declare const ProductSchema: GenMessage<Product>;
/**
 * @generated from message tank.hosting.v1.ProductEvent
 */
export type ProductEvent = Message<"tank.hosting.v1.ProductEvent"> & {
    /**
     * @generated from field: google.protobuf.Timestamp at = 1;
     */
    at?: Timestamp;
    /**
     * Normal | Warning
     *
     * @generated from field: string type = 2;
     */
    type: string;
    /**
     * @generated from field: string reason = 3;
     */
    reason: string;
    /**
     * @generated from field: string message = 4;
     */
    message: string;
};
/**
 * Describes the message tank.hosting.v1.ProductEvent.
 * Use `create(ProductEventSchema)` to create a new message.
 */
export declare const ProductEventSchema: GenMessage<ProductEvent>;
/**
 * @generated from message tank.hosting.v1.CheckProductRequest
 */
export type CheckProductRequest = Message<"tank.hosting.v1.CheckProductRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * "/" when empty
     *
     * @generated from field: string path = 2;
     */
    path: string;
};
/**
 * Describes the message tank.hosting.v1.CheckProductRequest.
 * Use `create(CheckProductRequestSchema)` to create a new message.
 */
export declare const CheckProductRequestSchema: GenMessage<CheckProductRequest>;
/**
 * @generated from message tank.hosting.v1.CheckProductResponse
 */
export type CheckProductResponse = Message<"tank.hosting.v1.CheckProductResponse"> & {
    /**
     * @generated from field: tank.hosting.v1.LiveCheck check = 1;
     */
    check?: LiveCheck;
};
/**
 * Describes the message tank.hosting.v1.CheckProductResponse.
 * Use `create(CheckProductResponseSchema)` to create a new message.
 */
export declare const CheckProductResponseSchema: GenMessage<CheckProductResponse>;
/**
 * @generated from message tank.hosting.v1.LiveCheck
 */
export type LiveCheck = Message<"tank.hosting.v1.LiveCheck"> & {
    /**
     * @generated from field: string url = 1;
     */
    url: string;
    /**
     * HTTP status; 0 when the page did not load
     *
     * @generated from field: int32 status = 2;
     */
    status: number;
    /**
     * @generated from field: string build_sha = 3;
     */
    buildSha: string;
    /**
     * @generated from field: string title = 4;
     */
    title: string;
    /**
     * near zero is a blank page
     *
     * @generated from field: int32 text_length = 5;
     */
    textLength: number;
    /**
     * @generated from field: repeated string errors = 6;
     */
    errors: string[];
    /**
     * @generated from field: bytes screenshot_png = 7;
     */
    screenshotPng: Uint8Array;
    /**
     * @generated from field: google.protobuf.Timestamp checked_at = 8;
     */
    checkedAt?: Timestamp;
    /**
     * why nothing could be checked
     *
     * @generated from field: string note = 9;
     */
    note: string;
};
/**
 * Describes the message tank.hosting.v1.LiveCheck.
 * Use `create(LiveCheckSchema)` to create a new message.
 */
export declare const LiveCheckSchema: GenMessage<LiveCheck>;
/**
 * HostingService is the Infrastructure page: what a product TANK runs for a Tread is,
 * how it is doing, what it costs and what people may change about it. Every request
 * names the Tread (channel_id); members of the Tread may read, and what each role may
 * change is decided by the server, never by the client.
 *
 * @generated from service tank.hosting.v1.HostingService
 */
export declare const HostingService: GenService<{
    /**
     * The product's running state, recent cluster events and log tail.
     *
     * @generated from rpc tank.hosting.v1.HostingService.GetProduct
     */
    getProduct: {
        methodKind: "unary";
        input: typeof GetProductRequestSchema;
        output: typeof GetProductResponseSchema;
    };
    /**
     * Opens a page of the product as a visitor would and returns what it showed.
     *
     * @generated from rpc tank.hosting.v1.HostingService.CheckProduct
     */
    checkProduct: {
        methodKind: "unary";
        input: typeof CheckProductRequestSchema;
        output: typeof CheckProductResponseSchema;
    };
}>;
