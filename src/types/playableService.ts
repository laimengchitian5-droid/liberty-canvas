/**
 * Playable service isolation contract.
 * Manifests are serializable theme/identity only — renderers stay in the React tree
 * (no JSX factories on data objects; keeps RSC / serialization boundaries clean).
 */

import type { BrandId } from "@/lib/brand/registry";
import type { Locale } from "@/lib/i18n/config";

/** CSS custom property name: `--lc-service-*` or `--*` whitelist. */
export type ServiceCssVarName = `--${string}`;

export type ServiceCssVariables = Readonly<
  Partial<Record<ServiceCssVarName, string>>
>;

/**
 * Visual tokens for one isolated service surface.
 * Values come from the internal registry — never from untrusted user input.
 */
export interface ServiceTheme {
  readonly primaryColor: string;
  readonly backgroundColor: string;
  /** Tailwind / global font utility class (registry-whitelisted). */
  readonly fontClass: string;
  readonly customCssVariables?: ServiceCssVariables;
}

/**
 * Identity + theme for a playable micro-frontend surface.
 * Generic `TData` documents the payload shape the page renderer expects.
 */
export interface PlayableServiceManifest<TData = unknown> {
  readonly id: string;
  readonly brandId: BrandId;
  readonly defaultLocale: Locale;
  readonly theme: ServiceTheme;
  /** Phantom type carrier — erased at runtime. */
  readonly _dataType?: TData;
}

export interface PlayableGameRenderProps<TData> {
  readonly locale: Locale;
  readonly data: TData;
  readonly serviceId: string;
  readonly brandId: BrandId;
}
