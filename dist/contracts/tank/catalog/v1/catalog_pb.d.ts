import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/catalog/v1/catalog.proto.
 */
export declare const file_tank_catalog_v1_catalog: GenFile;
/**
 * ProductCard is a product as a list shows it. It carries what the card renders and
 * what the sorts order by, so a list of fifty needs one query and no follow-ups.
 *
 * @generated from message tank.catalog.v1.ProductCard
 */
export type ProductCard = Message<"tank.catalog.v1.ProductCard"> & {
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
     * the trade it serves
     *
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
     * what it costs to take over today
     *
     * @generated from field: int64 price_cents = 7;
     */
    priceCents: bigint;
    /**
     * How far along it is. Agent minutes is the honest measure: it is what was spent
     * building the thing, and it is what the price is derived from.
     *
     * @generated from field: int64 agent_minutes = 8;
     */
    agentMinutes: bigint;
    /**
     * pieces of finished agent work
     *
     * @generated from field: int32 work_delivered = 9;
     */
    workDelivered: number;
    /**
     * an agent is working in it now
     *
     * @generated from field: bool agent_active = 10;
     */
    agentActive: boolean;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 11;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp last_worked_at = 12;
     */
    lastWorkedAt?: Timestamp;
    /**
     * nobody has taken it over yet
     *
     * @generated from field: bool available = 13;
     */
    available: boolean;
    /**
     * on the caller's watch list
     *
     * @generated from field: bool watched = 14;
     */
    watched: boolean;
    /**
     * Total visits to this product's page, all time. Every view counts, including
     * repeat visits and crawlers — it is a hit counter, not a headcount.
     *
     * @generated from field: int64 view_count = 15;
     */
    viewCount: bigint;
};
/**
 * Describes the message tank.catalog.v1.ProductCard.
 * Use `create(ProductCardSchema)` to create a new message.
 */
export declare const ProductCardSchema: GenMessage<ProductCard>;
/**
 * @generated from message tank.catalog.v1.ListProductsRequest
 */
export type ListProductsRequest = Message<"tank.catalog.v1.ListProductsRequest"> & {
    /**
     * @generated from field: tank.catalog.v1.ProductSort sort = 1;
     */
    sort: ProductSort;
    /**
     * one trade, or empty for all
     *
     * @generated from field: string industry = 2;
     */
    industry: string;
    /**
     * matches name and description
     *
     * @generated from field: string query = 3;
     */
    query: string;
    /**
     * Signed in only. A watch list nobody is signed in to see is empty, not an error.
     *
     * @generated from field: bool watched_only = 4;
     */
    watchedOnly: boolean;
    /**
     * signed in: one portfolio's products
     *
     * @generated from field: string portfolio_id = 5;
     */
    portfolioId: string;
    /**
     * @generated from field: string cursor = 6;
     */
    cursor: string;
    /**
     * @generated from field: int32 limit = 7;
     */
    limit: number;
};
/**
 * Describes the message tank.catalog.v1.ListProductsRequest.
 * Use `create(ListProductsRequestSchema)` to create a new message.
 */
export declare const ListProductsRequestSchema: GenMessage<ListProductsRequest>;
/**
 * @generated from message tank.catalog.v1.ListProductsResponse
 */
export type ListProductsResponse = Message<"tank.catalog.v1.ListProductsResponse"> & {
    /**
     * @generated from field: repeated tank.catalog.v1.ProductCard products = 1;
     */
    products: ProductCard[];
    /**
     * @generated from field: string next_cursor = 2;
     */
    nextCursor: string;
    /**
     * @generated from field: int32 total = 3;
     */
    total: number;
    /**
     * The trades that actually have products, so the filter offers real choices rather
     * than a hard-coded list that drifts from what is on the board.
     *
     * @generated from field: repeated string industries = 4;
     */
    industries: string[];
};
/**
 * Describes the message tank.catalog.v1.ListProductsResponse.
 * Use `create(ListProductsResponseSchema)` to create a new message.
 */
export declare const ListProductsResponseSchema: GenMessage<ListProductsResponse>;
/**
 * Watching is a plain toggle rather than add/remove, because the button is a toggle
 * and two RPCs would let the two disagree.
 *
 * @generated from message tank.catalog.v1.WatchProductRequest
 */
