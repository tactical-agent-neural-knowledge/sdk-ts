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
    /**
     * database: "40Gi"
     *
     * @generated from field: string storage = 17;
     */
    storage: string;
    /**
     * database: postgis, vector
     *
     * @generated from field: repeated string extensions = 18;
     */
    extensions: string[];
    /**
     * worker, schedule or job: working disk at /scratch
     *
     * @generated from field: int32 scratch_gi = 19;
     */
    scratchGi: number;
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
    /**
     * hosting so far this month: the base for the hours it ran, plus use beyond the bundle
     *
     * @generated from field: int64 month_cents = 6;
     */
    monthCents: bigint;
    /**
     * the monthly cap; 0 is none
     *
     * @generated from field: int64 cap_cents = 7;
     */
    capCents: bigint;
    /**
     * at the cap now: workers and schedules paused
     *
     * @generated from field: bool capped = 8;
     */
    capped: boolean;
    /**
     * the caller is an owner
     *
     * @generated from field: bool can_set_cap = 9;
     */
    canSetCap: boolean;
    /**
     * open pull requests running the whole product
     *
     * @generated from field: repeated tank.hosting.v1.Preview previews = 10;
     */
    previews: Preview[];
    /**
     * the secrets that have a value
     *
     * @generated from field: repeated string secrets_set = 11;
     */
    secretsSet: string[];
    /**
     * datasets TANK's library offers
     *
     * @generated from field: repeated string library = 12;
     */
    library: string[];
    /**
     * plain environment names set in tank.yaml
     *
     * @generated from field: repeated string env_keys = 13;
     */
    envKeys: string[];
};
/**
 * Describes the message tank.hosting.v1.GetResourcesResponse.
 * Use `create(GetResourcesResponseSchema)` to create a new message.
 */
export declare const GetResourcesResponseSchema: GenMessage<GetResourcesResponse>;
/**
 * @generated from message tank.hosting.v1.Preview
 */
export type Preview = Message<"tank.hosting.v1.Preview"> & {
    /**
     * @generated from field: int32 pull_request = 1;
     */
    pullRequest: number;
    /**
     * https://<slug>--pr<n>.tank.chat
     *
     * @generated from field: string url = 2;
     */
    url: string;
    /**
     * the commit it runs
     *
     * @generated from field: string build = 3;
     */
    build: string;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 4;
     */
    expiresAt?: Timestamp;
};
/**
 * Describes the message tank.hosting.v1.Preview.
 * Use `create(PreviewSchema)` to create a new message.
 */
export declare const PreviewSchema: GenMessage<Preview>;
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
 * @generated from message tank.hosting.v1.SetCapRequest
 */
export type SetCapRequest = Message<"tank.hosting.v1.SetCapRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * 0 removes the cap
     *
     * @generated from field: int64 cap_cents = 2;
     */
    capCents: bigint;
};
/**
 * Describes the message tank.hosting.v1.SetCapRequest.
 * Use `create(SetCapRequestSchema)` to create a new message.
 */
export declare const SetCapRequestSchema: GenMessage<SetCapRequest>;
/**
 * @generated from message tank.hosting.v1.SetCapResponse
 */
export type SetCapResponse = Message<"tank.hosting.v1.SetCapResponse"> & {};
/**
 * Describes the message tank.hosting.v1.SetCapResponse.
 * Use `create(SetCapResponseSchema)` to create a new message.
 */
export declare const SetCapResponseSchema: GenMessage<SetCapResponse>;
/**
 * @generated from message tank.hosting.v1.HostedProduct
 */
export type HostedProduct = Message<"tank.hosting.v1.HostedProduct"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: string channel_name = 2;
     */
    channelName: string;
    /**
     * @generated from field: string slug = 3;
     */
    slug: string;
    /**
     * @generated from field: string url = 4;
     */
    url: string;
    /**
     * @generated from field: bool awake = 5;
     */
    awake: boolean;
    /**
     * @generated from field: int64 month_cents = 6;
     */
    monthCents: bigint;
    /**
     * @generated from field: int64 cap_cents = 7;
     */
    capCents: bigint;
    /**
     * @generated from field: bool capped = 8;
     */
    capped: boolean;
};
/**
 * Describes the message tank.hosting.v1.HostedProduct.
 * Use `create(HostedProductSchema)` to create a new message.
 */
