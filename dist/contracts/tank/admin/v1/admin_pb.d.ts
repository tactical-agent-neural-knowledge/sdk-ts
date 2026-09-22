import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { FieldMask, Timestamp } from "@bufbuild/protobuf/wkt";
import type { Channel, ChannelType } from "../../channel/v1/channel_pb.js";
import type { Member, Role } from "../../workspace/v1/workspace_pb.js";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/admin/v1/admin.proto.
 */
export declare const file_tank_admin_v1_admin: GenFile;
/**
 * @generated from message tank.admin.v1.ListMembersRequest
 */
export type ListMembersRequest = Message<"tank.admin.v1.ListMembersRequest"> & {
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
     * Filters. ROLE_UNSPECIFIED = any role; deactivated unset = active and
     * deactivated; search matches display name or email (case-insensitive).
     *
     * @generated from field: tank.workspace.v1.Role role = 4;
     */
    role: Role;
    /**
     * @generated from field: optional bool deactivated = 5;
     */
    deactivated?: boolean;
    /**
     * @generated from field: string search = 6;
     */
    search: string;
};
/**
 * Describes the message tank.admin.v1.ListMembersRequest.
 * Use `create(ListMembersRequestSchema)` to create a new message.
 */
export declare const ListMembersRequestSchema: GenMessage<ListMembersRequest>;
/**
 * @generated from message tank.admin.v1.ListMembersResponse
 */
export type ListMembersResponse = Message<"tank.admin.v1.ListMembersResponse"> & {
    /**
     * email is included for admins
     *
     * @generated from field: repeated tank.workspace.v1.Member members = 1;
     */
    members: Member[];
    /**
     * @generated from field: string next_cursor = 2;
     */
    nextCursor: string;
    /**
     * matches for the filters, ignoring the page
     *
     * @generated from field: int32 total = 3;
     */
    total: number;
};
/**
 * Describes the message tank.admin.v1.ListMembersResponse.
 * Use `create(ListMembersResponseSchema)` to create a new message.
 */
export declare const ListMembersResponseSchema: GenMessage<ListMembersResponse>;
/**
 * Owner-only when the new or current role is OWNER. A workspace keeps at
 * least one active owner.
 *
 * @generated from message tank.admin.v1.SetMemberRoleRequest
 */
export type SetMemberRoleRequest = Message<"tank.admin.v1.SetMemberRoleRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string user_id = 2;
     */
    userId: string;
    /**
     * @generated from field: tank.workspace.v1.Role role = 3;
     */
    role: Role;
};
/**
 * Describes the message tank.admin.v1.SetMemberRoleRequest.
 * Use `create(SetMemberRoleRequestSchema)` to create a new message.
 */
export declare const SetMemberRoleRequestSchema: GenMessage<SetMemberRoleRequest>;
/**
 * @generated from message tank.admin.v1.SetMemberRoleResponse
 */
export type SetMemberRoleResponse = Message<"tank.admin.v1.SetMemberRoleResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.Member member = 1;
     */
    member?: Member;
};
/**
 * Describes the message tank.admin.v1.SetMemberRoleResponse.
 * Use `create(SetMemberRoleResponseSchema)` to create a new message.
 */
export declare const SetMemberRoleResponseSchema: GenMessage<SetMemberRoleResponse>;
/**
 * Deactivation keeps the member's history; sessions and tokens bound to the
 * workspace are revoked. Owners cannot be deactivated by admins.
 *
 * @generated from message tank.admin.v1.DeactivateMemberRequest
 */
export type DeactivateMemberRequest = Message<"tank.admin.v1.DeactivateMemberRequest"> & {
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
 * Describes the message tank.admin.v1.DeactivateMemberRequest.
 * Use `create(DeactivateMemberRequestSchema)` to create a new message.
 */
export declare const DeactivateMemberRequestSchema: GenMessage<DeactivateMemberRequest>;
/**
 * @generated from message tank.admin.v1.DeactivateMemberResponse
 */
export type DeactivateMemberResponse = Message<"tank.admin.v1.DeactivateMemberResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.Member member = 1;
     */
    member?: Member;
};
/**
 * Describes the message tank.admin.v1.DeactivateMemberResponse.
 * Use `create(DeactivateMemberResponseSchema)` to create a new message.
 */
export declare const DeactivateMemberResponseSchema: GenMessage<DeactivateMemberResponse>;
/**
 * @generated from message tank.admin.v1.ReactivateMemberRequest
 */
