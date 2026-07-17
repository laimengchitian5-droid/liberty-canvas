import { PRODUCT_NAME } from "@/lib/brand/constants";
import { FULL_INCLUSIVE_AI_GUARDRAILS } from "@/lib/i18n/culturalGuardrails";
import { resolveGameLocale } from "@/lib/playable/gameContentSchema";
import { getRouteManifest } from "@/lib/station/diagnosticStationMaster";
import { resolveLineName } from "@/lib/station/diagnosticStationRegistry";
import type { Locale } from "@/lib/i18n/config";
import type { UserGameProfile, UserProfile } from "@/types/userGameProfile";
import { DIAGNOSTIC_PLATFORM_IDS } from "@/types/diagnosticStation";

export interface AISystemPromptPayload {
  readonly systemPrompt: string;
  /** Compact JSON string for the model context window. */
  readonly compressedUserTraitsJson: string;
}

export interface StationTraitEntry {
  readonly id: string;
  /** English line name for EN-fixed reasoning (locale-stable). */
  readonly lineNameEn: string;
  readonly primaryTrait: string;
}

const MAX_TRAIT_LEN = 80;
const MAX_GAMES = 64;

/**
 * Pure builder: station play-matrix → EN-reasoning system prompt + compressed traits.
 *
 * Rejected sketch defects:
 * - `resolveLineName(route)` → `resolveLineName(id, locale)`
 * - localized lineName as JSON keys → stable platform `id` keys
 * - class-only API → pure function + optional facade
 * - "Universal AI Canvas" → {@link PRODUCT_NAME}
 */
export function buildAdaptiveStationContext(
  profile: UserGameProfile | UserProfile,
  localeInput: string,
): AISystemPromptPayload {
  const locale = resolveGameLocale(localeInput);
  const traits = collectStationTraits(profile);
  const systemPrompt = buildStationAdvisorSystemPrompt(locale, traits.length);

  return {
    systemPrompt,
    compressedUserTraitsJson: JSON.stringify({
      version: profile.version ?? 1,
      locale,
      totalRoutesCompleted: traits.length,
      stationRouteTotal: DIAGNOSTIC_PLATFORM_IDS.length,
      userTraitsMatrix: Object.fromEntries(
        traits.map((entry) => [
          entry.id,
          { line: entry.lineNameEn, trait: entry.primaryTrait },
        ]),
      ),
    }),
  };
}

function collectStationTraits(
  profile: UserGameProfile | UserProfile,
): readonly StationTraitEntry[] {
  const entries = Object.entries(profile.completedGames);
  const out: StationTraitEntry[] = [];

  for (let i = 0; i < entries.length && out.length < MAX_GAMES; i += 1) {
    const [gameId, history] = entries[i]!;
    const route = getRouteManifest(gameId);
    if (!route || !history) {
      continue;
    }

    const trait = history.primaryTrait.trim().slice(0, MAX_TRAIT_LEN);
    if (!trait) {
      continue;
    }

    out.push({
      id: route.id,
      lineNameEn: resolveLineName(route.id, "en"),
      primaryTrait: trait,
    });
  }

  return out;
}

function buildStationAdvisorSystemPrompt(
  locale: Locale,
  traitCount: number,
): string {
  return [
    `You are the Identity Advisor inside "${PRODUCT_NAME}" (station transfer hub).`,
    "Conduct internal reasoning in English for logical depth and token efficiency.",
    `The user has boarding stamps on ${traitCount}/${DIAGNOSTIC_PLATFORM_IDS.length} diagnostic routes.`,
    "Analyze the compressed userTraitsMatrix as entertainment self-insight only.",
    `Respond in the user's preferred locale "${locale}" (mirror their latest message language if it differs).`,
    "Never invent clinical diagnoses, disorders, or medical advice.",
    "Tone: sophisticated, warm, Adult-Cute — never neon, aggressive, or FOMO.",
    FULL_INCLUSIVE_AI_GUARDRAILS,
  ].join("\n");
}

/** Sketch-compatible SRP facade over {@link buildAdaptiveStationContext}. */
export class AdaptiveAIContextBuilder {
  buildSecureContext(
    profile: UserGameProfile | UserProfile,
    locale: Locale | string,
  ): AISystemPromptPayload {
    return buildAdaptiveStationContext(profile, locale);
  }
}
