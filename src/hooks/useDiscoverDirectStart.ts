"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { readDiagnosisRef } from "@/lib/diagnosis/diagnosisSession";
import {
  isDiscoverDirectMode,
  isDiscoverFunnelRef,
} from "@/lib/landing/discoverFunnel";

const DIRECT_START_DELAY_MS = 450;

/** Auto-starts intro when Discover skip-CTA sets mode=direct + discover ref. */
export function useDiscoverDirectStart(
  phase: string,
  onStart: () => void,
): void {
  const searchParams = useSearchParams();
  const startedRef = useRef(false);

  useEffect(() => {
    if (phase !== "intro" || startedRef.current) {
      return;
    }

    if (!isDiscoverDirectMode(searchParams.get("mode"))) {
      return;
    }

    if (!isDiscoverFunnelRef(readDiagnosisRef())) {
      return;
    }

    startedRef.current = true;
    const timer = window.setTimeout(onStart, DIRECT_START_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [onStart, phase, searchParams]);
}
