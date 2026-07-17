import type {
  KraepelinAttemptMetric,
  KraepelinFocusPattern,
  KraepelinPerformanceMatrix,
  KraepelinTimeSliceMetric,
  ScoringResult,
} from "@/types/platform";

const TEST_DURATION_MS = 60_000;
const SLICE_COUNT = 6;

function median(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

function coefficientOfVariation(values: number[]): number {
  if (values.length <= 1) {
    return 0;
  }

  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;

  if (mean === 0) {
    return 0;
  }

  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;

  return (Math.sqrt(variance) / mean) * 100;
}

function buildTimeSlices(
  attempts: KraepelinAttemptMetric[],
  durationMs: number,
): KraepelinTimeSliceMetric[] {
  const sliceDuration = durationMs / SLICE_COUNT;

  return Array.from({ length: SLICE_COUNT }, (_, sliceIndex) => {
    const startMs = sliceIndex * sliceDuration;
    const endMs = startMs + sliceDuration;
    const sliceAttempts = attempts.filter(
      (attempt) => attempt.elapsedMs >= startMs && attempt.elapsedMs < endMs,
    );
    const correct = sliceAttempts.filter((attempt) => attempt.isCorrect).length;
    const attempted = sliceAttempts.length;
    const accuracy = attempted === 0 ? 0 : (correct / attempted) * 100;

    return {
      sliceIndex,
      startMs,
      endMs,
      attempted,
      correct,
      accuracy,
      medianReactionMs: median(sliceAttempts.map((attempt) => attempt.reactionMs)),
    };
  });
}

function deriveFocusPattern(params: {
  fatigueIndex: number;
  consistencyIndex: number;
  timeSlices: KraepelinTimeSliceMetric[];
}): KraepelinFocusPattern {
  const { fatigueIndex, consistencyIndex, timeSlices } = params;

  if (fatigueIndex >= 35) {
    return "easily_fatigued";
  }

  if (consistencyIndex >= 45) {
    return "fluctuating";
  }

  const populatedSlices = timeSlices.filter((slice) => slice.attempted >= 3);

  if (populatedSlices.length >= 2) {
    const accuracies = populatedSlices.map((slice) => slice.accuracy);
    const accuracySpread = Math.max(...accuracies) - Math.min(...accuracies);

    if (accuracySpread >= 30) {
      return "fluctuating";
    }
  }

  return "highly_consistent";
}

function focusPatternLabel(pattern: KraepelinFocusPattern): string {
  switch (pattern) {
    case "highly_consistent":
      return "Highly Consistent Performer";
    case "fluctuating":
      return "Fluctuating Focus Profile";
    case "easily_fatigued":
      return "Fatigue-Sensitive Profile";
  }
}

export function buildKraepelinPerformanceMatrix(params: {
  testId: string;
  startedAt: number;
  completedAt: number;
  attempts: KraepelinAttemptMetric[];
}): KraepelinPerformanceMatrix {
  const durationMs = TEST_DURATION_MS;
  const totalAttempted = params.attempts.length;
  const totalCorrect = params.attempts.filter((attempt) => attempt.isCorrect).length;
  const overallAccuracy =
    totalAttempted === 0 ? 0 : (totalCorrect / totalAttempted) * 100;
  const reactionTimes = params.attempts.map((attempt) => attempt.reactionMs);
  const overallMedianReactionMs = median(reactionTimes);
  const timeSlices = buildTimeSlices(params.attempts, durationMs);

  const firstHalf = params.attempts.filter(
    (attempt) => attempt.elapsedMs < durationMs / 2,
  );
  const secondHalf = params.attempts.filter(
    (attempt) => attempt.elapsedMs >= durationMs / 2,
  );

  const firstHalfAccuracy =
    firstHalf.length === 0
      ? 0
      : (firstHalf.filter((attempt) => attempt.isCorrect).length / firstHalf.length) *
        100;
  const secondHalfAccuracy =
    secondHalf.length === 0
      ? 0
      : (secondHalf.filter((attempt) => attempt.isCorrect).length / secondHalf.length) *
        100;

  const firstHalfMedian = median(firstHalf.map((attempt) => attempt.reactionMs));
  const secondHalfMedian = median(secondHalf.map((attempt) => attempt.reactionMs));

  const accuracyDrop = Math.max(0, firstHalfAccuracy - secondHalfAccuracy);
  const speedDrop =
    firstHalfMedian > 0
      ? Math.max(0, ((secondHalfMedian - firstHalfMedian) / firstHalfMedian) * 100)
      : 0;

  const fatigueIndex = Math.min(100, accuracyDrop * 0.65 + speedDrop * 0.35);
  const consistencyIndex = Math.min(100, coefficientOfVariation(reactionTimes));
  const focusPattern = deriveFocusPattern({
    fatigueIndex,
    consistencyIndex,
    timeSlices,
  });

  return {
    testId: params.testId,
    durationMs,
    startedAt: params.startedAt,
    completedAt: params.completedAt,
    totalAttempted,
    totalCorrect,
    overallAccuracy,
    overallMedianReactionMs,
    fatigueIndex,
    consistencyIndex,
    focusPattern,
    attempts: params.attempts,
    timeSlices,
  };
}

export function kraepelinMatrixToScoringResult(
  matrix: KraepelinPerformanceMatrix,
): ScoringResult {
  const speedScore = Math.max(
    0,
    Math.min(100, 100 - matrix.overallMedianReactionMs / 20),
  );
  const accuracyScore = matrix.overallAccuracy;
  const consistencyScore = Math.max(0, 100 - matrix.consistencyIndex);
  const enduranceScore = Math.max(0, 100 - matrix.fatigueIndex);

  return {
    testId: matrix.testId,
    archetype: focusPatternLabel(matrix.focusPattern),
    scores: {
      accuracy: Number(accuracyScore.toFixed(1)),
      speed: Number(speedScore.toFixed(1)),
      fatigue: Number(matrix.fatigueIndex.toFixed(1)),
      consistency: Number(consistencyScore.toFixed(1)),
      endurance: Number(enduranceScore.toFixed(1)),
    },
    radarData: [
      { name: "Accuracy", value: Number(accuracyScore.toFixed(1)) },
      { name: "Speed", value: Number(speedScore.toFixed(1)) },
      { name: "Consistency", value: Number(consistencyScore.toFixed(1)) },
      { name: "Endurance", value: Number(enduranceScore.toFixed(1)) },
    ],
    isReliable: matrix.totalAttempted >= 12 && matrix.overallAccuracy >= 40,
  };
}

export const KRAEPELIN_TEST_DURATION_MS = TEST_DURATION_MS;
