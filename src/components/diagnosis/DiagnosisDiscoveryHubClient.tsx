"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { filterUnifiedCatalogByQuery } from "@/lib/catalog/searchUnifiedCatalog";
import {
  groupUnifiedDiscoveryCatalog,
  type UnifiedDiscoveryEntry,
} from "@/lib/catalog/unifiedDiscoveryTypes";
import {
  SPECIALTY_SERIES_EYEBROW,
  SPECIALTY_SERIES_LEAD,
} from "@/lib/specialty/specialtyHubCatalog";
import { appendSearchRefToHref } from "@/lib/seo/searchIntent";
import { HubSearchBar } from "@/components/catalog/HubSearchBar";
import styles from "./diagnosisDiscoveryHub.module.css";

interface DiagnosisDiscoveryHubClientProps {
  catalog: UnifiedDiscoveryEntry[];
}

export const DiagnosisDiscoveryHubClient = ({
  catalog,
}: DiagnosisDiscoveryHubClientProps) => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const filtered = useMemo(
    () => filterUnifiedCatalogByQuery(catalog, query),
    [catalog, query],
  );

  const { specialtySeries, plugOfficial, plugCommunity, rubelQuick } =
    groupUnifiedDiscoveryCatalog(filtered);

  const renderGrid = (entries: UnifiedDiscoveryEntry[], eyebrow?: string) => (
    <ul className={styles.grid} role="list">
      {entries.map((entry) => {
        const href =
          query.trim().length > 0
            ? appendSearchRefToHref(entry.href, entry.slug)
            : entry.href;

        return (
          <li key={entry.id}>
            <Link
              href={href}
              className={styles.card}
              style={{ borderColor: `${entry.themeColor}44` }}
            >
              <span className={styles.cardEyebrow}>{eyebrow ?? entry.eyebrow}</span>
              <span className={styles.cardTitle}>{entry.title}</span>
              <span className={styles.cardSubtitle}>{entry.subtitle}</span>
              <span className={styles.cardMeta}>
                {entry.questionCount}問 · 約{entry.estimatedMinutes}分
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <HubSearchBar
        placeholder="診断を検索（日本語・English・semantic）"
        ariaLabel="診断カタログ検索"
      />

      {query && filtered.length === 0 ? (
        <p className={styles.emptyCommunity}>
          「{query}」に一致する診断は見つかりませんでした。
        </p>
      ) : null}

      {specialtySeries.length > 0 ? (
        <div className={styles.sectionBlock}>
          <h3 className={styles.sectionTitle}>{SPECIALTY_SERIES_EYEBROW}</h3>
          <p className={styles.seriesLead}>{SPECIALTY_SERIES_LEAD}</p>
          {renderGrid(specialtySeries, "世界9カ国")}
        </div>
      ) : null}

      {plugOfficial.length > 0 ? (
        <div className={styles.sectionBlock}>
          <h3 className={styles.sectionTitle}>公式 Plug 診断</h3>
          {renderGrid(plugOfficial)}
        </div>
      ) : null}

      {rubelQuick.length > 0 ? (
        <div className={styles.sectionBlock}>
          <h3 className={styles.sectionTitle}>1問クイック診断</h3>
          {renderGrid(rubelQuick.slice(0, 12))}
        </div>
      ) : null}

      {plugCommunity.length > 0 ? (
        <div className={styles.sectionBlock}>
          <h3 className={styles.sectionTitle}>コミュニティ公開</h3>
          {renderGrid(plugCommunity, "Community")}
        </div>
      ) : null}
    </>
  );
};
