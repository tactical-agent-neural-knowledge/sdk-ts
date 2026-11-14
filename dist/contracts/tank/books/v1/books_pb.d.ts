import type { GenEnum, GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/books/v1/books.proto.
 */
export declare const file_tank_books_v1_books: GenFile;
/**
 * @generated from message tank.books.v1.Settings
 */
export type Settings = Message<"tank.books.v1.Settings"> & {
    /**
     * Neuralbooks is on for this workspace (premium)
     *
     * @generated from field: bool enabled = 1;
     */
    enabled: boolean;
    /**
     * ISO 4217, e.g. "USD"
     *
     * @generated from field: string currency = 2;
     */
    currency: string;
    /**
     * on invoices
     *
     * @generated from field: string business_name = 3;
     */
    businessName: string;
    /**
     * e.g. "INV-"
     *
     * @generated from field: string invoice_prefix = 4;
     */
    invoicePrefix: string;
    /**
     * @generated from field: int32 next_invoice_number = 5;
     */
    nextInvoiceNumber: number;
    /**
     * invoices are due this many days after issue
     *
     * @generated from field: int32 default_due_days = 6;
     */
    defaultDueDays: number;
    /**
     * the agent chases an unpaid invoice on this cadence; 0 = never
     *
     * @generated from field: int32 chase_every_days = 7;
     */
    chaseEveryDays: number;
    /**
     * Tools this business competes with or replaces, by name as people say them
     * ("QuickBooks"): the market panel reads TANK's research on them.
     *
     * @generated from field: repeated string competes_with = 8;
     */
    competesWith: string[];
    /**
     * How a customer pays: bank details or instructions, printed on the invoice page.
     *
     * @generated from field: string payment_instructions = 9;
     */
    paymentInstructions: string;
    /**
     * The business's own Stripe secret key, so money goes to the business, not to TANK.
     * Write-only: set it to store it, send it empty to leave it alone, and read it back
     * as the last four characters in stripe_key_hint.
     *
     * @generated from field: string stripe_secret_key = 10;
     */
    stripeSecretKey: string;
    /**
     * e.g. "…a4F2"; empty when no key is stored
     *
     * @generated from field: string stripe_key_hint = 11;
     */
    stripeKeyHint: string;
    /**
     * a key is stored, so sent invoices carry a pay link
     *
     * @generated from field: bool payments_ready = 12;
     */
    paymentsReady: boolean;
    /**
     * The month the fiscal year starts, 1 (January, the default) to 12. Quarters and
     * years in a statement are cut from it. A fiscal year is named by the calendar year
     * it ends in: with April, April 2026 to March 2027 is FY2027.
     *
     * @generated from field: int32 fiscal_year_start_month = 13;
     */
    fiscalYearStartMonth: number;
    /**
     * IANA zone the books are kept in, e.g. "America/New_York". Every period (a month,
     * a quarter, "this month" in a report) is cut at midnight here. Empty on write
     * leaves it as it is; it defaults to the workspace owner's zone, else UTC.
     *
     * @generated from field: string timezone = 14;
     */
    timezone: string;
    /**
     * The Tread Books notices and the CFO post in; empty for none.
     *
     * @generated from field: string finance_channel_id = 15;
     */
    financeChannelId: string;
};
/**
 * Describes the message tank.books.v1.Settings.
 * Use `create(SettingsSchema)` to create a new message.
 */
export declare const SettingsSchema: GenMessage<Settings>;
/**
 * @generated from message tank.books.v1.Customer
 */
export type Customer = Message<"tank.books.v1.Customer"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: string email = 3;
     */
    email: string;
    /**
     * @generated from field: string notes = 4;
     */
    notes: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 5;
     */
    createdAt?: Timestamp;
    /**
     * open invoices, for the list
     *
     * @generated from field: int64 owed_cents = 6;
     */
    owedCents: bigint;
};
/**
 * Describes the message tank.books.v1.Customer.
 * Use `create(CustomerSchema)` to create a new message.
 */
export declare const CustomerSchema: GenMessage<Customer>;
/**
 * @generated from message tank.books.v1.InvoiceLine
 */
export type InvoiceLine = Message<"tank.books.v1.InvoiceLine"> & {
    /**
     * @generated from field: string description = 1;
     */
    description: string;
    /**
     * @generated from field: double quantity = 2;
     */
    quantity: number;
    /**
     * @generated from field: int64 unit_cents = 3;
     */
    unitCents: bigint;
    /**
     * quantity × unit, server-computed
     *
     * @generated from field: int64 total_cents = 4;
     */
    totalCents: bigint;
};
/**
 * Describes the message tank.books.v1.InvoiceLine.
 * Use `create(InvoiceLineSchema)` to create a new message.
 */
export declare const InvoiceLineSchema: GenMessage<InvoiceLine>;
/**
 * @generated from message tank.books.v1.Invoice
 */
export type Invoice = Message<"tank.books.v1.Invoice"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string customer_id = 2;
     */
    customerId: string;
    /**
     * @generated from field: string customer_name = 3;
     */
    customerName: string;
    /**
     * prefix + sequence, e.g. INV-0007
     *
     * @generated from field: string number = 4;
     */
    number: string;
    /**
     * @generated from field: tank.books.v1.InvoiceStatus status = 5;
     */
    status: InvoiceStatus;
    /**
     * @generated from field: repeated tank.books.v1.InvoiceLine lines = 6;
     */
    lines: InvoiceLine[];
    /**
     * @generated from field: int64 subtotal_cents = 7;
     */
    subtotalCents: bigint;
    /**
     * @generated from field: int64 tax_cents = 8;
     */
    taxCents: bigint;
    /**
     * @generated from field: int64 total_cents = 9;
     */
    totalCents: bigint;
    /**
     * @generated from field: int64 paid_cents = 10;
     */
    paidCents: bigint;
    /**
     * total − paid
     *
     * @generated from field: int64 due_cents = 11;
     */
    dueCents: bigint;
    /**
     * @generated from field: google.protobuf.Timestamp issued_at = 12;
     */
    issuedAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp due_at = 13;
     */
    dueAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp sent_at = 14;
     */
    sentAt?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp paid_at = 15;
     */
    paidAt?: Timestamp;
    /**
     * @generated from field: string notes = 16;
     */
    notes: string;
    /**
     * Where it came from: the thread it was asked for in, when a person asked the agent.
     *
     * @generated from field: string thread_root_id = 17;
     */
    threadRootId: string;
    /**
     * The learning layer's read: when this invoice will actually be paid, and how sure.
     *
     * @generated from field: google.protobuf.Timestamp predicted_paid_at = 18;
     */
    predictedPaidAt?: Timestamp;
    /**
     * @generated from field: double predicted_confidence = 19;
     */
    predictedConfidence: number;
    /**
     * @generated from field: google.protobuf.Timestamp last_chased_at = 20;
     */
    lastChasedAt?: Timestamp;
    /**
     * @generated from field: int32 chase_count = 21;
     */
    chaseCount: number;
    /**
     * A page the customer can open without an account: the invoice, how to pay, and
     * its state. Set once the invoice is sent.
     *
     * @generated from field: string share_url = 22;
     */
    shareUrl: string;
    /**
     * Where the customer pays by card, when the business has connected Stripe. Minted
     * when the invoice is sent.
     *
     * @generated from field: string pay_url = 23;
     */
    payUrl: string;
    /**
     * The income category the invoice's revenue is filed under (a Category id).
     *
     * @generated from field: string category_id = 24;
     */
    categoryId: string;
};
/**
 * Describes the message tank.books.v1.Invoice.
 * Use `create(InvoiceSchema)` to create a new message.
 */
export declare const InvoiceSchema: GenMessage<Invoice>;
/**
 * @generated from message tank.books.v1.Payment
 */
export type Payment = Message<"tank.books.v1.Payment"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string invoice_id = 2;
     */
    invoiceId: string;
    /**
     * @generated from field: int64 amount_cents = 3;
     */
    amountCents: bigint;
    /**
     * @generated from field: google.protobuf.Timestamp at = 4;
     */
    at?: Timestamp;
    /**
     * bank, card, cash, other
     *
     * @generated from field: string method = 5;
     */
    method: string;
    /**
     * @generated from field: string reference = 6;
     */
    reference: string;
};
/**
 * Describes the message tank.books.v1.Payment.
 * Use `create(PaymentSchema)` to create a new message.
 */
export declare const PaymentSchema: GenMessage<Payment>;
/**
 * @generated from message tank.books.v1.Expense
 */
