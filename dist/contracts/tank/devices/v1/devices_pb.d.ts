import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message as Message$1 } from "../../ai/v1/ai_pb.js";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/devices/v1/devices.proto.
 */
export declare const file_tank_devices_v1_devices: GenFile;
/**
 * What the app can see of a device once connected.
 *
 * @generated from message tank.devices.v1.Device
 */
export type Device = Message<"tank.devices.v1.Device"> & {
    /**
     * "ble", or "phone" for the person's own phone or computer: its camera and its sensors
     * (Robby, 2026-11-10). A phone's sensors are characteristics with made-up UUIDs whose values
     * the app declares (Characteristic.declared), because the operating system already hands
     * them over as numbers with units; the camera is frames (PushReadingsRequest.frame).
     *
     * @generated from field: string transport = 1;
     */
    transport: string;
    /**
     * the advertised local name, if any
     *
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * Device Information: Manufacturer Name String, if readable
     *
     * @generated from field: string manufacturer = 3;
     */
    manufacturer: string;
    /**
     * Device Information: Model Number String
     *
     * @generated from field: string model = 4;
     */
    model: string;
    /**
     * Device Information: Firmware Revision String
     *
     * @generated from field: string firmware = 5;
     */
    firmware: string;
    /**
     * @generated from field: repeated tank.devices.v1.Service services = 6;
     */
    services: Service[];
    /**
     * Bluetooth company identifier from the advertisement's manufacturer data, 0 when absent.
     *
     * @generated from field: uint32 company_id = 7;
     */
    companyId: number;
};
/**
 * Describes the message tank.devices.v1.Device.
 * Use `create(DeviceSchema)` to create a new message.
 */
export declare const DeviceSchema: GenMessage<Device>;
/**
 * @generated from message tank.devices.v1.Service
 */
export type Service = Message<"tank.devices.v1.Service"> & {
    /**
     * lowercase, 128-bit form (0000180d-0000-1000-8000-00805f9b34fb)
     *
     * @generated from field: string uuid = 1;
     */
    uuid: string;
    /**
     * @generated from field: repeated tank.devices.v1.Characteristic characteristics = 2;
     */
    characteristics: Characteristic[];
};
/**
 * Describes the message tank.devices.v1.Service.
 * Use `create(ServiceSchema)` to create a new message.
 */
export declare const ServiceSchema: GenMessage<Service>;
/**
 * @generated from message tank.devices.v1.Characteristic
 */
export type Characteristic = Message<"tank.devices.v1.Characteristic"> & {
    /**
     * @generated from field: string uuid = 1;
     */
    uuid: string;
    /**
     * "read", "write", "write_without_response", "notify", "indicate"; for transport "phone",
     * "notify" on a sensor and "frames" on the camera, whose stills come as PushReadingsRequest.frame
     *
     * @generated from field: repeated string properties = 2;
     */
    properties: string[];
    /**
     * The value read once at connect, when the characteristic is readable (a feature mask, a name).
     *
     * @generated from field: bytes value = 3;
     */
    value: Uint8Array;
    /**
     * A phone sensor's own name ("Accelerometer"), for transport "phone"; empty for Bluetooth.
     *
     * @generated from field: string name = 4;
     */
    name: string;
    /**
     * For transport "phone": what each reading holds, in order, one little-endian float32 per
     * field, as the operating system reported it. Ignored for Bluetooth, whose bytes the server
     * reads itself.
     *
     * @generated from field: repeated tank.devices.v1.DeclaredField declared = 5;
     */
    declared: DeclaredField[];
};
/**
 * Describes the message tank.devices.v1.Characteristic.
 * Use `create(CharacteristicSchema)` to create a new message.
 */
export declare const CharacteristicSchema: GenMessage<Characteristic>;
/**
 * @generated from message tank.devices.v1.DeclaredField
 */
export type DeclaredField = Message<"tank.devices.v1.DeclaredField"> & {
    /**
     * "X", "Pressure"
     *
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * "g", "hPa", "rad/s"; empty when unitless
     *
     * @generated from field: string unit = 2;
     */
    unit: string;
};
/**
 * Describes the message tank.devices.v1.DeclaredField.
 * Use `create(DeclaredFieldSchema)` to create a new message.
 */
