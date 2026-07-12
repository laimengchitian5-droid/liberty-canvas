"use client";

import { Globe2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  LOCALE_FLAGS,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  type LocaleCode,
} from "@/types/rubel-i18n";

const SELECTOR_COPY: Record<
  LocaleCode,
  {
    title: string;
    lead: string;
    sourceLabel: string;
    displayLabel: string;
    continue: string;
  }
> = {
  en: {
    title: "Choose Your Display Language",
    lead: "Questions and options will be translated in real time before the quiz starts.",
    sourceLabel: "Creator language",
    displayLabel: "Your display language",
    continue: "Start in this language",
  },
  ja: {
    title: "表示言語を選択",
    lead: "クイズ開始前に、質問と選択肢がリアルタイムで翻訳されます。",
    sourceLabel: "作成者の言語",
    displayLabel: "あなたの表示言語",
    continue: "この言語で開始",
  },
  es: {
    title: "Elige tu idioma de visualización",
    lead: "Las preguntas se traducirán en tiempo real antes de comenzar.",
    sourceLabel: "Idioma del creador",
    displayLabel: "Tu idioma de visualización",
    continue: "Empezar en este idioma",
  },
  ko: {
    title: "표시 언어 선택",
    lead: "퀴즈 시작 전 질문과 선택지가 실시간 번역됩니다.",
    displayLabel: "표시 언어",
    sourceLabel: "제작자 언어",
    continue: "이 언어로 시작",
  },
  fr: {
    title: "Choisissez votre langue d'affichage",
    lead: "Les questions seront traduites en temps réel avant le quiz.",
    sourceLabel: "Langue du créateur",
    displayLabel: "Votre langue d'affichage",
    continue: "Commencer dans cette langue",
  },
};

interface PlayLocaleSelectorProps {
  sourceLanguage: LocaleCode;
  displayLanguage: LocaleCode;
  onDisplayLanguageChange: (next: LocaleCode) => void;
  onConfirm: () => void;
}

const PlayLocaleSelector = ({
  sourceLanguage,
  displayLanguage,
  onDisplayLanguageChange,
  onConfirm,
}: PlayLocaleSelectorProps) => {
  const copy = SELECTOR_COPY[displayLanguage];

  return (
    <section className="mx-auto w-full max-w-lg rounded-2xl border border-rose-dusty/20 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-5 flex items-center gap-2">
        <Globe2 className="h-5 w-5 text-sage-soft" aria-hidden="true" />
        <h2 className="font-serif text-2xl font-bold text-ink">{copy.title}</h2>
      </div>
      <p className="mb-6 text-sm leading-relaxed text-ink-muted">{copy.lead}</p>

      <div className="mb-4 rounded-xl bg-cream-soft px-4 py-3 text-sm">
        <p className="font-semibold text-ink-muted">{copy.sourceLabel}</p>
        <p className="mt-1 text-ink">
          {LOCALE_FLAGS[sourceLanguage]} {LOCALE_LABELS[sourceLanguage]}
        </p>
      </div>

      <div className="mb-6">
        <label
          htmlFor="play-display-locale"
          className="mb-2 block text-sm font-semibold text-ink-muted"
        >
          {copy.displayLabel}
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SUPPORTED_LOCALES.map((code) => {
            const selected = displayLanguage === code;

            return (
              <button
                key={code}
                type="button"
                aria-pressed={selected}
                onClick={() => onDisplayLanguageChange(code)}
                className={cn(
                  "min-h-11 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition",
                  selected
                    ? "border-sage-soft bg-sage-soft/15 text-ink"
                    : "border-rose-dusty/20 bg-cream text-ink-muted hover:border-sage-soft/40",
                )}
              >
                {LOCALE_FLAGS[code]} {LOCALE_LABELS[code]}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onConfirm}
        className="min-h-11 w-full rounded-xl bg-rose-dusty px-5 text-sm font-bold text-white transition hover:brightness-105"
      >
        {copy.continue}
      </button>
    </section>
  );
};

export { PlayLocaleSelector };