export type ReactivateMemberRequest = Message<"tank.admin.v1.ReactivateMemberRequest"> & {
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
 * Describes the message tank.admin.v1.ReactivateMemberRequest.
 * Use `create(ReactivateMemberRequestSchema)` to create a new message.
 */
export declare const ReactivateMemberRequestSchema: GenMessage<ReactivateMemberRequest>;
/**
 * @generated from message tank.admin.v1.ReactivateMemberResponse
 */
export type ReactivateMemberResponse = Message<"tank.admin.v1.ReactivateMemberResponse"> & {
    /**
     * @generated from field: tank.workspace.v1.Member member = 1;
     */
    member?: Member;
};
/**
 * Describes the message tank.admin.v1.ReactivateMemberResponse.
 * Use `create(ReactivateMemberResponseSchema)` to create a new message.
 */
export declare const ReactivateMemberResponseSchema: GenMessage<ReactivateMemberResponse>;
/**
 * Removes the membership row and every channel membership; messages stay.
 *
 * @generated from message tank.admin.v1.RemoveMemberRequest
 */
export type RemoveMemberRequest = Message<"tank.admin.v1.RemoveMemberRequest"> & {
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
 * Describes the message tank.admin.v1.RemoveMemberRequest.
 * Use `create(RemoveMemberRequestSchema)` to create a new message.
 */
export declare const RemoveMemberRequestSchema: GenMessage<RemoveMemberRequest>;
/**
 * @generated from message tank.admin.v1.RemoveMemberResponse
 */
export type RemoveMemberResponse = Message<"tank.admin.v1.RemoveMemberResponse"> & {};
/**
 * Describes the message tank.admin.v1.RemoveMemberResponse.
 * Use `create(RemoveMemberResponseSchema)` to create a new message.
 */
export declare const RemoveMemberResponseSchema: GenMessage<RemoveMemberResponse>;
/**
 * @generated from message tank.admin.v1.Invite
 */
export type Invite = Message<"tank.admin.v1.Invite"> & {
    /**
     * matches WorkspaceService.InviteMember.invite_id
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * @generated from field: string email = 3;
     */
    email: string;
    /**
     * @generated from field: tank.workspace.v1.Role role = 4;
     */
    role: Role;
    /**
     * @generated from field: string invited_by = 5;
     */
    invitedBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 6;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 7;
     */
    expiresAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp consumed_at = 8;
     */
    consumedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp revoked_at = 9;
     */
    revokedAt?: Timestamp;
};
/**
 * Describes the message tank.admin.v1.Invite.
 * Use `create(InviteSchema)` to create a new message.
 */
export declare const InviteSchema: GenMessage<Invite>;
/**
 * @generated from message tank.admin.v1.ListInvitesRequest
 */
export type ListInvitesRequest = Message<"tank.admin.v1.ListInvitesRequest"> & {
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
     * consumed, revoked and expired invites too
     *
     * @generated from field: bool include_inactive = 4;
     */
    includeInactive: boolean;
};
/**
 * Describes the message tank.admin.v1.ListInvitesRequest.
 * Use `create(ListInvitesRequestSchema)` to create a new message.
 */
export declare const ListInvitesRequestSchema: GenMessage<ListInvitesRequest>;
/**
 * @generated from message tank.admin.v1.ListInvitesResponse
 */
export type ListInvitesResponse = Message<"tank.admin.v1.ListInvitesResponse"> & {
    /**
     * @generated from field: repeated tank.admin.v1.Invite invites = 1;
     */
    invites: Invite[];
    /**
     * @generated from field: string next_cursor = 2;
     */
    nextCursor: string;
};
/**
 * Describes the message tank.admin.v1.ListInvitesResponse.
 * Use `create(ListInvitesResponseSchema)` to create a new message.
 */
export declare const ListInvitesResponseSchema: GenMessage<ListInvitesResponse>;
/**
 * @generated from message tank.admin.v1.RevokeInviteRequest
 */
export type RevokeInviteRequest = Message<"tank.admin.v1.RevokeInviteRequest"> & {
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
 * Describes the message tank.admin.v1.RevokeInviteRequest.
 * Use `create(RevokeInviteRequestSchema)` to create a new message.
 */
export declare const RevokeInviteRequestSchema: GenMessage<RevokeInviteRequest>;
/**
 * @generated from message tank.admin.v1.RevokeInviteResponse
 */
export type RevokeInviteResponse = Message<"tank.admin.v1.RevokeInviteResponse"> & {};
/**
 * Describes the message tank.admin.v1.RevokeInviteResponse.
 * Use `create(RevokeInviteResponseSchema)` to create a new message.
 */
export declare const RevokeInviteResponseSchema: GenMessage<RevokeInviteResponse>;
/**
 * @generated from message tank.admin.v1.ChannelCounts
 */
export type ChannelCounts = Message<"tank.admin.v1.ChannelCounts"> & {
    /**
     * @generated from field: int32 public = 1;
     */
    public: number;
    /**
     * @generated from field: int32 private = 2;
     */
    private: number;
    /**
     * public + private channels with archived_at set
     *
     * @generated from field: int32 archived = 3;
     */
    archived: number;
    /**
     * dm + mpdm
     *
     * @generated from field: int32 dm = 4;
     */
    dm: number;
};
/**
 * Describes the message tank.admin.v1.ChannelCounts.
 * Use `create(ChannelCountsSchema)` to create a new message.
 */
export declare const ChannelCountsSchema: GenMessage<ChannelCounts>;
/**
 * @generated from message tank.admin.v1.ListChannelsAdminRequest
 */
export type ListChannelsAdminRequest = Message<"tank.admin.v1.ListChannelsAdminRequest"> & {
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
     * Filters. CHANNEL_TYPE_UNSPECIFIED = public and private; DMs are only
     * listed when asked for explicitly.
     *
     * @generated from field: tank.channel.v1.ChannelType type = 4;
     */
    type: ChannelType;
    /**
     * @generated from field: bool include_archived = 5;
     */
    includeArchived: boolean;
    /**
     * name substring
     *
     * @generated from field: string search = 6;
     */
    search: string;
};
/**
 * Describes the message tank.admin.v1.ListChannelsAdminRequest.
 * Use `create(ListChannelsAdminRequestSchema)` to create a new message.
 */
export declare const ListChannelsAdminRequestSchema: GenMessage<ListChannelsAdminRequest>;
/**
 * @generated from message tank.admin.v1.ListChannelsAdminResponse
 */
export type ListChannelsAdminResponse = Message<"tank.admin.v1.ListChannelsAdminResponse"> & {
    /**
     * joined reflects the caller
     *
     * @generated from field: repeated tank.channel.v1.Channel channels = 1;
     */
    channels: Channel[];
    /**
     * @generated from field: string next_cursor = 2;
     */
    nextCursor: string;
    /**
     * @generated from field: tank.admin.v1.ChannelCounts counts = 3;
     */
    counts?: ChannelCounts;
};
/**
 * Describes the message tank.admin.v1.ListChannelsAdminResponse.
 * Use `create(ListChannelsAdminResponseSchema)` to create a new message.
 */
export declare const ListChannelsAdminResponseSchema: GenMessage<ListChannelsAdminResponse>;
/**
 * Archives (or unarchives) any public or private channel, member or not.
 *
 * @generated from message tank.admin.v1.AdminArchiveChannelRequest
 */
export type AdminArchiveChannelRequest = Message<"tank.admin.v1.AdminArchiveChannelRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * false = unarchive
     *
     * @generated from field: bool archived = 3;
     */
    archived: boolean;
};
/**
 * Describes the message tank.admin.v1.AdminArchiveChannelRequest.
 * Use `create(AdminArchiveChannelRequestSchema)` to create a new message.
 */
export declare const AdminArchiveChannelRequestSchema: GenMessage<AdminArchiveChannelRequest>;
/**
 * @generated from message tank.admin.v1.AdminArchiveChannelResponse
 */
export type AdminArchiveChannelResponse = Message<"tank.admin.v1.AdminArchiveChannelResponse"> & {
    /**
     * @generated from field: tank.channel.v1.Channel channel = 1;
     */
    channel?: Channel;
};
/**
 * Describes the message tank.admin.v1.AdminArchiveChannelResponse.
 * Use `create(AdminArchiveChannelResponseSchema)` to create a new message.
 */
export declare const AdminArchiveChannelResponseSchema: GenMessage<AdminArchiveChannelResponse>;
/**
 * Adds and removes members of a public or private channel without being a
 * member. Each change emits channel.membership.changed with the admin as actor.
 *
 * @generated from message tank.admin.v1.AdminSetChannelMembersRequest
 */
export type AdminSetChannelMembersRequest = Message<"tank.admin.v1.AdminSetChannelMembersRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * @generated from field: repeated string add_user_ids = 3;
     */
    addUserIds: string[];
    /**
     * @generated from field: repeated string remove_user_ids = 4;
     */
    removeUserIds: string[];
};
/**
 * Describes the message tank.admin.v1.AdminSetChannelMembersRequest.
 * Use `create(AdminSetChannelMembersRequestSchema)` to create a new message.
 */
export declare const AdminSetChannelMembersRequestSchema: GenMessage<AdminSetChannelMembersRequest>;
/**
 * @generated from message tank.admin.v1.AdminSetChannelMembersResponse
 */
export type AdminSetChannelMembersResponse = Message<"tank.admin.v1.AdminSetChannelMembersResponse"> & {
    /**
     * @generated from field: tank.channel.v1.Channel channel = 1;
     */
    channel?: Channel;
    /**
     * @generated from field: int32 added = 2;
     */
    added: number;
    /**
     * @generated from field: int32 removed = 3;
     */
    removed: number;
};
/**
 * Describes the message tank.admin.v1.AdminSetChannelMembersResponse.
 * Use `create(AdminSetChannelMembersResponseSchema)` to create a new message.
 */
export declare const AdminSetChannelMembersResponseSchema: GenMessage<AdminSetChannelMembersResponse>;
/**
 * Days to keep messages (and the files shared through them) per channel
 * type; 0 = keep forever. Enforced by worker -role retention unless the
 * workspace is under legal hold.
 *
 * @generated from message tank.admin.v1.RetentionPolicy
 */
export type RetentionPolicy = Message<"tank.admin.v1.RetentionPolicy"> & {
    /**
     * @generated from field: int32 public_days = 1;
     */
    publicDays: number;
    /**
     * @generated from field: int32 private_days = 2;
     */
    privateDays: number;
    /**
     * @generated from field: int32 dm_days = 3;
     */
    dmDays: number;
    /**
     * @generated from field: int32 mpdm_days = 4;
     */
    mpdmDays: number;
};
/**
 * Describes the message tank.admin.v1.RetentionPolicy.
 * Use `create(RetentionPolicySchema)` to create a new message.
 */
export declare const RetentionPolicySchema: GenMessage<RetentionPolicy>;
/**
 * @generated from message tank.admin.v1.WorkspaceSettings
 */
export type WorkspaceSettings = Message<"tank.admin.v1.WorkspaceSettings"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * an image upload; empty = no icon
     *
     * @generated from field: string icon_file_id = 3;
     */
    iconFileId: string;
    /**
     * new members are added to these (plus #general)
     *
     * @generated from field: repeated string default_channel_ids = 4;
     */
    defaultChannelIds: string[];
    /**
     * @generated from field: tank.admin.v1.Permission who_can_create_channels = 5;
     */
    whoCanCreateChannels: Permission;
    /**
     * @generated from field: tank.admin.v1.Permission who_can_invite = 6;
     */
    whoCanInvite: Permission;
    /**
     * @generated from field: tank.admin.v1.RetentionPolicy retention = 7;
     */
    retention?: RetentionPolicy;
    /**
     * @generated from field: bool allow_guests = 8;
     */
    allowGuests: boolean;
    /**
     * Members whose email domain matches the SSO domain claim must sign in
     * through SSO; magic links for that domain are refused.
     *
     * @generated from field: bool require_sso = 9;
     */
    requireSso: boolean;
    /**
     * Suspends retention for the whole workspace (owner-only to change).
     *
     * @generated from field: bool legal_hold = 10;
     */
    legalHold: boolean;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 11;
     */
    updatedAt?: Timestamp;
};
/**
 * Describes the message tank.admin.v1.WorkspaceSettings.
 * Use `create(WorkspaceSettingsSchema)` to create a new message.
 */
