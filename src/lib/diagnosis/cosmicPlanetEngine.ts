import type { AcademicTraitVector } from "@/lib/diagnosis/academicTraitVector";
import {
  buildFiveFactorRadar,
  type FiveFactorKey,
  type FiveFactorRadarPoint,
} from "@/lib/diagnosis/fiveFactorDisplay";

export type CosmicPlanetKind =
  | "sun_affirmation"
  | "glacial_crystal"
  | "nebula_dream"
  | "ringed_harmony"
  | "aurora_social"
  | "twilight_balance";

export const COSMIC_PLANET_KINDS = [
  "sun_affirmation",
  "glacial_crystal",
  "nebula_dream",
  "ringed_harmony",
  "aurora_social",
  "twilight_balance",
] as const satisfies readonly CosmicPlanetKind[];

export function isCosmicPlanetKind(value: string): value is CosmicPlanetKind {
  return (COSMIC_PLANET_KINDS as readonly string[]).includes(value);
}

export interface CosmicPlanetVisualSpec {
  kind: CosmicPlanetKind;
  nickname: string;
  coreStatus: string;
  coreColorPrimary: string;
  coreColorSecondary: string;
  glowColor: string;
  ringColor: string;
  backgroundTop: string;
  backgroundBottom: string;
  ringCount: 0 | 1 | 2 | 3;
  ringTiltDeg: number;
  starIntensity: number;
  pulseSpeedMs: number;
  hasAurora: boolean;
  surfaceTexture: "smooth" | "crystalline" | "cloudy";
}

export interface CosmicNarrative {
  strengths: string;
  stressBehavior: string;
  universalCompatibility: string;
}

export interface CosmicCharacterSheet {
  planet: CosmicPlanetVisualSpec;
  energyLevels: readonly FiveFactorRadarPoint[];
  narrative: CosmicNarrative;
  shareHashtag: string;
}

const PLANET_CATALOG: Readonly<
  Record<
    CosmicPlanetKind,
    Omit<CosmicPlanetVisualSpec, "kind" | "nickname" | "coreStatus"> & {
      nicknameTemplate: string;
      coreStatusTemplate: string;
    }
  >
> = {
  sun_affirmation: {
    nicknameTemplate: "すべてを包み込む全肯定の太陽星",
    coreStatusTemplate: "共感エネルギーが宇宙規模で輝く、あたたかい恒星タイプ",
    coreColorPrimary: "#ffd166",
    coreColorSecondary: "#ff8fab",
    glowColor: "rgb(255 209 102 / 0.72)",
    ringColor: "rgb(255 180 120 / 0.45)",
    backgroundTop: "#1a1033",
    backgroundBottom: "#3d1f5c",
    ringCount: 2,
    ringTiltDeg: 18,
    starIntensity: 0.85,
    pulseSpeedMs: 4200,
    hasAurora: true,
    surfaceTexture: "cloudy",
  },
  glacial_crystal: {
    nicknameTemplate: "静かに真理を見つめる氷河星",
    coreStatusTemplate: "深宇宙の静けさを纏う、結晶質の内省惑星",
    coreColorPrimary: "#b8e8ff",
    coreColorSecondary: "#6ec6ff",
    glowColor: "rgb(110 198 255 / 0.55)",
    ringColor: "rgb(184 232 255 / 0.35)",
    backgroundTop: "#020818",
    backgroundBottom: "#0b1f3a",
    ringCount: 1,
    ringTiltDeg: 32,
    starIntensity: 0.55,
    pulseSpeedMs: 6800,
    hasAurora: false,
    surfaceTexture: "crystalline",
  },
  nebula_dream: {
    nicknameTemplate: "可能性を描くネビュラ・ドリーム星",
    coreStatusTemplate: "発想の星雲をまとう、創造性に満ちた探索惑星",
    coreColorPrimary: "#c4b5fd",
    coreColorSecondary: "#f0abfc",
    glowColor: "rgb(196 181 253 / 0.62)",
    ringColor: "rgb(240 171 252 / 0.4)",
    backgroundTop: "#12082a",
    backgroundBottom: "#2d1b69",
    ringCount: 3,
    ringTiltDeg: 24,
    starIntensity: 0.9,
    pulseSpeedMs: 5200,
    hasAurora: true,
    surfaceTexture: "cloudy",
  },
  ringed_harmony: {
    nicknameTemplate: "軌道を整える誠実のリング星",
    coreStatusTemplate: "計画と積み重ねの引力で周囲を支える、安定軌道惑星",
    coreColorPrimary: "#9caf88",
    coreColorSecondary: "#c4a962",
    glowColor: "rgb(156 175 136 / 0.58)",
    ringColor: "rgb(196 169 98 / 0.42)",
    backgroundTop: "#0f1a14",
    backgroundBottom: "#1f3328",
    ringCount: 3,
    ringTiltDeg: 14,
    starIntensity: 0.65,
    pulseSpeedMs: 6000,
    hasAurora: false,
    surfaceTexture: "smooth",
  },
  aurora_social: {
    nicknameTemplate: "軌道を照らす社交のオーロラ星",
    coreStatusTemplate: "人との距離を光でつなぐ、外向性に満ちた交流惑星",
    coreColorPrimary: "#6ee7b7",
    coreColorSecondary: "#38bdf8",
    glowColor: "rgb(56 189 248 / 0.65)",
    ringColor: "rgb(110 231 183 / 0.38)",
    backgroundTop: "#041824",
    backgroundBottom: "#0c3d5c",
    ringCount: 2,
    ringTiltDeg: 22,
    starIntensity: 0.78,
    pulseSpeedMs: 3800,
    hasAurora: true,
    surfaceTexture: "smooth",
  },
  twilight_balance: {
    nicknameTemplate: "調和の薄明をたどるバランス星",
    coreStatusTemplate: "五つの宇宙エネルギーが均等に調和した、穏やかな中立惑星",
    coreColorPrimary: "#e9d5c3",
    coreColorSecondary: "#c9a09a",
    glowColor: "rgb(201 160 154 / 0.52)",
    ringColor: "rgb(233 213 195 / 0.38)",
    backgroundTop: "#1a1520",
    backgroundBottom: "#2e2430",
    ringCount: 1,
    ringTiltDeg: 20,
    starIntensity: 0.7,
    pulseSpeedMs: 5500,
    hasAurora: false,
    surfaceTexture: "smooth",
  },
};

