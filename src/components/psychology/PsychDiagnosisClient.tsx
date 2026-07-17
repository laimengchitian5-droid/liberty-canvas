"use client";

import { BrandWordmark } from "@/components/brand/BrandWordmark";
import { Send } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  LANDING_LOCALES,
  LANDING_LOCALE_META,
  isLandingLocale,
  type LandingLocale,
} from "@/lib/landing/landingLocales";
import type {
  InjectionChatTurn,
  RubelEnginePayload,
} from "@/lib/rubel/contracts/pipeline";
import { OPENING_INJECTION_MESSAGE } from "@/lib/rubel/buildInjectionPrompt";
import { requestRubelHfReply } from "@/lib/rubel/network/rubelHfClient";
import { rubelDs } from "@/lib/rubel/rubelDesignSystem";
import { rubelTheme } from "@/lib/rubel/theme";
import {
  buildBigFiveResult,
  buildEnneagramResult,
  buildPsychEnginePayload,
  formatBigFiveShareText,
  formatEnneagramShareText,
  getBigFiveCopy,
  getEnneagramCopy,
  type BigFiveAnswer,
  type BigFiveAnswerRecord,
  type EnneagramTypeDefinition,
  type PsychQuizResult,
  type PsychTopicSlug,
} from "@/lib/psychology";
import {
  consumePsychIntakeSeed,
  mergePsychResultWithSeed,
} from "@/lib/psychology/psychIntakeStore";
import { PsychScreenshotReveal } from "@/components/psychology/PsychScreenshotReveal";
import { cn } from "@/lib/utils/cn";
import { buildLibertyResultPath } from "@/lib/visual/artVectorCodec";
import { buildPsychArtVector } from "@/lib/visual/buildArtVectorFromResult";

type Phase = "quiz" | "reveal" | "chat";

type ChatMessage = { id: string; role: "user" | "assistant"; text: string };

const LOCALE_STORAGE_KEY = "rubel-psych-locale-v1";

interface PsychDiagnosisClientProps {
  topic: PsychTopicSlug;
}

function resolveLocaleAfterMount(searchParams: URLSearchParams | null): LandingLocale {
  const fromQuery = searchParams?.get("lang");

  if (fromQuery && isLandingLocale(fromQuery)) {
    return fromQuery;
  }

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);

  if (stored && isLandingLocale(stored)) {
    return stored;
  }

  return "ja";
}

