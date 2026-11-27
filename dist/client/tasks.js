// Shared task rules for web and mobile (docs/tasks/PLAN.md, 2026-11-12), kept here so the
// two clients cannot drift: the stage order, Command's filters and its 30-day Done window,
// which view a person reads a Tread in, and which messages Simple mode folds into a task.
import { PrincipalKind } from "../contracts/tank/auth/v1/auth_pb.js";
import { ChannelView } from "../contracts/tank/channel/v1/channel_pb.js";
import { TaskStage } from "../contracts/tank/task/v1/task_pb.js";
import { tsMs } from "./store.js";
/** Command's columns and the strip's groups, left to right. */
export const TASK_STAGES = [
    TaskStage.QUEUED,
    TaskStage.IN_PROGRESS,
    TaskStage.READY_TO_CHECK,
    TaskStage.WAITING_DEPLOY,
    TaskStage.DONE,
    TaskStage.STUCK,
    TaskStage.CANCELLED,
];
/** A stable key per stage, for test ids, routes and analytics-free CSS hooks. */
export function taskStageKey(stage) {
    switch (stage) {
        case TaskStage.IN_PROGRESS:
            return "in_progress";
        case TaskStage.READY_TO_CHECK:
            return "ready_to_check";
        case TaskStage.WAITING_DEPLOY:
            return "waiting_deploy";
        case TaskStage.DONE:
            return "done";
        case TaskStage.STUCK:
            return "stuck";
        case TaskStage.CANCELLED:
            return "cancelled";
        default:
            return "queued";
    }
}
/** Command keeps Done and Cancelled for 30 days; older ones stay on their Tread. */
export const DONE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
/** The ranges a person can pick without choosing days, in the order the chips show them. */
export const DONE_RANGE_PRESETS = ["all", "today", "yesterday", "week", "month"];
export const DONE_ALL = { kind: "all" };
/** A local date as "YYYY-MM-DD", the value of a date input. */
export function localDateKey(ms) {
    const d = new Date(ms);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function parseDateKey(key) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key ?? "");
    if (!m)
        return undefined;
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    // new Date rolls 2026-02-31 into March; refuse it.
    return d.getMonth() === Number(m[2]) - 1 && d.getDate() === Number(m[3]) ? d : undefined;
}
/** Whether the range keeps every Done task (so Command's 30-day window applies). */
export function isAllDone(range) {
    if (!range || range.kind === "all")
        return true;
    return range.kind === "custom" && !parseDateKey(range.from) && !parseDateKey(range.to);
}
/**
 * The span of a range in the person's local time: [start, end) in ms, or undefined for All
 * (or custom days that are empty or not dates). A reversed pair is put the right way round.
 */
export function doneRangeBounds(range, now = Date.now()) {
    if (isAllDone(range) || !range)
        return undefined;
    const today = new Date(now);
    const day = (y, m, d) => new Date(y, m, d).getTime();
    const y = today.getFullYear();
    const m = today.getMonth();
    const d = today.getDate();
    switch (range.kind) {
        case "today":
            return { start: day(y, m, d), end: day(y, m, d + 1) };
        case "yesterday":
            return { start: day(y, m, d - 1), end: day(y, m, d) };
        case "week": {
            const sinceMonday = (today.getDay() + 6) % 7;
            return { start: day(y, m, d - sinceMonday), end: day(y, m, d - sinceMonday + 7) };
        }
        case "month":
            return { start: day(y, m, 1), end: day(y, m + 1, 1) };
        case "custom": {
            const a = parseDateKey(range.from) ?? parseDateKey(range.to);
            const b = parseDateKey(range.to) ?? parseDateKey(range.from);
            if (!a || !b)
                return undefined;
            const [first, last] = a.getTime() <= b.getTime() ? [a, b] : [b, a];
            return {
                start: first.getTime(),
                end: day(last.getFullYear(), last.getMonth(), last.getDate() + 1),
            };
        }
        default:
            return undefined;
    }
}
/** When a task was done: checked, else moved to its stage, else last touched (what the 30-day trim reads). */
export function doneAt(task) {
    return tsMs(task.checkedAt) || tsMs(task.stageAt) || tsMs(task.updatedAt);
}
/** The Done and Cancelled tasks inside the range; other tasks pass through. A task with no time is left out of a chosen range. */
export function filterDone(tasks, range, now = Date.now()) {
    const bounds = doneRangeBounds(range, now);
    if (!bounds)
        return [...tasks];
    return tasks.filter((t) => {
        if (t.stage !== TaskStage.DONE && t.stage !== TaskStage.CANCELLED)
            return true;
        const at = doneAt(t);
        return at > 0 && at >= bounds.start && at < bounds.end;
    });
}
/**
 * Tasks for Command: the filter, and Done and Cancelled trimmed to the window, or to the range when one is
 * chosen (a chosen range replaces the window, so older days can be looked at).
 */
