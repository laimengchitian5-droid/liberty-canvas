"use client";

import Image from "next/image";
import type { BrandId } from "@/lib/brand/registry";
import { getBrand } from "@/lib/brand/registry";
import { cn } from "@/lib/utils/cn";
import styles from "./BrandMark.module.css";

type BrandMarkSize = "sm" | "md" | "lg";

interface BrandMarkProps {
  brandId: BrandId;
  size?: BrandMarkSize;
  className?: string;
  priority?: boolean;
}

const SIZE_PX: Record<BrandMarkSize, number> = {
  sm: 24,
  md: 32,
  lg: 44,
};

const BrandMark = ({
  brandId,
  size = "md",
  className,
  priority = false,
}: BrandMarkProps) => {
  const brand = getBrand(brandId);
  const px = SIZE_PX[size];

  return (
    <span
      className={cn(styles.markWrap, className)}
      style={{ "--brand-accent": brand.accentColor } as React.CSSProperties}
    >
      <Image
        src={brand.iconPath}
        alt=""
        width={px}
        height={px}
        className={styles.markImg}
        priority={priority}
        aria-hidden="true"
      />
    </span>
  );
};

export { BrandMark };
