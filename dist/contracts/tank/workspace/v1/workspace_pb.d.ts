import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Principal } from "../../auth/v1/auth_pb.js";
import type { Channel, ChannelReadState, NotifyPref } from "../../channel/v1/channel_pb.js";
import type { MarkType } from "../../topo/v1/topo_pb.js";
import type { RichText } from "../../richtext/v1/richtext_pb.js";
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
     * Changes whenever the workspace's custom emoji set changes; clients
     * refetch ListEmoji when it differs from their cached value.
     *
     * @generated from field: string custom_emoji_hash = 6;
     */
    customEmojiHash: string;
    /**
     * @generated from field: int32 unread_notification_count = 7;
     */
    unreadNotificationCount: number;
    /**
     * @generated from field: tank.workspace.v1.Preferences preferences = 8;
     */
    preferences?: Preferences;
    /**
     * @generated from field: repeated tank.workspace.v1.UserGroup user_groups = 9;
     */
    userGroups: UserGroup[];
    /**
     * What this workspace's plan allows, so clients can mark premium surfaces
     * before anyone hits a wall. The server is still the authority: every gated
     * call is checked again server-side.
     *
     * @generated from field: tank.workspace.v1.Entitlements entitlements = 10;
     */
    entitlements?: Entitlements;
};
/**
 * Describes the message tank.workspace.v1.GetBootstrapResponse.
 * Use `create(GetBootstrapResponseSchema)` to create a new message.
 */
export declare const GetBootstrapResponseSchema: GenMessage<GetBootstrapResponse>;
/**
 * Everything Slack does is free. The agent and the Neural Vault are what a
 * subscription buys; a free workspace gets one of each to try.
 *
 * @generated from message tank.workspace.v1.Entitlements
 */
export type Entitlements = Message<"tank.workspace.v1.Entitlements"> & {
    /**
     * "free" or "premium".
     *
     * @generated from field: string plan = 1;
     */
    plan: string;
    /**
     * Whether another agent run / Neural Vault query is allowed right now.
     *
     * @generated from field: bool agent_runs = 2;
     */
    agentRuns: boolean;
    /**
     * @generated from field: bool neural_vault = 3;
     */
    neuralVault: boolean;
    /**
     * @generated from field: int32 agent_runs_used = 4;
     */
    agentRunsUsed: number;
    /**
     * @generated from field: int32 agent_runs_limit = 5;
     */
    agentRunsLimit: number;
    /**
     * @generated from field: int32 vault_queries_used = 6;
     */
    vaultQueriesUsed: number;
    /**
     * @generated from field: int32 vault_queries_limit = 7;
     */
    vaultQueriesLimit: number;
    /**
     * Where to write to upgrade; the clients show it rather than hard-coding it.
     *
     * @generated from field: string contact_email = 8;
     */
    contactEmail: string;
};
/**
 * Describes the message tank.workspace.v1.Entitlements.
 * Use `create(EntitlementsSchema)` to create a new message.
 */
export declare const EntitlementsSchema: GenMessage<Entitlements>;
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
    /**
     * Narrow to members whose name, handle or email contains this, case-insensitively.
     *
     * Bootstrap loads at most 200 members, and mention suggestions filtered only
     * that set — so in a larger workspace the person you meant was simply absent
     * from the list, with nothing to say why. Typing @ should ask the server.
     *
     * @generated from field: string query = 4;
     */
    query: string;
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
 * An invitation that has been sent and not yet accepted. Members lists these
 * beside real members: inviting five people and seeing the screen unchanged
 * reads as a failure, and there is otherwise no way to tell who is outstanding
 * or to take an invite back.
 *
 * @generated from message tank.workspace.v1.Invite
 */
export type Invite = Message<"tank.workspace.v1.Invite"> & {
    /**
     * Stable handle for revoking. Not the token: that only ever exists in the
     * email, and anyone who can list invites must not be able to accept them.
     *
     * @generated from field: string invite_id = 1;
     */
    inviteId: string;
    /**
     * @generated from field: string email = 2;
     */
    email: string;
    /**
     * @generated from field: tank.workspace.v1.Role role = 3;
     */
    role: Role;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 4;
     */
    expiresAt?: Timestamp;
};
/**
 * Describes the message tank.workspace.v1.Invite.
 * Use `create(InviteSchema)` to create a new message.
 */
export declare const InviteSchema: GenMessage<Invite>;
/**
 * @generated from message tank.workspace.v1.ListInvitesRequest
 */
export type ListInvitesRequest = Message<"tank.workspace.v1.ListInvitesRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.workspace.v1.ListInvitesRequest.
 * Use `create(ListInvitesRequestSchema)` to create a new message.
 */
export declare const ListInvitesRequestSchema: GenMessage<ListInvitesRequest>;
/**
 * @generated from message tank.workspace.v1.ListInvitesResponse
 */
export type ListInvitesResponse = Message<"tank.workspace.v1.ListInvitesResponse"> & {
    /**
     * @generated from field: repeated tank.workspace.v1.Invite invites = 1;
     */
    invites: Invite[];
};
/**
 * Describes the message tank.workspace.v1.ListInvitesResponse.
 * Use `create(ListInvitesResponseSchema)` to create a new message.
 */
export declare const ListInvitesResponseSchema: GenMessage<ListInvitesResponse>;
/**
 * @generated from message tank.workspace.v1.RevokeInviteRequest
 */
export type RevokeInviteRequest = Message<"tank.workspace.v1.RevokeInviteRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string invite_id = 2;
     */
    inviteId: string;
};
/**
 * Describes the message tank.workspace.v1.RevokeInviteRequest.
 * Use `create(RevokeInviteRequestSchema)` to create a new message.
 */
