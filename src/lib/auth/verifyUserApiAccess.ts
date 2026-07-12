import { AUTH_HTTP, PUBLIC_USER_IDS } from "@/lib/auth/constants";
import { verifySessionToken, readSessionCookie } from "@/lib/auth/edgeSession";
import { USER_ID_PATTERN } from "@/lib/user/constants";

export type UserApiAccessDecision =
  | { allowed: true; userId: string; sessionUserId: string | null }
  | { allowed: false; status: number; message: string };

export async function verifyUserApiAccess(
  requestedUserId: string,
  cookieHeader: string | null | undefined,
): Promise<UserApiAccessDecision> {
  if (!USER_ID_PATTERN.test(requestedUserId)) {
    return {
      allowed: false,
      status: 422,
      message: "Invalid userId",
    };
  }

  const isPublicProfile = (PUBLIC_USER_IDS as readonly string[]).includes(
    requestedUserId,
  );

  if (isPublicProfile) {
    const session = await verifySessionToken(readSessionCookie(cookieHeader));
    return {
      allowed: true,
      userId: requestedUserId,
      sessionUserId: session?.userId ?? null,
    };
  }

  const session = await verifySessionToken(readSessionCookie(cookieHeader));

  if (!session) {
    return {
      allowed: false,
      status: AUTH_HTTP.unauthorized,
      message: "Authentication required",
    };
  }

  if (session.userId !== requestedUserId) {
    return {
      allowed: false,
      status: AUTH_HTTP.forbidden,
      message: "Forbidden: session user mismatch",
    };
  }

  return {
    allowed: true,
    userId: requestedUserId,
    sessionUserId: session.userId,
  };
}
