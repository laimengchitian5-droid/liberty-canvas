import type { Metadata } from "next";
import { Suspense } from "react";
import { LibertyResultFromSearch } from "@/components/visual/LibertyResultFromSearch";
import { PRODUCT_NAME } from "@/lib/brand/constants";

export const metadata: Metadata = {
  title: `心の色リザルト | ${PRODUCT_NAME}`,
  description: "診断リビール後の宇宙キャラ・全肯定アドバイス・心の色アート。",
  robots: { index: false, follow: false },
};

const ResultFallback = () => (
  <div
    style={{
      minHeight: "40dvh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#6f6258",
    }}
    role="status"
  >
    心の色を読みとっています…
  </div>
);

/**
 * Deep-linkable dashboard: `/result?vector=4,5,6,3,5,4,6,5&seed=...`
 * Psych / Play reveal CTAs navigate here (not `/chat`).
 */
const ResultPage = () => {
  return (
    <Suspense fallback={<ResultFallback />}>
      <LibertyResultFromSearch />
    </Suspense>
  );
};

export default ResultPage;
