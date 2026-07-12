import { describe, expect, it, vi, afterEach } from "vitest";
import { USER_DATA_SCHEMA_VERSION } from "@/types/user";
import { useUserStore } from "@/store/userStore";

const VALID_USER_DATA = {
  profile: {
    userId: "guest_user",
    displayName: "ゲストユーザー",
    avatarInitials: "ゲス",
    locale: "ja" as const,
    memberSince: "2024-01-01T00:00:00.000Z",
  },
  activity: {
    appsAuthored: 0,
    recentAppIds: [],
    lastActiveAt: null,
  },
  preferences: {
    activePersona: "neutral-assistant",
    localePreference: "ja" as const,
  },
  fetchedAt: "2024-06-01T12:00:00.000Z",
  schemaVersion: USER_DATA_SCHEMA_VERSION,
};

function resetStore() {
  useUserStore.setState({
    userId: "guest_user",
    data: null,
    status: "idle",
    authStatus: "idle",
    error: null,
    authErrorMessage: null,
    seoContext: null,
    builderDiagnosisSeo: null,
    bootstrapComplete: false,
  });
}

afterEach(() => {
  resetStore();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("userStore", () => {
  it("deduplicates concurrent establishSession calls", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            userId: "creator_01",
            expiresAt: "2099-01-01T00:00:00.000Z",
            mode: "login",
          }),
          { status: 201 },
        ),
      )
      .mockResolvedValue(
        new Response(JSON.stringify({ data: VALID_USER_DATA }), {
          status: 200,
        }),
      );

    vi.stubGlobal("fetch", fetchMock);

    const first = useUserStore
      .getState()
      .establishSession({ userId: "creator_01", mode: "login" });
    const second = useUserStore
      .getState()
      .establishSession({ userId: "creator_01", mode: "login" });

    await Promise.all([first, second]);

    const sessionPosts = fetchMock.mock.calls.filter(
      ([, init]) => init?.method === "POST",
    );

    expect(sessionPosts).toHaveLength(1);
  });

  it("deduplicates concurrent commitStoredIdentity calls", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? "GET";

      if (url.includes("/api/auth/session") && method === "POST") {
        return new Response(
          JSON.stringify({
            userId: "creator_01",
            expiresAt: "2099-01-01T00:00:00.000Z",
            mode: "login",
          }),
          { status: 201 },
        );
      }

      return new Response(JSON.stringify({ data: VALID_USER_DATA }), {
        status: 200,
      });
    });

    vi.stubGlobal("fetch", fetchMock);

    const first = useUserStore.getState().commitStoredIdentity("creator_01");
    const second = useUserStore.getState().commitStoredIdentity("creator_01");

    await Promise.all([first, second]);

    const sessionPosts = fetchMock.mock.calls.filter(
      ([, requestInit]) => requestInit?.method === "POST",
    );

    expect(sessionPosts).toHaveLength(1);
  });
});
