import { describe, expect, it } from "vitest";
import { getLandingCopy } from "@/lib/landing/landingCopy";
import { LANDING_LOCALES } from "@/lib/landing/landingLocales";

const TRADEMARK_PATTERN =
  /MBTI|INFP|Enneagram|Enneagramm|Énéagramme|16Personalities|16personalities|エニアグラム|九型人格|에니어그램/i;

const LEGAL_SHIELD_SLUGS = [
  "enneagram-nine-types",
  "sixteen-personalities",
  "mbti-personality-types",
] as const;

function flattenCopyText(copy: ReturnType<typeof getLandingCopy>): string {
  return [
    copy.keyword,
    copy.title,
    copy.headline,
    copy.subhead,
    copy.metaDescription,
    ...copy.keywords,
    copy.schemaName,
    copy.schemaDescription,
    ...copy.faq.flatMap((item) => [item.question, item.answer]),
  ].join("\n");
}

describe("legalSafeLandingCopy", () => {
  it("overrides GSC landing slugs without trademark terms in public copy", () => {
    for (const slug of LEGAL_SHIELD_SLUGS) {
      for (const locale of LANDING_LOCALES) {
        const copy = getLandingCopy(slug, locale);
        expect(flattenCopyText(copy)).not.toMatch(TRADEMARK_PATTERN);
      }
    }
  });
});
