export function deriveCreatorInitials(creatorName: string): string {
  const cleaned = creatorName.replace(/^@/, "").trim();

  if (!cleaned) {
    return "RC";
  }

  const parts = cleaned.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }

  return cleaned.slice(0, 2).toUpperCase();
}

const ACCENT_PALETTE = [
  "from-violet-500 to-fuchsia-500",
  "from-cyan-500 to-blue-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-pink-500",
  "from-indigo-500 to-purple-500",
] as const;

export function deriveCreatorAccent(creatorName: string): string {
  let hash = 0;

  for (let index = 0; index < creatorName.length; index += 1) {
    hash = creatorName.charCodeAt(index) + ((hash << 5) - hash);
  }

  const paletteIndex = Math.abs(hash) % ACCENT_PALETTE.length;
  return ACCENT_PALETTE[paletteIndex] ?? ACCENT_PALETTE[0];
}

export function formatCreatorHandle(creatorName: string): string {
  const trimmed = creatorName.trim();

  if (trimmed.startsWith("@")) {
    return trimmed;
  }

  return `@${trimmed.replace(/\s+/g, "_").toLowerCase()}`;
}