export declare const RevokeInviteRequestSchema: GenMessage<RevokeInviteRequest>;
/**
 * @generated from message tank.workspace.v1.RevokeInviteResponse
 */
export type RevokeInviteResponse = Message<"tank.workspace.v1.RevokeInviteResponse"> & {};
/**
 * Describes the message tank.workspace.v1.RevokeInviteResponse.
 * Use `create(RevokeInviteResponseSchema)` to create a new message.
 */
export declare const RevokeInviteResponseSchema: GenMessage<RevokeInviteResponse>;
/**
 * An invite waiting for the signed-in person, across every workspace. Someone
 * who signs up instead of opening the emailed link lands with no workspaces and
 * is shown "create one" — so the two people invited to Cache7 each made their
 * own workspace and never joined the one they were invited to.
 *
 * @generated from message tank.workspace.v1.PendingInvite
 */
export type PendingInvite = Message<"tank.workspace.v1.PendingInvite"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string workspace_name = 2;
     */
    workspaceName: string;
    /**
     * @generated from field: string workspace_slug = 3;
     */
    workspaceSlug: string;
    /**
     * @generated from field: tank.workspace.v1.Role role = 4;
     */
    role: Role;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 5;
     */
    expiresAt?: Timestamp;
};
/**
 * Describes the message tank.workspace.v1.PendingInvite.
 * Use `create(PendingInviteSchema)` to create a new message.
 */
export declare const PendingInviteSchema: GenMessage<PendingInvite>;
/**
 * @generated from message tank.workspace.v1.ListMyInvitesRequest
 */
export type ListMyInvitesRequest = Message<"tank.workspace.v1.ListMyInvitesRequest"> & {};
/**
 * Describes the message tank.workspace.v1.ListMyInvitesRequest.
 * Use `create(ListMyInvitesRequestSchema)` to create a new message.
 */
export declare const ListMyInvitesRequestSchema: GenMessage<ListMyInvitesRequest>;
/**
 * @generated from message tank.workspace.v1.ListMyInvitesResponse
 */
export type ListMyInvitesResponse = Message<"tank.workspace.v1.ListMyInvitesResponse"> & {
    /**
     * @generated from field: repeated tank.workspace.v1.PendingInvite invites = 1;
     */
    invites: PendingInvite[];
};
/**
 * Describes the message tank.workspace.v1.ListMyInvitesResponse.
 * Use `create(ListMyInvitesResponseSchema)` to create a new message.
 */
export declare const ListMyInvitesResponseSchema: GenMessage<ListMyInvitesResponse>;
/**
 * Accepts an invite already addressed to the caller. No token: only the hash is
 * stored, so the emailed one cannot be handed back — and matching on an address
 * the caller proved at sign-in is the stronger check anyway.
 *
 * @generated from message tank.workspace.v1.AcceptInviteRequest
 */
export type AcceptInviteRequest = Message<"tank.workspace.v1.AcceptInviteRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.workspace.v1.AcceptInviteRequest.
 * Use `create(AcceptInviteRequestSchema)` to create a new message.
 */
export declare const AcceptInviteRequestSchema: GenMessage<AcceptInviteRequest>;
/**
 * @generated from message tank.workspace.v1.AcceptInviteResponse
 */
export type AcceptInviteResponse = Message<"tank.workspace.v1.AcceptInviteResponse"> & {
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
 * Describes the message tank.workspace.v1.AcceptInviteResponse.
 * Use `create(AcceptInviteResponseSchema)` to create a new message.
 */
export declare const AcceptInviteResponseSchema: GenMessage<AcceptInviteResponse>;
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
 * Unset fields are left unchanged. display_name and avatar are global to the
 * user; title and timezone are per workspace.
 *
 * @generated from message tank.workspace.v1.UpdateProfileRequest
 */
export type UpdateProfileRequest = Message<"tank.workspace.v1.UpdateProfileRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: optional string display_name = 2;
     */
    displayName?: string;
    /**
     * @generated from field: optional string title = 3;
     */
    title?: string;
    /**
     * IANA name
     *
     * @generated from field: optional string timezone = 4;
     */
    timezone?: string;
    /**
     * empty string clears the avatar
     *
     * @generated from field: optional string avatar_file_id = 5;
     */
    avatarFileId?: string;
};
/**
 * Describes the message tank.workspace.v1.UpdateProfileRequest.
 * Use `create(UpdateProfileRequestSchema)` to create a new message.
 */
export declare const UpdateProfileRequestSchema: GenMessage<UpdateProfileRequest>;
/**
 * @generated from message tank.workspace.v1.UpdateProfileResponse
 */
export type UpdateProfileResponse = Message<"tank.workspace.v1.UpdateProfileResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.Member me = 1;
     */
    me?: Member;
};
/**
 * Describes the message tank.workspace.v1.UpdateProfileResponse.
 * Use `create(UpdateProfileResponseSchema)` to create a new message.
 */
export declare const UpdateProfileResponseSchema: GenMessage<UpdateProfileResponse>;
/**
 * Armor Mode (do not disturb) on a schedule, in the user's timezone.
 *
 * @generated from message tank.workspace.v1.ArmorModeSchedule
 */
