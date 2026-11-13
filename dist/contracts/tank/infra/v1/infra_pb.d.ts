import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/infra/v1/infra.proto.
 */
export declare const file_tank_infra_v1_infra: GenFile;
/**
 * @generated from message tank.infra.v1.AwsConfig
 */
export type AwsConfig = Message<"tank.infra.v1.AwsConfig"> & {
    /**
     * The role TANK assumes, in the customer's account.
     *
     * @generated from field: string role_arn = 1;
     */
    roleArn: string;
    /**
     * Made by TANK when the connection is created, unique to it; the role's trust policy
     * requires it. Read only for clients.
     *
     * @generated from field: string external_id = 2;
     */
    externalId: string;
    /**
     * @generated from field: repeated string regions = 3;
     */
    regions: string[];
    /**
     * EKS clusters to read with kubectl, each "region/name" or "name" (first region).
     *
     * @generated from field: repeated string eks_clusters = 4;
     */
    eksClusters: string[];
};
/**
 * Describes the message tank.infra.v1.AwsConfig.
 * Use `create(AwsConfigSchema)` to create a new message.
 */
export declare const AwsConfigSchema: GenMessage<AwsConfig>;
/**
 * @generated from message tank.infra.v1.GcpConfig
 */
export type GcpConfig = Message<"tank.infra.v1.GcpConfig"> & {
    /**
     * @generated from field: string project_id = 1;
     */
    projectId: string;
    /**
     * @generated from field: string project_number = 2;
     */
    projectNumber: string;
    /**
     * The workload identity pool and provider that trust TANK's issuer.
     *
     * @generated from field: string pool_id = 3;
     */
    poolId: string;
    /**
     * @generated from field: string provider_id = 4;
     */
    providerId: string;
    /**
     * The read-only service account TANK impersonates.
     *
     * @generated from field: string service_account = 5;
     */
    serviceAccount: string;
    /**
     * GKE clusters, each "location/name".
     *
     * @generated from field: repeated string gke_clusters = 6;
     */
    gkeClusters: string[];
};
/**
 * Describes the message tank.infra.v1.GcpConfig.
 * Use `create(GcpConfigSchema)` to create a new message.
 */
export declare const GcpConfigSchema: GenMessage<GcpConfig>;
/**
 * @generated from message tank.infra.v1.AzureConfig
 */
export type AzureConfig = Message<"tank.infra.v1.AzureConfig"> & {
    /**
     * @generated from field: string tenant_id = 1;
     */
    tenantId: string;
    /**
     * the app registration with TANK's federated credential
     *
     * @generated from field: string client_id = 2;
     */
    clientId: string;
    /**
     * @generated from field: string subscription_id = 3;
     */
    subscriptionId: string;
    /**
     * AKS clusters, each "resourceGroup/name".
     *
     * @generated from field: repeated string aks_clusters = 4;
     */
    aksClusters: string[];
};
/**
 * Describes the message tank.infra.v1.AzureConfig.
 * Use `create(AzureConfigSchema)` to create a new message.
 */
export declare const AzureConfigSchema: GenMessage<AzureConfig>;
/**
 * @generated from message tank.infra.v1.KubernetesConfig
 */
export type KubernetesConfig = Message<"tank.infra.v1.KubernetesConfig"> & {
    /**
     * https://…
     *
     * @generated from field: string server = 1;
     */
    server: string;
    /**
     * PEM or base64 PEM
     *
     * @generated from field: string ca_data = 2;
     */
    caData: string;
    /**
     * @generated from field: tank.infra.v1.KubeAuth auth = 3;
     */
    auth: KubeAuth;
    /**
     * The audience the cluster expects in TANK's token (OIDC); "tank" when empty.
     *
     * @generated from field: string audience = 4;
     */
    audience: string;
};
/**
 * Describes the message tank.infra.v1.KubernetesConfig.
 * Use `create(KubernetesConfigSchema)` to create a new message.
 */
export declare const KubernetesConfigSchema: GenMessage<KubernetesConfig>;
/**
 * @generated from message tank.infra.v1.ApiConfig
 */
export type ApiConfig = Message<"tank.infra.v1.ApiConfig"> & {
    /**
     * Where calls go, e.g. https://api.datadoghq.com. Paths are relative to it.
     *
     * @generated from field: string base_url = 1;
     */
    baseUrl: string;
    /**
     * Hosts the token may be sent to; the base URL's host is always one.
     *
     * @generated from field: repeated string allowed_hosts = 2;
     */
    allowedHosts: string[];
    /**
     * How the token is sent: header name and what goes before it ("Bearer ").
     *
     * @generated from field: string header_name = 3;
     */
    headerName: string;
    /**
     * @generated from field: string header_prefix = 4;
     */
    headerPrefix: string;
};
/**
 * Describes the message tank.infra.v1.ApiConfig.
 * Use `create(ApiConfigSchema)` to create a new message.
 */
export declare const ApiConfigSchema: GenMessage<ApiConfig>;
/**
 * @generated from message tank.infra.v1.DatabaseConfig
 */