export type WatchProductRequest = Message<"tank.catalog.v1.WatchProductRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: bool watched = 2;
     */
    watched: boolean;
};
/**
 * Describes the message tank.catalog.v1.WatchProductRequest.
 * Use `create(WatchProductRequestSchema)` to create a new message.
 */
export declare const WatchProductRequestSchema: GenMessage<WatchProductRequest>;
/**
 * @generated from message tank.catalog.v1.WatchProductResponse
 */
export type WatchProductResponse = Message<"tank.catalog.v1.WatchProductResponse"> & {
    /**
     * @generated from field: tank.catalog.v1.ProductCard product = 1;
     */
    product?: ProductCard;
};
/**
 * Describes the message tank.catalog.v1.WatchProductResponse.
 * Use `create(WatchProductResponseSchema)` to create a new message.
 */
export declare const WatchProductResponseSchema: GenMessage<WatchProductResponse>;
/**
 * A portfolio is a named set of products somebody is following as a group.
 *
 * @generated from message tank.catalog.v1.Portfolio
 */
export type Portfolio = Message<"tank.catalog.v1.Portfolio"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string note = 3;
     */
    note: string;
    /**
     * @generated from field: int32 product_count = 4;
     */
    productCount: number;
    /**
     * what taking over all of them costs
     *
     * @generated from field: int64 value_cents = 5;
     */
    valueCents: bigint;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 6;
     */
    createdAt?: Timestamp;
};
/**
 * Describes the message tank.catalog.v1.Portfolio.
 * Use `create(PortfolioSchema)` to create a new message.
 */
export declare const PortfolioSchema: GenMessage<Portfolio>;
/**
 * @generated from message tank.catalog.v1.ListPortfoliosRequest
 */
export type ListPortfoliosRequest = Message<"tank.catalog.v1.ListPortfoliosRequest"> & {};
/**
 * Describes the message tank.catalog.v1.ListPortfoliosRequest.
 * Use `create(ListPortfoliosRequestSchema)` to create a new message.
 */
export declare const ListPortfoliosRequestSchema: GenMessage<ListPortfoliosRequest>;
/**
 * @generated from message tank.catalog.v1.ListPortfoliosResponse
 */
export type ListPortfoliosResponse = Message<"tank.catalog.v1.ListPortfoliosResponse"> & {
    /**
     * @generated from field: repeated tank.catalog.v1.Portfolio portfolios = 1;
     */
    portfolios: Portfolio[];
};
/**
 * Describes the message tank.catalog.v1.ListPortfoliosResponse.
 * Use `create(ListPortfoliosResponseSchema)` to create a new message.
 */
export declare const ListPortfoliosResponseSchema: GenMessage<ListPortfoliosResponse>;
/**
 * @generated from message tank.catalog.v1.CreatePortfolioRequest
 */
export type CreatePortfolioRequest = Message<"tank.catalog.v1.CreatePortfolioRequest"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string note = 2;
     */
    note: string;
};
/**
 * Describes the message tank.catalog.v1.CreatePortfolioRequest.
 * Use `create(CreatePortfolioRequestSchema)` to create a new message.
 */
export declare const CreatePortfolioRequestSchema: GenMessage<CreatePortfolioRequest>;
/**
 * @generated from message tank.catalog.v1.CreatePortfolioResponse
 */
export type CreatePortfolioResponse = Message<"tank.catalog.v1.CreatePortfolioResponse"> & {
    /**
     * @generated from field: tank.catalog.v1.Portfolio portfolio = 1;
     */
    portfolio?: Portfolio;
};
/**
 * Describes the message tank.catalog.v1.CreatePortfolioResponse.
 * Use `create(CreatePortfolioResponseSchema)` to create a new message.
 */
export declare const CreatePortfolioResponseSchema: GenMessage<CreatePortfolioResponse>;
/**
 * @generated from message tank.catalog.v1.RenamePortfolioRequest
 */
export type RenamePortfolioRequest = Message<"tank.catalog.v1.RenamePortfolioRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string note = 3;
     */
    note: string;
};
/**
 * Describes the message tank.catalog.v1.RenamePortfolioRequest.
 * Use `create(RenamePortfolioRequestSchema)` to create a new message.
 */
