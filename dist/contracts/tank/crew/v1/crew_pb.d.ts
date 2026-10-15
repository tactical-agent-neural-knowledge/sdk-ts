import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/crew/v1/crew.proto.
 */
export declare const file_tank_crew_v1_crew: GenFile;
/**
 * @generated from message tank.crew.v1.Member
 */
export type Member = Message<"tank.crew.v1.Member"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string agent_id = 2;
     */
    agentId: string;
    /**
     * the agent's user row, for @mentions
     *
     * @generated from field: string principal_id = 3;
     */
    principalId: string;
    /**
     * ceo | cfo | coo | cto | custom
     *
     * @generated from field: string role = 4;
     */
    role: string;
    /**
     * "CFO"
     *
     * @generated from field: string title = 5;
     */
    title: string;
    /**
     * "cfo": what @ resolves
     *
     * @generated from field: string handle = 6;
     */
    handle: string;
    /**
     * the prompt: who this member is and what it does
     *
     * @generated from field: string skill = 7;
     */
    skill: string;
    /**
     * @generated from field: bool enabled = 8;
     */
    enabled: boolean;
    /**
     * @generated from field: tank.crew.v1.Treads treads = 9;
     */
    treads: Treads;
    /**
     * @generated from field: repeated string channel_ids = 10;
     */
    channelIds: string[];
    /**
     * @generated from field: tank.crew.v1.Activity activity = 11;
     */
    activity: Activity;
    /**
     * 0 = no cap
     *
     * @generated from field: double daily_cap_usd = 12;
     */
    dailyCapUsd: number;
    /**
     * 0 = the workspace's
     *
     * @generated from field: int32 concurrent_cap = 13;
     */
    concurrentCap: number;
    /**
     * "" = the policy's default
     *
     * @generated from field: string model = 14;
     */
    model: string;
    /**
     * What it did, at the Tread rate.
     *
     * @generated from field: double spend_today_usd = 15;
     */
    spendTodayUsd: number;
    /**
     * @generated from field: double spend_month_usd = 16;
     */
    spendMonthUsd: number;
    /**
     * @generated from field: int32 runs_today = 17;
     */
    runsToday: number;
    /**
     * @generated from field: int32 running_now = 18;
     */
    runningNow: number;
};
/**
 * Describes the message tank.crew.v1.Member.
 * Use `create(MemberSchema)` to create a new message.
 */
export declare const MemberSchema: GenMessage<Member>;
/**
 * A role the switchboard offers ready-made; the skill is a starting point, editable.
 *
 * @generated from message tank.crew.v1.Preset
 */
export type Preset = Message<"tank.crew.v1.Preset"> & {
    /**
     * @generated from field: string role = 1;
     */
    role: string;
    /**
     * @generated from field: string title = 2;
     */
    title: string;
    /**
     * @generated from field: string handle = 3;
     */
    handle: string;
    /**
     * @generated from field: string skill = 4;
     */
    skill: string;
    /**
     * one line for the picker
     *
     * @generated from field: string summary = 5;
     */
    summary: string;
};
/**
 * Describes the message tank.crew.v1.Preset.
 * Use `create(PresetSchema)` to create a new message.
 */
export declare const PresetSchema: GenMessage<Preset>;
/**
 * @generated from message tank.crew.v1.ListCrewRequest
 */
export type ListCrewRequest = Message<"tank.crew.v1.ListCrewRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.crew.v1.ListCrewRequest.
 * Use `create(ListCrewRequestSchema)` to create a new message.
 */
export declare const ListCrewRequestSchema: GenMessage<ListCrewRequest>;
/**
 * @generated from message tank.crew.v1.ListCrewResponse
 */
export type ListCrewResponse = Message<"tank.crew.v1.ListCrewResponse"> & {
    /**
     * @generated from field: repeated tank.crew.v1.Member members = 1;
     */
    members: Member[];
    /**
     * @generated from field: repeated tank.crew.v1.Preset presets = 2;
     */
    presets: Preset[];
    /**
     * @generated from field: bool can_manage = 3;
     */
    canManage: boolean;
};
/**
 * Describes the message tank.crew.v1.ListCrewResponse.
 * Use `create(ListCrewResponseSchema)` to create a new message.
 */
export declare const ListCrewResponseSchema: GenMessage<ListCrewResponse>;
/**
 * Adds a member: provisions its agent principal under the handle. A preset role
 * brings its title, handle and skill; custom needs all three.
 *
 * @generated from message tank.crew.v1.AddMemberRequest
 */
export type AddMemberRequest = Message<"tank.crew.v1.AddMemberRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string role = 2;
     */
    role: string;
    /**
     * @generated from field: string title = 3;
     */
    title: string;
    /**
     * @generated from field: string handle = 4;
     */
    handle: string;
    /**
     * @generated from field: string skill = 5;
     */
    skill: string;
};
/**
 * Describes the message tank.crew.v1.AddMemberRequest.
 * Use `create(AddMemberRequestSchema)` to create a new message.
 */
export declare const AddMemberRequestSchema: GenMessage<AddMemberRequest>;
/**
 * @generated from message tank.crew.v1.AddMemberResponse
 */