export declare const WorkspaceSettingsSchema: GenMessage<WorkspaceSettings>;
/**
 * @generated from message tank.admin.v1.GetWorkspaceSettingsRequest
 */
export type GetWorkspaceSettingsRequest = Message<"tank.admin.v1.GetWorkspaceSettingsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.admin.v1.GetWorkspaceSettingsRequest.
 * Use `create(GetWorkspaceSettingsRequestSchema)` to create a new message.
 */
export declare const GetWorkspaceSettingsRequestSchema: GenMessage<GetWorkspaceSettingsRequest>;
/**
 * @generated from message tank.admin.v1.GetWorkspaceSettingsResponse
 */
export type GetWorkspaceSettingsResponse = Message<"tank.admin.v1.GetWorkspaceSettingsResponse"> & {
    /**
     * @generated from field: tank.admin.v1.WorkspaceSettings settings = 1;
     */
    settings?: WorkspaceSettings;
};
/**
 * Describes the message tank.admin.v1.GetWorkspaceSettingsResponse.
 * Use `create(GetWorkspaceSettingsResponseSchema)` to create a new message.
 */
export declare const GetWorkspaceSettingsResponseSchema: GenMessage<GetWorkspaceSettingsResponse>;
/**
 * update_mask lists the settings fields to apply (name, icon_file_id,
 * default_channel_ids, who_can_create_channels, who_can_invite, retention,
 * allow_guests, require_sso, legal_hold); empty = every field.
 *
 * @generated from message tank.admin.v1.UpdateWorkspaceSettingsRequest
 */
