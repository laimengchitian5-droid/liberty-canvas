import {
  createEmptyAcademicVector,
  freezeAcademicVector,
  LEGAL_TRAIT_KEYS,
  normalizeAcademicVector,
  resolveDominantTraits,
  type AcademicTraitVector,
  type LegalTraitKey,
} from "@/lib/diagnosis/academicTraitVector";
import {
  extractQuestionBlocks,
  extractResultBlock,
  extractSeoBlock,
  extractViralPresets,
} from "@/lib/diagnosis/extractDiagnosisElements";
import { COMPILER_ERROR_MESSAGES } from "@/lib/diagnosis/compilerMessages";
import type {
  CompilerAnswer,
  LegallySafeDiagnosisOutcome,
  PlugDiagnosisDefinition,
  QuestionBlock,
  ResultArchetype,
  TraitWeightMap,
} from "@/types/diagnosisCompiler";

function addTraitWeights(
  scores: Record<LegalTraitKey, number>,
  weights: TraitWeightMap,
  multiplier = 1,
): void {
  for (const [traitId, value] of Object.entries(weights)) {
    if (!LEGAL_TRAIT_KEYS.includes(traitId as LegalTraitKey)) {
      continue;
    }

    const key = traitId as LegalTraitKey;
    scores[key] += value * multiplier;
  }
}

function traitDistance(
  scores: Record<LegalTraitKey, number>,
  profile: TraitWeightMap,
): number {
  let sum = 0;

  for (const key of LEGAL_TRAIT_KEYS) {
    const target = profile[key] ?? 0;
    const delta = scores[key] - target;
    sum += delta * delta;
  }

  return sum;
}

function resolveWinningArchetype(
  scores: Record<LegalTraitKey, number>,
  results: readonly ResultArchetype[],
): ResultArchetype {
  if (results.length === 0) {
    throw new Error(COMPILER_ERROR_MESSAGES.missingResultArchetype);
  }

  let winner = results[0]!;
  let bestDistance = traitDistance(scores, winner.traitProfile);

  for (let index = 1; index < results.length; index += 1) {
    const candidate = results[index]!;
    const distance = traitDistance(scores, candidate.traitProfile);

    if (distance < bestDistance) {
      bestDistance = distance;
      winner = candidate;
    }
  }

  return winner;
}

function scoreQuestionBlock(
  block: QuestionBlock,
  answer: CompilerAnswer | undefined,
  scores: Record<LegalTraitKey, number>,
): void {
  if (!answer) {
    return;
  }

  if (block.inputType === "multiple_choice" && answer.optionId) {
    const option = block.options?.find((entry) => entry.id === answer.optionId);

    if (option) {
      addTraitWeights(scores, option.traitWeights);
    }

    return;
  }

  if (block.inputType === "slider" && block.slider && answer.sliderValue !== undefined) {
    const normalized =
      (answer.sliderValue - block.slider.min) /
      Math.max(1, block.slider.max - block.slider.min);

    addTraitWeights(scores, block.slider.traitCurve, normalized);
    return;
  }

  if (block.inputType === "text" && block.textInput && answer.textValue?.trim()) {
    addTraitWeights(scores, block.textInput.traitBonus);
  }
}

const SYNTHESIS_FRAGMENTS: Readonly<
  Record<LegalTraitKey, readonly string[]>
> = {
  trait_openness: [
    "新しい刺激に心が動く、探究心あふれる傾向があります。",
    "発想の幅が広く、独自の視点を大切にするタイプです。",
  ],
  trait_conscientiousness: [
    "丁寧に積み重ねる力が強く、信頼される安定感があります。",
    "計画性と誠実さが、あなたの魅力を支えています。",
  ],
  trait_extraversion: [
    "人との距離を自然に縮め、場に明るさを届けやすいタイプです。",
    "社交的なエネルギーが、関係を活性化させます。",
  ],
  trait_agreeableness: [
    "相手の気持ちを尊重し、やさしいつながりを育てやすい傾向です。",
    "協調性の高さが、あなたの人間関係をあたたかくします。",
  ],
  trait_neuroticism: [
    "感受性が豊かで、感情の機微に気づける繊細さがあります。",
    "繊細な心が、深い共感と洞察につながります。",
  ],
  trait_empathy: [
    "相手の立場に寄り添う力が自然と育っています。",
    "共感力が、あなたらしいつながり方の核になっています。",
  ],
};

function synthesizeProprietaryCopy(
  base: ResultArchetype,
  vector: AcademicTraitVector,
): ResultArchetype {
  const dominant = resolveDominantTraits(vector, 2);
  const fragments = dominant.map((traitKey, index) => {
    const options = SYNTHESIS_FRAGMENTS[traitKey];
    return options[index % options.length] ?? options[0]!;
  });

  return {
    ...base,
    analysis: `${base.analysis} ${fragments.join("")}`,
  };
}

/**
 * Maps raw answers → public-domain academic trait vector → LibertyCanvas proprietary archetype.
 * Zero dependency on trademarked personality test taxonomies.
 */
export function compileLegallySafeResult(
  definition: PlugDiagnosisDefinition,
  answers: readonly CompilerAnswer[],
): LegallySafeDiagnosisOutcome {
  const questionBlocks = extractQuestionBlocks(definition);
  const resultBlock = extractResultBlock(definition);
  const seoBlock = extractSeoBlock(definition);
  const answerMap = new Map(answers.map((entry) => [entry.blockId, entry]));
  const rawScores = createEmptyAcademicVector();

  for (const block of questionBlocks) {
    scoreQuestionBlock(block, answerMap.get(block.id), rawScores);
  }

  const academicVector = normalizeAcademicVector(rawScores);
  const baseArchetype = resolveWinningArchetype(rawScores, resultBlock?.results ?? []);
  const winningArchetype = synthesizeProprietaryCopy(baseArchetype, academicVector);
  const dominantTraits = resolveDominantTraits(academicVector, 2);
  const answeredCount = questionBlocks.filter((block) => answerMap.has(block.id)).length;

  return {
    diagnosisId: definition.id,
    academicVector: freezeAcademicVector({ ...academicVector }),
    traitScores: freezeAcademicVector({ ...academicVector }),
    winningArchetype,
    dominantTraits,
    resultLayout: resultBlock?.layout ?? "character_archetype_card",
    viralPresets: extractViralPresets(definition),
    seoTags: seoBlock
      ? [...seoBlock.desireTags, ...seoBlock.targetDemographics]
      : [],
    isComplete: answeredCount >= questionBlocks.length,
    answeredCount,
    totalQuestions: questionBlocks.length,
  };
}
