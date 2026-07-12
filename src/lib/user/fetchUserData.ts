/**
 * Network orchestration layer — UI and hooks MUST call `fetchUserData`, not fetch() directly.
 *
 * Guarantees:
 * - Input + response Zod validation at the boundary
 * - Domain-specific error mapping (never swallowed)
 * - In-flight deduplication for identical keys (complete idempotency under concurrency)
 * - TTL-resolved cache for back-to-back identical reads
 * - Immutable snapshots returned to callers
 */
import {
  USER_API_BASE_PATH,
  USER_DATA_HTTP,
  USER_DATA_REQUEST,
} from "@/lib/user/constants";
import {
  UserDataAbortedError,
  UserDataHttpError,
  UserDataInputError,
  UserDataNetworkError,
  UserDataParseError,
  UserDataTimeoutError,
  UserDataValidationError,
} from "@/lib/user/errors";
import {
  fetchUserDataParamsSchema,
  userDataApiResponseSchema,
  type ValidatedUserData,
} from "@/lib/validation/userSchema";
import type { FetchUserDataOptions, UserData } from "@/types/user";

interface CacheEntry {
  expiresAt: number;
  data: UserData;
}

interface InFlightEntry {
  promise: Promise<UserData>;
  controller: AbortController;
}

const resolvedCache = new Map<string, CacheEntry>();
const inFlightRequests = new Map<string, InFlightEntry>();

function buildRequestKey(userId: string, forceRefresh: boolean): string {
  return forceRefresh ? `${userId}::refresh` : userId;
}

function buildUserEndpoint(userId: string): string {
  return `${USER_API_BASE_PATH}/${encodeURIComponent(userId)}`;
}

function readCachedEntry(key: string, now: number): UserData | null {
  const entry = resolvedCache.get(key);

  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= now) {
    resolvedCache.delete(key);
    return null;
  }

  return entry.data;
}

function writeCachedEntry(key: string, data: UserData, now: number): void {
  resolvedCache.set(key, {
    data,
    expiresAt: now + USER_DATA_REQUEST.cacheTtlMs,
  });
}

function freezeUserData(data: ValidatedUserData): UserData {
  return Object.freeze({
    ...data,
    profile: Object.freeze({ ...data.profile }),
    activity: Object.freeze({
      ...data.activity,
      recentAppIds: Object.freeze([...data.activity.recentAppIds]),
    }),
    preferences: Object.freeze({ ...data.preferences }),
  });
}

function assertNotAborted(signal: AbortSignal | undefined): void {
  if (signal?.aborted) {
    throw new UserDataAbortedError();
  }
}

function mergeAbortSignals(
  primary: AbortSignal | undefined,
  secondary: AbortSignal,
): AbortSignal {
  if (!primary) {
    return secondary;
  }

  if (primary.aborted || secondary.aborted) {
    return AbortSignal.abort(primary.reason ?? secondary.reason);
  }

  const controller = new AbortController();

  const onAbort = (): void => {
    controller.abort(primary.reason ?? secondary.reason);
  };

  primary.addEventListener("abort", onAbort, { once: true });
  secondary.addEventListener("abort", onAbort, { once: true });

  return controller.signal;
}

async function readResponseBody(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch (cause) {
    throw new UserDataNetworkError(
      "ユーザーデータ API からレスポンス本文を読み取れませんでした。",
      cause,
    );
  }
}

