"use client";

import { useMemo } from "react";
import { CosmicPlanetVisual } from "@/components/diagnosis/CosmicPlanetVisual";
import { buildCosmicCharacterSheet } from "@/lib/diagnosis/cosmicPlanetEngine";
import { mapRubelProfileToAcademicVector } from "@/lib/rubel/mapRubelProfileToAcademic";
import type { TraitVector } from "@/types/rubel";

interface CreatorCosmicPlanetPreviewProps {
  baselineProfile: TraitVector;
  resultName: string;
}

export const CreatorCosmicPlanetPreview = ({
  baselineProfile,
  resultName,
}: CreatorCosmicPlanetPreviewProps) => {
  const sheet = useMemo(() => {
    const vector = mapRubelProfileToAcademicVector(baselineProfile);
    return buildCosmicCharacterSheet(vector);
  }, [baselineProfile]);

  return (
    <section
      className="overflow-hidden rounded-xl border border-indigo-500/30 bg-slate-950/60"
      aria-label={`${resultName}のコズミック惑星プレビュー`}
    >
      <div className="border-b border-indigo-500/20 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">
          コズミック・プレビュー
        </p>
        <p className="mt-1 text-sm text-slate-300">
          結果タイプ「{resultName || "未設定"}」の宇宙キャラクターイメージ
        </p>
      </div>
      <div className="p-2">
        <CosmicPlanetVisual
          sheet={sheet}
          activePlanetKind={sheet.planet.kind}
          renderReady
        />
      </div>
    </section>
  );
};
