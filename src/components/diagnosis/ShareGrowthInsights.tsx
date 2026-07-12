"use client";

import { useEffect, useMemo, useState } from "react";
import {
  readDiagnosisEventLog,
  readDiagnosisRef,
} from "@/lib/diagnosis/analytics";
import { summarizeShareGrowthEvents } from "@/lib/diagnosis/plugShareGrowth";
import type { ResultLocaleMessages } from "@/lib/diagnosis/resultLocalesCore";
import styles from "./diagnosisResultPage.module.css";

interface ShareGrowthInsightsProps {
  slug: string;
  messages: Pick<ResultLocaleMessages, "shareInsightsTitle">;
}

export const ShareGrowthInsights = ({ slug, messages }: ShareGrowthInsightsProps) => {
  const [serverSummary, setServerSummary] = useState<Record<string, number>>({});

  const localSummary = useMemo(() => {
    const events = readDiagnosisEventLog().filter((entry) => entry.slug === slug);
    return summarizeShareGrowthEvents(events);
  }, [slug]);

  useEffect(() => {
    void fetch(`/api/diagnosis/analytics/events?slug=${encodeURIComponent(slug)}`, {
      cache: "no-store",
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { summary?: Record<string, number> } | null) => {
        if (payload?.summary) {
          setServerSummary(payload.summary);
        }
      })
      .catch(() => {
        // local summary still available
      });
  }, [slug]);

  const summary = useMemo(() => {
    const merged = { ...localSummary };

    for (const [event, count] of Object.entries(serverSummary)) {
      merged[event] = (merged[event] ?? 0) + count;
    }

    return merged;
  }, [localSummary, serverSummary]);

  const ref = readDiagnosisRef();
  const entries = Object.entries(summary);

  if (entries.length === 0 && !ref) {
    return null;
  }

  return (
    <details className={styles.shareGrowthPanel}>
      <summary className={styles.shareGrowthSummary}>
        {messages.shareInsightsTitle}
      </summary>
      <div className={styles.shareGrowthBody}>
        {ref ? (
          <p className={styles.shareGrowthLine}>
            参照元: <code>{ref}</code>
          </p>
        ) : null}
        {entries.length === 0 ? (
          <p className={styles.shareGrowthLine}>まだシェアイベントは記録されていません。</p>
        ) : (
          <ul className={styles.shareGrowthList}>
            {entries.map(([event, count]) => (
              <li key={event}>
                {event}: {count}
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  );
};