export type DatabaseConfig = Message<"tank.infra.v1.DatabaseConfig"> & {
    /**
     * @generated from field: tank.infra.v1.DatabaseEngine engine = 1;
     */
    engine: DatabaseEngine;
    /**
     * as the relay reaches it, e.g. edero-console-db.xxxx.us-east-1.rds.amazonaws.com
     *
     * @generated from field: string host = 2;
     */
    host: string;
    /**
     * 5432 when zero
     *
     * @generated from field: int32 port = 3;
     */
    port: number;
    /**
     * @generated from field: string database = 4;
     */
    database: string;
    /**
     * a read-only role; the setup guide creates one
     *
     * @generated from field: string user = 5;
     */
    user: string;
    /**
     * require (default), verify-full, disable
     *
     * @generated from field: string ssl_mode = 6;
     */
    sslMode: string;
};
/**
 * Describes the message tank.infra.v1.DatabaseConfig.
 * Use `create(DatabaseConfigSchema)` to create a new message.
 */
export declare const DatabaseConfigSchema: GenMessage<DatabaseConfig>;
/**
 * A test login's settings. Nothing in it is secret: the password and the one-time-code seed
 * are write only (CreateConnectionRequest.secret and totp_seed).
 *
 * @generated from message tank.infra.v1.TestLoginConfig
 */
export type TestLoginConfig = Message<"tank.infra.v1.TestLoginConfig"> & {
    /**
     * Where the sign-in form is: https://…
     *
     * @generated from field: string login_url = 1;
     */
    loginUrl: string;
    /**
     * The hosts TANK's browser may open while signed in with it (the app, and the sign-in
     * provider's host when it is a different one). The login URL's host is always one.
     *
     * @generated from field: repeated string app_hosts = 2;
     */
    appHosts: string[];
    /**
     * The account's username or email. Not secret: an agent may read it.
     *
     * @generated from field: string username = 3;
     */
    username: string;
    /**
     * A one-time-code (TOTP) seed is stored. Read only for clients.
     *
     * @generated from field: bool has_totp = 4;
     */
    hasTotp: boolean;
    /**
     * Repositories (owner/name) whose runs may use it; empty means any run its Treads allow.
     *
     * @generated from field: repeated string repos = 5;
     */
    repos: string[];
    /**
     * CSS selectors for a sign-in form TANK cannot work out by itself; empty works it out.
     *
     * @generated from field: string username_selector = 6;
     */
    usernameSelector: string;
    /**
     * @generated from field: string password_selector = 7;
     */
    passwordSelector: string;
    /**
     * @generated from field: string submit_selector = 8;
     */
    submitSelector: string;
};
/**
 * Describes the message tank.infra.v1.TestLoginConfig.
 * Use `create(TestLoginConfigSchema)` to create a new message.
 */
export declare const TestLoginConfigSchema: GenMessage<TestLoginConfig>;
/**
 * @generated from message tank.infra.v1.Connection
 */
export type Connection = Message<"tank.infra.v1.Connection"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: tank.infra.v1.Provider provider = 4;
     */
    provider: Provider;
    /**
     * What it is for, in a sentence the agent reads ("production, us-east-1").
     *
     * @generated from field: string description = 5;
     */
    description: string;
    /**
     * @generated from field: tank.infra.v1.AwsConfig aws = 6;
     */
    aws?: AwsConfig;
    /**
     * @generated from field: tank.infra.v1.GcpConfig gcp = 7;
     */
    gcp?: GcpConfig;
    /**
     * @generated from field: tank.infra.v1.AzureConfig azure = 8;
     */
    azure?: AzureConfig;
    /**
     * @generated from field: tank.infra.v1.KubernetesConfig kubernetes = 9;
     */
    kubernetes?: KubernetesConfig;
    /**
     * @generated from field: tank.infra.v1.ApiConfig api = 10;
     */
    api?: ApiConfig;
    /**
     * Treads that may use it; empty means every Tread in the workspace.
     *
     * @generated from field: repeated string channel_ids = 11;
     */
    channelIds: string[];
    /**
     * Run through the workspace's Lockbox Relay instead of TANK's own credentials path.
     *
     * @generated from field: bool via_relay = 12;
     */
    viaRelay: boolean;
    /**
     * @generated from field: string relay_id = 13;
     */
    relayId: string;
    /**
     * @generated from field: tank.infra.v1.ConnectionState state = 14;
     */
    state: ConnectionState;
    /**
     * @generated from field: string last_error = 15;
     */
    lastError: string;
    /**
     * @generated from field: google.protobuf.Timestamp last_checked_at = 16;
     */
    lastCheckedAt?: Timestamp;
    /**
     * @generated from field: string created_by = 17;
     */
    createdBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 18;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 19;
     */
    updatedAt?: Timestamp;
    /**
     * The subject TANK signs for this connection: workspace:<id>:connection:<id>.
     *
     * @generated from field: string subject = 20;
     */
    subject: string;
    /**
     * A token is stored for it in the Lockbox Agent vault (Kubernetes token, API, database password).
     *
     * @generated from field: bool has_secret = 21;
     */
    hasSecret: boolean;
    /**
     * @generated from field: tank.infra.v1.DatabaseConfig database = 22;
     */
    database?: DatabaseConfig;
    /**
     * @generated from field: tank.infra.v1.TestLoginConfig test_login = 23;
     */
    testLogin?: TestLoginConfig;
};
/**
 * Describes the message tank.infra.v1.Connection.
 * Use `create(ConnectionSchema)` to create a new message.
 */