export type Expense = Message<"tank.books.v1.Expense"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: string vendor = 2;
     */
    vendor: string;
    /**
     * e.g. software, travel, supplies
     *
     * @generated from field: string category = 3;
     */
    category: string;
    /**
     * @generated from field: int64 amount_cents = 4;
     */
    amountCents: bigint;
    /**
     * @generated from field: google.protobuf.Timestamp at = 5;
     */
    at?: Timestamp;
    /**
     * @generated from field: string notes = 6;
     */
    notes: string;
    /**
     * a TANK file, when it came from a receipt
     *
     * @generated from field: string receipt_file_id = 7;
     */
    receiptFileId: string;
    /**
     * user id, or "agent"
     *
     * @generated from field: string booked_by = 8;
     */
    bookedBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 9;
     */
    createdAt?: Timestamp;
    /**
     * The period a bill or a usage figure covers (a cloud bill for October: Oct 1 to
     * Oct 31, both inclusive, at midnight UTC). Unset for a one-off purchase.
     *
     * @generated from field: google.protobuf.Timestamp period_start = 10;
     */
    periodStart?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp period_end = 11;
     */
    periodEnd?: Timestamp;
    /**
     * Where the figure came from, e.g. "aws-cost-explorer". With the period and the
     * category it is the key a repeated collection revises instead of duplicating.
     *
     * @generated from field: string source = 12;
     */
    source: string;
    /**
     * The expense category it is filed under (a Category id). `category` above is the
     * old free text and stays until every client reads this.
     *
     * @generated from field: string category_id = 13;
     */
    categoryId: string;
    /**
     * When the money went out. Unset = an unpaid bill: it counts as spent when earned
     * and as cash out only once it is paid.
     *
     * @generated from field: google.protobuf.Timestamp paid_at = 14;
     */
    paidAt?: Timestamp;
    /**
     * The category was filed automatically from old free text that matched nothing
     * (it sits under Other) and a person should check it.
     *
     * @generated from field: bool category_needs_review = 15;
     */
    categoryNeedsReview: boolean;
};
/**
 * Describes the message tank.books.v1.Expense.
 * Use `create(ExpenseSchema)` to create a new message.
 */
export declare const ExpenseSchema: GenMessage<Expense>;
/**
 * A line on the statement. Every workspace starts with the standard chart; people may
 * add categories or rename them within a group, never move one between groups.
 *
 * @generated from message tank.books.v1.Category
 */
export type Category = Message<"tank.books.v1.Category"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * stable machine name, e.g. "hosting"
     *
     * @generated from field: string key = 2;
     */
    key: string;
    /**
     * what people read, e.g. "Hosting"
     *
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: tank.books.v1.CategoryKind kind = 4;
     */
    kind: CategoryKind;
    /**
     * income | cost_of_revenue | payroll | operating. Gross profit is income less
     * cost_of_revenue.
     *
     * @generated from field: string group = 5;
     */
    group: string;
    /**
     * @generated from field: int32 sort = 6;
     */
    sort: number;
    /**
     * @generated from field: bool archived = 7;
     */
    archived: boolean;
    /**
     * from the standard chart, not added by a person
     *
     * @generated from field: bool standard = 8;
     */
    standard: boolean;
};
/**
 * Describes the message tank.books.v1.Category.
 * Use `create(CategorySchema)` to create a new message.
 */
export declare const CategorySchema: GenMessage<Category>;
/**
 * "Cash in the bank on <date>": what ending cash is counted from.
 *
 * @generated from message tank.books.v1.CashBalance
 */
export type CashBalance = Message<"tank.books.v1.CashBalance"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * The day, at midnight in the books' timezone; the amount is the balance at the
     * end of that day.
     *
     * @generated from field: google.protobuf.Timestamp as_of = 2;
     */
    asOf?: Timestamp;
    /**
     * @generated from field: int64 amount_cents = 3;
     */
    amountCents: bigint;
    /**
     * @generated from field: string note = 4;
     */
    note: string;
    /**
     * user id, or "agent"
     *
     * @generated from field: string set_by = 5;
     */
    setBy: string;
    /**
     * @generated from field: google.protobuf.Timestamp created_at = 6;
     */
    createdAt?: Timestamp;
};
/**
 * Describes the message tank.books.v1.CashBalance.
 * Use `create(CashBalanceSchema)` to create a new message.
 */
export declare const CashBalanceSchema: GenMessage<CashBalance>;
/**
 * The numbers a person asks for first, with nothing to click into.
 *
 * @generated from message tank.books.v1.CashSummary
 */
export type CashSummary = Message<"tank.books.v1.CashSummary"> & {
    /**
     * @generated from field: google.protobuf.Timestamp as_of = 1;
     */
    asOf?: Timestamp;
    /**
     * @generated from field: string currency = 2;
     */
    currency: string;
    /**
     * open invoices
     *
     * @generated from field: int64 owed_cents = 3;
     */
    owedCents: bigint;
    /**
     * the part past due
     *
     * @generated from field: int64 overdue_cents = 4;
     */
    overdueCents: bigint;
    /**
     * @generated from field: int32 open_invoices = 5;
     */
    openInvoices: number;
    /**
     * @generated from field: int32 overdue_invoices = 6;
     */
    overdueInvoices: number;
    /**
     * payments in the last 30 days
     *
     * @generated from field: int64 received_30d_cents = 7;
     */
    received30dCents: bigint;
    /**
     * expenses in the last 30 days
     *
     * @generated from field: int64 spent_30d_cents = 8;
     */
    spent30dCents: bigint;
    /**
     * what the model expects to arrive in the next 30 days
     *
     * @generated from field: int64 expected_30d_cents = 9;
     */
    expected30dCents: bigint;
    /**
     * and in six weeks
     *
     * @generated from field: int64 expected_6w_cents = 10;
     */
    expected6wCents: bigint;
};
/**
 * Describes the message tank.books.v1.CashSummary.
 * Use `create(CashSummarySchema)` to create a new message.
 */
export declare const CashSummarySchema: GenMessage<CashSummary>;
/**
 * @generated from message tank.books.v1.GetSettingsRequest
 */
export type GetSettingsRequest = Message<"tank.books.v1.GetSettingsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.books.v1.GetSettingsRequest.
 * Use `create(GetSettingsRequestSchema)` to create a new message.
 */
export declare const GetSettingsRequestSchema: GenMessage<GetSettingsRequest>;
/**
 * @generated from message tank.books.v1.GetSettingsResponse
 */
export type GetSettingsResponse = Message<"tank.books.v1.GetSettingsResponse"> & {
    /**
     * @generated from field: tank.books.v1.Settings settings = 1;
     */
    settings?: Settings;
};
/**
 * Describes the message tank.books.v1.GetSettingsResponse.
 * Use `create(GetSettingsResponseSchema)` to create a new message.
 */
export declare const GetSettingsResponseSchema: GenMessage<GetSettingsResponse>;
/**
 * @generated from message tank.books.v1.UpdateSettingsRequest
 */
export type UpdateSettingsRequest = Message<"tank.books.v1.UpdateSettingsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: tank.books.v1.Settings settings = 2;
     */
    settings?: Settings;
};
/**
 * Describes the message tank.books.v1.UpdateSettingsRequest.
 * Use `create(UpdateSettingsRequestSchema)` to create a new message.
 */
export declare const UpdateSettingsRequestSchema: GenMessage<UpdateSettingsRequest>;
/**
 * @generated from message tank.books.v1.UpdateSettingsResponse
 */
export type UpdateSettingsResponse = Message<"tank.books.v1.UpdateSettingsResponse"> & {
    /**
     * @generated from field: tank.books.v1.Settings settings = 1;
     */
    settings?: Settings;
};
/**
 * Describes the message tank.books.v1.UpdateSettingsResponse.
 * Use `create(UpdateSettingsResponseSchema)` to create a new message.
 */
export declare const UpdateSettingsResponseSchema: GenMessage<UpdateSettingsResponse>;
/**
 * @generated from message tank.books.v1.ListCustomersRequest
 */
export type ListCustomersRequest = Message<"tank.books.v1.ListCustomersRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.books.v1.ListCustomersRequest.
 * Use `create(ListCustomersRequestSchema)` to create a new message.
 */
export declare const ListCustomersRequestSchema: GenMessage<ListCustomersRequest>;
/**
 * @generated from message tank.books.v1.ListCustomersResponse
 */
export type ListCustomersResponse = Message<"tank.books.v1.ListCustomersResponse"> & {
    /**
     * @generated from field: repeated tank.books.v1.Customer customers = 1;
     */
    customers: Customer[];
};
/**
 * Describes the message tank.books.v1.ListCustomersResponse.
 * Use `create(ListCustomersResponseSchema)` to create a new message.
 */
export declare const ListCustomersResponseSchema: GenMessage<ListCustomersResponse>;
/**
 * @generated from message tank.books.v1.UpsertCustomerRequest
 */
