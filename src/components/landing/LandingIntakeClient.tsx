"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { SatelliteIntakeForm, SatelliteLandingShell } from "@/components/satellite";
import type { LandingPageDefinition } from "@/lib/landing/landingCatalog";
import {
  LANDING_LOCALE_META,
  type LandingLocale,
} from "@/lib/landing/landingLocales";
import { rubelDs } from "@/lib/rubel/rubelDesignSystem";
import { buildPlayRoute, writeSatelliteIntake } from "@/lib/satellite";
import { writePsychIntakeSeed } from "@/lib/psychology/psychIntakeStore";
import { cn } from "@/lib/utils/cn";

interface LandingIntakeClientProps {
  page: LandingPageDefinition;
}

export function LandingIntakeClient({ page }: LandingIntakeClientProps) {
  const router = useRouter();

  const handleIntakeSubmit = useCallback(
    (userText: string) => {
      const plugPath = page.topic.plugPlayPath;
      const ref = `discover-${page.slug}`;

      if (plugPath) {
        writePsychIntakeSeed({
          topic: page.slug.includes("enneagram") ? "enneagram" : "big-five",
          locale: page.locale,
          userText,
          keyword: page.copy.keyword,
          createdAt: Date.now(),
        });
        router.push(
          `${plugPath}?lang=${page.locale}&ref=${encodeURIComponent(ref)}`,
        );
        return;
      }

      if (page.topic.psychDiagnosisPath) {
        writePsychIntakeSeed({
          topic: page.slug.includes("enneagram") ? "enneagram" : "big-five",
          locale: page.locale,
          userText,
          keyword: page.copy.keyword,
          createdAt: Date.now(),
        });
        router.push(`${page.topic.psychDiagnosisPath}?lang=${page.locale}`);
        return;
      }

      writeSatelliteIntake({
        locale: page.locale,
        slug: page.slug,
        keyword: page.copy.keyword,
        promptText: page.copy.promptLabel,
        userText,
        playDiagnosisId: page.topic.playDiagnosisId,
        createdAt: Date.now(),
      });

      router.push(buildPlayRoute(page.topic.playDiagnosisId));
    },
    [page, router],
  );

  return (
    <SatelliteLandingShell locale={page.locale} slug={page.slug}>
      <SatelliteIntakeForm
        locale={page.locale}
        copy={page.copy}
        onSubmit={handleIntakeSubmit}
      />
    </SatelliteLandingShell>
  );
}

interface LandingHubClientProps {
  locale: LandingLocale;
  pages: Array<{ slug: string; headline: string; keyword: string }>;
}

export function LandingHubClient({ locale, pages }: LandingHubClientProps) {
  const meta = LANDING_LOCALE_META[locale];

  const hubTitle =
    locale === "ja"
      ? "グローバル性格診断ランディング"
      : locale === "ko"
        ? "글로벌 성격 진단 랜딩"
        : locale === "zh"
          ? "全球性格测试着陆页"
          : "Global Personality Landing Pages";

  return (
    <div
      className={cn(
        "min-h-[100dvh] bg-slate-950 px-4 py-8 text-slate-100",
        meta.fontClass,
      )}
    >
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-bold">{hubTitle}</h1>
        <p className="mt-2 text-sm text-slate-400">LibertyCanvas · AI × 性格診断 × 自由</p>
        <Link
          href="/diagnosis"
          className={cn(
            rubelDs.primary,
            "mt-4 inline-flex min-h-11 w-full items-center justify-center text-sm font-semibold",
          )}
        >
          {locale === "ja"
            ? "宇宙キャラ診断カタログを見る →"
            : "Explore cosmic diagnosis catalog →"}
        </Link>
        <ul className="mt-6 space-y-3">
          {pages.map((entry) => (
            <li key={entry.slug}>
              <Link
                href={`/discover/${locale}/${entry.slug}`}
                className={cn(rubelDs.glassCard, "block px-4 py-3 hover:border-indigo-400/30")}
              >
                <p className="text-xs text-indigo-300">{entry.keyword}</p>
                <p className="mt-1 font-semibold">{entry.headline}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
