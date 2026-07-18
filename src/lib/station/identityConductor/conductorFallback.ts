import { resolveGameLocale } from "@/lib/playable/gameContentSchema";
import { routeExpressLineFromAnswer } from "@/lib/station/conductorEngine";
import { buildFallbackTeaser } from "@/lib/station/identityConductor/conductorCopy";
import {
  buildConductorCtaHref,
  resolveExpressLineCopy,
} from "@/lib/station/identityConductor/expressLines";
import type { Locale } from "@/lib/i18n/config";
import type {
  ConductorAiResponse,
  ConductorExpressSlug,
  ConductorRequest,
  ConductorResponse,
} from "@/types/conductor";

/** Client + server safe — no AI SDK imports. */
export function assembleConductorResponse(
  locale: Locale,
  slug: ConductorExpressSlug,
  prose: ConductorAiResponse,
  source: ConductorResponse["source"],
): ConductorResponse {
  const line = resolveExpressLineCopy(slug, locale);

  return {
    acknowledge: prose.acknowledge,
    teaser: prose.teaser,
    expressLineSlug: slug,
    expressLineName: line.name,
    ctaHref: buildConductorCtaHref(slug, locale),
    ctaLabel: line.cta,
    source,
  };
}

/**
 * Deterministic HA payload for API fatal catch and client network failure.
 * Never invents `global-identity-core`.
 */
export function buildConductorFallbackResponse(
  input: ConductorRequest,
): ConductorResponse {
  const locale = resolveGameLocale(input.locale);
  const userAnswer = input.userAnswer.trim() || "…";
  const expressLineSlug = routeExpressLineFromAnswer(userAnswer);
  const prose = buildFallbackTeaser(locale, userAnswer, expressLineSlug);
  return assembleConductorResponse(locale, expressLineSlug, prose, "fallback");
}
