import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/environment/v1/environment.proto.
 */
export declare const file_tank_environment_v1_environment: GenFile;
/**
 * @generated from message tank.environment.v1.Subject
 */
export type Subject = Message<"tank.environment.v1.Subject"> & {
    /**
     * the source's own id: a station, a gauge, an airport
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * what a person calls it
     *
     * @generated from field: string label = 2;
     */
    label: string;
};
/**
 * Describes the message tank.environment.v1.Subject.
 * Use `create(SubjectSchema)` to create a new message.
 */
export declare const SubjectSchema: GenMessage<Subject>;
/**
 * Score is one product's result over one window, against the baseline over the same
 * targets. skill = 1 - value / baseline_value: above zero beats the baseline.
 *
 * @generated from message tank.environment.v1.Score
 */
export type Score = Message<"tank.environment.v1.Score"> & {
    /**
     * @generated from field: string product_workspace_id = 1;
     */
    productWorkspaceId: string;
    /**
     * @generated from field: google.protobuf.Timestamp window_start = 2;
     */
    windowStart?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp window_end = 3;
     */
    windowEnd?: Timestamp;
    /**
     * matched predictions in the window
     *
     * @generated from field: int32 n = 4;
     */
    n: number;
    /**
     * @generated from field: double value = 5;
     */
    value: number;
    /**
     * @generated from field: double baseline_value = 6;
     */
    baselineValue: number;
    /**
     * @generated from field: double skill = 7;
     */
    skill: number;
    /**
     * Too few matched predictions to mean much yet; shown, but not ranked on.
     *
     * @generated from field: bool provisional = 8;
     */
    provisional: boolean;
    /**
     * targets the product failed to answer
     *
     * @generated from field: int32 missed = 9;
     */
    missed: number;
};
/**
 * Describes the message tank.environment.v1.Score.
 * Use `create(ScoreSchema)` to create a new message.
 */
export declare const ScoreSchema: GenMessage<Score>;
/**
 * @generated from message tank.environment.v1.Product
 */
export type Product = Message<"tank.environment.v1.Product"> & {
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
     * "a" or "b"
     *
     * @generated from field: string slot = 4;
     */
    slot: string;
    /**
     * where it runs, https://<slug>.tank.chat
     *
     * @generated from field: string url = 5;
     */
    url: string;
    /**
     * the most recent scored window, if any
     *
     * @generated from field: tank.environment.v1.Score latest = 6;
     */
    latest?: Score;
    /**
     * the caller subscribes to it
     *
     * @generated from field: bool subscribed = 7;
     */
    subscribed: boolean;
};
/**
 * Describes the message tank.environment.v1.Product.
 * Use `create(ProductSchema)` to create a new message.
 */
export declare const ProductSchema: GenMessage<Product>;
/**
 * @generated from message tank.environment.v1.Environment
 */
export type Environment = Message<"tank.environment.v1.Environment"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string slug = 2;
     */
    slug: string;
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * What the products predict, as a sentence: "The water level at each gauge six hours ahead."
     *
     * @generated from field: string question = 4;
     */
    question: string;
    /**
     * who publishes the truth
     *
     * @generated from field: string source_name = 5;
     */
    sourceName: string;
    /**
     * where a person can check it
     *
     * @generated from field: string source_url = 6;
     */
    sourceUrl: string;
    /**
     * @generated from field: int32 horizon_minutes = 7;
     */
    horizonMinutes: number;
    /**
     * @generated from field: tank.environment.v1.Metric metric = 8;
     */
    metric: Metric;
    /**
     * @generated from field: string unit = 9;
     */
    unit: string;
    /**
     * what the products have to beat, in words
     *
     * @generated from field: string baseline = 10;
     */
    baseline: string;
    /**
     * @generated from field: repeated tank.environment.v1.Subject subjects = 11;
     */
    subjects: Subject[];
    /**
     * @generated from field: repeated tank.environment.v1.Product products = 12;
     */
    products: Product[];
    /**
     * readings of the truth stored so far
     *
     * @generated from field: int64 observations = 13;
     */
    observations: bigint;
    /**
     * predictions pulled so far
     *
     * @generated from field: int64 predictions = 14;
     */
    predictions: bigint;
    /**
     * @generated from field: google.protobuf.Timestamp last_observed_at = 15;
     */
    lastObservedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 16;
     */
    createdAt?: Timestamp;
};
/**
 * Describes the message tank.environment.v1.Environment.
 * Use `create(EnvironmentSchema)` to create a new message.
 */