export type UpdateWorkspaceSettingsRequest = Message<"tank.admin.v1.UpdateWorkspaceSettingsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: tank.admin.v1.WorkspaceSettings settings = 2;
     */
    settings?: WorkspaceSettings;
    /**
     * @generated from field: google.protobuf.FieldMask update_mask = 3;
     */
    updateMask?: FieldMask;
};
/**
 * Describes the message tank.admin.v1.UpdateWorkspaceSettingsRequest.
 * Use `create(UpdateWorkspaceSettingsRequestSchema)` to create a new message.
 */
export declare const UpdateWorkspaceSettingsRequestSchema: GenMessage<UpdateWorkspaceSettingsRequest>;
/**
 * @generated from message tank.admin.v1.UpdateWorkspaceSettingsResponse
 */
export type UpdateWorkspaceSettingsResponse = Message<"tank.admin.v1.UpdateWorkspaceSettingsResponse"> & {
    /**
     * @generated from field: tank.admin.v1.WorkspaceSettings settings = 1;
     */
    settings?: WorkspaceSettings;
};
/**
 * Describes the message tank.admin.v1.UpdateWorkspaceSettingsResponse.
 * Use `create(UpdateWorkspaceSettingsResponseSchema)` to create a new message.
 */
export declare const UpdateWorkspaceSettingsResponseSchema: GenMessage<UpdateWorkspaceSettingsResponse>;
/**
 * One row per mutating RPC on Admin/Auth/Channel/Workspace, per admin
 * message delete and per SCIM change. action is "<service>.<rpc_snake_case>",
 * e.g. admin.set_member_role, scim.user_deactivated.
 *
 * @generated from message tank.admin.v1.AuditEntry
 */
export type AuditEntry = Message<"tank.admin.v1.AuditEntry"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * user id; empty for system actions
     *
     * @generated from field: string actor_id = 3;
     */
    actorId: string;
    /**
     * user | bot | agent | scim | system
     *
     * @generated from field: string actor_kind = 4;
     */
    actorKind: string;
    /**
     * @generated from field: string action = 5;
     */
    action: string;
    /**
     * member | channel | invite | workspace | message | session | sso | scim_token | export | user_group
     *
     * @generated from field: string target_type = 6;
     */
    targetType: string;
    /**
     * @generated from field: string target_id = 7;
     */
    targetId: string;
    /**
     * small JSON object with the request's non-secret fields
     *
     * @generated from field: string metadata_json = 8;
     */
    metadataJson: string;
    /**
     * @generated from field: string ip = 9;
     */
    ip: string;
    /**
     * @generated from field: string user_agent = 10;
     */
    userAgent: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 11;
     */
    createdAt?: Timestamp;
};
/**
 * Describes the message tank.admin.v1.AuditEntry.
 * Use `create(AuditEntrySchema)` to create a new message.
 */
export declare const AuditEntrySchema: GenMessage<AuditEntry>;
/**
 * @generated from message tank.admin.v1.ListAuditLogRequest
 */
export type ListAuditLogRequest = Message<"tank.admin.v1.ListAuditLogRequest"> & {
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
     * filter
     *
     * @generated from field: string actor_id = 4;
     */
    actorId: string;
    /**
     * exact action or a "prefix." (e.g. "admin.")
     *
     * @generated from field: string action = 5;
     */
    action: string;
    /**
     * @generated from field: google.protobuf.Timestamp since = 6;
     */
    since?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp until = 7;
     */
    until?: Timestamp;
};
/**
 * Describes the message tank.admin.v1.ListAuditLogRequest.
 * Use `create(ListAuditLogRequestSchema)` to create a new message.
 */
export declare const ListAuditLogRequestSchema: GenMessage<ListAuditLogRequest>;
/**
 * @generated from message tank.admin.v1.ListAuditLogResponse
 */