export type ArmorModeSchedule = Message<"tank.workspace.v1.ArmorModeSchedule"> & {
    /**
     * @generated from field: bool enabled = 1;
     */
    enabled: boolean;
    /**
     * "HH:MM" local time
     *
     * @generated from field: string start = 2;
     */
    start: string;
    /**
     * "HH:MM" local time; earlier than start = overnight
     *
     * @generated from field: string end = 3;
     */
    end: string;
    /**
     * 0 = Sunday .. 6 = Saturday; empty = every day
     *
     * @generated from field: repeated int32 days = 4;
     */
    days: number[];
    /**
     * IANA name; empty = profile timezone
     *
     * @generated from field: string timezone = 5;
     */
    timezone: string;
    /**
     * let critical alerts (agent_needs_input, DMs) through
     *
     * @generated from field: bool allow_critical = 6;
     */
    allowCritical: boolean;
};
/**
 * Describes the message tank.workspace.v1.ArmorModeSchedule.
 * Use `create(ArmorModeScheduleSchema)` to create a new message.
 */
export declare const ArmorModeScheduleSchema: GenMessage<ArmorModeSchedule>;
/**
 * @generated from message tank.workspace.v1.Preferences
 */
export type Preferences = Message<"tank.workspace.v1.Preferences"> & {
    /**
     * channels without their own preference
     *
     * @generated from field: tank.channel.v1.NotifyPref notify_default = 1;
     */
    notifyDefault: NotifyPref;
    /**
     * DMs and group DMs
     *
     * @generated from field: tank.channel.v1.NotifyPref dm_notify_default = 2;
     */
    dmNotifyDefault: NotifyPref;
    /**
     * system | light | dark
     *
     * @generated from field: string theme = 3;
     */
    theme: string;
    /**
     * @generated from field: tank.workspace.v1.ArmorModeSchedule armor_mode_schedule = 4;
     */
    armorModeSchedule?: ArmorModeSchedule;
    /**
     * @generated from field: bool email_digest = 5;
     */
    emailDigest: boolean;
    /**
     * @generated from field: bool desktop_sound = 6;
     */
    desktopSound: boolean;
    /**
     * @generated from field: bool push_on_mention_only = 7;
     */
    pushOnMentionOnly: boolean;
    /**
     * @generated from field: tank.workspace.v1.TopoPreferences topo = 8;
     */
    topo?: TopoPreferences;
};
/**
 * Describes the message tank.workspace.v1.Preferences.
 * Use `create(PreferencesSchema)` to create a new message.
 */
export declare const PreferencesSchema: GenMessage<Preferences>;
/**
 * Which Topo mark families the strip draws for this person.
 *
 * `configured` exists because an empty `visible` has two meanings otherwise —
 * "never chosen" and "turned everything off" — and UpdatePreferences replaces
 * the whole message, so the difference cannot be recovered from the wire.
 *
 * @generated from message tank.workspace.v1.TopoPreferences
 */
export type TopoPreferences = Message<"tank.workspace.v1.TopoPreferences"> & {
    /**
     * @generated from field: bool configured = 1;
     */
    configured: boolean;
    /**
     * @generated from field: repeated tank.topo.v1.MarkType visible = 2;
     */
    visible: MarkType[];
    /**
     * Message-indexed (the default) or time-indexed scaling. R6.
     *
     * @generated from field: bool time_axis = 3;
     */
    timeAxis: boolean;
};
/**
 * Describes the message tank.workspace.v1.TopoPreferences.
 * Use `create(TopoPreferencesSchema)` to create a new message.
 */
export declare const TopoPreferencesSchema: GenMessage<TopoPreferences>;
/**
 * @generated from message tank.workspace.v1.GetPreferencesRequest
 */
export type GetPreferencesRequest = Message<"tank.workspace.v1.GetPreferencesRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.workspace.v1.GetPreferencesRequest.
 * Use `create(GetPreferencesRequestSchema)` to create a new message.
 */
export declare const GetPreferencesRequestSchema: GenMessage<GetPreferencesRequest>;
/**
 * @generated from message tank.workspace.v1.GetPreferencesResponse
 */
export type GetPreferencesResponse = Message<"tank.workspace.v1.GetPreferencesResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.Preferences preferences = 1;
     */
    preferences?: Preferences;
};
/**
 * Describes the message tank.workspace.v1.GetPreferencesResponse.
 * Use `create(GetPreferencesResponseSchema)` to create a new message.
 */
export declare const GetPreferencesResponseSchema: GenMessage<GetPreferencesResponse>;
/**
 * @generated from message tank.workspace.v1.UpdatePreferencesRequest
 */
export type UpdatePreferencesRequest = Message<"tank.workspace.v1.UpdatePreferencesRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * replaces the stored preferences
     *
     * @generated from field: tank.workspace.v1.Preferences preferences = 2;
     */
    preferences?: Preferences;
};
/**
 * Describes the message tank.workspace.v1.UpdatePreferencesRequest.
 * Use `create(UpdatePreferencesRequestSchema)` to create a new message.
 */
export declare const UpdatePreferencesRequestSchema: GenMessage<UpdatePreferencesRequest>;
/**
 * @generated from message tank.workspace.v1.UpdatePreferencesResponse
 */
export type UpdatePreferencesResponse = Message<"tank.workspace.v1.UpdatePreferencesResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.Preferences preferences = 1;
     */
    preferences?: Preferences;
};
/**
 * Describes the message tank.workspace.v1.UpdatePreferencesResponse.
 * Use `create(UpdatePreferencesResponseSchema)` to create a new message.
 */
export declare const UpdatePreferencesResponseSchema: GenMessage<UpdatePreferencesResponse>;
/**
 * The image is a normal uploaded file readable by every workspace member.
 *
 * @generated from message tank.workspace.v1.CustomEmoji
 */
