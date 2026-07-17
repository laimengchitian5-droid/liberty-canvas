import { LC_DESIGN_TOKENS } from "@/lib/design/tokens";

/** Discriminated union of route-scoped sub-brands under Liberty Canvas. */
export type BrandId =
  | "liberty-canvas"
  | "liberty-plug"
  | "liberty-play"
  | "liberty-discover"
  | "liberty-forge"
  | "liberty-runtime";

export type BrandTheme = "adult-cute" | "immersive-dark";

/**
 * Structural brand identity only.
 * Feature paths live in BrandUrlResolver — do not leak /quiz|/app|/diagnosis into schema.
 * homeHref retained as temporary "/" default (OCP); prefer resolveBrandPath().
 */
export interface BrandIdentity {
  readonly id: BrandId;
  readonly name: string;
  readonly nameJa: string;
  readonly shortName: string;
  readonly taglineJa: string;
  readonly theme: BrandTheme;
  readonly accentColor: string;
  readonly iconPath: string;
  /** @deprecated Prefer resolveBrandPath(id, "hub") — temporary structural default. */
  readonly homeHref: string;
  readonly parentId: BrandId | null;
}

const LIBERTY_PARENT: BrandIdentity = {
  id: "liberty-canvas",
  name: "Liberty Canvas",
  nameJa: "リバティ・キャンバス",
  shortName: "Liberty",
  taglineJa: "無料AI性格診断プラットフォーム",
  theme: "adult-cute",
  accentColor: LC_DESIGN_TOKENS.color.dustyRose,
  iconPath: "/icons/icon.svg",
  homeHref: "/",
  parentId: null,
};

export const BRAND_REGISTRY: Readonly<Record<BrandId, BrandIdentity>> = {
  "liberty-canvas": LIBERTY_PARENT,
  "liberty-plug": {
    id: "liberty-plug",
    name: "Liberty Plug",
    nameJa: "リバティ・プラグ",
    shortName: "Plug",
    taglineJa: "会話型・深掘り診断",
    theme: "immersive-dark",
    accentColor: LC_DESIGN_TOKENS.color.cosmicIndigo,
    iconPath: "/icons/brands/liberty-plug.svg",
    homeHref: "/",
    parentId: "liberty-canvas",
  },
  "liberty-play": {
    id: "liberty-play",
    name: "Liberty Play",
    nameJa: "リバティ・プレイ",
    shortName: "Play",
    taglineJa: "1問クイズ・ソーシャル診断",
    theme: "immersive-dark",
    accentColor: LC_DESIGN_TOKENS.color.cosmicIndigo,
    iconPath: "/icons/brands/liberty-play.svg",
    homeHref: "/",
    parentId: "liberty-canvas",
  },
  "liberty-discover": {
    id: "liberty-discover",
    name: "Liberty Discover",
    nameJa: "リバティ・ディスカバー",
    shortName: "Discover",
    taglineJa: "SEO診断ハブ・多言語ランディング",
    theme: "immersive-dark",
    accentColor: LC_DESIGN_TOKENS.color.cosmicIndigo,
    iconPath: "/icons/brands/liberty-discover.svg",
    homeHref: "/",
    parentId: "liberty-canvas",
  },
  "liberty-forge": {
    id: "liberty-forge",
    name: "Liberty Forge",
    nameJa: "リバティ・フォージ",
    shortName: "Forge",
    taglineJa: "オリジナル診断ビルダー",
    theme: "adult-cute",
    accentColor: LC_DESIGN_TOKENS.color.goldAccent,
    iconPath: "/icons/brands/liberty-forge.svg",
    homeHref: "/",
    parentId: "liberty-canvas",
  },
  "liberty-runtime": {
    id: "liberty-runtime",
    name: "Liberty Runtime",
    nameJa: "リバティ・ランタイム",
    shortName: "Runtime",
    taglineJa: "公開クイズ・アプリ実行環境",
    theme: "adult-cute",
    accentColor: LC_DESIGN_TOKENS.color.sageSoft,
    iconPath: "/icons/brands/liberty-runtime.svg",
    homeHref: "/",
    parentId: "liberty-canvas",
  },
} as const;

export const SUB_BRAND_IDS: readonly BrandId[] = (
  Object.keys(BRAND_REGISTRY) as BrandId[]
).filter((id) => id !== "liberty-canvas");

export function getBrand(id: BrandId): BrandIdentity {
  return BRAND_REGISTRY[id];
}

export function getParentBrand(id: BrandId): BrandIdentity {
  const brand = getBrand(id);
  return brand.parentId ? getBrand(brand.parentId) : brand;
}
