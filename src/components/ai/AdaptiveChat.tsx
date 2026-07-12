"use client";

import { motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  buildAdaptiveChatContext,
  parseStructuredFromMessage,
  useAdaptiveChat,
} from "@/hooks/useAdaptiveChat";
import { usePlatform } from "@/store/PlatformContext";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { DirectionalIcon, StaticIcon } from "@/components/icons/DirectionalIcon";
import a11y from "@/styles/accessibility.module.css";
import type { ScoringResult } from "@/types/platform";
import styles from "./AdaptiveChat.module.css";

interface AdaptiveChatProps {
  forgeSystemPrompt?: string;
  forgePersonaLabel?: string;
}

const MBTI_ARCHETYPE_PATTERN = /^[IE][NS][FT][JP]$/;

const MBTI_PERSONA_NICKNAMES: Record<string, string> = {
  INTJ: "Strategist",
  INTP: "Analyst",
  ENTJ: "Commander",
  ENTP: "Innovator",
  INFJ: "Counselor",
  INFP: "Visionary",
  ENFJ: "Mentor",
  ENFP: "Explorer",
  ISTJ: "Organizer",
  ISFJ: "Guardian",
  ESTJ: "Executive",
  ESFJ: "Harmonizer",
  ISTP: "Craftsman",
  ISFP: "Artist",
  ESTP: "Trailblazer",
  ESFP: "Performer",
};

const MESSAGE_SPRING = {
  type: "spring" as const,
  stiffness: 360,
  damping: 30,
  mass: 0.75,
};

function getPersonaDisplayLabel(
  scoringResult: ScoringResult | null,
  activePersona: string,
): string {
  if (!scoringResult) {
    return "Mode: Standard Assistant";
  }

  if (!scoringResult.isReliable) {
    return "Mode: Analytical Truth-Seeker";
  }

  const normalizedArchetype = scoringResult.archetype.trim().toUpperCase();

  if (MBTI_ARCHETYPE_PATTERN.test(normalizedArchetype)) {
    const nickname =
      MBTI_PERSONA_NICKNAMES[normalizedArchetype] ?? "Personalized";
    return `Mode: Tailored for ${nickname} (${normalizedArchetype})`;
  }

  if (scoringResult.archetype.trim()) {
    return `Mode: Tailored for ${scoringResult.archetype}`;
  }

  if (activePersona.trim()) {
    return `Mode: ${activePersona.replace(/-/g, " ")}`;
  }

  return "Mode: Personalized Assistant";
}

function buildRequestPersonaLabel(
  scoringResult: ScoringResult | null,
  activePersona: string,
): string {
  if (!scoringResult) {
    return "standard-assistant";
  }

  if (!scoringResult.isReliable) {
    return "analytical-truth-seeker";
  }

  return activePersona || scoringResult.archetype.toLowerCase();
}

