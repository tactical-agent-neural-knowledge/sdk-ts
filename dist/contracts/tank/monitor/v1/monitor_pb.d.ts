import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/monitor/v1/monitor.proto.
 */
export declare const file_tank_monitor_v1_monitor: GenFile;
/**
 * @generated from message tank.monitor.v1.Point
 */
export type Point = Message<"tank.monitor.v1.Point"> & {
    /**
     * @generated from field: google.protobuf.Timestamp at = 1;
     */
    at?: Timestamp;
    /**
     * @generated from field: double value = 2;
     */
    value: number;
    /**
     * for TEXT and STATUS widgets: the reason, the paragraph (supports Markdown)
     *
     * @generated from field: string text = 3;
     */
    text: string;
    /**
     * for TABLE widgets and labelled series
     *
     * @generated from field: string labels_json = 4;
     */
    labelsJson: string;
    /**
     * optional: makes text clickable (for TEXT widgets)
     *
     * @generated from field: string url = 5;
     */
    url: string;
};
/**
 * Describes the message tank.monitor.v1.Point.
 * Use `create(PointSchema)` to create a new message.
 */
export declare const PointSchema: GenMessage<Point>;
/**
 * Where a widget sits on the grid, in 12-column units.
 *
 * @generated from message tank.monitor.v1.Position
 */
export type Position = Message<"tank.monitor.v1.Position"> & {
    /**
     * @generated from field: int32 x = 1;
     */
    x: number;
    /**
     * @generated from field: int32 y = 2;
     */
    y: number;
    /**
     * @generated from field: int32 w = 3;
     */
    w: number;
    /**
     * @generated from field: int32 h = 4;
     */
    h: number;
};
/**
 * Describes the message tank.monitor.v1.Position.
 * Use `create(PositionSchema)` to create a new message.
 */
export declare const PositionSchema: GenMessage<Position>;
/**
 * @generated from message tank.monitor.v1.Thresholds
 */
export type Thresholds = Message<"tank.monitor.v1.Thresholds"> & {
    /**
     * Unset (NaN is not sent; absent means none) leaves the widget without a health.
     *
     * @generated from field: optional double warn_at = 1;
     */
    warnAt?: number;
    /**
     * @generated from field: optional double crit_at = 2;
     */
    critAt?: number;
    /**
     * True when a larger value is the bad direction (latency, errors); false for
     * signups, revenue.
     *
     * @generated from field: bool higher_is_bad = 3;
     */
    higherIsBad: boolean;
};
/**
 * Describes the message tank.monitor.v1.Thresholds.
 * Use `create(ThresholdsSchema)` to create a new message.
 */
export declare const ThresholdsSchema: GenMessage<Thresholds>;
/**
 * @generated from message tank.monitor.v1.Widget
 */
export type Widget = Message<"tank.monitor.v1.Widget"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * @generated from field: tank.monitor.v1.WidgetKind kind = 3;
     */
    kind: WidgetKind;
    /**
     * @generated from field: string title = 4;
     */
    title: string;
    /**
     * "ms", "$", "%", "" — appended to numbers
     *
     * @generated from field: string unit = 5;
     */
    unit: string;
    /**
     * which source feeds it
     *
     * @generated from field: string source_id = 6;
     */
    sourceId: string;
    /**
     * How the source's payload becomes this widget's point. For a webhook: a dotted
     * path into the JSON ("data.signups.today", "items[0].latency_ms"). For an
     * internal source: the metric name. For a probe: what to extract, in words.
     *
     * @generated from field: string mapping = 7;
     */
    mapping: string;
    /**
     * @generated from field: tank.monitor.v1.Thresholds thresholds = 8;
     */
    thresholds?: Thresholds;
    /**
     * @generated from field: tank.monitor.v1.Position position = 9;
     */
    position?: Position;
    /**
     * @generated from field: tank.monitor.v1.Point latest = 10;
     */
    latest?: Point;
    /**
     * @generated from field: tank.monitor.v1.Health health = 11;
     */
    health: Health;
    /**
     * The message that mirrors this widget in the channel: its thread.
     *
     * @generated from field: string message_id = 12;
     */
    messageId: string;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 13;
     */
    updatedAt?: Timestamp;
};
/**
 * Describes the message tank.monitor.v1.Widget.
 * Use `create(WidgetSchema)` to create a new message.
 */
