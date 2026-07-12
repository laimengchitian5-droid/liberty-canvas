import { NextResponse } from "next/server";
import {
  AUTH_HTTP,
  AUTH_SESSION_MODES,
  LC_SESSION,
} from "@/lib/auth/constants";
import {
  buildSessionClearCookieHeader,
  buildSessionSetCookieHeader,
  createSessionToken,
} from "@/lib/auth/edgeSession";
import {
  createSessionRequestSchema,
  createSessionResponseSchema,
} from "@/lib/validation/authSchema";

export const runtime = "nodejs";

function jsonError(message: string, status: number, details?: unknown) {
  return NextResponse.json(
    { error: message, ...(details !== undefined ? { details } : {}) },
    { status },
  );
}

function buildClearSessionCookieHeader(): string {
  return buildSessionClearCookieHeader();
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return jsonError("Content-Type must be application/json", AUTH_HTTP.badRequest);
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonError("Request body must be valid JSON", AUTH_HTTP.badRequest);
  }

  const parsed = createSessionRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return jsonError(
      "Validation failed",
      AUTH_HTTP.unprocessable,
      parsed.error.flatten(),
    );
  }

  try {
    const expiresAt = new Date(
      Date.now() + LC_SESSION.maxAgeSeconds * 1000,
    ).toISOString();
    const token = await createSessionToken(parsed.data.userId);
    const responseBody = createSessionResponseSchema.parse({
      userId: parsed.data.userId,
      expiresAt,
      mode: parsed.data.mode ?? AUTH_SESSION_MODES.login,
    });

    return NextResponse.json(responseBody, {
      status: AUTH_HTTP.created,
      headers: {
        "Set-Cookie": buildSessionSetCookieHeader(token),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Failed to create session",
      AUTH_HTTP.serverError,
    );
  }
}

export async function DELETE() {
  return NextResponse.json(
    { ok: true },
    {
      status: AUTH_HTTP.ok,
      headers: {
        "Set-Cookie": buildClearSessionCookieHeader(),
        "Cache-Control": "no-store",
      },
    },
  );
}
