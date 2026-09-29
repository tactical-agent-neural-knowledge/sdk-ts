import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/platform/v1/platform.proto.
 */
export declare const file_tank_platform_v1_platform: GenFile;
/**
 * AgentureRow is one product on the board as the console sees it.
 *
 * @generated from message tank.platform.v1.AgentureRow
 */
export type AgentureRow = Message<"tank.platform.v1.AgentureRow"> & {
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
     * Allocation.
     *
     * @generated from field: bool enabled = 5;
     */
    enabled: boolean;
    /**
     * share of the board's attention, 0 to 100
     *
     * @generated from field: int32 weight = 6;
     */
    weight: number;
    /**
     * @generated from field: google.protobuf.Timestamp next_due_at = 7;
     */
    nextDueAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp last_run_at = 8;
     */
    lastRunAt?: Timestamp;
    /**
     * spikes asked for since it joined the board
     *
     * @generated from field: int32 runs = 9;
     */
    runs: number;
    /**
     * why the last attempt failed, if it did
     *
     * @generated from field: string last_error = 10;
     */
    lastError: string;
    /**
     * Work.
     *
     * everything an agent has spent in it
     *
     * @generated from field: int64 agent_minutes = 11;
     */
    agentMinutes: bigint;
    /**
     * empty when nothing is running
     *
     * @generated from field: string live_run_id = 12;
     */
    liveRunId: string;
    /**
     * the live run's state, for the console
     *
     * @generated from field: string live_state = 13;
     */
    liveState: string;
    /**
     * what its agents have cost, all time
     *
     * @generated from field: double spend_usd = 14;
     */
    spendUsd: number;
    /**
     * Money.
     *
     * what it would cost to take over right now
     *
     * @generated from field: int64 price_cents = 15;
     */
    priceCents: bigint;
    /**
     * @generated from field: bool claimed = 16;
     */
    claimed: boolean;
};
/**
 * Describes the message tank.platform.v1.AgentureRow.
 * Use `create(AgentureRowSchema)` to create a new message.
 */
export declare const AgentureRowSchema: GenMessage<AgentureRow>;
/**
 * @generated from message tank.platform.v1.ListAgenturesRequest
 */
export type ListAgenturesRequest = Message<"tank.platform.v1.ListAgenturesRequest"> & {
    /**
     * match on name or slug
     *
     * @generated from field: string query = 1;
     */
    query: string;
    /**
     * @generated from field: int32 limit = 2;
     */
    limit: number;
    /**
     * @generated from field: int32 offset = 3;
     */
    offset: number;
};
/**
 * Describes the message tank.platform.v1.ListAgenturesRequest.
 * Use `create(ListAgenturesRequestSchema)` to create a new message.
 */
export declare const ListAgenturesRequestSchema: GenMessage<ListAgenturesRequest>;
/**
 * @generated from message tank.platform.v1.ListAgenturesResponse
 */
export type ListAgenturesResponse = Message<"tank.platform.v1.ListAgenturesResponse"> & {
    /**
     * @generated from field: repeated tank.platform.v1.AgentureRow agentures = 1;
     */
    agentures: AgentureRow[];
    /**
     * @generated from field: int32 total = 2;
     */
    total: number;
    /**
     * @generated from field: tank.platform.v1.BoardSummary summary = 3;
     */
    summary?: BoardSummary;
};
/**
 * Describes the message tank.platform.v1.ListAgenturesResponse.
 * Use `create(ListAgenturesResponseSchema)` to create a new message.
 */
export declare const ListAgenturesResponseSchema: GenMessage<ListAgenturesResponse>;
/**
 * BoardSummary is the state of the whole board in one line.
 *
 * @generated from message tank.platform.v1.BoardSummary
 */
