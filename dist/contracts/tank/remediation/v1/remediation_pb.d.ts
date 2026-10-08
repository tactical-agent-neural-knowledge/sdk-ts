import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/remediation/v1/remediation.proto.
 */
export declare const file_tank_remediation_v1_remediation: GenFile;
/**
 * What was observed, where it came from, and when — the registry's own evidence
 * shape, carried across so the pull request can cite what found it rather than
 * asserting that something did.
 *
 * @generated from message tank.remediation.v1.Evidence
 */
export type Evidence = Message<"tank.remediation.v1.Evidence"> & {
    /**
     * @generated from field: string summary = 1;
     */
    summary: string;
    /**
     * Where a reader can go and look: a SQL query, a file and line, a config key.
     *
     * @generated from field: string source = 2;
     */
    source: string;
    /**
     * @generated from field: google.protobuf.Timestamp observed_at = 3;
     */
    observedAt?: Timestamp;
    /**
     * The raw observation when it is short enough to carry: the value read, the
     * rows counted, the lines matched.
     *
     * @generated from field: string detail = 4;
     */
    detail: string;
};
/**
 * Describes the message tank.remediation.v1.Evidence.
 * Use `create(EvidenceSchema)` to create a new message.
 */
export declare const EvidenceSchema: GenMessage<Evidence>;
/**
 * A finding, as the registry states it. The engine does not re-derive any of
 * this: it is the judge's output and the engine's input, and the engine is not
 * allowed an opinion about whether the finding is real.
 *
 * @generated from message tank.remediation.v1.Finding
 */
export type Finding = Message<"tank.remediation.v1.Finding"> & {
    /**
     * The registry's own finding id, e.g. "F-AGENT-SCHEMA-WRITES". Stable, and
     * the key the engine deduplicates on together with control_version.
     *
     * @generated from field: string finding_id = 1;
     */
    findingId: string;
    /**
     * The control the finding is attached to, e.g. "data.control-plane-read-only".
     *
     * @generated from field: string control_id = 2;
     */
    controlId: string;
    /**
     * The control's version. A finding against version 2 of a control is not the
     * same finding as one against version 3, because the question changed.
     *
     * @generated from field: int32 control_version = 3;
     */
    controlVersion: number;
    /**
     * One sentence a security lead would recognise.
     *
     * @generated from field: string summary = 4;
     */
    summary: string;
    /**
     * Where it is: repository paths, a resource, a table. As the registry writes
     * it, which is a comma-separated list of loci.
     *
     * @generated from field: string locus = 5;
     */
    locus: string;
    /**
     * low | medium | high | critical.
     *
     * @generated from field: string severity = 6;
     */
    severity: string;
    /**
     * What the registry says should be done. Advice to the run, never an
     * instruction to the engine: the engine decides what it is allowed to do.
     *
     * @generated from field: string proposal = 7;
     */
    proposal: string;
    /**
     * @generated from field: tank.remediation.v1.Evidence evidence = 8;
     */
    evidence?: Evidence;
    /**
     * The probe from §2.2 that will keep checking once this is fixed. Empty is
     * allowed and is recorded as a gap rather than ignored — a fix with nothing
     * watching it is the state this whole phase exists to leave behind.
     *
     * @generated from field: string probe_id = 9;
     */
    probeId: string;
    /**
     * registry | probe | operator. Who said so, because an operator-submitted
     * finding is a human judgement and is labelled as one.
     *
     * @generated from field: string source = 10;
     */
    source: string;
    /**
     * The state the control was in when the finding was stated. The engine
     * re-reads it before acting: a finding whose control has since changed state
     * is stale, and stale findings are reviewed rather than executed.
     *
     * @generated from field: string control_state = 11;
     */
    controlState: string;
};
/**
 * Describes the message tank.remediation.v1.Finding.
 * Use `create(FindingSchema)` to create a new message.
 */
export declare const FindingSchema: GenMessage<Finding>;
/**
 * A declared class of fix. The class is what makes auto-apply safe to have at
 * all: an auto-apply class has to be written down, with its reverse, before
 * anything is eligible for it, and the list is short enough to read.
 *
 * @generated from message tank.remediation.v1.Class
 */
