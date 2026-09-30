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
