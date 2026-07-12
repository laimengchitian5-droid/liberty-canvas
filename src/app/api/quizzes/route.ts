import { NextResponse } from "next/server";
import { triggerQuizIndexing } from "@/lib/google/indexingService";
import { refreshPublishedQuizDiscovery } from "@/lib/quiz/refreshSitemap";
import { saveCustomQuiz, listCustomQuizzes } from "@/lib/quiz/repository";
import { getActiveStorageMode } from "@/lib/storage/jsonStore";
import { buildQuizPageUrl } from "@/lib/site/url";
import { createCustomQuizSchema } from "@/lib/validation/quizSchema";

export const runtime = "nodejs";

function jsonError(message: string, status: number, details?: unknown) {
  return NextResponse.json(
    {
      error: message,
      ...(details !== undefined ? { details } : {}),
    },
    { status },
  );
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      return jsonError("Content-Type must be application/json", 415);
    }

    let payload: unknown;

    try {
      payload = await request.json();
    } catch {
      return jsonError("Request body must be valid JSON", 400);
    }

    const parsed = createCustomQuizSchema.safeParse(payload);

    if (!parsed.success) {
      return jsonError("Validation failed", 400, parsed.error.flatten());
    }

    const quiz = await saveCustomQuiz(parsed.data);
    refreshPublishedQuizDiscovery();

    const publicUrl = buildQuizPageUrl(quiz.id);

    void triggerQuizIndexing({ quizId: quiz.id }).catch((error) => {
      console.error("[quiz-create] background indexing trigger failed:", error);
    });

    return NextResponse.json(
      {
        quiz,
        discovery: {
          sitemapRefreshed: true,
          publicPath: `/quiz/${quiz.id}`,
          publicUrl,
        },
        indexing: {
          queued: true,
          endpoint: "/api/quizzes/index-route",
        },
      },
      {
        status: 201,
        headers: {
          Location: publicUrl,
        },
      },
    );
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Failed to create custom quiz",
      500,
    );
  }
}

export async function GET() {
  try {
    const quizzes = await listCustomQuizzes();

    return NextResponse.json({
      quizzes,
      count: quizzes.length,
      storage: getActiveStorageMode(),
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Failed to list quizzes",
      500,
    );
  }
}
