import Link from "next/link";
import { PRODUCT_NAME } from "@/lib/brand/constants";
import {
  buildUnifiedDiscoveryCatalog,
  groupUnifiedDiscoveryCatalog,
} from "@/lib/catalog/unifiedDiscoveryCatalog";
import styles from "./plugDiscoveryStrip.module.css";

export const PlugDiscoveryStrip = async () => {
  const catalog = await buildUnifiedDiscoveryCatalog();
  const { plugOfficial } = groupUnifiedDiscoveryCatalog(catalog);

  return (
    <section className={styles.strip} aria-labelledby="plug-strip-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{PRODUCT_NAME} · Plug</p>
          <h2 id="plug-strip-heading" className={styles.title}>
            会話型・宇宙キャラ診断
          </h2>
          <p className={styles.lead}>
            24問の学術系からライト診断まで。結果は宇宙キャラクター化・AIアドバイス・シェア対応。
          </p>
        </header>
        <ul className={styles.grid} role="list">
          {plugOfficial.map((entry) => (
            <li key={entry.id}>
              <Link
                href={entry.href}
                className={styles.card}
                style={{ borderColor: `${entry.themeColor}44` }}
              >
                <span className={styles.cardEyebrow}>{entry.eyebrow}</span>
                <span className={styles.cardTitle}>{entry.title}</span>
                <span className={styles.cardMeta}>
                  {entry.questionCount}問 · 約{entry.estimatedMinutes}分
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/diagnosis" className={styles.catalogLink}>
          すべての診断カタログを見る →
        </Link>
      </div>
    </section>
  );
};
