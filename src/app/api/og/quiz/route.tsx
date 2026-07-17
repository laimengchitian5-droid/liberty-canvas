import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { buildOgPalette } from "@/lib/brand/ogBrand";
import { getCustomQuizById } from "@/lib/quiz/repository";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const quizId = request.nextUrl.searchParams.get("id");
  const scoreLabel = request.nextUrl.searchParams.get("score");

  if (!quizId) {
    return new Response("Missing quiz id", { status: 400 });
  }

  const quiz = await getCustomQuizById(quizId);

  if (!quiz) {
    return new Response("Quiz not found", { status: 404 });
  }

  const title = quiz.title.slice(0, 72);
  const description = scoreLabel
    ? `Result: ${scoreLabel.slice(0, 64)}`
    : quiz.description.slice(0, 120);
  const palette = buildOgPalette("liberty-runtime");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px",
        background: palette.background,
        color: palette.foreground,
        fontFamily: "serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: 28,
          fontWeight: 700,
          color: palette.muted,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 999,
            background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent}99)`,
          }}
        />
        {palette.name}
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
            color: palette.muted,
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
          color: palette.muted,
        }}
      >
        <span>
          {scoreLabel ? "Share your result" : `${quiz.questions.length} questions`}
        </span>
        <span>{quiz.resultsMapping.length} result types</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
