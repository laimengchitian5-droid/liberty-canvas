import type { Diagnosis } from "@/types/rubel";

/** Subtraction: one empathetic question per diagnosis funnel. */
export function normalizeSingleQuestion(diagnosis: Diagnosis): Diagnosis {
  if (diagnosis.questions.length <= 1) {
    return diagnosis;
  }

  return {
    ...diagnosis,
    questions: [diagnosis.questions[0]],
  };
}

export function normalizeSeedCatalog(diagnoses: Diagnosis[]): Diagnosis[] {
  return diagnoses.map(normalizeSingleQuestion);
}
