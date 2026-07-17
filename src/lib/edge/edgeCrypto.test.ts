import { describe, expect, it } from "vitest";
import {
  CrossDomainCookieBridge,
  deserializeGameMatrixCookie,
  GAME_MATRIX_COOKIE_NAME,
  serializeGameMatrixCookie,
} from "@/lib/edge/crossDomainCookieBridge";
import {
  EdgeCryptoManager,
  decryptProfile,
  encryptProfile,
} from "@/lib/edge/edgeCrypto";
import {
  emptyUserGameProfile,
  recordGameCompletion,
} from "@/lib/gamification/userGameProfileSchema";

const SECRET = "test-secret-key-32chars-minimum!!";

describe("edgeCrypto AES-GCM profile envelope", () => {
  it("round-trips a versioned profile", async () => {
    let profile = emptyUserGameProfile();
    profile = recordGameCompletion(profile, "rubel-cat-dog-v1", "気まぐれ");

    const token = await encryptProfile(profile, SECRET);
    expect(token.length).toBeGreaterThan(20);
    expect(token).not.toContain("+");
    expect(token).not.toContain("/");

    const restored = await decryptProfile(token, SECRET);
    expect(restored.version).toBe(1);
    expect(restored.completedGames["rubel-cat-dog-v1"]?.primaryTrait).toBe(
      "気まぐれ",
    );
  });

  it("returns empty profile on tamper / wrong key (fail-closed)", async () => {
    const token = await encryptProfile(
      recordGameCompletion(emptyUserGameProfile(), "g1", "Trait"),
      SECRET,
    );

    const wrongKey = await decryptProfile(token, "different-secret-key!!");
    expect(wrongKey.completedGames).toEqual({});

    const tampered = `${token.slice(0, 8)}xxxx${token.slice(12)}`;
    const broken = await decryptProfile(tampered, SECRET);
    expect(broken.completedGames).toEqual({});
  });

  it("rejects weak secrets at encrypt time", async () => {
    await expect(
      encryptProfile(emptyUserGameProfile(), "short"),
    ).rejects.toThrow(/at least 16/);
  });

  it("EdgeCryptoManager facade matches functional API", async () => {
    const manager = new EdgeCryptoManager(SECRET);
    const profile = recordGameCompletion(
      emptyUserGameProfile(),
      "rubel-burnout-v1",
      "Ember",
    );
    const token = await manager.encryptProfile(profile);
    const restored = await manager.decryptProfile(token);
    expect(restored.completedGames["rubel-burnout-v1"]?.primaryTrait).toBe("Ember");
  });
});

describe("crossDomainCookieBridge", () => {
  it("serializes httpOnly cookie with shared Domain on apex hosts", async () => {
    const profile = recordGameCompletion(
      emptyUserGameProfile(),
      "cat-test",
      "Cat-Like",
    );

    const cookie = await serializeGameMatrixCookie(
      profile,
      "discover.liberty-canvas.app",
      { secret: SECRET, secure: true },
    );

    expect(cookie.name).toBe(GAME_MATRIX_COOKIE_NAME);
    expect(cookie.options.httpOnly).toBe(true);
    expect(cookie.options.domain).toBe(".liberty-canvas.app");
    expect(cookie.options.sameSite).toBe("lax");

    const restored = await deserializeGameMatrixCookie(cookie.value, {
      secret: SECRET,
    });
    expect(restored.completedGames["cat-test"]?.primaryTrait).toBe("Cat-Like");
  });

  it("omits Domain on vercel.app and still round-trips", async () => {
    const cookie = await serializeGameMatrixCookie(
      emptyUserGameProfile(),
      "liberty-canvas.vercel.app",
      { secret: SECRET },
    );
    expect(cookie.options.domain).toBeUndefined();

    const bridge = new CrossDomainCookieBridge(SECRET);
    const again = await bridge.serialize(emptyUserGameProfile(), "localhost");
    expect(again.options.domain).toBeUndefined();
    const empty = await bridge.deserialize(undefined);
    expect(empty.completedGames).toEqual({});
  });
});
