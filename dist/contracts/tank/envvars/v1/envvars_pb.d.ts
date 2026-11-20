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
}>;
