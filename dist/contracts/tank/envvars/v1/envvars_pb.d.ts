import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/envvars/v1/envvars.proto.
 */
export declare const file_tank_envvars_v1_envvars: GenFile;
/**
 * @generated from message tank.envvars.v1.EnvVar
 */
export type EnvVar = Message<"tank.envvars.v1.EnvVar"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * The value of a plain variable. Always empty for a secret.
     *
     * @generated from field: string value = 2;
     */
    value: string;
    /**
     * @generated from field: bool secret = 3;
     */
    secret: boolean;
    /**
     * For a secret: whether a value is stored. A listed secret is always set.
     *
     * @generated from field: bool is_set = 4;
     */
    isSet: boolean;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 5;
     */
    updatedAt?: Timestamp;
    /**
     * The member who last changed it.
     *
     * @generated from field: string updated_by = 6;
     */
    updatedBy: string;
    /**
     * Preview value (Overdrive, 2026-11-24), for a secret only: a test value (a Stripe test
     * key, a sandbox account) that TANK's previews use in place of the real one. Write-only,
     * like the secret. A preview is never given the real value: without a preview value it
     * gets nothing for this name. The app sees only a placeholder; TANK adds the preview
     * value on the way out, to preview_hosts alone.
     *
     * @generated from field: bool preview_set = 7;
     */
    previewSet: boolean;
    /**
     * @generated from field: repeated string preview_hosts = 8;
     */
    previewHosts: string[];
    /**
     * @generated from field: bool preview_in_body = 9;
     */
    previewInBody: boolean;
    /**
     * Who uses it (2026-11-24): "agents", "products" or "both". Agents are the workspace's
     * agents in their runs; products are the products TANK hosts for the workspace. A value
     * used by products is applied to every hosted product whose tank.yaml lists the name
     * under secrets (Secrets Manager agentures/<slug>, by the control plane), and the product
     * restarts with it. The default for a new name is "both" when a hosted product's
     * tank.yaml lists it, otherwise "agents".
     *
     * @generated from field: string used_by = 10;
     */
    usedBy: string;
    /**
     * The hosted products whose tank.yaml lists this name, by slug. Filled on a listing.
     *
     * @generated from field: repeated string products = 11;
     */
    products: string[];
};
/**
 * Describes the message tank.envvars.v1.EnvVar.
 * Use `create(EnvVarSchema)` to create a new message.
 */
export declare const EnvVarSchema: GenMessage<EnvVar>;
/**
 * @generated from message tank.envvars.v1.ListEnvVarsRequest
 */
export type ListEnvVarsRequest = Message<"tank.envvars.v1.ListEnvVarsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.envvars.v1.ListEnvVarsRequest.
 * Use `create(ListEnvVarsRequestSchema)` to create a new message.
 */
export declare const ListEnvVarsRequestSchema: GenMessage<ListEnvVarsRequest>;
/**
 * @generated from message tank.envvars.v1.ListEnvVarsResponse
 */
export type ListEnvVarsResponse = Message<"tank.envvars.v1.ListEnvVarsResponse"> & {
    /**
     * Plain variables first, then secrets, each by name.
     *
     * @generated from field: repeated tank.envvars.v1.EnvVar vars = 1;
     */
    vars: EnvVar[];
};
/**
 * Describes the message tank.envvars.v1.ListEnvVarsResponse.
 * Use `create(ListEnvVarsResponseSchema)` to create a new message.
 */
export declare const ListEnvVarsResponseSchema: GenMessage<ListEnvVarsResponse>;
/**
 * @generated from message tank.envvars.v1.PutEnvVarRequest
 */