export type UpsertCustomerRequest = Message<"tank.books.v1.UpsertCustomerRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * empty to create
     *
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * @generated from field: string email = 4;
     */
    email: string;
    /**
     * @generated from field: string notes = 5;
     */
    notes: string;
};
/**
 * Describes the message tank.books.v1.UpsertCustomerRequest.
 * Use `create(UpsertCustomerRequestSchema)` to create a new message.
 */
export declare const UpsertCustomerRequestSchema: GenMessage<UpsertCustomerRequest>;
/**
 * @generated from message tank.books.v1.UpsertCustomerResponse
 */
export type UpsertCustomerResponse = Message<"tank.books.v1.UpsertCustomerResponse"> & {
    /**
     * @generated from field: tank.books.v1.Customer customer = 1;
     */
    customer?: Customer;
};
/**
 * Describes the message tank.books.v1.UpsertCustomerResponse.
 * Use `create(UpsertCustomerResponseSchema)` to create a new message.
 */
export declare const UpsertCustomerResponseSchema: GenMessage<UpsertCustomerResponse>;
/**
 * @generated from message tank.books.v1.ListInvoicesRequest
 */
export type ListInvoicesRequest = Message<"tank.books.v1.ListInvoicesRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * unspecified = all but void
     *
     * @generated from field: tank.books.v1.InvoiceStatus status = 2;
     */
    status: InvoiceStatus;
    /**
     * @generated from field: string customer_id = 3;
     */
    customerId: string;
};
/**
 * Describes the message tank.books.v1.ListInvoicesRequest.
 * Use `create(ListInvoicesRequestSchema)` to create a new message.
 */
export declare const ListInvoicesRequestSchema: GenMessage<ListInvoicesRequest>;
/**
 * @generated from message tank.books.v1.ListInvoicesResponse
 */
export type ListInvoicesResponse = Message<"tank.books.v1.ListInvoicesResponse"> & {
    /**
     * @generated from field: repeated tank.books.v1.Invoice invoices = 1;
     */
    invoices: Invoice[];
};
/**
 * Describes the message tank.books.v1.ListInvoicesResponse.
 * Use `create(ListInvoicesResponseSchema)` to create a new message.
 */
export declare const ListInvoicesResponseSchema: GenMessage<ListInvoicesResponse>;
/**
 * @generated from message tank.books.v1.GetInvoiceRequest
 */
export type GetInvoiceRequest = Message<"tank.books.v1.GetInvoiceRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * Mint a new share link and stop the old one working.
     *
     * The share token is stored as a hash, so an ordinary read returns an empty
     * share_url: the link exists once, when the invoice is created or sent, and cannot
     * be read back afterwards by anyone including TANK. That is right for a credential
     * and it leaves one hole — a business that loses the link has no way to get another,
     * and an unpaid invoice nobody can open is a billing problem rather than a security
     * one. This is that way out. Admin only, and the old link dies the moment the new
     * one is issued, because a rotation that leaves both working is not a rotation.
     *
     * @generated from field: bool rotate = 3;
     */
    rotate: boolean;
};
/**
 * Describes the message tank.books.v1.GetInvoiceRequest.
 * Use `create(GetInvoiceRequestSchema)` to create a new message.
 */
export declare const GetInvoiceRequestSchema: GenMessage<GetInvoiceRequest>;
/**
 * @generated from message tank.books.v1.GetInvoiceResponse
 */
export type GetInvoiceResponse = Message<"tank.books.v1.GetInvoiceResponse"> & {
    /**
     * @generated from field: tank.books.v1.Invoice invoice = 1;
     */
    invoice?: Invoice;
    /**
     * @generated from field: repeated tank.books.v1.Payment payments = 2;
     */
    payments: Payment[];
};
/**
 * Describes the message tank.books.v1.GetInvoiceResponse.
 * Use `create(GetInvoiceResponseSchema)` to create a new message.
 */
export declare const GetInvoiceResponseSchema: GenMessage<GetInvoiceResponse>;
/**
 * @generated from message tank.books.v1.CreateInvoiceRequest
 */
export type CreateInvoiceRequest = Message<"tank.books.v1.CreateInvoiceRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * or customer_name to find-or-create
     *
     * @generated from field: string customer_id = 2;
     */
    customerId: string;
    /**
     * @generated from field: string customer_name = 3;
     */
    customerName: string;
    /**
     * @generated from field: repeated tank.books.v1.InvoiceLine lines = 4;
     */
    lines: InvoiceLine[];
    /**
     * @generated from field: int64 tax_cents = 5;
     */
    taxCents: bigint;
    /**
     * 0 = the workspace default
     *
     * @generated from field: int32 due_days = 6;
     */
    dueDays: number;
    /**
     * @generated from field: string notes = 7;
     */
    notes: string;
    /**
     * @generated from field: string thread_root_id = 8;
     */
    threadRootId: string;
    /**
     * send on creation
     *
     * @generated from field: bool send = 9;
     */
    send: boolean;
    /**
     * an income Category id; empty = Sales
     *
     * @generated from field: string category_id = 10;
     */
    categoryId: string;
};
/**
 * Describes the message tank.books.v1.CreateInvoiceRequest.
 * Use `create(CreateInvoiceRequestSchema)` to create a new message.
 */
export declare const CreateInvoiceRequestSchema: GenMessage<CreateInvoiceRequest>;
/**
 * @generated from message tank.books.v1.CreateInvoiceResponse
 */
export type CreateInvoiceResponse = Message<"tank.books.v1.CreateInvoiceResponse"> & {
    /**
     * @generated from field: tank.books.v1.Invoice invoice = 1;
     */
    invoice?: Invoice;
};
/**
 * Describes the message tank.books.v1.CreateInvoiceResponse.
 * Use `create(CreateInvoiceResponseSchema)` to create a new message.
 */
export declare const CreateInvoiceResponseSchema: GenMessage<CreateInvoiceResponse>;
/**
 * @generated from message tank.books.v1.SendInvoiceRequest
 */
export type SendInvoiceRequest = Message<"tank.books.v1.SendInvoiceRequest"> & {
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
 * Describes the message tank.books.v1.SendInvoiceRequest.
 * Use `create(SendInvoiceRequestSchema)` to create a new message.
 */
export declare const SendInvoiceRequestSchema: GenMessage<SendInvoiceRequest>;
/**
 * @generated from message tank.books.v1.SendInvoiceResponse
 */
export type SendInvoiceResponse = Message<"tank.books.v1.SendInvoiceResponse"> & {
    /**
     * @generated from field: tank.books.v1.Invoice invoice = 1;
     */
    invoice?: Invoice;
};
/**
 * Describes the message tank.books.v1.SendInvoiceResponse.
 * Use `create(SendInvoiceResponseSchema)` to create a new message.
 */
export declare const SendInvoiceResponseSchema: GenMessage<SendInvoiceResponse>;
/**
 * @generated from message tank.books.v1.RecordPaymentRequest
 */
export type RecordPaymentRequest = Message<"tank.books.v1.RecordPaymentRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string invoice_id = 2;
     */
    invoiceId: string;
    /**
     * 0 = the amount due
     *
     * @generated from field: int64 amount_cents = 3;
     */
    amountCents: bigint;
    /**
     * @generated from field: string method = 4;
     */
    method: string;
    /**
     * @generated from field: string reference = 5;
     */
    reference: string;
    /**
     * @generated from field: google.protobuf.Timestamp at = 6;
     */
    at?: Timestamp;
    /**
     * When the agent records a payment: the message in its thread where a person said
     * the money arrived. A payment is money received, never a charge or a receivable,
     * so an agent's payment without one is refused. A person's own call needs none.
     *
     * @generated from field: string evidence_message_id = 7;
     */
    evidenceMessageId: string;
};
/**
 * Describes the message tank.books.v1.RecordPaymentRequest.
 * Use `create(RecordPaymentRequestSchema)` to create a new message.
 */
export declare const RecordPaymentRequestSchema: GenMessage<RecordPaymentRequest>;
/**
 * @generated from message tank.books.v1.RecordPaymentResponse
 */
export type RecordPaymentResponse = Message<"tank.books.v1.RecordPaymentResponse"> & {
    /**
     * @generated from field: tank.books.v1.Invoice invoice = 1;
     */
    invoice?: Invoice;
    /**
     * @generated from field: tank.books.v1.Payment payment = 2;
     */
    payment?: Payment;
};
/**
 * Describes the message tank.books.v1.RecordPaymentResponse.
 * Use `create(RecordPaymentResponseSchema)` to create a new message.
 */
export declare const RecordPaymentResponseSchema: GenMessage<RecordPaymentResponse>;
/**
 * @generated from message tank.books.v1.VoidInvoiceRequest
 */