export declare const DeclaredFieldSchema: GenMessage<DeclaredField>;
/**
 * One still from a connected camera, JPEG, at most 1 MB.
 *
 * @generated from message tank.devices.v1.Frame
 */
export type Frame = Message<"tank.devices.v1.Frame"> & {
    /**
     * @generated from field: int64 at_ms = 1;
     */
    atMs: bigint;
    /**
     * @generated from field: bytes jpeg = 2;
     */
    jpeg: Uint8Array;
};
/**
 * Describes the message tank.devices.v1.Frame.
 * Use `create(FrameSchema)` to create a new message.
 */
export declare const FrameSchema: GenMessage<Frame>;
/**
 * One notification or read from the device, as raw bytes.
 *
 * @generated from message tank.devices.v1.Reading
 */
export type Reading = Message<"tank.devices.v1.Reading"> & {
    /**
     * @generated from field: string characteristic_uuid = 1;
     */
    characteristicUuid: string;
    /**
     * Milliseconds since the session opened, by the app's clock.
     *
     * @generated from field: int64 at_ms = 2;
     */
    atMs: bigint;
    /**
     * @generated from field: bytes value = 3;
     */
    value: Uint8Array;
};
/**
 * Describes the message tank.devices.v1.Reading.
 * Use `create(ReadingSchema)` to create a new message.
 */
export declare const ReadingSchema: GenMessage<Reading>;
/**
 * One number the server read out of the device's data.
 *
 * @generated from message tank.devices.v1.Point
 */
export type Point = Message<"tank.devices.v1.Point"> & {
    /**
     * Field.key
     *
     * @generated from field: string field = 1;
     */
    field: string;
    /**
     * @generated from field: int64 at_ms = 2;
     */
    atMs: bigint;
    /**
     * @generated from field: double value = 3;
     */
    value: number;
};
/**
 * Describes the message tank.devices.v1.Point.
 * Use `create(PointSchema)` to create a new message.
 */
export declare const PointSchema: GenMessage<Point>;
/**
 * @generated from message tank.devices.v1.Field
 */
export type Field = Message<"tank.devices.v1.Field"> & {
    /**
     * stable within the session: "<characteristic>/<name>"
     *
     * @generated from field: string key = 1;
     */
    key: string;
    /**
     * the field's own name ("Instantaneous Power")
     *
     * @generated from field: string label = 2;
     */
    label: string;
    /**
     * short unit ("W", "rpm", "bpm"), empty when unitless
     *
     * @generated from field: string unit = 3;
     */
    unit: string;
    /**
     * @generated from field: string characteristic_uuid = 4;
     */
    characteristicUuid: string;
    /**
     * Where the reading came from: "standard" (the SIG's published layout), "learned" (a reading
     * Neural worked out and the server has checked against live data), "proposed" (worked out, not
     * yet checked enough).
     *
     * @generated from field: string source = 5;
     */
    source: string;
};
/**
 * Describes the message tank.devices.v1.Field.
 * Use `create(FieldSchema)` to create a new message.
 */
export declare const FieldSchema: GenMessage<Field>;
/**
 * Generic figures for one field, worked out by the server.
 *
 * @generated from message tank.devices.v1.FieldStats
 */
export type FieldStats = Message<"tank.devices.v1.FieldStats"> & {
    /**
     * @generated from field: string field = 1;
     */
    field: string;
    /**
     * @generated from field: double last = 2;
     */
    last: number;
    /**
     * @generated from field: double avg_30s = 3;
     */
    avg30s: number;
    /**
     * @generated from field: double avg_5m = 4;
     */
    avg5m: number;
    /**
     * @generated from field: double avg_session = 5;
     */
    avgSession: number;
    /**
     * @generated from field: double min = 6;
     */
    min: number;
    /**
     * @generated from field: double max = 7;
     */
    max: number;
    /**
     * Change per minute over the last five minutes (least squares), 0 with too little data.
     *
     * @generated from field: double trend_per_min = 8;
     */
    trendPerMin: number;
    /**
     * @generated from field: int64 samples = 9;
     */
    samples: bigint;
};
/**
 * Describes the message tank.devices.v1.FieldStats.
 * Use `create(FieldStatsSchema)` to create a new message.
 */
