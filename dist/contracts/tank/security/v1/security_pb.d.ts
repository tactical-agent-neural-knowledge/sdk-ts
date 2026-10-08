import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/security/v1/security.proto.
 */
export declare const file_tank_security_v1_security: GenFile;
/**
 * What was observed, where it came from, and how long ago. The age is part of
 * the answer, not metadata about it.
 *
 * @generated from message tank.security.v1.Evidence
 */
export type Evidence = Message<"tank.security.v1.Evidence"> & {
    /**
     * One line, in plain language, of what was actually observed.
     *
     * @generated from field: string summary = 1;
     */
    summary: string;
    /**
     * Where it came from so a reader can go and look: a file and line, a SQL
     * query, a config key, an AWS resource address.
     *
     * @generated from field: string source = 2;
     */
    source: string;
    /**
     * @generated from field: google.protobuf.Timestamp observed_at = 3;
     */
    observedAt?: Timestamp;
    /**
     * @generated from field: int64 age_seconds = 4;
     */
    ageSeconds: bigint;
    /**
     * True when the age exceeds the control's max_age. A stale evidence always
     * arrives with state UNKNOWN.
     *
     * @generated from field: bool stale = 5;
     */
    stale: boolean;
    /**
     * The raw observation, when it is short enough to carry: the value read, the
     * rows counted, the lines matched.
     *
     * @generated from field: string detail = 6;
     */
    detail: string;
};
/**
 * Describes the message tank.security.v1.Evidence.
 * Use `create(EvidenceSchema)` to create a new message.
 */
export declare const EvidenceSchema: GenMessage<Evidence>;
/**
 * A human saying so, with a name and a date. Modelled explicitly so it can
 * never be mistaken for a measurement.
 *
 * @generated from message tank.security.v1.Attestation
 */
export type Attestation = Message<"tank.security.v1.Attestation"> & {
    /**
     * A person, not a team and not "TANK". Accountability needs a name.
     *
     * @generated from field: string author = 1;
     */
    author: string;
    /**
     * @generated from field: string statement = 2;
     */
    statement: string;
    /**
     * @generated from field: google.protobuf.Timestamp at = 3;
     */
    at?: Timestamp;
    /**
     * An attestation with no expiry is a claim with no end, so every one has a
     * review date. Past it the control reports UNKNOWN.
     *
     * @generated from field: google.protobuf.Timestamp expires_at = 4;
     */
    expiresAt?: Timestamp;
    /**
     * @generated from field: bool expired = 5;
     */
    expired: boolean;
};
/**
 * Describes the message tank.security.v1.Attestation.
 * Use `create(AttestationSchema)` to create a new message.
 */
export declare const AttestationSchema: GenMessage<Attestation>;
/**
 * One clause of one framework, mapped onto a control. This message is the whole
 * of a crosswalk: adding ISO 27001 adds these rows and nothing else.
 *
 * @generated from message tank.security.v1.FrameworkClause
 */
export type FrameworkClause = Message<"tank.security.v1.FrameworkClause"> & {
    /**
     * Framework id, lowercase and stable: "soc2".
     *
     * @generated from field: string framework = 1;
     */
    framework: string;
    /**
     * The clause as the framework itself names it: "CC6.1".
     *
     * @generated from field: string clause = 2;
     */
    clause: string;
    /**
     * What that clause asks for, in the framework's own words, abbreviated.
     *
     * @generated from field: string title = 3;
     */
    title: string;
};
/**
 * Describes the message tank.security.v1.FrameworkClause.
 * Use `create(FrameworkClauseSchema)` to create a new message.
 */
export declare const FrameworkClauseSchema: GenMessage<FrameworkClause>;
/**
 * Something known to be wrong, named rather than left out. Findings travel with
 * the control so a remediation phase can read them.
 *
 * @generated from message tank.security.v1.Finding
 */
export type Finding = Message<"tank.security.v1.Finding"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * What is wrong, in one sentence a security lead would recognise.
     *
     * @generated from field: string summary = 2;
     */
    summary: string;
    /**
     * Where it is: a repo path, a resource, a table.
     *
     * @generated from field: string locus = 3;
     */
    locus: string;
    /**
     * low | medium | high | critical.
     *
     * @generated from field: string severity = 4;
     */
    severity: string;
    /**
     * What we would do about it. Phase 0 proposes; it does not fix.
     *
     * @generated from field: string proposal = 5;
     */
    proposal: string;
};
/**
 * Describes the message tank.security.v1.Finding.
 * Use `create(FindingSchema)` to create a new message.
 */