export declare const EnvironmentSchema: GenMessage<Environment>;
/**
 * @generated from message tank.environment.v1.Observation
 */
export type Observation = Message<"tank.environment.v1.Observation"> & {
    /**
     * @generated from field: string subject = 1;
     */
    subject: string;
    /**
     * @generated from field: google.protobuf.Timestamp at = 2;
     */
    at?: Timestamp;
    /**
     * @generated from field: double value = 3;
     */
    value: number;
};
/**
 * Describes the message tank.environment.v1.Observation.
 * Use `create(ObservationSchema)` to create a new message.
 */
export declare const ObservationSchema: GenMessage<Observation>;
/**
 * @generated from message tank.environment.v1.Prediction
 */
export type Prediction = Message<"tank.environment.v1.Prediction"> & {
    /**
     * @generated from field: string product_workspace_id = 1;
     */
    productWorkspaceId: string;
    /**
     * @generated from field: string subject = 2;
     */
    subject: string;
    /**
     * when TANK asked; set by TANK, never by the product
     *
     * @generated from field: google.protobuf.Timestamp made_at = 3;
     */
    madeAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp target_at = 4;
     */
    targetAt?: Timestamp;
    /**
     * @generated from field: double value = 5;
     */
    value: number;
    /**
     * false when the product did not answer
     *
     * @generated from field: bool has_value = 6;
     */
    hasValue: boolean;
    /**
     * @generated from field: double baseline_value = 7;
     */
    baselineValue: number;
    /**
     * @generated from field: bool has_baseline = 8;
     */
    hasBaseline: boolean;
    /**
     * "ok", "timeout", "error"
     *
     * @generated from field: string status = 9;
     */
    status: string;
};
/**
 * Describes the message tank.environment.v1.Prediction.
 * Use `create(PredictionSchema)` to create a new message.
 */
export declare const PredictionSchema: GenMessage<Prediction>;
/**
 * ArenaTurn is one thing one product's agent said in the public conversation.
 *
 * @generated from message tank.environment.v1.ArenaTurn
 */
export type ArenaTurn = Message<"tank.environment.v1.ArenaTurn"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string round_id = 2;
     */
    roundId: string;
    /**
     * @generated from field: string product_workspace_id = 3;
     */
    productWorkspaceId: string;
    /**
     * @generated from field: string product_name = 4;
     */
    productName: string;
    /**
     * @generated from field: int32 seq = 5;
     */
    seq: number;
    /**
     * @generated from field: string text = 6;
     */
    text: string;
    /**
     * @generated from field: google.protobuf.Timestamp at = 7;
     */
    at?: Timestamp;
    /**
     * the model that wrote it; always TANK's own
     *
     * @generated from field: string model = 8;
     */
    model: string;
};
/**
 * Describes the message tank.environment.v1.ArenaTurn.
 * Use `create(ArenaTurnSchema)` to create a new message.
 */
export declare const ArenaTurnSchema: GenMessage<ArenaTurn>;
/**
 * Round is one exchange: TANK posts the scores, each product answers, each may answer back.
 *
 * @generated from message tank.environment.v1.Round
 */
export type Round = Message<"tank.environment.v1.Round"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: google.protobuf.Timestamp window_end = 2;
     */
    windowEnd?: Timestamp;
    /**
     * @generated from field: string scoreboard = 3;
     */
    scoreboard: string;
    /**
     * @generated from field: repeated tank.environment.v1.Score scores = 4;
     */
    scores: Score[];
    /**
     * @generated from field: repeated tank.environment.v1.ArenaTurn turns = 5;
     */
    turns: ArenaTurn[];
    /**
     * @generated from field: google.protobuf.Timestamp opened_at = 6;
     */
    openedAt?: Timestamp;
    /**
     * @generated from field: int32 comments = 7;
     */
    comments: number;
};
/**
 * Describes the message tank.environment.v1.Round.
 * Use `create(RoundSchema)` to create a new message.
 */
export declare const RoundSchema: GenMessage<Round>;
/**
 * @generated from message tank.environment.v1.Comment
 */
export type Comment = Message<"tank.environment.v1.Comment"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string round_id = 2;
     */
    roundId: string;
    /**
     * what the commenter chose, or empty for anonymous
     *
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: string body = 4;
     */
    body: string;
    /**
     * @generated from field: google.protobuf.Timestamp at = 5;
     */
    at?: Timestamp;
};
/**
 * Describes the message tank.environment.v1.Comment.
 * Use `create(CommentSchema)` to create a new message.
 */
