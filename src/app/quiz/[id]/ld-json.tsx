import type { StoredUniversalApp } from "@/types/platform";
import { buildQuizOgImageUrl, buildQuizPageUrl } from "@/lib/site/url";

function uniqueTestTypes(quiz: StoredUniversalApp): string[] {
  return [...new Set(quiz.questions.map((question) => question.type))];
}

function uniqueDimensions(quiz: StoredUniversalApp): string[] {
  return [...new Set(quiz.questions.map((question) => question.dimension))].slice(
    0,
    6,
  );
}

export function buildQuizStructuredData(quiz: StoredUniversalApp) {
  const pageUrl = buildQuizPageUrl(quiz.id);
  const quizId = `${pageUrl}#quiz`;
  const imageUrl = buildQuizOgImageUrl(quiz.id);
  const testTypes = uniqueTestTypes(quiz);
  const dimensions = uniqueDimensions(quiz);

  const educationalAlignment = [
    {
      "@type": "AlignmentObject",
      alignmentType: "educationalSubject",
      targetName: "Psychology",
      targetDescription:
        "Personality psychology and psychometric trait interpretation",
    },
    ...testTypes.map((testType) => ({
      "@type": "AlignmentObject",
      alignmentType: "assessmentMethod",
      targetName: testType,
      targetDescription: `${testType} based personality assessment framework`,
    })),
    ...dimensions.map((dimension) => ({
      "@type": "AlignmentObject",
      alignmentType: "educationalFramework",
      targetName: dimension,
      targetDescription: `Measured psychometric dimension: ${dimension}`,
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemPage",
        "@id": pageUrl,
        url: pageUrl,
        name: quiz.title,
        description: quiz.description,
        inLanguage: "ja-JP",
        datePublished: quiz.createdAt,
        dateModified: quiz.updatedAt,
        isPartOf: {
          "@type": "WebSite",
          name: "LibertyCanvas",
          url: pageUrl.split("/quiz/")[0] ?? pageUrl,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: imageUrl,
          width: 1200,
          height: 630,
        },
        mainEntity: {
          "@id": quizId,
        },
      },
      {
        "@type": "Quiz",
        "@id": quizId,
        name: quiz.title,
        description: quiz.description,
        url: pageUrl,
        image: imageUrl,
        inLanguage: "ja-JP",
        numberOfQuestions: quiz.questions.length,
        datePublished: quiz.createdAt,
        dateModified: quiz.updatedAt,
        author: {
          "@type": "Person",
          identifier: quiz.authorId,
          name: quiz.authorId,
        },
        educationalLevel: "General audience",
        learningResourceType: "Quiz",
        educationalUse: "assessment",
        educationalAlignment,
        about: testTypes.map((testType) => ({
          "@type": "Thing",
          name: `${testType} personality assessment`,
        })),
        hasPart: quiz.questions.map((question, index) => ({
          "@type": "Question",
          "@id": `${quizId}/question-${index + 1}`,
          name: question.text,
          text: question.text,
          position: index + 1,
          about: {
            "@type": "DefinedTerm",
            name: question.dimension,
            termCode: question.type,
          },
        })),
      },
    ],
  };
}

interface QuizLdJsonProps {
  quiz: StoredUniversalApp;
}

export function QuizLdJson({ quiz }: QuizLdJsonProps) {
  const structuredData = buildQuizStructuredData(quiz);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
