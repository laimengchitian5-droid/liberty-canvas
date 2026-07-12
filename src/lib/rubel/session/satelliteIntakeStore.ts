import type {
  SatelliteIntakeRecord,
  SatelliteIntakeWritePayload,
} from "@/lib/rubel/contracts/pipeline";
import { SATELLITE_INTAKE_STORAGE_KEY } from "@/lib/rubel/contracts/pipeline";

/** Browser-only session bridge: /discover → /play handoff. */

export function writeSatelliteIntake(payload: SatelliteIntakeWritePayload): void {
  if (typeof window === "undefined") {
    return;
  }

  const record: SatelliteIntakeRecord = { ...payload, source: "satellite" };

  window.sessionStorage.setItem(
    SATELLITE_INTAKE_STORAGE_KEY,
    JSON.stringify(record),
  );
}

export function peekSatelliteIntake(): SatelliteIntakeRecord | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(SATELLITE_INTAKE_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as SatelliteIntakeRecord;
    return parsed.source === "satellite" ? parsed : null;
  } catch {
    return null;
  }
}

export function consumeSatelliteIntake(
  playDiagnosisId: string,
): SatelliteIntakeRecord | null {
  const payload = peekSatelliteIntake();

  if (!payload || payload.playDiagnosisId !== playDiagnosisId) {
    return null;
  }

  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(SATELLITE_INTAKE_STORAGE_KEY);
  }

  return payload;
}
