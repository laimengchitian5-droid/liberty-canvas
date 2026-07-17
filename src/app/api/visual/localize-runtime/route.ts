import { resolveLanguageModel } from "@/lib/ai/provider";
import { jsonError, parseJsonBody } from "@/lib/api/http";
import { localizeDiagnosticContent } from "@/lib/visual/dynamicLocalizer";
import { runtimeLocalizeRequestSchema } from "@/lib/validation/runtimeLocalizeRequestSchema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = await parseJsonBody(request, runtimeLocalizeRequestSchema);

  if (!parsed.ok) {
    return parsed.response;
  }

  const { master, lang } = parsed.data;

  try {
    const result = await localizeDiagnosticContent(master, lang);
    const resolved = resolveLanguageModel();

    return Response.json(
      {
        ...result.data,
        meta: {
          provider: result.provider,
          usedFallback: result.usedFallback,
          cacheHit: result.cacheHit,
          hasModel: Boolean(resolved),
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
    console.error("[api/visual/localize-runtime]", error);
    return jsonError(
      error instanceof Error ? error.message : "Runtime localization failed",
      500,
    );
  }
}
