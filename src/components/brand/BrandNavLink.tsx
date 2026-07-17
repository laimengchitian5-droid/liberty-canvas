"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from "react";
import { useBrandNav } from "@/components/brand/BrandNavContext";

type BrandNavLinkProps = Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href" | "onClick"
> & {
  href: string;
  children: ReactNode;
  onNavigate?: () => void;
};

/**
 * Declarative navigation guard — single interception point for cross-theme bridges.
 * Prefer this over raw <Link> in shell chrome (GlobalNav tabs, wordmarks).
 */
const BrandNavLink = ({ href, children, onNavigate, ...rest }: BrandNavLinkProps) => {
  const { navigateWithBridge } = useBrandNav();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    onNavigate?.();
    navigateWithBridge(href);
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
};

export { BrandNavLink };
