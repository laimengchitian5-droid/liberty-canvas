"use client";

import { useUserStore } from "@/store/userStore";

/** Persists profile ID and boots the cached fetchUserData loop without reload. */
export async function commitUserIdentityAfterFormSuccess(
  userId: string,
): Promise<void> {
  await useUserStore.getState().commitStoredIdentity(userId);
}
