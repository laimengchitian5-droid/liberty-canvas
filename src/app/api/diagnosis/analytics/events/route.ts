import { NextResponse } from "next/server";
import { buildAnalyticsInsights } from "@/lib/diagnosis/analyticsInsights";
import { verifyInsightsApiAccess } from "@/lib/auth/verifyInsightsAccess";
import {
  analyticsEventSchema,
  appendAnalyticsEvent,
  summarizeAnalyticsBySlug,
  summarizeAnalyticsEvents,
} from "@/lib/diagnosis/analyticsServer";
import { logStructured, withTraceId } from "@/lib/observability/observabilityPort";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim();
  const scope = searchParams.get("scope");

  if (scope === "insights") {
    const gate = verifyInsightsApiAccess(request);

    if (!gate.allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: gate.status });
    }

    const insights = await buildAnalyticsInsights();
    return NextResponse.json({ insights });
  }

  const summary = slug
    ? await summarizeAnalyticsBySlug(slug)
    : await summarizeAnalyticsEvents();

  return NextResponse.json({ summary });
}
export async function POST(request: Request) {
  const body = (await request.json()) as unknown;
  const parsed = analyticsEventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid analytics payload" }, { status: 400 });
  }

  const traced = withTraceId(parsed.data);
  await appendAnalyticsEvent(traced);

  logStructured({
    level: "info",
    message: "analytics_event_ingested",
    traceId: traced.traceId,
    context: {
      event: traced.event,
      slug: typeof traced.slug === "string" ? traced.slug : null,
      ref: typeof traced.ref === "string" ? traced.ref : null,
    },
  });

  return NextResponse.json({ ok: true, traceId: traced.traceId });
}
