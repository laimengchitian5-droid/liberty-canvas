import { cookies } from "next/headers";
import { buildAdaptiveStationContext } from "@/lib/station/adaptiveStationContext";
import {
  deserializeGameMatrixCookie,
  GAME_MATRIX_COOKIE_NAME,
} from "@/lib/edge/crossDomainCookieBridge";
import { emptyUserGameProfile } from "@/lib/gamification/userGameProfileSchema";
import type { UserGameProfile } from "@/types/userGameProfile";

/**
 * Server-only: decrypt `lc_game_matrix` for chat system prompts.
 * Never throws — fail-closed to empty profile (chat must stay available).
 *
 * Rejected sketch defects:
 * - `@/src/...` / `sessionSyncEngine` → crossDomainCookieBridge
 * - hand-rolled cookie name / empty `{ version: 1 }` literals → GAME_MATRIX_COOKIE_NAME + emptyUserGameProfile
 * - accept-Language “197 locales” → caller passes validated body.locale / resolveGameLocale inside builder
 */
export async function loadGameMatrixProfileFromCookies(): Promise<UserGameProfile> {
  try {
    const encrypted = cookies().get(GAME_MATRIX_COOKIE_NAME)?.value;
    return await deserializeGameMatrixCookie(encrypted);
  } catch (error) {
    console.warn("[chat] matrix cookie read fallback:", error);
    return emptyUserGameProfile();
  }
}

/** Append station advisor prompt + compressed traits JSON to an existing system prompt. */
export function appendStationAdaptiveContext(
  baseSystemPrompt: string,
  profile: UserGameProfile,
  locale: string,
): string {
  const { systemPrompt, compressedUserTraitsJson } =
    buildAdaptiveStationContext(profile, locale);

  return [
    baseSystemPrompt,
    "--- Station boarding matrix (server-decrypted; entertainment self-insight only) ---",
    systemPrompt,
    `compressedUserTraitsJson: ${compressedUserTraitsJson}`,
  ].join("\n\n");
}