export type BoardSummary = Message<"tank.platform.v1.BoardSummary"> & {
    /**
     * agents working, or briefed and about to be
     *
     * @generated from field: int32 in_flight = 1;
     */
    inFlight: number;
    /**
     * the cap they are held to
     *
     * @generated from field: int32 max_concurrent = 2;
     */
    maxConcurrent: number;
    /**
     * whether the board's agents run at all
     *
     * @generated from field: bool enabled = 3;
     */
    enabled: boolean;
    /**
     * @generated from field: int32 unclaimed = 4;
     */
    unclaimed: number;
    /**
     * @generated from field: int64 agent_minutes_24h = 5;
     */
    agentMinutes24h: bigint;
    /**
     * what the board cost in the last day
     *
     * @generated from field: double spend_usd_24h = 6;
     */
    spendUsd24h: number;
    /**
     * @generated from field: double spend_usd_total = 7;
     */
    spendUsdTotal: number;
};
/**
 * Describes the message tank.platform.v1.BoardSummary.
 * Use `create(BoardSummarySchema)` to create a new message.
 */
export declare const BoardSummarySchema: GenMessage<BoardSummary>;
/**
 * SetAllocation changes how much attention a product gets. Weight 0 or enabled=false
 * both stop new work; neither touches a run already going.
 *
 * @generated from message tank.platform.v1.SetAllocationRequest
 */
export type SetAllocationRequest = Message<"tank.platform.v1.SetAllocationRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: bool enabled = 2;
     */
    enabled: boolean;
    /**
     * @generated from field: int32 weight = 3;
     */
    weight: number;
    /**
     * become due now rather than at its next turn
     *
     * @generated from field: bool run_now = 4;
     */
    runNow: boolean;
};
/**
 * Describes the message tank.platform.v1.SetAllocationRequest.
 * Use `create(SetAllocationRequestSchema)` to create a new message.
 */
export declare const SetAllocationRequestSchema: GenMessage<SetAllocationRequest>;
/**
 * @generated from message tank.platform.v1.SetAllocationResponse
 */
export type SetAllocationResponse = Message<"tank.platform.v1.SetAllocationResponse"> & {
    /**
     * @generated from field: tank.platform.v1.AgentureRow agenture = 1;
     */
    agenture?: AgentureRow;
};
/**
 * Describes the message tank.platform.v1.SetAllocationResponse.
 * Use `create(SetAllocationResponseSchema)` to create a new message.
 */
export declare const SetAllocationResponseSchema: GenMessage<SetAllocationResponse>;
/**
 * StopRun stops an agent that is working right now.
 *
 * @generated from message tank.platform.v1.StopRunRequest
 */
export type StopRunRequest = Message<"tank.platform.v1.StopRunRequest"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
    /**
     * @generated from field: string reason = 2;
     */
    reason: string;
};
/**
 * Describes the message tank.platform.v1.StopRunRequest.
 * Use `create(StopRunRequestSchema)` to create a new message.
 */
export declare const StopRunRequestSchema: GenMessage<StopRunRequest>;
/**
 * @generated from message tank.platform.v1.StopRunResponse
 */
export type StopRunResponse = Message<"tank.platform.v1.StopRunResponse"> & {};
/**
 * Describes the message tank.platform.v1.StopRunResponse.
 * Use `create(StopRunResponseSchema)` to create a new message.
 */
export declare const StopRunResponseSchema: GenMessage<StopRunResponse>;
/**
 * @generated from service tank.platform.v1.PlatformService
 */
export declare const PlatformService: GenService<{
    /**
     * @generated from rpc tank.platform.v1.PlatformService.ListAgentures
     */
    listAgentures: {
        methodKind: "unary";
        input: typeof ListAgenturesRequestSchema;
        output: typeof ListAgenturesResponseSchema;
    };
    /**
     * @generated from rpc tank.platform.v1.PlatformService.SetAllocation
     */
    setAllocation: {
        methodKind: "unary";
        input: typeof SetAllocationRequestSchema;
        output: typeof SetAllocationResponseSchema;
    };
    /**
     * @generated from rpc tank.platform.v1.PlatformService.StopRun
     */
    stopRun: {
        methodKind: "unary";
        input: typeof StopRunRequestSchema;
        output: typeof StopRunResponseSchema;
    };
}>;
