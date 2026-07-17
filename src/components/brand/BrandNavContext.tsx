"use client";

import { createContext, useContext, type ReactNode } from "react";

interface BrandNavContextValue {
  navigateWithBridge: (href: string) => void;
}

const BrandNavContext = createContext<BrandNavContextValue | null>(null);

export function BrandNavProvider({
  navigateWithBridge,
  children,
}: BrandNavContextValue & { children: ReactNode }) {
  return (
    <BrandNavContext.Provider value={{ navigateWithBridge }}>
      {children}
    </BrandNavContext.Provider>
  );
}

export function useBrandNav(): BrandNavContextValue {
  const ctx = useContext(BrandNavContext);
  if (!ctx) {
    return {
      navigateWithBridge: (href: string) => {
        window.location.assign(href);
      },
    };
  }
  return ctx;
}
