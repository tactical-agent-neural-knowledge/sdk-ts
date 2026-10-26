import { create } from "@bufbuild/protobuf";
import { createRouterTransport } from "@connectrpc/connect";
import { describe, expect, it } from "vitest";
import { PrincipalSchema } from "../contracts/tank/auth/v1/auth_pb.js";
import { ChannelSchema } from "../contracts/tank/channel/v1/channel_pb.js";
import { MessageSchema } from "../contracts/tank/message/v1/message_pb.js";
import { RichTextSchema } from "../contracts/tank/richtext/v1/richtext_pb.js";
import {
  type ListMembersRequest,
  MemberSchema,
  WorkspaceService,
} from "../contracts/tank/workspace/v1/workspace_pb.js";
import { createTankClient } from "./client.js";

const until = async (pred: () => boolean) => {
  for (let i = 0; i < 200 && !pred(); i++) await new Promise((r) => setTimeout(r, 5));
};

// 2026-10-25: Mike mentioned a crew agent made a minute earlier and the phone showed
// "@2114522309032153088": the member list predated the agent. A message naming someone the
// store has never loaded asks for them, once.
describe("members a message names", () => {
  it("are loaded when the store has never seen them, each once", async () => {
    const asked: ListMembersRequest[] = [];
    const transport = createRouterTransport(({ service }) => {
      service(WorkspaceService, {
        listMembers: (req: ListMembersRequest) => {
          asked.push(req);
          return {
            members: req.userIds
              .filter((id: string) => id !== "gone")
              .map((id) =>
                create(MemberSchema, {
                  principal: create(PrincipalSchema, { id, displayName: `name-${id}` }),
                }),
              ),
          };
        },
      } as never);
    });
    const c = createTankClient({ baseUrl: "http://unused", wsUrl: "ws://unused", auth: "cookie", transport });
    c.store.dispatch({
      type: "channels/upsert",
      channels: [create(ChannelSchema, { id: "c1", workspaceId: "ws1" })],
    });
    const rich = create(RichTextSchema, {
      blocks: [
        {
          kind: {
            case: "section",
            value: { elements: [{ kind: { case: "user", value: { userId: "sales" } } }] },
          },
        },
      ],
    } as never);
    const msg = (id: string) =>
      create(MessageSchema, { id, channelId: "c1", authorId: "mike", mentionIds: ["gone"], richText: rich });
    c.store.dispatch({ type: "messages/created", message: msg("m1") });
    c.store.dispatch({ type: "messages/created", message: msg("m2") });
    await until(() => !!c.store.getState().members.ws1?.sales);
    expect(c.store.getState().members.ws1?.sales?.principal?.displayName).toBe("name-sales");
    expect(c.store.getState().members.ws1?.mike).toBeTruthy();
    expect(asked).toHaveLength(1);
    expect([...asked[0]!.userIds].sort()).toEqual(["gone", "mike", "sales"]);
    // A known member and an id that is no member are not asked for again.
    c.store.dispatch({ type: "messages/created", message: msg("m3") });
    await new Promise((r) => setTimeout(r, 80));
    expect(asked).toHaveLength(1);
  });
});