export declare const WidgetSchema: GenMessage<Widget>;
/**
 * @generated from message tank.monitor.v1.Schedule
 */
export type Schedule = Message<"tank.monitor.v1.Schedule"> & {
    /**
     * How often the source runs. Webhooks ignore this; probes and internal sources
     * run every interval, from 60 seconds up to a day.
     *
     * @generated from field: int32 interval_seconds = 1;
     */
    intervalSeconds: number;
    /**
     * Optional five-field cron in the workspace's timezone; when set it wins over
     * the interval. "0 9 * * 1-5" is every weekday at nine.
     *
     * @generated from field: string cron = 2;
     */
    cron: string;
};
/**
 * Describes the message tank.monitor.v1.Schedule.
 * Use `create(ScheduleSchema)` to create a new message.
 */
export declare const ScheduleSchema: GenMessage<Schedule>;
/**
 * @generated from message tank.monitor.v1.Source
 */
export type Source = Message<"tank.monitor.v1.Source"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * @generated from field: tank.monitor.v1.SourceKind kind = 3;
     */
    kind: SourceKind;
    /**
     * @generated from field: string name = 4;
     */
    name: string;
    /**
     * @generated from field: tank.monitor.v1.Schedule schedule = 5;
     */
    schedule?: Schedule;
    /**
     * Kind-specific settings as JSON: a probe's URL and allowed hosts, an internal
     * source's metric set. Never secrets; those live in the ingest token.
     *
     * @generated from field: string config_json = 6;
     */
    configJson: string;
    /**
     * Webhooks only: where to POST. The full URL with its token is returned once,
     * when the source is created or its token rotated; afterwards only the path.
     *
     * @generated from field: string ingest_path = 7;
     */
    ingestPath: string;
    /**
     * @generated from field: bool enabled = 8;
     */
    enabled: boolean;
    /**
     * @generated from field: google.protobuf.Timestamp last_run_at = 9;
     */
    lastRunAt?: Timestamp;
    /**
     * @generated from field: string last_error = 10;
     */
    lastError: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 11;
     */
    createdAt?: Timestamp;
};
/**
 * Describes the message tank.monitor.v1.Source.
 * Use `create(SourceSchema)` to create a new message.
 */
export declare const SourceSchema: GenMessage<Source>;
/**
 * @generated from message tank.monitor.v1.ListWidgetsRequest
 */
export type ListWidgetsRequest = Message<"tank.monitor.v1.ListWidgetsRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
};
/**
 * Describes the message tank.monitor.v1.ListWidgetsRequest.
 * Use `create(ListWidgetsRequestSchema)` to create a new message.
 */
export declare const ListWidgetsRequestSchema: GenMessage<ListWidgetsRequest>;
/**
 * @generated from message tank.monitor.v1.ListWidgetsResponse
 */
export type ListWidgetsResponse = Message<"tank.monitor.v1.ListWidgetsResponse"> & {
    /**
     * @generated from field: repeated tank.monitor.v1.Widget widgets = 1;
     */
    widgets: Widget[];
    /**
     * @generated from field: repeated tank.monitor.v1.Source sources = 2;
     */
    sources: Source[];
};
/**
 * Describes the message tank.monitor.v1.ListWidgetsResponse.
 * Use `create(ListWidgetsResponseSchema)` to create a new message.
 */
export declare const ListWidgetsResponseSchema: GenMessage<ListWidgetsResponse>;
/**
 * @generated from message tank.monitor.v1.UpsertWidgetRequest
 */
