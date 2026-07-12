"use client";

import { useCallback, useState, type FormEvent } from "react";
import type { LandingPageCopy } from "@/lib/landing/landingCopy";
import type { LandingLocale } from "@/lib/landing/landingLocales";
import { rubelDs } from "@/lib/rubel/rubelDesignSystem";
import { cn } from "@/lib/utils/cn";

interface SatelliteIntakeFormProps {
  locale: LandingLocale;
  copy: LandingPageCopy;
  onSubmit: (userText: string) => void;
}

const MIN_LENGTH = 3;

function resolveValidationError(locale: LandingLocale): string {
  switch (locale) {
    case "ja":
      return "3文字以上入力してください。";
    case "ko":
      return "3자 이상 입력해 주세요.";
    case "zh":
      return "请输入至少 3 个字符。";
    default:
      return "Please enter at least 3 characters.";
  }
}

export function SatelliteIntakeForm({
  locale,
  copy,
  onSubmit,
}: SatelliteIntakeFormProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = text.trim();

      if (trimmed.length < MIN_LENGTH) {
        setError(resolveValidationError(locale));
        return;
      }

      setError(null);
      onSubmit(trimmed);
    },
    [locale, onSubmit, text],
  );

  return (
    <>
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300/90">
        {copy.keyword}
      </p>
      <h1 className="mt-3 text-center text-2xl font-bold leading-tight text-white sm:text-3xl">
        {copy.headline}
      </h1>
      <p className={cn(rubelDs.subheader, "mt-3 text-center")}>{copy.subhead}</p>

      <form onSubmit={handleSubmit} className={cn(rubelDs.glassCardPadding, "mt-8")}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-200">
            {copy.promptLabel}
          </span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={copy.promptPlaceholder}
            rows={4}
            required
            minLength={MIN_LENGTH}
            className={cn(rubelDs.input, "min-h-[7rem] resize-none leading-relaxed")}
          />
        </label>

        {error ? (
          <p role="alert" className="mt-2 text-xs text-red-400">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className={cn(
            rubelDs.primary,
            "mt-4 flex min-h-12 w-full items-center justify-center text-base",
          )}
        >
          {copy.submitLabel}
        </button>

        <p className="mt-3 text-center text-xs text-slate-500">{copy.trustLine}</p>
      </form>

      <section className="mt-8 space-y-3" aria-label="FAQ">
        {copy.faq.map((item) => (
          <details key={item.question} className={cn(rubelDs.glassCard, "px-4 py-3")}>
            <summary className="cursor-pointer text-sm font-medium text-slate-200">
              {item.question}
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.answer}</p>
          </details>
        ))}
      </section>
    </>
  );
}
