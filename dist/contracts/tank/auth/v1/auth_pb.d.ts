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
    /**
     * Uploaded avatar (tank.files.v1.File id); resolve with GetDownloadUrl. Empty = use avatar_url.
     *
     * @generated from field: string avatar_file_id = 6;
     */
    avatarFileId: string;
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
 * One account signed in on this device. A session holds several: the same
 * person often belongs to workspaces under different email addresses, and
 * signing into one must never sign them out of another.
 *
 * Which identity a request acts as is chosen per request by the
 * `x-tank-user` header, not by server-side "active" state, so two tabs can
 * sit in two accounts at once.
 *
 * @generated from message tank.auth.v1.Identity
 */
export type Identity = Message<"tank.auth.v1.Identity"> & {
    /**
     * @generated from field: tank.auth.v1.Principal principal = 1;
     */
    principal?: Principal;
    /**
     * True for the identity used when a request names none.
     *
     * @generated from field: bool is_default = 2;
     */
    isDefault: boolean;
    /**
     * When this account was added to the session.
     *
     * @generated from field: google.protobuf.Timestamp added_at = 3;
     */
    addedAt?: Timestamp;
};
/**
 * Describes the message tank.auth.v1.Identity.
 * Use `create(IdentitySchema)` to create a new message.
 */
export declare const IdentitySchema: GenMessage<Identity>;
/**
 * @generated from message tank.auth.v1.ListIdentitiesRequest
 */
export type ListIdentitiesRequest = Message<"tank.auth.v1.ListIdentitiesRequest"> & {};
/**
 * Describes the message tank.auth.v1.ListIdentitiesRequest.
 * Use `create(ListIdentitiesRequestSchema)` to create a new message.
 */
export declare const ListIdentitiesRequestSchema: GenMessage<ListIdentitiesRequest>;
/**
 * @generated from message tank.auth.v1.ListIdentitiesResponse
 */
export type ListIdentitiesResponse = Message<"tank.auth.v1.ListIdentitiesResponse"> & {
    /**
     * @generated from field: repeated tank.auth.v1.Identity identities = 1;
     */
    identities: Identity[];
};
/**
 * Describes the message tank.auth.v1.ListIdentitiesResponse.
 * Use `create(ListIdentitiesResponseSchema)` to create a new message.
 */
export declare const ListIdentitiesResponseSchema: GenMessage<ListIdentitiesResponse>;
/**
 * Removes one account from this device, leaving the others signed in. Removing
 * the last one ends the session, exactly like Logout.
 *
 * @generated from message tank.auth.v1.SignOutIdentityRequest
 */
export type SignOutIdentityRequest = Message<"tank.auth.v1.SignOutIdentityRequest"> & {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
};
/**
 * Describes the message tank.auth.v1.SignOutIdentityRequest.
 * Use `create(SignOutIdentityRequestSchema)` to create a new message.
 */
export declare const SignOutIdentityRequestSchema: GenMessage<SignOutIdentityRequest>;
/**
 * @generated from message tank.auth.v1.SignOutIdentityResponse
 */
export type SignOutIdentityResponse = Message<"tank.auth.v1.SignOutIdentityResponse"> & {
    /**
     * False once the session itself is gone, so the client knows to stop.
     *
     * @generated from field: bool session_remains = 1;
     */
    sessionRemains: boolean;
};
/**
 * Describes the message tank.auth.v1.SignOutIdentityResponse.
 * Use `create(SignOutIdentityResponseSchema)` to create a new message.
 */
export declare const SignOutIdentityResponseSchema: GenMessage<SignOutIdentityResponse>;
/**
 * One signed-in device: a web cookie session or a mobile refresh session.
 *
 * @generated from message tank.auth.v1.Session
 */
export type Session = Message<"tank.auth.v1.Session"> & {
    /**
     * opaque; never the secret
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * web | mobile
     *
     * @generated from field: string kind = 2;
     */
    kind: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 3;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 4;
     */
    expiresAt?: Timestamp;
    /**
     * @generated from field: string user_agent = 5;
     */
    userAgent: string;
    /**
     * @generated from field: string ip = 6;
     */
    ip: string;
    /**
     * the session making this call
     *
     * @generated from field: bool current = 7;
     */
    current: boolean;
};
/**
 * Describes the message tank.auth.v1.Session.
 * Use `create(SessionSchema)` to create a new message.
 */
export declare const SessionSchema: GenMessage<Session>;
/**
 * @generated from message tank.auth.v1.ListSessionsRequest
 */
export type ListSessionsRequest = Message<"tank.auth.v1.ListSessionsRequest"> & {};
/**
 * Describes the message tank.auth.v1.ListSessionsRequest.
 * Use `create(ListSessionsRequestSchema)` to create a new message.
 */
