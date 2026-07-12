import type { BuilderCreatorTag } from "@/types/builder";
import { BUILDER_CREATOR_TAGS } from "@/types/builder";

const TAG_VIRAL_KEYWORDS: Readonly<
  Record<(typeof BUILDER_CREATOR_TAGS)[number], readonly string[]>
> = {
  高校生向け: [
    "高校生向け",
    "10代",
    "学生",
    "無料性格診断",
    "自分を知る",
  ],
  推し活: [
    "推し活",
    "推し活診断",
    "ファンタイプ",
    "推しへの愛し方",
    "オタ活",
  ],
  恋愛: [
    "恋愛",
    "恋愛診断",
    "相性診断",
    "恋愛タイプ",
    "彼氏彼女",
  ],
  短時間: [
    "短時間",
    "サクッと診断",
    "5分以内",
    "気軽に診断",
    "今すぐ診断",
  ],
};

const BASE_VIRAL_KEYWORDS = [
  "性格診断",
  "無料診断",
  "LibertyCanvas",
  "Rubel Canvas",
] as const;

function isKnownCreatorTag(
  tag: BuilderCreatorTag,
): tag is (typeof BUILDER_CREATOR_TAGS)[number] {
  return (BUILDER_CREATOR_TAGS as readonly string[]).includes(tag);
}

/**
 * Injects localized high-impression SEO keywords from creator-selected tags.
 */
export function buildBuilderOgKeywords(
  creatorTags: readonly BuilderCreatorTag[],
  baseKeywords: readonly string[] = [],
): readonly string[] {
  const keywords = new Set<string>([...BASE_VIRAL_KEYWORDS, ...baseKeywords]);

  for (const tag of creatorTags) {
    keywords.add(tag);

    if (isKnownCreatorTag(tag)) {
      for (const keyword of TAG_VIRAL_KEYWORDS[tag]) {
        keywords.add(keyword);
      }
    }
  }

  return Object.freeze([...keywords]);
}

export function buildBuilderOgTitle(
  title: string,
  creatorTags: readonly BuilderCreatorTag[],
): string {
  const tagSnippet = creatorTags
    .filter(isKnownCreatorTag)
    .slice(0, 2)
    .join("・");

  if (!tagSnippet) {
    return title;
  }

  return `${title} — ${tagSnippet} | Rubel Canvas`;
}

export function buildBuilderOgDescription(
  description: string,
  creatorTags: readonly BuilderCreatorTag[],
  estimatedMinutes: number,
): string {
  const tagSnippet = creatorTags.slice(0, 3).join("・");
  const durationHint = estimatedMinutes <= 5 ? "短時間" : `${estimatedMinutes}分`;

  const prefix = tagSnippet ? `【${tagSnippet}】` : "";

  return `${prefix}${description} ${durationHint}で結果がわかる無料診断。`;
}

export function buildBuilderOgImageUrl(slug: string): string {
  return `/api/og/diagnosis?slug=${encodeURIComponent(slug)}`;
}