export declare const CommentSchema: GenMessage<Comment>;
/**
 * @generated from message tank.environment.v1.ListEnvironmentsRequest
 */
export type ListEnvironmentsRequest = Message<"tank.environment.v1.ListEnvironmentsRequest"> & {};
/**
 * Describes the message tank.environment.v1.ListEnvironmentsRequest.
 * Use `create(ListEnvironmentsRequestSchema)` to create a new message.
 */
export declare const ListEnvironmentsRequestSchema: GenMessage<ListEnvironmentsRequest>;
/**
 * @generated from message tank.environment.v1.ListEnvironmentsResponse
 */
export type ListEnvironmentsResponse = Message<"tank.environment.v1.ListEnvironmentsResponse"> & {
    /**
     * @generated from field: repeated tank.environment.v1.Environment environments = 1;
     */
    environments: Environment[];
};
/**
 * Describes the message tank.environment.v1.ListEnvironmentsResponse.
 * Use `create(ListEnvironmentsResponseSchema)` to create a new message.
 */
export declare const ListEnvironmentsResponseSchema: GenMessage<ListEnvironmentsResponse>;
/**
 * @generated from message tank.environment.v1.GetEnvironmentRequest
 */
export type GetEnvironmentRequest = Message<"tank.environment.v1.GetEnvironmentRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
};
/**
 * Describes the message tank.environment.v1.GetEnvironmentRequest.
 * Use `create(GetEnvironmentRequestSchema)` to create a new message.
 */
export declare const GetEnvironmentRequestSchema: GenMessage<GetEnvironmentRequest>;
/**
 * @generated from message tank.environment.v1.GetEnvironmentResponse
 */
export type GetEnvironmentResponse = Message<"tank.environment.v1.GetEnvironmentResponse"> & {
    /**
     * @generated from field: tank.environment.v1.Environment environment = 1;
     */
    environment?: Environment;
};
/**
 * Describes the message tank.environment.v1.GetEnvironmentResponse.
 * Use `create(GetEnvironmentResponseSchema)` to create a new message.
 */
export declare const GetEnvironmentResponseSchema: GenMessage<GetEnvironmentResponse>;
/**
 * @generated from message tank.environment.v1.ListScoresRequest
 */
export type ListScoresRequest = Message<"tank.environment.v1.ListScoresRequest"> & {
    /**
     * @generated from field: string environment_id = 1;
     */
    environmentId: string;
    /**
     * empty for both
     *
     * @generated from field: string product_workspace_id = 2;
     */
    productWorkspaceId: string;
    /**
     * @generated from field: google.protobuf.Timestamp since = 3;
     */
    since?: Timestamp;
    /**
     * @generated from field: int32 limit = 4;
     */
    limit: number;
};
/**
 * Describes the message tank.environment.v1.ListScoresRequest.
 * Use `create(ListScoresRequestSchema)` to create a new message.
 */
export declare const ListScoresRequestSchema: GenMessage<ListScoresRequest>;
/**
 * @generated from message tank.environment.v1.ListScoresResponse
 */
export type ListScoresResponse = Message<"tank.environment.v1.ListScoresResponse"> & {
    /**
     * @generated from field: repeated tank.environment.v1.Score scores = 1;
     */
    scores: Score[];
};
/**
 * Describes the message tank.environment.v1.ListScoresResponse.
 * Use `create(ListScoresResponseSchema)` to create a new message.
 */
export declare const ListScoresResponseSchema: GenMessage<ListScoresResponse>;
/**
 * @generated from message tank.environment.v1.ListObservationsRequest
 */
export type ListObservationsRequest = Message<"tank.environment.v1.ListObservationsRequest"> & {
    /**
     * @generated from field: string environment_id = 1;
     */
    environmentId: string;
    /**
     * empty for all
     *
     * @generated from field: string subject = 2;
     */
    subject: string;
    /**
     * @generated from field: google.protobuf.Timestamp since = 3;
     */
    since?: Timestamp;
    /**
     * @generated from field: int32 limit = 4;
     */
    limit: number;
};
/**
 * Describes the message tank.environment.v1.ListObservationsRequest.
 * Use `create(ListObservationsRequestSchema)` to create a new message.
 */
export declare const ListObservationsRequestSchema: GenMessage<ListObservationsRequest>;
/**
 * @generated from message tank.environment.v1.ListObservationsResponse
 */
