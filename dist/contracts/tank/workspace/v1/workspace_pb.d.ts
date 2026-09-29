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
    /**
     * The workspace's look, set by an admin from a description. Unset means TANK's own.
     *
     * @generated from field: tank.workspace.v1.Theme theme = 6;
     */
    theme?: Theme;
    /**
     * A generated or uploaded picture for the workspace; empty means the TANK mark.
     *
     * @generated from field: string icon_file_id = 7;
     */
    iconFileId: string;
};
/**
 * Describes the message tank.workspace.v1.Workspace.
 * Use `create(WorkspaceSchema)` to create a new message.
 */
export declare const WorkspaceSchema: GenMessage<Workspace>;
/**
 * A colour theme made from a few words. Every colour is a #rrggbb hex; the
 * server checks contrast before it hands one out, so clients apply it as is.
 *
 * @generated from message tank.workspace.v1.Theme
 */
export type Theme = Message<"tank.workspace.v1.Theme"> & {
    /**
     * What the person typed, so it can be shown back and refined.
     *
     * @generated from field: string description = 1;
     */
    description: string;
    /**
     * A short name the model gave it: "Midnight glacier".
     *
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * "dark" or "light": which base the colours sit on.
     *
     * @generated from field: string scheme = 3;
     */
    scheme: string;
    /**
     * @generated from field: string primary = 4;
     */
    primary: string;
    /**
     * @generated from field: string secondary = 5;
     */
    secondary: string;
    /**
     * @generated from field: string background = 6;
     */
    background: string;
    /**
     * @generated from field: string surface = 7;
     */
    surface: string;
    /**
     * @generated from field: string on_surface = 8;
     */
    onSurface: string;
    /**
     * @generated from field: string accent = 9;
     */
    accent: string;
};
/**
 * Describes the message tank.workspace.v1.Theme.
 * Use `create(ThemeSchema)` to create a new message.
 */
export declare const ThemeSchema: GenMessage<Theme>;
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
    /**
     * Scheduling around people and quiet (send when calm, when they are here,
     * nudge unless answered) is premium; plain "send at a time" is free.
     *
     * @generated from field: bool conditional_sends = 9;
     */
    conditionalSends: boolean;
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
    /**
     * A theme made from a description, for this person; wins over the workspace's. Unset means none.
     *
     * @generated from field: tank.workspace.v1.Theme custom_theme = 9;
     */
    customTheme?: Theme;
    /**
     * How Home is arranged, set from a sentence; unset means TANK's order.
     *
     * @generated from field: tank.workspace.v1.HomeLayout home = 10;
     */
    home?: HomeLayout;
    /**
     * One sentence that styles the "while you were away" narrative ("like a naval log"). Empty means TANK's voice.
     *
     * @generated from field: string digest_voice = 11;
     */
    digestVoice: string;
    /**
     * Which notification sounds play; unset means TANK's own set.
     *
     * @generated from field: tank.workspace.v1.SoundChoice sounds = 12;
     */
    sounds?: SoundChoice;
};
/**
 * Describes the message tank.workspace.v1.Preferences.
 * Use `create(PreferencesSchema)` to create a new message.
 */
export declare const PreferencesSchema: GenMessage<Preferences>;
/**
 * A notification sound set, chosen from TANK's packs by a vibe. Each field names
 * a sound id the clients ship ("arcade-mention"); empty means silent for that event.
 *
 * @generated from message tank.workspace.v1.SoundChoice
 */
export type SoundChoice = Message<"tank.workspace.v1.SoundChoice"> & {
    /**
     * the pack the sounds come from
     *
     * @generated from field: string pack = 1;
     */
    pack: string;
    /**
     * @mentions and DMs addressed to me
     *
     * @generated from field: string mention = 2;
     */
    mention: string;
    /**
     * direct messages
     *
     * @generated from field: string dm = 3;
     */
    dm: string;
    /**
     * an agent finished or needs me
     *
     * @generated from field: string agent = 4;
     */
    agent: string;
    /**
     * the vibe it was picked from
     *
     * @generated from field: string description = 5;
     */
    description: string;
};
/**
 * Describes the message tank.workspace.v1.SoundChoice.
 * Use `create(SoundChoiceSchema)` to create a new message.
 */
