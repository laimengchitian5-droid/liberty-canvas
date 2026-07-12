import type { CosmicPlanetKind } from "@/lib/diagnosis/cosmicPlanetEngine";
import type {
  LegallySafeDiagnosisOutcome,
  PlugDiagnosisDefinition,
} from "@/types/diagnosisCompiler";
import type { BuilderDiagnosisDefinition } from "@/types/builder";

export type PlugShareCopyVariant = "cosmic" | "headline" | "emotional";
export type PlugOgVariant = "radar" | "classic";

const SHARE_VARIANT_KEY = "lc-plug-share-variant";
const OG_VARIANT_KEY = "lc-plug-og-variant";

function clampShareText(text: string): string {
  if (text.length <= 140) {
    return text;
  }

  return `${text.slice(0, 138)}…`;
}

export function resolvePlugShareCopyVariant(): PlugShareCopyVariant {
  if (typeof window === "undefined") {
    return "cosmic";
  }

  try {
    const stored = sessionStorage.getItem(SHARE_VARIANT_KEY);

    if (
      stored === "cosmic" ||
      stored === "headline" ||
      stored === "emotional"
    ) {
      return stored;
    }

    const roll = Math.random();
    const variant: PlugShareCopyVariant =
      roll < 0.34 ? "cosmic" : roll < 0.67 ? "headline" : "emotional";

    sessionStorage.setItem(SHARE_VARIANT_KEY, variant);
    return variant;
  } catch {
    return "cosmic";
  }
}

export function resolvePlugOgVariant(): PlugOgVariant {
  if (typeof window === "undefined") {
    return "radar";
  }

  try {
    const stored = sessionStorage.getItem(OG_VARIANT_KEY);

    if (stored === "radar" || stored === "classic") {
      return stored;
    }

    const variant: PlugOgVariant = Math.random() < 0.5 ? "radar" : "classic";
    sessionStorage.setItem(OG_VARIANT_KEY, variant);
    return variant;
  } catch {
    return "radar";
  }
}

export function buildPlugShareText(params: {
  definition: PlugDiagnosisDefinition | BuilderDiagnosisDefinition;
  outcome: LegallySafeDiagnosisOutcome;
  cosmicNickname: string;
  shareHashtag: string;
  shareUrl: string;
  variant?: PlugShareCopyVariant;
}): string {
  const variant = params.variant ?? resolvePlugShareCopyVariant();

  if (variant === "headline") {
    return clampShareText(
      [
        `「${params.outcome.winningArchetype.title}」`,
        params.definition.title,
        params.shareHashtag,
        params.shareUrl,
      ].join("\n"),
    );
  }

  if (variant === "emotional") {
    return clampShareText(
      [
        `わたしの宇宙キャラは「${params.cosmicNickname}」でした ${params.shareHashtag}`,
        params.outcome.winningArchetype.affirmationLine ??
          "あなたの星は、今この瞬間も静かに輝いています。",
        params.shareUrl,
      ].join("\n"),
    );
  }

  return clampShareText(
    [
      `私の宇宙キャラクターは「${params.cosmicNickname}」`,
      params.outcome.winningArchetype.title,
      params.shareHashtag,
      params.shareUrl,
    ].join("\n"),
  );
}

export function appendOgVariantToUrl(
  url: string,
  variant: PlugOgVariant,
): string {
  if (variant === "radar") {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}ogVariant=classic`;
}

export function summarizeShareGrowthEvents(
  events: readonly Record<string, unknown>[],
): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const entry of events) {
    const event = entry.event;

    if (typeof event !== "string" || !event.startsWith("plug_result")) {
      continue;
    }

    counts[event] = (counts[event] ?? 0) + 1;
  }

  return counts;
}

export function trackShareVariantPayload(
  variant: PlugShareCopyVariant,
  planet: CosmicPlanetKind,
): Record<string, string> {
  return {
    variant,
    planet,
  };
}
