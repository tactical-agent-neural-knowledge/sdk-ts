import { DeliveryMode } from "../contracts/tank/agent/v1/agent_pb.js";
/**
 * Overdrive: where a repository builds and deploys, and predicted work (the add-on). The
 * sentences live here so web and mobile cannot drift. The server's own sentences (why
 * TANK's runners are not available, why a switch was refused) are shown as they arrive.
 */
export const OVERDRIVE_COPY = {
    delivery: {
        title: "Where this builds and deploys",
        intro: "Your workflow files stay the definition of passing. This only chooses who runs them.",
        tankRunners: {
            label: "TANK's runners",
            detail: "TANK runs your checks on its own machines. It opens one pull request to switch your jobs over. Your secrets stay in GitHub and your deploys go where they go today.",
        },
        ownCi: {
            label: "Your current CI",
            detail: "Nothing moves. TANK hears each result as it happens, reads the failure and fixes it.",
        },
        otherCi: {
            label: "Another CI",
            detail: "Your CI tells TANK each result with one call. TANK reads the failure and fixes it.",
        },
        tokenOnce: "Copy this token now. TANK will not show it again.",
        tokenSet: "A report token is in use.",
        newToken: "New token",
        newTokenConfirm: "The current token stops working as soon as the new one is made.",
        reportTo: "Send results to",
        switchOpened: "The pull request that switches your jobs is open.",
        switchMerged: "Your jobs run on TANK's runners.",
        switchBackOpened: "The pull request that moves your jobs back to GitHub's machines is open. Merge it to finish; until then your jobs keep running on TANK's runners.",
        adminsOnly: "Workspace admins choose where a repository builds and deploys.",
        none: "Connect a repository to a Tread and it shows up here.",
    },
    predicted: {
        next: "Next",
        ready: "Already built. Open the preview, then take it or leave it.",
        building: "TANK is building this now.",
        stale: "Built, and being brought up to date with your latest changes.",
        idea: "TANK can build this next.",
        upsell: "With Overdrive, these are built before you ask.",
        take: "Take it",
        start: "Start it",
        dismiss: "Not now",
        preview: "Preview",
        proofStructure: "The database change was tried on an empty copy of your tables.",
        proofQuestions: "The database change was checked against your real data, read-only.",
        proofClone: "The database change was run on a private copy of your database.",
    },
    addon: {
        name: "Overdrive",
        pitch: "TANK builds what you are likely to ask for next, so it is ready when you do.",
        price: "$960 per workspace per month, plus metered agent usage.",
        included: "Faster builds, live previews and instant deploys are already part of Premium. This adds the work done ahead.",
    },
};
/** The three choices, in the order they are offered. */
export const DELIVERY_CHOICES = [
    { mode: DeliveryMode.OWN_CI, ...OVERDRIVE_COPY.delivery.ownCi },
    { mode: DeliveryMode.TANK_RUNNERS, ...OVERDRIVE_COPY.delivery.tankRunners },
    { mode: DeliveryMode.OTHER_CI, ...OVERDRIVE_COPY.delivery.otherCi },
];
/** A repository with no setting builds on the CI it has today. */
export function deliveryMode(mode) {
    return mode === DeliveryMode.TANK_RUNNERS || mode === DeliveryMode.OTHER_CI ? mode : DeliveryMode.OWN_CI;
}
/**
 * The line beside a repository's switch pull request, or "" when there is none to show: the
 * one that moves its jobs to TANK's runners (open or merged), or the one that moves them back
 * (while it is open, the repository keeps its runners).
 */
export function switchLine(r) {
    if (!r.switchPullRequestUrl)
        return "";
    if (deliveryMode(r.mode) === DeliveryMode.TANK_RUNNERS) {
        return r.switchStatus === "merged"
            ? OVERDRIVE_COPY.delivery.switchMerged
            : OVERDRIVE_COPY.delivery.switchOpened;
    }
    return r.switchStatus === "opened" ? OVERDRIVE_COPY.delivery.switchBackOpened : "";
}
/** The sentence under one predicted item, by what state it is in. */
export function predictedLine(work) {
    switch (work.state) {
        case "ready":
            return OVERDRIVE_COPY.predicted.ready;
        case "building":
            return OVERDRIVE_COPY.predicted.building;
        case "stale":
            return OVERDRIVE_COPY.predicted.stale;
        default:
            return OVERDRIVE_COPY.predicted.idea;
    }
}
/** The sentence about a database change proven ahead, or "" when there was none. */
export function migrationProofLine(work) {
    switch (work.migrationProof) {
        case "structure":
            return OVERDRIVE_COPY.predicted.proofStructure;
        case "questions":
            return OVERDRIVE_COPY.predicted.proofQuestions;
        case "clone":
            return OVERDRIVE_COPY.predicted.proofClone;
        default:
            return "";
    }
}
/** What the primary button says: a built item is taken, an idea is started. */
export function predictedAction(work) {
    return work.state === "ready" || work.state === "stale"
        ? OVERDRIVE_COPY.predicted.take
        : OVERDRIVE_COPY.predicted.start;
}
/** "4 of 9 taken in the last 30 days", or "" before anything was offered. */
export function hitRateLine(offered, taken) {
    if (!(offered > 0))
        return "";
    return `${Math.max(0, Math.min(taken || 0, offered))} of ${offered} taken in the last 30 days`;
}
/** A duration the way the stopwatch says it: "40s", "5m 25s", "1h 38m" (the card's own wording). */
export function clock(seconds) {
    const s = Math.round(seconds);
    if (s < 60)
        return `${s}s`;
    if (s < 3600)
        return s % 60 === 0 ? `${s / 60}m` : `${Math.floor(s / 60)}m ${s % 60}s`;
    const m = Math.round(s / 60);
    return m % 60 === 0 ? `${m / 60}h` : `${Math.floor(m / 60)}h ${m % 60}m`;
}
/**
 * The stopwatch (Overdrive): a task's ask-to-live as both clients show it beside the proof,
 * TANK's own time first and the wait for a person beside it, so a slow approval does not
 * read as TANK being slow. The seconds come from the server (TaskProof.ask_to_live_seconds,
 * waiting_seconds); this only words them. "" when there is nothing to show.
 */
export function askToLiveLine(seconds, waitingSeconds) {
    const total = Number(seconds ?? 0);
    if (!Number.isFinite(total) || total <= 0)
        return "";
    const wait = Number(waitingSeconds ?? 0);
    if (!Number.isFinite(wait) || wait < 1 || wait >= total)
        return `Live in ${clock(total)}`;
    return `Live in ${clock(total - wait)} of TANK's time · ${clock(wait)} waiting for approval`;
}