export declare const SoundChoiceSchema: GenMessage<SoundChoice>;
/**
 * The order Home shows its sections in, and which are hidden. Section keys:
 * "online", "moved", "waiting", "agents", "threads", "download".
 *
 * @generated from message tank.workspace.v1.HomeLayout
 */
export type HomeLayout = Message<"tank.workspace.v1.HomeLayout"> & {
    /**
     * @generated from field: repeated string order = 1;
     */
    order: string[];
    /**
     * @generated from field: repeated string hidden = 2;
     */
    hidden: string[];
    /**
     * @generated from field: string description = 3;
     */
    description: string;
};
/**
 * Describes the message tank.workspace.v1.HomeLayout.
 * Use `create(HomeLayoutSchema)` to create a new message.
 */
export declare const HomeLayoutSchema: GenMessage<HomeLayout>;
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
    /**
     * @generated from field: repeated string wait_for_user_ids = 15;
     */
    waitForUserIds: string[];
    /**
     * @generated from field: string unless_replied_to_message_id = 16;
     */
    unlessRepliedToMessageId: string;
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
     * The latest moment a conditional send (calm, or waiting for people) waits
     * for; it goes out then regardless. Defaults to 24 hours after send_at.
     *
     * @generated from field: google.protobuf.Timestamp no_later_than = 8;
     */
    noLaterThan?: Timestamp;
    /**
     * Send when they are here: once every one of these people is active (after
     * send_at, no later than no_later_than). Members of the workspace.
     *
     * @generated from field: repeated string wait_for_user_ids = 9;
     */
    waitForUserIds: string[];
    /**
     * A nudge with a fuse: skip the send if this message has been replied to by
     * someone other than its author before the send is due.
     *
     * @generated from field: string unless_replied_to_message_id = 10;
     */
    unlessRepliedToMessageId: string;
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
 * An agenture is a business TANK stood up and runs itself. Somebody claims one and it
 * becomes their venture, and it leaves the board — agentures are unique.
 *
 * @generated from message tank.workspace.v1.Agenture
 */
export type Agenture = Message<"tank.workspace.v1.Agenture"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string slug = 2;
     */
    slug: string;
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * its #general purpose: what the business does
     *
     * @generated from field: string description = 4;
     */
    description: string;
    /**
     * an agent is working in it right now
     *
     * @generated from field: bool agent_active = 5;
     */
    agentActive: boolean;
    /**
     * @generated from field: int32 active_runs = 6;
     */
    activeRuns: number;
    /**
     * the trade it is in, so a bubble says more than a name
     *
     * @generated from field: string industry = 7;
     */
    industry: string;
    /**
     * what it costs to take over today
     *
     * @generated from field: int64 price_cents = 8;
     */
    priceCents: bigint;
};
/**
 * Describes the message tank.workspace.v1.Agenture.
 * Use `create(AgentureSchema)` to create a new message.
 */
export declare const AgentureSchema: GenMessage<Agenture>;
/**
 * @generated from message tank.workspace.v1.ListAgenturesRequest
 */
export type ListAgenturesRequest = Message<"tank.workspace.v1.ListAgenturesRequest"> & {
    /**
     * Paging, because this grows to thousands. Empty cursor starts at the beginning.
     *
     * @generated from field: string cursor = 1;
     */
    cursor: string;
    /**
     * @generated from field: int32 limit = 2;
     */
    limit: number;
};
/**
 * Describes the message tank.workspace.v1.ListAgenturesRequest.
 * Use `create(ListAgenturesRequestSchema)` to create a new message.
 */
export declare const ListAgenturesRequestSchema: GenMessage<ListAgenturesRequest>;
/**
 * @generated from message tank.workspace.v1.ListAgenturesResponse
 */
