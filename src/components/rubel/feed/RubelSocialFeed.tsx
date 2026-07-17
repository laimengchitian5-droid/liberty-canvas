"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { formatCreatorHandle } from "@/lib/rubel/creatorDisplay";
import { rubelDs } from "@/lib/rubel/rubelDesignSystem";
import { cn } from "@/lib/utils/cn";
import type { HubDiagnosisCard } from "@/types/rubel";

const FEED_SPRING = {
  type: "spring" as const,
  stiffness: 320,
  damping: 30,
};

interface RubelSocialFeedProps {
  cards: Array<HubDiagnosisCard & { displayTitle: string }>;
  emptyMessage: string;
}

const RubelSocialFeed = ({ cards, emptyMessage }: RubelSocialFeedProps) => {
  const { messages } = useI18n();
  const feed = messages.feed;

  if (cards.length === 0) {
    return (
      <p className={cn(rubelDs.cardPadding, "text-center text-slate-500")}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="mx-auto flex max-w-md flex-col gap-4">
      {cards.map((card, index) => (
        <motion.li
          key={card.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...FEED_SPRING, delay: index * 0.06 }}
        >
          <article className={cn(rubelDs.card, "overflow-hidden")}>
            <div className="flex items-start gap-3 border-b border-slate-800 p-4">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-sm font-bold text-slate-200"
                aria-hidden="true"
              >
                {card.creatorInitials}
              </div>
              <div className="min-w-0 flex-1">
                <p className={rubelDs.label}>{formatCreatorHandle(card.creatorName)}</p>
                <p className={rubelDs.muted}>{card.trendingLabel}</p>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-xl font-bold text-slate-200">{card.displayTitle}</h3>
              <p className={cn(rubelDs.muted, "mt-2")}>
                {card.questionCount}{" "}
                {card.questionCount === 1 ? feed.questionSingular : feed.questionPlural} ·{" "}
                {card.resultCount}{" "}
                {card.resultCount === 1 ? feed.personaSingular : feed.personaPlural}
              </p>
            </div>

            <div className="border-t border-slate-800 p-4">
              <Link
                href={card.href}
                className={cn(
                  rubelDs.primary,
                  "flex min-h-11 w-full items-center justify-center gap-2",
                )}
              >
                <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                {feed.play}
              </Link>
            </div>
          </article>
        </motion.li>
      ))}
    </ul>
  );
};

export { RubelSocialFeed };
