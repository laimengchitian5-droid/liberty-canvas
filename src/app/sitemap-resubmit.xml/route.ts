import { NextResponse } from "next/server";
import {
  buildResubmitSitemapEntries,
  renderResubmitSitemapXml,
} from "@/lib/seo/buildResubmitSitemap";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

/**
 * Production resubmit sitemap for Google Search Console.
 * After deploy: submit https://{host}/sitemap-resubmit.xml
 * Excludes upcoming specialty landings (noindex).
 */
export async function GET() {
  const entries = buildResubmitSitemapEntries();
  const xml = renderResubmitSitemapXml(entries);

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
