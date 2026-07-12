import { NextResponse } from "next/server";
import type {
  HfChatResponseContract,
  InjectionChatTurn,
  RubelEnginePayload,
} from "@/lib/rubel/contracts/pipeline";
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

interface HfChatRequestBody {
  prompt?: string;
  fallbackText?: string;
  resultData?: RubelEnginePayload;
  history?: InjectionChatTurn[];
  userMessage?: string;
}

function isValidEnginePayload(value: unknown): value is RubelEnginePayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.title === "string" &&
    typeof record.typeName === "string" &&
    typeof record.tone === "string" &&
    typeof record.empathyLevel === "string" &&
    typeof record.compiledSystemPrompt === "string" &&
    (record.intakeSource === "satellite" || record.intakeSource === "quiz")
  );
}

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? "0");

    if (contentLength > 32_000) {
      return NextResponse.json({ error: "Request body too large." }, { status: 413 });
    }

    const body = (await request.json()) as HfChatRequestBody;

    if (typeof body.prompt === "string" && body.prompt.trim()) {
      const validated = validateRawPromptRequest(body);

      if (!validated.ok) {
        return NextResponse.json({ error: validated.error }, { status: 400 });
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

    if (!isValidEnginePayload(body.resultData)) {
      return NextResponse.json(
        { error: "Provide prompt or valid resultData." },
        { status: 400 },
      );
    }

    const userMessage = sanitizeHfText(body.userMessage ?? "", HF_MAX_USER_MESSAGE_CHARS);

    if (!userMessage) {
      return NextResponse.json(
        { error: "userMessage must not be empty." },
        { status: 400 },
      );
    }

    const history = clampInjectionHistory(
      Array.isArray(body.history)
        ? body.history.filter(
            (turn): turn is InjectionChatTurn =>
              Boolean(turn) &&
              typeof turn === "object" &&
              (turn.role === "user" || turn.role === "assistant") &&
              typeof turn.content === "string",
          )
        : [],
    );

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

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected Hugging Face chat failure.",
      },
      { status: 500 },
    );
  }
}
