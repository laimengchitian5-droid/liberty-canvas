"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { getLocaleLabel, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { isDiscoverFunnelRef } from "@/lib/landing/discoverFunnelRef";
import { isLandingLocale } from "@/lib/landing/landingLocales";
import { trackDiagnosisEvent } from "@/lib/diagnosis/analytics";
import { peekPsychIntakeSeed } from "@/lib/psychology/psychIntakeStore";
import { cn } from "@/lib/utils/cn";

export function DiscoverPlayHandoff() {
  const searchParams = useSearchParams();
  const { locale, messages } = useI18n();
  const [intakePreview, setIntakePreview] = useState<string | null>(null);

  const ref = searchParams.get("ref")?.trim() ?? null;
  const queryLang = searchParams.get("lang");
  const displayLocale: Locale = useMemo(() => {
    if (queryLang && isLandingLocale(queryLang)) {
      return queryLang;
    }

    return locale;
  }, [locale, queryLang]);

  const showHandoff = isDiscoverFunnelRef(ref);

  useEffect(() => {
    if (!showHandoff) {
      return;
    }

    trackDiagnosisEvent("discover_play_arrival", {
      ref,
      funnelStep: "discover_arrival",
      locale: displayLocale,
    });

    const seed = peekPsychIntakeSeed(
      isLandingLocale(displayLocale) ? displayLocale : undefined,
    );

    setIntakePreview(seed?.userText ?? null);
  }, [displayLocale, ref, showHandoff]);

  if (!showHandoff) {
    return null;
  }

  const copy = messages.discoverFunnel;

  return (
    <aside
      className={cn(
        "mx-auto mb-6 max-w-2xl rounded-2xl border border-indigo-400/30",
        "bg-indigo-950/40 px-4 py-4 shadow-lg backdrop-blur-md",
      )}
      aria-label={copy.handoffEyebrow}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
        {copy.handoffEyebrow}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold text-white">{copy.handoffTitle}</h2>
        <span
          className="rounded-full bg-indigo-500/20 px-2.5 py-1 text-xs font-medium text-indigo-100"
          aria-label={`${copy.localeBadge}: ${getLocaleLabel(displayLocale)}`}
        >
          {getLocaleLabel(displayLocale)}
        </span>
      </div>
      <p className="mt-1 text-sm leading-relaxed text-slate-300">{copy.handoffLead}</p>
      {intakePreview ? (
        <blockquote className="mt-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200">
          <span className="mb-1 block text-xs font-medium text-indigo-200">
            {copy.yourAnswerLabel}
          </span>
          「{intakePreview}」
        </blockquote>
      ) : null}
      <p className="mt-3 flex items-center gap-1.5 text-xs text-indigo-200/90">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        LibertyCanvas
      </p>
    </aside>
  );
}
