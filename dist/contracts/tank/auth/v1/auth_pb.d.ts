import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/auth/v1/auth.proto.
 */
export declare const file_tank_auth_v1_auth: GenFile;
/**
 * @generated from message tank.auth.v1.Principal
 */
export type Principal = Message<"tank.auth.v1.Principal"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: tank.auth.v1.PrincipalKind kind = 2;
     */
    kind: PrincipalKind;
    /**
     * @generated from field: string display_name = 3;
     */
    displayName: string;
    /**
     * @generated from field: string avatar_url = 4;
     */
    avatarUrl: string;
    /**
     * users only, self-view only
     *
     * @generated from field: string email = 5;
     */
    email: string;
};
/**
 * Describes the message tank.auth.v1.Principal.
 * Use `create(PrincipalSchema)` to create a new message.
 */
export declare const PrincipalSchema: GenMessage<Principal>;
/**
 * @generated from message tank.auth.v1.StartMagicLinkRequest
 */
export type StartMagicLinkRequest = Message<"tank.auth.v1.StartMagicLinkRequest"> & {
    /**
     * @generated from field: string email = 1;
     */
    email: string;
};
/**
 * Describes the message tank.auth.v1.StartMagicLinkRequest.
 * Use `create(StartMagicLinkRequestSchema)` to create a new message.
 */
export declare const StartMagicLinkRequestSchema: GenMessage<StartMagicLinkRequest>;
/**
 * @generated from message tank.auth.v1.StartMagicLinkResponse
 */
export type StartMagicLinkResponse = Message<"tank.auth.v1.StartMagicLinkResponse"> & {};
/**
 * Describes the message tank.auth.v1.StartMagicLinkResponse.
 * Use `create(StartMagicLinkResponseSchema)` to create a new message.
 */
export declare const StartMagicLinkResponseSchema: GenMessage<StartMagicLinkResponse>;
/**
 * @generated from message tank.auth.v1.CompleteMagicLinkRequest
 */
export type CompleteMagicLinkRequest = Message<"tank.auth.v1.CompleteMagicLinkRequest"> & {
    /**
     * @generated from field: string token = 1;
     */
    token: string;
};
/**
 * Describes the message tank.auth.v1.CompleteMagicLinkRequest.
 * Use `create(CompleteMagicLinkRequestSchema)` to create a new message.
 */
export declare const CompleteMagicLinkRequestSchema: GenMessage<CompleteMagicLinkRequest>;
/**
 * @generated from message tank.auth.v1.CompleteMagicLinkResponse
 */
export type CompleteMagicLinkResponse = Message<"tank.auth.v1.CompleteMagicLinkResponse"> & {
    /**
     * @generated from field: tank.auth.v1.Principal me = 1;
     */
    me?: Principal;
    /**
     * Mobile clients receive tokens; web clients receive a session cookie instead.
     *
     * @generated from field: string access_token = 2;
     */
    accessToken: string;
    /**
     * @generated from field: string refresh_token = 3;
     */
    refreshToken: string;
    /**
     * @generated from field: google.protobuf.Timestamp access_expires_at = 4;
     */
    accessExpiresAt?: Timestamp;
};
/**
 * Describes the message tank.auth.v1.CompleteMagicLinkResponse.
 * Use `create(CompleteMagicLinkResponseSchema)` to create a new message.
 */
export declare const CompleteMagicLinkResponseSchema: GenMessage<CompleteMagicLinkResponse>;
/**
 * @generated from message tank.auth.v1.ExchangeCodeRequest
 */
export type ExchangeCodeRequest = Message<"tank.auth.v1.ExchangeCodeRequest"> & {
    /**
     * google | apple | github | microsoft
     *
     * @generated from field: string provider = 1;
     */
    provider: string;
    /**
     * @generated from field: string code = 2;
     */
    code: string;
    /**
     * @generated from field: string code_verifier = 3;
     */
    codeVerifier: string;
    /**
     * @generated from field: string redirect_uri = 4;
     */
    redirectUri: string;
};
/**
 * Describes the message tank.auth.v1.ExchangeCodeRequest.
 * Use `create(ExchangeCodeRequestSchema)` to create a new message.
 */
