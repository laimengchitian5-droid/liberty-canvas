import { streamText } from "ai";
import { resolveLanguageModel } from "@/lib/ai/provider";
import {
  buildAdviceUserPrompt,
  DIAGNOSIS_ADVICE_BLUEPRINT,
} from "@/lib/diagnosis/buildAdvicePrompt";
import {
  buildPlugAdviceUserPrompt,
  DIAGNOSIS_ADVICE_BLUEPRINT as PLUG_BLUEPRINT,
} from "@/lib/diagnosis/buildPlugAdvicePrompt";
import { buildFallbackAdvice } from "@/lib/diagnosis/parseAdviceResponse";
import type { DiagnosisAdviceRequestBody } from "@/types/diagnosis";
import type { PlugDiagnosisAdviceRequestBody } from "@/types/diagnosisCompiler";

type AdviceRequestBody = DiagnosisAdviceRequestBody | PlugDiagnosisAdviceRequestBody;

function isPlugAdviceBody(value: unknown): value is PlugDiagnosisAdviceRequestBody {
  if (!value || typeof value !== "object") {
    return false;
  }

  const body = value as PlugDiagnosisAdviceRequestBody;

  return (
    body.mode === "plug" &&
    typeof body.slug === "string" &&
    typeof body.diagnosisTitle === "string" &&
    typeof body.archetypeTitle === "string" &&
    typeof body.factorSummary === "object"
  );
}

function isLegacyAdviceBody(value: unknown): value is DiagnosisAdviceRequestBody {
  if (!value || typeof value !== "object") {
    return false;
  }

  const body = value as DiagnosisAdviceRequestBody;

  return (
    typeof body.result?.id === "string" &&
    typeof body.result?.title === "string" &&
    typeof body.result?.dominantCategory === "string" &&
    typeof body.scores === "object" &&
    Array.isArray(body.answers)
  );
}

function resolveAdviceTitle(body: AdviceRequestBody): string {
  if (isPlugAdviceBody(body)) {
    return body.archetypeTitle;
  }

  return body.result.title;
}

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
    const body = (await request.json()) as unknown;

    if (!isPlugAdviceBody(body) && !isLegacyAdviceBody(body)) {
      return Response.json({ error: "Invalid diagnosis advice payload" }, { status: 400 });
    }

    const resolved = resolveLanguageModel();
    const title = resolveAdviceTitle(body);

    if (!resolved) {
      return createFallbackStream(title);
    }

    const blueprint = isPlugAdviceBody(body) ? PLUG_BLUEPRINT : DIAGNOSIS_ADVICE_BLUEPRINT;
    const prompt = isPlugAdviceBody(body)
      ? buildPlugAdviceUserPrompt(body)
      : buildAdviceUserPrompt(body);

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
      { status: 500 },
    );
  }
}
