import { getBrand } from "@/lib/brand/registry";
import { readJsonStore, writeJsonStore } from "@/lib/storage/jsonStore";
import {
  buildGlobalReachLabel,
  inferCrossLingualKeywords,
} from "@/lib/rubel/i18n/constants";
import { deriveCreatorAccent, deriveCreatorInitials } from "@/lib/rubel/creatorDisplay";
import { formatSubmissionCount } from "@/lib/rubel/formatSubmissionCount";
import { SEED_DIAGNOSES } from "@/lib/rubel/seedDiagnoses";
import type { Diagnosis, HubDiagnosisCard } from "@/types/rubel";
import { DEFAULT_LOCALE, LOCALE_FLAGS } from "@/types/rubel-i18n";

const STORE_KEY = "rubel-diagnoses";

function normalizeDiagnosis(diagnosis: Diagnosis): Diagnosis {
  const language = diagnosis.language ?? DEFAULT_LOCALE;

  return {
    ...diagnosis,
    language,
    creatorName: diagnosis.creatorName ?? getBrand("liberty-play").name,
    searchKeywords:
      diagnosis.searchKeywords?.length > 0
        ? diagnosis.searchKeywords
        : inferCrossLingualKeywords(diagnosis.title, language),
  };
}

function mergeDiagnoses(seed: Diagnosis[], custom: Diagnosis[]): Diagnosis[] {
  const byId = new Map<string, Diagnosis>();

  for (const diagnosis of seed) {
    byId.set(diagnosis.id, normalizeDiagnosis(diagnosis));
  }

  for (const diagnosis of custom) {
    byId.set(diagnosis.id, normalizeDiagnosis(diagnosis));
  }

  return Array.from(byId.values()).sort(
    (left, right) => right.totalSubmissions - left.totalSubmissions,
  );
}

async function readCustomDiagnoses(): Promise<Diagnosis[]> {
  return readJsonStore<Diagnosis[]>(STORE_KEY, []);
}

export async function listDiagnoses(): Promise<Diagnosis[]> {
  const custom = await readCustomDiagnoses();
  return mergeDiagnoses(SEED_DIAGNOSES, custom);
}

export function getSeedDiagnosisById(id: string): Diagnosis | null {
  const match = SEED_DIAGNOSES.find((entry) => entry.id === id);
  return match ? normalizeDiagnosis(match) : null;
}

export async function getDiagnosisById(id: string): Promise<Diagnosis | null> {
  const seedMatch = getSeedDiagnosisById(id);
  if (seedMatch) {
    const custom = await readCustomDiagnoses();
    const customMatch = custom.find((entry) => entry.id === id);
    return customMatch ? normalizeDiagnosis(customMatch) : seedMatch;
  }

  const diagnoses = await listDiagnoses();
  return diagnoses.find((entry) => entry.id === id) ?? null;
}

export async function saveDiagnosis(diagnosis: Diagnosis): Promise<void> {
  const custom = await readCustomDiagnoses();
  const nextCustom = [...custom.filter((entry) => entry.id !== diagnosis.id), diagnosis];

  await writeJsonStore(STORE_KEY, nextCustom);
}

export async function incrementDiagnosisSubmissions(
  id: string,
): Promise<Diagnosis | null> {
  const seedMatch = SEED_DIAGNOSES.find((entry) => entry.id === id);
  const custom = await readCustomDiagnoses();
  const customMatch = custom.find((entry) => entry.id === id);

  if (!seedMatch && !customMatch) {
    return null;
  }

  const current = customMatch ?? { ...seedMatch! };
  const updated: Diagnosis = {
    ...current,
    totalSubmissions: current.totalSubmissions + 1,
  };

  const nextCustom = [...custom.filter((entry) => entry.id !== id), updated];

  await writeJsonStore(STORE_KEY, nextCustom);
  return updated;
}

export function toHubCard(diagnosis: Diagnosis): HubDiagnosisCard {
  const plays = formatSubmissionCount(diagnosis.totalSubmissions);

  return {
    id: diagnosis.id,
    title: diagnosis.title,
    creatorName: diagnosis.creatorName,
    creatorInitials: deriveCreatorInitials(diagnosis.creatorName),
    creatorAccent: deriveCreatorAccent(diagnosis.creatorName),
    language: diagnosis.language,
    originFlag: LOCALE_FLAGS[diagnosis.language],
    globalReachLabel: buildGlobalReachLabel(diagnosis.language),
    searchKeywords: diagnosis.searchKeywords,
    totalSubmissions: diagnosis.totalSubmissions,
    questionCount: diagnosis.questions.length,
    resultCount: diagnosis.results.length,
    trendingLabel: `Trending · ${plays} plays`,
    href: `/play/${diagnosis.id}`,
  };
}

export async function listHubCards(): Promise<HubDiagnosisCard[]> {
  const diagnoses = await listDiagnoses();
  return diagnoses.map(toHubCard);
}
