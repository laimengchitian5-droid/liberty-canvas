import { NextResponse } from "next/server";
import { getPlugDiagnosisBySlug } from "@/config/diagnoses";
import { appendBuilderAuditEntry, isReservedBuilderSlug } from "@/lib/builder/auditLog";
import { parseSaveBuilderPayload } from "@/lib/builder/builderSchema";
import { buildPublishedBuilderRecord } from "@/lib/builder/publishedRecord";
import {
  getBuilderRecordById,
  listBuilderRecordsByCreator,
  listPublishedBuilderRecords,
  upsertBuilderRecord,
} from "@/lib/builder/repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const creatorId = searchParams.get("creatorId")?.trim();
  const scope = searchParams.get("scope") ?? "published";

  if (scope === "creator" && creatorId) {
    const records = await listBuilderRecordsByCreator(creatorId);
    return NextResponse.json({ records });
  }

  const records = await listPublishedBuilderRecords();
  return NextResponse.json({ records });
}

export async function POST(request: Request) {
  const body = (await request.json()) as unknown;
  const parsed = parseSaveBuilderPayload(body);

  if (!parsed) {
    return NextResponse.json(
      { error: "Invalid builder diagnosis payload" },
      { status: 400 },
    );
  }

  if (isReservedBuilderSlug(parsed.definition.slug)) {
    return NextResponse.json(
      { error: "Slug is reserved and cannot be used" },
      { status: 409 },
    );
  }

  const existing = await getBuilderRecordById(parsed.definition.id);

  if (existing && existing.creatorId !== parsed.creatorId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const staticSlugConflict =
    parsed.status === "published" && getPlugDiagnosisBySlug(parsed.definition.slug);

  if (staticSlugConflict) {
    return NextResponse.json(
      { error: "Slug conflicts with a built-in diagnosis" },
      { status: 409 },
    );
  }

  const record = buildPublishedBuilderRecord({
    definition: parsed.definition,
    creatorId: parsed.creatorId,
    status: parsed.status,
    existing,
  });

  await upsertBuilderRecord(record);

  await appendBuilderAuditEntry({
    at: Date.now(),
    action: parsed.status === "published" ? "publish" : "save_draft",
    recordId: record.id,
    slug: record.slug,
    creatorId: record.creatorId,
  });

  return NextResponse.json({ record });
}
