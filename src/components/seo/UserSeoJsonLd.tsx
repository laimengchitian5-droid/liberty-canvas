import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth/edgeSession";
import { DEFAULT_GUEST_USER_ID } from "@/lib/user/constants";
import { buildUserSeoPayload } from "@/lib/user/buildUserSeoPayload";
import { resolveUserData } from "@/lib/user/repository";
import { LC_SESSION_COOKIE } from "@/lib/auth/constants";

export async function UserSeoJsonLd() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(LC_SESSION_COOKIE)?.value ?? null;
  const session = await verifySessionToken(sessionToken);
  const userId = session?.userId ?? DEFAULT_GUEST_USER_ID;

  const userData = await resolveUserData(userId);
  const payload = buildUserSeoPayload(userData, userData.profile.locale);
  const jsonLdDocument = {
    "@context": "https://schema.org",
    "@graph": payload.jsonLd,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDocument) }}
    />
  );
}
