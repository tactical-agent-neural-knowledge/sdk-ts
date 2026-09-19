import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Principal } from "../../auth/v1/auth_pb.js";
import type { Channel, ChannelReadState } from "../../channel/v1/channel_pb.js";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/workspace/v1/workspace.proto.
 */
export declare const file_tank_workspace_v1_workspace: GenFile;
/**
 * @generated from message tank.workspace.v1.Workspace
 */
export type Workspace = Message<"tank.workspace.v1.Workspace"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string slug = 2;
     */
    slug: string;
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: string icon_url = 4;
     */
    iconUrl: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 5;
     */
    createdAt?: Timestamp;
};
/**
 * Describes the message tank.workspace.v1.Workspace.
 * Use `create(WorkspaceSchema)` to create a new message.
 */
export declare const WorkspaceSchema: GenMessage<Workspace>;
/**
 * @generated from message tank.workspace.v1.Member
 */
export type Member = Message<"tank.workspace.v1.Member"> & {
    /**
     * @generated from field: tank.auth.v1.Principal principal = 1;
     */
    principal?: Principal;
    /**
     * @generated from field: tank.workspace.v1.Role role = 2;
     */
    role: Role;
    /**
     * @generated from field: string title = 3;
     */
    title: string;
    /**
     * @generated from field: string timezone = 4;
     */
    timezone: string;
    /**
     * @generated from field: google.protobuf.Timestamp joined_at = 5;
     */
    joinedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp deactivated_at = 6;
     */
    deactivatedAt?: Timestamp;
};
/**
 * Describes the message tank.workspace.v1.Member.
 * Use `create(MemberSchema)` to create a new message.
 */
export declare const MemberSchema: GenMessage<Member>;
/**
 * @generated from message tank.workspace.v1.CreateWorkspaceRequest
 */
export type CreateWorkspaceRequest = Message<"tank.workspace.v1.CreateWorkspaceRequest"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string slug = 2;
     */
    slug: string;
};
/**
 * Describes the message tank.workspace.v1.CreateWorkspaceRequest.
 * Use `create(CreateWorkspaceRequestSchema)` to create a new message.
 */
export declare const CreateWorkspaceRequestSchema: GenMessage<CreateWorkspaceRequest>;
/**
 * @generated from message tank.workspace.v1.CreateWorkspaceResponse
 */
export type CreateWorkspaceResponse = Message<"tank.workspace.v1.CreateWorkspaceResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.Workspace workspace = 1;
     */
    workspace?: Workspace;
};
/**
 * Describes the message tank.workspace.v1.CreateWorkspaceResponse.
 * Use `create(CreateWorkspaceResponseSchema)` to create a new message.
 */
export declare const CreateWorkspaceResponseSchema: GenMessage<CreateWorkspaceResponse>;
/**
 * @generated from message tank.workspace.v1.ListWorkspacesRequest
 */
export type ListWorkspacesRequest = Message<"tank.workspace.v1.ListWorkspacesRequest"> & {};
/**
 * Describes the message tank.workspace.v1.ListWorkspacesRequest.
 * Use `create(ListWorkspacesRequestSchema)` to create a new message.
 */
export declare const ListWorkspacesRequestSchema: GenMessage<ListWorkspacesRequest>;
/**
 * @generated from message tank.workspace.v1.ListWorkspacesResponse
 */
export type ListWorkspacesResponse = Message<"tank.workspace.v1.ListWorkspacesResponse"> & {
    /**
     * @generated from field: repeated tank.workspace.v1.Workspace workspaces = 1;
     */
    workspaces: Workspace[];
};
/**
 * Describes the message tank.workspace.v1.ListWorkspacesResponse.
 * Use `create(ListWorkspacesResponseSchema)` to create a new message.
 */
export declare const ListWorkspacesResponseSchema: GenMessage<ListWorkspacesResponse>;
/**
 * One call on app open. Everything else is lazy.
 *
 * @generated from message tank.workspace.v1.GetBootstrapRequest
 */
export type GetBootstrapRequest = Message<"tank.workspace.v1.GetBootstrapRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.workspace.v1.GetBootstrapRequest.
 * Use `create(GetBootstrapRequestSchema)` to create a new message.
 */
export declare const GetBootstrapRequestSchema: GenMessage<GetBootstrapRequest>;
/**
 * @generated from message tank.workspace.v1.GetBootstrapResponse
 */
export type GetBootstrapResponse = Message<"tank.workspace.v1.GetBootstrapResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.Workspace workspace = 1;
     */
    workspace?: Workspace;
    /**
     * @generated from field: tank.workspace.v1.Member me = 2;
     */
    me?: Member;
    /**
     * @generated from field: repeated tank.channel.v1.Channel channels = 3;
     */
    channels: Channel[];
    /**
     * @generated from field: repeated tank.channel.v1.ChannelReadState read_states = 4;
     */
    readStates: ChannelReadState[];
    /**
     * capped; ListMembers pages the rest
     *
     * @generated from field: repeated tank.workspace.v1.Member members = 5;
     */
    members: Member[];
    /**
     * @generated from field: string custom_emoji_hash = 6;
     */
    customEmojiHash: string;
    /**
     * @generated from field: int32 unread_notification_count = 7;
     */
    unreadNotificationCount: number;
};
/**
 * Describes the message tank.workspace.v1.GetBootstrapResponse.
 * Use `create(GetBootstrapResponseSchema)` to create a new message.
 */