export function commandTasks(tasks, filter = {}, now = Date.now(), doneRange) {
    const chosen = !isAllDone(doneRange);
    const kept = tasks.filter((t) => {
        if (filter.askedBy && t.createdBy !== filter.askedBy)
            return false;
        if (filter.channelId && t.channelId !== filter.channelId)
            return false;
        if ((t.stage === TaskStage.DONE || t.stage === TaskStage.CANCELLED) && !chosen) {
            const at = doneAt(t);
            if (at && now - at > DONE_WINDOW_MS)
                return false;
        }
        return true;
    });
    return chosen ? filterDone(kept, doneRange, now) : kept;
}
/** Tasks grouped by stage, every stage present (possibly empty), each group oldest first. */
export function tasksByStage(tasks) {
    const out = new Map(TASK_STAGES.map((s) => [s, []]));
    for (const t of tasks)
        out.get(TASK_STAGES.includes(t.stage) ? t.stage : TaskStage.QUEUED)?.push(t);
    return out;
}
/** The sorts a person can pick, in the order the control shows them. */
export const TASK_SORTS = ["newest", "oldest", "title", "tread"];
/** The time a sort reads: when a Done task was done, else when the task was asked. */
function sortTime(t) {
    return t.stage === TaskStage.DONE || t.stage === TaskStage.CANCELLED ? doneAt(t) : tsMs(t.createdAt);
}
/** A copy of the tasks in this order; ties keep a stable order by title then id. */
export function sortTasks(tasks, sort = "newest") {
    const byText = (a, b) => a.localeCompare(b, undefined, { sensitivity: "base" });
    const tie = (a, b) => byText(a.title, b.title) || byText(a.id, b.id);
    return [...tasks].sort((a, b) => {
        switch (sort) {
            case "oldest":
                return sortTime(a) - sortTime(b) || tie(a, b);
            case "title":
                return tie(a, b);
            case "tread":
                return byText(a.channelName, b.channelName) || sortTime(b) - sortTime(a) || tie(a, b);
            default:
                return sortTime(b) - sortTime(a) || tie(a, b);
        }
    });
}
/** The time the Tasks view reads: the last message or stage change, else the last update. */
export function activityAt(t) {
    return tsMs(t.lastActivityAt) || tsMs(t.updatedAt) || tsMs(t.createdAt);
}
/** True for a task still being worked on: not Done and not Cancelled. */
export function isActiveTask(t) {
    return t.stage !== TaskStage.DONE && t.stage !== TaskStage.CANCELLED;
}
/** The Tasks view: active tasks only, the one with the newest activity first; ties by id. */
export function activeTasksByActivity(tasks) {
    return tasks
        .filter(isActiveTask)
        .sort((a, b) => activityAt(b) - activityAt(a) || (a.id < b.id ? 1 : a.id > b.id ? -1 : 0));
}
/** The tasks whose title or Tread name has every word of the query (case-insensitive); a blank query keeps all. */
export function searchTasks(tasks, query) {
    const words = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0)
        return [...tasks];
    return tasks.filter((t) => {
        const hay = `${t.title} ${t.channelName}`.toLocaleLowerCase();
        return words.every((w) => hay.includes(w));
    });
}
/** A task can be cancelled at any stage short of Done (and Cancelled again changes nothing). */
export function canCancelTask(task) {
    return task.stage !== TaskStage.DONE && task.stage !== TaskStage.CANCELLED;
}
/** How many tasks wait for a person to check them. */
export function readyToCheckCount(tasks) {
    return tasks.filter((t) => t.stage === TaskStage.READY_TO_CHECK).length;
}
/**
 * The view this person reads the Tread in: their own pick, else the Tread's default, else
 * Builder (today's Tread, unchanged).
 */
