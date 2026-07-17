import { LEGAL_TRAIT_KEYS } from "@/lib/diagnosis/academicTraitVector";
import {
  buildCountryPlayPath,
  getSpecialtyCountry,
  GLOBAL_SPECIALTY_TAXONOMY,
  WORLD_SPECIALTY_PLAY_PATH,
  WORLD_SPECIALTY_SOUL_ID,
  WORLD_SPECIALTY_SOUL_SLUG,
} from "@/lib/specialty/globalSpecialtyTaxonomy";
import {
  buildCountrySpecialtyCArchetypes,
  buildWorldSpecialtyBArchetypes,
} from "@/lib/specialty/specialtyArchetypes";
import type { SpecialtyCountryId, SpecialtyCountryRecord } from "@/lib/specialty/types";
import { isSpecialtyDeepDiveLive } from "@/lib/specialty/types";
import {
  buildWorldSpecialtyQuestionBank,
  WORLD_SPECIALTY_QUESTION_COUNT,
} from "@/lib/specialty/worldSpecialtyQuestionBank";
import { resolveCountryQuestionBank } from "@/lib/specialty/countryQuestionBankFactory";
import type {
  DiagnosisElement,
  PlugDiagnosisDefinition,
  QuestionBlock,
  ResultArchetype,
} from "@/types/diagnosisCompiler";

const MIN_C_ARCHETYPES = 3;
const MIN_C_QUESTIONS = 12;

function assertQuestionBank(
  questionBlocks: readonly QuestionBlock[],
  context: string,
): void {
  if (questionBlocks.length === 0) {
    throw new Error(`${context}: question bank must not be empty`);
  }

  const ids = new Set<string>();

  for (const block of questionBlocks) {
    if (ids.has(block.id)) {
      throw new Error(`${context}: duplicate question id ${block.id}`);
    }
    ids.add(block.id);
  }
}

function assertResultArchetypes(
  results: readonly ResultArchetype[],
  context: string,
): void {
  if (results.length < 2) {
    throw new Error(`${context}: at least two result archetypes are required`);
  }

  const ids = new Set<string>();

  for (const result of results) {
    if (ids.has(result.id)) {
      throw new Error(`${context}: duplicate result id ${result.id}`);
    }
    ids.add(result.id);

    for (const traitKey of LEGAL_TRAIT_KEYS) {
      if (result.traitProfile[traitKey] === undefined) {
        throw new Error(`${context}: result ${result.id} is missing trait ${traitKey}`);
      }
    }
  }
}

function buildWorldSpecialtySeoBlock(): DiagnosisElement {
  return {
    kind: "SEO_TUNING_BLOCK",
    id: "seo-world-specialty-soul",
    targetDemographics: [
      "10代",
      "20代",
      "30代",
      "文化好き",
      "世界旅行好き",
      "ものづくり好き",
    ],
    desireTags: [
      "世界の名産",
      "国別性格",
      "文化診断",
      "職人魂",
      "グローバル診断",
      "シェア診断",
    ],
    landingPath: WORLD_SPECIALTY_PLAY_PATH,
    titleTemplate: "世界の名産ソウル診断 — 9カ国のものづくり哲学タイプ | Liberty Plug",
    descriptionTemplate:
      "24問であなたの「世界名産ソウルタイプ」を診断。日本の麹文化からフランスのテロワールまで、9カ国のものづくり哲学とあなたの性格を照合する無料診断です。",
  };
}

function buildWorldSpecialtyViralBlock(): DiagnosisElement {
  return {
    kind: "VIRAL_SHARE_BLOCK",
    id: "viral-world-specialty-soul",
    presets: [
      {
        id: "x-world-specialty",
        kind: "x_twitter_card",
        label: "Xでシェア",
        hashtag: "#世界名産ソウル診断",
        cardTitle: "世界の名産ソウル診断結果",
        cardDescription: "あなたの名産ソウルタイプ、試してみて！",
      },
      {
        id: "img-world-specialty",
        kind: "image_download",
        label: "結果画像を保存",
        hashtag: "#世界名産ソウル診断",
        cardTitle: "世界名産ソウル",
        cardDescription: "Liberty Plug 世界診断",
      },
    ],
  };
}

function buildWorldSpecialtyElements(): readonly DiagnosisElement[] {
  const questionBank = buildWorldSpecialtyQuestionBank();
  const results = buildWorldSpecialtyBArchetypes(GLOBAL_SPECIALTY_TAXONOMY);

  assertQuestionBank(questionBank, "world-specialty-soul");
  assertResultArchetypes(results, "world-specialty-soul");

  if (questionBank.length !== WORLD_SPECIALTY_QUESTION_COUNT) {
    throw new Error(
      `world-specialty-soul: expected ${WORLD_SPECIALTY_QUESTION_COUNT} questions, received ${questionBank.length}`,
    );
  }

  return [
    buildWorldSpecialtySeoBlock(),
    ...questionBank,
    {
      kind: "RESULT_TEMPLATE_BLOCK",
      id: "result-world-specialty-soul",
      layout: "character_archetype_card",
      results,
    },
    buildWorldSpecialtyViralBlock(),
  ];
}

