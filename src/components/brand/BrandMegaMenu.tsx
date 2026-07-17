"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/brand/BrandMark";
import { useBrandNav } from "@/components/brand/BrandNavContext";
import { buildBrandNavEntries } from "@/lib/brand/bridgeRoutes";
import { LC_DESIGN_TOKENS } from "@/lib/design/tokens";
import a11y from "@/styles/accessibility.module.css";
import styles from "./BrandMegaMenu.module.css";

interface BrandMegaMenuProps {
  currentPath: string;
}

const spring = {
  type: "spring" as const,
  stiffness: LC_DESIGN_TOKENS.motion.springStiffness,
  damping: LC_DESIGN_TOKENS.motion.springDamping,
};

const BrandMegaMenu = ({ currentPath }: BrandMegaMenuProps) => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const entries = buildBrandNavEntries();
  const { navigateWithBridge } = useBrandNav();

  const close = useCallback(() => setOpen(false), []);

  const handleNavigate = useCallback(
    (href: string) => {
      close();
      navigateWithBridge(href);
    },
    [close, navigateWithBridge],
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    const onPointer = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [close, open]);

  return (
    <div className={styles.wrap} ref={panelRef}>
      <button
        type="button"
        className={`${styles.trigger} ${a11y.touchTargetInline} ${a11y.focusRing}`}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="brand-mega-panel"
        onClick={() => setOpen((prev) => !prev)}
      >
        サービス
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            id="brand-mega-panel"
            className={styles.panel}
            role="group"
            aria-label="Liberty Canvas サービス一覧"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={spring}
          >
            <ul className={styles.list}>
              {entries.map((entry) => {
                const isActive =
                  currentPath === entry.href || currentPath.startsWith(`${entry.href}/`);
                return (
                  <li key={entry.brandId}>
                    <button
                      type="button"
                      className={`${styles.item} ${isActive ? styles.itemActive : ""} ${a11y.focusRing}`}
                      onClick={() => handleNavigate(entry.href)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <BrandMark brandId={entry.brandId} size="sm" />
                      <span className={styles.itemLabel}>{entry.labelJa}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export { BrandMegaMenu };
