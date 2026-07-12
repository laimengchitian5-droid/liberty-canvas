import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getInsightsSecret,
  INSIGHTS_COOKIE,
  isInsightsAccessAllowed,
} from "@/lib/auth/verifyInsightsAccess";

const bodySchema = z.object({
  key: z.string().min(1),
});

export async function POST(request: Request) {
  const secret = getInsightsSecret();

  if (!secret) {
    return NextResponse.json(
      { error: "Insights secret is not configured." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as unknown;
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  if (!isInsightsAccessAllowed({ headerKey: parsed.data.key })) {
    return NextResponse.json({ error: "Invalid access key." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(INSIGHTS_COOKIE, secret, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
