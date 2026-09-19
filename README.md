# @tactical-agent-neural-knowledge/sdk

The TANK TypeScript SDK: typed Connect clients for every API service, the realtime gateway client, a normalized
message store with an optimistic outbox, React hooks, the brand design tokens (MUI + Paper themes), and the
`blocks` card model with its MUI renderer.

One package, ESM only, TypeScript 5.9 strict. `dist/` is committed so it installs straight from git.

## Install

No registry, no token. Pin a commit:

```sh
pnpm add "github:tactical-agent-neural-knowledge/sdk-ts#<sha>"
```

Peer dependencies (only for the subpaths that need them): `react` ^19, `react-dom` ^19 (`./react`, `./blocks-web`),
`@mui/material` ^7 + `@emotion/react` + `@emotion/styled` (`./blocks-web`), and `react-native` + `react-native-paper` ^5
(`./blocks-native` only; nothing else in the package imports them).

Every subpath's `exports` entry carries `types`, `import` and `default` (the same ESM files), so CommonJS-style
resolvers (Jest, `jest-expo`, Metro) find `…/sdk/react`, `…/sdk/contracts/message` etc. without a
`moduleNameMapper`; `src/exports.test.ts` proves it with a real `require.resolve`.

| Subpath | What |
|---|---|
| `@tactical-agent-neural-knowledge/sdk` | `createTankClient`, `RealtimeClient`, `TankStore`, storage adapters, `uuidv7` |
| `…/sdk/react` | `TankProvider` and hooks |
| `…/sdk/design` | brand tokens, `muiThemeOptions`, `paperTheme`, contrast helpers, `fonts` / `googleFontsUrl` / `expoGoogleFontsPackages` |
| `…/sdk/blocks` | block types, builders, `normalizeBlocks`, `validateBlocks`, rich-text helpers, `runTone` / `runStateLabel` |
| `…/sdk/blocks-web` | `<BlocksView>` and per-block MUI components, `tankTheme` |
| `…/sdk/blocks-native` | `<BlocksViewNative>` and per-block react-native-paper components (same tones as web) |
| `…/sdk/contracts` | namespaced barrel of the generated protobuf/Connect code (`message.ChatService`, …) |
| `…/sdk/contracts/<pkg>` | one generated package, e.g. `…/contracts/message` |
| `…/sdk/fixtures/<name>.json` | golden block cards (plan, diff, ci-green, ci-red, approval, tool-log, status, file) |

## Client

```ts
import { createTankClient, IndexedDbStorage } from "@tactical-agent-neural-knowledge/sdk";
import { ChannelType } from "@tactical-agent-neural-knowledge/sdk/contracts/channel";

const tank = createTankClient({
  baseUrl: "https://api.tank.chat",
  wsUrl: "wss://gw.tank.chat",
  auth: "cookie", // web; mobile passes { bearer: async () => token }
  storage: new IndexedDbStorage({ name: `tank-${userId}` }),
});

await tank.bootstrap(workspaceId); // GetBootstrap → store
await tank.start(); // hydrate from storage, open the gateway, flush the outbox

tank.viewChannel(channelId); // subscribe + focus
await tank.loadChannel(channelId); // ListMessages (older pages on repeat)
await tank.sendMessage({ channelId, text: "hello" }); // optimistic, persisted, reconciled on echo
await tank.markRead(channelId); // channel read up to its newest seq
await tank.markThreadRead(rootId); // thread read up to its newest reply (sends thread_root_id + thread_seq only)

// Every helper calls the service and updates the store optimistically, rolling back if the RPC fails,
// so apps never dispatch raw store actions.
await tank.updateMessage(messageId, { text: "edited" }); // also richText / blocks / metadata
await tank.deleteMessage(messageId);
await tank.addReaction(messageId, "👍");
const channel = await tank.createChannel({ workspaceId, name: "ops", type: ChannelType.PRIVATE, memberIds });
await tank.joinChannel(channelId);
await tank.leaveChannel(channelId);
await tank.setGoal(channelId, { goal: "Ship rate limiting", assigneeIds: [meId] });
const inviteId = await tank.invite(workspaceId, "ada@example.com", "admin"); // or Role.ADMIN
await tank.setStatus({ workspaceId, status: PresenceStatus.DND, customText: "heads down", expiresAt: Date.now() + 3600e3 });

// notifications (NotificationService): pages land in the store; the badge is seeded from GetBootstrap
const { hasMore, nextCursor } = await tank.loadNotifications({ workspaceId, unreadOnly: true });
await tank.loadNotifications({ workspaceId, unreadOnly: true, cursor: nextCursor }); // next page
await tank.markNotificationsRead(workspaceId, [notificationId]); // no ids = every unread one; optimistic
await tank.markNotificationsRead(workspaceId);

// agent runs (AgentService): `runsById` / `runsByThread`, kept live by agent.run.updated events
await tank.listRuns({ workspaceId, channelId }); // or { threadRootId }, cursor, limit
const run = await tank.getRun(runId);

// files (FilesService): CreateUpload → PUT (XHR with progress when available, multipart when returned) → CompleteUpload
const file = await tank.uploadFile(blob, { workspaceId, channelId, onProgress: (sent, total) => {} }); // RN: { uri, name, mime, size }
await tank.sendMessage({ channelId, text: "see attached", fileIds: [file.id] });
const url = await tank.getDownloadUrl(file.id); // memoized for 10 minutes

// raw services are there too: tank.auth, tank.workspaces, tank.channels, tank.chat, tank.presence, tank.files,
// tank.agents (alias tank.agent), tank.notifications
```

