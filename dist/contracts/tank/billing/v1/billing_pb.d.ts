import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/billing/v1/billing.proto.
 */
export declare const file_tank_billing_v1_billing: GenFile;
/**
 * Price is what a product costs to take over right now, and why.
 *
 * @generated from message tank.billing.v1.Price
 */
export type Price = Message<"tank.billing.v1.Price"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string description = 3;
     */
    description: string;
    /**
     * how much agent work has gone into it
     *
     * @generated from field: int64 agent_minutes = 4;
     */
    agentMinutes: bigint;
    /**
     * what that makes it cost today
     *
     * @generated from field: int64 price_cents = 5;
     */
    priceCents: bigint;
    /**
     * false once somebody has taken it over
     *
     * @generated from field: bool available = 6;
     */
    available: boolean;
};
/**
 * Describes the message tank.billing.v1.Price.
 * Use `create(PriceSchema)` to create a new message.
 */
export declare const PriceSchema: GenMessage<Price>;
/**
 * GetPrice is public: the claim page shows it before anybody has signed in.
 *
 * @generated from message tank.billing.v1.GetPriceRequest
 */
export type GetPriceRequest = Message<"tank.billing.v1.GetPriceRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
};
/**
 * Describes the message tank.billing.v1.GetPriceRequest.
 * Use `create(GetPriceRequestSchema)` to create a new message.
 */
export declare const GetPriceRequestSchema: GenMessage<GetPriceRequest>;
/**
 * @generated from message tank.billing.v1.GetPriceResponse
 */
export type GetPriceResponse = Message<"tank.billing.v1.GetPriceResponse"> & {
    /**
     * @generated from field: tank.billing.v1.Price price = 1;
     */
    price?: Price;
};
/**
 * Describes the message tank.billing.v1.GetPriceResponse.
 * Use `create(GetPriceResponseSchema)` to create a new message.
 */
export declare const GetPriceResponseSchema: GenMessage<GetPriceResponse>;
/**
 * StartClaimCheckout begins paying for a product. It holds the product for a short
 * while so that two people cannot pay for the same one, and returns somewhere to pay.
 *
 * @generated from message tank.billing.v1.StartClaimCheckoutRequest
 */
export type StartClaimCheckoutRequest = Message<"tank.billing.v1.StartClaimCheckoutRequest"> & {
    /**
     * @generated from field: string slug = 1;
     */
    slug: string;
    /**
     * Where to send the buyer afterwards. Must be a path on the app's own origin.
     *
     * @generated from field: string success_path = 2;
     */
    successPath: string;
    /**
     * @generated from field: string cancel_path = 3;
     */
    cancelPath: string;
};
/**
 * Describes the message tank.billing.v1.StartClaimCheckoutRequest.
 * Use `create(StartClaimCheckoutRequestSchema)` to create a new message.
 */
export declare const StartClaimCheckoutRequestSchema: GenMessage<StartClaimCheckoutRequest>;
/**
 * @generated from message tank.billing.v1.StartClaimCheckoutResponse
 */
export type StartClaimCheckoutResponse = Message<"tank.billing.v1.StartClaimCheckoutResponse"> & {
    /**
     * @generated from field: string checkout_url = 1;
     */
    checkoutUrl: string;
    /**
     * @generated from field: google.protobuf.Timestamp held_until = 2;
     */
    heldUntil?: Timestamp;
};
/**
 * Describes the message tank.billing.v1.StartClaimCheckoutResponse.
 * Use `create(StartClaimCheckoutResponseSchema)` to create a new message.
 */
export declare const StartClaimCheckoutResponseSchema: GenMessage<StartClaimCheckoutResponse>;
/**
 * Subscription is what a workspace is paying, and what it is running up.
 *
 * @generated from message tank.billing.v1.Subscription
 */
export type Subscription = Message<"tank.billing.v1.Subscription"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * free | premium
     *
     * @generated from field: string plan = 2;
     */
    plan: string;
    /**
     * none | active | past_due | canceled
     *
     * @generated from field: string status = 3;
     */
    status: string;
    /**
     * @generated from field: int64 monthly_cents = 4;
     */
    monthlyCents: bigint;
    /**
     * @generated from field: int64 agent_minute_cents = 5;
     */
    agentMinuteCents: bigint;
    /**
     * This period's agent time and what it has cost so far.
     *
     * @generated from field: int64 agent_minutes_this_period = 6;
     */
    agentMinutesThisPeriod: bigint;
    /**
     * @generated from field: int64 agent_fees_cents_this_period = 7;
     */
    agentFeesCentsThisPeriod: bigint;
    /**
     * @generated from field: google.protobuf.Timestamp period_end = 8;
     */
    periodEnd?: Timestamp;
    /**
     * @generated from field: bool has_agents = 9;
     */
    hasAgents: boolean;
};
/**
 * Describes the message tank.billing.v1.Subscription.
 * Use `create(SubscriptionSchema)` to create a new message.
 */
