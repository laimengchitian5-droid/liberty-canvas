import type { Metadata } from "next";
import { LibertyResultContainer } from "@/components/visual/LibertyResultContainer";

export const metadata: Metadata = {
  title: "Dashboard Preview — Dev",
  robots: { index: false, follow: false },
};

const SAMPLE_VECTOR = [4, 5, 6, 3, 5, 4, 6, 5] as const;

/**
 * Dev-only preview for EN-reasoning → JA UI dashboard pipeline.
 */
const DashboardPreviewPage = () => {
  if (process.env.NODE_ENV === "production") {
    return (
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Not Found</h1>
      </main>
    );
  }

  return (
    <main>
      <p style={{ padding: "1rem", fontSize: "0.85rem" }}>
        Deep link:{" "}
        <a href="/result?vector=4,5,6,3,5,4,6,5&seed=Dev">/result?vector=…</a>
      </p>
      <LibertyResultContainer
        vector={SAMPLE_VECTOR}
        sharePath="/result?vector=4,5,6,3,5,4,6,5"
      />
    </main>
  );
};

export default DashboardPreviewPage;
