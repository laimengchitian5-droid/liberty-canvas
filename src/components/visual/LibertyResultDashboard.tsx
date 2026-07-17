"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { CognitiveArtCanvas } from "@/components/visual/CognitiveArtCanvas";
import { PRODUCT_NAME } from "@/lib/brand/constants";
import { getSiteUrl } from "@/lib/site/url";
import {
  intensityFromVector,
  toCognitiveArtVector,
} from "@/lib/visual/cognitiveArt";
import { exportCanvasPng } from "@/lib/visual/exportCognitiveArt";
import styles from "./LibertyResultDashboard.module.css";

export interface LibertyResultDashboardProps {
  /** Cosmic / spectrum archetype display name — never MBTI codes. */
  readonly characterName: string;
  /** Abstract 1–7 axes (length flexible; normalized to 8). */
  readonly vector: readonly number[];
  /** Affirming AI copy (locale-native). */
  readonly aiAdvice: string;
  /** Optional soft intensity 0–100 (not a clinical/focus metric label). */
  readonly energy?: number;
  /** Soft catchphrase for color energy (from AI localizedOutput). */
  readonly energyLabel?: string;
  readonly sharePath?: string;
}

/**
 * Adult-Cute result dashboard: art + affirming advice + zero-friction PNG share.
 * Rejects brutal/FOMO/MBTI/Kraepelin framing from greenfield drafts.
 */
export const LibertyResultDashboard = ({
  characterName,
  vector,
  aiAdvice,
  energy,
  energyLabel,
  sharePath = "/result",
}: LibertyResultDashboardProps) => {
  const artRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const axes = toCognitiveArtVector(vector, characterName);
  const resolvedEnergy = energy ?? intensityFromVector(axes);

  const handleExportAndShare = useCallback(async () => {
    const canvas = artRef.current?.querySelector("canvas");
    if (!canvas || isExporting) {
      return;
    }

    setIsExporting(true);
    const siteUrl = getSiteUrl();
    const path = sharePath.startsWith("/") ? sharePath : `/${sharePath}`;
    const safeName = characterName
      .replace(/[^\w\u3040-\u30ff\u4e00-\u9fff-]+/g, "_")
      .slice(0, 40);

    await exportCanvasPng({
      canvas,
      filename: `liberty-canvas-${safeName || "art"}.png`,
      shareTitle: `${PRODUCT_NAME} · ${characterName}`,
      shareText: `${PRODUCT_NAME}の宇宙キャラ結果は「${characterName}」。心の色アートも保存できるよ。ログイン不要・無料。 #${PRODUCT_NAME.replace(/\s/g, "")}`,
      shareUrl: `${siteUrl}${path}`,
    });

    setIsExporting(false);
  }, [characterName, isExporting, sharePath]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.brand}>{PRODUCT_NAME}</p>
        <Link href="/chat" className={styles.chatLink}>
          AIチャットへ行く
        </Link>
      </header>

      <main className={styles.grid}>
        <section className={styles.artColumn} ref={artRef} aria-label="心の色アート">
          <CognitiveArtCanvas
            vector={axes}
            intensity={resolvedEnergy}
            seed={characterName}
            label="心の色アート · Cognitive color art"
          />
          <button
            type="button"
            className={styles.exportBtn}
            onClick={() => void handleExportAndShare()}
            disabled={isExporting}
          >
            {isExporting ? "画像を生成中…" : "アートを保存・シェアする"}
          </button>
        </section>

        <section className={styles.copyColumn} aria-label="診断リビール">
          <p className={styles.eyebrow}>Cosmic Profile</p>
          <h1 className={styles.title}>{characterName}</h1>
          <p className={styles.energy}>
            {energyLabel ?? "彩度エネルギー"}{" "}
            <span className={styles.energyValue}>{resolvedEnergy}</span>
            <span className={styles.energyUnit}> / 100</span>
          </p>

          <div className={styles.adviceBlock}>
            <h2 className={styles.adviceHeading}>AI全肯定アドバイス</h2>
            <p className={styles.adviceBody}>{aiAdvice}</p>
          </div>
        </section>
      </main>
    </div>
  );
};
