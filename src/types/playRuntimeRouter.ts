/**
 * Play catalog router envelope:
 * English routing CoT (dev-only) + locale-native card meta with clean runtime paths.
 */

import type { Locale } from "@/lib/i18n/config";

export interface CleanPlayCardRoute {
  readonly id: string;
  /** Culturally adapted diagnosis title. */
  readonly localizedTitle: string;
  /** Locale-formatted location strip (e.g. Tokyo / New York / London). */
  readonly localizedLocations: string;
  /** Locale-native trending label (急上昇 / Trending / En vogue). */
  readonly localizedTrendingTag: string;
  /**
   * Whitelisted internal runtime path only:
   * `/play/[id]`, `/app/[id]`, or `/diagnosis/play/[slug]`.
   */
  readonly targetCleanPath: string;
}

export interface PlayRouterInternalReasoning {
  readonly slugContextDeconstructionEnglish: string;
  readonly routingSanitizationJustificationEnglish: string;
}

export interface PlayRouterLocalizedOutput {
  readonly sanitizedRoutes: readonly CleanPlayCardRoute[];
}

export interface PlayRouterBulkResult {
  readonly internalReasoning: PlayRouterInternalReasoning;
  readonly localizedOutput: PlayRouterLocalizedOutput;
}

/** Incoming catalog card before sanitization / localization. */
export interface RawPlayCardParam {
  readonly id: string;
  readonly rawTitle: string;
  /** May be twisted (`/play/...`) or already clean. */
  readonly rawPath: string;
}

export type PlayRouterLocale = Locale;
