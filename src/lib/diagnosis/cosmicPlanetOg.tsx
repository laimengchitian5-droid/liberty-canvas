import type { CosmicPlanetVisualSpec } from "@/lib/diagnosis/cosmicPlanetEngine";
import {
  buildCosmicRadarAxisPoints,
  buildCosmicRadarPolygonPoints,
} from "@/lib/diagnosis/cosmicPlanetEngine";
import { FIVE_FACTOR_LABELS, type FiveFactorRadarPoint } from "@/lib/diagnosis/fiveFactorDisplay";

interface CosmicPlanetOgProps {
  nickname: string;
  coreStatus: string;
  archetypeTitle: string;
  hashtag: string;
  planet: CosmicPlanetVisualSpec;
  diagnosisTitle: string;
  radarLevels?: readonly FiveFactorRadarPoint[];
}

const OG_RADAR_LABELS = [
  FIVE_FACTOR_LABELS.extraversion,
  FIVE_FACTOR_LABELS.openness,
  FIVE_FACTOR_LABELS.empathy_agreeableness,
  FIVE_FACTOR_LABELS.conscientiousness,
  FIVE_FACTOR_LABELS.emotional_stability,
] as const;

const OG_RADAR_LABEL_POSITIONS = [
  { x: 90, y: 18 },
  { x: 148, y: 58 },
  { x: 132, y: 118 },
  { x: 48, y: 118 },
  { x: 32, y: 58 },
] as const;

function CosmicPlanetRadarOg({
  levels,
  accentColor,
}: {
  levels: readonly FiveFactorRadarPoint[];
  accentColor: string;
}) {
  const polygon = buildCosmicRadarPolygonPoints(levels, 90, 90, 52);
  const axes = buildCosmicRadarAxisPoints(90, 90, 52);

  return (
    <svg
      width="180"
      height="160"
      viewBox="0 0 180 160"
      style={{ marginTop: 8 }}
    >
      {[18, 36, 52].map((radius) => (
        <circle
          key={radius}
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="rgba(255,248,242,0.18)"
          strokeWidth="1"
        />
      ))}

      {axes.map((axis, index) => (
        <line
          key={`axis-${index}`}
          x1={axis.x1}
          y1={axis.y1}
          x2={axis.x2}
          y2={axis.y2}
          stroke="rgba(255,248,242,0.18)"
          strokeWidth="1"
        />
      ))}

      <polygon
        points={polygon}
        fill={`${accentColor}55`}
        stroke={accentColor}
        strokeWidth="2"
      />

      {OG_RADAR_LABELS.map((label, index) => {
        const position = OG_RADAR_LABEL_POSITIONS[index];

        if (!position) {
          return null;
        }

        return (
          <text
            key={label}
            x={position.x}
            y={position.y}
            fill="rgba(255,248,242,0.72)"
            fontSize="11"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

function PlanetRingsOg({ planet }: { planet: CosmicPlanetVisualSpec }) {
  if (planet.ringCount === 0) {
    return null;
  }

  return (
    <>
      {Array.from({ length: planet.ringCount }, (_, index) => {
        const scale = 1 + index * 0.12;
        const width = 220 * scale;
        const height = 72 * scale;

        return (
          <div
            key={`ring-${index}`}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width,
              height,
              marginLeft: -width / 2,
              marginTop: -height / 2,
              borderRadius: "50%",
              border: `3px solid ${planet.coreColorPrimary}99`,
              transform: `rotate(${planet.ringTiltDeg + index * 8}deg)`,
              opacity: 0.85 - index * 0.15,
            }}
          />
        );
      })}
    </>
  );
}

export function CosmicPlanetOg({
  nickname,
  coreStatus,
  archetypeTitle,
  hashtag,
  planet,
  diagnosisTitle,
  radarLevels,
}: CosmicPlanetOgProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        background: `linear-gradient(145deg, ${planet.backgroundTop} 0%, ${planet.backgroundBottom} 100%)`,
        color: "#FFF8F2",
        fontFamily: "serif",
      }}
    >
      <div
        style={{
          width: "42%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: planet.starIntensity,
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #ffffff 0 2px, transparent 2px), radial-gradient(circle at 70% 20%, #ffffff 0 2px, transparent 2px), radial-gradient(circle at 55% 75%, #ffffff 0 2px, transparent 2px)",
          }}
        />

        <div style={{ position: "relative", width: 220, height: 220 }}>
          <PlanetRingsOg planet={planet} />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 148,
              height: 148,
              marginLeft: -74,
              marginTop: -74,
              borderRadius: "50%",
              background: `radial-gradient(circle at 32% 28%, ${planet.coreColorPrimary} 0%, ${planet.coreColorSecondary} 62%, rgba(0,0,0,0.35) 100%)`,
              boxShadow: `0 0 40px ${planet.coreColorPrimary}88, 0 0 80px ${planet.coreColorSecondary}55`,
            }}
          />
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 52px 48px 0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 20, color: "rgba(255,248,242,0.72)" }}>
            {diagnosisTitle} · コズミック結果
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              maxWidth: 620,
            }}
          >
            {nickname}
          </div>
          <div style={{ fontSize: 24, lineHeight: 1.45, color: "rgba(255,248,242,0.82)" }}>
            {archetypeTitle}
          </div>
          <div
            style={{
              fontSize: 20,
              lineHeight: 1.55,
              color: "rgba(255,248,242,0.65)",
              maxWidth: 560,
            }}
          >
            {coreStatus}
          </div>
          {radarLevels ? (
            <CosmicPlanetRadarOg
              levels={radarLevels}
              accentColor={planet.coreColorPrimary}
            />
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "rgba(255,248,242,0.75)",
          }}
        >
          <span>LibertyCanvas</span>
          <span>{hashtag}</span>
        </div>
      </div>
    </div>
  );
}

interface PlugLandingOgProps {
  title: string;
  subtitle: string;
  eyebrow: string;
}

export function PlugLandingOg({ title, subtitle, eyebrow }: PlugLandingOgProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 64px",
        background:
          "radial-gradient(circle at 85% 15%, #C9A09A33 0%, transparent 42%), radial-gradient(circle at 10% 90%, #9CAF8822 0%, transparent 38%), #12082a",
        color: "#FFF8F2",
        fontFamily: "serif",
      }}
    >
      <div style={{ fontSize: 22, color: "rgba(255,248,242,0.72)" }}>{eyebrow}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontSize: 54, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
        <div
          style={{
            fontSize: 28,
            lineHeight: 1.5,
            color: "rgba(255,248,242,0.78)",
            maxWidth: 880,
          }}
        >
          {subtitle}
        </div>
      </div>
      <div style={{ fontSize: 22, color: "rgba(255,248,242,0.72)" }}>
        Rubel Canvas · 性格診断
      </div>
    </div>
  );
}