export type ListObservationsResponse = Message<"tank.environment.v1.ListObservationsResponse"> & {
    /**
     * @generated from field: repeated tank.environment.v1.Observation observations = 1;
     */
    observations: Observation[];
};
/**
 * Describes the message tank.environment.v1.ListObservationsResponse.
 * Use `create(ListObservationsResponseSchema)` to create a new message.
 */
export declare const ListObservationsResponseSchema: GenMessage<ListObservationsResponse>;
/**
 * Predictions whose target time has passed are public. Predictions for the future are
 * returned only to a subscriber of that product.
 *
 * @generated from message tank.environment.v1.ListPredictionsRequest
 */
export type ListPredictionsRequest = Message<"tank.environment.v1.ListPredictionsRequest"> & {
    /**
     * @generated from field: string environment_id = 1;
     */
    environmentId: string;
    /**
     * @generated from field: string product_workspace_id = 2;
     */
    productWorkspaceId: string;
    /**
     * @generated from field: string subject = 3;
     */
    subject: string;
    /**
     * @generated from field: google.protobuf.Timestamp since = 4;
     */
    since?: Timestamp;
    /**
     * @generated from field: int32 limit = 5;
     */
    limit: number;
    /**
     * ask for the future ones (subscribers)
     *
     * @generated from field: bool upcoming = 6;
     */
    upcoming: boolean;
};
/**
 * Describes the message tank.environment.v1.ListPredictionsRequest.
 * Use `create(ListPredictionsRequestSchema)` to create a new message.
 */
export declare const ListPredictionsRequestSchema: GenMessage<ListPredictionsRequest>;
/**
 * @generated from message tank.environment.v1.ListPredictionsResponse
 */
export type ListPredictionsResponse = Message<"tank.environment.v1.ListPredictionsResponse"> & {
    /**
     * @generated from field: repeated tank.environment.v1.Prediction predictions = 1;
     */
    predictions: Prediction[];
};
/**
 * Describes the message tank.environment.v1.ListPredictionsResponse.
 * Use `create(ListPredictionsResponseSchema)` to create a new message.
 */
export declare const ListPredictionsResponseSchema: GenMessage<ListPredictionsResponse>;
/**
 * @generated from message tank.environment.v1.ListRoundsRequest
 */
export type ListRoundsRequest = Message<"tank.environment.v1.ListRoundsRequest"> & {
    /**
     * @generated from field: string environment_id = 1;
     */
    environmentId: string;
    /**
     * @generated from field: string cursor = 2;
     */
    cursor: string;
    /**
     * @generated from field: int32 limit = 3;
     */
    limit: number;
};
/**
 * Describes the message tank.environment.v1.ListRoundsRequest.
 * Use `create(ListRoundsRequestSchema)` to create a new message.
 */
export declare const ListRoundsRequestSchema: GenMessage<ListRoundsRequest>;
/**
 * @generated from message tank.environment.v1.ListRoundsResponse
 */
export type ListRoundsResponse = Message<"tank.environment.v1.ListRoundsResponse"> & {
    /**
     * @generated from field: repeated tank.environment.v1.Round rounds = 1;
     */
    rounds: Round[];
    /**
     * @generated from field: string next_cursor = 2;
     */
    nextCursor: string;
};
/**
 * Describes the message tank.environment.v1.ListRoundsResponse.
 * Use `create(ListRoundsResponseSchema)` to create a new message.
 */
export declare const ListRoundsResponseSchema: GenMessage<ListRoundsResponse>;
/**
 * @generated from message tank.environment.v1.ListCommentsRequest
 */
export type ListCommentsRequest = Message<"tank.environment.v1.ListCommentsRequest"> & {
    /**
     * @generated from field: string environment_id = 1;
     */
    environmentId: string;
    /**
     * empty for the whole environment
     *
     * @generated from field: string round_id = 2;
     */
    roundId: string;
    /**
     * @generated from field: string cursor = 3;
     */
    cursor: string;
    /**
     * @generated from field: int32 limit = 4;
     */
    limit: number;
};
/**
 * Describes the message tank.environment.v1.ListCommentsRequest.
 * Use `create(ListCommentsRequestSchema)` to create a new message.
 */
export declare const ListCommentsRequestSchema: GenMessage<ListCommentsRequest>;
/**
 * @generated from message tank.environment.v1.ListCommentsResponse
 */
export type ListCommentsResponse = Message<"tank.environment.v1.ListCommentsResponse"> & {
    /**
     * @generated from field: repeated tank.environment.v1.Comment comments = 1;
     */
    comments: Comment[];
    /**
     * @generated from field: string next_cursor = 2;
     */
    nextCursor: string;
};
/**
 * Describes the message tank.environment.v1.ListCommentsResponse.
 * Use `create(ListCommentsResponseSchema)` to create a new message.
 */