export declare const ConnectionSchema: GenMessage<Connection>;
/**
 * One step of the setup a person follows to grant TANK access, with the exact script
 * for this connection.
 *
 * @generated from message tank.infra.v1.SetupStep
 */
export type SetupStep = Message<"tank.infra.v1.SetupStep"> & {
    /**
     * @generated from field: string title = 1;
     */
    title: string;
    /**
     * @generated from field: string text = 2;
     */
    text: string;
    /**
     * @generated from field: string code = 3;
     */
    code: string;
    /**
     * bash, yaml, hcl, json
     *
     * @generated from field: string code_language = 4;
     */
    codeLanguage: string;
    /**
     * when the code is better saved as a file
     *
     * @generated from field: string download_name = 5;
     */
    downloadName: string;
};
/**
 * Describes the message tank.infra.v1.SetupStep.
 * Use `create(SetupStepSchema)` to create a new message.
 */
export declare const SetupStepSchema: GenMessage<SetupStep>;
/**
 * @generated from message tank.infra.v1.Use
 */
export type Use = Message<"tank.infra.v1.Use"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string connection_id = 2;
     */
    connectionId: string;
    /**
     * @generated from field: string connection_name = 3;
     */
    connectionName: string;
    /**
     * @generated from field: string run_id = 4;
     */
    runId: string;
    /**
     * @generated from field: string channel_id = 5;
     */
    channelId: string;
    /**
     * @generated from field: string user_id = 6;
     */
    userId: string;
    /**
     * command | http | runbook | test | costs | login (a test login opened) | browse (a step on its page)
     *
     * @generated from field: string kind = 7;
     */
    kind: string;
    /**
     * redacted
     *
     * @generated from field: string command = 8;
     */
    command: string;
    /**
     * @generated from field: int32 exit_code = 9;
     */
    exitCode: number;
    /**
     * why it was refused, when it was
     *
     * @generated from field: string refused = 10;
     */
    refused: string;
    /**
     * @generated from field: int64 duration_ms = 11;
     */
    durationMs: bigint;
    /**
     * @generated from field: int64 output_bytes = 12;
     */
    outputBytes: bigint;
    /**
     * @generated from field: google.protobuf.Timestamp at = 13;
     */
    at?: Timestamp;
};
/**
 * Describes the message tank.infra.v1.Use.
 * Use `create(UseSchema)` to create a new message.
 */
export declare const UseSchema: GenMessage<Use>;
/**
 * @generated from message tank.infra.v1.RunbookInput
 */
export type RunbookInput = Message<"tank.infra.v1.RunbookInput"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string description = 2;
     */
    description: string;
    /**
     * @generated from field: bool required = 3;
     */
    required: boolean;
    /**
     * @generated from field: string default_value = 4;
     */
    defaultValue: string;
    /**
     * @generated from field: repeated string options = 5;
     */
    options: string[];
};
/**
 * Describes the message tank.infra.v1.RunbookInput.
 * Use `create(RunbookInputSchema)` to create a new message.
 */
export declare const RunbookInputSchema: GenMessage<RunbookInput>;
/**
 * A workflow in one of the workspace's repositories that an agent may ask to run.
 * Every run of it waits for a workspace admin's approval.
 *
 * @generated from message tank.infra.v1.Runbook
 */
export type Runbook = Message<"tank.infra.v1.Runbook"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * owner/name
     *
     * @generated from field: string repo = 3;
     */
    repo: string;
    /**
     * .github/workflows/restart.yml
     *
     * @generated from field: string workflow = 4;
     */
    workflow: string;
    /**
     * the branch it runs on; the default branch when empty
     *
     * @generated from field: string ref = 5;
     */
    ref: string;
    /**
     * @generated from field: string name = 6;
     */
    name: string;
    /**
     * @generated from field: string description = 7;
     */
    description: string;
    /**
     * @generated from field: repeated tank.infra.v1.RunbookInput inputs = 8;
     */
    inputs: RunbookInput[];
    /**
     * @generated from field: string created_by = 9;
     */
    createdBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 10;
     */
    createdAt?: Timestamp;
};
/**
 * Describes the message tank.infra.v1.Runbook.
 * Use `create(RunbookSchema)` to create a new message.
 */
export declare const RunbookSchema: GenMessage<Runbook>;
/**
 * A dispatchable workflow found in a repository, offered when adding a runbook.
 *
 * @generated from message tank.infra.v1.WorkflowCandidate
 */
export type WorkflowCandidate = Message<"tank.infra.v1.WorkflowCandidate"> & {
    /**
     * @generated from field: string repo = 1;
     */
    repo: string;
    /**
     * @generated from field: string workflow = 2;
     */
    workflow: string;
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: repeated tank.infra.v1.RunbookInput inputs = 4;
     */
    inputs: RunbookInput[];
};
/**
 * Describes the message tank.infra.v1.WorkflowCandidate.
 * Use `create(WorkflowCandidateSchema)` to create a new message.
 */
