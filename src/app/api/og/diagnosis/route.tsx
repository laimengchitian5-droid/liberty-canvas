import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getMergedPlugDiagnosisBySlug } from "@/lib/builder/plugCatalog";
import { CosmicPlanetOg, PlugLandingOg } from "@/lib/diagnosis/cosmicPlanetOg";
import {
  getCosmicPlanetVisualSpec,
  getCosmicShareHashtag,
  isCosmicPlanetKind,
} from "@/lib/diagnosis/cosmicPlanetEngine";
import { extractResultBlock } from "@/lib/diagnosis/extractDiagnosisElements";
import {
  buildRadarLevelsFromFactorPercentiles,
  parseFactorPercentiles,
} from "@/lib/diagnosis/plugResultShare";
import {
  getDiagnosisResult,
  isPersonalityCategory,
} from "@/lib/diagnosis/share";
import { DIAGNOSTIC_QUESTION_COUNT } from "@/types/diagnosis";

export const runtime = "nodejs";

const BRAND = {
  cream: "#FAF9F6",
  ink: "#4A4038",
  muted: "#8B7D72",
};

function GenericOg() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 64px",
        background: `radial-gradient(circle at 85% 15%, #C9A09A33 0%, transparent 42%), radial-gradient(circle at 10% 90%, #9CAF8822 0%, transparent 38%), ${BRAND.cream}`,
        color: BRAND.ink,
        fontFamily: "serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: BRAND.muted }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 999,
            background: "linear-gradient(135deg, #C9A09A, #C4A962)",
          }}
        />
        LibertyCanvas · 心の色診断
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
          あなたの心の色、
          <br />
          {DIAGNOSTIC_QUESTION_COUNT}問で見つける
        </div>
        <div style={{ fontSize: 28, lineHeight: 1.55, color: BRAND.muted, maxWidth: 880 }}>
          大人可愛い多肢選択診断と、AI パーソナルアドバイス
        </div>
      </div>
      <div style={{ fontSize: 22, color: BRAND.muted }}>#心の色診断</div>
    </div>
  );
}

function ResultOg({
  title,
  subtitle,
  themeColor,
}: {
  title: string;
  subtitle: string;
  themeColor: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 64px",
        background: `radial-gradient(circle at 92% 8%, ${themeColor}44 0%, transparent 40%), radial-gradient(circle at 8% 92%, ${themeColor}22 0%, transparent 36%), ${BRAND.cream}`,
        color: BRAND.ink,
        fontFamily: "serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 22, color: BRAND.muted }}>心の色診断 · 結果</div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            background: `linear-gradient(135deg, ${themeColor}, ${themeColor}99)`,
            boxShadow: `0 8px 32px ${themeColor}55`,
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.02em" }}>
          {title}
        </div>
        <div style={{ fontSize: 30, lineHeight: 1.45, color: BRAND.muted, maxWidth: 900 }}>
          {subtitle}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: BRAND.muted }}>
        <span>LibertyCanvas</span>
        <span>#心の色診断</span>
      </div>
    </div>
  );
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  const headline = request.nextUrl.searchParams.get("headline");
  const headlineSubtitle = request.nextUrl.searchParams.get("subtitle");
  const planet = request.nextUrl.searchParams.get("planet");
  const archetypeId = request.nextUrl.searchParams.get("archetype");
  const factorsRaw = request.nextUrl.searchParams.get("f");
  const ogVariant = request.nextUrl.searchParams.get("ogVariant");
  const type = request.nextUrl.searchParams.get("type");

  if (headline) {
    return new ImageResponse(
      <PlugLandingOg
        eyebrow="LibertyCanvas · Play"
        title={headline}
        subtitle={headlineSubtitle ?? "1-question AI personality quiz"}
      />,
      { width: 1200, height: 630 },
    );
  }

  if (slug) {
    const definition = await getMergedPlugDiagnosisBySlug(slug);

    if (!definition) {
      return new Response("Invalid diagnosis slug", { status: 400 });
    }

    if (planet && isCosmicPlanetKind(planet)) {
      const planetSpec = getCosmicPlanetVisualSpec(planet);
      const resultBlock = extractResultBlock(definition);
      const archetype = archetypeId
        ? resultBlock?.results.find((entry) => entry.id === archetypeId)
        : resultBlock?.results[0];
      const factorPercentiles = parseFactorPercentiles(factorsRaw);
      const radarLevels =
        ogVariant === "classic"
          ? undefined
          : factorPercentiles
            ? buildRadarLevelsFromFactorPercentiles(factorPercentiles)
            : undefined;

      return new ImageResponse(
        <CosmicPlanetOg
          nickname={planetSpec.nickname}
          coreStatus={planetSpec.coreStatus}
          archetypeTitle={archetype?.title ?? definition.title}
          hashtag={getCosmicShareHashtag(planet)}
          planet={planetSpec}
          diagnosisTitle={definition.title}
          radarLevels={radarLevels}
        />,
        { width: 1200, height: 630 },
      );
    }

    return new ImageResponse(
      <PlugLandingOg
        eyebrow={definition.eyebrow}
        title={definition.title}
        subtitle={definition.subtitle}
      />,
      { width: 1200, height: 630 },
    );
  }

  if (!type) {
    return new ImageResponse(<GenericOg />, { width: 1200, height: 630 });
  }

  if (!isPersonalityCategory(type)) {
    return new Response("Invalid diagnosis type", { status: 400 });
  }

  const result = getDiagnosisResult(type);

  return new ImageResponse(
    <ResultOg
      title={result.title}
      subtitle={result.subtitle}
      themeColor={result.themeColor}
    />,
    { width: 1200, height: 630 },
  );
}