export type AddMemberResponse = Message<"tank.crew.v1.AddMemberResponse"> & {
    /**
     * @generated from field: tank.crew.v1.Member member = 1;
     */
    member?: Member;
};
/**
 * Describes the message tank.crew.v1.AddMemberResponse.
 * Use `create(AddMemberResponseSchema)` to create a new message.
 */
export declare const AddMemberResponseSchema: GenMessage<AddMemberResponse>;
/**
 * @generated from message tank.crew.v1.UpdateMemberRequest
 */
export type UpdateMemberRequest = Message<"tank.crew.v1.UpdateMemberRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * id names it; title, skill, enabled, treads, channel_ids, activity, caps and model are taken
     *
     * @generated from field: tank.crew.v1.Member member = 2;
     */
    member?: Member;
};
/**
 * Describes the message tank.crew.v1.UpdateMemberRequest.
 * Use `create(UpdateMemberRequestSchema)` to create a new message.
 */
export declare const UpdateMemberRequestSchema: GenMessage<UpdateMemberRequest>;
/**
 * @generated from message tank.crew.v1.UpdateMemberResponse
 */
export type UpdateMemberResponse = Message<"tank.crew.v1.UpdateMemberResponse"> & {
    /**
     * @generated from field: tank.crew.v1.Member member = 1;
     */
    member?: Member;
};
/**
 * Describes the message tank.crew.v1.UpdateMemberResponse.
 * Use `create(UpdateMemberResponseSchema)` to create a new message.
 */
export declare const UpdateMemberResponseSchema: GenMessage<UpdateMemberResponse>;
/**
 * Removes a member. Its runs stop being started; what it said stays.
 *
 * @generated from message tank.crew.v1.RemoveMemberRequest
 */
export type RemoveMemberRequest = Message<"tank.crew.v1.RemoveMemberRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string member_id = 2;
     */
    memberId: string;
};
/**
 * Describes the message tank.crew.v1.RemoveMemberRequest.
 * Use `create(RemoveMemberRequestSchema)` to create a new message.
 */
export declare const RemoveMemberRequestSchema: GenMessage<RemoveMemberRequest>;
/**
 * @generated from message tank.crew.v1.RemoveMemberResponse
 */
export type RemoveMemberResponse = Message<"tank.crew.v1.RemoveMemberResponse"> & {};
/**
 * Describes the message tank.crew.v1.RemoveMemberResponse.
 * Use `create(RemoveMemberResponseSchema)` to create a new message.
 */
export declare const RemoveMemberResponseSchema: GenMessage<RemoveMemberResponse>;
/**
 * Where a member works.
 *
 * @generated from enum tank.crew.v1.Treads
 */
export declare enum Treads {
    /**
     * @generated from enum value: TREADS_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * every Tread in the workspace
     *
     * @generated from enum value: TREADS_ALL = 1;
     */
    ALL = 1,
    /**
     * the channel_ids on the member
     *
     * @generated from enum value: TREADS_SELECTED = 2;
     */
    SELECTED = 2
}
/**
 * Describes the enum tank.crew.v1.Treads.
 */
export declare const TreadsSchema: GenEnum<Treads>;
/**
 * How much a member speaks up without being asked. Mentioned-only means never;
 * the rest set how often it reads a Tread it is in and may add something.
 *
 * @generated from enum tank.crew.v1.Activity
 */
export declare enum Activity {
    /**
     * @generated from enum value: ACTIVITY_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * only when @mentioned
     *
     * @generated from enum value: ACTIVITY_MENTIONED = 1;
     */
    MENTIONED = 1,
    /**
     * about once a day per Tread
     *
     * @generated from enum value: ACTIVITY_LOW = 2;
     */
    LOW = 2,
    /**
     * every few hours
     *
     * @generated from enum value: ACTIVITY_NORMAL = 3;
     */
    NORMAL = 3,
    /**
     * every half hour
     *
     * @generated from enum value: ACTIVITY_HIGH = 4;
     */
    HIGH = 4
}
/**
 * Describes the enum tank.crew.v1.Activity.
 */
export declare const ActivitySchema: GenEnum<Activity>;
/**
 * @generated from service tank.crew.v1.CrewService
 */
export declare const CrewService: GenService<{
    /**
     * @generated from rpc tank.crew.v1.CrewService.ListCrew
     */
    listCrew: {
        methodKind: "unary";
        input: typeof ListCrewRequestSchema;
        output: typeof ListCrewResponseSchema;
    };
    /**
     * @generated from rpc tank.crew.v1.CrewService.AddMember
     */
    addMember: {
        methodKind: "unary";
        input: typeof AddMemberRequestSchema;
        output: typeof AddMemberResponseSchema;
    };
    /**
     * @generated from rpc tank.crew.v1.CrewService.UpdateMember
     */
    updateMember: {
        methodKind: "unary";
        input: typeof UpdateMemberRequestSchema;
        output: typeof UpdateMemberResponseSchema;
    };
    /**
     * @generated from rpc tank.crew.v1.CrewService.RemoveMember
     */
    removeMember: {
        methodKind: "unary";
        input: typeof RemoveMemberRequestSchema;
        output: typeof RemoveMemberResponseSchema;
    };
}>;
