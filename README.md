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

Peer dependencies (only for the subpaths that need them): `react` ^19, `react-dom` ^19 (`./react`, `./blocks-web`)
and `@mui/material` ^7 + `@emotion/react` + `@emotion/styled` (`./blocks-web`).

| Subpath | What |
|---|---|
| `@tactical-agent-neural-knowledge/sdk` | `createTankClient`, `RealtimeClient`, `TankStore`, storage adapters, `uuidv7` |
| `…/sdk/react` | `TankProvider` and hooks |
| `…/sdk/design` | brand tokens, `muiThemeOptions`, `paperTheme`, contrast helpers |
| `…/sdk/blocks` | block types, builders, `normalizeBlocks`, `validateBlocks`, rich-text helpers |
| `…/sdk/blocks-web` | `<BlocksView>` and per-block MUI components, `tankTheme` |
| `…/sdk/contracts` | namespaced barrel of the generated protobuf/Connect code (`message.ChatService`, …) |
| `…/sdk/contracts/<pkg>` | one generated package, e.g. `…/contracts/message` |
| `…/sdk/fixtures/<name>.json` | golden block cards (plan, diff, ci-green, ci-red, approval, tool-log, status, file) |

## Client

```ts
import { createTankClient, IndexedDbStorage } from "@tactical-agent-neural-knowledge/sdk";

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
await tank.markRead(channelId);

// raw services are there too
await tank.channels.setGoal({ channelId, goal: { goal: "Ship rate limiting", assigneeIds: [], pipelineStatus: "" } });
```

`tank.realtime` speaks binary `tank.realtime.v1` frames on `${wsUrl}/v1`: Hello with a gateway token minted through
`AuthService.MintGatewayToken`, or Resume with the persisted session + per-workspace cursors; heartbeat every 25 s (or
the server's interval); full-jitter reconnect 250 ms → 30 s with an immediate retry on the browser `online` event;
strict per-workspace cursor ordering with a 500 ms gap buffer, after which the client Resumes so the server replays.

`tank.store` is a plain normalized store (`workspaces, members, channels, channelOrder, messages,
messageIdsByChannel, threadIds, readStates, presence, typing, pending, cursors`) with memoized selectors that return
stable references, so it plugs into `useSyncExternalStore` directly.

## React

```tsx
import { TankProvider, useMessages, useUnreads, useConnectionState } from "@tactical-agent-neural-knowledge/sdk/react";

<TankProvider client={tank}>
  <Tread channelId={id} />
</TankProvider>;

function Tread({ channelId }: { channelId: string }) {
  const { messages, loadOlder, hasMoreBefore } = useMessages(channelId);
  const unreads = useUnreads(workspaceId);
  const connection = useConnectionState();
  // …
}
```

Hooks: `useTank, useWorkspace, useChannels, useChannel, useMessages, useThread, useUnreads, usePresence, useTyping,
useConnectionState, useTankSelector`.

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

## Develop

```sh
pnpm install
pnpm check                      # lint, typecheck, test, build, dist/ must be clean
pnpm sync-contracts <sha>       # re-vendor src/contracts from the contracts repo
UPDATE_FIXTURES=1 pnpm test     # regenerate fixtures/*.json from src/test/fixture-defs.ts
```

`dist/` is committed and CI fails when it is stale. Never edit `dist/` or `src/contracts/tank/` by hand.
