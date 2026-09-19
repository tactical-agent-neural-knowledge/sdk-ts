import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/agent/v1/agent.proto.
 */
export declare const file_tank_agent_v1_agent: GenFile;
/**
 * @generated from message tank.agent.v1.Agent
 */
export type Agent = Message<"tank.agent.v1.Agent"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * the agent's user row
     *
     * @generated from field: string principal_id = 3;
     */
    principalId: string;
    /**
     * @generated from field: string name = 4;
     */
    name: string;
    /**
     * @generated from field: repeated string scopes = 5;
     */
    scopes: string[];
};
/**
 * Describes the message tank.agent.v1.Agent.
 * Use `create(AgentSchema)` to create a new message.
 */
export declare const AgentSchema: GenMessage<Agent>;
/**
 * @generated from message tank.agent.v1.Run
 */
export type Run = Message<"tank.agent.v1.Run"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * @generated from field: string channel_id = 3;
     */
    channelId: string;
    /**
     * @generated from field: string thread_root_id = 4;
     */
    threadRootId: string;
    /**
     * @generated from field: string agent_id = 5;
     */
    agentId: string;
    /**
     * @generated from field: string requested_by = 6;
     */
    requestedBy: string;
    /**
     * @generated from field: tank.agent.v1.RunState state = 7;
     */
    state: RunState;
    /**
     * @generated from field: string branch = 8;
     */
    branch: string;
    /**
     * @generated from field: string pr_url = 9;
     */
    prUrl: string;
    /**
     * @generated from field: double cost_usd = 10;
     */
    costUsd: number;
    /**
     * @generated from field: string status_message_id = 11;
     */
    statusMessageId: string;
    /**
     * @generated from field: google.protobuf.Timestamp started_at = 12;
     */
    startedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp ended_at = 13;
     */
    endedAt?: Timestamp;
};
/**
 * Describes the message tank.agent.v1.Run.
 * Use `create(RunSchema)` to create a new message.
 */
export declare const RunSchema: GenMessage<Run>;
/**
 * @generated from message tank.agent.v1.StartRunRequest
 */
export type StartRunRequest = Message<"tank.agent.v1.StartRunRequest"> & {
    /**
     * @generated from field: string thread_root_id = 1;
     */
    threadRootId: string;
    /**
     * @generated from field: string agent_id = 2;
     */
    agentId: string;
    /**
     * @generated from field: string instructions = 3;
     */
    instructions: string;
};
/**
 * Describes the message tank.agent.v1.StartRunRequest.
 * Use `create(StartRunRequestSchema)` to create a new message.
 */
export declare const StartRunRequestSchema: GenMessage<StartRunRequest>;
/**
 * @generated from message tank.agent.v1.StartRunResponse
 */
export type StartRunResponse = Message<"tank.agent.v1.StartRunResponse"> & {
    /**
     * @generated from field: tank.agent.v1.Run run = 1;
     */
    run?: Run;
    /**
     * Agent-session token scoped to this thread; TTL = max run duration.
     *
     * @generated from field: string agent_session_token = 2;
     */
    agentSessionToken: string;
    /**
     * @generated from field: google.protobuf.Timestamp token_expires_at = 3;
     */
    tokenExpiresAt?: Timestamp;
};
/**
 * Describes the message tank.agent.v1.StartRunResponse.
 * Use `create(StartRunResponseSchema)` to create a new message.
 */
export declare const StartRunResponseSchema: GenMessage<StartRunResponse>;
/**
 * @generated from message tank.agent.v1.StopRunRequest
 */
export type StopRunRequest = Message<"tank.agent.v1.StopRunRequest"> & {
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
 * Describes the message tank.agent.v1.StopRunRequest.
 * Use `create(StopRunRequestSchema)` to create a new message.
 */
export declare const StopRunRequestSchema: GenMessage<StopRunRequest>;
/**
 * @generated from message tank.agent.v1.StopRunResponse
 */
export type StopRunResponse = Message<"tank.agent.v1.StopRunResponse"> & {
    /**
     * @generated from field: tank.agent.v1.Run run = 1;
     */
    run?: Run;
};
/**
 * Describes the message tank.agent.v1.StopRunResponse.
 * Use `create(StopRunResponseSchema)` to create a new message.
 */
export declare const StopRunResponseSchema: GenMessage<StopRunResponse>;
/**
 * @generated from message tank.agent.v1.HeartbeatRequest
 */
export type HeartbeatRequest = Message<"tank.agent.v1.HeartbeatRequest"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
};
/**
 * Describes the message tank.agent.v1.HeartbeatRequest.
 * Use `create(HeartbeatRequestSchema)` to create a new message.
 */
