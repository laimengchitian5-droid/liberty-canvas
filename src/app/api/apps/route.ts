import { NextResponse } from "next/server";
import {
  mapValidatedPayloadToInput,
  saveUniversalApp,
  listApps,
} from "@/lib/apps/repository";
import { refreshPublishedAppDiscovery } from "@/lib/quiz/refreshSitemap";
import { getActiveStorageMode } from "@/lib/storage/jsonStore";
import { buildAppPageUrl } from "@/lib/site/url";
import { createUniversalAppSchema } from "@/lib/validation/appSchema";

export const runtime = "nodejs";

function jsonError(message: string, status: number, details?: unknown) {
  return NextResponse.json(
    { error: message, ...(details !== undefined ? { details } : {}) },
    { status },
  );
}

function triggerSitemapInvalidation(appId: string): void {
  refreshPublishedAppDiscovery();

  void Promise.resolve().then(() => {
    console.info("[apps-create] sitemap invalidation queued", { appId });
  });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return jsonError("Content-Type must be application/json", 415);
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonError("Request body must be valid JSON", 400);
  }

  const parsed = createUniversalAppSchema.safeParse(payload);

  if (!parsed.success) {
    return jsonError("Validation failed", 400, parsed.error.flatten());
  }

  try {
    const input = mapValidatedPayloadToInput(parsed.data);
    const app = await saveUniversalApp(input);
    triggerSitemapInvalidation(app.id);

    const publicUrl = buildAppPageUrl(app.id);

    return NextResponse.json(
      {
        appId: app.id,
        app,
        discovery: {
          sitemapRefreshed: true,
          publicPath: `/app/${app.id}`,
          publicUrl,
        },
      },
      {
        status: 201,
        headers: { Location: publicUrl },
      },
    );
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Failed to create universal app",
      500,
    );
  }
}

export async function GET() {
  try {
    const apps = await listApps();

    return NextResponse.json({
      apps,
      count: apps.length,
      storage: getActiveStorageMode(),
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Failed to list apps",
      500,
    );
  }
}