export type CustomEmoji = Message<"tank.workspace.v1.CustomEmoji"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * :name:, unique per workspace
     *
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: string file_id = 4;
     */
    fileId: string;
    /**
     * @generated from field: string created_by = 5;
     */
    createdBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 6;
     */
    createdAt?: Timestamp;
};
/**
 * Describes the message tank.workspace.v1.CustomEmoji.
 * Use `create(CustomEmojiSchema)` to create a new message.
 */
export declare const CustomEmojiSchema: GenMessage<CustomEmoji>;
/**
 * @generated from message tank.workspace.v1.ListEmojiRequest
 */
export type ListEmojiRequest = Message<"tank.workspace.v1.ListEmojiRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.workspace.v1.ListEmojiRequest.
 * Use `create(ListEmojiRequestSchema)` to create a new message.
 */
export declare const ListEmojiRequestSchema: GenMessage<ListEmojiRequest>;
/**
 * @generated from message tank.workspace.v1.ListEmojiResponse
 */
export type ListEmojiResponse = Message<"tank.workspace.v1.ListEmojiResponse"> & {
    /**
     * @generated from field: repeated tank.workspace.v1.CustomEmoji emoji = 1;
     */
    emoji: CustomEmoji[];
    /**
     * matches GetBootstrap.custom_emoji_hash
     *
     * @generated from field: string hash = 2;
     */
    hash: string;
};
/**
 * Describes the message tank.workspace.v1.ListEmojiResponse.
 * Use `create(ListEmojiResponseSchema)` to create a new message.
 */
export declare const ListEmojiResponseSchema: GenMessage<ListEmojiResponse>;
/**
 * @generated from message tank.workspace.v1.CreateEmojiRequest
 */
export type CreateEmojiRequest = Message<"tank.workspace.v1.CreateEmojiRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string file_id = 3;
     */
    fileId: string;
};
/**
 * Describes the message tank.workspace.v1.CreateEmojiRequest.
 * Use `create(CreateEmojiRequestSchema)` to create a new message.
 */
export declare const CreateEmojiRequestSchema: GenMessage<CreateEmojiRequest>;
/**
 * @generated from message tank.workspace.v1.CreateEmojiResponse
 */
export type CreateEmojiResponse = Message<"tank.workspace.v1.CreateEmojiResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.CustomEmoji emoji = 1;
     */
    emoji?: CustomEmoji;
};
/**
 * Describes the message tank.workspace.v1.CreateEmojiResponse.
 * Use `create(CreateEmojiResponseSchema)` to create a new message.
 */
export declare const CreateEmojiResponseSchema: GenMessage<CreateEmojiResponse>;
/**
 * @generated from message tank.workspace.v1.DeleteEmojiRequest
 */
export type DeleteEmojiRequest = Message<"tank.workspace.v1.DeleteEmojiRequest"> & {
    /**
     * @generated from field: string emoji_id = 1;
     */
    emojiId: string;
};
/**
 * Describes the message tank.workspace.v1.DeleteEmojiRequest.
 * Use `create(DeleteEmojiRequestSchema)` to create a new message.
 */
export declare const DeleteEmojiRequestSchema: GenMessage<DeleteEmojiRequest>;
/**
 * @generated from message tank.workspace.v1.DeleteEmojiResponse
 */
export type DeleteEmojiResponse = Message<"tank.workspace.v1.DeleteEmojiResponse"> & {};
/**
 * Describes the message tank.workspace.v1.DeleteEmojiResponse.
 * Use `create(DeleteEmojiResponseSchema)` to create a new message.
 */
export declare const DeleteEmojiResponseSchema: GenMessage<DeleteEmojiResponse>;
/**
 * @handle that expands to its members when mentioned.
 *
 * @generated from message tank.workspace.v1.UserGroup
 */
export type UserGroup = Message<"tank.workspace.v1.UserGroup"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * without the @
     *
     * @generated from field: string handle = 3;
     */
    handle: string;
    /**
     * @generated from field: string name = 4;
     */
    name: string;
    /**
     * @generated from field: string description = 5;
     */
    description: string;
    /**
     * @generated from field: repeated string member_ids = 6;
     */
    memberIds: string[];
    /**
     * @generated from field: string created_by = 7;
     */
    createdBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 8;
     */
    createdAt?: Timestamp;
};
/**
 * Describes the message tank.workspace.v1.UserGroup.
 * Use `create(UserGroupSchema)` to create a new message.
 */
export declare const UserGroupSchema: GenMessage<UserGroup>;
/**
 * @generated from message tank.workspace.v1.ListUserGroupsRequest
 */
export type ListUserGroupsRequest = Message<"tank.workspace.v1.ListUserGroupsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.workspace.v1.ListUserGroupsRequest.
 * Use `create(ListUserGroupsRequestSchema)` to create a new message.
 */
export declare const ListUserGroupsRequestSchema: GenMessage<ListUserGroupsRequest>;
/**
 * @generated from message tank.workspace.v1.ListUserGroupsResponse
 */
export type ListUserGroupsResponse = Message<"tank.workspace.v1.ListUserGroupsResponse"> & {
    /**
     * @generated from field: repeated tank.workspace.v1.UserGroup groups = 1;
     */
    groups: UserGroup[];
};
/**
 * Describes the message tank.workspace.v1.ListUserGroupsResponse.
 * Use `create(ListUserGroupsResponseSchema)` to create a new message.
 */
export declare const ListUserGroupsResponseSchema: GenMessage<ListUserGroupsResponse>;
/**
 * @generated from message tank.workspace.v1.CreateUserGroupRequest
 */
