import Link from "next/link";
import { Suspense } from "react";
import { PRODUCT_NAME, PRODUCT_TAGLINE_JA } from "@/lib/brand/constants";
import { buildUnifiedDiscoveryCatalog } from "@/lib/catalog/unifiedDiscoveryCatalog";
import { DiagnosisDiscoveryHubClient } from "@/components/diagnosis/DiagnosisDiscoveryHubClient";
import styles from "./diagnosisDiscoveryHub.module.css";

export const DiagnosisDiscoveryHub = async () => {
  const catalog = await buildUnifiedDiscoveryCatalog();

  return (
    <section className={styles.hub} aria-labelledby="discovery-hub-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{PRODUCT_NAME} Discovery</p>
          <h2 id="discovery-hub-heading" className={styles.title}>
            診断カタログ
          </h2>
          <p className={styles.lead}>{PRODUCT_TAGLINE_JA}</p>
        </header>

        <Suspense fallback={null}>
          <DiagnosisDiscoveryHubClient catalog={catalog} />
        </Suspense>

        <div className={styles.footerCta}>
          <Link href="/create" className={styles.createButton}>
            オリジナル診断を作る
          </Link>
          <Link href="/diagnosis/insights" className={styles.insightsLink}>
            シェア計測ダッシュボード
          </Link>
        </div>
      </div>
    </section>
  );
};