export type VoidInvoiceRequest = Message<"tank.books.v1.VoidInvoiceRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * @generated from field: string reason = 3;
     */
    reason: string;
};
/**
 * Describes the message tank.books.v1.VoidInvoiceRequest.
 * Use `create(VoidInvoiceRequestSchema)` to create a new message.
 */
export declare const VoidInvoiceRequestSchema: GenMessage<VoidInvoiceRequest>;
/**
 * @generated from message tank.books.v1.VoidInvoiceResponse
 */
export type VoidInvoiceResponse = Message<"tank.books.v1.VoidInvoiceResponse"> & {
    /**
     * @generated from field: tank.books.v1.Invoice invoice = 1;
     */
    invoice?: Invoice;
};
/**
 * Describes the message tank.books.v1.VoidInvoiceResponse.
 * Use `create(VoidInvoiceResponseSchema)` to create a new message.
 */
export declare const VoidInvoiceResponseSchema: GenMessage<VoidInvoiceResponse>;
/**
 * @generated from message tank.books.v1.ListExpensesRequest
 */
export type ListExpensesRequest = Message<"tank.books.v1.ListExpensesRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * 0 = 90
     *
     * @generated from field: int32 days = 2;
     */
    days: number;
    /**
     * Only the expenses filed automatically whose category a person should check, at
     * any date (days is ignored).
     *
     * @generated from field: bool needs_review = 3;
     */
    needsReview: boolean;
};
/**
 * Describes the message tank.books.v1.ListExpensesRequest.
 * Use `create(ListExpensesRequestSchema)` to create a new message.
 */
export declare const ListExpensesRequestSchema: GenMessage<ListExpensesRequest>;
/**
 * @generated from message tank.books.v1.ListExpensesResponse
 */
export type ListExpensesResponse = Message<"tank.books.v1.ListExpensesResponse"> & {
    /**
     * @generated from field: repeated tank.books.v1.Expense expenses = 1;
     */
    expenses: Expense[];
};
/**
 * Describes the message tank.books.v1.ListExpensesResponse.
 * Use `create(ListExpensesResponseSchema)` to create a new message.
 */
export declare const ListExpensesResponseSchema: GenMessage<ListExpensesResponse>;
/**
 * @generated from message tank.books.v1.RecordExpenseRequest
 */
export type RecordExpenseRequest = Message<"tank.books.v1.RecordExpenseRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string vendor = 2;
     */
    vendor: string;
    /**
     * @generated from field: string category = 3;
     */
    category: string;
    /**
     * @generated from field: int64 amount_cents = 4;
     */
    amountCents: bigint;
    /**
     * @generated from field: google.protobuf.Timestamp at = 5;
     */
    at?: Timestamp;
    /**
     * @generated from field: string notes = 6;
     */
    notes: string;
    /**
     * @generated from field: string receipt_file_id = 7;
     */
    receiptFileId: string;
    /**
     * The period the expense covers. Required with a source; the expense is dated at
     * the period's end. Booking the same source, category and period start again
     * revises that expense (amount, end) rather than adding a second one.
     *
     * @generated from field: google.protobuf.Timestamp period_start = 8;
     */
    periodStart?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp period_end = 9;
     */
    periodEnd?: Timestamp;
    /**
     * @generated from field: string source = 10;
     */
    source: string;
    /**
     * A Category id; empty files it from `category` text (unknown text goes under Other).
     *
     * @generated from field: string category_id = 11;
     */
    categoryId: string;
    /**
     * Unset = paid when it happened, as before. false = an unpaid bill (pay it later
     * with PayExpense); true = paid, at paid_at or else at the expense's date.
     *
     * @generated from field: optional bool paid = 12;
     */
    paid?: boolean;
    /**
     * @generated from field: google.protobuf.Timestamp paid_at = 13;
     */
    paidAt?: Timestamp;
};
/**
 * Describes the message tank.books.v1.RecordExpenseRequest.
 * Use `create(RecordExpenseRequestSchema)` to create a new message.
 */
export declare const RecordExpenseRequestSchema: GenMessage<RecordExpenseRequest>;
/**
 * @generated from message tank.books.v1.RecordExpenseResponse
 */
export type RecordExpenseResponse = Message<"tank.books.v1.RecordExpenseResponse"> & {
    /**
     * @generated from field: tank.books.v1.Expense expense = 1;
     */
    expense?: Expense;
    /**
     * booked | revised | unchanged
     *
     * @generated from field: string outcome = 2;
     */
    outcome: string;
};
/**
 * Describes the message tank.books.v1.RecordExpenseResponse.
 * Use `create(RecordExpenseResponseSchema)` to create a new message.
 */
export declare const RecordExpenseResponseSchema: GenMessage<RecordExpenseResponse>;
/**
 * @generated from message tank.books.v1.GetCashSummaryRequest
 */
export type GetCashSummaryRequest = Message<"tank.books.v1.GetCashSummaryRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.books.v1.GetCashSummaryRequest.
 * Use `create(GetCashSummaryRequestSchema)` to create a new message.
 */
export declare const GetCashSummaryRequestSchema: GenMessage<GetCashSummaryRequest>;
/**
 * @generated from message tank.books.v1.GetCashSummaryResponse
 */
export type GetCashSummaryResponse = Message<"tank.books.v1.GetCashSummaryResponse"> & {
    /**
     * @generated from field: tank.books.v1.CashSummary summary = 1;
     */
    summary?: CashSummary;
};
/**
 * Describes the message tank.books.v1.GetCashSummaryResponse.
 * Use `create(GetCashSummaryResponseSchema)` to create a new message.
 */
export declare const GetCashSummaryResponseSchema: GenMessage<GetCashSummaryResponse>;
/**
 * The bank feed, as a file first. A line is money in (positive) or out (negative);
 * reconciliation is matching each line to an invoice or an expense, and the match
 * always says why in a sentence.
 *
 * @generated from message tank.books.v1.BankTransaction
 */
export type BankTransaction = Message<"tank.books.v1.BankTransaction"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * @generated from field: google.protobuf.Timestamp at = 2;
     */
    at?: Timestamp;
    /**
     * @generated from field: string description = 3;
     */
    description: string;
    /**
     * positive in, negative out
     *
     * @generated from field: int64 amount_cents = 4;
     */
    amountCents: bigint;
    /**
     * @generated from field: string reference = 5;
     */
    reference: string;
    /**
     * "" | invoice | expense
     *
     * @generated from field: string matched_kind = 6;
     */
    matchedKind: string;
    /**
     * @generated from field: string matched_id = 7;
     */
    matchedId: string;
    /**
     * e.g. "INV-0007 · Acme" or "AWS · hosting"
     *
     * @generated from field: string matched_label = 8;
     */
    matchedLabel: string;
    /**
     * why it matched, or why it is suggested
     *
     * @generated from field: string explanation = 9;
     */
    explanation: string;
    /**
     * The best guess for an unmatched line, when there is one.
     *
     * invoice | expense | new_expense
     *
     * @generated from field: string suggested_kind = 10;
     */
    suggestedKind: string;
    /**
     * @generated from field: string suggested_id = 11;
     */
    suggestedId: string;
    /**
     * @generated from field: string suggested_label = 12;
     */
    suggestedLabel: string;
    /**
     * @generated from field: double suggested_confidence = 13;
     */
    suggestedConfidence: number;
};
/**
 * Describes the message tank.books.v1.BankTransaction.
 * Use `create(BankTransactionSchema)` to create a new message.
 */
export declare const BankTransactionSchema: GenMessage<BankTransaction>;
/**
 * @generated from message tank.books.v1.ImportBankTransactionsRequest
 */
export type ImportBankTransactionsRequest = Message<"tank.books.v1.ImportBankTransactionsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * a bank export: date, description, amount (or debit/credit), reference
     *
     * @generated from field: string csv = 2;
     */
    csv: string;
    /**
     * @generated from field: string account_name = 3;
     */
    accountName: string;
};
/**
 * Describes the message tank.books.v1.ImportBankTransactionsRequest.
 * Use `create(ImportBankTransactionsRequestSchema)` to create a new message.
 */
export declare const ImportBankTransactionsRequestSchema: GenMessage<ImportBankTransactionsRequest>;
/**
 * @generated from message tank.books.v1.ImportBankTransactionsResponse
 */
export type ImportBankTransactionsResponse = Message<"tank.books.v1.ImportBankTransactionsResponse"> & {
    /**
     * @generated from field: int32 imported = 1;
     */
    imported: number;
    /**
     * already known
     *
     * @generated from field: int32 skipped = 2;
     */
    skipped: number;
    /**
     * matched on the spot, with an explanation
     *
     * @generated from field: int32 auto_matched = 3;
     */
    autoMatched: number;
    /**
     * @generated from field: repeated tank.books.v1.BankTransaction transactions = 4;
     */
    transactions: BankTransaction[];
};
/**
 * Describes the message tank.books.v1.ImportBankTransactionsResponse.
 * Use `create(ImportBankTransactionsResponseSchema)` to create a new message.
 */
