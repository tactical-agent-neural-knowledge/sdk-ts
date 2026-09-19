import type { GenEnum, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { AgentStatus, Envelope, PresenceChanged, Typing } from "../../events/v1/events_pb.js";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/realtime/v1/realtime.proto.
 */
export declare const file_tank_realtime_v1_realtime: GenFile;
/**
 * @generated from message tank.realtime.v1.Hello
 */
export type Hello = Message<"tank.realtime.v1.Hello"> & {
    /**
     * @generated from field: string access_token = 1;
     */
    accessToken: string;
    /**
     * @generated from field: repeated string workspace_ids = 2;
     */
    workspaceIds: string[];
    /**
     * @generated from field: repeated string capabilities = 3;
     */
    capabilities: string[];
};
/**
 * Describes the message tank.realtime.v1.Hello.
 * Use `create(HelloSchema)` to create a new message.
 */
export declare const HelloSchema: GenMessage<Hello>;
/**
 * @generated from message tank.realtime.v1.Resume
 */
export type Resume = Message<"tank.realtime.v1.Resume"> & {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
    /**
     * @generated from field: string resume_token = 2;
     */
    resumeToken: string;
    /**
     * JetStream stream sequence of the last event applied, per workspace.
     *
     * @generated from field: map<string, int64> cursors = 3;
     */
    cursors: {
        [key: string]: bigint;
    };
};
/**
 * Describes the message tank.realtime.v1.Resume.
 * Use `create(ResumeSchema)` to create a new message.
 */
export declare const ResumeSchema: GenMessage<Resume>;
/**
 * @generated from message tank.realtime.v1.Subscribe
 */
export type Subscribe = Message<"tank.realtime.v1.Subscribe"> & {
    /**
     * @generated from field: repeated string channel_ids = 1;
     */
    channelIds: string[];
    /**
     * @generated from field: repeated string thread_root_ids = 2;
     */
    threadRootIds: string[];
};
/**
 * Describes the message tank.realtime.v1.Subscribe.
 * Use `create(SubscribeSchema)` to create a new message.
 */
export declare const SubscribeSchema: GenMessage<Subscribe>;
/**
 * @generated from message tank.realtime.v1.Unsubscribe
 */
export type Unsubscribe = Message<"tank.realtime.v1.Unsubscribe"> & {
    /**
     * @generated from field: repeated string channel_ids = 1;
     */
    channelIds: string[];
    /**
     * @generated from field: repeated string thread_root_ids = 2;
     */
    threadRootIds: string[];
};
/**
 * Describes the message tank.realtime.v1.Unsubscribe.
 * Use `create(UnsubscribeSchema)` to create a new message.
 */
export declare const UnsubscribeSchema: GenMessage<Unsubscribe>;
/**
 * @generated from message tank.realtime.v1.PresenceSubscribe
 */
export type PresenceSubscribe = Message<"tank.realtime.v1.PresenceSubscribe"> & {
    /**
     * max 500, replaces the previous set
     *
     * @generated from field: repeated string user_ids = 1;
     */
    userIds: string[];
};
/**
 * Describes the message tank.realtime.v1.PresenceSubscribe.
 * Use `create(PresenceSubscribeSchema)` to create a new message.
 */
export declare const PresenceSubscribeSchema: GenMessage<PresenceSubscribe>;
/**
 * @generated from message tank.realtime.v1.TypingFrame
 */
export type TypingFrame = Message<"tank.realtime.v1.TypingFrame"> & {
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
 * Describes the message tank.realtime.v1.TypingFrame.
 * Use `create(TypingFrameSchema)` to create a new message.
 */
export declare const TypingFrameSchema: GenMessage<TypingFrame>;
/**
 * @generated from message tank.realtime.v1.Focus
 */
export type Focus = Message<"tank.realtime.v1.Focus"> & {
    /**
     * channel the client is looking at; suppresses push
     *
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
};
/**
 * Describes the message tank.realtime.v1.Focus.
 * Use `create(FocusSchema)` to create a new message.
 */
export declare const FocusSchema: GenMessage<Focus>;
/**
 * @generated from message tank.realtime.v1.Ping
 */
export type Ping = Message<"tank.realtime.v1.Ping"> & {};
/**
 * Describes the message tank.realtime.v1.Ping.
 * Use `create(PingSchema)` to create a new message.
 */
export declare const PingSchema: GenMessage<Ping>;
/**
 * @generated from message tank.realtime.v1.ClientFrame
 */
export type ClientFrame = Message<"tank.realtime.v1.ClientFrame"> & {
    /**
     * @generated from oneof tank.realtime.v1.ClientFrame.kind
     */
    kind: {
        /**
         * @generated from field: tank.realtime.v1.Hello hello = 1;
         */
        value: Hello;
        case: "hello";
    } | {
        /**
         * @generated from field: tank.realtime.v1.Resume resume = 2;
         */
        value: Resume;
        case: "resume";
    } | {
        /**
         * @generated from field: tank.realtime.v1.Subscribe subscribe = 3;
         */
        value: Subscribe;
        case: "subscribe";
    } | {
        /**
         * @generated from field: tank.realtime.v1.Unsubscribe unsubscribe = 4;
         */
        value: Unsubscribe;
        case: "unsubscribe";
    } | {
        /**
         * @generated from field: tank.realtime.v1.PresenceSubscribe presence_subscribe = 5;
         */
        value: PresenceSubscribe;
        case: "presenceSubscribe";
    } | {
        /**
         * @generated from field: tank.realtime.v1.TypingFrame typing = 6;
         */
        value: TypingFrame;
        case: "typing";
    } | {
        /**
         * @generated from field: tank.realtime.v1.Focus focus = 7;
         */
        value: Focus;
        case: "focus";
    } | {
        /**
         * @generated from field: tank.realtime.v1.Ping ping = 8;
         */
        value: Ping;
        case: "ping";
    } | {
        case: undefined;
        value?: undefined;
    };
};
/**
 * Describes the message tank.realtime.v1.ClientFrame.
 * Use `create(ClientFrameSchema)` to create a new message.
 */
export declare const ClientFrameSchema: GenMessage<ClientFrame>;
/**
 * @generated from message tank.realtime.v1.Ready
 */
export type Ready = Message<"tank.realtime.v1.Ready"> & {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
    /**
     * @generated from field: string resume_token = 2;
     */
    resumeToken: string;
    /**
     * @generated from field: int32 heartbeat_interval_ms = 3;
     */
    heartbeatIntervalMs: number;
    /**
     * @generated from field: google.protobuf.Timestamp server_time = 4;
     */
    serverTime?: Timestamp;
};
/**
 * Describes the message tank.realtime.v1.Ready.
 * Use `create(ReadySchema)` to create a new message.
 */
export declare const ReadySchema: GenMessage<Ready>;
/**
 * @generated from message tank.realtime.v1.Resumed
 */
export type Resumed = Message<"tank.realtime.v1.Resumed"> & {
    /**
     * @generated from field: int32 replayed = 1;
     */
    replayed: number;
};
/**
 * Describes the message tank.realtime.v1.Resumed.
 * Use `create(ResumedSchema)` to create a new message.
 */
export declare const ResumedSchema: GenMessage<Resumed>;
/**
 * @generated from message tank.realtime.v1.ResyncRequired
 */
export type ResyncRequired = Message<"tank.realtime.v1.ResyncRequired"> & {
    /**
     * @generated from field: string reason = 1;
     */
    reason: string;
};
/**
 * Describes the message tank.realtime.v1.ResyncRequired.
 * Use `create(ResyncRequiredSchema)` to create a new message.
 */
export declare const ResyncRequiredSchema: GenMessage<ResyncRequired>;
/**
 * @generated from message tank.realtime.v1.Event
 */
export type Event = Message<"tank.realtime.v1.Event"> & {
    /**
     * stream sequence; persist and send back in Resume
     *
     * @generated from field: int64 cursor = 1;
     */
    cursor: bigint;
    /**
     * @generated from field: tank.events.v1.Envelope envelope = 2;
     */
    envelope?: Envelope;
};
/**
 * Describes the message tank.realtime.v1.Event.
 * Use `create(EventSchema)` to create a new message.
 */
export declare const EventSchema: GenMessage<Event>;
/**
 * @generated from message tank.realtime.v1.Pong
 */
export type Pong = Message<"tank.realtime.v1.Pong"> & {};
/**
 * Describes the message tank.realtime.v1.Pong.
 * Use `create(PongSchema)` to create a new message.
 */
export declare const PongSchema: GenMessage<Pong>;
/**
 * @generated from message tank.realtime.v1.Error
 */
export type Error = Message<"tank.realtime.v1.Error"> & {
    /**
     * @generated from field: tank.realtime.v1.ErrorCode code = 1;
     */
    code: ErrorCode;
    /**
     * @generated from field: string message = 2;
     */
    message: string;
};
/**
 * Describes the message tank.realtime.v1.Error.
 * Use `create(ErrorSchema)` to create a new message.
 */
export declare const ErrorSchema: GenMessage<Error>;
/**
 * @generated from message tank.realtime.v1.ServerFrame
 */
export type ServerFrame = Message<"tank.realtime.v1.ServerFrame"> & {
    /**
     * @generated from oneof tank.realtime.v1.ServerFrame.kind
     */
    kind: {
        /**
         * @generated from field: tank.realtime.v1.Ready ready = 1;
         */
        value: Ready;
        case: "ready";
    } | {
        /**
         * @generated from field: tank.realtime.v1.Resumed resumed = 2;
         */
        value: Resumed;
        case: "resumed";
    } | {
        /**
         * @generated from field: tank.realtime.v1.ResyncRequired resync_required = 3;
         */
        value: ResyncRequired;
        case: "resyncRequired";
    } | {
        /**
         * @generated from field: tank.realtime.v1.Event event = 4;
         */
        value: Event;
        case: "event";
    } | {
        /**
         * @generated from field: tank.realtime.v1.Pong pong = 5;
         */
        value: Pong;
        case: "pong";
    } | {
        /**
         * @generated from field: tank.realtime.v1.Error error = 6;
         */
        value: Error;
        case: "error";
    } | {
        /**
         * @generated from field: tank.events.v1.Typing typing = 7;
         */
        value: Typing;
        case: "typing";
    } | {
        /**
         * @generated from field: tank.events.v1.PresenceChanged presence = 8;
         */
        value: PresenceChanged;
        case: "presence";
    } | {
        /**
         * @generated from field: tank.events.v1.AgentStatus agent_status = 9;
         */
        value: AgentStatus;
        case: "agentStatus";
    } | {
        case: undefined;
        value?: undefined;
    };
};
/**
 * Describes the message tank.realtime.v1.ServerFrame.
 * Use `create(ServerFrameSchema)` to create a new message.
 */
export declare const ServerFrameSchema: GenMessage<ServerFrame>;
/**
 * @generated from enum tank.realtime.v1.ErrorCode
 */
export declare enum ErrorCode {
    /**
     * @generated from enum value: ERROR_CODE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: ERROR_CODE_UNAUTHENTICATED = 1;
     */
    UNAUTHENTICATED = 1,
    /**
     * @generated from enum value: ERROR_CODE_SLOW_CONSUMER = 2;
     */
    SLOW_CONSUMER = 2,
    /**
     * @generated from enum value: ERROR_CODE_BAD_FRAME = 3;
     */
    BAD_FRAME = 3,
    /**
     * @generated from enum value: ERROR_CODE_RATE_LIMITED = 4;
     */
    RATE_LIMITED = 4
}
/**
 * Describes the enum tank.realtime.v1.ErrorCode.
 */
export declare const ErrorCodeSchema: GenEnum<ErrorCode>;
