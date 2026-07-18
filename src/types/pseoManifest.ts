import { z } from "zod";
import { LANDING_LOCALES } from "@/lib/landing/landingLocales";
import { LANDING_TOPIC_SLUGS } from "@/lib/landing/landingTopics";

/**
 * Discover pSEO contracts — Zod at the boundary, no open redirects.
 *
 * Rejected sketch defects:
 * - bare `locale: string` / `slug: string` (use landing enums)
 * - `targetRedirectUrl: z.string().url()` as required affiliate sink
 *   (Liberty Discover routes first-party via `destinationPath`)
 * - generic `PageMetadata` / `RouteParams` names (collide with Next.js)
 */

/** Same-origin relative path only — rejects `//…`, schemes, and empty. */
const FirstPartyPathSchema = z
  .string()
  .trim()
  .min(1)
  .max(240)
  .regex(/^\/(?!\/)[\w\-./]*$/, {
    message: "destinationPath must be a first-party relative path",
  });

/** SERP + above-the-fold surface copy for one locale × slug cell. */
export const PseoPageSurfaceSchema = z.object({
  title: z.string().trim().min(5).max(100),
  description: z.string().trim().min(10).max(200),
  h1Title: z.string().trim().min(5).max(100),
  ctaText: z.string().trim().min(5).max(50),
});

export type PseoPageSurface = z.infer<typeof PseoPageSurfaceSchema>;

/**
 * `generateStaticParams` cell for `/discover/[locale]/[slug]`.
 * Locale / slug are closed enums — O(1) membership via Zod.
 */
export const PseoRouteParamsSchema = z.object({
  locale: z.enum(LANDING_LOCALES),
  slug: z.enum(LANDING_TOPIC_SLUGS),
});

export type PseoRouteParams = z.infer<typeof PseoRouteParamsSchema>;

/** Full manifest row: route identity + surface + first-party destination. */
export const PseoManifestEntrySchema = PseoRouteParamsSchema.extend({
  surface: PseoPageSurfaceSchema,
  destinationPath: FirstPartyPathSchema,
});

export type PseoManifestEntry = z.infer<typeof PseoManifestEntrySchema>;

export function parsePseoRouteParams(
  input: unknown,
): PseoRouteParams | null {
  const parsed = PseoRouteParamsSchema.safeParse(input);
  return parsed.success ? parsed.data : null;
}

export function parsePseoManifestEntry(
  input: unknown,
): PseoManifestEntry | null {
  const parsed = PseoManifestEntrySchema.safeParse(input);
  return parsed.success ? parsed.data : null;
}

/** @deprecated Prefer {@link PseoPageSurfaceSchema} */
export const PageMetadataSchema = PseoPageSurfaceSchema;
/** @deprecated Prefer {@link PseoPageSurface} */
export type PageMetadata = PseoPageSurface;
/** @deprecated Prefer {@link PseoRouteParams} */
export type RouteParams = PseoRouteParams;
