import { resolveGameLocale } from "@/lib/playable/gameContentSchema";
import { buildConductorSystemPrompt as buildLockedConductorSystemPrompt } from "@/lib/station/identityConductor/buildConductorSystemPrompt";
import { resolveExpressLineCopy } from "@/lib/station/identityConductor/expressLines";
import type { Locale } from "@/lib/i18n/config";
import {
  type ConductorExpressSlug,
  type ConductorRequest,
} from "@/types/conductor";

/**
 * Internal energy taxonomy — never exposed as play URLs.
 *
 * Sketch map (do NOT ship the 3-entry Map):
 * - `energy-high` → personality-spectrum (kept)
 * - `energy-low` → big-five (NOT `mind-explorer`)
 * - `default` → personality-spectrum (NOT `global-identity-core`)
 */
type EnergyBand = "energy-high" | "energy-low" | "workplace-vibe" | "default";

const ENERGY_TO_PLUG: Readonly<Record<EnergyBand, ConductorExpressSlug>> = {
  "energy-high": "personality-spectrum",
  "energy-low": "big-five",
  "workplace-vibe": "motivation-spectrum",
  default: "personality-spectrum",
};

interface KeywordRule {
  readonly slug: ConductorExpressSlug;
  readonly patterns: readonly RegExp[];
}

/** Specialty rules evaluated before energy bands — first match wins. */
const SPECIALTY_RULES: readonly KeywordRule[] = [
  {
    slug: "romance",
    patterns: [
      /恋|愛|絆|デート|パートナー|恋愛|relationship|love|bond|crush|職場.*人間/i,
    ],
  },
  {
    slug: "genz",
    patterns: [
      /影|シャドウ|混沌|カオス|宇宙|夜更かし|shadow|chaos|cosmic|genz|z世代/i,
    ],
  },
  {
    slug: "oshikatsu",
    patterns: [/推し|沼|沼る|ファン|推し活|passion|fandom|craft|熱中/i],
  },
  {
    slug: "motivation-spectrum",
    patterns: [/動機|やる気|燃え|目標|drive|motivation|burnout|野心|ambition/i],
  },
  {
    slug: "big-five",
    patterns: [
      /論理|分析|集中|誠実|開放|ocean|big\s*five|logic|focus|conscientious/i,
    ],
  },
];

const ENERGY_RULES: readonly {
  readonly band: Exclude<EnergyBand, "default">;
  readonly patterns: readonly RegExp[];
}[] = [
  {
    band: "energy-high",
    patterns: [/active|外向|元気|ハイテンション|ワクワク|energetic|outgoing/i],
  },
  {
    band: "energy-low",
    patterns: [/quiet|内向|静か|おとなしい|落ち着|introvert|calm|soft/i],
  },
  {
    band: "workplace-vibe",
    patterns: [/workplace|職場|仕事|オフィス|office|チーム|team/i],
  },
];

function matchFirstSlug(
  text: string,
  rules: readonly KeywordRule[],
): ConductorExpressSlug | null {
  for (const rule of rules) {
    for (const pattern of rule.patterns) {
      if (pattern.test(text)) {
        return rule.slug;
      }
    }
  }
  return null;
}

function matchEnergyBand(text: string): EnergyBand {
  for (const rule of ENERGY_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(text)) {
        return rule.band;
      }
    }
  }
  return "default";
}

/**
 * Deterministic express routing — O(rules), typed Plug slug only.
 * Specialty keyword rules win before energy bands; AI never chooses the slug.
 *
 * Rejected sketch defects:
 * - `ReadonlyMap` + `Map.get(...)!` (use typed `Record` / exhaustiveness)
 * - invented slugs (`mind-explorer`, `career-nexus`, `global-identity-core`)
 * - bare `string` return · locale-only prompt that omits locked express line
 * - dropping specialty routes (romance / genz / oshikatsu / motivation / big-five)
 * - `@/src/types` → `@/types`
 */
export function routeExpressLineFromAnswer(
  userAnswer: string,
): ConductorExpressSlug {
  const text = userAnswer.trim();
  if (!text) {
    return ENERGY_TO_PLUG.default;
  }

  const specialty = matchFirstSlug(text, SPECIALTY_RULES);
  if (specialty) {
    return specialty;
  }

  return ENERGY_TO_PLUG[matchEnergyBand(text)];
}

/**
 * Locale-normalized system prompt with locked express line (model cannot re-route).
 * Prefer this over a locale-only prompt that lets the model invent slugs.
 */
export function buildConductorSystemPrompt(
  localeInput: string,
  expressLineSlug: ConductorExpressSlug = "personality-spectrum",
): string {
  const locale: Locale = resolveGameLocale(localeInput);
  const { name } = resolveExpressLineCopy(expressLineSlug, locale);
  return buildLockedConductorSystemPrompt(locale, expressLineSlug, name);
}

/** Convenience: route + prompt from a validated conductor request. */
export function planConductorTurn(request: ConductorRequest): {
  readonly locale: Locale;
  readonly expressLineSlug: ConductorExpressSlug;
  readonly systemPrompt: string;
} {
  const locale = resolveGameLocale(request.locale);
  const expressLineSlug = routeExpressLineFromAnswer(request.userAnswer);
  return {
    locale,
    expressLineSlug,
    systemPrompt: buildConductorSystemPrompt(locale, expressLineSlug),
  };
}