export declare const ListSessionsRequestSchema: GenMessage<ListSessionsRequest>;
/**
 * @generated from message tank.auth.v1.ListSessionsResponse
 */
export type ListSessionsResponse = Message<"tank.auth.v1.ListSessionsResponse"> & {
    /**
     * @generated from field: repeated tank.auth.v1.Session sessions = 1;
     */
    sessions: Session[];
};
/**
 * Describes the message tank.auth.v1.ListSessionsResponse.
 * Use `create(ListSessionsResponseSchema)` to create a new message.
 */
export declare const ListSessionsResponseSchema: GenMessage<ListSessionsResponse>;
/**
 * Revokes one of the caller's own sessions (the current one included).
 *
 * @generated from message tank.auth.v1.RevokeSessionRequest
 */
export type RevokeSessionRequest = Message<"tank.auth.v1.RevokeSessionRequest"> & {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
};
/**
 * Describes the message tank.auth.v1.RevokeSessionRequest.
 * Use `create(RevokeSessionRequestSchema)` to create a new message.
 */
export declare const RevokeSessionRequestSchema: GenMessage<RevokeSessionRequest>;
/**
 * @generated from message tank.auth.v1.RevokeSessionResponse
 */
export type RevokeSessionResponse = Message<"tank.auth.v1.RevokeSessionResponse"> & {};
/**
 * Describes the message tank.auth.v1.RevokeSessionResponse.
 * Use `create(RevokeSessionResponseSchema)` to create a new message.
 */
export declare const RevokeSessionResponseSchema: GenMessage<RevokeSessionResponse>;
/**
 * Workspace admins sign a member out of every device. The user must be a
 * member of workspace_id; every session of theirs is revoked, and so are
 * API tokens bound to that workspace.
 *
 * @generated from message tank.auth.v1.AdminRevokeUserSessionsRequest
 */
export type AdminRevokeUserSessionsRequest = Message<"tank.auth.v1.AdminRevokeUserSessionsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
};
/**
 * Describes the message tank.auth.v1.AdminRevokeUserSessionsRequest.
 * Use `create(AdminRevokeUserSessionsRequestSchema)` to create a new message.
 */
export declare const AdminRevokeUserSessionsRequestSchema: GenMessage<AdminRevokeUserSessionsRequest>;
/**
 * @generated from message tank.auth.v1.AdminRevokeUserSessionsResponse
 */
export type AdminRevokeUserSessionsResponse = Message<"tank.auth.v1.AdminRevokeUserSessionsResponse"> & {
    /**
     * @generated from field: int32 revoked = 1;
     */
    revoked: number;
};
/**
 * Describes the message tank.auth.v1.AdminRevokeUserSessionsResponse.
 * Use `create(AdminRevokeUserSessionsResponseSchema)` to create a new message.
 */
export declare const AdminRevokeUserSessionsResponseSchema: GenMessage<AdminRevokeUserSessionsResponse>;
/**
 * @generated from message tank.auth.v1.SsoConfig
 */
export type SsoConfig = Message<"tank.auth.v1.SsoConfig"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: tank.auth.v1.SsoProvider provider = 2;
     */
    provider: SsoProvider;
    /**
     * @generated from field: bool enabled = 3;
     */
    enabled: boolean;
    /**
     * OIDC: the issuer URL (discovery at <issuer>/.well-known/openid-configuration).
     * SAML: the IdP metadata URL; metadata_xml may be given instead.
     *
     * @generated from field: string issuer = 4;
     */
    issuer: string;
    /**
     * @generated from field: string metadata_xml = 5;
     */
    metadataXml: string;
    /**
     * @generated from field: string client_id = 6;
     */
    clientId: string;
    /**
     * Where the client secret lives (env or secret-manager name); the secret
     * itself is write-only through SetSsoConfig.client_secret.
     *
     * @generated from field: string client_secret_ref = 7;
     */
    clientSecretRef: string;
    /**
     * @generated from field: bool has_client_secret = 8;
     */
    hasClientSecret: boolean;
    /**
     * Email domain the IdP must assert (e.g. "acme.com"); empty = any.
     *
     * @generated from field: string domain_claim = 9;
     */
    domainClaim: string;
    /**
     * Users of domain_claim must sign in through SSO (mirrors
     * WorkspaceSettings.require_sso).
     *
     * @generated from field: bool enforce = 10;
     */
    enforce: boolean;
    /**
     * Read-only helpers for configuring the IdP.
     *
     * OIDC callback (web)
     *
     * @generated from field: string redirect_uri = 11;
     */
    redirectUri: string;
    /**
     * SAML SP entity id
     *
     * @generated from field: string sp_entity_id = 12;
     */
    spEntityId: string;
    /**
     * SAML SP metadata (/saml/{workspace}/metadata)
     *
     * @generated from field: string sp_metadata_url = 13;
     */
    spMetadataUrl: string;
    /**
     * SAML ACS (/saml/{workspace}/acs)
     *
     * @generated from field: string acs_url = 14;
     */
    acsUrl: string;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 15;
     */
    updatedAt?: Timestamp;
};
/**
 * Describes the message tank.auth.v1.SsoConfig.
 * Use `create(SsoConfigSchema)` to create a new message.
 */
