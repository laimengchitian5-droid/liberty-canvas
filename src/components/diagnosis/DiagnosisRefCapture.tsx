"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trackDiagnosisEvent } from "@/lib/diagnosis/analytics";

const REF_STORAGE_KEY = "lc-diagnosis-ref";
const LANG_STORAGE_KEY = "lc-diagnosis-lang";

export function captureDiagnosisRef(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return sessionStorage.getItem(REF_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function DiagnosisRefCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref")?.trim();
    const lang = searchParams.get("lang")?.trim();

    try {
      if (ref) {
        sessionStorage.setItem(REF_STORAGE_KEY, ref);
        trackDiagnosisEvent("diagnosis_ref_captured", {
          ref,
          funnelStep: "discover_ref",
          locale: lang ?? undefined,
        });
      }

      if (lang) {
        sessionStorage.setItem(LANG_STORAGE_KEY, lang);
      }
    } catch {
      // ignore
    }
  }, [searchParams]);

  return null;
}
