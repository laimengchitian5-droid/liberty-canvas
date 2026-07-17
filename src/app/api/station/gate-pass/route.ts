import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  GAME_MATRIX_COOKIE_NAME,
  deserializeGameMatrixCookie,
  serializeGameMatrixCookie,
} from "@/lib/edge/crossDomainCookieBridge";
import { resolveSessionSecret } from "@/lib/env/serverSecrets";
import { jsonError, parseJsonBody } from "@/lib/api/http";
import { recordGameCompletion } from "@/lib/gamification/userGameProfileSchema";
import { stationGatePassSchema } from "@/lib/validation/stationGatePassSchema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Records a station gate pass into the httpOnly encrypted play-matrix cookie.
 * Secret never leaves the server — clients only POST platformId + visitType.
 */
export async function POST(request: Request) {
  const parsed = await parseJsonBody(request, stationGatePassSchema);
  if (!parsed.ok) {
    return parsed.response;
  }

  if (!resolveSessionSecret()) {
    return jsonError("Session encryption is not configured", 503);
  }

  const { platformId, visitType } = parsed.data;
  const requestUrl = new URL(request.url);
  const jar = cookies();
  const existing = jar.get(GAME_MATRIX_COOKIE_NAME)?.value;

  try {
    const profile = await deserializeGameMatrixCookie(existing);
    const trait =
      visitType === "external" ? "Visited_Official" : "Visited_Studio";
    const next = recordGameCompletion(profile, platformId, trait);

    const cookie = await serializeGameMatrixCookie(next, requestUrl.hostname, {
      secure: requestUrl.protocol === "https:",
    });

    jar.set(cookie.name, cookie.value, {
      path: cookie.options.path,
      maxAge: cookie.options.maxAge,
      secure: cookie.options.secure,
      httpOnly: cookie.options.httpOnly,
      sameSite: cookie.options.sameSite,
      ...(cookie.options.domain ? { domain: cookie.options.domain } : {}),
    });

    return NextResponse.json(
      { ok: true as const, platformId, visitType },
      {
        status: 200,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  } catch (error) {
    console.error("[api/station/gate-pass]", error);
    return jsonError("Failed to sync gate pass", 500);
  }
}