export declare const FindingSchema: GenMessage<Finding>;
/**
 * One fact about the running system.
 *
 * @generated from message tank.security.v1.Control
 */
export type Control = Message<"tank.security.v1.Control"> & {
    /**
     * Stable id, dotted and never renumbered: "data.tenant-isolation.rls".
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * Bumped when the statement or the check changes meaning, so an old answer
     * is not read as an answer to a new question.
     *
     * @generated from field: int32 version = 2;
     */
    version: number;
    /**
     * What the control asserts, in plain language, as a sentence that can be
     * true or false. Not a policy title.
     *
     * @generated from field: string statement = 3;
     */
    statement: string;
    /**
     * Who answers for it. A person or a role, never "the team".
     *
     * @generated from field: string owner = 4;
     */
    owner: string;
    /**
     * @generated from field: tank.security.v1.ControlCategory category = 5;
     */
    category: ControlCategory;
    /**
     * @generated from field: tank.security.v1.CheckKind check_kind = 6;
     */
    checkKind: CheckKind;
    /**
     * How it is evaluated, in words, so a reader can judge the check itself.
     *
     * @generated from field: string check = 7;
     */
    check: string;
    /**
     * The query, file or command that produces the evidence.
     *
     * @generated from field: string evidence_query = 8;
     */
    evidenceQuery: string;
    /**
     * Every framework clause this control satisfies. One control, many frameworks.
     *
     * @generated from field: repeated tank.security.v1.FrameworkClause clauses = 9;
     */
    clauses: FrameworkClause[];
    /**
     * @generated from field: tank.security.v1.ControlState state = 10;
     */
    state: ControlState;
    /**
     * Mandatory for PARTLY (the limit) and NOT_APPLICABLE (why not).
     *
     * @generated from field: string reason = 11;
     */
    reason: string;
    /**
     * @generated from field: tank.security.v1.Evidence evidence = 12;
     */
    evidence?: Evidence;
    /**
     * Set only when check_kind is ATTESTATION.
     *
     * @generated from field: tank.security.v1.Attestation attestation = 13;
     */
    attestation?: Attestation;
    /**
     * @generated from field: google.protobuf.Timestamp evaluated_at = 14;
     */
    evaluatedAt?: Timestamp;
    /**
     * How long an answer to this control stays worth believing.
     *
     * @generated from field: int64 max_age_seconds = 15;
     */
    maxAgeSeconds: bigint;
    /**
     * @generated from field: bool stale = 16;
     */
    stale: boolean;
    /**
     * @generated from field: repeated tank.security.v1.Finding findings = 17;
     */
    findings: Finding[];
    /**
     * @generated from field: repeated string tags = 18;
     */
    tags: string[];
};
/**
 * Describes the message tank.security.v1.Control.
 * Use `create(ControlSchema)` to create a new message.
 */
export declare const ControlSchema: GenMessage<Control>;
/**
 * How many controls are in one state.
 *
 * @generated from message tank.security.v1.StateCount
 */
export type StateCount = Message<"tank.security.v1.StateCount"> & {
    /**
     * @generated from field: tank.security.v1.ControlState state = 1;
     */
    state: ControlState;
    /**
     * @generated from field: int32 count = 2;
     */
    count: number;
};
/**
 * Describes the message tank.security.v1.StateCount.
 * Use `create(StateCountSchema)` to create a new message.
 */
export declare const StateCountSchema: GenMessage<StateCount>;
/**
 * The posture: every control, in its current state, with the counts a person
 * reads first.
 *
 * @generated from message tank.security.v1.Posture
 */
export type Posture = Message<"tank.security.v1.Posture"> & {
    /**
     * Version of the registry that produced this answer.
     *
     * @generated from field: string registry_version = 1;
     */
    registryVersion: string;
    /**
     * @generated from field: google.protobuf.Timestamp generated_at = 2;
     */
    generatedAt?: Timestamp;
    /**
     * @generated from field: int32 total = 3;
     */
    total: number;
    /**
     * @generated from field: repeated tank.security.v1.StateCount counts = 4;
     */
    counts: StateCount[];
    /**
     * @generated from field: repeated tank.security.v1.Control controls = 5;
     */
    controls: Control[];
    /**
     * Controls whose state is UNKNOWN because nothing has evaluated them
     * recently. Pulled out because it is the number that says whether the rest
     * of the posture can be trusted at all.
     *
     * @generated from field: int32 unknown = 6;
     */
    unknown: number;
};
/**
 * Describes the message tank.security.v1.Posture.
 * Use `create(PostureSchema)` to create a new message.
 */
