import { resolveGameLocale } from "@/lib/playable/gameContentSchema";
import { sanitizePlayPath } from "@/lib/visual/sanitizePlayPath";
import type { Locale } from "@/lib/i18n/config";
import type {
  RecommendationHook,
  RecommendationReason,
  UserGameProfile,
} from "@/types/userGameProfile";
import {
  emptyUserGameProfile,
  parseUserGameProfile,
} from "@/lib/gamification/userGameProfileSchema";

/** Canonical Rubel seed IDs (stack truth — not sketch aliases). */
export const GAMIFICATION_GAME_IDS = {
  burnout: "rubel-burnout-v1",
  catDog: "rubel-cat-dog-v1",
  nekoJa: "rubel-neko-ja-v1",
  uraSeishiki: "rubel-ura-seishiki-v1",
  introvert: "rubel-introvert-level-v1",
  insightsHub: "diagnosis-insights",
} as const;

/** Sketch / legacy aliases → canonical ids (O(1) map). */
const GAME_ID_ALIASES: Readonly<Record<string, string>> = {
  "cat-test": GAMIFICATION_GAME_IDS.catDog,
  "cat-profile": GAMIFICATION_GAME_IDS.catDog,
  "inner-personality": GAMIFICATION_GAME_IDS.uraSeishiki,
  "dark-side": GAMIFICATION_GAME_IDS.uraSeishiki,
  "global-dashboard": GAMIFICATION_GAME_IDS.insightsHub,
};

const GAME_PATHS: Readonly<Record<string, string>> = {
  [GAMIFICATION_GAME_IDS.burnout]: `/play/${GAMIFICATION_GAME_IDS.burnout}`,
  [GAMIFICATION_GAME_IDS.catDog]: `/play/${GAMIFICATION_GAME_IDS.catDog}`,
  [GAMIFICATION_GAME_IDS.nekoJa]: `/play/${GAMIFICATION_GAME_IDS.nekoJa}`,
  [GAMIFICATION_GAME_IDS.uraSeishiki]: `/play/${GAMIFICATION_GAME_IDS.uraSeishiki}`,
  [GAMIFICATION_GAME_IDS.introvert]: `/play/${GAMIFICATION_GAME_IDS.introvert}`,
  [GAMIFICATION_GAME_IDS.insightsHub]: "/diagnosis/insights",
};

type CatchphraseBuilder = (ctx: {
  readonly locale: Locale;
  readonly trait: string;
}) => string;

type RecommendationRule = {
  readonly id: string;
  readonly reason: RecommendationReason;
  readonly nextGameId: string;
  /** Return true to apply this rule. `played` is an O(1) Set. */
  readonly when: (ctx: {
    readonly currentGameId: string;
    readonly played: ReadonlySet<string>;
    readonly profile: UserGameProfile;
  }) => boolean;
  readonly catchphrase: CatchphraseBuilder;
};

function canonicalizeGameId(raw: string): string {
  const trimmed = raw.trim();
  return GAME_ID_ALIASES[trimmed] ?? trimmed;
}

function hasPlayed(played: ReadonlySet<string>, ...ids: readonly string[]): boolean {
  for (const id of ids) {
    if (played.has(id) || played.has(canonicalizeGameId(id))) {
      return true;
    }
  }
  return false;
}

