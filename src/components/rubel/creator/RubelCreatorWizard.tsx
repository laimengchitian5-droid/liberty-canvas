"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NotionAccordion } from "@/components/rubel/creator/NotionAccordion";
import { CreatorCosmicPlanetPreview } from "@/components/rubel/creator/CreatorCosmicPlanetPreview";
import { RubelMotionButton } from "@/components/rubel/RubelMotionButton";
import {
  buildDiagnosisFromCreator,
  createDefaultQuestionDraft,
  createDefaultResultDraft,
  type CreatorOptionDraft,
  type CreatorQuestionDraft,
  type CreatorResultDraft,
} from "@/lib/rubel/buildDiagnosisFromCreator";
import { upsertClientDiagnosis } from "@/lib/rubel/clientCatalog";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils/cn";
import {
  LOCALE_LABELS,
  PERSONALITY_TRAITS,
  SUPPORTED_LOCALES,
  type ActiveTherapyMode,
  type AiTone,
  type PersonalityTrait,
  type TraitVector,
} from "@/types/rubel";
import type { LocaleCode } from "@/types/rubel-i18n";

const STEP_SPRING = {
  type: "spring" as const,
  stiffness: 320,
  damping: 32,
};

function appLocaleToCreatorLanguage(locale: Locale): LocaleCode {
  if (locale === "ja") return "ja";
  if (locale === "fr") return "fr";
  return "en";
}