export declare const FieldStatsSchema: GenMessage<FieldStats>;
/**
 * @generated from message tank.devices.v1.Session
 */
export type Session = Message<"tank.devices.v1.Session"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string conversation_id = 2;
     */
    conversationId: string;
    /**
     * @generated from field: tank.devices.v1.Device device = 3;
     */
    device?: Device;
    /**
     * @generated from field: tank.devices.v1.State state = 4;
     */
    state: State;
    /**
     * What Neural says the device is, in a sentence ("A Wahoo KICKR smart trainer: power, cadence
     * and speed, with resistance control."). Empty while identifying.
     *
     * @generated from field: string identity = 5;
     */
    identity: string;
    /**
     * @generated from field: repeated tank.devices.v1.Field fields = 6;
     */
    fields: Field[];
    /**
     * The characteristics the app should subscribe to (notify or indicate).
     *
     * @generated from field: repeated string subscribe = 7;
     */
    subscribe: string[];
    /**
     * @generated from field: google.protobuf.Timestamp opened_at = 8;
     */
    openedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp closed_at = 9;
     */
    closedAt?: Timestamp;
    /**
     * How Neural speaks while reading, in words ("every minute"; "only when heart rate is over
     * 170"), as the person last set it.
     *
     * @generated from field: string feedback_rule = 10;
     */
    feedbackRule: string;
    /**
     * What the connected camera last showed, in TANK's vision model's words; empty without a
     * camera or before the first frame was looked at.
     *
     * @generated from field: string view = 11;
     */
    view: string;
    /**
     * @generated from field: google.protobuf.Timestamp view_at = 12;
     */
    viewAt?: Timestamp;
    /**
     * Whose device it is. In a conversation with several people everyone sees every connected
     * device, named by its owner; only the owner may send its data or disconnect it.
     *
     * @generated from field: string owner_id = 13;
     */
    ownerId: string;
    /**
     * @generated from field: string owner_name = 14;
     */
    ownerName: string;
};
/**
 * Describes the message tank.devices.v1.Session.
 * Use `create(SessionSchema)` to create a new message.
 */
export declare const SessionSchema: GenMessage<Session>;
/**
 * @generated from message tank.devices.v1.ListCatalogServicesRequest
 */
export type ListCatalogServicesRequest = Message<"tank.devices.v1.ListCatalogServicesRequest"> & {};
/**
 * Describes the message tank.devices.v1.ListCatalogServicesRequest.
 * Use `create(ListCatalogServicesRequestSchema)` to create a new message.
 */
export declare const ListCatalogServicesRequestSchema: GenMessage<ListCatalogServicesRequest>;
/**
 * Every standard service UUID, for an app that must name services before it may open them
 * (Web Bluetooth's optionalServices).
 *
 * @generated from message tank.devices.v1.ListCatalogServicesResponse
 */
export type ListCatalogServicesResponse = Message<"tank.devices.v1.ListCatalogServicesResponse"> & {
    /**
     * @generated from field: repeated string uuids = 1;
     */
    uuids: string[];
};
/**
 * Describes the message tank.devices.v1.ListCatalogServicesResponse.
 * Use `create(ListCatalogServicesResponseSchema)` to create a new message.
 */
export declare const ListCatalogServicesResponseSchema: GenMessage<ListCatalogServicesResponse>;
/**
 * @generated from message tank.devices.v1.OpenSessionRequest
 */
export type OpenSessionRequest = Message<"tank.devices.v1.OpenSessionRequest"> & {
    /**
     * @generated from field: string conversation_id = 1;
     */
    conversationId: string;
    /**
     * @generated from field: tank.devices.v1.Device device = 2;
     */
    device?: Device;
};
/**
 * Describes the message tank.devices.v1.OpenSessionRequest.
 * Use `create(OpenSessionRequestSchema)` to create a new message.
 */
