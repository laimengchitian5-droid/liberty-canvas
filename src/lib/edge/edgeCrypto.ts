import {
  emptyUserGameProfile,
  userGameProfileSchema,
  type UserProfile,
} from "@/lib/gamification/userGameProfileSchema";

const ALGORITHM = "AES-GCM" as const;
const IV_BYTES = 12;
const MIN_SECRET_LENGTH = 16;

/**
 * Derive a 256-bit AES key via SHA-256(secret).
 * Stronger than padEnd("0") truncation — uniform 32-byte material.
 */
async function deriveAesGcmKey(secretKeyString: string): Promise<CryptoKey> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(secretKeyString),
  );

  return crypto.subtle.importKey(
    "raw",
    digest,
    { name: ALGORITHM },
    false,
    ["encrypt", "decrypt"],
  );
}

function assertSecretStrength(secretKeyString: string): void {
  if (!secretKeyString || secretKeyString.trim().length < MIN_SECRET_LENGTH) {
    throw new Error(
      "[Fatal Security Error] Encryption secret must be at least 16 characters.",
    );
  }
}

/** Chunked base64url — avoids stack overflow from String.fromCharCode(...huge). */
export function bytesToBase64Url(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64url");
  }

  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const slice = bytes.subarray(offset, offset + chunkSize);
    binary += String.fromCharCode(...slice);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function base64UrlToBytes(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(padded, "base64"));
  }

  const binary = atob(padded);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

export async function encryptProfile(
  profile: UserProfile,
  secretKeyString: string,
): Promise<string> {
  assertSecretStrength(secretKeyString);
  const parsed = userGameProfileSchema.parse(profile);
  const key = await deriveAesGcmKey(secretKeyString);
  const encodedData = new TextEncoder().encode(JSON.stringify(parsed));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encodedData,
  );

  const cipher = new Uint8Array(encryptedBuffer);
  const combined = new Uint8Array(iv.length + cipher.length);
  combined.set(iv, 0);
  combined.set(cipher, iv.length);

  return bytesToBase64Url(combined);
}

/**
 * Decrypt + Zod validate. Fail-closed → empty profile (never throw to callers).
 */
export async function decryptProfile(
  encryptedBase64Url: string,
  secretKeyString: string,
): Promise<UserProfile> {
  try {
    assertSecretStrength(secretKeyString);

    if (!encryptedBase64Url || encryptedBase64Url.length > 8192) {
      return emptyUserGameProfile();
    }

    const key = await deriveAesGcmKey(secretKeyString);
    const combined = base64UrlToBytes(encryptedBase64Url);

    if (combined.length <= IV_BYTES) {
      return emptyUserGameProfile();
    }

    // Copy into owned ArrayBuffers — satisfies BufferSource under TS 5.x DOM libs.
    const iv = new Uint8Array(combined.subarray(0, IV_BYTES));
    const encryptedData = new Uint8Array(combined.subarray(IV_BYTES));

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      encryptedData,
    );

    const rawJson: unknown = JSON.parse(new TextDecoder().decode(decryptedBuffer));
    const parsed = userGameProfileSchema.safeParse(rawJson);
    return parsed.success ? parsed.data : emptyUserGameProfile();
  } catch (error) {
    console.error(
      "[edge-crypto] decrypt/parse failed — returning empty profile:",
      error,
    );
    return emptyUserGameProfile();
  }
}

/** Sketch-compatible facade (no mutable instance state beyond secret). */
export class EdgeCryptoManager {
  constructor(private readonly secretKeyString: string) {
    assertSecretStrength(secretKeyString);
  }

  encryptProfile(profile: UserProfile): Promise<string> {
    return encryptProfile(profile, this.secretKeyString);
  }

  decryptProfile(encryptedBase64: string): Promise<UserProfile> {
    return decryptProfile(encryptedBase64, this.secretKeyString);
  }
}
