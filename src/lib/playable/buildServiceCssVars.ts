import type { CSSProperties } from "react";
import type { ServiceCssVariables, ServiceTheme } from "@/types/playableService";

const HEX_COLOR_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const RGB_COLOR_RE =
  /^rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+(?:\s*,\s*[\d.]+)?\s*\)$/;

/** Fail-closed color sanitizer — rejects `url(` / `expression(` injection. */
export function sanitizeCssColor(value: string, fallback: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 64) {
    return fallback;
  }
  if (trimmed.includes("(") && !RGB_COLOR_RE.test(trimmed)) {
    return fallback;
  }
  if (HEX_COLOR_RE.test(trimmed) || RGB_COLOR_RE.test(trimmed)) {
    return trimmed;
  }
  return fallback;
}

function isSafeCssVarName(name: string): name is `--${string}` {
  return /^--lc-service-[a-z0-9-]+$/.test(name);
}

function sanitizeCustomVars(
  vars: ServiceCssVariables | undefined,
): ServiceCssVariables {
  if (!vars) {
    return {};
  }

  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(vars)) {
    if (!isSafeCssVarName(key) || typeof value !== "string") {
      continue;
    }
    const trimmed = value.trim();
    if (!trimmed || trimmed.length > 120 || /[;{}]|url\s*\(/i.test(trimmed)) {
      continue;
    }
    out[key] = trimmed;
  }
  return out;
}

/**
 * Build isolation-root inline style. O(k) in custom var count (bounded registry).
 */
export function buildServiceCssVars(theme: ServiceTheme): CSSProperties {
  const primary = sanitizeCssColor(theme.primaryColor, "#C9A09A");
  const background = sanitizeCssColor(theme.backgroundColor, "#FAF9F6");
  const custom = sanitizeCustomVars(theme.customCssVariables);

  return {
    ["--lc-service-primary" as string]: primary,
    ["--lc-service-bg" as string]: background,
    ...custom,
  } as CSSProperties;
}
