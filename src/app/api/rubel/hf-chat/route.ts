import { NextResponse } from "next/server";
import { jsonError, parseJsonBody } from "@/lib/api/http";
import type { HfChatResponseContract } from "@/lib/rubel/contracts/pipeline";
import { generateRubelChatReply } from "@/lib/ai/rubelChatAdapter";
import {
  clampInjectionHistory,
  HF_MAX_USER_MESSAGE_CHARS,
  sanitizeHfText,
  validateRawPromptRequest,
} from "@/lib/rubel/network/hfChatGuard";
import {
  fetchHuggingFaceRawPrompt,
  fetchHuggingFaceReply,
} from "@/lib/rubel/huggingfaceClient";
import { hfChatRequestSchema } from "@/lib/validation/hfChatSchema";

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? "0");

    if (contentLength > 32_000) {
      return jsonError("Request body too large.", 413);
    }

    const parsed = await parseJsonBody(request, hfChatRequestSchema);

    if (!parsed.ok) {
      return parsed.response;
    }

    const body = parsed.data;

    if (typeof body.prompt === "string" && body.prompt.trim()) {
      const validated = validateRawPromptRequest(body);

      if (!validated.ok) {
        return jsonError(validated.error, 400);
      }

      const result = await fetchHuggingFaceRawPrompt(
        validated.prompt,
        validated.fallbackText,
      );
      const response: HfChatResponseContract = result;

      return NextResponse.json(response, {
        headers: {
          "Cache-Control": "no-store",
          "X-AI-Provider": result.provider,
        },
      });
    }

    if (!body.resultData) {
      return jsonError("Provide prompt or valid resultData.", 400);
    }

    const userMessage = sanitizeHfText(body.userMessage ?? "", HF_MAX_USER_MESSAGE_CHARS);

    if (!userMessage) {
      return jsonError("userMessage must not be empty.", 400);
    }

    const history = clampInjectionHistory(body.history ?? []);

    const sdkResult = await generateRubelChatReply({
      resultData: body.resultData,
      history,
      userMessage,
    });

    const result =
      sdkResult ??
      (await fetchHuggingFaceReply({
        resultData: body.resultData,
        history,
        userMessage,
      }));

    return NextResponse.json(result satisfies HfChatResponseContract, {
      headers: {
        "Cache-Control": "no-store",
        "X-AI-Provider": result.provider,
      },
    });
  } catch (error) {
    console.error("[rubel/hf-chat]", error);

    return jsonError(
      error instanceof Error ? error.message : "Unexpected Hugging Face chat failure.",
      500,
    );
  }
}
