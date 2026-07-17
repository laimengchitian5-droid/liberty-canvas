import { resolveLanguageModel } from "@/lib/ai/provider";
import { jsonError, parseJsonBody } from "@/lib/api/http";
import { generateForgeFeedback } from "@/lib/forge/generateForgeFeedback";
import { forgeFeedbackRequestSchema } from "@/lib/validation/forgeFeedbackRequestSchema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = await parseJsonBody(request, forgeFeedbackRequestSchema);

  if (!parsed.ok) {
    return parsed.response;
  }

  const { questionText, lang } = parsed.data;

  try {
    const result = await generateForgeFeedback(questionText, lang);
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
    console.error("[api/forge/feedback]", error);
    return jsonError(
      error instanceof Error ? error.message : "Forge feedback failed",
      500,
    );
  }
}
