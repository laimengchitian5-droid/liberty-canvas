import { resolveLanguageModel } from "@/lib/ai/provider";
import { jsonError, parseJsonBody } from "@/lib/api/http";
import { generatePlayRouterBulk } from "@/lib/visual/generatePlayRouterBulk";
import { playRouterRequestSchema } from "@/lib/validation/playRouterRequestSchema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = await parseJsonBody(request, playRouterRequestSchema);

  if (!parsed.ok) {
    return parsed.response;
  }

  const { cards, lang } = parsed.data;

  try {
    const result = await generatePlayRouterBulk(cards, lang);
    const resolved = resolveLanguageModel();

    return Response.json(
      {
        ...result.data,
        meta: {
          provider: result.provider,
          usedFallback: result.usedFallback,
          cacheHit: result.cacheHit,
          hasModel: Boolean(resolved),
          routeCount: result.data.localizedOutput.sanitizedRoutes.length,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, no-store",
          "X-AI-Provider": result.provider,
          "X-Cache": result.cacheHit ? "HIT" : "MISS",
        },
      },
    );
  } catch (error) {
    console.error("[api/visual/sanitize-play-routes]", error);
    return jsonError(
      error instanceof Error ? error.message : "Play route sanitization failed",
      500,
    );
  }
}
