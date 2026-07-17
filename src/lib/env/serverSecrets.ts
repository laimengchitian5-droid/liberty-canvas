/**
 * Server-only secret resolution — never import from Client Components.
 * Dual naming: canonical Liberty keys + sketch aliases for local .env.local.
 */

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : undefined;
}

/**
 * Session / cookie HMAC secret.
 * Canonical: LC_SESSION_SECRET · Alias: ENCRYPTION_SECRET_KEY
 */
export function resolveSessionSecret(): string | undefined {
  return readEnv("LC_SESSION_SECRET") ?? readEnv("ENCRYPTION_SECRET_KEY");
}

/**
 * OpenAI-compatible key after Anthropic/DeepSeek miss.
 * Canonical: OPENAI_API_KEY · Alias: AI_INFERENCE_API_KEY
 */
export function resolveInferenceApiKeyFallback(): string | undefined {
  return readEnv("OPENAI_API_KEY") ?? readEnv("AI_INFERENCE_API_KEY");
}