function TraitSlider({
  trait,
  value,
  label,
  onChange,
}: {
  trait: PersonalityTrait;
  value: number;
  label: string;
  onChange: (next: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span>{value > 0 ? `+${value}` : value}</span>
      </div>
      <input
        type="range"
        min={-5}
        max={5}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer accent-indigo-500"
        aria-label={label}
      />
    </div>
  );
}

function BaselineSliders({
  profile,
  traitLabels,
  onChange,
}: {
  profile: TraitVector;
  traitLabels: Record<PersonalityTrait, string>;
  onChange: (trait: PersonalityTrait, value: number) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {PERSONALITY_TRAITS.map((trait) => (
        <TraitSlider
          key={trait}
          trait={trait}
          label={traitLabels[trait]}
          value={profile[trait]}
          onChange={(next) => onChange(trait, next)}
        />
      ))}
    </div>
  );
}

const RubelCreatorWizard = () => {
  const { locale, messages } = useI18n();
  const c = messages.creator;

  const steps = useMemo(
    () => [c.stepBasics, c.stepQuestions, c.stepResults, c.stepPublish],
    [c.stepBasics, c.stepQuestions, c.stepResults, c.stepPublish],
  );

  const toneOptions = useMemo(
    (): Array<{ value: AiTone; label: string }> => [
      { value: "gal", label: c.toneGal },
      { value: "mentor", label: c.toneMentor },
      { value: "tsundere", label: c.toneTsundere },
      { value: "princess", label: c.tonePrincess },
    ],
    [c.toneGal, c.toneMentor, c.tonePrincess, c.toneTsundere],
  );

  const therapyOptions = useMemo(
    (): Array<{ value: ActiveTherapyMode; label: string }> => [
      { value: "unconditional_praise", label: c.therapyPraise },
      { value: "strict_coaching", label: c.therapyCoaching },
      { value: "emotional_mirror", label: c.therapyMirror },
    ],
    [c.therapyCoaching, c.therapyMirror, c.therapyPraise],
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [diagnosisTitle, setDiagnosisTitle] = useState("");
  const [creatorLanguage, setCreatorLanguage] = useState<LocaleCode>(() =>
    appLocaleToCreatorLanguage(locale),
  );
  const [results, setResults] = useState<CreatorResultDraft[]>([
    createDefaultResultDraft(0),
    createDefaultResultDraft(1),
  ]);
  const [questions, setQuestions] = useState<CreatorQuestionDraft[]>([
    createDefaultQuestionDraft(),
  ]);
  const [activeResultId, setActiveResultId] = useState("result-1");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [publishedId, setPublishedId] = useState<string | null>(null);

  useEffect(() => {
    setCreatorLanguage(appLocaleToCreatorLanguage(locale));
  }, [locale]);

  const activeResult = useMemo(
    () => results.find((entry) => entry.id === activeResultId) ?? results[0],
    [activeResultId, results],
  );

  const updateQuestion = useCallback(
    (questionId: string, patch: Partial<CreatorQuestionDraft>) => {
      setQuestions((current) =>
        current.map((entry) =>
          entry.id === questionId ? { ...entry, ...patch } : entry,
        ),
      );
    },
    [],
  );

  const updateOption = useCallback(
    (questionId: string, optionId: string, patch: Partial<CreatorOptionDraft>) => {
      setQuestions((current) =>
        current.map((question) => {
          if (question.id !== questionId) {
            return question;
          }

          return {
            ...question,
            options: question.options.map((option) =>
              option.id === optionId ? { ...option, ...patch } : option,
            ),
          };
        }),
      );
    },
    [],
  );

  const updateOptionTrait = useCallback(
    (questionId: string, optionId: string, trait: PersonalityTrait, value: number) => {
      setQuestions((current) =>
        current.map((question) => {
          if (question.id !== questionId) {
            return question;
          }

          return {
            ...question,
            options: question.options.map((option) => {
              if (option.id !== optionId) {
                return option;
              }

              return {
                ...option,
                traits: { ...option.traits, [trait]: value },
              };
            }),
          };
        }),
      );
    },
    [],
  );

  const updateResult = useCallback(
    (resultId: string, patch: Partial<CreatorResultDraft>) => {
      setResults((current) =>
        current.map((entry) => (entry.id === resultId ? { ...entry, ...patch } : entry)),
      );
    },
    [],
  );

  const updateResultBaseline = useCallback(
    (resultId: string, trait: PersonalityTrait, value: number) => {
      setResults((current) =>
        current.map((entry) => {
          if (entry.id !== resultId) {
            return entry;
          }

          return {
            ...entry,
            baselineProfile: { ...entry.baselineProfile, [trait]: value },
          };
        }),
      );
    },
    [],
  );

  const validateStep = useCallback((): string | null => {
    if (stepIndex === 0 && !diagnosisTitle.trim()) {
      return c.errorNoTitle;
    }

    if (stepIndex === 1) {
      const invalid = questions.find(
        (entry) =>
          !entry.text.trim() || entry.options.some((option) => !option.text.trim()),
      );

      if (invalid) {
        return c.errorIncompleteQuestions;
      }
    }

    if (stepIndex === 2) {
      const invalid = results.find((entry) => !entry.name.trim());

      if (invalid) {
        return c.errorIncompleteResults;
      }
    }

    return null;
  }, [
    c.errorIncompleteQuestions,
    c.errorIncompleteResults,
    c.errorNoTitle,
    diagnosisTitle,
    questions,
    results,
    stepIndex,
  ]);

  const handleNext = useCallback(() => {
    const error = validateStep();

    if (error) {
      setErrorMessage(error);
      return;
    }

    setErrorMessage(null);
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }, [steps.length, validateStep]);

  const handleBack = useCallback(() => {
    setErrorMessage(null);
    setStepIndex((current) => Math.max(current - 1, 0));
  }, []);

  const handlePublish = useCallback(async () => {
    setErrorMessage(null);
    setPublishMessage(null);

    const diagnosis = buildDiagnosisFromCreator({
      title: diagnosisTitle.trim(),
      language: creatorLanguage,
      results,
      questions,
    });

    setIsPublishing(true);

    try {
      const response = await fetch("/api/rubel/diagnoses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(diagnosis),
      });

      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(body.error ?? c.errorPublishFailed);
      }

      upsertClientDiagnosis(diagnosis);
      setPublishedId(diagnosis.id);
      setPublishMessage(c.publishSuccess(diagnosis.id));
    } catch {
      upsertClientDiagnosis(diagnosis);
      setPublishedId(diagnosis.id);
      setPublishMessage(c.publishLocal(diagnosis.id));
    } finally {
      setIsPublishing(false);
    }
  }, [creatorLanguage, diagnosisTitle, messages.creator, questions, results]);

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8">
      <div className="mb-8">
        <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          {c.badge}
        </p>
        <h1 className="text-xl font-bold text-slate-200">{c.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{c.lead}</p>
      </div>

      <ol className="mb-8 flex gap-2">
        {steps.map((label, index) => {
          const done = index < stepIndex;
          const active = index === stepIndex;

          return (
            <li key={label} className="flex-1">
              <div
                className={cn(
                  "flex h-10 items-center justify-center rounded-xl text-xs font-bold",
                  done && "bg-indigo-500/20 text-indigo-300",
                  active && "bg-indigo-500 text-white",
                  !done &&
                    !active &&
                    "border border-slate-800 bg-slate-900 text-slate-600",
                )}
              >
                {done ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <p className="mt-1 truncate text-center text-[10px] text-slate-600">
                {label}
              </p>
            </li>
          );
        })}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={STEP_SPRING}
          className="space-y-4"
        >
          {stepIndex === 0 ? (
            <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
              <label className="block text-sm font-semibold text-slate-300">
                {c.diagnosisTitleLabel}
                <input
                  type="text"
                  value={diagnosisTitle}
                  placeholder={c.diagnosisTitlePlaceholder}
                  onChange={(event) => setDiagnosisTitle(event.target.value)}
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-300">
                {c.creatorLanguageLabel}
                <select
                  value={creatorLanguage}
                  onChange={(event) =>
                    setCreatorLanguage(event.target.value as LocaleCode)
                  }
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500"
                >
                  {SUPPORTED_LOCALES.map((code) => (
                    <option key={code} value={code}>
                      {LOCALE_LABELS[code]}
                    </option>
                  ))}
                </select>
              </label>
            </section>
          ) : null}

          {stepIndex === 1 ? (
            <section className="space-y-4">
              {questions.map((question, index) => (
                <article
                  key={question.id}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-4"
                >
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-400">
                    {c.questionLabel(index + 1)}
                  </p>
                  <input
                    type="text"
                    value={question.text}
                    placeholder={c.questionPlaceholder}
                    onChange={(event) =>
                      updateQuestion(question.id, { text: event.target.value })
                    }
                    className="mb-4 min-h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500"
                  />

                  <div className="space-y-3">
                    {question.options.slice(0, 2).map((option, optionIndex) => (
                      <div key={option.id} className="space-y-2">
                        <input
                          type="text"
                          value={option.text}
                          placeholder={c.optionPlaceholder(optionIndex + 1)}
                          onChange={(event) =>
                            updateOption(question.id, option.id, {
                              text: event.target.value,
                            })
                          }
                          className="min-h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500"
                        />
                        <NotionAccordion
                          title={c.advancedScoringTitle}
                          subtitle={c.advancedScoringSubtitle}
                        >
                          <BaselineSliders
                            profile={option.traits}
                            traitLabels={c.traits}
                            onChange={(trait, value) =>
                              updateOptionTrait(question.id, option.id, trait, value)
                            }
                          />
                        </NotionAccordion>
                      </div>
                    ))}
                  </div>
                </article>
              ))}

              <RubelMotionButton
                variant="secondary"
                fullWidth
                onClick={() =>
                  setQuestions((current) => [...current, createDefaultQuestionDraft()])
                }
              >
                {c.addQuestion}
              </RubelMotionButton>
            </section>
          ) : null}

          {stepIndex === 2 && activeResult ? (
            <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex flex-wrap gap-2">
                {results.map((result) => (
                  <RubelMotionButton
                    key={result.id}
                    variant={activeResultId === result.id ? "primary" : "secondary"}
                    onClick={() => setActiveResultId(result.id)}
                    className="min-h-10 rounded-full px-4 text-sm"
                  >
                    {result.name || c.unnamed}
                  </RubelMotionButton>
                ))}
              </div>

              <label className="block text-sm font-semibold text-slate-300">
                {c.resultNameLabel}
                <input
                  type="text"
                  value={activeResult.name}
                  onChange={(event) =>
                    updateResult(activeResult.id, { name: event.target.value })
                  }
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-300">
                {c.aiToneLabel}
                <select
                  value={activeResult.tone}
                  onChange={(event) =>
                    updateResult(activeResult.id, {
                      tone: event.target.value as AiTone,
                    })
                  }
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500"
                >
                  {toneOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-slate-300">
                  {c.therapyModeLabel}
                </legend>
                <div className="grid gap-2">
                  {therapyOptions.map((option) => (
                    <RubelMotionButton
                      key={option.value}
                      variant={
                        activeResult.activeTherapyMode === option.value
                          ? "primary"
                          : "secondary"
                      }
                      fullWidth
                      onClick={() =>
                        updateResult(activeResult.id, {
                          activeTherapyMode: option.value,
                        })
                      }
                      className="min-h-11 text-sm"
                    >
                      {option.label}
                    </RubelMotionButton>
                  ))}
                </div>
              </fieldset>

              <NotionAccordion
                title={c.advancedBaselineTitle}
                subtitle={c.advancedBaselineSubtitle}
              >
                <BaselineSliders
                  profile={activeResult.baselineProfile}
                  traitLabels={c.traits}
                  onChange={(trait, value) =>
                    updateResultBaseline(activeResult.id, trait, value)
                  }
                />
              </NotionAccordion>

              <CreatorCosmicPlanetPreview
                baselineProfile={activeResult.baselineProfile}
                resultName={activeResult.name}
              />
            </section>
          ) : null}

          {stepIndex === 3 ? (
            <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-xl font-bold text-slate-200">{c.readyToPublish}</h2>
              <dl className="space-y-2 text-sm text-slate-400">
                <div className="flex justify-between gap-4">
                  <dt>{c.summaryTitle}</dt>
                  <dd className="text-right text-slate-200">{diagnosisTitle}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>{c.summaryQuestions}</dt>
                  <dd className="text-slate-200">{questions.length}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>{c.summaryResults}</dt>
                  <dd className="text-slate-200">{results.length}</dd>
                </div>
              </dl>

              <RubelMotionButton
                variant="primary"
                fullWidth
                disabled={isPublishing}
                onClick={handlePublish}
                className="min-h-12"
              >
                {isPublishing ? c.publishing : c.publishButton}
              </RubelMotionButton>

              {publishMessage ? (
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-200">
                  <p>{publishMessage}</p>
                  {publishedId ? (
                    <Link
                      href={`/play/${publishedId}`}
                      className="mt-2 inline-block font-semibold underline"
                    >
                      {c.playNow}
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </section>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {errorMessage ? (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {errorMessage}
        </p>
      ) : null}

      {stepIndex < steps.length - 1 ? (
        <div className="mt-8 flex gap-3">
          {stepIndex > 0 ? (
            <RubelMotionButton
              variant="secondary"
              onClick={handleBack}
              className="min-h-12 flex-1"
            >
              <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
              {c.back}
            </RubelMotionButton>
          ) : null}
          <RubelMotionButton
            variant="primary"
            onClick={handleNext}
            className="min-h-12 flex-1"
          >
            {c.continue}
            <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </RubelMotionButton>
        </div>
      ) : null}
    </div>
  );
};

export { RubelCreatorWizard };
