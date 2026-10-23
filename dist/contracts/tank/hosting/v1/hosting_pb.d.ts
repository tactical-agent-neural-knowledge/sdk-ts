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
 * One process of the product, with what the cluster says about it.
 *
 * @generated from message tank.hosting.v1.Resource
 */
export type Resource = Message<"tank.hosting.v1.Resource"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * service | worker | cron | job
     *
     * @generated from field: string kind = 2;
     */
    kind: string;
    /**
     * s | m | l | xl | 2xl
     *
     * @generated from field: string size = 3;
     */
    size: string;
    /**
     * @generated from field: string cpu = 4;
     */
    cpu: string;
    /**
     * @generated from field: string memory = 5;
     */
    memory: string;
    /**
     * @generated from field: bool public = 6;
     */
    public: boolean;
    /**
     * @generated from field: int32 min = 7;
     */
    min: number;
    /**
     * @generated from field: int32 max = 8;
     */
    max: number;
    /**
     * @generated from field: string schedule = 9;
     */
    schedule: string;
    /**
     * @generated from field: int32 timeout_seconds = 10;
     */
    timeoutSeconds: number;
    /**
     * @generated from field: string volume = 11;
     */
    volume: string;
    /**
     * From the cluster:
     *
     * @generated from field: int32 ready = 12;
     */
    ready: number;
    /**
     * @generated from field: int32 desired = 13;
     */
    desired: number;
    /**
     * @generated from field: bool paused = 14;
     */
    paused: boolean;
    /**
     * @generated from field: google.protobuf.Timestamp last_run_at = 15;
     */
    lastRunAt?: Timestamp;
    /**
     * succeeded | failed | running
     *
     * @generated from field: string last_run_result = 16;
     */
    lastRunResult: string;
};
/**
 * Describes the message tank.hosting.v1.Resource.
 * Use `create(ResourceSchema)` to create a new message.
 */
export declare const ResourceSchema: GenMessage<Resource>;
/**
 * @generated from message tank.hosting.v1.Cost
 */
export type Cost = Message<"tank.hosting.v1.Cost"> & {
    /**
     * @generated from field: int64 base_cents = 1;
     */
    baseCents: bigint;
    /**
     * @generated from field: int64 overage_cents = 2;
     */
    overageCents: bigint;
    /**
     * @generated from field: int64 total_cents = 3;
     */
    totalCents: bigint;
    /**
     * @generated from field: repeated string lines = 4;
     */
    lines: string[];
};
/**
 * Describes the message tank.hosting.v1.Cost.
 * Use `create(CostSchema)` to create a new message.
 */
export declare const CostSchema: GenMessage<Cost>;
/**
 * @generated from message tank.hosting.v1.PendingBuild
 */
export type PendingBuild = Message<"tank.hosting.v1.PendingBuild"> & {
    /**
     * @generated from field: string sha = 1;
     */
    sha: string;
    /**
     * spec | cost
     *
     * @generated from field: string reason = 2;
     */
    reason: string;
    /**
     * @generated from field: repeated string problems = 3;
     */
    problems: string[];
    /**
     * @generated from field: tank.hosting.v1.Cost estimate = 4;
     */
    estimate?: Cost;
    /**
     * @generated from field: google.protobuf.Timestamp at = 5;
     */
    at?: Timestamp;
    /**
     * the caller is an owner or billing admin
     *
     * @generated from field: bool can_approve = 6;
     */
    canApprove: boolean;
};
/**
 * Describes the message tank.hosting.v1.PendingBuild.
 * Use `create(PendingBuildSchema)` to create a new message.
 */
export declare const PendingBuildSchema: GenMessage<PendingBuild>;
/**
 * @generated from message tank.hosting.v1.GetResourcesRequest
 */
export type GetResourcesRequest = Message<"tank.hosting.v1.GetResourcesRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
};
/**
 * Describes the message tank.hosting.v1.GetResourcesRequest.
 * Use `create(GetResourcesRequestSchema)` to create a new message.
 */
export declare const GetResourcesRequestSchema: GenMessage<GetResourcesRequest>;
/**
 * @generated from message tank.hosting.v1.GetResourcesResponse
 */
