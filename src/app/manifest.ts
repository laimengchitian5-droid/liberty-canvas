import type { MetadataRoute } from "next";
import {
  PRODUCT_DESCRIPTION,
  PRODUCT_NAME,
  PRODUCT_SHORT_NAME,
} from "@/lib/brand/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: PRODUCT_NAME,
    short_name: PRODUCT_SHORT_NAME,
    description: PRODUCT_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    lang: "ja",
    dir: "ltr",
    background_color: "#09090B",
    theme_color: "#6366F1",
    categories: ["entertainment", "lifestyle", "social"],
    prefer_related_applications: false,
    icons: [
      {
        src: "/icons/favicon-48.png",
        sizes: "48x48",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/maskable-icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "診断カタログ",
        short_name: "カタログ",
        url: "/diagnosis",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "診断を作成",
        short_name: "作成",
        url: "/create",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}
