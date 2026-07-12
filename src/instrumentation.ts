import { logStructured } from "@/lib/observability/observabilityPort";

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    logStructured({
      level: "info",
      message: "LibertyCanvas instrumentation registered",
      context: {
        nodeEnv: process.env.NODE_ENV ?? "unknown",
        observability: process.env.LC_OBSERVABILITY_ENABLED ?? "default-on",
      },
    });
  }
}
