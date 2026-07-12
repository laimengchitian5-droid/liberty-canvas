"use client";

import { Send, Share2, Sparkles } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRubelQuizSession } from "@/hooks/useRubelQuizSession";
import { useSatelliteHandoff } from "@/hooks/useSatelliteHandoff";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { InjectionChatTurn, RubelEnginePayload } from "@/lib/rubel/contracts/pipeline";
import { OPENING_INJECTION_MESSAGE } from "@/lib/rubel/buildInjectionPrompt";
import { rubelDs } from "@/lib/rubel/rubelDesignSystem";
import { requestRubelHfReply } from "@/lib/rubel/network/rubelHfClient";
import { extractResultData } from "@/lib/rubel/resultData";
import { buildShareText, getResultEditorial } from "@/lib/rubel/resultEditorial";
import { suggestPlugDiagnosisSlug } from "@/lib/rubel/suggestPlugDiagnosisSlug";
import { cn } from "@/lib/utils/cn";
import type { Diagnosis, PlayOutcome, TraitVector } from "@/types/rubel";
import { PlugCosmicBridgeCta } from "@/components/rubel/PlugCosmicBridgeCta";
import { trackDiagnosisEvent } from "@/lib/diagnosis/analytics";

type Phase = "quiz" | "reveal" | "chat";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const REVEAL_MS = 1800;

interface RubelPlayCoreProps {
  diagnosis: Diagnosis;
  onPlayComplete?: () => void;
}

function WaveTypingBubble({ label }: { label: string }) {
  return (
    <div className={cn(rubelDs.bubbleAi, "animate-pulse text-slate-400")}>
      {label}
    </div>
  );
}

