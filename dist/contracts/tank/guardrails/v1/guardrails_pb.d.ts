import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { JsonObject, Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/guardrails/v1/guardrails.proto.
 */
export declare const file_tank_guardrails_v1_guardrails: GenFile;
/**
 * @generated from message tank.guardrails.v1.Guardrail
 */
export type Guardrail = Message<"tank.guardrails.v1.Guardrail"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * @generated from field: tank.guardrails.v1.GuardrailScope scope = 3;
     */
    scope: GuardrailScope;
    /**
     * channel id for a Tread guardrail; empty for the workspace
     *
     * @generated from field: string scope_id = 4;
     */
    scopeId: string;
    /**
     * @generated from field: tank.guardrails.v1.GuardrailKind kind = 5;
     */
    kind: GuardrailKind;
    /**
     * The sentence a person reads. For a rule it is the whole guardrail.
     *
     * @generated from field: string text = 6;
     */
    text: string;
    /**
     * The shape's parameters, by kind: order {before, after}, decide {step, question,
     * options}, verify {check, command}, shape {prs_per_repo, draft_until, max_files,
     * labels}, scope {never_paths, only_paths, repos}, tools {deny, gate, hosts}.
     *
     * @generated from field: google.protobuf.Struct params = 7;
     */
    params?: JsonObject;
    /**
     * Watched: judged by a model at the checkpoints rather than refused by a record.
     *
     * @generated from field: bool judged = 8;
     */
    judged: boolean;
    /**
     * @generated from field: bool enabled = 9;
     */
    enabled: boolean;
    /**
     * @generated from field: string created_by = 10;
     */
    createdBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 11;
     */
    createdAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp updated_at = 12;
     */
    updatedAt?: Timestamp;
    /**
     * @generated from field: tank.guardrails.v1.Strength strength = 13;
     */
    strength: Strength;
    /**
     * Why it is as strong as it is, one line each, and the risk sentence a weak or OK
     * guardrail shows.
     *
     * @generated from field: repeated string strength_reasons = 14;
     */
    strengthReasons: string[];
    /**
     * @generated from field: string risk = 15;
     */
    risk: string;
    /**
     * How many runs this guardrail stopped, by mode, so coverage is visible: e.g. {"tread": 2, "crew": 1}.
     *
     * @generated from field: map<string, int64> stops = 16;
     */
    stops: {
        [key: string]: bigint;
    };
    /**
     * Platform guardrails apply everywhere and cannot be edited.
     *
     * @generated from field: bool platform = 17;
     */
    platform: boolean;
};
/**
 * Describes the message tank.guardrails.v1.Guardrail.
 * Use `create(GuardrailSchema)` to create a new message.
 */
export declare const GuardrailSchema: GenMessage<Guardrail>;
/**
 * @generated from message tank.guardrails.v1.Verdict
 */
export type Verdict = Message<"tank.guardrails.v1.Verdict"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string run_id = 2;
     */
    runId: string;
    /**
     * @generated from field: string guardrail_id = 3;
     */
    guardrailId: string;
    /**
     * @generated from field: string guardrail_text = 4;
     */
    guardrailText: string;
    /**
     * c0 admission, c1 plan, c2 tool, c3 pull_request, c4 done, c5 intake
     *
     * @generated from field: string checkpoint = 5;
     */
    checkpoint: string;
    /**
     * @generated from field: tank.guardrails.v1.VerdictState state = 6;
     */
    state: VerdictState;
    /**
     * One sentence, and the verbatim quote from TANK's records it rests on.
     *
     * @generated from field: string detail = 7;
     */
    detail: string;
    /**
     * @generated from field: string quote = 8;
     */
    quote: string;
    /**
     * @generated from field: google.protobuf.Timestamp at = 9;
     */
    at?: Timestamp;
    /**
     * Who decided, for a stop-and-ask that was answered: a user id, or "judge".
     *
     * @generated from field: string decided_by = 10;
     */
    decidedBy: string;
    /**
     * @generated from field: string run_mode = 11;
     */
    runMode: string;
};
/**
 * Describes the message tank.guardrails.v1.Verdict.
 * Use `create(VerdictSchema)` to create a new message.
 */
