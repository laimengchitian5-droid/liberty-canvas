import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  buildDynamicSystemPrompt,
  buildFallbackChatResponse,
  buildRubelFallbackChatResponse,
  buildRubelSystemPrompt,
} from "@/lib/ai/buildChatSystemPrompt";
import {
  getLatestUserMessage,
  parseAdaptiveChatRequest,
} from "@/lib/ai/parseChatRequestBody";
import { resolveLanguageModel } from "@/lib/ai/provider";
import { jsonError } from "@/lib/api/http";

function createFallbackStream(text: string): Response {
  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(text));
        controller.close();
      },
    }),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-AI-Provider": "fallback",
      },
    },
  );
}

async function buildModelMessages(
  uiMessages: UIMessage[] | undefined,
  legacyMessages: Array<{ role: "user" | "assistant"; content: string }>,
) {
  if (uiMessages && uiMessages.length > 0) {
    return convertToModelMessages(
      uiMessages.filter(
        (message) => message.role === "user" || message.role === "assistant",
      ),
    );
  }

  return legacyMessages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const body = parseAdaptiveChatRequest(payload);

    if (!body) {
      return jsonError("Invalid chat request payload", 400);
    }

    if (body.messages.length === 0) {
      return jsonError("messages must not be empty", 400);
    }

    const latestUserMessage = getLatestUserMessage(body.messages);

    if (!latestUserMessage.trim()) {
      return jsonError("At least one non-empty user message is required", 400);
    }

    const resolved = resolveLanguageModel();
    const isRubelAgent = body.mode === "rubel";

    if (!resolved) {
      return createFallbackStream(
        isRubelAgent
          ? buildRubelFallbackChatResponse(body, latestUserMessage)
          : buildFallbackChatResponse(body, latestUserMessage),
      );
    }

    try {
      const modelMessages = await buildModelMessages(body.uiMessages, body.messages);

      const result = streamText({
        model: resolved.model,
        temperature: isRubelAgent ? 0.85 : 0.7,
        system: isRubelAgent
          ? buildRubelSystemPrompt(body)
          : buildDynamicSystemPrompt(body),
        messages: modelMessages,
      });

      return result.toTextStreamResponse({
        headers: {
          "Cache-Control": "no-store",
          "X-AI-Provider": resolved.provider,
        },
      });
    } catch (error) {
      console.error("[chat] AI SDK stream failed, using fallback:", error);
      return createFallbackStream(
        isRubelAgent
          ? buildRubelFallbackChatResponse(body, latestUserMessage)
          : buildFallbackChatResponse(body, latestUserMessage),
      );
    }
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unexpected chat route failure",
      500,
    );
  }
}