export type ListAuditLogResponse = Message<"tank.admin.v1.ListAuditLogResponse"> & {
    /**
     * newest first
     *
     * @generated from field: repeated tank.admin.v1.AuditEntry entries = 1;
     */
    entries: AuditEntry[];
    /**
     * @generated from field: string next_cursor = 2;
     */
    nextCursor: string;
};
/**
 * Describes the message tank.admin.v1.ListAuditLogResponse.
 * Use `create(ListAuditLogResponseSchema)` to create a new message.
 */
export declare const ListAuditLogResponseSchema: GenMessage<ListAuditLogResponse>;
/**
 * A zip built by worker -role export: workspace.json, members.json,
 * channels/<id>.json (messages, oldest first) and files/ when include_files.
 *
 * @generated from message tank.admin.v1.ExportJob
 */
export type ExportJob = Message<"tank.admin.v1.ExportJob"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * @generated from field: string requested_by = 3;
     */
    requestedBy: string;
    /**
     * @generated from field: bool include_files = 4;
     */
    includeFiles: boolean;
    /**
     * unset = from the beginning
     *
     * @generated from field: google.protobuf.Timestamp since = 5;
     */
    since?: Timestamp;
    /**
     * unset = now
     *
     * @generated from field: google.protobuf.Timestamp until = 6;
     */
    until?: Timestamp;
    /**
     * @generated from field: tank.admin.v1.ExportState state = 7;
     */
    state: ExportState;
    /**
     * @generated from field: int64 size_bytes = 8;
     */
    sizeBytes: bigint;
    /**
     * @generated from field: string error = 9;
     */
    error: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 10;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp completed_at = 11;
     */
    completedAt?: Timestamp;
    /**
     * the object is deleted after this
     *
     * @generated from field: google.protobuf.Timestamp expires_at = 12;
     */
    expiresAt?: Timestamp;
};
/**
 * Describes the message tank.admin.v1.ExportJob.
 * Use `create(ExportJobSchema)` to create a new message.
 */
export declare const ExportJobSchema: GenMessage<ExportJob>;
/**
 * @generated from message tank.admin.v1.RequestExportRequest
 */
export type RequestExportRequest = Message<"tank.admin.v1.RequestExportRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: bool include_files = 2;
     */
    includeFiles: boolean;
    /**
     * @generated from field: google.protobuf.Timestamp since = 3;
     */
    since?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp until = 4;
     */
    until?: Timestamp;
};
/**
 * Describes the message tank.admin.v1.RequestExportRequest.
 * Use `create(RequestExportRequestSchema)` to create a new message.
 */
export declare const RequestExportRequestSchema: GenMessage<RequestExportRequest>;
/**
 * @generated from message tank.admin.v1.RequestExportResponse
 */
export type RequestExportResponse = Message<"tank.admin.v1.RequestExportResponse"> & {
    /**
     * @generated from field: tank.admin.v1.ExportJob job = 1;
     */
    job?: ExportJob;
};
/**
 * Describes the message tank.admin.v1.RequestExportResponse.
 * Use `create(RequestExportResponseSchema)` to create a new message.
 */
export declare const RequestExportResponseSchema: GenMessage<RequestExportResponse>;
/**
 * @generated from message tank.admin.v1.ListExportsRequest
 */
export type ListExportsRequest = Message<"tank.admin.v1.ListExportsRequest"> & {
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
 * Describes the message tank.admin.v1.ListExportsRequest.
 * Use `create(ListExportsRequestSchema)` to create a new message.
 */
export declare const ListExportsRequestSchema: GenMessage<ListExportsRequest>;
/**
 * @generated from message tank.admin.v1.ListExportsResponse
 */
export type ListExportsResponse = Message<"tank.admin.v1.ListExportsResponse"> & {
    /**
     * newest first
     *
     * @generated from field: repeated tank.admin.v1.ExportJob jobs = 1;
     */
    jobs: ExportJob[];
    /**
     * @generated from field: string next_cursor = 2;
     */
    nextCursor: string;
};
/**
 * Describes the message tank.admin.v1.ListExportsResponse.
 * Use `create(ListExportsResponseSchema)` to create a new message.
 */
export declare const ListExportsResponseSchema: GenMessage<ListExportsResponse>;
/**
 * @generated from message tank.admin.v1.GetExportDownloadUrlRequest
 */
export type GetExportDownloadUrlRequest = Message<"tank.admin.v1.GetExportDownloadUrlRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string export_id = 2;
     */
    exportId: string;
};
/**
 * Describes the message tank.admin.v1.GetExportDownloadUrlRequest.
 * Use `create(GetExportDownloadUrlRequestSchema)` to create a new message.
 */
export declare const GetExportDownloadUrlRequestSchema: GenMessage<GetExportDownloadUrlRequest>;
/**
 * @generated from message tank.admin.v1.GetExportDownloadUrlResponse
 */
export type GetExportDownloadUrlResponse = Message<"tank.admin.v1.GetExportDownloadUrlResponse"> & {
    /**
     * @generated from field: string url = 1;
     */
    url: string;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 2;
     */
    expiresAt?: Timestamp;
};
/**
 * Describes the message tank.admin.v1.GetExportDownloadUrlResponse.
 * Use `create(GetExportDownloadUrlResponseSchema)` to create a new message.
 */
export declare const GetExportDownloadUrlResponseSchema: GenMessage<GetExportDownloadUrlResponse>;
/**
 * @generated from message tank.admin.v1.GetUsageRequest
 */
export type GetUsageRequest = Message<"tank.admin.v1.GetUsageRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.admin.v1.GetUsageRequest.
 * Use `create(GetUsageRequestSchema)` to create a new message.
 */
