import {
  getSpecialtyCountryByBArchetypeId,
  getSpecialtyCountryByCSlug,
  WORLD_SPECIALTY_SOUL_SLUG,
} from "@/lib/specialty/globalSpecialtyTaxonomy";

export interface SpecialtyOgMeta {
  readonly flagEmoji: string;
  readonly countryNameJa: string;
  readonly specialtyLabelJa: string;
  readonly themeColor: string;
  readonly isWorldEntry: boolean;
  readonly hashtag: string;
  readonly archetypeTitle?: string;
}

export function resolveSpecialtyOgMeta(
  slug: string,
  archetypeId?: string | null,
): SpecialtyOgMeta | null {
  if (slug === WORLD_SPECIALTY_SOUL_SLUG) {
    const country = archetypeId ? getSpecialtyCountryByBArchetypeId(archetypeId) : null;

    if (country) {
      const archetype = country.bArchetype;
      return {
        flagEmoji: country.flagEmoji,
        countryNameJa: country.countryNameJa,
        specialtyLabelJa: country.specialtyLabelJa,
        themeColor: archetype.themeColor,
        isWorldEntry: true,
        hashtag: "#世界名産ソウル診断",
        archetypeTitle: archetype.title,
      };
    }

    return {
      flagEmoji: "🌍",
      countryNameJa: "世界9カ国",
      specialtyLabelJa: "名産文化ソウル診断",
      themeColor: "#0D9488",
      isWorldEntry: true,
      hashtag: "#世界名産ソウル診断",
    };
  }

  const country = getSpecialtyCountryByCSlug(slug);

  if (!country) {
    return null;
  }

  const archetype =
    archetypeId != null
      ? (country.cArchetypes.find((entry) => entry.id === archetypeId) ??
        country.bArchetype)
      : undefined;

  return {
    flagEmoji: country.flagEmoji,
    countryNameJa: country.countryNameJa,
    specialtyLabelJa: country.specialtyLabelJa,
    themeColor: archetype?.themeColor ?? country.bArchetype.themeColor,
    isWorldEntry: false,
    hashtag: `#${country.countryNameJa}診断`,
    archetypeTitle: archetype?.title,
  };
}
