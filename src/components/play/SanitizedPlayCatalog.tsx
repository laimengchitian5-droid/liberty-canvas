"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { isLocale } from "@/lib/i18n/config";
import {
  buildFallbackPlayRouterBulk,
  playRouterBulkSchema,
} from "@/lib/visual/playRouterSchema";
import type {
  CleanPlayCardRoute,
  PlayRouterBulkResult,
  PlayRouterLocale,
  RawPlayCardParam,
} from "@/types/playRuntimeRouter";
import styles from "./SanitizedPlayCatalog.module.css";

const DEFAULT_RAW_CARDS: readonly RawPlayCardParam[] = [
  {
    id: "c-3",
    rawTitle: "What's Your Burnout Archetype?",
    rawPath: "/play/rubel-burnout-v1",
  },
  {
    id: "c-4",
    rawTitle: "あなたのネコ度診断",
    rawPath: "/play/cat-profile",
  },
  {
    id: "c-5",
    rawTitle: "あなたの裏性格診断",
    rawPath: "/play/dark-side",
  },
];

export interface SanitizedPlayCatalogProps {
  readonly lang: string;
  readonly cards?: readonly RawPlayCardParam[];
  /** Skip network (tests / story wrappers). */
  readonly deferFetch?: boolean;
}

function resolveLocale(lang: string): PlayRouterLocale {
  return isLocale(lang) ? lang : "ja";
}

export const SanitizedPlayCatalog = ({
  lang,
  cards = DEFAULT_RAW_CARDS,
  deferFetch = false,
}: SanitizedPlayCatalogProps) => {
  const locale = resolveLocale(lang);
  const cardsKey = cards
    .map((card) => `${card.id}:${card.rawPath}:${card.rawTitle}`)
    .join("|");

  const [routes, setRoutes] = useState<readonly CleanPlayCardRoute[]>(() =>
    buildFallbackPlayRouterBulk(cards, locale).localizedOutput.sanitizedRoutes,
  );
  const [routerLog, setRouterLog] = useState<
    PlayRouterBulkResult["internalReasoning"] | null
  >(null);
  const [isSyncing, setIsSyncing] = useState(!deferFetch);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fallback = buildFallbackPlayRouterBulk(cards, locale);
    setRoutes(fallback.localizedOutput.sanitizedRoutes);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- cardsKey fingerprints content
  }, [locale, cardsKey]);

  useEffect(() => {
    if (deferFetch) {
      setIsSyncing(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const snapshot = cards.map((card) => ({
      id: card.id,
      rawTitle: card.rawTitle,
      rawPath: card.rawPath,
    }));

    const fetchSanitizedRoutes = async () => {
      setIsSyncing(true);
      setErrorMessage(null);

      try {
        const res = await fetch("/api/visual/sanitize-play-routes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cards: snapshot, lang: locale }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const payload: unknown = await res.json();
        const parsed = playRouterBulkSchema.safeParse(payload);

        if (!parsed.success) {
          throw new Error("Invalid play router payload");
        }

        setRoutes(parsed.data.localizedOutput.sanitizedRoutes);
        setRouterLog(parsed.data.internalReasoning);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("[SanitizedPlayCatalog]", error);
        setErrorMessage("ルートの再構成に失敗しました。安全な既定パスを表示しています。");
        setRoutes(
          buildFallbackPlayRouterBulk(snapshot, locale).localizedOutput
            .sanitizedRoutes,
        );
      } finally {
        setIsSyncing(false);
      }
    };

    void fetchSanitizedRoutes();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- cardsKey fingerprints content
  }, [deferFetch, locale, cardsKey]);

  const isDev = process.env.NODE_ENV === "development";

  if (isSyncing) {
    return (
      <div className={styles.status} role="status" aria-live="polite">
        ルートを整えています…
      </div>
    );
  }

  return (
    <div className={styles.root} role="list" aria-label="診断カタログ">
      {routes.map((route) => (
        <Link
          key={route.id}
          href={route.targetCleanPath}
          className={styles.card}
          role="listitem"
        >
          <h3 className={styles.title}>{route.localizedTitle}</h3>
          <p className={styles.meta}>
            <span>{route.localizedLocations}</span>
            <span className={styles.dot} aria-hidden="true">
              ·
            </span>
            <span className={styles.trending}>{route.localizedTrendingTag}</span>
          </p>
          {isDev ? (
            <span className={styles.debugPath}>→ {route.targetCleanPath}</span>
          ) : null}
        </Link>
      ))}

      {errorMessage ? (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      ) : null}

      {isDev && routerLog ? (
        <details className={styles.cot}>
          <summary>Runtime Routing i18n CoT (Architect Engine)</summary>
          <div className={styles.cotBody}>
            <p>
              <span className={styles.cotLabel}>[Slug Deconstruction]</span>{" "}
              {routerLog.slugContextDeconstructionEnglish}
            </p>
            <p>
              <span className={styles.cotLabel}>[Sanitization Reason]</span>{" "}
              {routerLog.routingSanitizationJustificationEnglish}
            </p>
          </div>
        </details>
      ) : null}
    </div>
  );
};