export type UpsertWidgetRequest = Message<"tank.monitor.v1.UpsertWidgetRequest"> & {
    /**
     * Empty id creates.
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * @generated from field: tank.monitor.v1.WidgetKind kind = 3;
     */
    kind: WidgetKind;
    /**
     * @generated from field: string title = 4;
     */
    title: string;
    /**
     * @generated from field: string unit = 5;
     */
    unit: string;
    /**
     * @generated from field: string source_id = 6;
     */
    sourceId: string;
    /**
     * @generated from field: string mapping = 7;
     */
    mapping: string;
    /**
     * @generated from field: tank.monitor.v1.Thresholds thresholds = 8;
     */
    thresholds?: Thresholds;
    /**
     * @generated from field: tank.monitor.v1.Position position = 9;
     */
    position?: Position;
};
/**
 * Describes the message tank.monitor.v1.UpsertWidgetRequest.
 * Use `create(UpsertWidgetRequestSchema)` to create a new message.
 */
export declare const UpsertWidgetRequestSchema: GenMessage<UpsertWidgetRequest>;
/**
 * @generated from message tank.monitor.v1.UpsertWidgetResponse
 */
export type UpsertWidgetResponse = Message<"tank.monitor.v1.UpsertWidgetResponse"> & {
    /**
     * @generated from field: tank.monitor.v1.Widget widget = 1;
     */
    widget?: Widget;
};
/**
 * Describes the message tank.monitor.v1.UpsertWidgetResponse.
 * Use `create(UpsertWidgetResponseSchema)` to create a new message.
 */
export declare const UpsertWidgetResponseSchema: GenMessage<UpsertWidgetResponse>;
/**
 * @generated from message tank.monitor.v1.DeleteWidgetRequest
 */
export type DeleteWidgetRequest = Message<"tank.monitor.v1.DeleteWidgetRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
};
/**
 * Describes the message tank.monitor.v1.DeleteWidgetRequest.
 * Use `create(DeleteWidgetRequestSchema)` to create a new message.
 */
export declare const DeleteWidgetRequestSchema: GenMessage<DeleteWidgetRequest>;
/**
 * @generated from message tank.monitor.v1.DeleteWidgetResponse
 */
export type DeleteWidgetResponse = Message<"tank.monitor.v1.DeleteWidgetResponse"> & {};
/**
 * Describes the message tank.monitor.v1.DeleteWidgetResponse.
 * Use `create(DeleteWidgetResponseSchema)` to create a new message.
 */
export declare const DeleteWidgetResponseSchema: GenMessage<DeleteWidgetResponse>;
/**
 * @generated from message tank.monitor.v1.GetSeriesRequest
 */
export type GetSeriesRequest = Message<"tank.monitor.v1.GetSeriesRequest"> & {
    /**
     * @generated from field: string widget_id = 1;
     */
    widgetId: string;
    /**
     * @generated from field: google.protobuf.Timestamp since = 2;
     */
    since?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp until = 3;
     */
    until?: Timestamp;
    /**
     * Points are bucketed to this width and averaged; 0 returns raw points (capped).
     *
     * @generated from field: int32 step_seconds = 4;
     */
    stepSeconds: number;
};
/**
 * Describes the message tank.monitor.v1.GetSeriesRequest.
 * Use `create(GetSeriesRequestSchema)` to create a new message.
 */
export declare const GetSeriesRequestSchema: GenMessage<GetSeriesRequest>;
/**
 * @generated from message tank.monitor.v1.GetSeriesResponse
 */
export type GetSeriesResponse = Message<"tank.monitor.v1.GetSeriesResponse"> & {
    /**
     * @generated from field: repeated tank.monitor.v1.Point points = 1;
     */
    points: Point[];
};
/**
 * Describes the message tank.monitor.v1.GetSeriesResponse.
 * Use `create(GetSeriesResponseSchema)` to create a new message.
 */
export declare const GetSeriesResponseSchema: GenMessage<GetSeriesResponse>;
/**
 * @generated from message tank.monitor.v1.CreateSourceRequest
 */
