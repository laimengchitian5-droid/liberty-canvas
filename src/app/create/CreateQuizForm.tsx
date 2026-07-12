"use client";

import Link from "next/link";
import { useState } from "react";
import { commitUserIdentityAfterFormSuccess } from "@/lib/user/commitUserIdentity";
import { readStoredUserId } from "@/lib/user/readStoredUserId";
import { DEFAULT_APP_TYPE, TestType } from "@/types/platform";
import styles from "./CreateQuizForm.module.css";

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

export function CreateQuizForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [authorId, setAuthorId] = useState(() => readStoredUserId());
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
  const [createdQuizPath, setCreatedQuizPath] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setCreatedQuizPath(null);

    try {
      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          authorId,
          appType: DEFAULT_APP_TYPE,
          questions,
          resultsMapping: results,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        quiz?: { id: string };
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to create quiz");
      }

      if (!payload.quiz?.id) {
        throw new Error("Quiz id missing in response");
      }

      await commitUserIdentityAfterFormSuccess(authorId);
      setCreatedQuizPath(`/quiz/${payload.quiz.id}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unexpected create quiz error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.shell}>
      <h1 className={styles.title}>Forge Canvas</h1>
      <p className={styles.lead}>
        LibertyCanvas 上でオリジナル診断ツールを自由に鍛造・公開できます。作成後は
        SEO ページとサイトマップに自動登録されます。
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="quiz-title">
            タイトル
          </label>
          <input
            id="quiz-title"
            className={styles.input}
            value={title}
            required
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="quiz-description">
            説明
          </label>
          <textarea
            id="quiz-description"
            className={styles.textarea}
            value={description}
            required
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="quiz-author">
            作成者 ID
          </label>
          <input
            id="quiz-author"
            className={styles.input}
            value={authorId}
            required
            pattern="^[a-zA-Z0-9_-]+$"
            onChange={(event) => setAuthorId(event.target.value)}
          />
        </div>

        {questions.map((question, index) => (
          <div key={question.id} className={styles.card}>
            <strong>質問 {index + 1}</strong>
            <input
              className={styles.input}
              placeholder="質問文"
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
                className={styles.select}
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
                className={styles.input}
                placeholder="dimension (例: E)"
                value={question.dimension}
                required
                onChange={(event) => {
                  const next = [...questions];
                  next[index] = { ...question, dimension: event.target.value };
                  setQuestions(next);
                }}
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          className={styles.buttonSecondary}
          aria-label="Add another question"
          onClick={() => setQuestions((current) => [...current, createQuestion(current.length)])}
        >
          質問を追加
        </button>

        {results.map((result, index) => (
          <div key={result.archetype + index} className={styles.card}>
            <strong>結果タイプ {index + 1}</strong>
            <input
              className={styles.input}
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
                className={styles.input}
                type="number"
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
                className={styles.input}
                type="number"
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
              className={styles.textarea}
              placeholder="結果の説明"
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
          className={styles.buttonSecondary}
          aria-label="Add another result type"
          onClick={() => setResults((current) => [...current, createResult(current.length)])}
        >
          結果タイプを追加
        </button>

        <button
          type="submit"
          className={styles.buttonPrimary}
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "公開中..." : "クイズを公開する"}
        </button>
      </form>

      {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

      {createdQuizPath ? (
        <div className={styles.success}>
          <span>クイズを公開しました。</span>{" "}
          <Link href={createdQuizPath}>公開ページを見る</Link>
        </div>
      ) : null}
    </div>
  );
}
