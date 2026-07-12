import { CONSENT_UPDATED_EVENT, hasAnalyticsConsent } from "@/lib/privacy/consent";

declare global {
  interface Window {
    __personalityQuizAnalyticsEnabled?: boolean;
  }
}

let analyticsInitialized = false;

export function initializeClientAnalytics(): void {
  if (typeof window === "undefined" || analyticsInitialized) {
    return;
  }

  if (!hasAnalyticsConsent()) {
    return;
  }

  analyticsInitialized = true;
  window.__personalityQuizAnalyticsEnabled = true;

  window.dispatchEvent(
    new CustomEvent("personality-quiz-analytics-ready", {
      detail: {
        provider: "internal",
        timestamp: Date.now(),
      },
    }),
  );
}

export function syncAnalyticsWithConsent(): void {
  if (hasAnalyticsConsent()) {
    initializeClientAnalytics();
    return;
  }

  analyticsInitialized = false;
  window.__personalityQuizAnalyticsEnabled = false;
}

export function listenForConsentUpdates(): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = () => {
    syncAnalyticsWithConsent();
  };

  window.addEventListener(CONSENT_UPDATED_EVENT, handler);

  return () => {
    window.removeEventListener(CONSENT_UPDATED_EVENT, handler);
  };
}
