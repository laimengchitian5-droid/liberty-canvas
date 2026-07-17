import type { BrandId } from "@/lib/brand/registry";
import { getSiteUrl } from "@/lib/site/url";

/** Structural route keys — functional domains stay outside BrandIdentity. */
export type BrandRouteKey = "hub" | "engine" | "docs";

const BRAND_PATH_TABLE: Readonly<
  Record<BrandId, Readonly<Partial<Record<BrandRouteKey, string>>>>
> = {
  "liberty-canvas": { hub: "/", docs: "/" },
  "liberty-plug": {
    hub: "/diagnosis",
    engine: "/diagnosis/play/personality-spectrum",
  },
  "liberty-play": { hub: "/play", engine: "/play" },
  "liberty-discover": { hub: "/discover" },
  "liberty-forge": { hub: "/create", engine: "/create" },
  "liberty-runtime": { hub: "/", docs: "/", engine: "/app" },
};

export interface BrandUrlResolver {
  resolvePath(brandId: BrandId, key?: BrandRouteKey): string;
  resolveAbsolute(brandId: BrandId, key?: BrandRouteKey): string;
}

function normalizePath(path: string): string {
  if (path === "/") {
    return "/";
  }
  return path.startsWith("/") ? path.replace(/\/$/, "") : `/${path}`;
}

const ORIGIN_PATTERN = /^https?:\/\/[^\s/]+$/i;

/** Fail-closed origin parse — invalid env falls back to monolith site URL. */
export function resolveBrandOrigin(brandId: BrandId): string {
  const envKey = `NEXT_PUBLIC_BRAND_ORIGIN_${brandId.replace(/-/g, "_").toUpperCase()}`;
  const override = process.env[envKey]?.replace(/\/$/, "");
  if (override && ORIGIN_PATTERN.test(override)) {
    return override;
  }
  return getSiteUrl();
}

export function resolveBrandPath(brandId: BrandId, key: BrandRouteKey = "hub"): string {
  const entry = BRAND_PATH_TABLE[brandId];
  const path = entry[key] ?? entry.hub ?? "/";
  return normalizePath(path);
}

export function resolveBrandAbsolute(
  brandId: BrandId,
  key: BrandRouteKey = "hub",
): string {
  const origin = resolveBrandOrigin(brandId);
  const path = resolveBrandPath(brandId, key);
  return path === "/" ? origin : `${origin}${path}`;
}

/** Absolute URL for an arbitrary relative pathname under a brand origin. */
export function resolvePageAbsolute(brandId: BrandId, pathname: string): string {
  const origin = resolveBrandOrigin(brandId);
  const path = normalizePath(pathname);
  return path === "/" ? origin : `${origin}${path}`;
}

export const brandUrlResolver: BrandUrlResolver = {
  resolvePath: resolveBrandPath,
  resolveAbsolute: resolveBrandAbsolute,
};
