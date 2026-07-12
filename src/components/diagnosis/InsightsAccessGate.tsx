"use client";

import { useState } from "react";
import styles from "./insightsAccessGate.module.css";

export const InsightsAccessGate = () => {
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/diagnosis/analytics/insights-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(payload?.error ?? "認証に失敗しました");
        return;
      }

      window.location.reload();
    } catch {
      setError("接続に失敗しました");
    } finally {
      setPending(false);
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.panel} onSubmit={(event) => void handleSubmit(event)}>
        <p className={styles.eyebrow}>Insights · Restricted</p>
        <h1 className={styles.title}>運用ダッシュボード</h1>
        <p className={styles.lead}>
          シェア計測とBuilder監査ログは運用キーが必要です。
        </p>
        <label className={styles.field}>
          アクセスキー
          <input
            className={styles.input}
            type="password"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            autoComplete="off"
            required
          />
        </label>
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className={styles.button} disabled={pending}>
          {pending ? "確認中…" : "ダッシュボードを開く"}
        </button>
      </form>
    </main>
  );
};