export declare const SsoConfigSchema: GenMessage<SsoConfig>;
/**
 * @generated from message tank.auth.v1.GetSsoConfigRequest
 */
export type GetSsoConfigRequest = Message<"tank.auth.v1.GetSsoConfigRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.auth.v1.GetSsoConfigRequest.
 * Use `create(GetSsoConfigRequestSchema)` to create a new message.
 */
export declare const GetSsoConfigRequestSchema: GenMessage<GetSsoConfigRequest>;
/**
 * @generated from message tank.auth.v1.GetSsoConfigResponse
 */
export type GetSsoConfigResponse = Message<"tank.auth.v1.GetSsoConfigResponse"> & {
    /**
     * unset when never configured
     *
     * @generated from field: tank.auth.v1.SsoConfig config = 1;
     */
    config?: SsoConfig;
};
/**
 * Describes the message tank.auth.v1.GetSsoConfigResponse.
 * Use `create(GetSsoConfigResponseSchema)` to create a new message.
 */
export declare const GetSsoConfigResponseSchema: GenMessage<GetSsoConfigResponse>;
/**
 * Owner or admin. client_secret empty = keep the stored secret.
 *
 * @generated from message tank.auth.v1.SetSsoConfigRequest
 */
export type SetSsoConfigRequest = Message<"tank.auth.v1.SetSsoConfigRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: tank.auth.v1.SsoProvider provider = 2;
     */
    provider: SsoProvider;
    /**
     * @generated from field: bool enabled = 3;
     */
    enabled: boolean;
    /**
     * @generated from field: string issuer = 4;
     */
    issuer: string;
    /**
     * @generated from field: string metadata_xml = 5;
     */
    metadataXml: string;
    /**
     * @generated from field: string client_id = 6;
     */
    clientId: string;
    /**
     * @generated from field: string client_secret = 7;
     */
    clientSecret: string;
    /**
     * @generated from field: string client_secret_ref = 8;
     */
    clientSecretRef: string;
    /**
     * @generated from field: string domain_claim = 9;
     */
    domainClaim: string;
    /**
     * @generated from field: bool enforce = 10;
     */
    enforce: boolean;
};
/**
 * Describes the message tank.auth.v1.SetSsoConfigRequest.
 * Use `create(SetSsoConfigRequestSchema)` to create a new message.
 */
export declare const SetSsoConfigRequestSchema: GenMessage<SetSsoConfigRequest>;
/**
 * @generated from message tank.auth.v1.SetSsoConfigResponse
 */
export type SetSsoConfigResponse = Message<"tank.auth.v1.SetSsoConfigResponse"> & {
    /**
     * @generated from field: tank.auth.v1.SsoConfig config = 1;
     */
    config?: SsoConfig;
};
/**
 * Describes the message tank.auth.v1.SetSsoConfigResponse.
 * Use `create(SetSsoConfigResponseSchema)` to create a new message.
 */
export declare const SetSsoConfigResponseSchema: GenMessage<SetSsoConfigResponse>;
/**
 * Begins SSO for a workspace: returns the IdP URL to send the browser to.
 * redirect_uri is where the IdP (OIDC) or the ACS (SAML) sends the user
 * back; it must be PUBLIC_WEB_URL or a registered mobile scheme.
 *
 * @generated from message tank.auth.v1.StartSsoRequest
 */
export type StartSsoRequest = Message<"tank.auth.v1.StartSsoRequest"> & {
    /**
     * @generated from field: string workspace_slug = 1;
     */
    workspaceSlug: string;
    /**
     * @generated from field: string redirect_uri = 2;
     */
    redirectUri: string;
};
/**
 * Describes the message tank.auth.v1.StartSsoRequest.
 * Use `create(StartSsoRequestSchema)` to create a new message.
 */
export declare const StartSsoRequestSchema: GenMessage<StartSsoRequest>;
/**
 * @generated from message tank.auth.v1.StartSsoResponse
 */
