"use client";

import { useState } from "react";
import { BuilderStudio } from "@/components/builder/BuilderStudio";
import { RubelCreatorWizard } from "@/components/rubel/creator/RubelCreatorWizard";
import { RubelGlobalHeader } from "@/components/rubel/RubelGlobalHeader";
import { PRODUCT_NAME } from "@/lib/brand/constants";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils/cn";

type CreateMode = "rubel" | "builder";

export function CreatePageShell() {
  const { messages } = useI18n();
  const [mode, setMode] = useState<CreateMode>("builder");

  return (
    <main className="min-h-[100dvh] bg-slate-950 pb-12 text-slate-200">
      <RubelGlobalHeader subtitle={messages.creator.pageSubtitle} midnight />

      <div
        className="mx-auto flex max-w-5xl flex-wrap gap-2 px-4 pt-4"
        role="tablist"
        aria-label="作成モード"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "builder"}
          className={cn(
            "min-h-11 rounded-full px-4 text-sm font-semibold",
            mode === "builder"
              ? "bg-indigo-500 text-white"
              : "border border-slate-700 bg-slate-900 text-slate-300",
          )}
          onClick={() => setMode("builder")}
        >
          {PRODUCT_NAME} Builder（会話型 · 推奨）
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "rubel"}
          className={cn(
            "min-h-11 rounded-full px-4 text-sm font-semibold",
            mode === "rubel"
              ? "bg-indigo-500 text-white"
              : "border border-slate-700 bg-slate-900 text-slate-300",
          )}
          onClick={() => setMode("rubel")}
        >
          1問クイックメーカー
        </button>
      </div>

      {mode === "builder" ? <BuilderStudio /> : <RubelCreatorWizard />}
    </main>
  );
}
