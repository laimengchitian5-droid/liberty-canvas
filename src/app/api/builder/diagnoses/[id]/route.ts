import { NextResponse } from "next/server";
import { appendBuilderAuditEntry } from "@/lib/builder/auditLog";
import { buildPublishedBuilderRecord } from "@/lib/builder/publishedRecord";
import {
  deleteBuilderRecord,
  getBuilderRecordById,
  upsertBuilderRecord,
} from "@/lib/builder/repository";

interface RouteContext {
  params: { id: string };
}

export async function GET(_request: Request, context: RouteContext) {
  const record = await getBuilderRecordById(context.params.id);

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ record });
}

export async function PATCH(request: Request, context: RouteContext) {
  const record = await getBuilderRecordById(context.params.id);

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const creatorId = request.headers.get("x-lc-creator-id")?.trim();

  if (!creatorId || creatorId !== record.creatorId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { action?: string };

  if (body.action === "unpublish") {
    const unpublished = buildPublishedBuilderRecord({
      definition: record.definition,
      creatorId: record.creatorId,
      status: "draft",
      existing: record,
    });

    await upsertBuilderRecord(unpublished);

    await appendBuilderAuditEntry({
      at: Date.now(),
      action: "unpublish",
      recordId: record.id,
      slug: record.slug,
      creatorId: record.creatorId,
    });

    return NextResponse.json({ record: unpublished });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}

export async function DELETE(request: Request, context: RouteContext) {
  const record = await getBuilderRecordById(context.params.id);

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const creatorId = request.headers.get("x-lc-creator-id")?.trim();

  if (!creatorId || creatorId !== record.creatorId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const deleted = await deleteBuilderRecord(context.params.id);

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await appendBuilderAuditEntry({
    at: Date.now(),
    action: "delete",
    recordId: record.id,
    slug: record.slug,
    creatorId: record.creatorId,
  });

  return NextResponse.json({ ok: true });
}
