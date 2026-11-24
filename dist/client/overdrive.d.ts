import { DeliveryMode, type PredictedWork, type RepoDelivery } from "../contracts/tank/agent/v1/agent_pb.js";
/**
 * Overdrive: where a repository builds and deploys, and predicted work (the add-on). The
 * sentences live here so web and mobile cannot drift. The server's own sentences (why
 * TANK's runners are not available, why a switch was refused) are shown as they arrive.
 */
export declare const OVERDRIVE_COPY: {
    readonly delivery: {
        readonly title: "Where this builds and deploys";
        readonly intro: "Your workflow files stay the definition of passing. This only chooses who runs them.";
        readonly tankRunners: {
            readonly label: "TANK's runners";
            readonly detail: "TANK runs your checks on its own machines. It opens one pull request to switch your jobs over. Your secrets stay in GitHub and your deploys go where they go today.";
        };
        readonly ownCi: {
            readonly label: "Your current CI";
            readonly detail: "Nothing moves. TANK hears each result as it happens, reads the failure and fixes it.";
        };
        readonly otherCi: {
            readonly label: "Another CI";
            readonly detail: "Your CI tells TANK each result with one call. TANK reads the failure and fixes it.";
        };
        readonly tokenOnce: "Copy this token now. TANK will not show it again.";
        readonly tokenSet: "A report token is in use.";
        readonly newToken: "New token";
        readonly newTokenConfirm: "The current token stops working as soon as the new one is made.";
        readonly reportTo: "Send results to";
        readonly switchOpened: "The pull request that switches your jobs is open.";
        readonly switchMerged: "Your jobs run on TANK's runners.";
        readonly switchBackOpened: "The pull request that moves your jobs back to GitHub's machines is open. Merge it to finish; until then your jobs keep running on TANK's runners.";
        readonly adminsOnly: "Workspace admins choose where a repository builds and deploys.";
        readonly none: "Connect a repository to a Tread and it shows up here.";
    };
    readonly predicted: {
        readonly next: "Next";
        readonly ready: "Already built. Open the preview, then take it or leave it.";
        readonly building: "TANK is building this now.";
        readonly stale: "Built, and being brought up to date with your latest changes.";
        readonly idea: "TANK can build this next.";
        readonly upsell: "With Overdrive, these are built before you ask.";
        readonly take: "Take it";
        readonly start: "Start it";
        readonly dismiss: "Not now";
        readonly preview: "Preview";
        readonly proofStructure: "The database change was tried on an empty copy of your tables.";
        readonly proofQuestions: "The database change was checked against your real data, read-only.";
        readonly proofClone: "The database change was run on a private copy of your database.";
        readonly taken: "Taken. TANK is finishing it in a new thread.";
    };
    readonly spend: {
        readonly predicted: "Work built ahead (Overdrive)";
        readonly fee: "Overdrive add-on fee";
        readonly feeNote: "The add-on's monthly price. Not counted in the totals above.";
    };
    readonly addon: {
        readonly name: "Overdrive";
        readonly pitch: "TANK builds what you are likely to ask for next, so it is ready when you do.";
        readonly price: "$960 per workspace per month, plus metered agent usage.";
        readonly included: "Faster builds, live previews and instant deploys are already part of Premium. This adds the work done ahead.";
    };
};
export interface DeliveryChoice {
    mode: DeliveryMode;
    label: string;
    detail: string;
}
/** The three choices, in the order they are offered. */
export declare const DELIVERY_CHOICES: readonly DeliveryChoice[];
/** A repository with no setting builds on the CI it has today. */
export declare function deliveryMode(mode: DeliveryMode | undefined): DeliveryMode;
/**
 * The line beside a repository's switch pull request, or "" when there is none to show: the
 * one that moves its jobs to TANK's runners (open or merged), or the one that moves them back
 * (while it is open, the repository keeps its runners).
 */
export declare function switchLine(r: Pick<RepoDelivery, "mode" | "switchStatus" | "switchPullRequestUrl">): string;
/** The sentence under one predicted item, by what state it is in. */
export declare function predictedLine(work: Pick<PredictedWork, "state">): string;
/** The sentence about a database change proven ahead, or "" when there was none. */
export declare function migrationProofLine(work: Pick<PredictedWork, "migrationProof">): string;
/** What the primary button says: a built item is taken, an idea is started. */
export declare function predictedAction(work: Pick<PredictedWork, "state">): string;
/**
 * Whether Next takes this item with TakePredictedWork: built work that did not come from a
 * queued task. A queued task's prediction is taken by starting the task, built or not.
 */
export declare function takesBuilt(work: Pick<PredictedWork, "state" | "sourceTaskId">): boolean;
/** "4 of 9 taken in the last 30 days", or "" before anything was offered. */
export declare function hitRateLine(offered: number, taken: number): string;
/** A duration the way the stopwatch says it: "40s", "5m 25s", "1h 38m" (the card's own wording). */
export declare function clock(seconds: number): string;
/**
 * The stopwatch (Overdrive): a task's ask-to-live as both clients show it beside the proof,
 * TANK's own time first and the wait for a person beside it, so a slow approval does not
 * read as TANK being slow. The seconds come from the server (TaskProof.ask_to_live_seconds,
 * waiting_seconds); this only words them. "" when there is nothing to show.
 */
export declare function askToLiveLine(seconds: bigint | number | undefined, waitingSeconds?: bigint | number): string;
