import { describe, expect, it } from "vitest";
import { translatePayload } from "@/lib/rubel/translatePayload";
import { JA_NEKO_DIAGNOSIS, SAMPLE_CAT_DOG_DIAGNOSIS } from "@/lib/rubel/seedDiagnoses";

describe("translatePayload", () => {
  it("returns unchanged bundle when target matches source language", () => {
    const bundle = translatePayload(SAMPLE_CAT_DOG_DIAGNOSIS, "en");

    expect(bundle.meta.wasTranslated).toBe(false);
    expect(bundle.diagnosis.title).toBe("What kind of cat are you?");
  });

  it("translates English cat diagnosis into Japanese display strings", () => {
    const bundle = translatePayload(SAMPLE_CAT_DOG_DIAGNOSIS, "ja");

    expect(bundle.meta.wasTranslated).toBe(true);
    expect(bundle.meta.sourceLanguage).toBe("en");
    expect(bundle.meta.displayLanguage).toBe("ja");
    expect(bundle.diagnosis.title).toBe("あなたはどんなネコタイプ？");
    expect(bundle.diagnosis.questions[0]?.text).toContain("週末");
    expect(bundle.diagnosis.questions[0]?.options[0]?.id).toBe("q-weekend-a");
  });

  it("translates Japanese neko diagnosis into English for global players", () => {
    const bundle = translatePayload(JA_NEKO_DIAGNOSIS, "en");

    expect(bundle.meta.wasTranslated).toBe(true);
    expect(bundle.diagnosis.title).toBe("How Cat Are You? (Neko Diagnosis)");
    expect(bundle.diagnosis.results[0]?.name).toBe("My-Pace Black Cat Type");
  });

  it("preserves scoring identifiers during translation", () => {
    const bundle = translatePayload(SAMPLE_CAT_DOG_DIAGNOSIS, "es");

    expect(bundle.diagnosis.questions[0]?.options[0]?.scoreModifier).toEqual(
      SAMPLE_CAT_DOG_DIAGNOSIS.questions[0]?.options[0]?.scoreModifier,
    );
  });
});
