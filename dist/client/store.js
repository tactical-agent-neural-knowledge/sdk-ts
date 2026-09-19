import { create, createRegistry } from "@bufbuild/protobuf";
import { anyUnpack, timestampFromMs } from "@bufbuild/protobuf/wkt";
import { ChannelReadStateSchema } from "../contracts/tank/channel/v1/channel_pb.js";
import { file_tank_events_v1_events, } from "../contracts/tank/events/v1/events_pb.js";
import { NotificationSchema } from "../contracts/tank/notification/v1/notification_pb.js";
import { uuidv7Time } from "./uuidv7.js";
export const TYPING_TTL_MS = 5_000;
/** How long an `agent_status` frame stays live without a newer one. */
export const AGENT_STATUS_TTL_MS = 30_000;
export function initialState() {
    return {
        me: undefined,
        workspaces: {},
        members: {},
        channels: {},
        channelOrder: {},
        messages: {},
        messageIdsByChannel: {},
        threadIds: {},
        channelPaging: {},
        readStates: {},
        threadReadStates: {},
        presence: {},
        typing: {},
        agentStatus: {},
        agentStatusByThread: {},
        pending: {},
        connection: "idle",
        cursors: {},
        notifications: {},
        notificationIds: {},
        unreadNotificationCount: {},
        notificationPaging: {},
        runsById: {},
        runsByThread: {},
        filesById: {},
    };
}
// ---------------------------------------------------------------- helpers
function byId(items) {
    const out = {};
    for (const it of items)
        out[it.id] = it;
    return out;
}
function createdMs(m) {
    if (m.createdAt)
        return Number(m.createdAt.seconds) * 1000 + Math.floor(m.createdAt.nanos / 1e6);
    if (m.clientMsgId) {
        try {
            return uuidv7Time(m.clientMsgId);
        }
        catch {
            return 0;
        }
    }
    return 0;
}
export function tsMs(t) {
    return t ? Number(t.seconds) * 1000 + Math.floor(t.nanos / 1e6) : 0;
}
export function notificationPagingKey(workspaceId, mode) {
    return `${workspaceId}:${mode}`;
}
function isUnread(n) {
    return n !== undefined && n.readAt === undefined;
}
/** Ids of a workspace's notifications newest first; ties keep insertion order. */
function orderNotifications(ids, byId) {
    return Array.from(new Set(ids))
        .filter((id) => byId[id] !== undefined)
        .sort((a, b) => tsMs(byId[b]?.createdAt) - tsMs(byId[a]?.createdAt));
}
function upsertRuns(state, runs) {
    if (runs.length === 0)
        return state;
    const runsById = { ...state.runsById };
    const runsByThread = { ...state.runsByThread };
    for (const run of runs) {
        runsById[run.id] = run;
        if (!run.threadRootId)
            continue;
        const cur = runsByThread[run.threadRootId];
        if (!cur || cur.id === run.id || tsMs(run.startedAt) >= tsMs(cur.startedAt))
            runsByThread[run.threadRootId] = run;
    }
    return { ...state, runsById, runsByThread };
}
/** Sort key: real messages by seq, optimistic ones after every real one by creation time. */
function orderKey(seq, m) {
    return seq > 0n ? [0, Number(seq)] : [1, createdMs(m)];
}
function compareKeys(a, b) {
    return a[0] - b[0] || a[1] - b[1];
}
/** Insert `id` into an ordered id list (or move it if already present). Returns a new array if changed. */
function insertOrdered(ids, id, messages, seqOf) {
    const m = messages[id];
    const key = orderKey(seqOf(m), m);
    const without = ids.includes(id) ? ids.filter((x) => x !== id) : ids;
    let lo = 0;
    let hi = without.length;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        const other = messages[without[mid]];
        const ok = other ? orderKey(seqOf(other), other) : [0, 0];
        if (compareKeys(ok, key) <= 0)
            lo = mid + 1;
        else
            hi = mid;
    }
    const out = without.slice();
    out.splice(lo, 0, id);
    return out;
}
function inChannelTimeline(m) {
    return m.threadRootId === "" || m.channelSeq > 0n;
}
function channelSeq(m) {
    return m.channelSeq;
}
function threadSeq(m) {
    return m.threadSeq;
}
const TYPE_RANK = { 1: 0, 2: 0, 3: 1, 4: 1, 0: 2 };
function orderChannels(channels) {
    return channels
        .filter((c) => !c.archivedAt)
        .sort((a, b) => {
        const r = (TYPE_RANK[a.type] ?? 2) - (TYPE_RANK[b.type] ?? 2);
        if (r !== 0)
            return r;
        return a.name.localeCompare(b.name);
    })
        .map((c) => c.id);
}
function upsertMessage(state, m) {
    const prev = state.messages[m.id];
    const messages = { ...state.messages, [m.id]: m };
    let messageIdsByChannel = state.messageIdsByChannel;
    let threadIds = state.threadIds;
    if (inChannelTimeline(m)) {
        const ids = state.messageIdsByChannel[m.channelId] ?? [];
        const next = insertOrdered(ids, m.id, messages, channelSeq);
        messageIdsByChannel = { ...messageIdsByChannel, [m.channelId]: next };
    }
    else if (prev && ids(messageIdsByChannel, m.channelId).includes(m.id)) {
        messageIdsByChannel = {
            ...messageIdsByChannel,
            [m.channelId]: messageIdsByChannel[m.channelId].filter((x) => x !== m.id),
        };
    }
    if (m.threadRootId !== "") {
        const list = state.threadIds[m.threadRootId] ?? [];
        threadIds = { ...threadIds, [m.threadRootId]: insertOrdered(list, m.id, messages, threadSeq) };
    }
    return { ...state, messages, messageIdsByChannel, threadIds };
}
function ids(map, key) {
    return map[key] ?? [];
}
function removeMessage(state, messageId, channelId, threadRootId) {
    const m = state.messages[messageId];
    const ch = channelId || m?.channelId || "";
    const root = threadRootId || m?.threadRootId || "";
    const messages = { ...state.messages };
    delete messages[messageId];
    const messageIdsByChannel = { ...state.messageIdsByChannel };
    if (ch && messageIdsByChannel[ch]?.includes(messageId)) {
        messageIdsByChannel[ch] = messageIdsByChannel[ch].filter((x) => x !== messageId);
    }
    const threadIds = { ...state.threadIds };
    if (root && threadIds[root]?.includes(messageId)) {
        threadIds[root] = threadIds[root].filter((x) => x !== messageId);
    }
    // A deleted root drops its thread index; replies stay addressable by id.
    if (threadIds[messageId])
        delete threadIds[messageId];
    return { ...state, messages, messageIdsByChannel, threadIds };
}
function bumpChannelSeq(state, m) {
    const ch = state.channels[m.channelId];
    if (!ch || m.channelSeq <= ch.lastSeq)
        return state;
    const next = { ...ch, lastSeq: m.channelSeq, lastMessageAt: m.createdAt ?? ch.lastMessageAt };
    return { ...state, channels: { ...state.channels, [ch.id]: next } };
}
function bumpReplyCount(state, m) {
    if (m.threadRootId === "" || m.threadSeq === 0n)
        return state;
    const root = state.messages[m.threadRootId];
    if (!root)
        return state;
    const replyCount = Math.max(root.replyCount, Number(m.threadSeq));
    const replyUserIds = root.replyUserIds.includes(m.authorId)
        ? root.replyUserIds
        : [...root.replyUserIds, m.authorId];
    if (replyCount === root.replyCount &&
        replyUserIds === root.replyUserIds &&
        root.lastReplyAt === m.createdAt) {
        return state;
    }
    const next = { ...root, replyCount, replyUserIds, lastReplyAt: m.createdAt ?? root.lastReplyAt };
    return { ...state, messages: { ...state.messages, [root.id]: next } };
}
function updateReaction(state, messageId, userId, emoji, add) {
    const m = state.messages[messageId];
    if (!m)
        return state;
    const mine = state.me?.id === userId;
    const existing = m.reactions.find((r) => r.emoji === emoji);
    let reactions;
    if (add) {
        if (existing) {
            if (existing.userIds.includes(userId))
                return state;
            reactions = m.reactions.map((r) => r === existing
                ? { ...r, count: r.count + 1, userIds: [...r.userIds, userId], reacted: r.reacted || mine }
                : r);
        }
        else {
            reactions = [
                ...m.reactions,
                {
                    $typeName: "tank.message.v1.Reaction",
                    emoji,
                    count: 1,
                    userIds: [userId],
                    reacted: mine,
                },
            ];
        }
    }
    else {
        if (!existing?.userIds.includes(userId))
            return state;
        reactions = m.reactions
            .map((r) => r === existing
            ? {
                ...r,
                count: Math.max(0, r.count - 1),
                userIds: r.userIds.filter((u) => u !== userId),
                reacted: r.reacted && !mine,
            }
            : r)
            .filter((r) => r.count > 0);
    }
    return { ...state, messages: { ...state.messages, [messageId]: { ...m, reactions } } };
}
export function typingKey(channelId, threadRootId = "") {
    return threadRootId ? `${channelId}/${threadRootId}` : channelId;
}
// ---------------------------------------------------------------- reducer
export function reduce(state, action) {
    switch (action.type) {
        case "bootstrap": {
            const workspaces = { ...state.workspaces, [action.workspace.id]: action.workspace };
            const channels = { ...state.channels, ...byId(action.channels) };
            const all = Object.values(channels).filter((c) => c.workspaceId === action.workspace.id);
            const membersForWs = { ...(state.members[action.workspace.id] ?? {}) };
            for (const mbr of action.members)
                if (mbr.principal)
                    membersForWs[mbr.principal.id] = mbr;
            if (action.me?.principal)
                membersForWs[action.me.principal.id] = action.me;
            const readStates = { ...state.readStates };
            for (const rs of action.readStates)
                readStates[rs.channelId] = rs;
            const unreadNotificationCount = action.unreadNotificationCount === undefined
                ? state.unreadNotificationCount
                : {
                    ...state.unreadNotificationCount,
                    [action.workspace.id]: Math.max(0, action.unreadNotificationCount),
                };
            return {
                ...state,
                me: action.me?.principal ?? state.me,
                workspaces,
                channels,
                channelOrder: { ...state.channelOrder, [action.workspace.id]: orderChannels(all) },
                members: { ...state.members, [action.workspace.id]: membersForWs },
                readStates,
                unreadNotificationCount,
            };
        }
        case "workspaces/upsert":
            return { ...state, workspaces: { ...state.workspaces, ...byId(action.workspaces) } };
        case "members/upsert": {
            const cur = { ...(state.members[action.workspaceId] ?? {}) };
            for (const mbr of action.members)
                if (mbr.principal)
                    cur[mbr.principal.id] = mbr;
            return { ...state, members: { ...state.members, [action.workspaceId]: cur } };
        }
        case "channels/upsert": {
            if (action.channels.length === 0)
                return state;
            const channels = { ...state.channels, ...byId(action.channels) };
            const channelOrder = { ...state.channelOrder };
            for (const ws of new Set(action.channels.map((c) => c.workspaceId))) {
                channelOrder[ws] = orderChannels(Object.values(channels).filter((c) => c.workspaceId === ws));
            }
            return { ...state, channels, channelOrder };
        }
        case "channels/remove": {
            const ch = state.channels[action.channelId];
            if (!ch)
                return state;
            const channels = { ...state.channels };
            delete channels[action.channelId];
            const order = (state.channelOrder[ch.workspaceId] ?? []).filter((id) => id !== action.channelId);
            return { ...state, channels, channelOrder: { ...state.channelOrder, [ch.workspaceId]: order } };
        }
        case "messages/upsert": {
            let s = state;
            for (const m of action.messages) {
                if (m.deletedAt) {
                    s = removeMessage(s, m.id, m.channelId, m.threadRootId);
                    continue;
                }
                s = upsertMessage(s, m);
                s = bumpChannelSeq(s, m);
            }
            return s;
        }
        case "messages/created": {
            const m = action.message;
            // Echo of one of ours: reconcile the optimistic row.
            if (m.clientMsgId && state.pending[m.clientMsgId]) {
                return reduce(state, { type: "pending/resolve", clientMsgId: m.clientMsgId, message: m });
            }
            let s = upsertMessage(state, m);
            s = bumpChannelSeq(s, m);
            s = bumpReplyCount(s, m);
            return s;
        }
        case "messages/updated": {
            const m = action.message;
            if (m.deletedAt)
                return removeMessage(state, m.id, m.channelId, m.threadRootId);
            return upsertMessage(state, m);
        }
        case "messages/deleted":
            return removeMessage(state, action.messageId, action.channelId, action.threadRootId);
        case "reactions/added":
            return updateReaction(state, action.messageId, action.userId, action.emoji, true);
        case "reactions/removed":
            return updateReaction(state, action.messageId, action.userId, action.emoji, false);
        case "readStates/upsert": {
            const readStates = { ...state.readStates };
            for (const rs of action.readStates)
                readStates[rs.channelId] = rs;
            return { ...state, readStates };
        }
        case "readStates/updated": {
            if (state.me && action.userId && action.userId !== state.me.id)
                return state;
            if (action.threadRootId) {
                const seq = action.lastReadThreadSeq ?? 0n;
                const cur = state.threadReadStates[action.threadRootId] ?? 0n;
                if (seq <= cur)
                    return state;
                return { ...state, threadReadStates: { ...state.threadReadStates, [action.threadRootId]: seq } };
            }
            const prev = state.readStates[action.channelId];
            const next = create(ChannelReadStateSchema, {
                channelId: action.channelId,
                lastReadSeq: action.lastReadSeq,
                mentionCount: 0,
                muted: prev?.muted ?? false,
                starred: prev?.starred ?? false,
            });
            if (prev && prev.lastReadSeq >= next.lastReadSeq && prev.mentionCount === 0)
                return state;
            return { ...state, readStates: { ...state.readStates, [action.channelId]: next } };
        }
        case "membership/changed": {
            const ch = state.channels[action.channelId];
            if (!ch)
                return state;
            const memberIds = action.joined
                ? ch.memberIds.includes(action.userId)
                    ? ch.memberIds
                    : [...ch.memberIds, action.userId]
                : ch.memberIds.filter((u) => u !== action.userId);
            const memberCount = Math.max(0, ch.memberCount + (action.joined ? 1 : -1));
            const next = { ...ch, memberIds, memberCount };
            let s = { ...state, channels: { ...state.channels, [ch.id]: next } };
            if (state.me && action.userId === state.me.id && !action.joined) {
                s = reduce(s, { type: "channels/remove", channelId: ch.id });
            }
            return s;
        }
        case "presence/changed":
            return { ...state, presence: { ...state.presence, [action.presence.userId]: action.presence } };
        case "presence/upsert": {
            const presence = { ...state.presence };
            for (const p of action.presences)
                presence[p.userId] = p;
            return { ...state, presence };
        }
        case "presence/remove": {
            if (!state.presence[action.userId])
                return state;
            const presence = { ...state.presence };
            delete presence[action.userId];
            return { ...state, presence };
        }
        case "typing": {
            const key = typingKey(action.typing.channelId, action.typing.threadRootId);
            if (state.me && action.typing.userId === state.me.id)
                return state;
            const cur = { ...(state.typing[key] ?? {}), [action.typing.userId]: action.now + TYPING_TTL_MS };
            return { ...state, typing: { ...state.typing, [key]: cur } };
        }
        case "typing/expire": {
            let changed = false;
            const typing = {};
            for (const [key, users] of Object.entries(state.typing)) {
                const live = {};
                for (const [u, exp] of Object.entries(users)) {
                    if (exp > action.now)
                        live[u] = exp;
                    else
                        changed = true;
                }
                if (Object.keys(live).length > 0)
                    typing[key] = live;
                else
                    changed = true;
            }
            return changed ? { ...state, typing } : state;
        }
        case "agentStatus": {
            const key = action.status.threadRootId || action.status.channelId;
            if (action.status.status === "") {
                if (!state.agentStatus[key] && !state.agentStatusByThread[key])
                    return state;
                const agentStatus = { ...state.agentStatus };
                const agentStatusByThread = { ...state.agentStatusByThread };
                delete agentStatus[key];
                delete agentStatusByThread[key];
                return { ...state, agentStatus, agentStatusByThread };
            }
            const now = action.now ?? Date.now();
            return {
                ...state,
                agentStatus: { ...state.agentStatus, [key]: action.status },
                agentStatusByThread: {
                    ...state.agentStatusByThread,
                    [key]: { status: action.status, expiresAt: now + AGENT_STATUS_TTL_MS },
                },
            };
        }
        case "agentStatus/expire": {
            let changed = false;
            const agentStatusByThread = {};
            const agentStatus = { ...state.agentStatus };
            for (const [key, entry] of Object.entries(state.agentStatusByThread)) {
                if (entry.expiresAt > action.now)
                    agentStatusByThread[key] = entry;
                else {
                    changed = true;
                    delete agentStatus[key];
                }
            }
            return changed ? { ...state, agentStatus, agentStatusByThread } : state;
        }
        case "notifications/upsert": {
            const ws = action.workspaceId;
            const notifications = { ...state.notifications };
            for (const n of action.notifications)
                notifications[n.id] = n;
            const ids = orderNotifications([...(state.notificationIds[ws] ?? []), ...action.notifications.map((n) => n.id)], notifications);
            const unreadNotificationCount = action.unreadCount === undefined
                ? state.unreadNotificationCount
                : { ...state.unreadNotificationCount, [ws]: Math.max(0, action.unreadCount) };
            return {
                ...state,
                notifications,
                notificationIds: { ...state.notificationIds, [ws]: ids },
                unreadNotificationCount,
            };
        }
        case "notifications/created": {
            const ev = action.event;
            if (state.notifications[ev.notificationId])
                return state;
            const ws = action.workspaceId;
            const n = create(NotificationSchema, {
                id: ev.notificationId,
                workspaceId: ws,
                userId: state.me?.id ?? "",
                kind: ev.kind,
                messageId: ev.messageId,
                channelId: ev.channelId,
                actorId: ev.actorId,
                createdAt: action.occurredAt ?? timestampFromMs(Date.now()),
            });
            const notifications = { ...state.notifications, [n.id]: n };
            return {
                ...state,
                notifications,
                notificationIds: {
                    ...state.notificationIds,
                    [ws]: orderNotifications([n.id, ...(state.notificationIds[ws] ?? [])], notifications),
                },
                unreadNotificationCount: {
                    ...state.unreadNotificationCount,
                    [ws]: (state.unreadNotificationCount[ws] ?? 0) + 1,
                },
            };
        }
        case "notifications/read": {
            const ws = action.workspaceId;
            const notifications = { ...state.notifications };
            const all = action.notificationIds.length === 0;
            const targets = all ? (state.notificationIds[ws] ?? []) : action.notificationIds;
            let flipped = 0;
            for (const id of targets) {
                const n = notifications[id];
                if (n && isUnread(n)) {
                    notifications[id] = { ...n, readAt: action.readAt };
                    flipped++;
                }
            }
            // Ids we have not loaded still count against the badge; "all read" zeroes it.
            const unknown = all ? 0 : action.notificationIds.filter((id) => !state.notifications[id]).length;
            const count = all ? 0 : Math.max(0, (state.unreadNotificationCount[ws] ?? 0) - flipped - unknown);
            if (flipped === 0 && count === (state.unreadNotificationCount[ws] ?? 0))
                return state;
            return {
                ...state,
                notifications,
                unreadNotificationCount: { ...state.unreadNotificationCount, [ws]: count },
            };
        }
        case "notifications/restore": {
            const notifications = { ...state.notifications };
            for (const n of action.notifications)
                notifications[n.id] = n;
            return {
                ...state,
                notifications,
                unreadNotificationCount: {
                    ...state.unreadNotificationCount,
                    [action.workspaceId]: Math.max(0, action.unreadCount),
                },
            };
        }
        case "unreadNotificationCount/set": {
            const count = Math.max(0, action.count);
            if (state.unreadNotificationCount[action.workspaceId] === count)
                return state;
            return {
                ...state,
                unreadNotificationCount: { ...state.unreadNotificationCount, [action.workspaceId]: count },
            };
        }
        case "notificationPaging/set": {
            const key = notificationPagingKey(action.workspaceId, action.mode);
            const prev = state.notificationPaging[key] ?? {
                loading: false,
                loaded: false,
                hasMore: false,
                cursor: "",
            };
            return {
                ...state,
                notificationPaging: { ...state.notificationPaging, [key]: { ...prev, ...action.paging } },
            };
        }
        case "runs/upsert":
            return upsertRuns(state, action.runs);
        case "files/upsert": {
            if (action.files.length === 0)
                return state;
            return { ...state, filesById: { ...state.filesById, ...byId(action.files) } };
        }
        case "pending/add": {
            const m = action.message;
            const pending = {
                clientMsgId: m.clientMsgId,
                channelId: m.channelId,
                status: "sending",
                attempts: 0,
                createdAt: action.now,
            };
            const s = upsertMessage(state, m);
            return { ...s, pending: { ...s.pending, [m.clientMsgId]: pending } };
        }
        case "pending/failed": {
            const p = state.pending[action.clientMsgId];
            if (!p)
                return state;
            return {
                ...state,
                pending: { ...state.pending, [action.clientMsgId]: { ...p, status: "failed", error: action.error } },
            };
        }
        case "pending/retry": {
            const p = state.pending[action.clientMsgId];
            if (!p)
                return state;
            const next = { ...p, status: "sending", attempts: p.attempts + 1 };
            delete next.error;
            return { ...state, pending: { ...state.pending, [action.clientMsgId]: next } };
        }
        case "pending/resolve": {
            const p = state.pending[action.clientMsgId];
            // Optimistic rows use the client_msg_id as their temporary id.
            let s = p ? removeMessage(state, action.clientMsgId, p.channelId, "") : state;
            if (p) {
                const pending = { ...s.pending };
                delete pending[action.clientMsgId];
                s = { ...s, pending };
            }
            s = upsertMessage(s, action.message);
            s = bumpChannelSeq(s, action.message);
            s = bumpReplyCount(s, action.message);
            return s;
        }
        case "pending/discard": {
            const p = state.pending[action.clientMsgId];
            if (!p)
                return state;
            const s = removeMessage(state, action.clientMsgId, p.channelId, "");
            const pending = { ...s.pending };
            delete pending[action.clientMsgId];
            return { ...s, pending };
        }
        case "paging/set": {
            const prev = state.channelPaging[action.channelId] ?? {
                loading: false,
                loaded: false,
                hasMoreBefore: true,
                hasMoreAfter: false,
                oldestSeq: 0n,
            };
            return {
                ...state,
                channelPaging: { ...state.channelPaging, [action.channelId]: { ...prev, ...action.paging } },
            };
        }
        case "connection":
            return state.connection === action.state ? state : { ...state, connection: action.state };
        case "cursor": {
            const cur = action.cursor.toString();
            if (state.cursors[action.workspaceId] === cur)
                return state;
            return { ...state, cursors: { ...state.cursors, [action.workspaceId]: cur } };
        }
        case "cursors/reset":
            return { ...state, cursors: {} };
        case "hydrate":
            return { ...state, ...action.patch };
        default:
            return state;
    }
}
// ---------------------------------------------------------------- envelopes
const eventsRegistry = createRegistry(file_tank_events_v1_events);
/** Decode an envelope's Any payload into one of the tank.events.v1 messages (or an `UnknownEventPayload`). */
export function unpackEnvelope(env) {
    if (!env.payload)
        return undefined;
    const known = anyUnpack(env.payload, eventsRegistry);
    if (known)
        return known;
    return { $typeName: "unknown", typeUrl: env.payload.typeUrl, value: env.payload.value };
}
/** Reduce a gateway envelope into the store. Unknown payload types are ignored. */
export function envelopeToActions(env, now) {
    const payload = unpackEnvelope(env);
    if (!payload)
        return [];
    switch (payload.$typeName) {
        case "tank.events.v1.MessageCreated":
            return payload.message ? [{ type: "messages/created", message: payload.message }] : [];
        case "tank.events.v1.MessageUpdated":
            return payload.message ? [{ type: "messages/updated", message: payload.message }] : [];
        case "tank.events.v1.MessageDeleted":
            return [
                {
                    type: "messages/deleted",
                    messageId: payload.messageId,
                    channelId: payload.channelId,
                    threadRootId: payload.threadRootId,
                },
            ];
        case "tank.events.v1.ReactionAdded":
            return [
                {
                    type: "reactions/added",
                    messageId: payload.messageId,
                    userId: payload.userId,
                    emoji: payload.emoji,
                },
            ];
        case "tank.events.v1.ReactionRemoved":
            return [
                {
                    type: "reactions/removed",
                    messageId: payload.messageId,
                    userId: payload.userId,
                    emoji: payload.emoji,
                },
            ];
        case "tank.events.v1.ReadStateUpdated":
            return [
                {
                    type: "readStates/updated",
                    channelId: payload.channelId,
                    lastReadSeq: payload.lastReadSeq,
                    userId: payload.userId,
                    ...(payload.threadRootId
                        ? { threadRootId: payload.threadRootId, lastReadThreadSeq: payload.lastReadThreadSeq }
                        : {}),
                },
            ];
        case "tank.events.v1.ChannelMembershipChanged":
            return [
                {
                    type: "membership/changed",
                    channelId: payload.channelId,
                    userId: payload.userId,
                    joined: payload.joined,
                },
            ];
        case "tank.events.v1.PresenceChanged":
            return payload.presence ? [{ type: "presence/changed", presence: payload.presence }] : [];
        case "tank.events.v1.Typing":
            return [{ type: "typing", typing: payload, now }];
        case "tank.events.v1.AgentStatus":
            return [{ type: "agentStatus", status: payload, now }];
        case "tank.events.v1.AgentRunUpdated":
            return payload.run ? [{ type: "runs/upsert", runs: [payload.run] }] : [];
        case "tank.events.v1.FileReady":
            return payload.file ? [{ type: "files/upsert", files: [payload.file] }] : [];
        case "tank.events.v1.NotificationCreated":
            return [
                {
                    type: "notifications/created",
                    workspaceId: env.workspaceId,
                    event: payload,
                    ...(env.occurredAt ? { occurredAt: env.occurredAt } : {}),
                },
            ];
        case "tank.events.v1.NotificationsRead":
            return [
                {
                    type: "notifications/read",
                    workspaceId: env.workspaceId,
                    notificationIds: payload.notificationIds,
                    readAt: env.occurredAt ?? timestampFromMs(now),
                },
            ];
        // ChannelUpdated carries only an id: the client refetches (see TankClient).
        // CardAction / AppCommand are for apps; MessageEphemeral is surfaced by apps that want it.
        default:
            return [];
    }
}
function shallowEqualArrays(a, b) {
    if (a === b)
        return true;
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; i++)
        if (a[i] !== b[i])
            return false;
    return true;
}
/**
 * Holds the state, notifies subscribers synchronously after each dispatch, and
 * memoizes derived views so `useSyncExternalStore` selectors return stable
 * references when nothing they depend on changed.
 */