export type CreateSourceRequest = Message<"tank.monitor.v1.CreateSourceRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: tank.monitor.v1.SourceKind kind = 2;
     */
    kind: SourceKind;
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: tank.monitor.v1.Schedule schedule = 4;
     */
    schedule?: Schedule;
    /**
     * @generated from field: string config_json = 5;
     */
    configJson: string;
};
/**
 * Describes the message tank.monitor.v1.CreateSourceRequest.
 * Use `create(CreateSourceRequestSchema)` to create a new message.
 */
export declare const CreateSourceRequestSchema: GenMessage<CreateSourceRequest>;
/**
 * @generated from message tank.monitor.v1.CreateSourceResponse
 */
export type CreateSourceResponse = Message<"tank.monitor.v1.CreateSourceResponse"> & {
    /**
     * @generated from field: tank.monitor.v1.Source source = 1;
     */
    source?: Source;
    /**
     * Webhooks only, shown once: the URL to POST to, token included.
     *
     * @generated from field: string ingest_url = 2;
     */
    ingestUrl: string;
};
/**
 * Describes the message tank.monitor.v1.CreateSourceResponse.
 * Use `create(CreateSourceResponseSchema)` to create a new message.
 */
export declare const CreateSourceResponseSchema: GenMessage<CreateSourceResponse>;
/**
 * @generated from message tank.monitor.v1.UpdateSourceRequest
 */
export type UpdateSourceRequest = Message<"tank.monitor.v1.UpdateSourceRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: tank.monitor.v1.Schedule schedule = 3;
     */
    schedule?: Schedule;
    /**
     * @generated from field: string config_json = 4;
     */
    configJson: string;
    /**
     * @generated from field: bool enabled = 5;
     */
    enabled: boolean;
};
/**
 * Describes the message tank.monitor.v1.UpdateSourceRequest.
 * Use `create(UpdateSourceRequestSchema)` to create a new message.
 */
export declare const UpdateSourceRequestSchema: GenMessage<UpdateSourceRequest>;
/**
 * @generated from message tank.monitor.v1.UpdateSourceResponse
 */
export type UpdateSourceResponse = Message<"tank.monitor.v1.UpdateSourceResponse"> & {
    /**
     * @generated from field: tank.monitor.v1.Source source = 1;
     */
    source?: Source;
};
/**
 * Describes the message tank.monitor.v1.UpdateSourceResponse.
 * Use `create(UpdateSourceResponseSchema)` to create a new message.
 */
export declare const UpdateSourceResponseSchema: GenMessage<UpdateSourceResponse>;
/**
 * @generated from message tank.monitor.v1.DeleteSourceRequest
 */
export type DeleteSourceRequest = Message<"tank.monitor.v1.DeleteSourceRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
};
/**
 * Describes the message tank.monitor.v1.DeleteSourceRequest.
 * Use `create(DeleteSourceRequestSchema)` to create a new message.
 */
export declare const DeleteSourceRequestSchema: GenMessage<DeleteSourceRequest>;
/**
 * @generated from message tank.monitor.v1.DeleteSourceResponse
 */
export type DeleteSourceResponse = Message<"tank.monitor.v1.DeleteSourceResponse"> & {};
/**
 * Describes the message tank.monitor.v1.DeleteSourceResponse.
 * Use `create(DeleteSourceResponseSchema)` to create a new message.
 */
export declare const DeleteSourceResponseSchema: GenMessage<DeleteSourceResponse>;
/**
 * @generated from message tank.monitor.v1.RotateSourceTokenRequest
 */
export type RotateSourceTokenRequest = Message<"tank.monitor.v1.RotateSourceTokenRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
};
/**
 * Describes the message tank.monitor.v1.RotateSourceTokenRequest.
 * Use `create(RotateSourceTokenRequestSchema)` to create a new message.
 */
export declare const RotateSourceTokenRequestSchema: GenMessage<RotateSourceTokenRequest>;
/**
 * @generated from message tank.monitor.v1.RotateSourceTokenResponse
 */
