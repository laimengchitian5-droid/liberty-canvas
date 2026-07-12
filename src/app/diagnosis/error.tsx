"use client";

import Link from "next/link";
import styles from "@/components/diagnosis/diagnosis.module.css";

export default function DiagnosisError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <div className={styles.card}>
          <p className={styles.resultBadge}>エラー</p>
          <h1 className={styles.resultTitle}>診断を続行できませんでした</h1>
          <p className={styles.resultAnalysis}>
            一時的な問題の可能性があります。もう一度お試しください。
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.primaryButton} onClick={reset}>
              再試行
            </button>
            <Link href="/diagnosis" className={styles.secondaryButton} style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              診断トップへ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
