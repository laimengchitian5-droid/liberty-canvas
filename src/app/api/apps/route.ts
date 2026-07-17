import { NextResponse } from "next/server";
import {
  mapValidatedPayloadToInput,
  saveUniversalApp,
  listApps,
} from "@/lib/apps/repository";
import { jsonError, parseJsonBody } from "@/lib/api/http";
import { refreshPublishedAppDiscovery } from "@/lib/quiz/refreshSitemap";
import { getActiveStorageMode } from "@/lib/storage/jsonStore";
import { buildAppPageUrl } from "@/lib/site/url";
import { createUniversalAppSchema } from "@/lib/validation/appSchema";

export const runtime = "nodejs";

function triggerSitemapInvalidation(appId: string): void {
  refreshPublishedAppDiscovery();

  void Promise.resolve().then(() => {
    console.info("[apps-create] sitemap invalidation queued", { appId });
  });
}

export async function POST(request: Request) {
  const parsed = await parseJsonBody(request, createUniversalAppSchema);

  if (!parsed.ok) {
    return parsed.response;
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
    return jsonError(error instanceof Error ? error.message : "Failed to list apps", 500);
  }
}
