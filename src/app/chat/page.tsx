import type { Metadata } from "next";
import { GlobalFreeChat } from "@/components/chat/GlobalFreeChat";
import { getGlobalChatCopy } from "@/lib/chat/globalFreeChat";
import { buildHreflangAlternates } from "@/lib/seo/hreflang";
import { buildGenericOgImageUrl } from "@/lib/seo/ogUrls";
import { getSiteUrl } from "@/lib/site/url";

const copy = getGlobalChatCopy("en");

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: {
    canonical: `${getSiteUrl()}/chat`,
    languages: buildHreflangAlternates("/chat"),
  },
  openGraph: {
    title: copy.metaTitle,
    description: copy.metaDescription,
    url: `${getSiteUrl()}/chat`,
    images: [{ url: buildGenericOgImageUrl(), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: copy.metaTitle,
    description: copy.metaDescription,
  },
  robots: { index: true, follow: true },
};

const ChatPage = () => {
  return (
    <main>
      <GlobalFreeChat />
    </main>
  );
};

export default ChatPage;