const RubelPlayCore = ({ diagnosis, onPlayComplete }: RubelPlayCoreProps) => {
  const { messages: i18n } = useI18n();
  const play = i18n.rubelPlay;
  const [phase, setPhase] = useState<Phase>("quiz");
  const [customPrompt, setCustomPrompt] = useState("");
  const [enginePayload, setEnginePayload] = useState<RubelEnginePayload | null>(null);
  const [traitProfile, setTraitProfile] = useState<TraitVector | null>(null);
  const [winningResultName, setWinningResultName] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);

  const messageIdRef = useRef(0);
  const messagesRef = useRef<ChatMessage[]>([]);
  const openingSentRef = useRef(false);

  const completePlay = useCallback(
    (outcome: PlayOutcome, payload?: RubelEnginePayload) => {
      onPlayComplete?.();
      setTraitProfile(outcome.profile);
      setEnginePayload(payload ?? extractResultData(diagnosis, outcome));
      setWinningResultName(outcome.winningResult.name);
      setPhase("reveal");
      trackDiagnosisEvent("rubel_play_completed", {
        rubelDiagnosisId: diagnosis.id,
        slug: suggestPlugDiagnosisSlug(outcome.profile),
        funnelStep: "result_view",
      });
    },
    [diagnosis, onPlayComplete],
  );

  const handleQuizComplete = useCallback(
    (outcome: PlayOutcome) => completePlay(outcome),
    [completePlay],
  );

  useSatelliteHandoff({ diagnosis, onComplete: completePlay });

  const {
    state: quizState,
    currentQuestion,
    questionCount,
    startQuiz,
    resetQuiz,
    selectOption,
  } = useRubelQuizSession(diagnosis, handleQuizComplete);

  const editorial = winningResultName
    ? getResultEditorial(
        diagnosis.results.find((r) => r.name === winningResultName) ??
          diagnosis.results[0],
      )
    : null;

  const nextId = useCallback(() => {
    messageIdRef.current += 1;
    return `msg-${messageIdRef.current}`;
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!hasAutoStarted && diagnosis.questions.length > 0) {
      startQuiz();
      setHasAutoStarted(true);
      trackDiagnosisEvent("rubel_play_started", {
        rubelDiagnosisId: diagnosis.id,
        funnelStep: "play_start",
      });
    }
  }, [diagnosis.id, diagnosis.questions.length, hasAutoStarted, startQuiz]);

  useEffect(() => {
    if (phase !== "reveal") {
      return;
    }

    const timer = window.setTimeout(() => setPhase("chat"), REVEAL_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const requestReply = useCallback(
    async (userMessage: string, showUser: boolean) => {
      if (!enginePayload) {
        return;
      }

      setError(null);
      setIsLoading(true);

      let base = messagesRef.current;

      if (showUser) {
        const userTurn: ChatMessage = {
          id: nextId(),
          role: "user",
          text: userMessage,
        };
        base = [...base, userTurn];
        setMessages(base);
        messagesRef.current = base;
      }

      const history: InjectionChatTurn[] = (showUser ? base.slice(0, -1) : base).map(
        (m) => ({ role: m.role, content: m.text }),
      );

      try {
        const text = await requestRubelHfReply({
          payload: enginePayload,
          history,
          userMessage,
          customPersona: customPrompt,
        });
        setMessages((current) => [
          ...current,
          { id: nextId(), role: "assistant", text },
        ]);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error ? fetchError.message : "エラーが発生しました。",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [customPrompt, enginePayload, nextId],
  );

  useEffect(() => {
    if (phase !== "chat" || !enginePayload || openingSentRef.current) {
      return;
    }

    openingSentRef.current = true;
    void requestReply(OPENING_INJECTION_MESSAGE, false);
  }, [enginePayload, phase, requestReply]);

  const handleRetake = useCallback(() => {
    resetQuiz();
    setPhase("quiz");
    setEnginePayload(null);
    setTraitProfile(null);
    setWinningResultName("");
    setMessages([]);
    setDraft("");
    setError(null);
    openingSentRef.current = false;
    startQuiz();
  }, [resetQuiz, startQuiz]);

  const handleShare = useCallback(async () => {
    const result =
      diagnosis.results.find((entry) => entry.name === winningResultName) ??
      diagnosis.results[0];
    const text = buildShareText(diagnosis, result);

    if (navigator.share) {
      try {
        await navigator.share({ text, title: diagnosis.title });
        return;
      } catch {
        /* fall through to clipboard */
      }
    }

    await navigator.clipboard.writeText(text);
  }, [diagnosis, winningResultName]);

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

  const showQuiz =
    phase === "quiz" &&
    currentQuestion &&
    (quizState.phase === "active" || quizState.phase === "transitioning");

  const singleQuestion = questionCount === 1;

  return (
    <div className={cn("flex h-[100dvh] flex-col", rubelDs.page)}>
      <header className={cn("shrink-0 px-4 py-4 text-center", rubelDs.glassHeader)}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300/80">
          {play.brandTitle}
        </p>
        <h1 className={cn(rubelDs.header, "mt-1 text-lg")}>{diagnosis.title}</h1>
        {singleQuestion ? (
          <p className={cn(rubelDs.subheader, "mt-2")}>
            1問だけ、直感で選んでください。
          </p>
        ) : null}
      </header>

      <div className="relative mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col">
        {showQuiz && currentQuestion ? (
          <>
            <div className="flex min-h-0 flex-[0.65] flex-col justify-center px-5 pb-4 pt-6">
              <h2 className="text-center text-2xl font-bold leading-snug text-slate-50 sm:text-3xl">
                {currentQuestion.text}
              </h2>
            </div>

            <div className="flex min-h-0 flex-[0.35] flex-col justify-end gap-3 border-t border-white/10 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
              {currentQuestion.options.slice(0, 2).map((option, index) => (
                <button
                  key={option.id}
                  type="button"
                  disabled={quizState.phase === "transitioning"}
                  onClick={() => selectOption(option.id)}
                  className={rubelDs.option}
                >
                  <span className="block text-xs font-medium text-indigo-300/80">
                    {index === 0 ? play.optionA : play.optionB}
                  </span>
                  <span className="mt-1 block text-base font-semibold">{option.text}</span>
                </button>
              ))}
            </div>
          </>
        ) : null}

        {phase === "reveal" && enginePayload && editorial ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-md">
            <div className={cn(rubelDs.glassReveal, "mx-6 w-full max-w-sm")}>
              <Sparkles
                className="mx-auto mb-4 h-9 w-9 text-indigo-300"
                aria-hidden="true"
              />
              <p className={rubelDs.archetypeTitle}>{enginePayload.typeName}</p>
              <p className={cn(rubelDs.archetypeSubtitle, "mt-3")}>{editorial.tagline}</p>
              <p className="mt-2 text-xs text-slate-400">{play.revealTitle}</p>
              <button
                type="button"
                onClick={() => void handleShare()}
                className={cn(
                  rubelDs.primary,
                  "mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2",
                )}
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
                X / LINE でシェア
              </button>
              {traitProfile ? (
                <div className="mt-4">
                  <PlugCosmicBridgeCta
                    profile={traitProfile}
                    rubelDiagnosisId={diagnosis.id}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {phase === "chat" && enginePayload ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex min-h-0 flex-[0.65] flex-col">
              <div className={cn("px-4 py-3", rubelDs.glassHeader)}>
                <p className="text-sm font-semibold text-white">{enginePayload.typeName}</p>
                <p className="text-xs text-indigo-200/70">
                  {enginePayload.tone} · {enginePayload.empathyLevel}
                </p>
                {enginePayload.verbalizationAnchor ? (
                  <p className="mt-1 text-xs text-slate-400">
                    「{enginePayload.verbalizationAnchor.chosenOptionText}」から判定
                  </p>
                ) : null}
              </div>
              <div
                className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
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
                {isLoading ? <WaveTypingBubble label={play.typing} /> : null}
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-[0.35] flex-col justify-end border-t border-white/10 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
            >
              <label className="mb-2 block">
                <span className="mb-1 block text-xs text-slate-500">
                  {play.customPromptLabel}
                </span>
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={play.customPromptPlaceholder}
                  className={rubelDs.input}
                />
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={draft}
                  disabled={isLoading}
                  placeholder={play.chatPlaceholder}
                  onChange={(e) => setDraft(e.target.value)}
                  className={cn(rubelDs.input, "min-h-12 flex-1")}
                />
                <button
                  type="submit"
                  disabled={isLoading || !draft.trim()}
                  className="flex min-h-12 min-w-12 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/25 active:scale-[0.96] disabled:opacity-50"
                  aria-label={play.sendAria}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              {error ? (
                <p role="alert" className="mt-2 text-xs text-red-400">
                  {error}
                </p>
              ) : null}
              {traitProfile ? (
                <PlugCosmicBridgeCta
                  profile={traitProfile}
                  rubelDiagnosisId={diagnosis.id}
                  className="mt-3"
                />
              ) : null}
              <button
                type="button"
                onClick={handleRetake}
                className="mt-3 text-xs text-slate-500 underline"
              >
                {play.retake}
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export { RubelPlayCore };
