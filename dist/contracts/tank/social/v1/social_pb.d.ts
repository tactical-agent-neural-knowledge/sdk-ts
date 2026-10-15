import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/social/v1/social.proto.
 */
export declare const file_tank_social_v1_social: GenFile;
/**
 * A platform TANK can connect: whether its app keys are in place, and where a
 * person goes to make a new account there.
 *
 * @generated from message tank.social.v1.Provider
 */
export type Provider = Message<"tank.social.v1.Provider"> & {
    /**
     * @generated from field: tank.social.v1.Platform platform = 1;
     */
    platform: Platform;
    /**
     * false: Connect is shown disabled with why
     *
     * @generated from field: bool configured = 2;
     */
    configured: boolean;
    /**
     * @generated from field: string signup_url = 3;
     */
    signupUrl: string;
};
/**
 * Describes the message tank.social.v1.Provider.
 * Use `create(ProviderSchema)` to create a new message.
 */
export declare const ProviderSchema: GenMessage<Provider>;
/**
 * @generated from message tank.social.v1.Account
 */
export type Account = Message<"tank.social.v1.Account"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: tank.social.v1.Platform platform = 2;
     */
    platform: Platform;
    /**
     * "@tankchat" on X, the username on Instagram
     *
     * @generated from field: string handle = 3;
     */
    handle: string;
    /**
     * @generated from field: string display_name = 4;
     */
    displayName: string;
    /**
     * @generated from field: string profile_url = 5;
     */
    profileUrl: string;
    /**
     * user id
     *
     * @generated from field: string connected_by = 6;
     */
    connectedBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp connected_at = 7;
     */
    connectedAt?: Timestamp;
    /**
     * The token was revoked or expired past refresh: posts fail until someone
     * connects again. Reconnecting replaces the row in place.
     *
     * @generated from field: bool needs_reconnect = 8;
     */
    needsReconnect: boolean;
};
/**
 * Describes the message tank.social.v1.Account.
 * Use `create(AccountSchema)` to create a new message.
 */
export declare const AccountSchema: GenMessage<Account>;
/**
 * @generated from message tank.social.v1.Settings
 */
export type Settings = Message<"tank.social.v1.Settings"> & {
    /**
     * The agent may post for this workspace. Off means the social_post tool says so
     * and stops, and no cadence runs.
     *
     * @generated from field: bool enabled = 1;
     */
    enabled: boolean;
    /**
     * Every post the agent writes waits for a person: it is a draft, and the agent
     * asks for a go in the thread before it is published.
     *
     * @generated from field: bool review_required = 2;
     */
    reviewRequired: boolean;
    /**
     * What the agent posts on its own, about what shipped: off | daily | weekly.
     *
     * @generated from field: string cadence = 3;
     */
    cadence: string;
    /**
     * when a cadence post is drafted
     *
     * @generated from field: int32 hour_utc = 4;
     */
    hourUtc: number;
    /**
     * the Tread it is drafted in and drawn from; empty = off
     *
     * @generated from field: string channel_id = 5;
     */
    channelId: string;
    /**
     * where a cadence post goes; empty = every connected account
     *
     * @generated from field: repeated tank.social.v1.Platform platforms = 6;
     */
    platforms: Platform[];
    /**
     * How the accounts sound, in the owner's words ("plain, no hashtags, no emoji").
     *
     * @generated from field: string voice = 7;
     */
    voice: string;
};
/**
 * Describes the message tank.social.v1.Settings.
 * Use `create(SettingsSchema)` to create a new message.
 */
export declare const SettingsSchema: GenMessage<Settings>;
/**
 * @generated from message tank.social.v1.Post
 */
export type Post = Message<"tank.social.v1.Post"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string account_id = 2;
     */
    accountId: string;
    /**
     * @generated from field: tank.social.v1.Platform platform = 3;
     */
    platform: Platform;
    /**
     * @generated from field: string text = 4;
     */
    text: string;
    /**
     * images; Instagram needs one
     *
     * @generated from field: repeated string file_ids = 5;
     */
    fileIds: string[];
    /**
     * @generated from field: tank.social.v1.PostStatus status = 6;
     */
    status: PostStatus;
    /**
     * on the platform, once posted
     *
     * @generated from field: string url = 7;
     */
    url: string;
    /**
     * user id, or "agent"
     *
     * @generated from field: string requested_by = 8;
     */
    requestedBy: string;
    /**
     * the thread it was asked for in, when it was
     *
     * @generated from field: string thread_root_id = 9;
     */
    threadRootId: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 10;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp posted_at = 11;
     */
    postedAt?: Timestamp;
    /**
     * why it failed, in words a person can act on
     *
     * @generated from field: string error = 12;
     */
    error: string;
};
/**
 * Describes the message tank.social.v1.Post.
 * Use `create(PostSchema)` to create a new message.
 */