export declare const ImportBankTransactionsResponseSchema: GenMessage<ImportBankTransactionsResponse>;
/**
 * @generated from message tank.books.v1.ListBankTransactionsRequest
 */
export type ListBankTransactionsRequest = Message<"tank.books.v1.ListBankTransactionsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: bool unmatched_only = 2;
     */
    unmatchedOnly: boolean;
};
/**
 * Describes the message tank.books.v1.ListBankTransactionsRequest.
 * Use `create(ListBankTransactionsRequestSchema)` to create a new message.
 */
export declare const ListBankTransactionsRequestSchema: GenMessage<ListBankTransactionsRequest>;
/**
 * @generated from message tank.books.v1.ListBankTransactionsResponse
 */
export type ListBankTransactionsResponse = Message<"tank.books.v1.ListBankTransactionsResponse"> & {
    /**
     * @generated from field: repeated tank.books.v1.BankTransaction transactions = 1;
     */
    transactions: BankTransaction[];
};
/**
 * Describes the message tank.books.v1.ListBankTransactionsResponse.
 * Use `create(ListBankTransactionsResponseSchema)` to create a new message.
 */
export declare const ListBankTransactionsResponseSchema: GenMessage<ListBankTransactionsResponse>;
/**
 * @generated from message tank.books.v1.MatchBankTransactionRequest
 */
export type MatchBankTransactionRequest = Message<"tank.books.v1.MatchBankTransactionRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string transaction_id = 2;
     */
    transactionId: string;
    /**
     * money in: records a payment on it
     *
     * @generated from field: string invoice_id = 3;
     */
    invoiceId: string;
    /**
     * money out: ties to an expense already booked
     *
     * @generated from field: string expense_id = 4;
     */
    expenseId: string;
    /**
     * money out: books a new expense with this vendor
     *
     * @generated from field: string new_expense_vendor = 5;
     */
    newExpenseVendor: string;
    /**
     * @generated from field: string new_expense_category = 6;
     */
    newExpenseCategory: string;
};
/**
 * Describes the message tank.books.v1.MatchBankTransactionRequest.
 * Use `create(MatchBankTransactionRequestSchema)` to create a new message.
 */
export declare const MatchBankTransactionRequestSchema: GenMessage<MatchBankTransactionRequest>;
/**
 * @generated from message tank.books.v1.MatchBankTransactionResponse
 */
export type MatchBankTransactionResponse = Message<"tank.books.v1.MatchBankTransactionResponse"> & {
    /**
     * @generated from field: tank.books.v1.BankTransaction transaction = 1;
     */
    transaction?: BankTransaction;
};
/**
 * Describes the message tank.books.v1.MatchBankTransactionResponse.
 * Use `create(MatchBankTransactionResponseSchema)` to create a new message.
 */
export declare const MatchBankTransactionResponseSchema: GenMessage<MatchBankTransactionResponse>;
/**
 * A report is an answer: how the period went, from the journal, in the words a person
 * asks with. Profit is revenue less expenses; cash is what the journal says is in hand.
 *
 * @generated from message tank.books.v1.ReportLine
 */
export type ReportLine = Message<"tank.books.v1.ReportLine"> & {
    /**
     * e.g. "hosting", or a customer's name
     *
     * @generated from field: string label = 1;
     */
    label: string;
    /**
     * @generated from field: int64 cents = 2;
     */
    cents: bigint;
};
/**
 * Describes the message tank.books.v1.ReportLine.
 * Use `create(ReportLineSchema)` to create a new message.
 */
export declare const ReportLineSchema: GenMessage<ReportLine>;
/**
 * @generated from message tank.books.v1.Report
 */
export type Report = Message<"tank.books.v1.Report"> & {
    /**
     * @generated from field: google.protobuf.Timestamp from = 1;
     */
    from?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp to = 2;
     */
    to?: Timestamp;
    /**
     * @generated from field: string currency = 3;
     */
    currency: string;
    /**
     * invoiced in the period
     *
     * @generated from field: int64 revenue_cents = 4;
     */
    revenueCents: bigint;
    /**
     * @generated from field: int64 expenses_cents = 5;
     */
    expensesCents: bigint;
    /**
     * revenue − expenses
     *
     * @generated from field: int64 profit_cents = 6;
     */
    profitCents: bigint;
    /**
     * payments that arrived
     *
     * @generated from field: int64 received_cents = 7;
     */
    receivedCents: bigint;
    /**
     * cash account balance, all time
     *
     * @generated from field: int64 cash_cents = 8;
     */
    cashCents: bigint;
    /**
     * still owed, all time
     *
     * @generated from field: int64 receivable_cents = 9;
     */
    receivableCents: bigint;
    /**
     * @generated from field: repeated tank.books.v1.ReportLine expenses_by_category = 10;
     */
    expensesByCategory: ReportLine[];
    /**
     * @generated from field: repeated tank.books.v1.ReportLine revenue_by_customer = 11;
     */
    revenueByCustomer: ReportLine[];
    /**
     * the report in one sentence
     *
     * @generated from field: string sentence = 12;
     */
    sentence: string;
};
/**
 * Describes the message tank.books.v1.Report.
 * Use `create(ReportSchema)` to create a new message.
 */
export declare const ReportSchema: GenMessage<Report>;
/**
 * A receipt, read by the model: what a person would have typed in.
 *
 * @generated from message tank.books.v1.ReadReceiptRequest
 */
export type ReadReceiptRequest = Message<"tank.books.v1.ReadReceiptRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * an image or PDF already uploaded to this workspace
     *
     * @generated from field: string file_id = 2;
     */
    fileId: string;
};
/**
 * Describes the message tank.books.v1.ReadReceiptRequest.
 * Use `create(ReadReceiptRequestSchema)` to create a new message.
 */
export declare const ReadReceiptRequestSchema: GenMessage<ReadReceiptRequest>;
/**
 * @generated from message tank.books.v1.ReadReceiptResponse
 */
export type ReadReceiptResponse = Message<"tank.books.v1.ReadReceiptResponse"> & {
    /**
     * @generated from field: string vendor = 1;
     */
    vendor: string;
    /**
     * @generated from field: string category = 2;
     */
    category: string;
    /**
     * @generated from field: int64 amount_cents = 3;
     */
    amountCents: bigint;
    /**
     * @generated from field: google.protobuf.Timestamp at = 4;
     */
    at?: Timestamp;
    /**
     * 0 to 1; low means ask the person
     *
     * @generated from field: double confidence = 5;
     */
    confidence: number;
    /**
     * what could not be read, in a sentence
     *
     * @generated from field: string note = 6;
     */
    note: string;
    /**
     * as printed on the receipt, when it differs
     *
     * @generated from field: string currency = 7;
     */
    currency: string;
};
/**
 * Describes the message tank.books.v1.ReadReceiptResponse.
 * Use `create(ReadReceiptResponseSchema)` to create a new message.
 */
export declare const ReadReceiptResponseSchema: GenMessage<ReadReceiptResponse>;
/**
 * Everything in the period as a file an accountant can open.
 *
 * @generated from message tank.books.v1.ExportRequest
 */
export type ExportRequest = Message<"tank.books.v1.ExportRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * as in a report
     *
     * @generated from field: string period = 2;
     */
    period: string;
    /**
     * invoices | expenses | journal | statement
     *
     * @generated from field: string kind = 3;
     */
    kind: string;
    /**
     * For kind statement: the statement to write (its workspace_id is ignored). Unset =
     * this fiscal year by month, earned. period is not used for a statement.
     *
     * @generated from field: tank.books.v1.GetStatementRequest statement = 4;
     */
    statement?: GetStatementRequest;
    /**
     * For the other kinds with period "custom": the window, from inclusive, to exclusive.
     *
     * @generated from field: google.protobuf.Timestamp from = 5;
     */
    from?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp to = 6;
     */
    to?: Timestamp;
};
/**
 * Describes the message tank.books.v1.ExportRequest.
 * Use `create(ExportRequestSchema)` to create a new message.
 */
export declare const ExportRequestSchema: GenMessage<ExportRequest>;
/**
 * @generated from message tank.books.v1.ExportResponse
 */
export type ExportResponse = Message<"tank.books.v1.ExportResponse"> & {
    /**
     * @generated from field: string filename = 1;
     */
    filename: string;
    /**
     * @generated from field: string csv = 2;
     */
    csv: string;
    /**
     * @generated from field: int32 rows = 3;
     */
    rows: number;
};
/**
 * Describes the message tank.books.v1.ExportResponse.
 * Use `create(ExportResponseSchema)` to create a new message.
 */