export declare const ExchangeCodeRequestSchema: GenMessage<ExchangeCodeRequest>;
/**
 * @generated from message tank.auth.v1.ExchangeCodeResponse
 */
export type ExchangeCodeResponse = Message<"tank.auth.v1.ExchangeCodeResponse"> & {
    /**
     * @generated from field: tank.auth.v1.Principal me = 1;
     */
    me?: Principal;
    /**
     * @generated from field: string access_token = 2;
     */
    accessToken: string;
    /**
     * @generated from field: string refresh_token = 3;
     */
    refreshToken: string;
    /**
     * @generated from field: google.protobuf.Timestamp access_expires_at = 4;
     */
    accessExpiresAt?: Timestamp;
};
/**
 * Describes the message tank.auth.v1.ExchangeCodeResponse.
 * Use `create(ExchangeCodeResponseSchema)` to create a new message.
 */
export declare const ExchangeCodeResponseSchema: GenMessage<ExchangeCodeResponse>;
/**
 * @generated from message tank.auth.v1.RefreshRequest
 */
export type RefreshRequest = Message<"tank.auth.v1.RefreshRequest"> & {
    /**
     * @generated from field: string refresh_token = 1;
     */
    refreshToken: string;
};
/**
 * Describes the message tank.auth.v1.RefreshRequest.
 * Use `create(RefreshRequestSchema)` to create a new message.
 */
export declare const RefreshRequestSchema: GenMessage<RefreshRequest>;
/**
 * @generated from message tank.auth.v1.RefreshResponse
 */
export type RefreshResponse = Message<"tank.auth.v1.RefreshResponse"> & {
    /**
     * @generated from field: string access_token = 1;
     */
    accessToken: string;
    /**
     * @generated from field: string refresh_token = 2;
     */
    refreshToken: string;
    /**
     * @generated from field: google.protobuf.Timestamp access_expires_at = 3;
     */
    accessExpiresAt?: Timestamp;
};
/**
 * Describes the message tank.auth.v1.RefreshResponse.
 * Use `create(RefreshResponseSchema)` to create a new message.
 */
export declare const RefreshResponseSchema: GenMessage<RefreshResponse>;
/**
 * @generated from message tank.auth.v1.LogoutRequest
 */
export type LogoutRequest = Message<"tank.auth.v1.LogoutRequest"> & {};
/**
 * Describes the message tank.auth.v1.LogoutRequest.
 * Use `create(LogoutRequestSchema)` to create a new message.
 */
export declare const LogoutRequestSchema: GenMessage<LogoutRequest>;
/**
 * @generated from message tank.auth.v1.LogoutResponse
 */
export type LogoutResponse = Message<"tank.auth.v1.LogoutResponse"> & {};
/**
 * Describes the message tank.auth.v1.LogoutResponse.
 * Use `create(LogoutResponseSchema)` to create a new message.
 */
export declare const LogoutResponseSchema: GenMessage<LogoutResponse>;
/**
 * Short-lived bearer for the WebSocket gateway; web sessions are cookies and
 * cannot be sent on the socket handshake, so both platforms mint this first.
 *
 * @generated from message tank.auth.v1.MintGatewayTokenRequest
 */
export type MintGatewayTokenRequest = Message<"tank.auth.v1.MintGatewayTokenRequest"> & {};
/**
 * Describes the message tank.auth.v1.MintGatewayTokenRequest.
 * Use `create(MintGatewayTokenRequestSchema)` to create a new message.
 */
export declare const MintGatewayTokenRequestSchema: GenMessage<MintGatewayTokenRequest>;
/**
 * @generated from message tank.auth.v1.MintGatewayTokenResponse
 */
