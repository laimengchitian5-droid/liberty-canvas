"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  AUTH_API_BASE_PATH,
  AUTH_SESSION_MODES,
  type AuthSessionMode,
} from "@/lib/auth/constants";
import {
  AuthNetworkError,
  AuthSessionCreateError,
  AuthSessionDestroyError,
  toAuthErrorMessage,
} from "@/lib/auth/errors";
import { mapUserDataToSeoContext } from "@/lib/user/buildUserSeoPayload";
import {
  clearFetchUserDataCache,
  fetchUserData,
  peekFetchUserDataCache,
} from "@/lib/user/fetchUserData";
import { DEFAULT_GUEST_USER_ID, USER_ERROR_CODES } from "@/lib/user/constants";
import { isUserDataError, UserDataError } from "@/lib/user/errors";
import { readStoredUserId, writeStoredUserId } from "@/lib/user/readStoredUserId";
import { createSessionResponseSchema } from "@/lib/validation/authSchema";
import type { UserData, UserSeoContext, UserSessionStatus } from "@/types/user";
import type { Locale } from "@/lib/i18n/config";
import type {
  BuilderDiagnosisDefinition,
  BuilderDiagnosisSeoContext,
} from "@/types/builder";
import { isBuilderDiagnosisDefinition } from "@/types/builder";
import type { PlugDiagnosisDefinition } from "@/types/diagnosisCompiler";
import { buildBuilderSeoContext } from "@/lib/builder/compileBuilderRuntime";
import { extractSeoBlock } from "@/lib/diagnosis/extractDiagnosisElements";
import {
  buildBuilderOgDescription,
  buildBuilderOgImageUrl,
  buildBuilderOgKeywords,
  buildBuilderOgTitle,
} from "@/lib/builder/buildBuilderOgKeywords";

export interface UserStoreState {
  userId: string;
  data: UserData | null;
  status: UserSessionStatus;
  authStatus: "idle" | "submitting" | "authenticated" | "error";
  error: UserDataError | null;
  authErrorMessage: string | null;
  seoContext: UserSeoContext | null;
  builderDiagnosisSeo: BuilderDiagnosisSeoContext | null;
  bootstrapComplete: boolean;
}

interface LoadUserDataOptions {
  forceRefresh?: boolean;
  userId?: string;
}

interface EstablishSessionOptions {
  userId: string;
  mode?: AuthSessionMode;
  displayName?: string;
}

interface UserStoreActions {
  bootstrap: () => Promise<void>;
  loadUserData: (options?: LoadUserDataOptions) => Promise<void>;
  establishSession: (options: EstablishSessionOptions) => Promise<void>;
  commitStoredIdentity: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
  setLocaleOverride: (locale: Locale | null) => void;
  setBuilderDiagnosisSeo: (context: BuilderDiagnosisSeoContext | null) => void;
  hydrateBuilderSeoFromDefinition: (
    definition: PlugDiagnosisDefinition | BuilderDiagnosisDefinition,
  ) => void;
}

export type UserStore = UserStoreState & UserStoreActions;

const sessionEstablishInFlight = new Map<string, Promise<void>>();
const identityCommitInFlight = new Map<string, Promise<void>>();
const bootstrapInFlight = { current: null as Promise<void> | null };

let localeOverride: Locale | null = null;

function buildPlugSeoContextFromDefinition(
  definition: PlugDiagnosisDefinition,
): BuilderDiagnosisSeoContext {
  const seoBlock = extractSeoBlock(definition);
  const landingPath = seoBlock?.landingPath ?? `/diagnosis/play/${definition.slug}`;
  const creatorTags = seoBlock?.desireTags ?? [];
  const baseKeywords = seoBlock
    ? [...seoBlock.desireTags, ...seoBlock.targetDemographics]
    : [definition.eyebrow, definition.title];

  return {
    diagnosisId: definition.id,
    slug: definition.slug,
    creatorTags,
    viralKeywords: buildBuilderOgKeywords(creatorTags, baseKeywords),
    landingPath,
    title: buildBuilderOgTitle(seoBlock?.titleTemplate ?? definition.title, creatorTags),
    description: buildBuilderOgDescription(
      seoBlock?.descriptionTemplate ?? definition.subtitle,
      creatorTags,
      definition.estimatedMinutes,
    ),
    ogImagePath: buildBuilderOgImageUrl(definition.slug),
  };
}

