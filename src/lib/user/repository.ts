import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { listApps } from "@/lib/apps/repository";
import { deriveCreatorInitials } from "@/lib/rubel/creatorDisplay";
import { USER_DATA_REQUEST } from "@/lib/user/constants";
import {
  USER_DATA_SCHEMA_VERSION,
  type UserData,
} from "@/types/user";

function deriveDisplayName(userId: string): string {
  if (userId === "guest_user") {
    return "ゲストユーザー";
  }

  return userId
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function pickMemberSince(isoDates: readonly string[]): string {
  if (isoDates.length === 0) {
    return new Date(0).toISOString();
  }

  let earliest = isoDates[0]!;

  for (let index = 1; index < isoDates.length; index += 1) {
    const candidate = isoDates[index]!;

    if (Date.parse(candidate) < Date.parse(earliest)) {
      earliest = candidate;
    }
  }

  return earliest;
}

function pickLastActive(isoDates: readonly string[]): string | null {
  if (isoDates.length === 0) {
    return null;
  }

  let latest = isoDates[0]!;

  for (let index = 1; index < isoDates.length; index += 1) {
    const candidate = isoDates[index]!;

    if (Date.parse(candidate) > Date.parse(latest)) {
      latest = candidate;
    }
  }

  return latest;
}

export async function resolveUserData(userId: string): Promise<UserData> {
  const apps = await listApps();
  const authored = apps.filter((app) => app.authorId === userId);
  const displayName = deriveDisplayName(userId);
  const timestamps = authored.flatMap((app) => [app.createdAt, app.updatedAt]);

  const recentAppIds = authored
    .slice(0, USER_DATA_REQUEST.maxRecentApps)
    .map((app) => app.id);

  const fetchedAt = new Date().toISOString();

  return {
    profile: {
      userId,
      displayName,
      avatarInitials: deriveCreatorInitials(displayName),
      locale: DEFAULT_LOCALE,
      memberSince: pickMemberSince(authored.map((app) => app.createdAt)),
    },
    activity: {
      appsAuthored: authored.length,
      recentAppIds,
      lastActiveAt: pickLastActive(timestamps),
    },
    preferences: {
      activePersona: "neutral-assistant",
      localePreference: DEFAULT_LOCALE,
    },
    fetchedAt,
    schemaVersion: USER_DATA_SCHEMA_VERSION,
  };
}
