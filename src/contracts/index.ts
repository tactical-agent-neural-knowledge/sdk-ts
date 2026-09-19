// Namespaced barrel over the vendored contracts so same-named messages in
// different packages never collide (e.g. SetStatusRequest in presence and agent).
// Vendored from tactical-agent-neural-knowledge/contracts at the sha in ./VERSION
// by scripts/sync-contracts.sh.

export * as agent from "./tank/agent/v1/agent_pb.js";
export * as auth from "./tank/auth/v1/auth_pb.js";
export * as blocks from "./tank/blocks/v1/blocks_pb.js";
export * as channel from "./tank/channel/v1/channel_pb.js";
export * as events from "./tank/events/v1/events_pb.js";
export * as files from "./tank/files/v1/files_pb.js";
export * as huddle from "./tank/huddle/v1/huddle_pb.js";
export * as message from "./tank/message/v1/message_pb.js";
export * as notification from "./tank/notification/v1/notification_pb.js";
export * as presence from "./tank/presence/v1/presence_pb.js";
export * as realtime from "./tank/realtime/v1/realtime_pb.js";
export * as richtext from "./tank/richtext/v1/richtext_pb.js";
export * as search from "./tank/search/v1/search_pb.js";
export * as workspace from "./tank/workspace/v1/workspace_pb.js";
