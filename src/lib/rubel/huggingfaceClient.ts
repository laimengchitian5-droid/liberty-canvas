import {
  buildInjectionPrompt,
  buildPersonalizedFallback,
  type InjectionChatTurn,
} from "@/lib/rubel/buildInjectionPrompt";
import type { RubelEnginePayload } from "@/lib/rubel/resultData";

const DEFAULT_MODEL_CHAIN = [
  "Qwen/Qwen2.5-72B-Instruct",
  "Qwen/Qwen2.5-7B-Instruct",
  "HuggingFaceTB/SmolLM2-1.7B-Instruct",
] as const;

export function resolveModelChain(): string[] {
  const configured = process.env.HF_INFERENCE_MODEL?.trim();

  if (!configured) {
    return [...DEFAULT_MODEL_CHAIN];
  }

  return configured
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export const HF_INFERENCE_MODEL = resolveModelChain()[0];

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2_500;

interface HfTextGenerationResponse {
  generated_text?: string;
  error?: string;
  estimated_time?: number;
}

export interface HfChatRequest {
  resultData: RubelEnginePayload;
  history: InjectionChatTurn[];
  userMessage: string;
}

export interface HfChatResponse {
  text: string;
  provider: "huggingface" | "fallback";
  model?: string;
}

function inferenceUrl(model: string): string {
  return `https://api-inference.huggingface.co/models/${model}`;
}

function stripPromptEcho(fullText: string, prompt: string): string {
  if (fullText.startsWith(prompt)) {
    return fullText.slice(prompt.length).trim();
  }

  return fullText.replace(/<\|im_end\|>/g, "").trim();
}

function parseGeneratedText(payload: unknown, prompt: string): string {
  if (Array.isArray(payload)) {
    const first = payload[0] as HfTextGenerationResponse | undefined;
    const raw = first?.generated_text ?? "";

    if (!raw) {
      throw new Error("Hugging Face returned an empty generation.");
    }

    return stripPromptEcho(raw, prompt);
  }

  if (payload && typeof payload === "object") {
    const record = payload as HfTextGenerationResponse;

    if (record.generated_text) {
      return stripPromptEcho(record.generated_text, prompt);
    }

    if (record.error) {
      throw new Error(record.error);
    }
  }

  throw new Error("Unexpected Hugging Face response shape.");
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchModelOnce(
  model: string,
  prompt: string,
  headers: Record<string, string>,
): Promise<string> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    const response = await fetch(inferenceUrl(model), {
      method: "POST",
      headers,
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 220,
          return_full_text: false,
          temperature: 0.82,
          top_p: 0.9,
        },
      }),
      cache: "no-store",
    });

    const payload: unknown = await response.json();

    if (response.status === 503) {
      const estimated =
        payload &&
        typeof payload === "object" &&
        "estimated_time" in payload &&
        typeof (payload as HfTextGenerationResponse).estimated_time === "number"
          ? (payload as HfTextGenerationResponse).estimated_time! * 1000
          : RETRY_DELAY_MS;

      await sleep(Math.min(estimated, 8_000));
      continue;
    }

    if (!response.ok) {
      const message =
        payload &&
        typeof payload === "object" &&
        "error" in payload &&
        typeof (payload as HfTextGenerationResponse).error === "string"
          ? (payload as HfTextGenerationResponse).error!
          : `Hugging Face inference failed (${response.status}).`;

      throw new Error(message);
    }

    const text = parseGeneratedText(payload, prompt);

    if (!text) {
      throw new Error("Hugging Face returned blank text.");
    }

    return text;
  }

  throw new Error(`Model ${model} unavailable after retries.`);
}

export async function fetchHuggingFaceRawPrompt(
  prompt: string,
  fallbackText: string,
): Promise<HfChatResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = process.env.HF_TOKEN?.trim();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const models = resolveModelChain();

  for (const model of models) {
    try {
      const text = await fetchModelOnce(model, prompt, headers);
      return { text, provider: "huggingface", model };
    } catch {
      continue;
    }
  }

  return { text: fallbackText, provider: "fallback" };
}

export async function fetchHuggingFaceReply(
  request: HfChatRequest,
): Promise<HfChatResponse> {
  const prompt = buildInjectionPrompt(
    request.resultData,
    request.history,
    request.userMessage,
  );

  return fetchHuggingFaceRawPrompt(
    prompt,
    buildPersonalizedFallback(request.resultData, request.userMessage),
  );
}