export declare const VerdictSchema: GenMessage<Verdict>;
/**
 * The rating a guardrail gets as it is typed.
 *
 * @generated from message tank.guardrails.v1.Rating
 */
export type Rating = Message<"tank.guardrails.v1.Rating"> & {
    /**
     * @generated from field: tank.guardrails.v1.Strength strength = 1;
     */
    strength: Strength;
    /**
     * @generated from field: repeated string reasons = 2;
     */
    reasons: string[];
    /**
     * @generated from field: string risk = 3;
     */
    risk: string;
    /**
     * What a Watched sentence could become to be Guaranteed, when TANK can tell.
     *
     * @generated from field: tank.guardrails.v1.GuardrailKind suggested_kind = 4;
     */
    suggestedKind: GuardrailKind;
    /**
     * @generated from field: google.protobuf.Struct suggested_params = 5;
     */
    suggestedParams?: JsonObject;
};
/**
 * Describes the message tank.guardrails.v1.Rating.
 * Use `create(RatingSchema)` to create a new message.
 */
export declare const RatingSchema: GenMessage<Rating>;
/**
 * @generated from message tank.guardrails.v1.ListGuardrailsRequest
 */
export type ListGuardrailsRequest = Message<"tank.guardrails.v1.ListGuardrailsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * With a channel id: the workspace's guardrails plus that Tread's own.
     *
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
};
/**
 * Describes the message tank.guardrails.v1.ListGuardrailsRequest.
 * Use `create(ListGuardrailsRequestSchema)` to create a new message.
 */
export declare const ListGuardrailsRequestSchema: GenMessage<ListGuardrailsRequest>;
/**
 * @generated from message tank.guardrails.v1.ListGuardrailsResponse
 */
export type ListGuardrailsResponse = Message<"tank.guardrails.v1.ListGuardrailsResponse"> & {
    /**
     * @generated from field: repeated tank.guardrails.v1.Guardrail guardrails = 1;
     */
    guardrails: Guardrail[];
    /**
     * False on a free workspace: the list holds only the platform's guardrails and the
     * page is grayed with Upgrade.
     *
     * @generated from field: bool premium = 2;
     */
    premium: boolean;
};
/**
 * Describes the message tank.guardrails.v1.ListGuardrailsResponse.
 * Use `create(ListGuardrailsResponseSchema)` to create a new message.
 */
export declare const ListGuardrailsResponseSchema: GenMessage<ListGuardrailsResponse>;
/**
 * @generated from message tank.guardrails.v1.PutGuardrailRequest
 */
export type PutGuardrailRequest = Message<"tank.guardrails.v1.PutGuardrailRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * id empty makes a new one; otherwise the one to change (audited).
     *
     * @generated from field: tank.guardrails.v1.Guardrail guardrail = 2;
     */
    guardrail?: Guardrail;
};
/**
 * Describes the message tank.guardrails.v1.PutGuardrailRequest.
 * Use `create(PutGuardrailRequestSchema)` to create a new message.
 */
export declare const PutGuardrailRequestSchema: GenMessage<PutGuardrailRequest>;
/**
 * @generated from message tank.guardrails.v1.PutGuardrailResponse
 */
export type PutGuardrailResponse = Message<"tank.guardrails.v1.PutGuardrailResponse"> & {
    /**
     * @generated from field: tank.guardrails.v1.Guardrail guardrail = 1;
     */
    guardrail?: Guardrail;
};
/**
 * Describes the message tank.guardrails.v1.PutGuardrailResponse.
 * Use `create(PutGuardrailResponseSchema)` to create a new message.
 */
export declare const PutGuardrailResponseSchema: GenMessage<PutGuardrailResponse>;
/**
 * @generated from message tank.guardrails.v1.DeleteGuardrailRequest
 */