export type CreateUserGroupRequest = Message<"tank.workspace.v1.CreateUserGroupRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string handle = 2;
     */
    handle: string;
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: string description = 4;
     */
    description: string;
    /**
     * @generated from field: repeated string member_ids = 5;
     */
    memberIds: string[];
};
/**
 * Describes the message tank.workspace.v1.CreateUserGroupRequest.
 * Use `create(CreateUserGroupRequestSchema)` to create a new message.
 */
export declare const CreateUserGroupRequestSchema: GenMessage<CreateUserGroupRequest>;
/**
 * @generated from message tank.workspace.v1.CreateUserGroupResponse
 */
export type CreateUserGroupResponse = Message<"tank.workspace.v1.CreateUserGroupResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.UserGroup group = 1;
     */
    group?: UserGroup;
};
/**
 * Describes the message tank.workspace.v1.CreateUserGroupResponse.
 * Use `create(CreateUserGroupResponseSchema)` to create a new message.
 */
export declare const CreateUserGroupResponseSchema: GenMessage<CreateUserGroupResponse>;
/**
 * @generated from message tank.workspace.v1.UpdateUserGroupMembersRequest
 */
export type UpdateUserGroupMembersRequest = Message<"tank.workspace.v1.UpdateUserGroupMembersRequest"> & {
    /**
     * @generated from field: string group_id = 1;
     */
    groupId: string;
    /**
     * replaces the member list
     *
     * @generated from field: repeated string member_ids = 2;
     */
    memberIds: string[];
};
/**
 * Describes the message tank.workspace.v1.UpdateUserGroupMembersRequest.
 * Use `create(UpdateUserGroupMembersRequestSchema)` to create a new message.
 */
export declare const UpdateUserGroupMembersRequestSchema: GenMessage<UpdateUserGroupMembersRequest>;
/**
 * @generated from message tank.workspace.v1.UpdateUserGroupMembersResponse
 */
export type UpdateUserGroupMembersResponse = Message<"tank.workspace.v1.UpdateUserGroupMembersResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.UserGroup group = 1;
     */
    group?: UserGroup;
};
/**
 * Describes the message tank.workspace.v1.UpdateUserGroupMembersResponse.
 * Use `create(UpdateUserGroupMembersResponseSchema)` to create a new message.
 */
export declare const UpdateUserGroupMembersResponseSchema: GenMessage<UpdateUserGroupMembersResponse>;
/**
 * @generated from message tank.workspace.v1.DeleteUserGroupRequest
 */
export type DeleteUserGroupRequest = Message<"tank.workspace.v1.DeleteUserGroupRequest"> & {
    /**
     * @generated from field: string group_id = 1;
     */
    groupId: string;
};
/**
 * Describes the message tank.workspace.v1.DeleteUserGroupRequest.
 * Use `create(DeleteUserGroupRequestSchema)` to create a new message.
 */
export declare const DeleteUserGroupRequestSchema: GenMessage<DeleteUserGroupRequest>;
/**
 * @generated from message tank.workspace.v1.DeleteUserGroupResponse
 */
export type DeleteUserGroupResponse = Message<"tank.workspace.v1.DeleteUserGroupResponse"> & {};
/**
 * Describes the message tank.workspace.v1.DeleteUserGroupResponse.
 * Use `create(DeleteUserGroupResponseSchema)` to create a new message.
 */
export declare const DeleteUserGroupResponseSchema: GenMessage<DeleteUserGroupResponse>;
/**
 * @generated from message tank.workspace.v1.ChannelBookmark
 */
export type ChannelBookmark = Message<"tank.workspace.v1.ChannelBookmark"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * @generated from field: string title = 3;
     */
    title: string;
    /**
     * @generated from field: string url = 4;
     */
    url: string;
    /**
     * @generated from field: string emoji = 5;
     */
    emoji: string;
    /**
     * @generated from field: string created_by = 6;
     */
    createdBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 7;
     */
    createdAt?: Timestamp;
};
/**
 * Describes the message tank.workspace.v1.ChannelBookmark.
 * Use `create(ChannelBookmarkSchema)` to create a new message.
 */
export declare const ChannelBookmarkSchema: GenMessage<ChannelBookmark>;
/**
 * @generated from message tank.workspace.v1.ListBookmarksRequest
 */
export type ListBookmarksRequest = Message<"tank.workspace.v1.ListBookmarksRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
};
/**
 * Describes the message tank.workspace.v1.ListBookmarksRequest.
 * Use `create(ListBookmarksRequestSchema)` to create a new message.
 */
export declare const ListBookmarksRequestSchema: GenMessage<ListBookmarksRequest>;
/**
 * @generated from message tank.workspace.v1.ListBookmarksResponse
 */
export type ListBookmarksResponse = Message<"tank.workspace.v1.ListBookmarksResponse"> & {
    /**
     * @generated from field: repeated tank.workspace.v1.ChannelBookmark bookmarks = 1;
     */
    bookmarks: ChannelBookmark[];
};
/**
 * Describes the message tank.workspace.v1.ListBookmarksResponse.
 * Use `create(ListBookmarksResponseSchema)` to create a new message.
 */
export declare const ListBookmarksResponseSchema: GenMessage<ListBookmarksResponse>;
/**
 * @generated from message tank.workspace.v1.AddBookmarkRequest
 */
