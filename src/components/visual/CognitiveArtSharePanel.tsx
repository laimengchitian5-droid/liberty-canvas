"use client";

import { useCallback, useRef, useState } from "react";
import { Download } from "lucide-react";
import { CognitiveArtCanvas } from "@/components/visual/CognitiveArtCanvas";
import { PRODUCT_NAME } from "@/lib/brand/constants";
import { getSiteUrl } from "@/lib/site/url";
import { exportCanvasPng } from "@/lib/visual/exportCognitiveArt";
import { intensityFromVector, toCognitiveArtVector } from "@/lib/visual/cognitiveArt";
import { cn } from "@/lib/utils/cn";

export interface CognitiveArtSharePanelProps {
  readonly vector: readonly number[];
  readonly archetypeLabel: string;
  readonly sharePath?: string;
  readonly className?: string;
}

export const CognitiveArtSharePanel = ({
  vector,
  archetypeLabel,
  sharePath = "/chat",
  className,
}: CognitiveArtSharePanelProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const axes = toCognitiveArtVector(vector, archetypeLabel);
  const intensity = intensityFromVector(axes);

  const handleExport = useCallback(async () => {
    const canvas = wrapRef.current?.querySelector("canvas");
    if (!canvas || busy) {
      return;
    }

    setBusy(true);
    const shareUrl = `${getSiteUrl()}${sharePath.startsWith("/") ? sharePath : `/${sharePath}`}`;
    const safeName = archetypeLabel
      .replace(/[^\w\u3040-\u30ff\u4e00-\u9fff-]+/g, "_")
      .slice(0, 40);

    await exportCanvasPng({
      canvas,
      filename: `liberty-canvas-${safeName || "art"}.png`,
      shareTitle: `${PRODUCT_NAME} · ${archetypeLabel}`,
      shareText: `${PRODUCT_NAME}で心の色アートができたよ —「${archetypeLabel}」。ログイン不要で無料。あなたも作ってみて。`,
      shareUrl,
    });

    setBusy(false);
  }, [archetypeLabel, busy, sharePath]);

  return (
    <div
      ref={wrapRef}
      className={cn("flex w-full flex-col items-center gap-3", className)}
    >
      <CognitiveArtCanvas
        vector={axes}
        intensity={intensity}
        seed={archetypeLabel}
        label="心の色アート · Cognitive color art"
      />
      <button
        type="button"
        onClick={() => void handleExport()}
        disabled={busy}
        className="inline-flex min-h-11 w-full max-w-[360px] items-center justify-center gap-2 rounded-xl border border-[#C9A09A]/50 bg-[#FAF9F6] px-4 text-sm font-semibold text-[#4A4038] shadow-sm transition hover:bg-white disabled:opacity-60"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        {busy ? "書き出し中…" : "アートを保存・シェア"}
      </button>
    </div>
  );
};