export type GetResourcesResponse = Message<"tank.hosting.v1.GetResourcesResponse"> & {
    /**
     * @generated from field: repeated tank.hosting.v1.Resource resources = 1;
     */
    resources: Resource[];
    /**
     * what the running build costs a month
     *
     * @generated from field: tank.hosting.v1.Cost estimate = 2;
     */
    estimate?: Cost;
    /**
     * @generated from field: tank.hosting.v1.PendingBuild pending = 3;
     */
    pending?: PendingBuild;
    /**
     * names only, never values
     *
     * @generated from field: repeated string secrets = 4;
     */
    secrets: string[];
    /**
     * admins: operate, change, roll back
     *
     * @generated from field: bool can_manage = 5;
     */
    canManage: boolean;
};
/**
 * Describes the message tank.hosting.v1.GetResourcesResponse.
 * Use `create(GetResourcesResponseSchema)` to create a new message.
 */
export declare const GetResourcesResponseSchema: GenMessage<GetResourcesResponse>;
/**
 * @generated from message tank.hosting.v1.ApproveBuildRequest
 */
export type ApproveBuildRequest = Message<"tank.hosting.v1.ApproveBuildRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: string sha = 2;
     */
    sha: string;
};
/**
 * Describes the message tank.hosting.v1.ApproveBuildRequest.
 * Use `create(ApproveBuildRequestSchema)` to create a new message.
 */
export declare const ApproveBuildRequestSchema: GenMessage<ApproveBuildRequest>;
/**
 * @generated from message tank.hosting.v1.ApproveBuildResponse
 */
export type ApproveBuildResponse = Message<"tank.hosting.v1.ApproveBuildResponse"> & {};
/**
 * Describes the message tank.hosting.v1.ApproveBuildResponse.
 * Use `create(ApproveBuildResponseSchema)` to create a new message.
 */
export declare const ApproveBuildResponseSchema: GenMessage<ApproveBuildResponse>;
/**
 * @generated from message tank.hosting.v1.OperateRequest
 */
export type OperateRequest = Message<"tank.hosting.v1.OperateRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * restart | pause | resume | run
     *
     * @generated from field: string action = 2;
     */
    action: string;
    /**
     * @generated from field: string process = 3;
     */
    process: string;
};
/**
 * Describes the message tank.hosting.v1.OperateRequest.
 * Use `create(OperateRequestSchema)` to create a new message.
 */
export declare const OperateRequestSchema: GenMessage<OperateRequest>;
/**
 * @generated from message tank.hosting.v1.OperateResponse
 */
export type OperateResponse = Message<"tank.hosting.v1.OperateResponse"> & {};
/**
 * Describes the message tank.hosting.v1.OperateResponse.
 * Use `create(OperateResponseSchema)` to create a new message.
 */
export declare const OperateResponseSchema: GenMessage<OperateResponse>;
/**
 * @generated from message tank.hosting.v1.Change
 */
export type Change = Message<"tank.hosting.v1.Change"> & {
    /**
     * @generated from field: string sha = 1;
     */
    sha: string;
    /**
     * @generated from field: string message = 2;
     */
    message: string;
    /**
     * @generated from field: google.protobuf.Timestamp at = 3;
     */
    at?: Timestamp;
};
/**
 * Describes the message tank.hosting.v1.Change.
 * Use `create(ChangeSchema)` to create a new message.
 */
export declare const ChangeSchema: GenMessage<Change>;
/**
 * @generated from message tank.hosting.v1.ListChangesRequest
 */
export type ListChangesRequest = Message<"tank.hosting.v1.ListChangesRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: int32 limit = 2;
     */
    limit: number;
};
/**
 * Describes the message tank.hosting.v1.ListChangesRequest.
 * Use `create(ListChangesRequestSchema)` to create a new message.
 */
export declare const ListChangesRequestSchema: GenMessage<ListChangesRequest>;
/**
 * @generated from message tank.hosting.v1.ListChangesResponse
 */
export type ListChangesResponse = Message<"tank.hosting.v1.ListChangesResponse"> & {
    /**
     * @generated from field: repeated tank.hosting.v1.Change changes = 1;
     */
    changes: Change[];
};
/**
 * Describes the message tank.hosting.v1.ListChangesResponse.
 * Use `create(ListChangesResponseSchema)` to create a new message.
 */
export declare const ListChangesResponseSchema: GenMessage<ListChangesResponse>;
/**
 * @generated from message tank.hosting.v1.RollbackRequest
 */
