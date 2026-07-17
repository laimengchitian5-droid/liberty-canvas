import { describe, expect, it } from "vitest";
import { getPlugDiagnosisBySlug } from "@/config/diagnoses";
import { LEGAL_TRAIT_KEYS } from "@/lib/diagnosis/academicTraitVector";
import {
  buildCountrySpecialtyDefinition,
  buildWorldSpecialtySoulDefinition,
  isCountrySpecialtyReady,
} from "@/lib/specialty/buildSpecialtyDiagnosis";
import {
  getSpecialtyCountryByBArchetypeId,
  GLOBAL_SPECIALTY_TAXONOMY,
  listSpecialtyCountries,
  WORLD_SPECIALTY_SOUL_SLUG,
} from "@/lib/specialty/globalSpecialtyTaxonomy";
import { buildWorldSpecialtyBArchetypes } from "@/lib/specialty/specialtyArchetypes";
import { SPECIALTY_COUNTRY_IDS } from "@/lib/specialty/types";
import { WORLD_SPECIALTY_QUESTION_COUNT } from "@/lib/specialty/worldSpecialtyQuestionBank";
import {
  extractQuestionBlocks,
  extractResultBlock,
} from "@/lib/diagnosis/extractDiagnosisElements";

describe("globalSpecialtyTaxonomy", () => {
  it("indexes all nine countries with unique B archetypes", () => {
    expect(listSpecialtyCountries()).toHaveLength(9);
    expect(SPECIALTY_COUNTRY_IDS).toHaveLength(9);

    const bArchetypeIds = new Set(
      GLOBAL_SPECIALTY_TAXONOMY.map((entry) => entry.bArchetype.id),
    );
    expect(bArchetypeIds.size).toBe(9);

    const cSlugs = new Set(GLOBAL_SPECIALTY_TAXONOMY.map((entry) => entry.cSlug));
    expect(cSlugs.size).toBe(9);
  });

  it("resolves country metadata from B archetype id", () => {
    const japan = getSpecialtyCountryByBArchetypeId("lc-specialty-jp-winter-brewer");
    expect(japan?.id).toBe("jp");
    expect(japan?.cSlug).toBe("jp-sakamai-craft");
  });
});

describe("buildWorldSpecialtySoulDefinition", () => {
  it("builds a valid plug definition with 24 questions and 9 results", () => {
    const definition = buildWorldSpecialtySoulDefinition();

    expect(definition.slug).toBe(WORLD_SPECIALTY_SOUL_SLUG);
    expect(definition.traitIds).toEqual(LEGAL_TRAIT_KEYS);

    const questions = extractQuestionBlocks(definition);
    const resultBlock = extractResultBlock(definition);

    expect(questions).toHaveLength(WORLD_SPECIALTY_QUESTION_COUNT);
    expect(resultBlock?.results).toHaveLength(9);

    for (const result of resultBlock?.results ?? []) {
      for (const traitKey of LEGAL_TRAIT_KEYS) {
        expect(result.traitProfile[traitKey]).toBeTypeOf("number");
      }
      expect(result.compatibilityHint).toContain("深掘り診断");
    }
  });

  it("keeps B archetype trait profiles pairwise distinct", () => {
    const archetypes = buildWorldSpecialtyBArchetypes();
    expect(archetypes).toHaveLength(9);

    for (let left = 0; left < archetypes.length; left += 1) {
      for (let right = left + 1; right < archetypes.length; right += 1) {
        const a = archetypes[left]!.traitProfile;
        const b = archetypes[right]!.traitProfile;
        const identical = LEGAL_TRAIT_KEYS.every((key) => a[key] === b[key]);
        expect(identical).toBe(false);
      }
    }
  });
});

describe("buildCountrySpecialtyDefinition", () => {
  it("builds JP C definition when content is sufficient", () => {
    const definition = buildCountrySpecialtyDefinition("jp");
    const questions = extractQuestionBlocks(definition);
    const resultBlock = extractResultBlock(definition);

    expect(definition.slug).toBe("jp-sakamai-craft");
    expect(questions.length).toBeGreaterThanOrEqual(12);
    expect(resultBlock?.results.length).toBeGreaterThanOrEqual(3);
  });

  it("builds all country C scaffolds; only JP/FR/UK are catalog-ready", () => {
    const liveIds = ["jp", "fr", "uk"] as const;

    for (const countryId of SPECIALTY_COUNTRY_IDS) {
      const definition = buildCountrySpecialtyDefinition(countryId);
      const questions = extractQuestionBlocks(definition);
      const resultBlock = extractResultBlock(definition);

      expect(questions.length).toBeGreaterThanOrEqual(12);
      expect(resultBlock?.results.length).toBeGreaterThanOrEqual(3);
    }

    for (const countryId of SPECIALTY_COUNTRY_IDS) {
      expect(isCountrySpecialtyReady(countryId)).toBe(
        liveIds.includes(countryId as (typeof liveIds)[number]),
      );
    }
  });

  it("registers only live specialty countries in plug catalog", () => {
    for (const country of listSpecialtyCountries()) {
      const registered = getPlugDiagnosisBySlug(country.cSlug);
      if (country.releasePhase === "live") {
        expect(registered?.slug).toBe(country.cSlug);
      } else {
        expect(registered).toBeNull();
      }
    }
    expect(getPlugDiagnosisBySlug(WORLD_SPECIALTY_SOUL_SLUG)?.slug).toBe(
      WORLD_SPECIALTY_SOUL_SLUG,
    );
  });
});
