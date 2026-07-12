import {
  ACADEMIC_TRAIT_LABELS,
  LEGAL_TRAIT_KEYS,
  type LegalTraitKey,
} from "@/lib/diagnosis/academicTraitVector";
import type { AcademicTraitVector } from "@/types/diagnosisCompiler";
import styles from "./diagnosisCompiler.module.css";

function formatTraitLabel(traitKey: LegalTraitKey): string {
  return ACADEMIC_TRAIT_LABELS[traitKey];
}

export const DiagnosisCompilerTraitChart = ({
  academicVector,
  themeColor,
}: {
  academicVector: AcademicTraitVector;
  themeColor: string;
}) => {
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