export declare const HostedProductSchema: GenMessage<HostedProduct>;
/**
 * @generated from message tank.hosting.v1.ListHostingRequest
 */
export type ListHostingRequest = Message<"tank.hosting.v1.ListHostingRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.hosting.v1.ListHostingRequest.
 * Use `create(ListHostingRequestSchema)` to create a new message.
 */
export declare const ListHostingRequestSchema: GenMessage<ListHostingRequest>;
/**
 * @generated from message tank.hosting.v1.ListHostingResponse
 */
export type ListHostingResponse = Message<"tank.hosting.v1.ListHostingResponse"> & {
    /**
     * the Treads the caller is in
     *
     * @generated from field: repeated tank.hosting.v1.HostedProduct products = 1;
     */
    products: HostedProduct[];
    /**
     * all of them
     *
     * @generated from field: int64 month_cents = 2;
     */
    monthCents: bigint;
    /**
     * @generated from field: int64 allowance_cents = 3;
     */
    allowanceCents: bigint;
    /**
     * the caller is an owner
     *
     * @generated from field: bool can_set = 4;
     */
    canSet: boolean;
};
/**
 * Describes the message tank.hosting.v1.ListHostingResponse.
 * Use `create(ListHostingResponseSchema)` to create a new message.
 */
export declare const ListHostingResponseSchema: GenMessage<ListHostingResponse>;
/**
 * @generated from message tank.hosting.v1.SetAllowanceRequest
 */
export type SetAllowanceRequest = Message<"tank.hosting.v1.SetAllowanceRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: int64 allowance_cents = 2;
     */
    allowanceCents: bigint;
};
/**
 * Describes the message tank.hosting.v1.SetAllowanceRequest.
 * Use `create(SetAllowanceRequestSchema)` to create a new message.
 */
export declare const SetAllowanceRequestSchema: GenMessage<SetAllowanceRequest>;
/**
 * @generated from message tank.hosting.v1.SetAllowanceResponse
 */
export type SetAllowanceResponse = Message<"tank.hosting.v1.SetAllowanceResponse"> & {};
/**
 * Describes the message tank.hosting.v1.SetAllowanceResponse.
 * Use `create(SetAllowanceResponseSchema)` to create a new message.
 */
export declare const SetAllowanceResponseSchema: GenMessage<SetAllowanceResponse>;
/**
 * @generated from message tank.hosting.v1.ExportProductRequest
 */
export type ExportProductRequest = Message<"tank.hosting.v1.ExportProductRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
};
/**
 * Describes the message tank.hosting.v1.ExportProductRequest.
 * Use `create(ExportProductRequestSchema)` to create a new message.
 */
export declare const ExportProductRequestSchema: GenMessage<ExportProductRequest>;
/**
 * @generated from message tank.hosting.v1.ExportProductResponse
 */
export type ExportProductResponse = Message<"tank.hosting.v1.ExportProductResponse"> & {
    /**
     * docker-compose.yml
     *
     * @generated from field: string filename = 1;
     */
    filename: string;
    /**
     * @generated from field: string content = 2;
     */
    content: string;
};
/**
 * Describes the message tank.hosting.v1.ExportProductResponse.
 * Use `create(ExportProductResponseSchema)` to create a new message.
 */
export declare const ExportProductResponseSchema: GenMessage<ExportProductResponse>;
/**
 * @generated from message tank.hosting.v1.SetSecretRequest
 */
export type SetSecretRequest = Message<"tank.hosting.v1.SetSecretRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * empty clears it
     *
     * @generated from field: string value = 3;
     */
    value: string;
};
/**
 * Describes the message tank.hosting.v1.SetSecretRequest.
 * Use `create(SetSecretRequestSchema)` to create a new message.
 */
export declare const SetSecretRequestSchema: GenMessage<SetSecretRequest>;
/**
 * @generated from message tank.hosting.v1.SetSecretResponse
 */
export type SetSecretResponse = Message<"tank.hosting.v1.SetSecretResponse"> & {};
/**
 * Describes the message tank.hosting.v1.SetSecretResponse.
 * Use `create(SetSecretResponseSchema)` to create a new message.
 */
export declare const SetSecretResponseSchema: GenMessage<SetSecretResponse>;
/**
 * One change from hosting settings. kind: service | worker | cron | job | database | cache
 * | bucket | dataset | env; name is empty for the cache.
 *
 * @generated from message tank.hosting.v1.ResourceChange
 */
