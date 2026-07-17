import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { StationGlobalHeader } from "@/components/station/StationGlobalHeader";
import { getDirection, isLocale, SUPPORTED_LOCALES } from "@/lib/i18n/config";

interface StationLocaleLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{
    readonly locale: string;
  }>;
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

/**
 * Shared chrome for /station/[locale]/* — canonical hub/dashboard links only.
 */
export default async function StationLocaleLayout({
  children,
  params,
}: StationLocaleLayoutProps) {
  const { locale: localeRaw } = await params;

  if (!isLocale(localeRaw)) {
    notFound();
  }

  const locale = localeRaw;
  const direction = getDirection(locale);

  return (
    <div lang={locale} dir={direction}>
      <StationGlobalHeader locale={locale} />
      {children}
    </div>
  );
}
