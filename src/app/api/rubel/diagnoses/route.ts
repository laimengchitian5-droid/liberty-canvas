import { NextResponse } from "next/server";
import { jsonError, parseJsonBody } from "@/lib/api/http";
import {
  incrementDiagnosisSubmissions,
  listDiagnoses,
  saveDiagnosis,
} from "@/lib/rubel/repository";
import {
  asRubelDiagnosis,
  rubelDiagnosisIncrementSchema,
  rubelDiagnosisSaveSchema,
} from "@/lib/validation/rubelDiagnosisSchema";

export async function GET() {
  const diagnoses = await listDiagnoses();
  return NextResponse.json({ diagnoses });
}

export async function POST(request: Request) {
  const parsed = await parseJsonBody(request, rubelDiagnosisSaveSchema);

  if (!parsed.ok) {
    return parsed.response;
  }

  const diagnosis = asRubelDiagnosis(parsed.data);
  await saveDiagnosis(diagnosis);
  return NextResponse.json(
    { diagnosis },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

export async function PATCH(request: Request) {
  const parsed = await parseJsonBody(request, rubelDiagnosisIncrementSchema);

  if (!parsed.ok) {
    return parsed.response;
  }

  const updated = await incrementDiagnosisSubmissions(parsed.data.id);

  if (!updated) {
    return jsonError("Diagnosis not found", 404);
  }

  return NextResponse.json(
    { diagnosis: updated },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