export type ListAgenturesResponse = Message<"tank.workspace.v1.ListAgenturesResponse"> & {
    /**
     * @generated from field: repeated tank.workspace.v1.Agenture agentures = 1;
     */
    agentures: Agenture[];
    /**
     * @generated from field: string next_cursor = 2;
     */
    nextCursor: string;
    /**
     * @generated from field: int32 total = 3;
     */
    total: number;
};
/**
 * Describes the message tank.workspace.v1.ListAgenturesResponse.
 * Use `create(ListAgenturesResponseSchema)` to create a new message.
 */
export declare const ListAgenturesResponseSchema: GenMessage<ListAgenturesResponse>;
/**
 * Which workspaces have an agent working right now. Small and cheap on purpose: the
 * board polls it, the list of agentures itself does not change often.
 *
 * @generated from message tank.workspace.v1.AgentActivityRequest
 */
export type AgentActivityRequest = Message<"tank.workspace.v1.AgentActivityRequest"> & {};
/**
 * Describes the message tank.workspace.v1.AgentActivityRequest.
 * Use `create(AgentActivityRequestSchema)` to create a new message.
 */
export declare const AgentActivityRequestSchema: GenMessage<AgentActivityRequest>;
/**
 * @generated from message tank.workspace.v1.AgentActivityResponse
 */
export type AgentActivityResponse = Message<"tank.workspace.v1.AgentActivityResponse"> & {
    /**
     * workspaces with at least one live run
     *
     * @generated from field: repeated string workspace_ids = 1;
     */
    workspaceIds: string[];
};
/**
 * Describes the message tank.workspace.v1.AgentActivityResponse.
 * Use `create(AgentActivityResponseSchema)` to create a new message.
 */
export declare const AgentActivityResponseSchema: GenMessage<AgentActivityResponse>;
/**
 * AgentureWork is one piece of work the agent has done, or is doing now.
 *
 * @generated from message tank.workspace.v1.AgentureWork
 */
export type AgentureWork = Message<"tank.workspace.v1.AgentureWork"> & {
    /**
     * "Sketch the data model"
     *
     * @generated from field: string title = 1;
     */
    title: string;
    /**
     * a line of what it produced
     *
     * @generated from field: string summary = 2;
     */
    summary: string;
    /**
     * @generated from field: google.protobuf.Timestamp asked_at = 3;
     */
    askedAt?: Timestamp;
    /**
     * unset while it is still working
     *
     * @generated from field: google.protobuf.Timestamp delivered_at = 4;
     */
    deliveredAt?: Timestamp;
};
/**
 * Describes the message tank.workspace.v1.AgentureWork.
 * Use `create(AgentureWorkSchema)` to create a new message.
 */
export declare const AgentureWorkSchema: GenMessage<AgentureWork>;
/**
 * AgentureDetail is everything the claim page shows: what the product is, what
 * trade it is in, what the agent has built, and what it costs today.
 *
 * @generated from message tank.workspace.v1.AgentureDetail
 */
export type AgentureDetail = Message<"tank.workspace.v1.AgentureDetail"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string slug = 2;
     */
    slug: string;
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: string description = 4;
     */
    description: string;
    /**
     * @generated from field: string industry = 5;
     */
    industry: string;
    /**
     * who it is for
     *
     * @generated from field: string buyer = 6;
     */
    buyer: string;
    /**
     * @generated from field: int64 agent_minutes = 7;
     */
    agentMinutes: bigint;
    /**
     * @generated from field: int64 price_cents = 8;
     */
    priceCents: bigint;
    /**
     * @generated from field: bool available = 9;
     */
    available: boolean;
    /**
     * newest first
     *
     * @generated from field: repeated tank.workspace.v1.AgentureWork work = 10;
     */
    work: AgentureWork[];
};
/**
 * Describes the message tank.workspace.v1.AgentureDetail.
 * Use `create(AgentureDetailSchema)` to create a new message.
 */
export declare const AgentureDetailSchema: GenMessage<AgentureDetail>;
/**
 * @generated from message tank.workspace.v1.GetAgentureRequest
 */