export type RollbackRequest = Message<"tank.hosting.v1.RollbackRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * the product repository commit whose build to put back
     *
     * @generated from field: string sha = 2;
     */
    sha: string;
};
/**
 * Describes the message tank.hosting.v1.RollbackRequest.
 * Use `create(RollbackRequestSchema)` to create a new message.
 */
export declare const RollbackRequestSchema: GenMessage<RollbackRequest>;
/**
 * @generated from message tank.hosting.v1.RollbackResponse
 */
export type RollbackResponse = Message<"tank.hosting.v1.RollbackResponse"> & {
    /**
     * @generated from field: bool applied = 1;
     */
    applied: boolean;
    /**
     * @generated from field: string reason = 2;
     */
    reason: string;
    /**
     * @generated from field: repeated string problems = 3;
     */
    problems: string[];
    /**
     * @generated from field: tank.hosting.v1.Cost estimate = 4;
     */
    estimate?: Cost;
};
/**
 * Describes the message tank.hosting.v1.RollbackResponse.
 * Use `create(RollbackResponseSchema)` to create a new message.
 */
export declare const RollbackResponseSchema: GenMessage<RollbackResponse>;
/**
 * @generated from message tank.hosting.v1.UpdateResourceRequest
 */
export type UpdateResourceRequest = Message<"tank.hosting.v1.UpdateResourceRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string size = 3;
     */
    size: string;
    /**
     * @generated from field: int32 min = 4;
     */
    min: number;
    /**
     * @generated from field: int32 max = 5;
     */
    max: number;
    /**
     * @generated from field: string schedule = 6;
     */
    schedule: string;
};
/**
 * Describes the message tank.hosting.v1.UpdateResourceRequest.
 * Use `create(UpdateResourceRequestSchema)` to create a new message.
 */
export declare const UpdateResourceRequestSchema: GenMessage<UpdateResourceRequest>;
/**
 * @generated from message tank.hosting.v1.UpdateResourceResponse
 */
export type UpdateResourceResponse = Message<"tank.hosting.v1.UpdateResourceResponse"> & {
    /**
     * @generated from field: tank.hosting.v1.Cost estimate = 1;
     */
    estimate?: Cost;
};
/**
 * Describes the message tank.hosting.v1.UpdateResourceResponse.
 * Use `create(UpdateResourceResponseSchema)` to create a new message.
 */
export declare const UpdateResourceResponseSchema: GenMessage<UpdateResourceResponse>;
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
    /**
     * What the product is made of (from its tank.yaml), what it costs, and a build waiting
     * to land. Members read it.
     *
     * @generated from rpc tank.hosting.v1.HostingService.GetResources
     */
    getResources: {
        methodKind: "unary";
        input: typeof GetResourcesRequestSchema;
        output: typeof GetResourcesResponseSchema;
    };
    /**
     * Owners and billing admins approve a build that costs more than the product was approved for.
     *
     * @generated from rpc tank.hosting.v1.HostingService.ApproveBuild
     */
    approveBuild: {
        methodKind: "unary";
        input: typeof ApproveBuildRequestSchema;
        output: typeof ApproveBuildResponseSchema;
    };
    /**
     * Admins: restart, pause or resume a schedule, run a job.
     *
     * @generated from rpc tank.hosting.v1.HostingService.Operate
     */
    operate: {
        methodKind: "unary";
        input: typeof OperateRequestSchema;
        output: typeof OperateResponseSchema;
    };
    /**
     * Every deploy, hold, approval and operation, newest first. Members read it.
     *
     * @generated from rpc tank.hosting.v1.HostingService.ListChanges
     */
    listChanges: {
        methodKind: "unary";
        input: typeof ListChangesRequestSchema;
        output: typeof ListChangesResponseSchema;
    };
    /**
     * Admins put an earlier build back; one that costs more waits for an owner like any build.
     *
     * @generated from rpc tank.hosting.v1.HostingService.Rollback
     */
    rollback: {
        methodKind: "unary";
        input: typeof RollbackRequestSchema;
        output: typeof RollbackResponseSchema;
    };
    /**
     * Admins change a process's size, scale or schedule: a commit to tank.yaml in their name.
     *
     * @generated from rpc tank.hosting.v1.HostingService.UpdateResource
     */
    updateResource: {
        methodKind: "unary";
        input: typeof UpdateResourceRequestSchema;
        output: typeof UpdateResourceResponseSchema;
    };
}>;
