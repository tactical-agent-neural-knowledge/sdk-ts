import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/apps/v1/apps.proto.
 */
export declare const file_tank_apps_v1_apps: GenFile;
/**
 * @generated from message tank.apps.v1.App
 */
export type App = Message<"tank.apps.v1.App"> & {
    /**
     * The product's slug.
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * What the app lets Neural read, in the app's words.
     *
     * @generated from field: string description = 3;
     */
    description: string;
    /**
     * Served by the app itself.
     *
     * @generated from field: string logo_url = 4;
     */
    logoUrl: string;
    /**
     * The app's public address.
     *
     * @generated from field: string url = 5;
     */
    url: string;
    /**
     * The workspace that built it, by name.
     *
     * @generated from field: string maker = 6;
     */
    maker: string;
};
/**
 * Describes the message tank.apps.v1.App.
 * Use `create(AppSchema)` to create a new message.
 */
export declare const AppSchema: GenMessage<App>;
/**
 * One thing an app lets Neural read: an MCP tool.
 *
 * @generated from message tank.apps.v1.Tool
 */
export type Tool = Message<"tank.apps.v1.Tool"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string description = 2;
     */
    description: string;
    /**
     * The tool's input JSON schema, as the app declared it.
     *
     * @generated from field: string input_schema_json = 3;
     */
    inputSchemaJson: string;
    /**
     * Set when the tool is something Neural can offer to do on its own, from what is connected
     * (the kit's _meta "chat.tank/offer"). An offered tool is called with the person's position
     * as {"latitude": <number>, "longitude": <number>}, so its schema must take those two.
     *
     * @generated from field: tank.apps.v1.Offer offer = 4;
     */
    offer?: Offer;
};
/**
 * Describes the message tank.apps.v1.Tool.
 * Use `create(ToolSchema)` to create a new message.
 */
export declare const ToolSchema: GenMessage<Tool>;
/**
 * Offer is how a tool asks Neural to offer it (Robby, 2026-11-11: "Want me to display the
 * wind over your camera so you can see the direction it is coming from?").
 *
 * @generated from message tank.apps.v1.Offer
 */
export type Offer = Message<"tank.apps.v1.Offer"> & {
    /**
     * The offer as Neural says it, a question the person answers by tapping it.
     *
     * @generated from field: string text = 1;
     */
    text: string;
    /**
     * What the conversation must have for the offer to make sense: "camera" (a phone camera
     * connected), "location" (a position from a connected device). Unknown needs are never met.
     *
     * @generated from field: repeated string needs = 2;
     */
    needs: string[];
};
/**
 * Describes the message tank.apps.v1.Offer.
 * Use `create(OfferSchema)` to create a new message.
 */
export declare const OfferSchema: GenMessage<Offer>;
/**
 * Mark is one thing drawn over the person's camera, placed by compass bearing. The phone
 * turns it against its own compass, so it stays where it belongs as the person pans.
 *
 * @generated from message tank.apps.v1.Mark
 */
export type Mark = Message<"tank.apps.v1.Mark"> & {
    /**
     * "from": something arriving from the bearing (wind, rain). "at": something that sits at
     * the bearing (the sunset, a place). "badge": a reading with no direction.
     *
     * @generated from field: string kind = 1;
     */
    kind: string;
    /**
     * Degrees clockwise from true north, [0, 360). Ignored for a badge.
     *
     * @generated from field: double bearing = 2;
     */
    bearing: number;
    /**
     * Short, shown large: "14 km/h".
     *
     * @generated from field: string label = 3;
     */
    label: string;
    /**
     * Shown under the label: "Gusts 25 km/h".
     *
     * @generated from field: string detail = 4;
     */
    detail: string;
    /**
     * Degrees above the horizon, for something in the sky; 0 on the horizon.
     *
     * @generated from field: double elevation = 5;
     */
    elevation: number;
};
/**
 * Describes the message tank.apps.v1.Mark.
 * Use `create(MarkSchema)` to create a new message.
 */
export declare const MarkSchema: GenMessage<Mark>;
/**
 * Where a result came from, for the citation.
 *
 * @generated from message tank.apps.v1.Source
 */
