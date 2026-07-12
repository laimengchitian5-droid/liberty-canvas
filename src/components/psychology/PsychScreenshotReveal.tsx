"use client";

import { Share2, Sparkles } from "lucide-react";
import type { BigFiveLocaleCopy, EnneagramLocaleCopy, PsychQuizResult, PsychTopicSlug } from "@/lib/psychology/types";
import type { OceanDimension } from "@/lib/psychology/types";
import { rubelDs } from "@/lib/rubel/rubelDesignSystem";
import { cn } from "@/lib/utils/cn";

const OCEAN_ORDER: OceanDimension[] = [
  "openness",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "neuroticism",
];

interface PsychScreenshotRevealProps {
  topic: PsychTopicSlug;
  result: PsychQuizResult;
  pageCopy: BigFiveLocaleCopy | EnneagramLocaleCopy;
  onShare: () => void;
}

function OceanBars({
  result,
  traitLabels,
}: {
  result: PsychQuizResult;
  traitLabels: Record<OceanDimension, string>;
}) {
  if (!result.oceanScores) {
    return null;
  }

  return (
    <ul className="mt-5 space-y-2 text-left" aria-label="OCEAN profile">
      {OCEAN_ORDER.map((dimension) => {
        const value = result.oceanScores![dimension];
        const pct = value >= 1 ? 100 : 35;

        return (
          <li key={dimension}>
            <div className="mb-1 flex justify-between text-[10px] uppercase tracking-wider text-slate-400">
              <span>{traitLabels[dimension]}</span>
              <span>{value >= 1 ? "High" : "Low"}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800/80 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 shadow-[0_0_12px_rgba(129,140,248,0.6)] transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function PsychScreenshotReveal({
  topic,
  result,
  pageCopy,
  onShare,
}: PsychScreenshotRevealProps) {
  const traitLabels =
    topic === "big-five" && "traitLabels" in pageCopy ? pageCopy.traitLabels : null;

  return (
    <div className="flex flex-1 items-center justify-center px-1 py-6">
      <div className={cn(rubelDs.screenshotTrap, "w-full max-w-md")}>
        <div className={rubelDs.screenshotTrapGlow} aria-hidden="true" />

        <div className="relative">
          {topic === "enneagram" && result.enneagramTypeNumber ? (
            <p className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/20 text-2xl font-black text-indigo-100 shadow-lg shadow-indigo-500/30">
              {result.enneagramTypeNumber}
            </p>
          ) : (
            <Sparkles className="mx-auto mb-3 h-9 w-9 text-indigo-300" aria-hidden="true" />
          )}

          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-300/90">
            {pageCopy.keyword}
          </p>
          <p className={cn(rubelDs.archetypeTitle, "mt-2")}>{result.typeName}</p>
          <p className={cn(rubelDs.archetypeSubtitle, "mt-2 leading-relaxed")}>
            {result.summary}
          </p>

          <p className={rubelDs.screenshotTrapQuote}>
            「{result.anchorAnswer}」
          </p>

          {traitLabels ? <OceanBars result={result} traitLabels={traitLabels} /> : null}

          <p className="mt-4 text-xs text-slate-400">{pageCopy.revealTitle}</p>

          <button
            type="button"
            onClick={onShare}
            className={cn(
              rubelDs.primary,
              "mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 text-base",
            )}
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            {pageCopy.shareLabel}
          </button>

          <p className={rubelDs.screenshotTrapBrand}>
            Rubel Canvas · liberty-canvas.vercel.app
          </p>
          <p className="mt-1 text-[9px] text-slate-500">
            Lu + Bel = Liberate Beautiful souls
          </p>
        </div>
      </div>
    </div>
  );
}