export declare const RenamePortfolioRequestSchema: GenMessage<RenamePortfolioRequest>;
/**
 * @generated from message tank.catalog.v1.RenamePortfolioResponse
 */
export type RenamePortfolioResponse = Message<"tank.catalog.v1.RenamePortfolioResponse"> & {
    /**
     * @generated from field: tank.catalog.v1.Portfolio portfolio = 1;
     */
    portfolio?: Portfolio;
};
/**
 * Describes the message tank.catalog.v1.RenamePortfolioResponse.
 * Use `create(RenamePortfolioResponseSchema)` to create a new message.
 */
export declare const RenamePortfolioResponseSchema: GenMessage<RenamePortfolioResponse>;
/**
 * @generated from message tank.catalog.v1.DeletePortfolioRequest
 */
export type DeletePortfolioRequest = Message<"tank.catalog.v1.DeletePortfolioRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
};
/**
 * Describes the message tank.catalog.v1.DeletePortfolioRequest.
 * Use `create(DeletePortfolioRequestSchema)` to create a new message.
 */
export declare const DeletePortfolioRequestSchema: GenMessage<DeletePortfolioRequest>;
/**
 * @generated from message tank.catalog.v1.DeletePortfolioResponse
 */
export type DeletePortfolioResponse = Message<"tank.catalog.v1.DeletePortfolioResponse"> & {};
/**
 * Describes the message tank.catalog.v1.DeletePortfolioResponse.
 * Use `create(DeletePortfolioResponseSchema)` to create a new message.
 */
export declare const DeletePortfolioResponseSchema: GenMessage<DeletePortfolioResponse>;
/**
 * Membership is a toggle for the same reason watching is.
 *
 * @generated from message tank.catalog.v1.SetPortfolioProductRequest
 */
export type SetPortfolioProductRequest = Message<"tank.catalog.v1.SetPortfolioProductRequest"> & {
    /**
     * @generated from field: string portfolio_id = 1;
     */
    portfolioId: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * @generated from field: bool included = 3;
     */
    included: boolean;
};
/**
 * Describes the message tank.catalog.v1.SetPortfolioProductRequest.
 * Use `create(SetPortfolioProductRequestSchema)` to create a new message.
 */
export declare const SetPortfolioProductRequestSchema: GenMessage<SetPortfolioProductRequest>;
/**
 * @generated from message tank.catalog.v1.SetPortfolioProductResponse
 */
export type SetPortfolioProductResponse = Message<"tank.catalog.v1.SetPortfolioProductResponse"> & {
    /**
     * @generated from field: tank.catalog.v1.Portfolio portfolio = 1;
     */
    portfolio?: Portfolio;
};
/**
 * Describes the message tank.catalog.v1.SetPortfolioProductResponse.
 * Use `create(SetPortfolioProductResponseSchema)` to create a new message.
 */
export declare const SetPortfolioProductResponseSchema: GenMessage<SetPortfolioProductResponse>;
/**
 * Recording a view is anonymous and deliberately cheap: the page calls it once when
 * it opens, and every call counts.
 *
 * @generated from message tank.catalog.v1.RecordProductViewRequest
 */
export type RecordProductViewRequest = Message<"tank.catalog.v1.RecordProductViewRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
    /**
     * Where the visitor came from, as the browser reports it. Used only to bucket the
     * visit — assistant, search, social, direct — and never stored against a person.
     * The server decides the bucket; this is the raw value it decides from.
     *
     * @generated from field: string referrer = 2;
     */
    referrer: string;
};
/**
 * Describes the message tank.catalog.v1.RecordProductViewRequest.
 * Use `create(RecordProductViewRequestSchema)` to create a new message.
 */
export declare const RecordProductViewRequestSchema: GenMessage<RecordProductViewRequest>;
/**
 * @generated from message tank.catalog.v1.RecordProductViewResponse
 */
export type RecordProductViewResponse = Message<"tank.catalog.v1.RecordProductViewResponse"> & {
    /**
     * the total after this call
     *
     * @generated from field: int64 view_count = 1;
     */
    viewCount: bigint;
};
/**
 * Describes the message tank.catalog.v1.RecordProductViewResponse.
 * Use `create(RecordProductViewResponseSchema)` to create a new message.
 */
