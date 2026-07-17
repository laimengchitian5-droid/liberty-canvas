import {
  SPECIALTY_COUNTRY_C_SLUGS,
  WORLD_SPECIALTY_SOUL_SLUG,
} from "@/lib/specialty/globalSpecialtyTaxonomy";

/** Plug slugs owned by the world specialty series (B + country C). */
export function isSpecialtyPlugSlug(slug: string): boolean {
  return slug === WORLD_SPECIALTY_SOUL_SLUG || SPECIALTY_COUNTRY_C_SLUGS.has(slug);
}

export const SPECIALTY_SERIES_EYEBROW = "世界名産ソウル" as const;

export const SPECIALTY_SERIES_LEAD =
  "9カ国のものづくり哲学から生まれた、入口診断と国別ディープダイブシリーズです。" as const;
