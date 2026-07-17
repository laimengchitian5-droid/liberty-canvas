"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { writeDiagnosisLang, writeDiagnosisRef } from "@/lib/diagnosis/diagnosisSession";
import { trackDiagnosisEvent } from "@/lib/diagnosis/analytics";
import { normalizeLocaleCandidate } from "@/lib/i18n/resolveAppLocale";

export function DiagnosisRefCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref")?.trim();
    const lang = normalizeLocaleCandidate(searchParams.get("lang"));

    if (ref) {
      writeDiagnosisRef(ref);
      trackDiagnosisEvent("diagnosis_ref_captured", {
        ref,
        funnelStep: "discover_ref",
        locale: lang ?? undefined,
      });
    }

    if (lang) {
      writeDiagnosisLang(lang);
    }
  }, [searchParams]);

  return null;
}