export declare const PostSchema: GenMessage<Post>;
/**
 * @generated from message tank.social.v1.ListAccountsRequest
 */
export type ListAccountsRequest = Message<"tank.social.v1.ListAccountsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.social.v1.ListAccountsRequest.
 * Use `create(ListAccountsRequestSchema)` to create a new message.
 */
export declare const ListAccountsRequestSchema: GenMessage<ListAccountsRequest>;
/**
 * @generated from message tank.social.v1.ListAccountsResponse
 */
export type ListAccountsResponse = Message<"tank.social.v1.ListAccountsResponse"> & {
    /**
     * @generated from field: repeated tank.social.v1.Account accounts = 1;
     */
    accounts: Account[];
    /**
     * @generated from field: repeated tank.social.v1.Provider providers = 2;
     */
    providers: Provider[];
    /**
     * @generated from field: tank.social.v1.Settings settings = 3;
     */
    settings?: Settings;
    /**
     * admins connect, disconnect and change settings
     *
     * @generated from field: bool can_manage = 4;
     */
    canManage: boolean;
};
/**
 * Describes the message tank.social.v1.ListAccountsResponse.
 * Use `create(ListAccountsResponseSchema)` to create a new message.
 */
export declare const ListAccountsResponseSchema: GenMessage<ListAccountsResponse>;
/**
 * Starts OAuth for one platform. The client opens url; the platform sends the
 * person back through TANK, which stores the account and returns them to
 * return_url with ?connected=<platform> or ?error=<why>.
 *
 * @generated from message tank.social.v1.StartConnectRequest
 */
export type StartConnectRequest = Message<"tank.social.v1.StartConnectRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: tank.social.v1.Platform platform = 2;
     */
    platform: Platform;
    /**
     * @generated from field: string return_url = 3;
     */
    returnUrl: string;
};
/**
 * Describes the message tank.social.v1.StartConnectRequest.
 * Use `create(StartConnectRequestSchema)` to create a new message.
 */
export declare const StartConnectRequestSchema: GenMessage<StartConnectRequest>;
/**
 * @generated from message tank.social.v1.StartConnectResponse
 */
export type StartConnectResponse = Message<"tank.social.v1.StartConnectResponse"> & {
    /**
     * @generated from field: string url = 1;
     */
    url: string;
};
/**
 * Describes the message tank.social.v1.StartConnectResponse.
 * Use `create(StartConnectResponseSchema)` to create a new message.
 */
export declare const StartConnectResponseSchema: GenMessage<StartConnectResponse>;
/**
 * @generated from message tank.social.v1.DisconnectRequest
 */
export type DisconnectRequest = Message<"tank.social.v1.DisconnectRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string account_id = 2;
     */
    accountId: string;
};
/**
 * Describes the message tank.social.v1.DisconnectRequest.
 * Use `create(DisconnectRequestSchema)` to create a new message.
 */
export declare const DisconnectRequestSchema: GenMessage<DisconnectRequest>;
/**
 * @generated from message tank.social.v1.DisconnectResponse
 */
export type DisconnectResponse = Message<"tank.social.v1.DisconnectResponse"> & {};
/**
 * Describes the message tank.social.v1.DisconnectResponse.
 * Use `create(DisconnectResponseSchema)` to create a new message.
 */
export declare const DisconnectResponseSchema: GenMessage<DisconnectResponse>;
/**
 * @generated from message tank.social.v1.GetSettingsRequest
 */
export type GetSettingsRequest = Message<"tank.social.v1.GetSettingsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.social.v1.GetSettingsRequest.
 * Use `create(GetSettingsRequestSchema)` to create a new message.
 */
export declare const GetSettingsRequestSchema: GenMessage<GetSettingsRequest>;
/**
 * @generated from message tank.social.v1.GetSettingsResponse
 */