export type DeleteGuardrailRequest = Message<"tank.guardrails.v1.DeleteGuardrailRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
};
/**
 * Describes the message tank.guardrails.v1.DeleteGuardrailRequest.
 * Use `create(DeleteGuardrailRequestSchema)` to create a new message.
 */
export declare const DeleteGuardrailRequestSchema: GenMessage<DeleteGuardrailRequest>;
/**
 * @generated from message tank.guardrails.v1.DeleteGuardrailResponse
 */
export type DeleteGuardrailResponse = Message<"tank.guardrails.v1.DeleteGuardrailResponse"> & {};
/**
 * Describes the message tank.guardrails.v1.DeleteGuardrailResponse.
 * Use `create(DeleteGuardrailResponseSchema)` to create a new message.
 */
export declare const DeleteGuardrailResponseSchema: GenMessage<DeleteGuardrailResponse>;
/**
 * @generated from message tank.guardrails.v1.RateGuardrailRequest
 */
export type RateGuardrailRequest = Message<"tank.guardrails.v1.RateGuardrailRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: tank.guardrails.v1.GuardrailScope scope = 2;
     */
    scope: GuardrailScope;
    /**
     * @generated from field: tank.guardrails.v1.GuardrailKind kind = 3;
     */
    kind: GuardrailKind;
    /**
     * @generated from field: string text = 4;
     */
    text: string;
    /**
     * @generated from field: google.protobuf.Struct params = 5;
     */
    params?: JsonObject;
};
/**
 * Describes the message tank.guardrails.v1.RateGuardrailRequest.
 * Use `create(RateGuardrailRequestSchema)` to create a new message.
 */
export declare const RateGuardrailRequestSchema: GenMessage<RateGuardrailRequest>;
/**
 * @generated from message tank.guardrails.v1.RateGuardrailResponse
 */
export type RateGuardrailResponse = Message<"tank.guardrails.v1.RateGuardrailResponse"> & {
    /**
     * @generated from field: tank.guardrails.v1.Rating rating = 1;
     */
    rating?: Rating;
};
/**
 * Describes the message tank.guardrails.v1.RateGuardrailResponse.
 * Use `create(RateGuardrailResponseSchema)` to create a new message.
 */
export declare const RateGuardrailResponseSchema: GenMessage<RateGuardrailResponse>;
/**
 * @generated from message tank.guardrails.v1.ListVerdictsRequest
 */
export type ListVerdictsRequest = Message<"tank.guardrails.v1.ListVerdictsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * every verdict of one run
     *
     * @generated from field: string run_id = 2;
     */
    runId: string;
    /**
     * or every verdict of one guardrail, newest first
     *
     * @generated from field: string guardrail_id = 3;
     */
    guardrailId: string;
    /**
     * @generated from field: int32 limit = 4;
     */
    limit: number;
};
/**
 * Describes the message tank.guardrails.v1.ListVerdictsRequest.
 * Use `create(ListVerdictsRequestSchema)` to create a new message.
 */
export declare const ListVerdictsRequestSchema: GenMessage<ListVerdictsRequest>;
/**
 * @generated from message tank.guardrails.v1.ListVerdictsResponse
 */
export type ListVerdictsResponse = Message<"tank.guardrails.v1.ListVerdictsResponse"> & {
    /**
     * @generated from field: repeated tank.guardrails.v1.Verdict verdicts = 1;
     */
    verdicts: Verdict[];
};
/**
 * Describes the message tank.guardrails.v1.ListVerdictsResponse.
 * Use `create(ListVerdictsResponseSchema)` to create a new message.
 */
export declare const ListVerdictsResponseSchema: GenMessage<ListVerdictsResponse>;
/**
 * Phase 3: "add guardrails from this document". The text of a plan, a spec or a policy
 * is read for the rules it states; each becomes a proposed guardrail, shaped where the
 * sentence has a shape and a rule otherwise, rated, and shown for confirmation before
 * anything is saved. Nothing is stored by this call.
 *
 * @generated from message tank.guardrails.v1.ExtractGuardrailsRequest
 */