export declare const RecordProductViewResponseSchema: GenMessage<RecordProductViewResponse>;
/**
 * A number worth putting on a page, with enough around it to be quoted honestly.
 *
 * @generated from message tank.catalog.v1.Stat
 */
export type Stat = Message<"tank.catalog.v1.Stat"> & {
    /**
     * @generated from field: string key = 1;
     */
    key: string;
    /**
     * @generated from field: string label = 2;
     */
    label: string;
    /**
     * @generated from field: double value = 3;
     */
    value: number;
    /**
     * "", "usd", "hours", "minutes", "products", "percent"
     *
     * @generated from field: string unit = 4;
     */
    unit: string;
    /**
     * How many observations it rests on. Published next to every figure: a percentage
     * hiding a sample of twelve is how a data page stops being believed.
     *
     * @generated from field: int64 sample = 5;
     */
    sample: bigint;
    /**
     * the method, in one line
     *
     * @generated from field: string note = 6;
     */
    note: string;
};
/**
 * Describes the message tank.catalog.v1.Stat.
 * Use `create(StatSchema)` to create a new message.
 */
export declare const StatSchema: GenMessage<Stat>;
/**
 * One row of a ranking — a vendor, an industry, a stack choice.
 *
 * @generated from message tank.catalog.v1.Tally
 */
export type Tally = Message<"tank.catalog.v1.Tally"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: int64 count = 2;
     */
    count: bigint;
    /**
     * 0..1 of the sample
     *
     * @generated from field: double share = 3;
     */
    share: number;
};
/**
 * Describes the message tank.catalog.v1.Tally.
 * Use `create(TallySchema)` to create a new message.
 */
export declare const TallySchema: GenMessage<Tally>;
/**
 * @generated from message tank.catalog.v1.BoardStatsRequest
 */
export type BoardStatsRequest = Message<"tank.catalog.v1.BoardStatsRequest"> & {};
/**
 * Describes the message tank.catalog.v1.BoardStatsRequest.
 * Use `create(BoardStatsRequestSchema)` to create a new message.
 */
export declare const BoardStatsRequestSchema: GenMessage<BoardStatsRequest>;
/**
 * The series behind the figures. Published for the same reason the figures are: a
 * number somebody is invited to quote is worth more when they can see where it came
 * from, and that it is not being quietly revised.
 *
 * @generated from message tank.catalog.v1.BoardHistoryRequest
 */
export type BoardHistoryRequest = Message<"tank.catalog.v1.BoardHistoryRequest"> & {
    /**
     * empty for every figure
     *
     * @generated from field: repeated string keys = 1;
     */
    keys: string[];
    /**
     * default 90, max 400
     *
     * @generated from field: int32 days = 2;
     */
    days: number;
};
/**
 * Describes the message tank.catalog.v1.BoardHistoryRequest.
 * Use `create(BoardHistoryRequestSchema)` to create a new message.
 */
export declare const BoardHistoryRequestSchema: GenMessage<BoardHistoryRequest>;
/**
 * @generated from message tank.catalog.v1.BoardHistoryResponse
 */
export type BoardHistoryResponse = Message<"tank.catalog.v1.BoardHistoryResponse"> & {
    /**
     * @generated from field: repeated tank.catalog.v1.Series series = 1;
     */
    series: Series[];
};
/**
 * Describes the message tank.catalog.v1.BoardHistoryResponse.
 * Use `create(BoardHistoryResponseSchema)` to create a new message.
 */
export declare const BoardHistoryResponseSchema: GenMessage<BoardHistoryResponse>;
/**
 * @generated from message tank.catalog.v1.Series
 */
export type Series = Message<"tank.catalog.v1.Series"> & {
    /**
     * @generated from field: string key = 1;
     */
    key: string;
    /**
     * @generated from field: repeated tank.catalog.v1.Point points = 2;
     */
    points: Point[];
};
/**
 * Describes the message tank.catalog.v1.Series.
 * Use `create(SeriesSchema)` to create a new message.
 */
export declare const SeriesSchema: GenMessage<Series>;
/**
 * @generated from message tank.catalog.v1.Point
 */
export type Point = Message<"tank.catalog.v1.Point"> & {
    /**
     * @generated from field: google.protobuf.Timestamp at = 1;
     */
    at?: Timestamp;
    /**
     * @generated from field: double value = 2;
     */
    value: number;
};
/**
 * Describes the message tank.catalog.v1.Point.
 * Use `create(PointSchema)` to create a new message.
 */