export declare const GetBootstrapResponseSchema: GenMessage<GetBootstrapResponse>;
/**
 * @generated from message tank.workspace.v1.ListMembersRequest
 */
export type ListMembersRequest = Message<"tank.workspace.v1.ListMembersRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string cursor = 2;
     */
    cursor: string;
    /**
     * @generated from field: int32 limit = 3;
     */
    limit: number;
};
/**
 * Describes the message tank.workspace.v1.ListMembersRequest.
 * Use `create(ListMembersRequestSchema)` to create a new message.
 */
export declare const ListMembersRequestSchema: GenMessage<ListMembersRequest>;
/**
 * @generated from message tank.workspace.v1.ListMembersResponse
 */
export type ListMembersResponse = Message<"tank.workspace.v1.ListMembersResponse"> & {
    /**
     * @generated from field: repeated tank.workspace.v1.Member members = 1;
     */
    members: Member[];
    /**
     * @generated from field: string next_cursor = 2;
     */
    nextCursor: string;
};
/**
 * Describes the message tank.workspace.v1.ListMembersResponse.
 * Use `create(ListMembersResponseSchema)` to create a new message.
 */
export declare const ListMembersResponseSchema: GenMessage<ListMembersResponse>;
/**
 * @generated from message tank.workspace.v1.InviteMemberRequest
 */
export type InviteMemberRequest = Message<"tank.workspace.v1.InviteMemberRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string email = 2;
     */
    email: string;
    /**
     * @generated from field: tank.workspace.v1.Role role = 3;
     */
    role: Role;
};
/**
 * Describes the message tank.workspace.v1.InviteMemberRequest.
 * Use `create(InviteMemberRequestSchema)` to create a new message.
 */
export declare const InviteMemberRequestSchema: GenMessage<InviteMemberRequest>;
/**
 * @generated from message tank.workspace.v1.InviteMemberResponse
 */
export type InviteMemberResponse = Message<"tank.workspace.v1.InviteMemberResponse"> & {
    /**
     * @generated from field: string invite_id = 1;
     */
    inviteId: string;
};
/**
 * Describes the message tank.workspace.v1.InviteMemberResponse.
 * Use `create(InviteMemberResponseSchema)` to create a new message.
 */
export declare const InviteMemberResponseSchema: GenMessage<InviteMemberResponse>;
/**
 * @generated from message tank.workspace.v1.JoinWorkspaceRequest
 */
export type JoinWorkspaceRequest = Message<"tank.workspace.v1.JoinWorkspaceRequest"> & {
    /**
     * @generated from field: string invite_token = 1;
     */
    inviteToken: string;
};
/**
 * Describes the message tank.workspace.v1.JoinWorkspaceRequest.
 * Use `create(JoinWorkspaceRequestSchema)` to create a new message.
 */
export declare const JoinWorkspaceRequestSchema: GenMessage<JoinWorkspaceRequest>;
/**
 * @generated from message tank.workspace.v1.JoinWorkspaceResponse
 */
export type JoinWorkspaceResponse = Message<"tank.workspace.v1.JoinWorkspaceResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.Workspace workspace = 1;
     */
    workspace?: Workspace;
    /**
     * @generated from field: tank.workspace.v1.Member me = 2;
     */
    me?: Member;
};
/**
 * Describes the message tank.workspace.v1.JoinWorkspaceResponse.
 * Use `create(JoinWorkspaceResponseSchema)` to create a new message.
 */
export declare const JoinWorkspaceResponseSchema: GenMessage<JoinWorkspaceResponse>;
/**
 * @generated from enum tank.workspace.v1.Role
 */
export declare enum Role {
    /**
     * @generated from enum value: ROLE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: ROLE_OWNER = 1;
     */
    OWNER = 1,
    /**
     * @generated from enum value: ROLE_ADMIN = 2;
     */
    ADMIN = 2,
    /**
     * @generated from enum value: ROLE_MEMBER = 3;
     */
    MEMBER = 3,
    /**
     * @generated from enum value: ROLE_GUEST = 4;
     */
    GUEST = 4,
    /**
     * @generated from enum value: ROLE_BOT = 5;
     */
    BOT = 5
}
/**
 * Describes the enum tank.workspace.v1.Role.
 */
export declare const RoleSchema: GenEnum<Role>;
/**
 * @generated from service tank.workspace.v1.WorkspaceService
 */
export declare const WorkspaceService: GenService<{
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.CreateWorkspace
     */
    createWorkspace: {
        methodKind: "unary";
        input: typeof CreateWorkspaceRequestSchema;
        output: typeof CreateWorkspaceResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.ListWorkspaces
     */
    listWorkspaces: {
        methodKind: "unary";
        input: typeof ListWorkspacesRequestSchema;
        output: typeof ListWorkspacesResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.GetBootstrap
     */
    getBootstrap: {
        methodKind: "unary";
        input: typeof GetBootstrapRequestSchema;
        output: typeof GetBootstrapResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.ListMembers
     */
    listMembers: {
        methodKind: "unary";
        input: typeof ListMembersRequestSchema;
        output: typeof ListMembersResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.InviteMember
     */
    inviteMember: {
        methodKind: "unary";
        input: typeof InviteMemberRequestSchema;
        output: typeof InviteMemberResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.JoinWorkspace
     */
    joinWorkspace: {
        methodKind: "unary";
        input: typeof JoinWorkspaceRequestSchema;
        output: typeof JoinWorkspaceResponseSchema;
    };
}>;