export declare const GetUsageRequestSchema: GenMessage<GetUsageRequest>;
/**
 * @generated from message tank.admin.v1.GetUsageResponse
 */
export type GetUsageResponse = Message<"tank.admin.v1.GetUsageResponse"> & {
    /**
     * active, humans (owner/admin/member)
     *
     * @generated from field: int32 members = 1;
     */
    members: number;
    /**
     * active guests
     *
     * @generated from field: int32 guests = 2;
     */
    guests: number;
    /**
     * @generated from field: int32 deactivated = 3;
     */
    deactivated: number;
    /**
     * @generated from field: int32 bots = 4;
     */
    bots: number;
    /**
     * public + private, not archived
     *
     * @generated from field: int32 channels = 5;
     */
    channels: number;
    /**
     * @generated from field: int64 messages_30d = 6;
     */
    messages30d: bigint;
    /**
     * @generated from field: int64 files_count = 7;
     */
    filesCount: bigint;
    /**
     * @generated from field: int64 files_bytes = 8;
     */
    filesBytes: bigint;
    /**
     * @generated from field: int64 agent_runs_30d = 9;
     */
    agentRuns30d: bigint;
    /**
     * agent run cost + agent.usage_ledger when present
     *
     * @generated from field: double cost_usd_30d = 10;
     */
    costUsd30d: number;
    /**
     * @generated from field: google.protobuf.Timestamp computed_at = 11;
     */
    computedAt?: Timestamp;
};
/**
 * Describes the message tank.admin.v1.GetUsageResponse.
 * Use `create(GetUsageResponseSchema)` to create a new message.
 */
export declare const GetUsageResponseSchema: GenMessage<GetUsageResponse>;
/**
 * A bearer for the SCIM 2.0 endpoint (/scim/v2/Users, /scim/v2/Groups).
 *
 * @generated from message tank.admin.v1.ScimToken
 */
export type ScimToken = Message<"tank.admin.v1.ScimToken"> & {
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
     * @generated from field: string created_by = 4;
     */
    createdBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 5;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp expires_at = 6;
     */
    expiresAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp revoked_at = 7;
     */
    revokedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp last_used_at = 8;
     */
    lastUsedAt?: Timestamp;
};
/**
 * Describes the message tank.admin.v1.ScimToken.
 * Use `create(ScimTokenSchema)` to create a new message.
 */
export declare const ScimTokenSchema: GenMessage<ScimToken>;
/**
 * @generated from message tank.admin.v1.CreateScimTokenRequest
 */
export type CreateScimTokenRequest = Message<"tank.admin.v1.CreateScimTokenRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * 0 = never expires
     *
     * @generated from field: int32 ttl_days = 3;
     */
    ttlDays: number;
};
/**
 * Describes the message tank.admin.v1.CreateScimTokenRequest.
 * Use `create(CreateScimTokenRequestSchema)` to create a new message.
 */
export declare const CreateScimTokenRequestSchema: GenMessage<CreateScimTokenRequest>;
/**
 * @generated from message tank.admin.v1.CreateScimTokenResponse
 */
export type CreateScimTokenResponse = Message<"tank.admin.v1.CreateScimTokenResponse"> & {
    /**
     * @generated from field: tank.admin.v1.ScimToken token = 1;
     */
    token?: ScimToken;
    /**
     * shown once
     *
     * @generated from field: string secret = 2;
     */
    secret: string;
    /**
     * the SCIM base URL to configure at the IdP
     *
     * @generated from field: string base_url = 3;
     */
    baseUrl: string;
};
/**
 * Describes the message tank.admin.v1.CreateScimTokenResponse.
 * Use `create(CreateScimTokenResponseSchema)` to create a new message.
 */
export declare const CreateScimTokenResponseSchema: GenMessage<CreateScimTokenResponse>;
/**
 * @generated from message tank.admin.v1.ListScimTokensRequest
 */
export type ListScimTokensRequest = Message<"tank.admin.v1.ListScimTokensRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.admin.v1.ListScimTokensRequest.
 * Use `create(ListScimTokensRequestSchema)` to create a new message.
 */
export declare const ListScimTokensRequestSchema: GenMessage<ListScimTokensRequest>;
/**
 * @generated from message tank.admin.v1.ListScimTokensResponse
 */
export type ListScimTokensResponse = Message<"tank.admin.v1.ListScimTokensResponse"> & {
    /**
     * @generated from field: repeated tank.admin.v1.ScimToken tokens = 1;
     */
    tokens: ScimToken[];
};
/**
 * Describes the message tank.admin.v1.ListScimTokensResponse.
 * Use `create(ListScimTokensResponseSchema)` to create a new message.
 */
export declare const ListScimTokensResponseSchema: GenMessage<ListScimTokensResponse>;
/**
 * @generated from message tank.admin.v1.RevokeScimTokenRequest
 */
export type RevokeScimTokenRequest = Message<"tank.admin.v1.RevokeScimTokenRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string token_id = 2;
     */
    tokenId: string;
};
/**
 * Describes the message tank.admin.v1.RevokeScimTokenRequest.
 * Use `create(RevokeScimTokenRequestSchema)` to create a new message.
 */
export declare const RevokeScimTokenRequestSchema: GenMessage<RevokeScimTokenRequest>;
/**
 * @generated from message tank.admin.v1.RevokeScimTokenResponse
 */
export type RevokeScimTokenResponse = Message<"tank.admin.v1.RevokeScimTokenResponse"> & {};
/**
 * Describes the message tank.admin.v1.RevokeScimTokenResponse.
 * Use `create(RevokeScimTokenResponseSchema)` to create a new message.
 */