export type PutEnvVarRequest = Message<"tank.envvars.v1.PutEnvVarRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string value = 3;
     */
    value: string;
    /**
     * Required when the name is new; for an existing name it must match its kind, because a
     * variable never changes kind (delete it and make it again).
     *
     * @generated from field: bool secret = 4;
     */
    secret: boolean;
    /**
     * True to make a new variable only: the call fails if the name already exists.
     *
     * @generated from field: bool create_only = 5;
     */
    createOnly: boolean;
    /**
     * "agents", "products" or "both". Empty keeps an existing variable's, and gives a new one
     * the default (EnvVar.used_by).
     *
     * @generated from field: string used_by = 6;
     */
    usedBy: string;
};
/**
 * Describes the message tank.envvars.v1.PutEnvVarRequest.
 * Use `create(PutEnvVarRequestSchema)` to create a new message.
 */
export declare const PutEnvVarRequestSchema: GenMessage<PutEnvVarRequest>;
/**
 * @generated from message tank.envvars.v1.PutEnvVarResponse
 */
export type PutEnvVarResponse = Message<"tank.envvars.v1.PutEnvVarResponse"> & {
    /**
     * A secret's value is never echoed.
     *
     * @generated from field: tank.envvars.v1.EnvVar var = 1;
     */
    var?: EnvVar;
    /**
     * True when the name did not exist before.
     *
     * @generated from field: bool created = 2;
     */
    created: boolean;
};
/**
 * Describes the message tank.envvars.v1.PutEnvVarResponse.
 * Use `create(PutEnvVarResponseSchema)` to create a new message.
 */
export declare const PutEnvVarResponseSchema: GenMessage<PutEnvVarResponse>;
/**
 * @generated from message tank.envvars.v1.DeleteEnvVarRequest
 */
export type DeleteEnvVarRequest = Message<"tank.envvars.v1.DeleteEnvVarRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
};
/**
 * Describes the message tank.envvars.v1.DeleteEnvVarRequest.
 * Use `create(DeleteEnvVarRequestSchema)` to create a new message.
 */
export declare const DeleteEnvVarRequestSchema: GenMessage<DeleteEnvVarRequest>;
/**
 * @generated from message tank.envvars.v1.DeleteEnvVarResponse
 */
export type DeleteEnvVarResponse = Message<"tank.envvars.v1.DeleteEnvVarResponse"> & {};
/**
 * Describes the message tank.envvars.v1.DeleteEnvVarResponse.
 * Use `create(DeleteEnvVarResponseSchema)` to create a new message.
 */
export declare const DeleteEnvVarResponseSchema: GenMessage<DeleteEnvVarResponse>;
/**
 * @generated from message tank.envvars.v1.SetEnvVarUseRequest
 */
export type SetEnvVarUseRequest = Message<"tank.envvars.v1.SetEnvVarUseRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * "agents", "products" or "both".
     *
     * @generated from field: string used_by = 3;
     */
    usedBy: string;
};
/**
 * Describes the message tank.envvars.v1.SetEnvVarUseRequest.
 * Use `create(SetEnvVarUseRequestSchema)` to create a new message.
 */
export declare const SetEnvVarUseRequestSchema: GenMessage<SetEnvVarUseRequest>;
/**
 * @generated from message tank.envvars.v1.SetEnvVarUseResponse
 */
export type SetEnvVarUseResponse = Message<"tank.envvars.v1.SetEnvVarUseResponse"> & {
    /**
     * @generated from field: tank.envvars.v1.EnvVar var = 1;
     */
    var?: EnvVar;
};
/**
 * Describes the message tank.envvars.v1.SetEnvVarUseResponse.
 * Use `create(SetEnvVarUseResponseSchema)` to create a new message.
 */
export declare const SetEnvVarUseResponseSchema: GenMessage<SetEnvVarUseResponse>;
/**
 * @generated from message tank.envvars.v1.PutPreviewValueRequest
 */
export type PutPreviewValueRequest = Message<"tank.envvars.v1.PutPreviewValueRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * The preview value. Empty keeps the stored one.
     *
     * @generated from field: string value = 3;
     */
    value: string;
    /**
     * Hostnames the value may be sent to ("api.stripe.com", "*.example.com"). At least one.
     *
     * @generated from field: repeated string hosts = 4;
     */
    hosts: string[];
    /**
     * @generated from field: bool in_body = 5;
     */
    inBody: boolean;
};
/**
 * Describes the message tank.envvars.v1.PutPreviewValueRequest.
 * Use `create(PutPreviewValueRequestSchema)` to create a new message.
 */
