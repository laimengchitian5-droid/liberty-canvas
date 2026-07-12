import type { Locale } from "@/lib/i18n/config";
import type { SemanticQueryClusterId } from "@/lib/user/semanticQueryClusters";

/** Canonical schema version — bump when breaking UserData shape changes. */
export const USER_DATA_SCHEMA_VERSION = 1 as const;

export type UserDataSchemaVersion = typeof USER_DATA_SCHEMA_VERSION;

export type UserSessionStatus = "idle" | "hydrating" | "ready" | "error";

export interface UserProfileSummary {
  userId: string;
  displayName: string;
  avatarInitials: string;
  locale: Locale;
  memberSince: string;
}

export interface UserActivitySnapshot {
  appsAuthored: number;
  recentAppIds: readonly string[];
  lastActiveAt: string | null;
}

export interface UserPreferencesSnapshot {
  activePersona: string;
  localePreference: Locale | null;
}

export interface UserData {
  profile: UserProfileSummary;
  activity: UserActivitySnapshot;
  preferences: UserPreferencesSnapshot;
  fetchedAt: string;
  schemaVersion: UserDataSchemaVersion;
}

export interface UserSeoContext {
  locale: Locale;
  activeClusterIds: readonly SemanticQueryClusterId[];
  primaryTitle: string;
  primaryDescription: string;
  keywords: readonly string[];
  landingPath: string;
  jsonLd: readonly Record<string, unknown>[];
}

export interface PlatformUserSession {
  userId: string;
  data: UserData | null;
  status: UserSessionStatus;
  errorMessage: string | null;
  seoContext: UserSeoContext | null;
}

export interface FetchUserDataOptions {
  /** Skip resolved cache and force a network round-trip. */
  forceRefresh?: boolean;
  /** Abort in-flight work (deduped callers share the same signal scope). */
  signal?: AbortSignal;
}