export declare const RevokeScimTokenResponseSchema: GenMessage<RevokeScimTokenResponse>;
/**
 * An incoming webhook: a URL something outside TANK posts to, so its messages
 * land in one Tread. The first integration point, and deliberately the
 * dumbest one — a URL and a name is the whole contract, which is why every
 * build system and monitor already knows how to use it.
 *
 * @generated from message tank.admin.v1.IncomingWebhook
 */
export type IncomingWebhook = Message<"tank.admin.v1.IncomingWebhook"> & {
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
     * Optional: post into this thread rather than the channel.
     *
     * @generated from field: string thread_root_id = 4;
     */
    threadRootId: string;
    /**
     * Shown as the author of everything it posts, so a Tread says "Deploys"
     * rather than the name of whoever set it up.
     *
     * @generated from field: string name = 5;
     */
    name: string;
    /**
     * @generated from field: string created_by = 6;
     */
    createdBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 7;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp last_post_at = 8;
     */
    lastPostAt?: Timestamp;
    /**
     * The full URL including its secret. Returned only when it is created:
     * only a hash is stored, so this cannot be shown again.
     *
     * @generated from field: string url = 9;
     */
    url: string;
};
/**
 * Describes the message tank.admin.v1.IncomingWebhook.
 * Use `create(IncomingWebhookSchema)` to create a new message.
 */
export declare const IncomingWebhookSchema: GenMessage<IncomingWebhook>;
/**
 * @generated from message tank.admin.v1.CreateIncomingWebhookRequest
 */
export type CreateIncomingWebhookRequest = Message<"tank.admin.v1.CreateIncomingWebhookRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * @generated from field: string thread_root_id = 3;
     */
    threadRootId: string;
    /**
     * @generated from field: string name = 4;
     */
    name: string;
};
/**
 * Describes the message tank.admin.v1.CreateIncomingWebhookRequest.
 * Use `create(CreateIncomingWebhookRequestSchema)` to create a new message.
 */
export declare const CreateIncomingWebhookRequestSchema: GenMessage<CreateIncomingWebhookRequest>;
/**
 * @generated from message tank.admin.v1.CreateIncomingWebhookResponse
 */
export type CreateIncomingWebhookResponse = Message<"tank.admin.v1.CreateIncomingWebhookResponse"> & {
    /**
     * @generated from field: tank.admin.v1.IncomingWebhook webhook = 1;
     */
    webhook?: IncomingWebhook;
};
/**
 * Describes the message tank.admin.v1.CreateIncomingWebhookResponse.
 * Use `create(CreateIncomingWebhookResponseSchema)` to create a new message.
 */
export declare const CreateIncomingWebhookResponseSchema: GenMessage<CreateIncomingWebhookResponse>;
/**
 * @generated from message tank.admin.v1.ListIncomingWebhooksRequest
 */
export type ListIncomingWebhooksRequest = Message<"tank.admin.v1.ListIncomingWebhooksRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.admin.v1.ListIncomingWebhooksRequest.
 * Use `create(ListIncomingWebhooksRequestSchema)` to create a new message.
 */
export declare const ListIncomingWebhooksRequestSchema: GenMessage<ListIncomingWebhooksRequest>;
/**
 * @generated from message tank.admin.v1.ListIncomingWebhooksResponse
 */
export type ListIncomingWebhooksResponse = Message<"tank.admin.v1.ListIncomingWebhooksResponse"> & {
    /**
     * @generated from field: repeated tank.admin.v1.IncomingWebhook webhooks = 1;
     */
    webhooks: IncomingWebhook[];
};
/**
 * Describes the message tank.admin.v1.ListIncomingWebhooksResponse.
 * Use `create(ListIncomingWebhooksResponseSchema)` to create a new message.
 */
export declare const ListIncomingWebhooksResponseSchema: GenMessage<ListIncomingWebhooksResponse>;
/**
 * @generated from message tank.admin.v1.RevokeIncomingWebhookRequest
 */
