import { createTraceId } from "@/lib/observability/traceContext";

export type ObservabilityLevel = "info" | "warn" | "error";

export interface StructuredLogEntry {
  level: ObservabilityLevel;
  message: string;
  traceId?: string;
  context?: Record<string, string | number | boolean | null | undefined>;
}

export function isObservabilityEnabled(): boolean {
  return process.env.LC_OBSERVABILITY_ENABLED !== "false";
}

export function logStructured(entry: StructuredLogEntry): void {
  if (!isObservabilityEnabled()) {
    return;
  }

  const payload = {
    ...entry,
    at: new Date().toISOString(),
    service: "libertycanvas",
  };

  if (entry.level === "error") {
    console.error(JSON.stringify(payload));
    return;
  }

  if (entry.level === "warn") {
    console.warn(JSON.stringify(payload));
    return;
  }

  console.log(JSON.stringify(payload));
}

export function withTraceId<T extends Record<string, unknown>>(
  payload: T,
  traceId = createTraceId(),
): T & { traceId: string } {
  return { ...payload, traceId };
}