export type AddBookmarkRequest = Message<"tank.workspace.v1.AddBookmarkRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: string title = 2;
     */
    title: string;
    /**
     * @generated from field: string url = 3;
     */
    url: string;
    /**
     * @generated from field: string emoji = 4;
     */
    emoji: string;
};
/**
 * Describes the message tank.workspace.v1.AddBookmarkRequest.
 * Use `create(AddBookmarkRequestSchema)` to create a new message.
 */
export declare const AddBookmarkRequestSchema: GenMessage<AddBookmarkRequest>;
/**
 * @generated from message tank.workspace.v1.AddBookmarkResponse
 */
export type AddBookmarkResponse = Message<"tank.workspace.v1.AddBookmarkResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.ChannelBookmark bookmark = 1;
     */
    bookmark?: ChannelBookmark;
};
/**
 * Describes the message tank.workspace.v1.AddBookmarkResponse.
 * Use `create(AddBookmarkResponseSchema)` to create a new message.
 */
export declare const AddBookmarkResponseSchema: GenMessage<AddBookmarkResponse>;
/**
 * @generated from message tank.workspace.v1.RemoveBookmarkRequest
 */
export type RemoveBookmarkRequest = Message<"tank.workspace.v1.RemoveBookmarkRequest"> & {
    /**
     * @generated from field: string bookmark_id = 1;
     */
    bookmarkId: string;
};
/**
 * Describes the message tank.workspace.v1.RemoveBookmarkRequest.
 * Use `create(RemoveBookmarkRequestSchema)` to create a new message.
 */
export declare const RemoveBookmarkRequestSchema: GenMessage<RemoveBookmarkRequest>;
/**
 * @generated from message tank.workspace.v1.RemoveBookmarkResponse
 */
export type RemoveBookmarkResponse = Message<"tank.workspace.v1.RemoveBookmarkResponse"> & {};
/**
 * Describes the message tank.workspace.v1.RemoveBookmarkResponse.
 * Use `create(RemoveBookmarkResponseSchema)` to create a new message.
 */
export declare const RemoveBookmarkResponseSchema: GenMessage<RemoveBookmarkResponse>;
/**
 * One draft per (user, channel) or (user, thread). Private to the user.
 *
 * @generated from message tank.workspace.v1.Draft
 */
export type Draft = Message<"tank.workspace.v1.Draft"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * empty for the channel composer
     *
     * @generated from field: string thread_root_id = 2;
     */
    threadRootId: string;
    /**
     * @generated from field: tank.richtext.v1.RichText rich_text = 3;
     */
    richText?: RichText;
    /**
     * @generated from field: string text = 4;
     */
    text: string;
    /**
     * @generated from field: repeated string file_ids = 5;
     */
    fileIds: string[];
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 6;
     */
    updatedAt?: Timestamp;
};
/**
 * Describes the message tank.workspace.v1.Draft.
 * Use `create(DraftSchema)` to create a new message.
 */
export declare const DraftSchema: GenMessage<Draft>;
/**
 * @generated from message tank.workspace.v1.GetDraftRequest
 */
export type GetDraftRequest = Message<"tank.workspace.v1.GetDraftRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: string thread_root_id = 2;
     */
    threadRootId: string;
};
/**
 * Describes the message tank.workspace.v1.GetDraftRequest.
 * Use `create(GetDraftRequestSchema)` to create a new message.
 */
export declare const GetDraftRequestSchema: GenMessage<GetDraftRequest>;
/**
 * @generated from message tank.workspace.v1.GetDraftResponse
 */
export type GetDraftResponse = Message<"tank.workspace.v1.GetDraftResponse"> & {
    /**
     * unset when there is no draft
     *
     * @generated from field: tank.workspace.v1.Draft draft = 1;
     */
    draft?: Draft;
};
/**
 * Describes the message tank.workspace.v1.GetDraftResponse.
 * Use `create(GetDraftResponseSchema)` to create a new message.
 */
export declare const GetDraftResponseSchema: GenMessage<GetDraftResponse>;
/**
 * @generated from message tank.workspace.v1.PutDraftRequest
 */
export type PutDraftRequest = Message<"tank.workspace.v1.PutDraftRequest"> & {
    /**
     * @generated from field: tank.workspace.v1.Draft draft = 1;
     */
    draft?: Draft;
};
/**
 * Describes the message tank.workspace.v1.PutDraftRequest.
 * Use `create(PutDraftRequestSchema)` to create a new message.
 */
export declare const PutDraftRequestSchema: GenMessage<PutDraftRequest>;
/**
 * @generated from message tank.workspace.v1.PutDraftResponse
 */
export type PutDraftResponse = Message<"tank.workspace.v1.PutDraftResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.Draft draft = 1;
     */
    draft?: Draft;
};
/**
 * Describes the message tank.workspace.v1.PutDraftResponse.
 * Use `create(PutDraftResponseSchema)` to create a new message.
 */
export declare const PutDraftResponseSchema: GenMessage<PutDraftResponse>;
/**
 * @generated from message tank.workspace.v1.DeleteDraftRequest
 */
export type DeleteDraftRequest = Message<"tank.workspace.v1.DeleteDraftRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: string thread_root_id = 2;
     */
    threadRootId: string;
};
/**
 * Describes the message tank.workspace.v1.DeleteDraftRequest.
 * Use `create(DeleteDraftRequestSchema)` to create a new message.
 */
export declare const DeleteDraftRequestSchema: GenMessage<DeleteDraftRequest>;
/**
 * @generated from message tank.workspace.v1.DeleteDraftResponse
 */
export type DeleteDraftResponse = Message<"tank.workspace.v1.DeleteDraftResponse"> & {};
/**
 * Describes the message tank.workspace.v1.DeleteDraftResponse.
 * Use `create(DeleteDraftResponseSchema)` to create a new message.
 */
