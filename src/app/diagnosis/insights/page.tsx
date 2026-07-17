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
            サーバー側に集計されたシェアイベントと、Builder
            公開監査ログです（開発・運用確認用）。
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

        <section className={styles.panel} aria-labelledby="search-heading">
          <h2 id="search-heading" className={styles.panelTitle}>
            検索 / クローラー分析
          </h2>
          <ul className={styles.kpiGrid}>
            <li className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Catalog Search</span>
              <strong className={styles.kpiValue}>{insights.search.totalSearches}</strong>
            </li>
            <li className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Crawler Visits</span>
              <strong className={styles.kpiValue}>{insights.search.crawlerVisits}</strong>
            </li>
          </ul>
          {insights.search.topQueries.length > 0 ? (
            <ul className={styles.metricList}>
              {insights.search.topQueries.map((row) => (
                <li key={row.query}>
                  <span>{row.query}</span>
                  <strong>{row.count}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>検索クエリはまだありません。</p>
          )}
          {Object.keys(insights.search.backendCounts).length > 0 ? (
            <ul className={styles.metricList}>
              {Object.entries(insights.search.backendCounts).map(([backend, count]) => (
                <li key={backend}>
                  <span>backend: {backend}</span>
                  <strong>{count}</strong>
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <section className={styles.panel} aria-labelledby="bridge-heading">
          <h2 id="bridge-heading" className={styles.panelTitle}>
            Liberty Play → Liberty Plug ブリッジ
          </h2>
          <ul className={styles.kpiGrid}>
            <li className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Impression</span>
              <strong className={styles.kpiValue}>{insights.bridge.impressions}</strong>
            </li>
            <li className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Click</span>
              <strong className={styles.kpiValue}>{insights.bridge.clicks}</strong>
            </li>
            <li className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Handoff</span>
              <strong className={styles.kpiValue}>
                {insights.bridge.handoffsReceived}
              </strong>
            </li>
            <li className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Plug 開始</span>
              <strong className={styles.kpiValue}>
                {insights.bridge.plugStartsFromBridge}
              </strong>
            </li>
            <li className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Click→Play 率</span>
              <strong className={styles.kpiValue}>
                {insights.bridge.clickToPlayRate !== null
                  ? `${insights.bridge.clickToPlayRate}%`
                  : "—"}
              </strong>
            </li>
          </ul>
        </section>

        <section className={styles.panel} aria-labelledby="specialty-bridge-heading">
          <h2 id="specialty-bridge-heading" className={styles.panelTitle}>
            世界名産 B→C ブリッジ
          </h2>
          <ul className={styles.kpiGrid}>
            <li className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Impression</span>
              <strong className={styles.kpiValue}>
                {insights.specialtyBridge.impressions}
              </strong>
            </li>
            <li className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Click</span>
              <strong className={styles.kpiValue}>
                {insights.specialtyBridge.clicks}
              </strong>
            </li>
            <li className={styles.kpiCard}>
              <span className={styles.kpiLabel}>深掘り Play 開始</span>
              <strong className={styles.kpiValue}>
                {insights.specialtyBridge.deepPlayStarts}
              </strong>
            </li>
            <li className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Click→Play 率</span>
              <strong className={styles.kpiValue}>
                {insights.specialtyBridge.clickToPlayRate !== null
                  ? `${insights.specialtyBridge.clickToPlayRate}%`
                  : "—"}
              </strong>
            </li>
          </ul>
          {insights.specialtyBridge.byCountry.length > 0 ? (
            <ul className={styles.metricList}>
              {insights.specialtyBridge.byCountry.map((row) => (
                <li key={row.countryId}>
                  <span>
                    {row.countryId} — click {row.clicks} / play {row.deepPlayStarts}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>国別ブリッジデータはまだありません。</p>
          )}
        </section>

        <section className={styles.panel} aria-labelledby="ref-heading">
          <h2 id="ref-heading" className={styles.panelTitle}>
            Ref 別トラフィック
          </h2>
          {Object.keys(insights.byRef).length === 0 ? (
            <p className={styles.empty}>ref データはまだありません。</p>
          ) : (
            <ul className={styles.metricList}>
              {Object.entries(insights.byRef)
                .sort((left, right) => right[1] - left[1])
                .map(([ref, count]) => (
                  <li key={ref}>
                    <span>{ref}</span>
                    <strong>{count}</strong>
                  </li>
                ))}
            </ul>
          )}
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