export type Class = Message<"tank.remediation.v1.Class"> & {
    /**
     * Stable id, e.g. "control-plane-boundary" or "stale-token".
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string title = 2;
     */
    title: string;
    /**
     * What this class of fix changes, in one sentence.
     *
     * @generated from field: string description = 3;
     */
    description: string;
    /**
     * The strongest disposition this class is allowed. A class that may only ever
     * propose says PROPOSE here, and nothing can raise it at submission time.
     *
     * @generated from field: tank.remediation.v1.Disposition max_disposition = 4;
     */
    maxDisposition: Disposition;
    /**
     * What the regression test must assert. Mandatory: a class with no test
     * requirement cannot be registered, because the test is the part that makes
     * the fix stick.
     *
     * @generated from field: string test_requirement = 5;
     */
    testRequirement: string;
    /**
     * True when the change can be undone by a single counter-action, and
     * `undo` says what that action is. Mandatory for AUTO_APPLY.
     *
     * @generated from field: bool reversible = 6;
     */
    reversible: boolean;
    /**
     * @generated from field: string undo = 7;
     */
    undo: string;
    /**
     * True when a mistake in this class could lock an operator out of the system.
     * Such a class can never be AUTO_APPLY, whatever else it declares: the one
     * failure mode a security fix must not have is becoming the outage.
     *
     * @generated from field: bool lockout_risk = 8;
     */
    lockoutRisk: boolean;
    /**
     * The gate a human answers before an auto-apply class acts. Empty for
     * PROPOSE classes, mandatory for AUTO_APPLY.
     *
     * @generated from field: string gate_kind = 9;
     */
    gateKind: string;
};
/**
 * Describes the message tank.remediation.v1.Class.
 * Use `create(ClassSchema)` to create a new message.
 */
export declare const ClassSchema: GenMessage<Class>;
/**
 * One repository the same fix applies to. The list is the whole point of
 * "fix the class, not the instance": a finding in one repository is a finding
 * about a pattern, and the pattern is wherever the pattern is.
 *
 * @generated from message tank.remediation.v1.Target
 */
export type Target = Message<"tank.remediation.v1.Target"> & {
    /**
     * owner/name
     *
     * @generated from field: string repo = 1;
     */
    repo: string;
    /**
     * @generated from field: string workspace_id = 2;
     */
    workspaceId: string;
    /**
     * @generated from field: string channel_id = 3;
     */
    channelId: string;
    /**
     * The thread the work is announced in and the run reports to.
     *
     * @generated from field: string thread_root_id = 4;
     */
    threadRootId: string;
    /**
     * The run that did the work, so the flight recorder can be read for it.
     *
     * @generated from field: string run_id = 5;
     */
    runId: string;
    /**
     * @generated from field: string branch = 6;
     */
    branch: string;
    /**
     * @generated from field: string pull_request_url = 7;
     */
    pullRequestUrl: string;
    /**
     * @generated from field: tank.remediation.v1.RemediationState state = 8;
     */
    state: RemediationState;
    /**
     * Why this target is in the state it is. Mandatory for FAILED and REFUSED.
     *
     * @generated from field: string detail = 9;
     */
    detail: string;
    /**
     * @generated from field: google.protobuf.Timestamp started_at = 10;
     */
    startedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp ended_at = 11;
     */
    endedAt?: Timestamp;
    /**
     * Why the engine thinks the finding applies here: the same grant, the same
     * query shape, the same dependency. Recorded so a workspace can read why it
     * was handed a pull request it did not ask for.
     *
     * @generated from field: string why = 12;
     */
    why: string;
};
/**
 * Describes the message tank.remediation.v1.Target.
 * Use `create(TargetSchema)` to create a new message.
 */
export declare const TargetSchema: GenMessage<Target>;
/**
 * One finding, as the engine is handling it.
 *
 * @generated from message tank.remediation.v1.Remediation
 */
export type Remediation = Message<"tank.remediation.v1.Remediation"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: tank.remediation.v1.Finding finding = 2;
     */
    finding?: Finding;
    /**
     * @generated from field: string class_id = 3;
     */
    classId: string;
    /**
     * @generated from field: tank.remediation.v1.Disposition disposition = 4;
     */
    disposition: Disposition;
    /**
     * @generated from field: tank.remediation.v1.RemediationState state = 5;
     */
    state: RemediationState;
    /**
     * Mandatory when disposition is REFUSED or state is REFUSED.
     *
     * @generated from field: string refusal_reason = 6;
     */
    refusalReason: string;
    /**
     * @generated from field: repeated tank.remediation.v1.Target targets = 7;
     */
    targets: Target[];
    /**
     * What every run for this remediation is told, verbatim. In the record
     * because a brief is an instruction to an agent with write access, and an
     * instruction nobody can read afterwards is not accountable.
     *
     * @generated from field: string brief = 8;
     */
    brief: string;
    /**
     * Paths no run under this remediation may touch, because they are the
     * controls, probes and framework mappings that judge it. The separation of
     * powers, as a list rather than as a promise.
     *
     * @generated from field: repeated string forbidden_paths = 9;
     */
    forbiddenPaths: string[];
    /**
     * The principal that judged, and the principal that fixes. The engine refuses
     * a remediation where they are the same.
     *
     * @generated from field: string judge_principal = 10;
     */
    judgePrincipal: string;
    /**
     * @generated from field: string fix_principal = 11;
     */
    fixPrincipal: string;
    /**
     * @generated from field: google.protobuf.Timestamp received_at = 12;
     */
    receivedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp planned_at = 13;
     */
    plannedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp ended_at = 14;
     */
    endedAt?: Timestamp;
    /**
     * The probe the pull request cites as what will keep checking. Empty when the
     * finding named none, which is itself reported.
     *
     * @generated from field: string probe_id = 15;
     */
    probeId: string;
    /**
     * True when the finding named no probe. Surfaced rather than inferred: a fix
     * with nothing watching it should be visible as that.
     *
     * @generated from field: bool unwatched = 16;
     */
    unwatched: boolean;
};
/**
 * Describes the message tank.remediation.v1.Remediation.
 * Use `create(RemediationSchema)` to create a new message.
 */
