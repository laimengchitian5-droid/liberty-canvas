import { resolveCookieDomain } from "@/lib/edge/appDomains";
import { encryptProfile, decryptProfile } from "@/lib/edge/edgeCrypto";
import { resolveSessionSecret } from "@/lib/env/serverSecrets";
import {
  emptyUserGameProfile,
  type UserProfile,
} from "@/lib/gamification/userGameProfileSchema";

/** Encrypted play-matrix cookie — shared across *.liberty-canvas.app when Domain allows. */
export const GAME_MATRIX_COOKIE_NAME = "lc_game_matrix";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export interface MatrixCookieDescriptor {
  readonly name: typeof GAME_MATRIX_COOKIE_NAME;
  readonly value: string;
  readonly options: {
    readonly path: "/";
    readonly maxAge: number;
    readonly secure: boolean;
    readonly httpOnly: true;
    readonly sameSite: "lax";
    readonly domain?: string;
  };
}

function requireSecret(explicit?: string): string {
  const secret = explicit?.trim() || resolveSessionSecret();
  if (!secret || secret.length < 16) {
    throw new Error(
      "[Fatal Security Error] LC_SESSION_SECRET / ENCRYPTION_SECRET_KEY required (≥16 chars).",
    );
  }
  return secret;
}

/**
 * Encrypt profile for Set-Cookie. Domain only on apex tree (see resolveCookieDomain).
 * httpOnly: true — matrix is not needed in JS; keeps XSS from reading play history.
 */
export async function serializeGameMatrixCookie(
  profile: UserProfile,
  hostname: string,
  options?: { readonly secret?: string; readonly secure?: boolean },
): Promise<MatrixCookieDescriptor> {
  const secret = requireSecret(options?.secret);
  const value = await encryptProfile(profile, secret);

  return {
    name: GAME_MATRIX_COOKIE_NAME,
    value,
    options: {
      path: "/",
      maxAge: COOKIE_MAX_AGE_SECONDS,
      secure: options?.secure ?? true,
      httpOnly: true,
      sameSite: "lax",
      ...(resolveCookieDomain(hostname)
        ? { domain: resolveCookieDomain(hostname) }
        : {}),
    },
  };
}

/** Read + decrypt cookie value; empty profile on missing/tampered payload. */
export async function deserializeGameMatrixCookie(
  encryptedValue: string | undefined | null,
  options?: { readonly secret?: string },
): Promise<UserProfile> {
  if (!encryptedValue) {
    return emptyUserGameProfile();
  }

  try {
    const secret = requireSecret(options?.secret);
    return await decryptProfile(encryptedValue, secret);
  } catch {
    return emptyUserGameProfile();
  }
}

/** Sketch-compatible SRP facade. */
export class CrossDomainCookieBridge {
  private readonly secret: string;

  constructor(secretKeyString?: string) {
    this.secret = requireSecret(secretKeyString);
  }

  async serialize(
    profile: UserProfile,
    hostname = "discover.liberty-canvas.app",
  ): Promise<MatrixCookieDescriptor> {
    return serializeGameMatrixCookie(profile, hostname, { secret: this.secret });
  }

  async deserialize(encryptedValue: string | undefined | null): Promise<UserProfile> {
    return deserializeGameMatrixCookie(encryptedValue, { secret: this.secret });
  }
}
