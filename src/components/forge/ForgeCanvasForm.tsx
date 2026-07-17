"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { commitUserIdentityAfterFormSuccess } from "@/lib/user/commitUserIdentity";
import { readStoredUserId } from "@/lib/user/readStoredUserId";
import { TestType, type AppType } from "@/types/platform";
import a11y from "@/styles/accessibility.module.css";
import styles from "./ForgeCanvasForm.module.css";

interface QuestionDraft {
  id: string;
  text: string;
  type: TestType;
  dimension: string;
  weight: number;
}

interface ResultDraft {
  archetype: string;
  minScore: number;
  maxScore: number;
  description: string;
}

const APP_TYPE_OPTIONS: Array<{ value: AppType; label: string }> = [
  { value: "assessment", label: "Assessment Matrix" },
  { value: "ai_agent", label: "AI Agent Bot" },
  { value: "interactive_media", label: "Interactive Media" },
  { value: "custom_tool", label: "Custom Tool" },
];

function createQuestion(index: number): QuestionDraft {
  return {
    id: `q${index + 1}`,
    text: "",
    type: TestType.MBTI,
    dimension: "E",
    weight: 1,
  };
}

function createResult(index: number): ResultDraft {
  return {
    archetype: `Type ${index + 1}`,
    minScore: index * 20,
    maxScore: index * 20 + 19,
    description: "",
  };
}

function buildPayload(
  appType: AppType,
  base: { title: string; description: string; authorId: string },
  assessment: { questions: QuestionDraft[]; results: ResultDraft[] },
  aiAgent: { systemPromptOverride: string; responseGuidelines: string },
) {
  if (appType === "assessment") {
    return {
      ...base,
      appType,
      questions: assessment.questions,
      resultsMapping: assessment.results,
    };
  }

  if (appType === "ai_agent") {
    return {
      ...base,
      appType,
      systemPromptOverride: aiAgent.systemPromptOverride,
      responseGuidelines: aiAgent.responseGuidelines,
    };
  }

  return { ...base, appType };
}

