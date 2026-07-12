"use client";

import { useMemo, type CSSProperties } from "react";
import {
  buildCosmicRadarAxisPoints,
  buildCosmicRadarPolygonPoints,
  type CosmicCharacterSheet,
  type CosmicPlanetVisualSpec,
} from "@/lib/diagnosis/cosmicPlanetEngine";
import { FIVE_FACTOR_LABELS } from "@/lib/diagnosis/fiveFactorDisplay";
import type { CosmicPlanetKind } from "@/lib/diagnosis/cosmicPlanetEngine";
import styles from "./diagnosisResultPage.module.css";

const RADAR_LABELS = [
  FIVE_FACTOR_LABELS.extraversion,
  FIVE_FACTOR_LABELS.openness,
  FIVE_FACTOR_LABELS.empathy_agreeableness,
  FIVE_FACTOR_LABELS.conscientiousness,
  FIVE_FACTOR_LABELS.emotional_stability,
] as const;

const RADAR_LABEL_POSITIONS = [
  { x: 100, y: 16 },
  { x: 168, y: 72 },
  { x: 148, y: 152 },
  { x: 52, y: 152 },
  { x: 32, y: 72 },
] as const;

interface CosmicPlanetVisualProps {
  sheet: CosmicCharacterSheet;
  activePlanetKind: CosmicPlanetKind;
  renderReady: boolean;
}

function buildPlanetStyle(planet: CosmicPlanetVisualSpec): CSSProperties {
  return {
    ["--planet-core-1" as string]: planet.coreColorPrimary,
    ["--planet-core-2" as string]: planet.coreColorSecondary,
    ["--planet-glow" as string]: planet.glowColor,
    ["--planet-ring" as string]: planet.ringColor,
    ["--cosmos-top" as string]: planet.backgroundTop,
    ["--cosmos-bottom" as string]: planet.backgroundBottom,
    ["--planet-tilt" as string]: `${planet.ringTiltDeg}deg`,
    ["--planet-pulse-ms" as string]: `${planet.pulseSpeedMs}ms`,
    ["--star-opacity" as string]: String(planet.starIntensity),
  };
}

const PlanetRings = ({ count }: { count: 0 | 1 | 2 | 3 }) => {
  if (count === 0) {
    return null;
  }

  return (
    <>
      <div className={styles.planetRing} aria-hidden="true" />
      {count >= 2 ? <div className={styles.planetRingSecondary} aria-hidden="true" /> : null}
      {count >= 3 ? <div className={styles.planetRingTertiary} aria-hidden="true" /> : null}
    </>
  );
};

export const CosmicPlanetVisual = ({
  sheet,
  activePlanetKind,
  renderReady,
}: CosmicPlanetVisualProps) => {
  const { planet, energyLevels } = sheet;

  const radarPolygon = useMemo(
    () => buildCosmicRadarPolygonPoints(energyLevels, 100, 100, 72),
    [energyLevels],
  );

  const radarAxes = useMemo(
    () => buildCosmicRadarAxisPoints(100, 100, 72),
    [],
  );

  const planetClassName = [
    styles.planetOrb,
    planet.surfaceTexture === "crystalline" ? styles.planetCrystalline : "",
    planet.surfaceTexture === "cloudy" ? styles.planetCloudy : "",
    planet.hasAurora ? styles.planetAurora : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={styles.cosmicStage}
      style={buildPlanetStyle(planet)}
      data-planet-kind={activePlanetKind}
      data-render-ready={renderReady ? "true" : "false"}
      aria-labelledby="cosmic-planet-heading"
    >
      <div className={styles.cosmicBackdrop} aria-hidden="true">
        <div className={styles.starfield} />
        {planet.hasAurora ? <div className={styles.auroraVeil} /> : null}
      </div>

      <div className={styles.planetStageInner}>
        <div className={styles.planetSystem} role="img" aria-label={`${planet.nickname}のビジュアル`}>
          <PlanetRings count={planet.ringCount} />
          <div className={planetClassName} />
        </div>

        <div className={styles.radarWrapper}>
          <svg
            className={styles.radarSvg}
            viewBox="0 0 200 180"
            role="img"
            aria-label="宇宙エネルギー・レーダーチャート"
          >
            <g className={styles.radarGridRings}>
              {[24, 48, 72].map((radius) => (
                <circle
                  key={radius}
                  cx="100"
                  cy="100"
                  r={radius}
                  className={styles.radarGuideRing}
                />
              ))}
            </g>

            {radarAxes.map((axis, index) => (
              <line
                key={`axis-${index}`}
                x1={axis.x1}
                y1={axis.y1}
                x2={axis.x2}
                y2={axis.y2}
                className={styles.radarAxisLine}
              />
            ))}

            <polygon
              points={radarPolygon}
              className={styles.radarPolygon}
            />

            {RADAR_LABELS.map((label, index) => {
              const position = RADAR_LABEL_POSITIONS[index];
              if (!position) {
                return null;
              }

              return (
                <text
                  key={label}
                  x={position.x}
                  y={position.y}
                  className={styles.radarSvgLabel}
                  textAnchor="middle"
                >
                  {label}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      <div className={styles.cosmicStatusPanel}>
        <h3 id="cosmic-planet-heading" className={styles.cosmicNickname}>
          {planet.nickname}
        </h3>
        <p className={styles.cosmicCoreStatus}>{planet.coreStatus}</p>
      </div>

      <ul className={styles.energyLevelList} aria-label="宇宙エネルギーレベル">
        {energyLevels.map((level) => (
          <li key={level.key} className={styles.energyLevelItem}>
            <span className={styles.energyLevelLabel}>{level.label}</span>
            <span className={styles.energyLevelValue}>
              {level.percentile}
              <span className={styles.energyLevelUnit}>%</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};