async function executeNetworkFetch(
  userId: string,
  signal: AbortSignal,
): Promise<UserData> {
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => {
    timeoutController.abort(
      new UserDataTimeoutError(USER_DATA_REQUEST.timeoutMs),
    );
  }, USER_DATA_REQUEST.timeoutMs);

  const mergedSignal = mergeAbortSignals(signal, timeoutController.signal);

  let response: Response;

  try {
    response = await fetch(buildUserEndpoint(userId), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "same-origin",
      cache: "no-store",
      signal: mergedSignal,
    });
  } catch (cause) {
    if (cause instanceof UserDataTimeoutError) {
      throw cause;
    }

    if (mergedSignal.aborted) {
      throw new UserDataAbortedError();
    }

    throw new UserDataNetworkError(
      "ユーザーデータ API への接続に失敗しました。",
      cause,
    );
  } finally {
    clearTimeout(timeoutId);
  }

  const rawBody = await readResponseBody(response);

  if (
    response.status < USER_DATA_HTTP.okMin ||
    response.status > USER_DATA_HTTP.okMax
  ) {
    throw new UserDataHttpError(
      response.status,
      response.statusText,
      extractApiErrorMessage(rawBody) ??
        `ユーザーデータ API が ${response.status} を返しました。`,
    );
  }

  let payload: unknown;

  try {
    payload = rawBody ? JSON.parse(rawBody) : null;
  } catch (cause) {
    throw new UserDataParseError(
      "ユーザーデータ API の JSON を解析できませんでした。",
      rawBody,
      cause,
    );
  }

  const parsed = userDataApiResponseSchema.safeParse(payload);

  if (!parsed.success) {
    throw new UserDataValidationError(
      "ユーザーデータ API のレスポンス形式が不正です。",
      parsed.error.issues,
    );
  }

  return freezeUserData(parsed.data.data);
}

function extractApiErrorMessage(rawBody: string): string | null {
  if (!rawBody.trim()) {
    return null;
  }

  try {
    const payload = JSON.parse(rawBody) as { error?: unknown };

    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }
  } catch {
    return null;
  }

  return null;
}

async function resolveUserDataRequest(
  userId: string,
  forceRefresh: boolean,
  signal: AbortSignal | undefined,
): Promise<UserData> {
  const cacheKey = buildRequestKey(userId, false);
  const now = Date.now();

  if (!forceRefresh) {
    const cached = readCachedEntry(cacheKey, now);

    if (cached) {
      return cached;
    }
  }

  const inFlightKey = buildRequestKey(userId, forceRefresh);
  const existing = inFlightRequests.get(inFlightKey);

  if (existing) {
    if (signal) {
      signal.addEventListener(
        "abort",
        () => {
          existing.controller.abort(new UserDataAbortedError());
        },
        { once: true },
      );
    }

    return existing.promise;
  }

  const controller = new AbortController();
  const mergedSignal = mergeAbortSignals(signal, controller.signal);

  const promise = executeNetworkFetch(userId, mergedSignal)
    .then((data) => {
      writeCachedEntry(cacheKey, data, Date.now());
      return data;
    })
    .finally(() => {
      inFlightRequests.delete(inFlightKey);
    });

  inFlightRequests.set(inFlightKey, { promise, controller });

  return promise;
}

/**
 * Fetches a validated, immutable user snapshot.
 *
 * Concurrent calls with the same `userId` share one in-flight request.
 * Successful responses are cached for {@link USER_DATA_REQUEST.cacheTtlMs}.
 */
export async function fetchUserData(
  userId: string,
  options: FetchUserDataOptions = {},
): Promise<UserData> {
  const parsedParams = fetchUserDataParamsSchema.safeParse({
    userId,
    forceRefresh: options.forceRefresh,
  });

  if (!parsedParams.success) {
    throw new UserDataInputError(
      parsedParams.error.issues[0]?.message ?? "userId が不正です。",
      parsedParams.error.issues,
    );
  }

  assertNotAborted(options.signal);

  return resolveUserDataRequest(
    parsedParams.data.userId,
    parsedParams.data.forceRefresh ?? false,
    options.signal,
  );
}

/** Clears resolved cache entries (primarily for tests and explicit logout flows). */
export function clearFetchUserDataCache(userId?: string): void {
  if (userId === undefined) {
    resolvedCache.clear();
    return;
  }

  resolvedCache.delete(userId);
  resolvedCache.delete(buildRequestKey(userId, true));
}

/** Returns whether a cache entry exists for the given user (test/diagnostic helper). */
export function peekFetchUserDataCache(userId: string): UserData | null {
  return readCachedEntry(userId, Date.now());
}

/** Returns count of in-flight deduplicated requests (test/diagnostic helper). */
export function getFetchUserDataInFlightCount(): number {
  return inFlightRequests.size;
}
