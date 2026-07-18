"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useShallow } from "zustand/react/shallow";
import { AUTH_SESSION_MODES } from "@/lib/auth/constants";
import { toAuthErrorMessage } from "@/lib/auth/errors";
import { DEFAULT_GUEST_USER_ID, USER_ID_PATTERN } from "@/lib/user/constants";
import { readStoredUserId } from "@/lib/user/readStoredUserId";
import { selectAuthPanel, useUserStore } from "@/store/userStore";
import a11y from "@/styles/accessibility.module.css";
import styles from "./UserAuthPanel.module.css";

/**
 * Nav auth panel — session via userStore (login / signup / sign-out).
 *
 * Rejected sketch defects:
 * - `React.FC` + unused `currentLocale` prop + inline styles
 * - hardcoded `guest_user` without pattern / establishSession
 * - inventing `--lc-color-text-muted` / `--lc-color-brand-rose` token names
 * - submit button with no form / no validation
 */

export interface UserAuthPanelProps {
  /** `rail` = dense nav row; `popover` = stacked capsule panel. */
  readonly layout?: "rail" | "popover";
}

export function UserAuthPanel({ layout = "rail" }: UserAuthPanelProps) {
  const { authStatus, authErrorMessage, isGuest } = useUserStore(
    useShallow(selectAuthPanel),
  );
  const establishSession = useUserStore((state) => state.establishSession);
  const signOut = useUserStore((state) => state.signOut);
  const [userIdInput, setUserIdInput] = useState<string>(DEFAULT_GUEST_USER_ID);

  useEffect(() => {
    setUserIdInput(readStoredUserId());
  }, []);

  const [mode, setMode] = useState<"login" | "signup">(AUTH_SESSION_MODES.login);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmed = userIdInput.trim();

      if (!USER_ID_PATTERN.test(trimmed)) {
        return;
      }

      try {
        await establishSession({
          userId: trimmed,
          mode,
        });
      } catch (error) {
        console.error(toAuthErrorMessage(error));
      }
    },
    [establishSession, mode, userIdInput],
  );

  if (!isGuest) {
    return (
      <div
        className={styles.panelAuthenticated}
        data-layout={layout}
        role="group"
        aria-label="アカウント操作"
      >
        <button
          type="button"
          className={`${styles.actionButton} ${a11y.touchTargetInline} ${a11y.focusRing}`}
          onClick={() => {
            void signOut();
          }}
          disabled={authStatus === "submitting"}
        >
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <form
      className={styles.panelGuest}
      data-layout={layout}
      aria-label="ログインまたは新規登録"
      onSubmit={onSubmit}
    >
      <div className={styles.modeSwitch} role="group" aria-label="認証モード">
        <button
          type="button"
          className={`${styles.modeButton} ${mode === AUTH_SESSION_MODES.login ? styles.modeButtonActive : ""} ${a11y.touchTargetInline} ${a11y.focusRing}`}
          aria-pressed={mode === AUTH_SESSION_MODES.login}
          onClick={() => setMode(AUTH_SESSION_MODES.login)}
        >
          ログイン
        </button>
        <button
          type="button"
          className={`${styles.modeButton} ${mode === AUTH_SESSION_MODES.signup ? styles.modeButtonActive : ""} ${a11y.touchTargetInline} ${a11y.focusRing}`}
          aria-pressed={mode === AUTH_SESSION_MODES.signup}
          onClick={() => setMode(AUTH_SESSION_MODES.signup)}
        >
          新規登録
        </button>
      </div>

      <div className={styles.fieldRow}>
        <label className={styles.label} htmlFor="lc-auth-user-id">
          ユーザー ID
        </label>
        <input
          id="lc-auth-user-id"
          className={`${styles.input} ${a11y.focusRing}`}
          value={userIdInput}
          onChange={(event) => setUserIdInput(event.target.value)}
          placeholder="example_user"
          autoComplete="username"
          pattern="[a-zA-Z0-9_-]{1,128}"
          required
        />
      </div>

      {authErrorMessage ? (
        <p className={styles.error} role="alert">
          {authErrorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        className={`${styles.submitButton} ${a11y.touchTargetInline} ${a11y.focusRing}`}
        disabled={authStatus === "submitting"}
      >
        {authStatus === "submitting" ? "処理中…" : "開始"}
      </button>
    </form>
  );
}