export function AdaptiveChat(props: AdaptiveChatProps = {}) {
  const { forgeSystemPrompt, forgePersonaLabel } = props;
  const {
    scoringResult,
    kraepelinPerformance,
    aiContext,
    getSystemPrompt,
    syncAIContext,
  } = usePlatform();
  const { locale, messages: i18nMessages } = useI18n();

  const isForgeMode = Boolean(forgeSystemPrompt?.trim());

  const resolveSystemPrompt = useCallback((): string => {
    if (isForgeMode && forgeSystemPrompt?.trim()) {
      return forgeSystemPrompt.trim();
    }
    return getSystemPrompt();
  }, [forgeSystemPrompt, getSystemPrompt, isForgeMode]);

  const chatContext = useMemo(
    () =>
      buildAdaptiveChatContext({
        systemPrompt: resolveSystemPrompt(),
        appliedPersona: isForgeMode
          ? (forgePersonaLabel ?? "forge-agent")
          : buildRequestPersonaLabel(scoringResult, aiContext.activePersona),
        scoringResult,
        isForgeMode,
        kraepelinFatigue: kraepelinPerformance?.fatigueIndex,
        kraepelinConsistency: kraepelinPerformance?.consistencyIndex,
        kraepelinFocusPattern: kraepelinPerformance?.focusPattern,
        locale,
      }),
    [
      aiContext.activePersona,
      forgePersonaLabel,
      isForgeMode,
      kraepelinPerformance,
      locale,
      resolveSystemPrompt,
      scoringResult,
    ],
  );

  const { messages, sendMessage, status, error, stop } =
    useAdaptiveChat(chatContext);

  const [draft, setDraft] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const isSubmitting = status === "submitted" || status === "streaming";
  const errorMessage = localError ?? error?.message ?? null;

  const personaLabel = useMemo(() => {
    if (isForgeMode && forgePersonaLabel?.trim()) {
      return `Mode: ${forgePersonaLabel.trim()}`;
    }
    return getPersonaDisplayLabel(scoringResult, aiContext.activePersona);
  }, [
    aiContext.activePersona,
    forgePersonaLabel,
    isForgeMode,
    scoringResult,
  ]);

  const isTruthSeekerMode = scoringResult !== null && !scoringResult.isReliable;

  const scrollToLatest = useCallback(() => {
    const container = messageListRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToLatest();
  }, [messages, scrollToLatest]);

  useEffect(() => {
    if (isForgeMode || !scoringResult) {
      return;
    }

    syncAIContext({
      activePersona: buildRequestPersonaLabel(scoringResult, ""),
      systemPromptOverride: resolveSystemPrompt(),
    });
  }, [isForgeMode, resolveSystemPrompt, scoringResult, syncAIContext]);

  useEffect(() => {
    const lastAssistant = [...messages]
      .reverse()
      .find((message) => message.role === "assistant");

    if (!lastAssistant || status === "streaming" || status === "submitted") {
      return;
    }

    const structured = parseStructuredFromMessage(lastAssistant);

    if (structured.applied_persona) {
      syncAIContext({
        activePersona: structured.applied_persona,
        systemPromptOverride: resolveSystemPrompt(),
      });
    }
  }, [messages, resolveSystemPrompt, status, syncAIContext]);

  const submitMessage = useCallback(async () => {
    const trimmedDraft = draft.trim();

    if (!trimmedDraft || isSubmitting) {
      return;
    }

    setDraft("");
    setLocalError(null);

    await sendMessage({ text: trimmedDraft });
    inputRef.current?.focus();
  }, [draft, isSubmitting, sendMessage]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await submitMessage();
    },
    [submitMessage],
  );

  const handleComposerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key !== "Enter" || event.shiftKey) {
        return;
      }

      event.preventDefault();
      void submitMessage();
    },
    [submitMessage],
  );

  const applySuggestedQuestion = useCallback((question: string) => {
    if (!question.trim()) {
      return;
    }

    setDraft(question.trim());
    inputRef.current?.focus();
  }, []);

  return (
    <section
      className={styles.shell}
      aria-label="Personality adaptive AI chat"
    >
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>Adaptive AI Chat</h2>
          <motion.p
            className={`${styles.personaBadge} ${
              isTruthSeekerMode ? styles.personaBadgeTruthSeeker : ""
            }`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={MESSAGE_SPRING}
            aria-live="polite"
          >
            <span
              className={`${styles.personaDot} ${
                isTruthSeekerMode ? styles.personaDotTruthSeeker : ""
              }`}
              aria-hidden="true"
            />
            {personaLabel}
          </motion.p>
        </div>

        {isTruthSeekerMode ? (
          <p className={styles.optimizationNote}>
            Reliability optimization is active. Responses prioritize gentle
            truth-seeking over personality flattery to uncover authentic
            viewpoints.
          </p>
        ) : null}
      </header>

      <div
        ref={messageListRef}
        className={styles.messageList}
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            {scoringResult ? (
              <p>
                Your chat is synchronized with assessment results
                {scoringResult.isReliable
                  ? ` (${scoringResult.archetype}).`
                  : " in truth-seeking optimization mode."}
                {" "}Ask anything to receive a persona-adapted response.
              </p>
            ) : (
              <p>
                Complete an assessment to unlock full persona adaptation. You can
                still chat using the standard assistant mode.
              </p>
            )}
          </div>
        ) : null}

        {messages.map((message) => {
          const isUser = message.role === "user";
          const isStreaming =
            !isUser &&
            isSubmitting &&
            message.id === messages.at(-1)?.id;
          const structured = isUser ? undefined : parseStructuredFromMessage(message);
          const displayText = isUser
            ? message.parts
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("")
            : structured?.ai_response ??
              message.parts
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("");

          return (
            <motion.article
              key={message.id}
              className={`${styles.messageRow} ${
                isUser ? styles.messageRowUser : styles.messageRowAssistant
              }`}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={MESSAGE_SPRING}
              aria-label={`${message.role} message`}
            >
              <div
                className={`${styles.bubble} ${
                  isUser ? styles.bubbleUser : styles.bubbleAssistant
                } ${isStreaming ? styles.bubbleStreaming : ""}`}
                aria-live={isStreaming ? "polite" : "off"}
                aria-busy={isStreaming}
              >
                {displayText || (isStreaming ? "Generating response..." : "")}

                {!isUser && structured?.next_suggested_question?.trim() ? (
                  <div className={styles.suggestedQuestion}>
                    <span className={styles.suggestedLabel}>
                      Suggested follow-up
                    </span>
                    <button
                      type="button"
                      className={styles.suggestedQuestionButton}
                      onClick={() =>
                        applySuggestedQuestion(
                          structured.next_suggested_question ?? "",
                        )
                      }
                    >
                      {structured.next_suggested_question}
                    </button>
                  </div>
                ) : null}
              </div>
            </motion.article>
          );
        })}
      </div>

      {errorMessage ? (
        <p className={styles.errorBanner} role="alert">
          {errorMessage}
        </p>
      ) : null}

      <form className={styles.composer} onSubmit={handleSubmit}>
        <label htmlFor="adaptive-chat-input" className={styles.srOnly}>
          Message to adaptive AI
        </label>
        <textarea
          id="adaptive-chat-input"
          ref={inputRef}
          className={styles.input}
          value={draft}
          rows={1}
          placeholder={
            isTruthSeekerMode
              ? "Share your perspective honestly..."
              : "Ask your persona-adapted assistant..."
          }
          disabled={isSubmitting}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleComposerKeyDown}
        />
        <button
          type={isSubmitting ? "button" : "submit"}
          className={`${styles.sendButton} ${a11y.touchTargetInline} ${a11y.focusRing}`}
          disabled={!isSubmitting && draft.trim().length === 0}
          aria-busy={isSubmitting}
          onClick={isSubmitting ? () => stop() : undefined}
        >
          {isSubmitting ? (
            <>
              <StaticIcon
                name="spinner"
                className={`${a11y.staticIcon} ${styles.spinnerIcon}`}
                label={i18nMessages.common.sending}
              />
              <span>{i18nMessages.common.sending}</span>
            </>
          ) : (
            <>
              <span>{i18nMessages.common.send}</span>
              <DirectionalIcon
                name="send"
                className={`${a11y.directionalIcon} ${styles.sendIcon}`}
              />
            </>
          )}
        </button>
      </form>
    </section>
  );
}
