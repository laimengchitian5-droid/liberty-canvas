import { z } from "zod";

export const adaptiveChatResponseSchema = z.object({
  ai_response: z.string().min(1, "ai_response must not be empty"),
  applied_persona: z.string().min(1, "applied_persona must not be empty"),
  next_suggested_question: z.string(),
});

export type AdaptiveChatResponse = z.infer<typeof adaptiveChatResponseSchema>;

export interface ChatRequestMessage {
  role: "user" | "assistant";
  content: string;
}

export type ChatAgentMode = "rubel" | "adaptive";

export interface AdaptiveChatRequestBody {
  messages: ChatRequestMessage[];
  systemPrompt: string;
  appliedPersona: string;
  isReliable: boolean;
  archetype: string;
  mode: ChatAgentMode;
  scores?: Record<string, number>;
  kraepelinFatigue?: number;
  kraepelinConsistency?: number;
  kraepelinFocusPattern?: string;
  locale?: string;
}

export class AdaptiveChatParseError extends Error {
  constructor(
    message: string,
    public readonly rawBuffer: string,
  ) {
    super(message);
    this.name = "AdaptiveChatParseError";
  }
}

export class AdaptiveChatValidationError extends Error {
  constructor(
    message: string,
    public readonly issues: z.ZodIssue[],
    public readonly rawBuffer: string,
  ) {
    super(message);
    this.name = "AdaptiveChatValidationError";
  }
}

function unescapeJsonString(value: string): string {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

function extractJsonStringField(
  buffer: string,
  field: keyof AdaptiveChatResponse,
): string | null {
  const pattern = new RegExp(`"${field}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)(?:"|$)`);
  const match = buffer.match(pattern);

  if (!match?.[1]) {
    return null;
  }

  return unescapeJsonString(match[1]);
}

export function parsePartialAdaptiveChatResponse(
  buffer: string,
): Partial<AdaptiveChatResponse> {
  const trimmed = buffer.trim();

  if (!trimmed) {
    return {};
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    const validated = adaptiveChatResponseSchema.safeParse(parsed);

    if (validated.success) {
      return validated.data;
    }
  } catch {
    // Fall through to partial field extraction.
  }

  const partial: Partial<AdaptiveChatResponse> = {};
  const aiResponse = extractJsonStringField(trimmed, "ai_response");
  const appliedPersona = extractJsonStringField(trimmed, "applied_persona");
  const nextQuestion = extractJsonStringField(trimmed, "next_suggested_question");

  if (aiResponse !== null) {
    partial.ai_response = aiResponse;
  }

  if (appliedPersona !== null) {
    partial.applied_persona = appliedPersona;
  }

  if (nextQuestion !== null) {
    partial.next_suggested_question = nextQuestion;
  }

  return partial;
}

export function parseAdaptiveChatResponse(buffer: string): AdaptiveChatResponse {
  const trimmed = buffer.trim();

  if (!trimmed) {
    throw new AdaptiveChatParseError("Empty response buffer", trimmed);
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new AdaptiveChatParseError("Response is not valid JSON", trimmed.slice(0, 500));
  }

  const validated = adaptiveChatResponseSchema.safeParse(parsed);

  if (!validated.success) {
    throw new AdaptiveChatValidationError(
      "Response JSON does not match adaptive chat schema",
      validated.error.issues,
      trimmed.slice(0, 500),
    );
  }

  return validated.data;
}

export async function consumeAdaptiveChatStream(
  response: Response,
  onPartial: (partial: Partial<AdaptiveChatResponse>, buffer: string) => void,
): Promise<AdaptiveChatResponse> {
  if (!response.ok) {
    let errorMessage = `Chat request failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as { error?: string };
      if (errorBody.error) {
        errorMessage = errorBody.error;
      }
    } catch {
      try {
        const errorText = await response.text();
        if (errorText.trim()) {
          errorMessage = errorText.trim();
        }
      } catch {
        // Keep default message.
      }
    }

    throw new Error(errorMessage);
  }

  if (!response.body) {
    throw new Error("Chat response did not include a readable stream body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    onPartial(parsePartialAdaptiveChatResponse(buffer), buffer);
  }

  buffer += decoder.decode();

  return parseAdaptiveChatResponse(buffer);
}