export function ForgeCanvasForm() {
  const [appType, setAppType] = useState<AppType>("assessment");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [authorId, setAuthorId] = useState(() => readStoredUserId());
  const [systemPromptOverride, setSystemPromptOverride] = useState("");
  const [responseGuidelines, setResponseGuidelines] = useState("");
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    createQuestion(0),
    createQuestion(1),
    createQuestion(2),
  ]);
  const [results, setResults] = useState<ResultDraft[]>([
    createResult(0),
    createResult(1),
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdAppPath, setCreatedAppPath] = useState<string | null>(null);

  const isAssessment = appType === "assessment";
  const isAiAgent = appType === "ai_agent";

  const statusRegionMinHeight = useMemo(() => {
    if (errorMessage || createdAppPath) {
      return "3.5rem";
    }
    return "0";
  }, [createdAppPath, errorMessage]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setCreatedAppPath(null);

    const payload = buildPayload(
      appType,
      { title, description, authorId },
      { questions, results },
      { systemPromptOverride, responseGuidelines },
    );

    try {
      const response = await fetch("/api/apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = (await response.json()) as {
        error?: string;
        appId?: string;
      };

      if (!response.ok) {
        throw new Error(body.error ?? "Failed to forge app");
      }

      if (!body.appId) {
        throw new Error("App id missing in response");
      }

      await commitUserIdentityAfterFormSuccess(authorId);
      setCreatedAppPath(`/app/${body.appId}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unexpected forge error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.shell}>
      <header className={styles.hero}>
        <h1 className={styles.title}>Forge Canvas</h1>
        <p className={styles.lead}>
          Universal No-Code AI Bot &amp; Tool Forge — publish assessments, AI agents, and
          custom tools to LibertyCanvas with live SEO discovery.
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit} noValidate={false}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="forge-app-type">
            App Type
          </label>
          <select
            id="forge-app-type"
            className={`${styles.select} ${a11y.focusRing}`}
            value={appType}
            onChange={(event) => setAppType(event.target.value as AppType)}
          >
            {APP_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="forge-title">
            Title
          </label>
          <input
            id="forge-title"
            className={`${styles.input} ${a11y.focusRing}`}
            value={title}
            required
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="forge-description">
            Description
          </label>
          <textarea
            id="forge-description"
            className={`${styles.textarea} ${a11y.focusRing}`}
            value={description}
            required
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="forge-author">
            Author ID
          </label>
          <input
            id="forge-author"
            className={`${styles.input} ${a11y.focusRing}`}
            value={authorId}
            required
            pattern="^[a-zA-Z0-9_-]+$"
            onChange={(event) => setAuthorId(event.target.value)}
          />
        </div>

        {isAiAgent ? (
          <div
            className={styles.dynamicPanel}
            role="group"
            aria-label="AI agent configuration"
          >
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="forge-system-prompt">
                System Instructions
              </label>
              <textarea
                id="forge-system-prompt"
                className={`${styles.textarea} ${styles.textareaTall} ${a11y.focusRing}`}
                value={systemPromptOverride}
                required
                placeholder="Define persona, scope, and behavioral boundaries..."
                onChange={(event) => setSystemPromptOverride(event.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="forge-guidelines">
                Response Guidelines
              </label>
              <textarea
                id="forge-guidelines"
                className={`${styles.textarea} ${styles.textareaTall} ${a11y.focusRing}`}
                value={responseGuidelines}
                required
                placeholder="Tone, formatting rules, safety rails, output structure..."
                onChange={(event) => setResponseGuidelines(event.target.value)}
              />
            </div>
          </div>
        ) : null}

        {isAssessment ? (
          <div
            className={styles.dynamicPanel}
            role="group"
            aria-label="Assessment matrix builder"
          >
            {questions.map((question, index) => (
              <div key={question.id} className={styles.card}>
                <strong>Question {index + 1}</strong>
                <input
                  className={`${styles.input} ${a11y.focusRing}`}
                  placeholder="Question text"
                  value={question.text}
                  required
                  onChange={(event) => {
                    const next = [...questions];
                    next[index] = { ...question, text: event.target.value };
                    setQuestions(next);
                  }}
                />
                <div className={styles.row}>
                  <select
                    className={`${styles.select} ${a11y.focusRing}`}
                    value={question.type}
                    onChange={(event) => {
                      const next = [...questions];
                      next[index] = {
                        ...question,
                        type: event.target.value as TestType,
                      };
                      setQuestions(next);
                    }}
                  >
                    {Object.values(TestType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <input
                    className={`${styles.input} ${a11y.focusRing}`}
                    placeholder="Dimension"
                    value={question.dimension}
                    required
                    onChange={(event) => {
                      const next = [...questions];
                      next[index] = {
                        ...question,
                        dimension: event.target.value,
                      };
                      setQuestions(next);
                    }}
                  />
                  <input
                    className={`${styles.input} ${a11y.focusRing}`}
                    type="number"
                    min={0.1}
                    max={10}
                    step={0.1}
                    aria-label={`Likert weight for question ${index + 1}`}
                    value={question.weight}
                    onChange={(event) => {
                      const next = [...questions];
                      next[index] = {
                        ...question,
                        weight: Number(event.target.value),
                      };
                      setQuestions(next);
                    }}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              className={`${styles.buttonSecondary} ${a11y.touchTargetInline} ${a11y.focusRing}`}
              aria-label="Add another assessment question"
              onClick={() =>
                setQuestions((current) => [...current, createQuestion(current.length)])
              }
            >
              Add Question
            </button>

            {results.map((result, index) => (
              <div key={`${result.archetype}-${index}`} className={styles.card}>
                <strong>Result Type {index + 1}</strong>
                <input
                  className={`${styles.input} ${a11y.focusRing}`}
                  value={result.archetype}
                  required
                  onChange={(event) => {
                    const next = [...results];
                    next[index] = { ...result, archetype: event.target.value };
                    setResults(next);
                  }}
                />
                <div className={styles.row}>
                  <input
                    className={`${styles.input} ${a11y.focusRing}`}
                    type="number"
                    aria-label={`Minimum score for result ${index + 1}`}
                    value={result.minScore}
                    onChange={(event) => {
                      const next = [...results];
                      next[index] = {
                        ...result,
                        minScore: Number(event.target.value),
                      };
                      setResults(next);
                    }}
                  />
                  <input
                    className={`${styles.input} ${a11y.focusRing}`}
                    type="number"
                    aria-label={`Maximum score for result ${index + 1}`}
                    value={result.maxScore}
                    onChange={(event) => {
                      const next = [...results];
                      next[index] = {
                        ...result,
                        maxScore: Number(event.target.value),
                      };
                      setResults(next);
                    }}
                  />
                </div>
                <textarea
                  className={`${styles.textarea} ${a11y.focusRing}`}
                  placeholder="Result description"
                  value={result.description}
                  required
                  onChange={(event) => {
                    const next = [...results];
                    next[index] = { ...result, description: event.target.value };
                    setResults(next);
                  }}
                />
              </div>
            ))}

            <button
              type="button"
              className={`${styles.buttonSecondary} ${a11y.touchTargetInline} ${a11y.focusRing}`}
              aria-label="Add another result type"
              onClick={() =>
                setResults((current) => [...current, createResult(current.length)])
              }
            >
              Add Result Type
            </button>
          </div>
        ) : null}

        {!isAssessment && !isAiAgent ? (
          <p className={styles.hintPanel} role="status">
            {appType === "interactive_media"
              ? "Interactive media shells publish with SEO metadata. Extended canvas editors ship in Phase 3."
              : "Custom tool shells publish with SoftwareApplication schema. Workflow blocks ship in Phase 3."}
          </p>
        ) : null}

        <button
          type="submit"
          className={`${styles.buttonPrimary} ${a11y.touchTargetInline} ${a11y.focusRing}`}
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Forging..." : "Publish to LibertyCanvas"}
        </button>
      </form>

      <div
        className={styles.statusRegion}
        style={{ minBlockSize: statusRegionMinHeight }}
        aria-live="polite"
      >
        {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
        {createdAppPath ? (
          <div className={styles.success}>
            <span>App forged successfully.</span>{" "}
            <Link href={createdAppPath}>Open runtime canvas</Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
