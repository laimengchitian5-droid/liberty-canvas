import { describe, expect, it } from "vitest";
import { jsonError } from "@/lib/api/http";
import { analyticsEventSchema } from "@/lib/diagnosis/analyticsServer";
import { isReservedBuilderSlug } from "@/lib/builder/auditLog";
import {
  buildPlugPlayHref,
  suggestPlugDiagnosisSlug,
} from "@/lib/rubel/suggestPlugDiagnosisSlug";

describe("jsonError contract", () => {
  it("uses private no-store cache header", () => {
    const response = jsonError("x", 400);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  });
});

describe("analyticsEventSchema", () => {
  it("accepts valid diagnosis analytics payloads", () => {
    const parsed = analyticsEventSchema.safeParse({
      event: "plug_result_share_copy",
      at: new Date().toISOString(),
      slug: "big-five",
      variant: "cosmic-a",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects unknown event names at the boundary", () => {
    const parsed = analyticsEventSchema.safeParse({
      event: "not_a_real_event",
      at: new Date().toISOString(),
    });

    expect(parsed.success).toBe(false);
  });
});

describe("builder publish guards", () => {
  it("blocks reserved slugs", () => {
    expect(isReservedBuilderSlug("big-five")).toBe(true);
    expect(isReservedBuilderSlug("my-custom-quiz")).toBe(false);
  });
});

describe("suggestPlugDiagnosisSlug", () => {
  it("suggests romance for high empathy + openness", () => {
    expect(
      suggestPlugDiagnosisSlug({
        openness: 4,
        empathy_need: 4.5,
        ego: 0,
      }),
    ).toBe("romance");
  });

  it("builds play href with ref", () => {
    expect(buildPlugPlayHref("big-five")).toBe(
      "/diagnosis/play/big-five?ref=rubel-bridge",
    );
  });

  it("accepts rubel bridge analytics payloads", () => {
    const parsed = analyticsEventSchema.safeParse({
      event: "rubel_bridge_click",
      at: new Date().toISOString(),
      slug: "romance",
      ref: "rubel-bridge",
      rubelDiagnosisId: "rubel-neko-ja-v1",
      traceId: "trace-123",
    });

    expect(parsed.success).toBe(true);
  });
});
