import { create } from "@bufbuild/protobuf";
import { describe, expect, it } from "vitest";
import { MessageSchema } from "../contracts/tank/message/v1/message_pb.js";
import { SearchHitSchema } from "../contracts/tank/search/v1/search_pb.js";
import { MarkType } from "../contracts/tank/topo/v1/topo_pb.js";
import { marksFromSearchHits } from "./searchMarks.js";

const hit = (id: string, seq: bigint, channelId = "c1", highlights: string[] = []) =>
  create(SearchHitSchema, {
    channelId,
    highlights,
    message: create(MessageSchema, { id, channelId, channelSeq: seq, text: `body of ${id}` }),
  });

describe("marksFromSearchHits", () => {
  it("places a hit at its message's seq", () => {
    const [mark] = marksFromSearchHits([hit("m1", 42n)], "c1");
    expect(mark?.channelSeq).toBe(42n);
    expect(mark?.type).toBe(MarkType.SEARCH_HIT);
    expect(mark?.messageId).toBe("m1");
  });

  it("orders by seq so next means further down the Tread, not higher ranked", () => {
    const marks = marksFromSearchHits([hit("m3", 90n), hit("m1", 10n), hit("m2", 50n)], "c1");
    expect(marks.map((m) => m.messageId)).toEqual(["m1", "m2", "m3"]);
  });

  it("drops hits from other channels, because a strip only maps its own", () => {
    const marks = marksFromSearchHits([hit("m1", 10n), hit("elsewhere", 11n, "c2")], "c1");
    expect(marks.map((m) => m.messageId)).toEqual(["m1"]);
  });

  it("prefers the search highlight over the raw body for the preview", () => {
    const [mark] = marksFromSearchHits([hit("m1", 10n, "c1", ["…the rate limiter…"])], "c1");
    expect(mark?.preview).toBe("…the rate limiter…");
  });

  it("gives every hit a stable id, so re-running a search does not churn the strip", () => {
    const a = marksFromSearchHits([hit("m1", 10n)], "c1");
    const b = marksFromSearchHits([hit("m1", 10n)], "c1");
    expect(a[0]?.id).toBe(b[0]?.id);
  });
});
