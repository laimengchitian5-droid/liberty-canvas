"use client";

import type { ReactNode } from "react";
import { buildServiceCssVars } from "@/lib/playable/buildServiceCssVars";
import { resolveGameLocale } from "@/lib/playable/gameContentSchema";
import { resolveServiceLocaleFontClass } from "@/lib/playable/serviceFontClasses";
import { getDirection, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils/cn";
import type {
  PlayableGameRenderProps,
  PlayableServiceManifest,
} from "@/types/playableService";
import styles from "./PlayServiceContainer.module.css";

export interface PlayServiceContainerProps<TData> {
  readonly manifest: PlayableServiceManifest<TData>;
  readonly currentLocale: Locale | string;
  readonly localizedData: TData;
  /**
   * Game UI — render-prop or static node.
   * Keeps JSX out of the serializable manifest (RSC-safe boundary).
   */
  readonly children:
    | ReactNode
    | ((props: PlayableGameRenderProps<TData>) => ReactNode);
  readonly className?: string;
}

/**
 * SRP: isolate a playable service's design tokens + dir/lang from the shell.
 * Outer platform never needs to know which game is mounted.
 */
export const PlayServiceContainer = <TData,>({
  manifest,
  currentLocale,
  localizedData,
  children,
  className,
}: PlayServiceContainerProps<TData>) => {
  const locale = resolveGameLocale(currentLocale, manifest.defaultLocale);
  const direction = getDirection(locale);
  const fontClass = resolveServiceLocaleFontClass(
    locale,
    manifest.theme.fontClass,
  );
  const cssVars = buildServiceCssVars(manifest.theme);

  const renderProps: PlayableGameRenderProps<TData> = {
    locale,
    data: localizedData,
    serviceId: manifest.id,
    brandId: manifest.brandId,
  };

  const content =
    typeof children === "function" ? children(renderProps) : children;

  return (
    <div
      className={cn(styles.root, fontClass, className)}
      style={cssVars}
      dir={direction}
      lang={locale}
      data-service-id={manifest.id}
      data-brand-id={manifest.brandId}
      role="group"
      aria-label={manifest.id}
    >
      <div className={styles.canvas}>{content}</div>
    </div>
  );
};