export declare const SubscriptionSchema: GenMessage<Subscription>;
/**
 * @generated from message tank.billing.v1.GetSubscriptionRequest
 */
export type GetSubscriptionRequest = Message<"tank.billing.v1.GetSubscriptionRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.billing.v1.GetSubscriptionRequest.
 * Use `create(GetSubscriptionRequestSchema)` to create a new message.
 */
export declare const GetSubscriptionRequestSchema: GenMessage<GetSubscriptionRequest>;
/**
 * @generated from message tank.billing.v1.GetSubscriptionResponse
 */
export type GetSubscriptionResponse = Message<"tank.billing.v1.GetSubscriptionResponse"> & {
    /**
     * @generated from field: tank.billing.v1.Subscription subscription = 1;
     */
    subscription?: Subscription;
};
/**
 * Describes the message tank.billing.v1.GetSubscriptionResponse.
 * Use `create(GetSubscriptionResponseSchema)` to create a new message.
 */
export declare const GetSubscriptionResponseSchema: GenMessage<GetSubscriptionResponse>;
/**
 * StartUpgradeCheckout turns a free venture into one that can have agents.
 *
 * @generated from message tank.billing.v1.StartUpgradeCheckoutRequest
 */
export type StartUpgradeCheckoutRequest = Message<"tank.billing.v1.StartUpgradeCheckoutRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string success_path = 2;
     */
    successPath: string;
    /**
     * @generated from field: string cancel_path = 3;
     */
    cancelPath: string;
};
/**
 * Describes the message tank.billing.v1.StartUpgradeCheckoutRequest.
 * Use `create(StartUpgradeCheckoutRequestSchema)` to create a new message.
 */
export declare const StartUpgradeCheckoutRequestSchema: GenMessage<StartUpgradeCheckoutRequest>;
/**
 * @generated from message tank.billing.v1.StartUpgradeCheckoutResponse
 */
export type StartUpgradeCheckoutResponse = Message<"tank.billing.v1.StartUpgradeCheckoutResponse"> & {
    /**
     * @generated from field: string checkout_url = 1;
     */
    checkoutUrl: string;
};
/**
 * Describes the message tank.billing.v1.StartUpgradeCheckoutResponse.
 * Use `create(StartUpgradeCheckoutResponseSchema)` to create a new message.
 */
export declare const StartUpgradeCheckoutResponseSchema: GenMessage<StartUpgradeCheckoutResponse>;
/**
 * OpenBillingPortal sends an owner to change a card or cancel.
 *
 * @generated from message tank.billing.v1.OpenBillingPortalRequest
 */
export type OpenBillingPortalRequest = Message<"tank.billing.v1.OpenBillingPortalRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string return_path = 2;
     */
    returnPath: string;
};
/**
 * Describes the message tank.billing.v1.OpenBillingPortalRequest.
 * Use `create(OpenBillingPortalRequestSchema)` to create a new message.
 */
export declare const OpenBillingPortalRequestSchema: GenMessage<OpenBillingPortalRequest>;
/**
 * @generated from message tank.billing.v1.OpenBillingPortalResponse
 */
export type OpenBillingPortalResponse = Message<"tank.billing.v1.OpenBillingPortalResponse"> & {
    /**
     * @generated from field: string url = 1;
     */
    url: string;
};
/**
 * Describes the message tank.billing.v1.OpenBillingPortalResponse.
 * Use `create(OpenBillingPortalResponseSchema)` to create a new message.
 */
export declare const OpenBillingPortalResponseSchema: GenMessage<OpenBillingPortalResponse>;
/**
 * @generated from service tank.billing.v1.BillingService
 */
export declare const BillingService: GenService<{
    /**
     * @generated from rpc tank.billing.v1.BillingService.GetPrice
     */
    getPrice: {
        methodKind: "unary";
        input: typeof GetPriceRequestSchema;
        output: typeof GetPriceResponseSchema;
    };
    /**
     * @generated from rpc tank.billing.v1.BillingService.StartClaimCheckout
     */
    startClaimCheckout: {
        methodKind: "unary";
        input: typeof StartClaimCheckoutRequestSchema;
        output: typeof StartClaimCheckoutResponseSchema;
    };
    /**
     * @generated from rpc tank.billing.v1.BillingService.GetSubscription
     */
    getSubscription: {
        methodKind: "unary";
        input: typeof GetSubscriptionRequestSchema;
        output: typeof GetSubscriptionResponseSchema;
    };
    /**
     * @generated from rpc tank.billing.v1.BillingService.StartUpgradeCheckout
     */
    startUpgradeCheckout: {
        methodKind: "unary";
        input: typeof StartUpgradeCheckoutRequestSchema;
        output: typeof StartUpgradeCheckoutResponseSchema;
    };
    /**
     * @generated from rpc tank.billing.v1.BillingService.OpenBillingPortal
     */
    openBillingPortal: {
        methodKind: "unary";
        input: typeof OpenBillingPortalRequestSchema;
        output: typeof OpenBillingPortalResponseSchema;
    };
}>;