export type GetAgentureRequest = Message<"tank.workspace.v1.GetAgentureRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
};
/**
 * Describes the message tank.workspace.v1.GetAgentureRequest.
 * Use `create(GetAgentureRequestSchema)` to create a new message.
 */
export declare const GetAgentureRequestSchema: GenMessage<GetAgentureRequest>;
/**
 * @generated from message tank.workspace.v1.GetAgentureResponse
 */
export type GetAgentureResponse = Message<"tank.workspace.v1.GetAgentureResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.AgentureDetail agenture = 1;
     */
    agenture?: AgentureDetail;
};
/**
 * Describes the message tank.workspace.v1.GetAgentureResponse.
 * Use `create(GetAgentureResponseSchema)` to create a new message.
 */
export declare const GetAgentureResponseSchema: GenMessage<GetAgentureResponse>;
/**
 * @generated from message tank.workspace.v1.ClaimAgentureRequest
 */
export type ClaimAgentureRequest = Message<"tank.workspace.v1.ClaimAgentureRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * Or name it by slug, which is what a claim link off the marketing site carries.
     *
     * @generated from field: string slug = 2;
     */
    slug: string;
};
/**
 * Describes the message tank.workspace.v1.ClaimAgentureRequest.
 * Use `create(ClaimAgentureRequestSchema)` to create a new message.
 */
export declare const ClaimAgentureRequestSchema: GenMessage<ClaimAgentureRequest>;
/**
 * @generated from message tank.workspace.v1.ClaimAgentureResponse
 */
export type ClaimAgentureResponse = Message<"tank.workspace.v1.ClaimAgentureResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.Workspace workspace = 1;
     */
    workspace?: Workspace;
};
/**
 * Describes the message tank.workspace.v1.ClaimAgentureResponse.
 * Use `create(ClaimAgentureResponseSchema)` to create a new message.
 */
export declare const ClaimAgentureResponseSchema: GenMessage<ClaimAgentureResponse>;
/**
 * @generated from message tank.workspace.v1.GenerateThemeRequest
 */
export type GenerateThemeRequest = Message<"tank.workspace.v1.GenerateThemeRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string description = 2;
     */
    description: string;
};
/**
 * Describes the message tank.workspace.v1.GenerateThemeRequest.
 * Use `create(GenerateThemeRequestSchema)` to create a new message.
 */
export declare const GenerateThemeRequestSchema: GenMessage<GenerateThemeRequest>;
/**
 * @generated from message tank.workspace.v1.GenerateThemeResponse
 */
export type GenerateThemeResponse = Message<"tank.workspace.v1.GenerateThemeResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.Theme theme = 1;
     */
    theme?: Theme;
};
/**
 * Describes the message tank.workspace.v1.GenerateThemeResponse.
 * Use `create(GenerateThemeResponseSchema)` to create a new message.
 */
export declare const GenerateThemeResponseSchema: GenMessage<GenerateThemeResponse>;
/**
 * @generated from message tank.workspace.v1.SetWorkspaceThemeRequest
 */
export type SetWorkspaceThemeRequest = Message<"tank.workspace.v1.SetWorkspaceThemeRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * Unset clears the workspace theme.
     *
     * @generated from field: tank.workspace.v1.Theme theme = 2;
     */
    theme?: Theme;
};
/**
 * Describes the message tank.workspace.v1.SetWorkspaceThemeRequest.
 * Use `create(SetWorkspaceThemeRequestSchema)` to create a new message.
 */
export declare const SetWorkspaceThemeRequestSchema: GenMessage<SetWorkspaceThemeRequest>;
/**
 * @generated from message tank.workspace.v1.SetWorkspaceThemeResponse
 */
export type SetWorkspaceThemeResponse = Message<"tank.workspace.v1.SetWorkspaceThemeResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.Workspace workspace = 1;
     */
    workspace?: Workspace;
};
/**
 * Describes the message tank.workspace.v1.SetWorkspaceThemeResponse.
 * Use `create(SetWorkspaceThemeResponseSchema)` to create a new message.
 */