export declare const PointSchema: GenMessage<Point>;
/**
 * @generated from message tank.catalog.v1.BoardStatsResponse
 */
export type BoardStatsResponse = Message<"tank.catalog.v1.BoardStatsResponse"> & {
    /**
     * @generated from field: google.protobuf.Timestamp computed_at = 1;
     */
    computedAt?: Timestamp;
    /**
     * the figures worth leading with
     *
     * @generated from field: repeated tank.catalog.v1.Stat headline = 2;
     */
    headline: Stat[];
    /**
     * everything else
     *
     * @generated from field: repeated tank.catalog.v1.Stat all = 3;
     */
    all: Stat[];
    /**
     * products by industry
     *
     * @generated from field: repeated tank.catalog.v1.Tally industries = 4;
     */
    industries: Tally[];
    /**
     * which stages agents have completed
     *
     * @generated from field: repeated tank.catalog.v1.Tally stages = 5;
     */
    stages: Tally[];
    /**
     * where visits came from
     *
     * @generated from field: repeated tank.catalog.v1.Tally sources = 6;
     */
    sources: Tally[];
    /**
     * the last few things that happened, newest first
     *
     * @generated from field: repeated tank.catalog.v1.Event recent = 7;
     */
    recent: Event[];
    /**
     * products people actually open
     *
     * @generated from field: repeated tank.catalog.v1.Ranked most_visited = 8;
     */
    mostVisited: Ranked[];
    /**
     * software the agents name, and whether TANK does that job
     *
     * @generated from field: repeated tank.catalog.v1.ToolMention tools = 9;
     */
    tools: ToolMention[];
    /**
     * what agents say software for each trade should cost
     *
     * @generated from field: repeated tank.catalog.v1.PriceBand prices = 10;
     */
    prices: PriceBand[];
    /**
     * ideas the board looked at and declined to build
     *
     * @generated from field: repeated tank.catalog.v1.Dropped dropped_list = 11;
     */
    droppedList: Dropped[];
    /**
     * what the agents say each named tool gets wrong
     *
     * @generated from field: repeated tank.catalog.v1.VendorGap vendor_gaps = 12;
     */
    vendorGaps: VendorGap[];
};
/**
 * Describes the message tank.catalog.v1.BoardStatsResponse.
 * Use `create(BoardStatsResponseSchema)` to create a new message.
 */
export declare const BoardStatsResponseSchema: GenMessage<BoardStatsResponse>;
/**
 * PriceBand is what agents independently decided software for one trade should cost.
 *
 * The spread is the interesting half. Many agents priced many products in the same
 * industry without consulting each other, so how far apart they land is a measurement
 * of how much two AI agents disagree about the same question.
 *
 * @generated from message tank.catalog.v1.PriceBand
 */
export type PriceBand = Message<"tank.catalog.v1.PriceBand"> & {
    /**
     * @generated from field: string industry = 1;
     */
    industry: string;
    /**
     * how many agents priced something here
     *
     * @generated from field: int32 products = 2;
     */
    products: number;
    /**
     * dollars a month
     *
     * @generated from field: double median_usd = 3;
     */
    medianUsd: number;
    /**
     * @generated from field: double low_usd = 4;
     */
    lowUsd: number;
    /**
     * @generated from field: double high_usd = 5;
     */
    highUsd: number;
};
/**
 * Describes the message tank.catalog.v1.PriceBand.
 * Use `create(PriceBandSchema)` to create a new message.
 */
export declare const PriceBandSchema: GenMessage<PriceBand>;
/**
 * Dropped is a product the board stopped working on because its own research said to.
 *
 * @generated from message tank.catalog.v1.Dropped
 */
export type Dropped = Message<"tank.catalog.v1.Dropped"> & {
    /**
     * @generated from field: string product = 1;
     */
    product: string;
    /**
     * @generated from field: string slug = 2;
     */
    slug: string;
    /**
     * @generated from field: string industry = 3;
     */
    industry: string;
    /**
     * @generated from field: string reason = 4;
     */
    reason: string;
    /**
     * @generated from field: google.protobuf.Timestamp at = 5;
     */
    at?: Timestamp;
};
/**
 * Describes the message tank.catalog.v1.Dropped.
 * Use `create(DroppedSchema)` to create a new message.
 */
