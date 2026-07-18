"use client";

import Link from "next/link";
import {
  useCallback,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { resolveConductorSurfaceCopy } from "@/lib/station/identityConductor/conductorCopy";
import { buildConductorFallbackResponse } from "@/lib/station/identityConductor/conductorFallback";
import { trackConductorEvent } from "@/lib/station/telemetryEngine";
import type { Locale } from "@/lib/i18n/config";
import {
  ConductorResponseSchema,
  type ConductorResponse,
} from "@/types/conductor";
import styles from "./IdentityHubConductor.module.css";

export interface IdentityHubConductorProps {
  /** Resolved from `/station/[locale]` — not a parallel `currentLocale` prop. */
  readonly locale: Locale;
}

/**
 * 10-second Identity Hub Conductor — one Adult-Cute question → express CTA.
 *
 * Rejected sketch defects (do not reintroduce):
 * - `@/src/types` · broken `React.FC` without props generic
 * - inline TEXT_REGISTRY (use {@link resolveConductorSurfaceCopy})
 * - async callback inside `startTransition`
 * - `global-identity-core` · unvalidated `as ConductorResponse`
 * - emoji chrome · `router.push` without `lang`/`ref` (use `ctaHref`)
 * - telemetry with invented slugs or raw answer text in meta
 */
export const IdentityHubConductor = ({ locale }: IdentityHubConductorProps) => {
  const copy = resolveConductorSurfaceCopy(locale);
  const [userAnswer, setUserAnswer] = useState("");
  const [conductorResult, setConductorResult] =
    useState<ConductorResponse | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isPending, startTransition] = useTransition();

  const busy = isFetching || isPending;
  const gateClosed = conductorResult !== null;

  const pingPreScreen = useCallback(
    (result: ConductorResponse, answerLength: number) => {
      trackConductorEvent({
        eventName: "conductor_pre_screen",
        locale,
        expressLineSlug: result.expressLineSlug,
        meta: `len:${answerLength};src:${result.source}`,
      });
    },
    [locale],
  );

  const handleBoardingClick = useCallback(
    (result: ConductorResponse) => {
      // Beacon/flush first; Link navigation continues (INP-safe, keeps lang/ref).
      trackConductorEvent({
        eventName: "conductor_express_boarded",
        locale,
        expressLineSlug: result.expressLineSlug,
        meta: `src:${result.source}`,
      });
    },
    [locale],
  );

  const handlePassGate = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const sanitizedAnswer = userAnswer.trim();
      if (!sanitizedAnswer || busy || gateClosed) {
        return;
      }

      setIsFetching(true);

      try {
        const response = await fetch("/api/station/conductor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            userAnswer: sanitizedAnswer,
            locale,
          }),
        });

        if (!response.ok) {
          throw new Error("conductor_http_error");
        }

        const payload: unknown = await response.json();
        const parsed = ConductorResponseSchema.safeParse(payload);
        if (!parsed.success) {
          throw new Error("conductor_schema_error");
        }

        pingPreScreen(parsed.data, sanitizedAnswer.length);
        startTransition(() => {
          setConductorResult(parsed.data);
        });
      } catch {
        console.warn(
          "[IdentityHubConductor] network/schema failure — deterministic local fallback",
        );
        const local = buildConductorFallbackResponse({
          locale,
          userAnswer: sanitizedAnswer,
        });
        pingPreScreen(local, sanitizedAnswer.length);
        startTransition(() => {
          setConductorResult(local);
        });
      } finally {
        setIsFetching(false);
      }
    },
    [busy, gateClosed, locale, pingPreScreen, userAnswer],
  );

  return (
    <section className={styles.panel} aria-label={copy.title} lang={locale}>
      <div>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.title}>{copy.title}</h2>
      </div>

      <form
        className={styles.form}
        onSubmit={(event) => {
          void handlePassGate(event);
        }}
      >
        <label className={styles.inputLabel} htmlFor="conductor-input">
          {copy.question}
        </label>
        <textarea
          id="conductor-input"
          className={styles.input}
          name="userAnswer"
          placeholder={copy.placeholder}
          value={userAnswer}
          onChange={(event) => {
            setUserAnswer(event.target.value);
          }}
          rows={3}
          maxLength={500}
          autoComplete="off"
          disabled={busy || gateClosed}
          required
        />

        {!gateClosed ? (
          <button
            type="submit"
            className={`${styles.cta} ${styles.ctaSubmit}`}
            disabled={busy || !userAnswer.trim()}
          >
            {busy ? copy.submittingLabel : copy.submitLabel}
          </button>
        ) : null}
      </form>

      <div className={styles.resultSlot} aria-live="polite">
        {busy ? (
          <div
            className={styles.skeletonPulse}
            aria-hidden="true"
            data-testid="conductor-shimmer"
          >
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLineShort} />
          </div>
        ) : null}

        {!busy && conductorResult ? (
          <div className={styles.result} data-testid="conductor-result">
            <p className={styles.acknowledgeText} role="status">
              {conductorResult.acknowledge}
            </p>
            <p className={styles.teaserText}>{conductorResult.teaser}</p>
            <span className={styles.lineBadge}>
              {conductorResult.expressLineName}
            </span>
            <Link
              href={conductorResult.ctaHref}
              className={`${styles.cta} ${styles.ctaBoarding}`}
              data-testid="conductor-boarding-cta"
              onClick={() => {
                handleBoardingClick(conductorResult);
              }}
            >
              {conductorResult.ctaLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
};