export declare const SetWorkspaceThemeResponseSchema: GenMessage<SetWorkspaceThemeResponse>;
/**
 * "A copper gear with a lightning bolt" → a small SVG, stored as a file the caller owns.
 *
 * @generated from message tank.workspace.v1.GenerateArtRequest
 */
export type GenerateArtRequest = Message<"tank.workspace.v1.GenerateArtRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: tank.workspace.v1.ArtKind kind = 2;
     */
    kind: ArtKind;
    /**
     * at most 15 words
     *
     * @generated from field: string description = 3;
     */
    description: string;
};
/**
 * Describes the message tank.workspace.v1.GenerateArtRequest.
 * Use `create(GenerateArtRequestSchema)` to create a new message.
 */
export declare const GenerateArtRequestSchema: GenMessage<GenerateArtRequest>;
/**
 * @generated from message tank.workspace.v1.GenerateArtResponse
 */
export type GenerateArtResponse = Message<"tank.workspace.v1.GenerateArtResponse"> & {
    /**
     * The stored picture; pass its id to SetWorkspaceIcon, SetChannelIcon or CreateEmoji.
     *
     * @generated from field: string file_id = 1;
     */
    fileId: string;
    /**
     * The sanitised SVG, for an instant preview.
     *
     * @generated from field: string svg = 2;
     */
    svg: string;
};
/**
 * Describes the message tank.workspace.v1.GenerateArtResponse.
 * Use `create(GenerateArtResponseSchema)` to create a new message.
 */
export declare const GenerateArtResponseSchema: GenMessage<GenerateArtResponse>;
/**
 * Admins only: the workspace icon, or a reset when file_id is empty.
 *
 * @generated from message tank.workspace.v1.SetWorkspaceIconRequest
 */
export type SetWorkspaceIconRequest = Message<"tank.workspace.v1.SetWorkspaceIconRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string file_id = 2;
     */
    fileId: string;
};
/**
 * Describes the message tank.workspace.v1.SetWorkspaceIconRequest.
 * Use `create(SetWorkspaceIconRequestSchema)` to create a new message.
 */
export declare const SetWorkspaceIconRequestSchema: GenMessage<SetWorkspaceIconRequest>;
/**
 * @generated from message tank.workspace.v1.SetWorkspaceIconResponse
 */
export type SetWorkspaceIconResponse = Message<"tank.workspace.v1.SetWorkspaceIconResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.Workspace workspace = 1;
     */
    workspace?: Workspace;
};
/**
 * Describes the message tank.workspace.v1.SetWorkspaceIconResponse.
 * Use `create(SetWorkspaceIconResponseSchema)` to create a new message.
 */
export declare const SetWorkspaceIconResponseSchema: GenMessage<SetWorkspaceIconResponse>;
/**
 * "Agents first, then treads I own, hide people" → a HomeLayout to review; nothing is saved.
 *
 * @generated from message tank.workspace.v1.DescribeHomeLayoutRequest
 */
export type DescribeHomeLayoutRequest = Message<"tank.workspace.v1.DescribeHomeLayoutRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * at most 15 words
     *
     * @generated from field: string description = 2;
     */
    description: string;
};
/**
 * Describes the message tank.workspace.v1.DescribeHomeLayoutRequest.
 * Use `create(DescribeHomeLayoutRequestSchema)` to create a new message.
 */
export declare const DescribeHomeLayoutRequestSchema: GenMessage<DescribeHomeLayoutRequest>;
/**
 * @generated from message tank.workspace.v1.DescribeHomeLayoutResponse
 */
export type DescribeHomeLayoutResponse = Message<"tank.workspace.v1.DescribeHomeLayoutResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.HomeLayout home = 1;
     */
    home?: HomeLayout;
};
/**
 * Describes the message tank.workspace.v1.DescribeHomeLayoutResponse.
 * Use `create(DescribeHomeLayoutResponseSchema)` to create a new message.
 */
