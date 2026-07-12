/**
 * @deprecated Import from @/lib/satellite or @/lib/rubel/pipeline instead.
 */
export type { SatelliteIntakeRecord as LandingIntakePayload } from "@/lib/rubel/contracts/pipeline";
export { SATELLITE_INTAKE_STORAGE_KEY as LANDING_INTAKE_STORAGE_KEY } from "@/lib/rubel/contracts/pipeline";

export {
  writeSatelliteIntake as writeLandingIntake,
  peekSatelliteIntake as peekLandingIntake,
  consumeSatelliteIntake as consumeLandingIntake,
} from "@/lib/rubel/session/satelliteIntakeStore";

export {
  satelliteIntakeToOutcome as buildLandingIntakeOutcome,
  buildPlayRoute as buildPlayRedirectPath,
} from "@/lib/rubel/pipeline/satelliteIntake";
