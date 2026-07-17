import { buildOgPalette } from "@/lib/brand/ogBrand";
import type { SpecialtyOgMeta } from "@/lib/specialty/specialtyOgMeta";

interface SpecialtyLandingOgProps {
  title: string;
  subtitle: string;
  meta: SpecialtyOgMeta;
}

export function SpecialtyLandingOg({ title, subtitle, meta }: SpecialtyLandingOgProps) {
  const palette = buildOgPalette("liberty-plug");

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 64px",
        background: `radial-gradient(circle at 88% 12%, ${meta.themeColor}44 0%, transparent 42%), radial-gradient(circle at 12% 88%, ${meta.themeColor}22 0%, transparent 36%), ${palette.cream}`,
        color: palette.ink,
        fontFamily: "serif",
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <div style={{ fontSize: 22, color: palette.muted }}>
          {meta.isWorldEntry ? "世界名産ソウル" : `${meta.countryNameJa} 深掘り`}
        </div>
        <div style={{ fontSize: 52, lineHeight: 1 }}>{meta.flagEmoji}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div
          style={{
            fontSize: 54,
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
        <div
          style={{ fontSize: 28, lineHeight: 1.45, color: palette.muted, maxWidth: 900 }}
        >
          {subtitle}
        </div>
        <div style={{ fontSize: 22, color: palette.muted }}>{meta.specialtyLabelJa}</div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          color: palette.muted,
        }}
      >
        <span>{palette.nameJa}</span>
        <span>{meta.hashtag}</span>
      </div>
    </div>
  );
}

interface SpecialtyResultOgProps {
  meta: SpecialtyOgMeta;
  diagnosisTitle: string;
}

export function SpecialtyResultOg({ meta, diagnosisTitle }: SpecialtyResultOgProps) {
  const palette = buildOgPalette("liberty-plug");
  const title = meta.archetypeTitle ?? diagnosisTitle;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 64px",
        background: `linear-gradient(145deg, ${meta.themeColor}33 0%, transparent 55%), ${palette.cream}`,
        color: palette.ink,
        fontFamily: "serif",
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <div style={{ fontSize: 22, color: palette.muted }}>
          {meta.flagEmoji} {meta.countryNameJa} · 結果
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            background: `linear-gradient(135deg, ${meta.themeColor}, ${meta.themeColor}99)`,
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 24, color: palette.muted }}>{diagnosisTitle}</div>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 28, color: palette.muted }}>{meta.specialtyLabelJa}</div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          color: palette.muted,
        }}
      >
        <span>{palette.nameJa}</span>
        <span>{meta.hashtag}</span>
      </div>
    </div>
  );
}
