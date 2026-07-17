import { DEFAULT_GUEST_USER_ID, USER_ID_PATTERN } from "@/lib/user/constants";

export const LC_USER_ID_STORAGE_KEY = "lc-user-id-v1" as const;

export function readStoredUserId(): string {
  if (typeof window === "undefined") {
    return DEFAULT_GUEST_USER_ID;
  }

  try {
    const raw = window.localStorage.getItem(LC_USER_ID_STORAGE_KEY)?.trim();

    if (raw && USER_ID_PATTERN.test(raw)) {
      return raw;
    }
  } catch {
    return DEFAULT_GUEST_USER_ID;
  }

  return DEFAULT_GUEST_USER_ID;
}

export function writeStoredUserId(userId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!USER_ID_PATTERN.test(userId)) {
    return;
  }

  window.localStorage.setItem(LC_USER_ID_STORAGE_KEY, userId);
}
