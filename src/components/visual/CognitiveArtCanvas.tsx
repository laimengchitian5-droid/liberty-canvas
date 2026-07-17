"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import {
  ADULT_CUTE_ART_PALETTE,
  intensityFromVector,
  toCognitiveArtVector,
  type CognitiveArtPalette,
} from "@/lib/visual/cognitiveArt";
import styles from "./CognitiveArtCanvas.module.css";

export interface CognitiveArtCanvasProps {
  readonly vector: readonly number[];
  readonly intensity?: number;
  readonly seed?: string;
  readonly palette?: CognitiveArtPalette;
  readonly label?: string;
  readonly className?: string;
}

export const CognitiveArtCanvas = ({
  vector,
  intensity,
  seed = "liberty",
  palette = ADULT_CUTE_ART_PALETTE,
  label = "心の色アート",
  className,
}: CognitiveArtCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleId = useId();
  const vectorKey = vector.join(",");
  const axes = useMemo(
    () => toCognitiveArtVector(vector, seed),
    // vectorKey captures contents when parent passes a fresh array reference
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional content key
    [seed, vectorKey],
  );
  const resolvedIntensity = intensity ?? intensityFromVector(axes);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const cssSize = 600;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = cssSize * dpr;
    canvas.height = cssSize * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const centerX = cssSize / 2;
    const centerY = cssSize / 2;
    const baseRadius = 110 + resolvedIntensity * 0.55;
    const points: Array<{ x: number; y: number }> = [];

    ctx.fillStyle = palette.background;
    ctx.fillRect(0, 0, cssSize, cssSize);

    for (let i = 0; i < 8; i += 1) {
      const answerValue = axes[i] ?? 4;
      const magnitude = (answerValue / 7) * 85;
      const angle = (i * 2 * Math.PI) / 8 - Math.PI / 2;
      const r = baseRadius + magnitude;
      points.push({
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
      });
    }

    const iterations = 28 + Math.floor(resolvedIntensity / 5);
    ctx.lineWidth = 0.85;

    for (let j = 0; j < iterations; j += 1) {
      ctx.beginPath();
      const shiftX = Math.sin(j * 0.12 + resolvedIntensity * 0.02) * (j * 0.28);
      const shiftY = Math.cos(j * 0.11 + (axes[0] ?? 4)) * (j * 0.28);
      const first = points[0]!;
      ctx.moveTo(first.x + shiftX, first.y + shiftY);

      for (let i = 1; i < points.length; i += 1) {
        const point = points[i]!;
        const cpX = centerX + Math.sin(j * 0.04) * 36;
        const cpY = centerY + Math.cos(j * 0.04) * 36;
        ctx.quadraticCurveTo(cpX, cpY, point.x + shiftX, point.y + shiftY);
      }

      ctx.closePath();

      const t = j / iterations;
      const roseMix = Math.round(180 + t * 40);
      const alpha = 0.08 + t * 0.22;
      if (t < 0.45) {
        ctx.strokeStyle = `rgba(201, 160, 154, ${alpha})`;
      } else if (t < 0.75) {
        ctx.strokeStyle = `rgba(156, 175, 136, ${alpha})`;
      } else {
        ctx.strokeStyle = `rgba(${roseMix}, 169, 98, ${alpha})`;
      }
      ctx.stroke();
    }

    const glow = ctx.createRadialGradient(centerX, centerY, 8, centerX, centerY, 90);
    glow.addColorStop(0, "rgba(255, 252, 247, 0.85)");
    glow.addColorStop(0.35, "rgba(201, 160, 154, 0.28)");
    glow.addColorStop(1, "rgba(250, 249, 246, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 90, 0, Math.PI * 2);
    ctx.fill();
  }, [axes, palette.background, resolvedIntensity]);

  return (
    <figure className={className ? `${styles.figure} ${className}` : styles.figure}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        role="img"
        aria-labelledby={titleId}
      />
      <figcaption id={titleId} className={styles.caption}>
        {label}
      </figcaption>
    </figure>
  );
};
