"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  initializeClientAnalytics,
  listenForConsentUpdates,
} from "@/lib/privacy/analytics";
import {
  acceptAllConsent,
  acceptEssentialConsent,
  hasResolvedConsent,
  readConsentFlag,
} from "@/lib/privacy/consent";
import { useI18n } from "@/lib/i18n/I18nProvider";
import styles from "./GDPRConsent.module.css";

const PANEL_SPRING = {
  type: "spring" as const,
  stiffness: 360,
  damping: 32,
  mass: 0.85,
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function GDPRConsent() {
  const { messages } = useI18n();
  const gdpr = messages.gdpr;
  const [isVisible, setIsVisible] = useState(false);
  const dialogRef = useRef<HTMLElement | null>(null);
  const acceptAllRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setIsVisible(!hasResolvedConsent());
    syncAnalyticsWithConsentOnMount();
    return listenForConsentUpdates();
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    acceptAllRef.current?.focus();
  }, [isVisible]);

  const trapFocus = useCallback((event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab" || !dialogRef.current) {
      return;
    }

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((element) => !element.hasAttribute("disabled"));

    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  const closeDialog = useCallback(() => {
    setIsVisible(false);
    previouslyFocusedRef.current?.focus();
  }, []);

  const handleEssentialOnly = useCallback(() => {
    acceptEssentialConsent();
    closeDialog();
  }, [closeDialog]);

  const handleAcceptAll = useCallback(() => {
    acceptAllConsent();
    initializeClientAnalytics();
    closeDialog();
  }, [closeDialog]);

  const currentFlag = readConsentFlag();

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        >
          <motion.section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gdpr-consent-title"
            aria-describedby="gdpr-consent-description"
            className={styles.dialog}
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={PANEL_SPRING}
            onKeyDown={trapFocus}
          >
          <h2 id="gdpr-consent-title" className={styles.title}>
            {gdpr.title}
          </h2>
          <p id="gdpr-consent-description" className={styles.description}>
            {gdpr.description}
          </p>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.buttonSecondary}
              aria-label={gdpr.essentialAria}
              onClick={handleEssentialOnly}
            >
              {gdpr.essentialOnly}
            </button>
            <button
              ref={acceptAllRef}
              type="button"
              className={styles.buttonPrimary}
              aria-label={gdpr.acceptAllAria}
              onClick={handleAcceptAll}
            >
              {gdpr.acceptAll}
            </button>
          </div>

          <span className="sr-only" aria-live="polite">
            {gdpr.consentFlag}: {currentFlag}
          </span>
        </motion.section>
      </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function syncAnalyticsWithConsentOnMount(): void {
  if (hasResolvedConsent() && readConsentFlag() === "all") {
    initializeClientAnalytics();
  }
}
