import { compileLegallySafeResult } from "@/lib/diagnosis/compileLegallySafeResult";
import type {
  CompilerAnswer,
  CompiledDiagnosisOutcome,
  PlugDiagnosisDefinition,
  ResultLayoutKind,
} from "@/types/diagnosisCompiler";

export {
  extractQuestionBlocks,
  extractResultBlock,
  extractSeoBlock,
  extractViralPresets,
} from "@/lib/diagnosis/extractDiagnosisElements";

export function getResultLayoutLabel(layout: ResultLayoutKind): string {
  switch (layout) {
    case "full_affirmation_chart":
      return "全肯定チャート";
    case "character_archetype_card":
      return "キャラクターアーキタイプ";
    case "compatibility_radar":
      return "相性レーダー";
    default:
      return layout;
  }
}

/** @deprecated Prefer compileLegallySafeResult for insulated scoring. */
export function compileDiagnosisProgram(
  definition: PlugDiagnosisDefinition,
  answers: readonly CompilerAnswer[],
): CompiledDiagnosisOutcome {
  return compileLegallySafeResult(definition, answers);
}
