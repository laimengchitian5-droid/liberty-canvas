import { z } from "zod";
import { DIAGNOSTIC_PLATFORM_IDS } from "@/types/diagnosticStation";

export const stationGatePassSchema = z
  .object({
    platformId: z.enum(DIAGNOSTIC_PLATFORM_IDS),
    visitType: z.enum(["external", "internal"]),
  })
  .strict();

export type StationGatePassRequest = z.infer<typeof stationGatePassSchema>;