export declare const DeleteDraftResponseSchema: GenMessage<DeleteDraftResponse>;
/**
 * @generated from message tank.workspace.v1.ListDraftsRequest
 */
export type ListDraftsRequest = Message<"tank.workspace.v1.ListDraftsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.workspace.v1.ListDraftsRequest.
 * Use `create(ListDraftsRequestSchema)` to create a new message.
 */
export declare const ListDraftsRequestSchema: GenMessage<ListDraftsRequest>;
/**
 * @generated from message tank.workspace.v1.ListDraftsResponse
 */
export type ListDraftsResponse = Message<"tank.workspace.v1.ListDraftsResponse"> & {
    /**
     * @generated from field: repeated tank.workspace.v1.Draft drafts = 1;
     */
    drafts: Draft[];
};
/**
 * Describes the message tank.workspace.v1.ListDraftsResponse.
 * Use `create(ListDraftsResponseSchema)` to create a new message.
 */
export declare const ListDraftsResponseSchema: GenMessage<ListDraftsResponse>;
/**
 * @generated from message tank.workspace.v1.ScheduledMessage
 */
export type ScheduledMessage = Message<"tank.workspace.v1.ScheduledMessage"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * @generated from field: string channel_id = 3;
     */
    channelId: string;
    /**
     * @generated from field: string thread_root_id = 4;
     */
    threadRootId: string;
    /**
     * @generated from field: string text = 5;
     */
    text: string;
    /**
     * @generated from field: tank.richtext.v1.RichText rich_text = 6;
     */
    richText?: RichText;
    /**
     * @generated from field: repeated string file_ids = 7;
     */
    fileIds: string[];
    /**
     * @generated from field: google.protobuf.Timestamp send_at = 8;
     */
    sendAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 9;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp sent_at = 10;
     */
    sentAt?: Timestamp;
    /**
     * @generated from field: string sent_message_id = 11;
     */
    sentMessageId: string;
    /**
     * set when sending failed (archived channel, left channel, ...)
     *
     * @generated from field: string error = 12;
     */
    error: string;
    /**
     * Calm send: waits for this much quiet in the channel after send_at, never past no_later_than.
     *
     * @generated from field: int32 quiet_for_seconds = 13;
     */
    quietForSeconds: number;
    /**
     * @generated from field: google.protobuf.Timestamp no_later_than = 14;
     */
    noLaterThan?: Timestamp;
};
/**
 * Describes the message tank.workspace.v1.ScheduledMessage.
 * Use `create(ScheduledMessageSchema)` to create a new message.
 */
export declare const ScheduledMessageSchema: GenMessage<ScheduledMessage>;
/**
 * @generated from message tank.workspace.v1.ScheduleMessageRequest
 */
export type ScheduleMessageRequest = Message<"tank.workspace.v1.ScheduleMessageRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: string thread_root_id = 2;
     */
    threadRootId: string;
    /**
     * @generated from field: string text = 3;
     */
    text: string;
    /**
     * @generated from field: tank.richtext.v1.RichText rich_text = 4;
     */
    richText?: RichText;
    /**
     * @generated from field: repeated string file_ids = 5;
     */
    fileIds: string[];
    /**
     * When to send. With quiet_for_seconds set this is the earliest moment and
     * may be omitted (now); otherwise it is the moment itself.
     *
     * @generated from field: google.protobuf.Timestamp send_at = 6;
     */
    sendAt?: Timestamp;
    /**
     * Send when things are calm: once the channel has had no new message for
     * this long (and send_at has passed). 0 = send at send_at exactly.
     *
     * @generated from field: int32 quiet_for_seconds = 7;
     */
    quietForSeconds: number;
    /**
     * The latest moment a calm send waits for; it goes out then regardless.
     * Defaults to 24 hours after send_at.
     *
     * @generated from field: google.protobuf.Timestamp no_later_than = 8;
     */
    noLaterThan?: Timestamp;
};
/**
 * Describes the message tank.workspace.v1.ScheduleMessageRequest.
 * Use `create(ScheduleMessageRequestSchema)` to create a new message.
 */
export declare const ScheduleMessageRequestSchema: GenMessage<ScheduleMessageRequest>;
/**
 * @generated from message tank.workspace.v1.ScheduleMessageResponse
 */
export type ScheduleMessageResponse = Message<"tank.workspace.v1.ScheduleMessageResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.ScheduledMessage scheduled = 1;
     */
    scheduled?: ScheduledMessage;
};
/**
 * Describes the message tank.workspace.v1.ScheduleMessageResponse.
 * Use `create(ScheduleMessageResponseSchema)` to create a new message.
 */
export declare const ScheduleMessageResponseSchema: GenMessage<ScheduleMessageResponse>;
/**
 * @generated from message tank.workspace.v1.ListScheduledRequest
 */
export type ListScheduledRequest = Message<"tank.workspace.v1.ListScheduledRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.workspace.v1.ListScheduledRequest.
 * Use `create(ListScheduledRequestSchema)` to create a new message.
 */
export declare const ListScheduledRequestSchema: GenMessage<ListScheduledRequest>;
/**
 * @generated from message tank.workspace.v1.ListScheduledResponse
 */
export type ListScheduledResponse = Message<"tank.workspace.v1.ListScheduledResponse"> & {
    /**
     * pending only, soonest first
     *
     * @generated from field: repeated tank.workspace.v1.ScheduledMessage scheduled = 1;
     */
    scheduled: ScheduledMessage[];
};
/**
 * Describes the message tank.workspace.v1.ListScheduledResponse.
 * Use `create(ListScheduledResponseSchema)` to create a new message.
 */
