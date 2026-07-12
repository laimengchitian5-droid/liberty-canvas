import type { StoredUniversalApp } from "@/types/platform";
import {
  buildAppOgImageUrl,
  buildAppPageUrl,
  buildQuizOgImageUrl,
} from "@/lib/site/url";

function buildAssessmentStructuredData(app: StoredUniversalApp) {
  const pageUrl = buildAppPageUrl(app.id);
  const imageUrl = buildQuizOgImageUrl(app.id);

  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "@id": `${pageUrl}#quiz`,
    name: app.title,
    description: app.description,
    url: pageUrl,
    image: imageUrl,
    inLanguage: "ja-JP",
    numberOfQuestions: app.questions.length,
    datePublished: app.createdAt,
    dateModified: app.updatedAt,
    author: {
      "@type": "Person",
      identifier: app.authorId,
      name: app.authorId,
    },
  };
}

function buildSoftwareApplicationStructuredData(app: StoredUniversalApp) {
  const pageUrl = buildAppPageUrl(app.id);
  const imageUrl = buildAppOgImageUrl(app.id);

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#software`,
    name: app.title,
    description: app.description,
    url: pageUrl,
    image: imageUrl,
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      identifier: app.authorId,
      name: app.authorId,
    },
    datePublished: app.createdAt,
    dateModified: app.updatedAt,
  };
}

export function buildAppStructuredData(app: StoredUniversalApp) {
  if (app.appType === "assessment") {
    return buildAssessmentStructuredData(app);
  }

  return buildSoftwareApplicationStructuredData(app);
}

interface AppLdJsonProps {
  app: StoredUniversalApp;
}

export function AppLdJson({ app }: AppLdJsonProps) {
  const structuredData = buildAppStructuredData(app);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
