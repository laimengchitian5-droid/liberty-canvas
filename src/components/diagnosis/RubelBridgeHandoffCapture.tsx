"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { trackDiagnosisEvent } from "@/lib/diagnosis/analytics";
import {
  clearRubelBridgeHandoff,
  readRubelBridgeHandoff,
} from "@/lib/rubel/rubelBridgeHandoff";

export function RubelBridgeHandoffCapture() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : null;

  useEffect(() => {
    if (!slug) {
      return;
    }

    const handoff = readRubelBridgeHandoff();

    if (!handoff || handoff.slug !== slug) {
      return;
    }

    trackDiagnosisEvent("rubel_bridge_handoff_received", {
      slug,
      ref: "rubel-bridge",
      rubelDiagnosisId: handoff.rubelDiagnosisId,
      funnelStep: "discover_ref",
    });

    clearRubelBridgeHandoff();
  }, [slug]);

  return null;
}