export type MintGatewayTokenResponse = Message<"tank.auth.v1.MintGatewayTokenResponse"> & {
    /**
     * @generated from field: string token = 1;
     */
    token: string;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 2;
     */
    expiresAt?: Timestamp;
};
/**
 * Describes the message tank.auth.v1.MintGatewayTokenResponse.
 * Use `create(MintGatewayTokenResponseSchema)` to create a new message.
 */
export declare const MintGatewayTokenResponseSchema: GenMessage<MintGatewayTokenResponse>;
/**
 * @generated from message tank.auth.v1.GetMeRequest
 */
export type GetMeRequest = Message<"tank.auth.v1.GetMeRequest"> & {};
/**
 * Describes the message tank.auth.v1.GetMeRequest.
 * Use `create(GetMeRequestSchema)` to create a new message.
 */
export declare const GetMeRequestSchema: GenMessage<GetMeRequest>;
/**
 * @generated from message tank.auth.v1.GetMeResponse
 */
export type GetMeResponse = Message<"tank.auth.v1.GetMeResponse"> & {
    /**
     * @generated from field: tank.auth.v1.Principal me = 1;
     */
    me?: Principal;
};
/**
 * Describes the message tank.auth.v1.GetMeResponse.
 * Use `create(GetMeResponseSchema)` to create a new message.
 */
export declare const GetMeResponseSchema: GenMessage<GetMeResponse>;
/**
 * Every actor is a principal. Bots and agents are first-class so every author
 * reference is uniform across the data model.
 *
 * @generated from enum tank.auth.v1.PrincipalKind
 */
export declare enum PrincipalKind {
    /**
     * @generated from enum value: PRINCIPAL_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: PRINCIPAL_KIND_USER = 1;
     */
    USER = 1,
    /**
     * @generated from enum value: PRINCIPAL_KIND_BOT = 2;
     */
    BOT = 2,
    /**
     * @generated from enum value: PRINCIPAL_KIND_AGENT = 3;
     */
    AGENT = 3
}
/**
 * Describes the enum tank.auth.v1.PrincipalKind.
 */
export declare const PrincipalKindSchema: GenEnum<PrincipalKind>;
/**
 * @generated from service tank.auth.v1.AuthService
 */
export declare const AuthService: GenService<{
    /**
     * @generated from rpc tank.auth.v1.AuthService.StartMagicLink
     */
    startMagicLink: {
        methodKind: "unary";
        input: typeof StartMagicLinkRequestSchema;
        output: typeof StartMagicLinkResponseSchema;
    };
    /**
     * @generated from rpc tank.auth.v1.AuthService.CompleteMagicLink
     */
    completeMagicLink: {
        methodKind: "unary";
        input: typeof CompleteMagicLinkRequestSchema;
        output: typeof CompleteMagicLinkResponseSchema;
    };
    /**
     * @generated from rpc tank.auth.v1.AuthService.ExchangeCode
     */
    exchangeCode: {
        methodKind: "unary";
        input: typeof ExchangeCodeRequestSchema;
        output: typeof ExchangeCodeResponseSchema;
    };
    /**
     * @generated from rpc tank.auth.v1.AuthService.Refresh
     */
    refresh: {
        methodKind: "unary";
        input: typeof RefreshRequestSchema;
        output: typeof RefreshResponseSchema;
    };
    /**
     * @generated from rpc tank.auth.v1.AuthService.Logout
     */
    logout: {
        methodKind: "unary";
        input: typeof LogoutRequestSchema;
        output: typeof LogoutResponseSchema;
    };
    /**
     * @generated from rpc tank.auth.v1.AuthService.MintGatewayToken
     */
    mintGatewayToken: {
        methodKind: "unary";
        input: typeof MintGatewayTokenRequestSchema;
        output: typeof MintGatewayTokenResponseSchema;
    };
    /**
     * @generated from rpc tank.auth.v1.AuthService.GetMe
     */
    getMe: {
        methodKind: "unary";
        input: typeof GetMeRequestSchema;
        output: typeof GetMeResponseSchema;
    };
}>;
