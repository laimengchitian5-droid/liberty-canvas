import type { EnneagramLocaleCopy, EnneagramTypeDefinition, PsychQuizResult } from "@/lib/psychology/types";

export function buildEnneagramResult(
  copy: EnneagramLocaleCopy,
  selectedType: EnneagramTypeDefinition,
): PsychQuizResult {
  return {
    typeName: selectedType.name,
    summary: `${selectedType.tagline} — ${selectedType.description}`,
    anchorQuestion: copy.promptLabel,
    anchorAnswer: selectedType.name,
    detailLines: [
      `Type ${selectedType.typeNumber}`,
      selectedType.tagline,
      selectedType.description,
    ],
    enneagramTypeNumber: selectedType.typeNumber,
  };
}

export function formatEnneagramShareText(
  copy: EnneagramLocaleCopy,
  result: PsychQuizResult,
  locale: string,
): string {
  const url =
    locale === "ja"
      ? "https://liberty-canvas.vercel.app/diagnosis/enneagram"
      : `https://liberty-canvas.vercel.app/diagnosis/enneagram?lang=${locale}`;

  return `${result.typeName}\n${result.summary}\n${url}\n#RubelCanvas #Enneagram`;
}
