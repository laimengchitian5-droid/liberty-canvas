export function formatSubmissionCount(total: number): string {
  if (total >= 1000) {
    return `${(total / 1000).toFixed(total >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`;
  }

  return String(total);
}
