"use client";

import Link from "next/link";

import { ForgeAgentChat } from "@/components/forge/ForgeAgentChat";

import { QuizPageShell } from "@/app/quiz/[id]/QuizPageShell";

import type { StoredUniversalApp } from "@/types/platform";

import styles from "./AppRuntimeShell.module.css";

interface AppRuntimeShellProps {
  app: StoredUniversalApp;
}

export function AppRuntimeShell({ app }: AppRuntimeShellProps) {
  if (app.appType === "ai_agent") {
    if (!app.aiAgent) {
      return (
        <div className={styles.panel} aria-live="polite">
          <p className={styles.errorText}>
            AI agent configuration is missing for this app.
          </p>
        </div>
      );
    }

    return (
      <div className={styles.chatPanel} role="group" aria-label="Forge AI agent runtime">
        <ForgeAgentChat appTitle={app.title} aiAgent={app.aiAgent} />
      </div>
    );
  }

  if (app.appType === "assessment") {
    return (
      <div role="group" aria-label="Assessment runtime">
        <QuizPageShell quiz={app} />
      </div>
    );
  }

  return (
    <div className={styles.panel} role="group" aria-label="Universal app placeholder">
      <p className={styles.lead}>
        {app.appType === "interactive_media"
          ? "Interactive media canvas runtime is reserved for Phase 3."
          : "Custom tool runtime is reserved for Phase 3."}
      </p>

      <Link className={styles.linkButton} href="/create">
        Forge another tool
      </Link>
    </div>
  );
}
