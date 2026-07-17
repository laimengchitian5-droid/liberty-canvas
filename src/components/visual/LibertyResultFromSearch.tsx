"use client";

import { useSearchParams } from "next/navigation";
import { LibertyResultContainer } from "@/components/visual/LibertyResultContainer";
import { isLocale } from "@/lib/i18n/config";
import { parseArtVectorParam } from "@/lib/visual/artVectorCodec";
import type { LibertyDashboardLocale } from "@/types/libertyDashboard";
import styles from "./LibertyResultContainer.module.css";

function resolveDashboardLocale(raw: string | null): LibertyDashboardLocale {
  if (raw && isLocale(raw)) {
    return raw;
  }
  return "ja";
}

/**
 * Reads `?vector=` (+ optional seed/locale) and renders the AI dashboard.
 * Used by `/result` — never by `/chat`. Locale via query, not `/[lang]` rewrite.
 */
export const LibertyResultFromSearch = () => {
  const searchParams = useSearchParams();
  const vector = parseArtVectorParam(searchParams.get("vector"));
  const seed = searchParams.get("seed")?.slice(0, 80) || undefined;
  const locale = resolveDashboardLocale(searchParams.get("locale"));

  if (!vector) {
    return (
      <div className={styles.status} role="status">
        ベクトルデータが見つかりません。診断を受けると、心の色アート結果がここに届きます。
      </div>
    );
  }

  const params = new URLSearchParams();
  params.set("vector", vector.join(","));
  if (seed) {
    params.set("seed", seed);
  }
  if (locale !== "ja") {
    params.set("locale", locale);
  }
  const sharePath = `/result?${params.toString()}`;

  return (
    <LibertyResultContainer
      vector={vector}
      seed={seed}
      locale={locale}
      sharePath={sharePath}
    />
  );
};
