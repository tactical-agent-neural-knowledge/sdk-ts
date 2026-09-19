import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/notification/v1/notification.proto.
 */
export declare const file_tank_notification_v1_notification: GenFile;
/**
 * A notification is written by the core's notify worker from bus events and
 * read back here. kind: mention | dm | thread_reply | reaction |
 * channel_invite | agent_needs_input.
 *
 * @generated from message tank.notification.v1.Notification
 */
export type Notification = Message<"tank.notification.v1.Notification"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * @generated from field: string user_id = 3;
     */
    userId: string;
    /**
     * @generated from field: string kind = 4;
     */
    kind: string;
    /**
     * @generated from field: string message_id = 5;
     */
    messageId: string;
    /**
     * @generated from field: string channel_id = 6;
     */
    channelId: string;
    /**
     * @generated from field: string actor_id = 7;
     */
    actorId: string;
    /**
     * @generated from field: google.protobuf.Timestamp read_at = 8;
     */
    readAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 9;
     */
    createdAt?: Timestamp;
};
/**
 * Describes the message tank.notification.v1.Notification.
 * Use `create(NotificationSchema)` to create a new message.
 */
export declare const NotificationSchema: GenMessage<Notification>;
/**
 * @generated from message tank.notification.v1.ListNotificationsRequest
 */
export type ListNotificationsRequest = Message<"tank.notification.v1.ListNotificationsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: bool unread_only = 2;
     */
    unreadOnly: boolean;
    /**
     * opaque; newest first
     *
     * @generated from field: string cursor = 3;
     */
    cursor: string;
    /**
     * @generated from field: int32 limit = 4;
     */
    limit: number;
};
/**
 * Describes the message tank.notification.v1.ListNotificationsRequest.
 * Use `create(ListNotificationsRequestSchema)` to create a new message.
 */
export declare const ListNotificationsRequestSchema: GenMessage<ListNotificationsRequest>;
/**
 * @generated from message tank.notification.v1.ListNotificationsResponse
 */
export type ListNotificationsResponse = Message<"tank.notification.v1.ListNotificationsResponse"> & {
    /**
     * @generated from field: repeated tank.notification.v1.Notification notifications = 1;
     */
    notifications: Notification[];
    /**
     * @generated from field: string next_cursor = 2;
     */
    nextCursor: string;
    /**
     * total unread in the workspace, independent of paging
     *
     * @generated from field: int32 unread_count = 3;
     */
    unreadCount: number;
};
/**
 * Describes the message tank.notification.v1.ListNotificationsResponse.
 * Use `create(ListNotificationsResponseSchema)` to create a new message.
 */
export declare const ListNotificationsResponseSchema: GenMessage<ListNotificationsResponse>;
/**
 * @generated from message tank.notification.v1.MarkNotificationsReadRequest
 */
export type MarkNotificationsReadRequest = Message<"tank.notification.v1.MarkNotificationsReadRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * empty = every unread notification in the workspace
     *
     * @generated from field: repeated string notification_ids = 2;
     */
    notificationIds: string[];
};
/**
 * Describes the message tank.notification.v1.MarkNotificationsReadRequest.
 * Use `create(MarkNotificationsReadRequestSchema)` to create a new message.
 */
export declare const MarkNotificationsReadRequestSchema: GenMessage<MarkNotificationsReadRequest>;
/**
 * @generated from message tank.notification.v1.MarkNotificationsReadResponse
 */
export type MarkNotificationsReadResponse = Message<"tank.notification.v1.MarkNotificationsReadResponse"> & {};
/**
 * Describes the message tank.notification.v1.MarkNotificationsReadResponse.
 * Use `create(MarkNotificationsReadResponseSchema)` to create a new message.
 */
export declare const MarkNotificationsReadResponseSchema: GenMessage<MarkNotificationsReadResponse>;
/**
 * @generated from service tank.notification.v1.NotificationService
 */
export declare const NotificationService: GenService<{
    /**
     * @generated from rpc tank.notification.v1.NotificationService.ListNotifications
     */
    listNotifications: {
        methodKind: "unary";
        input: typeof ListNotificationsRequestSchema;
        output: typeof ListNotificationsResponseSchema;
    };
    /**
     * @generated from rpc tank.notification.v1.NotificationService.MarkNotificationsRead
     */
    markNotificationsRead: {
        methodKind: "unary";
        input: typeof MarkNotificationsReadRequestSchema;
        output: typeof MarkNotificationsReadResponseSchema;
    };
}>;