export type ExtractGuardrailsRequest = Message<"tank.guardrails.v1.ExtractGuardrailsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * The document's text (plain text or Markdown), at most 200 KiB.
     *
     * @generated from field: string text = 2;
     */
    text: string;
    /**
     * With a channel id the proposals are scoped to that Tread; otherwise the workspace.
     *
     * @generated from field: string channel_id = 3;
     */
    channelId: string;
};
/**
 * Describes the message tank.guardrails.v1.ExtractGuardrailsRequest.
 * Use `create(ExtractGuardrailsRequestSchema)` to create a new message.
 */
export declare const ExtractGuardrailsRequestSchema: GenMessage<ExtractGuardrailsRequest>;
/**
 * @generated from message tank.guardrails.v1.ExtractGuardrailsResponse
 */
export type ExtractGuardrailsResponse = Message<"tank.guardrails.v1.ExtractGuardrailsResponse"> & {
    /**
     * Proposed guardrails, unsaved (no id), each with its rating filled in.
     *
     * @generated from field: repeated tank.guardrails.v1.Guardrail proposals = 1;
     */
    proposals: Guardrail[];
    /**
     * The document's sentence each proposal came from, parallel to proposals.
     *
     * @generated from field: repeated string sources = 2;
     */
    sources: string[];
};
/**
 * Describes the message tank.guardrails.v1.ExtractGuardrailsResponse.
 * Use `create(ExtractGuardrailsResponseSchema)` to create a new message.
 */
export declare const ExtractGuardrailsResponseSchema: GenMessage<ExtractGuardrailsResponse>;
/**
 * What shape a guardrail has, which decides how it is enforced.
 *
 * @generated from enum tank.guardrails.v1.GuardrailKind
 */
export declare enum GuardrailKind {
    /**
     * @generated from enum value: GUARDRAIL_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * A sentence a separate model judges at the checkpoints: Watched, never Guaranteed.
     *
     * @generated from enum value: GUARDRAIL_KIND_RULE = 1;
     */
    RULE = 1,
    /**
     * "<A> lands before <B> starts": paths or labels; refused at push and pull request.
     *
     * @generated from enum value: GUARDRAIL_KIND_ORDER = 2;
     */
    ORDER = 2,
    /**
     * "Before <step>, a person decides: <question>": the run waits on a decision card.
     *
     * @generated from enum value: GUARDRAIL_KIND_DECIDE = 3;
     */
    DECIDE = 3,
    /**
     * "<check> must pass before a pull request": proven by TANK's own checker job.
     *
     * @generated from enum value: GUARDRAIL_KIND_VERIFY = 4;
     */
    VERIFY = 4,
    /**
     * What a pull request looks like: one per repository, draft until, at most N files.
     *
     * @generated from enum value: GUARDRAIL_KIND_SHAPE = 5;
     */
    SHAPE = 5,
    /**
     * Paths and repositories a run may or may not touch.
     *
     * @generated from enum value: GUARDRAIL_KIND_SCOPE = 6;
     */
    SCOPE = 6,
    /**
     * Commands refused or gated, hosts allowed: the policy's tools section, same page.
     *
     * @generated from enum value: GUARDRAIL_KIND_TOOLS = 7;
     */
    TOOLS = 7
}
/**
 * Describes the enum tank.guardrails.v1.GuardrailKind.
 */
export declare const GuardrailKindSchema: GenEnum<GuardrailKind>;
/**
 * @generated from enum tank.guardrails.v1.GuardrailScope
 */
export declare enum GuardrailScope {
    /**
     * @generated from enum value: GUARDRAIL_SCOPE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * every Tread in the workspace
     *
     * @generated from enum value: GUARDRAIL_SCOPE_WORKSPACE = 1;
     */
    WORKSPACE = 1,
    /**
     * one Tread (scope_id is its channel id)
     *
     * @generated from enum value: GUARDRAIL_SCOPE_TREAD = 2;
     */
    TREAD = 2
}
/**
 * Describes the enum tank.guardrails.v1.GuardrailScope.
 */