export type RotateSourceTokenResponse = Message<"tank.monitor.v1.RotateSourceTokenResponse"> & {
    /**
     * @generated from field: string ingest_url = 1;
     */
    ingestUrl: string;
};
/**
 * Describes the message tank.monitor.v1.RotateSourceTokenResponse.
 * Use `create(RotateSourceTokenResponseSchema)` to create a new message.
 */
export declare const RotateSourceTokenResponseSchema: GenMessage<RotateSourceTokenResponse>;
/**
 * PushPoints is how first-party code feeds widgets directly: the internal
 * worker, and later the probe runner. Members with chat:write may also use it.
 *
 * @generated from message tank.monitor.v1.PushPointsRequest
 */
export type PushPointsRequest = Message<"tank.monitor.v1.PushPointsRequest"> & {
    /**
     * @generated from field: string channel_id = 1;
     */
    channelId: string;
    /**
     * @generated from field: repeated tank.monitor.v1.PushPointsRequest.WidgetPoint points = 2;
     */
    points: PushPointsRequest_WidgetPoint[];
};
/**
 * Describes the message tank.monitor.v1.PushPointsRequest.
 * Use `create(PushPointsRequestSchema)` to create a new message.
 */
export declare const PushPointsRequestSchema: GenMessage<PushPointsRequest>;
/**
 * @generated from message tank.monitor.v1.PushPointsRequest.WidgetPoint
 */
export type PushPointsRequest_WidgetPoint = Message<"tank.monitor.v1.PushPointsRequest.WidgetPoint"> & {
    /**
     * @generated from field: string widget_id = 1;
     */
    widgetId: string;
    /**
     * @generated from field: tank.monitor.v1.Point point = 2;
     */
    point?: Point;
};
/**
 * Describes the message tank.monitor.v1.PushPointsRequest.WidgetPoint.
 * Use `create(PushPointsRequest_WidgetPointSchema)` to create a new message.
 */
export declare const PushPointsRequest_WidgetPointSchema: GenMessage<PushPointsRequest_WidgetPoint>;
/**
 * @generated from message tank.monitor.v1.PushPointsResponse
 */
export type PushPointsResponse = Message<"tank.monitor.v1.PushPointsResponse"> & {
    /**
     * @generated from field: repeated tank.monitor.v1.Widget widgets = 1;
     */
    widgets: Widget[];
};
/**
 * Describes the message tank.monitor.v1.PushPointsResponse.
 * Use `create(PushPointsResponseSchema)` to create a new message.
 */
export declare const PushPointsResponseSchema: GenMessage<PushPointsResponse>;
/**
 * @generated from enum tank.monitor.v1.WidgetKind
 */
export declare enum WidgetKind {
    /**
     * @generated from enum value: WIDGET_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * one value, with its change over the last day
     *
     * @generated from enum value: WIDGET_KIND_NUMBER = 1;
     */
    NUMBER = 1,
    /**
     * a series over time
     *
     * @generated from enum value: WIDGET_KIND_LINE = 2;
     */
    LINE = 2,
    /**
     * a series over time, as bars
     *
     * @generated from enum value: WIDGET_KIND_BAR = 3;
     */
    BAR = 3,
    /**
     * ok / warn / crit, with a reason
     *
     * @generated from enum value: WIDGET_KIND_STATUS = 4;
     */
    STATUS = 4,
    /**
     * a paragraph, usually the agent's read of the data
     *
     * @generated from enum value: WIDGET_KIND_TEXT = 5;
     */
    TEXT = 5,
    /**
     * rows of labelled values
     *
     * @generated from enum value: WIDGET_KIND_TABLE = 6;
     */
    TABLE = 6
}
/**
 * Describes the enum tank.monitor.v1.WidgetKind.
 */
export declare const WidgetKindSchema: GenEnum<WidgetKind>;
/**
 * @generated from enum tank.monitor.v1.SourceKind
 */
