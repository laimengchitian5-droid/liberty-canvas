import { NextResponse } from "next/server";
import { jsonError, parseJsonBody } from "@/lib/api/http";
import { MAX_RETRY_ATTEMPTS } from "@/lib/google/indexingAuditLog";
import {
  retryFailedIndexingEntries,
  triggerQuizIndexing,
} from "@/lib/google/indexingService";
import { getCustomQuizById } from "@/lib/quiz/repository";
import { buildQuizPageUrl } from "@/lib/site/url";
import { quizIndexRequestSchema } from "@/lib/validation/builderAndIndexSchema";

export const runtime = "nodejs";

function isAuthorizedInternalRequest(request: Request): boolean {
  const configuredSecret = process.env.INTERNAL_INDEXING_SECRET?.trim();

  if (!configuredSecret) {
    return process.env.NODE_ENV !== "production";
  }

  const providedSecret = request.headers.get("x-indexing-secret");
  return providedSecret === configuredSecret;
}

export async function POST(request: Request) {
  if (!isAuthorizedInternalRequest(request)) {
    return jsonError("Unauthorized indexing request", 401);
  }

  try {
    const parsed = await parseJsonBody(request, quizIndexRequestSchema);

    if (!parsed.ok) {
      return parsed.response;
    }

    const body = parsed.data;

    if (body.retryFailed) {
      const results = await retryFailedIndexingEntries();

      return NextResponse.json({
        mode: "retry",
        maxAttempts: MAX_RETRY_ATTEMPTS,
        processed: results.length,
        results,
      });
    }

    const quizId = body.quizId!.trim();
    const quiz = await getCustomQuizById(quizId);

    if (!quiz) {
      return jsonError("Quiz not found", 404);
    }

    const url = buildQuizPageUrl(quizId);
    const result = await triggerQuizIndexing({ quizId });

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.error ?? "Failed to notify Google Indexing API",
          retryable: result.retryable,
          url,
          queuedForRetry: result.retryable,
        },
        { status: result.retryable ? 429 : 502 },
      );
    }

    return NextResponse.json({
      mode: "single",
      quizId,
      url,
      status: "indexed",
      notificationType: "URL_UPDATED",
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unexpected indexing route failure",
      500,
    );
  }
}

export async function GET() {
  return jsonError("Method not allowed. Use POST for indexing operations.", 405);
}