export declare const OpenSessionRequestSchema: GenMessage<OpenSessionRequest>;
/**
 * @generated from message tank.devices.v1.OpenSessionResponse
 */
export type OpenSessionResponse = Message<"tank.devices.v1.OpenSessionResponse"> & {
    /**
     * @generated from field: tank.devices.v1.Session session = 1;
     */
    session?: Session;
};
/**
 * Describes the message tank.devices.v1.OpenSessionResponse.
 * Use `create(OpenSessionResponseSchema)` to create a new message.
 */
export declare const OpenSessionResponseSchema: GenMessage<OpenSessionResponse>;
/**
 * @generated from message tank.devices.v1.PushReadingsRequest
 */
export type PushReadingsRequest = Message<"tank.devices.v1.PushReadingsRequest"> & {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
    /**
     * @generated from field: repeated tank.devices.v1.Reading readings = 2;
     */
    readings: Reading[];
    /**
     * The camera's latest still, when a camera is connected; the server looks at one every few
     * seconds and ignores the rest.
     *
     * @generated from field: tank.devices.v1.Frame frame = 3;
     */
    frame?: Frame;
};
/**
 * Describes the message tank.devices.v1.PushReadingsRequest.
 * Use `create(PushReadingsRequestSchema)` to create a new message.
 */
export declare const PushReadingsRequestSchema: GenMessage<PushReadingsRequest>;
/**
 * @generated from message tank.devices.v1.PushReadingsResponse
 */
export type PushReadingsResponse = Message<"tank.devices.v1.PushReadingsResponse"> & {
    /**
     * The numbers read out of these readings, for the live chart.
     *
     * @generated from field: repeated tank.devices.v1.Point points = 1;
     */
    points: Point[];
    /**
     * The session, when it changed (identified, a field learned, a rule set); absent otherwise.
     *
     * @generated from field: tank.devices.v1.Session session = 2;
     */
    session?: Session;
    /**
     * @generated from field: repeated tank.devices.v1.FieldStats stats = 3;
     */
    stats: FieldStats[];
    /**
     * Neural's feedback written since the last push, already stored in the conversation.
     *
     * @generated from field: repeated tank.ai.v1.Message messages = 4;
     */
    messages: Message$1[];
};
/**
 * Describes the message tank.devices.v1.PushReadingsResponse.
 * Use `create(PushReadingsResponseSchema)` to create a new message.
 */
export declare const PushReadingsResponseSchema: GenMessage<PushReadingsResponse>;
/**
 * @generated from message tank.devices.v1.GetSessionRequest
 */
export type GetSessionRequest = Message<"tank.devices.v1.GetSessionRequest"> & {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
    /**
     * Points newer than this, for an app reopening a session; 0 sends the last five minutes.
     *
     * @generated from field: int64 since_ms = 2;
     */
    sinceMs: bigint;
};
/**
 * Describes the message tank.devices.v1.GetSessionRequest.
 * Use `create(GetSessionRequestSchema)` to create a new message.
 */
export declare const GetSessionRequestSchema: GenMessage<GetSessionRequest>;
/**
 * @generated from message tank.devices.v1.GetSessionResponse
 */
export type GetSessionResponse = Message<"tank.devices.v1.GetSessionResponse"> & {
    /**
     * @generated from field: tank.devices.v1.Session session = 1;
     */
    session?: Session;
    /**
     * @generated from field: repeated tank.devices.v1.Point points = 2;
     */
    points: Point[];
    /**
     * @generated from field: repeated tank.devices.v1.FieldStats stats = 3;
     */
    stats: FieldStats[];
};
/**
 * Describes the message tank.devices.v1.GetSessionResponse.
 * Use `create(GetSessionResponseSchema)` to create a new message.
 */
export declare const GetSessionResponseSchema: GenMessage<GetSessionResponse>;
/**
 * @generated from message tank.devices.v1.ListSessionsRequest
 */
export type ListSessionsRequest = Message<"tank.devices.v1.ListSessionsRequest"> & {
    /**
     * @generated from field: string conversation_id = 1;
     */
    conversationId: string;
};
/**
 * Describes the message tank.devices.v1.ListSessionsRequest.
 * Use `create(ListSessionsRequestSchema)` to create a new message.
 */