export declare const ListScheduledResponseSchema: GenMessage<ListScheduledResponse>;
/**
 * @generated from message tank.workspace.v1.CancelScheduledRequest
 */
export type CancelScheduledRequest = Message<"tank.workspace.v1.CancelScheduledRequest"> & {
    /**
     * @generated from field: string scheduled_id = 1;
     */
    scheduledId: string;
};
/**
 * Describes the message tank.workspace.v1.CancelScheduledRequest.
 * Use `create(CancelScheduledRequestSchema)` to create a new message.
 */
export declare const CancelScheduledRequestSchema: GenMessage<CancelScheduledRequest>;
/**
 * @generated from message tank.workspace.v1.CancelScheduledResponse
 */
export type CancelScheduledResponse = Message<"tank.workspace.v1.CancelScheduledResponse"> & {};
/**
 * Describes the message tank.workspace.v1.CancelScheduledResponse.
 * Use `create(CancelScheduledResponseSchema)` to create a new message.
 */
export declare const CancelScheduledResponseSchema: GenMessage<CancelScheduledResponse>;
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
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.ListInvites
     */
    listInvites: {
        methodKind: "unary";
        input: typeof ListInvitesRequestSchema;
        output: typeof ListInvitesResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.ListMyInvites
     */
    listMyInvites: {
        methodKind: "unary";
        input: typeof ListMyInvitesRequestSchema;
        output: typeof ListMyInvitesResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.AcceptInvite
     */
    acceptInvite: {
        methodKind: "unary";
        input: typeof AcceptInviteRequestSchema;
        output: typeof AcceptInviteResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.RevokeInvite
     */
    revokeInvite: {
        methodKind: "unary";
        input: typeof RevokeInviteRequestSchema;
        output: typeof RevokeInviteResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.UpdateProfile
     */
    updateProfile: {
        methodKind: "unary";
        input: typeof UpdateProfileRequestSchema;
        output: typeof UpdateProfileResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.GetPreferences
     */
    getPreferences: {
        methodKind: "unary";
        input: typeof GetPreferencesRequestSchema;
        output: typeof GetPreferencesResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.UpdatePreferences
     */
    updatePreferences: {
        methodKind: "unary";
        input: typeof UpdatePreferencesRequestSchema;
        output: typeof UpdatePreferencesResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.ListEmoji
     */
    listEmoji: {
        methodKind: "unary";
        input: typeof ListEmojiRequestSchema;
        output: typeof ListEmojiResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.CreateEmoji
     */
    createEmoji: {
        methodKind: "unary";
        input: typeof CreateEmojiRequestSchema;
        output: typeof CreateEmojiResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.DeleteEmoji
     */
    deleteEmoji: {
        methodKind: "unary";
        input: typeof DeleteEmojiRequestSchema;
        output: typeof DeleteEmojiResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.ListUserGroups
     */
    listUserGroups: {
        methodKind: "unary";
        input: typeof ListUserGroupsRequestSchema;
        output: typeof ListUserGroupsResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.CreateUserGroup
     */
    createUserGroup: {
        methodKind: "unary";
        input: typeof CreateUserGroupRequestSchema;
        output: typeof CreateUserGroupResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.UpdateUserGroupMembers
     */
    updateUserGroupMembers: {
        methodKind: "unary";
        input: typeof UpdateUserGroupMembersRequestSchema;
        output: typeof UpdateUserGroupMembersResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.DeleteUserGroup
     */
    deleteUserGroup: {
        methodKind: "unary";
        input: typeof DeleteUserGroupRequestSchema;
        output: typeof DeleteUserGroupResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.ListBookmarks
     */
    listBookmarks: {
        methodKind: "unary";
        input: typeof ListBookmarksRequestSchema;
        output: typeof ListBookmarksResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.AddBookmark
     */
    addBookmark: {
        methodKind: "unary";
        input: typeof AddBookmarkRequestSchema;
        output: typeof AddBookmarkResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.RemoveBookmark
     */
    removeBookmark: {
        methodKind: "unary";
        input: typeof RemoveBookmarkRequestSchema;
        output: typeof RemoveBookmarkResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.GetDraft
     */
    getDraft: {
        methodKind: "unary";
        input: typeof GetDraftRequestSchema;
        output: typeof GetDraftResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.PutDraft
     */
    putDraft: {
        methodKind: "unary";
        input: typeof PutDraftRequestSchema;
        output: typeof PutDraftResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.DeleteDraft
     */
    deleteDraft: {
        methodKind: "unary";
        input: typeof DeleteDraftRequestSchema;
        output: typeof DeleteDraftResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.ListDrafts
     */
    listDrafts: {
        methodKind: "unary";
        input: typeof ListDraftsRequestSchema;
        output: typeof ListDraftsResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.ScheduleMessage
     */
    scheduleMessage: {
        methodKind: "unary";
        input: typeof ScheduleMessageRequestSchema;
        output: typeof ScheduleMessageResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.ListScheduled
     */
    listScheduled: {
        methodKind: "unary";
        input: typeof ListScheduledRequestSchema;
        output: typeof ListScheduledResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.CancelScheduled
     */
    cancelScheduled: {
        methodKind: "unary";
        input: typeof CancelScheduledRequestSchema;
        output: typeof CancelScheduledResponseSchema;
    };
}>;
