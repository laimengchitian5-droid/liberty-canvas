"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandBridgeModal } from "@/components/brand/BrandBridgeModal";
import { BRIDGE_DISMISS_KEY } from "@/lib/brand/bridgeRoutes";
import type { BrandId } from "@/lib/brand/registry";
import { requiresBridgeModal, resolveBrandId } from "@/lib/brand/resolveBrand";

interface PendingBridge {
  fromBrandId: BrandId;
  toBrandId: BrandId;
  targetHref: string;
}

/**
 * Intercepts cross-theme navigation and surfaces an interstitial bridge modal
 * when switching between Adult-Cute shell and immersive sub-brands.
 */
export function useBrandBridge() {
  const pathname = usePathname();
  const router = useRouter();
  const prevBrandRef = useRef<BrandId>(resolveBrandId(pathname));
  const [pending, setPending] = useState<PendingBridge | null>(null);

  const navigateWithBridge = useCallback(
    (targetHref: string) => {
      const fromBrandId = resolveBrandId(pathname);
      const toBrandId = resolveBrandId(targetHref);
      const dismissed =
        typeof window !== "undefined" &&
        sessionStorage.getItem(BRIDGE_DISMISS_KEY) === "1";

      if (!dismissed && requiresBridgeModal(fromBrandId, toBrandId)) {
        setPending({ fromBrandId, toBrandId, targetHref });
        return;
      }
      router.push(targetHref);
    },
    [pathname, router],
  );

  const confirmBridge = useCallback(() => {
    if (!pending) {
      return;
    }
    const href = pending.targetHref;
    setPending(null);
    router.push(href);
  }, [pending, router]);

  useEffect(() => {
    prevBrandRef.current = resolveBrandId(pathname);
  }, [pathname]);

  const BridgePortal = pending ? (
    <BrandBridgeModal
      fromBrandId={pending.fromBrandId}
      toBrandId={pending.toBrandId}
      targetHref={pending.targetHref}
      open
      onClose={() => setPending(null)}
      onConfirm={confirmBridge}
    />
  ) : null;

  return { navigateWithBridge, BridgePortal };
}