export declare const GuardrailScopeSchema: GenEnum<GuardrailScope>;
/**
 * How much a guardrail can promise, computed as it is typed and stored with it.
 *
 * @generated from enum tank.guardrails.v1.Strength
 */
export declare enum Strength {
    /**
     * @generated from enum value: STRENGTH_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Watched and too vague to judge
     *
     * @generated from enum value: STRENGTH_WEAK = 1;
     */
    WEAK = 1,
    /**
     * Watched, specific enough to judge from evidence
     *
     * @generated from enum value: STRENGTH_OK = 2;
     */
    OK = 2,
    /**
     * Guaranteed: refused at the action by TANK's records
     *
     * @generated from enum value: STRENGTH_STRONG = 3;
     */
    STRONG = 3,
    /**
     * Guaranteed, organization-wide, refused at push time, drilled daily
     *
     * @generated from enum value: STRENGTH_VERY_STRONG = 4;
     */
    VERY_STRONG = 4
}
/**
 * Describes the enum tank.guardrails.v1.Strength.
 */
export declare const StrengthSchema: GenEnum<Strength>;
/**
 * A judgement of one guardrail at one checkpoint of one run.
 *
 * @generated from enum tank.guardrails.v1.VerdictState
 */
export declare enum VerdictState {
    /**
     * @generated from enum value: VERDICT_STATE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: VERDICT_STATE_MET = 1;
     */
    MET = 1,
    /**
     * @generated from enum value: VERDICT_STATE_VIOLATED = 2;
     */
    VIOLATED = 2,
    /**
     * @generated from enum value: VERDICT_STATE_UNSURE = 3;
     */
    UNSURE = 3,
    /**
     * @generated from enum value: VERDICT_STATE_NOT_APPLICABLE = 4;
     */
    NOT_APPLICABLE = 4
}
/**
 * Describes the enum tank.guardrails.v1.VerdictState.
 */
export declare const VerdictStateSchema: GenEnum<VerdictState>;
/**
 * GuardrailService is what the clients call, on the messaging core, which checks the
 * workspace, the plan and the caller's role and asks the control plane for the rest.
 *
 * @generated from service tank.guardrails.v1.GuardrailService
 */
export declare const GuardrailService: GenService<{
    /**
     * @generated from rpc tank.guardrails.v1.GuardrailService.ListGuardrails
     */
    listGuardrails: {
        methodKind: "unary";
        input: typeof ListGuardrailsRequestSchema;
        output: typeof ListGuardrailsResponseSchema;
    };
    /**
     * @generated from rpc tank.guardrails.v1.GuardrailService.PutGuardrail
     */
    putGuardrail: {
        methodKind: "unary";
        input: typeof PutGuardrailRequestSchema;
        output: typeof PutGuardrailResponseSchema;
    };
    /**
     * @generated from rpc tank.guardrails.v1.GuardrailService.DeleteGuardrail
     */
    deleteGuardrail: {
        methodKind: "unary";
        input: typeof DeleteGuardrailRequestSchema;
        output: typeof DeleteGuardrailResponseSchema;
    };
    /**
     * @generated from rpc tank.guardrails.v1.GuardrailService.RateGuardrail
     */
    rateGuardrail: {
        methodKind: "unary";
        input: typeof RateGuardrailRequestSchema;
        output: typeof RateGuardrailResponseSchema;
    };
    /**
     * @generated from rpc tank.guardrails.v1.GuardrailService.ListVerdicts
     */
    listVerdicts: {
        methodKind: "unary";
        input: typeof ListVerdictsRequestSchema;
        output: typeof ListVerdictsResponseSchema;
    };
    /**
     * @generated from rpc tank.guardrails.v1.GuardrailService.ExtractGuardrails
     */
    extractGuardrails: {
        methodKind: "unary";
        input: typeof ExtractGuardrailsRequestSchema;
        output: typeof ExtractGuardrailsResponseSchema;
    };
}>;
