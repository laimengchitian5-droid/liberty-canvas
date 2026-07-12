"use client";



import { useState } from "react";

import { QuizPlayContainer } from "@/components/personality/QuizPlayContainer";

import type { StoredUniversalApp } from "@/types/platform";

import styles from "./QuizPageShell.module.css";



interface QuizPageShellProps {

  quiz: StoredUniversalApp;

}



type ViewMode = "preview" | "playing";



export function QuizPageShell({ quiz }: QuizPageShellProps) {

  const [viewMode, setViewMode] = useState<ViewMode>("preview");



  if (viewMode === "playing") {

    return (

      <QuizPlayContainer quiz={quiz} onExit={() => setViewMode("preview")} />

    );

  }



  return (

    <>

      <div className={styles.startSection} role="group" aria-label="Quiz start">

        <button

          type="button"

          className={styles.startButton}

          aria-label={`Start quiz: ${quiz.title}`}

          onClick={() => setViewMode("playing")}

        >

          クイズを始める

        </button>

        <p className={styles.startHint}>

          {quiz.questions.length} 問 · 約 {Math.max(1, Math.ceil(quiz.questions.length * 0.5))} 分

        </p>

      </div>



      <section className={styles.section} aria-labelledby="quiz-questions">

        <h2 id="quiz-questions" className={styles.sectionTitle}>

          質問プレビュー

        </h2>

        <ol className={styles.questionList}>

          {quiz.questions.map((question, index) => (

            <li key={question.id} className={styles.questionItem}>

              <strong>

                {index + 1}. {question.text}

              </strong>

              <span className={styles.questionMeta}>

                {question.type} / {question.dimension} / weight {question.weight}

              </span>

            </li>

          ))}

        </ol>

      </section>



      <section className={styles.section} aria-labelledby="quiz-results">

        <h2 id="quiz-results" className={styles.sectionTitle}>

          結果タイプ

        </h2>

        <ul className={styles.resultList}>

          {quiz.resultsMapping.map((result) => (

            <li key={result.archetype} className={styles.resultItem}>

              <strong>{result.archetype}</strong>

              <span className={styles.resultMeta}>

                スコア {result.minScore} - {result.maxScore}

              </span>

              <p>{result.description}</p>

            </li>

          ))}

        </ul>

      </section>

    </>

  );

}

