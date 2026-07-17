"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BrandMark } from "@/components/brand/BrandMark";
import { BRIDGE_DISMISS_KEY } from "@/lib/brand/bridgeRoutes";
import type { BrandId } from "@/lib/brand/registry";
import { getBrand } from "@/lib/brand/registry";
import { LC_DESIGN_TOKENS } from "@/lib/design/tokens";
import a11y from "@/styles/accessibility.module.css";
import styles from "./BrandBridgeModal.module.css";

interface BrandBridgeModalProps {
  fromBrandId: BrandId;
  toBrandId: BrandId;
  targetHref: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const spring = {
  type: "spring" as const,
  stiffness: LC_DESIGN_TOKENS.motion.springStiffness,
  damping: LC_DESIGN_TOKENS.motion.springDamping,
};

const BrandBridgeModal = ({
  fromBrandId,
  toBrandId,
  targetHref,
  open,
  onClose,
  onConfirm,
}: BrandBridgeModalProps) => {
  const [dismissFuture, setDismissFuture] = useState(false);
  const fromBrand = getBrand(fromBrandId);
  const toBrand = getBrand(toBrandId);

  useEffect(() => {
    if (!open) {
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleConfirm = useCallback(() => {
    if (dismissFuture && typeof window !== "undefined") {
      sessionStorage.setItem(BRIDGE_DISMISS_KEY, "1");
    }
    onConfirm();
  }, [dismissFuture, onConfirm]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="presentation"
          onClick={onClose}
        >
          <motion.div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="brand-bridge-title"
            aria-describedby="brand-bridge-desc"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={spring}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.brandRow} role="group" aria-label="ブランド遷移">
              <BrandMark brandId={fromBrandId} size="md" />
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
              <BrandMark brandId={toBrandId} size="md" />
            </div>
            <h2 id="brand-bridge-title" className={styles.title}>
              {toBrand.nameJa} へ移動します
            </h2>
            <p id="brand-bridge-desc" className={styles.desc}>
              {fromBrand.nameJa} から {toBrand.nameJa}（{toBrand.taglineJa}
              ）へ切り替わります。 別の体験に移動します。進行中の回答は引き継がれません。
            </p>
            <label className={styles.dismissLabel}>
              <input
                type="checkbox"
                checked={dismissFuture}
                onChange={(event) => setDismissFuture(event.target.checked)}
              />
              このセッションでは次回から表示しない
            </label>
            <div className={styles.actions}>
              <button
                type="button"
                className={`${styles.cancelBtn} ${a11y.touchTargetInline} ${a11y.focusRing}`}
                onClick={onClose}
              >
                キャンセル
              </button>
              <Link
                href={targetHref}
                className={`${styles.confirmBtn} ${a11y.touchTargetInline} ${a11y.focusRing}`}
                onClick={handleConfirm}
              >
                移動する
              </Link>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export { BrandBridgeModal };