export type RevokeIncomingWebhookRequest = Message<"tank.admin.v1.RevokeIncomingWebhookRequest"> & {
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
 * Describes the message tank.admin.v1.RevokeIncomingWebhookRequest.
 * Use `create(RevokeIncomingWebhookRequestSchema)` to create a new message.
 */
export declare const RevokeIncomingWebhookRequestSchema: GenMessage<RevokeIncomingWebhookRequest>;
/**
 * @generated from message tank.admin.v1.RevokeIncomingWebhookResponse
 */
export type RevokeIncomingWebhookResponse = Message<"tank.admin.v1.RevokeIncomingWebhookResponse"> & {};
/**
 * Describes the message tank.admin.v1.RevokeIncomingWebhookResponse.
 * Use `create(RevokeIncomingWebhookResponseSchema)` to create a new message.
 */
export declare const RevokeIncomingWebhookResponseSchema: GenMessage<RevokeIncomingWebhookResponse>;
/**
 * Who may perform an action in the workspace.
 *
 * @generated from enum tank.admin.v1.Permission
 */
export declare enum Permission {
    /**
     * @generated from enum value: PERMISSION_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * every active member including guests
     *
     * @generated from enum value: PERMISSION_EVERYONE = 1;
     */
    EVERYONE = 1,
    /**
     * members, admins and owners (not guests)
     *
     * @generated from enum value: PERMISSION_MEMBERS = 2;
     */
    MEMBERS = 2,
    /**
     * admins and owners
     *
     * @generated from enum value: PERMISSION_ADMINS = 3;
     */
    ADMINS = 3,
    /**
     * @generated from enum value: PERMISSION_OWNERS = 4;
     */
    OWNERS = 4
}
/**
 * Describes the enum tank.admin.v1.Permission.
 */
export declare const PermissionSchema: GenEnum<Permission>;
/**
 * @generated from enum tank.admin.v1.ExportState
 */
export declare enum ExportState {
    /**
     * @generated from enum value: EXPORT_STATE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: EXPORT_STATE_PENDING = 1;
     */
    PENDING = 1,
    /**
     * @generated from enum value: EXPORT_STATE_RUNNING = 2;
     */
    RUNNING = 2,
    /**
     * @generated from enum value: EXPORT_STATE_READY = 3;
     */
    READY = 3,
    /**
     * @generated from enum value: EXPORT_STATE_FAILED = 4;
     */
    FAILED = 4,
    /**
     * @generated from enum value: EXPORT_STATE_EXPIRED = 5;
     */
    EXPIRED = 5
}
/**
 * Describes the enum tank.admin.v1.ExportState.
 */
export declare const ExportStateSchema: GenEnum<ExportState>;
/**
 * @generated from service tank.admin.v1.AdminService
 */
export declare const AdminService: GenService<{
    /**
     * @generated from rpc tank.admin.v1.AdminService.ListMembers
     */
    listMembers: {
        methodKind: "unary";
        input: typeof ListMembersRequestSchema;
        output: typeof ListMembersResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.SetMemberRole
     */
    setMemberRole: {
        methodKind: "unary";
        input: typeof SetMemberRoleRequestSchema;
        output: typeof SetMemberRoleResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.DeactivateMember
     */
    deactivateMember: {
        methodKind: "unary";
        input: typeof DeactivateMemberRequestSchema;
        output: typeof DeactivateMemberResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.ReactivateMember
     */
    reactivateMember: {
        methodKind: "unary";
        input: typeof ReactivateMemberRequestSchema;
        output: typeof ReactivateMemberResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.RemoveMember
     */
    removeMember: {
        methodKind: "unary";
        input: typeof RemoveMemberRequestSchema;
        output: typeof RemoveMemberResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.ListInvites
     */
    listInvites: {
        methodKind: "unary";
        input: typeof ListInvitesRequestSchema;
        output: typeof ListInvitesResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.RevokeInvite
     */
    revokeInvite: {
        methodKind: "unary";
        input: typeof RevokeInviteRequestSchema;
        output: typeof RevokeInviteResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.ListChannelsAdmin
     */
    listChannelsAdmin: {
        methodKind: "unary";
        input: typeof ListChannelsAdminRequestSchema;
        output: typeof ListChannelsAdminResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.AdminArchiveChannel
     */
    adminArchiveChannel: {
        methodKind: "unary";
        input: typeof AdminArchiveChannelRequestSchema;
        output: typeof AdminArchiveChannelResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.AdminSetChannelMembers
     */
    adminSetChannelMembers: {
        methodKind: "unary";
        input: typeof AdminSetChannelMembersRequestSchema;
        output: typeof AdminSetChannelMembersResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.CreateIncomingWebhook
     */
    createIncomingWebhook: {
        methodKind: "unary";
        input: typeof CreateIncomingWebhookRequestSchema;
        output: typeof CreateIncomingWebhookResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.ListIncomingWebhooks
     */
    listIncomingWebhooks: {
        methodKind: "unary";
        input: typeof ListIncomingWebhooksRequestSchema;
        output: typeof ListIncomingWebhooksResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.RevokeIncomingWebhook
     */
    revokeIncomingWebhook: {
        methodKind: "unary";
        input: typeof RevokeIncomingWebhookRequestSchema;
        output: typeof RevokeIncomingWebhookResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.GetWorkspaceSettings
     */
    getWorkspaceSettings: {
        methodKind: "unary";
        input: typeof GetWorkspaceSettingsRequestSchema;
        output: typeof GetWorkspaceSettingsResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.UpdateWorkspaceSettings
     */
    updateWorkspaceSettings: {
        methodKind: "unary";
        input: typeof UpdateWorkspaceSettingsRequestSchema;
        output: typeof UpdateWorkspaceSettingsResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.ListAuditLog
     */
    listAuditLog: {
        methodKind: "unary";
        input: typeof ListAuditLogRequestSchema;
        output: typeof ListAuditLogResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.RequestExport
     */
    requestExport: {
        methodKind: "unary";
        input: typeof RequestExportRequestSchema;
        output: typeof RequestExportResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.ListExports
     */
    listExports: {
        methodKind: "unary";
        input: typeof ListExportsRequestSchema;
        output: typeof ListExportsResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.GetExportDownloadUrl
     */
    getExportDownloadUrl: {
        methodKind: "unary";
        input: typeof GetExportDownloadUrlRequestSchema;
        output: typeof GetExportDownloadUrlResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.GetUsage
     */
    getUsage: {
        methodKind: "unary";
        input: typeof GetUsageRequestSchema;
        output: typeof GetUsageResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.CreateScimToken
     */
    createScimToken: {
        methodKind: "unary";
        input: typeof CreateScimTokenRequestSchema;
        output: typeof CreateScimTokenResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.ListScimTokens
     */
    listScimTokens: {
        methodKind: "unary";
        input: typeof ListScimTokensRequestSchema;
        output: typeof ListScimTokensResponseSchema;
    };
    /**
     * @generated from rpc tank.admin.v1.AdminService.RevokeScimToken
     */
    revokeScimToken: {
        methodKind: "unary";
        input: typeof RevokeScimTokenRequestSchema;
        output: typeof RevokeScimTokenResponseSchema;
    };
}>;