export declare enum SourceKind {
    /**
     * @generated from enum value: SOURCE_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * anything that can POST JSON to the ingest URL
     *
     * @generated from enum value: SOURCE_KIND_WEBHOOK = 1;
     */
    WEBHOOK = 1,
    /**
     * a scheduled agent run that fetches and extracts
     *
     * @generated from enum value: SOURCE_KIND_PROBE = 2;
     */
    PROBE = 2,
    /**
     * TANK's own numbers, no model involved
     *
     * @generated from enum value: SOURCE_KIND_INTERNAL = 3;
     */
    INTERNAL = 3
}
/**
 * Describes the enum tank.monitor.v1.SourceKind.
 */
export declare const SourceKindSchema: GenEnum<SourceKind>;
/**
 * @generated from enum tank.monitor.v1.Health
 */
export declare enum Health {
    /**
     * @generated from enum value: HEALTH_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: HEALTH_OK = 1;
     */
    OK = 1,
    /**
     * @generated from enum value: HEALTH_WARN = 2;
     */
    WARN = 2,
    /**
     * @generated from enum value: HEALTH_CRIT = 3;
     */
    CRIT = 3,
    /**
     * no data yet, or the source is failing
     *
     * @generated from enum value: HEALTH_UNKNOWN = 4;
     */
    UNKNOWN = 4
}
/**
 * Describes the enum tank.monitor.v1.Health.
 */
export declare const HealthSchema: GenEnum<Health>;
/**
 * Every RPC is read through the channel: a Radar you cannot see has no widgets.
 *
 * @generated from service tank.monitor.v1.MonitorService
 */
export declare const MonitorService: GenService<{
    /**
     * @generated from rpc tank.monitor.v1.MonitorService.ListWidgets
     */
    listWidgets: {
        methodKind: "unary";
        input: typeof ListWidgetsRequestSchema;
        output: typeof ListWidgetsResponseSchema;
    };
    /**
     * @generated from rpc tank.monitor.v1.MonitorService.UpsertWidget
     */
    upsertWidget: {
        methodKind: "unary";
        input: typeof UpsertWidgetRequestSchema;
        output: typeof UpsertWidgetResponseSchema;
    };
    /**
     * @generated from rpc tank.monitor.v1.MonitorService.DeleteWidget
     */
    deleteWidget: {
        methodKind: "unary";
        input: typeof DeleteWidgetRequestSchema;
        output: typeof DeleteWidgetResponseSchema;
    };
    /**
     * @generated from rpc tank.monitor.v1.MonitorService.GetSeries
     */
    getSeries: {
        methodKind: "unary";
        input: typeof GetSeriesRequestSchema;
        output: typeof GetSeriesResponseSchema;
    };
    /**
     * @generated from rpc tank.monitor.v1.MonitorService.CreateSource
     */
    createSource: {
        methodKind: "unary";
        input: typeof CreateSourceRequestSchema;
        output: typeof CreateSourceResponseSchema;
    };
    /**
     * @generated from rpc tank.monitor.v1.MonitorService.UpdateSource
     */
    updateSource: {
        methodKind: "unary";
        input: typeof UpdateSourceRequestSchema;
        output: typeof UpdateSourceResponseSchema;
    };
    /**
     * @generated from rpc tank.monitor.v1.MonitorService.DeleteSource
     */
    deleteSource: {
        methodKind: "unary";
        input: typeof DeleteSourceRequestSchema;
        output: typeof DeleteSourceResponseSchema;
    };
    /**
     * @generated from rpc tank.monitor.v1.MonitorService.RotateSourceToken
     */
    rotateSourceToken: {
        methodKind: "unary";
        input: typeof RotateSourceTokenRequestSchema;
        output: typeof RotateSourceTokenResponseSchema;
    };
    /**
     * @generated from rpc tank.monitor.v1.MonitorService.PushPoints
     */
    pushPoints: {
        methodKind: "unary";
        input: typeof PushPointsRequestSchema;
        output: typeof PushPointsResponseSchema;
    };
}>;
