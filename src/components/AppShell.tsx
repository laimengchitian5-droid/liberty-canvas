"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { PwaRegister } from "@/app/pwa-register";
import { GlobalNav } from "@/components/navigation/GlobalNav";
import { GDPRConsent } from "@/components/privacy/GDPRConsent";
import shellStyles from "@/styles/app-shell.module.css";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const immersivePlay =
    pathname?.startsWith("/play/") ||
    pathname?.startsWith("/discover/") ||
    pathname?.startsWith("/diagnosis/play/") ||
    false;

  return (
    <div className={shellStyles.appShell}>
      {!immersivePlay ? <GlobalNav /> : null}
      <div
        className={
          immersivePlay ? shellStyles.appMainImmersive : shellStyles.appMain
        }
      >
        {children}
      </div>
      <GDPRConsent />
      <PwaRegister />
    </div>
  );
}