export type Source = Message<"tank.apps.v1.Source"> & {
    /**
     * @generated from field: string title = 1;
     */
    title: string;
    /**
     * @generated from field: string url = 2;
     */
    url: string;
};
/**
 * Describes the message tank.apps.v1.Source.
 * Use `create(SourceSchema)` to create a new message.
 */
export declare const SourceSchema: GenMessage<Source>;
/**
 * @generated from message tank.apps.v1.ListAppsRequest
 */
export type ListAppsRequest = Message<"tank.apps.v1.ListAppsRequest"> & {
    /**
     * Matches name and description; empty lists every published app.
     *
     * @generated from field: string query = 1;
     */
    query: string;
};
/**
 * Describes the message tank.apps.v1.ListAppsRequest.
 * Use `create(ListAppsRequestSchema)` to create a new message.
 */
export declare const ListAppsRequestSchema: GenMessage<ListAppsRequest>;
/**
 * @generated from message tank.apps.v1.ListAppsResponse
 */
export type ListAppsResponse = Message<"tank.apps.v1.ListAppsResponse"> & {
    /**
     * @generated from field: repeated tank.apps.v1.App apps = 1;
     */
    apps: App[];
};
/**
 * Describes the message tank.apps.v1.ListAppsResponse.
 * Use `create(ListAppsResponseSchema)` to create a new message.
 */
export declare const ListAppsResponseSchema: GenMessage<ListAppsResponse>;
/**
 * @generated from message tank.apps.v1.GetToolsRequest
 */
export type GetToolsRequest = Message<"tank.apps.v1.GetToolsRequest"> & {
    /**
     * @generated from field: string app_id = 1;
     */
    appId: string;
};
/**
 * Describes the message tank.apps.v1.GetToolsRequest.
 * Use `create(GetToolsRequestSchema)` to create a new message.
 */
export declare const GetToolsRequestSchema: GenMessage<GetToolsRequest>;
/**
 * @generated from message tank.apps.v1.GetToolsResponse
 */
export type GetToolsResponse = Message<"tank.apps.v1.GetToolsResponse"> & {
    /**
     * @generated from field: tank.apps.v1.App app = 1;
     */
    app?: App;
    /**
     * @generated from field: repeated tank.apps.v1.Tool tools = 2;
     */
    tools: Tool[];
};
/**
 * Describes the message tank.apps.v1.GetToolsResponse.
 * Use `create(GetToolsResponseSchema)` to create a new message.
 */
export declare const GetToolsResponseSchema: GenMessage<GetToolsResponse>;
/**
 * Calls one tool. Carries nothing about the person, workspace or conversation by design.
 *
 * @generated from message tank.apps.v1.CallToolRequest
 */
export type CallToolRequest = Message<"tank.apps.v1.CallToolRequest"> & {
    /**
     * @generated from field: string app_id = 1;
     */
    appId: string;
    /**
     * @generated from field: string tool = 2;
     */
    tool: string;
    /**
     * @generated from field: string arguments_json = 3;
     */
    argumentsJson: string;
};
/**
 * Describes the message tank.apps.v1.CallToolRequest.
 * Use `create(CallToolRequestSchema)` to create a new message.
 */
export declare const CallToolRequestSchema: GenMessage<CallToolRequest>;
/**
 * @generated from message tank.apps.v1.CallToolResponse
 */
export type CallToolResponse = Message<"tank.apps.v1.CallToolResponse"> & {
    /**
     * At most 8 KB; longer results are cut and say so.
     *
     * @generated from field: string text = 1;
     */
    text: string;
    /**
     * @generated from field: repeated tank.apps.v1.Source sources = 2;
     */
    sources: Source[];
    /**
     * @generated from field: bool is_error = 3;
     */
    isError: boolean;
    /**
     * What the result draws over the camera (the kit's _meta "chat.tank/marks"), at most 12.
     *
     * @generated from field: repeated tank.apps.v1.Mark marks = 4;
     */
    marks: Mark[];
};
/**
 * Describes the message tank.apps.v1.CallToolResponse.
 * Use `create(CallToolResponseSchema)` to create a new message.
 */
export declare const CallToolResponseSchema: GenMessage<CallToolResponse>;