export declare const ExportResponseSchema: GenMessage<ExportResponse>;
/**
 * @generated from message tank.books.v1.GetReportRequest
 */
export type GetReportRequest = Message<"tank.books.v1.GetReportRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * this_month | last_month | this_quarter | last_quarter | this_year | last_year |
     * last_30_days (default) | custom. Quarters and years are fiscal, cut in the books'
     * timezone.
     *
     * @generated from field: string period = 2;
     */
    period: string;
    /**
     * For custom: from inclusive, to exclusive.
     *
     * @generated from field: google.protobuf.Timestamp from = 3;
     */
    from?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp to = 4;
     */
    to?: Timestamp;
};
/**
 * Describes the message tank.books.v1.GetReportRequest.
 * Use `create(GetReportRequestSchema)` to create a new message.
 */
export declare const GetReportRequestSchema: GenMessage<GetReportRequest>;
/**
 * @generated from message tank.books.v1.GetReportResponse
 */
export type GetReportResponse = Message<"tank.books.v1.GetReportResponse"> & {
    /**
     * @generated from field: tank.books.v1.Report report = 1;
     */
    report?: Report;
};
/**
 * Describes the message tank.books.v1.GetReportResponse.
 * Use `create(GetReportResponseSchema)` to create a new message.
 */
export declare const GetReportResponseSchema: GenMessage<GetReportResponse>;
/**
 * @generated from message tank.books.v1.ListCategoriesRequest
 */
export type ListCategoriesRequest = Message<"tank.books.v1.ListCategoriesRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: bool include_archived = 2;
     */
    includeArchived: boolean;
};
/**
 * Describes the message tank.books.v1.ListCategoriesRequest.
 * Use `create(ListCategoriesRequestSchema)` to create a new message.
 */
export declare const ListCategoriesRequestSchema: GenMessage<ListCategoriesRequest>;
/**
 * @generated from message tank.books.v1.ListCategoriesResponse
 */
export type ListCategoriesResponse = Message<"tank.books.v1.ListCategoriesResponse"> & {
    /**
     * @generated from field: repeated tank.books.v1.Category categories = 1;
     */
    categories: Category[];
};
/**
 * Describes the message tank.books.v1.ListCategoriesResponse.
 * Use `create(ListCategoriesResponseSchema)` to create a new message.
 */
export declare const ListCategoriesResponseSchema: GenMessage<ListCategoriesResponse>;
/**
 * @generated from message tank.books.v1.UpsertCategoryRequest
 */
export type UpsertCategoryRequest = Message<"tank.books.v1.UpsertCategoryRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * empty to add one
     *
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * @generated from field: string name = 3;
     */
    name: string;
    /**
     * required to add; a category never changes group
     *
     * @generated from field: string group = 4;
     */
    group: string;
    /**
     * archive (true) or bring back (false); edits only
     *
     * @generated from field: bool archived = 5;
     */
    archived: boolean;
    /**
     * 0 = leave (edit) or after the group's last (add)
     *
     * @generated from field: int32 sort = 6;
     */
    sort: number;
};
/**
 * Describes the message tank.books.v1.UpsertCategoryRequest.
 * Use `create(UpsertCategoryRequestSchema)` to create a new message.
 */
export declare const UpsertCategoryRequestSchema: GenMessage<UpsertCategoryRequest>;
/**
 * @generated from message tank.books.v1.UpsertCategoryResponse
 */
export type UpsertCategoryResponse = Message<"tank.books.v1.UpsertCategoryResponse"> & {
    /**
     * @generated from field: tank.books.v1.Category category = 1;
     */
    category?: Category;
};
/**
 * Describes the message tank.books.v1.UpsertCategoryResponse.
 * Use `create(UpsertCategoryResponseSchema)` to create a new message.
 */
export declare const UpsertCategoryResponseSchema: GenMessage<UpsertCategoryResponse>;
/**
 * @generated from message tank.books.v1.SetCashBalanceRequest
 */
export type SetCashBalanceRequest = Message<"tank.books.v1.SetCashBalanceRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * the day; unset = today
     *
     * @generated from field: google.protobuf.Timestamp as_of = 2;
     */
    asOf?: Timestamp;
    /**
     * may be negative (overdrawn)
     *
     * @generated from field: int64 amount_cents = 3;
     */
    amountCents: bigint;
    /**
     * @generated from field: string note = 4;
     */
    note: string;
};
/**
 * Describes the message tank.books.v1.SetCashBalanceRequest.
 * Use `create(SetCashBalanceRequestSchema)` to create a new message.
 */
export declare const SetCashBalanceRequestSchema: GenMessage<SetCashBalanceRequest>;
/**
 * @generated from message tank.books.v1.SetCashBalanceResponse
 */
export type SetCashBalanceResponse = Message<"tank.books.v1.SetCashBalanceResponse"> & {
    /**
     * @generated from field: tank.books.v1.CashBalance balance = 1;
     */
    balance?: CashBalance;
};
/**
 * Describes the message tank.books.v1.SetCashBalanceResponse.
 * Use `create(SetCashBalanceResponseSchema)` to create a new message.
 */
export declare const SetCashBalanceResponseSchema: GenMessage<SetCashBalanceResponse>;
/**
 * @generated from message tank.books.v1.PayExpenseRequest
 */
export type PayExpenseRequest = Message<"tank.books.v1.PayExpenseRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * an unpaid bill
     *
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * unset = now
     *
     * @generated from field: google.protobuf.Timestamp paid_at = 3;
     */
    paidAt?: Timestamp;
};
/**
 * Describes the message tank.books.v1.PayExpenseRequest.
 * Use `create(PayExpenseRequestSchema)` to create a new message.
 */
export declare const PayExpenseRequestSchema: GenMessage<PayExpenseRequest>;
/**
 * @generated from message tank.books.v1.PayExpenseResponse
 */
export type PayExpenseResponse = Message<"tank.books.v1.PayExpenseResponse"> & {
    /**
     * @generated from field: tank.books.v1.Expense expense = 1;
     */
    expense?: Expense;
};
/**
 * Describes the message tank.books.v1.PayExpenseResponse.
 * Use `create(PayExpenseResponseSchema)` to create a new message.
 */
export declare const PayExpenseResponseSchema: GenMessage<PayExpenseResponse>;
/**
 * One column of a statement.
 *
 * @generated from message tank.books.v1.StatementPeriod
 */
export type StatementPeriod = Message<"tank.books.v1.StatementPeriod"> & {
    /**
     * month "2026-04", quarter "FY2027-Q1", year "FY2027" (named by the calendar year
     * the fiscal year ends in). Accepted back as from_period / to_period.
     *
     * @generated from field: string key = 1;
     */
    key: string;
    /**
     * e.g. "Apr 2026", "Q1 FY2027", "FY2027"
     *
     * @generated from field: string label = 2;
     */
    label: string;
    /**
     * inclusive, midnight in the books' timezone
     *
     * @generated from field: google.protobuf.Timestamp start = 3;
     */
    start?: Timestamp;
    /**
     * exclusive
     *
     * @generated from field: google.protobuf.Timestamp end = 4;
     */
    end?: Timestamp;
    /**
     * @generated from field: tank.books.v1.PeriodKind kind = 5;
     */
    kind: PeriodKind;
};
/**
 * Describes the message tank.books.v1.StatementPeriod.
 * Use `create(StatementPeriodSchema)` to create a new message.
 */
export declare const StatementPeriodSchema: GenMessage<StatementPeriod>;
/**
 * One figure. What the cell shows is actual + expected; budget is beside it.
 * Expected and budget are zero until forecasts (phase 2) and budgets (phase 3).
 *
 * @generated from message tank.books.v1.StatementCell
 */
export type StatementCell = Message<"tank.books.v1.StatementCell"> & {
    /**
     * @generated from field: int64 actual_cents = 1;
     */
    actualCents: bigint;
    /**
     * @generated from field: int64 expected_cents = 2;
     */
    expectedCents: bigint;
    /**
     * @generated from field: int64 budget_cents = 3;
     */
    budgetCents: bigint;
    /**
     * @generated from field: tank.books.v1.CellState state = 4;
     */
    state: CellState;
};
/**
 * Describes the message tank.books.v1.StatementCell.
 * Use `create(StatementCellSchema)` to create a new message.
 */
export declare const StatementCellSchema: GenMessage<StatementCell>;
/**
 * @generated from message tank.books.v1.StatementRow
 */