export declare const PostureSchema: GenMessage<Posture>;
/**
 * A framework clause, with the controls mapped to it and the state that follows
 * from them. The clause state is derived, never stored: the worst of its
 * controls, so a crosswalk cannot be greener than the facts under it.
 *
 * @generated from message tank.security.v1.ClauseCoverage
 */
export type ClauseCoverage = Message<"tank.security.v1.ClauseCoverage"> & {
    /**
     * @generated from field: string clause = 1;
     */
    clause: string;
    /**
     * @generated from field: string title = 2;
     */
    title: string;
    /**
     * @generated from field: repeated string control_ids = 3;
     */
    controlIds: string[];
    /**
     * @generated from field: tank.security.v1.ControlState state = 4;
     */
    state: ControlState;
};
/**
 * Describes the message tank.security.v1.ClauseCoverage.
 * Use `create(ClauseCoverageSchema)` to create a new message.
 */
export declare const ClauseCoverageSchema: GenMessage<ClauseCoverage>;
/**
 * One framework, as a view over the controls.
 *
 * @generated from message tank.security.v1.FrameworkCoverage
 */
export type FrameworkCoverage = Message<"tank.security.v1.FrameworkCoverage"> & {
    /**
     * @generated from field: string framework = 1;
     */
    framework: string;
    /**
     * @generated from field: string title = 2;
     */
    title: string;
    /**
     * What the mapping deliberately does not cover, said plainly.
     *
     * @generated from field: string scope_note = 3;
     */
    scopeNote: string;
    /**
     * @generated from field: int32 clauses = 4;
     */
    clauses: number;
    /**
     * @generated from field: repeated tank.security.v1.ClauseCoverage clause_coverage = 5;
     */
    clauseCoverage: ClauseCoverage[];
    /**
     * @generated from field: repeated tank.security.v1.StateCount counts = 6;
     */
    counts: StateCount[];
};
/**
 * Describes the message tank.security.v1.FrameworkCoverage.
 * Use `create(FrameworkCoverageSchema)` to create a new message.
 */
export declare const FrameworkCoverageSchema: GenMessage<FrameworkCoverage>;
/**
 * @generated from message tank.security.v1.GetPostureRequest
 */
export type GetPostureRequest = Message<"tank.security.v1.GetPostureRequest"> & {
    /**
     * Filter to one category. Unspecified returns all.
     *
     * @generated from field: tank.security.v1.ControlCategory category = 1;
     */
    category: ControlCategory;
    /**
     * Filter to one state. Unspecified returns all.
     *
     * @generated from field: tank.security.v1.ControlState state = 2;
     */
    state: ControlState;
    /**
     * Return counts only, without the controls.
     *
     * @generated from field: bool summary_only = 3;
     */
    summaryOnly: boolean;
};
/**
 * Describes the message tank.security.v1.GetPostureRequest.
 * Use `create(GetPostureRequestSchema)` to create a new message.
 */
export declare const GetPostureRequestSchema: GenMessage<GetPostureRequest>;
/**
 * @generated from message tank.security.v1.GetPostureResponse
 */
export type GetPostureResponse = Message<"tank.security.v1.GetPostureResponse"> & {
    /**
     * @generated from field: tank.security.v1.Posture posture = 1;
     */
    posture?: Posture;
};
/**
 * Describes the message tank.security.v1.GetPostureResponse.
 * Use `create(GetPostureResponseSchema)` to create a new message.
 */
export declare const GetPostureResponseSchema: GenMessage<GetPostureResponse>;
/**
 * @generated from message tank.security.v1.GetControlRequest
 */
export type GetControlRequest = Message<"tank.security.v1.GetControlRequest"> & {
    /**
     * @generated from field: string control_id = 1;
     */
    controlId: string;
};
/**
 * Describes the message tank.security.v1.GetControlRequest.
 * Use `create(GetControlRequestSchema)` to create a new message.
 */
export declare const GetControlRequestSchema: GenMessage<GetControlRequest>;
/**
 * @generated from message tank.security.v1.GetControlResponse
 */
export type GetControlResponse = Message<"tank.security.v1.GetControlResponse"> & {
    /**
     * @generated from field: tank.security.v1.Control control = 1;
     */
    control?: Control;
};
/**
 * Describes the message tank.security.v1.GetControlResponse.
 * Use `create(GetControlResponseSchema)` to create a new message.
 */
export declare const GetControlResponseSchema: GenMessage<GetControlResponse>;
/**
 * @generated from message tank.security.v1.ListFrameworksRequest
 */