const NARRATIVE_BY_KIND: Readonly<Record<CosmicPlanetKind, CosmicNarrative>> = {
  sun_affirmation: {
    strengths:
      "あなたの星は、出会った存在をやさしく包み込む引力を持っています。相手の感情を先回りして受け止め、安心できる空間を自然とつくれるのが最大の強みです。",
    stressBehavior:
      "負荷が高まると、自分より他者を優先しすぎてエネルギーを使い果たしやすい傾向があります。休息の軌道を意識的に確保すると、再びあたたかく輝けます。",
    universalCompatibility:
      "相性の良い惑星タイプ：誠実のリング星・バランス星。あなたの光が、計画性と安定感のある星と出会うと、長く続く信頼の軌道が生まれます。",
  },
  glacial_crystal: {
    strengths:
      "深い静けさの中で本質を見抜く力が、あなたの惑星の核です。騒がしい状況でも冷静さを保ち、丁寧な判断で周囲を支えられます。",
    stressBehavior:
      "プレッシャー下では、感情を内側に閉じ込めて孤立軌道に入りやすい面があります。小さな共有の合図を一つ送るだけで、負担は大きく軽くなります。",
    universalCompatibility:
      "相性の良い惑星タイプ：全肯定の太陽星・ネビュラ・ドリーム星。あなたの静けさが、温かさや創造性の星と出会うと、深い理解の星座が完成します。",
  },
  nebula_dream: {
    strengths:
      "未知への好奇心と想像力が、あなたの星を常に新しい軌道へ導きます。型にはまらない視点が、チームに新しい可能性をもたらす源になっています。",
    stressBehavior:
      "選択肢が多すぎるとき、方向定めに時間がかかることがあります。ひとつの小さな目標を軌道固定すると、創造力が一気に加速します。",
    universalCompatibility:
      "相性の良い惑星タイプ：社交のオーロラ星・誠実のリング星。自由な発想と、実行力・交流力の星が組み合わさると、最高の共創軌道が生まれます。",
  },
  ringed_harmony: {
    strengths:
      "計画性と誠実さが、あなたの惑星の美しいリングを形づくっています。約束を守り、積み重ねを大切にする姿勢が、周囲から深く信頼されています。",
    stressBehavior:
      "完璧を求めすぎると、自転速度が落ちて疲労が蓄積しやすくなります。80点の完成を許すとき、星はむしろ安定した光を放ちます。",
    universalCompatibility:
      "相性の良い惑星タイプ：全肯定の太陽星・バランス星。あなたの安定感が、共感力や調和力の星と出会うと、安心して長く続く関係軌道が築けます。",
  },
  aurora_social: {
    strengths:
      "人との距離を自然に縮め、場に明るいエネルギーを届ける力があなたの星の特徴です。初対面でも氷を溶かし、会話の流れを活性化させられます。",
    stressBehavior:
      "社交エネルギーを使いすぎると、一時的に自転が不安定になることがあります。意図的な独处時間が、再び輝くための大切な燃料になります。",
    universalCompatibility:
      "相性の良い惑星タイプ：氷河星・ネビュラ・ドリーム星。あなたの明るさが、静けさや創造性の星と出会うと、バランスの取れた星座を形成できます。",
  },
  twilight_balance: {
    strengths:
      "五つの宇宙エネルギーが調和し、状況に応じて柔軟に軌道を変えられるのがあなたの強みです。極端に偏らず、多様な星と共鳴しやすいタイプです。",
    stressBehavior:
      "決断を急かされると、すべての選択肢を同時に検討して疲れやすい傾向があります。優先順位をひとつだけ定めると、軌道はすぐに安定します。",
    universalCompatibility:
      "相性の良い惑星タイプ：全肯定の太陽星・社交のオーロラ星・誠実のリング星。どの星とも衝突しにくく、星座全体の調和役として輝けます。",
  },
};