export declare const HeartbeatRequestSchema: GenMessage<HeartbeatRequest>;
/**
 * @generated from message tank.agent.v1.HeartbeatResponse
 */
export type HeartbeatResponse = Message<"tank.agent.v1.HeartbeatResponse"> & {};
/**
 * Describes the message tank.agent.v1.HeartbeatResponse.
 * Use `create(HeartbeatResponseSchema)` to create a new message.
 */
export declare const HeartbeatResponseSchema: GenMessage<HeartbeatResponse>;
/**
 * @generated from message tank.agent.v1.SetStatusRequest
 */
export type SetStatusRequest = Message<"tank.agent.v1.SetStatusRequest"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
    /**
     * @generated from field: tank.agent.v1.RunState state = 2;
     */
    state: RunState;
    /**
     * human-readable, shown like typing
     *
     * @generated from field: string status = 3;
     */
    status: string;
    /**
     * @generated from field: string branch = 4;
     */
    branch: string;
    /**
     * @generated from field: string pr_url = 5;
     */
    prUrl: string;
    /**
     * @generated from field: double cost_usd = 6;
     */
    costUsd: number;
};
/**
 * Describes the message tank.agent.v1.SetStatusRequest.
 * Use `create(SetStatusRequestSchema)` to create a new message.
 */
export declare const SetStatusRequestSchema: GenMessage<SetStatusRequest>;
/**
 * @generated from message tank.agent.v1.SetStatusResponse
 */
export type SetStatusResponse = Message<"tank.agent.v1.SetStatusResponse"> & {
    /**
     * @generated from field: tank.agent.v1.Run run = 1;
     */
    run?: Run;
};
/**
 * Describes the message tank.agent.v1.SetStatusResponse.
 * Use `create(SetStatusResponseSchema)` to create a new message.
 */
export declare const SetStatusResponseSchema: GenMessage<SetStatusResponse>;
/**
 * @generated from message tank.agent.v1.GetRunRequest
 */
export type GetRunRequest = Message<"tank.agent.v1.GetRunRequest"> & {
    /**
     * @generated from field: string run_id = 1;
     */
    runId: string;
};
/**
 * Describes the message tank.agent.v1.GetRunRequest.
 * Use `create(GetRunRequestSchema)` to create a new message.
 */
export declare const GetRunRequestSchema: GenMessage<GetRunRequest>;
/**
 * @generated from message tank.agent.v1.GetRunResponse
 */
export type GetRunResponse = Message<"tank.agent.v1.GetRunResponse"> & {
    /**
     * @generated from field: tank.agent.v1.Run run = 1;
     */
    run?: Run;
};
/**
 * Describes the message tank.agent.v1.GetRunResponse.
 * Use `create(GetRunResponseSchema)` to create a new message.
 */
export declare const GetRunResponseSchema: GenMessage<GetRunResponse>;
/**
 * @generated from message tank.agent.v1.ListRunsRequest
 */
export type ListRunsRequest = Message<"tank.agent.v1.ListRunsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * @generated from field: string thread_root_id = 3;
     */
    threadRootId: string;
    /**
     * @generated from field: string cursor = 4;
     */
    cursor: string;
    /**
     * @generated from field: int32 limit = 5;
     */
    limit: number;
};
/**
 * Describes the message tank.agent.v1.ListRunsRequest.
 * Use `create(ListRunsRequestSchema)` to create a new message.
 */
export declare const ListRunsRequestSchema: GenMessage<ListRunsRequest>;
/**
 * @generated from message tank.agent.v1.ListRunsResponse
 */
