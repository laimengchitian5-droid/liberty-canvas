import { useMemo } from "react";
import {
  ACADEMIC_TRAIT_LABELS,
  LEGAL_TRAIT_KEYS,
  type LegalTraitKey,
} from "@/lib/diagnosis/academicTraitVector";
import {
  buildFiveFactorRadar,
  type FiveFactorRadarPoint,
} from "@/lib/diagnosis/fiveFactorDisplay";
import type { AcademicTraitVector } from "@/types/diagnosisCompiler";
import styles from "./diagnosisCompiler.module.css";

function formatTraitLabel(traitKey: LegalTraitKey): string {
  return ACADEMIC_TRAIT_LABELS[traitKey];
}

export type TraitChartVariant = "six" | "five";

export const DiagnosisCompilerTraitChart = ({
  academicVector,
  themeColor,
  variant = "five",
}: {
  academicVector: AcademicTraitVector;
  themeColor: string;
  variant?: TraitChartVariant;
}) => {
  const fiveFactorPoints: readonly FiveFactorRadarPoint[] = useMemo(
    () => buildFiveFactorRadar(academicVector),
    [academicVector],
  );

  if (variant === "five") {
    return (
      <div className={styles.traitChart} role="group" aria-label="5因子特性チャート">
        {fiveFactorPoints.map((point) => (
          <div key={point.key} className={styles.traitRow}>
            <span className={styles.traitLabel}>{point.label}</span>
            <div className={styles.traitTrack}>
              <div
                className={styles.traitFill}
                style={{
                  width: `${point.percentile}%`,
                  background: themeColor,
                }}
              />
            </div>
            <span className={styles.traitValue}>{point.percentile}%</span>
          </div>
        ))}
      </div>
    );
  }

  const maxScore = Math.max(
    1,
    ...LEGAL_TRAIT_KEYS.map((key) => academicVector[key]),
  );

  return (
    <div className={styles.traitChart} role="group" aria-label="学術特性チャート">
      {LEGAL_TRAIT_KEYS.map((traitKey) => {
        const score = academicVector[traitKey];
        const widthPercent = Math.round((score / maxScore) * 100);

        return (
          <div key={traitKey} className={styles.traitRow}>
            <span className={styles.traitLabel}>{formatTraitLabel(traitKey)}</span>
            <div className={styles.traitTrack}>
              <div
                className={styles.traitFill}
                style={{
                  width: `${widthPercent}%`,
                  background: themeColor,
                }}
              />
            </div>
            <span className={styles.traitValue}>
              {Math.round(score * 100) / 100}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export { formatTraitLabel };