export declare const WorkflowCandidateSchema: GenMessage<WorkflowCandidate>;
/**
 * @generated from message tank.infra.v1.Relay
 */
export type Relay = Message<"tank.infra.v1.Relay"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: google.protobuf.Timestamp last_seen_at = 4;
     */
    lastSeenAt?: Timestamp;
    /**
     * @generated from field: string version = 5;
     */
    version: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 6;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: string created_by = 7;
     */
    createdBy: string;
};
/**
 * Describes the message tank.infra.v1.Relay.
 * Use `create(RelaySchema)` to create a new message.
 */
export declare const RelaySchema: GenMessage<Relay>;
/**
 * @generated from message tank.infra.v1.ListConnectionsRequest
 */
export type ListConnectionsRequest = Message<"tank.infra.v1.ListConnectionsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * with it: only what that Tread may use
     *
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
};
/**
 * Describes the message tank.infra.v1.ListConnectionsRequest.
 * Use `create(ListConnectionsRequestSchema)` to create a new message.
 */
export declare const ListConnectionsRequestSchema: GenMessage<ListConnectionsRequest>;
/**
 * @generated from message tank.infra.v1.ListConnectionsResponse
 */
export type ListConnectionsResponse = Message<"tank.infra.v1.ListConnectionsResponse"> & {
    /**
     * @generated from field: repeated tank.infra.v1.Connection connections = 1;
     */
    connections: Connection[];
    /**
     * @generated from field: bool premium = 2;
     */
    premium: boolean;
    /**
     * What a customer's trust policies name: TANK's AWS role and OIDC issuer.
     *
     * @generated from field: string aws_principal = 3;
     */
    awsPrincipal: string;
    /**
     * @generated from field: string oidc_issuer = 4;
     */
    oidcIssuer: string;
};
/**
 * Describes the message tank.infra.v1.ListConnectionsResponse.
 * Use `create(ListConnectionsResponseSchema)` to create a new message.
 */
export declare const ListConnectionsResponseSchema: GenMessage<ListConnectionsResponse>;
/**
 * @generated from message tank.infra.v1.GetConnectionRequest
 */
export type GetConnectionRequest = Message<"tank.infra.v1.GetConnectionRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
};
/**
 * Describes the message tank.infra.v1.GetConnectionRequest.
 * Use `create(GetConnectionRequestSchema)` to create a new message.
 */
export declare const GetConnectionRequestSchema: GenMessage<GetConnectionRequest>;
/**
 * @generated from message tank.infra.v1.GetConnectionResponse
 */
export type GetConnectionResponse = Message<"tank.infra.v1.GetConnectionResponse"> & {
    /**
     * @generated from field: tank.infra.v1.Connection connection = 1;
     */
    connection?: Connection;
};
/**
 * Describes the message tank.infra.v1.GetConnectionResponse.
 * Use `create(GetConnectionResponseSchema)` to create a new message.
 */
export declare const GetConnectionResponseSchema: GenMessage<GetConnectionResponse>;
/**
 * @generated from message tank.infra.v1.CreateConnectionRequest
 */
export type CreateConnectionRequest = Message<"tank.infra.v1.CreateConnectionRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: tank.infra.v1.Connection connection = 2;
     */
    connection?: Connection;
    /**
     * A token for the kinds that need one; write only, never returned.
     *
     * @generated from field: string secret = 3;
     */
    secret: string;
    /**
     * Set by the server from the caller; ignored when a client sends it.
     *
     * @generated from field: string requested_by = 4;
     */
    requestedBy: string;
    /**
     * A test login's one-time-code (TOTP) seed, base32 or an otpauth:// URI; write only.
     *
     * @generated from field: string totp_seed = 5;
     */
    totpSeed: string;
};
/**
 * Describes the message tank.infra.v1.CreateConnectionRequest.
 * Use `create(CreateConnectionRequestSchema)` to create a new message.
 */
export declare const CreateConnectionRequestSchema: GenMessage<CreateConnectionRequest>;
/**
 * @generated from message tank.infra.v1.CreateConnectionResponse
 */
export type CreateConnectionResponse = Message<"tank.infra.v1.CreateConnectionResponse"> & {
    /**
     * @generated from field: tank.infra.v1.Connection connection = 1;
     */
    connection?: Connection;
};
/**
 * Describes the message tank.infra.v1.CreateConnectionResponse.
 * Use `create(CreateConnectionResponseSchema)` to create a new message.
 */
export declare const CreateConnectionResponseSchema: GenMessage<CreateConnectionResponse>;
/**
 * @generated from message tank.infra.v1.UpdateConnectionRequest
 */
export type UpdateConnectionRequest = Message<"tank.infra.v1.UpdateConnectionRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: tank.infra.v1.Connection connection = 2;
     */
    connection?: Connection;
    /**
     * empty keeps the stored one
     *
     * @generated from field: string secret = 3;
     */
    secret: string;
    /**
     * @generated from field: string requested_by = 4;
     */
    requestedBy: string;
    /**
     * A test login's one-time-code seed; empty keeps the stored one.
     *
     * @generated from field: string totp_seed = 5;
     */
    totpSeed: string;
    /**
     * Forget a test login's stored one-time-code seed.
     *
     * @generated from field: bool remove_totp = 6;
     */
    removeTotp: boolean;
};
/**
 * Describes the message tank.infra.v1.UpdateConnectionRequest.
 * Use `create(UpdateConnectionRequestSchema)` to create a new message.
 */
