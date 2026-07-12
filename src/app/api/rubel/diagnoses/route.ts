import { NextResponse } from "next/server";
import {
  getDiagnosisById,
  incrementDiagnosisSubmissions,
  listDiagnoses,
  saveDiagnosis,
} from "@/lib/rubel/repository";
import type { Diagnosis } from "@/types/rubel";

export async function GET() {
  const diagnoses = await listDiagnoses();
  return NextResponse.json({ diagnoses });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Diagnosis;

  if (!body?.id || !body.title || !Array.isArray(body.questions)) {
    return NextResponse.json({ error: "Invalid diagnosis payload" }, { status: 400 });
  }

  await saveDiagnosis(body);
  return NextResponse.json({ diagnosis: body });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as { id?: string; action?: string };

  if (body.action !== "increment" || !body.id) {
    return NextResponse.json({ error: "Invalid increment payload" }, { status: 400 });
  }

  const updated = await incrementDiagnosisSubmissions(body.id);

  if (!updated) {
    return NextResponse.json({ error: "Diagnosis not found" }, { status: 404 });
  }

  return NextResponse.json({ diagnosis: updated });
}
