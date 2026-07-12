import type { Metadata } from "next";

import { CreatePageShell } from "@/components/rubel/CreatePageShell";
import { PRODUCT_NAME } from "@/lib/brand/constants";
import { buildCreatePageJsonLd } from "@/lib/rubel/rubelSeo";
import { buildHreflangAlternates } from "@/lib/seo/hreflang";
import { buildCreateOgImageUrl } from "@/lib/seo/ogUrls";
import { getSiteUrl } from "@/lib/site/url";

export const metadata: Metadata = {
  title: `オリジナル性格診断を作成 — 無料ノーコード | ${PRODUCT_NAME}`,
  description:
    "質問・結果タイプ・AIキャラクターを設定して、オリジナル性格診断を無料作成。公開すれば誰でもプレイ可能。",
  keywords: [
    "性格診断 作る",
    "オリジナル性格診断",
    "性格診断 メーカー",
    "診断 作成 無料",
    PRODUCT_NAME,
  ],
  alternates: {
    canonical: `${getSiteUrl()}/create`,
    languages: buildHreflangAlternates("/create"),
  },
  openGraph: {
    title: `オリジナル性格診断を作成 | ${PRODUCT_NAME}`,
    description: "ノーコードでAI性格診断を作成・公開",
    url: `${getSiteUrl()}/create`,
    siteName: PRODUCT_NAME,
    locale: "ja_JP",
    images: [{ url: buildCreateOgImageUrl(), width: 1200, height: 630 }],
  },
};

export default function CreatePage() {
  const jsonLd = buildCreatePageJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CreatePageShell />
    </>
  );
}
