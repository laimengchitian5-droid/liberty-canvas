import { cookies, headers } from "next/headers";
import { Providers } from "@/components/Providers";
import {
  getDirection,
  type Locale,
} from "@/lib/i18n/config";
import {
  EDGE_LOCALE_HEADER,
  LOCALE_STORAGE_KEY,
  normalizeLocaleCandidate,
  resolveAppLocaleFromRequest,
} from "@/lib/i18n/resolveAppLocale";
import { buildRootMetadata } from "@/lib/seo/siteMetadata";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = buildRootMetadata();

export const viewport: Viewport = {
  themeColor: "#6366F1",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

function resolveServerLocale(): Locale {
  const cookieStore = cookies();
  const headerStore = headers();
  const edgeLocale = normalizeLocaleCandidate(headerStore.get(EDGE_LOCALE_HEADER));

  if (edgeLocale) {
    return edgeLocale;
  }

  return resolveAppLocaleFromRequest({
    cookieLocale: cookieStore.get(LOCALE_STORAGE_KEY)?.value,
    acceptLanguage: headerStore.get("accept-language"),
  });
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = resolveServerLocale();

  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      suppressHydrationWarning
    >
      <body>
        <Providers initialLocale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