export function PsychDiagnosisClient({ topic }: PsychDiagnosisClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState<LandingLocale>("ja");
  const [phase, setPhase] = useState<Phase>("quiz");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [bigFiveAnswers, setBigFiveAnswers] = useState<BigFiveAnswerRecord[]>([]);
  const [selectedEnneagram, setSelectedEnneagram] =
    useState<EnneagramTypeDefinition | null>(null);
  const [quizResult, setQuizResult] = useState<PsychQuizResult | null>(null);
  const [enginePayload, setEnginePayload] = useState<RubelEnginePayload | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messageIdRef = useRef(0);
  const messagesRef = useRef<ChatMessage[]>([]);
  const openingSentRef = useRef(false);

  const meta = LANDING_LOCALE_META[locale];
  const bigFiveCopy = useMemo(() => getBigFiveCopy(locale), [locale]);
  const enneagramCopy = useMemo(() => getEnneagramCopy(locale), [locale]);
  const pageCopy = topic === "big-five" ? bigFiveCopy : enneagramCopy;

  const nextId = useCallback(() => {
    messageIdRef.current += 1;
    return `msg-${messageIdRef.current}`;
  }, []);

  useEffect(() => {
    setLocale(resolveLocaleAfterMount(searchParams));
  }, [searchParams]);

  useEffect(() => {
    document.documentElement.lang = meta.htmlLang;
  }, [meta.htmlLang]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const switchLocale = useCallback(
    (next: LandingLocale) => {
      setLocale(next);
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);

      const path = topic === "big-five" ? "/diagnosis/big-five" : "/diagnosis/enneagram";
      const query = next === "ja" ? "" : `?lang=${next}`;
      router.replace(`${path}${query}`);
    },
    [router, topic],
  );

  const finalizeQuiz = useCallback(
    (result: PsychQuizResult) => {
      const seed = consumePsychIntakeSeed(topic, locale);
      const merged = mergePsychResultWithSeed(result, seed, pageCopy.headline);

      const payload = buildPsychEnginePayload({
        topic,
        locale,
        keyword: seed?.keyword ?? pageCopy.keyword,
        pageTitle: pageCopy.headline,
        result: merged,
      });

      setQuizResult(merged);
      setEnginePayload(payload);
      setPhase("reveal");
    },
    [locale, pageCopy.headline, pageCopy.keyword, topic],
  );

  const handleBigFiveChoice = useCallback(
    (choice: BigFiveAnswer) => {
      const question = bigFiveCopy.questions[questionIndex];

      if (!question) {
        return;
      }

      const record: BigFiveAnswerRecord = {
        dimension: question.dimension,
        choice,
        questionText: question.prompt,
        chosenText: choice === "high" ? question.optionHigh : question.optionLow,
      };

      const nextAnswers = [...bigFiveAnswers, record];
      setBigFiveAnswers(nextAnswers);

      if (questionIndex >= bigFiveCopy.questions.length - 1) {
        finalizeQuiz(buildBigFiveResult(bigFiveCopy, nextAnswers));
        return;
      }

      setQuestionIndex((current) => current + 1);
    },
    [bigFiveAnswers, bigFiveCopy, finalizeQuiz, questionIndex],
  );

  const handleEnneagramSelect = useCallback(
    (typeDef: EnneagramTypeDefinition) => {
      setSelectedEnneagram(typeDef);
      finalizeQuiz(buildEnneagramResult(enneagramCopy, typeDef));
    },
    [enneagramCopy, finalizeQuiz],
  );

  const requestReply = useCallback(
    async (userMessage: string, showUser: boolean) => {
      if (!enginePayload) {
        return;
      }

      setError(null);
      setIsLoading(true);

      let base = messagesRef.current;

      if (showUser) {
        const userTurn: ChatMessage = { id: nextId(), role: "user", text: userMessage };
        base = [...base, userTurn];
        setMessages(base);
        messagesRef.current = base;
      }

      const history: InjectionChatTurn[] = (showUser ? base.slice(0, -1) : base).map(
        (message) => ({ role: message.role, content: message.text }),
      );

      try {
        const text = await requestRubelHfReply({
          payload: enginePayload,
          history,
          userMessage,
        });
        setMessages((current) => [...current, { id: nextId(), role: "assistant", text }]);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Error");
      } finally {
        setIsLoading(false);
      }
    },
    [enginePayload, nextId],
  );

  useEffect(() => {
    if (phase !== "chat" || !enginePayload || openingSentRef.current) {
      return;
    }

    openingSentRef.current = true;
    void requestReply(OPENING_INJECTION_MESSAGE, false);
  }, [enginePayload, phase, requestReply]);

  const handleRetake = useCallback(() => {
    setPhase("quiz");
    setQuestionIndex(0);
    setBigFiveAnswers([]);
    setSelectedEnneagram(null);
    setQuizResult(null);
    setEnginePayload(null);
    setMessages([]);
    setDraft("");
    setError(null);
    openingSentRef.current = false;
  }, []);

  const handleShare = useCallback(async () => {
    if (!quizResult) {
      return;
    }

    const text =
      topic === "big-five"
        ? formatBigFiveShareText(bigFiveCopy, quizResult, locale)
        : formatEnneagramShareText(enneagramCopy, quizResult, locale);

    if (navigator.share) {
      try {
        await navigator.share({ text, title: pageCopy.headline });
        return;
      } catch {
        /* clipboard fallback */
      }
    }

    await navigator.clipboard.writeText(text);
  }, [bigFiveCopy, enneagramCopy, locale, pageCopy.headline, quizResult, topic]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = draft.trim();

      if (!trimmed || isLoading) {
        return;
      }

      setDraft("");
      void requestReply(trimmed, true);
    },
    [draft, isLoading, requestReply],
  );

  const currentBigFiveQuestion =
    topic === "big-five" ? bigFiveCopy.questions[questionIndex] : null;

  return (
    <div className={cn(rubelTheme.page, meta.fontClass)}>
      <header className={cn("px-4 py-3", rubelDs.glassHeader)}>
        <div
          className={cn(rubelTheme.container, "flex items-center justify-between gap-3")}
        >
          <BrandWordmark brandId="liberty-plug" locale="ja" href="/" compact />
          <nav className="flex gap-1" aria-label="Language">
            {LANDING_LOCALES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => switchLocale(code)}
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-medium uppercase",
                  code === locale
                    ? "bg-indigo-500 text-white"
                    : "text-slate-400 hover:text-slate-200",
                )}
              >
                {code}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div
        className={cn(
          rubelTheme.container,
          "flex min-h-[calc(100dvh-4rem)] flex-col pb-8",
        )}
      >
        {phase === "quiz" && topic === "big-five" && currentBigFiveQuestion ? (
          <>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300/90">
              {pageCopy.keyword}
            </p>
            <h1 className="mt-3 text-center text-2xl font-bold leading-tight text-white sm:text-3xl">
              {pageCopy.headline}
            </h1>
            <p className={cn(rubelDs.subheader, "mt-3 text-center")}>
              {pageCopy.subhead}
            </p>

            <div className="mt-6 flex justify-center gap-1">
              {bigFiveCopy.questions.map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-1.5 w-6 rounded-full",
                    index <= questionIndex ? "bg-indigo-400" : "bg-slate-700",
                  )}
                />
              ))}
            </div>

            <div className={cn(rubelDs.glassCardPadding, "mt-8")}>
              <p className="text-center text-lg font-semibold text-white">
                {currentBigFiveQuestion.prompt}
              </p>
              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  className={rubelDs.option}
                  onClick={() => handleBigFiveChoice("low")}
                >
                  {currentBigFiveQuestion.optionLow}
                </button>
                <button
                  type="button"
                  className={rubelDs.option}
                  onClick={() => handleBigFiveChoice("high")}
                >
                  {currentBigFiveQuestion.optionHigh}
                </button>
              </div>
            </div>
          </>
        ) : null}

        {phase === "quiz" && topic === "enneagram" ? (
          <>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300/90">
              {pageCopy.keyword}
            </p>
            <h1 className="mt-3 text-center text-2xl font-bold leading-tight text-white sm:text-3xl">
              {pageCopy.headline}
            </h1>
            <p className={cn(rubelDs.subheader, "mt-3 text-center")}>
              {pageCopy.subhead}
            </p>
            <p className="mt-6 text-center text-sm font-medium text-slate-200">
              {enneagramCopy.promptLabel}
            </p>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {enneagramCopy.types.map((typeDef) => (
                <button
                  key={typeDef.typeNumber}
                  type="button"
                  onClick={() => handleEnneagramSelect(typeDef)}
                  className={cn(
                    rubelDs.option,
                    selectedEnneagram?.typeNumber === typeDef.typeNumber &&
                      "border-indigo-400/50 bg-indigo-950/40",
                  )}
                >
                  <span className="block text-xs font-medium text-indigo-300/80">
                    {typeDef.tagline}
                  </span>
                  <span className="mt-1 block text-base font-semibold">
                    {typeDef.name}
                  </span>
                  <span className="mt-1 block text-xs text-slate-400">
                    {typeDef.description}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : null}

        {phase === "reveal" && quizResult ? (
          <PsychScreenshotReveal
            topic={topic}
            result={quizResult}
            pageCopy={pageCopy}
            onShare={() => void handleShare()}
            onContinueToChat={() => setPhase("chat")}
          />
        ) : null}

        {phase === "chat" && enginePayload && quizResult ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className={cn("mt-4 px-1 py-3", rubelDs.glassHeader, "rounded-2xl")}>
              <p className="text-sm font-semibold text-white">{quizResult.typeName}</p>
              <p className="text-xs text-indigo-200/70">{quizResult.summary}</p>
              <p className="mt-1 text-xs text-slate-400">「{quizResult.anchorAnswer}」</p>
              <button
                type="button"
                onClick={() =>
                  router.push(
                    buildLibertyResultPath({
                      vector: buildPsychArtVector(quizResult),
                      seed: quizResult.typeName,
                    }),
                  )
                }
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-indigo-400/40 bg-indigo-950/40 px-4 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-900/50"
              >
                心の色リザルトを見る
              </button>
            </div>

            <div
              className="mt-4 flex-1 space-y-3 overflow-y-auto px-1 py-2"
              role="log"
              aria-live="polite"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === "user" ? rubelDs.bubbleUser : rubelDs.bubbleAi
                  }
                >
                  {message.text}
                </div>
              ))}
              {isLoading ? (
                <div className={cn(rubelDs.bubbleAi, "animate-pulse text-slate-400")}>
                  {pageCopy.typingLabel}
                </div>
              ) : null}
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-4 border-t border-white/10 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={draft}
                  disabled={isLoading}
                  placeholder={pageCopy.chatPlaceholder}
                  onChange={(event) => setDraft(event.target.value)}
                  className={cn(rubelDs.input, "min-h-12 flex-1")}
                />
                <button
                  type="submit"
                  disabled={isLoading || !draft.trim()}
                  className="flex min-h-12 min-w-12 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/25 active:scale-[0.96] disabled:opacity-50"
                  aria-label="Send"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              {error ? (
                <p role="alert" className="mt-2 text-xs text-red-400">
                  {error}
                </p>
              ) : null}
              <button
                type="button"
                onClick={handleRetake}
                className="mt-3 text-xs text-slate-500 underline"
              >
                {pageCopy.retakeLabel}
              </button>
            </form>
          </div>
        ) : null}

        {phase === "quiz" ? (
          <p className="mt-auto pt-6 text-center text-xs text-slate-500">
            {pageCopy.trustLine}
          </p>
        ) : null}
      </div>
    </div>
  );
}
