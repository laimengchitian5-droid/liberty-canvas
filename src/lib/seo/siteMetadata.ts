import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site/url";
import {
  PRODUCT_DESCRIPTION,
  PRODUCT_NAME,
  PRODUCT_SHORT_NAME,
} from "@/lib/brand/constants";

export const GOOGLE_SITE_VERIFICATION_TOKEN =
  "-h8gKgWbXc5zfc-Y-NqWTd53-FW1At752195m3NT3yg";

export function getGoogleSiteVerification(): string {
  const envToken = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  return envToken || GOOGLE_SITE_VERIFICATION_TOKEN;
}

export function buildRootMetadata(): Metadata {
  const googleSiteVerification = getGoogleSiteVerification();

  return {    title: {
      default: `${PRODUCT_NAME} — 無料AI性格診断`,
      template: `%s | ${PRODUCT_NAME}`,
    },
    description: PRODUCT_DESCRIPTION,
    metadataBase: new URL(getSiteUrl()),
    applicationName: PRODUCT_NAME,
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48", type: "image/png" },
        { url: "/icons/favicon-48.png", sizes: "48x48", type: "image/png" },
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        { url: "/icons/icon.svg", type: "image/svg+xml", sizes: "512x512" },
      ],
      apple: [
        { url: "/icons/icon-192.png", sizes: "180x180", type: "image/png" },
        { url: "/icons/apple-touch-icon.svg", type: "image/svg+xml", sizes: "180x180" },
      ],
      shortcut: ["/favicon.ico"],
    },
    appleWebApp: {
      capable: true,
      title: PRODUCT_SHORT_NAME,
      statusBarStyle: "black-translucent",
    },
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
    robots: {
      index: true,
      follow: true,
    },
    verification: {
      google: googleSiteVerification,
    },
  };
}