export declare const UpdateConnectionRequestSchema: GenMessage<UpdateConnectionRequest>;
/**
 * @generated from message tank.infra.v1.UpdateConnectionResponse
 */
export type UpdateConnectionResponse = Message<"tank.infra.v1.UpdateConnectionResponse"> & {
    /**
     * @generated from field: tank.infra.v1.Connection connection = 1;
     */
    connection?: Connection;
};
/**
 * Describes the message tank.infra.v1.UpdateConnectionResponse.
 * Use `create(UpdateConnectionResponseSchema)` to create a new message.
 */
export declare const UpdateConnectionResponseSchema: GenMessage<UpdateConnectionResponse>;
/**
 * @generated from message tank.infra.v1.DeleteConnectionRequest
 */
export type DeleteConnectionRequest = Message<"tank.infra.v1.DeleteConnectionRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * @generated from field: string requested_by = 3;
     */
    requestedBy: string;
};
/**
 * Describes the message tank.infra.v1.DeleteConnectionRequest.
 * Use `create(DeleteConnectionRequestSchema)` to create a new message.
 */
export declare const DeleteConnectionRequestSchema: GenMessage<DeleteConnectionRequest>;
/**
 * @generated from message tank.infra.v1.DeleteConnectionResponse
 */
export type DeleteConnectionResponse = Message<"tank.infra.v1.DeleteConnectionResponse"> & {};
/**
 * Describes the message tank.infra.v1.DeleteConnectionResponse.
 * Use `create(DeleteConnectionResponseSchema)` to create a new message.
 */
export declare const DeleteConnectionResponseSchema: GenMessage<DeleteConnectionResponse>;
/**
 * @generated from message tank.infra.v1.TestConnectionRequest
 */
export type TestConnectionRequest = Message<"tank.infra.v1.TestConnectionRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * @generated from field: string requested_by = 3;
     */
    requestedBy: string;
};
/**
 * Describes the message tank.infra.v1.TestConnectionRequest.
 * Use `create(TestConnectionRequestSchema)` to create a new message.
 */
export declare const TestConnectionRequestSchema: GenMessage<TestConnectionRequest>;
/**
 * @generated from message tank.infra.v1.TestConnectionResponse
 */
export type TestConnectionResponse = Message<"tank.infra.v1.TestConnectionResponse"> & {
    /**
     * @generated from field: tank.infra.v1.ConnectionState state = 1;
     */
    state: ConnectionState;
    /**
     * One line a person reads: what TANK could read, or what stopped it.
     *
     * @generated from field: string detail = 2;
     */
    detail: string;
    /**
     * What each check printed, redacted.
     *
     * @generated from field: repeated string output = 3;
     */
    output: string[];
    /**
     * Set when the identity TANK was given can do more than read.
     *
     * @generated from field: string warning = 4;
     */
    warning: string;
};
/**
 * Describes the message tank.infra.v1.TestConnectionResponse.
 * Use `create(TestConnectionResponseSchema)` to create a new message.
 */
export declare const TestConnectionResponseSchema: GenMessage<TestConnectionResponse>;
/**
 * @generated from message tank.infra.v1.GetSetupGuideRequest
 */
export type GetSetupGuideRequest = Message<"tank.infra.v1.GetSetupGuideRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
};
/**
 * Describes the message tank.infra.v1.GetSetupGuideRequest.
 * Use `create(GetSetupGuideRequestSchema)` to create a new message.
 */
export declare const GetSetupGuideRequestSchema: GenMessage<GetSetupGuideRequest>;
/**
 * @generated from message tank.infra.v1.GetSetupGuideResponse
 */
export type GetSetupGuideResponse = Message<"tank.infra.v1.GetSetupGuideResponse"> & {
    /**
     * @generated from field: repeated tank.infra.v1.SetupStep steps = 1;
     */
    steps: SetupStep[];
};
/**
 * Describes the message tank.infra.v1.GetSetupGuideResponse.
 * Use `create(GetSetupGuideResponseSchema)` to create a new message.
 */
export declare const GetSetupGuideResponseSchema: GenMessage<GetSetupGuideResponse>;
/**
 * @generated from message tank.infra.v1.ListUsesRequest
 */
export type ListUsesRequest = Message<"tank.infra.v1.ListUsesRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * empty: every connection
     *
     * @generated from field: string connection_id = 2;
     */
    connectionId: string;
    /**
     * @generated from field: int32 limit = 3;
     */
    limit: number;
};
/**
 * Describes the message tank.infra.v1.ListUsesRequest.
 * Use `create(ListUsesRequestSchema)` to create a new message.
 */
export declare const ListUsesRequestSchema: GenMessage<ListUsesRequest>;
/**
 * @generated from message tank.infra.v1.ListUsesResponse
 */
