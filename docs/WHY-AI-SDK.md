# Why Vercel AI SDK (Not Hand-Rolled SSE)

LibertyCanvas migrated `/api/chat` and `/api/diagnosis/advice` from manual Groq SSE parsing to **Vercel AI SDK `streamText()`**.

## Problems with hand-rolled SSE

| Issue                           | Impact                                       |
| ------------------------------- | -------------------------------------------- |
| Provider-specific delta parsing | Every model change breaks the client         |
| No unified fallback             | OpenAI / Anthropic required duplicate routes |
| Stream cleanup bugs             | Strict Mode double-fetch, leaked readers     |
| Untyped boundaries              | JSON advice drift without Zod recovery       |

## What AI SDK gives us

1. **Single interface** — `resolveLanguageModel()` in `src/lib/ai/provider.ts` (OpenAI → Anthropic → Groq).
2. **`streamText()` + `toTextStreamResponse()`** — one pattern for chat and diagnosis advice.
3. **`TextStreamChatTransport` + `useChat`** — client state isolated from diagnosis engine state.
4. **Typed fallbacks** — Zod on advice; template JSON on chat when keys missing.

## Architecture rule

- **Engine state** (`useDiagnosisEngine`) ≠ **stream state** (`useAdviceStream` / `useChat`).
- New AI routes must use `lib/ai/provider.ts`; no new raw `fetch("https://api.groq.com/...")`.

## Interview one-liner (JP)

> 「手書き SSE はプロバイダ差分と Strict Mode の二重リクエストがボトルネックだったので、AI SDK に統一し、型・フォールバック・ストリーム中断を一箇所で担保しました。」
