"use client";

import { useEffect, useRef, useState } from "react";
import { isLocale } from "@/lib/i18n/config";
import {
  runtimeLocalizationSchema,
  toInitialUiText,
} from "@/lib/visual/runtimeLocalizerSchema";
import type {
  DiagnosticMasterData,
  LocalizedDiagnosticMeta,
  RuntimeLocalizationResult,
  RuntimeLocalizerLocale,
} from "@/types/runtimeLocalizer";
import styles from "./DiagnosticStartCard.module.css";

const DEFAULT_MASTER: DiagnosticMasterData = {
  title: "あなたの心の色診断",
  description:
    "5つのやさしい質問から、あなたらしさを見つけます。診断後には、AIがあなただけのアドバイスをお届けします。",
};

export interface DiagnosticStartCardProps {
  /** Locale from middleware / headers (`ja`, `en`, `fr`, …). */
  readonly lang: string;
  /** Optional master copy override (defaults to JA product seed). */
  readonly master?: DiagnosticMasterData;
  readonly onStart?: () => void;
  /** Skip network (tests / story wrappers). */
  readonly deferFetch?: boolean;
}

function resolveLocale(lang: string): RuntimeLocalizerLocale {
  return isLocale(lang) ? lang : "ja";
}

export const DiagnosticStartCard = ({
  lang,
  master = DEFAULT_MASTER,
  onStart,
  deferFetch = false,
}: DiagnosticStartCardProps) => {
  const locale = resolveLocale(lang);
  const [uiText, setUiText] = useState<LocalizedDiagnosticMeta>(() =>
    toInitialUiText(master, locale),
  );
  const [internalLog, setInternalLog] = useState<
    RuntimeLocalizationResult["internalReasoning"] | null
  >(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const masterKey = `${master.title}\0${master.description}`;

  useEffect(() => {
    setUiText(toInitialUiText(master, locale));
    // masterKey captures title/description identity without referential churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- masterKey is the content fingerprint
  }, [locale, masterKey]);

  useEffect(() => {
    if (deferFetch || locale === "ja") {
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const snapshot: DiagnosticMasterData = {
      title: master.title,
      description: master.description,
    };

    const performLocalization = async () => {
      setIsTranslating(true);
      setErrorMessage(null);

      try {
        const res = await fetch("/api/visual/localize-runtime", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ master: snapshot, lang: locale }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const payload: unknown = await res.json();
        const parsed = runtimeLocalizationSchema.safeParse(payload);

        if (!parsed.success) {
          throw new Error("Invalid localization payload");
        }

        setUiText(parsed.data.localizedOutput);
        setInternalLog(parsed.data.internalReasoning);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("[DiagnosticStartCard]", error);
        setErrorMessage("文言の適応に失敗しました。元の表現を表示しています。");
        setUiText(toInitialUiText(snapshot, locale));
      } finally {
        setIsTranslating(false);
      }
    };

    void performLocalization();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- masterKey is the content fingerprint
  }, [deferFetch, locale, masterKey]);

  const isDev = process.env.NODE_ENV === "development";
  const eyebrow = isTranslating ? "適応中…" : "性格診断";

  return (
    <div
      className={styles.root}
      role="group"
      aria-label={uiText.title}
      lang={locale}
    >
      <p className={styles.eyebrow}>{eyebrow}</p>

      <h1 className={styles.title}>{uiText.title}</h1>

      <p className={styles.description}>{uiText.description}</p>

      <button
        type="button"
        disabled={isTranslating}
        className={styles.startButton}
        aria-busy={isTranslating}
        onClick={() => {
          if (isTranslating) {
            return;
          }
          onStart?.();
        }}
      >
        {isTranslating ? "準備しています…" : uiText.startButtonText}
      </button>

      {errorMessage ? (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      ) : null}

      {isDev && internalLog ? (
        <details className={styles.cot}>
          <summary>Runtime i18n CoT (English Logic)</summary>
          <div className={styles.cotBody}>
            <p>
              <span className={styles.cotLabel}>[Cultural Adaptation]</span>{" "}
              {internalLog.culturalAdaptationAnalysisEnglish}
            </p>
            <p>
              <span className={styles.cotLabel}>[Tone Consistency]</span>{" "}
              {internalLog.toneConsistencyCheckEnglish}
            </p>
          </div>
        </details>
      ) : null}
    </div>
  );
};