export type ListUsesResponse = Message<"tank.infra.v1.ListUsesResponse"> & {
    /**
     * @generated from field: repeated tank.infra.v1.Use uses = 1;
     */
    uses: Use[];
};
/**
 * Describes the message tank.infra.v1.ListUsesResponse.
 * Use `create(ListUsesResponseSchema)` to create a new message.
 */
export declare const ListUsesResponseSchema: GenMessage<ListUsesResponse>;
/**
 * @generated from message tank.infra.v1.ListRunbooksRequest
 */
export type ListRunbooksRequest = Message<"tank.infra.v1.ListRunbooksRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.infra.v1.ListRunbooksRequest.
 * Use `create(ListRunbooksRequestSchema)` to create a new message.
 */
export declare const ListRunbooksRequestSchema: GenMessage<ListRunbooksRequest>;
/**
 * @generated from message tank.infra.v1.ListRunbooksResponse
 */
export type ListRunbooksResponse = Message<"tank.infra.v1.ListRunbooksResponse"> & {
    /**
     * @generated from field: repeated tank.infra.v1.Runbook runbooks = 1;
     */
    runbooks: Runbook[];
};
/**
 * Describes the message tank.infra.v1.ListRunbooksResponse.
 * Use `create(ListRunbooksResponseSchema)` to create a new message.
 */
export declare const ListRunbooksResponseSchema: GenMessage<ListRunbooksResponse>;
/**
 * @generated from message tank.infra.v1.PutRunbookRequest
 */
export type PutRunbookRequest = Message<"tank.infra.v1.PutRunbookRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: tank.infra.v1.Runbook runbook = 2;
     */
    runbook?: Runbook;
    /**
     * @generated from field: string requested_by = 3;
     */
    requestedBy: string;
};
/**
 * Describes the message tank.infra.v1.PutRunbookRequest.
 * Use `create(PutRunbookRequestSchema)` to create a new message.
 */
export declare const PutRunbookRequestSchema: GenMessage<PutRunbookRequest>;
/**
 * @generated from message tank.infra.v1.PutRunbookResponse
 */
export type PutRunbookResponse = Message<"tank.infra.v1.PutRunbookResponse"> & {
    /**
     * @generated from field: tank.infra.v1.Runbook runbook = 1;
     */
    runbook?: Runbook;
};
/**
 * Describes the message tank.infra.v1.PutRunbookResponse.
 * Use `create(PutRunbookResponseSchema)` to create a new message.
 */
export declare const PutRunbookResponseSchema: GenMessage<PutRunbookResponse>;
/**
 * @generated from message tank.infra.v1.DeleteRunbookRequest
 */
export type DeleteRunbookRequest = Message<"tank.infra.v1.DeleteRunbookRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * @generated from field: string requested_by = 3;
     */
    requestedBy: string;
};
/**
 * Describes the message tank.infra.v1.DeleteRunbookRequest.
 * Use `create(DeleteRunbookRequestSchema)` to create a new message.
 */
export declare const DeleteRunbookRequestSchema: GenMessage<DeleteRunbookRequest>;
/**
 * @generated from message tank.infra.v1.DeleteRunbookResponse
 */
export type DeleteRunbookResponse = Message<"tank.infra.v1.DeleteRunbookResponse"> & {};
/**
 * Describes the message tank.infra.v1.DeleteRunbookResponse.
 * Use `create(DeleteRunbookResponseSchema)` to create a new message.
 */
export declare const DeleteRunbookResponseSchema: GenMessage<DeleteRunbookResponse>;
/**
 * @generated from message tank.infra.v1.ListWorkflowCandidatesRequest
 */
export type ListWorkflowCandidatesRequest = Message<"tank.infra.v1.ListWorkflowCandidatesRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.infra.v1.ListWorkflowCandidatesRequest.
 * Use `create(ListWorkflowCandidatesRequestSchema)` to create a new message.
 */
export declare const ListWorkflowCandidatesRequestSchema: GenMessage<ListWorkflowCandidatesRequest>;
/**
 * @generated from message tank.infra.v1.ListWorkflowCandidatesResponse
 */
export type ListWorkflowCandidatesResponse = Message<"tank.infra.v1.ListWorkflowCandidatesResponse"> & {
    /**
     * @generated from field: repeated tank.infra.v1.WorkflowCandidate candidates = 1;
     */
    candidates: WorkflowCandidate[];
    /**
     * Set when TANK's GitHub App may not run workflows yet.
     *
     * @generated from field: string note = 2;
     */
    note: string;
};
/**
 * Describes the message tank.infra.v1.ListWorkflowCandidatesResponse.
 * Use `create(ListWorkflowCandidatesResponseSchema)` to create a new message.
 */
export declare const ListWorkflowCandidatesResponseSchema: GenMessage<ListWorkflowCandidatesResponse>;
/**
 * @generated from message tank.infra.v1.ListRelaysRequest
 */
export type ListRelaysRequest = Message<"tank.infra.v1.ListRelaysRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.infra.v1.ListRelaysRequest.
 * Use `create(ListRelaysRequestSchema)` to create a new message.
 */
export declare const ListRelaysRequestSchema: GenMessage<ListRelaysRequest>;
/**
 * @generated from message tank.infra.v1.ListRelaysResponse
 */