export declare const DescribeHomeLayoutResponseSchema: GenMessage<DescribeHomeLayoutResponse>;
/**
 * Rewrite a draft in the composer: "terser", "friendlier", "as a bulleted decision".
 *
 * @generated from message tank.workspace.v1.RewriteTextRequest
 */
export type RewriteTextRequest = Message<"tank.workspace.v1.RewriteTextRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * the draft, at most 4000 characters
     *
     * @generated from field: string text = 2;
     */
    text: string;
    /**
     * at most 15 words
     *
     * @generated from field: string instruction = 3;
     */
    instruction: string;
};
/**
 * Describes the message tank.workspace.v1.RewriteTextRequest.
 * Use `create(RewriteTextRequestSchema)` to create a new message.
 */
export declare const RewriteTextRequestSchema: GenMessage<RewriteTextRequest>;
/**
 * @generated from message tank.workspace.v1.RewriteTextResponse
 */
export type RewriteTextResponse = Message<"tank.workspace.v1.RewriteTextResponse"> & {
    /**
     * @generated from field: string text = 1;
     */
    text: string;
};
/**
 * Describes the message tank.workspace.v1.RewriteTextResponse.
 * Use `create(RewriteTextResponseSchema)` to create a new message.
 */
export declare const RewriteTextResponseSchema: GenMessage<RewriteTextResponse>;
/**
 * "Arcade cabinet, quiet" → a SoundChoice to review; nothing is saved.
 *
 * @generated from message tank.workspace.v1.DescribeSoundPackRequest
 */
export type DescribeSoundPackRequest = Message<"tank.workspace.v1.DescribeSoundPackRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * at most 15 words
     *
     * @generated from field: string description = 2;
     */
    description: string;
};
/**
 * Describes the message tank.workspace.v1.DescribeSoundPackRequest.
 * Use `create(DescribeSoundPackRequestSchema)` to create a new message.
 */
export declare const DescribeSoundPackRequestSchema: GenMessage<DescribeSoundPackRequest>;
/**
 * @generated from message tank.workspace.v1.DescribeSoundPackResponse
 */
export type DescribeSoundPackResponse = Message<"tank.workspace.v1.DescribeSoundPackResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.SoundChoice sounds = 1;
     */
    sounds?: SoundChoice;
};
/**
 * Describes the message tank.workspace.v1.DescribeSoundPackResponse.
 * Use `create(DescribeSoundPackResponseSchema)` to create a new message.
 */
export declare const DescribeSoundPackResponseSchema: GenMessage<DescribeSoundPackResponse>;
/**
 * One pack in TANK's library, so a client can offer them without a model call.
 *
 * @generated from message tank.workspace.v1.SoundPack
 */
export type SoundPack = Message<"tank.workspace.v1.SoundPack"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string description = 3;
     */
    description: string;
    /**
     * mention, dm, agent, in that order
     *
     * @generated from field: repeated string sound_ids = 4;
     */
    soundIds: string[];
};
/**
 * Describes the message tank.workspace.v1.SoundPack.
 * Use `create(SoundPackSchema)` to create a new message.
 */
export declare const SoundPackSchema: GenMessage<SoundPack>;
/**
 * @generated from message tank.workspace.v1.ListSoundPacksRequest
 */
export type ListSoundPacksRequest = Message<"tank.workspace.v1.ListSoundPacksRequest"> & {};
/**
 * Describes the message tank.workspace.v1.ListSoundPacksRequest.
 * Use `create(ListSoundPacksRequestSchema)` to create a new message.
 */
export declare const ListSoundPacksRequestSchema: GenMessage<ListSoundPacksRequest>;
/**
 * @generated from message tank.workspace.v1.ListSoundPacksResponse
 */
export type ListSoundPacksResponse = Message<"tank.workspace.v1.ListSoundPacksResponse"> & {
    /**
     * @generated from field: repeated tank.workspace.v1.SoundPack packs = 1;
     */
    packs: SoundPack[];
};
/**
 * Describes the message tank.workspace.v1.ListSoundPacksResponse.
 * Use `create(ListSoundPacksResponseSchema)` to create a new message.
 */
