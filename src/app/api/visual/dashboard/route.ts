import { resolveLanguageModel } from "@/lib/ai/provider";
import { jsonError, parseJsonBody } from "@/lib/api/http";
import { generateLibertyDashboardData } from "@/lib/visual/generateLibertyDashboardData";
import { libertyDashboardRequestSchema } from "@/lib/validation/libertyDashboardRequestSchema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = await parseJsonBody(request, libertyDashboardRequestSchema);

  if (!parsed.ok) {
    return parsed.response;
  }

  const { vector, locale, seed } = parsed.data;

  try {
    const result = await generateLibertyDashboardData({
      vector,
      locale,
      seed,
    });

    const resolved = resolveLanguageModel();

    return Response.json(
      {
        ...result.data,
        meta: {
          provider: result.provider,
          usedFallback: result.usedFallback,
          hasModel: Boolean(resolved),
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, no-store",
          "X-AI-Provider": result.provider,
        },
      },
    );
  } catch (error) {
    console.error("[api/visual/dashboard]", error);
    return jsonError(
      error instanceof Error ? error.message : "Dashboard analysis failed",
      500,
    );
  }
}
