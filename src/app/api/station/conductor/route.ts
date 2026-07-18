import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api/http";
import {
  buildConductorFallbackResponse,
  runIdentityConductor,
} from "@/lib/station/identityConductor/runIdentityConductor";
import {
  ConductorRequestSchema,
  ConductorResponseSchema,
  type ConductorRequest,
} from "@/types/conductor";

/**
 * Node runtime — AI SDK providers need server secrets (not Edge-safe).
 *
 * Rejected sketch defects:
 * - `runtime = "edge"` ("超爆速" does not beat missing provider secrets)
 * - `@/src/types` / `@/src/lib` imports
 * - locale mockRegistry instead of {@link runIdentityConductor}
 * - incomplete JSON (`ctaHref` only) skipping Zod response contract
 * - `/discover/{locale}/{slug}` (use Plug play path from assemble/fallback)
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonConductorOk(
  body: ReturnType<typeof buildConductorFallbackResponse>,
): NextResponse {
  const checked = ConductorResponseSchema.safeParse(body);
  const payload = checked.success ? checked.data : body;

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "X-Conductor-Source": payload.source,
      "X-Conductor-Slug": payload.expressLineSlug,
    },
  });
}

/**
 * POST /api/station/conductor
 *
 * Layers:
 * 1) Request Zod guard ({@link ConductorRequestSchema})
 * 2) Deterministic Plug slug inside {@link runIdentityConductor} (AI cannot re-route)
 * 3) AI prose → Zod / timeout → sync fallback prose
 * 4) Response Zod + fatal HA fallback (never invent `global-identity-core`)
 */
export async function POST(request: Request): Promise<Response> {
  let parsedRequest: ConductorRequest | null = null;

  try {
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return jsonError("Invalid JSON body", 400);
    }

    const parsed = ConductorRequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      return jsonError("Invalid conductor payload", 400, {
        issues: parsed.error.flatten(),
      });
    }

    parsedRequest = parsed.data;
    const teaser = await runIdentityConductor(parsedRequest);
    return jsonConductorOk(teaser);
  } catch (fatalError) {
    console.error("[api/station/conductor] fatal:", fatalError);

    if (parsedRequest) {
      return jsonConductorOk(buildConductorFallbackResponse(parsedRequest));
    }

    return jsonError("Conductor unavailable", 500);
  }
}
