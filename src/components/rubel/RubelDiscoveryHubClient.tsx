"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RubelSocialFeed } from "@/components/rubel/feed/RubelSocialFeed";
import { RubelGlobalHeader } from "@/components/rubel/RubelGlobalHeader";
import { HubSearchBar } from "@/components/catalog/HubSearchBar";
import { useRubelLocale } from "@/contexts/RubelLocaleContext";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { deriveCreatorAccent, deriveCreatorInitials } from "@/lib/rubel/creatorDisplay";
import { formatSubmissionCount } from "@/lib/rubel/formatSubmissionCount";
import { filterDiagnosesBySearch } from "@/lib/rubel/multilingualSearch";
import { rubelDs } from "@/lib/rubel/rubelDesignSystem";
import { translateHubTitle } from "@/lib/rubel/translatePayload";
import { cn } from "@/lib/utils/cn";
import type { Diagnosis, HubDiagnosisCard } from "@/types/rubel";
import type { LocaleCode } from "@/types/rubel-i18n";

const HUB_COPY: Record<
  LocaleCode,
  {
    title: string;
    lead: string;
    empty: string;
    create: string;
    search: string;
    freeChat: string;
  }
> = {
  en: {
    title: "Free AI Personality Test",
    lead: "One answer → cosmic result + affirming AI chat. Free, no signup.",
    empty: "No diagnoses yet. Be the first creator.",
    create: "Create a diagnosis",
    search: "Search diagnoses (multilingual semantic)",
    freeChat: "Talk freely with the world",
  },
  ja: {
    title: "無料AI性格診断を探す",
    lead: "1回答で宇宙キャラ結果と全肯定AIチャット。登録不要・無料。",
    empty: "まだ診断がありません。",
    create: "オリジナル診断を作成",
    search: "診断を検索（日本語・English・semantic）",
    freeChat: "世界と自由に話す",
  },
  es: {
    title: "Descubre diagnósticos",
    lead: "Toca Play — responde y chatea con tu persona.",
    empty: "Aún no hay diagnósticos.",
    create: "Crear diagnóstico",
    search: "Buscar diagnósticos",
    freeChat: "Habla libremente con el mundo",
  },
  ko: {
    title: "진단 둘러보기",
    lead: "Play — 한 문항 후 페르소나와 채팅.",
    empty: "아직 진단이 없습니다.",
    create: "진단 만들기",
    search: "진단 검색",
    freeChat: "세계와 자유롭게 대화",
  },
  fr: {
    title: "Découvrir les diagnostics",
    lead: "Play — une question, puis chat avec votre persona.",
    empty: "Aucun diagnostic pour l'instant.",
    create: "Créer un diagnostic",
    search: "Rechercher des diagnostics",
    freeChat: "Parler librement au monde",
  },
};

interface RubelDiscoveryHubClientProps {
  initialCards: HubDiagnosisCard[];
  catalog: Diagnosis[];
}

const RubelDiscoveryHubInner = ({
  initialCards,
  catalog,
}: RubelDiscoveryHubClientProps) => {
  const { locale } = useRubelLocale();
  const { messages } = useI18n();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";
  const copy = HUB_COPY[locale];
  const feedTrending = messages.feed.trending;

  const filteredCatalog = useMemo(
    () => filterDiagnosesBySearch(catalog, searchQuery),
    [catalog, searchQuery],
  );

  const feedCards = useMemo(() => {
    const cardById = new Map(initialCards.map((card) => [card.id, card]));

    return filteredCatalog.map((diagnosis) => {
      const base = cardById.get(diagnosis.id);

      return {
        ...(base ?? {
          id: diagnosis.id,
          title: diagnosis.title,
          creatorName: diagnosis.creatorName,
          creatorInitials: deriveCreatorInitials(diagnosis.creatorName),
          creatorAccent: deriveCreatorAccent(diagnosis.creatorName),
          language: diagnosis.language,
          originFlag: "🌐",
          globalReachLabel: "",
          searchKeywords: diagnosis.searchKeywords,
          totalSubmissions: diagnosis.totalSubmissions,
          questionCount: diagnosis.questions.length,
          resultCount: diagnosis.results.length,
          trendingLabel: "",
          href: `/play/${diagnosis.id}`,
        }),
        displayTitle: translateHubTitle(diagnosis.title, diagnosis.language, locale),
        trendingLabel: feedTrending(formatSubmissionCount(diagnosis.totalSubmissions)),
      };
    });
  }, [feedTrending, filteredCatalog, initialCards, locale]);

  const emptyMessage =
    searchQuery && feedCards.length === 0
      ? `「${searchQuery}」に一致する診断は見つかりませんでした。`
      : copy.empty;

  return (
    <main className={cn(rubelDs.page, "pb-16")}>
      <RubelGlobalHeader midnight />

      <div className="mx-auto w-full max-w-md px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className={rubelDs.header}>{copy.title}</h1>
          <p className={cn(rubelDs.subheader, "mt-2")}>{copy.lead}</p>
          <Link
            href="/create"
            className={cn(
              rubelDs.primary,
              "mt-4 inline-flex min-h-11 items-center gap-2 px-5",
            )}
          >
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            {copy.create}
          </Link>
          <Link
            href="/chat"
            className="mt-3 inline-flex min-h-11 items-center justify-center px-5 text-sm font-medium text-[#5c5348] underline-offset-4 hover:underline"
          >
            {copy.freeChat}
          </Link>
        </header>

        <HubSearchBar placeholder={copy.search} ariaLabel={copy.search} />

        <RubelSocialFeed cards={feedCards} emptyMessage={emptyMessage} />
      </div>
    </main>
  );
};

const RubelDiscoveryHubClient = (props: RubelDiscoveryHubClientProps) => (
  <Suspense fallback={null}>
    <RubelDiscoveryHubInner {...props} />
  </Suspense>
);

export { RubelDiscoveryHubClient };