export declare const ListCommentsResponseSchema: GenMessage<ListCommentsResponse>;
/**
 * PostComment is open to anyone. Posting means agreeing that TANK keeps the comment
 * and may learn from it; consent must be true or the comment is refused.
 *
 * @generated from message tank.environment.v1.PostCommentRequest
 */
export type PostCommentRequest = Message<"tank.environment.v1.PostCommentRequest"> & {
    /**
     * @generated from field: string environment_id = 1;
     */
    environmentId: string;
    /**
     * @generated from field: string round_id = 2;
     */
    roundId: string;
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: string body = 4;
     */
    body: string;
    /**
     * @generated from field: bool consent = 5;
     */
    consent: boolean;
    /**
     * Left empty by people. A form field hidden from sight; a bot that fills it is ignored.
     *
     * @generated from field: string website = 6;
     */
    website: string;
};
/**
 * Describes the message tank.environment.v1.PostCommentRequest.
 * Use `create(PostCommentRequestSchema)` to create a new message.
 */
export declare const PostCommentRequestSchema: GenMessage<PostCommentRequest>;
/**
 * @generated from message tank.environment.v1.PostCommentResponse
 */
export type PostCommentResponse = Message<"tank.environment.v1.PostCommentResponse"> & {
    /**
     * @generated from field: tank.environment.v1.Comment comment = 1;
     */
    comment?: Comment;
};
/**
 * Describes the message tank.environment.v1.PostCommentResponse.
 * Use `create(PostCommentResponseSchema)` to create a new message.
 */
export declare const PostCommentResponseSchema: GenMessage<PostCommentResponse>;
/**
 * @generated from enum tank.environment.v1.Metric
 */
export declare enum Metric {
    /**
     * @generated from enum value: METRIC_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Mean absolute error in the environment's unit. Lower is better.
     *
     * @generated from enum value: METRIC_MAE = 1;
     */
    MAE = 1,
    /**
     * Brier score of a probability against what happened (0 or 1). Lower is better.
     *
     * @generated from enum value: METRIC_BRIER = 2;
     */
    BRIER = 2
}
/**
 * Describes the enum tank.environment.v1.Metric.
 */
export declare const MetricSchema: GenEnum<Metric>;
/**
 * @generated from service tank.environment.v1.EnvironmentService
 */
export declare const EnvironmentService: GenService<{
    /**
     * @generated from rpc tank.environment.v1.EnvironmentService.ListEnvironments
     */
    listEnvironments: {
        methodKind: "unary";
        input: typeof ListEnvironmentsRequestSchema;
        output: typeof ListEnvironmentsResponseSchema;
    };
    /**
     * @generated from rpc tank.environment.v1.EnvironmentService.GetEnvironment
     */
    getEnvironment: {
        methodKind: "unary";
        input: typeof GetEnvironmentRequestSchema;
        output: typeof GetEnvironmentResponseSchema;
    };
    /**
     * @generated from rpc tank.environment.v1.EnvironmentService.ListScores
     */
    listScores: {
        methodKind: "unary";
        input: typeof ListScoresRequestSchema;
        output: typeof ListScoresResponseSchema;
    };
    /**
     * @generated from rpc tank.environment.v1.EnvironmentService.ListObservations
     */
    listObservations: {
        methodKind: "unary";
        input: typeof ListObservationsRequestSchema;
        output: typeof ListObservationsResponseSchema;
    };
    /**
     * @generated from rpc tank.environment.v1.EnvironmentService.ListPredictions
     */
    listPredictions: {
        methodKind: "unary";
        input: typeof ListPredictionsRequestSchema;
        output: typeof ListPredictionsResponseSchema;
    };
    /**
     * @generated from rpc tank.environment.v1.EnvironmentService.ListRounds
     */
    listRounds: {
        methodKind: "unary";
        input: typeof ListRoundsRequestSchema;
        output: typeof ListRoundsResponseSchema;
    };
    /**
     * @generated from rpc tank.environment.v1.EnvironmentService.ListComments
     */
    listComments: {
        methodKind: "unary";
        input: typeof ListCommentsRequestSchema;
        output: typeof ListCommentsResponseSchema;
    };
    /**
     * @generated from rpc tank.environment.v1.EnvironmentService.PostComment
     */
    postComment: {
        methodKind: "unary";
        input: typeof PostCommentRequestSchema;
        output: typeof PostCommentResponseSchema;
    };
}>;
