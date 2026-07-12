"use client";

import { Check, Copy, Printer, Share2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { trackDiagnosisEvent } from "@/lib/diagnosis/analytics";
import {
  buildDiagnosisResultPageUrl,
  buildDiagnosisShareText,
  resolveShareCopyVariant,
} from "@/lib/diagnosis/share";
import type { DiagnosisResult } from "@/types/diagnosis";
import styles from "./diagnosis.module.css";

interface DiagnosisShareActionsProps {
  result: DiagnosisResult;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function DiagnosisShareActions({ result }: DiagnosisShareActionsProps) {
  const [copied, setCopied] = useState<"text" | "link" | null>(null);
  const variant = useMemo(() => resolveShareCopyVariant(), []);
  const shareText = useMemo(
    () => buildDiagnosisShareText(result, variant),
    [result, variant],
  );
  const shareUrl = buildDiagnosisResultPageUrl(result.dominantCategory);

  const handleCopyText = useCallback(async () => {
    const ok = await copyText(shareText);
    if (ok) {
      trackDiagnosisEvent("diagnosis_share_copy", {
        category: result.dominantCategory,
        variant,
        target: "text",
      });
      setCopied("text");
      window.setTimeout(() => setCopied(null), 2000);
    }
  }, [result.dominantCategory, shareText, variant]);

  const handleCopyLink = useCallback(async () => {
    const ok = await copyText(shareUrl);
    if (ok) {
      trackDiagnosisEvent("diagnosis_share_copy", {
        category: result.dominantCategory,
        variant,
        target: "link",
      });
      setCopied("link");
      window.setTimeout(() => setCopied(null), 2000);
    }
  }, [result.dominantCategory, shareUrl, variant]);

  const handleNativeShare = useCallback(async () => {
    if (!navigator.share) {
      await handleCopyText();
      return;
    }

    try {
      await navigator.share({
        title: result.title,
        text: shareText,
        url: shareUrl,
      });
      trackDiagnosisEvent("diagnosis_share_native", {
        category: result.dominantCategory,
        variant,
      });
    } catch {
      // user cancelled
    }
  }, [handleCopyText, result.dominantCategory, result.title, shareText, shareUrl, variant]);

  const handlePrint = useCallback(() => {
    trackDiagnosisEvent("diagnosis_share_print", {
      category: result.dominantCategory,
      variant,
    });
    window.print();
  }, [result.dominantCategory, variant]);

  return (
    <div className={styles.sharePanel} aria-label="結果をシェア">
      <p className={styles.shareLead}>結果をシェア</p>
      <div className={styles.shareActions}>
        <button
          type="button"
          className={styles.shareButton}
          onClick={() => void handleNativeShare()}
        >
          <Share2 className={styles.shareIcon} aria-hidden="true" />
          シェア
        </button>
        <button
          type="button"
          className={styles.shareButton}
          onClick={() => void handleCopyText()}
        >
          {copied === "text" ? (
            <Check className={styles.shareIcon} aria-hidden="true" />
          ) : (
            <Copy className={styles.shareIcon} aria-hidden="true" />
          )}
          {copied === "text" ? "コピー済" : "文面コピー"}
        </button>
        <button
          type="button"
          className={styles.shareButton}
          onClick={() => void handleCopyLink()}
        >
          {copied === "link" ? (
            <Check className={styles.shareIcon} aria-hidden="true" />
          ) : (
            <Copy className={styles.shareIcon} aria-hidden="true" />
          )}
          {copied === "link" ? "コピー済" : "リンク"}
        </button>
        <button type="button" className={styles.shareButton} onClick={handlePrint}>
          <Printer className={styles.shareIcon} aria-hidden="true" />
          印刷
        </button>
      </div>
      <p className={styles.sharePreview}>{shareText}</p>
    </div>
  );
}
