import { NextResponse } from "next/server";
import { jsonError, parseJsonBody } from "@/lib/api/http";
import { appendBuilderAuditEntry } from "@/lib/builder/auditLog";
import { buildPublishedBuilderRecord } from "@/lib/builder/publishedRecord";
import {
  deleteBuilderRecord,
  getBuilderRecordById,
  upsertBuilderRecord,
} from "@/lib/builder/repository";
import { builderPatchActionSchema } from "@/lib/validation/builderAndIndexSchema";

interface RouteContext {
  params: { id: string };
}

export async function GET(_request: Request, context: RouteContext) {
  const record = await getBuilderRecordById(context.params.id);

  if (!record) {
    return jsonError("Not found", 404);
  }

  return NextResponse.json({ record });
}

export async function PATCH(request: Request, context: RouteContext) {
  const record = await getBuilderRecordById(context.params.id);

  if (!record) {
    return jsonError("Not found", 404);
  }

  const creatorId = request.headers.get("x-lc-creator-id")?.trim();

  if (!creatorId || creatorId !== record.creatorId) {
    return jsonError("Forbidden", 403);
  }

  const parsed = await parseJsonBody(request, builderPatchActionSchema);

  if (!parsed.ok) {
    if (parsed.response.status === 400) {
      return jsonError("Unsupported action", 400);
    }
    return parsed.response;
  }

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

export async function DELETE(request: Request, context: RouteContext) {
  const record = await getBuilderRecordById(context.params.id);

  if (!record) {
    return jsonError("Not found", 404);
  }

  const creatorId = request.headers.get("x-lc-creator-id")?.trim();

  if (!creatorId || creatorId !== record.creatorId) {
    return jsonError("Forbidden", 403);
  }

  const deleted = await deleteBuilderRecord(context.params.id);

  if (!deleted) {
    return jsonError("Not found", 404);
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
