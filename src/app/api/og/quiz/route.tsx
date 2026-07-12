import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getCustomQuizById } from "@/lib/quiz/repository";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const quizId = request.nextUrl.searchParams.get("id");

  if (!quizId) {
    return new Response("Missing quiz id", { status: 400 });
  }

  const quiz = await getCustomQuizById(quizId);

  if (!quiz) {
    return new Response("Quiz not found", { status: 404 });
  }

  const title = quiz.title.slice(0, 72);
  const description = quiz.description.slice(0, 120);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: 28,
            fontWeight: 700,
            opacity: 0.92,
          }}
        >
          LibertyCanvas
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              opacity: 0.92,
              maxWidth: "920px",
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            opacity: 0.9,
          }}
        >
          <span>{quiz.questions.length} questions</span>
          <span>{quiz.resultsMapping.length} result types</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