`markRead(channelId, seq?, threadRootId?, threadSeq?)` keeps its old signature; with a `threadRootId` it now delegates
to `markThreadRead` and sends `seq: 0` unless you pass one explicitly, so a thread read no longer moves the channel's
read seq.

### Client IDs (`uuidv7`) and `crypto.getRandomValues`

`client_msg_id`s are UUIDv7 and need `crypto.getRandomValues`. Browsers and Node have it; React Native does not until
you polyfill it. Either install the polyfill once at the app entry:

```ts
// app entry (before anything imports the SDK)
import "react-native-get-random-values"; // or: import { getRandomValues } from "expo-crypto"; globalThis.crypto = { getRandomValues };
```

or inject a source of random bytes and skip the global entirely:

```ts
import * as Crypto from "expo-crypto";

const tank = createTankClient({
  // …
  randomBytes: (n) => Crypto.getRandomBytes(n),
});
```

`uuidv7(now?, randomBytes?)` takes the same function directly.

### Realtime and reconnects

`tank.realtime` speaks binary `tank.realtime.v1` frames on `${wsUrl}/v1`: Hello with a gateway token minted through
`AuthService.MintGatewayToken`, or Resume with the persisted session + per-workspace cursors; heartbeat every 25 s (or
the server's interval); full-jitter reconnect 250 ms → 30 s with an immediate retry when the app comes back online;
strict per-workspace cursor ordering with a 500 ms gap buffer, after which the client Resumes so the server replays.

The "back online" signal is injectable. The default listens to `globalThis.addEventListener("online")` when it exists
and is a no-op otherwise (Node, React Native). Mobile wires NetInfo, and anything can call `retryNow()` directly:

```ts
import NetInfo from "@react-native-community/netinfo";

const tank = createTankClient({
  // …
  realtime: {
    onlineSignal: (retry) => NetInfo.addEventListener((s) => s.isConnected && retry()), // returns the unsubscribe
  },
});

tank.realtime.retryNow(); // skip the pending backoff, e.g. on app foreground
```

`tank.store` is a plain normalized store (`workspaces, members, channels, channelOrder, messages,
messageIdsByChannel, threadIds, channelPaging, readStates, threadReadStates, presence, typing, agentStatus,
agentStatusByThread, pending, connection, cursors, notifications, notificationIds, unreadNotificationCount,
notificationPaging, runsById, runsByThread, filesById`) with memoized selectors (`selectChannelMessages, selectThread,
selectChannels, selectUnreads, selectThreadUnread, selectTyping, selectPresence, selectNotifications, selectRuns,
selectAgentStatus, selectAgentStatuses, selectMessageFiles`) that return stable references, so it plugs into
`useSyncExternalStore` directly. `threadReadStates` (thread root id → my last read `thread_seq`) is fed by
`ReadStateUpdated` events and `markThreadRead`.

The store owns notifications, agent runs and files, so apps never keep side stores for them:

- `notifications` (by id) + `notificationIds[workspaceId]` (newest first) + `unreadNotificationCount[workspaceId]`,
  seeded from `GetBootstrap.unread_notification_count`, paged by `loadNotifications`, kept live by
  `notification.created` (+1, row prepended) and `notifications.read` (rows flip, count drops; no ids = zero).
- `runsById` + `runsByThread` (newest run per thread root; a run's own update always wins), fed by
  `agent.run.updated` events, `listRuns` and `getRun`.
- `agentStatusByThread` (thread root id or channel id → the latest `agent_status` frame), each frame dropped
  30 s after arrival (`AGENT_STATUS_TTL_MS`) or on an empty status. `agentStatus` mirrors it for older code.
- `filesById`, fed by `file.ready` events and upload responses; `selectMessageFiles(messageId)` follows a message's
  `file_ids`. (`FilesService` has no `GetFile`, so files seen neither way stay unknown.)

### Event payloads

`unpackEnvelope(env)` returns an `EventPayload`: every `tank.events.v1` message the vendored contracts know
(`MessageCreated … NotificationCreated, NotificationsRead, AgentRunUpdated, FileReady, MessageEphemeral`) or, for a
type this build does not know, `{ $typeName: "unknown", typeUrl, value }`. The fallback's literal `$typeName`
keeps a `switch (payload.$typeName)` narrowing every known case (and exhaustive over `default`), which an open
`{ $typeName: string }` member cannot do in TypeScript.

## React

```tsx
import { TankProvider, useMessages, useUnreads, useConnectionState } from "@tactical-agent-neural-knowledge/sdk/react";

<TankProvider client={tank}>
  <Tread channelId={id} />
</TankProvider>;

function Tread({ channelId }: { channelId: string }) {
  const { messages, loading, hasMoreBefore, loadOlder } = useMessages(channelId);
  const unreads = useUnreads(workspaceId); // { total, mentions, byChannel, threads, byThread }
  const threadUnread = useThreadUnread(rootId);
  const connection = useConnectionState();
  // …
}
```

Hooks:

| Hook | Returns |
|---|---|
| `useTank()` | the `TankClient` |
| `useWorkspace(id)`, `useChannels(workspaceId)`, `useChannel(id)` | store rows |
| `useMessages(channelId, { view?, pageSize? })` | `{ messages, loading, hasMoreBefore, loadOlder }` |
| `useThread(rootId, { view? })` | `{ root, replies }` |
| `useUnreads(workspaceId)`, `useThreadUnread(rootId)` | unread counts |
| `usePresence(userIds)`, `useTyping(channelId, threadRootId?)`, `useConnectionState()` | live state |
| `useNotifications(workspaceId, { unreadOnly?, load?, pageSize? })` | `{ notifications, loading, hasMore, loadMore, markRead }` (first page loads on mount) |
| `useUnreadNotificationCount(workspaceId)` | the badge |
| `useRun(runId)`, `useThreadRun(rootId)` | a `Run`, fetched via `GetRun` / `ListRuns` when the store has none |
| `useRuns(workspaceId)`, `useRunsByThread()` | runs newest first / the thread → run map |
| `useAgentStatus(threadRootId \| channelId)`, `useAgentStatuses(channelId)` | live `agent_status` frames (30 s expiry) |
| `useFile(fileId)`, `useMessageFiles(messageId)` | `File`s from `filesById` |
| `useTankSelector(select)` | any memoized selector |

`useMessages` loads the first page on mount; `loading` is true while any page is in flight and `hasMoreBefore` is
`false` until that first page has landed (then it reflects the server's `has_more`), so a "load older" affordance never
shows before there is anything to page. `useUnreads` counts channel unreads in `total` and thread unreads separately
in `threads` / `byThread` (threads with a known read state plus loaded threads you authored or replied in).

`./react` also re-exports `TankStore`, `TankState`, `PendingMessage`, `ConnectionState`, `ChannelPaging`,
`NotificationPaging`, `ThreadView` and `Unreads`, so a hooks-only import site does not need the root subpath for types.

## Design

```ts
import { createTheme } from "@mui/material/styles";
import { muiThemeOptions, paperTheme, brand, vocabulary } from "@tactical-agent-neural-knowledge/sdk/design";

const theme = createTheme(muiThemeOptions); // dark by default, light scheme included, CSS variables on
// react-native-paper: { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors, ...paperTheme.colors } }
```

Tokens: Neural Neon Cyan `#00E5FF` (primary; AI, active context), Cybernetic Purple `#6200EA` (secondary; agent
executions), Armor Slate Gray `#263238`, Deep Abyss Black `#0D1117`, Industrial Amber `#FFC107` (alerts, Armor Mode).
Space Grotesk for display, JetBrains Mono for code. Every text/background pair the themes use is asserted WCAG AA in
`src/design/contrast.test.ts`.

### Fonts

No font binaries ship in this package. `…/sdk/design` exports what each platform needs to load them:

```ts
import { fonts, fontFamilies, googleFontsUrl, googleFontsLinkTag, expoGoogleFontsPackages } from "@tactical-agent-neural-knowledge/sdk/design";

// web: index.html
<link rel="stylesheet" href={googleFontsUrl} /> // or paste googleFontsLinkTag (preconnect + stylesheet)

// mobile: npx expo install @expo-google-fonts/space-grotesk @expo-google-fonts/jetbrains-mono  (= expoGoogleFontsPackages)
import { SpaceGrotesk_400Regular, SpaceGrotesk_700Bold } from "@expo-google-fonts/space-grotesk";
const [loaded] = useFonts({ SpaceGrotesk_400Regular, SpaceGrotesk_700Bold /* …fonts.display.expoFonts */ });
```

`fonts.display` / `fonts.code` give the family name, the weights both sources ship, the `@expo-google-fonts` package
and its per-weight export names (`fonts.display.expoFonts[700] === "SpaceGrotesk_700Bold"`); `fontFamilies` is
`{ display, body, code }`.

## Blocks

```tsx
import { blocks, header, planCard, actions, normalizeBlocks } from "@tactical-agent-neural-knowledge/sdk/blocks";
import { BlocksView, tankTheme } from "@tactical-agent-neural-knowledge/sdk/blocks-web";

const card = normalizeBlocks(
  blocks(
    header("Plan: add rate limiting"),
    planCard({ summary: "…", steps: [{ id: "s1", title: "Add limiter", status: "running" }] }),
    actions([{ actionId: "plan.approve", text: "Approve", style: "primary" }]),
  ),
);

<ThemeProvider theme={tankTheme}>
  <BlocksView blocks={message.blocks} onAction={(a) => tank.postBlockAction({ messageId: message.id, ...a })} />
</ThemeProvider>;
```

Builders exist for every kind (`header, section, context, divider, actions, planCard, diffPreview, ciStatus,
approvalPrompt, toolLog, statusCard, filePreview`). `normalizeBlocks` fills `block_id`s, truncates long strings and
caps arrays; `validateBlocks` reports what it cannot fix.

`./blocks` also carries the run-state tone shared by web and mobile chips: `runTone(state)` → `running` (purple) /
`awaiting` (amber) / `done` (green) / `failed` (red) / `cancelled` (grey), `runStateLabel(state)`,
`isTerminalRunState(state)`, and the palette slots `RUN_TONE_MUI_COLOR` / `RUN_TONE_PAPER_COLOR`.

### React Native

```tsx
import { BlocksViewNative } from "@tactical-agent-neural-knowledge/sdk/blocks-native";

<PaperProvider theme={darkTheme /* MD3DarkTheme + paperTheme.colors */}>
  <BlocksViewNative
    blocks={message.blocks}
    onAction={(a) => tank.postBlockAction({ messageId: message.id, ...a })}
    resolveUser={(id) => members[id]?.principal?.displayName}
    codeFontFamily="JetBrainsMono_400Regular" // default: fonts.code.expoFonts[400]
  />
</PaperProvider>;
```

Every block kind renders with react-native-paper (`Text`, `Button`, `Chip`, `ProgressBar`, `Divider`) plus core
`View` / `Image` / `Alert` / `Linking`, no DOM: cards get the same accent stripes as web (purple = agent execution,
cyan = AI/context, amber = needs a human), confirm buttons go through `Alert.alert`, links and URL buttons through
`openUrl` (default `Linking.openURL`). `react-native` and `react-native-paper` are optional peers used by this
subpath only; the tests render against host-element stand-ins with `react-test-renderer`.

## Develop

```sh
pnpm install
pnpm check                      # lint, typecheck, test, build, dist/ must be clean
pnpm sync-contracts <sha>       # re-vendor src/contracts from the contracts repo
UPDATE_FIXTURES=1 pnpm test     # regenerate fixtures/*.json from src/test/fixture-defs.ts
```

`dist/` is committed and CI fails when it is stale. Never edit `dist/` or `src/contracts/tank/` by hand.
`pnpm vitest run -u src/blocks-native` refreshes the native snapshots after a deliberate visual change.

## Cursors and ordering

`Event.cursor` is the JetStream stream sequence and exists only to `Resume` after a disconnect. The gateway delivers
only the events a socket is subscribed to, so cursor numbers skip; skips are normal and never trigger a Resume. The
client applies events monotonically per workspace and drops anything at or below the last applied cursor.
