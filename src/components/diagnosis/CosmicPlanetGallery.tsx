"use client";

import { useMemo, useState } from "react";
import {
  buildPlanetGalleryEntries,
  getCosmicPlanetVisualSpec,
  type CosmicPlanetKind,
} from "@/lib/diagnosis/cosmicPlanetEngine";
import type { AcademicTraitVector } from "@/lib/diagnosis/academicTraitVector";
import { cn } from "@/lib/utils/cn";
import type { ResultLocaleMessages } from "@/lib/diagnosis/resultLocalesCore";
import styles from "./diagnosisResultPage.module.css";

interface CosmicPlanetGalleryProps {
  vector: AcademicTraitVector;
  activePlanetKind: CosmicPlanetKind;
  messages: Pick<
    ResultLocaleMessages,
    "galleryTitle" | "galleryLead" | "galleryOwned" | "galleryPreview"
  >;
  onPreviewKind?: (kind: CosmicPlanetKind) => void;
}

export const CosmicPlanetGallery = ({
  vector,
  activePlanetKind,
  messages,
  onPreviewKind,
}: CosmicPlanetGalleryProps) => {
  const entries = useMemo(() => buildPlanetGalleryEntries(vector), [vector]);

  const [previewKind, setPreviewKind] = useState<CosmicPlanetKind | null>(null);
  const selectedKind = previewKind ?? activePlanetKind;
  const selectedEntry =
    entries.find((entry) => entry.kind === selectedKind) ?? entries[0];

  const handleSelect = (kind: CosmicPlanetKind) => {
    setPreviewKind(kind);
    onPreviewKind?.(kind);
  };

  if (!selectedEntry) {
    return null;
  }

  const previewSpec = getCosmicPlanetVisualSpec(selectedEntry.kind);

  return (
    <section
      className={styles.planetGallerySection}
      aria-labelledby="planet-gallery-heading"
    >
      <h3 id="planet-gallery-heading" className={styles.sectionTitle}>
        {messages.galleryTitle}
      </h3>
      <p className={styles.sectionLead}>{messages.galleryLead}</p>

      <ul className={styles.planetGalleryGrid} role="list">
        {entries.map((entry) => (
          <li key={entry.kind}>
            <button
              type="button"
              className={cn(
                styles.planetGalleryCard,
                entry.kind === selectedKind && styles.planetGalleryCardActive,
                entry.isActive && styles.planetGalleryCardOwned,
              )}
              onClick={() => handleSelect(entry.kind)}
              aria-pressed={entry.kind === selectedKind}
              aria-label={`${entry.spec.nickname}${entry.isActive ? "（あなたの星）" : ""}`}
            >
              <span
                className={styles.planetGalleryOrb}
                style={{
                  background: `radial-gradient(circle at 32% 28%, ${entry.spec.coreColorPrimary} 0%, ${entry.spec.coreColorSecondary} 70%)`,
                  boxShadow: `0 0 16px ${entry.spec.glowColor}88`,
                }}
                aria-hidden="true"
              />
              <span className={styles.planetGalleryName}>
                {entry.isActive ? "★ " : ""}
                {entry.spec.nickname.replace("すべてを包み込む", "全肯定の").slice(0, 12)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.planetGalleryDetail}>
        <p className={styles.planetGalleryNickname}>{previewSpec.nickname}</p>
        <p className={styles.planetGalleryStatus}>{previewSpec.coreStatus}</p>
        <p className={styles.compatibilityHint}>{selectedEntry.compatibilityHint}</p>
        {selectedEntry.isActive ? (
          <p className={styles.planetGalleryOwnedBadge}>{messages.galleryOwned}</p>
        ) : (
          <p className={styles.planetGalleryPreviewNote}>{messages.galleryPreview}</p>
        )}
      </div>
    </section>
  );
};