export type GetSettingsResponse = Message<"tank.social.v1.GetSettingsResponse"> & {
    /**
     * @generated from field: tank.social.v1.Settings settings = 1;
     */
    settings?: Settings;
};
/**
 * Describes the message tank.social.v1.GetSettingsResponse.
 * Use `create(GetSettingsResponseSchema)` to create a new message.
 */
export declare const GetSettingsResponseSchema: GenMessage<GetSettingsResponse>;
/**
 * @generated from message tank.social.v1.UpdateSettingsRequest
 */
export type UpdateSettingsRequest = Message<"tank.social.v1.UpdateSettingsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: tank.social.v1.Settings settings = 2;
     */
    settings?: Settings;
};
/**
 * Describes the message tank.social.v1.UpdateSettingsRequest.
 * Use `create(UpdateSettingsRequestSchema)` to create a new message.
 */
export declare const UpdateSettingsRequestSchema: GenMessage<UpdateSettingsRequest>;
/**
 * @generated from message tank.social.v1.UpdateSettingsResponse
 */
export type UpdateSettingsResponse = Message<"tank.social.v1.UpdateSettingsResponse"> & {
    /**
     * @generated from field: tank.social.v1.Settings settings = 1;
     */
    settings?: Settings;
};
/**
 * Describes the message tank.social.v1.UpdateSettingsResponse.
 * Use `create(UpdateSettingsResponseSchema)` to create a new message.
 */
export declare const UpdateSettingsResponseSchema: GenMessage<UpdateSettingsResponse>;
/**
 * @generated from message tank.social.v1.ListPostsRequest
 */
export type ListPostsRequest = Message<"tank.social.v1.ListPostsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: int32 limit = 2;
     */
    limit: number;
};
/**
 * Describes the message tank.social.v1.ListPostsRequest.
 * Use `create(ListPostsRequestSchema)` to create a new message.
 */
export declare const ListPostsRequestSchema: GenMessage<ListPostsRequest>;
/**
 * @generated from message tank.social.v1.ListPostsResponse
 */
export type ListPostsResponse = Message<"tank.social.v1.ListPostsResponse"> & {
    /**
     * @generated from field: repeated tank.social.v1.Post posts = 1;
     */
    posts: Post[];
};
/**
 * Describes the message tank.social.v1.ListPostsResponse.
 * Use `create(ListPostsResponseSchema)` to create a new message.
 */
export declare const ListPostsResponseSchema: GenMessage<ListPostsResponse>;
/**
 * Writes a post. publish=false leaves a draft a person can publish from the page
 * or the agent can publish after a go; publish=true posts it now.
 *
 * @generated from message tank.social.v1.CreatePostRequest
 */
export type CreatePostRequest = Message<"tank.social.v1.CreatePostRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: tank.social.v1.Platform platform = 2;
     */
    platform: Platform;
    /**
     * @generated from field: string text = 3;
     */
    text: string;
    /**
     * @generated from field: repeated string file_ids = 4;
     */
    fileIds: string[];
    /**
     * @generated from field: bool publish = 5;
     */
    publish: boolean;
};
/**
 * Describes the message tank.social.v1.CreatePostRequest.
 * Use `create(CreatePostRequestSchema)` to create a new message.
 */
export declare const CreatePostRequestSchema: GenMessage<CreatePostRequest>;
/**
 * @generated from message tank.social.v1.CreatePostResponse
 */
export type CreatePostResponse = Message<"tank.social.v1.CreatePostResponse"> & {
    /**
     * @generated from field: tank.social.v1.Post post = 1;
     */
    post?: Post;
};
/**
 * Describes the message tank.social.v1.CreatePostResponse.
 * Use `create(CreatePostResponseSchema)` to create a new message.
 */
export declare const CreatePostResponseSchema: GenMessage<CreatePostResponse>;
/**
 * @generated from message tank.social.v1.PublishPostRequest
 */
export type PublishPostRequest = Message<"tank.social.v1.PublishPostRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string post_id = 2;
     */
    postId: string;
};
/**
 * Describes the message tank.social.v1.PublishPostRequest.
 * Use `create(PublishPostRequestSchema)` to create a new message.
 */
export declare const PublishPostRequestSchema: GenMessage<PublishPostRequest>;
/**
 * @generated from message tank.social.v1.PublishPostResponse
 */
export type PublishPostResponse = Message<"tank.social.v1.PublishPostResponse"> & {
    /**
     * @generated from field: tank.social.v1.Post post = 1;
     */
    post?: Post;
};
/**
 * Describes the message tank.social.v1.PublishPostResponse.
 * Use `create(PublishPostResponseSchema)` to create a new message.
 */