export type ListRelaysResponse = Message<"tank.infra.v1.ListRelaysResponse"> & {
    /**
     * @generated from field: repeated tank.infra.v1.Relay relays = 1;
     */
    relays: Relay[];
};
/**
 * Describes the message tank.infra.v1.ListRelaysResponse.
 * Use `create(ListRelaysResponseSchema)` to create a new message.
 */
export declare const ListRelaysResponseSchema: GenMessage<ListRelaysResponse>;
/**
 * @generated from message tank.infra.v1.CreateRelayRequest
 */
export type CreateRelayRequest = Message<"tank.infra.v1.CreateRelayRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string requested_by = 3;
     */
    requestedBy: string;
};
/**
 * Describes the message tank.infra.v1.CreateRelayRequest.
 * Use `create(CreateRelayRequestSchema)` to create a new message.
 */
export declare const CreateRelayRequestSchema: GenMessage<CreateRelayRequest>;
/**
 * @generated from message tank.infra.v1.CreateRelayResponse
 */
export type CreateRelayResponse = Message<"tank.infra.v1.CreateRelayResponse"> & {
    /**
     * @generated from field: tank.infra.v1.Relay relay = 1;
     */
    relay?: Relay;
    /**
     * Shown once: the relay authenticates with it.
     *
     * @generated from field: string token = 2;
     */
    token: string;
    /**
     * How to run it, with the token filled in.
     *
     * @generated from field: repeated tank.infra.v1.SetupStep steps = 3;
     */
    steps: SetupStep[];
};
/**
 * Describes the message tank.infra.v1.CreateRelayResponse.
 * Use `create(CreateRelayResponseSchema)` to create a new message.
 */
export declare const CreateRelayResponseSchema: GenMessage<CreateRelayResponse>;
/**
 * @generated from message tank.infra.v1.RevokeRelayRequest
 */
export type RevokeRelayRequest = Message<"tank.infra.v1.RevokeRelayRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * @generated from field: string requested_by = 3;
     */
    requestedBy: string;
};
/**
 * Describes the message tank.infra.v1.RevokeRelayRequest.
 * Use `create(RevokeRelayRequestSchema)` to create a new message.
 */
export declare const RevokeRelayRequestSchema: GenMessage<RevokeRelayRequest>;
/**
 * @generated from message tank.infra.v1.RevokeRelayResponse
 */
export type RevokeRelayResponse = Message<"tank.infra.v1.RevokeRelayResponse"> & {};
/**
 * Describes the message tank.infra.v1.RevokeRelayResponse.
 * Use `create(RevokeRelayResponseSchema)` to create a new message.
 */
export declare const RevokeRelayResponseSchema: GenMessage<RevokeRelayResponse>;
/**
 * @generated from enum tank.infra.v1.Provider
 */
export declare enum Provider {
    /**
     * @generated from enum value: PROVIDER_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: PROVIDER_AWS = 1;
     */
    AWS = 1,
    /**
     * @generated from enum value: PROVIDER_GCP = 2;
     */
    GCP = 2,
    /**
     * @generated from enum value: PROVIDER_AZURE = 3;
     */
    AZURE = 3,
    /**
     * Any Kubernetes cluster the cloud providers above do not cover.
     *
     * @generated from enum value: PROVIDER_KUBERNETES = 4;
     */
    KUBERNETES = 4,
    /**
     * A service with an HTTP API and a read-scoped token (Datadog, Cloudflare, Grafana…).
     *
     * @generated from enum value: PROVIDER_API = 5;
     */
    API = 5,
    /**
     * A database, read only (2026-11-10). Reached through the workspace's Lockbox Relay inside
     * its own network; the password is kept in the Lockbox Agent vault and handed to the relay
     * with each query, never to an agent.
     *
     * @generated from enum value: PROVIDER_DATABASE = 6;
     */
    DATABASE = 6,
    /**
     * A test login (2026-11-13): an account on one of the workspace's own apps that TANK's own
     * browser signs in with, so an agent can check logged-in pages itself. The password and the
     * one-time-code seed are kept in the Lockbox Agent vault and typed by TANK's browser, never
     * given to an agent, a sandbox or a log. The agent drives the signed-in page and sees only
     * screenshots and the page's text.
     *
     * @generated from enum value: PROVIDER_TEST_LOGIN = 7;
     */
    TEST_LOGIN = 7
}
/**
 * Describes the enum tank.infra.v1.Provider.
 */
export declare const ProviderSchema: GenEnum<Provider>;
/**
 * @generated from enum tank.infra.v1.DatabaseEngine
 */
export declare enum DatabaseEngine {
    /**
     * @generated from enum value: DATABASE_ENGINE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: DATABASE_ENGINE_POSTGRES = 1;
     */
    POSTGRES = 1
}
/**
 * Describes the enum tank.infra.v1.DatabaseEngine.
 */
export declare const DatabaseEngineSchema: GenEnum<DatabaseEngine>;
/**
 * @generated from enum tank.infra.v1.ConnectionState
 */
