import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  GAME_MATRIX_COOKIE_NAME,
  serializeGameMatrixCookie,
} from "@/lib/edge/crossDomainCookieBridge";
import { resolveSessionSecret } from "@/lib/env/serverSecrets";
import { jsonError } from "@/lib/api/http";
import { emptyUserGameProfile } from "@/lib/gamification/userGameProfileSchema";
import { buildCompleteStationProfile } from "@/lib/station/buildCompleteStationProfile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * QA seed for httpOnly `lc_game_matrix`.
 * Browser `document.cookie` cannot write httpOnly / AES-GCM payloads — use this instead.
 *
 * Allow when:
 * - `x-lc-matrix-seed` matches `LC_MATRIX_SEED_TOKEN` (≥16 chars), or
 * - Vercel preview / local development (no token required)
 */
function isSeedAllowed(request: Request): boolean {
  const configured = process.env.LC_MATRIX_SEED_TOKEN?.trim();
  if (configured && configured.length >= 16) {
    return request.headers.get("x-lc-matrix-seed") === configured;
  }

  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv === "preview") {
    return true;
  }
  if (vercelEnv === "production") {
    return false;
  }
  return process.env.NODE_ENV !== "production";
}

export async function POST(request: Request) {
  if (!isSeedAllowed(request)) {
    return jsonError("Matrix seed is disabled in this environment", 403);
  }
  if (!resolveSessionSecret()) {
    return jsonError("Session encryption is not configured", 503);
  }

  const requestUrl = new URL(request.url);
  const profile = buildCompleteStationProfile();

  try {
    const cookie = await serializeGameMatrixCookie(profile, requestUrl.hostname, {
      secure: requestUrl.protocol === "https:",
    });

    const jar = cookies();
    jar.set(cookie.name, cookie.value, {
      path: cookie.options.path,
      maxAge: cookie.options.maxAge,
      secure: cookie.options.secure,
      httpOnly: cookie.options.httpOnly,
      sameSite: cookie.options.sameSite,
      ...(cookie.options.domain ? { domain: cookie.options.domain } : {}),
    });

    return NextResponse.json(
      {
        ok: true as const,
        routes: Object.keys(profile.completedGames).length,
        cookie: GAME_MATRIX_COOKIE_NAME,
        dashboardPath: "/station/ja/dashboard",
      },
      { status: 200, headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("[api/station/matrix-seed]", error);
    return jsonError("Failed to seed game matrix", 500);
  }
}

/** Clears the play-matrix cookie (same allowlist as POST). */
export async function DELETE(request: Request) {
  if (!isSeedAllowed(request)) {
    return jsonError("Matrix seed is disabled in this environment", 403);
  }

  const jar = cookies();
  jar.set(GAME_MATRIX_COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(request.url).protocol === "https:",
  });

  // Ensure empty decrypt path still works after clear.
  void emptyUserGameProfile();

  return NextResponse.json(
    { ok: true as const, cleared: true as const },
    { status: 200, headers: { "Cache-Control": "private, no-store" } },
  );
}