export type ResourceChange = Message<"tank.hosting.v1.ResourceChange"> & {
    /**
     * @generated from field: string kind = 1;
     */
    kind: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: bool remove = 3;
     */
    remove: boolean;
    /**
     * @generated from field: string size = 4;
     */
    size: string;
    /**
     * @generated from field: int32 min = 5;
     */
    min: number;
    /**
     * @generated from field: int32 max = 6;
     */
    max: number;
    /**
     * @generated from field: string schedule = 7;
     */
    schedule: string;
    /**
     * @generated from field: string storage = 8;
     */
    storage: string;
    /**
     * @generated from field: repeated string extensions = 9;
     */
    extensions: string[];
    /**
     * @generated from field: repeated string command = 10;
     */
    command: string[];
    /**
     * @generated from field: string scratch = 11;
     */
    scratch: string;
    /**
     * @generated from field: string timeout = 12;
     */
    timeout: string;
    /**
     * @generated from field: string value = 13;
     */
    value: string;
};
/**
 * Describes the message tank.hosting.v1.ResourceChange.
 * Use `create(ResourceChangeSchema)` to create a new message.
 */
export declare const ResourceChangeSchema: GenMessage<ResourceChange>;
/**
 * @generated from message tank.hosting.v1.PreviewChangeRequest
 */
export type PreviewChangeRequest = Message<"tank.hosting.v1.PreviewChangeRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from oneof tank.hosting.v1.PreviewChangeRequest.edit
     */
    edit: {
        /**
         * @generated from field: tank.hosting.v1.ResourceChange change = 2;
         */
        value: ResourceChange;
        case: "change";
    } | {
        /**
         * @generated from field: string text = 3;
         */
        value: string;
        case: "text";
    } | {
        case: undefined;
        value?: undefined;
    };
};
/**
 * Describes the message tank.hosting.v1.PreviewChangeRequest.
 * Use `create(PreviewChangeRequestSchema)` to create a new message.
 */
export declare const PreviewChangeRequestSchema: GenMessage<PreviewChangeRequest>;
/**
 * @generated from message tank.hosting.v1.PreviewChangeResponse
 */
export type PreviewChangeResponse = Message<"tank.hosting.v1.PreviewChangeResponse"> & {
    /**
     * @generated from field: string text = 1;
     */
    text: string;
    /**
     * @generated from field: tank.hosting.v1.Cost before = 2;
     */
    before?: Cost;
    /**
     * @generated from field: tank.hosting.v1.Cost after = 3;
     */
    after?: Cost;
    /**
     * @generated from field: repeated string problems = 4;
     */
    problems: string[];
    /**
     * it costs more: only an owner can buy it
     *
     * @generated from field: bool needs_owner = 5;
     */
    needsOwner: boolean;
    /**
     * the caller may make this change
     *
     * @generated from field: bool can_apply = 6;
     */
    canApply: boolean;
};
/**
 * Describes the message tank.hosting.v1.PreviewChangeResponse.
 * Use `create(PreviewChangeResponseSchema)` to create a new message.
 */
export declare const PreviewChangeResponseSchema: GenMessage<PreviewChangeResponse>;
/**
 * @generated from message tank.hosting.v1.ApplyChangeRequest
 */
export type ApplyChangeRequest = Message<"tank.hosting.v1.ApplyChangeRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from oneof tank.hosting.v1.ApplyChangeRequest.edit
     */
    edit: {
        /**
         * @generated from field: tank.hosting.v1.ResourceChange change = 2;
         */
        value: ResourceChange;
        case: "change";
    } | {
        /**
         * @generated from field: string text = 3;
         */
        value: string;
        case: "text";
    } | {
        case: undefined;
        value?: undefined;
    };
    /**
     * the monthly total the owner was shown, for a change that costs more
     *
     * @generated from field: int64 accepted_total_cents = 4;
     */
    acceptedTotalCents: bigint;
};
/**
 * Describes the message tank.hosting.v1.ApplyChangeRequest.
 * Use `create(ApplyChangeRequestSchema)` to create a new message.
 */
export declare const ApplyChangeRequestSchema: GenMessage<ApplyChangeRequest>;
/**
 * @generated from message tank.hosting.v1.ApplyChangeResponse
 */