export type ListRunsResponse = Message<"tank.agent.v1.ListRunsResponse"> & {
    /**
     * @generated from field: repeated tank.agent.v1.Run runs = 1;
     */
    runs: Run[];
    /**
     * @generated from field: string next_cursor = 2;
     */
    nextCursor: string;
};
/**
 * Describes the message tank.agent.v1.ListRunsResponse.
 * Use `create(ListRunsResponseSchema)` to create a new message.
 */
export declare const ListRunsResponseSchema: GenMessage<ListRunsResponse>;
/**
 * @generated from enum tank.agent.v1.RunState
 */
export declare enum RunState {
    /**
     * @generated from enum value: RUN_STATE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: RUN_STATE_REQUESTED = 1;
     */
    REQUESTED = 1,
    /**
     * @generated from enum value: RUN_STATE_ADMITTED = 2;
     */
    ADMITTED = 2,
    /**
     * @generated from enum value: RUN_STATE_PROVISIONING = 3;
     */
    PROVISIONING = 3,
    /**
     * @generated from enum value: RUN_STATE_PLANNING = 4;
     */
    PLANNING = 4,
    /**
     * @generated from enum value: RUN_STATE_AWAITING_PLAN_APPROVAL = 5;
     */
    AWAITING_PLAN_APPROVAL = 5,
    /**
     * @generated from enum value: RUN_STATE_IMPLEMENTING = 6;
     */
    IMPLEMENTING = 6,
    /**
     * @generated from enum value: RUN_STATE_PUSHED = 7;
     */
    PUSHED = 7,
    /**
     * @generated from enum value: RUN_STATE_CI_WATCHING = 8;
     */
    CI_WATCHING = 8,
    /**
     * @generated from enum value: RUN_STATE_PR_OPEN = 9;
     */
    PR_OPEN = 9,
    /**
     * @generated from enum value: RUN_STATE_AWAITING_MERGE_APPROVAL = 10;
     */
    AWAITING_MERGE_APPROVAL = 10,
    /**
     * @generated from enum value: RUN_STATE_MERGED = 11;
     */
    MERGED = 11,
    /**
     * @generated from enum value: RUN_STATE_VERIFYING_DEPLOY = 12;
     */
    VERIFYING_DEPLOY = 12,
    /**
     * @generated from enum value: RUN_STATE_DONE = 13;
     */
    DONE = 13,
    /**
     * @generated from enum value: RUN_STATE_CANCELLED = 14;
     */
    CANCELLED = 14,
    /**
     * @generated from enum value: RUN_STATE_FAILED = 15;
     */
    FAILED = 15,
    /**
     * @generated from enum value: RUN_STATE_BUDGET_EXHAUSTED = 16;
     */
    BUDGET_EXHAUSTED = 16,
    /**
     * @generated from enum value: RUN_STATE_TIMED_OUT = 17;
     */
    TIMED_OUT = 17,
    /**
     * @generated from enum value: RUN_STATE_APPROVAL_EXPIRED = 18;
     */
    APPROVAL_EXPIRED = 18
}
/**
 * Describes the enum tank.agent.v1.RunState.
 */
export declare const RunStateSchema: GenEnum<RunState>;
/**
 * @generated from service tank.agent.v1.AgentService
 */
export declare const AgentService: GenService<{
    /**
     * @generated from rpc tank.agent.v1.AgentService.StartRun
     */
    startRun: {
        methodKind: "unary";
        input: typeof StartRunRequestSchema;
        output: typeof StartRunResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.StopRun
     */
    stopRun: {
        methodKind: "unary";
        input: typeof StopRunRequestSchema;
        output: typeof StopRunResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.Heartbeat
     */
    heartbeat: {
        methodKind: "unary";
        input: typeof HeartbeatRequestSchema;
        output: typeof HeartbeatResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.SetStatus
     */
    setStatus: {
        methodKind: "unary";
        input: typeof SetStatusRequestSchema;
        output: typeof SetStatusResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.GetRun
     */
    getRun: {
        methodKind: "unary";
        input: typeof GetRunRequestSchema;
        output: typeof GetRunResponseSchema;
    };
    /**
     * @generated from rpc tank.agent.v1.AgentService.ListRuns
     */
    listRuns: {
        methodKind: "unary";
        input: typeof ListRunsRequestSchema;
        output: typeof ListRunsResponseSchema;
    };
}>;