export declare const RemediationSchema: GenMessage<Remediation>;
/**
 * SubmitFinding hands one finding across the boundary.
 *
 * Idempotent on (finding_id, control_version): submitting the same finding
 * again returns the remediation already in flight rather than opening a second
 * set of pull requests, which is the behaviour an hourly evaluation requires.
 *
 * @generated from message tank.remediation.v1.SubmitFindingRequest
 */
export type SubmitFindingRequest = Message<"tank.remediation.v1.SubmitFindingRequest"> & {
    /**
     * @generated from field: tank.remediation.v1.Finding finding = 1;
     */
    finding?: Finding;
    /**
     * Plan and record, run nothing. What an operator uses to see the blast radius
     * — the class, the targets, the brief, the forbidden paths — before any agent
     * is started. The §2.4 "blast radius before you grant it" screen, for a fix.
     *
     * @generated from field: bool dry_run = 2;
     */
    dryRun: boolean;
    /**
     * Submit again even though one is in flight, because the finding's evidence
     * changed. The previous remediation is marked SUPERSEDED.
     *
     * @generated from field: bool resubmit = 3;
     */
    resubmit: boolean;
    /**
     * The principal the registry is submitting as. Recorded as judge_principal,
     * and refused if it is the same as the engine's own fix principal.
     *
     * @generated from field: string judge_principal = 4;
     */
    judgePrincipal: string;
};
/**
 * Describes the message tank.remediation.v1.SubmitFindingRequest.
 * Use `create(SubmitFindingRequestSchema)` to create a new message.
 */
export declare const SubmitFindingRequestSchema: GenMessage<SubmitFindingRequest>;
/**
 * @generated from message tank.remediation.v1.SubmitFindingResponse
 */
export type SubmitFindingResponse = Message<"tank.remediation.v1.SubmitFindingResponse"> & {
    /**
     * @generated from field: tank.remediation.v1.Remediation remediation = 1;
     */
    remediation?: Remediation;
    /**
     * Targets the engine declined to act on, each with its reason, so a caller
     * sees the refusals rather than only the count that succeeded.
     *
     * @generated from field: repeated tank.remediation.v1.Target declined = 2;
     */
    declined: Target[];
};
/**
 * Describes the message tank.remediation.v1.SubmitFindingResponse.
 * Use `create(SubmitFindingResponseSchema)` to create a new message.
 */
export declare const SubmitFindingResponseSchema: GenMessage<SubmitFindingResponse>;
/**
 * @generated from message tank.remediation.v1.GetRemediationRequest
 */
export type GetRemediationRequest = Message<"tank.remediation.v1.GetRemediationRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
};
/**
 * Describes the message tank.remediation.v1.GetRemediationRequest.
 * Use `create(GetRemediationRequestSchema)` to create a new message.
 */
export declare const GetRemediationRequestSchema: GenMessage<GetRemediationRequest>;
/**
 * @generated from message tank.remediation.v1.GetRemediationResponse
 */
export type GetRemediationResponse = Message<"tank.remediation.v1.GetRemediationResponse"> & {
    /**
     * @generated from field: tank.remediation.v1.Remediation remediation = 1;
     */
    remediation?: Remediation;
};
/**
 * Describes the message tank.remediation.v1.GetRemediationResponse.
 * Use `create(GetRemediationResponseSchema)` to create a new message.
 */
