import { getSpecialtyCountry } from "@/lib/specialty/globalSpecialtyTaxonomy";
import type { SpecialtyCountryId } from "@/lib/specialty/types";
import { isSpecialtyDeepDiveLive } from "@/lib/specialty/types";

/**
 * Native draft provenance for upcoming countries.
 * Template scaffolds ship for preview; live promotion requires native review slots filled.
 */
export type SpecialtyDraftSlotKind =
  "taxonomy" | "c_archetypes" | "question_bank" | "landing_copy" | "cultural_audit";

export type SpecialtyDraftSlotStatus =
  "native_ready" | "template_scaffold" | "blocked_pending_review";

export interface SpecialtyNativeDraftSlot {
  readonly countryId: SpecialtyCountryId;
  readonly slot: SpecialtyDraftSlotKind;
  readonly status: SpecialtyDraftSlotStatus;
  readonly notesJa: string;
}

/** Handcrafted live nations — all slots native_ready by definition. */
const LIVE_NATIVE_COUNTRIES = [
  "jp",
  "fr",
  "uk",
] as const satisfies readonly SpecialtyCountryId[];

/** Template-backed upcoming nations awaiting native linguistic review. */
export const UPCOMING_DRAFT_COUNTRY_IDS = [
  "us",
  "ca",
  "br",
  "cl",
  "md",
  "pk",
] as const satisfies readonly SpecialtyCountryId[];

const UPCOMING_SLOT_NOTES: Readonly<
  Record<(typeof UPCOMING_DRAFT_COUNTRY_IDS)[number], string>
> = {
  us: "フロンティア農業メタファー — ネイティブ編集待ち（テンプレ質問バンク）",
  ca: "メープル／春の樹液 — ネイティブ編集待ち",
  br: "テラ・ロッサ／キャッサバ — 文化監査済みメタファー、質問はテンプレ",
  cl: "アンデス・テロワール農芸 — アルコール表現除去済み、質問はテンプレ",
  md: "葡萄等級／地下セラー — 酒プロモーション回避済み、質問はテンプレ",
  pk: "バスマティ／ヨーグルト／発酵パン — 非アルコール発酵へ置換済み、質問はテンプレ",
};

function buildLiveSlots(countryId: SpecialtyCountryId): SpecialtyNativeDraftSlot[] {
  const slots: SpecialtyDraftSlotKind[] = [
    "taxonomy",
    "c_archetypes",
    "question_bank",
    "landing_copy",
    "cultural_audit",
  ];
  return slots.map((slot) => ({
    countryId,
    slot,
    status: "native_ready" as const,
    notesJa: "手編集済み・live 公開可",
  }));
}

function buildUpcomingSlots(
  countryId: (typeof UPCOMING_DRAFT_COUNTRY_IDS)[number],
): SpecialtyNativeDraftSlot[] {
  const note = UPCOMING_SLOT_NOTES[countryId];
  return [
    {
      countryId,
      slot: "taxonomy",
      status: "template_scaffold",
      notesJa: note,
    },
    {
      countryId,
      slot: "c_archetypes",
      status: "template_scaffold",
      notesJa: "countryCArchetypeSeeds テンプレ — ネイティブ差し替え口",
    },
    {
      countryId,
      slot: "question_bank",
      status: "blocked_pending_review",
      notesJa: "buildScaleQuestionBank テンプレ — 手編集バンク必須",
    },
    {
      countryId,
      slot: "landing_copy",
      status: "template_scaffold",
      notesJa: "Discover は世界診断へルーティング（upcoming）",
    },
    {
      countryId,
      slot: "cultural_audit",
      status: "blocked_pending_review",
      notesJa: "現地言語・法規制レビュー完了まで live 昇格禁止",
    },
  ];
}

export function listSpecialtyNativeDraftSlots(): readonly SpecialtyNativeDraftSlot[] {
  return [
    ...LIVE_NATIVE_COUNTRIES.flatMap((id) => buildLiveSlots(id)),
    ...UPCOMING_DRAFT_COUNTRY_IDS.flatMap((id) => buildUpcomingSlots(id)),
  ];
}

export function getSpecialtyNativeDraftSlots(
  countryId: SpecialtyCountryId,
): readonly SpecialtyNativeDraftSlot[] {
  return listSpecialtyNativeDraftSlots().filter((entry) => entry.countryId === countryId);
}

/** True when every slot is native_ready AND taxonomy phase is live. */
export function isSpecialtyNativeDraftComplete(countryId: SpecialtyCountryId): boolean {
  const country = getSpecialtyCountry(countryId);
  if (!isSpecialtyDeepDiveLive(country.releasePhase)) {
    return false;
  }
  return getSpecialtyNativeDraftSlots(countryId).every(
    (slot) => slot.status === "native_ready",
  );
}

export function listUpcomingCountriesPendingNativeReview(): readonly SpecialtyCountryId[] {
  return UPCOMING_DRAFT_COUNTRY_IDS.filter(
    (id) => getSpecialtyCountry(id).releasePhase === "upcoming",
  );
}