export type StatementRow = Message<"tank.books.v1.StatementRow"> & {
    /**
     * @generated from field: tank.books.v1.StatementRowKind kind = 1;
     */
    kind: StatementRowKind;
    /**
     * for a category row
     *
     * @generated from field: string category_id = 2;
     */
    categoryId: string;
    /**
     * income | cost_of_revenue | payroll | operating; empty on totals
     *
     * @generated from field: string group = 3;
     */
    group: string;
    /**
     * @generated from field: string label = 4;
     */
    label: string;
    /**
     * Stable name for subtotals and totals: "group:income", "group:cost_of_revenue",
     * "group:payroll", "group:operating", "expenses", "gross_profit", "net",
     * "cash_in", "cash_out", "ending_cash". Empty on category rows.
     *
     * @generated from field: string key = 5;
     */
    key: string;
    /**
     * one per period, in order
     *
     * @generated from field: repeated tank.books.v1.StatementCell cells = 6;
     */
    cells: StatementCell[];
    /**
     * across every period; unset for ending_cash
     *
     * @generated from field: tank.books.v1.StatementCell total = 7;
     */
    total?: StatementCell;
};
/**
 * Describes the message tank.books.v1.StatementRow.
 * Use `create(StatementRowSchema)` to create a new message.
 */
export declare const StatementRowSchema: GenMessage<StatementRow>;
/**
 * @generated from message tank.books.v1.GetStatementRequest
 */
export type GetStatementRequest = Message<"tank.books.v1.GetStatementRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: tank.books.v1.StatementGrain grain = 2;
     */
    grain: StatementGrain;
    /**
     * @generated from field: tank.books.v1.StatementBasis basis = 3;
     */
    basis: StatementBasis;
    /**
     * The range, by period key ("2026-04", "FY2027-Q1", "FY2027") of any grain, or by
     * dates: every period that overlaps [from, to) is a column. Nothing given = this
     * fiscal year (year grain: the last two fiscal years and this one).
     *
     * @generated from field: string from_period = 4;
     */
    fromPeriod: string;
    /**
     * @generated from field: string to_period = 5;
     */
    toPeriod: string;
    /**
     * @generated from field: google.protobuf.Timestamp from = 6;
     */
    from?: Timestamp;
    /**
     * @generated from field: google.protobuf.Timestamp to = 7;
     */
    to?: Timestamp;
    /**
     * A scenario to lay over the forecast (phase 4). Ignored until then.
     *
     * @generated from field: string scenario_id = 8;
     */
    scenarioId: string;
};
/**
 * Describes the message tank.books.v1.GetStatementRequest.
 * Use `create(GetStatementRequestSchema)` to create a new message.
 */
export declare const GetStatementRequestSchema: GenMessage<GetStatementRequest>;
/**
 * @generated from message tank.books.v1.GetStatementResponse
 */
export type GetStatementResponse = Message<"tank.books.v1.GetStatementResponse"> & {
    /**
     * @generated from field: string currency = 1;
     */
    currency: string;
    /**
     * @generated from field: tank.books.v1.StatementGrain grain = 2;
     */
    grain: StatementGrain;
    /**
     * @generated from field: tank.books.v1.StatementBasis basis = 3;
     */
    basis: StatementBasis;
    /**
     * @generated from field: int32 fiscal_year_start_month = 4;
     */
    fiscalYearStartMonth: number;
    /**
     * @generated from field: string timezone = 5;
     */
    timezone: string;
    /**
     * @generated from field: repeated tank.books.v1.StatementPeriod periods = 6;
     */
    periods: StatementPeriod[];
    /**
     * Income categories and their subtotal, then each expense group's categories and
     * subtotal, then the expenses total and gross profit. Categories with nothing in
     * any period are left out, except that every group's subtotal is always there.
     *
     * @generated from field: repeated tank.books.v1.StatementRow rows = 7;
     */
    rows: StatementRow[];
    /**
     * income − expenses
     *
     * @generated from field: tank.books.v1.StatementRow net = 8;
     */
    net?: StatementRow;
    /**
     * payments received (either basis)
     *
     * @generated from field: tank.books.v1.StatementRow cash_in = 9;
     */
    cashIn?: StatementRow;
    /**
     * expenses paid (either basis)
     *
     * @generated from field: tank.books.v1.StatementRow cash_out = 10;
     */
    cashOut?: StatementRow;
    /**
     * Cash at each period's end: the latest balance set plus cash movements since.
     * Empty cells when no balance has ever been set (has_opening_balance false).
     *
     * @generated from field: tank.books.v1.StatementRow ending_cash = 11;
     */
    endingCash?: StatementRow;
    /**
     * @generated from field: bool has_opening_balance = 12;
     */
    hasOpeningBalance: boolean;
    /**
     * the latest one set, when there is one
     *
     * @generated from field: tank.books.v1.CashBalance opening_balance = 13;
     */
    openingBalance?: CashBalance;
};
/**
 * Describes the message tank.books.v1.GetStatementResponse.
 * Use `create(GetStatementResponseSchema)` to create a new message.
 */
export declare const GetStatementResponseSchema: GenMessage<GetStatementResponse>;
/**
 * What is behind one cell: the invoices, payments and expenses in a category and a
 * period, on a basis.
 *
 * @generated from message tank.books.v1.ListTransactionsRequest
 */
export type ListTransactionsRequest = Message<"tank.books.v1.ListTransactionsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string category_id = 2;
     */
    categoryId: string;
    /**
     * inclusive
     *
     * @generated from field: google.protobuf.Timestamp start = 3;
     */
    start?: Timestamp;
    /**
     * exclusive
     *
     * @generated from field: google.protobuf.Timestamp end = 4;
     */
    end?: Timestamp;
    /**
     * @generated from field: tank.books.v1.StatementBasis basis = 5;
     */
    basis: StatementBasis;
};
/**
 * Describes the message tank.books.v1.ListTransactionsRequest.
 * Use `create(ListTransactionsRequestSchema)` to create a new message.
 */
export declare const ListTransactionsRequestSchema: GenMessage<ListTransactionsRequest>;
/**
 * @generated from message tank.books.v1.StatementTransaction
 */
export type StatementTransaction = Message<"tank.books.v1.StatementTransaction"> & {
    /**
     * invoice | payment | expense
     *
     * @generated from field: string kind = 1;
     */
    kind: string;
    /**
     * of that invoice, payment or expense
     *
     * @generated from field: string id = 2;
     */
    id: string;
    /**
     * @generated from field: google.protobuf.Timestamp at = 3;
     */
    at?: Timestamp;
    /**
     * "INV-0007 · Acme", or the vendor
     *
     * @generated from field: string label = 4;
     */
    label: string;
    /**
     * what it adds to the cell; negative for a reversal
     *
     * @generated from field: int64 amount_cents = 5;
     */
    amountCents: bigint;
    /**
     * the journal entry's memo, on the earned basis
     *
     * @generated from field: string memo = 6;
     */
    memo: string;
    /**
     * for a payment, the invoice it paid
     *
     * @generated from field: string invoice_id = 7;
     */
    invoiceId: string;
    /**
     * @generated from field: string category_id = 8;
     */
    categoryId: string;
};
/**
 * Describes the message tank.books.v1.StatementTransaction.
 * Use `create(StatementTransactionSchema)` to create a new message.
 */
export declare const StatementTransactionSchema: GenMessage<StatementTransaction>;
/**
 * @generated from message tank.books.v1.ListTransactionsResponse
 */
export type ListTransactionsResponse = Message<"tank.books.v1.ListTransactionsResponse"> & {
    /**
     * @generated from field: repeated tank.books.v1.StatementTransaction transactions = 1;
     */
    transactions: StatementTransaction[];
    /**
     * equals the cell's actual
     *
     * @generated from field: int64 total_cents = 2;
     */
    totalCents: bigint;
};
/**
 * Describes the message tank.books.v1.ListTransactionsResponse.
 * Use `create(ListTransactionsResponseSchema)` to create a new message.
 */
export declare const ListTransactionsResponseSchema: GenMessage<ListTransactionsResponse>;
/**
 * @generated from enum tank.books.v1.InvoiceStatus
 */
export declare enum InvoiceStatus {
    /**
     * @generated from enum value: INVOICE_STATUS_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * written, not sent
     *
     * @generated from enum value: INVOICE_STATUS_DRAFT = 1;
     */
    DRAFT = 1,
    /**
     * sent, unpaid, not yet due
     *
     * @generated from enum value: INVOICE_STATUS_SENT = 2;
     */
    SENT = 2,
    /**
     * sent, unpaid, past due
     *
     * @generated from enum value: INVOICE_STATUS_OVERDUE = 3;
     */
    OVERDUE = 3,
    /**
     * paid in full
     *
     * @generated from enum value: INVOICE_STATUS_PAID = 4;
     */
    PAID = 4,
    /**
     * cancelled; never counted
     *
     * @generated from enum value: INVOICE_STATUS_VOID = 5;
     */
    VOID = 5
}
/**
 * Describes the enum tank.books.v1.InvoiceStatus.
 */
