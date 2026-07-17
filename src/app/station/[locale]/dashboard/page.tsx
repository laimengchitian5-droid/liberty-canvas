import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { UserAttributeDashboard } from "@/components/station/UserAttributeDashboard";
import {
  deserializeGameMatrixCookie,
  GAME_MATRIX_COOKIE_NAME,
} from "@/lib/edge/crossDomainCookieBridge";
import {
  isLocale,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/lib/i18n/config";
import { resolveStationDashboardCopy } from "@/lib/station/stationDashboardCopy";
import { emptyUserGameProfile } from "@/lib/gamification/userGameProfileSchema";
import type { UserGameProfile } from "@/types/userGameProfile";
import { PRODUCT_NAME } from "@/lib/brand/constants";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  readonly params: Promise<{
    readonly locale: string;
  }>;
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: DashboardPageProps): Promise<Metadata> {
  const { locale: localeRaw } = await params;
  if (!isLocale(localeRaw)) {
    return { title: `Terminal | ${PRODUCT_NAME}` };
  }

  const copy = resolveStationDashboardCopy(localeRaw);
  return {
    title: `${copy.title} | ${PRODUCT_NAME}`,
    description: copy.subtitle,
    robots: { index: false, follow: false },
  };
}

/**
 * /station/[locale]/dashboard — server decrypt only; client never sees the secret.
 *
 * Stack truth (sketch corrections):
 * - deserializeGameMatrixCookie ← `@/lib/edge/crossDomainCookieBridge`
 * - SUPPORTED_LOCALES / isLocale ← `@/lib/i18n/config`
 * - cookie name ← GAME_MATRIX_COOKIE_NAME (`lc_game_matrix`)
 * - skeleton CSS ← `./page.module.css` (not a parallel DashboardSkeleton file)
 */
export default async function StationDashboardPage({
  params,
}: DashboardPageProps) {
  const { locale: localeRaw } = await params;

  if (!isLocale(localeRaw)) {
    notFound();
  }

  const locale = localeRaw;

  return (
    <main className={styles.shell}>
      <Suspense fallback={<DashboardSkeleton locale={locale} />}>
        <DashboardTerminal locale={locale} />
      </Suspense>

      <p className={styles.footnote}>
        {locale === "ja"
          ? "乗車履歴は暗号化クッキーに保存されます（httpOnly・サーバー復号）。"
          : "Boarding history is stored in an encrypted httpOnly cookie."}
      </p>
    </main>
  );
}

async function DashboardTerminal({
  locale,
}: {
  readonly locale: Locale;
}) {
  const profile = await loadGameMatrixProfile();
  return <UserAttributeDashboard profile={profile} locale={locale} />;
}

async function loadGameMatrixProfile(): Promise<UserGameProfile> {
  const encrypted = cookies().get(GAME_MATRIX_COOKIE_NAME)?.value;
  try {
    return await deserializeGameMatrixCookie(encrypted);
  } catch (error) {
    console.warn("[station/dashboard] matrix decode fallback:", error);
    return emptyUserGameProfile();
  }
}

const DashboardSkeleton = ({
  locale,
}: {
  readonly locale: Locale;
}) => {
  const label =
    locale === "ja" ? "ターミナルを開いています…" : "Opening your terminal…";

  return (
    <div
      className={styles.skeleton}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonProgress} />
      <div className={styles.skeletonGrid}>
        <div className={styles.skeletonPanel} />
        <div className={styles.skeletonPanel} />
      </div>
      <span className={styles.skeletonLabel}>{label}</span>
    </div>
  );
};
