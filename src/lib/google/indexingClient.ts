import { GoogleAuth } from "google-auth-library";

const INDEXING_SCOPE = "https://www.googleapis.com/auth/indexing";
const INDEXING_ENDPOINT =
  "https://indexing.googleapis.com/v3/urlNotifications:publish";

export type IndexingNotificationType = "URL_UPDATED" | "URL_DELETED";

export interface IndexingRequestPayload {
  url: string;
  type: IndexingNotificationType;
}

export interface IndexingResult {
  ok: boolean;
  status: number;
  body?: unknown;
  error?: string;
  retryable: boolean;
}

function getServiceAccountCredentials(): Record<string, unknown> | null {
  const inlineJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (inlineJson) {
    return JSON.parse(inlineJson) as Record<string, unknown>;
  }

  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!keyPath) {
    return null;
  }

  return { keyFile: keyPath };
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

async function getAccessToken(): Promise<string> {
  const credentials = getServiceAccountCredentials();

  if (!credentials) {
    throw new Error(
      "Google service account credentials are not configured on the server",
    );
  }

  const auth = new GoogleAuth({
    credentials: "keyFile" in credentials ? undefined : credentials,
    keyFile:
      "keyFile" in credentials ? (credentials.keyFile as string) : undefined,
    scopes: [INDEXING_SCOPE],
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();

  if (!tokenResponse.token) {
    throw new Error("Failed to obtain Google access token");
  }

  return tokenResponse.token;
}

export async function publishUrlToGoogleIndexing(
  payload: IndexingRequestPayload,
): Promise<IndexingResult> {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(INDEXING_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const bodyText = await response.text();
    let body: unknown = bodyText;

    try {
      body = JSON.parse(bodyText);
    } catch {
      // Keep raw text when Google returns non-JSON payloads.
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        body,
        error:
          typeof body === "object" &&
          body !== null &&
          "error" in body &&
          typeof (body as { error?: { message?: string } }).error?.message ===
            "string"
            ? (body as { error: { message: string } }).error.message
            : `Google Indexing API responded with ${response.status}`,
        retryable: isRetryableStatus(response.status),
      };
    }

    return {
      ok: true,
      status: response.status,
      body,
      retryable: false,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : "Unknown indexing error",
      retryable: true,
    };
  }
}

import { buildQuizPageUrl } from "@/lib/site/url";

export function buildQuizPublicUrl(quizId: string): string {
  return buildQuizPageUrl(quizId);
}
