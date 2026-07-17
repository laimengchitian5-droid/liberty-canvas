"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { trackDiagnosisEvent, readDiagnosisRef } from "@/lib/diagnosis/analytics";
import {
  buildSpecialtyDeepDiveHref,
  type SpecialtyDeepDiveOffer,
} from "@/lib/specialty/resolveSpecialtyDeepDive";
import {
  WORLD_SPECIALTY_PLAY_PATH,
  WORLD_SPECIALTY_SOUL_SLUG,
} from "@/lib/specialty/globalSpecialtyTaxonomy";
import { listUpcomingCountriesPendingNativeReview } from "@/lib/specialty/specialtyNativeDraftSlots";
import styles from "./specialtyDeepDiveBridge.module.css";

export interface SpecialtyDeepDiveBridgeProps {
  offer: SpecialtyDeepDiveOffer;
}

export const SpecialtyDeepDiveBridge = ({ offer }: SpecialtyDeepDiveBridgeProps) => {
  const href = buildSpecialtyDeepDiveHref(offer.path);
  const impressionSentRef = useRef(false);
  const isUpcomingDraft = listUpcomingCountriesPendingNativeReview().includes(
    offer.countryId,
  );

  useEffect(() => {
    if (impressionSentRef.current) {
      return;
    }

    impressionSentRef.current = true;
    trackDiagnosisEvent("specialty_bridge_impression", {
      slug: WORLD_SPECIALTY_SOUL_SLUG,
      ref: readDiagnosisRef(),
      funnelStep: "specialty_bridge",
      targetCountryId: offer.countryId,
      targetPath: offer.path,
      isLive: offer.isLive,
    });
  }, [offer.countryId, offer.isLive, offer.path]);

  const handleClick = () => {
    trackDiagnosisEvent("plug_result_specialty_bridge_click", {
      slug: WORLD_SPECIALTY_SOUL_SLUG,
      ref: readDiagnosisRef(),
      funnelStep: "specialty_bridge",
      targetCountryId: offer.countryId,
      targetPath: offer.path,
    });
  };

  return (
    <section
      className={styles.bridgeSection}
      aria-labelledby="specialty-deep-dive-heading"
    >
      <h3 id="specialty-deep-dive-heading" className={styles.bridgeTitle}>
        あなたの名産ソウルを深掘り
      </h3>
      <p className={styles.bridgeLead}>
        {offer.flagEmoji}{" "}
        の文化に共感したあなたへ。国別の職人品質診断で、タイプをさらに細分化できます。
      </p>

      {offer.isLive ? (
        <Link href={href} className={styles.bridgeCta} onClick={handleClick}>
          <span className={styles.bridgeCtaLabel}>
            {offer.flagEmoji} {offer.title} を試す
          </span>
          <ArrowRight className={styles.bridgeCtaIcon} aria-hidden="true" />
        </Link>
      ) : (
        <div className={styles.bridgeSoon} role="status">
          <p>
            {offer.flagEmoji} 深掘り診断「{offer.title}」は
            {isUpcomingDraft ? "ネイティブ編集準備中" : "近日公開予定"}です。
          </p>
          <Link
            href={WORLD_SPECIALTY_PLAY_PATH}
            className={styles.bridgeCta}
            style={{ marginTop: "0.75rem" }}
          >
            <span className={styles.bridgeCtaLabel}>世界名産ソウル診断から続ける</span>
            <ArrowRight className={styles.bridgeCtaIcon} aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  );
};
