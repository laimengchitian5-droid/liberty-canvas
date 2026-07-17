import {
  emptyUserGameProfile,
  recordGameCompletion,
  type UserProfile,
} from "@/lib/gamification/userGameProfileSchema";
import { DIAGNOSTIC_PLATFORM_IDS } from "@/types/diagnosticStation";

/** Demo traits for QA — entertainment labels only, never clinical claims. */
export const STATION_SEED_TRAITS = {
  "16personalities": "主人公 (ENFJ-A)",
  enneagram: "タイプ5 (探究者)",
  "big-five": "高い開放性・誠実性",
  disc: "D型 (主導気質)",
  "strengths-finder": "最上志向・戦略性",
  "via-strengths": "知的好奇心・ユーモア",
  "16pf": "高い自立性因子",
  "animal-psychology": "我が道を行くペガサス",
  riasec: "A型 (芸術的特性)",
  "love-languages": "クオリティ・タイム",
  egogram: "FC優位の自由人",
  tritype: "トライタイプ 5-4-8",
  "love-type-16": "ちゃっかりうさぎ",
  "blood-type": "AB型気質 (多面的)",
  "zodiac-astrology": "太陽星座: 牡羊座",
} as const satisfies Record<(typeof DIAGNOSTIC_PLATFORM_IDS)[number], string>;

/** Builds a 15/15 cleared play-matrix profile for dashboard QA. */
export function buildCompleteStationProfile(
  clearedAt: number = Date.now(),
): UserProfile {
  let profile = emptyUserGameProfile();
  for (const id of DIAGNOSTIC_PLATFORM_IDS) {
    profile = recordGameCompletion(
      profile,
      id,
      STATION_SEED_TRAITS[id],
      clearedAt,
    );
  }
  return profile;
}