export type ListFrameworksRequest = Message<"tank.security.v1.ListFrameworksRequest"> & {};
/**
 * Describes the message tank.security.v1.ListFrameworksRequest.
 * Use `create(ListFrameworksRequestSchema)` to create a new message.
 */
export declare const ListFrameworksRequestSchema: GenMessage<ListFrameworksRequest>;
/**
 * @generated from message tank.security.v1.ListFrameworksResponse
 */
export type ListFrameworksResponse = Message<"tank.security.v1.ListFrameworksResponse"> & {
    /**
     * @generated from field: repeated tank.security.v1.FrameworkCoverage frameworks = 1;
     */
    frameworks: FrameworkCoverage[];
};
/**
 * Describes the message tank.security.v1.ListFrameworksResponse.
 * Use `create(ListFrameworksResponseSchema)` to create a new message.
 */
export declare const ListFrameworksResponseSchema: GenMessage<ListFrameworksResponse>;
/**
 * @generated from message tank.security.v1.GetFrameworkCoverageRequest
 */
export type GetFrameworkCoverageRequest = Message<"tank.security.v1.GetFrameworkCoverageRequest"> & {
    /**
     * @generated from field: string framework = 1;
     */
    framework: string;
};
/**
 * Describes the message tank.security.v1.GetFrameworkCoverageRequest.
 * Use `create(GetFrameworkCoverageRequestSchema)` to create a new message.
 */
export declare const GetFrameworkCoverageRequestSchema: GenMessage<GetFrameworkCoverageRequest>;
/**
 * @generated from message tank.security.v1.GetFrameworkCoverageResponse
 */
export type GetFrameworkCoverageResponse = Message<"tank.security.v1.GetFrameworkCoverageResponse"> & {
    /**
     * @generated from field: tank.security.v1.FrameworkCoverage coverage = 1;
     */
    coverage?: FrameworkCoverage;
};
/**
 * Describes the message tank.security.v1.GetFrameworkCoverageResponse.
 * Use `create(GetFrameworkCoverageResponseSchema)` to create a new message.
 */
export declare const GetFrameworkCoverageResponseSchema: GenMessage<GetFrameworkCoverageResponse>;
/**
 * @generated from message tank.security.v1.EvaluateRequest
 */
export type EvaluateRequest = Message<"tank.security.v1.EvaluateRequest"> & {
    /**
     * Evaluate one control. Empty evaluates every control that has a check.
     *
     * @generated from field: string control_id = 1;
     */
    controlId: string;
};
/**
 * Describes the message tank.security.v1.EvaluateRequest.
 * Use `create(EvaluateRequestSchema)` to create a new message.
 */
export declare const EvaluateRequestSchema: GenMessage<EvaluateRequest>;
/**
 * @generated from message tank.security.v1.EvaluateResponse
 */
export type EvaluateResponse = Message<"tank.security.v1.EvaluateResponse"> & {
    /**
     * @generated from field: tank.security.v1.Posture posture = 1;
     */
    posture?: Posture;
    /**
     * @generated from field: int32 evaluated = 2;
     */
    evaluated: number;
};
/**
 * Describes the message tank.security.v1.EvaluateResponse.
 * Use `create(EvaluateResponseSchema)` to create a new message.
 */
export declare const EvaluateResponseSchema: GenMessage<EvaluateResponse>;
/**
 * The four honest states a control can be in, plus the two the machinery itself
 * forces.
 *
 * @generated from enum tank.security.v1.ControlState
 */
export declare enum ControlState {
    /**
     * @generated from enum value: CONTROL_STATE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Met, with evidence. Never set without an Evidence that resolves.
     *
     * @generated from enum value: CONTROL_STATE_MET = 1;
     */
    MET = 1,
    /**
     * True in part. The limit is stated in `reason`, which is mandatory here.
     *
     * @generated from enum value: CONTROL_STATE_PARTLY = 2;
     */
    PARTLY = 2,
    /**
     * Not yet — including "probably true but we cannot evidence it". This is the
     * honest home of everything unmeasured.
     *
     * @generated from enum value: CONTROL_STATE_NOT_YET = 3;
     */
    NOT_YET = 3,
    /**
     * Does not apply to TANK as it is built. `reason` is mandatory: an N/A
     * without a reason is how a control quietly disappears.
     *
     * @generated from enum value: CONTROL_STATE_NOT_APPLICABLE = 4;
     */
    NOT_APPLICABLE = 4,
    /**
     * The check has never run, or ran too long ago to be worth believing. A
     * stale check reports UNKNOWN, never its last answer: the silent failure
     * mode of every security scanner is a broken check that stays green.
     *
     * @generated from enum value: CONTROL_STATE_UNKNOWN = 5;
     */
    UNKNOWN = 5
}
/**
 * Describes the enum tank.security.v1.ControlState.
 */
