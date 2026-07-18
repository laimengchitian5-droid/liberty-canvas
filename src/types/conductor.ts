import { z } from "zod";

/**
 * Conductor API contracts — Zod at every boundary.
 *
 * Sketch map (do NOT ship the bare interface):
 * - `expressLineSlug: string` → {@link CONDUCTOR_EXPRESS_SLUGS} enum
 * - `acknowledge` / `teaser` unbounded → Zod max lengths
 * - missing fields → `expressLineName` · `ctaLabel` · `source`
 *
 * Rejected sketch defects (do not reintroduce):
 * - bare `interface ConductorResponse` without Zod (no runtime guard)
 * - bare `locale: string` / open `expressLineSlug: string` on the wire
 * - dropping `expressLineName` · `ctaLabel` · `source`
 * - rejecting legacy `answer` alias before one-release migrate completes
 */

/** Liberty Plug play slugs — conductor never invents licensed 16-type IDs. */
export const CONDUCTOR_EXPRESS_SLUGS = [
  "personality-spectrum",
  "big-five",
  "motivation-spectrum",
  "oshikatsu",
  "romance",
  "genz",
] as const;

export type ConductorExpressSlug = (typeof CONDUCTOR_EXPRESS_SLUGS)[number];

const CONDUCTOR_EXPRESS_SLUG_SET: ReadonlySet<string> = new Set(
  CONDUCTOR_EXPRESS_SLUGS,
);

export function isConductorExpressSlug(
  value: string,
): value is ConductorExpressSlug {
  return CONDUCTOR_EXPRESS_SLUG_SET.has(value);
}

/**
 * Client → API request guard.
 * Accepts `userAnswer` (canonical) and legacy `answer` for one release.
 */
export const ConductorRequestSchema = z
  .object({
    locale: z.string().trim().min(2).max(12),
    userAnswer: z.string().trim().min(1).max(500).optional(),
    answer: z.string().trim().min(1).max(500).optional(),
  })
  .transform((raw, ctx) => {
    const userAnswer = (raw.userAnswer ?? raw.answer ?? "").trim();
    if (!userAnswer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "userAnswer is required",
        path: ["userAnswer"],
      });
      return z.NEVER;
    }

    return {
      locale: raw.locale,
      userAnswer,
    };
  });

export type ConductorRequest = z.infer<typeof ConductorRequestSchema>;

/** AI prose only — routing slug is never trusted from the model. */
export const ConductorAiResponseSchema = z.object({
  acknowledge: z.string().trim().min(1).max(280),
  teaser: z.string().trim().min(1).max(320),
});

export type ConductorAiResponse = z.infer<typeof ConductorAiResponseSchema>;

export const ConductorResponseSchema = ConductorAiResponseSchema.extend({
  expressLineSlug: z.enum(CONDUCTOR_EXPRESS_SLUGS),
  expressLineName: z.string().trim().min(1).max(120),
  ctaHref: z.string().trim().min(1).max(240),
  ctaLabel: z.string().trim().min(1).max(120),
  source: z.enum(["model", "fallback"]),
});

export type ConductorResponse = z.infer<typeof ConductorResponseSchema>;

/** @deprecated Prefer {@link ConductorRequestSchema} */
export const conductorRequestSchema = ConductorRequestSchema;
/** @deprecated Prefer {@link ConductorAiResponseSchema} */
export const conductorTeaserSchema = ConductorAiResponseSchema;
/** @deprecated Prefer {@link ConductorResponse} */
export type ConductorTeaserResponse = ConductorResponse;