export declare const ListSessionsRequestSchema: GenMessage<ListSessionsRequest>;
/**
 * @generated from message tank.devices.v1.ListSessionsResponse
 */
export type ListSessionsResponse = Message<"tank.devices.v1.ListSessionsResponse"> & {
    /**
     * @generated from field: repeated tank.devices.v1.Session sessions = 1;
     */
    sessions: Session[];
};
/**
 * Describes the message tank.devices.v1.ListSessionsResponse.
 * Use `create(ListSessionsResponseSchema)` to create a new message.
 */
export declare const ListSessionsResponseSchema: GenMessage<ListSessionsResponse>;
/**
 * @generated from message tank.devices.v1.CloseSessionRequest
 */
export type CloseSessionRequest = Message<"tank.devices.v1.CloseSessionRequest"> & {
    /**
     * @generated from field: string session_id = 1;
     */
    sessionId: string;
};
/**
 * Describes the message tank.devices.v1.CloseSessionRequest.
 * Use `create(CloseSessionRequestSchema)` to create a new message.
 */
export declare const CloseSessionRequestSchema: GenMessage<CloseSessionRequest>;
/**
 * @generated from message tank.devices.v1.CloseSessionResponse
 */
export type CloseSessionResponse = Message<"tank.devices.v1.CloseSessionResponse"> & {
    /**
     * @generated from field: tank.devices.v1.Session session = 1;
     */
    session?: Session;
    /**
     * Neural's summary of the session, stored in the conversation.
     *
     * @generated from field: tank.ai.v1.Message summary = 2;
     */
    summary?: Message$1;
};
/**
 * Describes the message tank.devices.v1.CloseSessionResponse.
 * Use `create(CloseSessionResponseSchema)` to create a new message.
 */
export declare const CloseSessionResponseSchema: GenMessage<CloseSessionResponse>;
/**
 * @generated from enum tank.devices.v1.State
 */
export declare enum State {
    /**
     * @generated from enum value: STATE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Neural is working out what the device is
     *
     * @generated from enum value: STATE_IDENTIFYING = 1;
     */
    IDENTIFYING = 1,
    /**
     * fields are known and being read
     *
     * @generated from enum value: STATE_READING = 2;
     */
    READING = 2,
    /**
     * @generated from enum value: STATE_CLOSED = 3;
     */
    CLOSED = 3
}
/**
 * Describes the enum tank.devices.v1.State.
 */
export declare const StateSchema: GenEnum<State>;
/**
 * @generated from service tank.devices.v1.DeviceService
 */
export declare const DeviceService: GenService<{
    /**
     * @generated from rpc tank.devices.v1.DeviceService.ListCatalogServices
     */
    listCatalogServices: {
        methodKind: "unary";
        input: typeof ListCatalogServicesRequestSchema;
        output: typeof ListCatalogServicesResponseSchema;
    };
    /**
     * @generated from rpc tank.devices.v1.DeviceService.OpenSession
     */
    openSession: {
        methodKind: "unary";
        input: typeof OpenSessionRequestSchema;
        output: typeof OpenSessionResponseSchema;
    };
    /**
     * @generated from rpc tank.devices.v1.DeviceService.PushReadings
     */
    pushReadings: {
        methodKind: "unary";
        input: typeof PushReadingsRequestSchema;
        output: typeof PushReadingsResponseSchema;
    };
    /**
     * @generated from rpc tank.devices.v1.DeviceService.GetSession
     */
    getSession: {
        methodKind: "unary";
        input: typeof GetSessionRequestSchema;
        output: typeof GetSessionResponseSchema;
    };
    /**
     * @generated from rpc tank.devices.v1.DeviceService.ListSessions
     */
    listSessions: {
        methodKind: "unary";
        input: typeof ListSessionsRequestSchema;
        output: typeof ListSessionsResponseSchema;
    };
    /**
     * @generated from rpc tank.devices.v1.DeviceService.CloseSession
     */
    closeSession: {
        methodKind: "unary";
        input: typeof CloseSessionRequestSchema;
        output: typeof CloseSessionResponseSchema;
    };
}>;