export type ApplyChangeResponse = Message<"tank.hosting.v1.ApplyChangeResponse"> & {
    /**
     * @generated from field: string commit_sha = 1;
     */
    commitSha: string;
    /**
     * @generated from field: tank.hosting.v1.Cost estimate = 2;
     */
    estimate?: Cost;
    /**
     * @generated from field: bool live = 3;
     */
    live: boolean;
};
/**
 * Describes the message tank.hosting.v1.ApplyChangeResponse.
 * Use `create(ApplyChangeResponseSchema)` to create a new message.
 */
export declare const ApplyChangeResponseSchema: GenMessage<ApplyChangeResponse>;
/**
 * @generated from message tank.hosting.v1.GetSpecTextRequest
 */
export type GetSpecTextRequest = Message<"tank.hosting.v1.GetSpecTextRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
};
/**
 * Describes the message tank.hosting.v1.GetSpecTextRequest.
 * Use `create(GetSpecTextRequestSchema)` to create a new message.
 */
export declare const GetSpecTextRequestSchema: GenMessage<GetSpecTextRequest>;
/**
 * @generated from message tank.hosting.v1.GetSpecTextResponse
 */
export type GetSpecTextResponse = Message<"tank.hosting.v1.GetSpecTextResponse"> & {
    /**
     * @generated from field: string text = 1;
     */
    text: string;
    /**
     * @generated from field: bool can_edit = 2;
     */
    canEdit: boolean;
};
/**
 * Describes the message tank.hosting.v1.GetSpecTextResponse.
 * Use `create(GetSpecTextResponseSchema)` to create a new message.
 */
export declare const GetSpecTextResponseSchema: GenMessage<GetSpecTextResponse>;
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
    /**
     * Owners set a product's monthly hosting cap (0: none). At 80% the owners are told; at
     * the cap its workers and schedules pause until the 1st or a higher cap, and the site
     * stays up.
     *
     * @generated from rpc tank.hosting.v1.HostingService.SetCap
     */
    setCap: {
        methodKind: "unary";
        input: typeof SetCapRequestSchema;
        output: typeof SetCapResponseSchema;
    };
    /**
     * Every product the workspace hosts, for Settings, Billing, Hosting: what each cost so
     * far this month, its cap, and the workspace's allowance. Members of the workspace read.
     *
     * @generated from rpc tank.hosting.v1.HostingService.ListHosting
     */
    listHosting: {
        methodKind: "unary";
        input: typeof ListHostingRequestSchema;
        output: typeof ListHostingResponseSchema;
    };
    /**
     * Owners set how much more a month a new build may cost before it waits for them.
     *
     * @generated from rpc tank.hosting.v1.HostingService.SetAllowance
     */
    setAllowance: {
        methodKind: "unary";
        input: typeof SetAllowanceRequestSchema;
        output: typeof SetAllowanceResponseSchema;
    };
    /**
     * Admins take the product with them: a docker-compose file that runs it without TANK.
     *
     * @generated from rpc tank.hosting.v1.HostingService.ExportProduct
     */
    exportProduct: {
        methodKind: "unary";
        input: typeof ExportProductRequestSchema;
        output: typeof ExportProductResponseSchema;
    };
    /**
     * Admins set a declared secret's value. Never returned; the product restarts with it.
     *
     * @generated from rpc tank.hosting.v1.HostingService.SetSecret
     */
    setSecret: {
        methodKind: "unary";
        input: typeof SetSecretRequestSchema;
        output: typeof SetSecretResponseSchema;
    };
    /**
     * Hosting settings: what a change would cost before anybody commits to it. Members read.
     *
     * @generated from rpc tank.hosting.v1.HostingService.PreviewChange
     */
    previewChange: {
        methodKind: "unary";
        input: typeof PreviewChangeRequestSchema;
        output: typeof PreviewChangeResponseSchema;
    };
    /**
     * Makes a change: admins for one that costs the same or less; a change that costs more
     * is a purchase, so it takes an owner and the exact monthly price they were shown.
     *
     * @generated from rpc tank.hosting.v1.HostingService.ApplyChange
     */
    applyChange: {
        methodKind: "unary";
        input: typeof ApplyChangeRequestSchema;
        output: typeof ApplyChangeResponseSchema;
    };
    /**
     * tank.yaml as it is, for the editor. Members read.
     *
     * @generated from rpc tank.hosting.v1.HostingService.GetSpecText
     */
    getSpecText: {
        methodKind: "unary";
        input: typeof GetSpecTextRequestSchema;
        output: typeof GetSpecTextResponseSchema;
    };
}>;
