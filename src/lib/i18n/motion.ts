export function getSlideOffset(
  direction: number,
  isRtl: boolean,
  magnitude = 56,
): number {
  const sign = direction >= 0 ? 1 : -1;
  const rtlMultiplier = isRtl ? -1 : 1;
  return sign * magnitude * rtlMultiplier;
}

export function getHorizontalStepDelta(
  key: "forward" | "backward",
  isRtl: boolean,
): number {
  if (key === "forward") {
    return isRtl ? -1 : 1;
  }

  return isRtl ? 1 : -1;
}
