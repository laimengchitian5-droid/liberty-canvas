import { NextResponse } from "next/server";
import { convertBuilderToPlugDefinition } from "@/lib/builder/convertBuilderToPlugDefinition";
import { getPublishedBuilderBySlug } from "@/lib/builder/repository";

interface RouteContext {
  params: { slug: string };
}

export async function GET(_request: Request, context: RouteContext) {
  const record = await getPublishedBuilderBySlug(context.params.slug);

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    record,
    plugDefinition: convertBuilderToPlugDefinition(record.definition),
  });
}
