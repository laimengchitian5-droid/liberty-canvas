"use client";

import { Check, Copy, Download, RotateCcw, Share2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { CosmicPlanetVisual } from "@/components/diagnosis/CosmicPlanetVisual";
import { CosmicPlanetGallery } from "@/components/diagnosis/CosmicPlanetGallery";
import { PlugAdvicePanel } from "@/components/diagnosis/PlugAdvicePanel";
import { ShareGrowthInsights } from "@/components/diagnosis/ShareGrowthInsights";
import { COMPILER_UI_MESSAGES } from "@/lib/diagnosis/compilerMessages";
import {
  readDiagnosisRef,
  trackDiagnosisEvent,
} from "@/lib/diagnosis/analytics";
import { buildCosmicCharacterSheet } from "@/lib/diagnosis/cosmicPlanetEngine";
import type { CosmicPlanetKind } from "@/lib/diagnosis/cosmicPlanetEngine";
import {
  buildPlugShareText,
  resolvePlugShareCopyVariant,
  trackShareVariantPayload,
} from "@/lib/diagnosis/plugShareGrowth";
import {
  buildPlugResultShareUrl,
  persistPlugResultSnapshot,
} from "@/lib/diagnosis/plugResultShare";
import {
  getResultLocaleMessages,
  resolveResultLocale,
} from "@/lib/diagnosis/resultLocales";
import { useDiagnosisCompilerStore } from "@/store/diagnosisCompilerStore";
import { cn } from "@/lib/utils/cn";
import type { BuilderDiagnosisDefinition } from "@/types/builder";
import type {
  LegallySafeDiagnosisOutcome,
  PlugDiagnosisDefinition,
  ViralSharePreset,
} from "@/types/diagnosisCompiler";
import styles from "./diagnosisResultPage.module.css";

export interface DiagnosisResultPageProps {
  definition: PlugDiagnosisDefinition | BuilderDiagnosisDefinition;
  outcome: LegallySafeDiagnosisOutcome;
  onRestart: () => void;
}

function resolveShareUrl(
  definition: PlugDiagnosisDefinition | BuilderDiagnosisDefinition,
  outcome: LegallySafeDiagnosisOutcome,
  planetKind: string,
): string {
  const slug = definition.slug;
  return buildPlugResultShareUrl(slug, outcome, planetKind as CosmicPlanetKind);
}

function buildCosmicShareText(
  definition: PlugDiagnosisDefinition | BuilderDiagnosisDefinition,
  outcome: LegallySafeDiagnosisOutcome,
  cosmicNickname: string,
  shareHashtag: string,
  shareUrl: string,
  variant = resolvePlugShareCopyVariant(),
): string {
  return buildPlugShareText({
    definition,
    outcome,
    cosmicNickname,
    shareHashtag,
    shareUrl,
    variant,
  });
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

const ViralSharePanel = ({
  definition,
  outcome,
  presets,
  cosmicNickname,
  shareHashtag,
  shareUrl,
  planetKind,
}: {
  definition: PlugDiagnosisDefinition | BuilderDiagnosisDefinition;
  outcome: LegallySafeDiagnosisOutcome;
  presets: readonly ViralSharePreset[];
  cosmicNickname: string;
  shareHashtag: string;
  shareUrl: string;
  planetKind: string;
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const shareVariant = useMemo(() => resolvePlugShareCopyVariant(), []);

  const shareText = useMemo(
    () =>
      buildCosmicShareText(
        definition,
        outcome,
        cosmicNickname,
        shareHashtag,
        shareUrl,
        shareVariant,
      ),
    [definition, outcome, cosmicNickname, shareHashtag, shareUrl, shareVariant],
  );

  const shareMeta = useMemo(
    () => ({
      ref: readDiagnosisRef(),
      ...trackShareVariantPayload(shareVariant, planetKind as CosmicPlanetKind),
    }),
    [planetKind, shareVariant],
  );

  const handleXShare = useCallback(() => {
    trackDiagnosisEvent("plug_result_share_x", {
      slug: definition.slug,
      planet: planetKind,
      archetypeId: outcome.winningArchetype.id,
      ...shareMeta,
    });
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(intent, "_blank", "noopener,noreferrer");
  }, [definition.slug, outcome.winningArchetype.id, planetKind, shareMeta, shareText]);

  const handleCopy = useCallback(async () => {
    const ok = await copyText(shareText);

    if (ok) {
      trackDiagnosisEvent("plug_result_share_copy", {
        slug: definition.slug,
        planet: planetKind,
        target: "text",
        ...shareMeta,
      });
      setCopiedId("text");
      window.setTimeout(() => setCopiedId(null), 2000);
    }
  }, [definition.slug, planetKind, shareMeta, shareText]);

  const handleCopyLink = useCallback(async () => {
    const ok = await copyText(shareUrl);

    if (ok) {
      trackDiagnosisEvent("plug_result_share_link", {
        slug: definition.slug,
        planet: planetKind,
        target: "link",
        ...shareMeta,
      });
      setCopiedId("link");
      window.setTimeout(() => setCopiedId(null), 2000);
    }
  }, [definition.slug, planetKind, shareMeta, shareUrl]);

  const handlePrint = useCallback(() => {
    trackDiagnosisEvent("plug_result_share_print", {
      slug: definition.slug,
      planet: planetKind,
      ...shareMeta,
    });
    window.print();
  }, [definition.slug, planetKind, shareMeta]);

  return (
    <section className={styles.shareSection} aria-label="結果をシェア">
      <h3 className={styles.sectionTitle}>{COMPILER_UI_MESSAGES.shareLead}</h3>
      <div className={styles.shareActions}>
        <button type="button" className={styles.shareButtonPrimary} onClick={handleXShare}>
          <Share2 className={styles.shareIcon} aria-hidden="true" />
          {COMPILER_UI_MESSAGES.shareXLabel}
        </button>

        <button type="button" className={styles.shareButton} onClick={() => void handleCopy()}>
          {copiedId === "text" ? (
            <Check className={styles.shareIcon} aria-hidden="true" />
          ) : (
            <Copy className={styles.shareIcon} aria-hidden="true" />
          )}
          {copiedId === "text"
            ? COMPILER_UI_MESSAGES.copied
            : COMPILER_UI_MESSAGES.shareCopyLabel}
        </button>

        <button type="button" className={styles.shareButton} onClick={() => void handleCopyLink()}>
          {copiedId === "link" ? (
            <Check className={styles.shareIcon} aria-hidden="true" />
          ) : (
            <Copy className={styles.shareIcon} aria-hidden="true" />
          )}
          {copiedId === "link"
            ? COMPILER_UI_MESSAGES.copied
            : COMPILER_UI_MESSAGES.shareLinkLabel}
        </button>

        {presets.some((entry) => entry.kind === "image_download") ? (
          <button type="button" className={styles.shareButton} onClick={handlePrint}>
            <Download className={styles.shareIcon} aria-hidden="true" />
            {COMPILER_UI_MESSAGES.shareSaveLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
};

export const DiagnosisResultPage = ({
  definition,
  outcome,
  onRestart,
}: DiagnosisResultPageProps) => {
  const { cosmicSheet, activePlanetKind, planetRenderReady } =
    useDiagnosisCompilerStore(
      useShallow((state) => ({
        cosmicSheet: state.cosmicSheet,
        activePlanetKind: state.activePlanetKind,
        planetRenderReady: state.planetRenderReady,
      })),
    );

  const fallbackSheet = useMemo(
    () => buildCosmicCharacterSheet(outcome.academicVector),
    [outcome.academicVector],
  );

  const sheet = cosmicSheet ?? fallbackSheet;
  const planetKind = activePlanetKind ?? sheet.planet.kind;
  const renderReady = planetRenderReady || Boolean(cosmicSheet);
  const localeMessages = useMemo(
    () => getResultLocaleMessages(resolveResultLocale()),
    [],
  );

  const shareUrl = useMemo(
    () => resolveShareUrl(definition, outcome, planetKind),
    [definition, outcome, planetKind],
  );

  useEffect(() => {
    if (!cosmicSheet && outcome) {
      const computed = buildCosmicCharacterSheet(outcome.academicVector);
      useDiagnosisCompilerStore.setState({
        cosmicSheet: computed,
        activePlanetKind: computed.planet.kind,
        planetRenderReady: true,
      });
    }
  }, [cosmicSheet, outcome]);

  useEffect(() => {
    persistPlugResultSnapshot(definition.slug, outcome, sheet);
  }, [definition.slug, outcome, sheet]);

  const archetype = outcome.winningArchetype;
  const { narrative } = sheet;

  return (
    <article
      id="plug-diagnosis-result"
      className={styles.resultPage}
      style={{ borderColor: `${archetype.themeColor}33` }}
    >
      <header className={styles.heroSection}>
        <p className={styles.resultBadge}>{COMPILER_UI_MESSAGES.resultBadge}</p>
        <p className={styles.sectionEyebrow}>{localeMessages.cosmicEyebrow}</p>
        <h2 className={cn(styles.resultTitle, "font-serif")}>{sheet.planet.nickname}</h2>
        <p className={styles.resultSubtitle}>{archetype.subtitle}</p>
        {archetype.affirmationLine ? (
          <p className={styles.affirmationHero}>{archetype.affirmationLine}</p>
        ) : (
          <p className={styles.affirmationHero}>
            あなたの星は、今この瞬間も宇宙のどこかで静かに輝いています。その光のままで、十分に美しい存在です。
          </p>
        )}
      </header>

      <CosmicPlanetVisual
        sheet={sheet}
        activePlanetKind={planetKind}
        renderReady={renderReady}
      />

      <CosmicPlanetGallery
        vector={outcome.academicVector}
        activePlanetKind={planetKind}
        messages={localeMessages}
        onPreviewKind={(kind) =>
          trackDiagnosisEvent("plug_result_gallery_preview", {
            slug: definition.slug,
            planet: kind,
            ref: readDiagnosisRef(),
          })
        }
      />

      <section className={styles.analysisSection} aria-labelledby="analysis-heading">
        <h3 id="analysis-heading" className={styles.sectionTitle}>
          {localeMessages.narrativeTitle}
        </h3>
        <p className={styles.sectionLead}>{localeMessages.narrativeLead}</p>
        <div className={styles.analysisBody}>
          <p className={styles.analysisParagraph}>{narrative.strengths}</p>
          <p className={styles.analysisParagraph}>{narrative.stressBehavior}</p>
          <p className={styles.analysisParagraph}>{archetype.analysis}</p>
        </div>
      </section>

      <section className={styles.compatibilitySection} aria-labelledby="compat-heading">
        <h3 id="compat-heading" className={styles.sectionTitle}>
          {localeMessages.compatibilityTitle}
        </h3>
        <p className={styles.compatibilityHint}>
          {archetype.compatibilityHint ?? narrative.universalCompatibility}
        </p>
      </section>

      <PlugAdvicePanel
        slug={definition.slug}
        diagnosisTitle={definition.title}
        outcome={outcome}
        cosmicSheet={sheet}
        messages={localeMessages}
      />

      <ViralSharePanel
        definition={definition}
        outcome={outcome}
        presets={outcome.viralPresets}
        cosmicNickname={sheet.planet.nickname}
        shareHashtag={sheet.shareHashtag}
        shareUrl={shareUrl}
        planetKind={planetKind}
      />

      <ShareGrowthInsights slug={definition.slug} messages={localeMessages} />

      <div className={styles.actions}>
        <button
          type="button"
          className={cn(styles.secondaryButton, "gap-2")}
          onClick={onRestart}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {COMPILER_UI_MESSAGES.restart}
        </button>
      </div>
    </article>
  );
};
