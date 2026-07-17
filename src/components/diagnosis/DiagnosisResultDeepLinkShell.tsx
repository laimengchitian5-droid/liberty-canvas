"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useEffect, useMemo, useState } from "react";

import { DiagnosisResultPage } from "@/components/diagnosis/DiagnosisResultPage";

import { trackDiagnosisEvent } from "@/lib/diagnosis/analytics";

import { buildCosmicCharacterSheet } from "@/lib/diagnosis/cosmicPlanetEngine";

import {
  readPlugResultSnapshot,
  rebuildOutcomeFromShareQuery,
  type PlugResultShareQuery,
} from "@/lib/diagnosis/plugResultShare";

import { useDiagnosisCompilerStore } from "@/store/diagnosisCompilerStore";

import type { PlugDiagnosisDefinition } from "@/types/diagnosisCompiler";

import styles from "./diagnosisResultPage.module.css";

interface DiagnosisResultDeepLinkShellProps {
  definition: PlugDiagnosisDefinition;

  shareQuery: PlugResultShareQuery | null;
}

export const DiagnosisResultDeepLinkShell = ({
  definition,

  shareQuery,
}: DiagnosisResultDeepLinkShellProps) => {
  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);

  const restored = useMemo(() => {
    if (!hydrated) {
      return null;
    }

    const snapshot = readPlugResultSnapshot(definition.slug);

    if (snapshot) {
      return {
        outcome: snapshot.outcome,

        cosmicSheet: snapshot.cosmicSheet,

        source: "snapshot" as const,
      };
    }

    if (shareQuery) {
      const outcome = rebuildOutcomeFromShareQuery(definition, shareQuery);

      if (outcome) {
        return {
          outcome,

          cosmicSheet: buildCosmicCharacterSheet(outcome.academicVector),

          source: "query" as const,
        };
      }
    }

    return null;
  }, [definition, shareQuery, hydrated]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !restored) {
      return;
    }

    trackDiagnosisEvent("plug_result_deeplink_view", {
      slug: definition.slug,

      source: restored.source,

      planet: shareQuery?.planet,
    });

    useDiagnosisCompilerStore.setState({
      cosmicSheet: restored.cosmicSheet,

      activePlanetKind: restored.cosmicSheet.planet.kind,

      planetRenderReady: true,

      outcome: restored.outcome,

      phase: "result",
    });
  }, [hydrated, restored, definition.slug, shareQuery?.planet]);

  useEffect(() => {
    if (!hydrated || restored) {
      return;
    }

    trackDiagnosisEvent("plug_result_deeplink_cta", {
      slug: definition.slug,

      hasQuery: Boolean(shareQuery),
    });
  }, [hydrated, restored, definition.slug, shareQuery]);

  if (!hydrated) {
    return (
      <div className={styles.resultPage} aria-busy="true" aria-live="polite">
        <p className={styles.sectionLead}>宇宙の結果を読み込んでいます…</p>
      </div>
    );
  }

  if (!restored) {
    const playPath = `/diagnosis/play/${definition.slug}`;

    return (
      <section
        className={styles.coldLinkShell}

        aria-labelledby="cold-link-heading"
      >
        <p className={styles.resultBadge}>コズミック結果リンク</p>

        <h1 id="cold-link-heading" className={styles.coldLinkTitle}>
          {definition.title}
        </h1>

        <p className={styles.sectionLead}>
          このリンクだけでは結果を表示できません。診断を受けると、あなただけの宇宙キャラクター結果ページが完成します。
        </p>

        <div className={styles.coldLinkActions} role="group" aria-label="診断へ進む">
          <Link
            href={playPath}

            className={styles.coldLinkPrimary}

            onClick={() =>
              trackDiagnosisEvent("plug_result_deeplink_cta", {
                slug: definition.slug,

                action: "start",
              })
            }
          >
            診断を始める
          </Link>

          <button
            type="button"

            className={styles.coldLinkSecondary}

            onClick={() => router.push("/diagnosis")}
          >
            診断一覧へ
          </button>
        </div>
      </section>
    );
  }

  return (
    <DiagnosisResultPage
      definition={definition}

      outcome={restored.outcome}

      onRestart={() => router.push(`/diagnosis/play/${definition.slug}`)}
    />
  );
};
