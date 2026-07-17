import { LOCALE_STORAGE_KEY, type Locale } from "@/lib/i18n/config";
import { resolveCookieDomain } from "@/lib/edge/appDomains";

export type SameSitePolicy = "lax" | "strict" | "none";

export interface LocaleCookieDescriptor {
  readonly name: typeof LOCALE_STORAGE_KEY;
  readonly value: Locale;
  readonly options: {
    readonly path: "/";
    readonly maxAge: number;
    readonly secure: boolean;
    readonly httpOnly: false;
    readonly sameSite: SameSitePolicy;
    readonly domain?: string;
  };
}

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/**
 * SRP: build a locale cookie that can sync across *.liberty-canvas.app
 * when the request host allows a shared Domain attribute.
 * Uses the app's canonical cookie name (not a parallel preferred_locale).
 */
export function buildLocaleCookie(
  locale: Locale,
  hostname: string,
  options?: { readonly secure?: boolean },
): LocaleCookieDescriptor {
  const domain = resolveCookieDomain(hostname);
  const secure = options?.secure ?? true;

  return {
    name: LOCALE_STORAGE_KEY,
    value: locale,
    options: {
      path: "/",
      maxAge: COOKIE_MAX_AGE_SECONDS,
      secure,
      httpOnly: false,
      sameSite: "lax",
      ...(domain ? { domain } : {}),
    },
  };
}