export function effectiveView(channel, readState) {
    const mine = readState?.view ?? ChannelView.UNSPECIFIED;
    if (mine === ChannelView.SIMPLE || mine === ChannelView.BUILDER)
        return mine;
    return channel?.defaultView === ChannelView.SIMPLE ? ChannelView.SIMPLE : ChannelView.BUILDER;
}
/** Agent cards a person must answer stay in the Simple conversation; the rest fold into a task. */
const PERSON_CARDS = new Set(["message", "question_card", "approval_card", "api_key_card"]);
function cardType(m) {
    const v = m.metadata?.card_type;
    return typeof v === "string" ? v : "";
}
/**
 * Whether Simple mode leaves this message out of the conversation and folds it into its
 * task: an agent's status, plan, tool, pull request, CI, summary and other run cards. People's
 * messages, the agent's plain replies and the cards waiting on a person stay.
 */
export function isAgentInternal(m) {
    const agent = m.authorKind === PrincipalKind.AGENT || m.authorKind === PrincipalKind.BOT;
    if (!agent)
        return false;
    const type = cardType(m);
    if (type)
        return !PERSON_CARDS.has(type);
    // A run card always says what it is; an agent message with blocks and no type is a card
    // from an older control plane.
    return (m.blocks?.blocks?.length ?? 0) > 0 && typeof m.metadata?.run_id === "string";
}
/** The messages Simple mode shows, in order. */
export function simpleConversation(messages) {
    return messages.filter((m) => !isAgentInternal(m));
}
/** The task a message belongs to: the one whose thread it is in (or roots). */
export function taskForThread(tasks, threadRootId) {
    if (!threadRootId)
        return undefined;
    let found;
    for (const t of tasks)
        if (t.threadRootId === threadRootId && (!found || tsMs(t.createdAt) > tsMs(found.createdAt)))
            found = t;
    return found;
}
/** Who hears about the task at a stage: workspace rules first, then the task's own picks, each person once. */
export function notifyFor(task, stage) {
    const seen = new Set();
    const rows = [...task.notify].sort((a, b) => Number(b.fromWorkspace) - Number(a.fromWorkspace));
    const out = [];
    for (const n of rows) {
        if (n.stage !== stage || seen.has(n.userId))
            continue;
        seen.add(n.userId);
        out.push(n);
    }
    return out;
}
/** The task's own picks only (what SetTaskNotify replaces). */
export function ownNotify(task) {
    return task.notify.filter((n) => !n.fromWorkspace);
}
/** The longest note Send to takes (the server refuses more). */
export const SEND_NOTE_MAX = 500;
/**
 * Who Send to offers: the Tread's members (ListChannelMembers) who are people, still in the
 * workspace, and not the caller, in the order given. The server checks the same rule again;
 * this only keeps a name off the list that would be refused.
 */
export function taskSendCandidates(treadMemberIds, members, meId) {
    const seen = new Set();
    const out = [];
    for (const id of treadMemberIds) {
        if (!id || id === meId || seen.has(id))
            continue;
        seen.add(id);
        const m = members[id];
        if (!m || m.deactivatedAt || m.principal?.kind !== PrincipalKind.USER)
            continue;
        out.push(id);
    }
    return out;
}