function buildCountrySeoBlock(country: SpecialtyCountryRecord): DiagnosisElement {
  const playPath = buildCountryPlayPath(country.cSlug);

  return {
    kind: "SEO_TUNING_BLOCK",
    id: `seo-${country.cSlug}`,
    targetDemographics: ["10代", "20代", "30代", "文化好き", country.countryNameJa],
    desireTags: [
      country.countryNameJa,
      country.specialtyLabelJa,
      "深掘り診断",
      "職人魂",
      "文化診断",
    ],
    landingPath: playPath,
    titleTemplate: `${country.cTitleJa} — ${country.countryNameJa}のものづくり性格 | Liberty Plug`,
    descriptionTemplate: `${country.countryNameJa}の${country.specialtyLabelJa}をテーマに、あなたの職人品質を診断する深掘りクイズです。`,
  };
}

function buildCountryViralBlock(country: SpecialtyCountryRecord): DiagnosisElement {
  return {
    kind: "VIRAL_SHARE_BLOCK",
    id: `viral-${country.cSlug}`,
    presets: [
      {
        id: `x-${country.cSlug}`,
        kind: "x_twitter_card",
        label: "Xでシェア",
        hashtag: `#${country.countryNameJa}診断`,
        cardTitle: `${country.cTitleJa}結果`,
        cardDescription: `${country.flagEmoji} ${country.countryNameJa}深掘り診断`,
      },
      {
        id: `img-${country.cSlug}`,
        kind: "image_download",
        label: "結果画像を保存",
        hashtag: `#${country.countryNameJa}診断`,
        cardTitle: country.cTitleJa,
        cardDescription: "Liberty Plug 世界名産シリーズ",
      },
    ],
  };
}

/** Phase 1 (B): live world-entry diagnosis. */
export function buildWorldSpecialtySoulDefinition(): PlugDiagnosisDefinition {
  return {
    id: WORLD_SPECIALTY_SOUL_ID,
    slug: WORLD_SPECIALTY_SOUL_SLUG,
    eyebrow: "世界9カ国",
    title: "世界の名産ソウル診断",
    subtitle:
      "24問で見つける、あなたのものづくり哲学タイプ — 9カ国の名産文化と性格を照合",
    estimatedMinutes: 12,
    themeColor: "#0D9488",
    traitIds: LEGAL_TRAIT_KEYS,
    elements: buildWorldSpecialtyElements(),
  };
}

/**
 * Phase 0 (C factory): builds a country deep-dive diagnosis when content is ready.
 * Throws defensively when archetypes or questions are insufficient.
 */
export function buildCountrySpecialtyDefinition(
  countryId: SpecialtyCountryId,
): PlugDiagnosisDefinition {
  const country = getSpecialtyCountry(countryId);
  const questionBank = resolveCountryQuestionBank(countryId);
  const results = buildCountrySpecialtyCArchetypes(country);

  if (results.length < MIN_C_ARCHETYPES) {
    throw new Error(
      `Country ${countryId} is not ready: requires at least ${MIN_C_ARCHETYPES} C archetypes`,
    );
  }

  if (questionBank.length < MIN_C_QUESTIONS) {
    throw new Error(
      `Country ${countryId} is not ready: requires at least ${MIN_C_QUESTIONS} questions`,
    );
  }

  assertQuestionBank(questionBank, country.cSlug);
  assertResultArchetypes(results, country.cSlug);

  return {
    id: `lc-specialty-country-${countryId}`,
    slug: country.cSlug,
    eyebrow: country.cEyebrowJa,
    title: country.cTitleJa,
    subtitle: `${country.countryNameJa}の${country.specialtyLabelJa}から読み解く、あなたの職人品質`,
    estimatedMinutes: 8,
    themeColor: country.bArchetype.themeColor,
    traitIds: LEGAL_TRAIT_KEYS,
    elements: [
      buildCountrySeoBlock(country),
      ...questionBank,
      {
        kind: "RESULT_TEMPLATE_BLOCK",
        id: `result-${country.cSlug}`,
        layout: "character_archetype_card",
        results,
      },
      buildCountryViralBlock(country),
    ],
  };
}

export function isCountrySpecialtyReady(countryId: SpecialtyCountryId): boolean {
  const country = getSpecialtyCountry(countryId);

  if (!isSpecialtyDeepDiveLive(country.releasePhase)) {
    return false;
  }

  try {
    buildCountrySpecialtyDefinition(countryId);
    return true;
  } catch {
    return false;
  }
}
