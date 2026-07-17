import { afterEach, describe, expect, it, vi } from "vitest";
import { USER_DATA_SCHEMA_VERSION } from "@/types/user";
import {
  clearFetchUserDataCache,
  fetchUserData,
  getFetchUserDataInFlightCount,
  peekFetchUserDataCache,
} from "@/lib/user/fetchUserData";
import {
  UserDataHttpError,
  UserDataInputError,
  UserDataValidationError,
} from "@/lib/user/errors";

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

function mockFetchSuccess(): void {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({
        data: VALID_USER_DATA,
      }),
    ),
  );
}

afterEach(() => {
  clearFetchUserDataCache();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("fetchUserData", () => {
  it("rejects invalid userId before network I/O", async () => {
    mockFetchSuccess();

    await expect(fetchUserData("bad id!")).rejects.toBeInstanceOf(UserDataInputError);

    expect(fetch).not.toHaveBeenCalled();
  });

  it("deduplicates concurrent in-flight requests for the same userId", async () => {
    mockFetchSuccess();

    const first = fetchUserData("guest_user");
    const second = fetchUserData("guest_user");

    expect(getFetchUserDataInFlightCount()).toBe(1);

    const [left, right] = await Promise.all([first, second]);

    expect(left).toEqual(right);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(getFetchUserDataInFlightCount()).toBe(0);
  });

  it("serves back-to-back reads from resolved cache without duplicate fetch", async () => {
    mockFetchSuccess();

    await fetchUserData("guest_user");
    await fetchUserData("guest_user");

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(peekFetchUserDataCache("guest_user")).toEqual(VALID_USER_DATA);
  });

  it("bypasses cache when forceRefresh is true", async () => {
    mockFetchSuccess();

    await fetchUserData("guest_user");
    await fetchUserData("guest_user", { forceRefresh: true });

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("maps non-2xx responses to UserDataHttpError", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({ error: "Not found" }, { status: 404, statusText: "Not Found" }),
      ),
    );

    await expect(fetchUserData("missing_user")).rejects.toBeInstanceOf(UserDataHttpError);
  });

  it("maps malformed API payloads to UserDataValidationError", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          data: {
            ...VALID_USER_DATA,
            schemaVersion: 999,
          },
        }),
      ),
    );

    await expect(fetchUserData("guest_user")).rejects.toBeInstanceOf(
      UserDataValidationError,
    );
  });

  it("returns frozen immutable snapshots", async () => {
    mockFetchSuccess();

    const snapshot = await fetchUserData("guest_user");

    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.profile)).toBe(true);
    expect(Object.isFrozen(snapshot.activity)).toBe(true);
    expect(Object.isFrozen(snapshot.activity.recentAppIds)).toBe(true);
    expect(Object.isFrozen(snapshot.preferences)).toBe(true);
  });
});
