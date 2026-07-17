"use client";

import { BrandNavLink } from "@/components/brand/BrandNavLink";
import type { BrandId } from "@/lib/brand/registry";
import { getBrand } from "@/lib/brand/registry";
import { BrandMark } from "@/components/brand/BrandMark";
import { cn } from "@/lib/utils/cn";
import styles from "./BrandWordmark.module.css";

interface BrandWordmarkProps {
  brandId: BrandId;
  locale?: "ja" | "en";
  href?: string;
  compact?: boolean;
  className?: string;
}

const BrandWordmark = ({
  brandId,
  locale = "ja",
  href,
  compact = false,
  className,
}: BrandWordmarkProps) => {
  const brand = getBrand(brandId);
  const label = locale === "ja" ? brand.nameJa : brand.name;
  const markSize = compact ? "sm" : "md";

  const content = (
    <>
      <BrandMark brandId={brandId} size={markSize} />
      {!compact ? (
        <span className={styles.label}>{label}</span>
      ) : (
        <span className={styles.labelCompact}>{brand.shortName}</span>
      )}
    </>
  );

  if (href) {
    return (
      <BrandNavLink
        href={href}
        className={cn(styles.wordmark, className)}
        aria-label={`${label} ホーム`}
      >
        {content}
      </BrandNavLink>
    );
  }

  return (
    <span className={cn(styles.wordmark, className)} role="group" aria-label={label}>
      {content}
    </span>
  );
};

export { BrandWordmark };