export declare const ControlStateSchema: GenEnum<ControlState>;
/**
 * The §4 families of the plan, so a posture can be read a section at a time.
 *
 * @generated from enum tank.security.v1.ControlCategory
 */
export declare enum ControlCategory {
    /**
     * @generated from enum value: CONTROL_CATEGORY_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: CONTROL_CATEGORY_IDENTITY = 1;
     */
    IDENTITY = 1,
    /**
     * @generated from enum value: CONTROL_CATEGORY_DATA = 2;
     */
    DATA = 2,
    /**
     * @generated from enum value: CONTROL_CATEGORY_INFRASTRUCTURE = 3;
     */
    INFRASTRUCTURE = 3,
    /**
     * @generated from enum value: CONTROL_CATEGORY_OPERATIONS = 4;
     */
    OPERATIONS = 4,
    /**
     * @generated from enum value: CONTROL_CATEGORY_APPLICATION = 5;
     */
    APPLICATION = 5,
    /**
     * The agent runtime: the liability nobody else selling into a security
     * review has, and therefore its own family rather than a footnote.
     *
     * @generated from enum value: CONTROL_CATEGORY_AGENT = 6;
     */
    AGENT = 6
}
/**
 * Describes the enum tank.security.v1.ControlCategory.
 */
export declare const ControlCategorySchema: GenEnum<ControlCategory>;
/**
 * How a control is evaluated. The distinction is the honesty of the registry:
 * a check that reads a live config value is worth ten that read a wiki, and
 * where the only true answer is "a human says so" that is modelled as an
 * attestation rather than dressed up as a check.
 *
 * @generated from enum tank.security.v1.CheckKind
 */
export declare enum CheckKind {
    /**
     * @generated from enum value: CHECK_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Code reads the real thing: a config value, a policy row, a database
     * setting, a migration, a committed manifest.
     *
     * @generated from enum value: CHECK_KIND_AUTOMATED = 1;
     */
    AUTOMATED = 1,
    /**
     * A named person asserts it on a date. Carries no more weight than that.
     *
     * @generated from enum value: CHECK_KIND_ATTESTATION = 2;
     */
    ATTESTATION = 2,
    /**
     * No check exists yet. Such a control can only be NOT_YET or UNKNOWN; it can
     * never be MET, because nothing is watching it.
     *
     * @generated from enum value: CHECK_KIND_NONE = 3;
     */
    NONE = 3
}
/**
 * Describes the enum tank.security.v1.CheckKind.
 */
export declare const CheckKindSchema: GenEnum<CheckKind>;
/**
 * The posture API. Platform-wide rather than per-workspace: these are facts
 * about TANK, and the people who may read them are the ones who may read the
 * console.
 *
 * Deliberately read-only apart from Evaluate, which only re-runs checks. The
 * registry is code, reviewed like code: nothing here can mark its own homework.
 *
 * @generated from service tank.security.v1.SecurityService
 */
export declare const SecurityService: GenService<{
    /**
     * @generated from rpc tank.security.v1.SecurityService.GetPosture
     */
    getPosture: {
        methodKind: "unary";
        input: typeof GetPostureRequestSchema;
        output: typeof GetPostureResponseSchema;
    };
    /**
     * @generated from rpc tank.security.v1.SecurityService.GetControl
     */
    getControl: {
        methodKind: "unary";
        input: typeof GetControlRequestSchema;
        output: typeof GetControlResponseSchema;
    };
    /**
     * @generated from rpc tank.security.v1.SecurityService.ListFrameworks
     */
    listFrameworks: {
        methodKind: "unary";
        input: typeof ListFrameworksRequestSchema;
        output: typeof ListFrameworksResponseSchema;
    };
    /**
     * @generated from rpc tank.security.v1.SecurityService.GetFrameworkCoverage
     */
    getFrameworkCoverage: {
        methodKind: "unary";
        input: typeof GetFrameworkCoverageRequestSchema;
        output: typeof GetFrameworkCoverageResponseSchema;
    };
    /**
     * @generated from rpc tank.security.v1.SecurityService.Evaluate
     */
    evaluate: {
        methodKind: "unary";
        input: typeof EvaluateRequestSchema;
        output: typeof EvaluateResponseSchema;
    };
}>;