export declare const PublishPostResponseSchema: GenMessage<PublishPostResponse>;
/**
 * @generated from message tank.social.v1.DeletePostRequest
 */
export type DeletePostRequest = Message<"tank.social.v1.DeletePostRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string post_id = 2;
     */
    postId: string;
};
/**
 * Describes the message tank.social.v1.DeletePostRequest.
 * Use `create(DeletePostRequestSchema)` to create a new message.
 */
export declare const DeletePostRequestSchema: GenMessage<DeletePostRequest>;
/**
 * @generated from message tank.social.v1.DeletePostResponse
 */
export type DeletePostResponse = Message<"tank.social.v1.DeletePostResponse"> & {};
/**
 * Describes the message tank.social.v1.DeletePostResponse.
 * Use `create(DeletePostResponseSchema)` to create a new message.
 */
export declare const DeletePostResponseSchema: GenMessage<DeletePostResponse>;
/**
 * @generated from enum tank.social.v1.Platform
 */
export declare enum Platform {
    /**
     * @generated from enum value: PLATFORM_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: PLATFORM_X = 1;
     */
    X = 1,
    /**
     * @generated from enum value: PLATFORM_INSTAGRAM = 2;
     */
    INSTAGRAM = 2
}
/**
 * Describes the enum tank.social.v1.Platform.
 */
export declare const PlatformSchema: GenEnum<Platform>;
/**
 * @generated from enum tank.social.v1.PostStatus
 */
export declare enum PostStatus {
    /**
     * @generated from enum value: POST_STATUS_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: POST_STATUS_DRAFT = 1;
     */
    DRAFT = 1,
    /**
     * @generated from enum value: POST_STATUS_POSTED = 2;
     */
    POSTED = 2,
    /**
     * @generated from enum value: POST_STATUS_FAILED = 3;
     */
    FAILED = 3
}
/**
 * Describes the enum tank.social.v1.PostStatus.
 */
export declare const PostStatusSchema: GenEnum<PostStatus>;
/**
 * @generated from service tank.social.v1.SocialService
 */
export declare const SocialService: GenService<{
    /**
     * @generated from rpc tank.social.v1.SocialService.ListAccounts
     */
    listAccounts: {
        methodKind: "unary";
        input: typeof ListAccountsRequestSchema;
        output: typeof ListAccountsResponseSchema;
    };
    /**
     * @generated from rpc tank.social.v1.SocialService.StartConnect
     */
    startConnect: {
        methodKind: "unary";
        input: typeof StartConnectRequestSchema;
        output: typeof StartConnectResponseSchema;
    };
    /**
     * @generated from rpc tank.social.v1.SocialService.Disconnect
     */
    disconnect: {
        methodKind: "unary";
        input: typeof DisconnectRequestSchema;
        output: typeof DisconnectResponseSchema;
    };
    /**
     * @generated from rpc tank.social.v1.SocialService.GetSettings
     */
    getSettings: {
        methodKind: "unary";
        input: typeof GetSettingsRequestSchema;
        output: typeof GetSettingsResponseSchema;
    };
    /**
     * @generated from rpc tank.social.v1.SocialService.UpdateSettings
     */
    updateSettings: {
        methodKind: "unary";
        input: typeof UpdateSettingsRequestSchema;
        output: typeof UpdateSettingsResponseSchema;
    };
    /**
     * @generated from rpc tank.social.v1.SocialService.ListPosts
     */
    listPosts: {
        methodKind: "unary";
        input: typeof ListPostsRequestSchema;
        output: typeof ListPostsResponseSchema;
    };
    /**
     * @generated from rpc tank.social.v1.SocialService.CreatePost
     */
    createPost: {
        methodKind: "unary";
        input: typeof CreatePostRequestSchema;
        output: typeof CreatePostResponseSchema;
    };
    /**
     * @generated from rpc tank.social.v1.SocialService.PublishPost
     */
    publishPost: {
        methodKind: "unary";
        input: typeof PublishPostRequestSchema;
        output: typeof PublishPostResponseSchema;
    };
    /**
     * @generated from rpc tank.social.v1.SocialService.DeletePost
     */
    deletePost: {
        methodKind: "unary";
        input: typeof DeletePostRequestSchema;
        output: typeof DeletePostResponseSchema;
    };
}>;