export declare const PutPreviewValueRequestSchema: GenMessage<PutPreviewValueRequest>;
/**
 * @generated from message tank.envvars.v1.PutPreviewValueResponse
 */
export type PutPreviewValueResponse = Message<"tank.envvars.v1.PutPreviewValueResponse"> & {
    /**
     * @generated from field: tank.envvars.v1.EnvVar var = 1;
     */
    var?: EnvVar;
};
/**
 * Describes the message tank.envvars.v1.PutPreviewValueResponse.
 * Use `create(PutPreviewValueResponseSchema)` to create a new message.
 */
export declare const PutPreviewValueResponseSchema: GenMessage<PutPreviewValueResponse>;
/**
 * @generated from message tank.envvars.v1.ClearPreviewValueRequest
 */
export type ClearPreviewValueRequest = Message<"tank.envvars.v1.ClearPreviewValueRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
};
/**
 * Describes the message tank.envvars.v1.ClearPreviewValueRequest.
 * Use `create(ClearPreviewValueRequestSchema)` to create a new message.
 */
export declare const ClearPreviewValueRequestSchema: GenMessage<ClearPreviewValueRequest>;
/**
 * @generated from message tank.envvars.v1.ClearPreviewValueResponse
 */
export type ClearPreviewValueResponse = Message<"tank.envvars.v1.ClearPreviewValueResponse"> & {
    /**
     * @generated from field: tank.envvars.v1.EnvVar var = 1;
     */
    var?: EnvVar;
};
/**
 * Describes the message tank.envvars.v1.ClearPreviewValueResponse.
 * Use `create(ClearPreviewValueResponseSchema)` to create a new message.
 */
export declare const ClearPreviewValueResponseSchema: GenMessage<ClearPreviewValueResponse>;
/**
 * @generated from service tank.envvars.v1.EnvVarService
 */
export declare const EnvVarService: GenService<{
    /**
     * @generated from rpc tank.envvars.v1.EnvVarService.ListEnvVars
     */
    listEnvVars: {
        methodKind: "unary";
        input: typeof ListEnvVarsRequestSchema;
        output: typeof ListEnvVarsResponseSchema;
    };
    /**
     * @generated from rpc tank.envvars.v1.EnvVarService.PutEnvVar
     */
    putEnvVar: {
        methodKind: "unary";
        input: typeof PutEnvVarRequestSchema;
        output: typeof PutEnvVarResponseSchema;
    };
    /**
     * @generated from rpc tank.envvars.v1.EnvVarService.DeleteEnvVar
     */
    deleteEnvVar: {
        methodKind: "unary";
        input: typeof DeleteEnvVarRequestSchema;
        output: typeof DeleteEnvVarResponseSchema;
    };
    /**
     * Changes who uses a variable without its value (a secret's cannot be read back).
     *
     * @generated from rpc tank.envvars.v1.EnvVarService.SetEnvVarUse
     */
    setEnvVarUse: {
        methodKind: "unary";
        input: typeof SetEnvVarUseRequestSchema;
        output: typeof SetEnvVarUseResponseSchema;
    };
    /**
     * A secret's preview value and the hosts it may be sent to, owners and admins only.
     *
     * @generated from rpc tank.envvars.v1.EnvVarService.PutPreviewValue
     */
    putPreviewValue: {
        methodKind: "unary";
        input: typeof PutPreviewValueRequestSchema;
        output: typeof PutPreviewValueResponseSchema;
    };
    /**
     * @generated from rpc tank.envvars.v1.EnvVarService.ClearPreviewValue
     */
    clearPreviewValue: {
        methodKind: "unary";
        input: typeof ClearPreviewValueRequestSchema;
        output: typeof ClearPreviewValueResponseSchema;
    };
}>;
