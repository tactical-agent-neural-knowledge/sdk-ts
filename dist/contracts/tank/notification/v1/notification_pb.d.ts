import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
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
 * @generated from message tank.notification.v1.RegisterDeviceRequest
 */
export type RegisterDeviceRequest = Message<"tank.notification.v1.RegisterDeviceRequest"> & {
    /**
     * @generated from field: tank.notification.v1.PushPlatform platform = 1;
     */
    platform: PushPlatform;
    /**
     * APNs/FCM: the device token. Web: the subscription endpoint URL.
     *
     * @generated from field: string token = 2;
     */
    token: string;
    /**
     * Web Push only: the subscription's p256dh and auth keys, which are what
     * encrypt the payload to that browser. Useless to anyone else, but they are
     * still per-subscription secrets.
     *
     * @generated from field: string p256dh = 3;
     */
    p256dh: string;
    /**
     * @generated from field: string auth = 4;
     */
    auth: string;
    /**
     * For the Apple side: which build, so a token is pushed through the right
     * topic.
     *
     * @generated from field: string bundle_id = 5;
     */
    bundleId: string;
    /**
     * Free-form, for support: "iPhone 15 Pro, iOS 18.2".
     *
     * @generated from field: string description = 6;
     */
    description: string;
    /**
     * Apple only: whether this token came from a build signed with the production
     * push entitlement.
     *
     * It is a property of the build, not of the account, and both kinds exist at
     * once: a dev-client build's token is only valid on Apple's sandbox gateway,
     * and a TestFlight or App Store build's token only on production. Sending to
     * the wrong one is accepted and silently dropped, which is indistinguishable
     * from push being broken — so the device says which it is rather than the
     * server guessing.
     *
     * @generated from field: bool apns_production = 7;
     */
    apnsProduction: boolean;
};
/**
 * Describes the message tank.notification.v1.RegisterDeviceRequest.
 * Use `create(RegisterDeviceRequestSchema)` to create a new message.
 */
export declare const RegisterDeviceRequestSchema: GenMessage<RegisterDeviceRequest>;
/**
 * @generated from message tank.notification.v1.RegisterDeviceResponse
 */
export type RegisterDeviceResponse = Message<"tank.notification.v1.RegisterDeviceResponse"> & {
    /**
     * @generated from field: string device_id = 1;
     */
    deviceId: string;
};
/**
 * Describes the message tank.notification.v1.RegisterDeviceResponse.
 * Use `create(RegisterDeviceResponseSchema)` to create a new message.
 */
export declare const RegisterDeviceResponseSchema: GenMessage<RegisterDeviceResponse>;
/**
 * @generated from message tank.notification.v1.UnregisterDeviceRequest
 */
export type UnregisterDeviceRequest = Message<"tank.notification.v1.UnregisterDeviceRequest"> & {
    /**
     * The token to forget. Taken rather than a device id so a client that has
     * lost its local state can still clean up after itself.
     *
     * @generated from field: string token = 1;
     */
    token: string;
};
/**
 * Describes the message tank.notification.v1.UnregisterDeviceRequest.
 * Use `create(UnregisterDeviceRequestSchema)` to create a new message.
 */
export declare const UnregisterDeviceRequestSchema: GenMessage<UnregisterDeviceRequest>;
/**
 * @generated from message tank.notification.v1.UnregisterDeviceResponse
 */
export type UnregisterDeviceResponse = Message<"tank.notification.v1.UnregisterDeviceResponse"> & {};
/**
 * Describes the message tank.notification.v1.UnregisterDeviceResponse.
 * Use `create(UnregisterDeviceResponseSchema)` to create a new message.
 */
export declare const UnregisterDeviceResponseSchema: GenMessage<UnregisterDeviceResponse>;
/**
 * How a device is reached.
 *
 * @generated from enum tank.notification.v1.PushPlatform
 */
export declare enum PushPlatform {
    /**
     * @generated from enum value: PUSH_PLATFORM_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Apple, via APNs. The token is the native device token, not an Expo one:
     * Expo's push service would put a third party between us and every message
     * people receive.
     *
     * @generated from enum value: PUSH_PLATFORM_APNS = 1;
     */
    APNS = 1,
    /**
     * Android, via FCM v1.
     *
     * @generated from enum value: PUSH_PLATFORM_FCM = 2;
     */
    FCM = 2,
    /**
     * A browser, via the Web Push protocol. The "token" is the subscription's
     * endpoint; keys travel in the fields below.
     *
     * @generated from enum value: PUSH_PLATFORM_WEB = 3;
     */
    WEB = 3
}
/**
 * Describes the enum tank.notification.v1.PushPlatform.
 */
export declare const PushPlatformSchema: GenEnum<PushPlatform>;
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
    /**
     * Register this device to receive pushes. Idempotent on the token, because
     * the client calls it on every launch — a token is the identity here, not the
     * row.
     *
     * @generated from rpc tank.notification.v1.NotificationService.RegisterDevice
     */
    registerDevice: {
        methodKind: "unary";
        input: typeof RegisterDeviceRequestSchema;
        output: typeof RegisterDeviceResponseSchema;
    };
    /**
     * Stop pushing to this device. Called on sign-out, so somebody else using the
     * phone afterwards does not receive your messages.
     *
     * @generated from rpc tank.notification.v1.NotificationService.UnregisterDevice
     */
    unregisterDevice: {
        methodKind: "unary";
        input: typeof UnregisterDeviceRequestSchema;
        output: typeof UnregisterDeviceResponseSchema;
    };
}>;
