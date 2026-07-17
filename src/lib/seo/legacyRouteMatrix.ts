/**
 * GSC legacy URLs → Plug canonical paths (slug authority preserved on /discover/*).
 * Middleware applies 301 with ?lang= and optional ref=gsc-legacy.
 */
export const LEGACY_DIAGNOSIS_REDIRECTS: Readonly<Record<string, string>> = {
  "/diagnosis/big-five": "/diagnosis/play/big-five",
  "/diagnosis/enneagram": "/diagnosis/play/motivation-spectrum",
  "/diagnosis/motivation-spectrum": "/diagnosis/play/motivation-spectrum",
  "/diagnosis/motivation": "/diagnosis/play/motivation-spectrum",
  "/diagnosis/personality-spectrum": "/diagnosis/play/personality-spectrum",
  "/diagnosis/personality-types": "/diagnosis/play/personality-spectrum",
  "/diagnosis/personality-test": "/diagnosis/play/personality-spectrum",
  "/diagnosis/mbti": "/diagnosis/play/personality-spectrum",
  "/diagnosis/mbti-test": "/diagnosis/play/personality-spectrum",
  "/diagnosis/16personalities": "/diagnosis/play/personality-spectrum",
  "/diagnosis/16-personalities": "/diagnosis/play/personality-spectrum",
  "/diagnosis/sixteen-personalities": "/diagnosis/play/personality-spectrum",
  "/diagnosis/ocean": "/diagnosis/play/big-five",
  "/diagnosis/assessment": "/diagnosis/play/personality-spectrum",
  "/diagnosis/legacy": "/diagnosis/play/personality-spectrum",
  "/diagnosis/v2/big-five": "/diagnosis/play/big-five",
  "/diagnosis/v2/enneagram": "/diagnosis/play/motivation-spectrum",
  "/diagnosis/v2/assessment": "/diagnosis/play/personality-spectrum",
};

export function resolveLegacyDiagnosisRedirect(pathname: string): string | null {
  return LEGACY_DIAGNOSIS_REDIRECTS[pathname] ?? null;
}

export function buildLegacyRedirectUrl(requestUrl: URL, targetPath: string): URL {
  const url = new URL(targetPath, requestUrl.origin);

  for (const [key, value] of requestUrl.searchParams.entries()) {
    url.searchParams.set(key, value);
  }

  if (!url.searchParams.has("ref")) {
    url.searchParams.set("ref", "gsc-legacy");
  }

  return url;
}
