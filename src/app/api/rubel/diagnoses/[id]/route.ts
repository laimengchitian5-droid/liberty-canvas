import { NextResponse } from "next/server";
import { getDiagnosisById } from "@/lib/rubel/repository";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const diagnosis = await getDiagnosisById(id);

  if (!diagnosis) {
    return NextResponse.json({ error: "Diagnosis not found" }, { status: 404 });
  }

  return NextResponse.json({ diagnosis });
}
