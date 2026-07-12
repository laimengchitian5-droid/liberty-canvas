import { LANDING_TOPICS } from "@/lib/landing/landingTopics";

const RUBEL_PLAY_REDIRECTS: Record<string, string> = (() => {
  const map: Record<string, string> = {};

  for (const topic of LANDING_TOPICS) {
    const slug = topic.plugPlayPath.replace(/^\/diagnosis\/play\//, "");

    if (topic.playDiagnosisId && slug) {
      map[topic.playDiagnosisId] = slug;
    }
  }

  return map;
})();

export function isRubelConvergeRedirectEnabled(): boolean {
  return process.env.LC_RUBEL_CONVERGE === "true";
}

export function resolveRubelPlugRedirectPath(
  playId: string,
  searchParams: URLSearchParams,
): string | null {
  const slug = RUBEL_PLAY_REDIRECTS[playId];

  if (!slug) {
    return null;
  }

  const params = new URLSearchParams(searchParams.toString());
  params.set("ref", params.get("ref") ?? "rubel-converge");

  const query = params.toString();
  return `/diagnosis/play/${slug}${query ? `?${query}` : ""}`;
}