/** Strip control / markup so traits are safe inside catchphrases. */
export function sanitizeTraitLabel(raw: string, fallback: string): string {
  const cleaned = raw
    .replace(/[\u0000-\u001F\u007F<>{}`"'\\]/g, "")
    .trim()
    .slice(0, 40);
  return cleaned || fallback;
}

/** Hub routes outside /play|/app|/diagnosis/play — exact allowlist only. */
const HUB_PATH_ALLOWLIST: ReadonlySet<string> = new Set(["/diagnosis/insights"]);

function resolveTargetPath(gameId: string): string {
  const canonical = canonicalizeGameId(gameId);
  const configured = GAME_PATHS[canonical] ?? `/play/${canonical}`;

  if (HUB_PATH_ALLOWLIST.has(configured)) {
    return configured;
  }

  return sanitizePlayPath(configured) ?? `/play/${GAMIFICATION_GAME_IDS.burnout}`;
}

const RULES: readonly RecommendationRule[] = [
  {
    id: "onboarding-burnout",
    reason: "onboarding",
    nextGameId: GAMIFICATION_GAME_IDS.burnout,
    when: ({ played }) => played.size === 0,
    catchphrase: ({ locale }) =>
      locale === "ja"
        ? "まずは話題の「燃え尽き症候群」診断で、あなたの心の体力をやさしく測ってみませんか？"
        : "Discover your soft resilience style with our Burnout Archetype check.",
  },
  {
    id: "chain-cat-to-ura",
    reason: "trait_chain",
    nextGameId: GAMIFICATION_GAME_IDS.uraSeishiki,
    when: ({ played }) =>
      hasPlayed(played, GAMIFICATION_GAME_IDS.catDog, GAMIFICATION_GAME_IDS.nekoJa) &&
      !hasPlayed(played, GAMIFICATION_GAME_IDS.uraSeishiki),
    catchphrase: ({ locale, trait }) =>
      locale === "ja"
        ? `【診断連動】あなたの「${trait}」な本性が、裏の性格にどう響いているか見てみましょう。`
        : `Your “${trait}” vibe is synced — unmask the softer side of your personality next.`,
  },
  {
    id: "chain-burnout-to-introvert",
    reason: "trait_chain",
    nextGameId: GAMIFICATION_GAME_IDS.introvert,
    when: ({ played, currentGameId }) =>
      canonicalizeGameId(currentGameId) === GAMIFICATION_GAME_IDS.burnout &&
      hasPlayed(played, GAMIFICATION_GAME_IDS.burnout) &&
      !hasPlayed(played, GAMIFICATION_GAME_IDS.introvert),
    catchphrase: ({ locale, trait }) =>
      locale === "ja"
        ? `燃え尽き傾向「${trait}」のあなたへ。内向エネルギーとの相性もチェックしませんか？`
        : `After “${trait}” burnout insights, explore your introvert energy map.`,
  },
  {
    id: "completion-insights",
    reason: "completion_hub",
    nextGameId: GAMIFICATION_GAME_IDS.insightsHub,
    when: () => true,
    catchphrase: ({ locale }) =>
      locale === "ja"
        ? "ここまでの診断をつなげて、総合インサイトをのぞいてみましょう。"
        : "Nice streak — open your combined insights map next.",
  },
];

function buildPlayedSet(profile: UserGameProfile): ReadonlySet<string> {
  const set = new Set<string>();
  for (const key of Object.keys(profile.completedGames)) {
    set.add(key);
    set.add(canonicalizeGameId(key));
  }
  return set;
}

function pickTrait(
  profile: UserGameProfile,
  played: ReadonlySet<string>,
  locale: Locale,
): string {
  const fallback = locale === "ja" ? "あなたらしい" : "your unique";

  const preferredKeys = [
    GAMIFICATION_GAME_IDS.catDog,
    GAMIFICATION_GAME_IDS.nekoJa,
    GAMIFICATION_GAME_IDS.burnout,
    "cat-test",
    "cat-profile",
  ];

  for (const key of preferredKeys) {
    if (!played.has(key) && !played.has(canonicalizeGameId(key))) {
      continue;
    }
    const record =
      profile.completedGames[key] ??
      profile.completedGames[canonicalizeGameId(key)];
    if (record?.primaryTrait) {
      return sanitizeTraitLabel(record.primaryTrait, fallback);
    }
  }

  for (const record of Object.values(profile.completedGames)) {
    if (record.primaryTrait) {
      return sanitizeTraitLabel(record.primaryTrait, fallback);
    }
  }

  return fallback;
}

function toHook(
  rule: RecommendationRule,
  locale: Locale,
  trait: string,
): RecommendationHook {
  return {
    nextGameId: rule.nextGameId,
    localizedCatchphrase: rule.catchphrase({ locale, trait }),
    targetCleanPath: resolveTargetPath(rule.nextGameId),
    reason: rule.reason,
  };
}

/**
 * Pure recommendation engine — first matching rule wins (O(rules), tiny constant).
 * Never throws; invalid profiles fall back to empty history.
 */
export function generateNextStep(
  currentGameId: string,
  profile: UserGameProfile | unknown,
  locale: string,
): RecommendationHook {
  const safeLocale = resolveGameLocale(locale);
  const completed = parseUserGameProfile(profile) ?? emptyUserGameProfile();
  const played = buildPlayedSet(completed);
  const trait = pickTrait(completed, played, safeLocale);
  const current = canonicalizeGameId(currentGameId);

  for (const rule of RULES) {
    if (
      rule.when({
        currentGameId: current,
        played,
        profile: completed,
      })
    ) {
      return toHook(rule, safeLocale, trait);
    }
  }

  // Unreachable while RULES ends with always-true completion rule — keep fail-closed.
  return {
    nextGameId: GAMIFICATION_GAME_IDS.burnout,
    localizedCatchphrase:
      safeLocale === "ja"
        ? "次のやさしい診断へ進んでみませんか？"
        : "Ready for another gentle diagnosis?",
    targetCleanPath: resolveTargetPath(GAMIFICATION_GAME_IDS.burnout),
    reason: "fallback",
  };
}

/** Sketch-compatible facade (no class instance on the hot path). */
export const CrossSiteGamificationEngine = {
  generateNextStep,
} as const;