export declare const ListSoundPacksResponseSchema: GenMessage<ListSoundPacksResponse>;
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
 * What a generated picture is for. It changes the brief, not the pipeline.
 *
 * @generated from enum tank.workspace.v1.ArtKind
 */
export declare enum ArtKind {
    /**
     * @generated from enum value: ART_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * a Tread or workspace icon
     *
     * @generated from enum value: ART_KIND_ICON = 1;
     */
    ICON = 1,
    /**
     * a custom emoji
     *
     * @generated from enum value: ART_KIND_EMOJI = 2;
     */
    EMOJI = 2
}
/**
 * Describes the enum tank.workspace.v1.ArtKind.
 */
export declare const ArtKindSchema: GenEnum<ArtKind>;
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
     * The agenture board.
     *
     * @generated from rpc tank.workspace.v1.WorkspaceService.ListAgentures
     */
    listAgentures: {
        methodKind: "unary";
        input: typeof ListAgenturesRequestSchema;
        output: typeof ListAgenturesResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.AgentActivity
     */
    agentActivity: {
        methodKind: "unary";
        input: typeof AgentActivityRequestSchema;
        output: typeof AgentActivityResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.GetAgenture
     */
    getAgenture: {
        methodKind: "unary";
        input: typeof GetAgentureRequestSchema;
        output: typeof GetAgentureResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.ClaimAgenture
     */
    claimAgenture: {
        methodKind: "unary";
        input: typeof ClaimAgentureRequestSchema;
        output: typeof ClaimAgentureResponseSchema;
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
     * Turn up to fifteen words into a theme. Nothing is saved; the caller decides.
     *
     * @generated from rpc tank.workspace.v1.WorkspaceService.GenerateTheme
     */
    generateTheme: {
        methodKind: "unary";
        input: typeof GenerateThemeRequestSchema;
        output: typeof GenerateThemeResponseSchema;
    };
    /**
     * Admins only: the workspace's theme, or a reset when theme is unset.
     *
     * @generated from rpc tank.workspace.v1.WorkspaceService.SetWorkspaceTheme
     */
    setWorkspaceTheme: {
        methodKind: "unary";
        input: typeof SetWorkspaceThemeRequestSchema;
        output: typeof SetWorkspaceThemeResponseSchema;
    };
    /**
     * Turn up to fifteen words into an icon or emoji picture. The file is saved; nothing is applied.
     *
     * @generated from rpc tank.workspace.v1.WorkspaceService.GenerateArt
     */
    generateArt: {
        methodKind: "unary";
        input: typeof GenerateArtRequestSchema;
        output: typeof GenerateArtResponseSchema;
    };
    /**
     * Admins only: the workspace icon, or a reset when file_id is empty.
     *
     * @generated from rpc tank.workspace.v1.WorkspaceService.SetWorkspaceIcon
     */
    setWorkspaceIcon: {
        methodKind: "unary";
        input: typeof SetWorkspaceIconRequestSchema;
        output: typeof SetWorkspaceIconResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.DescribeHomeLayout
     */
    describeHomeLayout: {
        methodKind: "unary";
        input: typeof DescribeHomeLayoutRequestSchema;
        output: typeof DescribeHomeLayoutResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.RewriteText
     */
    rewriteText: {
        methodKind: "unary";
        input: typeof RewriteTextRequestSchema;
        output: typeof RewriteTextResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.DescribeSoundPack
     */
    describeSoundPack: {
        methodKind: "unary";
        input: typeof DescribeSoundPackRequestSchema;
        output: typeof DescribeSoundPackResponseSchema;
    };
    /**
     * @generated from rpc tank.workspace.v1.WorkspaceService.ListSoundPacks
     */
    listSoundPacks: {
        methodKind: "unary";
        input: typeof ListSoundPacksRequestSchema;
        output: typeof ListSoundPacksResponseSchema;
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