export declare enum ConnectionState {
    /**
     * @generated from enum value: CONNECTION_STATE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * made, never tested
     *
     * @generated from enum value: CONNECTION_STATE_UNVERIFIED = 1;
     */
    UNVERIFIED = 1,
    /**
     * the last test read what it should
     *
     * @generated from enum value: CONNECTION_STATE_OK = 2;
     */
    OK = 2,
    /**
     * the last test could not
     *
     * @generated from enum value: CONNECTION_STATE_FAILING = 3;
     */
    FAILING = 3
}
/**
 * Describes the enum tank.infra.v1.ConnectionState.
 */
export declare const ConnectionStateSchema: GenEnum<ConnectionState>;
/**
 * @generated from enum tank.infra.v1.KubeAuth
 */
export declare enum KubeAuth {
    /**
     * @generated from enum value: KUBE_AUTH_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * the cluster trusts TANK's issuer
     *
     * @generated from enum value: KUBE_AUTH_OIDC = 1;
     */
    OIDC = 1,
    /**
     * a ServiceAccount token, kept in the Lockbox Agent vault
     *
     * @generated from enum value: KUBE_AUTH_TOKEN = 2;
     */
    TOKEN = 2
}
/**
 * Describes the enum tank.infra.v1.KubeAuth.
 */
export declare const KubeAuthSchema: GenEnum<KubeAuth>;
/**
 * @generated from service tank.infra.v1.InfraService
 */
export declare const InfraService: GenService<{
    /**
     * @generated from rpc tank.infra.v1.InfraService.ListConnections
     */
    listConnections: {
        methodKind: "unary";
        input: typeof ListConnectionsRequestSchema;
        output: typeof ListConnectionsResponseSchema;
    };
    /**
     * @generated from rpc tank.infra.v1.InfraService.GetConnection
     */
    getConnection: {
        methodKind: "unary";
        input: typeof GetConnectionRequestSchema;
        output: typeof GetConnectionResponseSchema;
    };
    /**
     * @generated from rpc tank.infra.v1.InfraService.CreateConnection
     */
    createConnection: {
        methodKind: "unary";
        input: typeof CreateConnectionRequestSchema;
        output: typeof CreateConnectionResponseSchema;
    };
    /**
     * @generated from rpc tank.infra.v1.InfraService.UpdateConnection
     */
    updateConnection: {
        methodKind: "unary";
        input: typeof UpdateConnectionRequestSchema;
        output: typeof UpdateConnectionResponseSchema;
    };
    /**
     * @generated from rpc tank.infra.v1.InfraService.DeleteConnection
     */
    deleteConnection: {
        methodKind: "unary";
        input: typeof DeleteConnectionRequestSchema;
        output: typeof DeleteConnectionResponseSchema;
    };
    /**
     * @generated from rpc tank.infra.v1.InfraService.TestConnection
     */
    testConnection: {
        methodKind: "unary";
        input: typeof TestConnectionRequestSchema;
        output: typeof TestConnectionResponseSchema;
    };
    /**
     * @generated from rpc tank.infra.v1.InfraService.GetSetupGuide
     */
    getSetupGuide: {
        methodKind: "unary";
        input: typeof GetSetupGuideRequestSchema;
        output: typeof GetSetupGuideResponseSchema;
    };
    /**
     * @generated from rpc tank.infra.v1.InfraService.ListUses
     */
    listUses: {
        methodKind: "unary";
        input: typeof ListUsesRequestSchema;
        output: typeof ListUsesResponseSchema;
    };
    /**
     * @generated from rpc tank.infra.v1.InfraService.ListRunbooks
     */
    listRunbooks: {
        methodKind: "unary";
        input: typeof ListRunbooksRequestSchema;
        output: typeof ListRunbooksResponseSchema;
    };
    /**
     * @generated from rpc tank.infra.v1.InfraService.PutRunbook
     */
    putRunbook: {
        methodKind: "unary";
        input: typeof PutRunbookRequestSchema;
        output: typeof PutRunbookResponseSchema;
    };
    /**
     * @generated from rpc tank.infra.v1.InfraService.DeleteRunbook
     */
    deleteRunbook: {
        methodKind: "unary";
        input: typeof DeleteRunbookRequestSchema;
        output: typeof DeleteRunbookResponseSchema;
    };
    /**
     * @generated from rpc tank.infra.v1.InfraService.ListWorkflowCandidates
     */
    listWorkflowCandidates: {
        methodKind: "unary";
        input: typeof ListWorkflowCandidatesRequestSchema;
        output: typeof ListWorkflowCandidatesResponseSchema;
    };
    /**
     * @generated from rpc tank.infra.v1.InfraService.ListRelays
     */
    listRelays: {
        methodKind: "unary";
        input: typeof ListRelaysRequestSchema;
        output: typeof ListRelaysResponseSchema;
    };
    /**
     * @generated from rpc tank.infra.v1.InfraService.CreateRelay
     */
    createRelay: {
        methodKind: "unary";
        input: typeof CreateRelayRequestSchema;
        output: typeof CreateRelayResponseSchema;
    };
    /**
     * @generated from rpc tank.infra.v1.InfraService.RevokeRelay
     */
    revokeRelay: {
        methodKind: "unary";
        input: typeof RevokeRelayRequestSchema;
        output: typeof RevokeRelayResponseSchema;
    };
}>;