function buildSeoContext(data: UserData, locale: Locale | null): UserSeoContext {
  return mapUserDataToSeoContext(data, locale ?? data.profile.locale);
}

function applyCachedSnapshot(userId: string, cached: UserData): Partial<UserStoreState> {
  return {
    userId,
    data: cached,
    status: "ready",
    error: null,
    authErrorMessage: null,
    seoContext: buildSeoContext(cached, localeOverride),
    authStatus: userId === DEFAULT_GUEST_USER_ID ? "idle" : "authenticated",
  };
}

async function requestSessionCreation(
  userId: string,
  mode: AuthSessionMode,
  displayName?: string,
): Promise<void> {
  let response: Response;

  try {
    response = await fetch(AUTH_API_BASE_PATH, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        userId,
        mode,
        displayName,
      }),
    });
  } catch (cause) {
    throw new AuthNetworkError("セッション API への接続に失敗しました。", cause);
  }

  const rawBody = await response.text();

  if (!response.ok) {
    let message = `セッション作成に失敗しました（${response.status}）。`;

    try {
      const payload = JSON.parse(rawBody) as { error?: unknown };
      if (typeof payload.error === "string" && payload.error.trim()) {
        message = payload.error;
      }
    } catch {
      // keep default message
    }

    throw new AuthSessionCreateError(response.status, message);
  }

  let payload: unknown;

  try {
    payload = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    throw new AuthSessionCreateError(
      response.status,
      "セッション API のレスポンス JSON が不正です。",
    );
  }

  const parsed = createSessionResponseSchema.safeParse(payload);

  if (!parsed.success) {
    throw new AuthSessionCreateError(
      response.status,
      "セッション API のレスポンス形式が不正です。",
    );
  }
}

async function requestSessionDestruction(): Promise<void> {
  let response: Response;

  try {
    response = await fetch(AUTH_API_BASE_PATH, {
      method: "DELETE",
      credentials: "same-origin",
      cache: "no-store",
    });
  } catch (cause) {
    throw new AuthNetworkError("セッション解除 API への接続に失敗しました。", cause);
  }

  if (!response.ok) {
    throw new AuthSessionDestroyError(
      response.status,
      `セッション解除に失敗しました（${response.status}）。`,
    );
  }
}

