import { MessageKind } from "../contracts/tank/message/v1/message_pb.js";
/**
 * What the composer recalls on ↑: your own messages where you are typing, newest first.
 *
 * Only real messages, not system lines or agent events; nothing deleted; nothing empty
 * (a picture with no words has nothing to re-send as text); and a message repeated
 * back to back counts once, so ↑ ↑ does not show the same text twice.
 */
export function recentOwn(messages, meId, limit = 20) {
    if (!meId)
        return [];
    const out = [];
    for (let i = messages.length - 1; i >= 0 && out.length < limit; i--) {
        const m = messages[i];
        if (m.authorId !== meId || m.kind !== MessageKind.MESSAGE || m.deletedAt || !m.text.trim())
            continue;
        if (out.length > 0 && out[out.length - 1].text === m.text)
            continue;
        out.push(m);
    }
    return out;
}
