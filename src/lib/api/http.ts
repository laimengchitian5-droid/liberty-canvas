import { NextResponse } from "next/server";
import type { ZodType } from "zod";

/** Shared JSON error envelope for App Router API routes. */
export function jsonError(
  message: string,
  status: number,
  details?: unknown,
): NextResponse {
  return NextResponse.json(
    { error: message, ...(details !== undefined ? { details } : {}) },
    {
      status,
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}

export type ParseJsonBodySuccess<T> = { ok: true; data: T };
export type ParseJsonBodyFailure = { ok: false; response: NextResponse };
export type ParseJsonBodyResult<T> = ParseJsonBodySuccess<T> | ParseJsonBodyFailure;

export interface ParseJsonBodyOptions {
  /** HTTP status for Zod failures (default 400). */
  readonly validationStatus?: number;
}

/**
 * Fail-closed JSON body parse + Zod safeParse.
 * Returns a ready-to-return NextResponse on any boundary failure.
 */
export async function parseJsonBody<T>(
  request: Request,
  schema: ZodType<T>,
  options: ParseJsonBodyOptions = {},
): Promise<ParseJsonBodyResult<T>> {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return {
      ok: false,
      response: jsonError("Content-Type must be application/json", 415),
    };
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return {
      ok: false,
      response: jsonError("Request body must be valid JSON", 400),
    };
  }

  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      response: jsonError(
        "Validation failed",
        options.validationStatus ?? 400,
        parsed.error.flatten(),
      ),
    };
  }

  return { ok: true, data: parsed.data };
}
