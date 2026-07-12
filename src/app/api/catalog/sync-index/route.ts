import { NextResponse } from "next/server";
import { verifyInsightsApiAccess } from "@/lib/auth/verifyInsightsAccess";
import { syncDiscoveryIndex } from "@/lib/catalog/syncDiscoveryIndex";
import { resolveSearchBackend } from "@/lib/catalog/searchConfig";

export async function POST(request: Request) {
  const gate = verifyInsightsApiAccess(request);

  if (!gate.allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: gate.status });
  }

  const result = await syncDiscoveryIndex();

  return NextResponse.json({
    ok: true,
    ...result,
    configuredBackend: resolveSearchBackend(),
  });
}