const SHARE_HASHTAG: Readonly<Record<CosmicPlanetKind, string>> = {
  sun_affirmation: "#全肯定太陽星",
  glacial_crystal: "#氷河星診断",
  nebula_dream: "#ネビュラ星診断",
  ringed_harmony: "#リング星診断",
  aurora_social: "#オーロラ星診断",
  twilight_balance: "#バランス星診断",
};

function scoreByKey(levels: readonly FiveFactorRadarPoint[], key: FiveFactorKey): number {
  return levels.find((entry) => entry.key === key)?.score ?? 0;
}

function resolveDominantKey(levels: readonly FiveFactorRadarPoint[]): FiveFactorKey {
  return (
    [...levels].sort((left, right) => right.score - left.score)[0]?.key ?? "extraversion"
  );
}

export function resolveCosmicPlanetKind(vector: AcademicTraitVector): CosmicPlanetKind {
  const levels = buildFiveFactorRadar(vector);
  const dominant = resolveDominantKey(levels);

  const extraversion = scoreByKey(levels, "extraversion");
  const empathy = scoreByKey(levels, "empathy_agreeableness");
  const openness = scoreByKey(levels, "openness");
  const conscientiousness = scoreByKey(levels, "conscientiousness");
  const stability = scoreByKey(levels, "emotional_stability");

  if (empathy >= 0.62 && extraversion >= 0.45) {
    return "sun_affirmation";
  }

  if (extraversion <= 0.38 && stability >= 0.55) {
    return "glacial_crystal";
  }

  if (openness >= 0.58 && dominant === "openness") {
    return "nebula_dream";
  }

  if (conscientiousness >= 0.58 && dominant === "conscientiousness") {
    return "ringed_harmony";
  }

  if (extraversion >= 0.58 && dominant === "extraversion") {
    return "aurora_social";
  }

  const spread =
    Math.max(...levels.map((entry) => entry.score)) -
    Math.min(...levels.map((entry) => entry.score));

  if (spread <= 0.22) {
    return "twilight_balance";
  }

  switch (dominant) {
    case "empathy_agreeableness":
      return "sun_affirmation";
    case "openness":
      return "nebula_dream";
    case "conscientiousness":
      return "ringed_harmony";
    case "extraversion":
      return "aurora_social";
    case "emotional_stability":
      return "glacial_crystal";
    default:
      return "twilight_balance";
  }
}

