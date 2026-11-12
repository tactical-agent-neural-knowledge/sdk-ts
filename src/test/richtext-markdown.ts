import { create } from "@bufbuild/protobuf";
import { rt } from "../blocks/richtext.js";
import { type RichText, RichTextSchema, TableAlign } from "../contracts/tank/richtext/v1/richtext_pb.js";

const cell = (...elements: ReturnType<typeof rt.text>[]) => ({ elements });

/**
 * What the api makes of an agent's Markdown report: a heading, a table with a bold total row,
 * a rule and a paragraph. Shared by the web and native renderer tests.
 */
export const usageReport: RichText = create(RichTextSchema, {
  blocks: [
    { kind: { case: "heading", value: { level: 2, elements: [rt.text("Customer AI usage")] } } },
    {
      kind: {
        case: "table",
        value: {
          header: { cells: [cell(rt.text("Workspace")), cell(rt.text("Calls")), cell(rt.text("Charged"))] },
          align: [TableAlign.UNSPECIFIED, TableAlign.RIGHT, TableAlign.RIGHT],
          rows: [
            { cells: [cell(rt.text("tank-team")), cell(rt.text("97")), cell(rt.text("$0.30"))] },
            { cells: [cell(rt.text("Edero")), cell(rt.text("5"))] },
            { cells: [cell(rt.bold("Total")), cell(rt.bold("1,279")), cell(rt.bold("$1.70"))] },
          ],
        },
      },
    },
    { kind: { case: "divider", value: {} } },
    {
      kind: {
        case: "list",
        value: {
          ordered: true,
          start: 3,
          items: [{ elements: [rt.text("third")] }, { elements: [rt.text("fourth")] }],
        },
      },
    },
    {
      kind: {
        case: "section",
        value: { elements: [rt.text("All via "), rt.code("tank-neural"), rt.text(".")] },
      },
    },
  ],
});
