import { getBrand, type BrandId } from "@/lib/brand/registry";
import { LC_DESIGN_TOKENS } from "@/lib/design/tokens";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import type { PlayableServiceManifest, ServiceTheme } from "@/types/playableService";

type ThemePreset = {
  readonly backgroundColor: string;
  readonly fontClass: string;
  readonly customCssVariables?: ServiceTheme["customCssVariables"];
};

const THEME_PRESETS: Readonly<Record<BrandId, ThemePreset>> = {
  "liberty-canvas": {
    backgroundColor: LC_DESIGN_TOKENS.color.cream,
    fontClass: "font-sans-jp",
  },
  "liberty-plug": {
    backgroundColor: "#0f172a",
    fontClass: "font-sans",
    customCssVariables: {
      "--lc-service-surface": "rgba(15, 23, 42, 0.92)",
    },
  },
  "liberty-play": {
    backgroundColor: "#0b1220",
    fontClass: "font-sans",
    customCssVariables: {
      "--lc-service-surface": "rgba(11, 18, 32, 0.94)",
    },
  },
  "liberty-discover": {
    backgroundColor: "#0f172a",
    fontClass: "font-sans",
  },
  "liberty-forge": {
    backgroundColor: LC_DESIGN_TOKENS.color.creamSoft,
    fontClass: "font-sans-jp",
    customCssVariables: {
      "--lc-service-surface": "rgba(255, 252, 247, 0.9)",
    },
  },
  "liberty-runtime": {
    backgroundColor: LC_DESIGN_TOKENS.color.cream,
    fontClass: "font-sans",
  },
};

export function buildServiceTheme(brandId: BrandId): ServiceTheme {
  const brand = getBrand(brandId);
  const preset = THEME_PRESETS[brandId];

  return {
    primaryColor: brand.accentColor,
    backgroundColor: preset.backgroundColor,
    fontClass: preset.fontClass,
    customCssVariables: preset.customCssVariables,
  };
}

export function createPlayableServiceManifest<TData = unknown>(input: {
  readonly id: string;
  readonly brandId: BrandId;
  readonly defaultLocale?: Locale;
  readonly theme?: Partial<ServiceTheme>;
}): PlayableServiceManifest<TData> {
  const base = buildServiceTheme(input.brandId);
  const theme: ServiceTheme = {
    primaryColor: input.theme?.primaryColor ?? base.primaryColor,
    backgroundColor: input.theme?.backgroundColor ?? base.backgroundColor,
    fontClass: input.theme?.fontClass ?? base.fontClass,
    customCssVariables: {
      ...base.customCssVariables,
      ...input.theme?.customCssVariables,
    },
  };

  return {
    id: input.id,
    brandId: input.brandId,
    defaultLocale: input.defaultLocale ?? DEFAULT_LOCALE,
    theme,
  };
}

/** Built-in manifests for sub-brand playable surfaces. */
export const PLAYABLE_SERVICE_MANIFESTS = {
  play: createPlayableServiceManifest({
    id: "liberty-play-runtime",
    brandId: "liberty-play",
  }),
  plug: createPlayableServiceManifest({
    id: "liberty-plug-runtime",
    brandId: "liberty-plug",
  }),
  forge: createPlayableServiceManifest({
    id: "liberty-forge-runtime",
    brandId: "liberty-forge",
  }),
  runtime: createPlayableServiceManifest({
    id: "liberty-runtime-shell",
    brandId: "liberty-runtime",
  }),
} as const;
