import { LC_SESSION, LC_SESSION_COOKIE } from "@/lib/auth/constants";
import { USER_ID_PATTERN } from "@/lib/user/constants";

interface SessionPayload {
  sub: string;
  exp: number;
}

function getSessionSecret(): string {
  const secret = process.env.LC_SESSION_SECRET?.trim();

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("LC_SESSION_SECRET is required in production");
  }

  return secret ?? "dev-only-lc-session-secret-change-me";
}

function encodeBase64Url(value: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }

  const bytes = new TextEncoder().encode(value);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf8");
  }

  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  const encoded = new TextEncoder().encode(secret);

  return crypto.subtle.importKey(
    "raw",
    encoded,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function signPayload(payload: SessionPayload): Promise<string> {
  const key = await importHmacKey(getSessionSecret());
  const body = encodeBase64Url(JSON.stringify(payload));
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(body),
  );
  const signature = encodeBase64Url(
    String.fromCharCode(...new Uint8Array(signatureBuffer)),
  );

  return `${body}.${signature}`;
}

async function verifySignature(token: string): Promise<SessionPayload | null> {
  const [body, signature] = token.split(".");

  if (!body || !signature) {
    return null;
  }

  const key = await importHmacKey(getSessionSecret());
  const signatureBytes = Uint8Array.from(decodeBase64Url(signature), (char) =>
    char.charCodeAt(0),
  );
  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    new TextEncoder().encode(body),
  );

  if (!isValid) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(body)) as SessionPayload;

    if (
      typeof payload.sub !== "string" ||
      !USER_ID_PATTERN.test(payload.sub) ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }

    if (payload.exp <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function createSessionToken(userId: string): Promise<string> {
  const payload: SessionPayload = {
    sub: userId,
    exp: Date.now() + LC_SESSION.maxAgeSeconds * 1000,
  };

  return signPayload(payload);
}

export async function verifySessionToken(
  token: string | null | undefined,
): Promise<{ userId: string } | null> {
  if (!token?.trim()) {
    return null;
  }

  const payload = await verifySignature(token.trim());

  if (!payload) {
    return null;
  }

  return { userId: payload.sub };
}

export function readSessionCookie(
  cookieHeader: string | null | undefined,
): string | null {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";");

  for (const entry of cookies) {
    const [rawName, ...rawValueParts] = entry.trim().split("=");
    if (rawName === LC_SESSION_COOKIE) {
      return decodeURIComponent(rawValueParts.join("="));
    }
  }

  return null;
}

export function buildSessionSetCookieHeader(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

  return [
    `${LC_SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${LC_SESSION.maxAgeSeconds}`,
    secure,
  ].join("; ");
}

export function buildSessionClearCookieHeader(): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

  return [
    `${LC_SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
    secure,
  ].join("; ");
}
