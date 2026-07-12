"use client";

import { useEffect, useRef } from "react";
import type { Diagnosis, PlayOutcome } from "@/types/rubel";
import { projectOutcomeToEnginePayload } from "@/lib/rubel/pipeline/projectOutcome";
import { satelliteIntakeToOutcome } from "@/lib/rubel/pipeline/satelliteIntake";
import { consumeSatelliteIntake } from "@/lib/rubel/session/satelliteIntakeStore";
import type { RubelEnginePayload } from "@/lib/rubel/contracts/pipeline";

interface UseSatelliteHandoffOptions {
  diagnosis: Diagnosis;
  onComplete: (outcome: PlayOutcome, enginePayload: RubelEnginePayload) => void;
}

/**
 * Consumes satellite session handoff once on mount.
 * Keeps RubelPlayCore free of satellite import paths.
 */
export function useSatelliteHandoff({
  diagnosis,
  onComplete,
}: UseSatelliteHandoffOptions): void {
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) {
      return;
    }

    const intake = consumeSatelliteIntake(diagnosis.id);

    if (!intake) {
      return;
    }

    handledRef.current = true;
    const outcome = satelliteIntakeToOutcome(diagnosis, intake);
    const enginePayload = projectOutcomeToEnginePayload(diagnosis, outcome, {
      intakeSource: "satellite",
      keyword: intake.keyword,
    });
    onComplete(outcome, enginePayload);
  }, [diagnosis, onComplete]);
}
