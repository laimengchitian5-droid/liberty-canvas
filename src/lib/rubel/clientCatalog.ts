import {
  RUBEL_LOCAL_CATALOG_KEY,
  SEED_DIAGNOSES,
} from "@/lib/rubel/seedDiagnoses";
import type { Diagnosis } from "@/types/rubel";

export function readClientCatalog(): Diagnosis[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(RUBEL_LOCAL_CATALOG_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as Diagnosis[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export function writeClientCatalog(diagnoses: Diagnosis[]): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(RUBEL_LOCAL_CATALOG_KEY, JSON.stringify(diagnoses));
}

export function upsertClientDiagnosis(diagnosis: Diagnosis): void {
  const current = readClientCatalog();
  const next = [
    ...current.filter((entry) => entry.id !== diagnosis.id),
    diagnosis,
  ];

  writeClientCatalog(next);
}

export function resolveDiagnosisForClient(
  id: string,
  serverDiagnosis: Diagnosis | null,
): Diagnosis | null {
  const clientMatch = readClientCatalog().find((entry) => entry.id === id);

  if (clientMatch) {
    return clientMatch;
  }

  return serverDiagnosis;
}

export function mergeClientAndSeed(id: string): Diagnosis | null {
  const seedMatch = SEED_DIAGNOSES.find((entry) => entry.id === id);
  const clientMatch = readClientCatalog().find((entry) => entry.id === id);
  return clientMatch ?? seedMatch ?? null;
}