export declare const GetRemediationResponseSchema: GenMessage<GetRemediationResponse>;
/**
 * How a proposed fix reports back. The registry polls this: the engine does not
 * write to the registry, because a program that can change the control that
 * judges it is the thing this design exists to prevent. The engine's answer is
 * a list of remediations and their pull requests; what the registry does with
 * that — whether a finding is still open, whether a control's state changes —
 * stays the registry's own decision.
 *
 * @generated from message tank.remediation.v1.ListRemediationsRequest
 */
export type ListRemediationsRequest = Message<"tank.remediation.v1.ListRemediationsRequest"> & {
    /**
     * Filter to one finding. Empty returns the whole queue.
     *
     * @generated from field: string finding_id = 1;
     */
    findingId: string;
    /**
     * @generated from field: string control_id = 2;
     */
    controlId: string;
    /**
     * @generated from field: tank.remediation.v1.RemediationState state = 3;
     */
    state: RemediationState;
    /**
     * @generated from field: int32 limit = 4;
     */
    limit: number;
    /**
     * Only remediations that changed after this, so a poller can ask repeatedly
     * without reading the world each time.
     *
     * @generated from field: google.protobuf.Timestamp since = 5;
     */
    since?: Timestamp;
};
/**
 * Describes the message tank.remediation.v1.ListRemediationsRequest.
 * Use `create(ListRemediationsRequestSchema)` to create a new message.
 */
export declare const ListRemediationsRequestSchema: GenMessage<ListRemediationsRequest>;
/**
 * @generated from message tank.remediation.v1.ListRemediationsResponse
 */
export type ListRemediationsResponse = Message<"tank.remediation.v1.ListRemediationsResponse"> & {
    /**
     * @generated from field: repeated tank.remediation.v1.Remediation remediations = 1;
     */
    remediations: Remediation[];
};
/**
 * Describes the message tank.remediation.v1.ListRemediationsResponse.
 * Use `create(ListRemediationsResponseSchema)` to create a new message.
 */
export declare const ListRemediationsResponseSchema: GenMessage<ListRemediationsResponse>;
/**
 * The declared classes, and which of them may act without a pull request. This
 * is the list a buyer's security team should be shown: not "the agent only does
 * safe things" but "here are the four things it may do by itself, each with its
 * reverse written next to it".
 *
 * @generated from message tank.remediation.v1.ListClassesRequest
 */
export type ListClassesRequest = Message<"tank.remediation.v1.ListClassesRequest"> & {};
/**
 * Describes the message tank.remediation.v1.ListClassesRequest.
 * Use `create(ListClassesRequestSchema)` to create a new message.
 */
export declare const ListClassesRequestSchema: GenMessage<ListClassesRequest>;
/**
 * @generated from message tank.remediation.v1.ListClassesResponse
 */
export type ListClassesResponse = Message<"tank.remediation.v1.ListClassesResponse"> & {
    /**
     * @generated from field: repeated tank.remediation.v1.Class classes = 1;
     */
    classes: Class[];
};
/**
 * Describes the message tank.remediation.v1.ListClassesResponse.
 * Use `create(ListClassesResponseSchema)` to create a new message.
 */
export declare const ListClassesResponseSchema: GenMessage<ListClassesResponse>;
/**
 * @generated from message tank.remediation.v1.CancelRemediationRequest
 */
export type CancelRemediationRequest = Message<"tank.remediation.v1.CancelRemediationRequest"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string reason = 2;
     */
    reason: string;
    /**
     * @generated from field: string user_id = 3;
     */
    userId: string;
};
/**
 * Describes the message tank.remediation.v1.CancelRemediationRequest.
 * Use `create(CancelRemediationRequestSchema)` to create a new message.
 */
export declare const CancelRemediationRequestSchema: GenMessage<CancelRemediationRequest>;
/**
 * @generated from message tank.remediation.v1.CancelRemediationResponse
 */
export type CancelRemediationResponse = Message<"tank.remediation.v1.CancelRemediationResponse"> & {
    /**
     * @generated from field: tank.remediation.v1.Remediation remediation = 1;
     */
    remediation?: Remediation;
};
/**
 * Describes the message tank.remediation.v1.CancelRemediationResponse.
 * Use `create(CancelRemediationResponseSchema)` to create a new message.
 */
export declare const CancelRemediationResponseSchema: GenMessage<CancelRemediationResponse>;
/**
 * How strong an intervention a remediation is allowed to be. The default — the
 * zero value's neighbour and the answer for everything that is not on a short
 * declared list — is PROPOSE.
 *
 * @generated from enum tank.remediation.v1.Disposition
 */
