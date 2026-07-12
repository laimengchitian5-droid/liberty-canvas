import { z } from "zod";
import { validateBuilderDefinition } from "@/lib/builder/convertBuilderToPlugDefinition";
import type { BuilderDiagnosisDefinition } from "@/types/builder";

const scoringPayloadSchema = z.record(z.number());

const conversationalChoiceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  scores: scoringPayloadSchema,
});

const builderBlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("CONVERSATIONAL_QUESTION"),
    id: z.string().min(1),
    prompt: z.string().min(1),
    subPrompt: z.string().optional(),
    choices: z.array(conversationalChoiceSchema).min(1),
  }),
  z.object({
    type: z.literal("AI_INTERMEDIATE_FEEDBACK"),
    id: z.string().min(1),
    triggerAfterBlockId: z.string().min(1),
    affirmationTemplate: z.string().min(1),
    autoAdvanceMs: z.number().int().positive().optional(),
  }),
  z.object({
    type: z.literal("CONDITIONAL_BRANCH"),
    id: z.string().min(1),
    afterBlockId: z.string().min(1),
    rules: z.array(
      z.object({
        whenChoiceId: z.string().min(1),
        gotoBlockId: z.string().min(1),
      }),
    ),
    defaultGotoBlockId: z.string().min(1),
  }),
]);

export const builderDiagnosisDefinitionSchema = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9-]+$/),
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  estimatedMinutes: z.number().int().positive(),
  themeColor: z.string().min(4),
  creatorTags: z.array(z.string()).min(1),
  startBlockId: z.string().min(1),
  blocks: z.array(builderBlockSchema).min(1),
  resultConfig: z.object({
    layout: z.enum([
      "full_affirmation_chart",
      "character_archetype_card",
      "compatibility_radar",
    ]),
    results: z
      .array(
        z.object({
          id: z.string().min(1),
          title: z.string().min(1),
          subtitle: z.string().min(1),
          analysis: z.string().min(1),
          themeColor: z.string().min(4),
          traitProfile: z.record(z.number()),
          affirmationLine: z.string().optional(),
          compatibilityHint: z.string().optional(),
        }),
      )
      .min(1),
  }),
});

export const saveBuilderDiagnosisSchema = z.object({
  definition: builderDiagnosisDefinitionSchema,
  status: z.enum(["draft", "published"]),
  creatorId: z.string().min(1),
});

export function parseBuilderDiagnosisDefinition(
  value: unknown,
): BuilderDiagnosisDefinition | null {
  const parsed = builderDiagnosisDefinitionSchema.safeParse(value);

  if (!parsed.success) {
    return null;
  }

  const definition = parsed.data as BuilderDiagnosisDefinition;
  const errors = validateBuilderDefinition(definition);

  if (errors.length > 0) {
    return null;
  }

  return definition;
}

export function parseSaveBuilderPayload(
  value: unknown,
):
  | { definition: BuilderDiagnosisDefinition; status: "draft" | "published"; creatorId: string }
  | null {
  const parsed = saveBuilderDiagnosisSchema.safeParse(value);

  if (!parsed.success) {
    return null;
  }

  const definition = parseBuilderDiagnosisDefinition(parsed.data.definition);

  if (!definition) {
    return null;
  }

  return {
    definition,
    status: parsed.data.status,
    creatorId: parsed.data.creatorId,
  };
}
