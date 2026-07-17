import Link from "next/link";
import {
  buildDiagnosisFaqJsonLd,
  buildDiagnosisLandingQuizJsonLd,
  DIAGNOSIS_FAQ,
  DIAGNOSIS_TYPE_EDITORIAL,
} from "@/lib/diagnosis/seoContent";
import { DIAGNOSTIC_QUESTION_COUNT } from "@/types/diagnosis";
import { DIAGNOSIS_RESULT_CATALOG } from "@/lib/diagnosis/resultCatalog";
import { PERSONALITY_CATEGORIES } from "@/types/diagnosis";
import styles from "./diagnosisSeo.module.css";

export function DiagnosisSeoSection() {
  const jsonLd = [buildDiagnosisLandingQuizJsonLd(), buildDiagnosisFaqJsonLd()];

  return (
    <section className={styles.seo} aria-labelledby="diagnosis-about">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={styles.inner}>
        <h2 id="diagnosis-about" className={styles.heading}>
          心の色診断とは
        </h2>
        <p className={styles.lead}>
          心の色診断は、LibertyCanvas が提供する無料の性格診断です。
          {DIAGNOSTIC_QUESTION_COUNT}問のやさしい質問に答えるだけで、
          「共感」「論理」「感性」「導き」の4つの軸から、あなたに近いタイプを見つけられます。
          診断結果はそのまま AI
          に構造化データとして渡され、あなただけのパーソナルアドバイスが生成されます。
          占いではなく、選択肢ごとに定義されたスコアを加算する透明なロジックで判定します。
        </p>

        <h3 className={styles.subheading}>4つの心の色タイプ</h3>
        <ul className={styles.typeGrid}>
          {PERSONALITY_CATEGORIES.map((category) => {
            const result = DIAGNOSIS_RESULT_CATALOG[category];
            const editorial = DIAGNOSIS_TYPE_EDITORIAL[category];

            return (
              <li key={category}>
                <article className={styles.typeCard}>
                  <h4 className={styles.typeTitle}>
                    <Link href={`/diagnosis/result/${category}`}>{result.title}</Link>
                  </h4>
                  <p className={styles.typeSubtitle}>{result.subtitle}</p>
                  <p className={styles.typeBody}>{editorial.overview}</p>
                  <Link
                    className={styles.typeLink}
                    href={`/diagnosis/result/${category}`}
                  >
                    {result.title}の詳細を見る
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>

        <h3 className={styles.subheading}>診断の流れ</h3>
        <ol className={styles.steps}>
          <li>
            「診断をはじめる」から{DIAGNOSTIC_QUESTION_COUNT}
            問の多肢選択に回答（所要約60秒）
          </li>
          <li>4軸スコアから dominant タイプを判定し、結果カードを表示</li>
          <li>希望すれば AI パーソナルアドバイスをストリーム受信</li>
          <li>結果 URL・OG 画像付きでシェア、または印刷して保存</li>
        </ol>

        <h3 className={styles.subheading}>よくある質問</h3>
        <dl className={styles.faqList}>
          {DIAGNOSIS_FAQ.map((entry) => (
            <div key={entry.question} className={styles.faqItem}>
              <dt className={styles.faqQuestion}>{entry.question}</dt>
              <dd className={styles.faqAnswer}>{entry.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
