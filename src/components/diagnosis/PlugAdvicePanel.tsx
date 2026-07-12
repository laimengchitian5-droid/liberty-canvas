"use client";

import { useEffect } from "react";
import { AdviceSkeleton } from "@/components/diagnosis/AdviceSkeleton";
import { trackDiagnosisEvent, readDiagnosisRef } from "@/lib/diagnosis/analytics";
import { buildPlugAdviceRequestBody } from "@/lib/diagnosis/buildPlugAdvicePrompt";
import type { CosmicCharacterSheet } from "@/lib/diagnosis/cosmicPlanetEngine";
import { useAdviceStream } from "@/hooks/useAdviceStream";
import type {
  LegallySafeDiagnosisOutcome,
  PlugDiagnosisAdviceRequestBody,
} from "@/types/diagnosisCompiler";
import type { ResultLocaleMessages } from "@/lib/diagnosis/resultLocalesCore";
import styles from "./diagnosisResultPage.module.css";

interface PlugAdvicePanelProps {
  slug: string;
  diagnosisTitle: string;
  outcome: LegallySafeDiagnosisOutcome;
  cosmicSheet: CosmicCharacterSheet;
  messages: Pick<
    ResultLocaleMessages,
    "adviceTitle" | "adviceLead" | "adviceTipLabel" | "adviceAffirmationLabel"
  >;
}

export const PlugAdvicePanel = ({
  slug,
  diagnosisTitle,
  outcome,
  cosmicSheet,
  messages,
}: PlugAdvicePanelProps) => {
  const { rawText, advice, isStreaming, errorMessage, startStream, reset } =
    useAdviceStream();

  useEffect(() => {
    const payload: PlugDiagnosisAdviceRequestBody = buildPlugAdviceRequestBody({
      slug,
      diagnosisTitle,
      outcome,
      cosmicSheet,
    });

    trackDiagnosisEvent("plug_result_advice_opened", {
      slug,
      ref: readDiagnosisRef(),
      planet: cosmicSheet.planet.kind,
    });

    void startStream(payload);

    return () => {
      reset();
    };
  }, [
    cosmicSheet,
    diagnosisTitle,
    outcome,
    reset,
    slug,
    startStream,
  ]);

  useEffect(() => {
    if (advice) {
      trackDiagnosisEvent("plug_result_advice_completed", {
        slug,
        ref: readDiagnosisRef(),
        planet: cosmicSheet.planet.kind,
      });
    }
  }, [advice, cosmicSheet.planet.kind, slug]);

  return (
    <section className={styles.adviceSection} aria-labelledby="plug-advice-heading">
      <h3 id="plug-advice-heading" className={styles.sectionTitle}>
        {messages.adviceTitle}
      </h3>
      <p className={styles.sectionLead}>{messages.adviceLead}</p>

      <div aria-live="polite">
        {isStreaming && !advice ? (
          <>
            <AdviceSkeleton />
            {rawText ? <p className={styles.analysisParagraph}>{rawText}</p> : null}
          </>
        ) : null}

        {advice ? (
          <div className={styles.adviceBody}>
            <p className={styles.analysisParagraph}>{advice.personalizedAdvice}</p>
            <div className={styles.adviceTipCard}>
              <strong>{messages.adviceTipLabel}</strong>
              <p className={styles.analysisParagraph}>{advice.dailyTip}</p>
            </div>
            <div className={styles.adviceAffirmationCard}>
              <strong>{messages.adviceAffirmationLabel}</strong>
              <p className={styles.analysisParagraph}>{advice.affirmation}</p>
            </div>
          </div>
        ) : null}

        {errorMessage ? (
          <p className={styles.analysisParagraph} role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </section>
  );
};