export type StartSsoResponse = Message<"tank.auth.v1.StartSsoResponse"> & {
    /**
     * @generated from field: string redirect_url = 1;
     */
    redirectUrl: string;
    /**
     * @generated from field: string state = 2;
     */
    state: string;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 3;
     */
    expiresAt?: Timestamp;
};
/**
 * Describes the message tank.auth.v1.StartSsoResponse.
 * Use `create(StartSsoResponseSchema)` to create a new message.
 */
export declare const StartSsoResponseSchema: GenMessage<StartSsoResponse>;
/**
 * Finishes SSO. OIDC: state + code from the callback query. SAML: state
 * (RelayState) + code (the one-time ticket the ACS redirected with), or the
 * raw saml_response when the client received the POST itself.
 *
 * @generated from message tank.auth.v1.CompleteSsoRequest
 */
export type CompleteSsoRequest = Message<"tank.auth.v1.CompleteSsoRequest"> & {
    /**
     * @generated from field: string state = 1;
     */
    state: string;
    /**
     * @generated from field: string code = 2;
     */
    code: string;
    /**
     * @generated from field: string saml_response = 3;
     */
    samlResponse: string;
};
/**
 * Describes the message tank.auth.v1.CompleteSsoRequest.
 * Use `create(CompleteSsoRequestSchema)` to create a new message.
 */
export declare const CompleteSsoRequestSchema: GenMessage<CompleteSsoRequest>;
/**
 * @generated from message tank.auth.v1.CompleteSsoResponse
 */
export type CompleteSsoResponse = Message<"tank.auth.v1.CompleteSsoResponse"> & {
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
    /**
     * @generated from field: string workspace_id = 5;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.auth.v1.CompleteSsoResponse.
 * Use `create(CompleteSsoResponseSchema)` to create a new message.
 */
export declare const CompleteSsoResponseSchema: GenMessage<CompleteSsoResponse>;
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
 * @generated from enum tank.auth.v1.SsoProvider
 */
export declare enum SsoProvider {
    /**
     * @generated from enum value: SSO_PROVIDER_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: SSO_PROVIDER_OIDC = 1;
     */
    OIDC = 1,
    /**
     * @generated from enum value: SSO_PROVIDER_SAML = 2;
     */
    SAML = 2
}
/**
 * Describes the enum tank.auth.v1.SsoProvider.
 */
export declare const SsoProviderSchema: GenEnum<SsoProvider>;
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
    /**
     * @generated from rpc tank.auth.v1.AuthService.ListIdentities
     */
    listIdentities: {
        methodKind: "unary";
        input: typeof ListIdentitiesRequestSchema;
        output: typeof ListIdentitiesResponseSchema;
    };
    /**
     * @generated from rpc tank.auth.v1.AuthService.SignOutIdentity
     */
    signOutIdentity: {
        methodKind: "unary";
        input: typeof SignOutIdentityRequestSchema;
        output: typeof SignOutIdentityResponseSchema;
    };
    /**
     * @generated from rpc tank.auth.v1.AuthService.ListSessions
     */
    listSessions: {
        methodKind: "unary";
        input: typeof ListSessionsRequestSchema;
        output: typeof ListSessionsResponseSchema;
    };
    /**
     * @generated from rpc tank.auth.v1.AuthService.RevokeSession
     */
    revokeSession: {
        methodKind: "unary";
        input: typeof RevokeSessionRequestSchema;
        output: typeof RevokeSessionResponseSchema;
    };
    /**
     * @generated from rpc tank.auth.v1.AuthService.AdminRevokeUserSessions
     */
    adminRevokeUserSessions: {
        methodKind: "unary";
        input: typeof AdminRevokeUserSessionsRequestSchema;
        output: typeof AdminRevokeUserSessionsResponseSchema;
    };
    /**
     * @generated from rpc tank.auth.v1.AuthService.GetSsoConfig
     */
    getSsoConfig: {
        methodKind: "unary";
        input: typeof GetSsoConfigRequestSchema;
        output: typeof GetSsoConfigResponseSchema;
    };
    /**
     * @generated from rpc tank.auth.v1.AuthService.SetSsoConfig
     */
    setSsoConfig: {
        methodKind: "unary";
        input: typeof SetSsoConfigRequestSchema;
        output: typeof SetSsoConfigResponseSchema;
    };
    /**
     * @generated from rpc tank.auth.v1.AuthService.StartSso
     */
    startSso: {
        methodKind: "unary";
        input: typeof StartSsoRequestSchema;
        output: typeof StartSsoResponseSchema;
    };
    /**
     * @generated from rpc tank.auth.v1.AuthService.CompleteSso
     */
    completeSso: {
        methodKind: "unary";
        input: typeof CompleteSsoRequestSchema;
        output: typeof CompleteSsoResponseSchema;
    };
}>;
