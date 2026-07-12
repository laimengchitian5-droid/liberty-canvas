import type { Metadata } from "next";
import { cookies } from "next/headers";
import { buildAnalyticsInsights } from "@/lib/diagnosis/analyticsInsights";
import { listBuilderAuditEntries } from "@/lib/builder/auditLog";
import { isInsightsAllowedFromCookies } from "@/lib/auth/verifyInsightsAccess";
import { InsightsAccessGate } from "@/components/diagnosis/InsightsAccessGate";
import { PRODUCT_NAME } from "@/lib/brand/constants";
import styles from "./insights.module.css";

export const metadata: Metadata = {
  title: `診断インサイト — シェア計測ダッシュボード | ${PRODUCT_NAME}`,
  description: "Plug診断のシェアイベント・variant別パフォーマンス・Builder監査ログ",
  robots: { index: false, follow: false },
};

export default async function DiagnosisInsightsPage() {
  const allowed = await isInsightsAllowedFromCookies(cookies());

  if (!allowed) {
    return <InsightsAccessGate />;
  }

  const [insights, auditLog] = await Promise.all([
    buildAnalyticsInsights(),
    listBuilderAuditEntries(30),
  ]);

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Analytics · Audit</p>
          <h1 className={styles.title}>診断インサイト</h1>
          <p className={styles.lead}>
            サーバー側に集計されたシェアイベントと、Builder 公開監査ログです（開発・運用確認用）。
          </p>
        </header>

        <section className={styles.panel} aria-labelledby="funnel-heading">
          <h2 id="funnel-heading" className={styles.panelTitle}>
            シェアファネル KPI
          </h2>
          <ul className={styles.kpiGrid}>
            <li className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Discover ref</span>
              <strong className={styles.kpiValue}>{insights.funnel.discoverRefs}</strong>
            </li>
            <li className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Play 開始</span>
              <strong className={styles.kpiValue}>{insights.funnel.playStarts}</strong>
            </li>
            <li className={styles.kpiCard}>
              <span className={styles.kpiLabel}>結果表示</span>
              <strong className={styles.kpiValue}>{insights.funnel.resultViews}</strong>
            </li>
            <li className={styles.kpiCard}>
              <span className={styles.kpiLabel}>シェア</span>
              <strong className={styles.kpiValue}>{insights.funnel.shareEvents}</strong>
            </li>
            <li className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Ref→Play 率</span>
              <strong className={styles.kpiValue}>
                {insights.funnel.refToPlayRate !== null
                  ? `${insights.funnel.refToPlayRate}%`
                  : "—"}
              </strong>
            </li>
            <li className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Share 率</span>
              <strong className={styles.kpiValue}>
                {insights.funnel.shareRate !== null
                  ? `${insights.funnel.shareRate}%`
                  : "—"}
              </strong>
            </li>
          </ul>
        </section>

        <section className={styles.panel} aria-labelledby="totals-heading">
          <h2 id="totals-heading" className={styles.panelTitle}>
            イベント合計
          </h2>
          <ul className={styles.metricList}>
            {Object.entries(insights.totals).map(([event, count]) => (
              <li key={event}>
                <span>{event}</span>
                <strong>{count}</strong>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.panel} aria-labelledby="variant-heading">
          <h2 id="variant-heading" className={styles.panelTitle}>
            Variant 別パフォーマンス
          </h2>
          {insights.variantReports.length === 0 ? (
            <p className={styles.empty}>variant データはまだありません。</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Variant</th>
                  <th scope="col">Share</th>
                  <th scope="col">Advice</th>
                </tr>
              </thead>
              <tbody>
                {insights.variantReports.map((row) => (
                  <tr key={row.variant}>
                    <td>{row.variant}</td>
                    <td>{row.shareEvents}</td>
                    <td>{row.adviceOpens}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className={styles.panel} aria-labelledby="slug-heading">
          <h2 id="slug-heading" className={styles.panelTitle}>
            Slug 別内訳
          </h2>
          {Object.keys(insights.bySlug).length === 0 ? (
            <p className={styles.empty}>slug 別データはまだありません。</p>
          ) : (
            <div className={styles.slugGrid}>
              {Object.entries(insights.bySlug).map(([slug, counts]) => (
                <article key={slug} className={styles.slugCard}>
                  <h3 className={styles.slugName}>{slug}</h3>
                  <ul className={styles.metricList}>
                    {Object.entries(counts).map(([event, count]) => (
                      <li key={event}>
                        <span>{event}</span>
                        <strong>{count}</strong>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className={styles.panel} aria-labelledby="audit-heading">
          <h2 id="audit-heading" className={styles.panelTitle}>
            Builder 監査ログ
          </h2>
          {auditLog.length === 0 ? (
            <p className={styles.empty}>監査ログはまだありません。</p>
          ) : (
            <ul className={styles.auditList}>
              {auditLog.map((entry) => (
                <li key={`${entry.at}-${entry.recordId}-${entry.action}`}>
                  <time dateTime={new Date(entry.at).toISOString()}>
                    {new Date(entry.at).toLocaleString("ja-JP")}
                  </time>
                  <span>{entry.action}</span>
                  <code>{entry.slug}</code>
                  <span className={styles.auditCreator}>{entry.creatorId}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
