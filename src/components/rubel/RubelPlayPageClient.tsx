"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { RubelCanvasRuntime } from "@/components/rubel/RubelCanvasRuntime";
import {
  resolveDiagnosisForClient,
  upsertClientDiagnosis,
} from "@/lib/rubel/clientCatalog";
import { translatePayload } from "@/lib/rubel/translatePayload";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { Diagnosis } from "@/types/rubel";
import { DEFAULT_LOCALE, type LocaleCode } from "@/types/rubel-i18n";

interface RubelPlayPageClientProps {
  diagnosisId: string;
  serverDiagnosis: Diagnosis | null;
}

function appLocaleToRubel(locale: string): LocaleCode {
  if (locale === "ja") return "ja";
  if (locale === "fr") return "fr";
  return "en";
}

const RubelPlayPageClient = ({
  diagnosisId,
  serverDiagnosis,
}: RubelPlayPageClientProps) => {
  const { locale: appLocale, messages } = useI18n();
  const play = messages.rubelPlay;
  const locale = appLocaleToRubel(appLocale);

  const initialDiagnosis = resolveDiagnosisForClient(
    diagnosisId,
    serverDiagnosis,
  );
  const [missing, setMissing] = useState(!initialDiagnosis);
  const [sourceDiagnosis, setSourceDiagnosis] = useState<Diagnosis | null>(
    initialDiagnosis,
  );
  const [localizedDiagnosis, setLocalizedDiagnosis] = useState<Diagnosis | null>(
    () =>
      initialDiagnosis
        ? translatePayload(initialDiagnosis, locale).diagnosis
        : null,
  );
  const [displayLanguage, setDisplayLanguage] = useState<LocaleCode>(locale);

  useEffect(() => {
    const resolved = resolveDiagnosisForClient(diagnosisId, serverDiagnosis);

    if (!resolved) {
      setMissing(true);
      setSourceDiagnosis(null);
      setLocalizedDiagnosis(null);
      return;
    }

    setMissing(false);
    setSourceDiagnosis(resolved);
  }, [diagnosisId, serverDiagnosis]);

  useEffect(() => {
    if (!sourceDiagnosis) {
      return;
    }

    const rubelLocale = appLocaleToRubel(appLocale);
    setDisplayLanguage(rubelLocale);
    const bundle = translatePayload(sourceDiagnosis, rubelLocale);
    setLocalizedDiagnosis(bundle.diagnosis);
  }, [appLocale, sourceDiagnosis]);

  const handlePlayComplete = useCallback(() => {
    void fetch("/api/rubel/diagnoses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: diagnosisId, action: "increment" }),
    }).catch(() => undefined);

    if (sourceDiagnosis) {
      upsertClientDiagnosis({
        ...sourceDiagnosis,
        totalSubmissions: sourceDiagnosis.totalSubmissions + 1,
      });
    }
  }, [diagnosisId, sourceDiagnosis]);

  if (missing || !sourceDiagnosis || !localizedDiagnosis) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-slate-955 px-4">
        <div className="max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
          {missing ? (
            <>
              <h2 className="text-xl font-bold text-slate-200">{play.canvasNotFound}</h2>
              <p className="mt-2 text-sm text-slate-500">{play.canvasNotFoundHint}</p>
              <Link
                href="/"
                className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-indigo-500 px-5 text-sm font-semibold text-white hover:bg-indigo-400"
              >
                {play.backToHub}
              </Link>
            </>
          ) : (
            <p className="text-sm text-slate-500">{play.loading}</p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-slate-950">
      <RubelCanvasRuntime
        diagnosis={localizedDiagnosis}
        onPlayComplete={handlePlayComplete}
      />
      <p className="sr-only" aria-live="polite">
        Display language: {displayLanguage}
      </p>
    </main>
  );
};

export { RubelPlayPageClient };