export declare const DroppedSchema: GenMessage<Dropped>;
/**
 * VendorGap is one thing the agents say a named tool gets wrong, in their own words.
 *
 * @generated from message tank.catalog.v1.VendorGap
 */
export type VendorGap = Message<"tank.catalog.v1.VendorGap"> & {
    /**
     * the tool it is about
     *
     * @generated from field: string tool = 1;
     */
    tool: string;
    /**
     * @generated from field: string gap = 2;
     */
    gap: string;
    /**
     * the product whose research found it
     *
     * @generated from field: string from_product = 3;
     */
    fromProduct: string;
    /**
     * @generated from field: string from_slug = 4;
     */
    fromSlug: string;
};
/**
 * Describes the message tank.catalog.v1.VendorGap.
 * Use `create(VendorGapSchema)` to create a new message.
 */
export declare const VendorGapSchema: GenMessage<VendorGap>;
/**
 * ToolMention is a third-party tool the agents named while planning businesses, how
 * many of those businesses named it, and whether a TANK workspace already does that
 * job today.
 *
 * The third field is the point. The first two say what software a business is assumed
 * to run on; the third says how much of that assumption TANK already answers. Only
 * what ships today is marked covered — a roadmap in this column would make the whole
 * page an advertisement, and the page is only worth anything if it is not one.
 *
 * @generated from message tank.catalog.v1.ToolMention
 */
export type ToolMention = Message<"tank.catalog.v1.ToolMention"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * distinct products whose agents named it
     *
     * @generated from field: int64 products = 2;
     */
    products: bigint;
    /**
     * a TANK workspace does this job today
     *
     * @generated from field: bool covered = 3;
     */
    covered: boolean;
    /**
     * "where the team talks", "accounting", …
     *
     * @generated from field: string category = 4;
     */
    category: string;
    /**
     * A product the board is building to do this job. Empty when there is none.
     *
     * Separate from `covered` on purpose: covered means a TANK workspace does this
     * today, and a product being worked on is a weaker claim that deserves weaker
     * words. The page shows one as "Yes" and the other as a link and a percentage.
     *
     * @generated from field: string slug = 5;
     */
    slug: string;
    /**
     * its name
     *
     * @generated from field: string product = 6;
     */
    product: string;
    /**
     * how many stages of its journey are finished
     *
     * @generated from field: int32 stage = 7;
     */
    stage: number;
    /**
     * how many there are
     *
     * @generated from field: int32 total = 8;
     */
    total: number;
};
/**
 * Describes the message tank.catalog.v1.ToolMention.
 * Use `create(ToolMentionSchema)` to create a new message.
 */
export declare const ToolMentionSchema: GenMessage<ToolMention>;
/**
 * Event is one thing an agent finished, for a page that wants to look alive rather
 * than merely be accurate. Additive: a client that does not know about it renders
 * the figures exactly as before.
 *
 * @generated from message tank.catalog.v1.Event
 */
export type Event = Message<"tank.catalog.v1.Event"> & {
    /**
     * the product's name
     *
     * @generated from field: string product = 1;
     */
    product: string;
    /**
     * so the ticker can link
     *
     * @generated from field: string slug = 2;
     */
    slug: string;
    /**
     * which question it answered
     *
     * @generated from field: string stage = 3;
     */
    stage: string;
    /**
     * @generated from field: google.protobuf.Timestamp at = 4;
     */
    at?: Timestamp;
};
/**
 * Describes the message tank.catalog.v1.Event.
 * Use `create(EventSchema)` to create a new message.
 */
export declare const EventSchema: GenMessage<Event>;
/**
 * Ranked is a product and a number, for a leaderboard.
 *
 * @generated from message tank.catalog.v1.Ranked
 */
export type Ranked = Message<"tank.catalog.v1.Ranked"> & {
    /**
     * @generated from field: string product = 1;
     */
    product: string;
    /**
     * @generated from field: string slug = 2;
     */
    slug: string;
    /**
     * @generated from field: int64 value = 3;
     */
    value: bigint;
    /**
     * @generated from field: string industry = 4;
     */
    industry: string;
};
/**
 * Describes the message tank.catalog.v1.Ranked.
 * Use `create(RankedSchema)` to create a new message.
 */
