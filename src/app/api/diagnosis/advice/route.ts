import { streamText } from "ai";
import { resolveLanguageModel } from "@/lib/ai/provider";
import { parseJsonBody } from "@/lib/api/http";
import {
  buildAdviceUserPrompt,
  DIAGNOSIS_ADVICE_BLUEPRINT,
} from "@/lib/diagnosis/buildAdvicePrompt";
import {
  buildPlugAdviceUserPrompt,
  DIAGNOSIS_ADVICE_BLUEPRINT as PLUG_BLUEPRINT,
} from "@/lib/diagnosis/buildPlugAdvicePrompt";
import { buildFallbackAdvice } from "@/lib/diagnosis/parseAdviceResponse";
import {
  asLegacyAdviceBody,
  diagnosisAdviceRequestSchema,
  isPlugAdviceInput,
} from "@/lib/validation/adviceSchema";

function createFallbackStream(title: string): Response {
  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(JSON.stringify(buildFallbackAdvice(title))));
        controller.close();
      },
    }),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function POST(request: Request) {
  try {
    const parsed = await parseJsonBody(request, diagnosisAdviceRequestSchema);

    if (!parsed.ok) {
      return parsed.response;
    }

    const body = parsed.data;
    const resolved = resolveLanguageModel();
    const title = isPlugAdviceInput(body) ? body.archetypeTitle : body.result.title;

    if (!resolved) {
      return createFallbackStream(title);
    }

    const blueprint = isPlugAdviceInput(body)
      ? PLUG_BLUEPRINT
      : DIAGNOSIS_ADVICE_BLUEPRINT;
    const prompt = isPlugAdviceInput(body)
      ? buildPlugAdviceUserPrompt(body)
      : buildAdviceUserPrompt(asLegacyAdviceBody(body));

    try {
      const result = streamText({
        model: resolved.model,
        temperature: blueprint.temperature,
        maxOutputTokens: blueprint.maxTokens,
        system: `${blueprint.systemContext}\nSchema:\n${blueprint.responseSchema}\nRespond with JSON only.`,
        prompt,
      });

      return result.toTextStreamResponse({
        headers: {
          "Cache-Control": "no-store",
          "X-AI-Provider": resolved.provider,
        },
      });
    } catch (error) {
      console.error("[diagnosis/advice] AI SDK stream failed, using fallback:", error);
      return createFallbackStream(title);
    }
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected diagnosis advice route failure",
      },
      {
        status: 500,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }
}
