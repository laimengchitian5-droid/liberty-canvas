import { describe, expect, it } from "vitest";
import { buildQuickCompilerDiagnosis } from "@/lib/rubel/buildQuickCompilerDiagnosis";
import { getPersonaPresetById } from "@/lib/rubel/personaPresets";

describe("buildQuickCompilerDiagnosis", () => {
  it("maps persona preset to structured aiConfig", () => {
    const diagnosis = buildQuickCompilerDiagnosis({
      title: "Am I a Workaholic?",
      creatorName: "@test_user",
      language: "en",
      questionText: "On Sunday night you feel…",
      optionAText: "Anxious about Monday",
      optionBText: "Excited for the week",
      personaPresetId: "tsundere-boss",
    });

    const preset = getPersonaPresetById("tsundere-boss");

    expect(diagnosis.questions).toHaveLength(1);
    expect(diagnosis.questions[0]?.options).toHaveLength(2);
    expect(diagnosis.creatorName).toBe("@test_user");
    expect(diagnosis.results[0]?.name).toBe("Tsundere Boss");
    expect(diagnosis.results[0]?.aiConfig).toEqual(preset?.aiConfig);
    expect(diagnosis.personaPresetId).toBe("tsundere-boss");
  });
});
