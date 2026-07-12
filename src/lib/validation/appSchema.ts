import { z } from "zod";
import { DEFAULT_APP_TYPE, TestType } from "@/types/platform";

const NO_URL_PATTERN = /https?:\/\/|www\./i;
const NO_SCRIPT_PATTERN = /<\s*script|javascript:|on\w+\s*=/i;

function sanitizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

const safeText = (field: string, maxLength: number) =>
  z
    .string()
    .trim()
    .min(1, `${field} is required`)
    .max(maxLength, `${field} must be at most ${maxLength} characters`)
    .refine((value) => !NO_URL_PATTERN.test(value), {
      message: `${field} must not contain URLs`,
    })
    .refine((value) => !NO_SCRIPT_PATTERN.test(value), {
      message: `${field} contains disallowed content`,
    })
    .transform(sanitizeText);

export const quizQuestionSchema = z.object({
  id: z.string().min(1, "Question id is required").max(64),
  text: safeText("Question text", 500),
  type: z.nativeEnum(TestType, {
    errorMap: () => ({ message: "Question type must be a valid TestType" }),
  }),
  dimension: safeText("Dimension", 100),
  weight: z
    .number()
    .min(0.1, "Weight must be at least 0.1")
    .max(10, "Weight must be at most 10"),
});

export const resultsMappingSchema = z
  .object({
    archetype: safeText("Archetype", 100),
    minScore: z.number().min(0).max(1000),
    maxScore: z.number().min(0).max(1000),
    description: safeText("Result description", 1000),
  })
  .refine((value) => value.minScore <= value.maxScore, {
    message: "minScore must be less than or equal to maxScore",
    path: ["minScore"],
  });

function rangesOverlap(
  left: { minScore: number; maxScore: number },
  right: { minScore: number; maxScore: number },
): boolean {
  return left.minScore <= right.maxScore && right.minScore <= left.maxScore;
}

function refineAssessmentPayload(
  value: {
    questions: z.infer<typeof quizQuestionSchema>[];
    resultsMapping: z.infer<typeof resultsMappingSchema>[];
  },
  context: z.RefinementCtx,
): void {
  const questionIds = new Set<string>();

  value.questions.forEach((question, index) => {
    if (questionIds.has(question.id)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate question id: ${question.id}`,
        path: ["questions", index, "id"],
      });
    }
    questionIds.add(question.id);
  });

  const archetypes = new Set<string>();

  value.resultsMapping.forEach((mapping, index) => {
    if (archetypes.has(mapping.archetype)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate archetype: ${mapping.archetype}`,
        path: ["resultsMapping", index, "archetype"],
      });
    }
    archetypes.add(mapping.archetype);
  });

  for (let i = 0; i < value.resultsMapping.length; i += 1) {
    for (let j = i + 1; j < value.resultsMapping.length; j += 1) {
      if (rangesOverlap(value.resultsMapping[i], value.resultsMapping[j])) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Overlapping score ranges between "${value.resultsMapping[i].archetype}" and "${value.resultsMapping[j].archetype}"`,
          path: ["resultsMapping", j, "minScore"],
        });
      }
    }
  }
}

const authorIdSchema = z
  .string()
  .trim()
  .min(1, "authorId is required")
  .max(128, "authorId must be at most 128 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "authorId contains invalid characters");

const baseAppFields = {
  title: safeText("Title", 120),
  description: safeText("Description", 500),
  authorId: authorIdSchema,
};

const assessmentAppSchema = z
  .object({
    ...baseAppFields,
    appType: z.literal("assessment"),
    questions: z
      .array(quizQuestionSchema)
      .min(3, "At least 3 questions are required")
      .max(30, "At most 30 questions are allowed"),
    resultsMapping: z
      .array(resultsMappingSchema)
      .min(2, "At least 2 result mappings are required")
      .max(20, "At most 20 result mappings are allowed"),
  })
  .superRefine(refineAssessmentPayload);

const aiAgentAppSchema = z.object({
  ...baseAppFields,
  appType: z.literal("ai_agent"),
  systemPromptOverride: safeText("System prompt", 4000),
  responseGuidelines: safeText("Response guidelines", 2000),
});

const interactiveMediaAppSchema = z.object({
  ...baseAppFields,
  appType: z.literal("interactive_media"),
});

const customToolAppSchema = z.object({
  ...baseAppFields,
  appType: z.literal("custom_tool"),
});

export const createUniversalAppSchema = z.union([
  assessmentAppSchema,
  aiAgentAppSchema,
  interactiveMediaAppSchema,
  customToolAppSchema,
]);

export const createCustomQuizSchema = z
  .object({
    title: baseAppFields.title,
    description: baseAppFields.description,
    authorId: authorIdSchema,
    appType: z
      .enum(["assessment", "ai_agent", "interactive_media", "custom_tool"])
      .optional()
      .default(DEFAULT_APP_TYPE),
    questions: z
      .array(quizQuestionSchema)
      .min(3, "At least 3 questions are required")
      .max(30, "At most 30 questions are allowed"),
    resultsMapping: z
      .array(resultsMappingSchema)
      .min(2, "At least 2 result mappings are required")
      .max(20, "At most 20 result mappings are allowed"),
  })
  .superRefine(refineAssessmentPayload);

export type CreateUniversalAppPayload = z.infer<typeof createUniversalAppSchema>;
export type CreateCustomQuizPayload = z.infer<typeof createCustomQuizSchema>;
