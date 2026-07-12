"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { SatelliteIntakeForm, SatelliteLandingShell } from "@/components/satellite";
import type { LandingPageDefinition } from "@/lib/landing/landingCatalog";
import {
  buildDiscoverFunnelRef,
  buildDiscoverPlayHandoffUrl,
  type DiscoverFunnelSubmitEvent,
} from "@/lib/landing/discoverFunnel";
import {
  LANDING_LOCALE_META,
  type LandingLocale,
} from "@/lib/landing/landingLocales";
import { resolveLandingPsychTopic } from "@/lib/landing/resolveLandingPsychTopic";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { trackDiagnosisEvent } from "@/lib/diagnosis/analytics";
import { rubelDs } from "@/lib/rubel/rubelDesignSystem";
import { buildPlayRoute, writeSatelliteIntake } from "@/lib/satellite";
import { writePsychIntakeSeed } from "@/lib/psychology/psychIntakeStore";
import { listClusterLinksForTopic } from "@/lib/seo/internalLinks";
import { cn } from "@/lib/utils/cn";

interface LandingIntakeClientProps {
  page: LandingPageDefinition;
}

function resolvePlayDestination(
  page: LandingPageDefinition,
  funnelRef: string,
  direct: boolean,
): string | null {
  const plugPath = page.topic.plugPlayPath ?? page.topic.psychDiagnosisPath;

  if (plugPath) {
    return buildDiscoverPlayHandoffUrl(plugPath, page.locale, page.slug, { direct });
  }

  const params = new URLSearchParams({
    lang: page.locale,
    ref: funnelRef,
  });

  return `${buildPlayRoute(page.topic.playDiagnosisId)}?${params.toString()}`;
}

export function LandingIntakeClient({ page }: LandingIntakeClientProps) {
  const router = useRouter();
  const { messages } = useI18n();
  const clusterLinks = listClusterLinksForTopic(page.slug, page.locale, 4);
  const funnelRef = useMemo(
    () => buildDiscoverFunnelRef(page.locale, page.slug),
    [page.locale, page.slug],
  );
  const plugPath = page.topic.plugPlayPath ?? page.topic.psychDiagnosisPath;

  const emitFunnelEvent = useCallback(
    (event: DiscoverFunnelSubmitEvent) => {
      trackDiagnosisEvent(event, {
        ref: funnelRef,
        funnelStep: "discover_submit",
        locale: page.locale,
        slug: page.slug,
      });
    },
    [funnelRef, page.locale, page.slug],
  );

  const navigateToPlay = useCallback(
    (userText: string | null, direct: boolean) => {
      if (userText && plugPath) {
        writePsychIntakeSeed({
          topic: resolveLandingPsychTopic(page.slug),
          locale: page.locale,
          userText,
          keyword: page.copy.keyword,
          createdAt: Date.now(),
        });
      }

      if (userText && !plugPath) {
        writeSatelliteIntake({
          locale: page.locale,
          slug: page.slug,
          keyword: page.copy.keyword,
          promptText: page.copy.promptLabel,
          userText,
          playDiagnosisId: page.topic.playDiagnosisId,
          createdAt: Date.now(),
        });
      }

      const destination = resolvePlayDestination(page, funnelRef, direct);

      if (destination) {
        router.push(destination);
      }
    },
    [funnelRef, page, plugPath, router],
  );

  const handleIntakeSubmit = useCallback(
    (userText: string) => {
      emitFunnelEvent("discover_funnel_submit");
      navigateToPlay(userText, false);
    },
    [emitFunnelEvent, navigateToPlay],
  );

  const handleDirectStart = useCallback(() => {
    emitFunnelEvent("discover_funnel_direct");
    navigateToPlay(null, true);
  }, [emitFunnelEvent, navigateToPlay]);

  return (
    <SatelliteLandingShell locale={page.locale} slug={page.slug}>
      <SatelliteIntakeForm
        locale={page.locale}
        copy={page.copy}
        onSubmit={handleIntakeSubmit}
      />
      {plugPath ? (
        <div className="mx-auto mt-4 max-w-md text-center">
          <button
            type="button"
            onClick={handleDirectStart}
            className={cn(
              rubelDs.glassCard,
              "inline-flex min-h-11 w-full items-center justify-center px-4 py-3 text-sm font-medium text-indigo-200 hover:border-indigo-400/40",
            )}
          >
            {messages.discoverFunnel.skipToQuiz}
          </button>
        </div>
      ) : null}
      {clusterLinks.length > 0 ? (
        <nav
          className="mx-auto mt-8 max-w-md"
          aria-label={
            page.locale === "ja" ? "関連トピック" : "Related topics"
          }
        >
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
            {page.locale === "ja" ? "関連トピック" : "Related topics"}
          </p>
          <ul className="flex flex-wrap gap-2">
            {clusterLinks.map((link) => (
              <li key={link.slug}>
                <Link
                  href={link.href}
                  className={cn(
                    rubelDs.glassCard,
                    "inline-flex min-h-11 items-center px-3 py-2 text-sm capitalize",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
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
          href={`/diagnosis?lang=${locale}`}
          className={cn(
            rubelDs.primary,
            "mt-4 inline-flex min-h-11 w-full items-center justify-center text-sm font-semibold",
          )}
        >
          {locale === "ja"
            ? "宇宙キャラ診断カタログを見る →"
            : locale === "ko"
              ? "우주 캐릭터 진단 카탈로그 →"
              : locale === "zh"
                ? "查看宇宙角色诊断目录 →"
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