export declare const RankedSchema: GenMessage<Ranked>;
/**
 * The orders a person actually asks for, named after what they mean rather than the
 * column they sort on, so the client never has to know that "furthest along" is
 * agent minutes.
 *
 * @generated from enum tank.catalog.v1.ProductSort
 */
export declare enum ProductSort {
    /**
     * @generated from enum value: PRODUCT_SORT_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: PRODUCT_SORT_NEWEST = 1;
     */
    NEWEST = 1,
    /**
     * @generated from enum value: PRODUCT_SORT_FURTHEST_ALONG = 2;
     */
    FURTHEST_ALONG = 2,
    /**
     * @generated from enum value: PRODUCT_SORT_CHEAPEST = 3;
     */
    CHEAPEST = 3,
    /**
     * @generated from enum value: PRODUCT_SORT_MOST_EXPENSIVE = 4;
     */
    MOST_EXPENSIVE = 4,
    /**
     * @generated from enum value: PRODUCT_SORT_MOST_VIEWED = 5;
     */
    MOST_VIEWED = 5
}
/**
 * Describes the enum tank.catalog.v1.ProductSort.
 */
export declare const ProductSortSchema: GenEnum<ProductSort>;
/**
 * @generated from service tank.catalog.v1.CatalogService
 */
export declare const CatalogService: GenService<{
    /**
     * Aggregate numbers about the board. Counts and sums only: nothing from inside a
     * workspace, nothing that identifies anybody. Public, because the point is that
     * other people can quote it.
     *
     * @generated from rpc tank.catalog.v1.CatalogService.BoardStats
     */
    boardStats: {
        methodKind: "unary";
        input: typeof BoardStatsRequestSchema;
        output: typeof BoardStatsResponseSchema;
    };
    /**
     * @generated from rpc tank.catalog.v1.CatalogService.BoardHistory
     */
    boardHistory: {
        methodKind: "unary";
        input: typeof BoardHistoryRequestSchema;
        output: typeof BoardHistoryResponseSchema;
    };
    /**
     * Anonymous.
     *
     * @generated from rpc tank.catalog.v1.CatalogService.ListProducts
     */
    listProducts: {
        methodKind: "unary";
        input: typeof ListProductsRequestSchema;
        output: typeof ListProductsResponseSchema;
    };
    /**
     * @generated from rpc tank.catalog.v1.CatalogService.RecordProductView
     */
    recordProductView: {
        methodKind: "unary";
        input: typeof RecordProductViewRequestSchema;
        output: typeof RecordProductViewResponseSchema;
    };
    /**
     * Signed in.
     *
     * @generated from rpc tank.catalog.v1.CatalogService.WatchProduct
     */
    watchProduct: {
        methodKind: "unary";
        input: typeof WatchProductRequestSchema;
        output: typeof WatchProductResponseSchema;
    };
    /**
     * @generated from rpc tank.catalog.v1.CatalogService.ListPortfolios
     */
    listPortfolios: {
        methodKind: "unary";
        input: typeof ListPortfoliosRequestSchema;
        output: typeof ListPortfoliosResponseSchema;
    };
    /**
     * @generated from rpc tank.catalog.v1.CatalogService.CreatePortfolio
     */
    createPortfolio: {
        methodKind: "unary";
        input: typeof CreatePortfolioRequestSchema;
        output: typeof CreatePortfolioResponseSchema;
    };
    /**
     * @generated from rpc tank.catalog.v1.CatalogService.RenamePortfolio
     */
    renamePortfolio: {
        methodKind: "unary";
        input: typeof RenamePortfolioRequestSchema;
        output: typeof RenamePortfolioResponseSchema;
    };
    /**
     * @generated from rpc tank.catalog.v1.CatalogService.DeletePortfolio
     */
    deletePortfolio: {
        methodKind: "unary";
        input: typeof DeletePortfolioRequestSchema;
        output: typeof DeletePortfolioResponseSchema;
    };
    /**
     * @generated from rpc tank.catalog.v1.CatalogService.SetPortfolioProduct
     */
    setPortfolioProduct: {
        methodKind: "unary";
        input: typeof SetPortfolioProductRequestSchema;
        output: typeof SetPortfolioProductResponseSchema;
    };
}>;