export declare const InvoiceStatusSchema: GenEnum<InvoiceStatus>;
/**
 * @generated from enum tank.books.v1.CategoryKind
 */
export declare enum CategoryKind {
    /**
     * @generated from enum value: CATEGORY_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: CATEGORY_KIND_INCOME = 1;
     */
    INCOME = 1,
    /**
     * @generated from enum value: CATEGORY_KIND_EXPENSE = 2;
     */
    EXPENSE = 2
}
/**
 * Describes the enum tank.books.v1.CategoryKind.
 */
export declare const CategoryKindSchema: GenEnum<CategoryKind>;
/**
 * @generated from enum tank.books.v1.StatementGrain
 */
export declare enum StatementGrain {
    /**
     * = month
     *
     * @generated from enum value: STATEMENT_GRAIN_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: STATEMENT_GRAIN_MONTH = 1;
     */
    MONTH = 1,
    /**
     * fiscal quarters
     *
     * @generated from enum value: STATEMENT_GRAIN_QUARTER = 2;
     */
    QUARTER = 2,
    /**
     * fiscal years
     *
     * @generated from enum value: STATEMENT_GRAIN_YEAR = 3;
     */
    YEAR = 3
}
/**
 * Describes the enum tank.books.v1.StatementGrain.
 */
export declare const StatementGrainSchema: GenEnum<StatementGrain>;
/**
 * @generated from enum tank.books.v1.StatementBasis
 */
export declare enum StatementBasis {
    /**
     * = earned
     *
     * @generated from enum value: STATEMENT_BASIS_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * the P&L: invoiced and billed, from the journal
     *
     * @generated from enum value: STATEMENT_BASIS_EARNED = 1;
     */
    EARNED = 1,
    /**
     * money that arrived and went out
     *
     * @generated from enum value: STATEMENT_BASIS_CASH = 2;
     */
    CASH = 2
}
/**
 * Describes the enum tank.books.v1.StatementBasis.
 */
export declare const StatementBasisSchema: GenEnum<StatementBasis>;
/**
 * @generated from enum tank.books.v1.PeriodKind
 */
export declare enum PeriodKind {
    /**
     * @generated from enum value: PERIOD_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: PERIOD_KIND_PAST = 1;
     */
    PAST = 1,
    /**
     * today falls in it: actual to date + expected rest
     *
     * @generated from enum value: PERIOD_KIND_CURRENT = 2;
     */
    CURRENT = 2,
    /**
     * @generated from enum value: PERIOD_KIND_FUTURE = 3;
     */
    FUTURE = 3
}
/**
 * Describes the enum tank.books.v1.PeriodKind.
 */
export declare const PeriodKindSchema: GenEnum<PeriodKind>;
/**
 * @generated from enum tank.books.v1.CellState
 */
export declare enum CellState {
    /**
     * @generated from enum value: CELL_STATE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: CELL_STATE_ACTUAL = 1;
     */
    ACTUAL = 1,
    /**
     * @generated from enum value: CELL_STATE_EXPECTED = 2;
     */
    EXPECTED = 2,
    /**
     * actual to date plus expected for the rest
     *
     * @generated from enum value: CELL_STATE_MIXED = 3;
     */
    MIXED = 3
}
/**
 * Describes the enum tank.books.v1.CellState.
 */
export declare const CellStateSchema: GenEnum<CellState>;
/**
 * @generated from enum tank.books.v1.StatementRowKind
 */
export declare enum StatementRowKind {
    /**
     * @generated from enum value: STATEMENT_ROW_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from enum value: STATEMENT_ROW_KIND_CATEGORY = 1;
     */
    CATEGORY = 1,
    /**
     * a group's total
     *
     * @generated from enum value: STATEMENT_ROW_KIND_SUBTOTAL = 2;
     */
    SUBTOTAL = 2,
    /**
     * gross profit, net and the cash lines
     *
     * @generated from enum value: STATEMENT_ROW_KIND_TOTAL = 3;
     */
    TOTAL = 3
}
/**
 * Describes the enum tank.books.v1.StatementRowKind.
 */
export declare const StatementRowKindSchema: GenEnum<StatementRowKind>;
/**
 * @generated from service tank.books.v1.BooksService
 */
export declare const BooksService: GenService<{
    /**
     * @generated from rpc tank.books.v1.BooksService.GetSettings
     */
    getSettings: {
        methodKind: "unary";
        input: typeof GetSettingsRequestSchema;
        output: typeof GetSettingsResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.UpdateSettings
     */
    updateSettings: {
        methodKind: "unary";
        input: typeof UpdateSettingsRequestSchema;
        output: typeof UpdateSettingsResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.ListCustomers
     */
    listCustomers: {
        methodKind: "unary";
        input: typeof ListCustomersRequestSchema;
        output: typeof ListCustomersResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.UpsertCustomer
     */
    upsertCustomer: {
        methodKind: "unary";
        input: typeof UpsertCustomerRequestSchema;
        output: typeof UpsertCustomerResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.ListInvoices
     */
    listInvoices: {
        methodKind: "unary";
        input: typeof ListInvoicesRequestSchema;
        output: typeof ListInvoicesResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.GetInvoice
     */
    getInvoice: {
        methodKind: "unary";
        input: typeof GetInvoiceRequestSchema;
        output: typeof GetInvoiceResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.CreateInvoice
     */
    createInvoice: {
        methodKind: "unary";
        input: typeof CreateInvoiceRequestSchema;
        output: typeof CreateInvoiceResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.SendInvoice
     */
    sendInvoice: {
        methodKind: "unary";
        input: typeof SendInvoiceRequestSchema;
        output: typeof SendInvoiceResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.RecordPayment
     */
    recordPayment: {
        methodKind: "unary";
        input: typeof RecordPaymentRequestSchema;
        output: typeof RecordPaymentResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.VoidInvoice
     */
    voidInvoice: {
        methodKind: "unary";
        input: typeof VoidInvoiceRequestSchema;
        output: typeof VoidInvoiceResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.ListExpenses
     */
    listExpenses: {
        methodKind: "unary";
        input: typeof ListExpensesRequestSchema;
        output: typeof ListExpensesResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.RecordExpense
     */
    recordExpense: {
        methodKind: "unary";
        input: typeof RecordExpenseRequestSchema;
        output: typeof RecordExpenseResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.GetCashSummary
     */
    getCashSummary: {
        methodKind: "unary";
        input: typeof GetCashSummaryRequestSchema;
        output: typeof GetCashSummaryResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.ImportBankTransactions
     */
    importBankTransactions: {
        methodKind: "unary";
        input: typeof ImportBankTransactionsRequestSchema;
        output: typeof ImportBankTransactionsResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.ListBankTransactions
     */
    listBankTransactions: {
        methodKind: "unary";
        input: typeof ListBankTransactionsRequestSchema;
        output: typeof ListBankTransactionsResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.MatchBankTransaction
     */
    matchBankTransaction: {
        methodKind: "unary";
        input: typeof MatchBankTransactionRequestSchema;
        output: typeof MatchBankTransactionResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.GetReport
     */
    getReport: {
        methodKind: "unary";
        input: typeof GetReportRequestSchema;
        output: typeof GetReportResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.ReadReceipt
     */
    readReceipt: {
        methodKind: "unary";
        input: typeof ReadReceiptRequestSchema;
        output: typeof ReadReceiptResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.Export
     */
    export: {
        methodKind: "unary";
        input: typeof ExportRequestSchema;
        output: typeof ExportResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.ListCategories
     */
    listCategories: {
        methodKind: "unary";
        input: typeof ListCategoriesRequestSchema;
        output: typeof ListCategoriesResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.UpsertCategory
     */
    upsertCategory: {
        methodKind: "unary";
        input: typeof UpsertCategoryRequestSchema;
        output: typeof UpsertCategoryResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.SetCashBalance
     */
    setCashBalance: {
        methodKind: "unary";
        input: typeof SetCashBalanceRequestSchema;
        output: typeof SetCashBalanceResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.PayExpense
     */
    payExpense: {
        methodKind: "unary";
        input: typeof PayExpenseRequestSchema;
        output: typeof PayExpenseResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.GetStatement
     */
    getStatement: {
        methodKind: "unary";
        input: typeof GetStatementRequestSchema;
        output: typeof GetStatementResponseSchema;
    };
    /**
     * @generated from rpc tank.books.v1.BooksService.ListTransactions
     */
    listTransactions: {
        methodKind: "unary";
        input: typeof ListTransactionsRequestSchema;
        output: typeof ListTransactionsResponseSchema;
    };
}>;