export declare enum Disposition {
    /**
     * @generated from enum value: DISPOSITION_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * A pull request a human merges. The posture for every code change, always.
     *
     * @generated from enum value: DISPOSITION_PROPOSE = 1;
     */
    PROPOSE = 1,
    /**
     * Applied by the platform, behind a policy gate, announced in the thread,
     * with a one-click undo. Only for a declared, reversible, narrow class, and
     * never for anything that can lock an operator out.
     *
     * @generated from enum value: DISPOSITION_AUTO_APPLY = 2;
     */
    AUTO_APPLY = 2,
    /**
     * The engine will not act on this finding, and says why. A refusal is a
     * first-class outcome: "we could fix this and chose not to" and "we cannot
     * fix this" are different sentences and both belong in the record.
     *
     * @generated from enum value: DISPOSITION_REFUSED = 3;
     */
    REFUSED = 3
}
/**
 * Describes the enum tank.remediation.v1.Disposition.
 */
export declare const DispositionSchema: GenEnum<Disposition>;
/**
 * Where a remediation, or one of its targets, has got to.
 *
 * @generated from enum tank.remediation.v1.RemediationState
 */
export declare enum RemediationState {
    /**
     * @generated from enum value: REMEDIATION_STATE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Accepted and recorded; nothing has run.
     *
     * @generated from enum value: REMEDIATION_STATE_RECEIVED = 1;
     */
    RECEIVED = 1,
    /**
     * The class is known and the targets are resolved.
     *
     * @generated from enum value: REMEDIATION_STATE_PLANNED = 2;
     */
    PLANNED = 2,
    /**
     * At least one run is working.
     *
     * @generated from enum value: REMEDIATION_STATE_RUNNING = 3;
     */
    RUNNING = 3,
    /**
     * A pull request is open and waiting for a human. The ordinary terminal
     * state, and the one the product is about.
     *
     * @generated from enum value: REMEDIATION_STATE_PROPOSED = 4;
     */
    PROPOSED = 4,
    /**
     * Merged, or applied for an auto-apply class.
     *
     * @generated from enum value: REMEDIATION_STATE_APPLIED = 5;
     */
    APPLIED = 5,
    /**
     * Tried and could not. Carries the reason.
     *
     * @generated from enum value: REMEDIATION_STATE_FAILED = 6;
     */
    FAILED = 6,
    /**
     * Not attempted, with a reason. The honest answer for a finding whose fix is
     * a human decision, and for anything the separation of powers forbids.
     *
     * @generated from enum value: REMEDIATION_STATE_REFUSED = 7;
     */
    REFUSED = 7,
    /**
     * A newer remediation for the same finding replaced this one.
     *
     * @generated from enum value: REMEDIATION_STATE_SUPERSEDED = 8;
     */
    SUPERSEDED = 8
}
/**
 * Describes the enum tank.remediation.v1.RemediationState.
 */
export declare const RemediationStateSchema: GenEnum<RemediationState>;
/**
 * The remediation engine. Implemented by the agent control plane, called by the
 * messaging core's control registry, authenticated with the control-plane
 * service token.
 *
 * There is deliberately no RPC here that changes a control, retires a probe,
 * edits a framework mapping or marks a finding resolved. The engine fixes and
 * the registry judges, and neither has a method for the other's job.
 *
 * @generated from service tank.remediation.v1.RemediationService
 */
export declare const RemediationService: GenService<{
    /**
     * @generated from rpc tank.remediation.v1.RemediationService.SubmitFinding
     */
    submitFinding: {
        methodKind: "unary";
        input: typeof SubmitFindingRequestSchema;
        output: typeof SubmitFindingResponseSchema;
    };
    /**
     * @generated from rpc tank.remediation.v1.RemediationService.GetRemediation
     */
    getRemediation: {
        methodKind: "unary";
        input: typeof GetRemediationRequestSchema;
        output: typeof GetRemediationResponseSchema;
    };
    /**
     * @generated from rpc tank.remediation.v1.RemediationService.ListRemediations
     */
    listRemediations: {
        methodKind: "unary";
        input: typeof ListRemediationsRequestSchema;
        output: typeof ListRemediationsResponseSchema;
    };
    /**
     * @generated from rpc tank.remediation.v1.RemediationService.ListClasses
     */
    listClasses: {
        methodKind: "unary";
        input: typeof ListClassesRequestSchema;
        output: typeof ListClassesResponseSchema;
    };
    /**
     * @generated from rpc tank.remediation.v1.RemediationService.CancelRemediation
     */
    cancelRemediation: {
        methodKind: "unary";
        input: typeof CancelRemediationRequestSchema;
        output: typeof CancelRemediationResponseSchema;
    };
}>;
