"use client";

import type { ReactNode } from "react";
import { PlayServiceContainer } from "@/components/playable/PlayServiceContainer";
import {
  toGameServiceRenderProps,
  type GameContent,
  type GameServiceRenderProps,
  type ServiceManifest,
} from "@/lib/playable/gameContentSchema";
import type { Locale } from "@/lib/i18n/config";
import styles from "./PlatformMasterContainer.module.css";

export interface PlatformMasterContainerProps {
  readonly manifest: ServiceManifest;
  readonly locale: Locale | string;
  readonly content: GameContent;
  /**
   * Game UI. Prefer render-prop over storing JSX on the manifest.
   */
  readonly children:
    | ReactNode
    | ((props: GameServiceRenderProps) => ReactNode);
  readonly className?: string;
}

/**
 * Platform shell: design isolation + INP-friendly scroll layer.
 * SEO (title/description/canonical/hreflang) belongs in `generateMetadata`
 * via {@link buildPlatformGameMetadata} — never a nested `<head>` in the tree.
 */
export const PlatformMasterContainer = ({
  manifest,
  locale,
  content,
  children,
  className,
}: PlatformMasterContainerProps) => {
  return (
    <PlayServiceContainer
      manifest={manifest}
      currentLocale={locale}
      localizedData={content}
      className={className}
    >
      {(base) => {
        const props = toGameServiceRenderProps(base);
        const body =
          typeof children === "function" ? children(props) : children;

        return (
          <main className={styles.main} id="platform-game-main">
            {body}
          </main>
        );
      }}
    </PlayServiceContainer>
  );
};
