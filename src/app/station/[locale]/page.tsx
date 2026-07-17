import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { CentralTerminalHub } from "@/components/station/CentralTerminalHub";
import { PRODUCT_NAME } from "@/lib/brand/constants";
import {
  deserializeGameMatrixCookie,
  GAME_MATRIX_COOKIE_NAME,
} from "@/lib/edge/crossDomainCookieBridge";
import { emptyUserGameProfile } from "@/lib/gamification/userGameProfileSchema";
import {
  isLocale,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/lib/i18n/config";
import { getSiteUrl } from "@/lib/site/url";
import { resolveStationHubCopy } from "@/lib/station/stationHubCopy";
import type { UserGameProfile } from "@/types/userGameProfile";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

interface StationHubPageProps {
  readonly params: Promise<{
    readonly locale: string;
  }>;
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: StationHubPageProps): Promise<Metadata> {
  const { locale: localeRaw } = await params;
  if (!isLocale(localeRaw)) {
    return { title: `Terminal | ${PRODUCT_NAME}` };
  }

  const copy = resolveStationHubCopy(localeRaw);
  const canonical = `${getSiteUrl()}/station/${localeRaw}`;

  return {
    title: `${copy.hubTitle} | ${PRODUCT_NAME}`,
    description: copy.hubSubtitle.slice(0, 160),
    alternates: { canonical },
    openGraph: {
      title: `${copy.hubTitle} | ${PRODUCT_NAME}`,
      description: copy.hubSubtitle.slice(0, 160),
      url: canonical,
      type: "website",
    },
  };
}

/**
 * /station/[locale] — public central terminal (15 routes + dashboard transfer).
 * Profile decrypt stays on the server; client never receives encryption secrets.
 */
export default async function StationHubPage({ params }: StationHubPageProps) {
  const { locale: localeRaw } = await params;

  if (!isLocale(localeRaw)) {
    notFound();
  }

  const locale = localeRaw;

  return (
    <main className={styles.shell}>
      <Suspense fallback={<HubSkeleton locale={locale} />}>
        <HubTerminal locale={locale} />
      </Suspense>
    </main>
  );
}

async function HubTerminal({ locale }: { readonly locale: Locale }) {
  const profile = await loadGameMatrixProfile();
  return <CentralTerminalHub locale={locale} userProfile={profile} />;
}

async function loadGameMatrixProfile(): Promise<UserGameProfile> {
  const encrypted = cookies().get(GAME_MATRIX_COOKIE_NAME)?.value;
  try {
    return await deserializeGameMatrixCookie(encrypted);
  } catch (error) {
    console.warn("[station/hub] matrix decode fallback:", error);
    return emptyUserGameProfile();
  }
}

const HubSkeleton = ({ locale }: { readonly locale: Locale }) => {
  const label =
    locale === "ja"
      ? "セントラル・ターミナルを開いています…"
      : "Opening the central terminal…";

  return (
    <div
      className={styles.skeleton}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonTransfer} />
      <div className={styles.skeletonGrid}>
        <div className={styles.skeletonPanel} />
        <div className={styles.skeletonPanel} />
        <div className={styles.skeletonPanel} />
      </div>
      <span className={styles.skeletonLabel}>{label}</span>
    </div>
  );
};
