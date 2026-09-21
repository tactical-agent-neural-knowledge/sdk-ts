import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message as Message$1 } from "../../message/v1/message_pb.js";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/search/v1/search.proto.
 */
export declare const file_tank_search_v1_search: GenFile;
/**
 * @generated from message tank.search.v1.SearchFilters
 */
export type SearchFilters = Message<"tank.search.v1.SearchFilters"> & {
    /**
     * @generated from field: repeated string from_user_ids = 1;
     */
    fromUserIds: string[];
    /**
     * @generated from field: repeated string in_channel_ids = 2;
     */
    inChannelIds: string[];
    /**
     * @generated from field: repeated tank.search.v1.HasFilter has = 3;
     */
    has: HasFilter[];
    /**
     * @generated from field: google.protobuf.Timestamp before = 4;
     */
    before?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp after = 5;
     */
    after?: Timestamp;
};
/**
 * Describes the message tank.search.v1.SearchFilters.
 * Use `create(SearchFiltersSchema)` to create a new message.
 */
export declare const SearchFiltersSchema: GenMessage<SearchFilters>;
/**
 * @generated from message tank.search.v1.SearchRequest
 */
export type SearchRequest = Message<"tank.search.v1.SearchRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * Free-text terms (websearch syntax: quoted phrases, -exclusions, OR).
     *
     * @generated from field: string query = 2;
     */
    query: string;
    /**
     * @generated from field: tank.search.v1.SearchFilters filters = 3;
     */
    filters?: SearchFilters;
    /**
     * @generated from field: string cursor = 4;
     */
    cursor: string;
    /**
     * @generated from field: int32 limit = 5;
     */
    limit: number;
    /**
     * Raw query with modifiers, parsed server-side and merged into query +
     * filters: `from:@name in:#tread has:file before:2026-09-01 after:2026-01-01`.
     *
     * @generated from field: string q = 6;
     */
    q: string;
    /**
     * Ask for the Neural Vault: keyword results fused with semantic neighbours.
     * Keyword search is Slack parity and always free; the semantic half is the
     * paid feature, so it is requested explicitly and metered per request.
     *
     * @generated from field: bool semantic = 7;
     */
    semantic: boolean;
};
/**
 * Describes the message tank.search.v1.SearchRequest.
 * Use `create(SearchRequestSchema)` to create a new message.
 */
export declare const SearchRequestSchema: GenMessage<SearchRequest>;
/**
 * @generated from message tank.search.v1.SearchHit
 */
export type SearchHit = Message<"tank.search.v1.SearchHit"> & {
    /**
     * @generated from field: tank.message.v1.Message message = 1;
     */
    message?: Message$1;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * Plain-text fragments around the matched terms; no markup.
     *
     * @generated from field: repeated string highlights = 3;
     */
    highlights: string[];
    /**
     * @generated from field: double score = 4;
     */
    score: number;
};
/**
 * Describes the message tank.search.v1.SearchHit.
 * Use `create(SearchHitSchema)` to create a new message.
 */
export declare const SearchHitSchema: GenMessage<SearchHit>;
/**
 * @generated from message tank.search.v1.SearchResponse
 */
export type SearchResponse = Message<"tank.search.v1.SearchResponse"> & {
    /**
     * @generated from field: repeated tank.search.v1.SearchHit hits = 1;
     */
    hits: SearchHit[];
    /**
     * @generated from field: string next_cursor = 2;
     */
    nextCursor: string;
    /**
     * @generated from field: int64 total_estimate = 3;
     */
    totalEstimate: bigint;
    /**
     * What the server understood from `q` (ids resolved) merged with `filters`.
     *
     * @generated from field: tank.search.v1.SearchFilters parsed_filters = 4;
     */
    parsedFilters?: SearchFilters;
    /**
     * The free-text remainder of `q` merged with `query`.
     *
     * @generated from field: string parsed_query = 5;
     */
    parsedQuery: string;
    /**
     * Whether semantic neighbours actually contributed. False when the caller
     * did not ask, on later pages, or when the embedder was unreachable — so a
     * client never claims the Vault answered when only keywords did.
     *
     * @generated from field: bool semantic_used = 6;
     */
    semanticUsed: boolean;
};
/**
 * Describes the message tank.search.v1.SearchResponse.
 * Use `create(SearchResponseSchema)` to create a new message.
 */
export declare const SearchResponseSchema: GenMessage<SearchResponse>;
/**
 * @generated from enum tank.search.v1.HasFilter
 */
export declare enum HasFilter {
    /**
     * @generated from enum value: HAS_FILTER_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: HAS_FILTER_FILES = 1;
     */
    FILES = 1,
    /**
     * @generated from enum value: HAS_FILTER_LINKS = 2;
     */
    LINKS = 2,
    /**
     * @generated from enum value: HAS_FILTER_REACTIONS = 3;
     */
    REACTIONS = 3,
    /**
     * @generated from enum value: HAS_FILTER_BLOCKS = 4;
     */
    BLOCKS = 4
}
/**
 * Describes the enum tank.search.v1.HasFilter.
 */
export declare const HasFilterSchema: GenEnum<HasFilter>;
/**
 * @generated from service tank.search.v1.SearchService
 */
export declare const SearchService: GenService<{
    /**
     * @generated from rpc tank.search.v1.SearchService.Search
     */
    search: {
        methodKind: "unary";
        input: typeof SearchRequestSchema;
        output: typeof SearchResponseSchema;
    };
}>;