export const useUserStore = create<UserStore>()(
  subscribeWithSelector((set, get) => ({
    userId: DEFAULT_GUEST_USER_ID,
    data: null,
    status: "idle",
    authStatus: "idle",
    error: null,
    authErrorMessage: null,
    seoContext: null,
    builderDiagnosisSeo: null,
    bootstrapComplete: false,

    setLocaleOverride: (locale) => {
      localeOverride = locale;
      const current = get().data;

      if (current) {
        set({
          seoContext: buildSeoContext(current, locale),
        });
      }
    },

    setBuilderDiagnosisSeo: (context) => {
      set({ builderDiagnosisSeo: context });
    },

    hydrateBuilderSeoFromDefinition: (definition) => {
      if (isBuilderDiagnosisDefinition(definition)) {
        set({ builderDiagnosisSeo: buildBuilderSeoContext(definition) });
        return;
      }

      set({
        builderDiagnosisSeo: buildPlugSeoContextFromDefinition(definition),
      });
    },

    bootstrap: async () => {
      if (bootstrapInFlight.current) {
        return bootstrapInFlight.current;
      }

      const promise = (async () => {
        const userId = readStoredUserId();
        const cached = peekFetchUserDataCache(userId);

        if (cached) {
          set({
            ...applyCachedSnapshot(userId, cached),
            bootstrapComplete: true,
          });
        } else {
          set({
            userId,
            status: "hydrating",
            bootstrapComplete: false,
          });
        }

        await get().loadUserData({ userId, forceRefresh: false });
        set({ bootstrapComplete: true });
      })().finally(() => {
        bootstrapInFlight.current = null;
      });

      bootstrapInFlight.current = promise;
      return promise;
    },

    loadUserData: async (options = {}) => {
      const userId = options.userId ?? readStoredUserId();
      const cached = options.forceRefresh ? null : peekFetchUserDataCache(userId);

      if (cached) {
        set(applyCachedSnapshot(userId, cached));
      } else if (get().status !== "hydrating") {
        set({
          userId,
          status: "hydrating",
          error: null,
        });
      }

      try {
        const data = await fetchUserData(userId, {
          forceRefresh: options.forceRefresh,
        });

        set({
          userId,
          data,
          status: "ready",
          error: null,
          authErrorMessage: null,
          seoContext: buildSeoContext(data, localeOverride),
          authStatus: userId === DEFAULT_GUEST_USER_ID ? "idle" : "authenticated",
        });
      } catch (cause) {
        set({
          userId,
          status: "error",
          error: isUserDataError(cause)
            ? cause
            : new UserDataError({
                message: toAuthErrorMessage(cause),
                code: USER_ERROR_CODES.network,
              }),
        });
      }
    },

    establishSession: async ({
      userId,
      mode = AUTH_SESSION_MODES.login,
      displayName,
    }) => {
      const inFlight = sessionEstablishInFlight.get(userId);

      if (inFlight) {
        return inFlight;
      }

      const promise = (async () => {
        set({
          authStatus: "submitting",
          authErrorMessage: null,
        });

        writeStoredUserId(userId);

        try {
          await requestSessionCreation(userId, mode, displayName);
          clearFetchUserDataCache();
          await get().loadUserData({ userId, forceRefresh: true });
          set({ authStatus: "authenticated" });
        } catch (cause) {
          set({
            authStatus: "error",
            authErrorMessage: toAuthErrorMessage(cause),
          });
          throw cause;
        }
      })().finally(() => {
        sessionEstablishInFlight.delete(userId);
      });

      sessionEstablishInFlight.set(userId, promise);
      return promise;
    },

    commitStoredIdentity: async (userId: string) => {
      const trimmed = userId.trim();

      if (!trimmed) {
        return;
      }

      const inFlight = identityCommitInFlight.get(trimmed);

      if (inFlight) {
        return inFlight;
      }

      const promise = (async () => {
        writeStoredUserId(trimmed);

        if (trimmed === DEFAULT_GUEST_USER_ID) {
          await get().loadUserData({ userId: trimmed, forceRefresh: true });
          return;
        }

        if (get().userId === trimmed && get().authStatus === "authenticated") {
          await get().loadUserData({ userId: trimmed, forceRefresh: true });
          return;
        }

        await get().establishSession({
          userId: trimmed,
          mode: AUTH_SESSION_MODES.login,
        });
      })().finally(() => {
        identityCommitInFlight.delete(trimmed);
      });

      identityCommitInFlight.set(trimmed, promise);
      return promise;
    },

    signOut: async () => {
      set({ authStatus: "submitting", authErrorMessage: null });

      try {
        await requestSessionDestruction();
      } catch (cause) {
        set({
          authStatus: "error",
          authErrorMessage: toAuthErrorMessage(cause),
        });
        throw cause;
      }

      writeStoredUserId(DEFAULT_GUEST_USER_ID);
      clearFetchUserDataCache();

      set({
        userId: DEFAULT_GUEST_USER_ID,
        authStatus: "idle",
        authErrorMessage: null,
      });

      await get().loadUserData({
        userId: DEFAULT_GUEST_USER_ID,
        forceRefresh: true,
      });
    },
  })),
);

export const selectNavProfile = (state: UserStore) => ({
  userId: state.userId,
  status: state.status,
  displayName: state.data?.profile.displayName ?? "ゲスト",
  avatarInitials: state.data?.profile.avatarInitials ?? "GU",
  appsAuthored: state.data?.activity.appsAuthored ?? 0,
});

export const selectAuthPanel = (state: UserStore) => ({
  authStatus: state.authStatus,
  authErrorMessage: state.authErrorMessage,
  userId: state.userId,
  isGuest: state.userId === DEFAULT_GUEST_USER_ID,
});
