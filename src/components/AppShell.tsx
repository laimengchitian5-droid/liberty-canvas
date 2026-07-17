"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { PwaRegister } from "@/app/pwa-register";
import { BrandMegaMenu } from "@/components/brand/BrandMegaMenu";
import { BrandWordmark } from "@/components/brand/BrandWordmark";
import { GlobalNav } from "@/components/navigation/GlobalNav";
import { ImmersiveBackToTerminal } from "@/components/navigation/ImmersiveBackToTerminal";
import { GDPRConsent } from "@/components/privacy/GDPRConsent";
import { BrandNavProvider } from "@/components/brand/BrandNavContext";
import { useBrandBridge } from "@/hooks/useBrandBridge";
import { isImmersiveBrand, resolveBrandId } from "@/lib/brand/resolveBrand";
import { resolveBrandPath } from "@/lib/brand/urlResolver";
import shellStyles from "@/styles/app-shell.module.css";
import immersiveStyles from "@/styles/immersive-brand-bar.module.css";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const brandId = resolveBrandId(pathname);
  const immersive = isImmersiveBrand(brandId);
  const { navigateWithBridge, BridgePortal } = useBrandBridge();
  const brandHome = resolveBrandPath(brandId, "hub");
  /** Station family owns StationGlobalHeader — avoid stacking GlobalNav. */
  const isStationRoute = Boolean(pathname?.startsWith("/station"));
  const showGlobalNav = !immersive && !isStationRoute;

  return (
    <BrandNavProvider navigateWithBridge={navigateWithBridge}>
      <div className={shellStyles.appShell}>
        {showGlobalNav ? <GlobalNav /> : null}
        {immersive ? (
          <>
            <header className={immersiveStyles.bar} aria-label={`${brandId} navigation`}>
              <BrandWordmark brandId={brandId} locale="ja" href={brandHome} compact />
              <div className={immersiveStyles.actions}>
                <BrandMegaMenu currentPath={pathname ?? "/"} />
              </div>
            </header>
            {/* Fixed corner escape — outside bar so game chrome stays uncluttered */}
            <ImmersiveBackToTerminal />
          </>
        ) : null}
        <div className={immersive ? shellStyles.appMainImmersive : shellStyles.appMain}>
          {children}
        </div>
        {BridgePortal}
        <GDPRConsent />
        <PwaRegister />
      </div>
    </BrandNavProvider>
  );
}