export function buildCosmicCharacterSheet(
  vector: AcademicTraitVector,
): CosmicCharacterSheet {
  const kind = resolveCosmicPlanetKind(vector);
  const catalog = PLANET_CATALOG[kind];
  const energyLevels = buildFiveFactorRadar(vector);

  const planet: CosmicPlanetVisualSpec = {
    kind,
    nickname: catalog.nicknameTemplate,
    coreStatus: catalog.coreStatusTemplate,
    coreColorPrimary: catalog.coreColorPrimary,
    coreColorSecondary: catalog.coreColorSecondary,
    glowColor: catalog.glowColor,
    ringColor: catalog.ringColor,
    backgroundTop: catalog.backgroundTop,
    backgroundBottom: catalog.backgroundBottom,
    ringCount: catalog.ringCount,
    ringTiltDeg: catalog.ringTiltDeg,
    starIntensity: catalog.starIntensity,
    pulseSpeedMs: catalog.pulseSpeedMs,
    hasAurora: catalog.hasAurora,
    surfaceTexture: catalog.surfaceTexture,
  };

  return {
    planet,
    energyLevels,
    narrative: NARRATIVE_BY_KIND[kind],
    shareHashtag: SHARE_HASHTAG[kind],
  };
}

export function getCosmicPlanetVisualSpec(
  kind: CosmicPlanetKind,
): CosmicPlanetVisualSpec {
  const catalog = PLANET_CATALOG[kind];

  return {
    kind,
    nickname: catalog.nicknameTemplate,
    coreStatus: catalog.coreStatusTemplate,
    coreColorPrimary: catalog.coreColorPrimary,
    coreColorSecondary: catalog.coreColorSecondary,
    glowColor: catalog.glowColor,
    ringColor: catalog.ringColor,
    backgroundTop: catalog.backgroundTop,
    backgroundBottom: catalog.backgroundBottom,
    ringCount: catalog.ringCount,
    ringTiltDeg: catalog.ringTiltDeg,
    starIntensity: catalog.starIntensity,
    pulseSpeedMs: catalog.pulseSpeedMs,
    hasAurora: catalog.hasAurora,
    surfaceTexture: catalog.surfaceTexture,
  };
}

export function getCosmicShareHashtag(kind: CosmicPlanetKind): string {
  return SHARE_HASHTAG[kind];
}

export function buildCosmicRadarPolygonPoints(
  levels: readonly FiveFactorRadarPoint[],
  centerX: number,
  centerY: number,
  maxRadius: number,
): string {
  const ordered = [
    levels.find((entry) => entry.key === "extraversion"),
    levels.find((entry) => entry.key === "openness"),
    levels.find((entry) => entry.key === "empathy_agreeableness"),
    levels.find((entry) => entry.key === "conscientiousness"),
    levels.find((entry) => entry.key === "emotional_stability"),
  ].filter((entry): entry is FiveFactorRadarPoint => entry !== undefined);

  const angleStep = (Math.PI * 2) / ordered.length;
  const startAngle = -Math.PI / 2;

  const points = ordered.map((entry, index) => {
    const angle = startAngle + angleStep * index;
    const radius = Math.max(0.12, entry.score) * maxRadius;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return points.join(" ");
}

export function buildCosmicRadarAxisPoints(
  centerX: number,
  centerY: number,
  maxRadius: number,
  count = 5,
): readonly { x1: number; y1: number; x2: number; y2: number }[] {
  const angleStep = (Math.PI * 2) / count;
  const startAngle = -Math.PI / 2;

  return Array.from({ length: count }, (_, index) => {
    const angle = startAngle + angleStep * index;
    return {
      x1: centerX,
      y1: centerY,
      x2: centerX + Math.cos(angle) * maxRadius,
      y2: centerY + Math.sin(angle) * maxRadius,
    };
  });
}

export interface PlanetGalleryEntry {
  kind: CosmicPlanetKind;
  spec: CosmicPlanetVisualSpec;
  shareHashtag: string;
  compatibilityHint: string;
  isActive: boolean;
}

export function buildPlanetGalleryEntries(
  vector: AcademicTraitVector,
): readonly PlanetGalleryEntry[] {
  const activeKind = resolveCosmicPlanetKind(vector);

  return COSMIC_PLANET_KINDS.map((kind) => ({
    kind,
    spec: getCosmicPlanetVisualSpec(kind),
    shareHashtag: SHARE_HASHTAG[kind],
    compatibilityHint: NARRATIVE_BY_KIND[kind].universalCompatibility,
    isActive: kind === activeKind,
  }));
}
