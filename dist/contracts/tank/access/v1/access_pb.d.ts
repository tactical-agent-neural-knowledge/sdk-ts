import type { GenEnum, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/access/v1/access.proto.
 */
export declare const file_tank_access_v1_access: GenFile;
/**
 * @generated from message tank.access.v1.Grant
 */
export type Grant = Message<"tank.access.v1.Grant"> & {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
    /**
     * @generated from field: tank.access.v1.Role role = 2;
     */
    role: Role;
    /**
     * @generated from field: tank.access.v1.Source source = 3;
     */
    source: Source;
    /**
     * False for the owner, admins and Tread members.
     *
     * @generated from field: bool removable = 4;
     */
    removable: boolean;
    /**
     * False for the owner and admins, whose role is fixed at manage.
     *
     * @generated from field: bool role_editable = 5;
     */
    roleEditable: boolean;
    /**
     * @generated from field: string granted_by = 6;
     */
    grantedBy: string;
};
/**
 * Describes the message tank.access.v1.Grant.
 * Use `create(GrantSchema)` to create a new message.
 */
export declare const GrantSchema: GenMessage<Grant>;
/**
 * An invitation made with the item, on create.
 *
 * @generated from message tank.access.v1.Invite
 */
export type Invite = Message<"tank.access.v1.Invite"> & {
    /**
     * @generated from field: string user_id = 1;
     */
    userId: string;
    /**
     * @generated from field: tank.access.v1.Role role = 2;
     */
    role: Role;
};
/**
 * Describes the message tank.access.v1.Invite.
 * Use `create(InviteSchema)` to create a new message.
 */
export declare const InviteSchema: GenMessage<Invite>;
/**
 * @generated from enum tank.access.v1.Role
 */
export declare enum Role {
    /**
     * no access
     *
     * @generated from enum value: ROLE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * read it
     *
     * @generated from enum value: ROLE_VIEW = 1;
     */
    VIEW = 1,
    /**
     * change what is in it
     *
     * @generated from enum value: ROLE_EDIT = 2;
     */
    EDIT = 2,
    /**
     * and share, rename, move and delete it
     *
     * @generated from enum value: ROLE_MANAGE = 3;
     */
    MANAGE = 3
}
/**
 * Describes the enum tank.access.v1.Role.
 */
export declare const RoleSchema: GenEnum<Role>;
/**
 * Why somebody has access, which decides whether they can be removed.
 *
 * @generated from enum tank.access.v1.Source
 */
export declare enum Source {
    /**
     * @generated from enum value: SOURCE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * made it; always manages
     *
     * @generated from enum value: SOURCE_OWNER = 1;
     */
    OWNER = 1,
    /**
     * a workspace owner or admin; always manages
     *
     * @generated from enum value: SOURCE_ADMIN = 2;
     */
    ADMIN = 2,
    /**
     * in its Tread; the role can change, the access cannot go
     *
     * @generated from enum value: SOURCE_TREAD = 3;
     */
    TREAD = 3,
    /**
     * invited; removable
     *
     * @generated from enum value: SOURCE_INVITED = 4;
     */
    INVITED = 4
}
/**
 * Describes the enum tank.access.v1.Source.
 */
export declare const SourceSchema: GenEnum<Source>;