export class TankStore {
    state;
    listeners = new Set();
    memo = new Map();
    constructor(state = initialState()) {
        this.state = state;
    }
    getState = () => this.state;
    subscribe = (listener) => {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    };
    dispatch(action) {
        const next = reduce(this.state, action);
        if (next === this.state)
            return;
        this.state = next;
        for (const l of Array.from(this.listeners))
            l();
    }
    applyEnvelope(env, now = Date.now()) {
        for (const a of envelopeToActions(env, now))
            this.dispatch(a);
    }
    /** Cache keyed by name+args; recomputes only when `deps` change; keeps the old array when contents are identical. */
    memoize(key, deps, compute, equal) {
        const hit = this.memo.get(key);
        if (hit && hit.deps.length === deps.length && hit.deps.every((d, i) => d === deps[i]))
            return hit.value;
        const value = compute();
        if (hit && equal?.(hit.value, value)) {
            this.memo.set(key, { deps, value: hit.value });
            return hit.value;
        }
        this.memo.set(key, { deps, value });
        return value;
    }
    selectChannelMessages = (channelId) => {
        const s = this.state;
        const ids = s.messageIdsByChannel[channelId] ?? EMPTY_IDS;
        return this.memoize(`msgs:${channelId}`, [ids, s.messages], () => ids.map((id) => s.messages[id]).filter((m) => m !== undefined), shallowEqualArrays);
    };
    selectThread = (rootId) => {
        const s = this.state;
        const ids = s.threadIds[rootId] ?? EMPTY_IDS;
        const root = s.messages[rootId];
        return this.memoize(`thread:${rootId}`, [ids, s.messages], () => ({ root, replies: ids.map((id) => s.messages[id]).filter((m) => m !== undefined) }), (a, b) => a.root === b.root && shallowEqualArrays(a.replies, b.replies));
    };
    selectChannels = (workspaceId) => {
        const s = this.state;
        const order = s.channelOrder[workspaceId] ?? EMPTY_IDS;
        return this.memoize(`channels:${workspaceId}`, [order, s.channels], () => order.map((id) => s.channels[id]).filter((c) => c !== undefined), shallowEqualArrays);
    };
    /**
     * Unread replies in a thread: the root's reply_count (or the newest loaded
     * reply's thread_seq) minus my last read thread_seq. 0 when the root is unknown.
     */
    selectThreadUnread = (rootId) => {
        const s = this.state;
        return threadUnread(s, rootId);
    };
    /**
     * Channel unreads (total/mentions/byChannel) plus thread unreads counted
     * separately. Threads counted: every root with a known thread read state, and
     * every loaded root I authored or replied in (`followedThreads`).
     */
    selectUnreads = (workspaceId) => {
        const s = this.state;
        const order = s.channelOrder[workspaceId] ?? EMPTY_IDS;
        return this.memoize(`unreads:${workspaceId}`, [order, s.channels, s.readStates, s.threadReadStates, s.messages, s.me], () => {
            const byChannel = {};
            let total = 0;
            let mentions = 0;
            for (const id of order) {
                const ch = s.channels[id];
                if (!ch)
                    continue;
                const rs = s.readStates[id];
                const unread = rs?.muted ? 0 : Math.max(0, Number(ch.lastSeq - (rs?.lastReadSeq ?? 0n)));
                const m = rs?.mentionCount ?? 0;
                if (unread > 0 || m > 0)
                    byChannel[id] = { unread, mentions: m };
                total += unread;
                mentions += m;
            }
            const byThread = {};
            let threads = 0;
            for (const rootId of followedThreads(s, workspaceId)) {
                const n = threadUnread(s, rootId);
                if (n > 0) {
                    byThread[rootId] = n;
                    threads += n;
                }
            }
            return { total, mentions, byChannel, threads, byThread };
        }, (a, b) => a.total === b.total &&
            a.mentions === b.mentions &&
            a.threads === b.threads &&
            shallowEqualRecords(a.byThread, b.byThread) &&
            shallowEqualRecords(a.byChannel, b.byChannel, (x, y) => x.unread === y.unread && x.mentions === y.mentions));
    };
    selectTyping = (channelId, threadRootId = "") => {
        const users = this.state.typing[typingKey(channelId, threadRootId)] ?? EMPTY_MAP;
        return this.memoize(`typing:${typingKey(channelId, threadRootId)}`, [users], () => Object.keys(users), shallowEqualArrays);
    };
    /** A workspace's notifications newest first; `unreadOnly` keeps only rows without `read_at`. */
    selectNotifications = (workspaceId, unreadOnly = false) => {
        const s = this.state;
        const ids = s.notificationIds[workspaceId] ?? EMPTY_IDS;
        return this.memoize(`notifications:${workspaceId}:${unreadOnly ? "unread" : "all"}`, [ids, s.notifications], () => ids
            .map((id) => s.notifications[id])
            .filter((n) => n !== undefined && (!unreadOnly || n.readAt === undefined)), shallowEqualArrays);
    };
    /** Runs in a workspace, newest first (by started_at). */
    selectRuns = (workspaceId) => {
        const s = this.state;
        return this.memoize(`runs:${workspaceId}`, [s.runsById], () => Object.values(s.runsById)
            .filter((r) => r.workspaceId === workspaceId)
            .sort((a, b) => tsMs(b.startedAt) - tsMs(a.startedAt)), shallowEqualArrays);
    };
    /** The live `agent_status` frame for a thread root id (or a channel id, for channel-level frames). */
    selectAgentStatus = (key) => this.state.agentStatusByThread[key]?.status;
    /** Every live `agent_status` frame in a channel (channel-level and per-thread). */
    selectAgentStatuses = (channelId) => {
        const s = this.state;
        return this.memoize(`agentStatuses:${channelId}`, [s.agentStatusByThread], () => Object.values(s.agentStatusByThread)
            .map((e) => e.status)
            .filter((f) => f.channelId === channelId), shallowEqualArrays);
    };
    /** The `File`s a message references that the store knows about (from uploads and `file.ready`). */
    selectMessageFiles = (messageId) => {
        const s = this.state;
        const ids = s.messages[messageId]?.fileIds ?? EMPTY_IDS;
        return this.memoize(`files:${messageId}`, [ids, s.filesById], () => ids.map((id) => s.filesById[id]).filter((f) => f !== undefined), shallowEqualArrays);
    };
    selectPresence = (userIds) => {
        const s = this.state;
        return this.memoize(`presence:${userIds.join(",")}`, [s.presence, userIds.join(",")], () => {
            const out = {};
            for (const id of userIds) {
                const p = s.presence[id];
                if (p)
                    out[id] = p;
            }
            return out;
        }, (a, b) => {
            const ak = Object.keys(a);
            const bk = Object.keys(b);
            return ak.length === bk.length && ak.every((k) => a[k] === b[k]);
        });
    };
}
const EMPTY_IDS = [];
const EMPTY_MAP = {};
function shallowEqualRecords(a, b, eq = (x, y) => x === y) {
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    return ak.length === bk.length && ak.every((k) => k in b && eq(a[k], b[k]));
}
function threadUnread(s, rootId) {
    const root = s.messages[rootId];
    const replies = s.threadIds[rootId];
    let newest = root ? BigInt(root.replyCount) : 0n;
    if (replies?.length) {
        const last = s.messages[replies[replies.length - 1]];
        if (last && last.threadSeq > newest)
            newest = last.threadSeq;
    }
    if (newest === 0n)
        return 0;
    return Math.max(0, Number(newest - (s.threadReadStates[rootId] ?? 0n)));
}
/** Roots with a known thread read state plus loaded roots I participate in, scoped to one workspace. */
function followedThreads(s, workspaceId) {
    const out = new Set();
    const me = s.me?.id;
    for (const rootId of Object.keys(s.threadReadStates)) {
        const root = s.messages[rootId];
        if (!root || root.workspaceId === workspaceId)
            out.add(rootId);
    }
    if (me) {
        for (const m of Object.values(s.messages)) {
            if (m.workspaceId !== workspaceId || m.replyCount === 0 || m.threadRootId !== "")
                continue;
            if (m.authorId === me || m.replyUserIds.includes(me))
                out.add(m.id);
        }
    }
    return Array.from(out);
}
